# RELIS ABSOLUMENT TOUTE LA DOC

**AVEC UN NIVEAU DE PROFONDEUR ABSOLUMENT MAXIMAL**

Et pareil pour le code. Et pareil pour l'architecture. Et reprends le travail là où tu étais sans la MOINDRE déperdition.

**OBLIGATION ABSOLUE** : Quand tu n'auras plus beaucoup de contexte, tu as l'obligation absolue d'arriver à rédiger de nouveau un message ultra ultra exhaustif qui reprend exactement cette consigne pour gérer le prochain compactage.

---

# PARTIE 1 : ÉTAT GLOBAL DU PROJET

## Informations Serveur et Accès

| Élément | Valeur |
|---------|--------|
| URL production | https://guillaumefarre.com |
| Serveur IP | 51.38.35.238 |
| User SSH | ubuntu |
| Path serveur | /var/www/guillaume-farre |
| PM2 process | guillaume-farre |
| Repo GitHub | github.com:RaoulDelpech/guillaume-farre.git |
| Branche | main |
| Dernier commit | 3238de3 |

## Protection Mot de Passe

**Le site EST protégé par mot de passe via middleware Next.js.**

| Élément | Valeur |
|---------|--------|
| Mot de passe | LHOOQladino246 |
| Cookie | gf_auth=authenticated |
| Durée cookie | 30 jours |
| Page login | /fr/login (ou /en/login, /it/login) |

### Fichiers impliqués dans l'authentification

1. **middleware.ts** (racine) :
```typescript
const COOKIE_NAME = "gf_auth";
// Vérifie cookie, redirige vers /login si absent
// Routes publiques : /login, /_next/, /images/, fichiers statiques
// API routes : pas de middleware auth
```

2. **app/[locale]/login/page.tsx** :
- Formulaire avec juste un champ mot de passe
- Appelle POST /api/auth/login
- Set cookie si succès
- Redirige vers / après login

3. **app/api/auth/login/route.ts** :
```typescript
// Compare password avec LHOOQladino246
// Set cookie gf_auth=authenticated (30 jours)
```

---

# PARTIE 2 : MODE ADMIN ÉDITION INLINE

## Fonctionnement

Ajouter `?admin=true` à n'importe quelle URL permet d'éditer les textes directement sur le site.

Exemple : https://guillaumefarre.com/fr/histoire?admin=true

## Architecture Complète

### 1. AdminModeContext (`contexts/AdminModeContext.tsx`)

```typescript
interface AdminModeContextType {
  isAdminMode: boolean;           // true si ?admin=true
  pendingChanges: Map<string, string>;  // Modifications en attente
  setPendingChange: (key: string, value: string) => void;
  saveAllChanges: () => Promise<void>;  // Sauvegarde vers API
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}
```

- Lit `?admin=true` depuis URL
- Stocke les modifications dans une Map
- Envoie les changements vers `/api/admin/content`

### 2. EditableText (`components/admin/EditableText.tsx`)

```typescript
interface EditableTextProps {
  textKey: string;     // Ex: "histoire.hero.title"
  children: string;    // Valeur par défaut
  as?: keyof JSX.IntrinsicElements;  // h1, h2, p, span, div...
  className?: string;
  multiline?: boolean; // input vs textarea
}
```

- **Mode normal** : Affiche juste le texte
- **Mode admin** :
  - Bordure jaune en pointillés au hover
  - Clic → devient input/textarea
  - Escape → annule
  - Enter → valide (sauf multiline)
  - Astérisque (*) si modifié

### 3. AdminToolbar (`components/admin/AdminToolbar.tsx`)

- Barre flottante fixée en bas
- Affiche "Mode Édition"
- Bouton "Sauvegarder X modifications"
- Spinner pendant sauvegarde

### 4. AdminWrapper (`components/admin/AdminWrapper.tsx`)

- Provider qui wrap le layout
- Intégré dans `app/[locale]/layout.tsx`

### 5. ContentManager (`lib/content-manager.ts`)

```typescript
export async function saveContent(key: string, value: string): Promise<void>
export async function getContent(key: string): Promise<string | null>
```

- Actuellement : sauvegarde dans messages/fr.json
- Future : migration vers base de données

### 6. API (`app/api/admin/content/route.ts`)

```typescript
// POST { changes: { key: value, ... } }
// Merge dans messages/fr.json
```

## Pages Converties avec EditableText

