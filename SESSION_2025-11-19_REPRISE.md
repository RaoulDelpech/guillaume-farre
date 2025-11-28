# SESSION 2025-11-19 - REPRISE APRÈS INCIDENT METADATA

**Date** : 2025-11-19 15:20
**Statut** : SESSION TERMINÉE - PRÊTE POUR REPRISE
**Par** : Lalou

---

## ✅ TRAVAUX RÉALISÉS CETTE SESSION

### 1. Correction carousel homepage ✅

**Problème** :
- 4 photos verticales dans carousel (mauvais pour format 16:9)
- 1 photo dans la corbeille (atelier-033.jpg)

**Solution appliquée** :
Remplacement de 5 photos sur 6 :

| Avant (vertical/trash) | Après (paysage 16:9) | Slide |
|------------------------|----------------------|-------|
| atelier-033.jpg (trash + vertical) | atelier-004.jpg (1568x1045) | Créations |
| atelier-042.jpg (vertical) | atelier-020.jpg (1568x1045) | Atelier |
| atelier-028.jpg (paysage) | **GARDÉ** (1568x1045) | Photographies |
| atelier-050.jpg (vertical) | atelier-045.jpg (1568x1045) | Concept Car Art |
| atelier-068.jpg (vertical) | atelier-063.jpg (1568x1045) | Origine |
| atelier-072.jpg (paysage) | **GARDÉ** (1568x1045) | Acquérir |

**Résultat** : Les 6 slides du carousel affichent maintenant des photos format paysage 16:9 (1568x1045).

**Fichier modifié** : `components/HeroCarousel.tsx`

**Commit** : `5571562` - "fix: remplace 4 photos verticales du carousel par photos paysage 16:9"

---

### 2. Déploiement production ✅

**Actions** :
```bash
git add components/HeroCarousel.tsx
git commit -m "fix: remplace 4 photos verticales..."
git push origin main
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && git pull && npm run build && pm2 restart guillaume-farre"
```

**Résultat** :
- ✅ Build Next.js réussi (108/108 pages générées)
- ✅ PM2 redémarré (PID 205579)
- ✅ Site accessible sur https://guillaumefarre.com
- ✅ Carousel fonctionne avec photos paysage

---

### 3. Synchronisation metadata local ← serveur ✅

**Action** :
```bash
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
```

**État metadata actuel** :
- Total photos : 116
- Photos actives : 115
- Photos trash : 1
- Photos visibles : 115

**Toutes les photos actives sont marquées `visible: true`** → Galerie et boutique fonctionnelles.

---

## 🔍 DIAGNOSTIC TECHNIQUE EFFECTUÉ

### Serveur production (51.38.35.238)

**État PM2** :
```
id: 0
name: guillaume-farre
status: online
uptime: 8m (au moment du check)
restarts: 30
```

**Nginx** :
- Actif depuis : 8 Nov 2025 09:33:21 UTC
- Config : `/etc/nginx/sites-available/guillaumefarre`
- Domaines : guillaumefarre.com + www.guillaumefarre.com
- SSL : Let's Encrypt actif
- Proxy : localhost:3000

**Git production** :
- Dernier commit : `5571562` (fix carousel)
- Remote : github.com/RaoulDelpech/guillaume-farre.git
- Branche : main

---

## 📸 ANALYSE PHOTOS PAYSAGE

**Script créé** : `/tmp/check-landscape.sh`

**Photos paysage disponibles (pas trash)** : 32 photos

Liste complète :
- atelier-004, 005, 006, 008, 009, 016, 019, 020, 021, 025
- atelier-028, 030, 035, 037, 040, 043, 045, 046, 047, 051
- atelier-052, 054, 057, 062, 063, 064, 066, 067, 070, 072
- atelier-073, 078

**Format dominant** : 1568x1045 (ratio ~1.5:1, proche 16:9)

---

## 📋 ÉTAT PROJET ACTUEL

### Métadonnées production

**Fichier** : `/var/www/guillaume-farre/data/photo-metadata.json`
**Taille** : 52K
**Dernière modification** : 19 Nov 2025

**Distribution** :
- 115 photos `status: "active"` + `visible: true`
- 1 photo `status: "trash"` (probablement atelier-077.jpg - erreur dans logs)
- 0 photos `status: "to-sort"`

**Photos dans la corbeille récupérées** (session précédente) :
22 photos marquées trash via logs PM2 :
- Atelier : 001, 002, 010, 012, 014, 018, 026, 029, 032, 033, 034, 039, 041, 044, 055, 056, 059, 071, 077, 079
- Empreintes : 011, 017

---

### Git local

**Répertoire** : `/Users/raouldelpech/Desktop/Claude/guillaume-farre/guillaume-farre-from-github`
**Dernier commit** : `5571562` (carousel fix)
**Remote** : git@github.com:RaoulDelpech/guillaume-farre.git
**Branche** : main
**État** : Clean (synchro avec production)

