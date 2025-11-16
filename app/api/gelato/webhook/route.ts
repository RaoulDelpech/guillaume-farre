/**
 * Webhook Gelato - Réception événements impression/expédition
 *
 * Événements reçus :
 * - order.created : Commande créée
 * - order.production : En cours d'impression
 * - order.shipped : Expédié (avec tracking)
 * - order.delivered : Livré
 * - order.cancelled : Annulé
 * - order.on-hold : En attente (problème fichier/qualité)
 *
 * Documentation : https://connect-api.live.gelato.tech/docs/
 *
 * @author Lalou
 */

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  sendShippingNotificationEmail,
  sendDeliveryConfirmationEmail,
  sendOrderProblemEmail,
} from '@/lib/resend-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
});

/**
 * Payload webhook Gelato
 */
interface GelatoWebhookPayload {
  event: string; // Ex: "order.shipped"
  orderId: string; // ID commande Gelato
  orderReferenceId: string; // Notre ID (Stripe session)
  status: string;
  timestamp: string;
  data: {
    tracking?: {
      carrier?: string;
      trackingNumber?: string;
      trackingUrl?: string;
    };
    error?: {
      code: string;
      message: string;
    };
  };
}

/**
 * Valider signature JWT webhook Gelato
 *
 * Gelato envoie JWT token dans header Authorization
 * On doit valider avec public key depuis leur ISS URL
 *
 * Pour simplifier v1, on skip validation (à implémenter en production)
 */
function validateGelatoWebhook(authHeader: string | null): boolean {
  // TODO: Implémenter validation JWT
  // 1. Extraire token depuis "Bearer <token>"
  // 2. Fetch public key depuis Gelato ISS URL
  // 3. Vérifier signature avec jsonwebtoken ou jose
  //
  // Pour l'instant, on accepte tous les webhooks (développement)

  if (!authHeader) {
    console.warn('[Gelato Webhook] Pas d\'Authorization header');
    return false;
  }

  // En production, il faut valider le JWT
  if (process.env.NODE_ENV === 'production') {
    console.warn('[Gelato Webhook] JWT validation pas implémentée (INSECURE)');
    // Retourner false si JWT invalide
  }

  return true; // Accepter pour développement
}

/**
 * Enregistrer événement webhook dans DB ou fichier log
 *
 * Pour l'instant, on log dans console
 * TODO: Stocker dans DB pour historique commandes
 */
async function logWebhookEvent(payload: GelatoWebhookPayload) {
  console.log('[Gelato Webhook] Événement reçu:', {
    event: payload.event,
    orderId: payload.orderId,
    orderReferenceId: payload.orderReferenceId,
    status: payload.status,
    tracking: payload.data?.tracking,
  });

  // TODO: Stocker dans DB
  // await db.gelatoEvents.create({
  //   gelatoOrderId: payload.orderId,
  //   stripeSessionId: payload.orderReferenceId,
  //   event: payload.event,
  //   status: payload.status,
  //   trackingNumber: payload.data?.tracking?.trackingNumber,
  //   trackingUrl: payload.data?.tracking?.trackingUrl,
  //   timestamp: new Date(payload.timestamp),
  // });
}

/**
 * Envoyer email client selon événement
 *
 * - order.shipped → Email avec numéro tracking
 * - order.delivered → Email confirmation livraison + demande avis
 * - order.on-hold → Email alerte problème
 */
