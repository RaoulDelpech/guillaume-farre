"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  format: string; // "A2", "A1", "A0"
  material: string; // "semi-glossy", "aluminum"
  orientation: string; // "vertical", "horizontal"
  frame: string; // "none", "black", "white"
  image: string;
  category: string;
  photoPath: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  daysUntilExpiration: number | null;
}

interface PersistedCart {
  items: CartItem[];
  createdAt: number; // Timestamp
  expiresAt: number; // Timestamp
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Configuration
const CART_STORAGE_KEY = 'guillaume-farre-cart';
const CART_EXPIRATION_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [daysUntilExpiration, setDaysUntilExpiration] = useState<number | null>(null);

  // Charger le panier depuis localStorage au montage (avec vérification expiration)
  useEffect(() => {
    setIsClient(true);
    const savedCartData = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCartData) {
      try {
        const persistedCart: PersistedCart = JSON.parse(savedCartData);
        const now = Date.now();

        // Vérifier si le panier a expiré
        if (now > persistedCart.expiresAt) {
          console.log('[Cart] Panier expiré (>30 jours), suppression');
          localStorage.removeItem(CART_STORAGE_KEY);
          setItems([]);
          setDaysUntilExpiration(null);
        } else {
          // Panier encore valide
          setItems(persistedCart.items);

          // Calculer jours restants
          const msRemaining = persistedCart.expiresAt - now;
          const daysRemaining = Math.ceil(msRemaining / MS_PER_DAY);
          setDaysUntilExpiration(daysRemaining);

          console.log(`[Cart] Panier chargé (expire dans ${daysRemaining} jours)`);
        }
      } catch (e) {
        console.error('[Cart] Error loading cart:', e);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement (avec timestamps)
  useEffect(() => {
    if (isClient) {
      if (items.length === 0) {
        // Panier vide : supprimer localStorage
        localStorage.removeItem(CART_STORAGE_KEY);
        setDaysUntilExpiration(null);
      } else {
        const now = Date.now();
        const expiresAt = now + (CART_EXPIRATION_DAYS * MS_PER_DAY);

        const persistedCart: PersistedCart = {
          items,
          createdAt: now,
          expiresAt,
        };

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistedCart));

        // Mise à jour jours restants
        setDaysUntilExpiration(CART_EXPIRATION_DAYS);
      }
    }
  }, [items, isClient]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Vérifier si l'item existe déjà (même id ET même format)
      const existingIndex = prev.findIndex(
        (i) => i.id === item.id && i.format === item.format
      );

      if (existingIndex >= 0) {
        // Déjà dans le panier - on ne fait rien ou on affiche un message
        return prev;
      }

      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        daysUntilExpiration,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
