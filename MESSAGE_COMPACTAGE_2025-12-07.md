# MESSAGE EXHAUSTIF POUR REPRISE APRÈS COMPACTAGE

**Date** : 2025-12-07
**Projet** : guillaumefarre.com
**Dernier commit** : `7131bed` - docs: sauvegarde complète session 2025-12-07 avant compactage

---

# PARTIE 1 : CONTEXTE DU PROJET

## Qui est Guillaume Farré ?

Guillaume Farré est un artiste plasticien français. Son travail artistique consiste à utiliser sa **Dino** (une voiture de collection) comme instrument de création. La Dino roule sur des toiles, laissant des empreintes uniques créées par la friction, la peinture industrielle, la chaleur et la pression.

**IMPORTANT** : On dit "Dino", pas "Ferrari". La Dino est le nom de la voiture. Ne jamais dire "Ferrari" dans les textes du site.

## Ce que Guillaume vend

### 1. TABLEAUX (toiles physiques) - PAS EN LIGNE
- Créés par passage direct de la Dino sur toile vierge
- Pièces uniques, irréproductibles
- Vendus uniquement à l'atelier ou lors d'expositions
- Prix sur devis

### 2. PHOTOGRAPHIES - EN LIGNE
Photos documentant l'instant où la Dino crée sur la toile.

**Exemplaires** :
| Type | Formats | Exemplaires | Numérotation |
|------|---------|-------------|--------------|
| Grands formats | 2A0, A0, A1 | 9 | 1/9 à 9/9 |
| Petits formats | A2, A3, A4 | 99 | 1/99 à 99/99 |

**Prix** :
| Format | Dimensions | Prix |
|--------|-----------|------|
| 2A0 | 118.9 × 168.2 cm | Sur devis |
| A0 | 84.1 × 118.9 cm | Sur devis |
| A1 | 59.4 × 84.1 cm | 1200€ |
| A2 | 42 × 59.4 cm | 800€ |
| A3 | 29.7 × 42 cm | 500€ |
| A4 | 21 × 29.7 cm | 250€ |

**Séries photos** :
- **Empreintes** : traces laissées par roues/carrosserie/châssis
- **Atelier** : la Dino au repos entre sessions
- **Projections** : énergie brute de l'action capturée

---

# PARTIE 2 : CE QUI A ÉTÉ FAIT CETTE SESSION (2025-12-07)

## 2.1. Système d'authentification simplifié

### Avant (supprimé)
- HTTP Basic Auth nginx (popup navigateur username + password)
- Username : `guillaume`
- Configuré dans `/etc/nginx/.htpasswd`

### Maintenant (actuel)
- Page de login Next.js custom `/fr/login`
- **JUSTE UN CHAMP MOT DE PASSE** (pas de username)
- **Mot de passe** : `LHOOQladino246`
- Cookie `gf_auth` avec valeur `authenticated`
- Cookie valide 30 jours
- Middleware Next.js redirige vers /login si pas de cookie

### Fichiers créés/modifiés

**app/[locale]/login/page.tsx** (NOUVEAU) :
```tsx
// Page login avec juste un champ mot de passe
// Fond noir, design minimaliste
// Appelle POST /api/auth/login avec { password }
// Si OK → redirige vers /fr et set cookie
```

**app/api/auth/login/route.ts** (NOUVEAU) :
```tsx
// Vérifie le mot de passe
// Si correct → set cookie gf_auth=authenticated (30 jours)
// Si incorrect → 401
const SITE_PASSWORD = process.env.SITE_PASSWORD || "LHOOQladino246";
```

**middleware.ts** (MODIFIÉ) :
```tsx
// Routes publiques (pas d'auth) :
// - /api/* (API routes)
// - /_next/* (assets Next.js)
// - /images/* (images)
// - fichiers avec extension (.)
// - pages /login

// Toutes autres routes :
// - Vérifie cookie gf_auth
// - Si absent → redirige vers /{locale}/login
// - Si présent → continue avec middleware i18n
```

