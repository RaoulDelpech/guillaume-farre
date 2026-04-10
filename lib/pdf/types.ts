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

export interface SaleContractData {
  contractNumber: string;
  date: string;
  buyer: {
    name: string;
    address?: string;
    email: string;
    phone?: string;
  };
  artwork: {
    title: string;
    dimensions: string;
    technique: string;
    year: number;
    price: number;
  };
  paymentMethod: string;
  depositAmount?: number;
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

// Lalou
