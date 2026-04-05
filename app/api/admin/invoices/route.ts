import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Stripe from 'stripe';
import { requireAdminAuth } from '@/lib/admin/auth';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
  : null;

interface Reservation {
  id: string;
  canvasTitle: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'declined' | 'invoiced' | 'paid';
  stripeInvoiceId?: string;
  stripeInvoiceUrl?: string;
  stripeCustomerId?: string;
  paidAt?: string;
  orderNumber?: string;
}

interface Toile {
  id: number;
  name: string;
  dimensions: string;
  technique: string;
  year: number;
  price: number;
  image?: string;
  triptych?: boolean;
  images?: string[];
}

const RESERVATIONS_PATH = path.join(process.cwd(), 'data', 'reservations.json');
const TOILES_PATH = path.join(process.cwd(), 'data', 'toiles.json');

async function readReservations(): Promise<Reservation[]> {
  try {
    const data = await fs.readFile(RESERVATIONS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeReservations(reservations: Reservation[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(RESERVATIONS_PATH, JSON.stringify(reservations, null, 2), 'utf-8');
}

async function readToiles(): Promise<Toile[]> {
  try {
    const data = await fs.readFile(TOILES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Créer une facture Stripe pour une réservation de toile (admin only)
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 });
  }

  try {
    const { reservationId } = await request.json();

    if (!reservationId) {
      return NextResponse.json({ error: 'reservationId requis' }, { status: 400 });
    }

    // Lire réservation
    const reservations = await readReservations();
    const reservation = reservations.find((r) => r.id === reservationId);

    if (!reservation) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });
    }

    if (reservation.status !== 'pending') {
      return NextResponse.json(
        { error: `Réservation déjà ${reservation.status}` },
        { status: 400 }
      );
    }

    // Lire toile correspondante
    const toiles = await readToiles();
    const toile = toiles.find((t) => t.name === reservation.canvasTitle);

    if (!toile) {
      return NextResponse.json({ error: 'Toile introuvable' }, { status: 404 });
    }

    // Créer Customer Stripe
    const customer = await stripe.customers.create({
      name: reservation.name,
      email: reservation.email,
      phone: reservation.phone,
      metadata: {
        source: 'guillaumefarre.com',
        reservationId: reservation.id,
      },
    });

    // Créer Invoice Stripe
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 30,
      metadata: {
        reservationId: reservation.id,
        canvasTitle: toile.name,
        dimensions: toile.dimensions,
        technique: toile.technique,
        year: toile.year.toString(),
      },
      payment_settings: {
        payment_method_types: ['card', 'sepa_debit', 'customer_balance'],
        payment_method_options: {
          customer_balance: {
            bank_transfer: {
              type: 'eu_bank_transfer',
              eu_bank_transfer: {
                country: 'FR',
              },
            },
            funding_type: 'bank_transfer',
          },
        },
      },
    });

    // Ajouter line item (toile)
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: Math.round(toile.price * 100), // Euros → Centimes
      currency: 'eur',
      description: `${toile.name} — ${toile.technique}`,
      metadata: {
        canvasTitle: toile.name,
        dimensions: toile.dimensions,
        technique: toile.technique,
        year: toile.year.toString(),
      },
    });

    // Finaliser invoice
    const finalInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    // Envoyer invoice
    await stripe.invoices.sendInvoice(finalInvoice.id);

    // Mettre à jour réservation
    const updatedReservations = reservations.map((r) =>
      r.id === reservationId
        ? {
            ...r,
            status: 'invoiced' as const,
            stripeInvoiceId: finalInvoice.id,
            stripeInvoiceUrl: finalInvoice.hosted_invoice_url || undefined,
            stripeCustomerId: customer.id,
          }
        : r
    );

    await writeReservations(updatedReservations);

    return NextResponse.json({
      success: true,
      invoiceUrl: finalInvoice.hosted_invoice_url,
      invoiceId: finalInvoice.id,
    });
  } catch (error: any) {
    console.error('[Invoice] Erreur création facture:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur création facture' },
      { status: 500 }
    );
  }
}

/**
 * Lister toutes les réservations avec leur statut (admin only)
 * @author Lalou
 */
export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const reservations = await readReservations();
    const toiles = await readToiles();

    // Enrichir réservations avec infos toile
    const enriched = reservations.map((reservation) => {
      const toile = toiles.find((t) => t.name === reservation.canvasTitle);
      return {
        ...reservation,
        toile: toile
          ? {
              name: toile.name,
              dimensions: toile.dimensions,
              technique: toile.technique,
              price: toile.price,
            }
          : null,
      };
    });

    return NextResponse.json({ reservations: enriched });
  } catch (error) {
    console.error('[Invoice] Erreur lecture réservations:', error);
    return NextResponse.json({ error: 'Erreur lecture réservations' }, { status: 500 });
  }
}

// Lalou
