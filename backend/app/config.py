"""
Configuration module for the Weather Dashboard backend.
Handles environment variables and application settings.
"""
from typing import List, Union
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # OpenWeatherMap API configuration
    OPENWEATHER_API_KEY: str
    OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"
    
    # Application configuration
    APP_NAME: str = "Weather Dashboard API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # CORS configuration - accept string or list, always convert to list
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://localhost:3000"
    
    # Rate limiting configuration
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Logging configuration
    LOG_LEVEL: str = "INFO"
    
    @model_validator(mode='after')
    def parse_cors_origins(self):
        """Parse CORS_ORIGINS from comma-separated string to list."""
        if isinstance(self.CORS_ORIGINS, str):
            # Split by comma and strip whitespace
            origins = [origin.strip() for origin in self.CORS_ORIGINS.split(',') if origin.strip()]
            self.CORS_ORIGINS = origins if origins else ["http://localhost:5173", "http://localhost:3000"]
        elif isinstance(self.CORS_ORIGINS, list):
            # Already a list, just ensure it's not empty
            if not self.CORS_ORIGINS:
                self.CORS_ORIGINS = ["http://localhost:5173", "http://localhost:3000"]
        return self
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()

