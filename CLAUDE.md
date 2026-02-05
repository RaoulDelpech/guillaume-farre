# Guillaume Farré - Site Artiste & Boutique Fine Art

Dernière mise à jour: 2025-12-07
Maintenu par: Lalou

---

## RÈGLE #5 OBLIGATOIRE : QUESTIONS AVEC OPTIONS ET RECOMMANDATION

**JAMAIS de question sans options et recommandation étayée.**

```
[Question claire] ?

Options:
A) [Option 1] - [description]
B) [Option 2] - [description]
C) [Option 3] - [description]
(D) Autre - préciser

Ma recommandation: Option X
Pourquoi: [argument factuel étayé]
```

**UNE SEULE QUESTION À LA FOIS.**

---

## NOUVEAUTÉS SESSION 2025-12-07

### 1. Système d'authentification simplifié
- Plus de HTTP Basic Auth nginx
- Page de login custom `/fr/login` avec juste mot de passe
- **Mot de passe** : `LHOOQladino246`
- Cookie `gf_auth` valide 30 jours

### 2. Page /dino-histoire
- Histoire complète de la Ferrari Dino
- Images Wikipedia Commons (pas Unsplash, pas galerie Guillaume)
- Lien depuis /dino

### 3. Mode admin édition inline
- Accès : ajouter `?admin=true` à n'importe quelle URL
- Barre flottante "Mode Édition" en bas
- Cliquer sur texte pour modifier
- Sauvegarder enregistre dans messages/fr.json
- Architecture prête pour migration DB future
- **Page convertie** : /histoire (les autres à faire)

---

## IMPORTANT : LIRE D'ABORD ~/CLAUDE.md

Ce fichier contient les règles spécifiques au projet Guillaume Farré.
Les 5 Règles Absolues et instructions générales sont dans `~/CLAUDE.md`.

**EXCEPTION** : Ce projet a sa propre charte graphique (pas Juris-Power).

---

## RÈGLES ABSOLUES DE COMMUNICATION

### RÈGLE #1 : Validation Point par Point

**Quand poser une question à Guillaume** :
- ✅ TOUJOURS proposer 3-4 options concrètes
- ✅ TOUJOURS étayer chaque option (avantages/inconvénients)
- ✅ TOUJOURS donner UNE recommandation claire
- ✅ TOUJOURS attendre validation avant de passer à la question suivante
- ❌ JAMAIS poser plusieurs questions d'un coup
- ❌ JAMAIS proposer d'options sans justification

**Format requis** :
```
QUESTION X : [Titre question]

CONTEXTE : [Pourquoi cette question]

OPTION 1 : [Description]
✅ Avantages : ...
❌ Inconvénients : ...

OPTION 2 : [Description]
✅ Avantages : ...
❌ Inconvénients : ...

OPTION 3 : [Description]
✅ Avantages : ...
❌ Inconvénients : ...

💡 RECOMMANDATION : Option X parce que [raison claire]

Votre choix : _______
```

---

## RÈGLES MÉTIER ABSOLUES

### Ce que Guillaume Farré vend

#### 1. TABLEAUX (toiles peintes) ❌ PAS EN LIGNE

**Description** :
- Créés par passage direct Ferrari sur toile vierge
- Peinture industrielle déposée par friction, chaleur, pression
- Pièces uniques, totalement irréplicables
- Formats variables selon toile

**Où les acheter** :
- ✅ À l'atelier uniquement
- ✅ Lors d'expositions uniquement
- ❌ PAS vendus sur boutique en ligne

**Prix** : Sur devis (selon format, technique, toile)

---

#### 2. PHOTOGRAPHIES - Séries limitées numérotées (MISE À JOUR 2025-11-29)

**Description** :
- Photos documentant l'instant où Ferrari peint sur toile
- **TOUS les tirages sont numérotés et signés**
- Certificat d'authenticité fourni

**RÈGLE EXEMPLAIRES (CONFIRMÉE 2025-11-29)** :
- **Grands formats (2A0, A0, A1)** : **9 exemplaires** par format (1/9 à 9/9)
- **Petits formats (A2, A3, A4)** : **99 exemplaires** par format (1/99 à 99/99)

