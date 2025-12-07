import { NextRequest, NextResponse } from "next/server";
import contentManager from "@/lib/content-manager";

const ADMIN_PASSWORD = process.env.SITE_PASSWORD || "LHOOQladino246";

/**
 * API pour sauvegarder les modifications de contenu
 *
 * POST /api/admin/content
 * Body: { changes: { "key": "value", ... }, locale: "fr" }
 *
 * @author Lalou
 * @date 2025-11-30
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via cookie
    const authCookie = request.cookies.get("gf_auth");
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { changes, locale = "fr" } = body;

    if (!changes || typeof changes !== "object") {
      return NextResponse.json(
        { error: "Format invalide: changes requis" },
        { status: 400 }
      );
    }

    // Valider la locale
    const validLocales = ["fr", "en", "it"];
    if (!validLocales.includes(locale)) {
      return NextResponse.json(
        { error: "Locale invalide" },
        { status: 400 }
      );
    }

    // Sauvegarder les changements
    const success = await contentManager.setMany(locale, changes);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `${Object.keys(changes).length} modification(s) sauvegardée(s)`,
        locale,
      });
    }

    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  } catch (error) {
    console.error("API content error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/content?locale=fr
 * Récupère tout le contenu d'une locale
 */
export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("gf_auth");
    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "fr";

    const content = await contentManager.getAll(locale);

    return NextResponse.json({ locale, content });
  } catch (error) {
    console.error("API content GET error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
