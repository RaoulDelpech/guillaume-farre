/**
 * POST /api/admin/reservations/[id]/regenerate-balance-link
 *
 * Genere un nouveau token HMAC pour le paiement du solde et envoie un email
 * Resend a l'acheteur avec le lien renouvele. Stamp `balanceLinkLastRegeneratedAt`.
 *
 * Pre-conditions :
 *  - reservation.status === 'partial_paid' (deja avec acompte verse)
 *  - reservation.balanceDueAt defini (echeance solde)
 *  - reservation.depositAmount defini (pour calcul balanceAmount affiche)
 *
 * Comportement degrade :
 *  - Si Resend echoue : on persiste quand meme `balanceLinkLastRegeneratedAt`
 *    et on retourne le `balanceCheckoutUrl` au front pour copy/paste manuel.
 *
 * Auth : cookie `gf_admin` obligatoire.
 *
 * @author Lalou
 */

import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import {
  readReservations,
  readToiles,
  writeReservations,
} from '@/lib/reservations-store';
import { signBalanceToken } from '@/lib/balance-token';
import { sendBalanceLinkReminderEmail } from '@/lib/resend/balance-link-reminder';

function inferSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  return envUrl || 'https://guillaumefarre.com';
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'id manquant' }, { status: 400 });
  }

  const reservations = await readReservations();
  const resIdx = reservations.findIndex((r) => r.id === id);
  if (resIdx === -1) {
    return NextResponse.json({ error: 'Reservation introuvable' }, { status: 404 });
  }
  const reservation = reservations[resIdx];

  if (reservation.status !== 'partial_paid') {
    return NextResponse.json(
      {
        error: `Regeneration de lien autorisee uniquement pour 'partial_paid'. Statut actuel : '${reservation.status}'.`,
      },
      { status: 409 },
    );
  }

  if (!reservation.balanceDueAt) {
    return NextResponse.json(
      { error: 'balanceDueAt manquant sur la reservation' },
      { status: 422 },
    );
  }

  if (typeof reservation.depositAmount !== 'number') {
    return NextResponse.json(
      { error: 'depositAmount manquant sur la reservation' },
      { status: 422 },
    );
  }

  // Recupere prix toile pour calculer balanceAmount affiche dans l'email
  const toiles = await readToiles();
  const toile = toiles.find((t) => String(t.id) === String(reservation.canvasId));
  if (!toile) {
    return NextResponse.json(
      { error: 'Toile associee introuvable' },
      { status: 422 },
    );
  }
  const totalPrice = toile.price;
  const balanceAmount = totalPrice - reservation.depositAmount;

  let token: string;
  try {
    token = signBalanceToken({
      reservationId: reservation.id,
      exp: reservation.balanceDueAt,
    });
  } catch (err) {
    console.error('[regenerate-balance-link] sign error:', err);
    return NextResponse.json(
      { error: 'Echec signature token (MAGIC_LINK_SECRET manquant ?)' },
      { status: 500 },
    );
  }

  const siteUrl = inferSiteUrl();
  const balanceCheckoutUrl = `${siteUrl}/fr/vip/reservation/${reservation.id}/balance?bt=${encodeURIComponent(token)}`;

  const now = new Date().toISOString();
  const updatedReservation = {
    ...reservation,
    balanceLinkLastRegeneratedAt: now,
  };
  reservations[resIdx] = updatedReservation;
  await writeReservations(reservations);

  const emailResult = await sendBalanceLinkReminderEmail({
    to: reservation.email,
    buyerName: reservation.name,
    canvasTitle: reservation.canvasTitle,
    reservationId: reservation.id,
    balanceAmount,
    balanceDueAt: reservation.balanceDueAt,
    balanceCheckoutUrl,
  });

  return NextResponse.json({
    success: true,
    balanceCheckoutUrl,
    emailSent: emailResult.success,
    emailError: emailResult.success ? null : emailResult.error,
    reservation: updatedReservation,
  });
}
