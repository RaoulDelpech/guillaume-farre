/**
 * API endpoint for logging out
 * POST /api/account/logout
 *
 * Clears the authentication cookie
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/account/logout
 * Clear authentication cookie
 */
export async function POST(req: NextRequest) {
  console.log('[Logout] Déconnexion utilisateur');

  const response = NextResponse.json({ success: true });

  // Clear the auth cookie
  response.cookies.delete('gf_account_email');

  return response;
}

// Lalou
