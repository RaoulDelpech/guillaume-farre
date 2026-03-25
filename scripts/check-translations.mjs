#!/usr/bin/env node
/**
 * Script de vérification des traductions FR/EN/IT
 * Vérifie que toutes les clés FR sont présentes dans EN et IT
 * @author Lalou
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const fr = JSON.parse(readFileSync('messages/fr.json', 'utf-8'));
const en = JSON.parse(readFileSync('messages/en.json', 'utf-8'));
const it = JSON.parse(readFileSync('messages/it.json', 'utf-8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const frKeys = getAllKeys(fr).sort();
const enKeys = getAllKeys(en).sort();
const itKeys = getAllKeys(it).sort();

const missingEN = frKeys.filter(k => !enKeys.includes(k));
const missingIT = frKeys.filter(k => !itKeys.includes(k));

console.log('=== VÉRIFICATION TRADUCTIONS ===\n');
console.log(`Total clés FR: ${frKeys.length}`);
console.log(`Total clés EN: ${enKeys.length}`);
console.log(`Total clés IT: ${itKeys.length}`);

if (missingEN.length > 0) {
  console.log(`\n❌ Clés manquantes dans EN (${missingEN.length}):`);
  missingEN.forEach(k => console.log(`  - ${k}`));
} else {
  console.log('\n✅ Toutes les clés FR sont présentes dans EN');
}

if (missingIT.length > 0) {
  console.log(`\n❌ Clés manquantes dans IT (${missingIT.length}):`);
  missingIT.forEach(k => console.log(`  - ${k}`));
} else {
  console.log('\n✅ Toutes les clés FR sont présentes dans IT');
}

if (missingEN.length === 0 && missingIT.length === 0) {
  console.log('\n🎉 Toutes les traductions sont complètes !');
  process.exit(0);
} else {
  console.log('\n⚠️  Des traductions manquent');
  process.exit(1);
}

// Lalou
