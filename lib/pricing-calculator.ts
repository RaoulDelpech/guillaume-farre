/**
 * Calculateur pricing dynamique Guillaume Farré
 *
 * @author Lalou
 * @date 2025-11-08
 *
 * Fonctions de calcul de prix avec système auto/manuel
 */

import type {
  PricingConfig,
  PricingCategory,
  PricingFormat,
  PricingKey,
  PriceCalculation,
} from './pricing-config';

/**
 * Calcule le prix pour une catégorie et un format donnés
 *
 * @param category - 'unlimited' ou 'limited'
 * @param format - 'a4', 'a3', 'a2', ou 'a1'
 * @param config - Configuration pricing actuelle
 * @returns Résultat de calcul avec prix, multiplicateur, formule
 */
export function calculatePrice(
  category: PricingCategory,
  format: PricingFormat,
  config: PricingConfig
): PriceCalculation {
  const key: PricingKey = `${category}-${format}`;

  // Si override manuel existe, le retourner directement
  if (config.manualPrices[key] !== undefined) {
    return {
      price: config.manualPrices[key],
      isManual: true,
    };
  }

  // Sinon, calcul automatique basé sur base + multiplicateur
  if (category === 'unlimited') {
    const multiplier = config.multipliersUnlimited[format as 'a4' | 'a3' | 'a2'];
    if (multiplier === undefined) {
      throw new Error(`Format ${format} non supporté pour catégorie ${category}`);
    }

    const basePrice = config.prixBaseUnlimited;
    const price = Math.round(basePrice * multiplier);

    return {
      price,
      isManual: false,
      multiplier,
      basePrice,
      calculation: `${basePrice} × ${multiplier}`,
    };
  }

  if (category === 'limited') {
    const multiplier = config.multipliersLimited[format as 'a3' | 'a2' | 'a1'];
    if (multiplier === undefined) {
      throw new Error(`Format ${format} non supporté pour catégorie ${category}`);
    }

    const basePrice = config.prixBaseLimited;
    const price = Math.round(basePrice * multiplier);

    return {
      price,
      isManual: false,
      multiplier,
      basePrice,
      calculation: `${basePrice} × ${multiplier}`,
    };
  }

  throw new Error(`Catégorie inconnue: ${category}`);
}

/**
 * Calcule tous les prix pour une catégorie donnée
 *
 * @param category - 'unlimited' ou 'limited'
 * @param config - Configuration pricing actuelle
 * @returns Map des formats vers leurs calculs
 */
export function calculateAllPricesForCategory(
  category: PricingCategory,
  config: PricingConfig
): Map<PricingFormat, PriceCalculation> {
  const formats: PricingFormat[] =
    category === 'unlimited' ? ['a4', 'a3', 'a2'] : ['a3', 'a2', 'a1'];

  const results = new Map<PricingFormat, PriceCalculation>();

  formats.forEach((format) => {
    results.set(format, calculatePrice(category, format, config));
  });

  return results;
}

/**
 * Met à jour le prix de base et recalcule tous les prix auto
 *
 * @param category - 'unlimited' ou 'limited'
 * @param newBasePrice - Nouveau prix de base
 * @param config - Configuration actuelle
 * @returns Nouvelle configuration avec prix de base mis à jour
 */
export function updateBasePrice(
  category: PricingCategory,
  newBasePrice: number,
  config: PricingConfig
): PricingConfig {
  if (newBasePrice <= 0) {
    throw new Error('Le prix de base doit être supérieur à 0');
  }

  const newConfig = { ...config };

  if (category === 'unlimited') {
    newConfig.prixBaseUnlimited = newBasePrice;
  } else if (category === 'limited') {
    newConfig.prixBaseLimited = newBasePrice;
  } else {
    throw new Error(`Catégorie inconnue: ${category}`);
  }

  newConfig.lastUpdated = new Date().toISOString();

  return newConfig;
}

