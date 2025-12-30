# MESSAGE DE REPRISE ULTRA-EXHAUSTIF - 2025-12-30 SESSION 2

**RELIS ABSOLUMENT TOUTE la documentation avec un niveau de profondeur ABSOLUMENT MAXIMAL, pareil pour le code, pareil pour l'architecture, et reprends le travail EXACTEMENT là où tu étais sans la MOINDRE déperdition.**

**OBLIGATION ABSOLUE** : Quand tu n'auras plus beaucoup de contexte, tu DOIS rédiger un nouveau message ultra-exhaustif qui reprend exactement cette consigne pour gérer le prochain compactage.

---

# PARTIE 1 : ÉTAT ACTUEL DU SYSTÈME

## 1.1 Le Site Est EN LIGNE

```
URL:            https://guillaumefarre.com
Statut:         EN LIGNE (HTTP 200)
Serveur:        87.106.40.44 (IONOS VPS)
SSL:            Let's Encrypt (actif, auto-renouvellement)
Dernier deploy: 2025-12-30 ~23h00 (commit 7438bda)
```

## 1.2 Accès au Site

```
Page login:     https://guillaumefarre.com/fr/login
Mot de passe:   LHOOQladino246
Cookie:         gf_auth=authenticated (durée 30 jours)
```

## 1.3 Accès Serveur SSH

```
IP:             87.106.40.44
User:           root
Password:       V2RMZaq8
Commande:       sshpass -p 'V2RMZaq8' ssh -o StrictHostKeyChecking=no root@87.106.40.44
```

## 1.4 Configuration Serveur

```
OS:             Ubuntu 24.04
RAM:            1 GB + 2 GB swap
Node.js:        v20.19.5
PM2 app name:   guillaumefarre
Path app:       /var/www/guillaume-farre
Port interne:   3000
Nginx config:   /etc/nginx/sites-available/guillaumefarre.com
```

---

# PARTIE 2 : CE QUI A ÉTÉ FAIT CETTE SESSION (30 DÉC 2025)

## 2.1 Commits Effectués

```
7438bda fix: suppression stats boutique incorrectes
890f6fd fix: suppression page presse factice + retrait références performances live
```

## 2.2 Fichiers Supprimés

| Fichier | Raison |
|---------|--------|
| `app/[locale]/presse/page.tsx` | Page entièrement factice (articles Le Monde/Forbes inventés) |
| `app/[locale]/concept-car-art/page.tsx` | Performances publiques n'existent pas |
| `components/PerformanceCountdown.tsx` | Composant inutilisé avec dates fictives |

## 2.3 Fichiers Modifiés

### 2.3.1 Protection APIs Admin (Session précédente - TERMINÉ)

**Fichier créé** : `lib/admin/auth.ts`

```typescript
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'gf_auth';
const COOKIE_VALUE = 'authenticated';

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(COOKIE_NAME);
    return authCookie?.value === COOKIE_VALUE;
  } catch {
    return false;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Non autorisé. Connectez-vous d\'abord.' },
    { status: 401 }
  );
}

export async function requireAdminAuth(): Promise<NextResponse | null> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return unauthorizedResponse();
  }
  return null;
}
```

**9 APIs protégées** (chaque handler commence par) :
```typescript
import { requireAdminAuth } from '@/lib/admin/auth';

const authError = await requireAdminAuth();
if (authError) return authError;
```

Routes concernées :
1. `app/api/admin/photos/route.ts`
2. `app/api/admin/delete-photo/route.ts`
3. `app/api/admin/edit-photo/route.ts`
4. `app/api/admin/pricing/route.ts`
5. `app/api/admin/duplicates/route.ts`
6. `app/api/admin/suggest-series/route.ts`
7. `app/api/admin/similar-images/route.ts`
8. `app/api/admin/generate-description/route.ts`
9. `app/api/admin/detect-orientation/route.ts`

### 2.3.2 Page Contact Corrigée

**Fichier** : `app/[locale]/contact/page.tsx`

