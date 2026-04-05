/**
 * API: Telechargement contrat de vente d'oeuvre d'art (toile)
 *
 * GET /api/orders/contract?reservation=UUID&email=xxx@xxx.com
 *
 * Securite: Requiert ID reservation ET email client (ou admin auth)
 * Genere PDF a la volee avec contrat de vente complet
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { generateSaleContractPDF } from '@/lib/pdf-generator';

interface Reservation {
  id: string;
  canvasTitle: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
  status: string;
  stripeInvoiceId?: string;
  paidAt?: string;
}

interface Toile {
  id: number;
  name: string;
  dimensions: string;
  technique: string;
  year: number;
  price: number;
}

const RESERVATIONS_PATH = path.join(process.cwd(), 'data', 'reservations.json');
const TOILES_PATH = path.join(process.cwd(), 'data', 'toiles.json');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get('reservation');
    const email = searchParams.get('email');

    if (!reservationId || !email) {
      return NextResponse.json(
        { error: 'Parametres manquants: reservation et email requis' },
        { status: 400 }
      );
    }

    // Lire reservations
    let reservations: Reservation[] = [];
    try {
      const data = await fs.readFile(RESERVATIONS_PATH, 'utf-8');
      reservations = JSON.parse(data);
    } catch {
      return NextResponse.json({ error: 'Reservation introuvable' }, { status: 404 });
    }

    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) {
      return NextResponse.json({ error: 'Reservation introuvable' }, { status: 404 });
    }

    // Verifier email (securite)
    if (reservation.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'Email incorrect' }, { status: 403 });
    }

    // Trouver la toile correspondante
    let toile: Toile | undefined;
    try {
      const toilesData = await fs.readFile(TOILES_PATH, 'utf-8');
      const toiles: Toile[] = JSON.parse(toilesData);
      toile = toiles.find(t => t.name === reservation.canvasTitle);
    } catch {
      // Fallback si toiles.json absent
    }

    // Generer le contrat
    const contractNumber = `CV-${reservation.id.slice(0, 8).toUpperCase()}`;
    const pdfBuffer = generateSaleContractPDF({
      contractNumber,
      date: reservation.paidAt || reservation.createdAt,
      buyer: {
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
      },
      artwork: {
        title: toile?.name || reservation.canvasTitle,
        dimensions: toile?.dimensions || 'A preciser',
        technique: toile?.technique || 'Peinture par friction automobile sur toile',
        year: toile?.year || new Date().getFullYear(),
        price: toile?.price || 0,
      },
      paymentMethod: reservation.stripeInvoiceId ? 'Facture Stripe' : 'A definir',
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrat-vente-${contractNumber}.pdf"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('[Contract] Erreur generation:', error);
    return NextResponse.json({ error: 'Erreur interne serveur' }, { status: 500 });
  }
}

// Lalou
