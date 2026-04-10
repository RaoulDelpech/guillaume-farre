import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { processOrder, reserveOrder, cancelReservation } from './order-handler';
import { processCanvasInvoicePaid } from './canvas-handler';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
  : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured - webhook rejected');
    return NextResponse.json({ error: 'Webhook secret required' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid') {
        try { await processOrder(stripe, session); }
        catch (error) { console.error('Failed to process order:', error); }
      } else if (session.payment_status === 'unpaid') {
        try { await reserveOrder(stripe, session); }
        catch (error) { console.error('Failed to reserve order:', error); }
      }
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session;
      try { await processOrder(stripe, session); }
      catch (error) { console.error('Failed to process order after bank transfer:', error); }
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      try { await cancelReservation(stripe, session); }
      catch (error) { console.error('Failed to cancel reservation:', error); }
      break;
    }

    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
      break;

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.metadata?.reservationId) {
        try { await processCanvasInvoicePaid(invoice); }
        catch (error) { console.error('Failed to process canvas invoice payment:', error); }
      }
      break;
    }

    default:
  }

  return NextResponse.json({ received: true });
}
