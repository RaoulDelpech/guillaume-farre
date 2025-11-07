# Analyse Prodigi - Shipping France & Intégration

Date: 7 novembre 2025
Par: Lalou
Objectif: Vérifier frais shipping France et valider Prodigi comme solution

---

## CE QUE J'AI TROUVÉ

### ✅ Production EU confirmée

**Centres de production Prodigi** :
- UK : 2 installations in-house
- Pays-Bas (Amsterdam) : 1 installation (Peecho acquis 2023)
- EU mainland : 1 installation
- **Total EU** : 50,000 sq ft de production

**Pour clients français** :
- Commandes imprimées depuis centre EU le plus proche
- Pas d'import depuis hors-EU
- Pas de frais douanes

### ⚠️ Shipping France : Prix NON publics

**Problème** : Prodigi ne publie pas de grille tarifaire shipping publique.

**Pour obtenir prix exacts** :
- Créer compte Prodigi (gratuit)
- Accéder au "Pricing and Shipping Tool" dans dashboard
- Filtrer par destination : France
- Télécharger price sheet

**Ce que je sais** :
- Coûts varient selon produit + destination
- Prints roulés (rolled prints) : flat-rate EU (pas de frais additionnels multi-items)
- Prints encadrés : item le plus grand = shipping full, items suivants = "+1" rate réduit
- Standard vs Express disponibles

### ⏱️ Délais France

- **Production** : 80% des commandes prêtes sous 24-48h
- **Livraison** : Non spécifié (faut tester)
- **Total estimé** : 3-5 jours (production + shipping EU)

---

## COMPARAISON ThePrintSpace vs Prodigi

| Critère | ThePrintSpace (UK) | Prodigi (EU) | Gagnant |
|---------|-------------------|--------------|---------|
| **Production** | UK only | UK + NL + EU | 🥇 Prodigi |
| **Shipping France** | ~€40-60 (DHL Express UK→FR) | ❓ (à vérifier, probablement €15-30 EU→FR) | 🥇 Prodigi (estimé) |
| **Frais douanes** | ⚠️ Risque Brexit | ✅ Aucun (intra-EU) | 🥇 Prodigi |
| **Délais** | 2-5 jours | 3-5 jours (80% prod 24-48h) | 🟰 Égal |
| **API** | ✅ REST + Webhooks | ✅ REST + Webhooks | 🟰 Égal |
| **Certificats édition limitée** | ✅ Personnalisables | ❓ (à vérifier) | ⚠️ ThePrintSpace |
| **Qualité** | 11 papiers Giclee | Fine Art Trade Guild approved | 🟰 Égal |
| **Alu-Dibond** | ✅ Aluminum & Battens | ❓ (à vérifier catalogue) | ⚠️ ThePrintSpace |

**Conclusion préliminaire** : Prodigi meilleur pour France (shipping + douanes) SI les prix shipping sont corrects.

---

## ACTION IMMÉDIATE REQUISE

Pour valider définitivement Prodigi, **il faut** :

### 1. Créer compte Prodigi (10 min)

1. Aller sur https://www.prodigi.com/
2. Cliquer "Get Started" / "Sign Up"
3. Créer compte avec email Guillaume
4. Accéder au dashboard

### 2. Vérifier shipping France (5 min)

1. Dans dashboard → "Pricing and Shipping Tool"
2. Filtrer :
   - Product category: Prints & Posters → Art Prints
   - Destination: France
3. Télécharger price sheet
4. Vérifier :
   - **Shipping cost A2** (format large)
   - **Shipping cost A3** (format medium)
   - **Shipping cost A4** (format small)
   - Standard vs Express

### 3. Vérifier catalogue produits (10 min)

1. Parcourir catalogue Fine Art prints
2. Vérifier disponibilité :
   - ✅ Papier Giclee (confirmé)
   - ❓ Alu-Dibond / Metal prints
   - ❓ Acrylic prints
   - ❓ Encadrements (noir, blanc, alu)
3. Vérifier certificats authenticité personnalisables

### 4. Tester API sandbox (30 min)

1. Obtenir API key sandbox
2. Lire doc API : https://www.prodigi.com/print-api/docs/
3. Créer commande test
4. Vérifier webhooks

**Temps total** : ~1h pour validation complète

---

## DÉCISION : ThePrintSpace vs Prodigi

### ✅ Choisir Prodigi SI :

- Shipping France < €25
- Alu-Dibond disponible (ou acceptable de ne pas proposer)
- Certificats authenticité ok (ou on les fait nous-mêmes)

