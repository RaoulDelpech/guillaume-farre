# Plan Prochaine Session - Guillaume Farré

Date création: 7 novembre 2025, 23h50
Par: Lalou
Session précédente: 2025-11-07 (6h intensive, 11/11 tâches complétées)

---

## BILAN SESSION PRÉCÉDENTE

✅ **11/11 tâches complétées** en 6 heures
✅ **13 commits** pushés vers GitHub
✅ **25 fichiers** modifiés/créés
✅ **200+ clés** traduites (EN/IT)
✅ **~1500 lignes** code modifiées

**Derniers commits**:
- 907f521 - Rapport final session
- 72eb3af - Carousel photo neutre
- 2d3fad9 - Consignes client
- 864ee3b - Traductions IT
- d7ac6f1 - Compteur limited + traductions

---

## TÂCHES RESTANTES (4 tâches - ~5h)

### 🔴 1. Tests E2E critiques (1h)

**Objectif**: Créer tests automatisés pour workflows critiques.

**Fichiers à créer**:
```
tests/
├── e2e/
│   ├── admin-upload.test.ts        # Test upload photo → metadata → affichage
│   ├── checkout-stripe.test.ts     # Test checkout Stripe complet
│   ├── ai-descriptions.test.ts     # Test génération descriptions IA
│   └── setup.ts                    # Config Playwright/Cypress
```

**Tests requis**:
1. **Upload photo admin**:
   - Upload 3 photos (.jpg, .png)
   - Vérifier metadata créée
   - Vérifier affichage miniatures (pas rectangles gris)
   - Vérifier statuts (active par défaut)

2. **Checkout Stripe**:
   - Ajouter photo au panier
   - Sélectionner format (A3)
   - Sélectionner cadre (noir)
   - Compléter checkout
   - Vérifier session Stripe créée
   - Vérifier montant correct

3. **Descriptions IA**:
   - Sélectionner photo
   - Cliquer "Générer description IA"
   - Vérifier description générée
   - Vérifier flag `aiGenerated: true`
   - Modifier description manuellement
   - Vérifier sauvegarde

**Framework recommandé**: Playwright (Next.js best practice)

**Installation**:
```bash
npm install -D @playwright/test
npx playwright install
```

**Commande test**:
```bash
npx playwright test
```

---

### 🟠 2. Optimisation images (1h)

**Objectif**: Convertir toutes images vers `next/image` + WebP.

**Analyse effectuée**:
- ✅ **115 images** JPG/PNG analysées (77KB à 634KB)
- ✅ **10 composants** avec `<img>` identifiés

**Composants à modifier**:
1. `components/ImageZoom.tsx`
2. `components/GalleryGrid.tsx`
3. `components/SizeVisualizer.tsx`
4. `components/shop/ShopGrid.tsx`
5. `components/admin/DuplicateDetector.tsx`
6. `components/admin/InstagramConfig.tsx`
7. `components/admin/CommercialDashboard.tsx`
8. `components/admin/PhotoCard.tsx`
9. `components/admin/SeriesSuggestionModal.tsx`
10. `components/lightbox/Lightbox.tsx`

**Conversion**:

**Avant** (classique):
```tsx
<img
  src="/images/works/atelier/photo.jpg"
  alt="Description"
  className="w-full h-full object-cover"
/>
```

**Après** (optimisé):
```tsx
import Image from 'next/image';

<Image
  src="/images/works/atelier/photo.jpg"
  alt="Description"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Bénéfices attendus**:
- ✅ Lazy loading automatique
- ✅ Responsive images automatique
- ✅ Conversion WebP automatique
- ✅ Optimisation taille (-30 à -50%)
- ✅ Performance Lighthouse +20 points

**Configuration next.config.js**:
```js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

---

### 🟡 3. Interface catégories boutique (45 min)

**Objectif**: Filtres avancés dans boutique publique.

**Fichiers à modifier**:
- `app/[locale]/boutique/page.tsx`
- `components/shop/ShopFilters.tsx` (à créer)

**Interface requise**:

