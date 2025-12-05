"""
Pydantic models for request/response validation and data structures.
"""
from typing import Optional
from pydantic import BaseModel, Field


class WeatherCondition(BaseModel):
    """Weather condition details."""
    main: str
    description: str
    icon: str


class MainWeatherData(BaseModel):
    """Main weather data including temperature, pressure, humidity."""
    temp: float
    feels_like: float
    temp_min: float
    temp_max: float
    pressure: int
    humidity: int


class WindData(BaseModel):
    """Wind information."""
    speed: float
    deg: Optional[int] = None


class SysData(BaseModel):
    """System data including country code."""
    country: str
    sunrise: Optional[int] = None
    sunset: Optional[int] = None


class CurrentWeatherResponse(BaseModel):
    """Response model for current weather data."""
    city_name: str
    country: str
    temperature: float
    feels_like: float
    description: str
    icon: str
    humidity: int
    wind_speed: float
    pressure: int
    temp_min: float
    temp_max: float


class ForecastItem(BaseModel):
    """Single forecast item."""
    date: str
    day_of_week: str
    temp_min: float
    temp_max: float
    description: str
    icon: str
    humidity: int
    wind_speed: float


class ForecastResponse(BaseModel):
    """Response model for weather forecast."""
    city_name: str
    country: str
    forecast: list[ForecastItem]


class CitySearchResult(BaseModel):
    """City search result."""
    name: str
    country: str
    state: Optional[str] = None
    lat: float
    lon: float


class CitySearchResponse(BaseModel):
    """Response model for city search."""
    results: list[CitySearchResult]


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str
    detail: Optional[str] = None

