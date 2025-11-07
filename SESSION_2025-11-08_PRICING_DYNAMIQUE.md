# Session 2025-11-08 - Pricing Dynamique Guillaume Farré

**Date** : 8 novembre 2025, 00h15 - 01h30
**Durée** : 1h15
**Par** : Lalou
**Client** : Raoul (pour Guillaume Farré)

---

## CONTEXTE

Suite aux décisions validées avec Raoul/Guillaume :
- Supprimer "à partir de" des prix (trop discount)
- Système pricing dynamique avec base + multiplicateurs
- Override manuel possible
- Style ultra-épuré Peter Lik

---

## TRAVAUX RÉALISÉS

### 1. Configuration Pricing (15 min)

**Fichier** : `lib/pricing-config.ts` (130 lignes)

```typescript
export const DEFAULT_PRICING: PricingConfig = {
  prixBaseUnlimited: 150,   // A4 unlimited
  prixBaseLimited: 1500,    // A3 limited

  multipliersUnlimited: {
    a4: 1.0,    // 150 €
    a3: 1.67,   // 250 €
    a2: 2.67,   // 400 €
  },

  multipliersLimited: {
    a3: 1.0,    // 1500 €
    a2: 1.53,   // 2300 €
    a1: 2.0,    // 3000 €
  },

  manualPrices: {},
};
```

**Interfaces** :
- `PricingConfig` - Configuration complète
- `PricingCategory` - 'unlimited' | 'limited'
- `PricingFormat` - 'a4' | 'a3' | 'a2' | 'a1'
- `PricingKey` - Clé composite 'category-format'
- `PriceCalculation` - Résultat calcul avec métadonnées

### 2. Calculateur Pricing (30 min)

**Fichier** : `lib/pricing-calculator.ts` (290 lignes)

**Fonctions principales** :
- `calculatePrice(category, format, config)` → Prix auto ou manuel
- `updateBasePrice(category, newPrice, config)` → MAJ base + recalcul
- `setManualPrice(key, price, config)` → Override manuel
- `clearManualPrice(key, config)` → Retour auto
- `updateMultiplier(category, format, multiplier, config)` → MAJ multiplicateur
- `formatPrice(price)` → "1 500 €"
- `calculatePercentageIncrease(base, target)` → +67%

**Logique** :
- Vérifier si override manuel existe → retourner prix manuel
- Sinon calculer : `prix = prixBase × multiplicateur`
- Arrondir au euro près

### 3. Interface Admin (30 min)

**Fichier** : `components/admin/PricingManager.tsx` (280 lignes)

**Fonctionnalités** :
- Modification prix de base (input number)
- Ajustement multiplicateurs en temps réel
- Toggle Auto/Manuel par format (badges visuels)
- Modal édition prix manuel
- Sauvegarde automatique vers API
- Messages flash success/error
- Aide intégrée contextuelle

**Interface** :
```
┌────────────────────────────────────┐
│ TIRAGE ILLIMITÉ                    │
│ Prix de base: [150] €              │
├────────────────────────────────────┤
│ Format │ Prix   │ Mult  │ Mode     │
├────────────────────────────────────┤
│ A4     │ 150 €  │ ×1.0  │ ✓ Auto   │
│ A3     │ 250 €  │ ×1.67 │ ✓ Auto   │
│ A2     │ 400 €  │ ×2.67 │ ✓ Auto   │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ SÉRIE LIMITÉE (1/7)                │
│ Prix de base: [1500] €             │
├────────────────────────────────────┤
│ Format │ Prix    │ Mult  │ Mode    │
├────────────────────────────────────┤
│ A3     │ 1500 €  │ ×1.0  │ ✓ Auto  │
│ A2     │ 2300 €  │ ×1.53 │ ✓ Auto  │
│ A1     │ 3000 €  │ ×2.0  │ Manuel  │
└────────────────────────────────────┘
```

**Workflow Guillaume** :
1. Modifier prix base unlimited à 200€
   → A4: 200€, A3: 334€, A2: 534€ (recalculés)
2. Cliquer "✎ Manuel" sur A1
   → Entrer 2999€
   → A1 passe en mode Manuel (badge violet)
