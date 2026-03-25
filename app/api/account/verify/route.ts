/**
 * API endpoint for verifying magic link tokens
 * GET /api/account/verify?token=xxx
 *
 * Verifies token and sets httpOnly authentication cookie
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/magic-link';

/**
 * GET /api/account/verify?token=xxx
 * Verify magic link token and set auth cookie
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      console.warn('[Verify] Token manquant');
      return NextResponse.redirect(new URL('/fr/compte?error=invalid', req.url));
    }

    // Verify token
    const result = verifyToken(token);

    if (!result) {
      console.warn('[Verify] Token invalide ou expiré');
      return NextResponse.redirect(new URL('/fr/compte?error=expired', req.url));
    }

    const { email } = result;
    console.log(`[Verify] ✅ Token valide pour ${email}`);

    // Set httpOnly cookie with email (24h expiry)
    const response = NextResponse.redirect(new URL('/fr/compte', req.url));

    response.cookies.set('gf_account_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[Verify] Erreur serveur:', error);
    return NextResponse.redirect(new URL('/fr/compte?error=server', req.url));
  }
}

// Lalou
