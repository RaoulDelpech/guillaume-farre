/**
 * Types pour le client Gelato API
 *
 * @author Lalou
 */

export interface GelatoConfig {
  apiKey: string;
  sandbox?: boolean;
}

export interface GelatoProduct {
  uid: string;
  quantity: number;
}

export interface GelatoRecipient {
  name: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postCode: string;
    country: string;
    state?: string;
  };
}

export interface GelatoOrderItem {
  itemReferenceId: string;
  productUid: string;
  files: {
    url: string;
    type: 'default' | 'preview';
  }[];
  quantity: number;
  options?: {
    format?: string;
    material?: string;
    orientation?: string;
    frame?: 'none' | 'black' | 'white';
    paperType?: string;
    finish?: string;
  };
}

export interface GelatoOrder {
  orderReferenceId: string;
  customerReferenceId?: string;
  currency: string;
  items: GelatoOrderItem[];
  shippingAddress: GelatoRecipient['address'];
  recipient: GelatoRecipient;
  metadata?: Record<string, any>;
}

export interface GelatoOrderResponse {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingUrl?: string;
  estimatedDelivery?: string;
  totalPrice: {
    amount: number;
    currency: string;
  };
}

// Lalou
