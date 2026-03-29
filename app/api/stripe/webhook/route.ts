import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getGelatoClient } from '@/lib/gelato-client';
import { getPennylaneClient } from '@/lib/pennylane-client';
import { updatePhotoStock } from '@/lib/admin/stock-manager';
import { sendOrderConfirmationEmail, sendPaymentPendingEmail } from '@/lib/resend-client';
import { isEarlyAccess } from '@/lib/early-access';
import { createOrder, updateOrder } from '@/lib/orders';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
  : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Fonction pour envoyer la commande à Gelato
async function sendToGelato(session: Stripe.Checkout.Session) {
  const gelato = getGelatoClient();

  if (!gelato) {
    return null;
  }

  const lineItems = session.line_items?.data || [];
  // @ts-ignore - Shipping details structure changed in Stripe API 2025
  const shippingDetails = session.shipping_details || session.shipping_cost?.address;
  const customerDetails = session.customer_details;

  // Extraire les métadonnées de la session
  const itemsMaterials = session.metadata?.items_materials?.split(',') || [];
  const itemsOrientations = session.metadata?.items_orientations?.split(',') || [];

  // Préparer les items pour Gelato
  const gelatoItems = lineItems.map((item, index) => {
    const productName = item.description || 'Photo Fine Art';
    const format = extractFormatFromDescription(productName);
    const material = itemsMaterials[index] || 'semi-glossy';
    const orientation = itemsOrientations[index] || 'vertical';

    return {
      itemReferenceId: `${session.id}-${index}`,
      productUid: mapFormatToGelatoProduct(format, material, orientation),
      files: [{
        url: extractImageUrl(item),
        type: 'default' as const
      }],
      quantity: item.quantity || 1,
      options: {
        format,
        material,
        orientation,
        paperType: material === 'aluminum' ? 'aluminum' : 'fine_art_matte',
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
function mapFormatToGelatoProduct(format: string, material: string = 'semi-glossy', orientation: string = 'vertical'): string {
  // Utiliser la même logique que dans gelato-client.ts
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

// Extraire l'URL de l'image depuis le line item
function extractImageUrl(item: Stripe.LineItem): string {
  // L'URL de l'image devrait être dans les métadonnées du produit
  // Pour l'instant, on retourne une URL par défaut
  // TODO: Améliorer pour récupérer la vraie URL depuis les métadonnées
  return process.env.NEXT_PUBLIC_SITE_URL + '/images/works/default.jpg';
}

// Fonction pour traiter la commande après paiement réussi
async function processOrder(session: Stripe.Checkout.Session) {
  if (!stripe) {
    console.error('❌ Stripe non configuré');
    return { success: false, error: 'Stripe non configuré' };
  }


  try {
    // Récupérer les détails complets de la session
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details']
    });

    const lineItems = fullSession.line_items?.data || [];
    const customerDetails = fullSession.customer_details;
    // @ts-ignore - Shipping details structure changed in Stripe API 2025
    const shippingDetails = fullSession.shipping_details || fullSession.shipping_cost?.address;

    // Créer commande dans notre système
    const order = await createOrder({
      stripeSessionId: fullSession.id,
      customerEmail: customerDetails?.email || '',
      customerName: customerDetails?.name || 'Client',
      items: lineItems.map(item => ({
        title: item.description || 'Photo Fine Art',
        format: extractFormatFromDescription(item.description || ''),
        frame: extractFrameFromDescription(item.description || ''),
        price: (item.amount_total || 0) / 100,
      })),
      totalAmount: (fullSession.amount_total || 0) / 100,
      status: 'paid',
      paidAt: new Date().toISOString(),
      isEarlyCollector: isEarlyAccess(),
    });

    // Générer ID certificat d'authenticité
    const certificateId = `CERT-${order.orderNumber}-${Date.now()}`;
    await updateOrder(order.orderNumber, { certificateId });


    // Envoyer la commande à Gelato API
    try {
      const gelatoResult = await sendToGelato(fullSession);
      if (gelatoResult?.id) {
        // Mettre à jour commande avec ID Gelato
        await updateOrder(order.orderNumber, {
          gelatoOrderId: gelatoResult.id,
          status: 'processing',
        });
      }
    } catch (error) {
      console.error('⚠️ Gelato order failed, but payment succeeded:', error);
      // On continue même si Gelato échoue, le paiement est réussi
    }

    // Mettre à jour le stock pour les éditions limitées
    const itemsFormats = fullSession.metadata?.items_formats?.split(',') || [];
    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i];
      const format = itemsFormats[i] || extractFormatFromDescription(item.description || '');
      const photoFilename = extractPhotoFilename(item);
      if (photoFilename && isLimitedEdition(item)) {
        await updatePhotoStock(photoFilename, format, item.quantity || 1);
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
          orderNumber: order.orderNumber, // Utiliser notre numéro GF-XXXXXX
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
          isEarlyCollector: isEarlyAccess(),
        });
      } catch (error) {
        console.error('⚠️ Failed to send confirmation email:', error);
        // On continue même si l'email échoue
      }
    }


    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error('❌ Error processing order:', error);
    throw error;
  }
}

