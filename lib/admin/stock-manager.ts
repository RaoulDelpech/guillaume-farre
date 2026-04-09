import { promises as fs } from 'fs';
import path from 'path';

/**
 * Gestionnaire de stock pour les éditions limitées
 * Met à jour automatiquement le nombre d'exemplaires vendus après chaque vente
 *
 * // Lalou
 */

const METADATA_DIR = path.join(process.cwd(), 'data');
const METADATA_FILE = 'photo-metadata.json';

interface PhotoMetadata {
  filename: string;
  categories?: string[];
  // Ancien champ (compatibilité)
  limitedEdition?: {
    total: number;
    sold: number;
    available: number;
    closed: boolean;
  };
  // Nouveaux champs séparés par format
  limitedEditionGrand?: {
    total: number;
    sold: number;
    available: number;
    closed: boolean;
  };
  limitedEditionPetit?: {
    total: number;
    sold: number;
    available: number;
    closed: boolean;
  };
  [key: string]: any;
}

/**
 * Lire les métadonnées des photos
 */
async function readMetadata(): Promise<PhotoMetadata[]> {
  const metadataPath = path.join(METADATA_DIR, METADATA_FILE);

  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading metadata:', error);
    return [];
  }
}

/**
 * Écrire les métadonnées des photos
 */
async function writeMetadata(metadata: PhotoMetadata[]): Promise<void> {
  const metadataPath = path.join(METADATA_DIR, METADATA_FILE);

  try {
    await fs.writeFile(
      metadataPath,
      JSON.stringify(metadata, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('❌ Error writing metadata:', error);
    throw error;
  }
}

/**
 * Mettre à jour le stock d'une photo après vente
 *
 * @param photoFilename - Nom du fichier photo
 * @param format - Format acheté (A4/A3/A2/A1/A0/2A0)
 * @param quantitySold - Nombre d'exemplaires vendus
 * @returns true si mise à jour réussie, false sinon
 *
 * // Lalou
 */
export async function updatePhotoStock(
  photoFilename: string,
  format: string,
  quantitySold: number = 1
): Promise<boolean> {

  try {
    const metadata = await readMetadata();

    // Trouver la photo dans les métadonnées
    const photoIndex = metadata.findIndex(
      (p) => p.filename === photoFilename
    );

    if (photoIndex === -1) {
      return false;
    }

    const photo = metadata[photoIndex];

    // Vérifier si c'est une édition limitée
    if (!photo.categories?.includes('limited')) {
      return true;
    }

    // Déterminer quel compteur mettre à jour
    const isGrandFormat = ['A1', 'A0', '2A0'].includes(format);
    const stockKey = isGrandFormat ? 'limitedEditionGrand' : 'limitedEditionPetit';
    const maxTotal = isGrandFormat ? 9 : 99;

    // Initialiser le compteur si nécessaire
    if (!photo[stockKey]) {
      photo[stockKey] = {
        total: maxTotal,
        sold: 0,
        available: maxTotal,
        closed: false,
      };
    }

    // Mettre à jour le stock
    const stock = photo[stockKey];
    const currentSold = stock.sold || 0;
    const newSold = currentSold + quantitySold;

    if (newSold > maxTotal) {
      console.error(`❌ Cannot sell more than ${maxTotal} copies for ${stockKey}`);
      return false;
    }

    stock.sold = newSold;
    stock.available = maxTotal - newSold;

    // Fermer automatiquement la série si tout est vendu
    if (newSold >= maxTotal) {
      stock.closed = true;
    }

    // Sauvegarder les métadonnées mises à jour
    metadata[photoIndex] = photo;
    await writeMetadata(metadata);

    return true;
  } catch (error) {
    console.error('❌ Error updating photo stock:', error);
    return false;
  }
}

/**
 * Obtenir le stock disponible d'une photo
 *
 * @param photoFilename - Nom du fichier photo
 * @returns Nombre d'exemplaires disponibles, null si édition illimitée
 */
export async function getPhotoStock(
  photoFilename: string
): Promise<number | null> {
  try {
    const metadata = await readMetadata();

    const photo = metadata.find((p) => p.filename === photoFilename);

    if (!photo) {
      return null;
    }

    // Si ce n'est pas une édition limitée, retourner null (stock infini)
    if (!photo.categories?.includes('limited') || !photo.limitedEdition) {
      return null;
    }

    // Si la série est fermée, retourner 0
    if (photo.limitedEdition.closed) {
      return 0;
    }

    return photo.limitedEdition.available || 0;
  } catch (error) {
    console.error('❌ Error getting photo stock:', error);
    return null;
  }
}

/**
 * Vérifier si une photo est disponible à la vente
 *
 * @param photoFilename - Nom du fichier photo
 * @param quantity - Quantité demandée
 * @returns true si disponible, false sinon
 */
export async function isPhotoAvailable(
  photoFilename: string,
  quantity: number = 1
): Promise<boolean> {
  const stock = await getPhotoStock(photoFilename);

  // Si stock est null, c'est une édition illimitée, toujours disponible
  if (stock === null) {
    return true;
  }

  // Sinon, vérifier qu'il y a assez de stock
  return stock >= quantity;
}

/**
 * Réinitialiser le stock d'une édition limitée (pour tests)
 *
 * @param photoFilename - Nom du fichier photo
 * @returns true si réussi
 */
export async function resetPhotoStock(
  photoFilename: string
): Promise<boolean> {

  try {
    const metadata = await readMetadata();

    const photoIndex = metadata.findIndex(
      (p) => p.filename === photoFilename
    );

    if (photoIndex === -1) {
      return false;
    }

    const photo = metadata[photoIndex];

    if (photo.limitedEdition) {
      photo.limitedEdition.sold = 0;
      photo.limitedEdition.available = photo.limitedEdition.total || 7;
      photo.limitedEdition.closed = false;

      metadata[photoIndex] = photo;
      await writeMetadata(metadata);

      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Error resetting stock:', error);
    return false;
  }
}

/**
 * Obtenir un rapport sur l'état des stocks
 *
 * @returns Rapport détaillé des stocks
 */
export async function getStockReport(): Promise<{
  totalLimitedEditions: number;
  totalSold: number;
  totalAvailable: number;
  closedSeries: string[];
  lowStock: string[];
}> {
  try {
    const metadata = await readMetadata();

    let totalLimitedEditions = 0;
    let totalSold = 0;
    let totalAvailable = 0;
    const closedSeries: string[] = [];
    const lowStock: string[] = [];

    for (const photo of metadata) {
      if (photo.categories?.includes('limited') && photo.limitedEdition) {
        totalLimitedEditions++;
        totalSold += photo.limitedEdition.sold || 0;
        totalAvailable += photo.limitedEdition.available || 0;

        if (photo.limitedEdition.closed) {
          closedSeries.push(photo.filename);
        } else if ((photo.limitedEdition.available || 0) <= 2) {
          lowStock.push(photo.filename);
        }
      }
    }

    return {
      totalLimitedEditions,
      totalSold,
      totalAvailable,
      closedSeries,
      lowStock,
    };
  } catch (error) {
    console.error('❌ Error generating stock report:', error);
    return {
      totalLimitedEditions: 0,
      totalSold: 0,
      totalAvailable: 0,
      closedSeries: [],
      lowStock: [],
    };
  }
}

// Lalou