| Page | Composant | Fichier |
|------|-----------|---------|
| /histoire | HistoireContent | components/pages/HistoireContent.tsx |
| /atelier | AtelierContent | components/pages/AtelierContent.tsx |
| /dino | DinoContent | components/pages/DinoContent.tsx |
| /dino-histoire | DinoHistoireContent | components/pages/DinoHistoireContent.tsx |
| /galerie | GalerieContent | components/pages/GalerieContent.tsx |
| /boutique | BoutiqueContent | components/pages/BoutiqueContent.tsx |
| /boutique (bas) | BoutiqueGarantiesContent | components/pages/BoutiqueGarantiesContent.tsx |
| / (artiste) | HomePageContent | components/pages/HomePageContent.tsx |
| / (œuvres) | HomeWorksSection | components/pages/HomeWorksSection.tsx |

## Pour Convertir Une Nouvelle Page

1. Créer `components/pages/[NomPage]Content.tsx`
2. Ajouter `"use client";` en haut
3. Importer EditableText
4. Remplacer textes par :
```tsx
<EditableText
  textKey="section.key"
  as="h1"
  className="..."
  multiline  // si paragraphe
>
  Texte par défaut
</EditableText>
```
5. Modifier la page pour utiliser le composant

---

# PARTIE 3 : STRUCTURE COMPLÈTE DES FICHIERS

```
/guillaume-farre-from-github/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Layout principal avec AdminWrapper
│   │   ├── page.tsx                # Homepage
│   │   ├── atelier/page.tsx
│   │   ├── boutique/page.tsx
│   │   ├── dino/page.tsx
│   │   ├── dino-histoire/page.tsx
│   │   ├── galerie/page.tsx
│   │   ├── galerie-item/[slug]/page.tsx
│   │   ├── histoire/page.tsx
│   │   ├── login/page.tsx          # Page login
│   │   ├── admin/page.tsx          # Admin photos
│   │   ├── contact/page.tsx
│   │   ├── panier/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── quiz/page.tsx
│   │   ├── presse/page.tsx
│   │   ├── concept-car-art/page.tsx
│   │   ├── collectionneurs/page.tsx
│   │   ├── favoris/page.tsx
│   │   ├── comparer/page.tsx
│   │   ├── origine/page.tsx
│   │   ├── actualites/page.tsx
│   │   ├── cgv/page.tsx
│   │   ├── mentions-legales/page.tsx
│   │   ├── politique-de-confidentialite/page.tsx
│   │   └── retours-echanges/page.tsx
│   └── api/
│       ├── auth/login/route.ts     # API login
│       ├── admin/
│       │   ├── content/route.ts    # Sauvegarde textes
│       │   ├── photos/route.ts     # CRUD photos
│       │   ├── delete-photo/route.ts
│       │   ├── edit-photo/route.ts
│       │   ├── detect-orientation/route.ts
│       │   ├── duplicates/route.ts
│       │   ├── similar-images/route.ts
│       │   ├── suggest-series/route.ts
│       │   ├── generate-description/route.ts
│       │   ├── pricing/route.ts
│       │   ├── auth/route.ts
│       │   └── login/route.ts
│       ├── stripe/
│       │   ├── checkout/route.ts
│       │   └── webhook/route.ts
│       ├── gelato/webhook/route.ts
│       ├── instagram/post/route.ts
│       ├── orders/route.ts
│       ├── upload/route.ts
│       └── webhooks/stripe/route.ts
├── components/
│   ├── admin/
│   │   ├── EditableText.tsx
│   │   ├── AdminToolbar.tsx
│   │   └── AdminWrapper.tsx
│   ├── pages/
│   │   ├── HistoireContent.tsx
│   │   ├── AtelierContent.tsx
│   │   ├── DinoContent.tsx
│   │   ├── DinoHistoireContent.tsx
│   │   ├── GalerieContent.tsx
│   │   ├── BoutiqueContent.tsx
│   │   ├── BoutiqueGarantiesContent.tsx
│   │   ├── HomePageContent.tsx
│   │   └── HomeWorksSection.tsx
│   ├── navigation/
│   │   ├── Navigation.tsx
│   │   └── MobileNav.tsx
│   ├── shop/
│   │   ├── ShopFilteredGrid.tsx
│   │   └── ...
│   ├── HeroCarousel.tsx
│   ├── HomeClient.tsx
│   ├── GalleryClient.tsx
│   ├── GalleryGrid.tsx
│   ├── lightbox/...
│   └── LanguageSwitcher.tsx
├── contexts/
│   ├── AdminModeContext.tsx
│   ├── CartContext.tsx
│   └── ...
├── lib/
│   ├── content-manager.ts
│   ├── works.ts
│   ├── images.ts
│   ├── utils.ts
│   ├── stripe.ts
│   └── admin/
│       └── photo-manager.ts
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── messages/
│   ├── fr.json                     # SOURCE DE VÉRITÉ
│   ├── en.json
│   └── it.json
├── data/
│   └── photo-metadata.json         # SERVEUR = VÉRITÉ
├── public/
│   └── images/
│       ├── origins/
│       └── works/
│           ├── empreintes/
│           ├── atelier/
│           └── projection/
├── middleware.ts                   # Auth + i18n
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md
├── DOCUMENT_MAITRE.md
├── MESSAGE_REPRISE_2025-12-30.md
└── ...
```