/**
 * Définit un prix manuel (override) pour un format spécifique
 *
 * @param key - Clé composite 'category-format'
 * @param price - Prix manuel à définir
 * @param config - Configuration actuelle
 * @returns Nouvelle configuration avec override manuel
 */
export function setManualPrice(
  key: PricingKey,
  price: number,
  config: PricingConfig
): PricingConfig {
  if (price <= 0) {
    throw new Error('Le prix manuel doit être supérieur à 0');
  }

  const newConfig = {
    ...config,
    manualPrices: {
      ...config.manualPrices,
      [key]: price,
    },
    lastUpdated: new Date().toISOString(),
  };

  return newConfig;
}

/**
 * Supprime un prix manuel (override) et revient au calcul auto
 *
 * @param key - Clé composite 'category-format'
 * @param config - Configuration actuelle
 * @returns Nouvelle configuration sans override manuel
 */
export function clearManualPrice(
  key: PricingKey,
  config: PricingConfig
): PricingConfig {
  const newManualPrices = { ...config.manualPrices };
  delete newManualPrices[key];

  const newConfig = {
    ...config,
    manualPrices: newManualPrices,
    lastUpdated: new Date().toISOString(),
  };

  return newConfig;
}

/**
 * Met à jour un multiplicateur pour un format donné
 *
 * @param category - 'unlimited' ou 'limited'
 * @param format - Format à mettre à jour
 * @param newMultiplier - Nouveau multiplicateur
 * @param config - Configuration actuelle
 * @returns Nouvelle configuration avec multiplicateur mis à jour
 */
export function updateMultiplier(
  category: PricingCategory,
  format: PricingFormat,
  newMultiplier: number,
  config: PricingConfig
): PricingConfig {
  if (newMultiplier <= 0) {
    throw new Error('Le multiplicateur doit être supérieur à 0');
  }

  const newConfig = { ...config };

  if (category === 'unlimited') {
    if (!['a4', 'a3', 'a2'].includes(format)) {
      throw new Error(`Format ${format} non supporté pour unlimited`);
    }
    newConfig.multipliersUnlimited = {
      ...config.multipliersUnlimited,
      [format]: newMultiplier,
    };
  } else if (category === 'limited') {
    if (!['a3', 'a2', 'a1'].includes(format)) {
      throw new Error(`Format ${format} non supporté pour limited`);
    }
    newConfig.multipliersLimited = {
      ...config.multipliersLimited,
      [format]: newMultiplier,
    };
  } else {
    throw new Error(`Catégorie inconnue: ${category}`);
  }

  newConfig.lastUpdated = new Date().toISOString();

  return newConfig;
}

/**
 * Vérifie si un prix est manuel (override) ou auto
 *
 * @param key - Clé composite 'category-format'
 * @param config - Configuration actuelle
 * @returns true si manuel, false si auto
 */
export function isManualPrice(key: PricingKey, config: PricingConfig): boolean {
  return config.manualPrices[key] !== undefined;
}

/**
 * Récupère tous les prix manuels (overrides)
 *
 * @param config - Configuration actuelle
 * @returns Tableau des clés avec prix manuel
 */
export function getManualPriceKeys(config: PricingConfig): PricingKey[] {
  return Object.keys(config.manualPrices) as PricingKey[];
}

/**
 * Formatte un prix en euros avec espace insécable
 *
 * @param price - Prix en nombre
 * @returns Prix formatté (ex: "1 500 €")
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR') + ' €';
}

/**
 * Calcule le pourcentage d'augmentation entre deux prix
 *
 * @param basePrice - Prix de base
 * @param targetPrice - Prix cible
 * @returns Pourcentage d'augmentation (ex: 67 pour +67%)
 */
export function calculatePercentageIncrease(
  basePrice: number,
  targetPrice: number
): number {
  if (basePrice === 0) return 0;
  return Math.round(((targetPrice - basePrice) / basePrice) * 100);
}
