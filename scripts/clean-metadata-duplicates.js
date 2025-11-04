/**
 * Script pour nettoyer les doublons dans photo-metadata.json
 * Garde uniquement la première occurrence de chaque fileHash
 */

const fs = require('fs');
const path = require('path');

const METADATA_PATH = path.join(__dirname, '..', 'data', 'photo-metadata.json');

console.log('📖 Lecture des métadonnées...\n');

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));

console.log(`📊 Total d'entrées: ${metadata.length}`);

// Détecter les doublons par fileHash
const seen = new Map();
const duplicates = [];
const unique = [];

metadata.forEach((entry, index) => {
  const key = entry.fileHash || entry.filename || entry.path;

  if (seen.has(key)) {
    duplicates.push({
      index,
      key,
      entry,
      firstSeen: seen.get(key)
    });
  } else {
    seen.set(key, index);
    unique.push(entry);
  }
});

if (duplicates.length > 0) {
  console.log(`\n❗ Trouvé ${duplicates.length} doublons:\n`);

  duplicates.forEach(dup => {
    console.log(`  🔴 Index ${dup.index}: ${dup.entry.filename || dup.entry.path}`);
    console.log(`     fileHash: ${dup.entry.fileHash}`);
    console.log(`     (doublon de l'index ${dup.firstSeen})\n`);
  });

  // Créer une sauvegarde
  const backupPath = METADATA_PATH + '.backup-' + Date.now();
  fs.writeFileSync(backupPath, JSON.stringify(metadata, null, 2));
  console.log(`💾 Sauvegarde créée: ${backupPath}\n`);

  // Écrire le fichier nettoyé
  fs.writeFileSync(METADATA_PATH, JSON.stringify(unique, null, 2));
  console.log(`✅ Fichier nettoyé: ${unique.length} entrées uniques (${duplicates.length} doublons supprimés)`);

} else {
  console.log('\n✅ Aucun doublon trouvé. Les métadonnées sont propres.');
}
