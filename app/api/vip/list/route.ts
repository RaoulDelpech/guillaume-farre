import { NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/auth';
import { listActiveCodes } from '@/lib/vip-codes';

/**
 * Liste les codes VIP actifs
 * @author Lalou
 */
export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const codes = await listActiveCodes();
    return NextResponse.json({ codes });
  } catch {
    return NextResponse.json({ error: 'Erreur liste codes' }, { status: 500 });
  }
}
