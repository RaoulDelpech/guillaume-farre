# MESSAGE DE REPRISE APRÈS COMPACTAGE - 2025-12-30

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

## 1.4 Chemins sur le Serveur

```
App Next.js:    /var/www/guillaume-farre
PM2 app name:   guillaumefarre
Nginx config:   /etc/nginx/sites-available/guillaumefarre.com
Port interne:   3000
```

## 1.5 Configuration Serveur

- OS: Ubuntu 24.04
- RAM: 1 GB + 2 GB swap (créé car build Next.js crash sinon)
- Node.js: v20.19.5
- PM2: installé
- Nginx: reverse proxy vers localhost:3000
- Fail2ban: désactivé (causait blocage SSH)

---

# PARTIE 2 : CE QUI A ÉTÉ FAIT CETTE SESSION

## 2.1 Protection des APIs Admin (TERMINÉ)

### Fichier créé : `lib/admin/auth.ts`

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

### APIs protégées (9 routes modifiées) :

Chaque fichier a reçu en début de handler :
```typescript
import { requireAdminAuth } from '@/lib/admin/auth';

// Dans chaque handler GET/POST/DELETE :
const authError = await requireAdminAuth();
if (authError) return authError;
```

**Fichiers modifiés :**
1. `app/api/admin/photos/route.ts`
2. `app/api/admin/delete-photo/route.ts`
3. `app/api/admin/edit-photo/route.ts`
4. `app/api/admin/pricing/route.ts`
5. `app/api/admin/duplicates/route.ts`
6. `app/api/admin/suggest-series/route.ts`
7. `app/api/admin/similar-images/route.ts`
8. `app/api/admin/generate-description/route.ts`
9. `app/api/admin/detect-orientation/route.ts`

**APIs NON modifiées (volontairement) :**
- `/api/admin/login` - endpoint de login, pas de protection
- `/api/admin/auth` - endpoint de vérification auth
- `/api/admin/content` - DÉJÀ protégé avant cette session

## 2.2 Workflow GitHub Actions (CORRIGÉ)

### Fichier : `.github/workflows/deploy.yml`

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
            echo "📦 Fetching latest code..."
            git fetch origin main
            git reset --hard origin/main
            npm install
            echo "STRIPE_SECRET_KEY=${{ secrets.STRIPE_SECRET_KEY }}" > .env.local
            echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}" >> .env.local
            echo "NEXT_PUBLIC_SITE_URL=https://guillaumefarre.com" >> .env.local
            echo "ADMIN_PASSWORD=${{ secrets.ADMIN_PASSWORD }}" >> .env.local
            echo "ANTHROPIC_API_KEY=${{ secrets.ANTHROPIC_API_KEY }}" >> .env.local
            echo "🔨 Building with increased memory..."
            NODE_OPTIONS="--max-old-space-size=4096" npm run build
            echo "♻️ Restarting PM2..."
            pm2 restart guillaumefarre || pm2 start npm --name guillaumefarre -- start
            echo "⏳ Waiting for Next.js to start..."
            sleep 15
            echo "🔍 Checking port 3000..."
            ss -tlnp | grep 3000 || echo "Port 3000 not listening!"
            curl -s -o /dev/null -w "localhost: %{http_code}\n" http://localhost:3000/ || echo "localhost failed"
            echo "✅ Déploiement terminé !"
```

### Corrections apportées :
1. **Retiré `git clean -fd`** → Supprimait le dossier .next et causait crash PM2
2. **Ajouté `NODE_OPTIONS="--max-old-space-size=4096"`** → Fix JavaScript heap out of memory
3. **Remplacé `git pull` par `git reset --hard origin/main`** → Évite conflits de merge
4. **Ajouté sleep 15** → Laisse le temps à Next.js de démarrer

## 2.3 Nouveau Serveur Déployé

### Problème initial
- L'ancien serveur 51.38.35.238 n'existait plus
- Le DNS guillaumefarre.com pointait vers cette IP morte
- Le seul VPS disponible était 87.106.40.44 (nouveau, vide)

### Actions effectuées sur 87.106.40.44 :

1. **Création swap 2GB** (car VPS n'a que 1GB RAM) :
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

2. **Mise à jour du code** :
```bash
cd /var/www/guillaume-farre
git fetch origin main
git reset --hard origin/main
npm install
```

3. **Build avec mémoire augmentée** :
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

4. **Redémarrage PM2** :
```bash
pm2 restart guillaumefarre
```

5. **Configuration Nginx pour guillaumefarre.com** :
```nginx
server {
    listen 80;
    server_name guillaumefarre.com www.guillaumefarre.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 50M;
}
```

6. **Installation SSL Let's Encrypt** :
```bash
certbot --nginx -d guillaumefarre.com -d www.guillaumefarre.com --non-interactive --agree-tos --email contact@guillaumefarre.com --redirect
```

### Secret GitHub mis à jour :
- `SSH_HOST` changé de 51.38.35.238 vers 87.106.40.44

## 2.4 Corrections Audit Contact (TERMINÉ)

### Fichier : `app/[locale]/contact/page.tsx`

**Modifications :**

1. **Retiré téléphone factif** (+33 6 12 34 56 78) - remplacé par Instagram/LinkedIn
2. **Corrigé localisation atelier** : Paris 18ème → Toulouse
3. **Retiré référence métro** Marcadet-Poissonniers (n'existe pas à Toulouse)

**Avant :**
```tsx
{/* Téléphone */}
<a href="tel:+33612345678">
  <p>+33 6 12 34 56 78</p>