**Formats et prix** :
- ✅ 2A0 (118.9 x 168.2 cm) : Sur devis - 9 ex.
- ✅ A0 (84.1 x 118.9 cm) : Sur devis - 9 ex.
- ✅ A1 (59.4 x 84.1 cm) : €1200 - 9 ex.
- ✅ A2 (42 x 59.4 cm) : €800 - 99 ex.
- ✅ A3 (29.7 x 42 cm) : €500 - 99 ex.
- ✅ A4 (21 x 29.7 cm) : €250 - 99 ex.
- ✅ XXL (80 x 120 cm) : Sur devis
- ✅ Monumental (120+ cm) : Sur devis

**Finitions** :
- Papier Fine Art Giclee (12 couleurs, 200 gsm archival)
- Options encadrement : noir, blanc, sans cadre
- Montages premium si disponibles : Alu-Dibond, Acrylique

**Règles éditions** :
- Une fois tous vendus → série close définitivement
- Afficher compteur "X/9 restants" ou "X/99 restants" selon format
- Certificat authenticité inclus

---

#### ~~3. PHOTOGRAPHIES - Tirages illimités~~ SUPPRIMÉ

**⚠️ PLUS DE TIRAGES ILLIMITÉS (décision 2025-11-29)**
- Tous les tirages sont désormais numérotés et signés
- Petits formats (A4, A3, A2) : 99 exemplaires au lieu d'illimité

---

### Catégorisation photos (metadata) - MISE À JOUR 2025-11-29

**Plus de catégorie "unlimited"** - Tous les tirages sont "limited" avec compteurs différents selon format.

**Catégories** :
- `limited` : Tous les tirages numérotés (9 ex. grands formats / 99 ex. petits formats)
- `xxl` : Format XXL 80x120cm (sur devis)
- `monumental` : Format monumental 120cm+ (sur devis)

**Exemple** :
```typescript
{
  filename: "ferrari-noir-atelier-23.jpg",
  categories: ["limited"],
  limitedEditionGrand: { total: 9, sold: 0, available: 9, closed: false },
  limitedEditionPetit: { total: 99, sold: 0, available: 99, closed: false }
}
```

**Interface boutique** :
- Grands formats (A1, A0, 2A0) : "Édition X/9"
- Petits formats (A4, A3, A2) : "Édition X/99"

---

## INTERFACE ADMIN

### Upload photos

**Problème actuel** :
- Photos uploadées mais affichées comme rectangles gris
- Pas de refresh UI automatique après upload

**Cause** :
- Upload fonctionne (fichiers sauvés dans `/public/images/works/a-trier/`)
- Mais UI ne recharge pas liste photos

**Correction requise** :
- Forcer refresh UI après upload
- Afficher miniatures immédiatement
- Fichier concerné : `app/[locale]/admin/page.tsx:47-58`

---

### Catégorisation photos

**Interface requise** :

Pour chaque photo, Guillaume doit pouvoir cocher :
- ☐ Tirage illimité (A4/A3/A2)
- ☐ Série limitée (1-7, A3/A2/A1)
- ☐ Format XXL (80x120cm)
- ☐ Format monumental (120cm+)

**Plusieurs cases peuvent être cochées simultanément.**

Si série limitée :
- Compteur "X/7 vendus" (màj auto après vente Stripe)
- Bouton "Marquer série close" (désactive vente)

---

### Description IA

**Fonctionnalité requise** :

Chaque photo doit avoir :
- Description auto-générée par IA (Anthropic Claude Vision)
- Bouton "Générer description IA" dans admin
- Zone texte éditable pour modifier description IA
- Flag `aiGenerated: true/false` dans metadata

**Prompts IA** (selon catégorie) :

Série limitée :
```
Décris cette photographie d'art capturant l'instant où une Ferrari
peint une toile. Texte poétique, technique, 2-3 phrases.
Mentionne couleurs, mouvement, abstraction.
```

Tirage illimité :
```
Décris brièvement cette photo documentaire montrant Ferrari peignant.
1-2 phrases claires, accessibles.
```

---

