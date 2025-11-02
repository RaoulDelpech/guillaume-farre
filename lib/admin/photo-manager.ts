import { promises as fs } from 'fs';
import path from 'path';

export interface PhotoMetadata {
  filename: string;
  path: string;
  category: string;
  visible: boolean;
  forSale: boolean;
  isNumberedSeries: boolean;
  price?: number;
  title?: string;
  year?: number;
  edition?: {
    type: 'limited' | 'open';
    count?: number;
  };
}

export interface PhotosByCategory {
  [category: string]: PhotoMetadata[];
}

// Scan all photos in the public directory
export async function scanAllPhotos(): Promise<PhotosByCategory> {
  const photosByCategory: PhotosByCategory = {};
  const baseDir = path.join(process.cwd(), 'public', 'images', 'works');

  try {
    const categories = await fs.readdir(baseDir);

    for (const category of categories) {
      const categoryPath = path.join(baseDir, category);
      const stat = await fs.stat(categoryPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(categoryPath);
        const photos = files
          .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
          .map(file => ({
            filename: file,
            path: `/images/works/${category}/${file}`,
            category,
            visible: true, // Par défaut visible
            forSale: false,
            isNumberedSeries: false,
          }));

        photosByCategory[category] = photos;
      }
    }
  } catch (error) {
    console.error('Error scanning photos:', error);
  }

  return photosByCategory;
}

// Load saved metadata
export async function loadPhotoMetadata(): Promise<PhotoMetadata[]> {
  const metadataPath = path.join(process.cwd(), 'data', 'photo-metadata.json');

  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si le fichier n'existe pas, retourner un tableau vide
    return [];
  }
}

// Save photo metadata
export async function savePhotoMetadata(metadata: PhotoMetadata[]): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  const metadataPath = path.join(dataDir, 'photo-metadata.json');

  // Créer le dossier data s'il n'existe pas
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Ignorer si le dossier existe déjà
  }

  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
}

// Merge scanned photos with saved metadata
export async function mergePhotoData(): Promise<PhotoMetadata[]> {
  const scannedPhotos = await scanAllPhotos();
  const savedMetadata = await loadPhotoMetadata();

  // Créer un map des métadonnées sauvegardées
  const metadataMap = new Map<string, PhotoMetadata>();
  savedMetadata.forEach(photo => {
    metadataMap.set(photo.path, photo);
  });

  // Fusionner les photos scannées avec les métadonnées sauvegardées
  const allPhotos: PhotoMetadata[] = [];

  for (const category in scannedPhotos) {
    for (const photo of scannedPhotos[category]) {
      const savedData = metadataMap.get(photo.path);
      if (savedData) {
        // Utiliser les données sauvegardées
        allPhotos.push(savedData);
      } else {
        // Nouvelle photo, utiliser les valeurs par défaut
        allPhotos.push(photo);
      }
    }
  }

  return allPhotos;
}
