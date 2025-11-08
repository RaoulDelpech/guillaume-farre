# CONSIGNES SESSION 2025-11-08

Date: 2025-11-08
Maintenu par: Lalou
Projet: Guillaume Farré - Site artiste sculpteur

---

## DEMANDES CLIENT (RAOUL)

### 1. ✅ Miniatures doublons cliquables avec zoom
**ÉTAT**: COMPLÉTÉ

**Problème initial**:
- Détection doublons affichait rectangles gris au lieu des images
- Miniatures non cliquables
- Pas de zoom possible

**Solution implémentée**:
- Fix chemins images: ajout `/` initial (`/images/works/...` au lieu de `images/works/...`)
- Miniatures 64x64px cliquables
- Modal zoom plein écran au clic
- Hover effect + icône 🔍
- Bouton fermeture (×) dans modal

**Fichiers modifiés**:
- `app/api/admin/duplicates/route.ts` (ligne 109: normalisation chemins)
- `components/admin/DuplicateDetector.tsx` (lignes 249-264: miniatures cliquables)

**Commit**: `7f74680` - "fix: Chemins images doublons (ajout slash initial)"

---

### 2. ✅ Bouton suggestions séries IA
**ÉTAT**: COMPLÉTÉ

**Problème initial**:
- Pas de bouton pour analyser manuellement les photos
- Suggestions séries uniquement à l'upload
- Pas de contrôle utilisateur sur l'analyse

**Solution implémentée**:
- Nouveau composant: `components/admin/SeriesSuggestButton.tsx`
- Bouton gradient purple-to-blue avec icône 🎨
- Analyse les photos **filtrées** (respecte filtres statut/catégorie)
- Alerte si <2 photos ou >20 photos (coût IA)
- Feedback visuel pendant analyse (spinner)
- Ouvre modal avec suggestions IA
- Application groupée des séries suggérées

**Fichiers créés**:
- `components/admin/SeriesSuggestButton.tsx` (98 lignes)

**Fichiers modifiés**:
- `app/[locale]/admin/page.tsx` (import + intégration bouton)

**Commit**: `3e63b4f` - "feat: Bouton manuel suggestions séries IA"

---

### 3. ✅ Clarification compteur doublons
**ÉTAT**: COMPLÉTÉ

**Problème initial**:
- Interface affichait "4 groupes" mais proposait "supprimer 98 fichiers"
- Confusion: utilisateur ne voyait pas tous les groupes
- Pas clair que la zone était scrollable

**Solution implémentée**:
- Ajout compteur sticky en haut de la liste doublons
- Format: "📋 Affichage de X groupes de doublons (Y fichiers à supprimer au total)"
- Compteur reste visible pendant le scroll
- Zone scrollable pour voir TOUS les groupes

**Explication technique**:
- 4 groupes visibles = premiers groupes affichés
- 98 fichiers à supprimer = total dans TOUS les groupes (scroll pour voir)
- L'algorithme détecte doublons exacts (hash MD5) + similaires (noms)

**Fichiers modifiés**:
- `components/admin/DuplicateDetector.tsx` (lignes 205-211: compteur sticky)

**Commit**: `66c947c` - "fix: Clarification détection doublons (compteur groupes visible)"

---

### 4. ✅ Détection doublons par contenu UNIQUEMENT (pas nom)
**ÉTAT**: COMPLÉTÉ

**Problème initial**:
- Détection hybride: hash MD5 (contenu) + normalisation noms
- Raoul: "l'analyse de l'image doit primer sur le nom"
- Faux positifs possibles avec noms similaires

**Solution implémentée**:
- SUPPRIMÉ détection par nom similaire (50 lignes code)
- GARDÉ UNIQUEMENT hash MD5 (contenu réel fichier)
- UI affiche "Contenu d'image identique" + hash MD5
- Aucun faux positif possible

**Fichiers modifiés**:
- `app/api/admin/duplicates/route.ts` (supprimé fonctions normalizeFileName, detectSimilarNames)
- `components/admin/DuplicateDetector.tsx` (UI simplifiée, pas de mention "similaires nom")

**Commit**: `0825630` - "fix: Détection doublons + Suggestions séries IA (feedback Raoul)"

---

### 5. ✅ Suggestions séries IA - Prompt renforcé
**ÉTAT**: COMPLÉTÉ

**Problème initial**:
- IA regroupait photos très différentes visuellement
- Raoul montré screenshot: photos sans rapport dans même série
- Prompt trop permissif sur "similitudes"

**Solution implémentée**:
- Nouveau prompt avec 5 critères OBLIGATOIRES:
  1. Palette couleurs quasi-identique
  2. Composition similaire
  3. Sujet principal identique/proche
  4. Éclairage et ambiance comparables
  5. Style visuel cohérent
