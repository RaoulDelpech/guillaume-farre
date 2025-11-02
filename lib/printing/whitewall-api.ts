/**
 * WhiteWall API Integration
 *
 * Service d'impression photo professionnel premium
 * Documentation: https://www.whitewall.com/fr/partners
 */

export interface WhiteWallConfig {
  apiKey: string;
  partnerId: string;
  apiUrl: string;
  testMode: boolean;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string; // ISO code (FR, DE, US, etc.)
  email: string;
  phone: string;
}

export interface WhiteWallProduct {
  type: 'fine-art' | 'alu-dibond' | 'acrylic' | 'canvas';
  format: 'A4' | 'A3' | 'A2' | 'A1' | 'custom';
  width?: number; // En cm (pour format custom)
  height?: number; // En cm (pour format custom)
  frame?: {
    type: 'black-wood' | 'white-wood' | 'aluminum' | 'none';
    passepartout?: boolean;
  };
  finishing?: {
    coating?: 'matte' | 'glossy';
    mounting?: 'wall-mount' | 'frame-mount';
  };
}

export interface WhiteWallOrderItem {
  imageUrl: string; // URL publique de l'image haute résolution
  imageFileName: string;
  product: WhiteWallProduct;
  quantity: number;
  metadata?: {
    artistName: string;
    artworkTitle: string;
    edition?: {
      number: number;
      total: number;
    };
  };
}

export interface WhiteWallOrder {
  items: WhiteWallOrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  customerReference?: string; // Référence interne
  notes?: string;
}

export interface WhiteWallOrderResponse {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
  totalPrice: {
    amount: number;
    currency: string;
  };
}

/**
 * Configuration de l'API WhiteWall
 */
function getConfig(): WhiteWallConfig {
  return {
    apiKey: process.env.WHITEWALL_API_KEY || '',
    partnerId: process.env.WHITEWALL_PARTNER_ID || '',
    apiUrl: process.env.WHITEWALL_API_URL || 'https://api.whitewall.com/v1',
    testMode: process.env.WHITEWALL_TEST_MODE === 'true',
  };
}

/**
 * Vérifier la configuration WhiteWall
 */
export function isWhiteWallConfigured(): boolean {
  const config = getConfig();
  return !!(config.apiKey && config.partnerId && config.apiUrl);
}

/**
 * Créer une commande WhiteWall
 */
export async function createWhiteWallOrder(
  order: WhiteWallOrder
): Promise<WhiteWallOrderResponse> {
  const config = getConfig();

  if (!isWhiteWallConfigured()) {
    throw new Error(
      'WhiteWall API not configured. Please set WHITEWALL_API_KEY and WHITEWALL_PARTNER_ID in .env.local'
    );
  }

  try {
    const response = await fetch(`${config.apiUrl}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Partner-ID': config.partnerId,
      },
      body: JSON.stringify({
        ...order,
        testMode: config.testMode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`WhiteWall API error: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('WhiteWall order creation failed:', error);
    throw error;
  }
}

/**
 * Obtenir le statut d'une commande WhiteWall
 */
export async function getWhiteWallOrderStatus(
  orderId: string
): Promise<WhiteWallOrderResponse> {
  const config = getConfig();

  if (!isWhiteWallConfigured()) {
    throw new Error('WhiteWall API not configured');
  }

  try {
    const response = await fetch(`${config.apiUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'X-Partner-ID': config.partnerId,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get WhiteWall order status:', error);
    throw error;
  }
}

/**
 * Calculer le prix estimé d'un produit WhiteWall
 * (Prix indicatifs - les prix réels sont fournis par l'API)
 */
export function estimateWhiteWallPrice(product: WhiteWallProduct): number {
  const basePrices = {
    'fine-art': {
      A4: 80,
      A3: 120,
      A2: 180,
      A1: 280,
      custom: 200,
    },
    'alu-dibond': {
      A4: 120,
      A3: 180,
      A2: 280,
      A1: 420,
      custom: 300,
    },
    acrylic: {
      A4: 180,
      A3: 280,
      A2: 420,
      A1: 650,
      custom: 450,
    },
    canvas: {
      A4: 100,
      A3: 150,
      A2: 220,
      A1: 350,
      custom: 250,
    },
  };

  let price = basePrices[product.type][product.format] || 0;

  // Ajouter le coût du cadre
  if (product.frame && product.frame.type !== 'none') {
    const framePrices = {
      'black-wood': 50,
      'white-wood': 50,
      aluminum: 80,
    };
    price += framePrices[product.frame.type] || 0;

    if (product.frame.passepartout) {
      price += 30;
    }
  }

  return price;
}

/**
 * Valider une URL d'image pour WhiteWall
 */
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return { valid: false, error: 'URL must start with http:// or https://' };
  }

  const validExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif'];
  const hasValidExtension = validExtensions.some(ext =>
    url.toLowerCase().endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: 'Image must be in JPEG, PNG, or TIFF format',
    };
  }

  return { valid: true };
}

/**
 * Formats disponibles avec dimensions
 */
export const WHITEWALL_FORMATS = {
  A4: { width: 21, height: 29.7, label: 'A4 (21 × 29.7 cm)' },
  A3: { width: 29.7, height: 42, label: 'A3 (29.7 × 42 cm)' },
  A2: { width: 42, height: 59.4, label: 'A2 (42 × 59.4 cm)' },
  A1: { width: 59.4, height: 84.1, label: 'A1 (59.4 × 84.1 cm)' },
} as const;

/**
 * Types de supports disponibles
 */
export const WHITEWALL_MATERIALS = {
  'fine-art': {
    label: 'Papier Fine Art',
    description: 'Papier premium mat 300g/m² - Conservation 100+ ans',
    recommended: true,
  },
  'alu-dibond': {
    label: 'Alu-Dibond',
    description: 'Support aluminium rigide - Effet moderne et lumineux',
    recommended: false,
  },
  acrylic: {
    label: 'Acrylique',
    description: 'Impression derrière acrylique - Effet galerie premium',
    recommended: false,
  },
  canvas: {
    label: 'Toile Canvas',
    description: 'Impression sur toile tendue - Rendu artistique',
    recommended: false,
  },
} as const;
