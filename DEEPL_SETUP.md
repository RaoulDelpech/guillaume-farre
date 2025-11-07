# DeepL API - Setup & Utilisation

Date: 2025-11-07
Par: Lalou
Objectif: Traductions professionnelles FR → EN/IT

---

## POURQUOI DEEPL

**Problème actuel**: Traductions manuelles incomplètes + qualité médiocre.

**Solution DeepL**:
- Qualité traduction supérieure Google Translate
- Nuances préservées
- Contexte compris
- API simple

---

## PLANS DEEPL

### Plan Gratuit (DeepL API Free)

**Limites**:
- 500,000 caractères/mois
- Pas de garantie SLA
- Watermark "Translated with DeepL"

**Prix**: €0

**Suffisant pour Guillaume Farré?** OUI ✅
- messages/fr.json ≈ 15,000 caractères
- Traduction FR→EN + FR→IT = 30,000 chars
- Largement dans limite gratuite

### Plan Pro (DeepL API Pro)

**Limites**:
- À partir €5.49/mois (pay-as-you-go)
- €0.000025/caractère
- Pas de watermark
- SLA garanti

**Utile si**: Volume > 500k chars/mois (pas le cas ici).

---

## SIGNUP (5 min)

### Étape 1: Créer compte

1. Aller sur https://www.deepl.com/pro-api
2. Cliquer "Try DeepL API Free"
3. Options:
   - Email + password
   - OU Google account
4. Valider email

### Étape 2: Obtenir API key

1. Connecté sur https://www.deepl.com/account/
2. Onglet "API Keys"
3. Cliquer "Create new key"
4. Copier clé (format: `xxxx-xxxx-xxxx-xxxx:fx`)

### Étape 3: Ajouter .env.local

```bash
# .env.local
DEEPL_API_KEY=your_key_here:fx
DEEPL_API_URL=https://api-free.deepl.com/v2
```

**Note**: URL API Free = `api-free.deepl.com` (pas `api.deepl.com`)

---

## USAGE API

### Endpoint principal

**Traduire texte**:
```
POST https://api-free.deepl.com/v2/translate
```

**Headers**:
```
Authorization: DeepL-Auth-Key YOUR_KEY_HERE
Content-Type: application/json
```

**Body**:
```json
{
  "text": ["Texte à traduire"],
  "source_lang": "FR",
  "target_lang": "EN"
}
```

**Response**:
```json
{
  "translations": [
    {
      "detected_source_language": "FR",
      "text": "Text to translate"
    }
  ]
}
```

---

## LANGUES SUPPORTÉES

**Source**: FR (Français)

**Cibles** (Guillaume Farré):
- EN (Anglais)
- IT (Italien)

Autres cibles disponibles: DE, ES, PT, RU, JA, ZH, etc.

---

## SCRIPT TRADUCTION (skeleton)

Créer `scripts/translate-deepl.ts`:

```typescript
// Traduire messages/fr.json → en.json + it.json

import fs from 'fs';
import path from 'path';

const API_KEY = process.env.DEEPL_API_KEY || '';
const API_URL = 'https://api-free.deepl.com/v2/translate';

async function translateText(text: string, targetLang: 'EN' | 'IT'): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: 'FR',
      target_lang: targetLang,
    }),
  });

  const data = await response.json();
  return data.translations[0].text;
}

async function translateJSON(sourcePath: string, targetPath: string, targetLang: 'EN' | 'IT') {
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  const target: any = {};

  // Traduire récursivement
  async function translateObject(obj: any, parent: any, key?: string) {
    if (typeof obj === 'string') {
      // Traduire string
      const translated = await translateText(obj, targetLang);
      if (key) parent[key] = translated;
      return translated;
    } else if (typeof obj === 'object') {
      // Parcourir objet
      for (const [k, v] of Object.entries(obj)) {
        if (!target[k]) target[k] = {};
        await translateObject(v, target[k], k);
      }
    }
  }

  await translateObject(source, target);

  fs.writeFileSync(targetPath, JSON.stringify(target, null, 2));
  console.log(`✅ Traduction ${targetLang} terminée: ${targetPath}`);
}

async function main() {
  const frPath = path.join(process.cwd(), 'messages/fr.json');
  const enPath = path.join(process.cwd(), 'messages/en.json');
  const itPath = path.join(process.cwd(), 'messages/it.json');

  console.log('🌍 Traduction FR → EN...');
  await translateJSON(frPath, enPath, 'EN');

  console.log('🌍 Traduction FR → IT...');
  await translateJSON(frPath, itPath, 'IT');

  console.log('✅ Toutes traductions terminées!');
}

main().catch(console.error);
```

**Exécution**:
```bash
bun scripts/translate-deepl.ts
```

---

## LIMITES & BONNES PRATIQUES

### Limites Free Plan

500k caractères/mois:
- messages/fr.json (15k chars) x 2 langues = 30k chars
- Reste: 470k chars (largement suffisant)

### Bonnes pratiques

1. **Préserver placeholders**:
   - `{count}` dans texte → doit rester `{count}` après traduction
   - Utiliser `tag_handling: "xml"` si nécessaire

2. **Contexte**:
   - DeepL utilise contexte pour meilleure traduction
   - Traduire phrases entières (pas mot par mot)

3. **Vérification manuelle**:
   - Relire traductions générées
   - Ajuster si nécessaire (surtout termes techniques)

---

## MONITORING USAGE

Dashboard DeepL:
1. https://www.deepl.com/account/usage
2. Voir caractères utilisés ce mois
3. Alerte si approche limite

---

## ALTERNATIVE SI BESOIN

Si dépassement limite gratuite:

**Option A**: Passer Plan Pro (€5.49/mois)

**Option B**: Google Cloud Translation API
- 500k chars/mois gratuit aussi
- Qualité légèrement inférieure DeepL

---

## PROCHAINES ÉTAPES

1. Signup DeepL Free
2. Obtenir API key
3. Ajouter .env.local
4. Créer scripts/translate-deepl.ts
5. Tester sur messages/fr.json
6. Vérifier qualité EN + IT
7. Commit traductions

**Temps**: 1h total

---

Lalou
