/**
 * GET /api/admin/reservations
 *
 * Liste des reservations (toutes statuts) avec filtres optionnels :
 *  - `status=pending,paid`     : multi-valeurs CSV
 *  - `mode=integral`           : mode paiement
 *  - `canvasId=7`              : une toile
 *  - `search=jean`             : nom, email, orderNumber, id, canvasTitle
 *
 * Renvoie egalement les stats agregees et la liste des toiles
 * (pour le dropdown filter UI cote client).
 *
 * Auth : cookie `gf_admin` obligatoire (cf. lib/admin/auth).
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import {
  readReservations,
  readToiles,
} from '@/lib/reservations-store';
import {
  filterReservations,
  sortReservationsByCreatedDesc,
  computeReservationStats,
  parseFiltersFromSearchParams,
} from '@/lib/admin/reservations-helpers';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const [reservations, toiles] = await Promise.all([
      readReservations(),
      readToiles(),
    ]);

    const priceByCanvasId = new Map<string, number>();
    for (const t of toiles) {
      priceByCanvasId.set(String(t.id), t.price);
    }

    const url = new URL(request.url);
    const filters = parseFiltersFromSearchParams(url.searchParams);

    const filtered = sortReservationsByCreatedDesc(
      filterReservations(reservations, filters),
    );

    const stats = computeReservationStats(reservations, priceByCanvasId);

    return NextResponse.json({
      reservations: filtered,
      stats,
      toiles: toiles.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
      })),
    });
  } catch (err) {
    console.error('[admin/reservations] GET error:', err);
    return NextResponse.json(
      { error: 'Erreur chargement reservations' },
      { status: 500 },
    );
  }
}
