/**
 * Tests pour lib/balance-token.ts (Sprint 6).
 *
 * Couvre : round-trip sign/verify, tampering du payload, tampering de la
 * signature, expiration, purpose mismatch (token forge pour autre usage),
 * format invalide.
 *
 * @author Lalou
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import crypto from 'crypto';
import {
  signBalanceToken,
  verifyBalanceToken,
  BALANCE_TOKEN_PURPOSE,
} from '../balance-token';

const FAKE_SECRET = 'test-secret-balance-token-do-not-use-in-prod';
const OTHER_SECRET = 'another-secret-key-different';

let originalSecret: string | undefined;

beforeAll(() => {
  originalSecret = process.env.MAGIC_LINK_SECRET;
  process.env.MAGIC_LINK_SECRET = FAKE_SECRET;
});

afterEach(() => {
  process.env.MAGIC_LINK_SECRET = FAKE_SECRET;
});

describe('signBalanceToken', () => {
  it('produit un token au format base64url.base64url', () => {
    const exp = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const token = signBalanceToken({ reservationId: 'res-123', exp });
    const parts = token.split('.');
    expect(parts).toHaveLength(2);
    expect(parts[0]).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(parts[1]).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('throw si reservationId vide', () => {
    const exp = new Date(Date.now() + 1000).toISOString();
    expect(() => signBalanceToken({ reservationId: '', exp })).toThrow();
  });

  it('throw si exp invalide', () => {
    expect(() =>
      signBalanceToken({ reservationId: 'res-1', exp: 'not-a-date' }),
    ).toThrow();
  });

  it('throw si MAGIC_LINK_SECRET absent', () => {
    delete process.env.MAGIC_LINK_SECRET;
    const exp = new Date(Date.now() + 1000).toISOString();
    expect(() => signBalanceToken({ reservationId: 'res-1', exp })).toThrow();
  });
});

describe('verifyBalanceToken', () => {
  it('round-trip : sign puis verify renvoie le reservationId', () => {
    const exp = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const token = signBalanceToken({ reservationId: 'res-abc', exp });
    const result = verifyBalanceToken(token);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.reservationId).toBe('res-abc');
    }
  });

  it('reject token undefined', () => {
    const result = verifyBalanceToken(undefined);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('invalid_format');
  });

  it('reject token vide', () => {
    const result = verifyBalanceToken('');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('invalid_format');
  });

  it("reject token sans point separateur", () => {
    const result = verifyBalanceToken('aaaa');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('invalid_format');
  });

  it('reject token avec payload tampere (signature ne correspond plus)', () => {
    const exp = new Date(Date.now() + 1000 * 3600).toISOString();
    const token = signBalanceToken({ reservationId: 'res-1', exp });
    const [, signature] = token.split('.');
    // Forger un nouveau payload mais reutiliser l'ancienne signature
    const forgedPayload = Buffer.from(
      JSON.stringify({ reservationId: 'res-EVIL', exp, purpose: 'balance' }),
    ).toString('base64url');
    const forged = `${forgedPayload}.${signature}`;
    const result = verifyBalanceToken(forged);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('invalid_signature');
  });

  it('reject token avec signature tamperee', () => {
    const exp = new Date(Date.now() + 1000 * 3600).toISOString();
    const token = signBalanceToken({ reservationId: 'res-1', exp });
    const [data] = token.split('.');
    const fakeSig = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const result = verifyBalanceToken(`${data}.${fakeSig}`);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('invalid_signature');
  });

  it('reject token signe avec un autre secret', () => {
    const exp = new Date(Date.now() + 1000 * 3600).toISOString();
    const payload = Buffer.from(
      JSON.stringify({ reservationId: 'res-1', exp, purpose: 'balance' }),
    ).toString('base64url');
    const wrongSig = crypto
      .createHmac('sha256', OTHER_SECRET)
      .update(payload)
      .digest('base64url');
    const result = verifyBalanceToken(`${payload}.${wrongSig}`);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('invalid_signature');
  });

  it('reject token expire', () => {
    const expPast = new Date(Date.now() - 60 * 1000).toISOString();
    const token = signBalanceToken({ reservationId: 'res-1', exp: expPast });
    const result = verifyBalanceToken(token);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('expired');
  });

  it('reject token avec purpose != balance (cloisonnement)', () => {
    const exp = new Date(Date.now() + 1000 * 3600).toISOString();
    const forgedPayload = Buffer.from(
      JSON.stringify({ reservationId: 'res-1', exp, purpose: 'other' }),
    ).toString('base64url');
    const sig = crypto
      .createHmac('sha256', FAKE_SECRET)
      .update(forgedPayload)
      .digest('base64url');
    const result = verifyBalanceToken(`${forgedPayload}.${sig}`);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('purpose_mismatch');
  });

  it('reject token avec payload non-JSON', () => {
    const garbage = Buffer.from('not-json-at-all').toString('base64url');
    const sig = crypto
      .createHmac('sha256', FAKE_SECRET)
      .update(garbage)
      .digest('base64url');
    const result = verifyBalanceToken(`${garbage}.${sig}`);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('invalid_payload');
  });

  it('reject token avec payload manquant reservationId', () => {
    const payload = Buffer.from(
      JSON.stringify({ exp: new Date(Date.now() + 1000).toISOString(), purpose: 'balance' }),
    ).toString('base64url');
    const sig = crypto
      .createHmac('sha256', FAKE_SECRET)
      .update(payload)
      .digest('base64url');
    const result = verifyBalanceToken(`${payload}.${sig}`);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('invalid_payload');
  });

  it('verify avec `now` injecte (utile pour tests deterministes)', () => {
    const exp = new Date('2026-06-01T00:00:00.000Z').toISOString();
    const token = signBalanceToken({ reservationId: 'res-1', exp });
    const nowBefore = new Date('2026-05-30T00:00:00.000Z');
    const nowAfter = new Date('2026-06-02T00:00:00.000Z');
    expect(verifyBalanceToken(token, nowBefore).valid).toBe(true);
    expect(verifyBalanceToken(token, nowAfter).valid).toBe(false);
  });

  it('BALANCE_TOKEN_PURPOSE export = "balance"', () => {
    expect(BALANCE_TOKEN_PURPOSE).toBe('balance');
  });
});

// Lalou
