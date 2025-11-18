# Implémentation Support Matériaux et Orientation

Date: 2025-11-18
Auteur: Lalou

## Résumé

Ajout du support complet des matériaux (papier semi-brillant / aluminium brossé) et de l'orientation (vertical/horizontal) au système de photos Guillaume Farré, avec détection automatique de l'orientation par IA Anthropic.

---

## Fichiers Modifiés

### 1. **lib/admin/photo-manager.ts**

**Modifications:**
- Ajout de 3 nouveaux champs à l'interface `PhotoMetadata`:
  - `material?: 'semi-glossy' | 'aluminum'` - Type de matériau d'impression
  - `orientation?: 'vertical' | 'horizontal' | 'auto'` - Orientation (auto = détection IA)
  - `aiDetectedOrientation?: 'vertical' | 'horizontal'` - Suggestion IA

**Impact:**
- Permet de stocker les préférences de matériau et orientation pour chaque photo
- Compatible avec les données existantes (champs optionnels)

---

### 2. **app/api/admin/detect-orientation/route.ts** (NOUVEAU)

**Création:**
- Nouvelle API endpoint pour détecter automatiquement l'orientation d'une photo
- Utilise Anthropic Claude Vision API

**Fonctionnement:**
1. Reçoit le chemin de la photo en POST
2. Lit le fichier image et le convertit en base64
3. Envoie à l'API Anthropic avec le prompt: "Is this image in portrait (vertical) or landscape (horizontal) orientation? Reply with only one word: 'vertical' or 'horizontal'."
4. Retourne l'orientation détectée

**Endpoint:** `POST /api/admin/detect-orientation`

**Payload:**
```json
{
  "photoPath": "/images/works/atelier/photo.jpg"
}
```

**Réponse:**
```json
{
  "success": true,
  "orientation": "vertical",
  "photoPath": "/images/works/atelier/photo.jpg"
}
```

---

### 3. **app/[locale]/admin/page.tsx**

**Modifications:**
- Ajout d'un dropdown "Matériau" pour chaque photo:
  - Papier Semi-Brillant (€13.20)
  - Aluminium Brossé (€16.81)

- Ajout de radio buttons "Orientation":
  - ✅ Automatique (IA détecte) - Par défaut
    - Affiche la suggestion IA en temps réel
    - Déclenche la détection automatiquement si pas encore faite
  - 📐 Vertical (forcer)
  - 📐 Horizontal (forcer)

**Position:** Juste après la section "Tags", avant "Options de vente"

**Détection automatique:**
- Quand l'utilisateur sélectionne "Automatique" et qu'aucune détection IA n'a été faite
- Appel automatique à `/api/admin/detect-orientation`
- Mise à jour de `aiDetectedOrientation` dans les métadonnées
- Affichage immédiat du résultat

---

### 4. **components/shop/ShopGrid.tsx**

**Modifications:**

#### a) Interface `CartItem`
- Ajout du champ `material: string`

#### b) État du composant
- Ajout de `selectedMaterial` (défaut: "semi-glossy")

#### c) Configuration des matériaux
```typescript
const materials = {
  "semi-glossy": {
    label: "Papier Semi-Brillant",
    price: 13.20,
    description: "Papier Fine Art 200gsm, finition semi-brillante, rendu des couleurs exceptionnel"
  },
  "aluminum": {
    label: "Aluminium Brossé",
    price: 16.81,
    description: "Impression directe sur aluminium, effet moderne et durable, résistant aux UV"
  },
}
```

#### d) Calcul du prix
- Mise à jour de `calculatePrice()` pour inclure le coût du matériau
- Nouvelle signature: `calculatePrice(basePrice, format, frame, material)`

#### e) Interface utilisateur
- Nouvelle section "Matériau" dans le modal de sélection
- Affichée entre "Format" et "Encadrement"
- Chaque option affiche:
  - Le nom du matériau
  - Le prix supplémentaire
  - Une description des avantages

#### f) Transmission à Stripe
- Envoi de `material` et `orientation` dans les métadonnées
- Calcul automatique de l'orientation finale:
  - Si `orientation === 'auto'`: utiliser `aiDetectedOrientation` (défaut: 'vertical')
  - Sinon: utiliser la valeur forcée

