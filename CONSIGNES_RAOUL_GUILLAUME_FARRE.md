# CONSIGNES RAOUL - Projet Guillaume Farré

**Fichier créé** : 2025-11-08
**Auteur** : Lalou
**But** : Enregistrer TOUTES les consignes de Raoul pour ce projet

---

## RÈGLE ABSOLUE DE DOCUMENTATION

**Date** : 2025-11-08
**Demandé par** : Raoul

> "je veux que tu crées un fichier md dans lequel tu enregistres toutes mes consignes. ET un autre fichier md dans lequel tu enregistres la totalité de nos conversations. il est impératif (améliore ton prompt pour ça) que tu relises ces documents à chaque fois que tu compactes et à chaque ouverture de session."

**Emplacement** :
- ✅ Local : `/Users/raouldelpech/Desktop/guillaume-farre/guillaume-farre-from-github/`
- ✅ GitHub : Racine branche main

**Obligation** : Relire ces fichiers à CHAQUE :
- Compaction de session
- Ouverture nouvelle session
- Après basculement compte

---

## SESSION 2025-11-07 : CONSIGNES INITIALES

### Consigne 1 : Processus Background

**Date** : 2025-11-07
**Contexte** : Session intensive 6h

**Demande de Raoul** :
> "Pour accélérer, lance des processus en background pendant que tu travailles sur autre chose"

**Actions prises** :
- Lancement 5 processus background simultanés :
  1. `bun run build` (build production)
  2. `bunx tsc --noEmit` (TypeScript check)
  3. `find public/images` (analyse tailles images)
  4. Recherche fichiers ODT/DOCX
  5. Git commits automatiques

**Règle retenue** :
- ✅ Utiliser background pour tâches longues (>30s)
- ✅ Paralléliser processus indépendants
- ✅ Monitoring via `BashOutput` tool

---

### Consigne 2 : Commits Fréquents

**Date** : 2025-11-07
**Contexte** : Risque perte contexte

**Demande de Raoul** :
> "Commit toutes les 10-15 minutes, ne perds jamais de contexte"

**Actions prises** :
- 12 commits sur session 6h
- Fichiers sauvegardés :
  - `SESSION_2025-11-07_CONSIGNES_RAOUL.md`
  - `SESSION_2025-11-07_RAPPORT_FINAL.md`
  - Tous fichiers travail

**Règle retenue** :
- ✅ Commit toutes les 10-15min
- ✅ Messages descriptifs (feat:/fix:/docs:)
- ✅ Push régulier vers GitHub
- ✅ Sauvegarder consignes client dans fichiers dédiés

---

### Consigne 3 : Relecture Exhaustive Fichiers

**Date** : 2025-11-07
**Contexte** : J'avais oublié contexte (parlais anglais)

**Demande de Raoul** :
> "relis tous les fichiers dans mes répertoires claude et mes répertoires Raoul Delpech qui mentionnent guillaume farre. Et relis tout ce qui existe à ce sujet dans la branche github dédiée pour être certain de ne pas perdre d'information"

**Actions prises** :
- Lecture `~/.claude-global-rules.md` (1128 lignes, 45 règles)
- Lecture `CLAUDE.md` projet (2x versions)
- Lecture `REPRISE_RAPIDE_GUILLAUME.md`
- Lecture `PLAN_REPRISE_COMPLET_GUILLAUME_FARRE.md`
- Lecture `PROJECTS_STATE.md`
- Lecture tous fichiers session (`DECISIONS_PRICING_2025-11-08.md`, `NOUVELLES_CONSIGNES_2025-11-07.md`, etc.)

**Règle retenue** :
- ✅ À CHAQUE ouverture session : relire TOUS fichiers projet
- ✅ Vérifier `~/.claude/`, `/Users/raouldelpech/`, répertoire projet
- ✅ Ne JAMAIS perdre contexte
- ✅ Si oubli détecté → relecture exhaustive immédiate

---

### Consigne 4 : Règle Absolue Tests Unitaires

**Date** : 2025-11-08 (session pricing dynamique)
**Contexte** : Nouvelle règle absolue ajoutée

