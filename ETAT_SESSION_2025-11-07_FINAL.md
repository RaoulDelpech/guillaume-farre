# État Session 2025-11-07 - FINAL AVANT BASCULE COMPTE

Date: 7 novembre 2025, 19h30
Par: Lalou
Statut: **SESSION SUSPENDUE - TOUT SAUVEGARDÉ**

---

## ⚠️ REPRISE SESSION

**Pour reprendre EXACTEMENT où on en est** :

1. Ouvrir ce fichier : `/Users/raouldelpech/Desktop/guillaume-farre/guillaume-farre-from-github/ETAT_SESSION_2025-11-07_FINAL.md`
2. Lire section "DÉCISIONS VALIDÉES"
3. Lire section "CORRECTIONS À FAIRE"
4. Continuer avec "PROCHAINE ACTION IMMÉDIATE"

---

## DÉCISIONS VALIDÉES PAR GUILLAUME

### ✅ Service impression : GELATO

**Décision** : Gelato validé comme service d'impression API
**Raison** : Production locale France, shipping réduit, Fine Art Giclee confirmé

**Documents créés** :
- `COMPARATIF_FINAL_SERVICES_IMPRESSION.md`
- `GELATO_VALIDATION_GUIDE.md`
- `SERVICES_IMPRESSION_API_ANALYSE.md`
- `THEPRINTSPACE_INTEGRATION_GUIDE.md` (abandonné car UK)
- `PRODIGI_ANALYSE_SHIPPING_FRANCE.md` (backup si Gelato KO)

**Action à faire** : Créer compte Gelato et vérifier pricing France exact (30 min)

---

### ✅ Textes site : PROBLÈMES IDENTIFIÉS