### Statuts photos

**3 statuts possibles** :

- `active` : Photo visible, en vente
- `trash` : Photo archivée (soft delete, récupérable)
- `to-sort` : Photo à trier plus tard (cachée liste globale)

**Interface** :
- Dropdown statut pour chaque photo
- Filtre "Afficher corbeille" (photos trash)
- Filtre "Afficher à trier" (photos to-sort)
- Photos `active` + répertoriées = cachées liste globale (déjà triées)

---

### Bouton Instagram

**Actuel** : Gros bouton "Générer post Instagram"
**Requis** : Logo Instagram cliquable (taille icône standard)

---

### Analyse commerciale

**Actuel** : Toujours visible
**Requis** : Panel dépliable (collapsed par défaut)

Icône `▶` (collapsed) / `▼` (expanded)
Titre cliquable : "Analyse commerciale"

---

## CAROUSEL HOMEPAGE

**Problèmes actuels** :
1. Trop gros : 80vh (écrase reste page)
2. Trop rapide : défile toutes les 5s (agressif)
3. Photo rouge Ferrari : trop agressive visuellement

**Corrections requises** :

1. **Réduire height** :
   - De `80vh` → `60vh`
   - Fichier : `app/[locale]/page.tsx` (chercher `h-[80vh]`)

2. **Ralentir autoplay** :
   - De `5000` ms → `9000` ms
   - Même fichier (chercher `Autoplay({ delay: 5000 })`)

3. **Remplacer photo rouge** :
   - Trouver alternative neutre/grise (pas sepia non plus)
   - Proposer 3 options à Guillaume pour validation
   - Image concernée : photo voitures rouges dans carousel

---

## TRADUCTIONS (EN/IT)

**Problème actuel** :
- Traductions incomplètes (pas 100% du texte)
- Qualité médiocre (faites à la main)

**Solution requise** :
- Intégrer **DeepL API** (traduction professionnelle)
- Traduire 100% des messages/fr.json → en.json + it.json
- Conserver nuances artistiques

**Fichiers** :
- `messages/fr.json` (source vérité)
- `messages/en.json` (à regénérer avec DeepL)
- `messages/it.json` (à regénérer avec DeepL)

**Script à créer** :
```bash
bun run translate
```

Ce script devra :
1. Lire `messages/fr.json`
2. Pour chaque clé, appeler DeepL API (FR → EN, FR → IT)
3. Écrire résultats dans `en.json` et `it.json`
4. Préserver structure JSON exacte

---

## TEXTES RÉPÉTITIFS (À CORRIGER)

**Problème identifié** :
- "pinceau/peint" répété 8 fois dans messages/fr.json
- "unique/trace/irréversible" répété 11 fois
- Style IA évident à la lecture

**Correction requise** :
- Réécrire tous les textes FR pour éliminer répétitions
- Varier vocabulaire (consulter `ANALYSE_REPETITIONS_TEXTES.md`)
- Style humain, indétectable comme IA

**Après réécriture FR** :
- Regénérer traductions EN/IT avec DeepL

---

## SERVICE IMPRESSION : GELATO

**Décision validée** : Gelato comme fournisseur impression API

**Pourquoi Gelato** :
- ✅ Production locale FRANCE (shipping mini)
- ✅ Fine Art Giclee 12 couleurs (qualité musée)
- ✅ Papier archival 200 gsm FSC-certified
- ✅ API REST complète + webhooks
- ✅ Gratuit (payé uniquement produits vendus)
- ✅ Marges estimées 88-93%

**Prochaines étapes** :
1. Créer compte Gelato : https://www.gelato.com/
2. Vérifier pricing exact France (A2/A3/A4)
3. Générer API key
4. Implémenter client Gelato API (`/lib/gelato-client.ts`)
5. Webhook Stripe → Gelato (création commande auto)
6. Webhook Gelato → Notre API (tracking expédition)

**Documentation complète** : `GELATO_VALIDATION_GUIDE.md`

---

## SCHEMA METADATA (À REFONDRE)

**Actuel** (lib/admin/photo-manager.ts) :
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

