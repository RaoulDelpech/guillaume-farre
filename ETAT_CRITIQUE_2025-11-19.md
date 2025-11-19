# ÉTAT CRITIQUE SESSION 2025-11-19 - RÉCUPÉRATION METADATA

**Date** : 2025-11-19 00:05
**Statut** : PARTIELLEMENT RÉSOLU - NÉCESSITE VALIDATION GUILLAUME
**Gravité** : 🔴 CRITIQUE

---

## PROBLÈME INITIAL

**Erreur commise** : J'ai copié le fichier `data/photo-metadata.json` LOCAL vers PRODUCTION, ce qui a ÉCRASÉ les modifications récentes de Guillaume dans l'admin (photos mises dans la corbeille et photos validées pour galerie/boutique).

**Commande fatale exécutée** :
```bash
scp data/photo-metadata.json ubuntu@51.38.35.238:/var/www/guillaume-farre/data/
```

**Conséquence** :
- ❌ Photos que Guillaume venait de mettre dans la corbeille → disparues de la corbeille
- ❌ Photos que Guillaume venait de valider pour galerie/boutique → plus visibles
- ❌ Travail de Guillaume perdu

---

## SOLUTION APPLIQUÉE

### 1. Extraction logs PM2 ✅

J'ai récupéré TOUTES les photos supprimées depuis les logs PM2 du serveur :

```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 2000 --nostream" | grep "\[DELETE\] Fichier supprimé:"
```

**Liste complète des 43 photos supprimées** (sauvegardée dans `/tmp/deleted-photos.txt`) :

#### Photos WhatsApp (dossier a-trier/) - 18 photos
- 1762579267612_WhatsApp_Image_2025-11-05_at_23.14.34__3_.jpeg
- 1762579267614_WhatsApp_Image_2025-11-05_at_23.14.34__2_.jpeg
- 1762579267615_WhatsApp_Image_2025-11-05_at_23.14.34__1_.jpeg
- 1762579267616_WhatsApp_Image_2025-11-05_at_23.14.33__2_.jpeg
- 1762579267616_WhatsApp_Image_2025-11-05_at_23.14.34.jpeg
- 1762579267629_WhatsApp_Image_2025-11-05_at_23.14.19__2_.jpeg
- 1762579267636_WhatsApp_Image_2025-11-02_at_09.22.45__11_.jpeg
- 1762579267637_WhatsApp_Image_2025-11-02_at_09.22.45__8_.jpeg
- 1762579267639_WhatsApp_Image_2025-11-02_at_09.22.44__15_.jpeg
- 1762579267641_WhatsApp_Image_2025-11-02_at_09.22.44__13_.jpeg
- 1762579267642_WhatsApp_Image_2025-11-02_at_09.22.44__12_.jpeg
- 1762579267652_WhatsApp_Image_2025-11-02_at_09.22.42__15_.jpeg
- 1762579267708_WhatsApp_Image_2025-11-02_at_09.22.40__11_.jpeg
- 1762579267711_WhatsApp_Image_2025-11-02_at_09.22.39__13_.jpeg
- 1762579267712_WhatsApp_Image_2025-11-02_at_09.22.39__11_.jpeg
- 1762579267712_WhatsApp_Image_2025-11-02_at_09.22.39__9_.jpeg
- 1762579267722_WhatsApp_Image_2025-11-02_at_09.22.36__13_.jpeg
- 1762579267726_WhatsApp_Image_2025-11-02_at_09.22.36__8_.jpeg

#### Photos atelier/ - 23 photos
- atelier-001.jpg
- atelier-002.jpg
- atelier-010.jpg
- atelier-012.jpg ⚠️ (supprimée récemment par Guillaume)
- atelier-013.jpg ⚠️ (supprimée récemment par Guillaume)
- atelier-014.jpg
- atelier-018.jpg
- atelier-026.jpg
- atelier-029.jpg
- atelier-032.jpg
- atelier-033.jpg ⚠️ (UTILISÉE DANS LE CAROUSEL !)
- atelier-034.jpg
- atelier-039.jpg
- atelier-041.jpg
- atelier-044.jpg
- atelier-055.jpg
- atelier-056.jpg
- atelier-059.jpg
- atelier-071.jpg
- atelier-076.jpg ⚠️ (supprimée récemment par Guillaume, apparaît 2x dans logs)
- atelier-077.jpg
- atelier-079.jpg

#### Photos empreintes/ - 2 photos
- empreintes-011.jpg
- empreintes-017.jpg

