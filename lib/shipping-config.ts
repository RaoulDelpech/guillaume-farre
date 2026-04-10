/**
 * Configuration livraison et fiscalite Guillaume Farre
 *
 * @author Lalou
 * @date 2026-04-11
 *
 * TVA 5,5% : oeuvres d'art originales vendues par l'artiste
 * (art. 278-0 bis du CGI, reforme 01/01/2025)
 *
 * Frais de livraison France metro : forfait par tranche de format,
 * inclut emballage professionnel + transport assure ad valorem.
 */

/** Taux de TVA applicable aux oeuvres d'art originales */
export const TVA_RATE = 0.055;

/** Tranches de frais de livraison (TTC, France metropolitaine) */
const SHIPPING_TIERS = [
  { maxDimension: 36, fee: 30_00 },   // 24x36 cm → 30 EUR
  { maxDimension: 60, fee: 45_00 },   // 40x60 cm → 45 EUR
] as const;

/** Seuil au-dela duquel les frais sont sur devis (80x120, monumental) */
const ON_REQUEST_THRESHOLD = 60;

/**
 * Mapping format photo → plus grande dimension (cm)
 * Correspond aux formats dans pricing-config.ts
 */
const FORMAT_MAX_DIMENSION: Record<string, number> = {
  '24x36': 36,
  '40x60': 60,
  '80x120': 120,
  // Anciens formats shop-config.ts (compatibilite)
  'A4': 30,
  'A3': 42,
  'A2': 60,
  'A1': 84,
  'A0': 119,
};

/**
 * Calcule les frais de livraison pour un ensemble d'items.
 * La fee est determinee par le plus grand format du panier
 * (un seul colis, taille = plus grand item).
 *
 * @returns frais en centimes (format Stripe), ou null si sur devis (grands formats)
 */
export function calculateShippingFee(formats: string[]): number | null {
  if (formats.length === 0) return 0;

  // Trouver la plus grande dimension parmi les items
  let maxDim = 0;
  for (const fmt of formats) {
    const dim = FORMAT_MAX_DIMENSION[fmt] ?? 0;
    if (dim > maxDim) maxDim = dim;
  }

  // Grands formats (80x120, monumental) : frais sur devis
  if (maxDim > ON_REQUEST_THRESHOLD) {
    return null;
  }

  // Trouver le palier correspondant
  for (const tier of SHIPPING_TIERS) {
    if (maxDim <= tier.maxDimension) {
      return tier.fee;
    }
  }

  // Format inconnu mais petite dimension : palier le plus haut
  return SHIPPING_TIERS[SHIPPING_TIERS.length - 1].fee;
}

/**
 * Convertit un prix TTC en HT (TVA 5,5%)
 */
export function ttcToHt(priceTtc: number): number {
  return Math.round((priceTtc / (1 + TVA_RATE)) * 100) / 100;
}

/**
 * Calcule le montant de TVA a partir du TTC
 */
export function tvaAmount(priceTtc: number): number {
  return Math.round((priceTtc - ttcToHt(priceTtc)) * 100) / 100;
}

/**
 * Formate le detail fiscal pour metadata / facture
 */
export function taxBreakdown(totalTtc: number) {
  const ht = ttcToHt(totalTtc);
  const tva = tvaAmount(totalTtc);
  return {
    totalTtc,
    totalHt: ht,
    tvaAmount: tva,
    tvaRate: '5.5%',
  };
}

/**
 * Labels pour affichage Stripe shipping_options
 */
export function getShippingLabel(feeCents: number | null): string {
  if (feeCents === null) return 'Grand format — frais communiqués après commande';
  if (feeCents === 0) return 'Retrait atelier';
  return 'Livraison France (emballage pro + assurance inclus)';
}

/**
 * Indique si le panier contient un format necessitant des frais sur devis
 */
export function isShippingOnRequest(formats: string[]): boolean {
  return calculateShippingFee(formats) === null;
}
