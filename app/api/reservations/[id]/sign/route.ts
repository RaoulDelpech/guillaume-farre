/**
 * POST /api/reservations/[id]/sign
 *
 * Signature electronique d'une reservation pending.
 *
 * Flow :
 *   1. Verifier acces VIP (cookie HMAC).
 *   2. Valider body Zod (signatureImage PNG base64 + fullName).
 *   3. Acquerir lock canvas-{canvasId} (timeout 5s, sinon 503).
 *   4. Verifier reservation existe + status === 'pending'.
 *   5. Decoder PNG signature -> JPEG (sharp) pour embedding PDF.
 *   6. Capturer IP, UA, timestamp.
 *   7. Calculer hash + HMAC du contenu juridique structure.
 *   8. Generer PDF, ecrire data/contracts/{id}.pdf.
 *   9. Mettre a jour reservation (status='signed' + champs signature).
 *   10. Mettre a jour toile (status='reserved_signed').
 *   11. Envoyer emails Resend (best-effort, ne bloque pas).
 *   12. Retourner 200 { ok: true, contractHash, signedAt }.
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ZodError } from 'zod';
import { getAccessLevel } from '@/lib/access';
import { acquireLock } from '@/lib/locks';
import { signaturePayloadSchema } from '@/lib/schemas/signature';
import {
  computeContractIntegrity,
  decodeSignatureDataUrl,
  renderSignatureJpeg,
  type ContractLegalContent,
} from '@/lib/contract-signing';
import { generateSaleContractPDF } from '@/lib/pdf/sale-contract';
import {
  type Reservation,
  findCanvasIndex,
  readReservations,
  readToiles,
  writeReservations,
  writeToiles,
} from '@/lib/reservations-store';
import {
  sendSignedContractEmail,
  sendNewSignedReservationEmail,
} from '@/lib/resend/contract-emails';
import { sendPostSignatureCheckoutLink } from '@/lib/resend/post-signature-checkout-link';

const LOCK_TIMEOUT_MS = 5000;
const DATA_DIR = path.join(process.cwd(), 'data');
const CONTRACTS_DIR = path.join(DATA_DIR, 'contracts');

interface RouteParams {
  params: Promise<{ id: string }>;
}

function inferLocaleFromRequest(request: NextRequest): 'fr' | 'en' | 'it' {
  const accept = request.headers.get('accept-language') ?? '';
  const first = accept.split(',')[0]?.trim().slice(0, 2).toLowerCase();
  if (first === 'en' || first === 'it') return first;
  return 'fr';
}

function inferSiteUrlFromRequest(request: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (envUrl) return envUrl;
  const proto = request.headers.get('x-forwarded-proto') ?? 'https';
  const host = request.headers.get('host');
  if (host) return `${proto}://${host}`;
  return 'https://guillaumefarre.com';
}

function extractClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const xreal = request.headers.get('x-real-ip');
  if (xreal) return xreal.trim();
  return 'unknown';
}

function extractUserAgent(request: NextRequest): string {
  const ua = request.headers.get('user-agent') ?? 'unknown';
  return ua.slice(0, 500);
}

function buildLegalContent(
  reservation: Reservation,
  toile: { name: string; dimensions: string; technique: string; year: number; price: number },
  signature: { fullName: string; ip: string; userAgent: string; timestamp: string },
): ContractLegalContent {
  return {
    contractNumber: `GF-${reservation.id.slice(0, 8).toUpperCase()}`,
    date: signature.timestamp,
    paymentMethod: 'A definir (CB integral / acompte + solde / facture par email)',
    buyer: {
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      addressLine1: reservation.address.line1,
      addressLine2: reservation.address.line2,
      city: reservation.address.city,
      postalCode: reservation.address.postalCode,
      country: reservation.address.country,
      buyerType: reservation.buyerType,
      siret: reservation.siret,
      companyName: reservation.companyName,
    },
    artwork: {
      title: toile.name,
      dimensions: toile.dimensions,
      technique: toile.technique,
      year: toile.year,
      price: toile.price,
    },
    signature,
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const accessLevel = await getAccessLevel();
  if (accessLevel === 'normal') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id: reservationId } = await params;
  if (!reservationId || reservationId.length < 8) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
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

  let body: ReturnType<typeof signaturePayloadSchema.parse>;
  try {
    body = signaturePayloadSchema.parse(rawBody);
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

  const decoded = decodeSignatureDataUrl(body.signatureImage);
  if (!decoded) {
    return NextResponse.json(
      { error: 'validation', details: [{ path: ['signatureImage'], message: 'signatureImage.invalid' }] },
      { status: 400 },
    );
  }

  // Localiser la reservation AVANT de verrouiller (lecture preliminaire)
  const reservationsForLookup = await readReservations();
  const preview = reservationsForLookup.find((r) => r.id === reservationId);
  if (!preview) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (preview.status !== 'pending') {
    return NextResponse.json(
      { error: 'already_signed', currentStatus: preview.status },
      { status: 409 },
    );
  }

  const lockKey = `canvas-${preview.canvasId}`;
  const handle = await acquireLock(lockKey, LOCK_TIMEOUT_MS);
  if (!handle) {
    return NextResponse.json({ error: 'try_again' }, { status: 503 });
  }

  try {
    // Re-lire APRES lock pour eviter race condition
    const reservations = await readReservations();
    const idx = reservations.findIndex((r) => r.id === reservationId);
    if (idx === -1) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    const reservation = reservations[idx];
    if (reservation.status !== 'pending') {
      return NextResponse.json(
        { error: 'already_signed', currentStatus: reservation.status },
        { status: 409 },
      );
    }

    const toiles = await readToiles();
    const toileIdx = findCanvasIndex(toiles, reservation.canvasId);
    if (toileIdx === -1) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    const toile = toiles[toileIdx];

    const signedAt = new Date().toISOString();
    const ip = extractClientIp(request);
    const userAgent = extractUserAgent(request);

    const legalContent = buildLegalContent(reservation, toile, {
      fullName: body.fullName,
      ip,
      userAgent,
      timestamp: signedAt,
    });

    const { contractHash, contractHmac } = computeContractIntegrity(legalContent);

    let pdfBuffer: Buffer;
    try {
      const rendered = await renderSignatureJpeg(decoded.pngBuffer);
      pdfBuffer = generateSaleContractPDF({
        contractNumber: legalContent.contractNumber,
        date: signedAt,
        buyer: {
          name: reservation.name,
          address: [
            reservation.address.line1,
            reservation.address.line2,
            `${reservation.address.postalCode} ${reservation.address.city}`,
            reservation.address.country,
          ]
            .filter(Boolean)
            .join(', '),
          email: reservation.email,
          phone: reservation.phone,
          buyerType: reservation.buyerType,
          siret: reservation.siret,
          companyName: reservation.companyName,
        },
        artwork: {
          title: toile.name,
          dimensions: toile.dimensions,
          technique: toile.technique,
          year: toile.year,
          price: toile.price,
        },
        paymentMethod: legalContent.paymentMethod,
        signature: {
          jpegBuffer: rendered.jpegBuffer,
          jpegWidth: rendered.jpegWidth,
          jpegHeight: rendered.jpegHeight,
          fullName: body.fullName,
          ip,
          userAgent,
          timestamp: signedAt,
          contractHash,
          contractHmac,
        },
      });
    } catch (err) {
      console.error('[reservations/sign] PDF generation failed', err);
      return NextResponse.json({ error: 'pdf_failed' }, { status: 500 });
    }

    await fs.mkdir(CONTRACTS_DIR, { recursive: true });
    const contractPath = path.join(CONTRACTS_DIR, `${reservationId}.pdf`);
    await fs.writeFile(contractPath, pdfBuffer);
    const relativePath = path.relative(process.cwd(), contractPath);

    reservations[idx] = {
      ...reservation,
      status: 'signed',
      signedAt,
      signatureIp: ip,
      signatureUserAgent: userAgent,
      signatureFullName: body.fullName,
      contractHash,
      contractHmac,
      contractPath: relativePath,
    };
    await writeReservations(reservations);

    toiles[toileIdx] = {
      ...toile,
      status: 'reserved_signed',
    };
    await writeToiles(toiles);

    const siteUrl = inferSiteUrlFromRequest(request);
    const locale = inferLocaleFromRequest(request);
    const checkoutUrl = `${siteUrl}/${locale}/vip/reservation/${reservationId}/checkout`;

    // Best-effort emails
    void Promise.allSettled([
      sendSignedContractEmail({
        to: reservation.email,
        buyerName: reservation.name,
        canvasTitle: toile.name,
        reservationId,
        contractPdfBuffer: pdfBuffer,
      }),
      sendNewSignedReservationEmail({
        reservationId,
        buyerName: reservation.name,
        buyerEmail: reservation.email,
        canvasTitle: toile.name,
        pricedEUR: toile.price,
        signedAt,
        contractPdfBuffer: pdfBuffer,
      }),
      sendPostSignatureCheckoutLink({
        to: reservation.email,
        buyerName: reservation.name,
        canvasTitle: toile.name,
        reservationId,
        checkoutUrl,
      }),
    ]).then((results) => {
      for (const r of results) {
        if (r.status === 'rejected') {
          console.error('[reservations/sign] email rejected', r.reason);
        } else if (!r.value.success) {
          console.warn('[reservations/sign] email failed', r.value.error);
        }
      }
    });

    return NextResponse.json(
      {
        ok: true,
        reservationId,
        contractHash,
        signedAt,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('[reservations/sign] internal error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  } finally {
    await handle.release();
  }
}