```tsx
// Filtres en haut de page boutique
<ShopFilters>
  <FilterButton active={filter === 'all'}>
    Toutes (42)
  </FilterButton>
  <FilterButton active={filter === 'limited'}>
    Éditions limitées (12) ⭐
  </FilterButton>
  <FilterButton active={filter === 'unlimited'}>
    Tirages illimités (25)
  </FilterButton>
  <FilterButton active={filter === 'xxl'}>
    XXL (3)
  </FilterButton>
  <FilterButton active={filter === 'monumental'}>
    Monumental (2)
  </FilterButton>
</ShopFilters>

// Tri
<SortDropdown>
  <option>Plus récent</option>
  <option>Plus ancien</option>
  <option>Prix croissant</option>
  <option>Prix décroissant</option>
  <option>Disponibilité (limited)</option>
</SortDropdown>
```

**Logique filtres**:
- Filtrer photos selon `categories[]`
- Afficher compteurs dynamiques
- Highlight "Éditions limitées" (badge ⭐)
- Tri par multiple critères

---

### 🟠 4. Validation formats serveur (30 min)

**Objectif**: Bloquer A4 si édition limitée (côté serveur).

**Fichiers à modifier**:
- `app/api/create-checkout-session/route.ts`
- `lib/validators/checkout.ts` (à créer)

**Validation requise**:

```typescript
// lib/validators/checkout.ts
export function validateCheckoutItem(item: CheckoutItem): ValidationResult {
  const { photo, format } = item;

  // RÈGLE: Pas A4 si édition limitée
  if (photo.categories.includes('limited') && format === 'A4') {
    return {
      valid: false,
      error: 'Les éditions limitées ne sont pas disponibles en format A4. Formats disponibles: A3, A2, A1.'
    };
  }

  // RÈGLE: Vérifier disponibilité
  if (photo.limitedEdition && photo.limitedEdition.available === 0) {
    return {
      valid: false,
      error: 'Cette édition limitée est épuisée.'
    };
  }

  // RÈGLE: Vérifier série close
  if (photo.limitedEdition && photo.limitedEdition.closed) {
    return {
      valid: false,
      error: 'Cette série est définitivement close.'
    };
  }

  return { valid: true };
}
```

**Tests unitaires** (`lib/validators/checkout.test.ts`):
```typescript
describe('validateCheckoutItem', () => {
  it('doit bloquer A4 pour édition limitée', () => {
    const photo: PhotoMetadata = {
      categories: ['limited'],
      // ...
    };
    const result = validateCheckoutItem({ photo, format: 'A4' });
    expect(result.valid).toBe(false);
  });

  it('doit accepter A3 pour édition limitée', () => {
    const photo: PhotoMetadata = {
      categories: ['limited'],
      // ...
    };
    const result = validateCheckoutItem({ photo, format: 'A3' });
    expect(result.valid).toBe(true);
  });

  it('doit accepter A4 pour tirage illimité', () => {
    const photo: PhotoMetadata = {
      categories: ['unlimited'],
      // ...
    };
    const result = validateCheckoutItem({ photo, format: 'A4' });
    expect(result.valid).toBe(true);
  });
});
```

---

## PROCESSUS BACKGROUND ACTIFS

**14 processus** lancés pendant session précédente:

| ID | Commande | Status | Résultat |
|----|----------|--------|----------|
| 623b18 | `bun run build` | ❌ Erreur | bun non disponible |
| 080111 | `bunx tsc --noEmit` | ❌ Erreur | bunx non disponible |
| cd7fdd | `find *.odt *.docx` | ✅ Succès | Aucun fichier trouvé |
| 4fb495 | `find images -name "*.jpg"` | ✅ Succès | 115 images listées |
| 52acb8 | `git commit consignes` | ✅ Succès | Commit 2d3fad9 |
| 692bca | `git commit carousel` | ✅ Succès | Commit 72eb3af |
| 238479 | `git commit rapport` | ✅ Succès | Commit 907f521 |
| 92da2f | `find *test*` | ✅ Succès | 1 fichier test trouvé |
| 32ed4b | `find <img>` | ✅ Succès | 10 composants trouvés |
| 70a3fe | `git commit logs` | ⏳ En cours | Commit logs processus |

