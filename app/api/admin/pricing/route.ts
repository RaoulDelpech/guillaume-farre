import { NextResponse } from 'next/server';
import { FORMATS, STANDARD_FORMATS } from '@/lib/pricing-config';
import { requireAdminAuth } from '@/lib/admin/auth';

/**
 * API route pricing Guillaume Farre
 *
 * @author Lalou
 * @date 2026-04-09
 *
 * GET /api/admin/pricing - Retourne la grille de prix actuelle
 */

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  return NextResponse.json({
    success: true,
    formats: FORMATS,
    standardFormats: STANDARD_FORMATS,
  });
}
