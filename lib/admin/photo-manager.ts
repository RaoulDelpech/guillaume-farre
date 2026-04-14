import { promises as fs } from 'fs';
import path from 'path';

export interface PhotoMetadata {
  // Identifiants
  filename: string;
  path: string;

  // Informations générales
  title?: string;
  year?: number;
  seriesName?: string;

  // Multi-categorisation
  locations?: string[]; // Ex: ["Paris", "Atelier", "Circuit Paul Ricard"]
  tags?: string[]; // Ex: ["rouge", "Ferrari F40", "noir et blanc"]

  // Catégories multiples (une photo peut être dans plusieurs catégories)
  categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];

  // Description IA
  description?: string;
  aiGenerated?: boolean;

  // Matériau et orientation (nouveau)
  material?: 'semi-glossy' | 'aluminum'; // Papier semi-brillant ou aluminium brossé
  orientation?: 'vertical' | 'horizontal' | 'auto'; // auto = détection IA
  aiDetectedOrientation?: 'vertical' | 'horizontal'; // Suggestion IA

  // Statuts (simplifié: juste corbeille et à trier, le reste c'est "visible")
  status: 'trash' | 'to-sort' | null;

  // Visibilité et vente
  visible: boolean;
  forSale: boolean;

  // Niveau d'acces requis pour voir cette oeuvre
  accessLevel?: 'public' | 'early' | 'vip';

  // Type de produit : photo (tirage) ou toile (piece unique)
  productType?: 'photo' | 'canvas';

  // Details specifiques aux toiles (si productType === 'canvas')
  canvasDetails?: {
    dimensions: string;      // "150 x 200 cm"
    technique: string;       // "Peinture sur toile, passage Ferrari Dino"
    price: number;           // En euros
    weight?: string;         // "15 kg"
  };

  // Categorie photo : empreinte, projection ou atelier (photos uniquement)
  photoCategory?: 'empreinte' | 'projection' | 'atelier';

  // Collection (nom libre, ex: "Collection Noir", "Dino 2024")
  collection?: string;

  // Date de publication (toiles uniquement, ISO "2026-04-15")
  // null/undefined = publie immediatement
  // Site standard : invisible avant cette date. Sites cache/secret : visible avec badge.
  publishDate?: string;

  // Prix tirage signe (photos empreinte/projection uniquement)
  priceSigned?: number;

  // Prix tirage non signe (photos empreinte/projection uniquement)
  priceUnsigned?: number;

  // Ancien champ category garde pour compatibilite
  category?: string;

  // Éditions limitées (ancien champ, conservé pour compatibilité)
  limitedEdition?: {
    total: number;
    sold: number;
    available: number;
    closed: boolean;
  };

  // Éditions limitées GRANDS formats (A1, A0, 2A0) - 9 exemplaires
  limitedEditionGrand?: {
    total: 9;
    sold: number; // Combien vendus (0-9)
    available: number; // Restants (9 - sold)
    closed: boolean; // Série close manuellement
  };

  // Éditions limitées PETITS formats (A2, A3, A4) - 99 exemplaires
  limitedEditionPetit?: {
    total: 99;
    sold: number; // Combien vendus (0-99)
    available: number; // Restants (99 - sold)
    closed: boolean; // Série close manuellement
  };

  // Prix selon catégorie
  prices?: {
    // Si 'unlimited' dans categories
    unlimited?: {
      a4: 150;
      a3: 250;
      a2: 400;
    };
    // Si 'limited' dans categories
    limited?: {
      a3: 500;
      a2: 800;
      a1: 1200;
    };
    // Si 'xxl' dans categories
    xxl?: number; // Sur devis
    // Si 'monumental' dans categories
    monumental?: number; // Sur devis
  };

  // Editions par format (nouveau systeme avril 2026)
  editions?: Record<string, {
    total: number;
    sold: number;
    available: number;
    numberingStart: number;
    numberingEnd: number;
  }>;

  // Anciens champs gardés pour compatibilité (à migrer)
  isNumberedSeries?: boolean;
  price?: number;
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
                categories: ['unlimited'] as ('unlimited' | 'limited' | 'xxl' | 'monumental')[],
                status: 'to-sort' as 'trash' | 'to-sort' | null,
                visible: false,
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
              categories: ['unlimited'] as ('unlimited' | 'limited' | 'xxl' | 'monumental')[],
              status: 'to-sort' as 'trash' | 'to-sort' | null,
              visible: false,
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
