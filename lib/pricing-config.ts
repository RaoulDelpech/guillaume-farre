/**
 * Configuration pricing Guillaume Farre
 *
 * @author Lalou
 * @date 2026-04-09
 *
 * Tous les tirages sont signes et numerotes.
 * 30 exemplaires max par photo standard (9+9+9+3).
 * Exception photo 16 : monumental, 1 exemplaire, sur demande.
 */

/** Formats de tirage disponibles */
export type PrintFormat = '24x36' | '40x60' | '80x120' | 'hors-format' | 'monumental';

/** Configuration d'un format */
export interface FormatConfig {
  label: string;
  dimensions: string;
  price: number | null; // null = sur demande
  exemplaires: number;
  numberingStart: number;
  numberingEnd: number;
}

/** Structure des editions par format dans les metadonnees photo */
export interface EditionInfo {
  total: number;
  sold: number;
  available: number;
  numberingStart: number;
  numberingEnd: number;
}

/** Configuration complete de tous les formats */
export const FORMATS: Record<PrintFormat, FormatConfig> = {
  '24x36': {
    label: '24 × 36 cm',
    dimensions: '24 × 36 cm',
    price: 500,
    exemplaires: 9,
    numberingStart: 1,
    numberingEnd: 9,
  },
  '40x60': {
    label: '40 × 60 cm',
    dimensions: '40 × 60 cm',
    price: 1000,
    exemplaires: 9,
    numberingStart: 10,
    numberingEnd: 18,
  },
  '80x120': {
    label: '80 × 120 cm',
    dimensions: '80 × 120 cm',
    price: 2000,
    exemplaires: 9,
    numberingStart: 19,
    numberingEnd: 27,
  },
  'hors-format': {
    label: 'Hors Format',
    dimensions: 'Sur mesure',
    price: null,
    exemplaires: 3,
    numberingStart: 28,
    numberingEnd: 30,
  },
  'monumental': {
    label: 'Format Monumental',
    dimensions: 'Sur mesure',
    price: null,
    exemplaires: 1,
    numberingStart: 1,
    numberingEnd: 1,
  },
};

/** Formats disponibles pour les photos standard (toutes sauf photo 16) */
export const STANDARD_FORMATS: PrintFormat[] = ['24x36', '40x60', '80x120', 'hors-format'];

/** Formats avec un prix fixe (achat direct possible) */
export const PURCHASABLE_FORMATS: PrintFormat[] = ['24x36', '40x60', '80x120'];

/** Total exemplaires par photo standard : 9 + 9 + 9 + 3 = 30 */
export const TOTAL_EXEMPLAIRES_STANDARD = 30;

/**
 * Retourne le prix d'un format, ou null si sur demande
 */
export function getFormatPrice(format: PrintFormat): number | null {
  return FORMATS[format]?.price ?? null;
}

/**
 * Formate un prix en euros
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + ' \u20AC';
}

/**
 * Verifie si un format est achetable directement (prix fixe)
 */
export function isPurchasable(format: PrintFormat): boolean {
  return FORMATS[format]?.price !== null;
}

/**
 * Cles i18n pour les labels qui doivent etre traduits (format non numerique).
 * Les formats numeriques (24x36, etc.) gardent leur label neutre ("24 × 36 cm").
 */
export const FORMAT_LABEL_I18N_KEYS: Partial<Record<PrintFormat, string>> = {
  'hors-format': 'formatHorsFormat',
  'monumental': 'formatMonumental',
};

/**
 * Retourne le label traduit d'un format via la cle i18n, sinon le label par defaut.
 * @param format Format du tirage
 * @param t Fonction de traduction (next-intl useTranslations('gallery'))
 */
export function getLocalizedFormatLabel(
  format: PrintFormat,
  t: (key: string) => string,
): string {
  const i18nKey = FORMAT_LABEL_I18N_KEYS[format];
  return i18nKey ? t(i18nKey) : FORMATS[format].label;
}
