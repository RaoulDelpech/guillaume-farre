import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { requireAdminAuth } from '@/lib/admin/auth';

/**
 * API pour reconstruire le site après modifications de contenu
 * @author Lalou
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {

    // Lancer le rebuild en arrière-plan
    exec("cd /var/www/guillaumefarre && npm run build && pm2 restart guillaumefarre", (error, stdout, stderr) => {
      if (error) {
        console.error("Rebuild error:", error);
      } else {
      }
    });

    return NextResponse.json({
      success: true,
      message: "Rebuild lancé. Le site sera mis à jour dans ~30 secondes."
    });
  } catch (error) {
    console.error("Rebuild API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Lalou
