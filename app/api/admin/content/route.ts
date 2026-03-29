import { NextRequest, NextResponse } from "next/server";
import contentManager from "@/lib/content-manager";
import { requireAdminAuth } from '@/lib/admin/auth';

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
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {

    const body = await request.json();
    const { changes, locale = "fr" } = body;

    if (!changes || typeof changes !== "object") {
      return NextResponse.json(
        { error: "Format invalide: changes requis" },
        { status: 400 }
      );
    }

    // Validation clés : bloquer path traversal (../ ou caractères dangereux)
    const SAFE_KEY_PATTERN = /^[a-zA-Z0-9._-]+$/;
    for (const key of Object.keys(changes)) {
      if (!SAFE_KEY_PATTERN.test(key)) {
        return NextResponse.json(
          { error: `Clé invalide: ${key}` },
          { status: 400 }
        );
      }
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
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {

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
