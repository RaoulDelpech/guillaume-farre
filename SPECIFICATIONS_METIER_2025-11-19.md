# SPÉCIFICATIONS MÉTIER - Guillaume Farré

**Dernière mise à jour** : 2025-11-29 (CORRIGÉ : 9 exemplaires grands formats, 99 petits formats)
**Maintenu par** : Lalou

---

## CE QUE GUILLAUME FARRÉ VEND

### 1. TABLEAUX (toiles peintes) - ❌ PAS EN LIGNE

**Description** :
- Créés par passage direct Ferrari sur toile vierge
- Peinture industrielle déposée par friction, chaleur, pression
- Pièces uniques, totalement irréplicables
- Formats variables selon toile

**Caractéristiques** :
- ✅ Pièce unique (1/1)
- ✅ Signée par Guillaume Farré
- ✅ Certificat d'authenticité fourni
- ✅ Créé en direct lors de performances

**Où les acheter** :
- ✅ À l'atelier uniquement
- ✅ Lors d'expositions uniquement
- ❌ PAS vendus sur boutique en ligne

**Prix** : Sur devis (selon format, technique, toile)

**Raison exclusion boutique** : Valeur très élevée + nécessite rencontre physique

---

### 2. PHOTOGRAPHIES - Séries limitées numérotées

**Description** :
- Photos documentant l'instant où Ferrari peint sur toile
- Signées par Guillaume Farré
- Certificat d'authenticité fourni
- Numérotées à la main

**RÈGLE EXEMPLAIRES (CONFIRMÉE 2025-11-29)** :
- **Grands formats (2A0, A0, A1)** : **9 exemplaires** par format (1/9, 2/9... 9/9)
- **Petits formats (A2, A3, A4)** : **99 exemplaires** par format (1/99, 2/99... 99/99)

**Grands formats (9 exemplaires par format)** :
- ✅ 2A0 (118.9 x 168.2 cm) : **Sur devis**
- ✅ A0 (84.1 x 118.9 cm) : **Sur devis**
- ✅ A1 (59.4 x 84.1 cm) : **1200 €**

**Petits formats (99 exemplaires par format)** :
- ✅ A2 (42 x 59.4 cm) : **800 €**
- ✅ A3 (29.7 x 42 cm) : **500 €**
- ✅ A4 (21 x 29.7 cm) : **250 €**

**Finitions** :
- Papier Fine Art Giclee (12 couleurs, 200 gsm archival)
- Impression haute qualité museum-grade
- Options encadrement : noir, blanc, sans cadre
- Montages premium si disponibles : Alu-Dibond, Acrylique

**Règles éditions limitées** :
- Grands formats (2A0, A0, A1) : **9 exemplaires** max par format
- Petits formats (A2, A3, A4) : **99 exemplaires** max par format
- Afficher compteur "X/9 restants" ou "X/99 restants" sur boutique selon format
- Certificat authenticité inclus avec numéro d'exemplaire
- Possibilité de clore manuellement une série

**Metadata** :
```typescript
{
  categories: ['limited'],
  // Pour grands formats (A1, A0, 2A0)
  limitedEditionGrand: {
    total: 9,
    sold: 2, // Exemple
    available: 7, // 9 - sold
    closed: false
  },
  // Pour petits formats (A2, A3, A4)
  limitedEditionPetit: {
    total: 99,
    sold: 5, // Exemple
    available: 94, // 99 - sold
    closed: false
  },
  prices: {
    limited: {
      a4: 250,  // Petit format
      a3: 500,  // Petit format
      a2: 800,  // Petit format
      a1: 1200  // Grand format
    }
  }
}
```

---

## STRUCTURE DES FORMATS (MISE À JOUR 2025-11-29)

**IMPORTANT** : Plus de "tirages illimités". Tous les tirages sont désormais numérotés et signés.

**Catégories de formats** :
- `grands` : Formats 2A0, A0, A1 → **9 exemplaires** par format (1/9 à 9/9)
- `petits` : Formats A2, A3, A4 → **99 exemplaires** par format (1/99 à 99/99)

**Tous les tirages sont numérotés et signés.**

**Exemple réel** :
```typescript
{
  filename: "ferrari-noir-atelier-23.jpg",
  categories: ["limited"],
  // Pour cette photo :
  // - Grands formats (A1, A0, 2A0) : 9 exemplaires chacun
  // - Petits formats (A2, A3, A4) : 99 exemplaires chacun
  limitedEditionGrand: { total: 9, sold: 0, available: 9, closed: false },
  limitedEditionPetit: { total: 99, sold: 0, available: 99, closed: false }
}
```

**Interface boutique** :
1. Client sélectionne une photo
2. Choix format :
   - Grands formats (A1, A0, 2A0) : "Édition limitée X/9"
   - Petits formats (A2, A3, A4) : "Édition limitée X/99"
   - Format XXL/Monumental → formulaire devis
3. Choix encadrement
4. Ajout au panier

---

## STATUTS PHOTOS

**3 statuts possibles** :

