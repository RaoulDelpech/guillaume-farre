import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

interface PhotoMetadata {
  filename: string;
  path: string;
  category: string;
  visible: boolean;
  forSale: boolean;
  isNumberedSeries: boolean;
  price?: number;
  title?: string;
  year?: number;
  series?: string;
  seriesNumber?: number;
  fileHash?: string;
  edition?: {
    type: 'limited' | 'open';
    count?: number;
  };
}

// Série proposées basées sur les catégories
const SERIES_NAMES: Record<string, string> = {
  atelier: "L'Atelier - Ferrari créatrices",
  projection: "Projection - L'instant capturé",
  empreintes: "Empreintes - Traces automobiles",
  origins: "Origins - Genèse de l'art",
};

async function getFileHash(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

async function scanAllPhotos(): Promise<PhotoMetadata[]> {
  const photos: PhotoMetadata[] = [];
  const publicDir = path.join(process.cwd(), 'public');
  const seenHashes = new Set<string>();
  const duplicates: string[] = [];

  const dirsToScan = [
    { path: path.join(publicDir, 'images', 'works'), prefix: '/images/works/' },
    { path: path.join(publicDir, 'images', 'origins'), prefix: '/images/origins/' },
    { path: path.join(publicDir, 'uploads-preview'), prefix: '/uploads-preview/' },
    { path: path.join(publicDir, 'uploads'), prefix: '/uploads/' },
  ];

  for (const dir of dirsToScan) {
    try {
      const stat = await fs.stat(dir.path);
      if (!stat.isDirectory()) continue;

      const items = await fs.readdir(dir.path);

      for (const item of items) {
        const itemPath = path.join(dir.path, item);
        const itemStat = await fs.stat(itemPath);

        if (itemStat.isDirectory()) {
          // Sous-catégorie (ex: works/atelier)
          const files = await fs.readdir(itemPath);

          for (const file of files) {
            if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;

            const fullPath = path.join(itemPath, file);
            const fileHash = await getFileHash(fullPath);

            // Détection de doublon
            if (seenHashes.has(fileHash)) {
              duplicates.push(fullPath);
              console.log(`🗑️  Doublon trouvé : ${file}`);
              continue; // Skip duplicates
            }

            seenHashes.add(fileHash);

            // Extraction du numéro de série depuis le nom de fichier
            const match = file.match(/(\d+)\./);
            const seriesNumber = match ? parseInt(match[1]) : undefined;

            const category = item;
            const seriesName = SERIES_NAMES[category] || category;

            photos.push({
              filename: file,
              path: `${dir.prefix}${item}/${file}`,
              category,
              visible: true,
              forSale: false,
              isNumberedSeries: true,
              series: seriesName,
              seriesNumber,
              fileHash,
            });
          }
        } else if (/\.(jpg|jpeg|png|webp)$/i.test(item)) {
          // Fichier direct
          const fullPath = itemPath;
          const fileHash = await getFileHash(fullPath);

          if (seenHashes.has(fileHash)) {
            duplicates.push(fullPath);
            console.log(`🗑️  Doublon trouvé : ${item}`);
            continue;
          }

          seenHashes.add(fileHash);

          const categoryName = dir.path.split('/').pop() || 'autres';
          photos.push({
            filename: item,
            path: `${dir.prefix}${item}`,
            category: categoryName,
            visible: true,
            forSale: false,
            isNumberedSeries: false,
            fileHash,
          });
        }
      }
    } catch (error) {
      console.log(`⚠️  Dossier ${dir.path} non trouvé, ignoré`);
    }
  }

  // Supprimer les doublons
  if (duplicates.length > 0) {
    console.log(`\n🗑️  ${duplicates.length} doublons trouvés. Voulez-vous les supprimer ?`);
    for (const dup of duplicates) {
      try {
        await fs.unlink(dup);
        console.log(`   ✅ Supprimé : ${path.basename(dup)}`);
      } catch (error) {
        console.log(`   ❌ Erreur lors de la suppression : ${path.basename(dup)}`);
      }
    }
  }

  return photos.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return (a.seriesNumber || 0) - (b.seriesNumber || 0);
  });
}

async function main() {
  console.log('🎨 Organisation des photos en séries...\n');

  const photos = await scanAllPhotos();

  console.log(`\n✅ ${photos.length} photos uniques trouvées\n`);

  // Afficher les séries
  const seriesMap = new Map<string, PhotoMetadata[]>();
  photos.forEach(photo => {
    const key = photo.series || photo.category;
    if (!seriesMap.has(key)) {
      seriesMap.set(key, []);
    }
    seriesMap.get(key)!.push(photo);
  });

  console.log('📚 Séries détectées:\n');
  seriesMap.forEach((photos, seriesName) => {
    console.log(`   ${seriesName}: ${photos.length} photos`);
  });

  // Créer le dossier data s'il n'existe pas
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Ignore
  }

  // Sauvegarder les métadonnées
  const metadataPath = path.join(dataDir, 'photo-metadata.json');
  await fs.writeFile(metadataPath, JSON.stringify(photos, null, 2), 'utf-8');

  console.log(`\n💾 Métadonnées sauvegardées : ${metadataPath}`);
  console.log('\n✨ Organisation terminée !');
}

main().catch(console.error);
