import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { requireEnv } from "@/lib/require-env";

const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD");

export async function POST(request: Request) {
  try {
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
