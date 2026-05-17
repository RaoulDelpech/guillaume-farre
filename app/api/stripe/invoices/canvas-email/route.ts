/**
 * POST /api/stripe/invoices/canvas-email
 *
 * Cree une facture Stripe envoyee par email (collection_method=send_invoice,
 * days_until_due=7). Sprint 5 (paiement niveau 2, mode `invoice_email`).
 *
 * Pre-requis :
 *  - Cookie VIP `secret`.
 *  - Reservation en status `signed`.
 *  - Aucun paymentMode deja choisi (ou deja `invoice_email`, idempotent).
 *
 * Side-effects :
 *  - Stripe Customer cree (ou reutilise via email lookup)
 *  - Stripe Invoice cree avec auto_advance=true (Stripe envoie l'email)
 *  - reservation.paymentMode = 'invoice_email'
 *  - reservation.stripeCustomerId, stripeInvoiceId, stripeInvoiceUrl
 *
 * Quand l'acheteur paye, le webhook `invoice.paid` declenche
 * processCanvasInvoicePaid → status=paid, order cree, email confirmation.
 *
 * Retour 200 : `{ ok: true, invoiceId, invoiceUrl, hostedUrl }`.
 *
 * @author Lalou
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z, ZodError } from 'zod';
import { getAccessLevel } from '@/lib/access';
import {
  readReservations,
  readToiles,
  writeReservations,
  type Reservation,
} from '@/lib/reservations-store';

const STRIPE_API_VERSION = '2025-10-29.clover';
const DAYS_UNTIL_DUE = 7;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION })
  : null;

const bodySchema = z.object({
  reservationId: z.string().min(1).max(128),
  locale: z.enum(['fr', 'en', 'it']).optional(),
});

async function findOrCreateCustomer(email: string, name: string): Promise<string> {
  if (!stripe) throw new Error('stripe_unavailable');
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]) return existing.data[0].id;
  const created = await stripe.customers.create({ email, name });
  return created.id;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!stripe) {
    return NextResponse.json({ error: 'stripe_unavailable' }, { status: 503 });
  }

  const level = await getAccessLevel();
  if (level !== 'secret') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    const raw = await req.json();
    body = bodySchema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: 'validation', details: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const reservations = await readReservations();
  const index = reservations.findIndex((r) => r.id === body.reservationId);
  if (index === -1) {
    return NextResponse.json({ error: 'reservation_not_found' }, { status: 404 });
  }

  const reservation = reservations[index];

  if (reservation.status === 'paid') {
    return NextResponse.json(
      { error: 'invalid_state', currentStatus: reservation.status },
      { status: 400 },
    );
  }

  const isSignedFresh = reservation.status === 'signed' && !reservation.paymentMode;
  const isResumingInvoice =
    reservation.paymentMode === 'invoice_email' && reservation.status === 'signed';

  if (!isSignedFresh && !isResumingInvoice) {
    return NextResponse.json(
      { error: 'invalid_state', currentStatus: reservation.status, paymentMode: reservation.paymentMode },
      { status: 400 },
    );
  }

  const toiles = await readToiles();
  const toile = toiles.find((t) => t.name === reservation.canvasTitle);
  if (!toile) {
    console.error(`[invoices/canvas-email] toile not found for reservation ${reservation.id}`);
    return NextResponse.json({ error: 'canvas_not_found' }, { status: 404 });
  }

  if (!Number.isFinite(toile.price) || toile.price <= 0) {
    return NextResponse.json({ error: 'invalid_price' }, { status: 400 });
  }

  const priceCents = Math.round(toile.price * 100);

  try {
    const customerId =
      reservation.stripeCustomerId ??
      (await findOrCreateCustomer(reservation.email, reservation.name));

    await stripe.invoiceItems.create({
      customer: customerId,
      amount: priceCents,
      currency: 'eur',
      description: `Toile originale « ${reservation.canvasTitle} » — ${toile.dimensions}`,
    });

    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'send_invoice',
      days_until_due: DAYS_UNTIL_DUE,
      auto_advance: true,
      metadata: {
        type: 'vip-canvas-invoice',
        reservationId: reservation.id,
        canvasId: String(toile.id),
      },
    });

    if (!invoice.id) {
      console.error('[invoices/canvas-email] invoice created without id');
      return NextResponse.json({ error: 'invoice_create_failed' }, { status: 502 });
    }

    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);

    const updated: Reservation = {
      ...reservation,
      paymentMode: 'invoice_email',
      stripeCustomerId: customerId,
      stripeInvoiceId: sentInvoice.id,
      stripeInvoiceUrl: sentInvoice.hosted_invoice_url ?? undefined,
    };
    reservations[index] = updated;
    await writeReservations(reservations);

    return NextResponse.json({
      ok: true,
      invoiceId: sentInvoice.id,
      invoiceUrl: sentInvoice.invoice_pdf ?? null,
      hostedUrl: sentInvoice.hosted_invoice_url ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[invoices/canvas-email] stripe operation failed:', message);
    return NextResponse.json({ error: 'stripe_failed', details: message }, { status: 502 });
  }
}

// Lalou