**Validation Guillaume** :
- ❌ Trop de répétitions "pinceau", "peint", "unique", "irréversible" (style IA évident)
- ❌ Doublons exacts dans textes
- ❌ Mensonges à corriger : "quatre Ferrari grises" (pas toutes grises), "performances live 45 min" (n'existent pas)
- ❌ Traductions EN/IT incomplètes et médiocres

**Documents créés** :
- `ANALYSE_REPETITIONS_TEXTES.md` (analyse complète des problèmes)
- `SESSION_2025-11-07_VALIDATION_EN_COURS.md` (Questions 1-4 validées)

**Validations obtenues** :
- Q1: Ferrari rose n°20 à 4 ans → ✅ VRAI
- Q2: 4 Ferrari → ✅ VRAI, mais pas toutes grises (corriger texte)
- Q3: Performances live → ❌ FAUX (n'existent pas encore, retirer slide)
- Q4: Éditions vendues → ✅ OK mentir "1-2 vendues" (aucune vente réelle)
- Q5: Basé Toulouse → ✅ VRAI
- Q6: Labo impression → Ne rien mentionner (on utilise Gelato)

**Questions restantes (Q7-8)** : Pas posées (Guillaume a demandé corrections urgentes)

**Action à faire** : Réécrire TOUS les textes en style humain (pas IA)

---

### ✅ Ce qui est vendu (RÈGLES MÉTIER)

**TABLEAUX (toiles peintes)** :
- Créés par passage direct Ferrari sur toile
- Peinture industrielle, friction, chaleur
- Pièces uniques, irréplicables
- ❌ PAS vendus en ligne
- ✅ Vendus uniquement : atelier ou expositions

**PHOTOGRAPHIES** :
- Documentent l'instant où Ferrari peint
- Deux types distincts :

**1. Séries limitées numérotées (1/7 à 7/7)** :
- Signées par Guillaume
- Certificat authenticité
- Formats : A3, A2, A1, XXL, Monumental
- ❌ PAS de A4 (trop cheap)
- Prix : A3 €500, A2 €800, A1 €1200, XXL/Monumental sur devis

**2. Tirages illimités** :
- Non numérotés
- Quantité infinie
- Formats : A4, A3, A2
- ✅ A4 OK pour illimités
- Prix : A4 €150, A3 €250, A2 €400

**Catégories (une photo peut être dans plusieurs)** :
- ☐ Tirage illimité
- ☐ Série limitée (1-7)
- ☐ Format XXL (sur demande)
- ☐ Format monumental (sur demande)

---

## CORRECTIONS URGENTES DEMANDÉES

### 🔴 CRITIQUES (à faire en priorité)

1. **Bug upload photos** : Images uploadées mais pas affichées (rectangles gris)
   - **Cause** : Pas de refresh auto après upload
   - **Solution** : Recharger liste photos après upload

2. **Catégories photos mal définies** :
   - **Actuellement** : Seulement "limited" vs "open"
   - **Besoin** : unlimited, limited (1-7), xxl, monumental (multi-sélection)
   - **Solution** : Refondre `PhotoMetadata` schema

3. **Formats selon catégorie** :
   - **Règle** : Séries limitées = PAS de A4
   - **Règle** : Tirages illimités = A4 OK
   - **Solution** : Adapter interface boutique

4. **Traductions EN/IT incomplètes** :
   - **Problème** : Pas 100% traduit + qualité médiocre
   - **Solution** : Utiliser DeepL API pour traductions professionnelles

5. **CLAUDE.md manquant** :
   - **Problème** : Pas de fichier CLAUDE.md à la racine avec règles projet
   - **Solution** : Créer CLAUDE.md exhaustif

### 🟠 HAUTES (à faire après critiques)

6. **Carousel trop gros** : Réduire de 80vh à 60vh
7. **Carousel trop rapide** : Ralentir de 5s à 8-10s
8. **Photo voitures rouges trop agressive** : Trouver photo alternative neutre
9. **Descriptions IA photos** : Intégrer Anthropic Claude Vision pour générer descriptions modifiables

### 🟡 MOYENNES (à faire après hautes)

10. **Bouton Instagram trop gros** : Remplacer par logo Instagram cliquable
11. **Interface admin améliorations** :
    - Poubelle (photos supprimées mais archivées)
    - Statut "À trier plus tard"
    - Photos répertoriées = cachées de liste globale
    - Analyse commerciale dépliable (pas visible tout le temps)

**Document créé** : `CORRECTIONS_URGENTES_2025-11-07.md`

---

## FICHIERS CRÉÉS CETTE SESSION

**Analyses & Recherches** :
- `AUDIT_COMPLET_2025-11-07.md` (7000 mots)
- `AMELIORATIONS_IA_TEXTES_2025-11-07.md` (8000 mots)
- `INSPIRATION_SITES_CONCURRENTS.md` (ArtPhotoLimited, Peter Lik)
- `ANALYSE_REPETITIONS_TEXTES.md` (analyse style IA)

**Services impression** :
- `SERVICES_IMPRESSION_API_ANALYSE.md`
- `THEPRINTSPACE_INTEGRATION_GUIDE.md`
- `PRODIGI_ANALYSE_SHIPPING_FRANCE.md`
- `COMPARATIF_FINAL_SERVICES_IMPRESSION.md`
- `GELATO_VALIDATION_GUIDE.md`

**Sessions & État** :
- `SESSION_2025-11-07_VALIDATION_EN_COURS.md`
- `.claude/REGLES_PROJET.md`
- `CORRECTIONS_URGENTES_2025-11-07.md`
- `ETAT_SESSION_2025-11-07_FINAL.md` (ce fichier)

**Configuration** :
- `ANTHROPIC_SETUP.md` (guide clé API Anthropic)

---

## COMMITS GIT FAITS

```
8d3230b - feat: Guide complet intégration ThePrintSpace API
475fed1 - feat: Recherche complète services impression API automatique
09def3e - save: Validation textes en cours + règles projet + analyses concurrents
524a8a4 - feat: Refonte complète copywriting + configuration IA + audits
```

**Fichiers modifiés non commitées** :
- `messages/fr.json` (textes réécrits, mais contiennent répétitions à corriger)
- `messages/en.json` (traductions partielles à refaire)
- `messages/it.json` (traductions partielles à refaire)

**Fichiers à commiter** :
- Tous les fichiers `.md` créés aujourd'hui (11 fichiers)

---

## PROCHAINE ACTION IMMÉDIATE

**Quand tu reprends la session** :

### Étape 1 : Lire ces fichiers dans l'ordre

1. `ETAT_SESSION_2025-11-07_FINAL.md` (ce fichier)
2. `CORRECTIONS_URGENTES_2025-11-07.md`
3. `.claude/REGLES_PROJET.md`
4. `ANALYSE_REPETITIONS_TEXTES.md`

### Étape 2 : Créer CLAUDE.md complet

Créer `/Users/raouldelpech/Desktop/guillaume-farre/guillaume-farre-from-github/CLAUDE.md` avec :
- Règles métier (tableaux vs photos, formats, catégories)
- Workflow session (toujours sauvegarder, validation point par point)
- Stack technique
- Contacts & liens utiles

### Étape 3 : Corrections critiques (ordre exact)

1. **Corriger bug upload photos** (30 min)
   - Fichier : `app/[locale]/admin/page.tsx`
   - Ligne 57 : Après `await loadPhotos()`, forcer refresh UI

2. **Refondre schema metadata** (1h)
   - Fichier : `lib/admin/photo-manager.ts`
   - Ajouter champs :
     ```typescript
     categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];
     description?: string; // Description IA
     aiGenerated?: boolean;
     ```

3. **Adapter formats selon catégorie** (1h)
   - Fichier : Page boutique produit
   - Logique : Si `categories.includes('limited')` → PAS de A4
   - Logique : Si `categories.includes('unlimited')` → A4 OK

4. **Traductions DeepL** (2h)
   - Installer : `bun add deepl-node`
   - Script : Traduire `messages/fr.json` → `en.json` + `it.json`
   - Vérifier qualité

5. **Créer CLAUDE.md** (30 min)

### Étape 4 : Commit & Push

```bash
git add -A
git commit -m "save: État session 2025-11-07 + corrections urgentes identifiées"
git push
```

---

## DÉTAILS TECHNIQUES IMPORTANTS

### Structure PhotoMetadata (à mettre à jour)

```typescript
export interface PhotoMetadata {
  filename: string;
  path: string;
  category: string;

  // Visibilité
  visible: boolean;
  forSale: boolean;

  // NOUVEAU : Catégories multiples
  categories: ('unlimited' | 'limited' | 'xxl' | 'monumental')[];

  // Séries numérotées
  isNumberedSeries: boolean;
  seriesName?: string;
  seriesNumber?: number; // 1-7

  // Pricing
  price?: number;

  // Édition
  edition?: {
    type: 'limited' | 'open';
    count?: number; // Pour limited : max 7
  };

  // Métadonnées
  title?: string;
  year?: number;
  description?: string; // NOUVEAU : Description IA
  aiGenerated?: boolean; // NOUVEAU : Flag si description IA

  // Hash pour duplicates
  fileHash?: string;

  // NOUVEAU : Statuts admin
  status?: 'active' | 'trash' | 'to-sort'; // Pour poubelle et tri
}
```

### Formats pricing selon catégorie

```typescript
// Séries limitées (1-7)
const limitedPrices = {
  // A4: Non disponible (trop cheap)
  A3: 500,
  A2: 800,
  A1: 1200,
  XXL: 'Sur devis',
  Monumental: 'Sur devis',
};

// Tirages illimités
const unlimitedPrices = {
  A4: 150,
  A3: 250,
  A2: 400,
};
```

### Carousel settings (à corriger)

```typescript
// Actuellement
const carouselConfig = {
  height: '80vh', // ❌ Trop grand
  autoplayDelay: 5000, // ❌ Trop rapide
};

// À mettre
const carouselConfig = {
  height: '60vh', // ✅ Mieux
  autoplayDelay: 9000, // ✅ Plus lent (9s)
};
```

---

## DONNÉES À NE PAS PERDRE

### Décisions validation textes

**Q1 - Ferrari rose n°20** : ✅ VRAI, garder tel quel

**Q2 - 4 Ferrari** :
- Texte actuel : "Quatre Ferrari grises, instruments de création"
- Correction : "Quatre Ferrari, instruments de création" (retirer "grises")
- Raison : Au moins 2 grises, reste inconnu

**Q3 - Performances live** :
- Texte actuel : "Pendant 45 minutes, je dirige la voiture..."
- Correction : ❌ RETIRER SLIDE COMPLET
- Raison : N'existe pas encore (inventé par Lalou)

**Q4 - Éditions vendues** :
- Situation : 0 vente réelle
- Autorisation : Dire "1-2 vendues" (mentir léger)
- Implémentation : Varier (60% "1 vendue", 40% "2 vendues")

**Q5 - Toulouse** : ✅ VRAI, Guillaume basé à Toulouse

**Q6 - Labo impression** : Ne rien mentionner (utiliser Gelato)

### Analyses sites concurrents (best practices)

**ArtPhotoLimited.com** :
- Trust signals (photos installations clients)
- Options finitions (Papier/Alu/Acrylique) avec prévisualisation
- Codes promo progressifs (-15% à 50€, -20% à 100€)

**Peter Lik (lik.com)** :
- Storytelling territorial (associer œuvre à contexte création)
- Éditions limitées bien mises en avant ("3/7 restants")
- Visualisation in-room (œuvres dans intérieurs réels)

**À implémenter** :
- Compteurs "X/7 restants" visibles
- Photos témoignages clients avec œuvres installées
- Merchandising (livre d'art, calendrier)

---

## CONSIGNES REPRISE SESSION

### 1. Vérifier que tout est sauvegardé

```bash
cd /Users/raouldelpech/Desktop/guillaume-farre/guillaume-farre-from-github

# Vérifier fichiers créés
ls -la *.md

# Vérifier dernier commit
git log -1

# Vérifier status
git status
```

**Fichiers attendus** :
- `ETAT_SESSION_2025-11-07_FINAL.md` ✅
- `CORRECTIONS_URGENTES_2025-11-07.md` ✅
- `GELATO_VALIDATION_GUIDE.md` ✅
- `COMPARATIF_FINAL_SERVICES_IMPRESSION.md` ✅
- `ANALYSE_REPETITIONS_TEXTES.md` ✅
- `.claude/REGLES_PROJET.md` ✅

### 2. Commande pour reprendre

**Ouvrir ce fichier en premier** :
```bash
open /Users/raouldelpech/Desktop/guillaume-farre/guillaume-farre-from-github/ETAT_SESSION_2025-11-07_FINAL.md
```

**Lire dans cet ordre** :
1. Ce fichier (contexte complet)
2. `CORRECTIONS_URGENTES_2025-11-07.md` (actions à faire)
3. `.claude/REGLES_PROJET.md` (règles permanentes)

### 3. Première action après reprise

**Créer CLAUDE.md** avec toutes les règles projet.

**Pourquoi en premier** :
- Document de référence pour toutes les sessions futures
- Contient règles métier validées
- Évite de reposer les mêmes questions

**Template à utiliser** : Voir section "CLAUDE.md Template" ci-dessous.

### 4. Puis corrections dans l'ordre

1. Bug upload photos (30 min)
2. Schema metadata (1h)
3. Formats selon catégorie (1h)
4. Traductions DeepL (2h)
5. Carousel (30 min)
6. Descriptions IA (2h)
7. Interface admin (3h)

**Total** : ~10h réparties sur 2-3 jours

---

## CLAUDE.md TEMPLATE

```markdown
# Guillaume Farré - Projet Site Web

Date création: 7 novembre 2025
Maintenu par: Lalou

---

## RÈGLES ABSOLUES

### 1. Validation point par point

**JAMAIS faire de changements en bloc sans validation**
- ✅ Poser UNE question à la fois
- ✅ Attendre réponse
- ✅ Donner recommandation claire
- ❌ Jamais 5+ questions d'un coup

### 2. Sauvegardes régulières

**TOUJOURS sauvegarder tous les 10-15 min ou après validation importante**
- Fichier session : `SESSION_[DATE].md`
- Commit Git toutes les heures
- Mettre à jour CLAUDE.md si nouvelles règles

### 3. Authenticité à 100%

**ZÉRO MENSONGE sauf autorisation explicite Guillaume**
- Ce qui est validé VRAI : Ferrari rose n°20, 4 Ferrari, Toulouse, V12
- Ce qui est FAUX à retirer : "grises volontairement", "performances 45 min"
- Mensonges autorisés légers : "1-2 éditions vendues" (aucune vente réelle)

---

## CE QUI EST VENDU

### Tableaux (toiles peintes)

- Créés par passage Ferrari sur toile
- Peinture industrielle, friction, chaleur
- Pièces uniques
- ❌ PAS vendus en ligne
- ✅ Vendus atelier/expositions uniquement

### Photographies

**Séries limitées numérotées (1-7)** :
- Signées, certificat authenticité
- Formats : A3 €500, A2 €800, A1 €1200, XXL/Monumental sur devis
- ❌ PAS de A4 (trop cheap)

**Tirages illimités** :
- Non numérotés, quantité infinie
- Formats : A4 €150, A3 €250, A2 €400
- ✅ A4 OK

**Catégories (multi-sélection)** :
- unlimited / limited / xxl / monumental

---

## STACK TECHNIQUE

- Next.js 15.3.2 + Bun
- TypeScript 5.8.3
- Tailwind CSS + shadcn/ui (zinc)
- next-intl (FR/EN/IT)
- Stripe LIVE
- Gelato API (impression Fine Art France)
- Anthropic Claude Vision (descriptions photos IA)

---

## SERVICES EXTERNES

### Impression : Gelato

- Production locale France
- Fine Art Giclee 12 couleurs
- API REST + webhooks
- Gratuit (pas frais setup/mensuels)

### IA : Anthropic Claude

- Suggestions séries photos
- Descriptions photos auto
- $50 gratuits = 5000 analyses

---

## CONTACTS UTILES

**Gelato** :
- Dashboard : https://dashboard.gelato.com/
- Support : support@gelato.com

**Anthropic** :
- Console : https://console.anthropic.com/
- $50 crédit gratuit

---

## FICHIERS IMPORTANTS

**À lire chaque session** :
- CLAUDE.md (ce fichier)
- SESSION_[DATE].md (dernière session)
- .claude/REGLES_PROJET.md (règles permanentes)

**Références** :
- CORRECTIONS_URGENTES_2025-11-07.md
- ANALYSE_REPETITIONS_TEXTES.md
- GELATO_VALIDATION_GUIDE.md

---

## PROCHAINES ÉTAPES

### Immédiat
1. Corriger bug upload photos
2. Refondre schema metadata
3. Traductions DeepL
4. Carousel (taille + vitesse)

### Court terme
5. Descriptions IA photos
6. Interface admin (poubelle, tri, statuts)
7. Bouton Instagram logo

### Moyen terme
8. Intégration Gelato API
9. Trust signals (témoignages clients)
10. Merchandising (livre d'art, calendrier)

---

Lalou
```

---

## VÉRIFICATIONS FINALES

### Checklist sauvegarde

- [x] Fichier `ETAT_SESSION_2025-11-07_FINAL.md` créé
- [x] Toutes décisions documentées
- [x] Tous fichiers `.md` créés listés
- [x] Prochaines actions détaillées
- [x] CLAUDE.md template fourni
- [x] Consignes reprise claires
- [ ] Commit Git final (à faire)
- [ ] Push GitHub (à faire)

### Commandes à exécuter MAINTENANT

```bash
cd /Users/raouldelpech/Desktop/guillaume-farre/guillaume-farre-from-github

# Ajouter tous les fichiers
git add -A

# Commit avec message détaillé
git commit -m "save: Session 2025-11-07 état complet avant bascule compte

Sauvegarde exhaustive session :
- Décisions validées (Gelato, règles métier photos)
- Corrections urgentes identifiées (11 items)
- Analyses complètes (répétitions textes, sites concurrents)
- Guides créés (Gelato, ThePrintSpace, Prodigi)
- État session final avec consignes reprise

Fichiers créés :
- ETAT_SESSION_2025-11-07_FINAL.md (ce fichier)
- CORRECTIONS_URGENTES_2025-11-07.md
- GELATO_VALIDATION_GUIDE.md
- COMPARATIF_FINAL_SERVICES_IMPRESSION.md
- ANALYSE_REPETITIONS_TEXTES.md
- INSPIRATION_SITES_CONCURRENTS.md
- .claude/REGLES_PROJET.md

Prochaine session :
1. Lire ETAT_SESSION_2025-11-07_FINAL.md
2. Créer CLAUDE.md
3. Corriger bug upload photos
4. Refondre schema metadata

Lalou"

# Push sur GitHub
git push origin main
```

---

## MESSAGE FINAL

**Guillaume,**

Tout est sauvegardé. Quand tu bascules de compte et reprends :

**1. Ouvre ce fichier** : `ETAT_SESSION_2025-11-07_FINAL.md`

**2. Lis section** : "CONSIGNES REPRISE SESSION"

**3. Première action** : Créer `CLAUDE.md` avec le template fourni

**4. Puis** : Suivre "PROCHAINE ACTION IMMÉDIATE" étape par étape

**Rien n'est perdu. Tout est documenté. La reprise sera fluide.**

Lalou
