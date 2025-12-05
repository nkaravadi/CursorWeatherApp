"""
FastAPI application main module.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.config import settings
from app.models import (
    CurrentWeatherResponse,
    ForecastResponse,
    CitySearchResponse,
    ErrorResponse,
)
from app.services import weather_service

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Weather Dashboard API - Get current weather and forecasts",
    lifespan=lifespan,
)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get(
    "/api/weather/{city}",
    response_model=CurrentWeatherResponse,
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 429: {"model": ErrorResponse}},
    tags=["Weather"],
)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def get_current_weather(request: Request, city: str):
    """
    Get current weather for a city.
    
    Args:
        city: City name (e.g., "London", "New York")
        
    Returns:
        CurrentWeatherResponse with current weather data
    """
    try:
        weather_data = await weather_service.get_current_weather(city)
        return weather_data
    except ValueError as e:
        logger.warning(f"Error fetching weather for {city}: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get(
    "/api/weather/{city}/forecast",
    response_model=ForecastResponse,
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 429: {"model": ErrorResponse}},
    tags=["Weather"],
)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def get_forecast(request: Request, city: str):
    """
    Get 5-day weather forecast for a city.
    
    Args:
        city: City name (e.g., "London", "New York")
        
    Returns:
        ForecastResponse with 5-day forecast data
    """
    try:
        forecast_data = await weather_service.get_forecast(city)
        return forecast_data
    except ValueError as e:
        logger.warning(f"Error fetching forecast for {city}: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get(
    "/api/cities/search",
    response_model=CitySearchResponse,
    responses={400: {"model": ErrorResponse}, 429: {"model": ErrorResponse}},
    tags=["Cities"],
)
@limiter.limit(f"{settings.RATE_LIMIT_PER_MINUTE}/minute")
async def search_cities(request: Request, q: str = Query(..., min_length=1, description="City name search query")):
    """
    Search for cities by name.
    
    Args:
        q: Search query (city name)
        
    Returns:
        CitySearchResponse with matching cities
    """
    try:
        search_results = await weather_service.search_cities(q)
        return search_results
    except ValueError as e:
        logger.warning(f"Error searching cities: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

