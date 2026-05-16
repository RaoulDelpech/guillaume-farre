/**
 * Types et helpers pour la generation de PDF
 *
 * @author Lalou
 */

export interface CertificateData {
  orderNumber: string;
  customerName: string;
  items: {
    title: string;
    format: string;
    edition?: string;
  }[];
  purchaseDate: string;
  certificateId: string;
}

export interface SaleContractBuyer {
  name: string;
  address?: string;
  email: string;
  phone?: string;
  buyerType?: 'particulier' | 'professionnel';
  siret?: string;
  companyName?: string;
}

export interface SaleContractData {
  contractNumber: string;
  date: string;
  buyer: SaleContractBuyer;
  artwork: {
    title: string;
    dimensions: string;
    technique: string;
    year: number;
    price: number;
  };
  paymentMethod: string;
  depositAmount?: number;
  /**
   * Optionnel : signature image et metadonnees techniques.
   * Si fourni, l'image est embarquee en bas de la page 2 et un footer
   * eIDAS complet est imprime.
   */
  signature?: SaleContractSignature;
}

export interface SaleContractSignature {
  /** Image JPEG (Buffer) prete pour embedding /DCTDecode dans le PDF. */
  jpegBuffer: Buffer;
  /** Dimensions reelles de l'image (en pixels). */
  jpegWidth: number;
  jpegHeight: number;
  /** Nom dactylographie sous l'image. */
  fullName: string;
  /** Adresse IP du signataire. */
  ip: string;
  /** User-Agent du signataire (tronque a 80 chars pour le PDF). */
  userAgent: string;
  /** Horodatage UTC ISO 8601. */
  timestamp: string;
  /** Hash SHA256 du contenu legal (hex, 64 chars). */
  contractHash: string;
  /** HMAC d'integrite (hex). */
  contractHmac: string;
}

/**
 * Formate une date ISO en français
 */
export function formatDateFrench(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Escape les parentheses pour syntaxe PDF
 */
export function esc(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Convertit un nombre entier (EUR) en lettres francaises.
 * Limite : valeurs raisonnables 0 a 999_999.
 */
export function numberToWordsFr(value: number): string {
  const n = Math.round(value);
  if (n === 0) return 'zero euros';
  if (n < 0) return `moins ${numberToWordsFr(-n)}`;

  const units = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
    'dix-sept', 'dix-huit', 'dix-neuf',
  ];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

  function under100(num: number): string {
    if (num < 20) return units[num];
    const t = Math.floor(num / 10);
    const u = num % 10;
    if (t === 7 || t === 9) {
      const base = tens[t];
      return u === 1 ? `${base} et onze` : `${base}-${units[10 + u]}`;
    }
    if (t === 8 && u === 0) return 'quatre-vingts';
    if (u === 0) return tens[t];
    if (u === 1 && t !== 8) return `${tens[t]} et un`;
    return `${tens[t]}-${units[u]}`;
  }

  function under1000(num: number): string {
    if (num < 100) return under100(num);
    const h = Math.floor(num / 100);
    const r = num % 100;
    const hundreds = h === 1 ? 'cent' : `${units[h]} cent${r === 0 ? 's' : ''}`;
    return r === 0 ? hundreds : `${hundreds} ${under100(r)}`;
  }

  if (n < 1000) return `${under1000(n)} euros`;

  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  const thousandsPart = thousands === 1 ? 'mille' : `${under1000(thousands)} mille`;
  if (rest === 0) return `${thousandsPart} euros`;
  return `${thousandsPart} ${under1000(rest)} euros`;
}

// Lalou
