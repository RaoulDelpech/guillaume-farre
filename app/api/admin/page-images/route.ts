import { NextRequest, NextResponse } from "next/server";
import { getPageImages, savePageImages, updatePageImage, type PageImages } from "@/lib/page-images";
import { requireAdminAuth } from '@/lib/admin/auth';

/**
 * API pour gérer les images des pages
 * GET : Récupère toutes les images
 * POST : Met à jour une ou plusieurs images
 *
 * @author Lalou
 * @date 2025-01-20
 */

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const images = await getPageImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error("GET /api/admin/page-images error:", error);
    return NextResponse.json({ error: "Failed to get page images" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Mise à jour d'une seule image
    if (body.page && body.key && body.value !== undefined) {
      const success = await updatePageImage(
        body.page as keyof PageImages,
        body.key,
        body.value
      );

      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: "Failed to update image" }, { status: 400 });
      }
    }

    // Mise à jour complète
    if (body.images) {
      const success = await savePageImages(body.images);

      if (success) {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: "Failed to save images" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/admin/page-images error:", error);
    return NextResponse.json({ error: "Failed to update page images" }, { status: 500 });
  }
}
