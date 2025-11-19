# GUIDE REPRISE SESSION - 2025-11-19

**Pour** : Prochaine instance Claude / Lalou
**Date création** : 2025-11-19 00:15
**Contexte** : Session terminée après incident critique metadata

---

## FICHIERS À LIRE ABSOLUMENT (dans cet ordre)

### 1. État critique actuel ⚠️
📄 **`ETAT_CRITIQUE_2025-11-19.md`**
- Problème : Metadata production écrasé par erreur
- Solution appliquée : Récupération partielle via logs PM2
- Problème restant : Photos validées par Guillaume perdues
- Temps lecture : 5 min

### 2. Roadmap priorisée 🗺️
📄 **`ROADMAP_2025-11-19.md`**
- Liste complète des tâches par priorité
- Temps estimés
- Dépendances entre tâches
- Temps lecture : 3 min

### 3. Spécifications métier 📋
📄 **`SPECIFICATIONS_METIER_2025-11-19.md`**
- Ce que Guillaume vend (tableaux, photos limitées, tirages illimités)
- Règles éditions limitées (9 exemplaires, pas 7)
- Schema metadata actuel
- Flux commande client
- Temps lecture : 5 min

### 4. Documentation projet 📚
📄 **`CLAUDE.md`**
- Règles absolues du projet
- Exception charte Juris-Power
- **RÈGLE #32 CRITIQUE** : Metadata serveur = source de vérité
- Stack technique
- Commandes utiles
- Temps lecture : 5 min

### 5. Contexte précédent (optionnel)
📄 **`ETAT_SESSION_2025-11-07_FINAL.md`** (si existe)
📄 **`CORRECTIONS_URGENTES_2025-11-07.md`** (si existe)
📄 **`GELATO_VALIDATION_GUIDE.md`** (si existe)
- Temps lecture : 10 min

**TEMPS TOTAL LECTURE** : 15-30 min

---

## COMMANDES DE DIAGNOSTIC (avant de commencer)

### 1. Vérifier état Git
```bash
cd /Users/raouldelpech/Desktop/Claude/guillaume-farre/guillaume-farre-from-github
git status
git log --oneline -5
```

**Attendu** : Branche `main`, en sync avec remote, pas de modifications non commitées

---

### 2. Vérifier metadata production
```bash
ssh ubuntu@51.38.35.238 "ls -lh /var/www/guillaume-farre/data/photo-metadata.json"
```

**Attendu** : Fichier existant, taille ~62-65K

---

### 3. Compter photos par statut
```bash
ssh ubuntu@51.38.35.238 "cat /var/www/guillaume-farre/data/photo-metadata.json" | \
  node -e "const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); \
  const stats = data.reduce((acc, p) => { \
    const s = p.status || 'active'; \
    acc[s] = (acc[s] || 0) + 1; \
    return acc; \
  }, {}); \
  console.log(JSON.stringify(stats, null, 2));"
```

**Attendu** :
```json
{
  "active": 100-115,
  "trash": 22,
  "to-sort": 0-10
}
```

Si `trash: 22` → Récupération logs PM2 a fonctionné ✅
Si `trash: 0` → Problème, lire `ETAT_CRITIQUE_2025-11-19.md` 🔴

---

### 4. Compter photos visibles
```bash
ssh ubuntu@51.38.35.238 "cat /var/www/guillaume-farre/data/photo-metadata.json" | \
  node -e "const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); \
  const visible = data.filter(p => p.visible === true).length; \
  console.log('Photos visibles:', visible);"
```

**Attendu** : 80-100 photos visibles

Si `< 50` → Guillaume n'a pas encore re-validé les photos (voir ÉTAT CRITIQUE)

---

### 5. Vérifier PM2 production
```bash
ssh ubuntu@51.38.35.238 "pm2 status"
```

**Attendu** : `guillaume-farre` status `online`, uptime > 0s

---

### 6. Vérifier logs erreurs PM2
```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --err --lines 20 --nostream"
```

**Attendu** : Pas d'erreurs récentes (ou seulement warnings bénins)

---

## ÉTAT SERVEUR PRODUCTION

**VPS** : 51.38.35.238
**User** : ubuntu
**Path projet** : `/var/www/guillaume-farre`
**PM2 app** : `guillaume-farre`
**Domaine** : art-photo-car.com / www.art-photo-car.com

