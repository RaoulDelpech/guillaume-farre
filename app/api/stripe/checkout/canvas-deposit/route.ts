/**
 * POST /api/stripe/checkout/canvas-deposit
 *
 * Cree une session Stripe Checkout pour le paiement de l'acompte 30% d'une toile VIP
 * deja signee. Sprint 5 (paiement niveau 2, mode `deposit_balance`).
 *
 * Pre-requis :
 *  - Cookie VIP valide (niveau `secret`).
 *  - Reservation en status `signed` (signature electronique deja effectuee)
 *    OU reservation deja en mode `deposit_balance` non encore payee (idempotence).
 *
 * Side-effects (avant redirect Stripe) :
 *  - reservation.paymentMode = 'deposit_balance'
 *  - reservation.depositAmount = depositAmount
 *
 * Le webhook `checkout.session.completed` (metadata.type = `vip-canvas-deposit`)
 * mettra ensuite la reservation en `partial_paid`, fixera balanceDueAt = J+14
 * et enverra l'email de rappel solde.
 *
 * Retour 200 : `{ ok: true, sessionUrl, sessionId, depositAmount, balanceAmount }`.
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
import {
  computeBalanceAmount,
  computeDepositAmount,
} from '@/lib/canvas-payment-helpers';

const STRIPE_API_VERSION = '2025-10-29.clover';
const SUPPORTED_LOCALES = new Set(['fr', 'en', 'it']);

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION })
  : null;

const bodySchema = z.object({
  reservationId: z.string().min(1).max(128),
  locale: z.enum(['fr', 'en', 'it']).optional(),
});

function inferSiteUrl(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (envUrl) return envUrl;
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('host');
  if (host) return `${proto}://${host}`;
  return 'https://guillaumefarre.com';
}

function inferLocale(req: NextRequest, fromBody?: string): 'fr' | 'en' | 'it' {
  if (fromBody && SUPPORTED_LOCALES.has(fromBody)) return fromBody as 'fr' | 'en' | 'it';
  const accept = req.headers.get('accept-language') ?? '';
  const first = accept.split(',')[0]?.trim().slice(0, 2).toLowerCase();
  if (first && SUPPORTED_LOCALES.has(first)) return first as 'fr' | 'en' | 'it';
  return 'fr';
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

  const isSignedFresh = reservation.status === 'signed' && !reservation.paymentMode;
  const isResumingDeposit =
    reservation.paymentMode === 'deposit_balance' && reservation.status === 'signed';

  if (!isSignedFresh && !isResumingDeposit) {
    return NextResponse.json(
      { error: 'invalid_state', currentStatus: reservation.status, paymentMode: reservation.paymentMode },
      { status: 400 },
    );
  }

  const toiles = await readToiles();
  const toile = toiles.find((t) => t.name === reservation.canvasTitle);
  if (!toile) {
    console.error(`[checkout/canvas-deposit] toile not found for reservation ${reservation.id}`);
    return NextResponse.json({ error: 'canvas_not_found' }, { status: 404 });
  }

  if (!Number.isFinite(toile.price) || toile.price <= 0) {
    console.error(
      `[checkout/canvas-deposit] invalid price for toile ${toile.name}: ${toile.price}`,
    );
    return NextResponse.json({ error: 'invalid_price' }, { status: 400 });
  }

  const depositAmount = computeDepositAmount(toile.price);
  const balanceAmount = computeBalanceAmount(toile.price, depositAmount);
  const depositCents = depositAmount * 100;

  const siteUrl = inferSiteUrl(req);
  const locale = inferLocale(req, body.locale);
  const successUrl = `${siteUrl}/${locale}/vip/reservation/${reservation.id}/confirmation?step=deposit&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${siteUrl}/${locale}/vip/reservation/${reservation.id}/checkout`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${reservation.canvasTitle} — Acompte 30%`,
              description: `Toile originale ${toile.dimensions} — Guillaume Farre. Acompte 30%, solde 70% (${balanceAmount} EUR) a regler sous 14 jours.`,
            },
            unit_amount: depositCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'vip-canvas-deposit',
        reservationId: reservation.id,
        canvasId: String(toile.id),
        depositAmountEur: String(depositAmount),
        balanceAmountEur: String(balanceAmount),
      },
      customer_email: reservation.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale,
    });

    const updated: Reservation = {
      ...reservation,
      paymentMode: 'deposit_balance',
      depositAmount,
    };
    reservations[index] = updated;
    await writeReservations(reservations);

    return NextResponse.json({
      ok: true,
      sessionUrl: session.url,
      sessionId: session.id,
      depositAmount,
      balanceAmount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[checkout/canvas-deposit] stripe.checkout.sessions.create failed:', message);
    return NextResponse.json({ error: 'stripe_failed' }, { status: 502 });
  }
}

// Lalou
