"use client";
import { useState, useEffect } from "react";

const FAVORITES_KEY = "guillaumeFarre_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (photoPath: string) => {
    setFavorites((prev) => {
      if (prev.includes(photoPath)) {
        return prev.filter((p) => p !== photoPath);
      } else {
        return [...prev, photoPath];
      }
    });
  };

  const isFavorite = (photoPath: string) => {
    return favorites.includes(photoPath);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoaded,
  };
}