Modifications :
- Retiré téléphone factif (+33 6 12 34 56 78)
- Remplacé par Instagram/LinkedIn
- Corrigé atelier : Paris 18ème → Toulouse
- Retiré "Réserver une performance" → "Visiter l'atelier"
- Retiré FAQ sur performances privées

### 2.3.3 Carousel Modifié

**Fichier** : `components/HeroCarousel.tsx`

- Retiré slide "conceptCarArt" (lignes 34-39 supprimées)

### 2.3.4 Sitemap Mis à Jour

**Fichier** : `app/sitemap.ts`

- Retiré `/concept-car-art`
- Retiré `/presse`
- Ajouté `/origine`

### 2.3.5 Pages Histoire et Atelier

**Fichiers** :
- `components/pages/HistoireContent.tsx`
- `components/pages/AtelierContent.tsx`

Modifications :
- Liens `/concept-car-art` → `/boutique`
- "Ferrari Live Performance" → "Le processus créatif"
- "performances" → "créations"
- "Performance live, action painting" → "Action painting, art conceptuel"

### 2.3.6 Page Origine

**Fichier** : `app/[locale]/origine/page.tsx`

- "Ferrari Live Performance" → "Le processus créatif"

### 2.3.7 Boutique Garanties

**Fichier** : `components/pages/BoutiqueGarantiesContent.tsx`

- "performances live" → "atelier de l'artiste"

### 2.3.8 Stats Boutique Supprimées

**Fichiers** :
- `app/[locale]/boutique/page.tsx` - Supprimé calcul stats
- `components/pages/BoutiqueContent.tsx` - Supprimé affichage stats

Les stats affichaient des chiffres incorrects (éditions limitées = 0, etc.) car les photos n'ont pas le champ `categories` correctement rempli.

---

# PARTIE 3 : AUDIT EN COURS

## 3.1 Rapport d'Audit

**Fichier** : `AUDIT_EXHAUSTIF_2025-12-30.md` (1476 lignes)

### Points CRITIQUES Résolus

| # | Point | État |
|---|-------|------|
| 1 | APIs admin non protégées | ✅ FAIT |
| 2 | Faux téléphone contact | ✅ FAIT |
| 3 | Page presse factice | ✅ FAIT (supprimée) |
| 4 | Stats boutique incorrectes | ✅ FAIT (supprimées) |
| 5 | "V12" incorrect | ✅ FAIT (page supprimée) |

### Points RESTANTS à Valider avec Guillaume

1. **47 collectionneurs** - Ce chiffre est-il réel ?
2. **850K€ de CA** - Ce chiffre est-il réel ?
3. **12 performances** - Supprimé car faux
4. **Prix hardcodés** - AddToCartSection utilise 1200/2400/3600€ au lieu de la config officielle

### Préconisations par Priorité

**HAUTE (à faire)** :
- [ ] Utiliser prix depuis pricing-config.ts
- [ ] Migration des catégories dans photo-metadata.json
- [ ] Compléter mentions légales (hébergeur IONOS)
- [ ] Traductions EN/IT manquantes

**MOYENNE** :
- [ ] Réduire carousel (80vh → 60vh)
- [ ] Ralentir autoplay (5s → 9s)
- [ ] Ajouter metadata SEO sur chaque page
- [ ] Lazy loading images

---

# PARTIE 4 : SECRETS ET CREDENTIALS

## 4.1 Secrets GitHub (RaoulDelpech/guillaume-farre)

| Secret | Valeur |
|--------|--------|
| SSH_HOST | 87.106.40.44 |
| SSH_USER | root |
| SSH_PRIVATE_KEY | Clé SSH ed25519 |
| STRIPE_SECRET_KEY | (dans GitHub) |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | (dans GitHub) |
| ADMIN_PASSWORD | LHOOQladino246 |
| ANTHROPIC_API_KEY | (dans GitHub) |

## 4.2 Credentials Locaux

| Élément | Valeur |
|---------|--------|
| Mot de passe site | LHOOQladino246 |
| Cookie auth | gf_auth=authenticated |
| SSH password serveur | V2RMZaq8 |
| Clé SSH locale | ~/.ssh/gf_deploy |

