import fs from "fs/promises";
import path from "path";

/**
 * Service de gestion des images des pages
 * Permet de modifier les images sans toucher au code
 *
 * @author Lalou
 * @date 2025-01-20
 */

export interface PageImages {
  hero: {
    slides: string[];
  };
  home: {
    artistPhoto: string;
  };
  dino: {
    heroBackground: string;
    originPhoto: string;
    creativePhoto: string;
    gallery: string[];
  };
  origine: {
    heroBackground: string;
    childhoodPhoto: string;
    gallery: string[];
  };
  galerieSalles: {
    empreintes: string;
    atelier: string;
    projections: string;
  };
}

const DATA_FILE = path.join(process.cwd(), "data", "page-images.json");

/**
 * Lit les images des pages depuis le fichier JSON
 */
export async function getPageImages(): Promise<PageImages> {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading page-images.json:", error);
    // Retourne des valeurs par défaut si le fichier n'existe pas
    return getDefaultPageImages();
  }
}

/**
 * Sauvegarde les images des pages dans le fichier JSON
 */
export async function savePageImages(images: PageImages): Promise<boolean> {
  try {
    // Backup
    const backupPath = `${DATA_FILE}.backup-${Date.now()}`;
    try {
      const currentContent = await fs.readFile(DATA_FILE, "utf-8");
      await fs.writeFile(backupPath, currentContent);
    } catch {
      // Pas de backup si le fichier n'existe pas
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(images, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving page-images.json:", error);
    return false;
  }
}

/**
 * Met à jour une image spécifique
 */
export async function updatePageImage(
  page: keyof PageImages,
  key: string,
  value: string | string[]
): Promise<boolean> {
  const images = await getPageImages();

  if (images[page] && key in images[page]) {
    (images[page] as Record<string, unknown>)[key] = value;
    return savePageImages(images);
  }

  return false;
}

/**
 * Valeurs par défaut
 */
function getDefaultPageImages(): PageImages {
  return {
    hero: {
      slides: [
        "/images/works/atelier/atelier-063.jpg",
        "/images/works/atelier/atelier-004.jpg",
        "/images/works/atelier/atelier-020.jpg"
      ]
    },
    home: {
      artistPhoto: "/images/origins/atelier-deux-voitures-grises.jpg"
    },
    dino: {
      heroBackground: "/images/origins/atelier-deux-voitures-grises.jpg",
      originPhoto: "/images/origins/atelier-deux-voitures.jpg",
      creativePhoto: "/images/works/atelier/atelier-030.jpg",
      gallery: [
        "/images/works/empreintes/empreintes-001.jpg",
        "/images/works/atelier/atelier-010.jpg",
        "/images/works/projection/projection-001.jpg"
      ]
    },
    origine: {
      heroBackground: "/images/origins/childhood-noir-blanc-1.jpg",
      childhoodPhoto: "/images/origins/childhood-noir-blanc-1.jpg",
      gallery: [
        "/images/works/atelier/atelier-004.jpg",
        "/images/works/atelier/atelier-020.jpg",
        "/images/works/empreintes/empreintes-007.jpg",
        "/images/works/atelier/atelier-063.jpg",
        "/images/origins/atelier-deux-voitures-grises.jpg",
        "/images/works/projection/projection-001.jpg"
      ]
    },
    galerieSalles: {
      empreintes: "/images/works/empreintes/empreintes-007.jpg",
      atelier: "/images/works/atelier/atelier-004.jpg",
      projections: "/images/works/projection/projection-001.jpg"
    }
  };
}

export default { getPageImages, savePageImages, updatePageImage };
