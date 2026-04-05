import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { requireAdminAuth } from '@/lib/admin/auth';

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

const RESERVATIONS_PATH = path.join(process.cwd(), 'data', 'reservations.json');

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

/**
 * Creer une reservation de toile (accessible aux VIP)
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  try {
    // Verifier le cookie VIP
    const vipCookie = request.cookies.get('gf_vip');
    if (!vipCookie) {
      return NextResponse.json({ error: 'Acces VIP requis' }, { status: 403 });
    }

    const body = await request.json();
    const { canvasTitle, name, email, phone, message } = body;

    // Validation basique
    if (!canvasTitle || !name || !email || !phone) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Validation email simple
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const reservations = await readReservations();

    const reservation: Reservation = {
      id: crypto.randomUUID(),
      canvasTitle: String(canvasTitle).slice(0, 200),
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 30),
      message: message ? String(message).slice(0, 1000) : undefined,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    reservations.push(reservation);
    await writeReservations(reservations);

    return NextResponse.json({ success: true, id: reservation.id });
  } catch {
    return NextResponse.json({ error: 'Erreur reservation' }, { status: 500 });
  }
}

/**
 * Lister les reservations (admin only)
 * @author Lalou
 */
export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const reservations = await readReservations();
    return NextResponse.json({ reservations });
  } catch {
    return NextResponse.json({ error: 'Erreur lecture reservations' }, { status: 500 });
  }
}
