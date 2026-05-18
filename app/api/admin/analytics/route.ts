import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/server-analytics';
import { requireAdminAuth } from '@/lib/admin/auth';

/**
 * GET /api/admin/analytics — read analytics data (admin only)
 *
 * Auth via cookie HMAC `gf_admin` (pose par /api/admin/login). Avant fix
 * 18/05/2026, cette route verifiait `gf_auth` (cookie pre-launch) ce qui
 * etait incoherent : les autres routes /api/admin/* utilisent `gf_admin`
 * via requireAdminAuth, et /api/admin/analytics tombait en 401 quand
 * Guillaume etait logge admin mais sans cookie gf_auth.
 *
 * @author Lalou
 */
export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  const stats = await getAnalytics();
  return NextResponse.json(stats);
}