### Config nginx (HTTP Basic désactivé)
```nginx
# Dans /etc/nginx/sites-available/guillaumefarre
# Ces lignes sont commentées :
#auth_basic "Site Guillaume Farré - Accès Restreint";
#auth_basic_user_file /etc/nginx/.htpasswd;
```

---

## 2.2. Page /dino-histoire

### Description
Page complète sur l'histoire de la Dino (la voiture) dans le monde automobile :
- Alfredo "Dino" Ferrari (1932-1956) - fils d'Enzo
- Le moteur V6 Dino (F2, F1, route)
- Dino 206 GT (1967-1969)
- Dino 246 GT & GTS (1969-1974)
- L'héritage et la Dino de Guillaume

### Images utilisées
**IMAGES WIKIPEDIA COMMONS** - pas Unsplash, pas images de la galerie Guillaume.

C'était une demande explicite : utiliser des images historiques libres de droit, pas les photos de Guillaume.

```
Hero:
https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Dino_246_GT_%2824627987921%29.jpg/1600px-Dino_246_GT_%2824627987921%29.jpg

Section Alfredo:
https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Dino_206_GT_%2815406731344%29.jpg/800px-Dino_206_GT_%2815406731344%29.jpg

Section 206 GT:
https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Petersen_Museum_%2852042599362%29.jpg/800px-Petersen_Museum_%2852042599362%29.jpg

Section 246 GTS:
https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/1973_Dino_246GTS.jpg/800px-1973_Dino_246GTS.jpg

Section Guillaume:
https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/1972_Ferrari_Dino_246_GTS_2.4_Interior.jpg/800px-1972_Ferrari_Dino_246_GTS_2.4_Interior.jpg
```

### Fichiers

**app/[locale]/dino-histoire/page.tsx** (NOUVEAU) :
- Page complète avec Navigation
- 6 sections : Hero, Alfredo, Moteur V6, 206 GT, 246 GT, Guillaume
- Traductions via `getTranslations("dinoHistoire")`
- Lien vers /dino et /galerie en bas

**app/[locale]/dino/page.tsx** (MODIFIÉ) :
- Ajout d'un lien vers /dino-histoire :
```tsx
<Link href="/dino-histoire">
  L'histoire de la Dino →
</Link>
```

---

## 2.3. Mode admin édition inline des textes

### Fonctionnement pour Guillaume

1. Il va sur n'importe quelle page du site
2. Il ajoute `?admin=true` à l'URL (ex: `/fr/histoire?admin=true`)
3. Une barre noire apparaît en bas "Mode Édition"
4. Il clique sur un texte → le texte devient éditable
5. Il modifie le texte
6. Les textes modifiés sont surlignés en jaune avec un *
7. Il clique "Sauvegarder" → les modifications sont enregistrées dans `messages/fr.json`
8. Pour quitter → clic sur "Quitter" ou enlever `?admin=true` de l'URL

### Architecture technique

L'architecture est **préparée pour migration vers base de données** plus tard. Actuellement stockage dans fichiers JSON.

### Fichiers créés

**contexts/AdminModeContext.tsx** :
```tsx
// Contexte React global
// - isAdminMode : boolean (détecte ?admin=true)
// - pendingChanges : Map<string, string> (modifications en attente)
// - setPendingChange(key, value) : ajoute une modification
// - saveAllChanges() : appelle API pour sauvegarder
// - hasUnsavedChanges : boolean
// - isSaving : boolean
```

**components/admin/EditableText.tsx** :
```tsx
// Composant texte éditable
// Props :
// - textKey : clé unique (ex: "histoire.hero.title")
// - children : texte par défaut
// - as : tag HTML (h1, h2, p, span...)
// - className : classes CSS
// - multiline : boolean (textarea ou input)

// En mode normal → affiche le texte normalement
// En mode admin → cliquable, devient input/textarea au clic
// Textes modifiés → fond jaune + * à côté
```

