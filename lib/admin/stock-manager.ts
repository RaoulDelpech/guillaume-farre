import { promises as fs } from 'fs';
import path from 'path';

/**
 * Gestionnaire de stock pour les editions limitees
 * Met a jour le nombre d'exemplaires vendus apres chaque vente
 *
 * @author Lalou
 * @date 2026-04-09
 */

const METADATA_DIR = path.join(process.cwd(), 'data');
const METADATA_FILE = 'photo-metadata.json';

interface EditionInfo {
  total: number;
  sold: number;
  available: number;
  numberingStart: number;
  numberingEnd: number;
}

interface PhotoMetadata {
  filename: string;
  categories?: string[];
  editions?: Record<string, EditionInfo>;
  [key: string]: any;
}

async function readMetadata(): Promise<PhotoMetadata[]> {
  const metadataPath = path.join(METADATA_DIR, METADATA_FILE);
  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading metadata:', error);
    return [];
  }
}

async function writeMetadata(metadata: PhotoMetadata[]): Promise<void> {
  const metadataPath = path.join(METADATA_DIR, METADATA_FILE);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
}

/**
 * Met a jour le stock d'une photo apres vente
 *
 * @param photoFilename - Nom du fichier photo (ex: "1.jpg")
 * @param format - Format achete (ex: "24x36", "40x60", "80x120")
 * @param quantitySold - Nombre d'exemplaires vendus
 */
export async function updatePhotoStock(
  photoFilename: string,
  format: string,
  quantitySold: number = 1
): Promise<boolean> {
  try {
    const metadata = await readMetadata();
    const photoIndex = metadata.findIndex((p) => p.filename === photoFilename);

    if (photoIndex === -1) return false;

    const photo = metadata[photoIndex];

    if (!photo.editions || !photo.editions[format]) {
      return false;
    }

    const edition = photo.editions[format];
    const newSold = edition.sold + quantitySold;

    if (newSold > edition.total) {
      console.error(`Stock insuffisant: ${photoFilename} format ${format} (${edition.available} restants)`);
      return false;
    }

    edition.sold = newSold;
    edition.available = edition.total - newSold;

    metadata[photoIndex] = photo;
    await writeMetadata(metadata);

    return true;
  } catch (error) {
    console.error('Error updating photo stock:', error);
    return false;
  }
}

/**
 * Obtenir le stock disponible d'une photo par format
 */
export async function getPhotoStock(
  photoFilename: string,
  format?: string
): Promise<Record<string, number> | number | null> {
  try {
    const metadata = await readMetadata();
    const photo = metadata.find((p) => p.filename === photoFilename);

    if (!photo || !photo.editions) return null;

    if (format) {
      const edition = photo.editions[format];
      return edition ? edition.available : null;
    }

    const result: Record<string, number> = {};
    for (const [fmt, edition] of Object.entries(photo.editions)) {
      result[fmt] = edition.available;
    }
    return result;
  } catch (error) {
    console.error('Error getting photo stock:', error);
    return null;
  }
}

/**
 * Verifier si une photo est disponible dans un format donne
 */
export async function isPhotoAvailable(
  photoFilename: string,
  format: string,
  quantity: number = 1
): Promise<boolean> {
  const stock = await getPhotoStock(photoFilename, format);
  if (stock === null || typeof stock !== 'number') return false;
  return stock >= quantity;
}

/**
 * Rapport sur l'etat des stocks
 */
export async function getStockReport(): Promise<{
  totalPhotos: number;
  totalExemplaires: number;
  totalSold: number;
  totalAvailable: number;
  byFormat: Record<string, { sold: number; available: number }>;
}> {
  try {
    const metadata = await readMetadata();
    let totalPhotos = 0;
    let totalExemplaires = 0;
    let totalSold = 0;
    let totalAvailable = 0;
    const byFormat: Record<string, { sold: number; available: number }> = {};

    for (const photo of metadata) {
      if (!photo.editions) continue;
      totalPhotos++;

      for (const [format, edition] of Object.entries(photo.editions)) {
        totalExemplaires += edition.total;
        totalSold += edition.sold;
        totalAvailable += edition.available;

        if (!byFormat[format]) {
          byFormat[format] = { sold: 0, available: 0 };
        }
        byFormat[format].sold += edition.sold;
        byFormat[format].available += edition.available;
      }
    }

    return { totalPhotos, totalExemplaires, totalSold, totalAvailable, byFormat };
  } catch (error) {
    console.error('Error generating stock report:', error);
    return { totalPhotos: 0, totalExemplaires: 0, totalSold: 0, totalAvailable: 0, byFormat: {} };
  }
}