### Structure répertoires importants
```
/var/www/guillaume-farre/
├── data/
│   ├── photo-metadata.json ⬅️ SOURCE DE VÉRITÉ
│   ├── photo-metadata.backup.1762551576668.json (7 nov)
│   └── photo-metadata.backup.1763247149847.json (18 nov 20:16)
├── public/
│   └── images/
│       └── works/
│           ├── atelier/ ⬅️ Photos atelier Ferrari
│           ├── empreintes/ ⬅️ Photos empreintes
│           ├── projection/ ⬅️ Photos projection
│           └── a-trier/ ⬅️ Photos uploadées à trier
├── .next/ (build Next.js)
└── node_modules/
```

### Fichiers à NE JAMAIS toucher depuis local
- ❌ `data/photo-metadata.json` (RÈGLE #32)
- ❌ Fichiers dans `public/images/works/` (géré par admin prod)

### Fichiers OK à synchroniser local → prod
- ✅ Code source (components, app, lib, etc.)
- ✅ Fichiers config (package.json, next.config.js, etc.)
- ✅ Traductions (messages/*.json)

---

## WORKFLOW DÉPLOIEMENT (rappel)

### Modifications code local → production

**1. Développement local**
```bash
cd /Users/raouldelpech/Desktop/Claude/guillaume-farre/guillaume-farre-from-github
# Faire modifications code
bun run dev # Tester
bun run lint # Vérifier
```

**2. Commit et push**
```bash
git add .
git commit -m "feat: description changement"
git push origin main
```

**3. Déploiement production**
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && \
  git pull && \
  npm run build && \
  pm2 restart guillaume-farre"
```

**4. Vérifier déploiement**
```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 50 --nostream"
```

### ⚠️ Si conflit Git lors du pull

```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && \
  git stash && \
  git pull && \
  npm run build && \
  pm2 restart guillaume-farre"
```

---

## TÂCHES URGENTES (à faire en premier)

### 🔴 URGENT #1 : Récupérer photos visibles

**Contexte** : Metadata restauré date du 18 nov 20:16, photos validées par Guillaume après cette date sont perdues.

**3 options** (voir `ROADMAP_2025-11-19.md` section 1) :

**Option A** : Guillaume re-valide manuellement (2h)
- Guillaume se connecte à `/admin`
- Valide chaque photo une par une
- Précis mais long

**Option B** : Script auto-validation (5 min)
- Marquer TOUTES photos comme `visible: true` sauf trash
- Rapide mais risqué (photos non voulues apparaîtront)

**Option C** : Liste manuelle Guillaume (30 min)
- Guillaume donne liste des photos à afficher
- Script marque seulement celles-là comme visibles
- Précis ET rapide

**ACTION** : Demander à Guillaume quelle option il préfère.

**Script Option B** (si validé) :
```bash
# Créer script /tmp/auto-validate-photos.js
node /tmp/auto-validate-photos.js
scp /tmp/auto-validated-metadata.json ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json
ssh ubuntu@51.38.35.238 "pm2 restart guillaume-farre"
```

---

### 🔴 URGENT #2 : Corriger carousel (atelier-033 supprimée)

**Problème** : Carousel homepage affiche `atelier-033.jpg` qui est dans la corbeille.

**Fichier** : `components/HeroCarousel.tsx:13`

**Action** :
1. Choisir photo de remplacement (ex: `atelier-003.jpg`)
2. Edit fichier :
```typescript
// AVANT
image: "/images/works/atelier/atelier-033.jpg",

// APRÈS
image: "/images/works/atelier/atelier-003.jpg",
```
3. Commit + push + deploy

**Photos atelier disponibles (pas dans trash)** :
- 003, 004, 005, 006, 007, 008, 009, 011, 015, 016, 017, 019, 020, 021, 022, 023, 024, 025, 027, 028, 030, 031, 035, 036, 037, 038, 040, 042, 043, 045, 046, 047, 048, 049, 050, 051, 052, 053, 054, 057, 058, 060, 061, 062, 063, 064, 065, 066, 067, 068, 069, 070, 072, 073, 074, 075, 078, 080...

**Recommandation** : Utiliser `atelier-003.jpg` sauf si Guillaume préfère une autre.

---

### 🔴 URGENT #3 : Synchroniser metadata local ← serveur

**APRÈS avoir résolu Urgent #1 et #2** :

```bash
cd /Users/raouldelpech/Desktop/Claude/guillaume-farre/guillaume-farre-from-github
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
ls -lh data/photo-metadata.json
```

**Vérifier** :
```bash
cat data/photo-metadata.json | \
  node -e "const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); \
  console.log('Total photos:', data.length); \
  console.log('Trash:', data.filter(p => p.status === 'trash').length);"
```

**Attendu** : `Trash: 22`

---

## FICHIERS TEMPORAIRES CRÉÉS (session 2025-11-19)

Ces fichiers sont dans `/tmp/` et peuvent être supprimés après validation :

- `/tmp/deleted-photos.txt` - Liste 43 photos supprimées (extraite logs PM2)
- `/tmp/fix-deleted-photos.js` - Script de correction metadata
- `/tmp/prod-metadata.json` - Backup metadata prod avant correction
- `/tmp/fixed-metadata.json` - Metadata corrigé (déjà uploadé en prod)

**Conserver** : `/tmp/deleted-photos.txt` (référence)
**Supprimer** : Les autres (après vérification que tout fonctionne)

---

## POINTS D'ATTENTION

### 1. RÈGLE #32 (critique)
❌ **JAMAIS copier metadata local → production**
✅ **TOUJOURS copier metadata production → local**

### 2. Backups metadata
- Production crée backups auto lors sauvegardes admin
- Backups dans `/var/www/guillaume-farre/data/*.backup.*.json`
- Timestamp format : `1763247149847` (Unix milliseconds)

### 3. Photos supprimées
- Quand Guillaume supprime photo dans admin :
  - Fichier physique SUPPRIMÉ du serveur
  - Metadata marqué `status: 'trash'`
  - Log PM2 contient `[DELETE] Fichier supprimé: /path/to/photo.jpg`
- Récupération possible via logs PM2 (comme fait le 2025-11-19)

### 4. Déploiement
- Toujours `git pull` avant `npm run build`
- Si conflit : `git stash` d'abord
- Toujours vérifier logs PM2 après restart

### 5. Tests local
- `bun run dev` → http://localhost:3000
- Admin → http://localhost:3000/admin
- Galerie → http://localhost:3000/galerie
- Boutique → http://localhost:3000/boutique

---

## COMMANDES UTILES

### SSH rapide
```bash
alias gf-ssh='ssh ubuntu@51.38.35.238'
alias gf-logs='ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 50"'
alias gf-restart='ssh ubuntu@51.38.35.238 "pm2 restart guillaume-farre"'
```

### Backup metadata avant modif
```bash
timestamp=$(date +%s%3N)
ssh ubuntu@51.38.35.238 "cp /var/www/guillaume-farre/data/photo-metadata.json \
  /var/www/guillaume-farre/data/photo-metadata.backup.$timestamp.json"
```

### Restaurer backup
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre/data && \
  cp photo-metadata.backup.1763247149847.json photo-metadata.json && \
  pm2 restart guillaume-farre"
```

### Compter photos par catégorie
```bash
ssh ubuntu@51.38.35.238 "cat /var/www/guillaume-farre/data/photo-metadata.json" | \
  node -e "const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); \
  const cats = {}; \
  data.forEach(p => { \
    p.categories?.forEach(c => cats[c] = (cats[c] || 0) + 1); \
  }); \
  console.log(JSON.stringify(cats, null, 2));"
```

### Chercher photo par filename
```bash
ssh ubuntu@51.38.35.238 "cat /var/www/guillaume-farre/data/photo-metadata.json" | \
  node -e "const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); \
  const photo = data.find(p => p.filename === 'atelier-033.jpg'); \
  console.log(JSON.stringify(photo, null, 2));"
```

---

## CHECKLIST DÉMARRAGE SESSION

- [ ] Lire `ETAT_CRITIQUE_2025-11-19.md`
- [ ] Lire `ROADMAP_2025-11-19.md`
- [ ] Lire `SPECIFICATIONS_METIER_2025-11-19.md`
- [ ] Lire `CLAUDE.md` (section Règles Absolues minimum)
- [ ] `git status` et `git log` local
- [ ] Vérifier metadata production (commande diagnostic #2)
- [ ] Compter photos trash (commande diagnostic #3)
- [ ] Vérifier PM2 production (commande diagnostic #5)
- [ ] Décider par quelle tâche urgente commencer
- [ ] Demander validation Guillaume si nécessaire

---

## CONTACT / QUESTIONS

**Si problème critique** :
1. Vérifier logs PM2 : `ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --err --lines 100"`
2. Restaurer backup si nécessaire (voir commande ci-dessus)
3. Documenter problème dans nouveau fichier `INCIDENT_[DATE].md`

**Si doute sur règle métier** :
1. Relire `SPECIFICATIONS_METIER_2025-11-19.md`
2. Demander à Guillaume via AskUserQuestion tool
3. Documenter réponse dans `SPECIFICATIONS_METIER_2025-11-19.md`

**Si question technique** :
1. Relire `CLAUDE.md`
2. Chercher dans docs Next.js / Stripe / Gelato
3. WebSearch si nécessaire

---

**Créé par** : Lalou
**Date** : 2025-11-19 00:15
**Statut** : Prêt pour reprise session

**Bon courage ! 🚀**

