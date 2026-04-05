import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { loadPhotoMetadata, savePhotoMetadata } from '@/lib/admin/photo-manager';
import { requireAdminAuth } from '@/lib/admin/auth';

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const { path: photoPath } = await request.json();

    if (!photoPath || typeof photoPath !== 'string') {
      return NextResponse.json({ error: 'Photo path required' }, { status: 400 });
    }

    // Sécurité : rejeter path traversal
    if (photoPath.includes('..') || photoPath.includes('\0')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    // Vérifier que le chemin résolu reste dans les dossiers autorisés
    const fullPath = path.resolve(process.cwd(), 'public', photoPath);
    const allowedDirs = [
      path.resolve(process.cwd(), 'public', 'images'),
      path.resolve(process.cwd(), 'public', 'uploads'),
    ];

    if (!allowedDirs.some(dir => fullPath.startsWith(dir + path.sep))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`[DELETE] Erreur suppression fichier ${fullPath}:`, error);
      // Continuer même si le fichier n'existe plus
    }

    // Supprimer de la metadata
    const metadata = await loadPhotoMetadata();
    const filteredMetadata = metadata.filter(p => p.path !== photoPath);
    await savePhotoMetadata(filteredMetadata);


    return NextResponse.json({ success: true, message: 'Photo supprimée définitivement' });
  } catch (error) {
    console.error('[DELETE] Erreur lors de la suppression:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}

// Lalou
