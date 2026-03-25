import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isRateLimited, getClientIP } from '@/lib/rate-limit';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
  : null;

/**
 * Crée une session de vérification d'identité Stripe Identity.
 * Requis pour les commandes > 10 000 EUR (obligation LCB-FT art).
 *
 * Rate limit: 5 requêtes par IP par minute
 */
export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  // Rate limiting: 5 requêtes par IP par minute
  const clientIP = getClientIP(request);
  const rateLimitKey = `identity:${clientIP}`;

  if (isRateLimited(rateLimitKey, 5, 60000)) {
    console.warn(`[Stripe Identity] Rate limit dépassé pour IP ${clientIP}`);
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez réessayer dans 1 minute.' },
      { status: 429 }
    );
  }

  try {
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      options: {
        document: {
          allowed_types: ['driving_license', 'passport', 'id_card'],
          require_matching_selfie: true,
        },
      },
      metadata: {
        source: 'guillaumefarre.com',
        reason: 'high_value_art_purchase',
      },
    });

    return NextResponse.json({ clientSecret: verificationSession.client_secret });
  } catch (error: any) {
    console.error('[Stripe Identity] Erreur:', error.message);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la vérification' },
      { status: 500 }
    );
  }
}

/**
 * Vérifie le statut d'une session de vérification existante.
 */
export async function GET(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId || !sessionId.startsWith('vs_')) {
    return NextResponse.json({ error: 'session_id invalide' }, { status: 400 });
  }

  try {
    const session = await stripe.identity.verificationSessions.retrieve(sessionId);
    return NextResponse.json({ status: session.status });
  } catch (error: any) {
    console.error('[Stripe Identity] Erreur récupération:', error.message);
    return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
  }
}

// Lalou
