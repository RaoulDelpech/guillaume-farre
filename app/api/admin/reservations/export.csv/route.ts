/**
 * GET /api/admin/reservations/export.csv
 *
 * Export CSV de toutes les reservations (avec filtres optionnels — meme
 * format de query params que GET /api/admin/reservations).
 *
 * Format : RFC 4180-ish, UTF-8 BOM en tete (compatibilite Excel FR).
 * Content-Disposition: attachment force le download cote navigateur.
 *
 * Auth : cookie `gf_admin` obligatoire.
 *
 * @author Lalou
 */

import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { readReservations, readToiles } from '@/lib/reservations-store';
import {
  filterReservations,
  sortReservationsByCreatedDesc,
  reservationsToCsv,
  parseFiltersFromSearchParams,
} from '@/lib/admin/reservations-helpers';

const UTF8_BOM = '\uFEFF';

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

    const csvBody = reservationsToCsv(filtered, priceByCanvasId);
    const body = UTF8_BOM + csvBody;

    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `reservations-vip-${stamp}.csv`;

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[admin/reservations/export.csv] error:', err);
    return NextResponse.json({ error: 'Erreur export' }, { status: 500 });
  }
}