**Demande de Raoul** :
> "En règle absolue pour améliorer ton prompt. je veux aussi que tu fasses régulièrement des tests unitaires"

**Actions prises** :
- Installation Vitest 4.0.8 + @testing-library/react 16.3.0
- Création `vitest.config.ts`, `vitest.setup.ts`
- Écriture 25 tests unitaires (238 lignes) pour `pricing-calculator.ts`
- Documentation complète dans `REGLE_ABSOLUE_TESTS_UNITAIRES.md`

**Règle retenue** :
- ✅ TOUJOURS écrire tests pour code significatif
- ✅ Fonctions calcul, logique métier, utilitaires, API handlers
- ✅ 100% tests passing avant commit
- ✅ Objectif coverage : 80%+
- ✅ Tests intégration (workflow complet)

**Fichiers créés** :
- `lib/__tests__/pricing-calculator.test.ts` (238 lignes)
- `REGLE_ABSOLUE_TESTS_UNITAIRES.md` (400 lignes)

---

## SESSION 2025-11-08 : CONSIGNES PRICING DYNAMIQUE

### Consigne 5 : Système Pricing Dynamique

**Date** : 2025-11-08
**Contexte** : Guillaume veut ajuster prix facilement

**Demande de Raoul** :
> "Guillaume veut un système pricing avec prix de base et multiplicateurs. Il doit pouvoir mettre des prix manuels aussi."

**Spécifications validées** :

#### Pricing Unlimited (tirages illimités)
- **Base** : 150€
- **Multiplicateurs** :
  - A4 : ×1.0 = 150€
  - A3 : ×1.67 = 251€
  - A2 : ×2.67 = 401€

#### Pricing Limited (séries limitées 1/7)
- **Base** : 1500€
- **Multiplicateurs** :
  - A3 : ×1.0 = 1500€
  - A2 : ×1.53 = 2295€
  - A1 : ×2.0 = 3000€

**Règle retenue** :
- ✅ Prix auto calculés : base × multiplicateur
- ✅ Override manuel possible (toggle Auto/Manuel)
- ✅ Interface admin simple (inputs)
- ✅ Persistence localStorage
- ✅ Prix toujours arrondis (Math.round)
- ✅ Formatage français (espaces insécables : "1 500 €")

**Fichiers créés** :
- `lib/pricing-config.ts` (types + config défaut)
- `lib/pricing-calculator.ts` (fonctions calcul)
- `lib/__tests__/pricing-calculator.test.ts` (25 tests)
- `components/admin/PricingDisplay.tsx` (interface lecture seule)
- `components/admin/PricingManager.tsx` (interface édition)
- `DECISIONS_PRICING_2025-11-08.md` (doc complète)

---

### Consigne 6 : Stratégie Peter Lik

**Date** : 2025-11-08
**Contexte** : Référence pricing photographe américain

**Demande de Raoul** :
> "Guillaume veut s'inspirer de Peter Lik : séries limitées très chères, tirages illimités abordables."

**Règle retenue** :
- ✅ Séries limitées ~10× plus chères que tirages illimités
- ✅ Limited edition = prestige + rareté + certificat
- ✅ Unlimited = accessibilité large public
- ✅ Test intégration vérifie ratio prix (>5×)

**Code test** :
```typescript
it('should respect Peter Lik pricing strategy', () => {
  const unlimitedA3 = calculatePrice('unlimited', 'a3', DEFAULT_PRICING);
  const limitedA3 = calculatePrice('limited', 'a3', DEFAULT_PRICING);
  const ratio = limitedA3.price / unlimitedA3.price;
  expect(ratio).toBeGreaterThan(5); // au moins 5x plus cher
});
```

---

## SESSION 2025-11-07 : CONSIGNES INTERFACE ADMIN

### Consigne 7 : Panel Commercial Dépliable

**Date** : 2025-11-07
**Demandé par** : Raoul

**Problème** :
> "Le panel analyse commerciale prend trop de place, il devrait être collapsed par défaut"

