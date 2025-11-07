# Analyse exhaustive - Failles continuité session GUILLAUME FARRÉ

Date: 2025-11-07
Par: Lalou
Contexte: Bascule vers autre compte - ZÉRO perte toléré
Scope: UNIQUEMENT projet Guillaume Farré + bonnes pratiques dev générales

---

## EXCLUSIONS (hors scope)

❌ Fichiers centraux Juris-Power (PROJECTS_STATE.md, DAILY_LOG.md)
❌ Règles métier Juris-Power
❌ Design system Juris-Power

✅ Uniquement: Projet Guillaume Farré + bonnes pratiques dev universelles

---

## FAILLES IDENTIFIÉES (12 failles)

### 🔴 FAILLE 1: Pas de slash command démarrage automatique

**Problème**:
- Aucun fichier `.claude/commands/start.md` dans projet
- Nouveau compte doit MANUELLEMENT demander lecture CLAUDE.md + fichiers état
- Risque oubli = session démarre sans contexte projet

**Impact**: BLOQUANTE
- Nouveau compte peut démarrer sans connaître règles métier Guillaume
- Peut violer décisions validées (Gelato, formats, pricing)
- Peut refaire travail déjà fait

**Solution**:
Créer `.claude/commands/start.md` qui charge automatiquement:
1. CLAUDE.md (règles métier)
2. ETAT_SESSION_2025-11-07_FINAL.md (état complet)
3. CORRECTIONS_URGENTES_2025-11-07.md (fixes prioritaires)
4. git status + git log -1

---

### 🔴 FAILLE 2: Bonnes pratiques dev dispersées

**Problème**:
- Bonnes pratiques dev dans ~/.claude-global-rules.md (947 lignes, 38 règles)
- Nouveau compte doit lire TOUT le fichier pour trouver règles applicables
- Mélangé avec règles Juris-Power non applicables