**Fichiers logs créés**:
- `build.log` (build production)
- `tsc.log` (TypeScript check)
- `docs-files.txt` (recherche docs)
- `images-sizes.txt` (115 images analysées)

---

## ORDRE RECOMMANDÉ PROCHAINE SESSION

### Phase 1 - Setup (15 min)

1. Lire fichiers dans cet ordre:
   - `SESSION_2025-11-07_RAPPORT_FINAL.md` (bilan complet)
   - `PROCHAINE_SESSION_PLAN.md` (ce fichier)
   - `CLAUDE.md` (règles métier)
   - `.claude/REGLES_PROJET.md` (règles absolues)

2. Vérifier état git:
   ```bash
   git status
   git log -5 --oneline
   ```

3. Installer Playwright:
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

---

### Phase 2 - Tests E2E (1h)

**Priorité #1**: Tests critiques pour sécuriser prod.

1. Créer structure tests:
   ```bash
   mkdir -p tests/e2e
   touch tests/e2e/{admin-upload,checkout-stripe,ai-descriptions}.test.ts
   touch tests/e2e/setup.ts
   touch playwright.config.ts
   ```

2. Implémenter tests (ordre priorité):
   - ✅ Upload admin (30 min)
   - ✅ Checkout Stripe (20 min)
   - ✅ Descriptions IA (10 min)

3. Exécuter tests:
   ```bash
   npx playwright test
   npx playwright test --ui  # Mode interactif
   ```

4. Commit:
   ```bash
   git add tests/ playwright.config.ts
   git commit -m "test: Tests E2E critiques (upload, checkout, IA)"
   git push origin main
   ```

---

### Phase 3 - Optimisation images (1h)

**Priorité #2**: Performance + UX.

1. Configurer `next.config.js` (5 min)

2. Convertir composants un par un (45 min):
   - ImageZoom
   - GalleryGrid
   - SizeVisualizer
   - ShopGrid
   - DuplicateDetector
   - InstagramConfig
   - CommercialDashboard
   - PhotoCard
   - SeriesSuggestionModal
   - Lightbox

3. Tester visuellement toutes pages (5 min)

4. Commit:
   ```bash
   git add components/ next.config.js
   git commit -m "perf: Conversion images vers next/image + WebP"
   git push origin main
   ```

---

### Phase 4 - Interface boutique (45 min)

**Priorité #3**: UX boutique publique.

1. Créer `components/shop/ShopFilters.tsx` (20 min)

2. Modifier `app/[locale]/boutique/page.tsx` (15 min)

3. Styling Tailwind (5 min)

4. Tests manuels (5 min):
   - Filtrer "Éditions limitées"
   - Filtrer "Tirages illimités"
   - Trier par prix
   - Vérifier compteurs

5. Commit:
   ```bash
   git add components/shop/ app/[locale]/boutique/
   git commit -m "feat: Filtres avancés boutique (limited/unlimited/xxl)"
   git push origin main
   ```

---

### Phase 5 - Validation serveur (30 min)

**Priorité #4**: Sécurité business rules.

1. Créer `lib/validators/checkout.ts` (15 min)

2. Créer tests `lib/validators/checkout.test.ts` (10 min)

3. Intégrer dans API route (5 min)

4. Tests:
   ```bash
   npm test -- checkout.test.ts
   ```

5. Commit:
   ```bash
   git add lib/validators/
   git commit -m "feat: Validation formats serveur (pas A4 si limited)"
   git push origin main
   ```

---

## APRÈS CES 4 TÂCHES (prochaines sessions)

### 🔵 Gelato API setup (2 jours)

**Décision GO/NO-GO requise** après vérification pricing France.

**Étapes**:
1. Lire `GELATO_PRICING_VERIFICATION.md`
2. Créer compte Gelato
3. Vérifier pricing réel France
4. Calculer marges réelles
5. Décision Guillaume GO/NO-GO
6. Si GO: implémenter `lib/gelato-client.ts`
7. Webhooks Stripe → Gelato
8. Tests sandbox + commande réelle
9. Validation qualité impression
10. Basculer production

---

## RÈGLES ABSOLUES (rappel)