**components/admin/AdminToolbar.tsx** :
```tsx
// Barre flottante en bas de page
// - Point jaune animé "Mode Édition"
// - Compteur modifications (ex: "3 modifications")
// - Bouton "Sauvegarder" (jaune si modifications, grisé sinon)
// - Lien "Quitter" (enlève ?admin=true)
```

**components/admin/AdminWrapper.tsx** :
```tsx
// Wrapper qui encapsule AdminModeProvider + AdminToolbar
// Utilisé dans le layout principal
// Suspense pour le useSearchParams
```

**lib/content-manager.ts** :
```tsx
// Service de gestion du contenu
// Interface ContentManagerInterface avec :
// - get(locale, key)
// - set(locale, key, value)
// - setMany(locale, changes)
// - getAll(locale)

// Implémentation actuelle : ContentManagerJSON
// - Lit/écrit dans messages/{locale}.json
// - Crée backup avant chaque écriture

// Pour migrer vers DB :
// 1. Créer ContentManagerDB qui implémente l'interface
// 2. Changer l'export default
```

**app/api/admin/content/route.ts** :
```tsx
// POST /api/admin/content
// Body: { changes: { "key": "value" }, locale: "fr" }
// - Vérifie cookie gf_auth
// - Appelle contentManager.setMany()
// - Retourne success/error

// GET /api/admin/content?locale=fr
// - Retourne tout le contenu de la locale
```

### Intégration dans le layout

**app/[locale]/layout.tsx** (MODIFIÉ) :
```tsx
import AdminWrapper from '@/components/admin/AdminWrapper';

// Dans le body :
<NextIntlClientProvider messages={messages}>
  <CartProvider>
    <AdminWrapper>  {/* AJOUTÉ */}
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </AdminWrapper>  {/* AJOUTÉ */}
  </CartProvider>
</NextIntlClientProvider>
```

### Page convertie : /histoire

**components/pages/HistoireContent.tsx** (NOUVEAU) :
```tsx
// Contenu de la page histoire avec EditableText
// Exemple :
<EditableText
  textKey="histoire.hero.title"
  as="h1"
  className="text-4xl font-bold"
>
  L'Histoire
</EditableText>
```

**app/[locale]/histoire/page.tsx** (MODIFIÉ) :
```tsx
// Avant : tout le HTML était dans ce fichier
// Maintenant : importe HistoireContent
import HistoireContent from "@/components/pages/HistoireContent";

export default function HistoirePage() {
  return (
    <main>
      <Navigation />
      <HistoireContent />
    </main>
  );
}
```

### Comment convertir une autre page

1. Créer `components/pages/[NomPage]Content.tsx`
2. Copier le contenu de la page
3. Ajouter `"use client";` en haut
4. Importer EditableText : `import EditableText from "@/components/admin/EditableText";`
5. Remplacer chaque texte éditable par :
```tsx
<EditableText textKey="section.subsection.key" as="p" className="...">
  Texte original
</EditableText>
```
6. Dans la page originale, importer et utiliser le composant Content

### Pages NON converties (à faire)

- /atelier
- /dino
- /dino-histoire
- /galerie
- /boutique
- /concept-car-art
- /presse
- /contact
- Homepage (/)

---

# PARTIE 3 : COMMITS DE LA SESSION

```
7131bed docs: sauvegarde complète session 2025-12-07 avant compactage
e99a7d5 feat: mode admin avec édition inline des textes (?admin=true)
5b3572e fix: images Wikipedia historiques Ferrari Dino
efe53ab fix: utiliser photos atelier Guillaume (vraies Ferrari)
a5806c2 fix: remplacer images par vraies Ferrari sur page dino-histoire
eda8b6c fix: exclure API du middleware i18n
a4e11e8 fix: déplacer login dans [locale] pour layout
1894cd2 feat: page login simple avec juste mot de passe (plus de username)
3229b0c docs: mise à jour session 2025-11-30 - dino-histoire + accès simplifié
e13a897 fix: images Unsplash libres de droit pour page dino-histoire
2a062f3 fix: remettre images locales - wikimedia 404
099133e fix: images historiques Wikimedia pour page dino-histoire
ffdd324 fix: remplacer placeholders par vraies images page dino-histoire
d4c26df feat: page histoire Dino dans le monde automobile
42e8619 feat: galerie photo pleine page sans filtre blanc
```