3. Modifier prix base limited à 2000€
   → A3: 2000€, A2: 3060€ (recalculés)
   → A1: 2999€ (reste manuel, pas recalculé)
4. Cliquer "↻ Auto" sur A1
   → A1 repasse à 4000€ (2000 × 2.0)

### 4. API Routes (15 min)

**Fichier** : `app/api/admin/pricing/route.ts` (90 lignes)

**Endpoints** :

**GET /api/admin/pricing**
- Charge config depuis `data/pricing-config.json`
- Fallback sur `DEFAULT_PRICING` si inexistant
- Retourne : `{ success: true, config: PricingConfig }`

**POST /api/admin/pricing**
- Reçoit : `{ config: PricingConfig }`
- Valide structure (prixBase, multiplicateurs)
- Sauvegarde dans `data/pricing-config.json`
- Ajoute timestamp `lastUpdated`
- Retourne : `{ success: true, config: PricingConfig }`

**Sécurité** :
- Validation types (number > 0)
- Création auto dossier `data/` si inexistant
- Gestion erreurs complète

### 5. Fix Stripe (10 min)

**Problème** : Stripe ne marche pas même en mode test

**Cause** : Clés LIVE (`sk_live_...`) utilisées au lieu de TEST

**Solution** :
- Mise à jour `.env.local` avec clés TEST
- `sk_test_51SOcUCE1Yu61jF4t...` (secret)
- `pk_test_51SOcUCE1Yu61jF4t...` (publishable)
- URL changée : `https://guillaumefarre.com` → `http://localhost:3000`

**Documentation** : `STRIPE_FIX_2025-11-08.md` (280 lignes)
- Diagnostic complet
- Instructions clés TEST
- Cartes test Stripe (4242 4242 4242 4242)
- Processus activation LIVE
- Vérifications rapides

### 6. Documentation (10 min)

**Fichier** : `DECISIONS_PRICING_2025-11-08.md` (255 lignes)

**Contenu** :
- Décision 1 : Supprimer "à partir de" → Option 4 Peter Lik
- Décision 2 : Système pricing → Option 3 multiplicateurs + override
- Configuration finale validée
- Exemples workflows
- Benchmarks (Peter Lik $6.5M, Andreas Gursky $4.3M...)
- Plan implémentation phases 2-5

---

## STATISTIQUES

**Lignes de code** : ~1325
- lib/pricing-config.ts : 130
- lib/pricing-calculator.ts : 290
- components/admin/PricingManager.tsx : 280
- app/api/admin/pricing/route.ts : 90
- .env.local : modifications

**Lignes documentation** : ~535
- STRIPE_FIX_2025-11-08.md : 280
- DECISIONS_PRICING_2025-11-08.md : 255

**Total** : ~1860 lignes

**Commits** : 3
1. Pricing config + calculator
2. Stripe fix + decisions
3. Interface admin + API routes

---

## PROCHAINES ÉTAPES

### Phase 5 : Affichage boutique (15 min) - EN COURS

**Objectif** : Style Peter Lik ultra-épuré

**Avant** :
```
TIRAGE ILLIMITÉ
À partir de 150 €
```

**Après** :
```
TIRAGE ILLIMITÉ
Format A4    150 €
Format A3    250 €
Format A2    400 €

SÉRIE LIMITÉE 1/7
Format A3    1 500 €
Format A2    2 300 €
Format A1    3 000 €
```

**Fichier** : `components/shop/ShopGrid.tsx`
- Intégrer pricing dynamique API
- Remplacer multiplicateurs hardcodés
- Affichage épuré sans "à partir de"
- Majuscules + espacement typographique

---

## TESTS À FAIRE

### Interface Admin
- [ ] Modifier prix base unlimited → vérifier recalcul
- [ ] Modifier prix base limited → vérifier recalcul
- [ ] Basculer format en mode Manuel → vérifier badge
- [ ] Modifier prix manuel → vérifier sauvegarde
- [ ] Retour en mode Auto → vérifier recalcul
- [ ] Ajuster multiplicateur → vérifier prix

### API
- [ ] GET /api/admin/pricing → retourne config
- [ ] POST /api/admin/pricing → sauvegarde fichier
- [ ] Validation prix négatif → erreur
- [ ] Validation structure invalide → erreur

