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
    toiles: string;
    photos: string;
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
        "/images/toiles/1.jpg",
        "/images/toiles/8.jpg",
        "/images/toiles/12.jpg"
      ]
    },
    home: {
      artistPhoto: "/images/toiles/9.jpg"
    },
    dino: {
      heroBackground: "/images/toiles/3.jpg",
      originPhoto: "/images/toiles/6.jpg",
      creativePhoto: "/images/toiles/10.jpg",
      gallery: [
        "/images/toiles/1.jpg",
        "/images/toiles/5.jpg",
        "/images/toiles/14.jpg"
      ]
    },
    origine: {
      heroBackground: "/images/toiles/7.jpg",
      childhoodPhoto: "/images/toiles/7.jpg",
      gallery: [
        "/images/toiles/1.jpg",
        "/images/toiles/4.jpg",
        "/images/toiles/8.jpg",
        "/images/toiles/12.jpg",
        "/images/toiles/15.jpg",
        "/images/toiles/18.jpg"
      ]
    },
    galerieSalles: {
      toiles: "/images/toiles/9.jpg",
      photos: "/images/works/photos/1.jpg"
    }
  };
}

export default { getPageImages, savePageImages, updatePageImage };
