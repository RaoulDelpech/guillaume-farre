import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { requireAdminAuth } from '@/lib/admin/auth';

/**
 * API endpoint pour éditer une photo (crop + rotation)
 * Utilise Sharp pour le traitement côté serveur
 *
 * @route POST /api/admin/edit-photo
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { filename, cropArea, rotation } = body;

    if (!filename || typeof filename !== 'string' || !cropArea) {
      return NextResponse.json(
        { error: 'Paramètres manquants (filename, cropArea requis)' },
        { status: 400 }
      );
    }

    // Sécurité : rejeter path traversal, ne garder que le basename
    if (filename.includes('\0')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 403 });
    }
    const safeFilename = path.basename(filename);
    if (safeFilename !== filename || safeFilename.includes('..')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 403 });
    }

    // Trouver le fichier dans le filesystem
    const publicDir = path.join(process.cwd(), 'public');
    const possiblePaths = [
      path.join(publicDir, 'images', 'works', filename),
      path.join(publicDir, 'images', 'works', 'empreintes', filename),
      path.join(publicDir, 'images', 'works', 'atelier', filename),
      path.join(publicDir, 'images', 'works', 'projection', filename),
      path.join(publicDir, 'images', 'works', 'a-trier', filename),
      path.join(publicDir, 'images', 'origins', filename),
    ];

    let filePath: string | null = null;
    for (const possiblePath of possiblePaths) {
      try {
        await fs.access(possiblePath);
        filePath = possiblePath;
        break;
      } catch {
        // Fichier n'existe pas à ce chemin, continuer
      }
    }

    if (!filePath) {
      return NextResponse.json(
        { error: `Fichier non trouvé: ${filename}` },
        { status: 404 }
      );
    }

    // Lire le fichier
    const imageBuffer = await fs.readFile(filePath);

    // Obtenir les dimensions originales
    const metadata = await sharp(imageBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: 'Impossible de lire les dimensions de l\'image' },
        { status: 500 }
      );
    }

    // Préparer le pipeline Sharp
    let pipeline = sharp(imageBuffer);

    // Appliquer la rotation si nécessaire
    if (rotation && rotation !== 0) {
      pipeline = pipeline.rotate(rotation, {
        background: { r: 255, g: 255, b: 255, alpha: 1 } // Fond blanc pour les zones vides
      });
    }

    // Appliquer le crop
    const { x, y, width, height } = cropArea;

    // S'assurer que les coordonnées sont des entiers positifs
    const cropOptions = {
      left: Math.max(0, Math.round(x)),
      top: Math.max(0, Math.round(y)),
      width: Math.round(width),
      height: Math.round(height),
    };

    pipeline = pipeline.extract(cropOptions);

    // Optimiser la qualité (JPEG quality 95 pour les photos d'art)
    const outputBuffer = await pipeline
      .jpeg({ quality: 95, mozjpeg: true })
      .toBuffer();

    // Créer un nom de fichier pour la version éditée
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const editedFilename = `${nameWithoutExt}_edited_${Date.now()}${ext}`;
    const editedFilePath = path.join(path.dirname(filePath), editedFilename);

    // Sauvegarder le fichier édité
    await fs.writeFile(editedFilePath, outputBuffer);

    // Retourner le chemin relatif de la nouvelle image
    const relativePath = editedFilePath.replace(publicDir, '');

    return NextResponse.json({
      success: true,
      originalFile: filename,
      editedFile: editedFilename,
      path: relativePath,
      message: 'Photo éditée avec succès',
    });

  } catch (error) {
    console.error('Erreur lors de l\'édition de la photo:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors du traitement de l\'image',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// Lalou
