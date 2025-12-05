/**
 * Main App component.
 */
import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { FavoritesList } from './components/FavoritesList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTheme } from './hooks/useTheme';
import { useFavorites } from './hooks/useFavorites';
import { weatherApi } from './services/api';
import type { CurrentWeather, Forecast } from './types';

type TemperatureUnit = 'C' | 'F';

function App() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(city),
        weatherApi.getForecast(city),
      ]);
      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch weather data';
      setError(errorMessage);
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: string) => {
    fetchWeather(city);
  };

  // Load first favorite city on mount if available
  useEffect(() => {
    if (favorites.length > 0 && !currentWeather) {
      const firstFavorite = favorites[0];
      fetchWeather(`${firstFavorite.name}, ${firstFavorite.country}`);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Weather Dashboard</h1>
              <button
                onClick={toggleTheme}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            </div>
            <SearchBar onSelectCity={handleCitySelect} />
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg animate-fade-in">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            </div>
          )}

          {/* Main Content */}
          {!loading && (
            <div className="space-y-6">
              {/* Weather Card */}
              {currentWeather && (
                <WeatherCard
                  weather={currentWeather}
                  unit={unit}
                  onUnitToggle={() => setUnit(unit === 'C' ? 'F' : 'C')}
                />
              )}

              {/* Forecast and Favorites Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Forecast */}
                {forecast && (
                  <div className="lg:col-span-2">
                    <ForecastCard forecast={forecast.forecast} unit={unit} />
                  </div>
                )}

                {/* Favorites */}
                <div>
                  <FavoritesList onSelectCity={handleCitySelect} />
                </div>
              </div>

              {/* Empty State */}
              {!currentWeather && !loading && !error && (
                <div className="text-center py-20 animate-fade-in">
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Search for a city to get started
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;

