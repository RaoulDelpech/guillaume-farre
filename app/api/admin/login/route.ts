import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { requireEnv } from "@/lib/require-env";
import { isRateLimited, getClientIP } from "@/lib/rate-limit";

const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD");

const ADMIN_COOKIE_NAME = "gf_admin";
const ADMIN_COOKIE_VALUE = "authenticated";
const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8; // 8 heures

/**
 * Login admin
 *
 * Valide ADMIN_PASSWORD en temps constant, pose un cookie HttpOnly
 * `gf_admin` distinct du cookie de site public `gf_auth`.
 *
 * IMPORTANT : ce cookie est le SEUL moyen de passer `requireAdminAuth()`.
 * Le cookie `gf_auth` (site public) ne donne AUCUN acces admin.
 *
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting : 5 tentatives par IP par 5 minutes
    const clientIP = getClientIP(request);
    const rateLimitKey = `admin-login:${clientIP}`;
    if (isRateLimited(rateLimitKey, 5, 300000)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 5 minutes." },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    const passwordBuf = Buffer.from(String(password));
    const expectedBuf = Buffer.from(ADMIN_PASSWORD);
    const isValid =
      passwordBuf.length === expectedBuf.length &&
      timingSafeEqual(passwordBuf, expectedBuf);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Lalou