**Avantage principal** : **Pas de frais douanes Brexit**

### ✅ Choisir ThePrintSpace SI :

- Shipping Prodigi France > €30
- Certificats édition limitée personnalisés obligatoires
- Alu-Dibond obligatoire et Prodigi ne le fait pas

**Avantage principal** : **Certificats édition limitée inclus + Alu-Dibond confirmé**

---

## ALTERNATIVE : Solution hybride

**Scenario** : Utiliser les DEUX services

**Prodigi** pour :
- Papier Giclee seul (marges max, shipping mini)
- Clients France/EU (shipping réduit)

**ThePrintSpace** pour :
- Alu-Dibond (si Prodigi ne le fait pas)
- Acrylic (finitions premium)
- Marchés hors-EU (UK, US)

**Avantage** :
- Meilleur shipping selon destination
- Plus d'options produits
- Fallback si un service down

**Inconvénient** :
- 2 APIs à intégrer (2x plus de travail)
- Gestion stock éditions limitées plus complexe

---

## ESTIMATION MARGES AVEC PRODIGI

**Hypothèse shipping France** : €20 (standard, basé sur Prodigi EU fulfillment)

### Papier Giclee + Shipping standard France

**Coûts production Prodigi estimés** (à confirmer) :
- A4 Giclee : ~€12-18
- A3 Giclee : ~€18-25
- A2 Giclee : ~€30-45

| Format | Coût production | Shipping | Coût total | Prix vente Guillaume | Marge | % |
|--------|----------------|----------|-----------|---------------------|-------|---|
| A4 | €15 | €20 | €35 | €300 | €265 | **88%** |
| A3 | €22 | €20 | €42 | €500 | €458 | **92%** |
| A2 | €38 | €20 | €58 | €800 | €742 | **93%** |

**Si shipping €20** : Marges excellentes (88-93%) 🎉

**Si shipping €30** : Marges correctes (80-87%) ✅

**Si shipping €40+** : Marges ok mais ThePrintSpace devient compétitif ⚠️

---

## RECOMMANDATION LALOU

### Scénario optimal

1. **Créer compte Prodigi maintenant** (10 min)
2. **Vérifier shipping France exact** (5 min)
3. **Décision immédiate** :
   - Shipping < €25 → Prodigi validé ✅
   - Shipping > €30 → Revenir à ThePrintSpace (ou tester les deux)

### Contact Prodigi si besoin

- **Support** : support@prodigi.com
- **Sales** : sales@prodigi.com
- **Phone** : +44 (0)20 8123 4567

**Questions à poser** :
1. Shipping costs exact France (A2, A3, A4)
2. Alu-Dibond / Metal prints disponibles ?
3. Certificats authenticité personnalisables ?
4. Délais réels livraison France
5. Fulfillment depuis quel centre pour France (UK, NL, autre ?)

---

## PROCHAINES ÉTAPES

### Option A : Guillaume crée compte Prodigi

**Si tu as 15 min maintenant** :
1. Va sur https://www.prodigi.com/
2. "Get Started"
3. Crée compte
4. Dashboard → Pricing Tool → France
5. Tu me dis les prix shipping A2/A3/A4
6. Je décide : Prodigi ou ThePrintSpace

### Option B : Je contacte Prodigi pour toi

**Si tu préfères que je gère** :
1. Je contacte sales@prodigi.com
2. Je demande :
   - Grille pricing shipping France
   - Catalogue complet Fine Art
   - Certificats authenticité
3. Je te présente résumé
4. Tu valides Prodigi ou ThePrintSpace

### Option C : On teste les deux

**Si budget temps ok** :
1. J'implémente Prodigi ET ThePrintSpace
2. Interface admin : tu choisis quel service utiliser par commande
3. Tests réels : comparer qualité + shipping + délais
4. Après 1 mois : on garde le meilleur

**Dis-moi quelle option tu préfères ?**

---

## CONCLUSION TEMPORAIRE

**Prodigi semble meilleur pour France** :
- ✅ Production EU (pas Brexit)
- ✅ Shipping réduit (estimé €15-25)
- ✅ Pas frais douanes
- ✅ API complète
- ✅ Qualité certifiée

**MAIS faut vérifier** :
- ⏳ Prix shipping exacts
- ⏳ Catalogue Alu-Dibond
- ⏳ Certificats authenticité

**Temps requis pour valider** : 15-30 min

---

Lalou
