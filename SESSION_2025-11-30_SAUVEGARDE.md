# SESSION 2025-11-30 - SAUVEGARDE COMPLÈTE

**Date** : 2025-11-30
**Par** : Lalou
**Statut** : En cours

---

## CONTEXTE

Suite de la session 2025-11-29. Après compactage, relecture complète de toute la documentation et reprise des travaux.

---

## TRAVAUX RÉALISÉS CETTE SESSION

### 1. Relecture complète documentation
- ✅ SESSION_2025-11-29_SAUVEGARDE.md
- ✅ SPECIFICATIONS_METIER_2025-11-19.md
- ✅ Lightbox.tsx, HeroCarousel.tsx, page.tsx
- ✅ DOCUMENT_MAITRE.md
- ✅ INDEX_DOCUMENTATION.md
- ✅ ROADMAP_2025-11-19.md
- ✅ messages/fr.json

### 2. Mise à jour documentation (9/99 exemplaires)
- ✅ SPECIFICATIONS_METIER_2025-11-19.md : 9 ex. grands formats, 99 ex. petits formats
- ✅ DOCUMENT_MAITRE.md v3.0 : nouvelles règles exemplaires
- ✅ CLAUDE.md : plus de tirages illimités, tous numérotés
- ✅ ROADMAP_2025-11-19.md : mise à jour schema et statuts
- ✅ SESSION_2025-11-29_FINAL.md : rapport complet

### 3. Migration metadata production
- ✅ Backup créé avant migration
- ✅ Script migration créé (/tmp/migrate-metadata-9-99.js)
- ✅ limitedEdition.total : 7 → 9
- ✅ Ajout limitedEditionGrand : { total: 9, ... }
- ✅ Ajout limitedEditionPetit : { total: 99, ... }
- ✅ Ajout prix A4 : 250€
- ✅ Upload en production
- ✅ PM2 restart

### 4. Adaptation interface boutique
- ✅ StockBadge.tsx : support formatType grand/petit
- ✅ ShopGrid.tsx : affiche X/9 grands formats, X/99 petits formats
- ✅ PricingDisplay.tsx : nouvelle structure sans tirages illimités
- ✅ lib/admin/photo-manager.ts : ajout limitedEditionGrand et limitedEditionPetit

### 5. Déploiement production
- ✅ Commit baa1b92
- ✅ Push GitHub
- ✅ git stash + pull + build + restart sur serveur
- ✅ HTTP 200 sur /fr/boutique

### 6. Galerie immersive
- ✅ galerie/page.tsx : hero avec image pleine page et overlay sombre
- ✅ Lightbox.tsx : fond noir pur, interface minimale, sans filtre blanc

### 7. Page Histoire de la Dino
- ✅ CRÉATION /dino-histoire : page complète sur l'histoire de la Ferrari Dino
- ✅ Contenu : Alfredo Ferrari, moteur V6, 206 GT, 246 GT/GTS, héritage
- ✅ Images : Unsplash (libres de droit, pas images de la galerie Guillaume)
- ✅ Lien ajouté depuis /dino vers /dino-histoire
- ✅ Déployé en production

---

## COMMITS CETTE SESSION

1. `4e6766a` - docs: mise à jour complète documentation + migration metadata 9/99 exemplaires
2. `baa1b92` - feat: adapter interface boutique pour compteurs 9/99 selon format
3. `e13a897` - fix: images Unsplash libres de droit pour page dino-histoire

---

## ÉTAT ACTUEL

### Git
- **Branche** : main
- **Dernier commit** : baa1b92
- **Status** : Clean, up to date avec origin/main

### Production
- **Site** : https://guillaumefarre.com
- **PM2** : online (PID 445019)
- **Build** : 105 pages générées
- **Metadata** : Migré vers schema 9/99 exemplaires

---

## RÈGLES MÉTIER ACTUELLES (2025-11-30)

### Exemplaires
| Type | Formats | Exemplaires | Numérotation |
|------|---------|-------------|--------------|
| Grands formats | 2A0, A0, A1 | 9 | 1/9 à 9/9 |
| Petits formats | A2, A3, A4 | 99 | 1/99 à 99/99 |

### Prix
| Format | Dimensions | Prix | Exemplaires |
|--------|-----------|------|-------------|
| 2A0 | 118.9 × 168.2 cm | Sur devis | 9 |
| A0 | 84.1 × 118.9 cm | Sur devis | 9 |
| A1 | 59.4 × 84.1 cm | 1200€ | 9 |
| A2 | 42 × 59.4 cm | 800€ | 99 |
| A3 | 29.7 × 42 cm | 500€ | 99 |
| A4 | 21 × 29.7 cm | 250€ | 99 |

### Changements session 2025-11-29
- ✅ Page /performances supprimée
- ✅ Textes en 1ère personne ("je" au lieu de "Guillaume")
- ✅ Boutons discrets et élégants
- ✅ "Boutique" renommé "Commandes"
- ✅ Plus de tirages illimités - tous numérotés

---

## FICHIERS MODIFIÉS

### Documentation
```
SPECIFICATIONS_METIER_2025-11-19.md
DOCUMENT_MAITRE.md
CLAUDE.md
ROADMAP_2025-11-19.md
SESSION_2025-11-29_FINAL.md
SESSION_2025-11-30_SAUVEGARDE.md (ce fichier)
```

### Code
```
components/StockBadge.tsx
components/shop/PricingDisplay.tsx
components/shop/ShopGrid.tsx
lib/admin/photo-manager.ts
data/photo-metadata.json
```

---

## ACCÈS AU SITE

**URL** : https://guillaumefarre.com
**Login** : `x`
**Password** : `LHOOQladino246`

**Admin** : https://guillaumefarre.com/fr/admin
**Password admin** : `LHOOQladino246`

---

## CE QUI RESTE À FAIRE

1. **Traductions EN/IT** : DeepL pas fait (demandé de ne pas faire)

---

## RÈGLE #32 RAPPEL

```
❌ INTERDIT : Copier data/photo-metadata.json LOCAL → PRODUCTION
✅ AUTORISÉ : Copier data/photo-metadata.json PRODUCTION → LOCAL

Le fichier data/photo-metadata.json du SERVEUR est la SOURCE DE VÉRITÉ.
```

---

## COMMANDES UTILES

### SSH rapide
```bash
ssh ubuntu@51.38.35.238
```

### Déploiement
```bash
ssh ubuntu@51.38.35.238 "cd /var/www/guillaume-farre && git stash && git pull && npm run build && pm2 restart guillaume-farre"
```

### Sync metadata local
```bash
scp ubuntu@51.38.35.238:/var/www/guillaume-farre/data/photo-metadata.json data/photo-metadata.json
```

### Vérifier production
```bash
ssh ubuntu@51.38.35.238 "pm2 status && curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"
```

---

## POUR LA PROCHAINE SESSION

1. Lire ce fichier en premier
2. Lire SPECIFICATIONS_METIER_2025-11-19.md
3. Lire CLAUDE.md
4. `git status && git log -5`
5. Vérifier production : `ssh ubuntu@51.38.35.238 "pm2 status"`

---

**Maintenu par** : Lalou
**Sauvegardé** : 2025-11-30