**Nouveau schema requis** :
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
    total: 7;              // Toujours 7 pour Guillaume
    sold: number;          // Combien vendus (0-7)
    available: number;     // Restants (7 - sold)
    closed: boolean;       // Série close manuellement
  };

  // Prix (selon catégorie)
  prices?: {
    // Si 'unlimited' dans categories
    unlimited?: {
      a4: 150;
      a3: 250;
      a2: 400;
    };
    // Si 'limited' dans categories
    limited?: {
      a3: 500;
      a2: 800;
      a1: 1200;
    };
    // Si 'xxl' dans categories
    xxl?: number; // Sur devis
    // Si 'monumental' dans categories
    monumental?: number; // Sur devis
  };
}
```

**Migration** :
- Créer script `scripts/migrate-metadata.ts`
- Lire ancien schema
- Convertir vers nouveau
- Sauvegarder backup avant migration

---

## STACK TECHNIQUE

**Framework** : Next.js 15.3.2
**Runtime** : Bun
**Langage** : TypeScript 5.8.3
**Styling** : Tailwind CSS + shadcn/ui (thème zinc)
**i18n** : next-intl (FR/EN/IT)
**Paiements** : Stripe LIVE mode
**Impression** : Gelato API
**IA** : Anthropic Claude (descriptions photos, analyse séries)
**Traduction** : DeepL API

---

## COMMANDES UTILES

```bash
# Développement
bun run dev
# → http://localhost:3000/ (FR)
# → http://localhost:3000/en/ (EN)
# → http://localhost:3000/it/ (IT)

# Build production
bun run build
bun run start

# Lint + TypeScript
bun run lint

# Tests (quand setup)
bun test

# Traductions DeepL (à créer)
bun run translate

# Migration metadata (à créer)
bun run migrate-metadata
```

---

## PRIORITÉS CORRECTIONS

### 🔴 CRITIQUE (Aujourd'hui - 3h)

1. **Corriger bug upload photos** (30 min)
   - Fichier : `app/[locale]/admin/page.tsx`
   - Forcer refresh UI après upload
   - Afficher miniatures immédiatement

2. **Refondre schema metadata** (1h)
   - Fichier : `lib/admin/photo-manager.ts`
   - Nouveau schema avec `categories[]`, `description`, `status`
   - Script migration

3. **Adapter formats selon catégorie** (1h)
   - Interface boutique : pas A4 si édition limitée
   - Validation côté serveur aussi

4. **Mettre à jour ce CLAUDE.md** (30 min)
   - ✅ FAIT

---

### 🟠 HAUTE (Demain - 3h)

5. **Traductions professionnelles DeepL** (2h)
   - Créer script `bun run translate`
   - Traduire 100% FR → EN + IT

6. **Réduire carousel** (15 min)
   - `80vh` → `60vh`

7. **Ralentir carousel** (15 min)
   - `5000ms` → `9000ms`

8. **Changer photo voitures rouges** (30 min)
   - Proposer 3 alternatives
   - Validation Guillaume

---

### 🟡 MOYENNE (Après-demain - 5h)

9. **Descriptions IA photos** (2h)
   - Intégrer Anthropic Claude Vision API
   - Bouton "Générer description" admin
   - Zone texte éditable

10. **Interface admin améliorations** (3h)
    - Statuts photos (active/trash/to-sort)
    - Filtres corbeille + à trier
    - Catégories multiples (checkboxes)
    - Analyse commerciale dépliable

11. **Bouton Instagram logo** (15 min)
    - Remplacer gros bouton par icône

---

## TIMELINE TOTALE

**Jour 1 (7 nov)** : Phase 1 critique (3h) → Upload + Schema
**Jour 2 (8 nov)** : Phase 2 haute (3h) → Traductions + Carousel
**Jour 3 (9 nov)** : Phase 3 moyenne (5h) → IA + Admin avancé

**Total** : 11h réparties sur 3 jours

---

## VALIDATIONS TEXTES (Q&A)

### ✅ Validé

- **Q1** : Les 4 Ferrari appartiennent à Guillaume → OUI ✅
- **Q2** : 4 Ferrari (1 noire, 2 grises, 1 rouge) → OUI ✅
- **Q3** : Peinture directe sur toile (pas pinceau) → OUI ✅
- **Q4** : Sièges d'époque présents dans atelier → OUI ✅

### ⏳ En attente validation finale

- **Q5** : Textes homepage/galerie/histoire
- **Q6** : Mentions "performances" (terme rejeté par Guillaume)
- **Q7** : Descriptions détaillées séries
- **Q8** : Textes boutique

**Note** : Quand Q5-Q8 validés → regénérer traductions EN/IT avec DeepL

---

## RÈGLES ABSOLUES

**Ce projet suit les 31 règles définies dans `~/.claude-global-rules.md`**

**SAUF Règle #18** (charte front Juris-Power) - Guillaume Farré a sa propre charte graphique.

**Règles qui s'appliquent** :
- Signature code : "Lalou"
- Style code 100% humain (indétectable IA)
- Tests auto avant commit
- Accessibilité obligatoire
- Sécurité (pas clés API en dur)
- Performance optimale
- Documentation JSDoc
- Logging approprié

**RÈGLE CRITIQUE #32 : Photo Metadata = Serveur fait foi**

```
❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISÉ : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier data/photo-metadata.json du SERVEUR est la SOURCE DE VÉRITÉ.
Guillaume travaille dans l'admin en production.
Ne JAMAIS écraser ce fichier depuis le local.

