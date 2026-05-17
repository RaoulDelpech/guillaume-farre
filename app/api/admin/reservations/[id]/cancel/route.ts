/**
 * POST /api/admin/reservations/[id]/cancel
 *
 * Marque une reservation comme `cancelled` et libere la toile associee
 * (status -> 'available', reservationId -> null, reservedUntil -> null).
 *
 * Idempotent : si la reservation est deja dans un statut terminal
 * (cancelled / refunded / expired / paid), on refuse 409 plutot que
 * d'overwrite silencieusement.
 *
 * Lock canvas-{canvasId} pour eviter une race avec une autre ecriture sur
 * la toile (signature en cours, webhook Stripe...).
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
  writeToiles,
} from '@/lib/reservations-store';
import { acquireLock } from '@/lib/locks';

const TERMINAL_STATUSES = new Set([
  'cancelled',
  'refunded',
  'paid',
  'expired',
  'declined',
]);

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
  const reservation = reservations.find((r) => r.id === id);
  if (!reservation) {
    return NextResponse.json({ error: 'Reservation introuvable' }, { status: 404 });
  }

  if (TERMINAL_STATUSES.has(reservation.status)) {
    return NextResponse.json(
      {
        error: `Reservation deja en statut '${reservation.status}', impossible d'annuler.`,
      },
      { status: 409 },
    );
  }

  const lock = await acquireLock(`canvas-${reservation.canvasId}`, 5000);
  if (!lock) {
    return NextResponse.json(
      { error: 'Toile occupee, reessayer dans quelques secondes' },
      { status: 503 },
    );
  }
  try {
    // Re-read inside lock pour eviter TOCTOU
    const freshReservations = await readReservations();
    const freshToiles = await readToiles();

    const resIdx = freshReservations.findIndex((r) => r.id === id);
    if (resIdx === -1) {
      return NextResponse.json({ error: 'Reservation introuvable' }, { status: 404 });
    }
    const fresh = freshReservations[resIdx];
    if (TERMINAL_STATUSES.has(fresh.status)) {
      return NextResponse.json(
        { error: `Reservation deja en statut '${fresh.status}'` },
        { status: 409 },
      );
    }

    const updatedReservation = {
      ...fresh,
      status: 'cancelled' as const,
      cancelledAt: new Date().toISOString(),
    };
    freshReservations[resIdx] = updatedReservation;

    const toileIdx = freshToiles.findIndex(
      (t) => String(t.id) === String(fresh.canvasId),
    );
    if (toileIdx !== -1) {
      const t = freshToiles[toileIdx];
      // Ne libere la toile que si elle pointe encore vers cette reservation
      // (defense en profondeur contre les etats divergents).
      if (!t.reservationId || t.reservationId === id) {
        freshToiles[toileIdx] = {
          ...t,
          status: 'available',
          reservationId: null,
          reservedUntil: null,
        };
      }
    }

    await writeReservations(freshReservations);
    await writeToiles(freshToiles);

    return NextResponse.json({
      success: true,
      reservation: updatedReservation,
    });
  } catch (err) {
    console.error('[admin/reservations/[id]/cancel] error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  } finally {
    await lock.release();
  }
}
