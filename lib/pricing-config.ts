/**
 * Configuration système pricing dynamique Guillaume Farré
 *
 * @author Lalou
 * @date 2025-11-08
 *
 * Système avec 2 prix de base + multiplicateurs auto + override manuel
 * Inspiré de Peter Lik, Andreas Gursky, Jeff Koons
 */

export interface PricingConfig {
  // Prix de base TIRAGE ILLIMITÉ (référence A4)
  prixBaseUnlimited: number;

  // Prix de base SÉRIE LIMITÉE (référence A3)
  prixBaseLimited: number;

  // Multiplicateurs TIRAGE ILLIMITÉ (depuis A4 base)
  multipliersUnlimited: {
    a4: number;  // Base (toujours 1.0)
    a3: number;  // +67% typique
    a2: number;  // +167% typique
  };

  // Multiplicateurs SÉRIE LIMITÉE (depuis A3 base)
  multipliersLimited: {
    a3: number;  // Base série limitée (toujours 1.0)
    a2: number;  // +53% typique
    a1: number;  // +100% typique
  };

  // Overrides manuels (si Guillaume veut prix custom)
  // Format: 'unlimited-a4' | 'unlimited-a3' | 'unlimited-a2' | 'limited-a3' | 'limited-a2' | 'limited-a1'
  manualPrices: Record<string, number>;

  // Dernière mise à jour
  lastUpdated: string;
}

/**
 * Configuration par défaut validée avec Guillaume
 * Date: 2025-11-29 (mise à jour prix)
 *
 * PRIX OFFICIELS (CLAUDE.md 2025-11-29):
 * - A4: 250€ (99 ex.)
 * - A3: 500€ (99 ex.)
 * - A2: 800€ (99 ex.)
 * - A1: 1200€ (9 ex.)
 */
export const DEFAULT_PRICING: PricingConfig = {
  // Prix de base
  prixBaseUnlimited: 250,   // A4 = 250 €
  prixBaseLimited: 500,     // A3 = 500 €

  // Multiplicateurs (depuis A4 base pour unlimited)
  multipliersUnlimited: {
    a4: 1.0,    // 250 € (base)
    a3: 2.0,    // 500 €
    a2: 3.2,    // 800 €
  },

  // Multiplicateurs (depuis A3 base pour limited/grands formats)
  multipliersLimited: {
    a3: 1.0,    // 500 € (base)
    a2: 1.6,    // 800 €
    a1: 2.4,    // 1200 €
  },

  // Pas d'override manuel par défaut
  manualPrices: {},

  // Timestamp
  lastUpdated: new Date().toISOString(),
};

/**
 * Type pour les catégories de prix
 */
export type PricingCategory = 'unlimited' | 'limited';

/**
 * Type pour les formats
 */
export type PricingFormat = 'a4' | 'a3' | 'a2' | 'a1';

/**
 * Clé composite catégorie-format
 */
export type PricingKey = `${PricingCategory}-${PricingFormat}`;

/**
 * Résultat de calcul de prix
 */
export interface PriceCalculation {
  price: number;           // Prix calculé ou manuel
  isManual: boolean;       // true si override manuel
  multiplier?: number;     // Multiplicateur utilisé (si auto)
  basePrice?: number;      // Prix de base utilisé (si auto)
  calculation?: string;    // Formule de calcul (ex: "150 × 1.67")
}

/**
 * Formats disponibles par catégorie
 */
export const FORMATS_BY_CATEGORY: Record<PricingCategory, PricingFormat[]> = {
  unlimited: ['a4', 'a3', 'a2'],
  limited: ['a3', 'a2', 'a1'],
};

/**
 * Labels français des formats
 */
export const FORMAT_LABELS: Record<PricingFormat, string> = {
  a4: 'Format A4',
  a3: 'Format A3',
  a2: 'Format A2',
  a1: 'Format A1',
};

/**
 * Dimensions des formats (en cm)
 */
export const FORMAT_DIMENSIONS: Record<PricingFormat, { width: number; height: number }> = {
  a4: { width: 21, height: 29.7 },
  a3: { width: 29.7, height: 42 },
  a2: { width: 42, height: 59.4 },
  a1: { width: 59.4, height: 84.1 },
};
