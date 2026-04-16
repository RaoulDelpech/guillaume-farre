/**
 * Google Analytics 4 E-commerce & Custom Event Tracking
 * Helpers conformes RGPD : verification du consentement avant chaque envoi
 *
 * Lalou
 */

import { hasConsent } from "./cookie-consent";

/**
 * Verifie que gtag est disponible et que le consentement est accorde
 */
function canTrack(): boolean {
  if (typeof window === "undefined") return false;
  if (!hasConsent()) return false;
  if (typeof window.gtag !== "function") return false;
  return true;
}

// ─── E-commerce Events ───

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

// ─── Custom Engagement Events ───

export function trackScrollDepth(percent: number) {
  if (!canTrack()) return;

  window.gtag("event", "scroll_depth", {
    percent_scrolled: percent,
    page_path: window.location.pathname,
  });
}

export function trackTimeOnPage(seconds: number) {
  if (!canTrack()) return;

  window.gtag("event", "time_on_page", {
    seconds_on_page: seconds,
    page_path: window.location.pathname,
  });
}

export function trackLightboxOpen(itemId: string, itemName: string) {
  if (!canTrack()) return;

  window.gtag("event", "lightbox_open", {
    item_id: itemId,
    item_name: itemName,
  });
}

export function trackLightboxClose(itemId: string, durationMs: number) {
  if (!canTrack()) return;

  window.gtag("event", "lightbox_close", {
    item_id: itemId,
    duration_seconds: Math.round(durationMs / 1000),
  });
}

export function trackClickArtwork(
  itemId: string,
  itemName: string,
  source: "galerie" | "homepage" | "boutique"
) {
  if (!canTrack()) return;

  window.gtag("event", "click_artwork", {
    item_id: itemId,
    item_name: itemName,
    source,
  });
}

export function trackFunnelStep(
  step: "home" | "galerie" | "lightbox" | "checkout" | "purchase"
) {
  if (!canTrack()) return;

  window.gtag("event", "funnel_step", {
    step_name: step,
    page_path: window.location.pathname,
  });
}