// Réserver une commande en attente de virement bancaire
async function reserveOrder(session: Stripe.Checkout.Session) {
  if (!stripe) return;


  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details']
    });

    const lineItems = fullSession.line_items?.data || [];
    const customerDetails = fullSession.customer_details;

    // Envoyer email "virement en attente" au client
    if (customerDetails?.email) {
      try {
        await sendPaymentPendingEmail({
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
        });
      } catch (error) {
        console.error('⚠️ Échec envoi email virement en attente:', error);
      }
    }

  } catch (error) {
    console.error('❌ Erreur réservation commande:', error);
  }
}

// Annuler une réservation après échec de paiement asynchrone
async function cancelReservation(session: Stripe.Checkout.Session) {
  if (!stripe) return;


  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details']
    });

    const customerDetails = fullSession.customer_details;

    // Notifier le client de l'échec
    if (customerDetails?.email) {
      const resend = await import('@/lib/resend-client');
      // Utiliser l'email de problème existant pour notifier l'échec
      try {
        await resend.sendOrderConfirmationEmail({
          to: customerDetails.email,
          customerName: customerDetails.name || 'Client',
          orderNumber: fullSession.id,
          items: [],
          totalAmount: 0,
          shippingAddress: { line1: '', city: '', postalCode: '', country: '' },
        });
      } catch {
        // Silencieux - l'email n'est pas critique ici
      }
    }

  } catch (error) {
    console.error('❌ Erreur annulation réservation:', error);
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
    return;
  }

  // Vérifier si facture existe déjà (éviter duplicatas)
  const exists = await pennylane.invoiceExists(session.id);
  if (exists) {
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
    payment_method: session.payment_method_types?.includes('customer_balance')
      ? 'Virement SEPA'
      : session.payment_method_types?.[0] === 'alma'
        ? 'Alma (paiement fractionné)'
        : 'Carte bancaire',
    external_id: session.id, // Lien unique avec Stripe
  });

}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event: Stripe.Event;

  if (!endpointSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured - webhook rejected');
    return NextResponse.json(
      { error: 'Webhook secret required' },
      { status: 500 }
    );
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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;


      if (session.payment_status === 'paid') {
        // Paiement immédiat (CB, Alma) — traiter la commande
        try {
          await processOrder(session);
        } catch (error) {
          console.error('❌ Failed to process order:', error);
        }
      } else if (session.payment_status === 'unpaid') {
        // Paiement asynchrone (virement SEPA) — réserver l'oeuvre
        try {
          await reserveOrder(session);
        } catch (error) {
          console.error('❌ Failed to reserve order:', error);
        }
      }
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      // Virement SEPA reçu — traiter la commande comme un paiement CB
      const session = event.data.object as Stripe.Checkout.Session;
      try {
        await processOrder(session);
      } catch (error) {
        console.error('❌ Failed to process order after bank transfer:', error);
      }
      break;
    }

    case 'checkout.session.async_payment_failed': {
      // Virement SEPA échoué/expiré — annuler la réservation
      const session = event.data.object as Stripe.Checkout.Session;
      try {
        await cancelReservation(session);
      } catch (error) {
        console.error('❌ Failed to cancel reservation:', error);
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      break;
    }

    default:
  }

  // Toujours retourner 200 pour confirmer la réception
  return NextResponse.json({ received: true });
}

// Lalou