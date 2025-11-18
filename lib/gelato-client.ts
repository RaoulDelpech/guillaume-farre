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
    material?: string; // semi-glossy ou aluminum
    orientation?: string; // vertical ou horizontal
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
    // URLs officielles Gelato API
    this.baseUrl = config.sandbox
      ? 'https://connect.test.gelato.tech'
      : 'https://connect.live.gelato.tech';
  }

  /**
   * Créer une commande d'impression Gelato
   */
  async createOrder(order: GelatoOrder): Promise<GelatoOrderResponse> {
    console.log('🖨️ Creating Gelato order:', order.orderReferenceId);

    try {
      const response = await fetch(`${this.baseUrl}/v4/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey, // Gelato utilise X-API-KEY (pas X-API-Key)
        },
        body: JSON.stringify({
          orderType: 'order', // 'order' = production réelle, 'draft' = test
          orderReferenceId: order.orderReferenceId,
          customerReferenceId: order.customerReferenceId,
          currency: order.currency,
          items: order.items.map(item => ({
            itemReferenceId: item.itemReferenceId,
            productUid: this.mapFormatToProductUid(
              item.options?.format,
              item.options?.material,
              item.options?.orientation
            ),
            files: item.files,
            quantity: item.quantity,
          })),
          shippingAddress: {
            firstName: order.recipient.name.split(' ')[0] || 'Client',
            lastName: order.recipient.name.split(' ').slice(1).join(' ') || 'Guillaume Farré',
            addressLine1: order.shippingAddress.line1,
            addressLine2: order.shippingAddress.line2,
            city: order.shippingAddress.city,
            postCode: order.shippingAddress.postCode,
            country: order.shippingAddress.country,
            email: order.recipient.email,
            phone: order.recipient.phone,
          },
          shipmentMethodUid: 'standard', // 'standard' ou 'express'
          metadata: {
            ...order.metadata,
            source: 'guillaume-farre-website',
            timestamp: new Date().toISOString()
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
  private mapFormatToProductUid(format?: string, material?: string, orientation?: string): string {
    // Orientation : 'ver' (vertical/portrait) ou 'hor' (horizontal/landscape)
    const orient = orientation === 'horizontal' ? 'hor' : 'ver';

    // Material : 'semi-glossy' (papier) ou 'aluminum'
    const isMetal = material === 'aluminum';

    const formatMap: Record<string, Record<string, string>> = {
      'A2': {
        'semi-glossy-ver': 'flat_a2_200-gsm-80lb-coated-silk_4-0_ver',
        'semi-glossy-hor': 'flat_a2_200-gsm-80lb-coated-silk_4-0_hor',
        'aluminum-ver': 'metallic_400x600-mm-16x24-inch_3-mm_4-0_ver',
        'aluminum-hor': 'metallic_400x600-mm-16x24-inch_3-mm_4-0_hor',
      },
      'A1': {
        'semi-glossy-ver': 'flat_a1_200-gsm-80lb-coated-silk_4-0_ver',
        'semi-glossy-hor': 'flat_a1_200-gsm-80lb-coated-silk_4-0_hor',
        'aluminum-ver': 'metallic_500x750-mm-20x30-inch_3-mm_4-0_ver',
        'aluminum-hor': 'metallic_500x750-mm-20x30-inch_3-mm_4-0_hor',
      },
      'A0': {
        'semi-glossy-ver': 'flat_a0_200-gsm-80lb-coated-silk_4-0_ver',
        'semi-glossy-hor': 'flat_a0_200-gsm-80lb-coated-silk_4-0_hor',
        'aluminum-ver': 'metallic_700x1000-mm-28x40-inch_3-mm_4-0_ver',
        'aluminum-hor': 'metallic_700x1000-mm-28x40-inch_3-mm_4-0_hor',
      },
    };

    const materialKey = isMetal ? 'aluminum' : 'semi-glossy';
    const mapKey = `${materialKey}-${orient}`;
    const formatKey = format?.toUpperCase() || 'A2';

    return formatMap[formatKey]?.[mapKey] || formatMap['A2']['semi-glossy-ver'];
  }

  /**
   * Vérifier le statut d'une commande
   */
  async getOrderStatus(orderId: string): Promise<GelatoOrderResponse> {
    const response = await fetch(`${this.baseUrl}/v4/orders/${orderId}`, {
      headers: {
        'X-API-KEY': this.apiKey,
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
    const response = await fetch(`${this.baseUrl}/v4/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
      }
    });

    return response.ok;
  }

  /**
   * Obtenir la liste des produits disponibles
   */
  async getProducts(country = 'FR'): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/v4/products?country=${country}`, {
      headers: {
        'X-API-KEY': this.apiKey,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get products: ${response.statusText}`);
    }

    const result = await response.json();

    // Filtrer pour ne garder que les produits Fine Art
    return result.products?.filter((p: any) =>
      p.category === 'fine_art' ||
      p.name?.includes('Giclee') ||
      p.name?.includes('Fine Art')
    ) || [];
  }

  /**
   * Calculer le prix d'une commande (sans la créer)
   */
  async calculatePrice(order: Partial<GelatoOrder>): Promise<number> {
    const response = await fetch(`${this.baseUrl}/v4/orders/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
      },
      body: JSON.stringify({
        currency: order.currency || 'EUR',
        items: order.items,
        shippingAddress: {
          country: order.shippingAddress?.country || 'FR'
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