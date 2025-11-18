import { promises as fs } from 'fs';
import path from 'path';

// Ancien schema
interface OldPhotoMetadata {
  filename: string;
  path: string;
  category: string;
  visible: boolean;
  forSale: boolean;
  isNumberedSeries: boolean;
  price?: number;
  title?: string;
  year?: number;
  seriesName?: string;
  edition?: {
    type: 'limited' | 'open';
    count?: number;
  };
}

// Nouveau schema
interface NewPhotoMetadata {
  filename: string;
  path: string;
  title?: string;
  year?: number;
  seriesName?: string;
  categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];
  description?: string;
  aiGenerated?: boolean;
  status: null | 'trash' | 'to-sort';
  visible: boolean;
  forSale: boolean;
  category?: string; // Gardé pour compatibilité
  limitedEdition?: {
    total: 9;
    sold: number;
    available: number;
    closed: boolean;
  };
  prices?: {
    unlimited?: { a4: 150; a3: 250; a2: 400 };
    limited?: { a3: 500; a2: 800; a1: 1200 };
    xxl?: number;
    monumental?: number;
  };
  // Anciens champs
  isNumberedSeries?: boolean;
  price?: number;
  edition?: {
    type: 'limited' | 'open';
    count?: number;
  };
}

async function migrateMetadata() {
  const dataPath = path.join(process.cwd(), 'data', 'photo-metadata.json');
  const backupPath = path.join(process.cwd(), 'data', `photo-metadata.backup.${Date.now()}.json`);

  console.log('📋 Migration metadata - Ancien vers nouveau schema\n');

  // Lire anciennes données
  console.log('1. Lecture photo-metadata.json...');
  const oldDataRaw = await fs.readFile(dataPath, 'utf-8');
  const oldData: OldPhotoMetadata[] = JSON.parse(oldDataRaw);
  console.log(`   ✅ ${oldData.length} photos trouvées\n`);

  // Créer backup
  console.log('2. Création backup...');
  await fs.writeFile(backupPath, oldDataRaw, 'utf-8');
  console.log(`   ✅ Backup créé: ${path.basename(backupPath)}\n`);

  // Migrer
  console.log('3. Migration des données...');
  const newData: NewPhotoMetadata[] = oldData.map((old, index) => {
    // Déterminer catégories basé sur ancien schema
    const categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[] = [];

    if (old.edition?.type === 'limited' || old.isNumberedSeries) {
      categories.push('limited');
    }

    if (old.edition?.type === 'open' || (!old.isNumberedSeries && old.forSale)) {
      categories.push('unlimited');
    }

    // Si aucune catégorie détectée, par défaut unlimited
    if (categories.length === 0) {
      categories.push('unlimited');
    }

    // Déterminer statut (null = active, sinon trash/to-sort)
    const status: null | 'trash' | 'to-sort' = old.visible ? null : 'to-sort';

    // Créer limitedEdition si série limitée
    const limitedEdition = categories.includes('limited')
      ? {
          total: 9 as 9,
          sold: 0,
          available: 9,
          closed: false,
        }
      : undefined;

    // Créer prices
    const prices: NewPhotoMetadata['prices'] = {};

    if (categories.includes('unlimited')) {
      prices.unlimited = { a4: 150, a3: 250, a2: 400 };
    }

    if (categories.includes('limited')) {
      prices.limited = { a3: 500, a2: 800, a1: 1200 };
    }

    const migrated: NewPhotoMetadata = {
      filename: old.filename,
      path: old.path,
      title: old.title,
      year: old.year,
      seriesName: old.seriesName,
      categories,
      status,
      visible: old.visible,
      forSale: old.forSale,
      limitedEdition,
      prices,
      // Garder anciens champs pour compatibilité
      category: old.category,
      isNumberedSeries: old.isNumberedSeries,
      price: old.price,
      edition: old.edition,
    };

    if ((index + 1) % 10 === 0) {
      console.log(`   📸 ${index + 1}/${oldData.length} photos migrées...`);
    }

    return migrated;
  });

  console.log(`   ✅ ${newData.length} photos migrées\n`);

  // Sauvegarder nouvelles données
  console.log('4. Sauvegarde nouveau schema...');
  await fs.writeFile(dataPath, JSON.stringify(newData, null, 2), 'utf-8');
  console.log(`   ✅ photo-metadata.json mis à jour\n`);

  // Statistiques
  console.log('📊 Statistiques migration:\n');
  const stats = {
    total: newData.length,
    unlimited: newData.filter((p) => p.categories.includes('unlimited')).length,
    limited: newData.filter((p) => p.categories.includes('limited')).length,
    active: newData.filter((p) => p.status === null).length,
    trash: newData.filter((p) => p.status === 'trash').length,
    toSort: newData.filter((p) => p.status === 'to-sort').length,
  };

  console.log(`   Total photos:        ${stats.total}`);
  console.log(`   - Tirages illimités: ${stats.unlimited}`);
  console.log(`   - Séries limitées:   ${stats.limited}`);
  console.log(`   - Statut active:     ${stats.active}`);
  console.log(`   - Statut trash:      ${stats.trash}`);
  console.log(`   - Statut to-sort:    ${stats.toSort}`);

  console.log('\n✅ Migration terminée avec succès!\n');
  console.log(`📁 Backup: data/${path.basename(backupPath)}`);
  console.log(`📁 Nouveau: data/photo-metadata.json`);
}

// Exécution
migrateMetadata().catch((error) => {
  console.error('❌ Erreur migration:', error);
  process.exit(1);
});

// Lalou
