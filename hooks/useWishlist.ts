'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WishlistItem {
  photoPath: string;
  addedAt: number;
  title?: string;
  price?: number;
  thumbnailUrl?: string;
}

const WISHLIST_KEY = 'guillaumefarre_wishlist';
const MAX_WISHLIST_SIZE = 50; // Limite raisonnable

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger wishlist au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('[Wishlist] Error loading:', error);
      setWishlist([]);
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarder dans localStorage quand wishlist change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error('[Wishlist] Error saving:', error);
      }
    }
  }, [wishlist, isLoaded]);

  // Ajouter à la wishlist
  const addToWishlist = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setWishlist((prev) => {
      // Vérifier si déjà présent
      if (prev.some((w) => w.photoPath === item.photoPath)) {
        return prev;
      }

      // Limiter la taille
      if (prev.length >= MAX_WISHLIST_SIZE) {
        console.warn('[Wishlist] Max size reached, removing oldest');
        return [
          ...prev.slice(1), // Retirer le plus ancien
          { ...item, addedAt: Date.now() },
        ];
      }

      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  // Retirer de la wishlist
  const removeFromWishlist = useCallback((photoPath: string) => {
    setWishlist((prev) => prev.filter((w) => w.photoPath !== photoPath));
  }, []);

  // Toggle (ajouter ou retirer)
  const toggleWishlist = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.photoPath === item.photoPath);
      if (exists) {
        return prev.filter((w) => w.photoPath !== item.photoPath);
      } else {
        if (prev.length >= MAX_WISHLIST_SIZE) {
          return [
            ...prev.slice(1),
            { ...item, addedAt: Date.now() },
          ];
        }
        return [...prev, { ...item, addedAt: Date.now() }];
      }
    });
  }, []);

  // Vérifier si dans wishlist
  const isInWishlist = useCallback(
    (photoPath: string) => {
      return wishlist.some((w) => w.photoPath === photoPath);
    },
    [wishlist]
  );

  // Vider la wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // Obtenir item complet
  const getWishlistItem = useCallback(
    (photoPath: string) => {
      return wishlist.find((w) => w.photoPath === photoPath);
    },
    [wishlist]
  );

  // Trier par date (plus récent en premier)
  const sortedWishlist = useCallback(() => {
    return [...wishlist].sort((a, b) => b.addedAt - a.addedAt);
  }, [wishlist]);

  return {
    wishlist,
    isLoaded,
    count: wishlist.length,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistItem,
    sortedWishlist,
  };
}

// Lalou
