/**
 * API endpoint: Tracking de commande
 *
 * GET /api/orders/track?order=GF-XXXXXX&email=xxx@xxx.com
 *
 * Sécurité: requiert à la fois le numéro de commande ET l'email
 * pour empêcher énumération des commandes.
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/orders';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('order');
    const email = searchParams.get('email');

    // Validation: les deux paramètres sont requis
    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Paramètres manquants: order et email requis' },
        { status: 400 }
      );
    }

    // Validation format numéro de commande
    if (!orderNumber.match(/^GF-\d+$/)) {
      return NextResponse.json(
        { error: 'Format de numéro de commande invalide' },
        { status: 400 }
      );
    }

    // Rechercher la commande
    const order = await getOrder(orderNumber);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    // Vérifier que l'email correspond (sécurité)
    if (order.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    // Retourner commande (sans stripeSessionId pour sécurité)
    const { stripeSessionId, ...safeOrder } = order;

    return NextResponse.json({
      success: true,
      order: safeOrder,
    });
  } catch (error) {
    console.error('[Orders API] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Lalou
