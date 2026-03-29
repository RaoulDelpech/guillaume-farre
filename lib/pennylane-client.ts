/**
 * Pennylane API Client
 * Documentation: https://pennylane.readme.io/
 *
 * Gestion automatique comptabilité :
 * - Création factures depuis Stripe
 * - Synchronisation paiements
 * - Export comptable
 */

interface PennylaneCustomer {
  name: string;
  email?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country_alpha2?: string;
}

interface PennylaneLineItem {
  label: string;
  quantity: number;
  unit_price: number; // En euros (pas centimes)
  vat_rate: string; // 'FR_200' = TVA 20% France
}

interface PennylaneInvoice {
  date: string; // Format: YYYY-MM-DD
  deadline: string; // Format: YYYY-MM-DD
  customer: PennylaneCustomer;
  line_items: PennylaneLineItem[];
  paid: boolean;
  payment_method?: string;
  external_id?: string; // Lien avec Stripe session ID
}

export class PennylaneClient {
  private apiKey: string;
  private baseUrl = 'https://app.pennylane.com/api/external/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PENNYLANE_API_KEY || '';

    if (!this.apiKey) {
    }
  }

  /**
   * Vérifier si Pennylane est configuré
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Créer une facture client
   */
  async createInvoice(invoice: PennylaneInvoice): Promise<any> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/customer_invoices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: {
            ...invoice,
            // Assurer format dates correct
            date: this.formatDate(invoice.date),
            deadline: this.formatDate(invoice.deadline),
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Pennylane API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.invoice;

    } catch (error) {
      console.error('[Pennylane] Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Vérifier si une facture existe déjà (par external_id)
   */
  async invoiceExists(externalId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(
        `${this.baseUrl}/customer_invoices?filter[external_id]=${externalId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      if (!response.ok) return false;

      const data = await response.json();
      return data.invoices && data.invoices.length > 0;

    } catch (error) {
      console.error('[Pennylane] Error checking invoice:', error);
      return false;
    }
  }

  /**
   * Formater date au format YYYY-MM-DD
   */
  private formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      // Si déjà au bon format, retourner tel quel
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
      date = new Date(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Obtenir taux TVA selon pays
   */
  getVatRate(countryCode: string = 'FR'): string {
    const rates: Record<string, string> = {
      'FR': 'FR_200', // France 20%
      'BE': 'BE_210', // Belgique 21%
      'IT': 'IT_220', // Italie 22%
      'ES': 'ES_210', // Espagne 21%
      'DE': 'DE_190', // Allemagne 19%
      'CH': 'CH_077', // Suisse 7.7%
      'GB': 'GB_200', // UK 20%
    };

    return rates[countryCode] || 'FR_200'; // Défaut France
  }
}

/**
 * Obtenir instance client Pennylane
 */
export function getPennylaneClient(): PennylaneClient | null {
  const apiKey = process.env.PENNYLANE_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new PennylaneClient(apiKey);
}

// Lalou