---

# PARTIE 4 : RÈGLES MÉTIER CRITIQUES

## Exemplaires Photos (Décision 2025-11-29)

**PLUS DE TIRAGES ILLIMITÉS** - Tous numérotés et signés.

| Type Format | Formats | Exemplaires |
|-------------|---------|-------------|
| Grands formats | 2A0, A0, A1 | 9 ex. (1/9 à 9/9) |
| Petits formats | A2, A3, A4 | 99 ex. (1/99 à 99/99) |

## Prix Photos

| Format | Dimensions | Prix | Exemplaires |
|--------|-----------|------|-------------|
| 2A0 | 118.9 × 168.2 cm | Sur devis | 9 |
| A0 | 84.1 × 118.9 cm | Sur devis | 9 |
| A1 | 59.4 × 84.1 cm | 1200€ | 9 |
| A2 | 42 × 59.4 cm | 800€ | 99 |
| A3 | 29.7 × 42 cm | 500€ | 99 |
| A4 | 21 × 29.7 cm | 250€ | 99 |

## Vocabulaire

| Correct | Incorrect | Raison |
|---------|-----------|--------|
| **Dino** | Ferrari | La voiture s'appelle Dino, pas Ferrari |
| roues | pneus | Terme technique correct |
| toile | canvas | Français |

## RÈGLE #32 : PHOTO-METADATA.JSON

```
❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISÉ : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier du SERVEUR est la SOURCE DE VÉRITÉ.
Guillaume travaille dans l'admin en production.
```

**Sync metadata (serveur → local)** :
```bash
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
```

## Les 4 Ferrari de Guillaume

