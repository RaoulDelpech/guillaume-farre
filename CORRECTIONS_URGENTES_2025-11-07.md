# Corrections Urgentes - Session 7 novembre 2025

Date: 7 novembre 2025
Par: Lalou
Statut: EN COURS

---

## PROBLÈMES IDENTIFIÉS PAR GUILLAUME

### 1. 🔴 CRITIQUE : Upload photos - Images pas affichées

**Problème** : Quand Guillaume upload des photos, elles n'apparaissent pas (rectangles gris).

**Cause probable** :
- Mauvais chemin d'upload
- Images uploadées mais pas au bon endroit
- Ou images uploadées mais metadata mal enregistré

**Action** : Corriger `/app/api/upload/route.ts`

---

### 2. 🔴 CRITIQUE : Traductions EN/IT incomplètes

**Problème** : Traductions pas sur TOUT le texte + qualité médiocre.

**Cause** : Traductions faites à la main, partielles.

**Action** :
- Utiliser API traduction professionnelle (DeepL)
- Traduire 100% des textes
- Vérifier qualité native

---

### 3. 🟠 HAUTE : Carousel trop gros et agressif

**Problème** : Carousel homepage trop imposant.

**Action** : Réduire height de 80vh à 60vh

---

### 4. 🟠 HAUTE : Carousel défile trop vite

**Problème** : Vitesse défilement trop rapide.

**Action** : Ralentir de 5s à 8-10s

---

### 5. 🟠 HAUTE : Photo voitures rouges trop agressive

**Problème** : Photo rouge trop violente (pas sépia non plus).

**Action** : Trouver/proposer photo alternative neutre/grise

---

### 6. 🔴 CRITIQUE : Catégories photos mal définies

**Problème** : Guillaume vend :
- **Tableaux** : Uniquement atelier/expositions (PAS en ligne)
- **Photos séries numérotées** : 1/7 à 7/7, signées
- **Photos tirages illimités** : Non numérotées, infinies

**Actuellement** : Tout mélangé, pas de distinction claire.

**Action** : Refondre complètement système éditions

---

### 7. 🔴 CRITIQUE : Formats selon catégorie

**Règles Guillaume** :
- **Séries numérotées (1-7)** : PAS de A4 (trop cheap), seulement A3/A2/plus grand
- **Tirages illimités** : A4 OK
- **Formats XXL/Monumentaux** : Sur demande exceptionnelle

**Actuellement** : Pas implémenté.

**Action** : Adapter interface boutique

---

### 8. 🟠 HAUTE : Descriptions IA photos

**Demande** : Chaque photo à vendre doit avoir description générée par IA, modifiable par Guillaume dans admin.

**Actuellement** : Pas de descriptions IA.

**Action** : Intégrer Anthropic Claude Vision

---

### 9. 🟠 HAUTE : Interface admin - Catégories photos

**Demande** : Guillaume doit pouvoir classifier chaque photo :
- ☐ Tirage illimité
- ☐ Série limitée (1-7)
- ☐ Format XXL
- ☐ Format monumental

**Note** : Une photo peut être dans plusieurs catégories.

**Actuellement** : Seulement "limited" vs "open" (trop simpliste).

**Action** : Refondre metadata schema

---

### 10. 🟡 MOYENNE : Bouton Instagram trop gros

**Demande** : Remplacer gros bouton "Générer post Instagram" par logo Instagram cliquable.

**Action** : UI admin Instagram button

---

### 11. 🟡 MOYENNE : Interface admin améliorations

**Demandes** :
- Poubelle (photos supprimées mais archivées)
- Statut "À trier plus tard"
- Photos répertoriées = cachées de liste globale
- Analyse commerciale dépliable (pas visible tout le temps)

---

## RÈGLES MÉTIER VALIDÉES

### Ce qui est vendu

**Tableaux (toiles peintes)** :
- ✅ Créés par passage direct Ferrari sur toile
- ✅ Peinture industrielle, friction, chaleur
- ✅ Pièces uniques, irréplicables
- ❌ PAS vendus en ligne
- ✅ Vendus uniquement : atelier ou expositions

**Photographies** :
- ✅ Documentent l'instant où Ferrari peint
- ✅ Deux types :
  1. **Séries limitées numérotées** (1/7 à 7/7)
     - Signées par Guillaume
     - Certificat authenticité
     - Formats : A3, A2, A1, XXL, Monumental
     - PAS de A4 (trop cheap)
  2. **Tirages illimités**
     - Non numérotés
     - Quantité infinie
     - Formats : A4, A3, A2
     - Prix réduits

### Formats et pricing

**Séries numérotées (limitées à 7)** :
- A3 (29.7 x 42 cm) : €500
- A2 (42 x 59.4 cm) : €800
- A1 (59.4 x 84.1 cm) : €1200
- XXL (80 x 120 cm) : Sur devis
- Monumental (120+ cm) : Sur devis

**Tirages illimités** :
- A4 (21 x 29.7 cm) : €150
- A3 (29.7 x 42 cm) : €250
- A2 (42 x 59.4 cm) : €400

### Finitions (selon imprimeur choisi)

**Papier** :
- Giclee Fine Art (recommandé séries limitées)
- Photo standard (OK tirages illimités)

**Montages premium** :
- Alu-Dibond (si dispo)
- Acrylique (si dispo)

**Encadrement** :
- Noir
- Blanc
- Sans cadre

---

## PLAN DE CORRECTION

### Phase 1 : CRITIQUE (Aujourd'hui)

1. **Corriger bug upload photos** (30 min)
2. **Refondre schema metadata** (1h)
   - Ajouter catégories : unlimited, limited, xxl, monumental
   - Adapter works.ts
3. **Adapter formats selon catégorie** (1h)
   - Séries limitées : PAS de A4
   - Tirages illimités : A4 OK
4. **Mettre à jour CLAUDE.md** (30 min)
   - Documenter toutes les règles métier

### Phase 2 : HAUTE (Demain)

5. **Traductions professionnelles** (2h)
   - Intégrer DeepL API
   - Traduire 100% messages/fr.json → en.json + it.json
6. **Réduire carousel** (15 min)
7. **Ralentir carousel** (15 min)
8. **Changer photo voitures** (30 min)

### Phase 3 : MOYENNE (Après-demain)

9. **Descriptions IA photos** (2h)
   - Intégrer Anthropic Claude Vision
   - UI admin pour modifier descriptions
10. **Interface admin améliorations** (3h)
    - Poubelle
    - À trier
    - Cacher répertoriées
    - Analyse commerciale dépliable
11. **Bouton Instagram logo** (15 min)

---

## TIMELINE ESTIMÉE

**Aujourd'hui (7 nov)** : Phase 1 (3h) → Corrections critiques
**Demain (8 nov)** : Phase 2 (3h) → Traductions + UI
**Après-demain (9 nov)** : Phase 3 (5h) → IA + Admin avancé

**Total** : 11h réparties sur 3 jours

---

Lalou
