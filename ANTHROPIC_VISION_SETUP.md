# Anthropic Claude Vision - Setup & Utilisation

Date: 2025-11-07
Par: Lalou
Objectif: Générer descriptions photos automatiquement avec IA

---

## POURQUOI CLAUDE VISION

**Fonctionnalité requise**: Chaque photo doit avoir description générée par IA.

**Pourquoi Claude Vision**:
- Meilleure compréhension images que GPT-4V
- Descriptions naturelles, poétiques
- API simple
- Modèle Haiku = rapide + économique

---

## MODÈLES DISPONIBLES

### Claude 3.5 Sonnet

**Usage**: Analyse complexe, descriptions longues détaillées

**Pricing**: ~$3 par 1M tokens input, ~$15 par 1M tokens output

**Vitesse**: Moyenne

**Recommandé pour**: Analyses approfondies (pas notre cas ici)

### Claude 3.5 Haiku ⭐ RECOMMANDÉ

**Usage**: Descriptions courtes rapides (2-3 phrases)

**Pricing**: ~$0.25 par 1M tokens input, ~$1.25 par 1M tokens output

**Vitesse**: Rapide (< 2s)

**Recommandé pour**: Descriptions photos Guillaume Farré ✅

**Estimation coûts**:
- 1 photo = ~500 tokens (image + prompt + réponse)
- 100 photos = 50k tokens = **$0.06** (6 centimes)
- 1000 photos = **$0.60**

→ Quasi gratuit pour usage Guillaume

---

## SIGNUP (5 min)

### Étape 1: Créer compte

1. Aller sur https://console.anthropic.com/
2. Cliquer "Sign Up"
3. Options:
   - Email + password
   - OU Google account
4. Valider email

### Étape 2: Obtenir API key

1. Console: https://console.anthropic.com/settings/keys
2. Cliquer "Create Key"
3. Nom: "guillaume-farre-photo-descriptions"
4. Copier clé (format: `sk-ant-xxx...`)

### Étape 3: Ajouter crédits

**Compte gratuit**: $5 crédits offerts (suffit pour tester)

**Après**: Pay-as-you-go
- Ajouter carte bancaire
- Pas de frais mensuels
- Payé uniquement usage

### Étape 4: Ajouter .env.local

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

---

## USAGE API

### Endpoint

```
POST https://api.anthropic.com/v1/messages
```

### Headers

```
x-api-key: YOUR_KEY_HERE
anthropic-version: 2023-06-01
content-type: application/json
```

### Body (Vision)

```json
{
  "model": "claude-3-5-haiku-20241022",
  "max_tokens": 150,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "BASE64_IMAGE_DATA_HERE"
          }
        },
        {
          "type": "text",
          "text": "Décris cette photographie d'art en 2-3 phrases."
        }
      ]
    }
  ]
}
```

### Response

```json
{
  "id": "msg_xxx",
  "content": [
    {
      "type": "text",
      "text": "Cette photographie capture l'instant précis où une Ferrari laisse son empreinte sur la toile..."
    }
  ],
  "model": "claude-3-5-haiku-20241022",
  "usage": {
    "input_tokens": 450,
    "output_tokens": 50
  }
}
```

---

## PROMPTS RECOMMANDÉS

### Série limitée (poétique)

```
Décris cette photographie d'art capturant l'instant où une Ferrari peint une toile.
Texte poétique mais concret, 2-3 phrases maximum.
Mentionne couleurs, mouvement, matière.
Évite clichés ("unique", "irréversible", "instant précis").
Style humain naturel.
```

### Tirage illimité (factuel)

```
Décris brièvement cette photo documentaire montrant une Ferrari créant une œuvre.
1-2 phrases claires, accessibles, factuelles.
Mentionne couleurs et action visible.
Style direct, pas poétique.
```

---

## CODE EXEMPLE

Créer `lib/anthropic-vision.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * Générer description photo
 */
export async function generatePhotoDescription(
  imagePath: string,
  category: 'limited' | 'unlimited'
): Promise<string> {
  // Lire image
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  // Prompt selon catégorie
  const prompt = category === 'limited'
    ? `Décris cette photographie d'art capturant l'instant où une Ferrari peint une toile.
