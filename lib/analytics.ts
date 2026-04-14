/**
 * Google Analytics 4 E-commerce Event Tracking
 * Helpers conformes RGPD : vérification du consentement avant chaque envoi
 *
 * Lalou
 */

import { hasConsent } from "./cookie-consent";

/**
 * Vérifie que gtag est disponible et que le consentement est accordé
 */
function canTrack(): boolean {
  if (typeof window === "undefined") return false;
  if (!hasConsent()) return false;
  if (typeof window.gtag !== "function") return false;
  return true;
}

/**
 * Track view_item event (product page)
 */
export function trackViewItem(item: {
  id: string;
  name: string;
  price: number;
  category: string;
}) {
  if (!canTrack()) return;

  window.gtag("event", "view_item", {
    currency: "EUR",
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        item_category: item.category,
        quantity: 1,
      },
    ],
  });
}

/**
 * Track add_to_cart event
 */
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}) {
  if (!canTrack()) return;

  window.gtag("event", "add_to_cart", {
    currency: "EUR",
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
        item_category: item.category || "Photographie",
      },
    ],
  });
}

/**
 * Track remove_from_cart event
 */
export function trackRemoveFromCart(item: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}) {
  if (!canTrack()) return;

  window.gtag("event", "remove_from_cart", {
    currency: "EUR",
    value: item.price * (item.quantity || 1),
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        item_category: item.category || "Photographie",
      },
    ],
  });
}

/**
 * Track begin_checkout event
 */
export function trackBeginCheckout(
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>,
  total: number
) {
  if (!canTrack()) return;

  window.gtag("event", "begin_checkout", {
    currency: "EUR",
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category || "Photographie",
    })),
  });
}

/**
 * Track purchase event (after successful payment)
 */
export function trackPurchase(
  orderId: string,
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>,
  total: number
) {
  if (!canTrack()) return;

  window.gtag("event", "purchase", {
    transaction_id: orderId,
    currency: "EUR",
    value: total,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category || "Photographie",
    })),
  });
}
