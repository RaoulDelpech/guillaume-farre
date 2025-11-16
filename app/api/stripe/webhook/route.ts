import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getGelatoClient } from '@/lib/gelato-client';
import { getPennylaneClient } from '@/lib/pennylane-client';
import { updatePhotoStock } from '@/lib/admin/stock-manager';
import { sendOrderConfirmationEmail } from '@/lib/resend-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Fonction pour envoyer la commande à Gelato
async function sendToGelato(session: Stripe.Checkout.Session) {
  const gelato = getGelatoClient();

  if (!gelato) {
    console.warn('⚠️ Gelato client not configured, skipping print order');
    return null;
  }

  const lineItems = session.line_items?.data || [];
  // @ts-ignore - Shipping details structure changed in Stripe API 2025
  const shippingDetails = session.shipping_details || session.shipping_cost?.address;
  const customerDetails = session.customer_details;

  // Préparer les items pour Gelato
  const gelatoItems = lineItems.map((item, index) => {
    const productName = item.description || 'Photo Fine Art';
    const format = extractFormatFromDescription(productName);

    return {
      itemReferenceId: `${session.id}-${index}`,
      productUid: mapFormatToGelatoProduct(format),
      files: [{
        url: extractImageUrl(item),
        type: 'default' as const
      }],
      quantity: item.quantity || 1,
      options: {
        format,
        paperType: 'fine_art_matte',
        finish: 'none'
      }
    };
  });

  // Créer la commande Gelato
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
      state: shippingDetails?.address?.state || undefined
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
        state: shippingDetails?.address?.state || undefined
      }
    },
    metadata: {
      stripeSessionId: session.id,
      customerEmail: customerDetails?.email
    }
  };

  try {
    const result = await gelato.createOrder(gelatoOrder);
    console.log('🖨️ Gelato order created:', result.id);
    return result;
  } catch (error) {
    console.error('❌ Failed to create Gelato order:', error);
    throw error;
  }
}

// Extraire le format depuis la description du produit
function extractFormatFromDescription(description: string): string {
  const formats = ['A4', 'A3', 'A2', 'A1', 'XXL', 'MONUMENTAL'];
  const found = formats.find(f => description.toUpperCase().includes(f));
  return found || 'A3';
}

// Extraire le type de cadre depuis la description
function extractFrameFromDescription(description: string): string {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('cadre noir') || lowerDesc.includes('black frame')) {
    return 'Cadre noir';
  }
  if (lowerDesc.includes('cadre blanc') || lowerDesc.includes('white frame')) {
    return 'Cadre blanc';
  }
  if (lowerDesc.includes('sans cadre') || lowerDesc.includes('no frame')) {
    return 'Sans cadre';
  }
  return 'Sans cadre';
}

// Mapper le format vers l'ID produit Gelato
function mapFormatToGelatoProduct(format: string): string {
  const map: Record<string, string> = {
    'A4': 'fine_art_paper_matte_200gsm_a4',
    'A3': 'fine_art_paper_matte_200gsm_a3',
    'A2': 'fine_art_paper_matte_200gsm_a2',
    'A1': 'fine_art_paper_matte_200gsm_a1',
    'XXL': 'fine_art_paper_matte_200gsm_80x120cm',
    'MONUMENTAL': 'fine_art_paper_matte_200gsm_120x180cm',
  };
  return map[format] || 'fine_art_paper_matte_200gsm_a3';
}

// Extraire l'URL de l'image depuis le line item
function extractImageUrl(item: Stripe.LineItem): string {
  // L'URL de l'image devrait être dans les métadonnées du produit
  // Pour l'instant, on retourne une URL par défaut
  // TODO: Améliorer pour récupérer la vraie URL depuis les métadonnées
  return process.env.NEXT_PUBLIC_SITE_URL + '/images/works/default.jpg';
}

