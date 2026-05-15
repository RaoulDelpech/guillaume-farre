import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { revokeCode } from '@/lib/vip-codes';
import { invalidateRevocationCache } from '@/lib/vip-revocation';

/**
 * Revoque un code VIP. Effet immediat : tout cookie HMAC signe a partir de
 * ce code sera rejete par le middleware Node.js au plus tard apres 5s
 * (TTL du cache de revocation), et immediatement apres l'appel a
 * `invalidateRevocationCache()` ci-dessous.
 *
 * Body : `{ code: "ABCDEFGH" }`
 * Auth : cookie `gf_admin` (verifie par requireAdminAuth).
 *
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  let code: string;
  try {
    const body = await request.json();
    code = typeof body?.code === 'string' ? body.code.trim() : '';
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (!code || code.length !== 8) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
  }

  const existed = await revokeCode(code);
  if (!existed) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  invalidateRevocationCache();
  return NextResponse.json({ ok: true, code: code.toUpperCase() });
}