1. **Dino noire** - Élégante, traces fines
2. **Dino grise #1** - Polyvalente
3. **Dino grise #2** - Polyvalente
4. (Pas de rouge dans l'atelier, contrairement aux photos de stock)

---

# PARTIE 5 : SCHÉMA METADATA PHOTOS

```typescript
interface PhotoMetadata {
  filename: string;
  path: string;
  title?: string;
  year?: number;
  seriesName?: string;
  categories: ('limited' | 'xxl' | 'monumental')[];  // Plus de 'unlimited'
  description?: string;
  aiGenerated?: boolean;
  status: 'active' | 'trash' | 'to-sort';
  visible: boolean;
  forSale: boolean;
  limitedEditionGrand?: {  // Pour A1, A0, 2A0
    total: 9;
    sold: number;
    available: number;
    closed: boolean;
  };
  limitedEditionPetit?: {  // Pour A4, A3, A2
    total: 99;
    sold: number;
    available: number;
    closed: boolean;
  };
  prices?: {
    a4?: number;
    a3?: number;
    a2?: number;
    a1?: number;
    a0?: number;
    '2a0'?: number;
  };
}
```

---

# PARTIE 6 : COMMANDES

## Développement Local

```bash
# Dev (Node.js 18.18+ ou 20+ requis)
npm run dev
# → http://localhost:3000/

# Build
npm run build

# TypeScript check
npx tsc --noEmit

# Lint (si bun disponible)
bun run lint
```

## Déploiement

```bash
# Déploiement complet (une seule commande)
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && git stash && git pull origin main && npm run build && pm2 restart guillaume-farre"

# Vérifier status PM2
ssh ubuntu@51.38.35.238 "pm2 status"

# Logs PM2
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 50 --nostream"

# Erreurs PM2
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --err --lines 100 --nostream"
```

## Sync Metadata

```bash
# SERVEUR → LOCAL (toujours dans ce sens)
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
```

## Git

```bash
git status
git log --oneline -5
git add . && git commit -m "message"
git push origin main
```

---

# PARTIE 7 : CLÉS API MANQUANTES

| Service | Usage | Temps estimé | Priorité |
|---------|-------|--------------|----------|
| Gelato | Impression automatique | 1h30 | Haute |
| Resend | Emails transactionnels | 35 min | Haute |
| DeepL | Traductions auto | 10 min | Moyenne |
| Anthropic | Descriptions IA photos | 10 min | Moyenne |

Guide complet : `ACTIVATION_COMPLETE_GUILLAUME.md`

---

# PARTIE 8 : TRAVAIL EFFECTUÉ SESSION 2025-12-30

## Contexte de Départ

- Session précédente (2025-12-07) avait créé le mode admin édition
- SEULE la page /histoire était convertie
- Toutes les autres pages n'étaient PAS éditables

## Travail Effectué

1. **Lecture complète du contexte** depuis fichier ODT
2. **Conversion de TOUTES les pages** pour mode admin édition :
   - /atelier (AtelierContent.tsx - 236 lignes)
   - /dino (DinoContent.tsx - 404 lignes)
   - /dino-histoire (DinoHistoireContent.tsx - 469 lignes)
   - /galerie (GalerieContent.tsx - 52 lignes)
   - /boutique (BoutiqueContent.tsx - 178 lignes)
   - /boutique garanties (BoutiqueGarantiesContent.tsx - 80 lignes)
   - Homepage artiste (HomePageContent.tsx - 75 lignes)
   - Homepage œuvres (HomeWorksSection.tsx - 124 lignes)

3. **Commits** :
   - `0fc2551` - feat: mode admin édition inline pour toutes les pages (14 fichiers, 1699+/867-)
   - `3238de3` - docs: message reprise exhaustif

4. **Déploiement** : 113 pages générées, PM2 redémarré

## État Final

- TOUTES les pages sont éditables avec ?admin=true
- Le site est protégé par mot de passe (LHOOQladino246)
- Production déployée et fonctionnelle

---

# PARTIE 9 : TESTS À EFFECTUER

## Test Protection

```bash
# Doit retourner 307 + location: /fr/login
curl -sI "https://guillaumefarre.com/" | head -5
```

## Test Login

```bash
# Doit retourner {"success":true}
curl -s -X POST https://guillaumefarre.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"LHOOQladino246"}'
```

## Test Mode Admin

1. Aller sur https://guillaumefarre.com/fr/login
2. Entrer mot de passe : LHOOQladino246
3. Ajouter ?admin=true à l'URL
4. Cliquer sur un texte → doit devenir éditable
5. Modifier → astérisque apparaît
6. Sauvegarder → vérifier persistence

---

# PARTIE 10 : PROCHAINES ÉTAPES POSSIBLES

1. **Tester mode admin sur chaque page** avec ?admin=true
2. **Activer clés API** (Gelato, Resend, DeepL, Anthropic)
3. **Améliorer traductions** EN/IT avec DeepL
4. **Optimiser images** (WebP, lazy loading)
5. **SEO** multilingue
6. **Analytics**

---

# PARTIE 11 : FICHIERS DOCUMENTATION

| Fichier | Description |
|---------|-------------|
| DOCUMENT_MAITRE.md | Source unique de vérité (très complet) |
| CLAUDE.md (projet) | Règles spécifiques Guillaume Farré |
| ~/CLAUDE.md | Règles globales Raoul |
| MESSAGE_REPRISE_2025-12-30.md | CE FICHIER |
| MESSAGE_REPRISE_2025-12-09.md | Session précédente |
| SESSION_2025-12-07_COMPLET.md | Rapport création mode admin |
| ACTIVATION_COMPLETE_GUILLAUME.md | Guide clés API |
| MESSAGE_COMPACTAGE_2025-12-07.md | Ancien compactage |

---

# PARTIE 12 : RAPPEL CRITIQUE COMPACTAGE

**QUAND TU N'AURAS PLUS BEAUCOUP DE CONTEXTE** :

Tu as l'obligation absolue de rédiger un nouveau message ULTRA-EXHAUSTIF comme celui-ci, qui commence par :

> RELIS ABSOLUMENT TOUTE LA DOC avec un niveau de profondeur absolument maximal et pareil pour le code et pareil pour l'architecture et reprends le travail là où tu étais sans la MOINDRE déperdition.

Ce message DOIT contenir :
1. État complet du projet (URLs, accès, commits)
2. Système d'authentification complet
3. Mode admin édition (architecture, fichiers, usage)
4. Structure complète des fichiers
5. Règles métier (exemplaires, prix, vocabulaire)
6. Schéma metadata photos
7. Toutes les commandes utiles
8. Clés API manquantes
9. Travail effectué cette session
10. Tests à effectuer
11. Prochaines étapes
12. Ce rappel pour le prochain compactage

---

**Auteur** : Lalou
**Date** : 2025-12-30
**Commit** : 3238de3
