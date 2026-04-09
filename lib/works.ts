import { promises as fs } from 'fs';
import path from 'path';
import type { AccessLevel } from './access';

export type WorkType = 'photo' | 'toile';

export interface Work {
  slug: string;
  title: string;
  year: number;
  type: WorkType;
  edition: {
    type: 'limited' | 'open';
    count?: number;
  };
  prices?: {
    small?: number;
    medium?: number;
    large?: number;
  };
  images: string[];
  description?: string;

  // Categorie photo
  photoCategory?: string;

  // Collection (nom libre)
  collection?: string;

  // Date de publication (toiles, ISO string)
  publishDate?: string;

  // Prix tirage signe / non signe (photos empreinte/projection)
  priceSigned?: number;
  priceUnsigned?: number;

  // Details toile (piece unique)
  canvasDetails?: {
    dimensions: string;
    technique: string;
    price: number;
    weight?: string;
  };

  // Multi-categorisation
  categories?: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];
  limitedEdition?: {
    total: number;
    sold: number;
    available: number;
    closed: boolean;
  };
  forSale?: boolean;
  earlyAccess?: boolean;

  // Niveau d'acces requis pour voir cette oeuvre
  accessRequired?: 'hidden' | 'secret';
}

// Load works from photo metadata, filtered by access level
export async function getWorksFromMetadata(accessLevel: AccessLevel = 'normal'): Promise<Work[]> {
  const metadataPath = path.join(process.cwd(), 'data', 'photo-metadata.json');

  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    const photos = JSON.parse(data);

    const now = new Date().toISOString().split('T')[0]; // "2026-03-31"

    const allWorks: Work[] = photos
      .filter((photo: any) => {
        if (!photo.visible) return false;
        if (photo.status === 'trash' || photo.status === 'to-sort') return false;
        if (photo.forSale === false) {
          return false;
        }
        // Filtre date publication (toiles) : sur site normal, invisible avant la date
        if (photo.publishDate && photo.publishDate > now && accessLevel === 'normal') {
          return false;
        }
        return true;
      })
      .map((photo: any) => {
        const match = photo.filename.match(/(\d+)/);
        const number = match ? match[1] : '001';
        const categorySlug = photo.photoCategory || photo.category || 'oeuvre';
        const isCanvas = photo.productType === 'canvas';

        return {
          slug: `${categorySlug}-${number}`,
          title: photo.title || `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} ${number}`,
          year: photo.year || 2024,
          type: (isCanvas ? 'toile' : 'photo') as WorkType,
          edition: photo.edition || { type: 'open' },
          prices: photo.price ? {
            small: photo.price,
            medium: photo.price * 1.5,
            large: photo.price * 2
          } : undefined,
          images: [photo.path],
          description: photo.description,
          accessRequired: photo.accessRequired,
          photoCategory: photo.photoCategory,
          collection: photo.collection,
          publishDate: photo.publishDate,
          priceSigned: photo.priceSigned,
          priceUnsigned: photo.priceUnsigned,
          canvasDetails: photo.canvasDetails,
          forSale: photo.forSale,
        };
      });

    return filterWorksByAccess(allWorks, accessLevel);
  } catch (error) {
    console.error('Error loading photo metadata:', error);
    return filterWorksByAccess(getDefaultWorks(), accessLevel);
  }
}

// Filtre les oeuvres selon le niveau d'acces du visiteur
function filterWorksByAccess(works: Work[], accessLevel: AccessLevel): Work[] {
  return works.filter(w => {
    if (!w.accessRequired) return true; // pas de restriction = visible par tous
    if (w.accessRequired === 'hidden') return accessLevel === 'hidden' || accessLevel === 'secret';
    if (w.accessRequired === 'secret') return accessLevel === 'secret';
    return true;
  });
}

// Default works if metadata file doesn't exist yet
function getDefaultWorks(): Work[] {
  return generateSeriesWorks('photos', 'Photographie', 16);
}

function generateSeriesWorks(series: string, title: string, count: number, type: WorkType = 'photo'): Work[] {
  return Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(3, '0');
    return {
      slug: `${series}-${num}`,
      title: `${title} ${num}`,
      year: 2024,
      type,
      edition: { type: 'limited', count: 10 },
      prices: { small: 300, medium: 500, large: 800 },
      images: [`/images/works/${series}/${series}-${num}.jpg`],
    };
  });
}

// For pages that can't use async (client components), export a default
export const works: Work[] = [];
