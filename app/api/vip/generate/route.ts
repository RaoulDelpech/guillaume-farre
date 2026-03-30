import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { createVipCode } from '@/lib/vip-codes';

/**
 * Genere un code VIP temporaire (24h) avec niveau d'acces
 * Protege par auth admin
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    // Lire le niveau d'acces demande (default: secret)
    let accessLevel: 'hidden' | 'secret' = 'secret';
    try {
      const body = await request.json();
      if (body.accessLevel === 'hidden') accessLevel = 'hidden';
    } catch {
      // Pas de body = default secret
    }

    const vipCode = await createVipCode(accessLevel);

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