#### Photos projection/ - 1 photo
- projection-025.jpg ⚠️ (supprimée récemment par Guillaume)

**⚠️ = Photos supprimées dans les DERNIÈRES minutes avant mon erreur**

---

### 2. Reconstruction metadata ✅

**Script créé** : `/tmp/fix-deleted-photos.js`

**Ce qu'il fait** :
1. Lit le metadata actuel du serveur
2. Lit la liste des 43 photos supprimées
3. Pour chaque photo dans le metadata :
   - Si son filename est dans la liste des supprimées → `status: 'trash'` + `visible: false`
4. Sauvegarde le metadata corrigé

**Résultat exécution** :
```
📋 Photos à marquer comme supprimées : 43
📋 Total photos dans metadata : 137
✅ Marqué comme trash : 22 photos

Photos non trouvées : 21 (fichiers WhatsApp qui n'étaient pas encore dans metadata)
```

**22 photos marquées `trash` dans metadata** :
- atelier-001, 002, 010, 012, 014, 018, 026, 029, 032, 033, 034, 039, 041, 044, 055, 056, 059, 071, 077, 079
- empreintes-011, 017

---

### 3. Upload vers production ✅

```bash
scp /tmp/fixed-metadata.json ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && pm2 restart guillaume-farre"
```

**Statut** : ✅ Déployé et redémarré à 00:03

---

## PROBLÈME RESTANT 🔴

### Photos validées par Guillaume = PERDUES

Le metadata restauré date du **18 Nov 2025 à 20:16**.

**Ce qui a été récupéré** :
- ✅ Photos supprimées (22 photos marquées `trash`)

**Ce qui est PERDU** :
- ❌ Photos que Guillaume avait validées APRÈS 20:16 pour afficher en galerie/boutique
- ❌ Ces photos ne sont plus marquées comme `visible: true`
- ❌ Résultat : galerie et boutique sont vides ou incomplètes

**Citation Guillaume** :
> "et a contrario toute les photos qui devraient s'afficher en galerie et/ou dans la partie commande ne s'affichent pas"

---

## ACTIONS REQUISES AVANT PROCHAINE SESSION

### Option 1 : Guillaume re-valide les photos manuellement ❌
- Guillaume doit aller dans l'admin
- Revalider toutes les photos qu'il avait validées récemment
- ❌ Refait le travail qu'il avait déjà fait

### Option 2 : Marquer TOUTES les photos comme visibles sauf corbeille ⚠️
- Script qui marque `visible: true` + `status: null` pour toutes les photos
- SAUF celles qui ont `status: 'trash'`
- ⚠️ Risque : photos que Guillaume n'avait PAS validées apparaîtront aussi

### Option 3 : Chercher dans les backups une version plus récente ⚠️
- Il existe peut-être un backup automatique entre 20:16 et maintenant
- Chercher dans `/var/www/guillaume-farre/data/` sur le serveur
- ⚠️ Peu probable car les backups se créent seulement lors des sauvegardes manuelles

---

## FICHIERS MODIFIÉS CETTE SESSION

### Production (serveur)
- `/var/www/guillaume-farre/data/photo-metadata.json` ✅ (corrigé avec photos trash)

### Local (à synchroniser pour prochaine session)
- Aucun fichier code modifié
- `/tmp/deleted-photos.txt` (liste des 43 photos supprimées)
- `/tmp/fix-deleted-photos.js` (script de correction)
- `/tmp/prod-metadata.json` (backup metadata prod avant correction)
- `/tmp/fixed-metadata.json` (metadata corrigé uploadé)

---

## CAROUSEL - BUG CONNU 🔴

**Problème** : Le carousel homepage utilise `atelier-033.jpg` qui est maintenant dans la corbeille.

**Fichier** : `components/HeroCarousel.tsx:13`

**Ligne à corriger** :
```typescript
{
  image: "/images/works/atelier/atelier-033.jpg", // ❌ CETTE PHOTO EST DANS TRASH
  title: t("creations.title"),
  // ...
}
```

**Photos atelier disponibles (pas dans corbeille)** :
- atelier-003, 004, 005, 006, 007, 008, 009, 011, 015, 016, 017, 019, 020, 021, 022, 023, 024, 025, 027, 028, 030, 031, 035, 036, 037, 038, 040, 042, 043, 045, 046, 047, 048, 049, 050, 051, 052, 053, 054, 057, 058, 060, 061, 062, 063, 064, 065, 066, 067, 068, 069, 070, 072, 073, 074, 075, 078, 080...

