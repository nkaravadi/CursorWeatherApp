"""
Service layer for interacting with OpenWeatherMap API.
"""
import logging
from typing import Optional
from datetime import datetime, timedelta
import httpx
from app.config import settings
from app.models import (
    CurrentWeatherResponse,
    ForecastResponse,
    ForecastItem,
    CitySearchResult,
    CitySearchResponse,
)

logger = logging.getLogger(__name__)


class WeatherService:
    """Service for fetching weather data from OpenWeatherMap API."""
    
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = settings.OPENWEATHER_BASE_URL
        self.timeout = 10.0
    
    async def get_current_weather(self, city: str) -> CurrentWeatherResponse:
        """
        Fetch current weather data for a city.
        
        Args:
            city: City name
            
        Returns:
            CurrentWeatherResponse with weather data
            
        Raises:
            httpx.HTTPStatusError: If API request fails
        """
        url = f"{self.base_url}/weather"
        params = {
            "q": city,
            "appid": self.api_key,
            "units": "metric"  # Use metric units (Celsius)
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                logger.info(f"Successfully fetched weather for {city}")
                
                return CurrentWeatherResponse(
                    city_name=data["name"],
                    country=data["sys"]["country"],
                    temperature=data["main"]["temp"],
                    feels_like=data["main"]["feels_like"],
                    description=data["weather"][0]["description"],
                    icon=data["weather"][0]["icon"],
                    humidity=data["main"]["humidity"],
                    wind_speed=data["wind"]["speed"],
                    pressure=data["main"]["pressure"],
                    temp_min=data["main"]["temp_min"],
                    temp_max=data["main"]["temp_max"],
                )
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    logger.warning(f"City not found: {city}")
                    raise ValueError(f"City '{city}' not found. Please check the city name.")
                elif e.response.status_code == 401:
                    logger.error("Invalid API key")
                    raise ValueError("Invalid API key. Please check your OpenWeatherMap API key.")
                else:
                    logger.error(f"API error: {e.response.status_code}")
                    raise ValueError(f"Failed to fetch weather data: {e.response.status_code}")
            except httpx.TimeoutException:
                logger.error(f"Timeout while fetching weather for {city}")
                raise ValueError("Request timeout. Please try again later.")
            except Exception as e:
                logger.error(f"Unexpected error: {str(e)}")
                raise ValueError(f"An unexpected error occurred: {str(e)}")
    
    async def get_forecast(self, city: str) -> ForecastResponse:
        """
        Fetch 5-day weather forecast for a city.
        
        Args:
            city: City name
            
        Returns:
            ForecastResponse with 5-day forecast data
            
        Raises:
            httpx.HTTPStatusError: If API request fails
        """
        url = f"{self.base_url}/forecast"
        params = {
            "q": city,
            "appid": self.api_key,
            "units": "metric"
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                logger.info(f"Successfully fetched forecast for {city}")
                
                # Group forecast items by day and get daily min/max
                forecast_by_date = {}
                
                for item in data["list"]:
                    date_str = datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d")
                    day_of_week = datetime.fromtimestamp(item["dt"]).strftime("%A")
                    
                    if date_str not in forecast_by_date:
                        forecast_by_date[date_str] = {
                            "day_of_week": day_of_week,
                            "temps": [],
                            "descriptions": [],
                            "icons": [],
                            "humidities": [],
                            "wind_speeds": [],
                        }
                    
                    forecast_by_date[date_str]["temps"].append(item["main"]["temp"])
                    forecast_by_date[date_str]["descriptions"].append(item["weather"][0]["description"])
                    forecast_by_date[date_str]["icons"].append(item["weather"][0]["icon"])
                    forecast_by_date[date_str]["humidities"].append(item["main"]["humidity"])
                    forecast_by_date[date_str]["wind_speeds"].append(item["wind"]["speed"])
                
                # Create forecast items (limit to 5 days)
                forecast_items = []
                sorted_dates = sorted(forecast_by_date.keys())[:5]
                
                for date_str in sorted_dates:
                    day_data = forecast_by_date[date_str]
                    # Use most common description and icon for the day
                    most_common_icon = max(set(day_data["icons"]), key=day_data["icons"].count)
                    most_common_desc = max(set(day_data["descriptions"]), key=day_data["descriptions"].count)
                    
                    forecast_items.append(ForecastItem(
                        date=date_str,
                        day_of_week=day_data["day_of_week"],
                        temp_min=min(day_data["temps"]),
                        temp_max=max(day_data["temps"]),
                        description=most_common_desc,
                        icon=most_common_icon,
                        humidity=int(sum(day_data["humidities"]) / len(day_data["humidities"])),
                        wind_speed=sum(day_data["wind_speeds"]) / len(day_data["wind_speeds"]),
                    ))
                
                return ForecastResponse(
                    city_name=data["city"]["name"],
                    country=data["city"]["country"],
                    forecast=forecast_items,
                )
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    logger.warning(f"City not found: {city}")
                    raise ValueError(f"City '{city}' not found. Please check the city name.")
                elif e.response.status_code == 401:
                    logger.error("Invalid API key")
                    raise ValueError("Invalid API key. Please check your OpenWeatherMap API key.")
                else:
                    logger.error(f"API error: {e.response.status_code}")
                    raise ValueError(f"Failed to fetch forecast data: {e.response.status_code}")
            except httpx.TimeoutException:
                logger.error(f"Timeout while fetching forecast for {city}")
                raise ValueError("Request timeout. Please try again later.")
            except Exception as e:
                logger.error(f"Unexpected error: {str(e)}")
                raise ValueError(f"An unexpected error occurred: {str(e)}")
    
    async def search_cities(self, query: str, limit: int = 5) -> CitySearchResponse:
        """
        Search for cities by name using OpenWeatherMap Geocoding API.
        
        Args:
            query: Search query (city name)
            limit: Maximum number of results to return
            
        Returns:
            CitySearchResponse with matching cities
        """
        url = "https://api.openweathermap.org/geo/1.0/direct"
        params = {
            "q": query,
            "limit": limit,
            "appid": self.api_key,
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                logger.info(f"Found {len(data)} cities matching '{query}'")
                
                results = [
                    CitySearchResult(
                        name=item["name"],
                        country=item.get("country", ""),
                        state=item.get("state"),
                        lat=item["lat"],
                        lon=item["lon"],
                    )
                    for item in data
                ]
                
                return CitySearchResponse(results=results)
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 401:
                    logger.error("Invalid API key")
                    raise ValueError("Invalid API key. Please check your OpenWeatherMap API key.")
                else:
                    logger.error(f"API error: {e.response.status_code}")
                    raise ValueError(f"Failed to search cities: {e.response.status_code}")
            except httpx.TimeoutException:
                logger.error(f"Timeout while searching cities")
                raise ValueError("Request timeout. Please try again later.")
            except Exception as e:
                logger.error(f"Unexpected error: {str(e)}")
                raise ValueError(f"An unexpected error occurred: {str(e)}")


# Global service instance
weather_service = WeatherService()

