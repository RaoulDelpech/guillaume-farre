import { NextRequest, NextResponse } from "next/server";
import { generateToken, addToken } from "@/lib/auth";

// Mot de passe stocké dans .env.local
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "dino246";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Vérifier le mot de passe
    if (password === ADMIN_PASSWORD) {
      // Générer un token unique
      const token = generateToken();
      addToken(token); // Ajoute le token avec expiration automatique (8h par défaut)

      return NextResponse.json({
        success: true,
        token,
      });
    }

    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Lalou
