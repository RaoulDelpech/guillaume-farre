import { NextRequest, NextResponse } from 'next/server';
import { validateVipCode } from '@/lib/vip-codes';
import { signVipCookie, VIP_COOKIE_NAME } from '@/lib/vip-cookie';

/**
 * Valide un code VIP et set un cookie d'acces signe (HMAC-SHA256) avec niveau.
 *
 * Format cookie : `CODE:level:sessionId:expiresAt:hmac` (voir lib/vip-cookie.ts).
 * Le sessionId (UUID v4) est genere ici et lie le cookie a une session
 * unique : les reservations creees avec ce cookie memorisent sessionId,
 * les routes /sign /contract /checkout verifient le match (ferme IDOR
 * cross-VIP audite mai 2026).
 * La signature HMAC permet au middleware (runtime Node.js) de verifier le
 * cookie sans relire les codes a chaque requete, tout en respectant la
 * revocation cote serveur (cf. lib/vip-revocation.ts).
 *
 * Code reutilisable pendant 24h : le cookie est pose a chaque validation
 * reussie tant que le code n'est ni expire ni revoque (decision Q3,
 * .claude/FLOW_VIP_2026-05.md section 2).
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
  } catch (error) {
    // Silent catch interdit (regle anti-pattern). On loggue cote serveur
    // pour le debug operationnel, mais on garde une reponse cliente
    // generique pour ne pas leaker la cause exacte (json malforme,
    // crash de signVipCookie, etc.).
    console.error('[vip/validate] internal error', error);
    return NextResponse.json({ error: 'Erreur validation' }, { status: 500 });
  }
}
