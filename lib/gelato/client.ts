/**
 * Client Gelato API - Impression a la demande
 *
 * @author Lalou
 */

import type { GelatoConfig, GelatoOrder, GelatoOrderResponse } from './types';

export class GelatoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: GelatoConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.sandbox
      ? 'https://connect.test.gelato.tech'
      : 'https://connect.live.gelato.tech';
  }

  /**
   * Créer une commande d'impression Gelato
   * Gère automatiquement les cadres : si frame !== 'none', envoie 2 items (frame + poster)
   */
  async createOrder(order: GelatoOrder): Promise<GelatoOrderResponse> {

    try {
      const gelatoItems: any[] = [];

      for (const item of order.items) {
        const hasFrame = item.options?.frame && item.options.frame !== 'none';

        if (hasFrame) {
          const frameSize = this.getFrameSizeInMm(item.options?.format || 'A2');

          gelatoItems.push({
            itemReferenceId: `${item.itemReferenceId}-frame`,
            productUid: this.buildFrameProductUid(frameSize, item.options?.frame || 'black'),
            quantity: item.quantity,
          });

          gelatoItems.push({
            itemReferenceId: `${item.itemReferenceId}-poster`,
            productUid: this.buildPosterProductUid(
              frameSize,
              item.options?.orientation || 'vertical'
            ),
            files: item.files,
            quantity: item.quantity,
          });
        } else {
          gelatoItems.push({
            itemReferenceId: item.itemReferenceId,
            productUid: this.mapFormatToProductUid(
              item.options?.format,
              item.options?.material,
              item.options?.orientation
            ),
            files: item.files,
            quantity: item.quantity,
          });
        }
      }

      const response = await fetch(`${this.baseUrl}/v4/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          orderType: 'order',
          orderReferenceId: order.orderReferenceId,
          customerReferenceId: order.customerReferenceId,
          currency: order.currency,
          items: gelatoItems,
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
          shipmentMethodUid: 'standard',
          metadata: {
            ...order.metadata,
            source: 'guillaume-farre-website',
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Gelato API error:', error);
        throw new Error(`Gelato API error: ${error.message || response.statusText}`);
      }

      const result = await response.json();

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
      console.error('Failed to create Gelato order:', error);
      throw error;
    }
  }

  private getFrameSizeInMm(format: string): string {
    const sizeMap: Record<string, string> = {
      'A2': '420x594-mm',
      'A1': '594x841-mm',
      'A0': '841x1189-mm',
    };
    return sizeMap[format.toUpperCase()] || '420x594-mm';
  }

  private buildFrameProductUid(frameSize: string, frameColor: string): string {
    return `frame_and_poster_product_frs_${frameSize}_frc_${frameColor}_frm_wood_frp_w12xt22-mm_gt_plexiglass`;
  }

  private buildPosterProductUid(posterSize: string, orientation: string): string {
    const orient = orientation === 'horizontal' ? 'hor' : 'ver';
    return `flat_product_pf_${posterSize}_pt_200-gsm-coated-silk_cl_4-0_ct_none_prt_none_${orient}`;
  }

  private mapFormatToProductUid(format?: string, material?: string, orientation?: string): string {
    const orient = orientation === 'horizontal' ? 'hor' : 'ver';
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

  async cancelOrder(orderId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/v4/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
      }
    });

    return response.ok;
  }

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

    return result.products?.filter((p: any) =>
      p.category === 'fine_art' ||
      p.name?.includes('Giclee') ||
      p.name?.includes('Fine Art')
    ) || [];
  }

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

let gelatoClient: GelatoClient | null = null;

export function initGelatoClient(apiKey?: string) {
  if (!apiKey && !process.env.GELATO_API_KEY) {
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
