import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAnalytics } from '@/lib/server-analytics';

/**
 * GET /api/admin/analytics — read analytics data (admin only)
 *
 * @author Lalou
 */
export async function GET() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('gf_auth');

  if (!authCookie?.value) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const stats = await getAnalytics();
  return NextResponse.json(stats);
}
