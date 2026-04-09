/**
 * Calculateur pricing Guillaume Farre
 *
 * @author Lalou
 * @date 2026-04-09
 *
 * Prix fixes par format. Pas de multiplicateurs.
 */

import { FORMATS, formatPrice, type PrintFormat } from './pricing-config';

export { formatPrice };

/**
 * Retourne le prix d'un format pour une photo standard
 * Retourne null si le format est sur demande (hors-format, monumental)
 */
export function getPrice(format: PrintFormat): number | null {
  return FORMATS[format]?.price ?? null;
}

/**
 * Table des prix canoniques pour validation Stripe cote serveur
 * Seuls les formats avec prix fixe sont inclus
 */
export const CANONICAL_PRICES: Record<string, number> = {
  '24x36': 500,
  '40x60': 1000,
  '80x120': 2000,
};

/**
 * Valide qu'un prix correspond au format attendu
 */
export function validatePrice(format: string, price: number): boolean {
  const expected = CANONICAL_PRICES[format];
  if (!expected) return false;
  return Math.abs(price - expected) < 0.01;
}