---

### 5. **app/api/stripe/checkout/route.ts**

**Modifications:**

#### a) Validation des items
- Ajout de `material` et `orientation` dans l'objet validé
- Valeurs par défaut: `material = 'semi-glossy'`, `orientation = 'vertical'`

#### b) Métadonnées produit Stripe
```typescript
product_data: {
  name: item.title,
  description: item.category,
  images: item.images.slice(0, 8),
  metadata: {
    material: item.material,
    orientation: item.orientation,
  },
}
```

#### c) Métadonnées session Stripe
```typescript
metadata: {
  items_materials: validatedItems.map(item => item.material).join(','),
  items_orientations: validatedItems.map(item => item.orientation).join(','),
}
```

**Format:** Chaînes CSV pour support de panier multi-items

---

### 6. **app/api/stripe/webhook/route.ts**

**Modifications:**

#### a) Extraction des métadonnées
```typescript
const itemsMaterials = session.metadata?.items_materials?.split(',') || [];
const itemsOrientations = session.metadata?.items_orientations?.split(',') || [];
```

#### b) Passage à Gelato
- Récupération du matériau et orientation pour chaque item
- Appel à `mapFormatToGelatoProduct(format, material, orientation)`
- Ajout dans les options Gelato:
```typescript
options: {
  format,
  material,
  orientation,
  paperType: material === 'aluminum' ? 'aluminum' : 'fine_art_matte',
  finish: 'none'
}
```

#### c) Fonction `mapFormatToGelatoProduct()`
- Signature mise à jour: `(format, material?, orientation?)`
- Logique identique à `gelato-client.ts`
- Mapping des product UIDs selon matériau et orientation:

**Exemple de mapping:**
```typescript
'A2': {
  'semi-glossy-ver': 'flat_a2_200-gsm-80lb-coated-silk_4-0_ver',
  'semi-glossy-hor': 'flat_a2_200-gsm-80lb-coated-silk_4-0_hor',
  'aluminum-ver': 'metallic_400x600-mm-16x24-inch_3-mm_4-0_ver',
  'aluminum-hor': 'metallic_400x600-mm-16x24-inch_3-mm_4-0_hor',
}
```

---

### 7. **lib/gelato-client.ts**

**Modifications:**

#### a) Interface `GelatoOrderItem`
- Ajout de `material?: string` dans `options`
- Ajout de `orientation?: string` dans `options`

#### b) Méthode `createOrder()`
- Mise à jour de l'appel à `mapFormatToProductUid()`:
```typescript
productUid: this.mapFormatToProductUid(
  item.options?.format,
  item.options?.material,
  item.options?.orientation
)
```

#### c) Fonction `mapFormatToProductUid()` (déjà existante)
- Déjà correctement implémentée avec support material et orientation
- Aucune modification nécessaire

---

## Flux Complet

### 1. Interface Admin

```
Guillaume upload une photo
  ↓
Photo affichée dans admin
  ↓
Guillaume sélectionne:
  - Matériau: Papier Semi-Brillant OU Aluminium
  - Orientation: Auto / Vertical / Horizontal
  ↓
Si "Auto" sélectionné:
  → Appel automatique API detect-orientation
  → Claude Vision analyse l'image
  → Résultat affiché immédiatement
  ↓
Sauvegarde dans photo-metadata.json
```

### 2. Interface Boutique

```
Client visite boutique
  ↓
Clique sur "Ajouter au panier"
  ↓
Modal s'ouvre avec options:
  - Format (A4/A3/A2)
  - Matériau (Papier Semi-Brillant +€13.20 / Aluminium +€16.81)
  - Encadrement (Sans/Noir/Aluminium)
  ↓
Prix total recalculé en temps réel
  ↓
Client valide → Ajout au panier
```

### 3. Processus de Paiement

