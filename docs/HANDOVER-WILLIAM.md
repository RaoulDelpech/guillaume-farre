# Handover William - Projet Guillaume Farre

Document de passation complet pour reprendre le projet.
Derniere mise a jour : 14 avril 2026.

---

## 1. ACCES ET CREDENTIALS

### VPS OVH (production)
- **IP** : 57.131.23.96
- **User SSH** : ubuntu
- **Cle SSH** : `~/.ssh/gf_deploy_new`
- **Chemin site sur le VPS** : `/var/www/guillaumefarre`
- **Process manager** : PM2 (process `guillaumefarre`)
- **Port** : 3000 (Next.js)

### Domaine
- **guillaumefarre.com** pointe vers le VPS OVH (57.131.23.96)
- IONOS n'est plus utilise (ancien hebergeur, migration terminee)

### GitHub
- **Repo** : `git@github.com:RaoulDelpech/guillaume-farre.git`
- **Branche principale** : `main`
- **Deploy automatique** : push sur `main` declenche GitHub Actions

### Stripe (paiements)
- Les cles sont dans `.env.local` (pas en dur dans le code)
- Variables : `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Mode LIVE actif
- Les secrets sont aussi dans les GitHub Actions secrets pour le deploy

### Admin du site
- **URL** : `https://guillaumefarre.com/fr/login`
- **Mot de passe** : `LHOOQladino246`
- Cookie `gf_auth` valide 30 jours apres connexion
- Apres login : acces a `/admin` pour gerer le contenu

### Mode du site
- **SITE_MODE** actuel : `pre-launch` (tout le site est protege par mot de passe)
- Pour passer en mode public : changer `SITE_MODE=public` dans `.env.local` sur le VPS et dans les secrets GitHub Actions
- Le middleware (`middleware.ts`) gere le routage selon ce mode

---

## 2. STACK TECHNIQUE

| Composant | Version / Outil |
|-----------|----------------|
| Framework | Next.js 15.5.15 (App Router) |
| Runtime | Bun (package manager + runtime) |
| Langage | TypeScript 5.9.3 |
| Styling | Tailwind CSS 3.4 + shadcn/ui (theme zinc) |
| i18n | next-intl 4.9 (FR / EN / IT) |
| Paiements | Stripe 19.3 |
| Animations | Framer Motion 12.38, GSAP 3.14 |
| Images | Sharp (optimisation server-side) |
| Email | Resend + React Email |
| Tests | Vitest + Testing Library + Playwright |
| Linting | ESLint + Biome (formatage) |
| CI/CD | GitHub Actions → SSH deploy vers VPS OVH |
| Production | PM2 |

### Prerequis machine locale
- **Bun** : requis (le `preinstall` script bloque npm/yarn/pnpm)
- **Node 24** : requis pour le build local. Chemin mac homebrew : `/opt/homebrew/Cellar/node/24.10.0_1/bin/node`
- Sur le VPS : Node 20+ suffit (installe via nodesource)

---

## 3. ARCHITECTURE

### Structure des dossiers

