# MESSAGE DE REPRISE - GUILLAUME FARRÉ - 2026-01-21 V2

Tu viens de subir un compactage de contexte. Avant toute action, tu dois reconstituer intégralement ta compréhension du projet.

Lis d'abord ce fichier dans son intégralité. Il contient tout le contexte projet, la roadmap, les spécifications, l'architecture, les règles, et l'état exact où tu en étais.

Ensuite relis dans cet ordre avec un niveau d'attention maximal :
1. ~/.claude-global-rules.md - les règles absolues à ne jamais violer
2. ~/.claude-memory-raoul.md - le contexte personnel et les préférences
3. ~/projets/_central/PROJECTS_STATE.md - l'état de tous les projets
4. ~/Desktop/Claude/guillaume-farre/guillaume-farre-from-github/CLAUDE.md - specs projet
5. ~/Desktop/Claude/guillaume-farre/guillaume-farre-from-github/DIRECTION_ARTISTIQUE.md - charte visuelle

Une fois que tu as tout relu et pleinement assimilé, confirme ta compréhension en résumant en 5 lignes : le projet, son état actuel, la tâche en cours, et la prochaine action à faire.

Puis reprends le travail exactement à l'étape indiquée, sans poser de questions inutiles, sans refaire ce qui a déjà été fait, et sans perdre aucune information du contexte précédent.

---

## PARTIE 1 - CONTEXTE GLOBAL DU PROJET

### Vision et Objectifs

**Projet** : Site portfolio et boutique pour Guillaume Farré, artiste qui crée des œuvres en faisant rouler ses Ferrari Dino sur des toiles.

**Vision** : Un site de galerie d'art contemporain haut de gamme, style Pace Gallery / Gagosian / Philippe Shangti. Minimalisme absolu, élégance, respiration visuelle. **Ambiance confidentielle / club privé** avec protection par mot de passe.

**Phrase signature** : "Une Dino pour pinceau"
**Sous-titre** : "Toiles. Photographies. Performances."

### Stack Technique

```
Framework: Next.js 15.5.6 (App Router, Turbopack)
Runtime: npm / Node 20
Langage: TypeScript 5.8.3
Styling: Tailwind CSS + shadcn/ui (thème zinc personnalisé bronze/taupe)
i18n: next-intl (FR/EN/IT)
Paiements: Stripe (désactivé - initialisé conditionnellement)
```

### Architecture Dossiers

```
/guillaume-farre-from-github/
├── app/[locale]/           # Pages internationalisées
│   ├── page.tsx            # Homepage
│   ├── login/page.tsx      # Page login AVEC portes industrielles intégrées
│   ├── galerie/            # Galerie photos (3 catégories)
│   ├── dino/               # Page Dino (la voiture)
│   ├── atelier/            # L'atelier
│   ├── origine/            # Histoire personnelle
│   ├── contact/            # Contact
│   ├── admin/              # Interface admin (protégée)
│   └── layout.tsx          # Layout avec VideoIntro, Footer
├── components/
│   ├── GalleryClient.tsx   # Galerie avec filtres (empreintes/atelier/projections)
│   ├── VideoIntro.tsx      # Vidéo intro avec CTA "Activer le son"
│   ├── navigation/         # Navigation
│   └── DarkEntry.tsx       # (Désactivé - portes maintenant dans login)
├── data/
│   ├── photo-metadata.json # Métadonnées photos (70 actives après tri)
│   └── page-images.json    # Configuration images dynamiques
├── middleware.ts           # Protection mot de passe TOUT le site
├── messages/
│   ├── fr.json             # Traductions FR
│   ├── en.json             # Traductions EN
│   └── it.json             # Traductions IT
└── public/
    ├── images/works/       # Photos œuvres
    │   ├── empreintes/     # 35 photos (traces de pneu sur toile)
    │   ├── atelier/        # 24 photos (photos de la Dino/lieu)
    │   └── projection/     # 11 photos (peinture projetée)
    └── video-intro.mp4     # Vidéo intro
```

---

## PARTIE 2 - TRAVAIL EFFECTUÉ CETTE SESSION

### 1. Serveur IONOS Upgradé

**Problème initial** : Serveur avait seulement 8.7 Go de disque → ENOSPC pendant npm install

**Solution** :
- Contacté support IONOS
- Upgrade vers VPS S (4€/mois)
- **Partition étendue manuellement** avec `growpart` et `resize2fs`
- Résultat : **77 Go disque** (69 Go libres)

**Commandes utilisées** :
```bash
growpart /dev/vda 1
resize2fs /dev/vda1
```

### 2. Stripe Rendu Conditionnel

**Problème** : Build échouait car Stripe nécessite clé API au build time

**Solution** : Modifié 5 fichiers pour initialiser Stripe conditionnellement :
- `app/api/stripe/checkout/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/api/webhooks/stripe/route.ts`
- `app/api/orders/route.ts`
- `app/api/gelato/webhook/route.ts`

Pattern appliqué :
```typescript
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' })
  : null;
```

### 3. Système d'Entrée Refait (Ambiance Club Privé)

