/**
 * Client pour l'API Gelato (impression à la demande)
 * Documentation: https://developers.gelato.com
 *
 * Gelato offre:
 * - Production locale en France
 * - Qualité Fine Art Giclee 12 couleurs
 * - Papier archival 200gsm
 * - Livraison directe au client
 *
 * // Lalou
 */

interface GelatoConfig {
  apiKey: string;
  sandbox?: boolean;
}

interface GelatoProduct {
  uid: string; // ID produit Gelato (ex: fine_art_paper_matte_200gsm)
  quantity: number;
}

interface GelatoRecipient {
  name: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postCode: string;
    country: string; // Code ISO 2 lettres (FR, BE, IT, etc.)
    state?: string;
  };
}

interface GelatoOrderItem {
  itemReferenceId: string; // Notre ID interne
  productUid: string; // ID produit Gelato
  files: {
    url: string; // URL publique de l'image à imprimer
    type: 'default' | 'preview';
  }[];
  quantity: number;
  options?: {
    format?: string; // A3, A2, A1, etc.
    paperType?: string;
    finish?: string;
  };
}

interface GelatoOrder {
  orderReferenceId: string; // Notre ID de commande
  customerReferenceId?: string; // ID client Stripe
  currency: string;
  items: GelatoOrderItem[];
  shippingAddress: GelatoRecipient['address'];
  recipient: GelatoRecipient;
  metadata?: Record<string, any>;
}

interface GelatoOrderResponse {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingUrl?: string;
  estimatedDelivery?: string;
  totalPrice: {
    amount: number;
    currency: string;
  };
}

export class GelatoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: GelatoConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.sandbox
      ? 'https://api-sandbox.gelato.com/v1'
      : 'https://api.gelato.com/v1';
  }

  /**
   * Créer une commande d'impression Gelato
   */
  async createOrder(order: GelatoOrder): Promise<GelatoOrderResponse> {
    console.log('🖨️ Creating Gelato order:', order.orderReferenceId);

    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          order: {
            orderReferenceId: order.orderReferenceId,
            customerReferenceId: order.customerReferenceId,
            currency: order.currency,
            items: order.items.map(item => ({
              itemReferenceId: item.itemReferenceId,
              productUid: this.mapFormatToProductUid(item.options?.format),
              files: item.files,
              quantity: item.quantity,
              options: {
                ...item.options,
                // Ajouter options spécifiques Fine Art
                enhanceColors: true,
                archivalQuality: true
              }
            })),
            shippingAddress: {
              firstName: order.recipient.name.split(' ')[0],
              lastName: order.recipient.name.split(' ').slice(1).join(' '),
              addressLine1: order.shippingAddress.line1,
              addressLine2: order.shippingAddress.line2,
              city: order.shippingAddress.city,
              postCode: order.shippingAddress.postCode,
              country: order.shippingAddress.country,
              email: order.recipient.email,
              phone: order.recipient.phone,
            },
            // Options de livraison
            shipping: {
              service: 'standard', // ou 'express' pour livraison rapide
            },
            // Métadonnées pour tracking
            metadata: {
              ...order.metadata,
              source: 'guillaume-farre-website',
              timestamp: new Date().toISOString()
            }
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Gelato API error:', error);
        throw new Error(`Gelato API error: ${error.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Gelato order created:', result);

      return {
        id: result.orderId,
        status: result.status,
        trackingUrl: result.tracking?.url,
        estimatedDelivery: result.estimatedDelivery,
        totalPrice: {
          amount: result.price?.total || 0,
          currency: order.currency
        }
      };
    } catch (error) {
      console.error('❌ Failed to create Gelato order:', error);
      throw error;
    }
  }

  /**
   * Mapper le format (A3, A2, etc.) vers l'ID produit Gelato
   */
  private mapFormatToProductUid(format?: string): string {
    const formatMap: Record<string, string> = {
      'A4': 'fine_art_paper_matte_200gsm_a4',
      'A3': 'fine_art_paper_matte_200gsm_a3',
      'A2': 'fine_art_paper_matte_200gsm_a2',
      'A1': 'fine_art_paper_matte_200gsm_a1',
      'XXL': 'fine_art_paper_matte_200gsm_80x120cm',
      'MONUMENTAL': 'fine_art_paper_matte_200gsm_120x180cm',
    };

    return formatMap[format?.toUpperCase() || 'A3'] || 'fine_art_paper_matte_200gsm_a3';
  }

  /**
   * Vérifier le statut d'une commande
   */
  async getOrderStatus(orderId: string): Promise<GelatoOrderResponse> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      headers: {
        'X-API-Key': this.apiKey,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get order status: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      id: result.orderId,
      status: result.status,
      trackingUrl: result.tracking?.url,
      estimatedDelivery: result.estimatedDelivery,
      totalPrice: {
        amount: result.price?.total || 0,
        currency: result.currency
      }
    };
  }

  /**
   * Annuler une commande (si pas encore en production)
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
      }
    });

    return response.ok;
  }

  /**
   * Obtenir la liste des produits disponibles
   */
  async getProducts(country = 'FR'): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/products?country=${country}`, {
      headers: {
        'X-API-Key': this.apiKey,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get products: ${response.statusText}`);
    }

    const result = await response.json();

    // Filtrer pour ne garder que les produits Fine Art
    return result.products.filter((p: any) =>
      p.category === 'fine_art' ||
      p.name.includes('Giclee') ||
      p.name.includes('Fine Art')
    );
  }

  /**
   * Calculer le prix d'une commande (sans la créer)
   */
  async calculatePrice(order: Partial<GelatoOrder>): Promise<number> {
    const response = await fetch(`${this.baseUrl}/orders/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({
        order: {
          currency: order.currency || 'EUR',
          items: order.items,
          shippingAddress: {
            country: order.shippingAddress?.country || 'FR'
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to calculate price: ${response.statusText}`);
    }

    const result = await response.json();
    return result.price?.total || 0;
  }
}

// Singleton pour utilisation globale
let gelatoClient: GelatoClient | null = null;

export function initGelatoClient(apiKey?: string) {
  if (!apiKey && !process.env.GELATO_API_KEY) {
    console.warn('⚠️ Gelato API key not configured');
    return null;
  }

  gelatoClient = new GelatoClient({
    apiKey: apiKey || process.env.GELATO_API_KEY!,
    sandbox: process.env.NODE_ENV !== 'production'
  });

  return gelatoClient;
}

export function getGelatoClient(): GelatoClient | null {
  if (!gelatoClient) {
    return initGelatoClient();
  }
  return gelatoClient;
}

// Lalou