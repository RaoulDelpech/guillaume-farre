// Frame padding constants (must match AmericanFrame.tsx fixed values)
// face(18) + bevel(1) + lip(2) + gap(4) = 25px per side, x2 = 50px
export const FRAME_TOTAL_PX = (18 + 1 + 2 + 4) * 2; // 50px

// Browsing: paintings occupy ~75% of viewport height (frame included)
export const BROWSE_VH = 75;
// Grand format (Atlantide 200x400) : plus imposant, mais reste contraint par la
// hauteur pour rester PORTRAIT et tenir dans l'ecran (pas de debordement vertical).
export const LARGE_BROWSE_VH = 92;
// Lightbox: near-full viewport
export const LIGHTBOX_VH = 88;

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Compute CSS max-width so painting height stays under targetVH.
 *  Uses `svh` (small viewport height) instead of `vh` to avoid CLS on mobile
 *  caused by browser URL bar appearing/disappearing during scroll. */
export function paintingMaxWidth(w: number, h: number, targetVH: number): string {
  const ar = w / h;
  return `min(100%, calc((${targetVH}svh - ${FRAME_TOTAL_PX}px) * ${ar} + ${FRAME_TOTAL_PX}px))`;
}

/** Fond ivoire texturé lin — identique au body global */
export const LINEN_BG = {
  backgroundColor: "#FEFEFA",
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