---

# PARTIE 5 : WORKFLOW GITHUB ACTIONS

**Fichier** : `.github/workflows/deploy.yml`

```yaml
name: Deploy to VPS IONOS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/guillaume-farre
            git fetch origin main
            git reset --hard origin/main
            npm install
            echo "STRIPE_SECRET_KEY=${{ secrets.STRIPE_SECRET_KEY }}" > .env.local
            echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}" >> .env.local
            echo "NEXT_PUBLIC_SITE_URL=https://guillaumefarre.com" >> .env.local
            echo "ADMIN_PASSWORD=${{ secrets.ADMIN_PASSWORD }}" >> .env.local
            echo "ANTHROPIC_API_KEY=${{ secrets.ANTHROPIC_API_KEY }}" >> .env.local
            NODE_OPTIONS="--max-old-space-size=4096" npm run build
            pm2 restart guillaumefarre || pm2 start npm --name guillaumefarre -- start
            sleep 15
            curl -s -o /dev/null -w "localhost: %{http_code}\n" http://localhost:3000/
```

---

# PARTIE 6 : ARCHITECTURE DU PROJET

## 6.1 Stack Technique

```
Framework:      Next.js 15.5.6
React:          19.1.0
TypeScript:     5.8.3
Styling:        Tailwind CSS + shadcn/ui (thème zinc)
i18n:           next-intl (FR/EN/IT)
Paiements:      Stripe
IA:             Anthropic Claude (descriptions photos)
Runtime prod:   PM2 + Nginx
```

## 6.2 Structure des Dossiers Clés

```
/app
  /[locale]
    /admin            → Interface admin photos
    /boutique         → Boutique en ligne (stats supprimées)
    /contact          → Page contact (corrigée)
    /galerie          → Galerie photos
    /histoire         → Histoire artiste
    /atelier          → Atelier création
    /dino             → Page Dino
    /origine          → Page origine
    /login            → Page de connexion
  /api
    /admin
      /auth           → Vérification auth
      /login          → Endpoint login
      /photos         → CRUD photos (PROTÉGÉ)
      /delete-photo   → Suppression (PROTÉGÉ)
      /edit-photo     → Édition (PROTÉGÉ)
      /pricing        → Prix (PROTÉGÉ)
      /duplicates     → Détection doublons (PROTÉGÉ)
      /generate-description → IA description (PROTÉGÉ)
      /detect-orientation   → IA orientation (PROTÉGÉ)
      /suggest-series       → IA séries (PROTÉGÉ)
      /similar-images       → IA similarité (PROTÉGÉ)
      /content        → Édition contenu (DÉJÀ PROTÉGÉ)

/lib
  /admin
    /auth.ts          → Helper authentification (NOUVEAU)

/components
  /pages              → Composants éditables
    /HistoireContent.tsx  (modifié)
    /AtelierContent.tsx   (modifié)
    /BoutiqueContent.tsx  (stats supprimées)
    /BoutiqueGarantiesContent.tsx (modifié)
  /navigation
    /Navigation.tsx   → Menu principal
  /HeroCarousel.tsx   → Carousel (slide supprimé)

/messages
  /fr.json           → Traductions FR (170 clés)
  /en.json           → Traductions EN (incomplet)
  /it.json           → Traductions IT (incomplet)

/data
  /photo-metadata.json → Métadonnées photos (5588 lignes)
```

---

# PARTIE 7 : COMMANDES UTILES

## 7.1 Connexion au Serveur

```bash
# Avec mot de passe
sshpass -p 'V2RMZaq8' ssh -o StrictHostKeyChecking=no root@87.106.40.44

# Vérifier état PM2
sshpass -p 'V2RMZaq8' ssh root@87.106.40.44 "pm2 status"

# Voir logs PM2
sshpass -p 'V2RMZaq8' ssh root@87.106.40.44 "pm2 logs guillaumefarre --lines 50"

# Redémarrer PM2
sshpass -p 'V2RMZaq8' ssh root@87.106.40.44 "pm2 restart guillaumefarre"

# Rebuild complet
sshpass -p 'V2RMZaq8' ssh root@87.106.40.44 "cd /var/www/guillaume-farre && git pull && NODE_OPTIONS='--max-old-space-size=4096' npm run build && pm2 restart guillaumefarre"
```

