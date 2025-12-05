/**
 * Favorites list component for displaying and managing favorite cities.
 */
import { useFavorites } from '../hooks/useFavorites';

interface FavoritesListProps {
  onSelectCity: (city: string) => void;
}

export function FavoritesList({ onSelectCity }: FavoritesListProps) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Favorites</h3>
      <div className="space-y-2">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <button
              onClick={() => onSelectCity(`${favorite.name}, ${favorite.country}`)}
              className="flex-1 text-left"
            >
              <p className="font-medium text-gray-900 dark:text-white">{favorite.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{favorite.country}</p>
            </button>
            <button
              onClick={() => removeFavorite(favorite.id)}
              className="ml-4 text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove from favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

