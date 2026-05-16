/**
 * POST /api/reservations
 *   Cree une reservation pour un VIP authentifie via cookie HMAC.
 *   Verrouille la toile pendant 7 jours en attendant signature + paiement
 *   (Sprints 3+).
 *
 * GET /api/reservations
 *   Liste les reservations — reserve a l'admin.
 *
 * Flow POST :
 *   1. Verifier `getAccessLevel()` est `secret` ou `hidden` (cookie HMAC).
 *   2. Parser + valider le body via reservationBodySchema (Zod strict).
 *   3. Acquerir lock `canvas-{id}` (timeout 5s).
 *   4. Verifier statut courant de la toile (lecture fraiche apres lock).
 *   5. Ecrire la reservation + maj statut toile, liberer lock.
 *   6. Notifier Guillaume (Resend, best-effort).
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { ZodError } from 'zod';
import { requireAdminAuth } from '@/lib/admin/auth';
import { getAccessLevel } from '@/lib/access';
import { acquireLock } from '@/lib/locks';
import { reservationBodySchema } from '@/lib/schemas/reservation';
import {
  type Reservation,
  RESERVATION_PENDING_TTL_DAYS,
  computeExpiresAt,
  findCanvasIndex,
  isCanvasReservable,
  readReservations,
  readToiles,
  writeReservations,
  writeToiles,
} from '@/lib/reservations-store';

const LOCK_TIMEOUT_MS = 5000;

async function notifyGuillaumeBestEffort(reservation: Reservation): Promise<void> {
  // Sprint 5 cablera Resend ici. Pour Sprint 2, on logge proprement.
  console.info(
    `[reservations] Nouvelle reservation ${reservation.id} pour "${reservation.canvasTitle}" (${reservation.email})`,
  );
}

export async function POST(request: NextRequest) {
  const accessLevel = await getAccessLevel();
  if (accessLevel === 'normal') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'validation', details: [{ path: [''], message: 'json.invalid' }] },
      { status: 400 },
    );
  }

  let body: ReturnType<typeof reservationBodySchema.parse>;
  try {
    body = reservationBodySchema.parse(rawBody);
  } catch (err) {
    if (err instanceof ZodError) {
      const details = err.issues.map((i) => ({
        path: i.path.map((p) => String(p)),
        message: i.message,
      }));
      return NextResponse.json({ error: 'validation', details }, { status: 400 });
    }
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  const lockKey = `canvas-${body.canvasId}`;
  const handle = await acquireLock(lockKey, LOCK_TIMEOUT_MS);
  if (!handle) {
    return NextResponse.json({ error: 'try_again' }, { status: 503 });
  }

  try {
    const toiles = await readToiles();
    const idx = findCanvasIndex(toiles, body.canvasId);
    if (idx === -1) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    const toile = toiles[idx];
    if (!isCanvasReservable(toile)) {
      return NextResponse.json(
        {
          error: 'already_reserved',
          reservedUntil: toile.reservedUntil ?? null,
        },
        { status: 409 },
      );
    }

    const reservationId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const expiresAt = computeExpiresAt(RESERVATION_PENDING_TTL_DAYS);

    const reservation: Reservation = {
      id: reservationId,
      canvasId: body.canvasId,
      canvasTitle: toile.name,
      firstName: body.firstName,
      lastName: body.lastName,
      name: `${body.firstName} ${body.lastName}`.trim(),
      email: body.email,
      phone: body.phone,
      address: {
        line1: body.address.line1,
        line2: body.address.line2 || undefined,
        city: body.address.city,
        postalCode: body.address.postalCode,
        country: body.address.country,
      },
      buyerType: body.buyerType,
      siret: body.siret,
      companyName: body.companyName,
      message: body.message && body.message.length > 0 ? body.message : undefined,
      createdAt,
      expiresAt,
      status: 'pending',
    };

    const reservations = await readReservations();
    reservations.push(reservation);
    await writeReservations(reservations);

    toiles[idx] = {
      ...toile,
      status: 'reserved_pending',
      reservationId,
      reservedUntil: expiresAt,
    };
    await writeToiles(toiles);

    await notifyGuillaumeBestEffort(reservation);

    return NextResponse.json(
      {
        id: reservationId,
        canvasId: body.canvasId,
        reservedUntil: expiresAt,
        status: 'pending',
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('[reservations] POST internal error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  } finally {
    await handle.release();
  }
}

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const reservations = await readReservations();
    return NextResponse.json({ reservations });
  } catch (err) {
    console.error('[reservations] GET internal error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
