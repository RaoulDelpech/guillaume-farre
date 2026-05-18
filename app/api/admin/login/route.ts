import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { requireEnv } from "@/lib/require-env";
import { isRateLimited, getClientIP } from "@/lib/rate-limit";
import { ADMIN_COOKIE_NAME, signAdminCookie } from "@/lib/admin-cookie";

const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD");

/**
 * Login admin
 *
 * Valide ADMIN_PASSWORD en temps constant, pose un cookie HttpOnly signe
 * HMAC-SHA256 (`gf_admin`) distinct du cookie de site public `gf_auth`.
 *
 * IMPORTANT : depuis fix securite mai 2026, le cookie n'est plus la string
 * litterale `'authenticated'` (forgeable par tout client). C'est un payload
 * signe MAGIC_LINK_SECRET / 8h. Toute valeur non signee est rejetee par
 * requireAdminAuth().
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

    const signed = signAdminCookie();

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, signed.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: signed.maxAgeSeconds,
      path: "/",
    });
    return response;
  } catch (err) {
    // Silent catch interdit : on log cote serveur pour debug operationnel,
    // reponse cliente generique pour ne pas leaker la cause (MAGIC_LINK_SECRET
    // manquant -> 500 ici plutot que crash silencieux).
    console.error("[admin/login] internal error", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Lalou
