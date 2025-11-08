import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { mergePhotoData } from '@/lib/admin/photo-manager';
import { findSimilarImages } from '@/lib/image-similarity';
import path from 'path';

// Force dynamic rendering to avoid build-time errors with sharp
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || null;

    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer le threshold depuis le body (optionnel, défaut: 85)
    const body = await request.json();
    const threshold = body.threshold || 85;

    // Charger toutes les photos
    const allPhotos = await mergePhotoData();

    // Filtrer les photos actives uniquement (pas trash, pas to-sort)
    const activePhotos = allPhotos.filter(photo => photo.status === 'active');

    // Convertir les chemins relatifs en chemins absolus
    const publicDir = path.join(process.cwd(), 'public');
    const imagePaths = activePhotos.map(photo =>
      path.join(publicDir, photo.path)
    );

    console.log(`Analyzing ${imagePaths.length} active photos for similarity (threshold: ${threshold}%)`);

    // Trouver les groupes de photos similaires
    const similarGroups = await findSimilarImages(imagePaths, threshold);

    return NextResponse.json({
      success: true,
      groups: similarGroups,
      totalPhotosAnalyzed: imagePaths.length,
      threshold,
    });

  } catch (error) {
    console.error('Error finding similar images:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur'
      },
      { status: 500 }
    );
  }
}

// Lalou