```
guillaume-farre-from-github/
├── app/
│   └── [locale]/               # Routes internationalisees (fr/en/it)
│       ├── page.tsx             # Homepage (carousel + sections)
│       ├── galerie/             # Galerie photos (grille masonry)
│       ├── toiles/              # Page toiles (timeline, lightbox)
│       ├── boutique/            # Boutique Stripe
│       ├── panier/              # Panier d'achats
│       ├── commande/            # Confirmation commande
│       ├── contact/             # Formulaire contact
│       ├── faq/                 # FAQ
│       ├── login/               # Login admin
│       ├── admin/               # Interface admin
│       ├── vip/                 # Page VIP (ne pas toucher)
│       ├── histoire/            # (masquee) Bio artiste
│       ├── atelier/             # (masquee) Atelier
│       ├── origine/             # (masquee) Origines
│       ├── dino/                # (masquee) Ferrari Dino
│       ├── dino-histoire/       # (masquee) Histoire Dino
│       ├── presse/              # (masquee) Revue presse
│       ├── actualites/          # (masquee) Actualites
│       ├── collectionneurs/     # (masquee) Collectionneurs
│       ├── cgv/                 # CGV
│       ├── mentions-legales/    # Mentions legales
│       ├── politique-de-confidentialite/
│       ├── retours-echanges/    # Politique retours
│       └── galerie-item/        # Detail item galerie
│   └── api/                     # API Routes
│       ├── admin/               # APIs admin (CSRF protege)
│       ├── auth/login/          # API login
│       ├── contact/             # Formulaire contact (envoi email)
│       ├── gelato/              # Webhooks Gelato (impression)
│       ├── instagram/           # Feed Instagram (desactive Phase 1)
│       ├── newsletter/          # Inscription newsletter
│       ├── reservations/        # Reservations toiles
│       ├── stripe/              # Webhooks + checkout Stripe
│       ├── upload/              # Upload images admin
│       └── vip/validate/        # Validation codes VIP (ne pas toucher)
├── components/
│   ├── AmericanFrame.tsx        # COMPOSANT SACRE - caisse americaine CSS
│   ├── PhotoFrame.tsx           # Cadre photo standard
│   ├── HeroCarousel.tsx         # Carousel homepage
│   ├── AtelierDoors.tsx         # Portes d'atelier homepage
│   ├── GarageShutter.tsx        # Rideau de garage (animation)
│   ├── Footer.tsx               # Footer site
│   ├── navigation/              # Nav desktop + mobile
│   ├── lightbox/                # Lightbox images plein ecran
│   ├── galerie/                 # Composants galerie
│   ├── pages/                   # Contenus de pages (GalerieSalles, ToilesContent...)
│   ├── admin/                   # Composants admin (EditableText, AdminToolbar)
│   ├── ui/                      # shadcn/ui (button, card, badge, slider)
│   └── ...                      # ~44 composants au total
├── data/
│   ├── toiles.json              # 20 toiles (id, nom, dimensions, technique, prix, image)
│   ├── photos.json              # 16 photos (id, nom, image, dimensions)
│   ├── page-images.json         # Config images par page
│   ├── photo-metadata.json      # Metadata photos (SERVEUR = source de verite)
│   ├── blur-placeholders.json   # Placeholders flous pour chargement images
│   ├── newsletter-subscribers.json  # Abonnes newsletter
│   ├── orders.json              # Commandes
│   └── vip-codes.json           # Codes VIP (ne pas toucher)
├── lib/
│   ├── works.ts                 # Fonctions donnees oeuvres
│   ├── images.ts                # Utilitaires images
│   ├── page-images.ts           # Interface page images
│   ├── content-manager.ts       # Gestion contenu editable
│   ├── orders.ts                # Gestion commandes
│   ├── rate-limit.ts            # Rate limiting API
│   ├── pricing-config.ts        # Configuration prix
│   ├── pricing-calculator.ts    # Calcul prix
│   ├── gelato-client.ts         # Client API Gelato (impression)
│   ├── early-access.ts          # Logique early access
│   └── ...                      # ~38 fichiers lib au total
├── i18n/
│   ├── routing.ts               # Config routes i18n (locales: fr, en, it)
│   └── request.ts               # Config requetes i18n
├── messages/
│   ├── fr.json                  # Traductions francais (source de verite)
│   ├── en.json                  # Traductions anglais
│   └── it.json                  # Traductions italien
├── public/images/
│   ├── toiles/                  # 22 images (1-20 + triptyque 17-gauche/milieu/droite)
│   └── works/photos/            # 16 photos (1-16)
├── contexts/                    # React contexts (AdminMode...)
├── hooks/                       # Custom hooks React
├── scripts/                     # Scripts utilitaires (migration, traduction)
├── middleware.ts                # Middleware auth + i18n + CSRF
├── next.config.mjs              # Config Next.js
└── .github/workflows/
    └── deploy.yml               # CI/CD deploy vers VPS OVH
```

### Systeme d'images