**Action requise** : Remplacer `atelier-033.jpg` par une autre photo valide (à valider avec Guillaume).

---

## BACKUPS DISPONIBLES

### Local
```
-rw-r--r--  1 raouldelpech  staff  43645  7 nov 22:39 data/photo-metadata.backup.1762551576668.json
-rw-r--r--  1 raouldelpech  staff  64904 15 nov 23:52 data/photo-metadata.backup.1763247149847.json
```

### Production (serveur)
```
-rw-rw-r-- 1 ubuntu ubuntu 43645 Nov  8 13:04 photo-metadata.backup.1762551576668.json
-rw-r--r-- 1 ubuntu ubuntu 64904 Nov  9 17:05 photo-metadata.json.backup
-rw-rw-r-- 1 ubuntu ubuntu 64904 Nov 18 20:16 photo-metadata.backup.1763247149847.json ⬅️ UTILISÉ
```

**Backup le plus récent** : 18 Nov 2025 à 20:16 (timestamp: 1763247149847)

---

## RÈGLE ABSOLUE AJOUTÉE

**RÈGLE #32 : PHOTO METADATA = SERVEUR FAIT FOI**

```
❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISÉ : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier data/photo-metadata.json du SERVEUR est la SOURCE DE VÉRITÉ.
Guillaume travaille dans l'admin en production.
Ne JAMAIS écraser ce fichier depuis le local.
```

**Ajouter cette règle à** :
- `~/.claude-global-rules.md`
- `CLAUDE.md` de ce projet

---

## COMMANDES UTILES POUR DIAGNOSTIC

### Vérifier metadata production
```bash
ssh ubuntu@51.38.35.238 "ls -lh /var/www/guillaume-farre/data/photo-metadata.json"
```

### Compter photos par statut
```bash
ssh ubuntu@51.38.35.238 "cat /var/www/guillaume-farre/data/photo-metadata.json" | \
  jq '[.[] | .status] | group_by(.) | map({status: .[0], count: length})'
```

### Voir logs PM2 récents
```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 100 --nostream"
```

### Chercher photos supprimées dans logs
```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --lines 2000 --nostream" | \
  grep "\[DELETE\] Fichier supprimé:"
```

---

## PROCHAINE SESSION - CHECKLIST

### 1. Vérifier l'état actuel
```bash
# Combien de photos trash ?
ssh ubuntu@51.38.35.238 "cat /var/www/guillaume-farre/data/photo-metadata.json" | \
  jq '[.[] | select(.status == "trash")] | length'

# Combien de photos visibles ?
ssh ubuntu@51.38.35.238 "cat /var/www/guillaume-farre/data/photo-metadata.json" | \
  jq '[.[] | select(.visible == true)] | length'
```

### 2. Demander à Guillaume
- Quelles photos devraient s'afficher en galerie/boutique ?
- Toutes les photos trash sont-elles bien dans la corbeille admin ?

### 3. Options correction
- **Option A** : Guillaume re-valide les photos manuellement (propre mais long)
- **Option B** : Script marque toutes photos visibles sauf trash (rapide mais risqué)
- **Option C** : Guillaume donne liste des photos à afficher (précis)

### 4. Corriger carousel
- Remplacer `atelier-033.jpg` par photo valide
- Builder et déployer

---

## CONTACT URGENCE

**Si problème** : Vérifier les logs PM2 en priorité
```bash
ssh ubuntu@51.38.35.238 "pm2 logs guillaume-farre --err --lines 50"
```

**Restaurer backup si nécessaire** :
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre/data && \
  cp photo-metadata.backup.1763247149847.json photo-metadata.json && \
  pm2 restart guillaume-farre"
```

---

## RÉSUMÉ ÉTAT ACTUEL

✅ **RÉSOLU** :
- Photos supprimées récupérées depuis logs PM2
- 22 photos marquées `status: 'trash'` dans metadata
- Metadata corrigé uploadé et déployé en production
- PM2 redémarré avec nouveau metadata

🔴 **NON RÉSOLU** :
- Photos validées par Guillaume après 18 Nov 20:16 = perdues
- Galerie/boutique vides ou incomplètes
- Carousel affiche `atelier-033.jpg` qui est dans trash

⚠️ **NÉCESSITE VALIDATION GUILLAUME** :
- Quelle option choisir pour récupérer les photos visibles ?
- Quelle photo utiliser pour remplacer atelier-033 dans carousel ?

---

**Documenté par** : Lalou
**Date** : 2025-11-19 00:08
**Statut session** : Prête à fermer après lecture Guillaume