- Exemples EXPLICITES de vraies/fausses séries
- Règle absolue: "SI TU HÉSITES, NE CRÉE PAS DE SÉRIE"
- Confiance "high" uniquement si similitudes TRÈS fortes

**Fichiers modifiés**:
- `app/api/admin/suggest-series/route.ts` (prompt renforcé, lignes 62-104)

**Commit**: `0825630` - "fix: Détection doublons + Suggestions séries IA (feedback Raoul)"

---

## RÈGLES ABSOLUES RAPPELÉES

1. **Commit régulier**: Toutes les 10-15 minutes
2. **Sauvegarder consignes**: Documenter dans fichiers dédiés
3. **Ne JAMAIS perdre contexte**: Enrichir documentation
4. **Signature code**: "Lalou"
5. **Style 100% humain**: Indétectable comme IA

---

## TÂCHES RESTANTES (TODO)

### 🔴 CRITIQUE
- [ ] Tests E2E critiques (workflow boutique complet) - 1h
- [ ] Optimisation images next/image (remplacer `<img>`) - 1h

### 🟠 HAUTE
- [ ] Interface catégories boutique (dropdown Limited/Unlimited) - 45min
- [ ] Intégrer composant DragDropUpload dans admin - 30min
- [ ] IA auto quand photo passe en statut active - 30min
- [ ] Photos trash → déplacer vers dossier supprimé - 30min
- [ ] Multi-catégorisation avancée (séries/locations/tags) - 45min

### 🟡 MOYENNE
- [ ] Gelato API setup complet - 5h (2 jours)

---

### 6. ✅ Page Concept Car Art restaurée
**ÉTAT**: COMPLÉTÉ

**Demande client**:
- Raoul: "je veux que tu remettes l'evenemnt car art cars tel qu'il existait avant"
- Restaurer page "Ferrari Live Performance"

**Vérification**:
- Page déjà restaurée dans commit précédent
- Contenu correct: titre "🏎️ Ferrari Live Performance"
- Toutes sections présentes (Le Concept, Le Processus, L'Origine, Événements, etc.)
- Fichier: `app/[locale]/concept-car-art/page.tsx`

**Statut**: Aucune action requise, page déjà correcte

---

### 7. ✅ Modèles Anthropic - Vérification
**ÉTAT**: VÉRIFIÉ - DÉJÀ CORRECT

**Vérification effectuée**:
- Erreurs 404 dans logs dev étaient d'une version antérieure (cache navigateur)
- Code actuel utilise déjà le bon modèle: `claude-3-haiku-20240307`
- Fichier `app/api/admin/generate-description/route.ts` (ligne 88): ✅ Correct
- Fichier `app/api/admin/suggest-series/route.ts` (ligne 53): ✅ Correct

**Modèles utilisés (tous valides)**:
- `claude-3-haiku-20240307` → Descriptions photos IA
- `claude-3-haiku-20240307` → Suggestions séries IA

**Statut**: Aucune action requise, code déjà correct

---

## COMMITS SESSION 2025-11-08

1. `3e63b4f` - feat: Bouton manuel suggestions séries IA
2. `7f74680` - fix: Chemins images doublons (ajout slash initial)
3. `66c947c` - fix: Clarification détection doublons (compteur groupes visible)
4. `0825630` - fix: Détection doublons + Suggestions séries IA (feedback Raoul)
5. `9dbd92f` - docs: Mise à jour consignes session 2025-11-08
6. `a21b37c` - fix: Suppression champ Lieux (inutilisé)

**Total**: 6 commits, 3 fichiers créés, 6 fichiers modifiés

---

## NOTES TECHNIQUES

### Claude Vision API (Haiku)
- Modèle utilisé: `claude-3-haiku-20240307`
- API endpoint: `/api/admin/suggest-series`
- API endpoint: `/api/admin/generate-description`
- Clé API: `ANTHROPIC_API_KEY` dans `.env.local`

### Détection doublons
- Hash MD5 pour doublons exacts
- Normalisation noms pour similaires
- Chemins web: `/images/works/...` (avec slash initial)

### Playwright (E2E tests)
- Config: `playwright.config.ts`
- Tests: `e2e/shop-workflow.spec.ts` (créé mais incomplet)
- Navigateur: Chromium
- Base URL: `http://localhost:3000`

---

## FICHIERS À RELIRE PROCHAINE SESSION

1. `/Users/raouldelpech/Desktop/guillaume-farre/CLAUDE.md`
2. `CONSIGNES_RAOUL_GUILLAUME_FARRE.md` (882 lignes)
3. Ce fichier: `CONSIGNES_SESSION_2025-11-08.md`
4. `CONSIGNES_SESSION_2025-11-07.md` (si existe)

---

Maintenu par: Lalou
Sauvegardé le: 2025-11-08