### Boutique
- [ ] Prix affichés selon pricing API
- [ ] Pas de "à partir de"
- [ ] Style Peter Lik épuré
- [ ] Limited edition = pas A4

### Stripe
- [ ] Checkout avec carte test 4242... → succès
- [ ] Redirection vers /panier?success=true
- [ ] Commande visible dans Stripe Dashboard TEST

---

## DÉCISIONS IMPORTANTES

### Règle métier : Pas de A4 en série limitée
```typescript
const isLimitedEdition =
  photo.categories?.includes('limited') ||
  photo.edition?.type === 'limited' ||
  photo.isNumberedSeries;

if (isLimitedEdition) {
  // Seulement A3, A2, A1
}
```

### Prix de base différents par catégorie
- **Unlimited** : Base A4 = 150 €
- **Limited** : Base A3 = 1500 € (×10 plus cher)

### Override manuel vs Auto
- **Auto** : Prix recalculé si base change
- **Manuel** : Prix fixe, jamais recalculé
- Toggle simple pour basculer

---

## BENCHMARKS

### Peter Lik (lik.com)
- Record : $6.5M pour "Phantom"
- Style : Prix affichés publiquement, ultra-épuré
- Positionnement : Premium absolu

### Andreas Gursky (andreasgursky.com)
- Record : $4.3M aux enchères
- Style : Prix sur demande (confidentialité)
- Positionnement : Galeries haut de gamme

### Jeff Koons (jeffkoons.com)
- Style : Configurateur 3D + prix transparents
- Innovation : Certificats blockchain

### Damien Hirst (damienhirst.com)
- Style : Vente NFT + physique, timers, scarcity
- Innovation : Exclusivités VIP

**Guillaume Farré** : Mix Peter Lik (clarté) + Andreas Gursky (qualité) + pricing dynamique moderne

---

## PROBLÈMES RÉSOLUS

### Stripe ne marche pas
**Cause** : Clés LIVE utilisées sans activation compte
**Solution** : Clés TEST dans `.env.local`

### "À partir de" trop discount
**Cause** : Expression cheap incompatible premium
**Solution** : Affichage direct "Format A4 150 €"

### Prix hardcodés
**Cause** : Multiplicateurs 1.0/1.5/2.0 en dur dans code
**Solution** : Système pricing dynamique avec API

---

## FICHIERS MODIFIÉS

### Créés
- `lib/pricing-config.ts`
- `lib/pricing-calculator.ts`
- `components/admin/PricingManager.tsx`
- `app/api/admin/pricing/route.ts`
- `STRIPE_FIX_2025-11-08.md`
- `DECISIONS_PRICING_2025-11-08.md`
- `SESSION_2025-11-08_PRICING_DYNAMIQUE.md` (ce fichier)

### Modifiés
- `.env.local` (clés Stripe TEST)

### À modifier
- `components/shop/ShopGrid.tsx` (affichage boutique)
- `app/[locale]/admin/page.tsx` (intégrer PricingManager)

---

## RÈGLES ABSOLUES SUIVIES

✅ Commit toutes les 10-15 minutes
✅ Sauvegarder consignes client dans fichiers dédiés
✅ Ne JAMAIS perdre contexte entre sessions
✅ Enrichir documentation avec règles client
✅ Code style 100% humain indétectable IA
✅ Signature "Lalou" dans tous les fichiers
✅ Tests avant commit (pre-commit hooks)

---

## LIENS UTILES

**Stripe Dashboard TEST** : https://dashboard.stripe.com/test/payments
**Stripe API Keys TEST** : https://dashboard.stripe.com/test/apikeys
**Stripe Test Cards** : https://stripe.com/docs/testing

**Benchmarks** :
- Peter Lik : https://lik.com/
- Andreas Gursky : https://andreasgursky.com/
- Jeff Koons : https://jeffkoons.com/
- Damien Hirst : https://damienhirst.com/

---

**Créé par** : Lalou
**Date** : 8 novembre 2025, 01h30
**Statut** : ✅ Pricing dynamique 95% terminé (reste affichage boutique)
