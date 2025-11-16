/**
 * Calcul des délais de livraison estimés
 * Prend en compte production Gelato + expédition selon pays
 */

export interface DeliveryEstimate {
  minDays: number;
  maxDays: number;
  estimatedDate: Date;
  label: string; // "7-9 jours ouvrés"
  productionDays: string; // "3-5 jours"
  shippingDays: string; // "2-4 jours"
}

interface CountryDelay {
  production: [number, number];
  shipping: [number, number];
}

// Délais selon pays (production Gelato + expédition)
const DELIVERY_DELAYS: Record<string, CountryDelay> = {
  // France
  'FR': { production: [3, 5], shipping: [2, 4] },

  // Pays limitrophes
  'BE': { production: [3, 5], shipping: [3, 5] },
  'LU': { production: [3, 5], shipping: [3, 5] },
  'CH': { production: [3, 5], shipping: [4, 6] },
  'MC': { production: [3, 5], shipping: [2, 4] },

  // Europe Ouest
  'DE': { production: [3, 5], shipping: [4, 6] },
  'IT': { production: [3, 5], shipping: [4, 7] },
  'ES': { production: [3, 5], shipping: [4, 7] },
  'PT': { production: [3, 5], shipping: [5, 8] },
  'NL': { production: [3, 5], shipping: [3, 5] },

  // Europe Nord
  'GB': { production: [3, 5], shipping: [5, 8] },
  'IE': { production: [3, 5], shipping: [5, 8] },
  'DK': { production: [3, 5], shipping: [5, 7] },
  'SE': { production: [3, 5], shipping: [6, 9] },
  'NO': { production: [3, 5], shipping: [6, 9] },
  'FI': { production: [3, 5], shipping: [7, 10] },

  // Europe Est
  'AT': { production: [3, 5], shipping: [4, 6] },
  'PL': { production: [3, 5], shipping: [5, 8] },
  'CZ': { production: [3, 5], shipping: [5, 8] },

  // International
  'US': { production: [3, 5], shipping: [7, 14] },
  'CA': { production: [3, 5], shipping: [7, 14] },

  // Défaut pour pays non listés
  'DEFAULT': { production: [3, 5], shipping: [7, 14] },
};

/**
 * Calculer le délai de livraison estimé pour un pays
 */
export function calculateDeliveryEstimate(countryCode: string = 'FR'): DeliveryEstimate {
  const today = new Date();

  // Récupérer les délais pour le pays (ou défaut)
  const delay = DELIVERY_DELAYS[countryCode.toUpperCase()] || DELIVERY_DELAYS['DEFAULT'];

  // Calculer délais totaux
  const minDays = delay.production[0] + delay.shipping[0];
  const maxDays = delay.production[1] + delay.shipping[1];

  // Calculer date estimée (en sautant weekends)
  const estimatedDate = addBusinessDays(today, maxDays);

  return {
    minDays,
    maxDays,
    estimatedDate,
    label: `${minDays}-${maxDays} jours ouvrés`,
    productionDays: `${delay.production[0]}-${delay.production[1]} jours`,
    shippingDays: `${delay.shipping[0]}-${delay.shipping[1]} jours`,
  };
}

/**
 * Ajouter N jours ouvrés à une date (en sautant weekends)
 */
function addBusinessDays(date: Date, days: number): Date {
  let current = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    current.setDate(current.getDate() + 1);

    // Sauter weekends (0 = dimanche, 6 = samedi)
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }

  return current;
}

/**
 * Obtenir un libellé court du délai selon le pays
 */
export function getShortDeliveryLabel(countryCode: string = 'FR'): string {
  const estimate = calculateDeliveryEstimate(countryCode);

  if (countryCode === 'FR') {
    return `Livraison ${estimate.minDays}-${estimate.maxDays}j`;
  }

  return `Livraison ${estimate.minDays}-${estimate.maxDays}j (${countryCode})`;
}

/**
 * Vérifier si un pays est éligible à la livraison
 */
export function isCountryEligible(countryCode: string): boolean {
  return countryCode.toUpperCase() in DELIVERY_DELAYS || true; // Défaut autorise tous
}

/**
 * Obtenir la liste des pays éligibles (pour dropdown checkout)
 */
export function getEligibleCountries(): Array<{ code: string; name: string }> {
  return [
    { code: 'FR', name: 'France' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MC', name: 'Monaco' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'IT', name: 'Italie' },
    { code: 'ES', name: 'Espagne' },
    { code: 'PT', name: 'Portugal' },
    { code: 'NL', name: 'Pays-Bas' },
    { code: 'GB', name: 'Royaume-Uni' },
    { code: 'IE', name: 'Irlande' },
    { code: 'AT', name: 'Autriche' },
    { code: 'DK', name: 'Danemark' },
    { code: 'SE', name: 'Suède' },
    { code: 'NO', name: 'Norvège' },
    { code: 'FI', name: 'Finlande' },
    { code: 'PL', name: 'Pologne' },
    { code: 'CZ', name: 'République tchèque' },
    { code: 'US', name: 'États-Unis' },
    { code: 'CA', name: 'Canada' },
  ];
}

// Lalou