## 7.2 Tester le Site

```bash
# Test HTTPS
curl -s -o /dev/null -w 'HTTP: %{http_code}\n' -L https://guillaumefarre.com/

# Test page contact
curl -s -o /dev/null -w 'HTTP: %{http_code}\n' -L https://guillaumefarre.com/fr/contact
```

## 7.3 GitHub Actions

```bash
# Voir derniers runs
gh run list --limit 5 --repo RaoulDelpech/guillaume-farre

# Voir logs d'un run
gh run view <run-id> --log
```

---

# PARTIE 8 : PROCHAINES ÉTAPES

## 8.1 Audit à Continuer

Le fichier `AUDIT_EXHAUSTIF_2025-12-30.md` contient 120+ préconisations.

**Sections CRITIQUES traitées** :
- ✅ APIs admin protégées
- ✅ Téléphone factif retiré
- ✅ Page presse supprimée
- ✅ Stats boutique supprimées
- ✅ Références performances retirées

**À valider avec Guillaume** :
1. Chiffres "47 collectionneurs", "850K€ CA"
2. Prix officiels à utiliser
3. Contenu des mentions légales

**À faire ensuite** :
1. Utiliser pricing-config.ts dans AddToCartSection.tsx
2. Compléter mentions légales avec infos IONOS
3. Traductions EN/IT
4. Carousel : réduire + ralentir

---

# PARTIE 9 : FICHIERS DE DOCUMENTATION

1. `CLAUDE.md` - Règles métier Guillaume Farré
2. `AUDIT_EXHAUSTIF_2025-12-30.md` - Audit complet du site
3. `MESSAGE_REPRISE_COMPACTAGE.md` - Message reprise session précédente
4. `ETAT_SESSION_2025-11-07_FINAL.md` - État avec validations Guillaume
5. `DEPLOIEMENT-IONOS-VPS.md` - Guide déploiement

---

# PARTIE 10 : RAPPEL OBLIGATION COMPACTAGE

**QUAND TU COMPACTES, TU DOIS CRÉER UN NOUVEAU MESSAGE QUI CONTIENT :**

1. État exact du site (UP/DOWN, URL, HTTP code)
2. Toutes les credentials (SSH, site, GitHub secrets)
3. Ce qui a été fait
4. Ce qui reste à faire
5. Tous les fichiers modifiés avec le code exact
6. Les commandes utiles
7. L'audit en cours et son état
8. Cette même consigne pour le prochain compactage

**FORMAT DU DÉBUT DU MESSAGE :**
> RELIS ABSOLUMENT TOUTE la documentation avec un niveau de profondeur ABSOLUMENT MAXIMAL, pareil pour le code, pareil pour l'architecture, et reprends le travail EXACTEMENT là où tu étais sans la MOINDRE déperdition.

---

# PARTIE 11 : RÉSUMÉ EXPRESS

```
SITE: https://guillaumefarre.com (UP - HTTP 200)
SERVEUR: 87.106.40.44 | root | V2RMZaq8
PASSWORD SITE: LHOOQladino246

FAIT CETTE SESSION:
✅ Page presse supprimée
✅ Page concept-car-art supprimée
✅ PerformanceCountdown supprimé
✅ Stats boutique supprimées
✅ Références "performances live" retirées
✅ Contact: téléphone → Instagram/LinkedIn
✅ Contact: Paris → Toulouse

COMMITS:
7438bda fix: suppression stats boutique incorrectes
890f6fd fix: suppression page presse factice + retrait références performances live

À FAIRE:
- Valider chiffres avec Guillaume (47 collectionneurs, 850K€)
- Prix dans AddToCartSection (hardcodés)
- Mentions légales (placeholders)
- Traductions EN/IT
```

---

Lalou - 2025-12-30 ~23h15
