import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { createVipCode } from '@/lib/vip-codes';

/**
 * Genere un code VIP temporaire (24h) — toujours niveau secret (tout + prix)
 * Protege par auth admin
 * @author Lalou
 */
export async function POST() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const vipCode = await createVipCode('secret');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';
    const vipUrl = `${baseUrl}/fr/vip?code=${vipCode.code}`;

    return NextResponse.json({
      success: true,
      code: vipCode.code,
      url: vipUrl,
      expiresAt: vipCode.expiresAt,
      accessLevel: vipCode.accessLevel,
    });
  } catch {
    return NextResponse.json({ error: 'Erreur generation code' }, { status: 500 });
  }
}
