/**
 * POST /api/stripe/checkout/canvas-balance
 *
 * Cree une session Stripe Checkout pour le paiement du solde 70% d'une toile VIP
 * deja partial_paid (acompte verse). Sprint 5 (paiement niveau 2, mode `deposit_balance`).
 *
 * Pre-requis :
 *  - Cookie VIP `secret`. Sprint 6 ajoutera un mode token tokenise pour permettre
 *    le paiement depuis l'email sans cookie.
 *  - Reservation en status `partial_paid`.
 *  - Non expire : now < balanceDueAt.
 *
 * Retour 200 : `{ ok: true, sessionUrl, sessionId, balanceAmount }`.
 *
 * @author Lalou
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z, ZodError } from 'zod';
import { getVipSession } from '@/lib/access';
import { readReservations, readToiles } from '@/lib/reservations-store';
import {
  computeBalanceAmount,
  isBalanceExpired,
} from '@/lib/canvas-payment-helpers';
import { verifyBalanceToken } from '@/lib/balance-token';

const STRIPE_API_VERSION = '2025-10-29.clover';
const SUPPORTED_LOCALES = new Set(['fr', 'en', 'it']);

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION })
  : null;

const bodySchema = z.object({
  reservationId: z.string().min(1).max(128),
  locale: z.enum(['fr', 'en', 'it']).optional(),
  // Sprint 6 : fallback HMAC pour acheteur sans cookie VIP (lien email).
  balanceToken: z.string().min(1).max(2048).optional(),
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

  // Lire le body AVANT le check d'auth pour pouvoir consulter `balanceToken`
  // en fallback du cookie VIP.
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

  // Auth : cookie VIP `secret` OU Sprint 6 token HMAC valide pour cette
  // reservation precise. La 2e voie permet de payer le solde depuis le lien
  // email meme si le cookie a ete perdu.
  //
  // Audit hostile mai 2026 - liaison sessionId :
  //   - voie cookie : on EXIGE que session.sessionId match reservation.vipSessionId
  //     (sinon un autre VIP authentifie pouvait declencher le checkout solde
  //     d'une reservation qui n'est pas la sienne et payer pour le proprietaire).
  //   - voie token HMAC : le token est deja lie a reservationId precis (verifie
  //     dans verifyBalanceToken), donc bypass sessionId legitime.
  const session = await getVipSession();
  const hasValidBalanceToken = (() => {
    const v = verifyBalanceToken(body.balanceToken);
    return v.valid && v.reservationId === body.reservationId;
  })();

  if (!hasValidBalanceToken) {
    if (!session || session.level !== 'secret') {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const reservations = await readReservations();
  const reservation = reservations.find((r) => r.id === body.reservationId);
  if (!reservation) {
    return NextResponse.json({ error: 'reservation_not_found' }, { status: 404 });
  }

  // Liaison sessionId : la voie cookie doit matcher la reservation. Bypass
  // si l'auth provient du balanceToken HMAC (deja lie a reservationId).
  if (!hasValidBalanceToken) {
    if (
      !session ||
      !reservation.vipSessionId ||
      reservation.vipSessionId !== session.sessionId
    ) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  if (reservation.status !== 'partial_paid') {
    return NextResponse.json(
      { error: 'invalid_state', currentStatus: reservation.status },
      { status: 400 },
    );
  }

  if (reservation.balanceDueAt && isBalanceExpired(reservation.balanceDueAt)) {
    return NextResponse.json(
      { error: 'balance_expired', balanceDueAt: reservation.balanceDueAt },
      { status: 410 },
    );
  }

  const toiles = await readToiles();
  const toile = toiles.find((t) => t.name === reservation.canvasTitle);
  if (!toile) {
    console.error(`[checkout/canvas-balance] toile not found for reservation ${reservation.id}`);
    return NextResponse.json({ error: 'canvas_not_found' }, { status: 404 });
  }

  const balanceAmount = computeBalanceAmount(toile.price, reservation.depositAmount);
  if (balanceAmount <= 0) {
    console.error(
      `[checkout/canvas-balance] invalid balanceAmount for reservation ${reservation.id}`,
    );
    return NextResponse.json({ error: 'invalid_balance' }, { status: 400 });
  }

  const balanceCents = balanceAmount * 100;
  const siteUrl = inferSiteUrl(req);
  const locale = inferLocale(req, body.locale);
  const successUrl = `${siteUrl}/${locale}/vip/reservation/${reservation.id}/confirmation?step=balance&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${siteUrl}/${locale}/vip/reservation/${reservation.id}/balance`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${reservation.canvasTitle} — Solde 70%`,
              description: `Toile originale ${toile.dimensions} — Guillaume Farre. Solde restant apres acompte 30%.`,
            },
            unit_amount: balanceCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'vip-canvas-balance',
        reservationId: reservation.id,
        canvasId: String(toile.id),
        balanceAmountEur: String(balanceAmount),
      },
      customer_email: reservation.email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale,
    });

    return NextResponse.json({
      ok: true,
      sessionUrl: session.url,
      sessionId: session.id,
      balanceAmount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('[checkout/canvas-balance] stripe.checkout.sessions.create failed:', message);
    return NextResponse.json({ error: 'stripe_failed' }, { status: 502 });
  }
}

// Lalou
