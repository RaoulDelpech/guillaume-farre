# Décisions Pricing - 8 novembre 2025, 00h15

Date: 8 novembre 2025, 00h15
Client: Raoul (pour Guillaume Farré)
Par: Lalou

---

## DÉCISION 1 : Supprimer "à partir de"

**Problème** :
- Expression "à partir de X €" jugée discount/cheap
- Incompatible avec positionnement haut de gamme Guillaume Farré

**Solution retenue** : **Option 4 - Ultra épuré style Peter Lik**

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

**Pourquoi** :
- Clarté absolue (pas d'ambiguïté)
- Positionnement premium (comme Peter Lik, $6.5M record)
- Pas de négociation implicite
- Association mentale Format = Prix immédiate
- Typographie distinctive (majuscules + espacement = luxe)

---

## DÉCISION 2 : Système pricing dynamique

**Besoin** :
- Guillaume définit 1 prix de base
- Autres formats se calculent automatiquement
- Possibilité override manuel si besoin

**Solution retenue** : **Option 3 - Multiplicateurs + Override manuel**

### Configuration finale

```typescript
{
  // Prix de base TIRAGE ILLIMITÉ (A4)
  prixBaseUnlimited: 150,

  // Prix de base SÉRIE LIMITÉE (A3)
  prixBaseLimited: 1500,

  // Multiplicateurs TIRAGE ILLIMITÉ
  multipliersUnlimited: {
    a4: 1.0,     // 150 € (base)
    a3: 1.67,    // 250 € (×1.67 = +67%)
    a2: 2.67     // 400 € (×2.67 = +167%)
  },

  // Multiplicateurs SÉRIE LIMITÉE
  multipliersLimited: {
    a3: 1.0,     // 1500 € (base série limitée)
    a2: 1.53,    // 2300 € (×1.53 = +53%)
    a1: 2.0      // 3000 € (×2.0 = +100%)
  },

  // Overrides manuels (si Guillaume veut prix custom)
  manualPrices: {
    // Ex: 'limited-a1': 2999  // Override le calcul auto
  }
}
```

### Avantages

1. **Flexibilité maximale** :
   - Guillaume change prix de base → TOUS les prix se recalculent
   - Guillaume veut prix custom pour A1 → Il override juste celui-là

2. **Interface claire** :
   - Toggle "Auto" vs "Manuel" pour chaque format
   - Vue instantanée de quels prix sont auto vs manuels

3. **Moins d'erreurs** :
   - Multiplicateurs intuitifs vs pourcentages confus
   - Tableau visuel vs calculs mentaux

4. **Évolutif** :
   - Facile d'ajouter XXL, Monumental
   - Facile de créer grilles tarifaires (promo, VIP)

5. **Standard galeries** :
   - Utilisé par Artlogic, Artbase (logiciels pro)

### Interface admin

```
┌─────────────────────────────────────────────────┐
│ TIRAGE ILLIMITÉ                                 │
│ Prix de base: [150] €                           │
├─────────────────────────────────────────────────┤
│ A4  │ 150 €  │ ×1.0   │ [✓ Auto] [✎ Manuel]    │
│ A3  │ 250 €  │ ×1.67  │ [✓ Auto] [✎ Manuel]    │
│ A2  │ 400 €  │ ×2.67  │ [✓ Auto] [✎ Manuel]    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SÉRIE LIMITÉE (1/7)                             │
│ Prix de base: [1500] €                          │
├─────────────────────────────────────────────────┤
│ A3  │ 1500 € │ ×1.0   │ [✓ Auto] [✎ Manuel]    │
│ A2  │ 2300 € │ ×1.53  │ [✓ Auto] [✎ Manuel]    │
│ A1  │ 3000 € │ ×2.0   │ [✓ Auto] [✎ Manuel]    │
└─────────────────────────────────────────────────┘
```

### Exemple workflow

**Cas 1 : Tout en auto**
```
Guillaume met prix de base unlimited à 150 €
→ A4: 150 €, A3: 250 €, A2: 400 € (calculés auto)

Guillaume met prix de base limited à 1500 €
→ A3: 1500 €, A2: 2300 €, A1: 3000 € (calculés auto)

→ Guillaume ne fait RIEN d'autre, tout marche
```

**Cas 2 : Override manuel**
```
Guillaume pense "3000 € pour A1 c'est trop, je veux 2999 €"
→ Il clique [✎ Manuel] sur A1
→ Il tape 2999
→ A1 passe à 2999 € (mode manuel)
→ Les autres restent auto-calculés

Plus tard, Guillaume augmente prix de base limited à 2000 €
→ A3: 2000 €, A2: 3060 € (recalculés)
→ A1: 2999 € (reste manuel, pas recalculé)
```

**Cas 3 : Retour en auto**
```
Guillaume veut que A1 redevienne auto
→ Il clique [✓ Auto] sur A1
→ A1 repasse en calcul automatique
→ Si base limited = 2000 €, alors A1 = 4000 € (×2.0)
```

---

## FICHIERS À CRÉER/MODIFIER

### Phase 1 : Configuration (15 min)
- [x] Créer `lib/pricing-config.ts` (config pricing)
- [ ] Créer `lib/pricing-calculator.ts` (calculs)

### Phase 2 : Interface admin (30 min)
- [ ] Créer `components/admin/PricingManager.tsx`
- [ ] Intégrer dans `app/[locale]/admin/page.tsx`

### Phase 3 : Affichage boutique (30 min)
- [ ] Modifier `components/shop/ShopGrid.tsx` (affichage prix)
- [ ] Modifier `components/shop/PhotoDetail.tsx` (si existe)
- [ ] Mettre à jour `messages/fr.json` (supprimer "à partir de")
- [ ] Mettre à jour `messages/en.json` (supprimer "from")
- [ ] Mettre à jour `messages/it.json` (supprimer "a partire da")

### Phase 4 : API (15 min)
- [ ] Créer `app/api/admin/pricing/route.ts` (GET/POST pricing)

### Phase 5 : Tests (15 min)
- [ ] Tester calculs auto
- [ ] Tester override manuel
- [ ] Tester retour en auto
- [ ] Tester affichage boutique

**Total estimé** : 1h45

---

## BENCHMARKS

### Peter Lik (lik.com)
- Record $6.5M pour "Phantom"
- Affichage prix exact par format
- Style épuré ultra-premium
- **Note** : Prix affichés publiquement

### Andreas Gursky (andreasgursky.com)
- Record $4.3M aux enchères
- Prix fixes en galerie
- Site minimaliste focus œuvre
- **Note** : Prix sur demande (confidentialité)

### Jeff Koons (jeffkoons.com)
- Vente directe + galeries
- Configurateur 3D interactif
- Prix transparents
- **Note** : Certificats blockchain

### Damien Hirst (damienhirst.com)
- Vente NFT + physique
- Timers / scarcity tactics
- Prix affichés
- **Note** : Exclusivités VIP

---

## PROCHAINES QUESTIONS STRATÉGIQUES

Après implémentation pricing, poser à Guillaume:

**Q3 : Clientèle cible**
Qui sont vos 3 types de clients idéaux ?
- Collectors d'art contemporain (€5k-€50k+)
- Décorateurs / architectes (B2B)
- Amateurs passionnés (€500-€5k)
- Entreprises (offices, lobbies)

**Q4 : Positionnement prix**
Comment voulez-vous être perçu ?
- Artiste émergent accessible
- Artiste établi milieu de gamme
- Artiste haut de gamme / luxe
- Artiste ultra-premium (records)

**Q5 : Homepage**
Préférez-vous:
- Carousel (optimisé)
- Vidéo plein écran Ferrari
- Image héroïque fixe + CTA
- Split-screen vidéo/texte

*(etc. - 47 questions restantes dans NOUVELLES_DEMANDES_2025-11-07_23h59.md)*

---

## COMMIT RÉGULIER (RÈGLE ABSOLUE)

Comme demandé par Raoul, ce fichier est créé et commité immédiatement.
Commits prévus toutes les 10-15 min pendant implémentation.

---

**Créé par** : Lalou
**Date** : 8 novembre 2025, 00h15
**Validé par** : Raoul (Guillaume Farré)
**Statut** : ✅ Décisions finalisées, implémentation en cours
