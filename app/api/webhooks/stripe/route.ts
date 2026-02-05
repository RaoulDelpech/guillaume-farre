import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createWhiteWallOrder } from '@/lib/printing/whitewall-api';
import type { WhiteWallOrder, WhiteWallProduct, ShippingAddress } from '@/lib/printing/whitewall-api';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST /api/webhooks/stripe
 * Webhook Stripe qui envoie automatiquement à WhiteWall après paiement réussi
 */
export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Paiement réussi → Envoyer automatiquement à WhiteWall
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('✅ Paiement réussi:', session.id);
      console.log('📧 Email client:', session.customer_details?.email);
      console.log('💰 Montant:', session.amount_total, session.currency);

      // Récupérer les détails de la commande
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });

      console.log('🛒 Articles:', lineItems.data.length);

      // Construire la commande WhiteWall
      const whitewallItems = lineItems.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
        const metadata = product.metadata;

        // Construire le produit WhiteWall
        const whitewallProduct: WhiteWallProduct = {
          type: metadata.material as any || 'fine-art',
          format: metadata.format === 'custom' ? 'custom' : metadata.format as any || 'A3',
          frame: metadata.frame === 'none' ? undefined : {
            type: metadata.frame as any,
            passepartout: false,
          },
        };

        return {
          imageUrl: `${process.env.NEXT_PUBLIC_SITE_URL}${metadata.photoPath}`,
          imageFileName: metadata.photoPath?.split('/').pop() || 'photo.jpg',
          product: whitewallProduct,
          quantity: item.quantity || 1,
          metadata: {
            artistName: 'Guillaume Farré',
            artworkTitle: product.name,
          },
        };
      });

      // Adresse de livraison depuis Stripe
      // @ts-ignore - Shipping details structure changed in Stripe API 2025
      const shippingDetails = session.shipping_details || session.shipping_cost?.address || session.customer_details;
      const shippingAddress: ShippingAddress = {
        firstName: shippingDetails?.name?.split(' ')[0] || '',
        lastName: shippingDetails?.name?.split(' ').slice(1).join(' ') || '',
        street: shippingDetails?.address?.line1 || '',
        streetNumber: '',
        postalCode: shippingDetails?.address?.postal_code || '',
        city: shippingDetails?.address?.city || '',
        country: shippingDetails?.address?.country || 'FR',
        email: session.customer_details?.email || '',
        phone: shippingDetails?.phone || '',
      };

      const whitewallOrder: WhiteWallOrder = {
        items: whitewallItems,
        shippingAddress,
        customerReference: session.id,
        notes: `Commande automatique depuis guillaumefarre.com - Session ${session.id}`,
      };

      try {
        // 🚀 ENVOI AUTOMATIQUE À WHITEWALL
        const whitewallResponse = await createWhiteWallOrder(whitewallOrder);

        console.log('✅ Commande WhiteWall créée:', whitewallResponse.orderId);
        console.log('📦 Statut:', whitewallResponse.status);
        console.log('💶 Prix WhiteWall:', whitewallResponse.totalPrice);

        // TODO: Envoyer email de confirmation au client avec tracking WhiteWall
        // TODO: Notifier l'artiste de la nouvelle commande

        return NextResponse.json({
          success: true,
          stripeSession: session.id,
          whitewallOrder: whitewallResponse.orderId,
        });
      } catch (whitewallError: any) {
        console.error('❌ Erreur WhiteWall:', whitewallError.message);

        // TODO: Envoyer alerte à l'artiste pour traitement manuel
        // La commande Stripe est payée mais pas encore envoyée à WhiteWall

        return NextResponse.json({
          success: false,
          stripeSession: session.id,
          error: 'WhiteWall order failed - manual processing required',
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
