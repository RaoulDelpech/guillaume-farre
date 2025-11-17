# ⚠️ WARNINGS NON-BLOQUANTS - GUILLAUME FARRÉ

**Date** : 2025-11-17
**Statut** : Informations, non-bloquant pour production

---

## Warning #1 : Turbopack Lockfile Detection

### Symptôme

```
⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
We detected multiple lockfiles and selected the directory of /Users/raouldelpech/package-lock.json as the root directory.
To silence this warning, set `turbopack.root` in your Next.js config, or consider removing one of the lockfiles if it's not needed.
   See https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory for more information.
 Detected additional lockfiles:
   * /Users/raouldelpech/Desktop/Claude/guillaume-farre/guillaume-farre-from-github/package-lock.json
```

### Cause

- Lockfile détecté au mauvais endroit : `/Users/raouldelpech/package-lock.json`
- Next.js Turbopack cherche dans parent directory
- Confusion entre 2 lockfiles

### Impact

- ⚠️ **Warning uniquement** (pas d'erreur)
- ✅ Dev server fonctionne normalement
- ✅ Build fonctionne normalement
- ⚠️ Log pollué par warning répété

### Solutions Possibles

#### Solution 1 : Supprimer Lockfile Parent (RECOMMANDÉ)

```bash
# Vérifier contenu lockfile parent
cat /Users/raouldelpech/package-lock.json

# Si non-utilisé, supprimer
rm /Users/raouldelpech/package-lock.json
```

**Avantages** :
- ✅ Supprime warning définitivement
- ✅ Pas de config à maintenir
- ✅ Nettoie filesystem

**Inconvénients** :
- ⚠️ Vérifier qu'aucun projet parent ne dépend de ce lockfile

#### Solution 2 : Configurer turbopack.root

Modifier `next.config.mjs` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... config existante ...

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
```

**Avantages** :
- ✅ Garde lockfile parent intact
- ✅ Config explicite

**Inconvénients** :
- ⚠️ Config supplémentaire à maintenir

### Recommandation

**Supprimer lockfile parent** si non-utilisé.

**Vérification préalable** :
```bash
# Voir contenu lockfile parent
cat /Users/raouldelpech/package-lock.json

# Si vide ou non-utilisé → supprimer
```

---

## Warning #2 : Routes Labor Simulator 404

### Symptôme

```
POST /fr/back/labor-simulator/test/publicodes 404 in 3874ms
POST /fr/back/labor-simulator/test/publicodes 404 in 608ms
POST /fr/back/labor-simulator/test/publicodes 404 in 401ms
POST /fr/back/labor-simulator/test/publicodes 404 in 253ms
POST /fr/back/labor-simulator/test/publicodes 404 in 92ms
POST /fr/back/labor-simulator/test/publicodes 404 in 72ms
POST /fr/back/labor-simulator/test/publicodes 404 in 73ms
```

### Cause

- Anciennes requêtes vers routes qui n'existent plus
- Peut-être restes d'un ancien projet (Juris-Power labor simulator?)
- Ou frontend qui tente d'appeler une API inexistante

### Impact

- ⚠️ **404 uniquement** (pas d'erreur)
- ✅ Ne casse rien
- ✅ Logs pollués

### Investigation

**Recherche fichiers labor** :
```bash
find . -name "*labor*" -o -name "*publicodes*" | grep -v node_modules
```

**Résultat** : Aucun fichier trouvé

### Solutions Possibles

#### Solution 1 : Identifier Source Requêtes

**Vérifier si frontend fait ces requêtes** :

```bash
# Chercher dans code frontend
grep -r "labor-simulator" app/ components/ lib/ --include="*.ts" --include="*.tsx"
grep -r "publicodes" app/ components/ lib/ --include="*.ts" --include="*.tsx"
```

**Si trouvé** :
- Supprimer code qui fait ces requêtes
- Ou créer API route si nécessaire

#### Solution 2 : Ignorer (RECOMMANDÉ)

**Si code propre** :
- Ces requêtes viennent peut-être d'un autre onglet/projet
- Port 3000 partagé entre projets?
- 404 = comportement normal

**Avantages** :
- ✅ Rien à faire
- ✅ Ne casse rien

**Inconvénients** :
- ⚠️ Logs pollués

### Recommandation

**Ignorer pour l'instant.**

**Si logs pollués deviennent gênants** :
1. Identifier source requêtes (autre projet?)
2. Fermer autres serveurs dev sur port 3000
3. Ou créer middleware pour filtrer logs 404

---

## Résumé

| Warning | Impact | Priorité | Solution |
|---------|--------|----------|----------|
| Turbopack lockfile | Logs pollués | Basse | Supprimer lockfile parent |
| Routes 404 labor | Logs pollués | Très basse | Ignorer ou identifier source |

**Aucun warning ne bloque production.**

---

## Prochaines Actions (Optionnel)

### Si Temps Disponible

1. **Supprimer lockfile parent** (2 min) :
   ```bash
   cat /Users/raouldelpech/package-lock.json  # Vérifier
   rm /Users/raouldelpech/package-lock.json   # Supprimer si vide
   ```

2. **Chercher source 404** (5 min) :
   ```bash
   grep -r "labor-simulator" . --include="*.ts" --include="*.tsx"
   ```

3. **Tester après fixes** (2 min) :
   ```bash
   npm run dev  # Vérifier warnings disparus
   ```

### Si Pas le Temps

**Ignorer complètement.**

Ces warnings ne bloquent rien.

---

**Lalou**