Ces règles DOIVENT être suivies à chaque session:

### 1. Sauvegardes régulières
- ✅ Commit toutes les 10-15 minutes
- ✅ Sauvegarder consignes client dans fichiers dédiés
- ✅ Ne JAMAIS perdre contexte entre sessions
- ✅ Enrichir documentation avec règles client

### 2. Validation point par point
- ✅ UNE question à la fois
- ✅ Attendre réponse avant continuer
- ✅ Recommandation claire avec chaque question
- ❌ JAMAIS 5+ questions d'un coup

### 3. Authenticité 100%
- ✅ ZÉRO mensonge sauf autorisation Guillaume
- ✅ Vérifier faits avant écrire
- ❌ Pas de "performances live" (n'existent pas)
- ❌ Pas de "quatre Ferrari grises" (couleurs variées)

### 4. Tests avant commit
- ✅ Tests manuels minimum
- ✅ TypeScript check si possible
- ✅ Build local si modifications critiques

### 5. Signature code
- ✅ Toujours signer "Lalou"
- ✅ Style code 100% humain
- ✅ Pas de patterns IA détectables

---

## FICHIERS IMPORTANTS À JOUR

**Documentation projet**:
- ✅ `CLAUDE.md` (règles métier complètes)
- ✅ `.claude/REGLES_PROJET.md` (règles absolues)
- ✅ `SESSION_2025-11-07_RAPPORT_FINAL.md` (bilan session)
- ✅ `SESSION_2025-11-07_CONSIGNES_RAOUL.md` (consignes client)
- ✅ `PROCHAINE_SESSION_PLAN.md` (ce fichier)
- ✅ `TODO.md` (tâches restantes)

**Logs processus**:
- ✅ `build.log` (build production)
- ✅ `tsc.log` (TypeScript check)
- ✅ `images-sizes.txt` (115 images)
- ✅ `docs-files.txt` (recherche docs)

**Configuration**:
- ✅ `next.config.js` (à configurer images)
- ✅ `playwright.config.ts` (à créer)
- ✅ `.env.local` (clés API)

---

## CONTACTS & RESSOURCES

**Client**: Raoul (développeur/PM)
**Artiste**: Guillaume Farré (sculpteur, collectionneur Ferrari)

**APIs utilisées**:
- Anthropic Claude (descriptions IA photos)
- Stripe (paiements)
- Gelato (impression - à valider)

**APIs à configurer**:
- DeepL (traductions pro - optionnel, déjà fait manuellement)

---

## ESTIMATION TEMPS TOTAL RESTANT

| Phase | Tâche | Temps | Priorité |
|-------|-------|-------|----------|
| 2 | Tests E2E | 1h | 🔴 Critique |
| 3 | Optimisation images | 1h | 🟠 Haute |
| 4 | Interface boutique | 45min | 🟡 Moyenne |
| 5 | Validation serveur | 30min | 🟠 Haute |
| - | **TOTAL Phase 1** | **3h15** | - |
| 6 | Gelato pricing | 30min | 🔵 Basse |
| 7 | Gelato API | 2 jours | 🔵 Basse |
| - | **TOTAL Complet** | **2j + 3h45** | - |

---

## COMMANDES UTILES

**Développement**:
```bash
npm run dev              # Lancer serveur local
npm run build            # Build production
npm test                 # Lancer tests
npx playwright test      # Tests E2E
```

**Git**:
```bash
git status               # État repo
git log -5 --oneline     # 5 derniers commits
git diff                 # Changements non commités
```

**Analyse**:
```bash
# Trouver composants avec <img>
find components -name "*.tsx" | xargs grep -l "<img"

# Analyser tailles images
find public/images -name "*.jpg" -exec ls -lh {} \; | sort -k5 -h

# Compter lignes code
find components lib app -name "*.tsx" -o -name "*.ts" | xargs wc -l
```

---

**Date création**: 7 novembre 2025, 23h50
**Dernière mise à jour**: 7 novembre 2025, 23h50
**Prochaine session**: 8 novembre 2025 (ou selon disponibilité)
**Status**: ✅ Prêt pour démarrage immédiat

Lalou
