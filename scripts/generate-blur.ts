/**
 * Generate base64 blur placeholders for all photos and toiles.
 * Output: data/blur-placeholders.json
 *
 * Usage: npx tsx scripts/generate-blur.ts
 *
 * @author Lalou
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

interface BlurMap {
  [imagePath: string]: string;
}

async function generateBlurDataURL(filePath: string): Promise<string> {
  const buffer = await sharp(filePath)
    .resize(16, undefined, { fit: 'inside' })
    .blur(2)
    .toFormat('jpeg', { quality: 20 })
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function main() {
  const blurMap: BlurMap = {};

  // Photos (data/photos.json)
  const photos = JSON.parse(readFileSync(join(ROOT, 'data/photos.json'), 'utf-8'));
  for (const photo of photos) {
    const imagePath: string = photo.image;
    const fullPath = join(PUBLIC, imagePath);
    try {
      blurMap[imagePath] = await generateBlurDataURL(fullPath);
      console.log(`  blur: ${imagePath}`);
    } catch (err) {
      console.error(`  SKIP: ${imagePath} — ${err}`);
    }
  }

  // Toiles (data/toiles.json)
  const toiles = JSON.parse(readFileSync(join(ROOT, 'data/toiles.json'), 'utf-8'));
  for (const toile of toiles) {
    if (toile.image) {
      const imagePath: string = toile.image;
      const fullPath = join(PUBLIC, imagePath);
      try {
        blurMap[imagePath] = await generateBlurDataURL(fullPath);
        console.log(`  blur: ${imagePath}`);
      } catch (err) {
        console.error(`  SKIP: ${imagePath} — ${err}`);
      }
    }
    // Triptych panels
    if (toile.images) {
      for (const img of toile.images) {
        const fullPath = join(PUBLIC, img);
        try {
          blurMap[img] = await generateBlurDataURL(fullPath);
          console.log(`  blur: ${img}`);
        } catch (err) {
          console.error(`  SKIP: ${img} — ${err}`);
        }
      }
    }
  }

  const outPath = join(ROOT, 'data/blur-placeholders.json');
  writeFileSync(outPath, JSON.stringify(blurMap, null, 2));
  console.log(`\nDone — ${Object.keys(blurMap).length} blur placeholders → ${outPath}`);
}

main();