---

# PARTIE 4 : STRUCTURE DU PROJET

## Arborescence principale

```
/Users/raouldelpech/Desktop/Claude/guillaume-farre/guillaume-farre-from-github/

├── app/
│   ├── [locale]/                    # Pages internationalisées
│   │   ├── page.tsx                 # Homepage
│   │   ├── layout.tsx               # Layout principal (AdminWrapper ici)
│   │   ├── globals.css
│   │   ├── login/page.tsx           # Page login (NOUVEAU)
│   │   ├── histoire/page.tsx        # Page histoire (utilise HistoireContent)
│   │   ├── dino/page.tsx            # Page Dino de Guillaume
│   │   ├── dino-histoire/page.tsx   # Histoire de la Dino (NOUVEAU)
│   │   ├── galerie/page.tsx
│   │   ├── boutique/page.tsx
│   │   ├── atelier/page.tsx
│   │   ├── admin/page.tsx           # Admin photos
│   │   ├── panier/page.tsx
│   │   └── ... autres pages
│   └── api/
│       ├── auth/
│       │   └── login/route.ts       # API login (NOUVEAU)
│       ├── admin/
│       │   ├── content/route.ts     # API contenu éditable (NOUVEAU)
│       │   ├── photos/route.ts
│       │   ├── edit-photo/route.ts
│       │   └── ... autres API admin
│       └── stripe/
│           └── checkout/route.ts

├── components/
│   ├── admin/                       # Composants mode admin (NOUVEAU)
│   │   ├── EditableText.tsx
│   │   ├── AdminToolbar.tsx
│   │   └── AdminWrapper.tsx
│   ├── pages/                       # Contenus pages éditables (NOUVEAU)
│   │   └── HistoireContent.tsx
│   ├── navigation/
│   │   └── Navigation.tsx
│   ├── lightbox/
│   │   └── Lightbox.tsx
│   ├── shop/
│   │   ├── ShopGrid.tsx
│   │   ├── PricingDisplay.tsx
│   │   └── StockBadge.tsx
│   └── ... autres composants

├── contexts/
│   ├── AdminModeContext.tsx         # Contexte mode admin (NOUVEAU)
│   └── CartContext.tsx

├── lib/
│   ├── content-manager.ts           # Service contenu (NOUVEAU)
│   ├── works.ts
│   ├── images.ts
│   └── admin/
│       └── photo-manager.ts

├── messages/
│   ├── fr.json                      # Traductions FR (source de vérité)
│   ├── en.json
│   └── it.json

├── data/
│   └── photo-metadata.json          # Metadata photos (SOURCE = SERVEUR)

├── public/
│   └── images/
│       └── works/
│           ├── atelier/
│           ├── empreintes/
│           └── projection/

├── middleware.ts                    # Auth + i18n (MODIFIÉ)
├── CLAUDE.md                        # Instructions projet
├── SESSION_2025-12-07_COMPLET.md    # Rapport session
└── MESSAGE_COMPACTAGE_2025-12-07.md # CE FICHIER
```

## Structure metadata photo

Chaque photo dans `data/photo-metadata.json` :

```json
{
  "filename": "atelier-003.jpg",
  "path": "/images/works/atelier/atelier-003.jpg",
  "categories": ["limited"],
  "status": "active",
  "visible": true,
  "forSale": true,
  "category": "atelier",
  "isNumberedSeries": true,
  "limitedEdition": {
    "total": 9,
    "sold": 0,
    "available": 9,
    "closed": false
  },
  "limitedEditionGrand": {
    "total": 9,
    "sold": 0,
    "available": 9,
    "closed": false
  },
  "limitedEditionPetit": {
    "total": 99,
    "sold": 0,
    "available": 99,
    "closed": false
  },
  "prices": {
    "limited": {
      "a4": 250,
      "a3": 500,
      "a2": 800,
      "a1": 1200
    }
  }
}
```

