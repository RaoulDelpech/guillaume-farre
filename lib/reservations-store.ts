/**
 * Persistance des reservations et des statuts de toiles.
 *
 * - Toutes les ecritures qui modifient `data/toiles.json` doivent etre
 *   serialisees via `acquireLock('canvas-{id}')` (cf. lib/locks.ts).
 * - `data/reservations.json` peut etre append en parallele de toiles
 *   tant qu'on tient deja le lock canvas — un seul flot transactionnel
 *   ecrit la reservation et marque la toile reservee.
 *
 * Ce module est volontairement minimal pour Sprint 2 : create + read +
 * mise a jour du statut de la toile concernee. Sprint 3+ etendra avec
 * sign / payment / expiration sweep.
 *
 * @author Lalou
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { Toile, ToileStatus } from '@/components/toiles/types';

export const RESERVATION_PENDING_TTL_DAYS = 7;

export type ReservationStatus =
  | 'pending'
  | 'signed'
  | 'partial_paid'
  | 'paid'
  | 'expired'
  | 'cancelled'
  | 'refunded'
  | 'confirmed'
  | 'declined'
  | 'invoiced';

export interface ReservationAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Reservation {
  id: string;
  canvasId: number | string;
  canvasTitle: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: ReservationAddress;
  buyerType: 'particulier' | 'professionnel';
  siret?: string;
  companyName?: string;
  message?: string;
  createdAt: string;
  expiresAt: string;
  status: ReservationStatus;
  stripeInvoiceId?: string;
  stripeInvoiceUrl?: string;
  stripeCustomerId?: string;
  paidAt?: string;
  orderNumber?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const RESERVATIONS_PATH = path.join(DATA_DIR, 'reservations.json');
const TOILES_PATH = path.join(DATA_DIR, 'toiles.json');

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readReservations(): Promise<Reservation[]> {
  try {
    const raw = await fs.readFile(RESERVATIONS_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Reservation[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeReservations(reservations: Reservation[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(
    RESERVATIONS_PATH,
    `${JSON.stringify(reservations, null, 2)}\n`,
    'utf-8',
  );
}

export async function readToiles(): Promise<Toile[]> {
  const raw = await fs.readFile(TOILES_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('toiles.json must be an array');
  return parsed as Toile[];
}

export async function writeToiles(toiles: Toile[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(TOILES_PATH, `${JSON.stringify(toiles, null, 2)}\n`, 'utf-8');
}

export function findCanvasIndex(toiles: Toile[], canvasId: number | string): number {
  const target = typeof canvasId === 'string' ? canvasId : String(canvasId);
  return toiles.findIndex((t) => String(t.id) === target);
}

export function computeExpiresAt(ttlDays: number = RESERVATION_PENDING_TTL_DAYS): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + ttlDays);
  return d.toISOString();
}

const BLOCKING_STATUSES: ReadonlySet<ToileStatus> = new Set([
  'reserved_pending',
  'reserved_signed',
  'partial_paid',
  'paid',
  'unavailable',
]);

export function isCanvasReservable(toile: Toile): boolean {
  const status = toile.status ?? 'available';
  return !BLOCKING_STATUSES.has(status);
}
