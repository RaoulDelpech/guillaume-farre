import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { requireEnv } from "@/lib/require-env";
import { isRateLimited, getClientIP } from "@/lib/rate-limit";

const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD");

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 tentatives par IP par 5 minutes
    const clientIP = getClientIP(request);
    const rateLimitKey = `admin-auth:${clientIP}`;

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

    if (isValid) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur d'authentification" },
      { status: 500 }
    );
  }
}

// Lalou
