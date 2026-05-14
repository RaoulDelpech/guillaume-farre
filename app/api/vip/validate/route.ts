import { NextRequest, NextResponse } from 'next/server';
import { validateVipCode, markCodeUsed } from '@/lib/vip-codes';
import { signVipCookie, VIP_COOKIE_NAME } from '@/lib/vip-cookie';

/**
 * Valide un code VIP et set un cookie d'acces signe (HMAC-SHA256).
 *
 * Format cookie : `CODE:level:expiresAt:hmac` (voir lib/vip-cookie.ts).
 * La signature HMAC permet au middleware Edge de verifier le cookie sans
 * lire le disque, ce qui est requis pour autoriser les VIP en mode
 * pre-launch sans relacher la securite globale du middleware.
 *
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string' || code.length !== 8) {
      return NextResponse.json({ valid: false, error: 'invalid' }, { status: 400 });
    }

    const result = await validateVipCode(code);

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 401 });
    }

    // Marquer le code comme utilise
    await markCodeUsed(code);

    const accessLevel = result.accessLevel || 'secret';

    const signed = await signVipCookie(code, accessLevel);
    if (!signed) {
      // MAGIC_LINK_SECRET absent : on refuse plutot que de poser un cookie non signe
      return NextResponse.json(
        { valid: false, error: 'server_misconfigured' },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ valid: true, accessLevel });
    response.cookies.set(VIP_COOKIE_NAME, signed.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: signed.maxAgeSeconds,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Erreur validation' }, { status: 500 });
  }
}
