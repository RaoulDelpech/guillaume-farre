"use client";
import { useState, useEffect } from "react";

const MAX_RECENT_ITEMS = 10;
const STORAGE_KEY = "recently_viewed";

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      } catch (error) {
        console.error("Failed to parse recently viewed:", error);
      }
    }
  }, []);

  const addToRecentlyViewed = (photoPath: string) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((path) => path !== photoPath);
      // Add to beginning
      const updated = [photoPath, ...filtered].slice(0, MAX_RECENT_ITEMS);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
}
