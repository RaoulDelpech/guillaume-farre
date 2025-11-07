# Gelato - Vérification pricing réel France

Date: 2025-11-07
Par: Lalou
Statut: ⚠️ CRITIQUE - À VÉRIFIER AVANT IMPLÉMENTATION

---

## ⚠️ AVERTISSEMENT CRITIQUE

**Marges actuelles BASÉES SUR HYPOTHÈSES (non vérifiées)**

Estimations conservatrices utilisées:
- Coût production A2 Giclee: €35 (hypothèse)
- Coût production A3 Giclee: €20 (hypothèse)
- Coût production A4 Giclee: €12 (hypothèse)
- Shipping France: €15 (hypothèse production locale)

**RISQUE**: Marges réelles peuvent être beaucoup plus basses.

**ACTION REQUISE**: Vérifier pricing réel AVANT implémentation Gelato API.

---

## MARGES ESTIMÉES (hypothèses)

| Format | Prod estimé | Shipping estimé | Total estimé | Prix vente | Marge estimée | % |
|--------|-------------|-----------------|--------------|-----------|---------------|---|
| A4 | €12 | €15 | €27 | €150 | €123 | **82%** |
| A3 | €20 | €15 | €35 | €250-500 | €215-465 | **86-93%** |
| A2 | €35 | €15 | €50 | €400-800 | €350-750 | **88-94%** |

**Ces chiffres sont HYPOTHÉTIQUES.**

---

## SEUILS DÉCISION

### ✅ GO Gelato si:
- Marges tirages illimités > 70%
- Marges séries limitées > 80%
- Shipping France < €25
- Qualité Fine Art Giclee confirmée

### ⚠️ RÉÉVALUER si:
- Marges tirages illimités 60-70%
- Marges séries limitées 70-80%
- Shipping France €25-35

### ❌ ABANDONNER Gelato si:
- Marges tirages illimités < 60%
- Marges séries limitées < 70%
- Shipping France > €35
- Qualité Fine Art insuffisante

**Fallback**: Prodigi (production EU, voir PRODIGI_ANALYSE_SHIPPING_FRANCE.md)

---

## PLAN VÉRIFICATION (30 min)

### Étape 1: Créer compte Gelato (5 min)

1. Aller sur https://www.gelato.com/
2. Cliquer "Sign up for free"
3. Options:
   - Email + password
   - OU compte Google
4. Valider email
5. Accès dashboard: https://dashboard.gelato.com/

**Compte**: Gratuit, aucun engagement

---

### Étape 2: Accéder pricing France (10 min)

1. Dashboard → "Product Catalog" OU "Pricing"
2. Filtrer:
   - Product type: "Fine Art Prints" OU "Posters" → "Fine Art Giclee"
   - Destination: **France**
3. Noter prix production:
   - A4 (21 x 29.7 cm) Fine Art Giclee: **€X**
   - A3 (29.7 x 42 cm) Fine Art Giclee: **€X**
   - A2 (42 x 59.4 cm) Fine Art Giclee: **€X**
4. Noter shipping France:
   - Standard (X jours): **€X**
   - Express (X jours): **€X**

**Si pricing pas visible**: Contacter support Gelato via chat dashboard.

---

### Étape 3: Calculer marges réelles (5 min)

Utiliser VRAIS prix obtenus à Étape 2.

#### Tirages illimités

| Format | Prod réel | Shipping réel | Total réel | Prix vente | Marge réelle | % réel |
|--------|-----------|---------------|------------|-----------|-------------|--------|
| A4 | €___ | €___ | €___ | €150 | €___ | __% |
| A3 | €___ | €___ | €___ | €250 | €___ | __% |
| A2 | €___ | €___ | €___ | €400 | €___ | __% |

#### Séries limitées

| Format | Prod réel | Shipping réel | Total réel | Prix vente | Marge réelle | % réel |
|--------|-----------|---------------|------------|-----------|-------------|--------|
| A3 | €___ | €___ | €___ | €500 | €___ | __% |
| A2 | €___ | €___ | €___ | €800 | €___ | __% |
| A1 | €___ | €___ | €___ | €1200 | €___ | __% |