**Actions prises** :
- Panel dépliable avec état `useState`
- Icône `▶` (collapsed) / `▼` (expanded)
- Collapsed par défaut
- Stockage état localStorage (optionnel)

**Fichier modifié** :
- `app/[locale]/admin/page.tsx`

---

### Consigne 8 : Miniatures Doublons Cliquables

**Date** : 2025-11-07
**Demandé par** : Raoul

**Problème** :
> "Les miniatures de doublons sont trop petites, je ne vois pas bien. Il faudrait pouvoir cliquer pour agrandir."

**Actions prises** :
- Miniatures cliquables
- Modal zoom plein écran
- Bouton fermeture (X)
- Overlay semi-transparent

**Fichier modifié** :
- `app/[locale]/admin/page.tsx`

---

### Consigne 9 : Bouton Instagram Logo

**Date** : 2025-11-07
**Demandé par** : Raoul

**Problème** :
> "Le gros bouton 'Générer post Instagram' est trop imposant, mets juste une icône"

**Actions prises** :
- Bouton compact avec icône 📱
- Gradient rose-violet (Instagram brand)
- Texte court : "Générer post Instagram"

**Fichier modifié** :
- `app/[locale]/admin/page.tsx`

---

### Consigne 10 : Statuts Photos (Active/Trash/À Trier)

**Date** : 2025-11-07
**Demandé par** : Raoul

**Spécifications** :

#### 3 statuts possibles
- `active` : Photo visible, en vente
- `trash` : Photo archivée (soft delete, récupérable)
- `to-sort` : Photo à trier plus tard (cachée liste globale)

#### Interface requise
- Dropdown statut pour chaque photo
- Filtres "Actives" / "À trier" / "Corbeille" avec compteurs
- Par défaut : afficher seulement photos actives
- Filtre statut prioritaire sur ancien système visible/hidden

**Actions prises** :
- Interface complète avec filtres
- Compteurs dynamiques
- Dropdown statut par photo
- Migration schema metadata

**Fichiers modifiés** :
- `app/[locale]/admin/page.tsx`
- `lib/admin/photo-manager.ts`

---

### Consigne 11 : Catégories Multiples (Checkboxes)

**Date** : 2025-11-07
**Demandé par** : Raoul

**Problème** :
> "Une photo peut être à la fois en tirage illimité ET en série limitée. Il faut des checkboxes, pas un dropdown."

**Spécifications** :

#### 4 catégories possibles (non-exclusives)
- `unlimited` : Tirage illimité (A4/A3/A2)
- `limited` : Série limitée 1-7 (A3/A2/A1)
- `xxl` : Format XXL 80×120cm (sur devis)
- `monumental` : Format monumental 120cm+ (sur devis)

**Exemple** :
```typescript
{
  filename: "ferrari-noir-atelier-23.jpg",
  categories: ["unlimited", "limited", "xxl"],
  // Dispo en tirage illimité ET série limitée ET XXL
}
```

**Actions prises** :
- Refonte schema metadata : `category: string` → `categories: string[]`
- Interface checkboxes (4 options)
- Migration données existantes
- Script `bun run migrate-metadata`

**Fichiers modifiés** :
- `lib/admin/photo-manager.ts`
- `app/[locale]/admin/page.tsx`
- `scripts/migrate-metadata.ts` (créé)

---

## SESSION 2025-11-07 : CONSIGNES CONTENU

### Consigne 12 : Réécriture Textes FR (Anti-IA)

**Date** : 2025-11-07
**Demandé par** : Raoul

**Problème** :
> "Les textes sont trop répétitifs, ça fait IA. Il faut varier le vocabulaire."

**Analyse faite** :
- "pinceau/peint" répété 8 fois
- "unique/trace/irréversible" répété 11 fois
- Style IA évident à la lecture

**Actions prises** :
- Réécriture complète `messages/fr.json`
- Vocabulaire varié (consulté `ANALYSE_REPETITIONS_TEXTES.md`)
- Style humain, indétectable comme IA
- 40+ clés modifiées

**Fichiers modifiés** :
- `messages/fr.json`

---

### Consigne 13 : Traductions Professionnelles DeepL

