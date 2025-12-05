/**
 * TypeScript interfaces for API responses and application data.
 */

export interface CurrentWeather {
  city_name: string;
  country: string;
  temperature: number;
  feels_like: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  pressure: number;
  temp_min: number;
  temp_max: number;
}

export interface ForecastItem {
  date: string;
  day_of_week: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
}

export interface Forecast {
  city_name: string;
  country: string;
  forecast: ForecastItem[];
}

export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface CitySearchResponse {
  results: CitySearchResult[];
}

export interface FavoriteCity {
  name: string;
  country: string;
  id: string;
}

