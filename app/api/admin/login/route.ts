import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Mot de passe stocké dans .env.local
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Guillaumedinoman2025!";

// Générer un token simple mais sécurisé
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Stocker les tokens valides en mémoire (session serveur)
const validTokens = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Vérifier le mot de passe
    if (password === ADMIN_PASSWORD) {
      // Générer un token unique
      const token = generateToken();
      validTokens.add(token);

      // Token expire après 8 heures
      setTimeout(() => {
        validTokens.delete(token);
      }, 8 * 60 * 60 * 1000);

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

// Fonction pour vérifier un token (utilisée par autres routes admin)
export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  return validTokens.has(token);
}

// Lalou