### `null` (ou `active`) - Photo active
- Photo visible sur le site
- Disponible à la vente
- Affichée dans galerie et boutique

### `'trash'` - Corbeille
- Photo archivée (soft delete)
- NON visible sur le site
- NON affichée en galerie/boutique
- Récupérable depuis admin
- Fichier physique SUPPRIMÉ du serveur

### `'to-sort'` - À trier
- Photo uploadée mais pas encore triée
- NON visible sur le site
- NON affichée en galerie/boutique
- Visible uniquement dans admin avec filtre "À trier"

**Interface admin** :
- Dropdown statut pour chaque photo
- Filtre "Afficher corbeille" (photos `trash`)
- Filtre "Afficher à trier" (photos `to-sort`)
- Par défaut : afficher seulement photos actives (`status: null`)

**Workflow Guillaume** :
1. Upload photos → `status: 'to-sort'`
2. Guillaume trie dans admin :
   - Valider photo → `status: null` + `visible: true`
   - Supprimer photo → `status: 'trash'` + fichier physique supprimé
3. Photos actives apparaissent en galerie/boutique

---

## SCHEMA METADATA (ACTUEL)

```typescript
export interface PhotoMetadata {
  // Identifiants
  filename: string;
  path: string;

  // Informations générales
  title?: string;
  year?: number;
  seriesName?: string;

  // Multi-categorisation
  locations?: string[]; // Ex: ["Paris", "Atelier", "Circuit Paul Ricard"]
  tags?: string[]; // Ex: ["rouge", "Ferrari F40", "noir et blanc"]

  // Catégories multiples (une photo peut être dans plusieurs)
  categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];

  // Description IA
  description?: string;
  aiGenerated?: boolean;

  // Matériau et orientation
  material?: 'semi-glossy' | 'aluminum';
  orientation?: 'vertical' | 'horizontal' | 'auto';
  aiDetectedOrientation?: 'vertical' | 'horizontal';

  // Statuts
  status: 'trash' | 'to-sort' | null;

  // Visibilité et vente
  visible: boolean;
  forSale: boolean;

  // Ancien champ category gardé pour compatibilité
  category?: string;

  // Éditions limitées GRANDS formats (A1, A0, 2A0)
  limitedEditionGrand?: {
    total: 9; // 9 exemplaires pour grands formats
    sold: number; // Combien vendus (0-9)
    available: number; // Restants (9 - sold)
    closed: boolean; // Série close manuellement
  };

  // Éditions limitées PETITS formats (A2, A3, A4)
  limitedEditionPetit?: {
    total: 99; // 99 exemplaires pour petits formats
    sold: number; // Combien vendus (0-99)
    available: number; // Restants (99 - sold)
    closed: boolean; // Série close manuellement
  };

  // Prix selon catégorie
  prices?: {
    unlimited?: { a4: 150; a3: 250; a2: 400 };
    limited?: { a3: 500; a2: 800; a1: 1200 };
    xxl?: number; // Sur devis
    monumental?: number; // Sur devis
  };

  // Anciens champs (compatibilité, à migrer)
  isNumberedSeries?: boolean;
  price?: number;
  edition?: {
    type: 'limited' | 'open';
    count?: number;
  };
}
```

---

## FORMATS IMPRESSION

### Formats standards

| Format | Dimensions | Tirage illimité | Série limitée |
|--------|-----------|-----------------|---------------|
| A4 | 21 x 29.7 cm | ✅ 150€ | ❌ Non disponible |
| A3 | 29.7 x 42 cm | ✅ 250€ | ✅ 500€ |
| A2 | 42 x 59.4 cm | ✅ 400€ | ✅ 800€ |
| A1 | 59.4 x 84.1 cm | ❌ Non disponible | ✅ 1200€ |
| XXL | 80 x 120 cm | Sur devis | Sur devis |
| Monumental | 120+ cm | Sur devis | Sur devis |

### Règles format selon catégorie

**Tirage illimité** :
- Formats petits/moyens uniquement (A4, A3, A2)
- Prix accessibles
- Pas de très grands formats

**Série limitée** :
- Pas de A4 (trop petit pour édition numérotée)
- Formats moyens/grands (A3, A2, A1)
- Prix premium

**XXL / Monumental** :
- Sur devis uniquement
- Contact direct avec Guillaume
- Production spéciale

---

## MATÉRIAUX ET FINITIONS

### Papier Fine Art Giclee (séries limitées)
- 12 couleurs (vs 4 CMYK standard)
- 200 gsm
- Archival (certification 100+ ans)
- FSC-certified (papier éco-responsable)
- Texture légèrement texturée
- Rendu musée

### Papier photo standard (tirages illimités)
- 4 couleurs CMYK
- ~180 gsm
- Non archival (durée vie ~20-30 ans)
- Surface semi-brillante
- Qualité correcte mais pas premium

### Options encadrement
- **Noir** : Cadre bois laqué noir mat
- **Blanc** : Cadre bois laqué blanc mat
- **Sans cadre** : Livré roulé dans tube carton