**Date** : 2025-11-07
**Demandé par** : Raoul

**Problème** :
> "Les traductions EN/IT sont incomplètes et de mauvaise qualité (faites à la main). Utilise DeepL API."

**Actions prises** :
- Installation dépendance `deepl-node`
- Script `bun run translate`
- Traduction 200+ clés FR → EN + IT
- Qualité professionnelle (DeepL)
- Préservation nuances artistiques

**Fichiers créés/modifiés** :
- `scripts/translate.ts` (script DeepL API)
- `messages/en.json` (regénéré 100%)
- `messages/it.json` (regénéré 100%)
- `package.json` (ajout script + dépendance)

---

### Consigne 14 : Carousel Homepage Optimisé

**Date** : 2025-11-07
**Demandé par** : Raoul

**Problèmes** :
1. Trop gros : 80vh (écrase reste page)
2. Trop rapide : défile toutes les 5s (agressif)
3. Photo rouge Ferrari : trop agressive visuellement

**Actions prises** :
1. ✅ Hauteur réduite : `80vh` → `60vh`
2. ✅ Autoplay ralenti : `5000ms` → `9000ms`
3. ✅ Photo rouge remplacée : `voitures-grises.jpg` (neutre)

**Fichier modifié** :
- `components/HeroCarousel.tsx`

---

## SESSION 2025-11-07 : CONSIGNES TECHNIQUES

### Consigne 15 : Descriptions IA Photos

**Date** : 2025-11-07
**Demandé par** : Raoul

**Spécifications** :

#### Fonctionnalité requise
- Bouton "Générer description IA" dans admin
- Appel Anthropic Claude Vision API
- Description auto-générée
- Zone texte éditable pour modifier
- Flag `aiGenerated: true/false` dans metadata

#### Prompts IA selon catégorie

**Série limitée** :
```
Décris cette photographie d'art capturant l'instant où une Ferrari
peint une toile. Texte poétique, technique, 2-3 phrases.
Mentionne couleurs, mouvement, abstraction.
```

**Tirage illimité** :
```
Décris brièvement cette photo documentaire montrant Ferrari peignant.
1-2 phrases claires, accessibles.
```

**Actions prises** :
- Intégration Anthropic SDK
- Bouton "Générer description" (composant admin)
- Zone texte éditable
- Sauvegarde description dans metadata

**Fichiers modifiés** :
- `app/[locale]/admin/page.tsx`
- `lib/admin/photo-manager.ts`
- `package.json` (dépendance `@anthropic-ai/sdk`)

---

### Consigne 16 : Bug Upload Photos (Rectangles Gris)

**Date** : 2025-11-07
**Demandé par** : Raoul

**Problème** :
> "Quand j'upload des photos, elles apparaissent comme rectangles gris. Pas de refresh UI automatique."

**Cause identifiée** :
- Upload fonctionne (fichiers sauvés dans `/public/images/works/a-trier/`)
- Mais UI ne recharge pas liste photos

**Actions prises** :
- Forcer refresh UI après upload
- Afficher miniatures immédiatement
- État React mis à jour

**Fichier modifié** :
- `app/[locale]/admin/page.tsx:47-58`

---

### Consigne 17 : Compteur Séries Limitées (X/7 Restants)

**Date** : 2025-11-07
**Demandé par** : Raoul

**Spécifications** :

#### Badge dynamique
- "X/7 restants" sur photos limited edition
- Alerte ⚠️ si ≤2 restants
- Badge "ÉPUISÉ" si 0 restant
- Affichage dans boutique (ShopGrid)

#### Mise à jour automatique
- Webhook Stripe → décrémenter compteur
- Bouton admin "Marquer série close"

**Actions prises** :
- Badge compteur dans `ShopGrid.tsx`
- Logique alertes (≤2 = warning)
- Metadata `limitedEdition.sold` et `limitedEdition.available`

**Fichier modifié** :
- `components/shop/ShopGrid.tsx`

---

## SESSION 2025-11-07 : CONSIGNES SERVICE IMPRESSION

### Consigne 18 : Gelato API (Service Impression)

