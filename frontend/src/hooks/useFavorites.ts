/**
 * Custom hook for managing favorite cities.
 */
import { useState, useEffect } from 'react';
import type { FavoriteCity } from '../types';

const STORAGE_KEY = 'weather-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (city: FavoriteCity) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === city.id)) return prev;
      return [...prev, city];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}

