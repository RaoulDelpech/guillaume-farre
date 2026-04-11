import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "gf_admin";

/**
 * Logout admin : supprime le cookie `gf_admin`.
 *
 * N'affecte PAS le cookie `gf_auth` du site public.
 *
 * @author Lalou
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

// Lalou
