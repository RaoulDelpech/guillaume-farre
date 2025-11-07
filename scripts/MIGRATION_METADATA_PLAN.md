# Plan migration PhotoMetadata schema

Date: 2025-11-07
Par: Lalou
Objectif: Migrer ancien schema vers nouveau (categories array, description, status)

---

## AVANT / APRÈS

### Ancien schema (actuel)

```typescript
export interface PhotoMetadata {
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
```

### Nouveau schema (cible)

```typescript
export interface PhotoMetadata {
  // Identifiants
  filename: string;
  path: string;

  // Informations générales
  title?: string;
  year?: number;
  seriesName?: string;

  // NOUVEAU : Catégories multiples
  categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];

  // NOUVEAU : Description IA
  description?: string;
  aiGenerated?: boolean;

  // NOUVEAU : Statuts
  status: 'active' | 'trash' | 'to-sort';

  // Visibilité et vente
  visible: boolean;
  forSale: boolean;

  // Éditions limitées (si categories contient 'limited')
  limitedEdition?: {
    total: 7;
    sold: number;
    available: number;
    closed: boolean;
  };

  // Prix (selon catégorie)
  prices?: {
    unlimited?: { a4: 150; a3: 250; a2: 400; };
    limited?: { a3: 500; a2: 800; a1: 1200; };
    xxl?: number;
    monumental?: number;
  };
}
```

---

## PLAN MIGRATION (10 étapes)

### Étape 1: Backup données existantes

**Fichier**: `lib/admin/photo-manager.ts`

**Action**: Créer backup avant toute modification

```bash
# Créer backup metadata
cp lib/admin/photo-metadata.json lib/admin/photo-metadata.backup.$(date +%Y%m%d_%H%M%S).json

# Vérifier backup créé
ls -lh lib/admin/photo-metadata.backup.*
```

---

### Étape 2: Créer nouveau interface TypeScript

**Fichier**: `lib/admin/photo-manager.ts`

**Action**: Ajouter nouveau interface `PhotoMetadataV2` (ne pas remplacer ancien tout de suite)

```typescript
// NOUVEAU SCHEMA V2
export interface PhotoMetadataV2 {
  filename: string;
  path: string;
  title?: string;
  year?: number;
  seriesName?: string;
  categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];
  description?: string;
  aiGenerated?: boolean;
  status: 'active' | 'trash' | 'to-sort';
  visible: boolean;
  forSale: boolean;
  limitedEdition?: {
    total: 7;
    sold: number;
    available: number;
    closed: boolean;
  };
  prices?: {
    unlimited?: { a4: 150; a3: 250; a2: 400; };
    limited?: { a3: 500; a2: 800; a1: 1200; };
    xxl?: number;
    monumental?: number;
  };
}
```

---

### Étape 3: Créer fonction migration

**Fichier**: `scripts/migrate-metadata.ts`

```typescript
import { PhotoMetadata, PhotoMetadataV2 } from '../lib/admin/photo-manager';

function migratePhotoMetadata(old: PhotoMetadata): PhotoMetadataV2 {
  const newMeta: PhotoMetadataV2 = {
    // Identifiants (copie directe)
    filename: old.filename,
    path: old.path,
    title: old.title,
    year: old.year,
    seriesName: old.seriesName,
    visible: old.visible,
    forSale: old.forSale,

    // NOUVEAU: Mapper edition.type vers categories array
    categories: [],

    // NOUVEAU: Description vide (à générer par IA après)
    description: undefined,
    aiGenerated: false,

    // NOUVEAU: Status par défaut
    status: old.visible ? 'active' : 'to-sort',
  };

  // Mapper ancien edition.type vers nouveau categories[]
  if (old.edition?.type === 'limited') {
    newMeta.categories.push('limited');

    // Créer limitedEdition
    newMeta.limitedEdition = {
      total: 7,
      sold: old.edition.count || 0,
      available: 7 - (old.edition.count || 0),
      closed: false,
    };

    // Prices limited
    newMeta.prices = {
      limited: { a3: 500, a2: 800, a1: 1200 },
    };
  }

  if (old.edition?.type === 'open' || !old.edition) {
    newMeta.categories.push('unlimited');

    // Prices unlimited
    newMeta.prices = {
      unlimited: { a4: 150, a3: 250, a2: 400 },
    };
  }

  // Si ancien price existe, l'ignorer (on utilise nouveau pricing structure)

  return newMeta;
}
```

---

### Étape 4: Créer script migration

**Fichier**: `scripts/migrate-metadata.ts`

