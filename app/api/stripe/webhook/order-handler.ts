import Stripe from 'stripe';
import { updatePhotoStock } from '@/lib/admin/stock-manager';
import { updateArtEditionStock } from '@/lib/art-editions-stock';
import { sendOrderConfirmationEmail, sendPaymentPendingEmail } from '@/lib/resend-client';
import { createOrder, updateOrder } from '@/lib/orders';
import { sendToGelato } from './gelato-handler';
import { syncToPennylane } from './pennylane-handler';
import { extractFormatFromDescription, extractFrameFromDescription, extractPhotoFilename, isLimitedEdition } from './webhook-utils';

export async function processOrder(stripe: Stripe, session: Stripe.Checkout.Session) {
  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details'],
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
      items: lineItems.map((item) => ({
        title: item.description || 'Photo Fine Art',
        format: extractFormatFromDescription(item.description || ''),
        frame: extractFrameFromDescription(item.description || ''),
        price: (item.amount_total || 0) / 100,
      })),
      totalAmount: (fullSession.amount_total || 0) / 100,
      status: 'paid',
      paidAt: new Date().toISOString(),
    });

    const certificateId = `CERT-${order.orderNumber}-${Date.now()}`;
    await updateOrder(order.orderNumber, { certificateId });

    // Envoyer à Gelato
    try {
      const gelatoResult = await sendToGelato(fullSession);
      if (gelatoResult?.id) {
        await updateOrder(order.orderNumber, { gelatoOrderId: gelatoResult.id, status: 'processing' });
      }
    } catch (error) {
      console.error('Gelato order failed, but payment succeeded:', error);
    }

    // Mettre à jour le stock
    const itemsFormats = fullSession.metadata?.items_formats?.split(',') || [];
    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i];
      const format = itemsFormats[i] || extractFormatFromDescription(item.description || '');
      const photoFilename = extractPhotoFilename(item);
      if (photoFilename && isLimitedEdition(item)) {
        await updatePhotoStock(photoFilename, format, item.quantity || 1);
      }
    }

    // Mettre à jour le stock des éditions d'art (via metadata items_art_edition_ids)
    const artEditionIds = fullSession.metadata?.items_art_edition_ids?.split(',') || [];
    for (let i = 0; i < artEditionIds.length; i++) {
      const aeId = artEditionIds[i];
      if (aeId) {
        await updateArtEditionStock(aeId, lineItems[i]?.quantity || 1);
      }
    }

    // Sync Pennylane
    try {
      await syncToPennylane(fullSession, lineItems);
    } catch (error) {
      console.error('Pennylane sync failed, but order processed:', error);
    }

    // Email de confirmation
    if (customerDetails?.email) {
      try {
        await sendOrderConfirmationEmail({
          to: customerDetails.email,
          customerName: customerDetails.name || 'Client',
          orderNumber: order.orderNumber,
          items: lineItems.map((item) => ({
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
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
      }
    }

    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error('Error processing order:', error);
    throw error;
  }
}

export async function reserveOrder(stripe: Stripe, session: Stripe.Checkout.Session) {
  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details'],
    });

    const lineItems = fullSession.line_items?.data || [];
    const customerDetails = fullSession.customer_details;

    if (customerDetails?.email) {
      try {
        await sendPaymentPendingEmail({
          to: customerDetails.email,
          customerName: customerDetails.name || 'Client',
          orderNumber: fullSession.id,
          items: lineItems.map((item) => ({
            title: item.description || 'Photo Fine Art',
            format: extractFormatFromDescription(item.description || ''),
            frame: extractFrameFromDescription(item.description || ''),
            price: (item.amount_total || 0) / 100,
          })),
          totalAmount: (fullSession.amount_total || 0) / 100,
        });
      } catch (error) {
        console.error('Failed to send pending payment email:', error);
      }
    }
  } catch (error) {
    console.error('Error reserving order:', error);
  }
}

export async function cancelReservation(stripe: Stripe, session: Stripe.Checkout.Session) {
  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer_details'],
    });

    const customerDetails = fullSession.customer_details;

    if (customerDetails?.email) {
      const resend = await import('@/lib/resend-client');
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
        // Email non critique
      }
    }
  } catch (error) {
    console.error('Error cancelling reservation:', error);
  }
}
