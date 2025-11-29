# SPÉCIFICATIONS MÉTIER - Guillaume Farré

**Dernière mise à jour** : 2025-11-29 (corrigé 7 exemplaires)
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

### 2. PHOTOGRAPHIES - Séries limitées numérotées (1/7)

**Description** :
- Photos documentant l'instant où Ferrari peint sur toile
- Éditions limitées à **7 exemplaires** (1/7, 2/7... 7/7)
- Signées par Guillaume Farré
- Certificat d'authenticité fourni
- Numérotées à la main

**Formats disponibles** :
- ✅ A3 (29.7 x 42 cm) : **500 €**
- ✅ A2 (42 x 59.4 cm) : **800 €**
- ✅ A1 (59.4 x 84.1 cm) : **1200 €**
- ✅ XXL (80 x 120 cm) : **Sur devis**
- ✅ Monumental (120+ cm) : **Sur devis**
- ❌ **PAS de A4** (trop petit/cheap pour édition limitée)

**Finitions** :
- Papier Fine Art Giclee (12 couleurs, 200 gsm archival)
- Impression haute qualité museum-grade
- Options encadrement : noir, blanc, sans cadre
- Montages premium si disponibles : Alu-Dibond, Acrylique

**Règles éditions limitées** :
- Une fois 7/7 vendus, série close DÉFINITIVEMENT
- Afficher compteur "X/7 restants" sur boutique
- Certificat authenticité inclus avec numéro d'exemplaire
- Possibilité de clore manuellement une série avant 7/7

**Metadata** :
```typescript
{
  categories: ['limited'],
  limitedEdition: {
    total: 7,
    sold: 3, // Exemple
    available: 4, // 7 - sold
    closed: false
  },
  prices: {
    limited: {
      a3: 500,
      a2: 800,
      a1: 1200
    }
  }
}
```

---

### 3. PHOTOGRAPHIES - Tirages illimités

**Description** :
- Mêmes photos que séries limitées
- Éditions NON numérotées
- Quantité infinie disponible
- NON signées (ou signature imprimée)
- PAS de certificat authenticité

**Formats disponibles** :
- ✅ A4 (21 x 29.7 cm) : **150 €**
- ✅ A3 (29.7 x 42 cm) : **250 €**
- ✅ A2 (42 x 59.4 cm) : **400 €**

**Finitions** :
- Papier photo standard (qualité correcte mais pas archival)
- Impression 4 couleurs CMYK (vs 12 couleurs Giclee)
- Options encadrement : noir, blanc, sans cadre

**Différence avec séries limitées** :
- Prix réduits (~50% moins cher que séries limitées)
- Pas de limitation quantité
- Qualité impression légèrement inférieure
- Papier standard vs archival
- Pas de signature
- Pas de numérotation
- Pas de certificat

**Metadata** :
```typescript
{
  categories: ['unlimited'],
  prices: {
    unlimited: {
      a4: 150,
      a3: 250,
      a2: 400
    }
  }
}
```

---

## MULTI-CATÉGORISATION

**IMPORTANT** : Une photo peut être dans PLUSIEURS catégories simultanément.

**Catégories disponibles** :
- `unlimited` : Tirage illimité (A4/A3/A2)
- `limited` : Série limitée 1-7 (A3/A2/A1)
- `xxl` : Format XXL 80x120cm (sur devis)
- `monumental` : Format monumental 120cm+ (sur devis)

**Exemple réel** :
```typescript
{
  filename: "ferrari-noir-atelier-23.jpg",
  categories: ["unlimited", "limited", "xxl"],
  // Signifie :
  // - Disponible en tirage illimité (A4/A3/A2) à 150/250/400€
  // - ET en série limitée 1-7 (A3/A2/A1) à 500/800/1200€
  // - ET en format XXL (sur devis)
}
```

**Interface boutique** :
1. Client sélectionne une photo
2. Choix catégorie :
   - "Édition limitée (1-7)" → formats A3/A2/A1 uniquement
   - "Tirage illimité" → formats A4/A3/A2 uniquement
   - "Format XXL/Monumental" → formulaire devis
3. Choix format selon catégorie
4. Choix encadrement
5. Ajout au panier

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

  // Éditions limitées (si categories contient 'limited')
  limitedEdition?: {
    total: 7; // Toujours 7 pour Guillaume
    sold: number; // Combien vendus (0-7)
    available: number; // Restants (7 - sold)
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

## RÈGLES MÉTIER CRITIQUES

### Éditions limitées
- ✅ Toujours 7 exemplaires
- ✅ Numérotation 1/7, 2/7... 7/7
- ✅ Une fois 7/7 vendus → série close automatiquement
- ✅ Guillaume peut clore manuellement avant 7/7
- ✅ Série close = pas de réouverture possible
- ✅ Chaque vente → décrément compteur automatique via webhook Stripe

### Formats exclusifs
- ❌ A4 interdit pour séries limitées (trop cheap)
- ❌ A1 interdit pour tirages illimités (réservé aux séries limitées)
- ✅ Validation côté serveur pour éviter bypass

### Prix fixes
- Prix définis dans `prices` metadata
- Pas de promotions / soldes
- Prix identiques pour toutes photos d'une même catégorie
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

**Édition limitée** : Photo numérotée 1/7 à 7/7, série close après vente complète

**Tirage illimité** : Photo non numérotée, quantité infinie, prix réduit

**Giclee** : Procédé d'impression fine art 12 couleurs, qualité musée

**Archival** : Papier certifié sans acide, durée vie 100+ ans

**Sur devis** : Prix non affiché, contact direct requis

**Métadata** : Données structurées décrivant chaque photo (titre, catégories, prix, etc.)

**Statut** : État d'une photo (active, trash, to-sort)

**Webhook** : Notification automatique serveur → serveur lors d'un événement

---

**Maintenu par** : Lalou
**Dernière mise à jour** : 2025-11-19 00:12

