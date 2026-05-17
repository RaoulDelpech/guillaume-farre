/**
 * Tests unitaires - lib/canvas-payment-helpers.ts (Sprint 5)
 *
 * @author Lalou
 */
import { describe, it, expect } from 'vitest';
import {
  computeDepositAmount,
  computeBalanceAmount,
  computeBalanceDueAt,
  isBalanceExpired,
  DEPOSIT_RATIO,
  BALANCE_DUE_DEFAULT_DAYS,
} from '../canvas-payment-helpers';

describe('computeDepositAmount', () => {
  it('30% pour prix rond', () => {
    expect(computeDepositAmount(20000)).toBe(6000);
    expect(computeDepositAmount(10000)).toBe(3000);
    expect(computeDepositAmount(1000)).toBe(300);
  });

  it('arrondi superieur pour montant non rond', () => {
    expect(computeDepositAmount(100)).toBe(30);
    expect(computeDepositAmount(101)).toBe(31); // ceil(30.3) = 31
    expect(computeDepositAmount(333)).toBe(100); // ceil(99.9) = 100
  });

  it('throw si prix invalide', () => {
    expect(() => computeDepositAmount(0)).toThrow();
    expect(() => computeDepositAmount(-100)).toThrow();
    expect(() => computeDepositAmount(NaN)).toThrow();
  });

  it('DEPOSIT_RATIO = 0.3', () => {
    expect(DEPOSIT_RATIO).toBe(0.3);
  });
});

describe('computeBalanceAmount', () => {
  it('balance = prix - deposit pour prix rond', () => {
    expect(computeBalanceAmount(20000)).toBe(14000);
    expect(computeBalanceAmount(10000)).toBe(7000);
  });

  it('utilise depositAmount fourni si present', () => {
    expect(computeBalanceAmount(10000, 3500)).toBe(6500);
  });

  it('garantit total = deposit + balance', () => {
    for (const price of [333, 1234, 9876, 20000]) {
      const deposit = computeDepositAmount(price);
      const balance = computeBalanceAmount(price, deposit);
      expect(deposit + balance).toBe(price);
    }
  });

  it('throw si prix invalide', () => {
    expect(() => computeBalanceAmount(0)).toThrow();
    expect(() => computeBalanceAmount(-100)).toThrow();
  });
});

describe('computeBalanceDueAt', () => {
  it('ajoute 14 jours par defaut', () => {
    const result = computeBalanceDueAt('2026-05-17T10:00:00.000Z');
    expect(result).toBe('2026-05-31T10:00:00.000Z');
  });

  it('respecte le parametre days', () => {
    const result = computeBalanceDueAt('2026-05-17T10:00:00.000Z', 7);
    expect(result).toBe('2026-05-24T10:00:00.000Z');
  });

  it('BALANCE_DUE_DEFAULT_DAYS = 14', () => {
    expect(BALANCE_DUE_DEFAULT_DAYS).toBe(14);
  });

  it('throw si fromIso invalide', () => {
    expect(() => computeBalanceDueAt('not-a-date')).toThrow();
  });
});

describe('isBalanceExpired', () => {
  it('false si due dans le futur', () => {
    const futureIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(isBalanceExpired(futureIso)).toBe(false);
  });

  it('true si due dans le passe', () => {
    const pastIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(isBalanceExpired(pastIso)).toBe(true);
  });

  it('true si due est NaN/invalide', () => {
    expect(isBalanceExpired('not-a-date')).toBe(true);
  });

  it('respecte le parametre now', () => {
    const dueIso = '2026-05-31T10:00:00.000Z';
    expect(isBalanceExpired(dueIso, new Date('2026-05-30T00:00:00.000Z'))).toBe(false);
    expect(isBalanceExpired(dueIso, new Date('2026-06-01T00:00:00.000Z'))).toBe(true);
  });
});