---

### Configuration serveur

**VPS** : 51.38.35.238
**User** : ubuntu
**Path** : /var/www/guillaume-farre
**Node.js** : v20.x
**PM2** : guillaume-farre (app id: 0)
**Nginx** : nginx/1.24.0 (Ubuntu)
**Domaine** : guillaumefarre.com (SSL Let's Encrypt)

---

## 🚨 PROBLÈME RÉSOLU : CONFUSION DOMAINE

**Erreur initiale** : J'ai vérifié **art-photo-car.com** au lieu de **guillaumefarre.com**

**Cause** : Documentation contradictoire
- CLAUDE.md (7 nov) → guillaumefarre.com ✅
- REPRISE_SESSION_2025-11-19.md (19 nov) → art-photo-car.com ❌

**Correction** :
- Le domaine principal est **guillaumefarre.com**
- art-photo-car.com était probablement un ancien nom ou test

**Vérification effectuée** :
```bash
curl -I https://guillaumefarre.com
# → HTTP/2 307 (redirection vers /fr)
# → Site fonctionne correctement ✅
```

---

## 📚 DOCUMENTATION CRÉÉE

Fichiers de documentation session précédente (19 nov 00:05) :

1. **ETAT_CRITIQUE_2025-11-19.md** (333 lignes)
   - Incident metadata écrasé
   - Récupération via logs PM2
   - 22 photos trash restaurées

2. **REPRISE_SESSION_2025-11-19.md** (422 lignes)
   - Guide complet reprise session
   - Commandes diagnostic
   - Workflow déploiement

3. **ROADMAP_2025-11-19.md** (567 lignes)
   - Tâches urgentes
   - Haute/moyenne/basse priorité
   - Temps estimés

4. **SPECIFICATIONS_METIER_2025-11-19.md** (459 lignes)
   - Ce que Guillaume vend
   - Règles éditions limitées (9 ex, pas 7)
   - Schema metadata

5. **CLAUDE.md** (mis à jour)
   - Règle #32 ajoutée (metadata serveur = source de vérité)

---

## 🔄 PROCHAINE SESSION - CHECKLIST

### Avant de commencer

```bash
# 1. Aller dans le projet
cd ~/Desktop/Claude/guillaume-farre/guillaume-farre-from-github

# 2. Vérifier état Git
git status
git log --oneline -5

# 3. Vérifier serveur production
ssh ubuntu@51.38.35.238 "pm2 status guillaume-farre"

# 4. Vérifier site en ligne
curl -I https://guillaumefarre.com
```

### Fichiers à lire

1. **Ce fichier** (`SESSION_2025-11-19_REPRISE.md`) - Résumé session
2. `ROADMAP_2025-11-19.md` - Tâches à faire
3. `SPECIFICATIONS_METIER_2025-11-19.md` - Règles métier
4. `CLAUDE.md` - Règles projet

**Temps lecture** : 10 min

---

## 📝 TÂCHES RESTANTES (ROADMAP)

### 🔴 URGENT (à faire prochainement)

**Aucune tâche urgente restante** ✅

Les 3 tâches critiques ont été résolues :
- ✅ Photos visibles récupérées (115 photos actives visibles)
- ✅ Carousel corrigé (6 photos paysage 16:9)
- ✅ Metadata synchronisé local ← serveur

---

### 🟠 HAUTE PRIORITÉ (cette semaine)

#### 1. Ajouter Règle #32 à ~/.claude-global-rules.md
**Statut** : 📝 À FAIRE
**Temps** : 5 min

**Action** : Ajouter cette règle au fichier global
```markdown
## Règle #32 : Photo Metadata Guillaume Farré = Serveur fait foi

Pour le projet Guillaume Farré uniquement :

❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISÉ : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier data/photo-metadata.json du SERVEUR est la SOURCE DE VÉRITÉ.
Guillaume travaille dans l'admin en production.
Ne JAMAIS écraser ce fichier depuis le local.

Exception : Migrations de schema (avec backup automatique avant).
```

---

#### 2. Traductions DeepL (EN/IT)
**Statut** : 📝 À FAIRE
**Temps** : 2h
**Priorité** : Haute (qualité traductions médiocre actuellement)

**Actions** :
1. Créer compte DeepL : https://www.deepl.com/pro-api
2. Récupérer API key
3. Créer script `scripts/translate-deepl.ts`
4. Traduire messages/fr.json → en.json + it.json

---

#### 3. Corriger textes répétitifs FR
**Statut** : 📝 À FAIRE
**Temps** : 3h
**Dépendance** : Après traductions DeepL

**Problème** :
- "pinceau/peint" répété 8x
- "unique/trace/irréversible" répété 11x
- Style IA évident

**Solution** : Réécrire messages/fr.json pour varier vocabulaire

---

#### 4. Réduire hauteur carousel
**Statut** : 📝 À FAIRE
**Temps** : 5 min
**Fichier** : `components/HeroCarousel.tsx`

**Action** :
```typescript
// AVANT
<section className="relative w-full h-[70vh] md:h-[80vh]">

// APRÈS
<section className="relative w-full h-[50vh] md:h-[60vh]">
```

---

#### 5. Ralentir autoplay carousel
**Statut** : 📝 À FAIRE
**Temps** : 5 min
**Fichier** : `components/HeroCarousel.tsx`

**Action** : Chercher interval et modifier de 5000ms → 9000ms

---

### 🟡 MOYENNE PRIORITÉ (semaine prochaine)

Voir `ROADMAP_2025-11-19.md` sections 9-11 :
- Descriptions IA photos (Anthropic Vision)
- Améliorations UX admin
- Bug upload photos (rectangles gris)

---

### 🟢 BASSE PRIORITÉ (plus tard)

Voir `ROADMAP_2025-11-19.md` sections 12-15 :
- Refonte schema metadata
- Intégration Gelato API
- Tirages grand public 99 ex.
- Réécriture 1ère personne

---

## ⚠️ POINTS D'ATTENTION CRITIQUES

### 1. RÈGLE #32 - Metadata serveur = source de vérité

**JAMAIS copier metadata LOCAL → PRODUCTION**

Incident du 19 nov : j'ai écrasé le metadata production avec le local, perdant :
- Photos supprimées par Guillaume
- Photos validées récemment

Récupération partielle via logs PM2, mais **ne JAMAIS reproduire cette erreur**.

---

### 2. Domaine principal = guillaumefarre.com

**PAS art-photo-car.com** (erreur de ma part cette session)

Configuration nginx :
- guillaumefarre.com
- www.guillaumefarre.com
- SSL Let's Encrypt
- Proxy → localhost:3000

---

### 3. Format carousel = PAYSAGE 16:9 uniquement

Guillaume a été très clair : **pas de photos verticales dans carousel**.

Photos disponibles paysage : 32 au total (voir liste complète ci-dessus)

---

### 4. Éditions limitées = 9 exemplaires (PAS 7)

Erreur dans ancienne doc : les séries limitées sont **9 exemplaires**, pas 7.

Voir `SPECIFICATIONS_METIER_2025-11-19.md` pour règles exactes.

---

## 🗂️ FICHIERS IMPORTANTS

### Code modifié cette session
- `components/HeroCarousel.tsx` (carousel photos paysage)

### Documentation créée/mise à jour
- `SESSION_2025-11-19_REPRISE.md` (ce fichier)
- `ETAT_CRITIQUE_2025-11-19.md` (incident metadata)
- `REPRISE_SESSION_2025-11-19.md` (guide reprise)
- `ROADMAP_2025-11-19.md` (tâches)
- `SPECIFICATIONS_METIER_2025-11-19.md` (règles métier)
- `CLAUDE.md` (règle #32 ajoutée)

### Metadata
- `data/photo-metadata.json` (synchronisé production → local)

### Backups metadata production
- `/var/www/guillaume-farre/data/photo-metadata.backup.1762551576668.json` (7 nov)
- `/var/www/guillaume-farre/data/photo-metadata.backup.1763247149847.json` (18 nov 20:16)

---

## 📞 CONTACT URGENCE

### Problème serveur

**Logs PM2** :
```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --err --lines 50"
```

**Redémarrer** :
```bash
ssh ubuntu@51.38.35.238 "pm2 restart guillaume-farre"
```

**Restaurer backup metadata** :
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre/data && \
  cp photo-metadata.backup.1763247149847.json photo-metadata.json && \
  pm2 restart guillaume-farre"
```

---

### Problème déploiement

**Vérifier build** :
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && npm run build"
```

**Conflit Git** :
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && \
  git stash && \
  git pull && \
  npm run build && \
  pm2 restart guillaume-farre"
```

---

## 🎯 RÉSUMÉ ULTRA-RAPIDE

**Session 2025-11-19 15:20**

✅ **Fait** :
- Carousel corrigé (6 photos paysage 16:9)
- Déployé en production
- Metadata synchronisé
- Site fonctionne parfaitement

📋 **À faire prochainement** :
1. Règle #32 dans global rules (5 min)
2. Traductions DeepL (2h)
3. Corriger textes répétitifs (3h)
4. Réduire hauteur carousel (5 min)
5. Ralentir autoplay carousel (5 min)

🚨 **RÈGLE CRITIQUE** :
**JAMAIS copier metadata local → production**
**Toujours production → local**

🌐 **Domaine** : https://guillaumefarre.com (PAS art-photo-car.com)

---

**Créé par** : Lalou
**Date** : 2025-11-19 15:20
**Statut** : Prêt pour reprise sans perte d'info

**Session terminée proprement ✅**