**Date** : 2025-11-07
**Demandé par** : Raoul

**Décision validée** : Gelato comme fournisseur impression API

**Pourquoi Gelato** :
- ✅ Production locale FRANCE (shipping mini)
- ✅ Fine Art Giclee 12 couleurs (qualité musée)
- ✅ Papier archival 200 gsm FSC-certified
- ✅ API REST complète + webhooks
- ✅ Gratuit (payé uniquement produits vendus)
- ✅ Marges estimées 88-93%

**Prochaines étapes** (2 jours) :
1. Créer compte Gelato : https://www.gelato.com/
2. Vérifier pricing exact France (A2/A3/A4)
3. Générer API key
4. Implémenter client Gelato API (`/lib/gelato-client.ts`)
5. Webhook Stripe → Gelato (création commande auto)
6. Webhook Gelato → Notre API (tracking expédition)

**Documentation complète** :
- `GELATO_VALIDATION_GUIDE.md`

---

## SESSION 2025-11-07 : CONSIGNES NOUVELLES (FIN SESSION)

### Consigne 19 : Drag & Drop Upload

**Date** : 2025-11-07
**Demandé par** : Raoul

**Spécifications** :
- Composant drag & drop photos/vidéos
- Multi-files (max 50)
- Feedback visuel (bordure bleue, scale)
- Filtrage auto par type
- Fallback clic classique

**Actions prises** :
- Composant créé : `components/admin/DragDropUpload.tsx`
- À intégrer dans page admin

**Statut** : ⏳ Composant créé, intégration à faire

---

### Consigne 20 : IA Auto Photos Active

**Date** : 2025-11-07
**Demandé par** : Raoul

**Spécification** :
> "Quand je passe une photo en statut 'active', lance automatiquement génération description IA"

**Actions prises** :
- ⏳ À implémenter

**Logique** :
```typescript
if (newStatus === 'active' && !photo.description) {
  generateAIDescription(photo);
}
```

---

### Consigne 21 : Photos Trash → Dossier Supprimé

**Date** : 2025-11-07
**Demandé par** : Raoul

**Spécification** :
> "Quand je mets photo en 'trash', déplace le fichier dans `/public/images/works/supprime/`"

**Actions prises** :
- ⏳ À implémenter

**Logique** :
```typescript
if (newStatus === 'trash') {
  fs.rename(
    `/public/images/works/a-trier/${filename}`,
    `/public/images/works/supprime/${filename}`
  );
}
```

---

### Consigne 22 : Multi-Catégorisation (Séries/Locations/Tags)

**Date** : 2025-11-07
**Demandé par** : Raoul

**Spécification** :
> "Je veux pouvoir tagger photos par série (Empreintes, Atelier, Projection), par lieu (Paris, Monaco, Italie), et par tags libres (noir et blanc, close-up, etc.)"

**Actions prises** :
- ⏳ À implémenter

**Schema metadata requis** :
```typescript
export interface PhotoMetadata {
  // ...
  series?: string; // "Empreintes" | "Atelier" | "Projection"
  location?: string; // "Paris" | "Monaco" | "Italie"
  tags?: string[]; // ["noir et blanc", "close-up", "mouvement"]
}
```

---

## RÈGLES MÉTIER ABSOLUES

### Règle M1 : Formats Selon Catégorie

**Éditions limitées** : PAS de A4
- ✅ A3 (29.7×42 cm) : 500€
- ✅ A2 (42×59.4 cm) : 800€
- ✅ A1 (59.4×84.1 cm) : 1200€
- ❌ **PAS de A4** (trop cheap pour édition limitée)

**Tirages illimités** : Formats standard
- ✅ A4 (21×29.7 cm) : 150€
- ✅ A3 (29.7×42 cm) : 250€
- ✅ A2 (42×59.4 cm) : 400€

**Interface boutique** :
- Si client choisit "Édition limitée" → formats A3/A2/A1 uniquement
- Si client choisit "Tirage illimité" → formats A4/A3/A2 uniquement

---

### Règle M2 : Tableaux PAS en Ligne