Exception : Migrations de schema (avec backup automatique avant).
```

**Incident 2025-11-19** : J'ai copié le metadata local vers production, écrasant les modifications récentes de Guillaume (photos supprimées + photos validées). Récupération partielle via logs PM2. Ne JAMAIS reproduire cette erreur.

---

## DÉPLOIEMENT

**Hébergement** : VPS IONOS
**Domaine** : guillaumefarre.com
**Déploiement** : GitHub Actions automatique

**Workflow** :
1. Push sur `main`
2. GitHub Actions build
3. Transfert SSH vers VPS
4. Restart avec PM2

**Variables d'environnement (.env.local)** :
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Gelato (à ajouter)
GELATO_API_KEY=...
GELATO_WEBHOOK_SECRET=...

# Anthropic (à ajouter)
ANTHROPIC_API_KEY=...

# DeepL (à ajouter)
DEEPL_API_KEY=...
```

---

## FICHIERS REPRISE SESSION

**Pour reprendre travail après bascule compte** :

1. Lire `ETAT_SESSION_2025-11-07_FINAL.md` (état complet)
2. Lire `CORRECTIONS_URGENTES_2025-11-07.md` (liste fixes)
3. Lire `GELATO_VALIDATION_GUIDE.md` (setup impression)
4. Lire ce `CLAUDE.md` (règles métier)

**Vérifier sauvegarde** :
```bash
git log -1 --stat
ls -lh ETAT*.md CORRECTIONS*.md GELATO*.md
```

**Reprendre par Phase 1 (corrections critiques)**

---

## CONTACT

**Client** : Guillaume Farré (artiste sculpteur, collectionneur Ferrari)
**Dev** : Lalou
**Projet** : Site artiste + boutique Fine Art en ligne
**Statut** : Développement actif, haute priorité

---

Maintenu par: Lalou
Dernière mise à jour: 2025-12-07

---

## FICHIERS MODE ADMIN (NOUVEAUX 2025-12-07)

```
contexts/AdminModeContext.tsx      # État global mode admin
components/admin/EditableText.tsx  # Composant texte éditable
components/admin/AdminToolbar.tsx  # Barre flottante sauvegarde
components/admin/AdminWrapper.tsx  # Provider wrapper
components/pages/HistoireContent.tsx # Page histoire éditable
lib/content-manager.ts             # Service stockage (JSON → DB)
app/api/admin/content/route.ts     # API sauvegarde textes
app/[locale]/login/page.tsx        # Page login
app/api/auth/login/route.ts        # API login
```

### Pour convertir une page en éditable
1. Créer `components/pages/[NomPage]Content.tsx`
2. Remplacer textes par `<EditableText textKey="..." as="p">Texte</EditableText>`
3. Importer dans la page
