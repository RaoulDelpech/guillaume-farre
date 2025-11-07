import * as deepl from 'deepl-node';
import { promises as fs } from 'fs';
import path from 'path';

// Clé API DeepL (à définir dans .env.local)
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';

if (!DEEPL_API_KEY) {
  console.error('❌ DEEPL_API_KEY manquante dans .env.local');
  console.log('\n📝 Pour obtenir une clé DeepL API:');
  console.log('   1. Créer compte sur https://www.deepl.com/pro-api');
  console.log('   2. Choisir plan gratuit (500,000 chars/mois)');
  console.log('   3. Copier clé API');
  console.log('   4. Ajouter dans .env.local: DEEPL_API_KEY=your_key_here\n');
  process.exit(1);
}

const translator = new deepl.Translator(DEEPL_API_KEY);

// Traduction récursive d'un objet JSON
async function translateObject(
  obj: any,
  targetLang: string,
  sourceLang: string = 'FR',
  path: string = ''
): Promise<any> {
  if (typeof obj === 'string') {
    // Traduire la chaîne
    try {
      const result = await translator.translateText(
        obj,
        sourceLang.toLowerCase() as deepl.SourceLanguageCode,
        targetLang.toLowerCase() as deepl.TargetLanguageCode,
        {
          preserveFormatting: true,
          tagHandling: 'html', // Préserver balises HTML si présentes
        }
      );
      console.log(`   ✓ ${path}: "${obj.slice(0, 40)}..." → "${result.text.slice(0, 40)}..."`);
      return result.text;
    } catch (error) {
      console.error(`   ✗ Erreur traduction ${path}:`, error);
      return obj; // Retourner original en cas d'erreur
    }
  }

  if (Array.isArray(obj)) {
    // Traduire chaque élément du tableau
    const translated = [];
    for (let i = 0; i < obj.length; i++) {
      translated.push(await translateObject(obj[i], targetLang, sourceLang, `${path}[${i}]`));
    }
    return translated;
  }

  if (typeof obj === 'object' && obj !== null) {
    // Traduire chaque clé de l'objet
    const translated: any = {};
    for (const key in obj) {
      const newPath = path ? `${path}.${key}` : key;
      translated[key] = await translateObject(obj[key], targetLang, sourceLang, newPath);
    }
    return translated;
  }

  // Autres types (number, boolean, null) → retourner tel quel
  return obj;
}

async function translateMessages() {
  console.log('🌍 Traduction automatique DeepL - Guillaume Farré\n');

  const messagesDir = path.join(process.cwd(), 'messages');
  const frPath = path.join(messagesDir, 'fr.json');
  const enPath = path.join(messagesDir, 'en.json');
  const itPath = path.join(messagesDir, 'it.json');

  // Lire fichier FR (source vérité)
  console.log('1️⃣  Lecture messages/fr.json...');
  const frRaw = await fs.readFile(frPath, 'utf-8');
  const frMessages = JSON.parse(frRaw);
  console.log(`   ✅ ${Object.keys(frMessages).length} sections trouvées\n`);

  // Compter total de chaînes
  const countStrings = (obj: any): number => {
    if (typeof obj === 'string') return 1;
    if (Array.isArray(obj)) return obj.reduce((sum, item) => sum + countStrings(item), 0);
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).reduce((sum, val) => sum + countStrings(val), 0);
    }
    return 0;
  };

  const totalStrings = countStrings(frMessages);
  console.log(`📊 Statistiques: ${totalStrings} chaînes à traduire × 2 langues = ${totalStrings * 2} traductions\n`);

  // Créer backups
  console.log('2️⃣  Création backups...');
  try {
    const enExists = await fs.access(enPath).then(() => true).catch(() => false);
    const itExists = await fs.access(itPath).then(() => true).catch(() => false);

    if (enExists) {
      const backupEnPath = path.join(messagesDir, `en.backup.${Date.now()}.json`);
      await fs.copyFile(enPath, backupEnPath);
      console.log(`   ✅ Backup EN: ${path.basename(backupEnPath)}`);
    }

    if (itExists) {
      const backupItPath = path.join(messagesDir, `it.backup.${Date.now()}.json`);
      await fs.copyFile(itPath, backupItPath);
      console.log(`   ✅ Backup IT: ${path.basename(backupItPath)}`);
    }
  } catch (error) {
    console.log('   ℹ️  Aucun backup nécessaire (fichiers n\'existent pas)');
  }
  console.log('');

  // Traduire FR → EN
  console.log('3️⃣  Traduction FR → EN...');
  const enMessages = await translateObject(frMessages, 'EN', 'FR');
  await fs.writeFile(enPath, JSON.stringify(enMessages, null, 2), 'utf-8');
  console.log(`   ✅ messages/en.json créé\n`);

  // Traduire FR → IT
  console.log('4️⃣  Traduction FR → IT...');
  const itMessages = await translateObject(frMessages, 'IT', 'FR');
  await fs.writeFile(itPath, JSON.stringify(itMessages, null, 2), 'utf-8');
  console.log(`   ✅ messages/it.json créé\n`);

  // Statistiques finales
  console.log('✅ Traduction terminée avec succès!\n');
  console.log('📁 Fichiers générés:');
  console.log(`   - messages/en.json (${totalStrings} traductions EN)`);
  console.log(`   - messages/it.json (${totalStrings} traductions IT)`);
  console.log('\n💡 Prochaines étapes:');
  console.log('   1. Vérifier qualité traductions dans messages/en.json et messages/it.json');
  console.log('   2. Ajuster manuellement si besoin (nuances artistiques)');
  console.log('   3. Tester site EN et IT pour vérifier rendu');
  console.log('   4. Commit et push vers GitHub\n');
}

// Exécution
translateMessages().catch((error) => {
  console.error('❌ Erreur traduction:', error);
  process.exit(1);
});

// Lalou
