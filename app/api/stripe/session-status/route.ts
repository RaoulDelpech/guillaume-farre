import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isRateLimited, getClientIP } from '@/lib/rate-limit';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
  : null;

/**
 * Vérifie le statut de paiement d'une session Stripe Checkout.
 * Utilisé côté client pour différencier CB (paid) et virement SEPA (unpaid/pending).
 */
export async function GET(req: NextRequest) {
  // Rate limiting: 100 req/min
  const clientIP = getClientIP(req);
  if (isRateLimited(`stripe-session-status:${clientIP}`, 100, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'session_id invalide' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      payment_status: session.payment_status, // 'paid' | 'unpaid' | 'no_payment_required'
      status: session.status,                 // 'complete' | 'expired' | 'open'
    });
  } catch (error: any) {
    console.error('[Stripe] Erreur récupération session:', error.message);
    return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
  }
}

// Lalou
