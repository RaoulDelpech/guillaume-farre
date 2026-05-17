/**
 * GET /api/reservations/[id]/contract
 *
 * Telecharge le PDF du contrat de vente signe pour une reservation donnee.
 *
 * Auth :
 *  - Cookie VIP niveau `secret` requis (meme niveau que POST /sign).
 *  - Pas de match email <-> cookie : le modele Sprint 3 ne lie pas le cookie
 *    a un acheteur specifique. Toute personne avec un cookie VIP secret peut
 *    donc telecharger n'importe quel contrat. C'est volontaire pour rester
 *    coherent avec la route /sign et la page /confirmation. Un Sprint 5
 *    pourrait ajouter une signature de magic-link contenant l'email.
 *
 * Comportement :
 *  - 200 + application/pdf si le fichier `data/contracts/{id}.pdf` existe.
 *  - 401 si cookie VIP absent ou invalide.
 *  - 404 si la reservation n'existe pas ou si le PDF n'a pas encore ete
 *    genere (cas : reservation `pending` non signee, ou erreur passee
 *    pendant la generation).
 *
 * Le Content-Disposition est `attachment` pour forcer le telechargement
 * (et non l'ouverture in-browser, ce qui simplifie la conservation cote
 * acheteur).
 *
 * @author Lalou
 */
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getAccessLevel } from '@/lib/access';
import { readReservations } from '@/lib/reservations-store';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTRACTS_DIR = path.join(DATA_DIR, 'contracts');

interface RouteParams {
  params: Promise<{ id: string }>;
}

function isSafeReservationId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{8,128}$/.test(id);
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse | Response> {
  const accessLevel = await getAccessLevel();
  if (accessLevel !== 'secret') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id: reservationId } = await params;
  if (!isSafeReservationId(reservationId)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const reservations = await readReservations();
  const reservation = reservations.find((r) => r.id === reservationId);
  if (!reservation) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const contractPath = path.join(CONTRACTS_DIR, `${reservationId}.pdf`);
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await fs.readFile(contractPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: 'contract_not_ready' }, { status: 404 });
    }
    console.error('[reservations/contract] readFile failed', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }

  const filename = `contrat-vente-${reservationId.slice(0, 8)}.pdf`;
  // Convert Buffer to a Uint8Array view backed by an ArrayBuffer for the
  // Web Response body (Node Buffer is accepted by Node runtime but typing
  // is stricter when crossing the Web/Node boundary).
  const arrayBuffer = pdfBuffer.buffer.slice(
    pdfBuffer.byteOffset,
    pdfBuffer.byteOffset + pdfBuffer.byteLength,
  );
  return new Response(arrayBuffer as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(pdfBuffer.byteLength),
      'Cache-Control': 'private, no-store',
    },
  });
}