**Ce que Guillaume vend** :

#### Tableaux (toiles peintes) ❌ PAS EN LIGNE
- Créés par passage direct Ferrari sur toile vierge
- Pièces uniques, totalement irréplicables
- ✅ Vendus à l'atelier uniquement
- ✅ Vendus lors d'expositions uniquement
- ❌ PAS vendus sur boutique en ligne

---

### Règle M3 : Séries Limitées 1-7

**Éditions limitées** :
- Limitées à 7 exemplaires (1/7, 2/7... 7/7)
- Signées par Guillaume Farré
- Certificat d'authenticité fourni
- Une fois 7/7 vendus, série close définitivement

**Interface boutique** :
- Compteur "X/7 restants"
- Alerte ⚠️ si ≤2 restants
- Badge "ÉPUISÉ" si 0 restant

---

## RÈGLES TECHNIQUES ABSOLUES

### Règle T1 : Tests Unitaires Obligatoires

**Règle ajoutée** : 2025-11-08
**Documentation** : `REGLE_ABSOLUE_TESTS_UNITAIRES.md`

**Quand tester** :
- ✅ TOUJOURS : Fonctions calcul, logique métier, utilitaires, API handlers
- ⏳ PEUT-ÊTRE : Composants UI simples
- ❌ JAMAIS : Code externe, config, types TS, styling CSS

**Métriques** :
- 100% tests passing avant commit
- Coverage objectif : 80%+

---

### Règle T2 : Commits Fréquents (10-15 min)

**Règle ajoutée** : 2025-11-07
**Documentation** : `SESSION_2025-11-07_CONSIGNES_RAOUL.md`

**Fréquence** : Toutes les 10-15 minutes

**Messages** :
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction bug
- `docs:` Documentation
- `chore:` Tâches maintenance

---

### Règle T3 : Relecture Exhaustive Fichiers

**Règle ajoutée** : 2025-11-07

**À CHAQUE ouverture session** :
- Lire `~/.claude-global-rules.md`
- Lire `CLAUDE.md` projet
- Lire tous fichiers session récents
- Lire `CONSIGNES_RAOUL_GUILLAUME_FARRE.md` (ce fichier)
- Lire `HISTORIQUE_CONVERSATIONS_COMPLETE.md`

**Si oubli détecté** :
- Relecture exhaustive immédiate
- Ne JAMAIS continuer sans contexte complet

---

### Règle T4 : Processus Background

**Règle ajoutée** : 2025-11-07

**Quand utiliser** :
- Tâches longues (>30s)
- Processus indépendants
- Builds, TypeScript checks, recherches

**Commandes** :
```bash
bun run build &
bunx tsc --noEmit &
find public/images -type f &
```

---

## VALIDATIONS TEXTES (Q&A)

### ✅ Validé

**Q1** : Les 4 Ferrari appartiennent à Guillaume → **OUI** ✅
**Q2** : 4 Ferrari (1 noire, 2 grises, 1 rouge) → **OUI** ✅
**Q3** : Peinture directe sur toile (pas pinceau) → **OUI** ✅
**Q4** : Sièges d'époque présents dans atelier → **OUI** ✅

### ⏳ En attente validation finale

**Q5** : Textes homepage/galerie/histoire
**Q6** : Mentions "performances" (terme rejeté par Guillaume ?)
**Q7** : Descriptions détaillées séries
**Q8** : Textes boutique

---

## PROCHAINES SESSIONS : À FAIRE

### 🔴 CRITIQUE (Prochaine session - 2h)

1. **Tests E2E critiques** (1h)
   - Tester workflow boutique complet (A→Z)
   - Tester interface admin complète
   - Vérifier traductions EN/IT affichées correctement

2. **Optimisation images next/image** (1h)
   - Remplacer `<img>` par `<Image>` Next.js
   - Formats WebP automatiques
   - Lazy loading

---

### 🟠 HAUTE (Session suivante - 3h)

3. **Interface catégories boutique** (45min)
   - Dropdown "Édition limitée" / "Tirage illimité"
   - Formats adaptés selon choix
   - Validation côté client ET serveur