```
Client clique "Payer"
  ↓
API /stripe/checkout créée avec:
  - Items avec material et orientation
  - Métadonnées session Stripe
  ↓
Redirection vers Stripe Checkout
  ↓
Client paie
  ↓
Webhook Stripe déclenché
  ↓
Extraction material + orientation depuis métadonnées
  ↓
Création commande Gelato avec:
  - Product UID correspondant au matériau/orientation
  - Options complètes
  ↓
Gelato imprime et expédie
```

---

## Valeurs par Défaut

- **Matériau:** `semi-glossy` (Papier Semi-Brillant)
- **Orientation:** `auto` (Détection IA)
- **Orientation si auto non détectée:** `vertical`

---

## Compatibilité

### Avec données existantes
- Tous les champs sont optionnels
- Les photos sans material/orientation utiliseront les valeurs par défaut
- Pas de migration de données nécessaire

### Avec le système actuel
- Compatible avec toutes les catégories (unlimited, limited, xxl, monumental)
- Compatible avec les éditions limitées (compteur 1/7)
- Compatible avec le système de prix existant

---

## Règles Métier

### Matériaux

**Papier Semi-Brillant (semi-glossy):**
- Prix: €13.20
- Description: Papier Fine Art 200gsm, finition semi-brillante, rendu des couleurs exceptionnel
- Product UID Gelato: `flat_*_200-gsm-80lb-coated-silk_4-0_*`

**Aluminium Brossé (aluminum):**
- Prix: €16.81
- Description: Impression directe sur aluminium, effet moderne et durable, résistant aux UV
- Product UID Gelato: `metallic_*_3-mm_4-0_*`

### Orientations

**Vertical (ver):**
- Portrait
- Hauteur > Largeur
- Exemple: 60 x 40 cm

**Horizontal (hor):**
- Paysage / Landscape
- Largeur > Hauteur
- Exemple: 40 x 60 cm

**Auto:**
- Détection automatique par IA Anthropic
- Utilise Claude Vision pour analyser l'image
- Fallback: vertical si détection échoue

---

## API Anthropic

**Endpoint utilisé:** `https://api.anthropic.com/v1/messages`

**Modèle:** `claude-3-5-sonnet-20241022`

**Prompt:**
```
Is this image in portrait (vertical) or landscape (horizontal) orientation?
Reply with only one word: 'vertical' or 'horizontal'.
```

**Max tokens:** 50

**Configuration requise:**
- Variable d'environnement: `ANTHROPIC_API_KEY`
- Déjà configurée dans `.env.local`

---

## Testing

### Tests à effectuer

#### 1. Interface Admin

**Test détection orientation:**
1. Uploader une photo verticale
2. Sélectionner "Automatique (IA détecte)"
3. Vérifier que l'orientation détectée est "Vertical"
4. Sauvegarder
5. Recharger la page
6. Vérifier que la valeur est persistée

**Test override orientation:**
1. Uploader une photo verticale
2. Sélectionner "Horizontal (forcer)"
3. Vérifier que l'orientation forcée est enregistrée
4. Vérifier que la détection IA n'est pas déclenchée

**Test sélection matériau:**
1. Sélectionner "Aluminium Brossé"
2. Sauvegarder
3. Recharger
4. Vérifier que le choix est persisté

#### 2. Interface Boutique

**Test sélection matériau:**
1. Cliquer sur "Ajouter au panier"
2. Sélectionner "Aluminium Brossé"
3. Vérifier que le prix augmente de €16.81
4. Sélectionner "Papier Semi-Brillant"
5. Vérifier que le prix augmente de €13.20

**Test combinaison options:**
1. Sélectionner Format A2
2. Sélectionner Aluminium
3. Sélectionner Cadre Noir
4. Vérifier que le prix total = Base + A2 + Aluminium + Cadre
5. Valider
6. Vérifier que l'item dans le panier a toutes les bonnes valeurs

#### 3. Flow Stripe → Gelato

**Test métadonnées Stripe:**
1. Créer une commande avec matériau Aluminium
2. Vérifier dans Stripe Dashboard que les métadonnées contiennent:
   - `items_materials: "aluminum"`
   - `items_orientations: "vertical"`

