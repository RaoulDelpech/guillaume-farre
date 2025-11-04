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
  seriesName?: string;
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
  const publicDir = path.join(process.cwd(), 'public');

  // Liste des dossiers à scanner
  const dirsToScan = [
    { path: path.join(publicDir, 'images', 'works'), prefix: '/images/works/' },
    { path: path.join(publicDir, 'images', 'origins'), prefix: '/images/origins/' },
  ];

  for (const dir of dirsToScan) {
    try {
      const stat = await fs.stat(dir.path);

      if (stat.isDirectory()) {
        // Si c'est un dossier avec des sous-catégories (comme works)
        const items = await fs.readdir(dir.path);

        for (const item of items) {
          const itemPath = path.join(dir.path, item);
          const itemStat = await fs.stat(itemPath);

          if (itemStat.isDirectory()) {
            // Sous-catégorie (ex: works/atelier)
            const files = await fs.readdir(itemPath);
            const photos = files
              .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
              .map(file => ({
                filename: file,
                path: `${dir.prefix}${item}/${file}`,
                category: item,
                visible: true,
                forSale: false,
                isNumberedSeries: false,
              }));

            if (!photosByCategory[item]) {
              photosByCategory[item] = [];
            }
            photosByCategory[item].push(...photos);
          } else if (/\.(jpg|jpeg|png|webp)$/i.test(item)) {
            // Fichier direct (ex: uploads-preview/photo.jpg)
            const categoryName = dir.path.split('/').pop() || 'autres';
            const photo = {
              filename: item,
              path: `${dir.prefix}${item}`,
              category: categoryName,
              visible: true,
              forSale: false,
              isNumberedSeries: false,
            };

            if (!photosByCategory[categoryName]) {
              photosByCategory[categoryName] = [];
            }
            photosByCategory[categoryName].push(photo);
          }
        }
      }
    } catch (error) {
      console.log(`Dossier ${dir.path} non trouvé, ignoré`);
    }
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
