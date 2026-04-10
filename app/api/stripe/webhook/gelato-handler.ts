import Stripe from 'stripe';
import { getGelatoClient } from '@/lib/gelato-client';
import { extractFormatFromDescription, extractImageUrl } from './webhook-utils';

function mapFormatToGelatoProduct(
  format: string,
  material: string = 'semi-glossy',
  orientation: string = 'vertical'
): string {
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

export async function sendToGelato(session: Stripe.Checkout.Session) {
  const gelato = getGelatoClient();
  if (!gelato) return null;

  const lineItems = session.line_items?.data || [];
  // @ts-ignore - Shipping details structure changed in Stripe API 2025
  const shippingDetails = session.shipping_details || session.shipping_cost?.address;
  const customerDetails = session.customer_details;

  const itemsMaterials = session.metadata?.items_materials?.split(',') || [];
  const itemsOrientations = session.metadata?.items_orientations?.split(',') || [];

  const gelatoItems = lineItems.map((item, index) => {
    const productName = item.description || 'Photo Fine Art';
    const format = extractFormatFromDescription(productName);
    const material = itemsMaterials[index] || 'semi-glossy';
    const orientation = itemsOrientations[index] || 'vertical';

    return {
      itemReferenceId: `${session.id}-${index}`,
      productUid: mapFormatToGelatoProduct(format, material, orientation),
      files: [{ url: extractImageUrl(item), type: 'default' as const }],
      quantity: item.quantity || 1,
      options: {
        format,
        material,
        orientation,
        paperType: material === 'aluminum' ? 'aluminum' : 'fine_art_matte',
        finish: 'none',
      },
    };
  });

  const gelatoOrder = {
    orderReferenceId: session.id,
    customerReferenceId: typeof session.customer === 'string' ? session.customer : undefined,
    currency: 'EUR',
    items: gelatoItems,
    shippingAddress: {
      line1: shippingDetails?.address?.line1 || '',
      line2: shippingDetails?.address?.line2 || undefined,
      city: shippingDetails?.address?.city || '',
      postCode: shippingDetails?.address?.postal_code || '',
      country: shippingDetails?.address?.country || 'FR',
      state: shippingDetails?.address?.state || undefined,
    },
    recipient: {
      name: shippingDetails?.name || customerDetails?.name || 'Client',
      email: customerDetails?.email || '',
      phone: customerDetails?.phone || undefined,
      address: {
        line1: shippingDetails?.address?.line1 || '',
        line2: shippingDetails?.address?.line2 || undefined,
        city: shippingDetails?.address?.city || '',
        postCode: shippingDetails?.address?.postal_code || '',
        country: shippingDetails?.address?.country || 'FR',
        state: shippingDetails?.address?.state || undefined,
      },
    },
    metadata: {
      stripeSessionId: session.id,
      customerEmail: customerDetails?.email,
    },
  };

  try {
    const result = await gelato.createOrder(gelatoOrder);
    return result;
  } catch (error) {
    console.error('Failed to create Gelato order:', error);
    throw error;
  }
}
