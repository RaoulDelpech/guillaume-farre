/**
 * 🔍 API Detection et Suppression des Doublons
 *
 * GET /api/admin/duplicates - Détecte les photos en double
 * DELETE /api/admin/duplicates - Supprime les doublons sélectionnés
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

interface DuplicateGroup {
  hash: string;
  files: Array<{
    path: string;
    fileName: string;
    size: number;
    fullPath: string;
  }>;
  count: number;
}

/**
 * Calcule le hash MD5 d'un fichier
 */
async function getFileHash(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

/**
 * Scanne récursivement les photos et détecte les doublons
 */
async function scanForDuplicates(): Promise<DuplicateGroup[]> {
  const hashMap = new Map<string, Array<{ path: string; fileName: string; size: number; fullPath: string }>>();

  async function scanDirectory(dir: string, relativePath = ''): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        await scanDirectory(fullPath, relPath);
      } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        try {
          const stats = await fs.stat(fullPath);
          const hash = await getFileHash(fullPath);

          if (!hashMap.has(hash)) {
            hashMap.set(hash, []);
          }

          hashMap.get(hash)!.push({
            path: relPath,
            fileName: entry.name,
            size: stats.size,
            fullPath: fullPath,
          });
        } catch (error) {
          console.error(`Erreur lecture ${fullPath}:`, error);
        }
      }
    }
  }

  await scanDirectory(PHOTOS_DIR);

  // Ne garder que les groupes avec des doublons (2+ fichiers)
  const duplicates: DuplicateGroup[] = [];
  hashMap.forEach((files, hash) => {
    if (files.length > 1) {
      duplicates.push({
        hash,
        files,
        count: files.length,
      });
    }
  });

  // Trier par nombre de doublons décroissant
  duplicates.sort((a, b) => b.count - a.count);

  return duplicates;
}

/**
 * GET - Détecte les doublons
 */
export async function GET(request: Request) {
  try {
    console.log('🔍 Scan des doublons en cours...');
    const duplicates = await scanForDuplicates();

    const totalDuplicates = duplicates.reduce((sum, group) => sum + (group.count - 1), 0);

    console.log(`✅ Scan terminé : ${duplicates.length} groupes de doublons, ${totalDuplicates} fichiers à supprimer`);

    return NextResponse.json({
      success: true,
      duplicates,
      summary: {
        groupCount: duplicates.length,
        duplicateFilesCount: totalDuplicates,
        scannedDirectory: PHOTOS_DIR,
      },
    });
  } catch (error) {
    console.error('❌ Erreur scan doublons:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du scan des doublons' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime les doublons sélectionnés
 */
export async function DELETE(request: Request) {
  try {
    const { filesToDelete }: { filesToDelete: string[] } = await request.json();

    if (!filesToDelete || filesToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier à supprimer' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Suppression de ${filesToDelete.length} doublons...`);

    const deleted: string[] = [];
    const errors: Array<{ file: string; error: string }> = [];

    for (const filePath of filesToDelete) {
      const fullPath = path.join(PHOTOS_DIR, filePath);

      try {
        await fs.unlink(fullPath);
        deleted.push(filePath);
        console.log(`✅ Supprimé: ${filePath}`);
      } catch (error) {
        console.error(`❌ Erreur suppression ${filePath}:`, error);
        errors.push({
          file: filePath,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
        });
      }
    }

    return NextResponse.json({
      success: true,
      deleted,
      errors,
      summary: {
        requested: filesToDelete.length,
        deleted: deleted.length,
        failed: errors.length,
      },
    });
  } catch (error) {
    console.error('❌ Erreur suppression doublons:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression des doublons' },
      { status: 500 }
    );
  }
}