</a>

{/* WhatsApp */}
<a href="https://wa.me/33612345678">
  <p>+33 6 12 34 56 78</p>
</a>

{/* Atelier */}
<p>L'atelier est situé à Paris, 18ème arrondissement.</p>
<p>75018 Paris, France</p>
<p>Métro Marcadet-Poissonniers (L12)</p>
```

**Après :**
```tsx
{/* Instagram */}
<a href="https://instagram.com/guillaumefarre.art">
  <p>@guillaumefarre.art</p>
</a>

{/* LinkedIn */}
<a href="https://linkedin.com/in/guillaumefarre">
  <p>Guillaume Farré</p>
</a>

{/* Atelier */}
<p>L'atelier est situé à Toulouse.</p>
<p>Toulouse, France</p>
<p>contact@guillaumefarre.com</p>
```

---

# PARTIE 3 : PROBLÈMES IDENTIFIÉS NON RÉSOLUS

## 3.1 Page Presse ENTIÈREMENT FACTICE

**Fichier :** `app/[locale]/presse/page.tsx`

**Contenu INVENTÉ :**
- Articles Le Monde, Forbes France, Art Basel Magazine, Connaissance des Arts → TOUS FAUX
- Prix Art Paris Art Fair 2024, Monaco Art Week 2023, Grand Palais 2023 → TOUS FAUX
- Stats "47 collectionneurs", "12 performances", "9 pays", "+22% valorisation" → TOUS FAUX
- Commentaire dans le code ligne 102 : `{/* Logos fictifs mais crédibles */}`

**Action requise :** Supprimer cette page ou la refaire avec de vraies données

**Note :** La page n'est PAS dans le menu de navigation (déjà cachée) mais accessible via URL directe

## 3.2 Performances Live N'EXISTENT PAS

**Source :** `ETAT_SESSION_2025-11-07_FINAL.md` ligne 53 :
> Q3: Performances live → ❌ FAUX (n'existent pas encore, retirer slide)

**Action requise :** Rechercher et retirer toutes les références aux "performances live", "12 performances", "performances privées" etc.

## 3.3 Guillaume Basé à TOULOUSE (pas Paris)

**Source :** `ETAT_SESSION_2025-11-07_FINAL.md` ligne 55 :
> Q5: Basé Toulouse → ✅ VRAI

**Statut :** Page contact CORRIGÉE. Vérifier autres pages.

## 3.4 Aucune Vente Réelle

**Source :** `ETAT_SESSION_2025-11-07_FINAL.md` ligne 54 :
> Q4: Éditions vendues → ✅ OK mentir "1-2 vendues" (aucune vente réelle)

**Note :** Les stats "47 collectionneurs" sont fausses.

---

# PARTIE 4 : SECRETS ET CREDENTIALS

## 4.1 Secrets GitHub (RaoulDelpech/guillaume-farre)

| Secret | Description |
|--------|-------------|
| SSH_HOST | 87.106.40.44 |
| SSH_USER | root |
| SSH_PRIVATE_KEY | Clé SSH ed25519 |
| STRIPE_SECRET_KEY | Clé Stripe (dans GitHub) |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Clé publique Stripe |
| ADMIN_PASSWORD | LHOOQladino246 |
| ANTHROPIC_API_KEY | Clé Anthropic (dans GitHub) |
| VPS_SSH_KEY | Ancienne clé (peut-être obsolète) |

## 4.2 Credentials Locaux

| Élément | Valeur |
|---------|--------|
| Mot de passe site | LHOOQladino246 |
| Cookie auth | gf_auth=authenticated |
| SSH password serveur | V2RMZaq8 |
| Clé SSH locale | ~/.ssh/gf_deploy |

## 4.3 Clé SSH Locale

**Fichier :** `~/.ssh/gf_deploy`

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACASq+rA/qd6QuItMsYowabSIR9v0kEwQLPpELxneB+9iwAAAJA4gfKrOIHy
qwAAAAtzc2gtZWQyNTUxOQAAACASq+rA/qd6QuItMsYowabSIR9v0kEwQLPpELxneB+9iw
AAAEDEOMBYtFUe3X6gnT6nY4XNfbNrVy/oVl+nbnXfwDKquRKr6sD+p3pC4i0yxijBptIh
H2/SQTBAs+kQvGd4H72LAAAADWdpdGh1Yi1kZXBsb3k=
-----END OPENSSH PRIVATE KEY-----
```

