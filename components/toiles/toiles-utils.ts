// Frame padding constants (must match AmericanFrame.tsx)
// face(10) + bevel(1) + lip(3) + gap(6) = 20px per side, x2 = 40px
export const FRAME_TOTAL_PX = (10 + 1 + 3 + 6) * 2; // 40px

// Browsing: paintings occupy ~75% of viewport height (frame included)
export const BROWSE_VH = 75;
// Lightbox: near-full viewport
export const LIGHTBOX_VH = 88;

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Compute CSS max-width so painting height stays under targetVH. */
export function paintingMaxWidth(w: number, h: number, targetVH: number): string {
  const ar = w / h;
  return `min(100%, calc((${targetVH}vh - ${FRAME_TOTAL_PX}px) * ${ar} + ${FRAME_TOTAL_PX}px))`;
}

/** Fond ivoire texturé lin — identique au body global */
export const LINEN_BG = {
  backgroundColor: "#FAF7F2",
  backgroundImage: [
    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.008) 2px, rgba(0,0,0,0.008) 3px)",
    "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.006) 3px, rgba(0,0,0,0.006) 4px)",
    "radial-gradient(ellipse at 50% 30%, rgba(255,255,245,0.5) 0%, transparent 70%)",
  ].join(", "),
} as const;

/** Dark gallery background for VIP toiles page. */
export const DARK_BG = {
  backgroundColor: "#0A0A0A",
  backgroundImage: [
    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px)",
    "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.005) 4px, rgba(255,255,255,0.005) 5px)",
  ].join(", "),
} as const;