---

### Étape 4: Vérifier qualité Fine Art (5 min)

Dans dashboard Gelato:

1. Product specifications → Fine Art Prints
2. Vérifier:
   - ✅ Giclee 12 couleurs (vs 4 CMYK standard)
   - ✅ Papier 200 gsm FSC-certified
   - ✅ Encres archival fade-resistant
   - ✅ Matte finish lisse
3. Télécharger sample kit (si dispo): commander 1 print test

---

### Étape 5: Décision finale (5 min)

Remplir ce tableau:

| Critère | Attendu | Réel | ✅/❌ |
|---------|---------|------|------|
| Marge A4 unlimited | > 70% | __% | |
| Marge A3 unlimited | > 70% | __% | |
| Marge A2 unlimited | > 70% | __% | |
| Marge A3 limited | > 80% | __% | |
| Marge A2 limited | > 80% | __% | |
| Marge A1 limited | > 80% | __% | |
| Shipping France | < €25 | €__ | |
| Qualité Giclee 12 couleurs | ✅ | ✅/❌ | |

**Si TOUS ✅** → **GO GELATO** ✅

**Si 1-2 ❌** → Réévaluer (peut-être ajuster prix vente Guillaume)

**Si 3+ ❌** → **ABANDONNER GELATO**, tester Prodigi

---

## AJUSTEMENTS POSSIBLES SI MARGES BASSES

### Si marges 60-70% (au lieu de 80-93%)

**Option A**: Augmenter prix vente Guillaume

Exemple si marge A3 limited réelle = 65%:
- Prix actuel: €500
- Coût réel: €175 (au lieu de €35 estimé)
- Marge: €325 (65%)

**Nouveau prix**: €600
- Coût: €175
- Marge: €425 (71%) ← Acceptable

**Option B**: Réduire formats disponibles

Ne proposer que A2/A1 (marges meilleures sur grands formats).

**Option C**: Passer à Prodigi

Production EU, pricing possiblement meilleur.

---

## CONTACT GELATO SI BESOIN

**Support**:
- Chat: dashboard.gelato.com (bottom right)
- Email: support@gelato.com
- Documentation: https://dashboard.gelato.com/docs/

**Questions à poser**:
1. Prix exact production Fine Art Giclee A2/A3/A4 (destination France)
2. Shipping France exact (standard vs express)
3. Délais réels livraison France
4. Production depuis quel centre pour clients France?
5. Certificats authenticité personnalisables?
6. Alu-Dibond / Metal prints disponibles?

---

## PROCHAINE ÉTAPE

**IMMÉDIAT**: Créer compte Gelato + vérifier pricing (30 min)

**PUIS**:
- Si GO → Implémenter API (GELATO_VALIDATION_GUIDE.md)
- Si NO-GO → Tester Prodigi (PRODIGI_ANALYSE_SHIPPING_FRANCE.md)

---

## TEMPLATE RÉSUMÉ VÉRIFICATION

À remplir après vérification:

```markdown
## Vérification pricing Gelato France - [DATE]

### Pricing production Fine Art Giclee
- A4: €___
- A3: €___
- A2: €___
- A1: €___

### Shipping France
- Standard: €___ (__ jours)
- Express: €___ (__ jours)

### Marges réelles tirages illimités
- A4: __% (€___ marge)
- A3: __% (€___ marge)
- A2: __% (€___ marge)

### Marges réelles séries limitées
- A3: __% (€___ marge)
- A2: __% (€___ marge)
- A1: __% (€___ marge)

### Qualité confirmée
- Giclee 12 couleurs: ✅/❌
- Papier 200 gsm archival: ✅/❌
- Encres fade-resistant: ✅/❌

### DÉCISION FINALE
✅ GO GELATO / ❌ NO-GO GELATO

### Raison
___
```

---

Lalou
