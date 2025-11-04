/**
 * Script pour trouver les fichiers similaires par nom
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      fileList.push({
        name: file,
        path: filePath.replace(PUBLIC_DIR, ''),
        baseName: file.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase()
      });
    }
  });

  return fileList;
}

const images = getAllImages(PUBLIC_DIR);

// Grouper par nom de base
const groups = {};
images.forEach(img => {
  if (!groups[img.baseName]) {
    groups[img.baseName] = [];
  }
  groups[img.baseName].push(img);
});

// Trouver les groupes avec des doublons
const duplicates = Object.entries(groups).filter(([_, files]) => files.length > 1);

console.log(`\n🔍 Analyse de ${images.length} images...\n`);

if (duplicates.length > 0) {
  console.log(`❗ Trouvé ${duplicates.length} noms similaires:\n`);

  duplicates.forEach(([baseName, files]) => {
    console.log(`📁 "${baseName}" (${files.length} fichiers):`);
    files.forEach(f => {
      console.log(`   - ${f.path}`);
    });
    console.log('');
  });
} else {
  console.log('✅ Aucun doublon par nom trouvé.');
}
