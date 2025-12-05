/**
 * Weather card component displaying current weather information.
 */
import { useFavorites } from '../hooks/useFavorites';
import type { CurrentWeather } from '../types';

interface WeatherCardProps {
  weather: CurrentWeather;
  unit: 'C' | 'F';
  onUnitToggle: () => void;
}

function convertToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function WeatherCard({ weather, unit, onUnitToggle }: WeatherCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favoriteId = `${weather.city_name}-${weather.country}`;
  const isFav = isFavorite(favoriteId);

  const displayTemp = (temp: number) => {
    return unit === 'F' ? convertToFahrenheit(temp) : temp;
  };

  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFavorite(favoriteId);
    } else {
      addFavorite({
        id: favoriteId,
        name: weather.city_name,
        country: weather.country,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {weather.city_name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{weather.country}</p>
        </div>
        <button
          onClick={handleFavoriteToggle}
          className="text-2xl hover:scale-110 transition-transform"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-24 h-24"
          />
          <div>
            <div className="text-6xl font-bold text-gray-900 dark:text-white">
              {Math.round(displayTemp(weather.temperature))}°
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 capitalize">
              {weather.description}
            </p>
          </div>
        </div>
        <button
          onClick={onUnitToggle}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
        >
          {unit === 'C' ? '°F' : '°C'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Feels Like</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {Math.round(displayTemp(weather.feels_like))}°
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Humidity</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{weather.humidity}%</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wind Speed</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {weather.wind_speed} m/s
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pressure</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{weather.pressure} hPa</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            High: <span className="font-semibold text-gray-900 dark:text-white">{Math.round(displayTemp(weather.temp_max))}°</span>
          </span>
          <span>
            Low: <span className="font-semibold text-gray-900 dark:text-white">{Math.round(displayTemp(weather.temp_min))}°</span>
          </span>
        </div>
      </div>
    </div>
  );
}

