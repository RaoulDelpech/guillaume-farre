import { promises as fs } from 'fs';
import path from 'path';

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
}

// Load works from photo metadata
export async function getWorksFromMetadata(): Promise<Work[]> {
  const metadataPath = path.join(process.cwd(), 'data', 'photo-metadata.json');

  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    const photos = JSON.parse(data);

    // Filter only visible photos with active status
    return photos
      .filter((photo: any) => photo.visible && photo.status === 'active')
      .map((photo: any) => {
        // Extract number from filename for slug
        const match = photo.filename.match(/(\d+)/);
        const number = match ? match[1] : '001';

        return {
          slug: `${photo.category}-${number}`,
          title: photo.title || `${photo.category.charAt(0).toUpperCase() + photo.category.slice(1)} ${number}`,
          year: photo.year || 2024,
          type: 'photo' as WorkType,
          edition: photo.edition || { type: 'open' },
          prices: photo.price ? {
            small: photo.price,
            medium: photo.price * 1.5,
            large: photo.price * 2
          } : undefined,
          images: [photo.path],
          description: photo.description,
        };
      });
  } catch (error) {
    console.error('Error loading photo metadata:', error);
    return getDefaultWorks(); // Fallback to default
  }
}

// Default works if metadata file doesn't exist yet
function getDefaultWorks(): Work[] {
  const defaultPhotos = [
    ...generateSeriesWorks('empreintes', 'Empreintes', 17),
    ...generateSeriesWorks('atelier', 'Atelier', 10),
    ...generateSeriesWorks('projection', 'Projection', 14),
  ];
  return defaultPhotos;
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
