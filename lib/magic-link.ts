/**
 * Magic Link authentication system
 * Simple HMAC-based token generation and verification
 * No external JWT library needed
 *
 * @author Lalou
 */

import crypto from 'crypto';
import { requireEnv } from './require-env';

const SECRET = requireEnv('MAGIC_LINK_SECRET');

/**
 * Token payload interface
 */
interface TokenPayload {
  email: string;
  exp: number;
}

/**
 * Generate a magic link token for email authentication
 * Token format: base64url(payload).base64url(signature)
 * Token expires in 1 hour
 *
 * @param email - User email address
 * @returns Signed token string
 */
export function generateToken(email: string): string {
  const payload: TokenPayload = {
    email: email.toLowerCase().trim(),
    exp: Date.now() + 3600000, // 1 hour expiration
  };

  // Base64url encode payload
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');

  // Generate HMAC-SHA256 signature
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest('base64url');

  return `${data}.${signature}`;
}

/**
 * Verify a magic link token and extract email
 *
 * @param token - Token string to verify
 * @returns Email if valid, null if invalid or expired
 */
export function verifyToken(token: string): { email: string } | null {
  try {
    const [data, signature] = token.split('.');

    if (!data || !signature) {
      console.warn('[MagicLink] Token malformed - missing parts');
      return null;
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(data)
      .digest('base64url');

    if (signature !== expectedSignature) {
      console.warn('[MagicLink] Invalid signature');
      return null;
    }

    // Decode and validate payload
    const payload: TokenPayload = JSON.parse(
      Buffer.from(data, 'base64url').toString()
    );

    // Check expiration
    if (payload.exp < Date.now()) {
      console.warn('[MagicLink] Token expired');
      return null;
    }

    // Validate email format
    if (!payload.email || !payload.email.includes('@')) {
      console.warn('[MagicLink] Invalid email in token');
      return null;
    }

    return { email: payload.email };
  } catch (error) {
    console.error('[MagicLink] Token verification error:', error);
    return null;
  }
}

// Lalou
