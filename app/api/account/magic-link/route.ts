/**
 * API endpoint for sending magic link emails
 * POST /api/account/magic-link
 *
 * Rate limited to 3 requests per email per hour to prevent abuse
 *
 * @author Lalou
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/magic-link';
import { sendMagicLinkEmail } from '@/lib/resend-client';
import { getClientIP, isRateLimited } from '@/lib/rate-limit';

/**
 * POST /api/account/magic-link
 * Send a magic link to the provided email
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email invalide' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Basic email format validation
    if (!normalizedEmail.includes('@') || normalizedEmail.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Format email invalide' },
        { status: 400 }
      );
    }

    // Rate limiting: max 3 requests per email per hour
    const clientIP = getClientIP(req);
    const rateLimitKey = `magic-link:${clientIP}:${normalizedEmail}`;

    if (isRateLimited(rateLimitKey, 3, 3600000)) {
      // Always return success to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'Si cette adresse existe, un email a été envoyé.',
      });
    }

    // Generate magic link token
    const token = generateToken(normalizedEmail);

    // Build magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com';
    const magicLink = `${baseUrl}/fr/compte?token=${token}`;


    // Send email
    const result = await sendMagicLinkEmail({
      to: normalizedEmail,
      magicLink,
    });

    if (!result.success) {
      console.error('[MagicLink] Échec envoi email:', result.error);
      // Still return success to user to prevent enumeration
    }

    // Always return success (prevent email enumeration attack)
    return NextResponse.json({
      success: true,
      message: 'Si cette adresse existe, un email a été envoyé.',
    });
  } catch (error: any) {
    console.error('[MagicLink] Erreur serveur:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Lalou
