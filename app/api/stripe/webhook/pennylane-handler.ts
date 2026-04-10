import Stripe from 'stripe';
import { getPennylaneClient } from '@/lib/pennylane-client';

export async function syncToPennylane(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[]
) {
  const pennylane = getPennylaneClient();
  if (!pennylane) return;

  const exists = await pennylane.invoiceExists(session.id);
  if (exists) return;

  const customerDetails = session.customer_details;
  // @ts-ignore - Shipping details structure changed in Stripe API 2025
  const shippingDetails = session.shipping_details || session.shipping_cost?.address;
  const address = shippingDetails?.address || customerDetails?.address;

  const pennylaneLineItems = lineItems.map((item) => ({
    label: item.description || 'Photo Fine Art',
    quantity: item.quantity || 1,
    unit_price: (item.amount_total || 0) / 100,
    vat_rate: pennylane.getVatRate(address?.country || 'FR'),
  }));

  await pennylane.createInvoice({
    date: new Date().toISOString().split('T')[0],
    deadline: new Date().toISOString().split('T')[0],
    customer: {
      name: customerDetails?.name || 'Client anonyme',
      email: customerDetails?.email || undefined,
      address: address?.line1 || undefined,
      postal_code: address?.postal_code || undefined,
      city: address?.city || undefined,
      country_alpha2: address?.country || 'FR',
    },
    line_items: pennylaneLineItems,
    paid: true,
    payment_method: session.payment_method_types?.includes('customer_balance')
      ? 'Virement SEPA'
      : session.payment_method_types?.[0] === 'alma'
        ? 'Alma (paiement fractionné)'
        : 'Carte bancaire',
    external_id: session.id,
  });
}
