/**
 * GET /api/admin/reservations/[id]
 *
 * Detail d'une reservation pour l'admin. Inclut le snapshot toile correspondant
 * (prix, dimensions, status, technique) pour eviter une seconde requete cote
 * client.
 *
 * Auth : cookie `gf_admin` obligatoire.
 *
 * @author Lalou
 */

import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { readReservations, readToiles } from '@/lib/reservations-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'id manquant' }, { status: 400 });
    }

    const [reservations, toiles] = await Promise.all([
      readReservations(),
      readToiles(),
    ]);

    const reservation = reservations.find((r) => r.id === id);
    if (!reservation) {
      return NextResponse.json({ error: 'Reservation introuvable' }, { status: 404 });
    }

    const toile = toiles.find((t) => String(t.id) === String(reservation.canvasId)) || null;

    return NextResponse.json({ reservation, toile });
  } catch (err) {
    console.error('[admin/reservations/[id]] GET error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
