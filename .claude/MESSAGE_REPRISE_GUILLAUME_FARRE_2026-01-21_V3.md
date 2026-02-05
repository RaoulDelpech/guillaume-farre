# MESSAGE DE REPRISE - GUILLAUME FARRÉ - 2026-01-21 V3

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
│   ├── GalleryClient.tsx   # Galerie avec filtres
│   ├── VideoIntro.tsx      # Vidéo intro (MODIFIÉ cette session)
│   ├── navigation/MobileNav.tsx  # Menu burger (MODIFIÉ cette session)
│   ├── admin/AdminToolbar.tsx    # Barre admin (MODIFIÉ cette session)
│   └── DarkEntry.tsx       # (Désactivé - portes maintenant dans login)
├── data/
│   ├── photo-metadata.json # Métadonnées photos
│   └── page-images.json    # Configuration images dynamiques
├── middleware.ts           # Protection mot de passe TOUT le site
├── messages/
│   ├── fr.json             # Traductions FR
│   ├── en.json             # Traductions EN
│   └── it.json             # Traductions IT
└── public/
    ├── images/works/       # Photos œuvres
    └── video-intro.mp4     # Vidéo intro (MODIFIÉ - 5 premières sec coupées)
```

---

## PARTIE 2 - TRAVAIL EFFECTUÉ CETTE SESSION

### 1. Entrée "Club Privé" (OK - déjà déployé)
- Portes industrielles + login intégrés dans `/login`
- Middleware protection tout le site
- Vidéo intro après login

### 2. Adaptations Mobile (EN COURS - pas déployé)
- **VideoIntro.tsx** :
  - `object-contain` au lieu de `object-cover` (moins de zoom)
  - Message "Tournez votre écran" SUPPRIMÉ
  - CTA son plus visible ("Cliquez pour le son")
  - Boutons adaptés mobile

- **MobileNav.tsx** :
  - Menu burger avec fond solide `bg-zinc-900`
  - Texte blanc visible
  - Bordure zinc-700

### 3. Vidéo coupée (EN COURS - pas déployé)
- **Problème** : Les 5 premières secondes montrent "catalogue" qui zoome mal sur mobile
- **Solution** : Vidéo coupée avec ffmpeg, sauvegardée dans `public/video-intro.mp4`
- Fichier local prêt, pas encore uploadé sur serveur

### 4. Bouton "Publier" dans admin (EN COURS - pas déployé)
- **AdminToolbar.tsx** : Ajout bouton vert "Publier"
- **app/api/admin/rebuild/route.ts** : Nouvelle API qui lance `npm run build && pm2 restart`
- Permet de republier le site après édition de texte

### 5. Mot de passe admin simplifié (EN COURS - pas déployé)
- Changé de `Guillaumedinoman2025!` à `dino246`
- Fichier modifié : `app/api/admin/login/route.ts`

### 6. Document Guillaume (OK - créé)
- `GUIDE_GUILLAUME.md` créé avec tous les mots de passe et guide admin

---

## PARTIE 3 - ÉTAT SERVEUR PRODUCTION

**Hébergeur** : IONOS (PAS OVH !) - IP 87.106.40.44
**SSH** : root / V2RMZaq8

**PROBLÈME CRITIQUE** : SSH bloqué par fail2ban !
- Trop de tentatives SSH → IP bannie
- Le serveur vient d'être rebooté mais fail2ban re-bloque immédiatement
- Les modifications locales NE SONT PAS DÉPLOYÉES

**État actuel serveur** (ancien code) :
- Video : version originale avec "catalogue" au début
- VideoIntro : `object-cover` (zoom excessif)
- Menu burger : fond transparent (pas visible)
- Mot de passe admin : ancien (`Guillaumedinoman2025!`)

**État local** (nouveau code prêt) :
- Video : coupée (5 premières sec supprimées)
- VideoIntro : `object-contain` + sans message rotation
- Menu burger : `bg-zinc-900` solide
- Mot de passe admin : `dino246`
- Bouton "Publier" dans admin

---

## PARTIE 4 - COOKIES ET AUTHENTIFICATION

**Cookies utilisés** :
- `gf_auth` = "authenticated" → Accès au site (30 jours)
- `gf_dark_entry_seen` = "true" → Déclenche la vidéo (7 jours)
- `gf_intro_seen` = "true" → Vidéo déjà vue (30 jours)

**Flow** :
1. Sans `gf_auth` → middleware redirect vers /login
2. Login valide → pose `gf_auth` + `gf_dark_entry_seen`
3. Arrivée sur site → VideoIntro détecte pas `gf_intro_seen` → lance vidéo
4. Fin vidéo → pose `gf_intro_seen`

**Mots de passe** :
- Site visiteur : `LHOOQladino246`
- Admin photos : `dino246` (une fois déployé)

---

## PARTIE 5 - FICHIERS MODIFIÉS CETTE SESSION

1. `components/VideoIntro.tsx` - object-contain, CTA son, sans message rotation
2. `components/navigation/MobileNav.tsx` - fond solide zinc-900
3. `components/admin/AdminToolbar.tsx` - bouton Publier
4. `app/api/admin/rebuild/route.ts` - NOUVEAU fichier
5. `app/api/admin/login/route.ts` - mdp simplifié
6. `app/[locale]/login/page.tsx` - rivets/poignées adaptés mobile
7. `public/video-intro.mp4` - vidéo coupée (5 premières sec)
8. `GUIDE_GUILLAUME.md` - documentation pour Guillaume

---

## PARTIE 6 - PROCHAINE ACTION

**URGENT** : Déployer les modifications sur le serveur

1. Attendre que fail2ban se calme (ou débloquer via console IONOS)
2. Rsync les fichiers vers serveur
3. Build et restart PM2
4. Tester sur mobile

**Commande rsync** :
```bash
cd ~/Desktop/Claude/guillaume-farre/guillaume-farre-from-github && sshpass -p 'V2RMZaq8' rsync -avz \
  --exclude 'node_modules' --exclude '.git' --exclude '.env.local' --exclude '.next' \
  -e 'ssh -o StrictHostKeyChecking=no' \
  ./ root@87.106.40.44:/var/www/guillaumefarre/
```

**Commande build** :
```bash
sshpass -p 'V2RMZaq8' ssh root@87.106.40.44 'cd /var/www/guillaumefarre && npm run build && pm2 restart guillaumefarre'
```

---

## RÉSUMÉ EN 5 LIGNES

1. **Projet** : Site portfolio Guillaume Farré (artiste Dino), Next.js 15.5.6
2. **État** : Modifications prêtes en local, PAS déployées (SSH bloqué)
3. **Modifications** : Video coupée, zoom corrigé, menu burger visible, bouton Publier
4. **Blocage** : fail2ban bloque SSH après chaque tentative
5. **Prochaine** : Déployer dès que SSH accessible

---

Maintenu par : Lalou
Date : 2026-01-21 16:30