// Fonction pour traiter la commande après paiement réussi
async function processOrder(session: Stripe.Checkout.Session) {
  console.log('🎉 Processing order for session:', session.id);

  try {
    // Récupérer les détails complets de la session
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details']
    });

    const lineItems = fullSession.line_items?.data || [];
    const customerDetails = fullSession.customer_details;
    // @ts-ignore - Shipping details structure changed in Stripe API 2025
    const shippingDetails = fullSession.shipping_details || fullSession.shipping_cost?.address;

    console.log('📦 Order details:', {
      customer: customerDetails?.email,
      items: lineItems.length,
      shipping: shippingDetails?.address
    });

    // Envoyer la commande à Gelato API
    try {
      await sendToGelato(fullSession);
    } catch (error) {
      console.error('⚠️ Gelato order failed, but payment succeeded:', error);
      // On continue même si Gelato échoue, le paiement est réussi
    }

    // Mettre à jour le stock pour les éditions limitées
    for (const item of lineItems) {
      const photoFilename = extractPhotoFilename(item);
      if (photoFilename && isLimitedEdition(item)) {
        await updatePhotoStock(photoFilename, item.quantity || 1);
      }
    }

    // Créer facture Pennylane automatiquement
    try {
      await syncToPennylane(fullSession, lineItems);
    } catch (error) {
      console.error('⚠️ Pennylane sync failed, but order processed:', error);
      // On continue même si Pennylane échoue
    }

    // Envoyer email de confirmation au client
    if (customerDetails?.email) {
      try {
        await sendOrderConfirmationEmail({
          to: customerDetails.email,
          customerName: customerDetails.name || 'Client',
          orderNumber: fullSession.id,
          items: lineItems.map(item => ({
            title: item.description || 'Photo Fine Art',
            format: extractFormatFromDescription(item.description || ''),
            frame: extractFrameFromDescription(item.description || ''),
            price: (item.amount_total || 0) / 100,
          })),
          totalAmount: (fullSession.amount_total || 0) / 100,
          shippingAddress: {
            line1: shippingDetails?.address?.line1 || '',
            city: shippingDetails?.address?.city || '',
            postalCode: shippingDetails?.address?.postal_code || '',
            country: shippingDetails?.address?.country || 'FR',
          },
        });
        console.log('📧 Confirmation email sent to:', customerDetails.email);
      } catch (error) {
        console.error('⚠️ Failed to send confirmation email:', error);
        // On continue même si l'email échoue
      }
    }

    console.log('✅ Order processed successfully');

    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error('❌ Error processing order:', error);
    throw error;
  }
}

// Extraire le nom du fichier photo depuis le line item
function extractPhotoFilename(item: Stripe.LineItem): string | null {
  // TODO: Améliorer pour récupérer depuis les métadonnées
  const description = item.description || '';
  const match = description.match(/([^\/]+\.(jpg|jpeg|png|webp))/i);
  return match ? match[1] : null;
}

// Vérifier si c'est une édition limitée
function isLimitedEdition(item: Stripe.LineItem): boolean {
  const description = (item.description || '').toLowerCase();
  return description.includes('limitée') ||
         description.includes('limited') ||
         description.includes('edition');
}

// Synchroniser avec Pennylane (comptabilité automatique)
async function syncToPennylane(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[]
) {
  const pennylane = getPennylaneClient();

  if (!pennylane) {
    console.log('[Pennylane] Skipping - not configured');
    return;
  }

  // Vérifier si facture existe déjà (éviter duplicatas)
  const exists = await pennylane.invoiceExists(session.id);
  if (exists) {
    console.log('[Pennylane] Invoice already exists for session', session.id);
    return;
  }

  const customerDetails = session.customer_details;
  // @ts-ignore - Shipping details structure changed in Stripe API 2025
  const shippingDetails = session.shipping_details || session.shipping_cost?.address;
  const address = shippingDetails?.address || customerDetails?.address;

  // Préparer ligne items
  const pennylaneLineItems = lineItems.map((item) => ({
    label: item.description || 'Photo Fine Art',
    quantity: item.quantity || 1,
    unit_price: (item.amount_total || 0) / 100, // Centimes → Euros
    vat_rate: pennylane.getVatRate(address?.country || 'FR'),
  }));

  // Créer facture
  await pennylane.createInvoice({
    date: new Date().toISOString().split('T')[0],
    deadline: new Date().toISOString().split('T')[0], // Payé immédiatement
    customer: {
      name: customerDetails?.name || 'Client anonyme',
      email: customerDetails?.email || undefined,
      address: address?.line1 || undefined,
      postal_code: address?.postal_code || undefined,
      city: address?.city || undefined,
      country_alpha2: address?.country || 'FR',
    },
    line_items: pennylaneLineItems,
    paid: true, // Déjà payé via Stripe
    payment_method: session.payment_method_types?.[0] === 'alma'
      ? 'Alma (paiement fractionné)'
      : 'Carte bancaire',
    external_id: session.id, // Lien unique avec Stripe
  });

  console.log('[Pennylane] Facture créée automatiquement pour session', session.id);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event: Stripe.Event;

  if (!endpointSecret) {
    console.error('⚠️ STRIPE_WEBHOOK_SECRET not configured');
    // En développement sans secret, on peut accepter l'événement sans vérification
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch (err) {
      console.error('❌ Webhook error (parsing):', err);
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }
  } else {
    // En production, vérifier la signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }
  }

  // Traiter les événements selon leur type
  console.log(`📨 Received webhook event: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('💳 Checkout session completed:', session.id);
      console.log('💰 Payment status:', session.payment_status);

      // Si le paiement est réussi, traiter la commande
      if (session.payment_status === 'paid') {
        try {
          await processOrder(session);
        } catch (error) {
          console.error('❌ Failed to process order:', error);
          // On retourne quand même 200 pour éviter que Stripe réessaie
          // mais on log l'erreur pour investigation
        }
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('✅ Payment succeeded:', paymentIntent.id);
      // Ce cas est déjà géré par checkout.session.completed
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('❌ Payment failed:', paymentIntent.id);
      // TODO: Envoyer email d'échec au client
      break;
    }

    default:
      console.log(`⚠️ Unhandled event type: ${event.type}`);
  }

  // Toujours retourner 200 pour confirmer la réception
  return NextResponse.json({ received: true });
}

// Lalou