Texte poétique mais concret, 2-3 phrases maximum.
Mentionne couleurs, mouvement, matière.
Évite clichés ("unique", "irréversible", "instant précis").
Style humain naturel.`
    : `Décris brièvement cette photo documentaire montrant une Ferrari créant une œuvre.
1-2 phrases claires, accessibles, factuelles.
Mentionne couleurs et action visible.
Style direct, pas poétique.`;

  // Appel API
  const response = await client.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 150,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  return response.content[0].text;
}
```

**Usage**:

```typescript
const description = await generatePhotoDescription(
  '/path/to/photo.jpg',
  'limited'
);

console.log(description);
// "Les roues de la Ferrari tracent des courbes rouge vif sur la toile blanche.
//  La peinture se dépose par friction, créant des lignes organiques imprévisibles."
```

---

## INTÉGRATION INTERFACE ADMIN

Dans `app/[locale]/admin/page.tsx`:

```tsx
'use client';

import { generatePhotoDescription } from '@/lib/anthropic-vision';
import { useState } from 'react';

export default function AdminPage() {
  const [generatingDescription, setGeneratingDescription] = useState(false);

  async function handleGenerateDescription(photo: PhotoMetadata) {
    setGeneratingDescription(true);

    try {
      // Appeler API route
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoPath: photo.path,
          category: photo.categories.includes('limited') ? 'limited' : 'unlimited',
        }),
      });

      const { description } = await response.json();

      // Mettre à jour metadata
      photo.description = description;
      photo.aiGenerated = true;

      // Sauvegarder
      await savePhotoMetadata(photo);

      alert('Description générée!');
    } catch (error) {
      console.error(error);
      alert('Erreur génération description');
    } finally {
      setGeneratingDescription(false);
    }
  }

  return (
    <div>
      {photos.map(photo => (
        <div key={photo.filename}>
          <img src={photo.path} alt={photo.title} />

          {/* Description */}
          <textarea
            value={photo.description || ''}
            onChange={e => {
              photo.description = e.target.value;
              photo.aiGenerated = false; // Modifié manuellement
            }}
            placeholder="Description..."
          />

          {/* Bouton générer */}
          <button
            onClick={() => handleGenerateDescription(photo)}
            disabled={generatingDescription}
          >
            {generatingDescription ? 'Génération...' : '✨ Générer description IA'}
          </button>

          {photo.aiGenerated && (
            <span style={{ fontSize: '12px', color: '#888' }}>
              Généré par IA (éditable)
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

Créer route API `app/api/generate-description/route.ts`:

```typescript
import { generatePhotoDescription } from '@/lib/anthropic-vision';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { photoPath, category } = await req.json();

  try {
    const description = await generatePhotoDescription(
      `./public${photoPath}`,
      category
    );

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}
```

---

## BONNES PRATIQUES

### 1. Cache descriptions
Éviter regénérer si déjà existe:

```typescript
if (photo.description && !forceRegenerate) {
  return photo.description;
}
```

### 2. Batch processing
Générer descriptions par lots (5-10 photos) pour Guillaume:

```typescript
async function generateAllDescriptions(photos: PhotoMetadata[]) {
  for (const photo of photos) {
    if (!photo.description) {
      photo.description = await generatePhotoDescription(photo.path, ...);
      await sleep(1000); // Rate limit 1 req/s
    }
  }
}
```

### 3. Édition manuelle
Guillaume peut toujours modifier:

```tsx
<textarea
  value={description}
  onChange={...}
  placeholder="Modifier description si besoin"
/>
```

---

## MONITORING USAGE

Console Anthropic:
1. https://console.anthropic.com/settings/usage
2. Voir tokens utilisés
3. Coûts estimés

---

## PROCHAINES ÉTAPES

1. Signup Anthropic
2. Obtenir API key + ajouter crédits $5
3. Installer SDK: `bun add @anthropic-ai/sdk`
4. Créer lib/anthropic-vision.ts
5. Créer app/api/generate-description/route.ts
6. Intégrer bouton admin
7. Tester sur 3-5 photos
8. Vérifier qualité descriptions
9. Commit

**Temps**: 2h total

---

Lalou
