/**
 * GET /api/toiles
 *   Liste publique des toiles avec leur statut. Le prix n'est expose
 *   que si l'appelant possede un cookie VIP `secret` valide (HMAC).
 *   Les visiteurs `normal` et `hidden` recoivent toujours `price: null`
 *   mais voient le statut + la date de fin de reservation, ce qui
 *   permet a tout le monde d'observer qu'une toile a ete prise.
 *
 * @author Lalou
 */

import { NextResponse } from 'next/server';
import { getAccessLevel } from '@/lib/access';
import { readToiles } from '@/lib/reservations-store';

export async function GET() {
  try {
    const accessLevel = await getAccessLevel();
    const canSeePrice = accessLevel === 'secret';

    const toiles = await readToiles();
    const payload = toiles.map((t) => ({
      id: t.id,
      name: t.name,
      title: t.name,
      dimensions: t.dimensions,
      technique: t.technique,
      year: t.year,
      price: canSeePrice ? t.price : null,
      status: t.status ?? 'available',
      reservedUntil: t.reservedUntil ?? null,
      image: t.image ?? null,
    }));

    return NextResponse.json({ toiles: payload });
  } catch (err) {
    console.error('[toiles] GET internal error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
