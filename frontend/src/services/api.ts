/**
 * API service for communicating with the backend.
 */
import axios from 'axios';
import type { CurrentWeather, Forecast, CitySearchResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const weatherApi = {
  /**
   * Get current weather for a city.
   */
  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    const response = await apiClient.get<CurrentWeather>(`/api/weather/${encodeURIComponent(city)}`);
    return response.data;
  },

  /**
   * Get 5-day forecast for a city.
   */
  async getForecast(city: string): Promise<Forecast> {
    const response = await apiClient.get<Forecast>(`/api/weather/${encodeURIComponent(city)}/forecast`);
    return response.data;
  },

  /**
   * Search for cities by name.
   */
  async searchCities(query: string): Promise<CitySearchResponse> {
    const response = await apiClient.get<CitySearchResponse>('/api/cities/search', {
      params: { q: query },
    });
    return response.data;
  },
};

