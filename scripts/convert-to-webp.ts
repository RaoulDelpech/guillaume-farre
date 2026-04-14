/**
 * Script de conversion batch JPG → WebP
 * Convertit toutes les images JPG du dossier works en WebP
 *
 * Usage: bun run scripts/convert-to-webp.ts
 *
 * @author Lalou
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, parse } from 'path';

const WORKS_DIR = 'public/images/works';
const QUALITY = 80;

async function convertDirectory(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Parcourir récursivement les sous-dossiers
      await convertDirectory(fullPath);
    } else if (entry.name.match(/\.(jpg|jpeg)$/i)) {
      // Convertir les fichiers JPG/JPEG
      const { dir: fileDir, name } = parse(fullPath);
      const webpPath = join(fileDir, `${name}.webp`);

      try {
        await sharp(fullPath)
          .webp({ quality: QUALITY })
          .toFile(webpPath);

        // Comparer tailles
        const [origStat, webpStat] = await Promise.all([
          stat(fullPath),
          stat(webpPath)
        ]);

        const savings = ((1 - webpStat.size / origStat.size) * 100).toFixed(1);
        const origSizeMB = (origStat.size / 1024 / 1024).toFixed(2);
        const webpSizeMB = (webpStat.size / 1024 / 1024).toFixed(2);

        console.log(`✅ ${entry.name} → ${name}.webp (${origSizeMB}MB → ${webpSizeMB}MB, -${savings}%)`);
      } catch (err) {
        console.error(`❌ Échec: ${fullPath}`, err);
      }
    }
  }
}

console.log('🖼️  Conversion JPG → WebP en cours...\n');
console.log(`Dossier: ${WORKS_DIR}`);
console.log(`Qualité WebP: ${QUALITY}%\n`);

convertDirectory(WORKS_DIR)
  .then(() => {
    console.log('\n✅ Conversion terminée!');
    console.log('\nℹ️  Les fichiers JPG originaux sont conservés.');
    console.log('ℹ️  Vous pouvez maintenant utiliser les fichiers .webp dans votre code.');
  })
  .catch((err) => {
    console.error('\n❌ Erreur:', err);
    process.exit(1);
  });

// Lalou
