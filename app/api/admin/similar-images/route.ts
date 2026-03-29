import { NextRequest, NextResponse } from 'next/server';
import { mergePhotoData } from '@/lib/admin/photo-manager';
import { findSimilarImages } from '@/lib/image-similarity';
import path from 'path';
import { requireAdminAuth } from '@/lib/admin/auth';

// Force dynamic rendering to avoid build-time errors with sharp
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    // Récupérer le threshold depuis le body (optionnel, défaut: 85)
    const body = await request.json();
    const threshold = body.threshold || 85;

    // Charger toutes les photos
    const allPhotos = await mergePhotoData();

    // Analyser toutes les photos (sauf trash)
    // On veut détecter les doublons même dans "à trier"
    const photosToAnalyze = allPhotos.filter(photo => photo.status !== 'trash');

    // Convertir les chemins relatifs en chemins absolus
    const publicDir = path.join(process.cwd(), 'public');
    const imagePaths = photosToAnalyze.map(photo =>
      path.join(publicDir, photo.path)
    );


    // Trouver les groupes de photos similaires
    const similarGroups = await findSimilarImages(imagePaths, threshold);

    // Convertir les noms de fichiers en chemins web complets
    const groupsWithPaths = similarGroups.map(group => {
      const imagesWithPaths = group.images.map(filename => {
        // Trouver la photo correspondante dans photosToAnalyze
        const photo = photosToAnalyze.find(p => p.path.endsWith(filename));
        return photo ? photo.path : `/images/works/${filename}`; // Fallback si pas trouvé
      });

      return {
        ...group,
        images: imagesWithPaths,
      };
    });

    return NextResponse.json({
      success: true,
      groups: groupsWithPaths,
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
