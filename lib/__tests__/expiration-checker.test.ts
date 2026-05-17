/**
 * Tests pour lib/expiration-checker.ts (Sprint 6).
 *
 * Couvre tous les chemins de bascule expired + idempotence sur statuts
 * terminaux. Le helper etant pure (pas de persistance), les tests sont
 * synchrones et deterministes via `now` injecte.
 *
 * @author Lalou
 */
import { describe, expect, it } from 'vitest';
import { checkAndMarkExpired } from '../expiration-checker';
import type { Reservation } from '../reservations-store';
import type { Toile } from '../../components/toiles/types';

const NOW = new Date('2026-06-01T12:00:00.000Z');
const PAST = '2026-05-01T00:00:00.000Z';
const FUTURE = '2026-12-01T00:00:00.000Z';

function baseReservation(overrides: Partial<Reservation> = {}): Reservation {
  return {
    id: 'res-1',
    canvasId: 1,
    canvasTitle: 'Klein',
    firstName: 'Jean',
    lastName: 'Dupont',
    name: 'Jean Dupont',
    email: 'jean@example.org',
    phone: '+33612345678',
    address: { line1: '1 rue X', city: 'Paris', postalCode: '75001', country: 'FR' },
    buyerType: 'particulier',
    createdAt: '2026-04-01T00:00:00.000Z',
    expiresAt: FUTURE,
    status: 'signed',
    ...overrides,
  };
}

function baseToile(overrides: Partial<Toile> = {}): Toile {
  return {
    id: 1,
    name: 'Klein',
    dimensions: '100x130 cm',
    technique: 'Acrylique sur toile',
    year: 2026,
    price: 20000,
    status: 'reserved_signed',
    reservationId: 'res-1',
    reservedUntil: FUTURE,
    ...overrides,
  };
}

describe('checkAndMarkExpired', () => {
  describe('idempotence sur statuts terminaux', () => {
    it.each(['paid', 'cancelled', 'refunded', 'expired', 'declined'] as const)(
      'no-op si status = %s',
      (status) => {
        const r = baseReservation({ status, expiresAt: PAST });
        const t = baseToile();
        const result = checkAndMarkExpired(r, t, NOW);
        expect(result.wasExpired).toBe(false);
        expect(result.reservation).toBe(r);
        expect(result.toile).toBe(t);
      },
    );
  });

  describe('reservation signed', () => {
    it('expire si expiresAt < now', () => {
      const r = baseReservation({ status: 'signed', expiresAt: PAST });
      const t = baseToile();
      const result = checkAndMarkExpired(r, t, NOW);
      expect(result.wasExpired).toBe(true);
      expect(result.reservation.status).toBe('expired');
      expect(result.toile.status).toBe('available');
      expect(result.toile.reservationId).toBeNull();
      expect(result.toile.reservedUntil).toBeNull();
    });

    it('reste signed si expiresAt > now', () => {
      const r = baseReservation({ status: 'signed', expiresAt: FUTURE });
      const t = baseToile();
      const result = checkAndMarkExpired(r, t, NOW);
      expect(result.wasExpired).toBe(false);
      expect(result.reservation.status).toBe('signed');
    });
  });

  describe('reservation partial_paid', () => {
    it('expire si balanceDueAt < now', () => {
      const r = baseReservation({
        status: 'partial_paid',
        balanceDueAt: PAST,
        expiresAt: PAST,
      });
      const t = baseToile({ status: 'partial_paid' });
      const result = checkAndMarkExpired(r, t, NOW);
      expect(result.wasExpired).toBe(true);
      expect(result.reservation.status).toBe('expired');
      expect(result.toile.status).toBe('available');
    });

    it('reste partial_paid si balanceDueAt > now', () => {
      const r = baseReservation({
        status: 'partial_paid',
        balanceDueAt: FUTURE,
      });
      const t = baseToile({ status: 'partial_paid' });
      const result = checkAndMarkExpired(r, t, NOW);
      expect(result.wasExpired).toBe(false);
    });

    it('fallback sur expiresAt si balanceDueAt absent', () => {
      const r = baseReservation({
        status: 'partial_paid',
        balanceDueAt: undefined,
        expiresAt: PAST,
      });
      const t = baseToile({ status: 'partial_paid' });
      const result = checkAndMarkExpired(r, t, NOW);
      expect(result.wasExpired).toBe(true);
    });

    it('no-op si ni balanceDueAt ni expiresAt valides (degrade)', () => {
      const r = baseReservation({
        status: 'partial_paid',
        balanceDueAt: 'not-a-date',
        expiresAt: 'not-a-date',
      });
      const t = baseToile({ status: 'partial_paid' });
      const result = checkAndMarkExpired(r, t, NOW);
      expect(result.wasExpired).toBe(false);
    });
  });

  describe('reservation pending', () => {
    it('expire si expiresAt < now', () => {
      const r = baseReservation({ status: 'pending', expiresAt: PAST });
      const t = baseToile({ status: 'reserved_pending' });
      const result = checkAndMarkExpired(r, t, NOW);
      expect(result.wasExpired).toBe(true);
      expect(result.toile.status).toBe('available');
    });
  });

  describe('immuabilite', () => {
    it('ne mute pas la reservation/toile d entree (purete)', () => {
      const r = baseReservation({ status: 'signed', expiresAt: PAST });
      const t = baseToile();
      const rCopy = JSON.parse(JSON.stringify(r));
      const tCopy = JSON.parse(JSON.stringify(t));
      checkAndMarkExpired(r, t, NOW);
      expect(r).toEqual(rCopy);
      expect(t).toEqual(tCopy);
    });

    it('idempotent : appel sur resultat = no-op', () => {
      const r = baseReservation({ status: 'signed', expiresAt: PAST });
      const t = baseToile();
      const r1 = checkAndMarkExpired(r, t, NOW);
      const r2 = checkAndMarkExpired(r1.reservation, r1.toile, NOW);
      expect(r2.wasExpired).toBe(false);
      expect(r2.reservation.status).toBe('expired');
    });
  });
});

// Lalou