```typescript
import fs from 'fs';
import path from 'path';

const METADATA_PATH = path.join(process.cwd(), 'lib/admin/photo-metadata.json');
const BACKUP_PATH = METADATA_PATH.replace('.json', `.backup.${Date.now()}.json`);

async function main() {
  console.log('1. Lecture métadonnées actuelles...');
  const oldData: PhotoMetadata[] = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
  console.log(`   ${oldData.length} photos trouvées`);

  console.log('2. Backup...');
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(oldData, null, 2));
  console.log(`   Backup créé: ${BACKUP_PATH}`);

  console.log('3. Migration...');
  const newData: PhotoMetadataV2[] = oldData.map(migratePhotoMetadata);
  console.log(`   ${newData.length} photos migrées`);

  console.log('4. Écriture nouveau fichier...');
  fs.writeFileSync(METADATA_PATH, JSON.stringify(newData, null, 2));
  console.log('   Migration terminée!');

  console.log('\nRésumé:');
  console.log(`- Backup: ${BACKUP_PATH}`);
  console.log(`- Nouveau schema: ${METADATA_PATH}`);
  console.log(`- Photos limited: ${newData.filter(p => p.categories.includes('limited')).length}`);
  console.log(`- Photos unlimited: ${newData.filter(p => p.categories.includes('unlimited')).length}`);
}

main().catch(console.error);
```

---

### Étape 5: Tester migration sur données test

**Action**: Créer petit fichier test

```bash
# Créer photo-metadata.test.json avec 3 photos test
echo '[
  {
    "filename": "test1.jpg",
    "path": "/images/test1.jpg",
    "edition": {"type": "limited", "count": 2}
  },
  {
    "filename": "test2.jpg",
    "path": "/images/test2.jpg",
    "edition": {"type": "open"}
  },
  {
    "filename": "test3.jpg",
    "path": "/images/test3.jpg"
  }
]' > lib/admin/photo-metadata.test.json

# Tester migration
bun scripts/migrate-metadata.ts

# Vérifier résultat
cat lib/admin/photo-metadata.json
```

---

### Étape 6: Vérifier résultat migration test

**Vérifications**:

1. Toutes photos présentes (count identique)
2. `categories` array non vide pour chaque photo
3. `prices` structure correcte
4. `limitedEdition` présent si `categories` contient 'limited'
5. `status` défini pour chaque photo
6. Backup créé

Si OK → passer étape 7
Si KO → corriger fonction migration, recommencer étape 5

---

### Étape 7: Migration données réelles

```bash
# Backup manuel supplémentaire
cp lib/admin/photo-metadata.json ~/Desktop/photo-metadata.backup.$(date +%Y%m%d).json

# Migration
bun scripts/migrate-metadata.ts

# Vérifier
cat lib/admin/photo-metadata.json | head -50
```

---

### Étape 8: Mettre à jour interface admin

**Fichiers à modifier**:

1. `app/[locale]/admin/page.tsx`
   - Remplacer `PhotoMetadata` par `PhotoMetadataV2`
   - Ajouter UI checkboxes catégories multiples
   - Ajouter UI statuts (active/trash/to-sort)
   - Ajouter UI description + aiGenerated flag

2. `lib/admin/photo-manager.ts`
   - Supprimer ancien interface `PhotoMetadata`
   - Renommer `PhotoMetadataV2` → `PhotoMetadata`
   - Mettre à jour fonctions CRUD

---

### Étape 9: Mettre à jour interface boutique

**Fichiers à modifier**:

1. `app/[locale]/boutique/page.tsx`
   - Utiliser `photo.categories.includes('limited')` au lieu de `photo.edition.type === 'limited'`
   - Afficher formats selon catégories:
     - Si 'limited': A3/A2/A1 uniquement (PAS A4)
     - Si 'unlimited': A4/A3/A2

2. `app/api/create-checkout-session/route.ts`
   - Utiliser nouveau `photo.prices.limited.a3` au lieu de `photo.price`
   - Vérifier stock `limitedEdition.available > 0`

---

### Étape 10: Tests finaux

**Checklist**:

- [ ] Upload photo fonctionne
- [ ] Photos affichées admin (pas rectangles gris)
- [ ] Catégories multiples sélectionnables
- [ ] Statuts changeables
- [ ] Boutique affiche formats corrects selon catégorie
- [ ] Paiement Stripe fonctionne (mode test)
- [ ] Prix corrects selon catégorie

Si tout OK → Migration terminée ✅

---

## ROLLBACK (si problème)

```bash
# Restaurer backup
cp lib/admin/photo-metadata.backup.XXXXXX.json lib/admin/photo-metadata.json

# Ou Desktop backup
cp ~/Desktop/photo-metadata.backup.YYYYMMDD.json lib/admin/photo-metadata.json

# Revert code
git checkout HEAD -- lib/admin/photo-manager.ts app/[locale]/admin/page.tsx
```

---

## ORDRE D'EXÉCUTION

1. Lire ce plan entièrement
2. Étapes 1-6: Migration + tests (1h)
3. Étape 7: Migration données réelles (5 min)
4. Étapes 8-9: Code interface (2h)
5. Étape 10: Tests finaux (30 min)

**Total: 3h30**

---

Lalou
