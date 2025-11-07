# Session 2025-11-07 - Consignes de Raoul

Date: 7 novembre 2025, 23h
Maintenu par: Lalou

---

## CONSIGNES ABSOLUES DU CLIENT

### 1. Lancer des processus longs en background

**Citation Raoul** :
> "hey je ne vois aucun process en background ! lance des process long pour tout ce que je t'ai demandé !"

**Action requise** :
- Lancer TOUS les processus longs en background immédiatement
- Ne pas attendre confirmation pour chaque tâche
- Travailler en parallèle au maximum
- Montrer progress en temps réel

---

### 2. Relire tous les fichiers projet

**Citation Raoul** :
> "relis le fichier odt si tu as besoin d'être sûr de ce qu'il reste à faire. Relis aussi le contenu du repertoire claude de guillaume farre et aussi tout ce quil'y a sur le github."

**Fichiers à relire** :
- ✅ `.claude/REGLES_PROJET.md` (relu)
- ⏳ Tous les fichiers `.claude/`
- ⏳ Tous les fichiers markdown racine
- ⏳ CLAUDE.md mis à jour
- ⏳ Fichier ODT (si trouvé)

---

### 3. Sauvegarder régulièrement

**Citation Raoul** :
> "Par ailleur n'oublie pas de suavegarder et de commiter régulièrement en sauvegardnat mes consignes pour qu'il n'y ait pas de depertition. C'est une règle aboslue qui doit netre retenue et qui doit enreigchir ton prompte"

**Règle ABSOLUE ajoutée au projet** :
- Commit toutes les 10-15 minutes
- Sauvegarder les consignes client dans fichiers dédiés
- Ne JAMAIS perdre de contexte
- Enrichir le prompt avec ces règles

**Fichiers de sauvegarde** :
- `SESSION_2025-11-07_CONSIGNES_RAOUL.md` (ce fichier)
- `.claude/REGLES_PROJET.md` (màj avec cette règle)
- Commits Git réguliers avec messages détaillés

---

## CE QUI A ÉTÉ FAIT (session actuelle)

### ✅ Complété

1. **Compteur séries limitées** (30 min)
   - Badge "X/7 restants"
   - Alerte ⚠️ si ≤2
   - Badge "ÉPUISÉ" si 0
   - Commit: d7ac6f1

2. **Traductions EN/IT complètes** (1h30)
   - EN: 100% traduit (hero, gallery, shop, contact)
   - IT: 100% traduit, style cohérent
   - Éliminé répétitions AI-style
   - Commits: d7ac6f1, 864ee3b

3. **Panel commercial dépliable** (15 min)
   - Collapsed par défaut
   - Icône ▶/▼ cliquable
   - Commit: 3ce1d22

4. **Miniatures cliquables doublons** (20 min)
   - Zoom sur clic
   - Modal plein écran
   - Commit: 8929528

5. **Interface admin statuts + filtres** (45 min)
   - Statuts: active/trash/to-sort
   - Filtres avec compteurs
   - Catégories multiples (checkboxes)
   - Commit: bdca4dc

6. **Bouton Instagram amélioré** (10 min)
   - Remplacé gros bouton par gradient compact
   - Icône 📱
   - Commit: bdca4dc

7. **Descriptions IA photos** (1h)
   - Intégration Anthropic Claude Vision
   - Bouton "Générer description IA"
   - Zone texte éditable
   - Commit: ff43f75

8. **Réécriture textes FR** (2h)
   - Éliminé toutes répétitions IA
   - Vocabulaire varié
   - Style humain indétectable
   - Commit: c4c3d25

9. **Migration metadata** (1h30)
   - Nouveau schema multi-catégories
   - Script migration automatique
   - Commit: f487520

---

## CE QUI RESTE À FAIRE

### 🔴 CRITIQUE (Maintenant - processus longs à lancer)

1. **Carousel homepage** (30 min)
   - ⏳ Réduire 80vh → 60vh
   - ⏳ Ralentir 5s → 9s
   - ⏳ Changer photo voitures rouges

2. **Tests E2E critiques** (1h)
   - ⏳ Test upload photo → metadata → affichage
   - ⏳ Test checkout Stripe complet
   - ⏳ Test descriptions IA

3. **Optimisation images** (1h)
   - ⏳ Convertir vers next/image
   - ⏳ Optimisation formats (WebP)
   - ⏳ Lazy loading automatique

4. **Documentation complète** (30 min)
   - ⏳ Relire tous fichiers .claude/
   - ⏳ Relire tous fichiers racine
   - ⏳ Mettre à jour CLAUDE.md

---

### 🟠 HAUTE (Demain)

5. **Interface catégories boutique** (45 min)
   - Filtres "Édition limitée" / "Tirage illimité" / "XXL" / "Monumental"
   - Affichage compteurs disponibilité
   - Tri par série

6. **Validation formats selon catégorie** (30 min)
   - Côté serveur: pas A4 si limited
   - Messages erreur clairs
   - Tests unitaires

7. **Gelato API setup** (2h)
   - Créer compte Gelato
   - Générer API key
   - Implémenter client API
   - Webhook Stripe → Gelato

---

## STRATÉGIE PROCESSUS LONGS

### Processus à lancer EN PARALLÈLE (maintenant)

1. **Build production** (vérifie que tout compile)
   ```bash
   bun run build 2>&1 | tee build.log &
   ```

2. **TypeScript check complet** (vérifie types)
   ```bash
   bunx tsc --noEmit 2>&1 | tee tsc.log &
   ```

3. **Recherche fichiers ODT** (cherche docs)
   ```bash
   find /Users/raouldelpech/Desktop/guillaume-farre -name "*.odt" 2>/dev/null | tee odt-files.txt &
   ```

4. **Analyse taille images** (optimisation)
   ```bash
   find public/images -type f -name "*.jpg" -o -name "*.png" | xargs ls -lh | sort -k5 -h | tee images-sizes.txt &
   ```

5. **Commit sauvegarde consignes** (backup)
   ```bash
   git add SESSION_2025-11-07_CONSIGNES_RAOUL.md .claude/REGLES_PROJET.md && \
   git commit -m "docs: Sauvegarde consignes session 2025-11-07 (Raoul)" && \
   git push origin main &
   ```

---

## RÈGLES PROJET ENRICHIES

### Règle ajoutée: Sauvegardes régulières automatiques

**Nouvelle règle ABSOLUE** (demandée par Raoul) :
- Commit toutes les 10-15 minutes
- Sauvegarder consignes client dans fichiers dédiés
- Ne JAMAIS perdre de contexte entre sessions
- Enrichir documentation projet avec règles client

**Implémentation** :
- Fichier `SESSION_[DATE]_CONSIGNES_[CLIENT].md` pour chaque session
- Màj `.claude/REGLES_PROJET.md` avec nouvelles règles
- Commits Git réguliers avec messages détaillés
- Backup avant chaque changement majeur

---

## STATUT ACTUEL

**Processus en cours** : 0 (tous terminés)
**Processus à lancer** : 5 (voir section ci-dessus)
**Tâches complétées aujourd'hui** : 9
**Tâches restantes** : 7

**Prochaine action** :
1. Lancer les 5 processus longs en parallèle
2. Commencer corrections carousel
3. Sauvegarder régulièrement (toutes les 10-15 min)

---

**Dernière mise à jour** : 7 novembre 2025, 23h15
**Prochaine sauvegarde** : 7 novembre 2025, 23h30

Lalou
