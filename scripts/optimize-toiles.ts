/**
 * Optimise les images des toiles de Guillaume Farre.
 * Redimensionne a max 2400px de large, qualite 85, format JPEG.
 *
 * Usage: bun run scripts/optimize-toiles.ts
 *
 * @author Lalou
 */

import sharp from 'sharp';
import { readdir, stat, writeFile } from 'fs/promises';
import { join, basename } from 'path';

const SOURCE_DIR = join(process.env.HOME!, 'Desktop/Toiles Guillaumes');
const DEST_DIR = join(process.cwd(), 'public/images/toiles');

const MAX_WIDTH = 2400;
const QUALITY = 85;
const MAX_SIZE_KB = 500;

async function optimizeImage(src: string, dest: string): Promise<void> {
  const name = basename(dest);

  let quality = QUALITY;
  let width = MAX_WIDTH;
  let buffer: Buffer;

  // Premier essai a qualite 85, 2400px
  buffer = await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();

  // Reduire qualite d'abord (jusqu'a 55)
  while (buffer.length > MAX_SIZE_KB * 1024 && quality > 55) {
    quality -= 5;
    buffer = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  // Si toujours trop gros, reduire la largeur
  while (buffer.length > MAX_SIZE_KB * 1024 && width > 1200) {
    width -= 200;
    buffer = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  // Ecrire le buffer directement (pas de re-encodage)
  await writeFile(dest, buffer);

  const srcStat = await stat(src);
  const srcMB = (srcStat.size / 1024 / 1024).toFixed(1);
  const destKB = (buffer.length / 1024).toFixed(0);

  console.log(`  ${name}: ${srcMB}MB -> ${destKB}KB (q${quality}, ${width}px)`);
}

async function main() {
  console.log('Optimisation des toiles Guillaume Farre\n');
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Destination: ${DEST_DIR}`);
  console.log(`Max: ${MAX_WIDTH}px, qualite ${QUALITY}, < ${MAX_SIZE_KB}KB\n`);

  // Images 1-20 (sauf 17 qui est un dossier triptyque)
  const regularFiles = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19,20];

  console.log('--- Images regulieres ---');
  for (const num of regularFiles) {
    const src = join(SOURCE_DIR, `${num}.jpg`);
    const dest = join(DEST_DIR, `${num}.jpg`);
    await optimizeImage(src, dest);
  }

  // Triptyque 17
  console.log('\n--- Triptyque #17 ---');
  const triptychParts = [
    { src: 'Gauche.jpg', dest: '17-gauche.jpg' },
    { src: 'Milieu.jpg', dest: '17-milieu.jpg' },
    { src: 'Droite.jpg', dest: '17-droite.jpg' },
  ];

  for (const part of triptychParts) {
    const src = join(SOURCE_DIR, '17', part.src);
    const dest = join(DEST_DIR, part.dest);
    await optimizeImage(src, dest);
  }

  // Verifier les tailles finales
  console.log('\n--- Verification ---');
  const files = await readdir(DEST_DIR);
  let totalKB = 0;
  let overLimit = 0;

  for (const file of files.filter(f => f.endsWith('.jpg')).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return numA - numB;
  })) {
    const s = await stat(join(DEST_DIR, file));
    const kb = Math.round(s.size / 1024);
    totalKB += kb;
    if (kb > MAX_SIZE_KB) {
      overLimit++;
      console.log(`  !! ${file}: ${kb}KB (depasse ${MAX_SIZE_KB}KB)`);
    }
  }

  console.log(`\nTotal: ${files.filter(f => f.endsWith('.jpg')).length} images, ${(totalKB / 1024).toFixed(1)}MB`);
  if (overLimit > 0) {
    console.log(`ATTENTION: ${overLimit} image(s) depassent ${MAX_SIZE_KB}KB`);
  } else {
    console.log('Toutes les images sont sous 500KB');
  }
}

main().catch(console.error);
