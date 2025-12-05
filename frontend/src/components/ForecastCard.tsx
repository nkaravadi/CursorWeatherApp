/**
 * Forecast card component displaying 5-day weather forecast.
 */
import type { ForecastItem } from '../types';

interface ForecastCardProps {
  forecast: ForecastItem[];
  unit: 'C' | 'F';
}

function convertToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function ForecastCard({ forecast, unit }: ForecastCardProps) {
  const displayTemp = (temp: number) => {
    return unit === 'F' ? convertToFahrenheit(temp) : temp;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5-Day Forecast</h3>
      <div className="space-y-4">
        {forecast.map((item, index) => (
          <div
            key={`${item.date}-${index}`}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-20 text-left">
                <p className="font-semibold text-gray-900 dark:text-white">{item.day_of_week}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt={item.description}
                className="w-16 h-16"
              />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white capitalize font-medium">
                  {item.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Humidity: {item.humidity}% • Wind: {item.wind_speed} m/s
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.round(displayTemp(item.temp_max))}°
                </span>
                <span className="text-lg text-gray-600 dark:text-gray-400">
                  {Math.round(displayTemp(item.temp_min))}°
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