**Impact**: HAUTE
- Règles tests, sécurité, accessibilité peuvent être oubliées
- Signature "Lalou" (#31) peut être violée
- Style code humain (#31) peut être violé

**Solution**:
Créer `BONNES_PRATIQUES_DEV.md` avec uniquement règles dev applicables:
- Tests avant commit
- Sécurité (.env, pas de clés en dur)
- Accessibilité (contraste, alt text)
- Signature "Lalou"
- Style code humain indétectable IA

---

### 🔴 FAILLE 3: Accès GitHub non vérifié autre compte

**Problème**:
- Tous fichiers pushés sur GitHub RaoulDelpech/guillaume-farre
- AUCUNE vérification que autre compte peut accéder au repo
- Si permissions privées = TOUT PERDU

**Impact**: BLOQUANTE ABSOLUE
- Si nouveau compte ne peut pas clone/pull = perte totale session
- 8 fichiers documentation inaccessibles
- Travail session perdu

**Solution**:
Vérifier que repo est public OU que l'autre compte a les droits.
Commande: `gh repo view RaoulDelpech/guillaume-farre --json visibility`

---

### 🟠 FAILLE 4: Variables d'environnement futures non documentées

**Problème**:
- .env.local existe avec Stripe keys
- Mais futures clés API NON documentées:
  - GELATO_API_KEY (à ajouter Phase 2)
  - DEEPL_API_KEY (à ajouter Phase 2)
  - ANTHROPIC_API_KEY (à ajouter Phase 3)

**Impact**: HAUTE
- Nouveau compte ne sait pas quelles clés ajouter
- Blocage implémentation Gelato, DeepL, Claude Vision

**Solution**:
Créer `.env.template` avec TOUTES clés nécessaires + commentaires.

---

### 🟠 FAILLE 5: Schema metadata migration non planifiée en détail

**Problème**:
- Nouveau schema PhotoMetadata documenté dans CLAUDE.md
- Mais AUCUN plan étape par étape de migration
- Nouveau compte doit deviner:
  - Comment lire ancien schema
  - Comment mapper vers nouveau
  - Comment gérer backward compatibility
  - Quel ordre de migration

**Impact**: HAUTE
- Risque casser données existantes
- Risque implémenter différemment que prévu

**Solution**:
Créer `scripts/MIGRATION_METADATA_PLAN.md` avec:
- Étapes détaillées 1-10
- Code exemples avant/après
- Commandes à exécuter
- Vérifications à faire

---

### 🟠 FAILLE 6: Gelato pricing réel non vérifié

**Problème**:
- Gelato validé MAIS pricing France PAS vérifié
- Marges 88-93% BASÉES SUR HYPOTHÈSES (estimations conservatrices)
- Nouveau compte ne sait pas si doit vérifier avant implémentation

**Impact**: HAUTE - BUSINESS CRITIQUE
- Risque marges réelles beaucoup plus basses (50-60% au lieu de 88-93%)
- Risque projet non rentable
- Risque Guillaume perd argent sur chaque vente

**Solution**:
Créer `GELATO_PRICING_VERIFICATION.md` avec:
- Checklist vérification (créer compte, voir dashboard pricing)
- Calculs marges avec VRAIS prix vs estimés
- Seuil GO/NO-GO (marges < 70% = abandonner Gelato)

---

### 🟠 FAILLE 7: Pas de TODO.md checklist trackable

**Problème**:
- 11 corrections dans CORRECTIONS_URGENTES_2025-11-07.md
- Mais format markdown narratif, pas checklist
- Nouveau compte doit relire prose, pas de checkboxes

**Impact**: MOYENNE
- Risque oublier correction
- Pas de tracking visuel progression
- Difficile voir rapidement ce qui reste

**Solution**:
Créer `TODO.md` racine avec:
```markdown
## Phase 1 - CRITIQUE

- [ ] Bug upload photos
- [ ] Schema metadata refactoring
- [ ] Formats selon catégorie
...
```

---

### 🟡 FAILLE 8: Textes répétitifs non corrigés

**Problème**:
- ANALYSE_REPETITIONS_TEXTES.md documente problème
- Mais AUCUN exemple réécriture proposé
- Nouveau compte doit tout réécrire from scratch

**Impact**: MOYENNE
- Perte temps
- Risque nouveau texte aussi répétitif

**Solution**:
Créer `TEXTES_CORRIGES_EXEMPLES.md` avec 5 exemples:
- Avant (répétitif)
- Après (varié, humain)
- Explication changements

---

### 🟡 FAILLE 9: Gelato code skeleton manquant

**Problème**:
- GELATO_VALIDATION_GUIDE.md documente service
- Mais ZERO code exemple
- Nouveau compte code from scratch

**Impact**: MOYENNE
- Perte temps
- Risque erreurs intégration API

**Solution**:
Créer `lib/gelato-client.ts.SKELETON` avec:
- Structure class GelatoClient
- Méthodes principales (createOrder, getOrderStatus)
- Types TypeScript
- Commentaires TODO

---

### 🟡 FAILLE 10: Photos à trier non listées

**Problème**:
- Photos uploadées dans `/public/images/works/a-trier/`
- Mais pas de liste
- Nouveau compte ne sait pas combien à traiter

**Impact**: BASSE
- Impossible estimer volume travail

**Solution**:
Créer `PHOTOS_A_TRIER.md` avec liste complète (ls -lh).

---

### 🟡 FAILLE 11: DeepL + Anthropic setup non documentés

**Problème**:
- Corrections disent "intégrer DeepL API" et "intégrer Claude Vision"
- Mais ZERO doc setup (créer compte, obtenir clé, pricing, limites)

**Impact**: MOYENNE
- Nouveau compte doit chercher doc externe
- Risque choisir mauvais plan DeepL (gratuit limité 500k chars/mois)
- Risque choisir mauvais modèle Anthropic (Sonnet vs Haiku)

**Solution**:
Créer 2 fichiers:
- `DEEPL_SETUP.md` (signup, API key, pricing, script traduction)
- `ANTHROPIC_VISION_SETUP.md` (modèle, pricing, exemples prompts)

---

### 🟡 FAILLE 12: Git hooks non configurés

**Problème**:
- Bonnes pratiques: tests avant commit
- Mais `.git/hooks/pre-commit` n'existe PAS
- Nouveau compte peut commiter code cassé

**Impact**: BASSE
- Code TypeScript non compilable peut être commité
- Perte temps debuggage

**Solution**:
Créer `.git/hooks/pre-commit` avec:
```bash
#!/bin/sh
bun run lint || exit 1
npx tsc --noEmit || exit 1
```

---

## RÉCAPITULATIF CRITICITÉ

**BLOQUANTES (2)** :
1. Pas de slash command
3. Accès GitHub non vérifié

**HAUTES (4)** :
2. Bonnes pratiques dev dispersées
4. Variables env futures non doc
5. Migration metadata non planifiée
6. Gelato pricing non vérifié ← BUSINESS CRITIQUE

**MOYENNES (3)** :
7. Pas de TODO.md checklist
8. Textes répétitifs non corrigés
9. Gelato code skeleton manquant

**BASSES (3)** :
10. Photos à trier non listées
11. DeepL/Anthropic setup manquants
12. Git hooks manquants

---

## PLAN D'ACTION

### Phase 1: BLOQUANTES (20 min)

1. ✅ Vérifier accès GitHub autre compte (gh repo view)
2. Créer .claude/commands/start.md

### Phase 2: HAUTES (1h)

3. Créer BONNES_PRATIQUES_DEV.md
4. Créer .env.template
5. Créer scripts/MIGRATION_METADATA_PLAN.md
6. Créer GELATO_PRICING_VERIFICATION.md ← PRIORITÉ

### Phase 3: MOYENNES (45 min)

7. Créer TODO.md
8. Créer TEXTES_CORRIGES_EXEMPLES.md
9. Créer lib/gelato-client.ts.SKELETON

### Phase 4: BASSES (30 min)

10. Créer PHOTOS_A_TRIER.md
11. Créer DEEPL_SETUP.md + ANTHROPIC_VISION_SETUP.md
12. Créer .git/hooks/pre-commit

### Phase 5: VÉRIFICATIONS 3x (30 min)

13. Vérification locale 1 + GitHub 1
14. Vérification locale 2 + GitHub 2
15. Vérification locale 3 + GitHub 3

**TOTAL: 3h05**

---

## PROCHAINE ÉTAPE

Implémenter toutes solutions dans l'ordre (Phase 1 → Phase 5).

Lalou
