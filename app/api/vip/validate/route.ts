import { NextRequest, NextResponse } from 'next/server';
import { validateVipCode, markCodeUsed } from '@/lib/vip-codes';

const VIP_COOKIE = 'gf_vip';
const VIP_COOKIE_MAX_AGE = 24 * 60 * 60; // 24h en secondes

/**
 * Valide un code VIP et set cookie d'acces avec niveau
 * Cookie format : "CODE:level" (hidden ou secret)
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

    // Set le cookie VIP avec le niveau d'acces encode
    const response = NextResponse.json({ valid: true, accessLevel });
    response.cookies.set(VIP_COOKIE, `${code.toUpperCase()}:${accessLevel}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: VIP_COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Erreur validation' }, { status: 500 });
  }
}
