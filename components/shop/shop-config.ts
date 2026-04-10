import { PhotoMetadata } from "@/lib/admin/photo-manager";

export interface ShopCartItem {
  photo: PhotoMetadata;
  format: string;
  frame: string;
  material: string;
  price: number;
}

export const FORMAT_CONFIG = {
  A4: { width: 21, height: 29.7, priceMultiplier: 0.31, type: "petit" as const, price: 250 },
  A3: { width: 29.7, height: 42, priceMultiplier: 0.63, type: "petit" as const, price: 500 },
  A2: { width: 42, height: 59.4, priceMultiplier: 1.0, type: "petit" as const, price: 800 },
  A1: { width: 59.4, height: 84.1, priceMultiplier: 1.5, type: "grand" as const, price: 1200 },
  A0: { width: 84.1, height: 118.9, priceMultiplier: 2.0, type: "grand" as const, price: null as number | null },
} as const;

export type FormatKey = keyof typeof FORMAT_CONFIG;

export const FRAME_CONFIG = {
  none: { label: "Sans cadre", price: 0, description: "Impression livrée à plat ou roulée" },
  black: { label: "Cadre bois noir", price: 150, description: "Cadre en bois noir avec plexiglas (encadrement artisanal après impression)" },
  white: { label: "Cadre bois blanc", price: 150, description: "Cadre en bois blanc avec plexiglas (encadrement artisanal après impression)" },
} as const;

export type FrameKey = keyof typeof FRAME_CONFIG;

export const MATERIAL_CONFIG = {
  "semi-glossy": {
    label: "Papier Semi-Brillant",
    price: 13.20,
    description: "Papier Fine Art 200gsm, finition semi-brillante, rendu des couleurs exceptionnel",
  },
  aluminum: {
    label: "Aluminium Brossé",
    price: 16.81,
    description: "Impression directe sur aluminium, effet moderne et durable, résistant aux UV",
  },
} as const;

export type MaterialKey = keyof typeof MATERIAL_CONFIG;

const GRAND_FORMATS = new Set(["A1", "A0", "2A0"]);

export function isGrandFormat(format: string): boolean {
  return GRAND_FORMATS.has(format);
}

export function getStockForFormat(photo: PhotoMetadata, format: string) {
  if (isGrandFormat(format)) {
    return photo.limitedEditionGrand || photo.limitedEdition || { total: 9, available: 9, sold: 0, closed: false };
  }
  return photo.limitedEditionPetit || photo.limitedEdition || { total: 99, available: 99, sold: 0, closed: false };
}

export function calculatePrice(basePrice: number, format: FormatKey, frame: FrameKey, material: MaterialKey): number {
  const formatPrice = basePrice * FORMAT_CONFIG[format].priceMultiplier;
  const framePrice = FRAME_CONFIG[frame].price;
  const materialPrice = MATERIAL_CONFIG[material].price;
  return Math.round(formatPrice + framePrice + materialPrice);
}
