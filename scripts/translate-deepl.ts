/**
 * Script de traduction automatique avec DeepL API
 *
 * Usage:
 *   bun run translate:deepl
 *
 * Fonctionnalités:
 * - Détecte clés manquantes dans EN/IT par rapport à FR
 * - Traduit uniquement clés manquantes (optimise quota DeepL)
 * - Préserve structure JSON exacte
 * - Backup automatique avant modification
 * - Validation finale
 *
 * @author Lalou
 */

import fs from 'fs/promises';
import path from 'path';
import * as deepl from 'deepl-node';

// Types
interface TranslationObject {
  [key: string]: string | TranslationObject;
}

interface MissingKeys {
  path: string;
  value: string | TranslationObject;
}

// Configuration
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const FR_PATH = path.join(MESSAGES_DIR, 'fr.json');
const EN_PATH = path.join(MESSAGES_DIR, 'en.json');
const IT_PATH = path.join(MESSAGES_DIR, 'it.json');

/**
 * Trouve toutes les clés manquantes dans target par rapport à source
 */
function findMissingKeys(
  source: TranslationObject,
  target: TranslationObject,
  currentPath: string = ''
): MissingKeys[] {
  const missing: MissingKeys[] = [];

  for (const [key, value] of Object.entries(source)) {
    const fullPath = currentPath ? `${currentPath}.${key}` : key;

    if (!(key in target)) {
      // Clé complètement absente
      missing.push({ path: fullPath, value });
    } else if (typeof value === 'object' && value !== null) {
      // Parcourir récursivement
      if (typeof target[key] === 'object' && target[key] !== null) {
        missing.push(...findMissingKeys(value, target[key] as TranslationObject, fullPath));
      } else {
        // Type mismatch: source est objet, target est string
        missing.push({ path: fullPath, value });
      }
    }
    // Si clé existe et n'est pas un objet, on considère qu'elle est déjà traduite
  }

  return missing;
}

/**
 * Définit une valeur dans un objet via un chemin (ex: "hero.origine.title")
 */
