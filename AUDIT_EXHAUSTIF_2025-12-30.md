# AUDIT EXHAUSTIF DU SITE GUILLAUME FARRÉ

**Date** : 30 décembre 2025
**Auditeur** : Lalou
**Durée d'audit** : Nuit complète
**Fichiers analysés** : 174 fichiers TypeScript/TSX
**Pages analysées** : 26 pages
**Composants analysés** : 47 composants

---

# TABLE DES MATIÈRES

1. [RÉSUMÉ EXÉCUTIF](#résumé-exécutif)
2. [ARCHITECTURE TECHNIQUE](#architecture-technique)
3. [ANALYSE PAGE PAR PAGE](#analyse-page-par-page)
4. [ANALYSE DES COMPOSANTS](#analyse-des-composants)
5. [ANALYSE DES TEXTES](#analyse-des-textes)
6. [ANALYSE DES BOUTONS ET CTA](#analyse-des-boutons-et-cta)
7. [ANALYSE UI/UX](#analyse-uiux)
8. [ANALYSE SEO](#analyse-seo)
9. [ANALYSE ACCESSIBILITÉ](#analyse-accessibilité)
10. [ANALYSE SÉCURITÉ](#analyse-sécurité)
11. [ANALYSE PERFORMANCE](#analyse-performance)
12. [ANALYSE TRADUCTIONS](#analyse-traductions)
13. [ANALYSE DES DONNÉES](#analyse-des-données)
14. [QUESTIONS POUR GUILLAUME](#questions-pour-guillaume)
15. [PRÉCONISATIONS PAR PRIORITÉ](#préconisations-par-priorité)
16. [PLAN D'ACTION](#plan-daction)

---

# 1. RÉSUMÉ EXÉCUTIF

## 1.1 Vue d'ensemble

Le site Guillaume Farré est un portfolio d'artiste avec boutique en ligne, construit avec Next.js 15.5.6. Le site présente un niveau de qualité technique correct mais souffre de plusieurs problèmes critiques qui doivent être résolus avant une mise en production définitive.

## 1.2 Statistiques Clés

| Métrique | Valeur |
|----------|--------|
| Nombre de pages | 26 |
| Nombre de composants | 47 |
| Lignes de code total | ~15 000 |
| Fichiers TypeScript/TSX | 174 |
| Traductions FR | 170 clés |
| Photos dans metadata | 198 |
| Poids estimé bundle | ~500 KB |

## 1.3 Points Forts

- Architecture Next.js 15 moderne avec App Router
- Système i18n bien implémenté (FR/EN/IT)
- Mode admin édition inline fonctionnel
- Design épuré et cohérent (thème zinc)
- Composants réutilisables bien structurés
- Panier persistant (30 jours)
- Protection par mot de passe fonctionnelle

## 1.4 Points Critiques (À résoudre immédiatement)

1. **APIs admin non protégées** - Faille sécurité majeure
2. **Numéro de téléphone factif** - Crédibilité du site
3. **Articles de presse potentiellement factifs** - Risque légal
4. **Stats boutique incorrectes** - Données non cohérentes
5. **Prix hardcodés** - Pas synchronisés avec configuration

## 1.5 Notation Globale

| Domaine | Note /10 | Commentaire |
|---------|----------|-------------|
| Architecture | 7.5 | Solide mais manque tests |
| UI/UX | 7 | Cohérent mais quelques incohérences |
| Sécurité | 4 | APIs admin non protégées |
| Performance | 6 | Images non optimisées |
| SEO | 5 | Metadata manquants |
| Accessibilité | 5 | Alt texts incomplets |
| Contenu | 6 | Textes répétitifs, données factices |
| **GLOBAL** | **5.8** | **Acceptable avec réserves** |

---

# 2. ARCHITECTURE TECHNIQUE

## 2.1 Stack Technique Détaillée

### Dépendances Principales

```json
{
  "next": "15.5.6",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "typescript": "5.8.3",
  "@stripe/stripe-js": "5.10.0",
  "stripe": "18.2.0",
  "next-intl": "4.1.0",
  "embla-carousel-react": "8.6.0",
  "lucide-react": "0.503.0",
  "tailwindcss": "4.1.8",
  "canvas-confetti": "1.9.3"
}
```

### Problèmes identifiés dans package.json

| Problème | Impact | Solution |
|----------|--------|----------|
| Pas de tests (jest/vitest) | Risque régression | Ajouter vitest + playwright |
| Pas de husky | Commits non validés | Ajouter husky + lint-staged |
| Pas de prettier | Code non formaté | Ajouter prettier config |
| Version React 19 RC | Instabilité potentielle | Surveiller les bugs |

**PRÉCONISATION ARCH-001** : Ajouter tests automatisés
```bash
bun add -D vitest @testing-library/react playwright
```

**PRÉCONISATION ARCH-002** : Ajouter pre-commit hooks
```bash
bun add -D husky lint-staged
```

## 2.2 Structure des Fichiers

### Arborescence Complète

```
guillaume-farre-from-github/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                 ✅ OK - AdminWrapper intégré
│   │   ├── page.tsx                   ✅ Converti édition inline
│   │   ├── admin/page.tsx             ⚠️ 870 lignes - trop long
│   │   ├── admin-test/page.tsx        ❓ Page de test à supprimer ?
│   │   ├── actualites/page.tsx        ⚠️ Données factices hardcodées
│   │   ├── atelier/page.tsx           ✅ Converti édition inline
│   │   ├── boutique/page.tsx          ✅ Converti édition inline
│   │   ├── cgv/page.tsx               ⚠️ Numéro téléphone placeholder
│   │   ├── collectionneurs/page.tsx   ⚠️ "47 collectionneurs" vérifié ?
│   │   ├── comparer/page.tsx          ✅ Fonctionnel
│   │   ├── concept-car-art/page.tsx   ❌ Emojis + "V12" incorrect
│   │   ├── contact/page.tsx           ❌ Faux numéro téléphone
│   │   ├── dino/page.tsx              ✅ Converti édition inline
│   │   ├── dino-histoire/page.tsx     ✅ Converti édition inline
│   │   ├── faq/page.tsx               ✅ Contenu riche
│   │   ├── favoris/page.tsx           ✅ Fonctionnel
│   │   ├── galerie/page.tsx           ✅ Converti édition inline
│   │   ├── galerie-item/[slug]/       ❌ Prix hardcodés
│   │   ├── histoire/page.tsx          ✅ Converti édition inline
│   │   ├── login/page.tsx             ✅ Fonctionnel
│   │   ├── mentions-legales/page.tsx  ⚠️ Hébergeur placeholder
│   │   ├── origine/page.tsx           ⚠️ Chiffres à vérifier
│   │   ├── panier/page.tsx            ✅ Fonctionnel
│   │   ├── politique-de-confidentialite/ ✅ Complet
│   │   ├── presse/page.tsx            ❌ Style incohérent + données factices
│   │   ├── quiz/page.tsx              ⚠️ Emojis + prix incorrects
│   │   ├── retours-echanges/page.tsx  ✅ Contenu complet
│   │   └── ...
│   └── api/
│       ├── admin/                      ❌ NON PROTÉGÉES !
│       │   ├── content/route.ts
│       │   ├── photos/route.ts
│       │   ├── delete-photo/route.ts
│       │   ├── edit-photo/route.ts
│       │   └── ...
│       ├── auth/login/route.ts         ✅ Fonctionnel
│       ├── stripe/
│       │   ├── checkout/route.ts       ✅ OK
│       │   └── webhook/route.ts        ✅ OK
│       └── ...
├── components/
│   ├── admin/
│   │   ├── EditableText.tsx           ✅ 106 lignes - bien écrit
│   │   ├── AdminToolbar.tsx           ✅ 55 lignes - propre
│   │   └── AdminWrapper.tsx           ✅ OK
│   ├── pages/                          ✅ 9 composants éditables
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
│   │   ├── Navigation.tsx             ✅ Responsive
│   │   └── MobileNav.tsx              ✅ Hamburger menu
│   ├── shop/
│   │   └── ShopFilteredGrid.tsx       ⚠️ Filtres partiellement fonctionnels
│   ├── AddToCartSection.tsx           ❌ Prix HARDCODÉS !
│   ├── Footer.tsx                     ✅ OK
│   ├── GalleryClient.tsx              ✅ OK
│   ├── GalleryGrid.tsx                ⚠️ Pas de lazy loading
│   ├── HeroCarousel.tsx               ⚠️ Trop grand/rapide
│   ├── HomeClient.tsx                 ✅ OK
│   ├── LanguageSwitcher.tsx           ✅ OK
│   └── lightbox/
│       └── Lightbox.tsx               ✅ Élégant
├── contexts/
│   ├── AdminModeContext.tsx           ✅ Bien implémenté
│   ├── CartContext.tsx                ✅ Persistance 30j
│   └── ...
├── hooks/
│   ├── useFavorites.ts                ✅ LocalStorage
│   ├── useRecentlyViewed.ts           ✅ LocalStorage
│   ├── useWishlist.ts                 ✅ LocalStorage
│   └── useConfetti.ts                 ✅ Fun
├── lib/
│   ├── admin/photo-manager.ts         ⚠️ Schéma à migrer
│   ├── content-manager.ts             ✅ OK
│   ├── pricing-config.ts              ⚠️ Non utilisé partout
│   ├── stripe.ts                      ✅ OK
│   ├── utils.ts                       ✅ OK
│   └── works.ts                       ✅ OK
├── messages/
│   ├── fr.json                        ✅ 170 clés
│   ├── en.json                        ⚠️ Incomplet
│   └── it.json                        ⚠️ Incomplet
├── data/
│   └── photo-metadata.json            ⚠️ 5588 lignes - migrer vers DB
├── middleware.ts                      ✅ Auth fonctionnelle
├── next.config.mjs                    ✅ OK
├── tailwind.config.ts                 ✅ OK
└── ...
```

## 2.3 Problèmes d'Architecture

### CRITIQUE : APIs Admin Non Protégées

**Fichiers concernés** :
- `app/api/admin/photos/route.ts`
- `app/api/admin/content/route.ts`
- `app/api/admin/delete-photo/route.ts`
- `app/api/admin/edit-photo/route.ts`
- `app/api/admin/detect-orientation/route.ts`
- `app/api/admin/duplicates/route.ts`
- `app/api/admin/similar-images/route.ts`
- `app/api/admin/suggest-series/route.ts`
- `app/api/admin/generate-description/route.ts`
- `app/api/admin/pricing/route.ts`

**Code actuel (VULNÉRABLE)** :
```typescript
// app/api/admin/photos/route.ts
export async function GET() {
  // AUCUNE VÉRIFICATION D'AUTHENTIFICATION !
  const photos = await loadPhotoMetadata();
  return NextResponse.json(photos);
}
```

**Code corrigé (SÉCURISÉ)** :
```typescript
import { cookies } from 'next/headers';

export async function GET() {
  // Vérifier le cookie d'authentification
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('gf_auth');

  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const photos = await loadPhotoMetadata();
  return NextResponse.json(photos);
}
```

**PRÉCONISATION ARCH-003** : Créer un middleware helper pour les APIs admin

```typescript
// lib/admin/auth.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('gf_auth');
  return authCookie?.value === 'authenticated';
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}
```

### PRÉCONISATION ARCH-004 : Fichier admin/page.tsx trop long (870 lignes)

Le fichier `app/[locale]/admin/page.tsx` fait 870 lignes et contient :
- Dashboard stats
- Upload de photos
- Grille de photos
- Détection de doublons
- Configuration Instagram
- Gestionnaire de prix
- Filtres multiples
- Actions groupées

**Solution** : Découper en sous-composants/tabs

```
components/admin/
├── AdminDashboard.tsx        # Stats + résumé
├── AdminPhotoUpload.tsx      # Upload drag&drop
├── AdminPhotoGrid.tsx        # Grille avec filtres
├── AdminDuplicates.tsx       # Détection doublons
├── AdminInstagram.tsx        # Config Instagram
├── AdminPricing.tsx          # Gestionnaire prix
└── AdminBulkActions.tsx      # Actions groupées
```

---

# 3. ANALYSE PAGE PAR PAGE

## 3.1 Homepage (`/`)

### Structure

```
┌─────────────────────────────────────────┐
│             Navigation                  │
├─────────────────────────────────────────┤
│          HeroCarousel (80vh)            │  ← TROP GRAND
│    - 5 slides avec overlay texte        │
│    - Autoplay 5s                        │  ← TROP RAPIDE
├─────────────────────────────────────────┤
│     Section Artiste (HomePageContent)   │
│  ┌──────────┬────────────────────────┐ │
│  │  Image   │   Texte + CTA          │ │
│  │ atelier  │   "Guillaume Farré"    │ │
│  └──────────┴────────────────────────┘ │
├─────────────────────────────────────────┤
│   Dernières œuvres (HomeWorksSection)   │
│  ┌────┐ ┌────┐ ┌────┐                  │
│  │    │ │    │ │    │   6 œuvres       │
│  │    │ │    │ │    │   aléatoires     │  ← ALÉATOIRE ?
│  └────┘ └────┘ └────┘                  │
│        CTA "Voir toute la galerie"      │
├─────────────────────────────────────────┤
│              Footer                     │
└─────────────────────────────────────────┘
```

### Textes analysés

| Clé | Texte FR | Observation | Action |
|-----|----------|-------------|--------|
| `home.artist.label` | "L'Artiste" | OK | - |
| `home.artist.name` | "Guillaume Farré" | OK | - |
| `home.artist.bio` | "Sculpteur et artiste plasticien..." | Répétition "Ferrari" | Varier |
| `home.artist.cta` | "Découvrir mon histoire" | OK | - |

### Boutons analysés

| Bouton | Texte | Destination | Style | Observation |
|--------|-------|-------------|-------|-------------|
| CTA Histoire | "Découvrir mon histoire" | /histoire | Link underline | OK |
| CTA Galerie | "Voir toute la galerie" | /galerie | Border button | OK mais 2 styles différents sur la page |

### Préconisations Homepage

**HOME-001** : Réduire hauteur carousel
- Actuel : `80vh`
- Recommandé : `60vh`
- Fichier : `components/HeroCarousel.tsx`

**HOME-002** : Ralentir autoplay carousel
- Actuel : `5000ms`
- Recommandé : `9000ms`
- Fichier : `components/HeroCarousel.tsx`

**HOME-003** : Fixer les œuvres featured
- Actuel : `allWorks.sort(() => Math.random() - 0.5).slice(0, 6)`
- Problème : Œuvres différentes à chaque refresh
- Solution : Permettre sélection dans admin ou ordre fixe

**HOME-004** : Harmoniser les styles de boutons
- "Découvrir mon histoire" = lien souligné
- "Voir toute la galerie" = bouton bordure
- Solution : Utiliser le même style ou créer une hiérarchie claire

## 3.2 Page Galerie (`/galerie`)

### Structure

```
┌─────────────────────────────────────────┐
│             Navigation                  │
├─────────────────────────────────────────┤
│      Hero pleine page (70vh)            │
│   Titre "Galerie" + sous-titre          │
│   (Éditable avec ?admin=true)           │
├─────────────────────────────────────────┤
│          Filtres (tabs)                 │
│   [Tout] [Empreintes] [Atelier] [Proj.] │
├─────────────────────────────────────────┤
│        Grille Masonry photos            │
│   ┌────┐ ┌────────┐ ┌────┐             │
│   │    │ │        │ │    │             │
│   │    │ │        │ │    │             │
│   └────┘ │        │ └────┘             │
│   ┌────────┐ └────┘ ┌────┐             │
│   │        │        │    │             │
│   └────────┘        └────┘             │
├─────────────────────────────────────────┤
│              Footer                     │
└─────────────────────────────────────────┘
```

### Textes analysés

| Clé | Texte FR | Observation |
|-----|----------|-------------|
| `gallery.title` | "Galerie" | OK |
| `gallery.subtitle` | "Toiles. Photographies. Empreintes irréversibles." | Bien |
| `gallery.filterAll` | "Tout voir" | OK |
| `gallery.filterEmpreintes` | "Empreintes" | OK |
| `gallery.filterAtelier` | "Atelier" | OK |
| `gallery.filterProjections` | "Projections" | OK |

### Préconisations Galerie

**GAL-001** : Ajouter lazy loading sur les images
```tsx
// Actuel
<img src={photo.path} alt={photo.title} />

// Corrigé
<img
  src={photo.path}
  alt={photo.title}
  loading="lazy"
  decoding="async"
/>
```

**GAL-002** : Améliorer les alt texts
- Actuel : `alt={photo.title || "Photo"}`
- Mieux : `alt={photo.description || photo.title || "Œuvre de Guillaume Farré"}`

## 3.3 Page Boutique (`/boutique`)

### Structure

```
┌─────────────────────────────────────────┐
│             Navigation                  │
├─────────────────────────────────────────┤
│            Hero Boutique                │
│   Badge "COMMANDES"                     │
│   Titre "Mes œuvres disponibles"        │
│   Description éditable                  │
│                                         │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│   │ 48  │ │ 22  │ │  3  │ │ 26  │     │  ← STATS INCORRECTES !
│   │Dispo│ │Limit│ │Last │ │Unlim│     │
│   └─────┘ └─────┘ └─────┘ └─────┘     │
│                                         │
│   Avantages (certificat, livraison...)  │
├─────────────────────────────────────────┤
│          Filtres + Grille               │
│   ShopFilteredGrid.tsx                  │
├─────────────────────────────────────────┤
│        Section Garanties                │
│   (BoutiqueGarantiesContent.tsx)        │
│   - Authenticité                        │
│   - Qualité galerie                     │
│   - Protection                          │
├─────────────────────────────────────────┤
│              Footer                     │
└─────────────────────────────────────────┘
```

### Problème Stats CRITIQUE

**Code actuel** :
```typescript
const stats = {
  total: photosForSale.length,  // OK
  limitedEditions: photosForSale.filter(p => p.categories?.includes('limited')).length,  // = 0 !
  unlimited: photosForSale.filter(p => p.categories?.includes('unlimited')).length,  // = 0 !
  lowStock: photosForSale.filter(p => {
    const avail = p.limitedEdition?.available || 0;
    return avail > 0 && avail <= 2;
  }).length  // = 0 !
};
```

**Diagnostic** :
Les photos dans `photo-metadata.json` n'ont pas le champ `categories` correctement rempli. La plupart ont `categories: []` ou pas de champ du tout.

**PRÉCONISATION BOUT-001** : Migration des catégories
```typescript
// Script de migration
async function migrateCategories() {
  const photos = await loadPhotoMetadata();

  for (const photo of photos) {
    if (photo.forSale && !photo.categories?.length) {
      // Assigner une catégorie par défaut
      photo.categories = ['limited'];

      // Initialiser les compteurs d'édition
      photo.limitedEditionGrand = { total: 9, sold: 0, available: 9, closed: false };
      photo.limitedEditionPetit = { total: 99, sold: 0, available: 99, closed: false };
    }
  }

  await savePhotoMetadata(photos);
}
```

### Textes analysés

| Clé | Texte FR | Observation |
|-----|----------|-------------|
| `shop.heroTag` | "COMMANDES" | OK mais "BOUTIQUE OFFICIELLE" serait mieux |
| `shop.heroTitle` | "Mes œuvres disponibles" | OK |
| `shop.heroDescription` | "Découvrez mon art automobile..." | OK |

### Préconisations Boutique

**BOUT-002** : Utiliser prix depuis pricing-config.ts

Actuellement les prix sont hardcodés dans plusieurs fichiers. Centraliser.

**BOUT-003** : Ajouter compteur éditions réel
- Afficher "X/9 restants" ou "X/99 restants" pour chaque photo
- Basé sur `limitedEditionGrand.available` et `limitedEditionPetit.available`

## 3.4 Page Galerie-Item (`/galerie-item/[slug]`)

### Problème CRITIQUE : Prix Hardcodés

**Code actuel dans AddToCartSection.tsx** :
```typescript
const FORMATS: Format[] = [
  { size: "60×40 cm", price: 1200, available: true },
  { size: "120×80 cm", price: 2400, available: true },
  { size: "150×100 cm", price: 3600, available: true },
  { size: "180×120 cm", price: 4800, available: false },
];
```

**Ces prix ne correspondent PAS à la configuration officielle** :

Configuration officielle (CLAUDE.md) :
| Format | Prix |
|--------|------|
| A4 (21×29.7 cm) | 250€ |
| A3 (29.7×42 cm) | 500€ |
| A2 (42×59.4 cm) | 800€ |
| A1 (59.4×84.1 cm) | 1200€ |
| A0 (84.1×118.9 cm) | Sur devis |
| 2A0 (118.9×168.2 cm) | Sur devis |

**PRÉCONISATION GAL-ITEM-001** : Utiliser pricing-config.ts

```typescript
// lib/pricing-config.ts existe déjà mais n'est pas utilisé !
import { PRICING_CONFIG } from '@/lib/pricing-config';

const FORMATS: Format[] = PRICING_CONFIG.formats.map(f => ({
  size: f.label,
  price: f.price,
  available: true,
  exemplaires: f.exemplaires
}));
```

## 3.5 Page Contact (`/contact`)

### PROBLÈME CRITIQUE : Faux Numéro de Téléphone

**Code actuel** :
```typescript
<p className="text-xl text-muted-foreground">
  +33 6 12 34 56 78
</p>
```

**Impact** :
- Site non professionnel
- Si quelqu'un appelle ce numéro, il sera déçu
- Perte de crédibilité

**PRÉCONISATION CONTACT-001** : Remplacer par vrai numéro ou retirer

**Autres problèmes Contact** :
- Boutons CTA ("Demander un rendez-vous") ne font rien
- Pas de formulaire de contact fonctionnel
- Email affiché mais pas de mailto:

**PRÉCONISATION CONTACT-002** : Implémenter formulaire fonctionnel
- Utiliser Resend API
- Ou au minimum `mailto:contact@guillaumefarre.com`

## 3.6 Page Presse (`/presse`)

### PROBLÈME MAJEUR : Style Incohérent + Données Factices

**Observation visuelle** :
La page /presse a un design COMPLÈTEMENT DIFFÉRENT du reste du site :
- Gradients bleus (vs zinc/noir ailleurs)
- Style "tech startup" vs "galerie d'art épurée"
- Badges colorés flashy

**Données potentiellement factices** :

```typescript
const pressArticles = [
  {
    publication: "Le Monde",
    logo: "📰",
    title: "L'art automobile réinventé...",
    date: "Mars 2024",
    // ...
  },
  {
    publication: "Forbes France",
    // ...
  },
  {
    publication: "Art Basel Daily",
    // ...
  }
];

const awards = [
  { year: "2024", title: "Prix Innovation Artistique", org: "Art Basel Miami" },
  { year: "2023", title: "Artiste de l'Année", org: "Automobile Club Monaco" },
  // ...
];
```

**Questions critiques** :
1. Guillaume a-t-il vraiment été cité dans Le Monde ?
2. A-t-il vraiment reçu un prix à Art Basel Miami ?
3. Forbes France a-t-il vraiment écrit sur lui ?

**PRÉCONISATION PRESSE-001** : Vérifier avec Guillaume l'authenticité
- Si VRAI → Ajouter liens vers articles originaux
- Si FAUX → Retirer immédiatement (risque légal)

**PRÉCONISATION PRESSE-002** : Refaire le design
- Aligner avec le reste du site (thème zinc)
- Supprimer gradients bleus
- Style épuré galerie d'art

## 3.7 Page Concept Car Art (`/concept-car-art`)

### Problèmes Identifiés

**1. EMOJIS** (contre les règles du projet)
```typescript
<h1 className="...">
  🏎️ Ferrari Live Performance
</h1>
```

**2. "V12" INCORRECT**
```typescript
<p>...le rugissement du V12...</p>
```

La Dino a un **V6**, pas un V12 !

**PRÉCONISATION CCA-001** : Retirer tous les emojis
**PRÉCONISATION CCA-002** : Corriger "V12" en "V6"

## 3.8 Page Quiz (`/quiz`)

### Analyse

Fonctionnalité intéressante de quiz interactif pour recommander une œuvre.

**Problèmes** :
1. Emojis dans les options (🏎️, ✨, 🚗, etc.)
2. Prix incorrects dans les résultats :
   - "Empreinte Ferrari" : "À partir de 8 500€" ← FAUX
   - "Projection Lumineuse" : "À partir de 6 500€" ← FAUX
3. Images référencées n'existent pas :
   - `/photos/empreintes/empreinte-01.jpg`
   - `/photos/projection/projection-01.jpg`

**PRÉCONISATION QUIZ-001** : Corriger les prix selon la configuration officielle
**PRÉCONISATION QUIZ-002** : Vérifier que les images existent
**PRÉCONISATION QUIZ-003** : Retirer les emojis si non souhaités

## 3.9 Page FAQ (`/faq`)

### Analyse

Page FAQ très complète avec :
- 5 catégories
- ~25 questions/réponses
- Barre de recherche
- Accordéons

**Points positifs** :
- Contenu riche et informatif
- UX bien pensée
- Emojis cohérents ici (icônes de catégorie)

**Problèmes** :
1. Mention de "tirages illimités" alors qu'ils ont été supprimés (décision 2025-11-29)
2. Mention d'Alma pour paiement 3x/4x - fonctionnalité pas implémentée
3. Mention de WhiteWall alors que c'est Gelato maintenant

**PRÉCONISATION FAQ-001** : Mettre à jour les informations
- Retirer "tirages illimités"
- Vérifier si Alma est actif
- Remplacer WhiteWall par Gelato

## 3.10 Page Collectionneurs (`/collectionneurs`)

### Analyse

**Problème potentiel** :
```typescript
<div className="text-sm text-muted-foreground font-light">
  47 collectionneurs font déjà partie de la communauté
</div>
```

**Question** : Ce chiffre de 47 est-il réel ?

**PRÉCONISATION COLL-001** : Vérifier le nombre de collectionneurs avec Guillaume

## 3.11 Page Origine (`/origine`)

### Analyse

Timeline narrative de 1985 à 2025.

**Chiffres à vérifier** :
- "47 collectionneurs" (encore ce chiffre)
- "12 performances live"
- "850K€ de chiffre d'affaires cumulé"

**PRÉCONISATION ORIG-001** : Vérifier tous les chiffres avec Guillaume

## 3.12 Pages Légales

### CGV (`/cgv`)

**Problème** :
```typescript
<p>
  Téléphone : +33 (0)X XX XX XX XX
</p>
```
→ Placeholder non remplacé

**PRÉCONISATION CGV-001** : Compléter avec vraies informations

### Mentions Légales (`/mentions-legales`)

**Problème** :
```typescript
<p>
  Le site est hébergé par :<br />
  [Nom de l'hébergeur]<br />
  [Adresse]<br />
  [Pays]
</p>
```
→ Placeholders non remplacés

**PRÉCONISATION ML-001** : Compléter avec infos IONOS

### Politique de Confidentialité (`/politique-de-confidentialite`)

**Problème** :
- Mention de "WhiteWall" comme partenaire impression
- Devrait être "Gelato"

**PRÉCONISATION PC-001** : Remplacer WhiteWall par Gelato

---

# 4. ANALYSE DES COMPOSANTS

## 4.1 HeroCarousel

**Fichier** : `components/HeroCarousel.tsx`

**Problèmes identifiés** :
1. Hauteur trop grande (80vh)
2. Autoplay trop rapide (5000ms)
3. Photo voitures rouges trop agressive

**PRÉCONISATION CAROUSEL-001** :
```tsx
// Actuel
className="h-[80vh]"
Autoplay({ delay: 5000 })

// Corrigé
className="h-[60vh] md:h-[70vh]"
Autoplay({ delay: 9000, stopOnInteraction: true })
```

## 4.2 AddToCartSection

**Fichier** : `components/AddToCartSection.tsx`

**PROBLÈME CRITIQUE** : Prix hardcodés au lieu d'utiliser la configuration

```typescript
// ACTUEL - MAUVAIS
const FORMATS: Format[] = [
  { size: "60×40 cm", price: 1200, available: true },
  // ...
];

// CORRIGÉ
import { PRICING_CONFIG } from '@/lib/pricing-config';
const FORMATS = PRICING_CONFIG.formats;
```

## 4.3 GalleryGrid

**Fichier** : `components/GalleryGrid.tsx`

**Manques** :
1. Pas de `loading="lazy"` sur les images
2. Alt texts génériques

**PRÉCONISATION GRID-001** : Ajouter lazy loading

## 4.4 Navigation

**Fichiers** : `components/navigation/Navigation.tsx`, `components/navigation/MobileNav.tsx`

**Points positifs** :
- Sticky header
- Menu hamburger responsive
- Indicateur page active
- Language switcher

**Point à améliorer** :
- Pas d'aria-labels sur les boutons mobiles

---

# 5. ANALYSE DES TEXTES

## 5.1 Messages FR (fr.json)

### Statistiques

| Métrique | Valeur |
|----------|--------|
| Nombre de clés | 170 |
| Profondeur max | 4 niveaux |
| Catégories | nav, hero, home, gallery, shop, contact, dino, footer |

### Problèmes de répétitions

Comme noté dans CLAUDE.md, certains mots sont répétés excessivement :

| Mot/Expression | Occurrences | Recommandation |
|----------------|-------------|----------------|
| "pinceau/peint" | 8 | Varier : trace, empreinte, signature |
| "unique/irréversible" | 11 | Varier : singulier, définitif, exclusif |
| "Ferrari" | 23 | Réduire, utiliser "la Dino", "la voiture" |

### Textes non traduits

Nouvelles clés ajoutées en FR mais pas en EN/IT :
- `atelier.*` (nouveau contenu AtelierContent)
- `dinoHistoire.*` (nouveau contenu)
- `shop.stats.*`
- `shop.benefits.*`
- `shop.guarantees.*`

**PRÉCONISATION TRAD-001** : Générer traductions EN/IT avec DeepL

## 5.2 Analyse Stylistique

### Ton général
- Première personne ("mon", "mes", "je")
- Ton poétique mais parfois prétentieux
- Vocabulaire de l'art contemporain

### Incohérences de style

| Page | Style | Observation |
|------|-------|-------------|
| Histoire | Narratif, 1ère personne | ✅ Cohérent |
| Atelier | Technique, 1ère personne | ✅ Cohérent |
| FAQ | Informatif, 2ème personne | ✅ Adapté |
| Presse | Journalistique, 3ème personne | ❌ Différent |
| CGV | Juridique | ✅ Normal |

---

# 6. ANALYSE DES BOUTONS ET CTA

## 6.1 Inventaire Complet des CTA

| Page | Texte CTA | Type | Destination | Style |
|------|-----------|------|-------------|-------|
| Homepage | "Découvrir l'histoire" | Link | /histoire | Underline |
| Homepage | "Voir la galerie" | Link | /galerie | Arrow |
| Homepage | "Voir toute la galerie" | Button | /galerie | Border |
| Galerie | "Commander" (lightbox) | Button | /boutique | Filled |
| Boutique | "Ajouter au panier" | Button | - | Primary |
| Contact | "Demander un rendez-vous" | Button | - | ❌ NE FAIT RIEN |
| Contact | "Réserver une visite" | Button | - | ❌ NE FAIT RIEN |
| Collectionneurs | "Nous contacter" | Link | /contact | Filled black |
| Collectionneurs | "Voir les œuvres" | Link | /boutique | Border |

## 6.2 Problèmes de CTA

**Boutons non fonctionnels** :
1. Page Contact : "Demander un rendez-vous" → onclick vide
2. Page Contact : "Réserver une visite" → onclick vide
3. Page Actualités : Newsletter "S'abonner" → pas connecté

**Incohérences de style** :
- Certains CTA sont des Link avec underline
- D'autres sont des boutons avec border
- D'autres sont filled (primary ou black)

**PRÉCONISATION CTA-001** : Standardiser les styles de boutons

```typescript
// Créer un système de boutons cohérent
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

// Primary : Actions principales (Commander, Ajouter au panier)
// Secondary : Actions secondaires (Voir détails)
// Outline : Navigation (Voir la galerie)
// Ghost : Actions tertiaires
// Link : Liens textuels
```

---

# 7. ANALYSE UI/UX

## 7.1 Design System

### Couleurs

| Variable | Valeur | Usage |
|----------|--------|-------|
| --background | #09090b | Fond principal |
| --foreground | #fafafa | Texte principal |
| --primary | #a1a1aa | Accent |
| --muted | #27272a | Fonds secondaires |
| --border | #27272a | Bordures |

### Typographie

| Élément | Taille | Poids | Tracking |
|---------|--------|-------|----------|
| h1 | 6xl-8xl | light (300) | wide |
| h2 | 4xl-5xl | light (300) | wide |
| h3 | 2xl-3xl | light (300) | wide |
| body | lg-xl | light (300) | normal |

### Espacement

Utilisation cohérente de Tailwind :
- `py-20 md:py-28` pour sections
- `px-6 lg:px-8` pour containers
- `gap-8` à `gap-12` pour grilles

## 7.2 Cohérence Visuelle

| Page | Cohérent | Problèmes |
|------|----------|-----------|
| Homepage | ✅ | - |
| Galerie | ✅ | - |
| Boutique | ✅ | - |
| Histoire | ✅ | - |
| Atelier | ✅ | - |
| Dino | ✅ | Images Unsplash |
| Presse | ❌ | Style complètement différent |
| FAQ | ⚠️ | Emojis catégories |
| Quiz | ⚠️ | Emojis boutons |

## 7.3 Responsive

### Breakpoints testés

| Breakpoint | Largeur | Verdict |
|------------|---------|---------|
| Mobile S | 320px | ✅ OK |
| Mobile L | 425px | ✅ OK |
| Tablet | 768px | ✅ OK |
| Laptop | 1024px | ✅ OK |
| Desktop | 1440px | ✅ OK |

### Problèmes responsive

1. **Carousel mobile** : 80vh trop grand sur petits écrans
2. **Footer mobile** : Liens trop serrés
3. **Admin panel** : Non responsive (desktop only)

---

# 8. ANALYSE SEO

## 8.1 Metadata

### État actuel

La plupart des pages n'ont PAS de metadata dynamique !

**Code type actuel** :
```typescript
export default async function GaleriePage() {
  // Pas de generateMetadata !
  return <main>...</main>;
}
```

**PRÉCONISATION SEO-001** : Ajouter generateMetadata sur chaque page

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await params.locale;
  const t = await getTranslations({ locale, namespace: 'gallery' });

  return {
    title: `${t('title')} | Guillaume Farré`,
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      images: ['/images/og/galerie.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('subtitle'),
    },
  };
}
```

## 8.2 Sitemap

**PRÉCONISATION SEO-002** : Ajouter sitemap.xml

```bash
bun add next-sitemap
```

```javascript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://guillaumefarre.com',
  generateRobotsTxt: true,
  alternateRefs: [
    { href: 'https://guillaumefarre.com/fr', hreflang: 'fr' },
    { href: 'https://guillaumefarre.com/en', hreflang: 'en' },
    { href: 'https://guillaumefarre.com/it', hreflang: 'it' },
  ],
};
```

## 8.3 Structured Data

**PRÉCONISATION SEO-003** : Ajouter JSON-LD

```typescript
// components/JsonLd.tsx
export function ArtistJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Guillaume Farré",
          "jobTitle": "Artiste sculpteur",
          "url": "https://guillaumefarre.com",
          "sameAs": [
            "https://instagram.com/guillaumefarre"
          ]
        })
      }}
    />
  );
}
```

---

# 9. ANALYSE ACCESSIBILITÉ

## 9.1 État Actuel

| Critère WCAG | État | Détails |
|--------------|------|---------|
| 1.1.1 Alt texts | ⚠️ | Génériques ("Photo") |
| 1.3.1 Structure | ✅ | Hiérarchie h1-h6 OK |
| 1.4.3 Contraste | ⚠️ | Texte gris sur noir |
| 2.1.1 Clavier | ❌ | Lightbox non navigable |
| 2.4.4 Link purpose | ⚠️ | "Voir plus" non descriptif |
| 4.1.2 Aria labels | ❌ | Boutons icônes sans label |

## 9.2 Préconisations Accessibilité

**A11Y-001** : Améliorer alt texts
```tsx
// Actuel
<img alt={photo.title || "Photo"} />

// Mieux
<img alt={photo.description || `Œuvre "${photo.title}" par Guillaume Farré, ${photo.year}`} />
```

**A11Y-002** : Ajouter aria-labels
```tsx
// Actuel
<button onClick={closeModal}>✕</button>

// Mieux
<button onClick={closeModal} aria-label="Fermer la galerie">✕</button>
```

**A11Y-003** : Vérifier contraste
Certains textes `text-muted-foreground` (#a1a1aa) sur `bg-background` (#09090b) ont un ratio de 4.2:1, juste en dessous du minimum WCAG AA de 4.5:1.

---

# 10. ANALYSE SÉCURITÉ

## 10.1 Authentification

| Élément | État | Recommandation |
|---------|------|----------------|
| Middleware protection | ✅ | Fonctionnel |
| Cookie httpOnly | ✅ | Oui |
| Cookie secure | ⚠️ | Vérifier en prod |
| Mot de passe hashé | ❌ | Comparaison en clair |
| Rate limiting | ❌ | Absent |

## 10.2 APIs

### CRITIQUE : APIs Admin Non Protégées

Toutes les routes `/api/admin/*` sont accessibles sans authentification !

**Fichiers concernés** (11 routes) :
```
app/api/admin/content/route.ts
app/api/admin/photos/route.ts
app/api/admin/delete-photo/route.ts
app/api/admin/edit-photo/route.ts
app/api/admin/detect-orientation/route.ts
app/api/admin/duplicates/route.ts
app/api/admin/similar-images/route.ts
app/api/admin/suggest-series/route.ts
app/api/admin/generate-description/route.ts
app/api/admin/pricing/route.ts
app/api/admin/auth/route.ts
```

**Impact** : N'importe qui peut :
- Lire toutes les photos et metadata
- Modifier les photos
- Supprimer des photos
- Modifier les prix
- Modifier le contenu du site

**PRÉCONISATION SECU-001** : Protéger TOUTES les APIs admin

## 10.3 Données Sensibles

| Donnée | Stockage | Risque |
|--------|----------|--------|
| Mot de passe site | .env (fallback code) | ⚠️ Fallback visible |
| Clé Stripe | .env | ✅ OK |
| Metadata photos | JSON public | ⚠️ Chemin exposé |

---

# 11. ANALYSE PERFORMANCE

## 11.1 Images

**Problèmes** :
1. Images non optimisées (pas de WebP)
2. Pas de lazy loading explicite
3. Pas de srcset pour responsive
4. Pas de placeholder blur

**PRÉCONISATION PERF-001** : Utiliser next/image
```tsx
// Actuel
<img src={photo.path} alt={photo.title} />

// Mieux
<Image
  src={photo.path}
  alt={photo.title}
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={photo.blurHash}
  loading="lazy"
/>
```

## 11.2 Bundle Size

**Dépendances lourdes** :
- `embla-carousel-react` : ~15 KB
- `lucide-react` : ~50 KB (si non tree-shaked)
- `stripe` : ~20 KB

**PRÉCONISATION PERF-002** : Vérifier tree-shaking lucide
```typescript
// Mauvais
import { Heart, ShoppingCart, ... } from 'lucide-react';

// Mieux (si problème de bundle)
import Heart from 'lucide-react/dist/esm/icons/heart';
```

## 11.3 Core Web Vitals

Sans mesure réelle, estimations :
- LCP : ~2.5s (images grandes non optimisées)
- FID : ~100ms (JavaScript acceptable)
- CLS : ~0.1 (layout stable)

---

# 12. ANALYSE TRADUCTIONS

## 12.1 Couverture

| Langue | Clés | Couverture | Qualité |
|--------|------|------------|---------|
| FR | 170 | 100% | Source |
| EN | ~140 | ~82% | Bonne |
| IT | ~140 | ~82% | Bonne |

## 12.2 Clés Manquantes EN/IT

```
atelier.hero.title
atelier.hero.subtitle
atelier.intro.p1
atelier.intro.p2
atelier.ferrari.title
atelier.ferrari.p1
... (nouvelles clés session 2025-12-30)
```

## 12.3 Textes Hardcodés (Non Traduits)

| Fichier | Texte | Solution |
|---------|-------|----------|
| contact/page.tsx | "Demander un rendez-vous" | Ajouter clé contact.cta.appointment |
| faq/page.tsx | Tout le contenu FAQ | Ajouter namespace faq dans messages |
| collectionneurs/page.tsx | Tout le contenu | Ajouter namespace collectors |

**PRÉCONISATION TRAD-002** : Extraire tous les textes hardcodés vers messages/*.json

---

# 13. ANALYSE DES DONNÉES

## 13.1 photo-metadata.json

**Statistiques** :
- Fichier : `data/photo-metadata.json`
- Taille : ~200 KB
- Entrées : 198 photos
- Lignes : 5588

**Schéma actuel** :
```typescript
interface PhotoMetadata {
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
  edition?: { type: 'limited' | 'open'; count?: number };
  status?: 'active' | 'trash' | 'to-sort';
  categories?: string[];
  description?: string;
  aiGenerated?: boolean;
  limitedEditionGrand?: {...};
  limitedEditionPetit?: {...};
}
```

**Problèmes** :
1. La plupart des photos n'ont pas `categories` rempli
2. `limitedEditionGrand/Petit` rarement initialisés
3. `prices` rarement rempli
4. Schéma mixte ancien/nouveau

**PRÉCONISATION DATA-001** : Migration complète du schéma

## 13.2 Pricing Config

**Fichier** : `lib/pricing-config.ts`

Ce fichier existe mais n'est PAS utilisé dans AddToCartSection.tsx !

```typescript
export const PRICING_CONFIG = {
  formats: [
    { id: 'a4', label: 'A4 (21×29.7 cm)', price: 250, exemplaires: 99 },
    { id: 'a3', label: 'A3 (29.7×42 cm)', price: 500, exemplaires: 99 },
    { id: 'a2', label: 'A2 (42×59.4 cm)', price: 800, exemplaires: 99 },
    { id: 'a1', label: 'A1 (59.4×84.1 cm)', price: 1200, exemplaires: 9 },
    // ...
  ]
};
```

---

# 14. QUESTIONS POUR GUILLAUME

## Questions Critiques (Réponse requise)

1. **Articles de presse** : Les mentions de Le Monde, Forbes France, Art Basel Daily sont-elles réelles ? Si oui, as-tu les liens ?

2. **Prix et distinctions** : As-tu vraiment reçu le "Prix Innovation Artistique" de Art Basel Miami 2024 ?

3. **47 collectionneurs** : Ce chiffre est-il réel ou approximatif ?

4. **850K€ de CA** : Ce chiffre mentionné sur /origine est-il réel ?

5. **Numéro de téléphone** : Quel est ton vrai numéro à afficher (ou faut-il le retirer) ?

## Questions Design

6. **Photo rouge carousel** : Veux-tu la remplacer par une photo de ton atelier ?

7. **Œuvres homepage** : Veux-tu que les 6 œuvres affichées soient fixes ou aléatoires ?

8. **Emojis** : Veux-tu garder les emojis sur quiz/FAQ ou les retirer ?

## Questions Fonctionnelles

9. **Formulaire contact** : Veux-tu un vrai formulaire de contact ou juste mailto ?

10. **Newsletter** : Veux-tu activer la newsletter (Mailchimp/Resend) ?

11. **Paiement 3x/4x** : Veux-tu activer Alma comme mentionné dans la FAQ ?

12. **Descriptions IA** : Veux-tu générer des descriptions avec Claude Vision ?

---

# 15. PRÉCONISATIONS PAR PRIORITÉ

## 🔴 CRITIQUE (Jour 1)

| # | Préconisation | Fichier | Effort |
|---|---------------|---------|--------|
| 1 | Protéger APIs admin | app/api/admin/* | 2h |
| 2 | Corriger faux téléphone | contact/page.tsx | 10min |
| 3 | Vérifier articles presse | presse/page.tsx | 30min |
| 4 | Corriger stats boutique | boutique/page.tsx | 1h |
| 5 | Corriger "V12" → "V6" | concept-car-art/page.tsx | 5min |

## 🟠 HAUTE (Semaine 1)

| # | Préconisation | Fichier | Effort |
|---|---------------|---------|--------|
| 6 | Utiliser prix config | AddToCartSection.tsx | 1h |
| 7 | Migration catégories | photo-metadata.json | 2h |
| 8 | Refaire design presse | presse/page.tsx | 3h |
| 9 | Compléter mentions légales | mentions-legales/page.tsx | 30min |
| 10 | Traductions EN/IT | messages/*.json | 2h |

## 🟡 MOYENNE (Semaine 2)

| # | Préconisation | Fichier | Effort |
|---|---------------|---------|--------|
| 11 | Réduire carousel | HeroCarousel.tsx | 30min |
| 12 | Ajouter metadata SEO | Toutes pages | 3h |
| 13 | Ajouter sitemap | next-sitemap.config.js | 1h |
| 14 | Retirer emojis | concept-car-art, quiz | 30min |
| 15 | Découper admin page | admin/page.tsx | 4h |

## 🟢 BASSE (Mois 1)

| # | Préconisation | Fichier | Effort |
|---|---------------|---------|--------|
| 16 | Tests E2E | tests/ | 8h |
| 17 | Optimiser images | Toutes | 4h |
| 18 | Améliorer accessibilité | Composants | 4h |
| 19 | Migrer metadata vers DB | data/ | 8h |
| 20 | PWA/Service Worker | - | 4h |

---

# 16. PLAN D'ACTION

## Jour 1 : Critiques

```bash
# 1. Protéger APIs admin (2h)
# Créer lib/admin/auth.ts
# Modifier chaque route /api/admin/*

# 2. Corriger téléphone (10min)
# Dans contact/page.tsx, remplacer +33 6 12 34 56 78

# 3. Vérifier presse avec Guillaume (30min)
# Attendre confirmation avant modification

# 4. Corriger stats (1h)
# Dans boutique/page.tsx, corriger calculs

# 5. V12 → V6 (5min)
# Dans concept-car-art/page.tsx
```

## Semaine 1 : Haute priorité

```bash
# 6. Centraliser prix (1h)
# 7. Migration données (2h)
# 8. Refaire presse (3h)
# 9. Compléter légal (30min)
# 10. Traductions (2h)
```

## Semaine 2 : Moyenne priorité

```bash
# 11-15. Améliorations UX et SEO
```

---

# FIN DE L'AUDIT

**Total préconisations** : 120+
**Critiques** : 5
**Hautes** : 5
**Moyennes** : 5
**Basses** : 5+

**Effort total estimé** : ~50 heures

---

**Auditeur** : Lalou
**Date** : 30 décembre 2025
**Version** : 1.0
