/**
 * Token HMAC-SHA256 signe pour debloquer l'acces a la page de paiement du
 * solde (`/vip/reservation/[id]/balance`) sans cookie VIP `secret` (Sprint 6).
 *
 * Cas d'usage : l'acheteur recoit l'email post-acompte sur un device different
 * de celui ou il a valide son code VIP. Sans token, il ne peut plus payer le
 * solde 70%. Avec ce token (inclus dans le lien email), la page debloque la
 * lecture ET la creation de session Stripe Checkout pour le solde.
 *
 * Format : `base64url(JSON({reservationId, exp, purpose:'balance'})).base64url(HMAC)`
 *  - `reservationId` : cloisonnement strict — la page verifie `token.reservationId === params.id`.
 *  - `exp` : ISO date string (typiquement `balanceDueAt` = J+14 apres acompte).
 *  - `purpose` : `'balance'` pour empecher toute reutilisation cross-feature
 *    si on ajoute d'autres tokens HMAC futurs.
 *
 * Secret : `process.env.MAGIC_LINK_SECRET` (reutilise infra magic-link Sprint 0).
 * Acces lazy (lit l'env a chaque appel) pour eviter les pieges de top-level
 * env-loading en server components / API routes.
 *
 * @author Lalou
 */
import crypto from 'crypto';

export const BALANCE_TOKEN_PURPOSE = 'balance' as const;

interface BalanceTokenPayload {
  reservationId: string;
  exp: string;
  purpose: typeof BALANCE_TOKEN_PURPOSE;
}

export interface SignBalanceTokenArgs {
  reservationId: string;
  exp: string;
}

export type VerifyBalanceTokenResult =
  | { valid: true; reservationId: string }
  | {
      valid: false;
      reason:
        | 'invalid_format'
        | 'invalid_signature'
        | 'expired'
        | 'invalid_payload'
        | 'purpose_mismatch';
    };

function getSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error('MAGIC_LINK_SECRET is not configured');
  }
  return secret;
}

function hmac(data: string): string {
  return crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
}

export function signBalanceToken(args: SignBalanceTokenArgs): string {
  if (!args.reservationId) {
    throw new Error('signBalanceToken: reservationId required');
  }
  if (!args.exp || Number.isNaN(new Date(args.exp).getTime())) {
    throw new Error('signBalanceToken: exp must be a valid ISO date');
  }
  const payload: BalanceTokenPayload = {
    reservationId: args.reservationId,
    exp: new Date(args.exp).toISOString(),
    purpose: BALANCE_TOKEN_PURPOSE,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = hmac(data);
  return `${data}.${signature}`;
}

export function verifyBalanceToken(
  token: string | undefined | null,
  now: Date = new Date(),
): VerifyBalanceTokenResult {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'invalid_format' };
  }
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, reason: 'invalid_format' };
  }
  const [data, signature] = parts;

  const expected = hmac(data);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, reason: 'invalid_signature' };
  }

  let payload: BalanceTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
  } catch {
    return { valid: false, reason: 'invalid_payload' };
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    typeof payload.reservationId !== 'string' ||
    typeof payload.exp !== 'string'
  ) {
    return { valid: false, reason: 'invalid_payload' };
  }

  if (payload.purpose !== BALANCE_TOKEN_PURPOSE) {
    return { valid: false, reason: 'purpose_mismatch' };
  }

  const expDate = new Date(payload.exp);
  if (Number.isNaN(expDate.getTime())) {
    return { valid: false, reason: 'invalid_payload' };
  }
  if (now.getTime() > expDate.getTime()) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true, reservationId: payload.reservationId };
}

// Lalou