function setValueByPath(obj: TranslationObject, path: string, value: string | TranslationObject): void {
  const keys = path.split('.');
  let current: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Traduit un texte via DeepL SDK officiel
 */
async function translateText(
  translator: deepl.Translator,
  text: string,
  targetLang: 'en-GB' | 'it'
): Promise<string> {
  const result = await translator.translateText(text, 'fr', targetLang, {
    formality: 'default',
  });
  return result.text;
}

/**
 * Traduit récursivement une valeur (string ou objet)
 */
async function translateValue(
  translator: deepl.Translator,
  value: string | TranslationObject,
  targetLang: 'en-GB' | 'it'
): Promise<string | TranslationObject> {
  if (typeof value === 'string') {
    // Traduire string directement
    console.log(`  🔄 Traduction: "${value.slice(0, 50)}${value.length > 50 ? '...' : ''}"`);
    const translated = await translateText(translator, value, targetLang);
    console.log(`  ✅ Résultat: "${translated.slice(0, 50)}${translated.length > 50 ? '...' : ''}"`);
    return translated;
  } else {
    // Objet: traduire chaque propriété récursivement
    const translated: TranslationObject = {};
    for (const [key, val] of Object.entries(value)) {
      translated[key] = await translateValue(translator, val, targetLang);
    }
    return translated;
  }
}

/**
 * Crée un backup d'un fichier
 */
async function backupFile(filePath: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
  const backupPath = filePath.replace('.json', `.backup-${timestamp}.json`);
  await fs.copyFile(filePath, backupPath);
  console.log(`📦 Backup créé: ${path.basename(backupPath)}`);
}

/**
 * Fonction principale
 */
async function main() {
  console.log('\n🌍 TRADUCTION DEEPL - Guillaume Farré\n');

  try {
    // 1. Vérifier clé API
    if (!DEEPL_API_KEY) {
      throw new Error(
        '\n❌ DEEPL_API_KEY manquante!\n\n' +
        'Créez un compte gratuit sur https://www.deepl.com/pro-api\n' +
        'Puis ajoutez dans .env.local:\n' +
        'DEEPL_API_KEY=votre_cle_api\n'
      );
    }

    // Initialiser translator DeepL
    const translator = new deepl.Translator(DEEPL_API_KEY);

    // 2. Charger fichiers JSON
    console.log('📂 Chargement fichiers traduction...\n');
    const frContent = await fs.readFile(FR_PATH, 'utf-8');
    const enContent = await fs.readFile(EN_PATH, 'utf-8');
    const itContent = await fs.readFile(IT_PATH, 'utf-8');

    const fr: TranslationObject = JSON.parse(frContent);
    const en: TranslationObject = JSON.parse(enContent);
    const it: TranslationObject = JSON.parse(itContent);

    console.log(`✅ FR: ${Object.keys(fr).length} sections`);
    console.log(`✅ EN: ${Object.keys(en).length} sections`);
    console.log(`✅ IT: ${Object.keys(it).length} sections\n`);

    // 3. Détecter clés manquantes
    console.log('🔍 Détection clés manquantes...\n');
    const missingEN = findMissingKeys(fr, en);
    const missingIT = findMissingKeys(fr, it);

    if (missingEN.length === 0 && missingIT.length === 0) {
      console.log('✅ Aucune clé manquante! Traductions complètes.\n');
      return;
    }

    console.log(`🇬🇧 EN: ${missingEN.length} clés manquantes`);
    console.log(`🇮🇹 IT: ${missingIT.length} clés manquantes\n`);

    // 4. Backup avant modification
    if (missingEN.length > 0) {
      await backupFile(EN_PATH);
    }
    if (missingIT.length > 0) {
      await backupFile(IT_PATH);
    }

    // 5. Traduire clés manquantes EN
    if (missingEN.length > 0) {
      console.log('\n🇬🇧 TRADUCTION EN (Anglais britannique)...\n');
      for (const { path: keyPath, value } of missingEN) {
        console.log(`📝 Clé: ${keyPath}`);
        const translated = await translateValue(translator, value, 'en-GB');
        setValueByPath(en, keyPath, translated);

        // Pause 100ms entre requêtes (rate limiting DeepL)
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // 6. Traduire clés manquantes IT
    if (missingIT.length > 0) {
      console.log('\n🇮🇹 TRADUCTION IT (Italien)...\n');
      for (const { path: keyPath, value } of missingIT) {
        console.log(`📝 Clé: ${keyPath}`);
        const translated = await translateValue(translator, value, 'it');
        setValueByPath(it, keyPath, translated);

        // Pause 100ms entre requêtes
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // 7. Sauvegarder fichiers mis à jour
    console.log('\n💾 Sauvegarde fichiers traduits...\n');

    if (missingEN.length > 0) {
      await fs.writeFile(EN_PATH, JSON.stringify(en, null, 2) + '\n', 'utf-8');
      console.log(`✅ ${path.basename(EN_PATH)} mis à jour`);
    }

    if (missingIT.length > 0) {
      await fs.writeFile(IT_PATH, JSON.stringify(it, null, 2) + '\n', 'utf-8');
      console.log(`✅ ${path.basename(IT_PATH)} mis à jour`);
    }

    // 8. Résumé final
    console.log('\n✅ TRADUCTION TERMINÉE!\n');
    console.log(`🇫🇷 FR: ${Object.keys(fr).length} sections (source)`);
    console.log(`🇬🇧 EN: ${Object.keys(en).length} sections (+${missingEN.length} traduites)`);
    console.log(`🇮🇹 IT: ${Object.keys(it).length} sections (+${missingIT.length} traduites)\n`);

  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    process.exit(1);
  }
}

// Exécution
main();