**Nouvelle séquence** :
1. Visiteur arrive → redirect vers `/login`
2. Page login affiche **portes industrielles** (métal, rivets, poignées)
3. Texte "Guillaume Farré / Une Dino pour pinceau / Entrer"
4. Clic "Entrer" → portes s'ouvrent (animation 1.5s)
5. Champ mot de passe apparaît ("Espace privé")
6. Validation → redirect vers site
7. **Vidéo intro** se lance avec CTA "Activer le son"

**Fichiers modifiés** :
- `app/[locale]/login/page.tsx` - Portes + login intégrés
- `middleware.ts` - Protection mot de passe TOUT le site
- `components/VideoIntro.tsx` - CTA "Activer le son" si muté
- `app/[locale]/layout.tsx` - DarkEntry désactivé (portes dans login)

**Mot de passe** : `LHOOQladino246`

### 4. VideoIntro avec CTA Son

**Ajout** : Bouton "Activer le son" (animate-pulse) qui apparaît si la vidéo joue en muet
- S'affiche pendant 8 secondes puis disparaît
- Clic → active le son et cache le CTA
- Ensuite bouton mute/unmute classique

---

## PARTIE 3 - ÉTAT SERVEUR PRODUCTION

**Hébergeur** : IONOS (PAS OVH !) - IP 87.106.40.44
**SSH** : root / V2RMZaq8

**État actuel** :
- Disque : 77 Go (69 Go libres, 11% utilisé)
- node_modules : 840 Mo
- PM2 : online (restart #20)
- Site : https://guillaumefarre.com ✅

**Commandes utiles** :
```bash
# Connexion SSH
sshpass -p 'V2RMZaq8' ssh -o StrictHostKeyChecking=no root@87.106.40.44

# Déployer
cd ~/Desktop/Claude/guillaume-farre/guillaume-farre-from-github
sshpass -p 'V2RMZaq8' rsync -avz --delete \
  --exclude 'node_modules' --exclude '.git' --exclude '.env.local' --exclude '.next' \
  -e 'ssh -o StrictHostKeyChecking=no' \
  ./ root@87.106.40.44:/var/www/guillaumefarre/

# Build sur serveur
sshpass -p 'V2RMZaq8' ssh root@87.106.40.44 'cd /var/www/guillaumefarre && npm run build && pm2 restart guillaumefarre'

# Vérifier espace disque
sshpass -p 'V2RMZaq8' ssh root@87.106.40.44 'df -h /'
```

---

## PARTIE 4 - COOKIES ET AUTHENTIFICATION

**Cookies utilisés** :
- `gf_auth` = "authenticated" → Accès au site (30 jours)
- `gf_dark_entry_seen` = "true" → Déclenche la vidéo (7 jours)
- `gf_intro_seen` = "true" → Vidéo déjà vue (30 jours)

**Flow** :
1. Sans `gf_auth` → middleware redirect vers /login
2. Login valide → pose `gf_auth` + `gf_dark_entry_seen`
3. Arrivée sur site → VideoIntro détecte `gf_dark_entry_seen` + pas `gf_intro_seen` → lance vidéo
4. Fin vidéo → pose `gf_intro_seen`

---

## PARTIE 5 - DIRECTION ARTISTIQUE (RAPPEL)

### INTERDICTIONS ABSOLUES
- Couleurs vives (red, orange, amber, green, purple)
- font-bold / font-semibold → Utiliser UNIQUEMENT `font-light`
- rounded-full sur boutons CTA
- scale-110 sur images → max scale-105
- animate-bounce / animate-ping (sauf CTA son avec animate-pulse)

### Palette
- Background : #1C1915 (dark) / #FAF8F5 (light)
- Foreground : #EDE9E3 (dark) / #1C1915 (light)
- Primary : #C4A570 (bronze doré)

---

## PARTIE 6 - DERNIÈRES ACTIONS

1. ✅ Serveur IONOS upgradé (77 Go disque)
2. ✅ Partition étendue avec growpart/resize2fs
3. ✅ Stripe rendu conditionnel (5 fichiers)
4. ✅ Page login avec portes industrielles
5. ✅ Middleware protection tout le site
6. ✅ VideoIntro avec CTA "Activer le son"
7. ✅ Build et déploiement réussi

---

## PARTIE 7 - PROCHAINE ACTION

**Site déployé et fonctionnel** : https://guillaumefarre.com

Pour tester la nouvelle entrée :
1. Ouvrir navigation privée (Cmd+Shift+N Chrome / Cmd+Shift+P Firefox)
2. Aller sur https://guillaumefarre.com
3. Voir les portes industrielles
4. Cliquer "Entrer"
5. Entrer mot de passe : LHOOQladino246
6. Voir la vidéo avec CTA "Activer le son"

**Attente retour utilisateur** sur l'expérience de l'entrée.

---

## RÉSUMÉ EN 5 LIGNES

1. **Projet** : Site portfolio Guillaume Farré (artiste Dino), Next.js 15.5.6
2. **État** : Site déployé sur guillaumefarre.com, serveur IONOS 77 Go
3. **Nouveauté** : Entrée "club privé" avec portes industrielles + login + vidéo
4. **Technique** : Stripe conditionnel, middleware auth tout site, CTA son
5. **Prochaine** : Attendre feedback utilisateur sur la nouvelle entrée

---

Maintenu par : Lalou
Date : 2026-01-21 13:30