**Test webhook:**
1. Simuler un paiement réussi (Stripe test mode)
2. Vérifier les logs du webhook:
   - Extraction correcte des métadonnées
   - Appel à `mapFormatToGelatoProduct()` avec les bons paramètres
   - Product UID Gelato correct selon matériau/orientation

**Test Gelato:**
1. Vérifier que la commande Gelato créée contient:
   - Le bon product UID (ex: `metallic_400x600-mm-16x24-inch_3-mm_4-0_ver`)
   - Les bonnes options (material, orientation, paperType)

---

## Commandes Utiles

### Développement
```bash
bun run dev
```

### Tester l'API détection orientation
```bash
curl -X POST http://localhost:3000/api/admin/detect-orientation \
  -H "Content-Type: application/json" \
  -d '{"photoPath": "/images/works/atelier/photo.jpg"}'
```

### Vérifier les logs
```bash
# Logs API Anthropic
grep "Orientation detected" logs/app.log

# Logs Webhook Stripe
grep "Gelato order" logs/app.log
```

---

## Prochaines Améliorations

### Court terme
1. **Batch detection:** Détecter l'orientation de toutes les photos en un clic
2. **Cache détection IA:** Éviter de re-détecter si déjà fait
3. **Preview matériaux:** Aperçu visuel des différents matériaux

### Moyen terme
1. **Prix dynamiques:** Récupérer les prix depuis l'API Gelato
2. **Formats XXL/Monumental:** Support complet des grands formats
3. **Multi-images:** Support des photos avec plusieurs orientations

### Long terme
1. **Détection AI avancée:** Suggérer le meilleur matériau selon la photo
2. **A/B testing:** Tester quel matériau convertit le mieux
3. **Analytics:** Tracker les choix de matériau des clients

---

## Documentation Technique

### Structure de données

**PhotoMetadata (photo-metadata.json):**
```json
{
  "filename": "ferrari-noir-atelier-23.jpg",
  "path": "/images/works/atelier/ferrari-noir-atelier-23.jpg",
  "material": "semi-glossy",
  "orientation": "auto",
  "aiDetectedOrientation": "vertical",
  "categories": ["unlimited", "limited"],
  "forSale": true,
  "visible": true
}
```

**Stripe Session Metadata:**
```json
{
  "items_materials": "semi-glossy,aluminum",
  "items_orientations": "vertical,horizontal"
}
```

**Gelato Order Item:**
```json
{
  "itemReferenceId": "cs_test_123-0",
  "productUid": "flat_a2_200-gsm-80lb-coated-silk_4-0_ver",
  "files": [{
    "url": "https://guillaumefarre.com/images/works/atelier/photo.jpg",
    "type": "default"
  }],
  "quantity": 1,
  "options": {
    "format": "A2",
    "material": "semi-glossy",
    "orientation": "vertical",
    "paperType": "fine_art_matte",
    "finish": "none"
  }
}
```

---

## Troubleshooting

### Détection IA ne fonctionne pas

**Symptôme:** Bouton "Automatique" ne déclenche pas la détection

**Solutions:**
1. Vérifier que `ANTHROPIC_API_KEY` est définie
2. Vérifier les logs: `grep "detect-orientation" logs/app.log`
3. Tester l'API directement avec curl (voir Commandes Utiles)
4. Vérifier que le fichier image existe et est accessible

### Matériau non transmis à Gelato

**Symptôme:** Gelato reçoit toujours "semi-glossy"

**Solutions:**
1. Vérifier les métadonnées Stripe dans le webhook
2. Vérifier l'extraction: `itemsMaterials = session.metadata?.items_materials?.split(',')`
3. Vérifier les logs: `grep "Gelato order" logs/app.log`

### Prix incorrect dans la boutique

**Symptôme:** Le prix ne change pas quand on sélectionne un matériau

**Solutions:**
1. Vérifier que `calculatePrice()` reçoit 4 paramètres
2. Vérifier que `selectedMaterial` est bien mis à jour
3. Vérifier le mapping des prix: `materials[material].price`

---

## Contacts

**Développeur:** Lalou
**Client:** Guillaume Farré
**Projet:** Site artiste + boutique Fine Art
**Date:** 2025-11-18

---

**Lalou**