### Montages premium (si disponibles)
- **Alu-Dibond** : Montage sur aluminium brossé
- **Acrylique** : Montage sous plexiglass

---

## FLUX COMMANDE CLIENT

### 1. Navigation galerie
- Client parcourt galerie photos
- Peut filtrer par série (Atelier, Empreintes, Projection)
- Clic sur photo → Lightbox avec détails

### 2. Sélection photo
- Bouton "Voir dans la boutique"
- Redirige vers `/boutique`
- Photo présélectionnée

### 3. Choix catégorie
Si photo disponible en plusieurs catégories :
- Radio buttons : "Tirage illimité" / "Série limitée 1-7"
- Affichage compteur si série limitée : "X/7 restants"
- Explication différences (prix, qualité, signature)

### 4. Choix format
Formats disponibles selon catégorie choisie :
- Tirage illimité → A4/A3/A2
- Série limitée → A3/A2/A1

### 5. Choix finitions
- Sélection encadrement : Noir / Blanc / Sans cadre
- Calcul prix final

### 6. Ajout au panier
- Résumé : Photo + Catégorie + Format + Encadrement + Prix
- Bouton "Ajouter au panier"
- Notification succès

### 7. Panier et paiement
- Vue panier avec récap
- Modification quantités possibles (sauf séries limitées → max 1)
- Bouton "Commander" → Stripe Checkout
- Paiement sécurisé

### 8. Confirmation et production
- Email confirmation avec récap commande
- Si série limitée : attribution numéro d'exemplaire (ex: 3/7)
- Webhook Stripe → Gelato API (création commande impression)
- Décrément compteur série limitée
- Email tracking expédition

---

## RÈGLES MÉTIER CRITIQUES (MISE À JOUR 2025-11-29)

### Éditions limitées
- ✅ **Grands formats (A1, A0, 2A0)** : 9 exemplaires (1/9 à 9/9)
- ✅ **Petits formats (A2, A3, A4)** : 99 exemplaires (1/99 à 99/99)
- ✅ Une fois tous vendus → série close automatiquement
- ✅ Guillaume peut clore manuellement avant épuisement
- ✅ Série close = pas de réouverture possible
- ✅ Chaque vente → décrément compteur automatique via webhook Stripe

### Plus de tirages illimités
- ❌ **"Unlimited" supprimé** - Tous les tirages sont numérotés
- ✅ Tous les tirages sont signés et certifiés
- ✅ Validation côté serveur pour éviter bypass

### Prix fixes
- Prix définis dans `prices` metadata
- Pas de promotions / soldes
- Prix identiques pour toutes photos d'un même format
- Exceptions : XXL et Monumental (sur devis)

### Statuts
- ❌ Photo `status: 'trash'` ne doit JAMAIS apparaître en frontend
- ❌ Photo `status: 'to-sort'` ne doit JAMAIS apparaître en frontend
- ✅ Seulement photos `status: null` + `visible: true` + `forSale: true` en boutique

---

## SPÉCIFICATIONS TECHNIQUES

### Gelato API (impression)
- **Production locale** : France uniquement (shipping réduit)
- **Formats supportés** : A4, A3, A2, A1, XXL
- **Papier** : Fine Art Giclee 200 gsm
- **Délai** : 3-5 jours ouvrés
- **Tracking** : Automatique via webhooks

### Stripe (paiement)
- **Mode** : LIVE (production)
- **Paiement 3x** : Affiché mais géré par Stripe
- **Webhooks** :
  - `checkout.session.completed` → Créer commande Gelato + décrémenter stock
  - `payment_intent.succeeded` → Confirmer paiement
  - `payment_intent.failed` → Notifier erreur

### Photos
- **Formats fichiers** : JPG, PNG, WebP
- **Taille max** : 10 Mo par photo
- **Résolution min** : 300 DPI pour impression
- **Stockage** : `/public/images/works/[série]/[filename]`

### Metadata
- **Fichier** : `data/photo-metadata.json`
- **Source de vérité** : SERVEUR (production)
- **Backups** : Automatiques lors sauvegardes admin
- **Format** : JSON avec timestamps

---

## GLOSSAIRE

**Série** : Ensemble de photos thématiques (Atelier, Empreintes, Projection)

**Édition limitée grand format** : Photo numérotée 1/9 à 9/9 (formats A1, A0, 2A0)

**Édition limitée petit format** : Photo numérotée 1/99 à 99/99 (formats A2, A3, A4)

**Giclee** : Procédé d'impression fine art 12 couleurs, qualité musée

**Archival** : Papier certifié sans acide, durée vie 100+ ans

**Sur devis** : Prix non affiché, contact direct requis

**Métadata** : Données structurées décrivant chaque photo (titre, catégories, prix, etc.)

**Statut** : État d'une photo (active, trash, to-sort)

**Webhook** : Notification automatique serveur → serveur lors d'un événement

---

**Maintenu par** : Lalou
**Dernière mise à jour** : 2025-11-29 (9/99 exemplaires confirmés)