---

# PARTIE 5 : ACCÈS ET CREDENTIALS

## Site public
- **URL** : https://guillaumefarre.com
- **Mot de passe** : `LHOOQladino246`

## Mode édition textes
- Ajouter `?admin=true` à n'importe quelle URL
- Ex: https://guillaumefarre.com/fr/histoire?admin=true

## Admin photos
- **URL** : https://guillaumefarre.com/fr/admin
- **Mot de passe** : `LHOOQladino246`

## Serveur production
- **IP** : 51.38.35.238
- **User SSH** : ubuntu
- **Chemin** : /var/www/guillaume-farre
- **Process** : PM2 "guillaume-farre"

## Connexion SSH
```bash
ssh ubuntu@51.38.35.238
```

---

# PARTIE 6 : COMMANDES UTILES

## Déploiement complet
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && git stash && git pull && npm run build && pm2 restart guillaume-farre"
```

## Vérifier status production
```bash
ssh ubuntu@51.38.35.238 "pm2 status && curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"
```

## Sync metadata serveur → local
```bash
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
```

## Logs PM2
```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 50 --nostream"
```

## Build local
```bash
bun run dev      # Développement
bun run build    # Build production
bun run lint     # Vérification
```

---

# PARTIE 7 : RÈGLES CRITIQUES

## RÈGLE #32 - METADATA (NE JAMAIS OUBLIER)

```
❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISÉ : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier du SERVEUR est la SOURCE DE VÉRITÉ.
Guillaume travaille dans l'admin en production.
Ne JAMAIS écraser ce fichier depuis le local.
```

**Incident passé** : En 2025-11-19, le metadata local a été copié vers production, écrasant les modifications de Guillaume. Récupération partielle via logs PM2.

## Règle vocabulaire

- **DIRE** : "Dino"
- **NE PAS DIRE** : "Ferrari"

La voiture s'appelle Dino. Dans tous les textes du site, on dit Dino.

## Règle exemplaires

- Grands formats (2A0, A0, A1) : **9 exemplaires**
- Petits formats (A2, A3, A4) : **99 exemplaires**
- Plus de tirages illimités (supprimé en 2025-11-29)

---

# PARTIE 8 : CE QUI RESTE À FAIRE

## Priorité haute

1. **Convertir autres pages pour mode admin édition** :
   - /atelier
   - /dino
   - /dino-histoire
   - /galerie
   - /boutique
   - Homepage

   Pour chaque page :
   - Créer `components/pages/[Page]Content.tsx`
   - Utiliser `<EditableText>` pour chaque texte éditable
   - Modifier la page pour importer le composant Content

## Priorité moyenne

2. **Traductions EN/IT** - pas demandé pour l'instant

## Priorité basse

3. **Migration ContentManager vers base de données** - architecture déjà prête dans `lib/content-manager.ts`

---

# PARTIE 9 : STACK TECHNIQUE

- **Framework** : Next.js 15.5.6
- **Runtime** : Bun (dev), Node.js (prod)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui (thème zinc)
- **i18n** : next-intl (FR/EN/IT)
- **Paiements** : Stripe
- **Hébergement** : VPS IONOS
- **Process manager** : PM2
- **Reverse proxy** : nginx

---

# PARTIE 10 : FICHIERS À LIRE EN PREMIER

1. `SESSION_2025-12-07_COMPLET.md` - rapport détaillé
2. `CLAUDE.md` - règles projet complètes
3. Ce fichier `MESSAGE_COMPACTAGE_2025-12-07.md`

## Vérifications au démarrage

```bash
# État git
git status && git log -3

# État serveur
ssh ubuntu@51.38.35.238 "pm2 status"

# Test site
curl -sI "https://guillaumefarre.com/" | head -5
```

---

**Signature** : Lalou
**Date** : 2025-12-07
**Commit** : 7131bed
