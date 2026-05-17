/**
 * POST /api/admin/reservations/[id]/refund
 *
 * Marque une reservation `paid` comme `refunded` et stamp un timestamp
 * `refundedAt` dans le champ libre du status. La toile passe a `available`
 * (l'oeuvre redevient disponible pour vente).
 *
 * IMPORTANT : ne declenche AUCUN remboursement Stripe automatique.
 * Guillaume doit faire le refund manuellement via le Dashboard Stripe.
 * Cette route ne fait que tracer l'evenement cote app.
 *
 * Seules les reservations `paid` peuvent etre `refunded`.
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

  if (reservation.status !== 'paid') {
    return NextResponse.json(
      {
        error: `Seules les reservations 'paid' peuvent etre remboursees. Statut actuel : '${reservation.status}'.`,
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
    const freshReservations = await readReservations();
    const freshToiles = await readToiles();

    const resIdx = freshReservations.findIndex((r) => r.id === id);
    if (resIdx === -1) {
      return NextResponse.json({ error: 'Reservation introuvable' }, { status: 404 });
    }
    const fresh = freshReservations[resIdx];
    if (fresh.status !== 'paid') {
      return NextResponse.json(
        { error: `Statut '${fresh.status}', refund interdit` },
        { status: 409 },
      );
    }

    const updatedReservation = {
      ...fresh,
      status: 'refunded' as const,
      refundedAt: new Date().toISOString(),
    };

    freshReservations[resIdx] = updatedReservation;

    const toileIdx = freshToiles.findIndex(
      (t) => String(t.id) === String(fresh.canvasId),
    );
    if (toileIdx !== -1) {
      const t = freshToiles[toileIdx];
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
    console.error('[admin/reservations/[id]/refund] error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  } finally {
    await lock.release();
  }
}