**Toiles** (peintures sur toile) :
- Fichiers : `/public/images/toiles/1.jpg` a `20.jpg` + triptyque `17-gauche.jpg`, `17-milieu.jpg`, `17-droite.jpg`
- Donnees : `data/toiles.json` — 20 entrees avec id, nom, dimensions, technique, annee, prix, image, imageWidth/Height
- Affichees sur `/toiles` dans une timeline avec lightbox

**Photos** (photographies d'art) :
- Fichiers : `/public/images/works/photos/1.jpg` a `16.jpg`
- Donnees : `data/photos.json` — 16 entrees avec id, nom, image, imageWidth/Height
- Affichees sur `/galerie` dans une grille masonry avec cadres americains

### Composant AmericanFrame

**IMPORTANT : NE JAMAIS MODIFIER `AmericanFrame.tsx`**

C'est le composant le plus precieux du site. Il reproduit une caisse americaine en CSS pur avec 4 couleurs disponibles : oak (chene), walnut (noyer), black (noir), white (blanc). Les cadres alternent sur la page galerie. Le rendu visuel est realiste et a ete longuement calibre.

### Middleware (`middleware.ts`)

Le middleware gere :
1. **Mode pre-launch** : toutes les pages redirigent vers `/login` sauf login + assets + APIs whitelistees
2. **Mode public** : acces libre, i18n routing
3. **Protection CSRF** : les APIs admin mutantes (`/api/admin/*`) verifient le header `Origin`
4. Le token auth est un hash fixe (`681cb964982c5f2ccc2accaded688f3b`) compare au cookie `gf_auth`

---

## 4. ETAT ACTUEL DU SITE

### Phase 1 (en cours) — Site public
L'objectif est de mettre en ligne publiquement :
- **Homepage** : carousel photos + section photos + section toiles
- **Galerie** (`/galerie`) : grille masonry des 16 photos avec cadres americains + lightbox
- **Toiles** (`/toiles`) : page toiles sans prix visibles (timeline, lightbox)
- **Boutique** (`/boutique`) : achat photos via Stripe
- **Contact** (`/contact`), **FAQ** (`/faq`), **Admin** (`/admin`)
- **Login** (`/login`) : critique pour l'acces admin

### Phase 2 (plus tard) — Site secret toiles
- Page secrete avec prix des toiles, accessible par un slug complexe (pas de mot de passe)
- Composant `GarageShutter.tsx` prevu pour l'animation d'entree
- Ne pas toucher aux routes VIP existantes

### Pages actives
| Route | Description |
|-------|-------------|
| `/` | Homepage avec carousel, sections photos et toiles |
| `/galerie` | Grille masonry 16 photos avec AmericanFrame |
| `/toiles` | 20 toiles en timeline avec lightbox |
| `/boutique` | Boutique Stripe |
| `/panier` | Panier d'achats |
| `/commande` | Confirmation commande |
| `/contact` | Formulaire contact |
| `/faq` | Questions frequentes |
| `/login` | Login admin (mot de passe) |
| `/admin` | Interface admin |
| `/cgv` | Conditions generales de vente |
| `/mentions-legales` | Mentions legales |

### Pages masquees (existent mais pas dans la nav)
`/histoire`, `/atelier`, `/origine`, `/dino`, `/dino-histoire`, `/presse`, `/actualites`, `/collectionneurs`

### A ne PAS toucher
- `/vip`, `/toiles` (aspect secret/prix)
- `data/vip-codes.json`, `lib/vip-codes.ts`, `app/api/vip/validate/`

---

## 5. DEPLOY

### Workflow CI/CD

Fichier : `.github/workflows/deploy.yml`

Le deploy se fait **entierement sur le VPS via SSH** (pas de build sur le runner GitHub) :

1. Push sur `main`
2. GitHub Actions se connecte en SSH au VPS (57.131.23.96)
3. Sur le VPS :
   - `git fetch origin main && git reset --hard origin/main`
   - Backup des fichiers runtime (newsletter, photo-metadata) dans `/tmp/`
   - `bun install --frozen-lockfile`
   - Ecriture du `.env.local` depuis les secrets GitHub
   - `NODE_OPTIONS="--max-old-space-size=4096" bun run build`
   - `pm2 restart guillaumefarre`
   - Verification port 3000

### Secrets GitHub Actions
| Secret | Description |
|--------|-------------|
| `SSH_HOST` | 57.131.23.96 |
| `SSH_USER` | ubuntu |
| `SSH_PRIVATE_KEY` | Cle SSH privee |
| `STRIPE_SECRET_KEY` | Cle Stripe live |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Cle Stripe publique |
| `ADMIN_PASSWORD` | Mot de passe admin |
| `ANTHROPIC_API_KEY` | Cle API Anthropic |
| `SITE_PASSWORD` | Mot de passe site pre-launch |
| `SITE_MODE` | `pre-launch` actuellement |

### Fichiers runtime (ne pas ecraser)
Le deploy sauvegarde et restaure automatiquement :
- `data/newsletter-subscribers.json` — liste des abonnes
- `data/photo-metadata.json` — metadata photos (SERVEUR = source de verite, ne JAMAIS copier du local vers le serveur)

### Commandes manuelles sur le VPS
```bash
ssh -i ~/.ssh/gf_deploy_new ubuntu@57.131.23.96
cd /var/www/guillaumefarre
pm2 logs guillaumefarre     # Voir les logs
pm2 restart guillaumefarre  # Redemarrer
pm2 status                  # Etat du process
```

---

## 6. PROBLEMES CONNUS / EN COURS

### Page toiles : cadres AmericanFrame de tailles inconsistantes
- Les cadres autour des toiles n'ont pas tous la meme taille visuelle
- Le composant AmericanFrame est correct, c'est l'integration dans la page toiles qui pose probleme
- Fichier concerne : `components/pages/ToilesContent.tsx` ou `app/[locale]/toiles/page.tsx`

### Page galerie lightbox : CTA mailto au lieu de Stripe checkout
- Quand on ouvre une photo en lightbox et qu'on clique sur le bouton d'achat, ca ouvre un mailto au lieu du checkout Stripe
- Le flux devrait etre : lightbox → bouton acheter → redirection vers Stripe checkout

### Photo 7 placeholder
- La photo 7 s'appelle "A remplacer" dans `data/photos.json`
- Image placeholder a remplacer par une vraie photo de Guillaume

### Instagram
- Le handle est a verifier : `guillaumefarre.art` vs `guillaumefarre`
- Les composants Instagram sont desactives en Phase 1 (lib/instagram, instagram-optimizer)

### Modules desactives (Phase 1)
Ces modules existent dans le code mais ne doivent pas etre utilises pour la phase publique :
- `lib/ai-commercial-analyzer.ts`
- `lib/art-market-expert.ts`
- `lib/commercial-performance.ts`
- `components/PriceHistoryChart.tsx`
- `components/ROICalculator.tsx`
- `lib/instagram-optimizer.ts`

---

## 7. REGLES METIER

### L'artiste
Guillaume Farre est un artiste-sculpteur qui **peint avec des Ferrari**. Il fait rouler ses Ferrari directement sur des toiles vierges. La peinture industrielle se depose par friction, chaleur et pression. Chaque toile est unique et irreplicable.

### Toiles (peintures)
- **Vendues en personne uniquement** (atelier ou expositions)
- **PAS vendues en ligne**
- Prix non publics sur le site public (Phase 1)
- Prix dans `data/toiles.json` mais non affiches
- 20 toiles + 1 triptyque (toile 17 en 3 parties)

### Photos (photographies d'art)
- **Vendues en ligne via Stripe**
- Tirages numerotes et signes
- Certificat d'authenticite fourni
- 16 photos actuellement

### Formats et prix photos (source : `lib/pricing-config.ts`)

Chaque photo standard (1-15) dispose de 30 exemplaires numerotes au total :

| Format | Dimensions | Prix | Exemplaires | Numerotation |
|--------|-----------|------|-------------|--------------|
| 24x36 | 24 x 36 cm | 500 EUR | 9 | 1/30 a 9/30 |
| 40x60 | 40 x 60 cm | 1 000 EUR | 9 | 10/30 a 18/30 |
| 80x120 | 80 x 120 cm | 2 000 EUR | 9 | 19/30 a 27/30 |
| Hors-format | Sur mesure | Sur demande | 3 | 28/30 a 30/30 |

**Total : 30 exemplaires par photo** (9 + 9 + 9 + 3).
Tous les tirages sont signes et numerotes. Certificat d'authenticite fourni.

### Photo 16 (Bettejuice) — exception
- Format **monumental**, 1 seul exemplaire
- Prix sur demande (pas d'achat direct en ligne)
- Traitement special dans la boutique et le checkout

### Photo 7 — placeholder
- Nom actuel dans les donnees : "A remplacer"
- Image placeholder, a remplacer par une vraie photo

### Regles editions
- Une fois tous les exemplaires vendus, la serie est close definitivement
- Afficher le compteur de restants dans la boutique
- La numerotation est continue sur les 30 exemplaires (pas par format)

---

## 8. COMMANDES UTILES

### Developpement local
```bash
# Installation des dependances (Bun obligatoire)
bun install

# Lancer le serveur de dev (Turbopack, accessible reseau)
bun run dev
# → http://localhost:3000/fr/  (francais)
# → http://localhost:3000/en/  (anglais)
# → http://localhost:3000/it/  (italien)

# Build production
bun run build

# Si probleme Node version pour le build local :
/opt/homebrew/Cellar/node/24.10.0_1/bin/node ./node_modules/.bin/next build

# Lancer en mode production
bun run start

# Lint + typecheck
bun run lint
# (equivalent a : bunx tsc --noEmit && next lint)

# Format code
bun run format

# Tests
bun test
```

### Git / Deploy
```bash
# Deployer (automatique via GitHub Actions)
git push origin main

# Voir les runs CI/CD
gh run list
gh run view <run_id>
```

### VPS OVH
```bash
# Connexion SSH
ssh -i ~/.ssh/gf_deploy_new ubuntu@57.131.23.96

# Sur le VPS
cd /var/www/guillaumefarre
pm2 logs guillaumefarre       # Logs temps reel
pm2 restart guillaumefarre    # Redemarrer
pm2 status                    # Etat process
cat .env.local                # Variables d'environnement
```

### Scripts utilitaires
```bash
# Migration metadata photos
bun run migrate-metadata

# Traduction (DeepL)
bun run translate:deepl
```

---

## 9. VARIABLES D'ENVIRONNEMENT

Fichier `.env.local` (jamais commite, cree par le deploy ou manuellement) :

```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_SITE_URL=https://guillaumefarre.com
ADMIN_PASSWORD=LHOOQladino246
ANTHROPIC_API_KEY=sk-ant-...
SITE_PASSWORD=...
SITE_MODE=pre-launch
```

---

## 10. NOTES IMPORTANTES

### Source de verite des donnees
- `data/photo-metadata.json` : le fichier sur le **SERVEUR** est la source de verite. Guillaume modifie les metadata via l'admin en production. Ne JAMAIS ecraser depuis le local.
- Le deploy sauvegarde automatiquement ce fichier avant de pull le code.

### Composants a ne pas modifier
- `AmericanFrame.tsx` : composant sacre, calibre visuellement. Ne pas toucher.
- Routes VIP : ne pas toucher (`/vip`, `data/vip-codes.json`, `lib/vip-codes.ts`)

### i18n
- Francais = source de verite (`messages/fr.json`)
- Anglais et italien sont des traductions
- Toutes les URLs sont prefixees par la locale (`/fr/galerie`, `/en/galerie`, `/it/galerie`)
- La locale par defaut est `fr`

### Securite
- Headers de securite dans `next.config.mjs` (X-Frame-Options, X-Content-Type-Options, etc.)
- Protection CSRF sur les APIs admin (verification Origin)
- Rate limiting sur certaines routes API
- Pas de secrets dans le code source (tout en `.env.local`)