async function sendCustomerEmail(payload: GelatoWebhookPayload) {
  const { event, orderReferenceId, data } = payload;

  try {
    // Récupérer email client depuis Stripe session
    const session = await stripe.checkout.sessions.retrieve(orderReferenceId, {
      expand: ['line_items', 'customer_details'],
    });

    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'Client';
    const lineItems = session.line_items?.data || [];

    if (!customerEmail) {
      console.warn('[Gelato Webhook] No customer email found');
      return;
    }

    // Préparer les items pour l'email
    const items = lineItems.map((item) => ({
      title: item.description || 'Photo Fine Art',
      format: extractFormatFromDescription(item.description || ''),
      frame: extractFrameFromDescription(item.description || ''),
    }));

    // Envoyer email selon type événement
    if (event === 'order.shipped' && data.tracking) {
      await sendShippingNotificationEmail({
        to: customerEmail,
        customerName,
        orderNumber: orderReferenceId,
        carrier: data.tracking.carrier || 'Transporteur',
        trackingNumber: data.tracking.trackingNumber || '',
        trackingUrl: data.tracking.trackingUrl || '',
        estimatedDelivery: '2-3 jours',
        items,
      });
      console.log('[Gelato Webhook] 📧 Shipping email sent to:', customerEmail);
    } else if (event === 'order.delivered') {
      await sendDeliveryConfirmationEmail({
        to: customerEmail,
        customerName,
        orderNumber: orderReferenceId,
        items,
      });
      console.log('[Gelato Webhook] 📧 Delivery email sent to:', customerEmail);
    } else if (event === 'order.on-hold' && data.error) {
      await sendOrderProblemEmail({
        to: customerEmail,
        customerName,
        orderNumber: orderReferenceId,
        problemDescription: data.error.message || 'Un problème technique est survenu',
      });
      console.log('[Gelato Webhook] 📧 Problem email sent to:', customerEmail);
    }
  } catch (error) {
    console.error('[Gelato Webhook] Failed to send customer email:', error);
    // On ne throw pas pour ne pas bloquer le webhook
  }
}

// Helper functions
function extractFormatFromDescription(description: string): string {
  const formats = ['A4', 'A3', 'A2', 'A1', 'XXL', 'MONUMENTAL'];
  const found = formats.find((f) => description.toUpperCase().includes(f));
  return found || 'A3';
}

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

/**
 * Handler webhook POST
 */
export async function POST(req: NextRequest) {
  try {
    // Valider signature Gelato
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    if (!validateGelatoWebhook(authHeader)) {
      console.error('[Gelato Webhook] Signature invalide');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parser payload
    const payload: GelatoWebhookPayload = await req.json();

    console.log('[Gelato Webhook] Received:', payload.event);

    // Logger événement
    await logWebhookEvent(payload);

    // Traiter selon type événement
    switch (payload.event) {
      case 'order.created':
        console.log('🎨 Commande créée dans Gelato:', payload.orderId);
        break;

      case 'order.approved':
        console.log('✅ Commande approuvée pour production:', payload.orderId);
        break;

      case 'order.production':
        console.log('🖨️ Impression en cours:', payload.orderId);
        break;

      case 'order.shipped':
        console.log('📦 Expédition confirmée:', {
          orderId: payload.orderId,
          carrier: payload.data?.tracking?.carrier,
          trackingNumber: payload.data?.tracking?.trackingNumber,
        });

        // Envoyer email tracking au client
        await sendCustomerEmail(payload);
        break;

      case 'order.delivered':
        console.log('🎉 Livraison confirmée:', payload.orderId);

        // Envoyer email demande avis
        await sendCustomerEmail(payload);
        break;

      case 'order.cancelled':
        console.log('❌ Commande annulée:', payload.orderId);
        // TODO: Rembourser client si nécessaire
        break;

      case 'order.on-hold':
        console.warn('⚠️ Commande en attente (problème):', {
          orderId: payload.orderId,
          error: payload.data?.error,
        });

        // Alerter Guillaume + envoyer email client
        await sendCustomerEmail(payload);
        break;

      case 'order.error':
        console.error('❌ Erreur commande Gelato:', {
          orderId: payload.orderId,
          error: payload.data?.error,
        });
        break;

      default:
        console.log(`[Gelato Webhook] Événement non géré: ${payload.event}`);
    }

    // Retourner 2xx pour confirmer réception
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Gelato Webhook] Erreur traitement:', error);

    // Retourner 500 → Gelato réessaiera (max 3 fois)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET pour vérifier que le webhook est actif
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'gelato-webhook',
    timestamp: new Date().toISOString(),
  });
}

// Lalou