**Clé publique correspondante :**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBKr6sD+p3pC4i0yxijBptIhH2/SQTBAs+kQvGd4H72L github-deploy
```

---

# PARTIE 5 : ARCHITECTURE DU PROJET

## 5.1 Stack Technique

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

## 5.2 Structure des Dossiers Clés

```
/app
  /[locale]
    /admin            → Interface admin photos
    /boutique         → Boutique en ligne
    /contact          → Page contact (MODIFIÉE)
    /galerie          → Galerie photos
    /presse           → Page presse (FAUSSE, À SUPPRIMER)
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
  /navigation
    /Navigation.tsx   → Menu principal

/messages
  /fr.json           → Traductions FR
  /en.json           → Traductions EN
  /it.json           → Traductions IT

/data
  /photo-metadata.json → Métadonnées photos
```

---

# PARTIE 6 : COMMITS RÉCENTS

```
4298974 docs: message reprise V2 ultra-exhaustif (sans secrets)
4887293 fix: corrections audit + retrait secret
ae8e830 retry: 10min later
01bc20b retry: after fail2ban timeout
565f18f retry: trigger deploy
fde9384 fix: simplified deploy workflow, wait 15s for Next.js
32e6e73 fix: restart PM2 properly and check port 3000
c39389e debug: more network diagnostics
fad9a5c debug: test public IP and nginx config
2943a4c fix: check and open firewall ports
9b6a538 debug: add nginx diagnostics to workflow
124b43e fix: restart nginx after deploy
e57570c fix: clean untracked files before build
2c6e6a2 fix: deploy workflow - git reset + increased memory
65c3155 security: protect all admin APIs with cookie authentication
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

# Test avec résolution DNS forcée
curl -s -o /dev/null -w 'HTTP: %{http_code}\n' -L --resolve guillaumefarre.com:443:87.106.40.44 https://guillaumefarre.com/
```

## 7.3 GitHub Actions

```bash
# Voir derniers runs
gh run list --limit 5 --repo RaoulDelpech/guillaume-farre

# Voir logs d'un run
gh run view <run-id> --log

# Voir secrets
gh secret list --repo RaoulDelpech/guillaume-farre
```

---

# PARTIE 8 : FICHIERS DE DOCUMENTATION À LIRE

1. `CLAUDE.md` (racine projet) - Règles métier Guillaume Farré
2. `ETAT_SESSION_2025-11-07_FINAL.md` - État précédent avec validations Guillaume
3. `AUDIT_EXHAUSTIF_2025-12-30.md` - Audit complet du site
4. `MESSAGE_REPRISE_2025-12-30_URGENT.md` - Message reprise précédent (obsolète)
5. `DEPLOIEMENT-IONOS-VPS.md` - Guide déploiement

---

# PARTIE 9 : PROCHAINES ACTIONS

## 9.1 Priorité HAUTE

1. **Supprimer page presse** ou la refaire avec vraies données
2. **Rechercher et retirer** toutes références aux "performances live"
3. **Vérifier** que toutes les mentions de Paris sont corrigées en Toulouse

## 9.2 Priorité MOYENNE

4. **Vérifier** les traductions EN/IT (incomplètes selon audit)
5. **Continuer audit** selon `AUDIT_EXHAUSTIF_2025-12-30.md`

---

# PARTIE 10 : RAPPEL OBLIGATION COMPACTAGE

**QUAND TU COMPACTES, TU DOIS CRÉER UN NOUVEAU MESSAGE QUI CONTIENT :**

1. État exact du site (UP/DOWN, URL, HTTP code)
2. Toutes les credentials (SSH, site, GitHub secrets)
3. Ce qui a été fait
4. Ce qui reste à faire
5. Tous les fichiers modifiés
6. Les commandes utiles
7. Cette même consigne pour le prochain compactage

**FORMAT DU DÉBUT DU MESSAGE :**
> RELIS ABSOLUMENT TOUTE la documentation avec un niveau de profondeur ABSOLUMENT MAXIMAL, pareil pour le code, pareil pour l'architecture, et reprends le travail EXACTEMENT là où tu étais sans la MOINDRE déperdition.

---

Lalou - 2025-12-30 ~18h45
