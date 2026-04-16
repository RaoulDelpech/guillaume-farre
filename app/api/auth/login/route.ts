import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

const SITE_PASSWORD = process.env.SITE_PASSWORD;
const AUTH_SECRET = process.env.AUTH_SECRET;
const COOKIE_NAME = "gf_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

/**
 * API login - vérifie mot de passe et set cookie
 * @author Lalou
 * @date 2025-11-30
 */
export async function POST(request: NextRequest) {
  try {
    if (!SITE_PASSWORD || !AUTH_SECRET) {
      return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
    }

    const { password } = await request.json();

    const passwordBuf = Buffer.from(String(password));
    const expectedBuf = Buffer.from(SITE_PASSWORD);
    const isValid =
      passwordBuf.length === expectedBuf.length &&
      timingSafeEqual(passwordBuf, expectedBuf);

    if (isValid) {
      const response = NextResponse.json({ success: true });

      response.cookies.set(COOKIE_NAME, AUTH_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