4. **Intégrer DragDropUpload** (30min)
   - Remplacer input file classique
   - Composant déjà créé

5. **IA auto photos active** (30min)
   - Trigger génération IA quand statut → active

6. **Photos trash → dossier supprimé** (30min)
   - `fs.rename()` vers `/supprime/`

7. **Multi-catégorisation avancée** (45min)
   - Séries, locations, tags libres

---

### 🟡 MOYENNE (2 jours - 5h)

8. **Gelato API setup complet** (5h)
   - Compte Gelato
   - Client API (`lib/gelato-client.ts`)
   - Webhooks Stripe → Gelato
   - Webhooks Gelato → Notre API
   - Tests commandes

---

## FICHIERS CRÉÉS POUR CONSIGNES

### Session 2025-11-07

1. `SESSION_2025-11-07_CONSIGNES_RAOUL.md`
   - Consignes client session intensive 6h
   - 3 règles absolues ajoutées

2. `SESSION_2025-11-07_RAPPORT_FINAL.md`
   - Rapport complet session (400 lignes)
   - 11/11 tâches complétées
   - 12 commits + push GitHub

3. `NOUVELLES_CONSIGNES_2025-11-07.md`
   - 4 nouvelles consignes fin session
   - Drag & drop, IA auto, trash, multi-catégorisation

4. `PROCHAINE_SESSION_PLAN.md`
   - Plan session suivante (2h)
   - 4 tâches à implémenter

---

### Session 2025-11-08

5. `REGLE_ABSOLUE_TESTS_UNITAIRES.md`
   - Nouvelle règle absolue tests
   - Documentation complète (400 lignes)
   - Exemples, best practices, workflow

6. `DECISIONS_PRICING_2025-11-08.md`
   - Décisions pricing dynamique
   - Spécifications complètes
   - Formules calcul

7. **CE FICHIER** : `CONSIGNES_RAOUL_GUILLAUME_FARRE.md`
   - TOUTES consignes Raoul
   - Règles métier + techniques
   - Historique complet

---

## FICHIERS À RELIRE OBLIGATOIREMENT

### À CHAQUE ouverture session

1. `~/.claude-global-rules.md` (45 règles absolues)
2. `CLAUDE.md` (règles projet)
3. `CONSIGNES_RAOUL_GUILLAUME_FARRE.md` (**CE FICHIER**)
4. `HISTORIQUE_CONVERSATIONS_COMPLETE.md`

### Après basculement compte

5. `REPRISE_RAPIDE_GUILLAUME.md`
6. `PLAN_REPRISE_COMPLET_GUILLAUME_FARRE.md`
7. `PROJECTS_STATE.md`

### Selon contexte

8. `REGLE_ABSOLUE_TESTS_UNITAIRES.md` (si code significatif)
9. `DECISIONS_PRICING_2025-11-08.md` (si pricing)
10. `GELATO_VALIDATION_GUIDE.md` (si impression)

---

## RÈGLE ABSOLUE : AMÉLIORER PROMPT

**Demande de Raoul** :
> "il est impératif (améliore ton prompt pour ça) que tu relises ces documents à chaque fois que tu compactes et à chaque ouverture de session"

**Action requise** :
- ✅ Créer `CONSIGNES_RAOUL_GUILLAUME_FARRE.md` (ce fichier)
- ✅ Créer `HISTORIQUE_CONVERSATIONS_COMPLETE.md`
- ✅ Placer localement projet
- ✅ Placer racine GitHub
- ⏳ **Améliorer prompt pour relecture automatique**

**Prompt à améliorer** :
```
À CHAQUE compaction OU ouverture session :
1. Lire CONSIGNES_RAOUL_GUILLAUME_FARRE.md
2. Lire HISTORIQUE_CONVERSATIONS_COMPLETE.md
3. Lire CLAUDE.md
4. Lire ~/.claude-global-rules.md
5. git status + git log -1
6. Résumer contexte en 3-4 lignes
```

---

**Lalou**
2025-11-08

---

**Fichier à relire OBLIGATOIREMENT à chaque session**
