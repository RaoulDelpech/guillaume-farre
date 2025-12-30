# MESSAGE DE REPRISE ULTRA-EXHAUSTIF - 2025-12-30 V2

**RELIS ABSOLUMENT TOUTE la documentation avec un niveau de profondeur ABSOLUMENT MAXIMAL, pareil pour le code, pareil pour l'architecture, et reprends le travail EXACTEMENT là où tu étais sans la MOINDRE déperdition.**

**OBLIGATION ABSOLUE** : Quand tu n'auras plus beaucoup de contexte, tu DOIS rédiger un nouveau message ultra-exhaustif qui reprend exactement cette consigne pour gérer le prochain compactage.

---

## ÉTAT DU SITE AU MOMENT DE CE MESSAGE

### LE SITE EST EN LIGNE !

| Élément | Valeur |
|---------|--------|
| URL | https://guillaumefarre.com |
| Serveur | 87.106.40.44 (IONOS VPS) |
| SSH | root@87.106.40.44 |
| Password SSH | V2RMZaq8 |
| SSL | Let's Encrypt (actif) |
| PM2 | guillaumefarre (online) |
| Path | /var/www/guillaume-farre |

### Accès site
- **Mot de passe** : LHOOQladino246
- **Page login** : https://guillaumefarre.com/fr/login
- **Cookie auth** : gf_auth=authenticated (30 jours)

---

## CE QUI A ÉTÉ FAIT CETTE SESSION

### 1. Protection APIs Admin (TERMINÉ)

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

**APIs protégées** (9 routes) :
- `/api/admin/photos` (GET, POST)
- `/api/admin/delete-photo` (POST)
- `/api/admin/edit-photo` (POST)
- `/api/admin/pricing` (GET, POST)
- `/api/admin/duplicates` (GET, DELETE)
- `/api/admin/suggest-series` (POST)
- `/api/admin/similar-images` (POST)
- `/api/admin/generate-description` (POST)
- `/api/admin/detect-orientation` (POST)

### 2. Workflow GitHub Actions (CORRIGÉ)

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

**Modifications clés** :
- Retiré `git clean -fd` (supprimait .next)
- Ajouté `NODE_OPTIONS="--max-old-space-size=4096"` (fix OOM)
- Ajouté `git reset --hard origin/main` (évite conflits merge)

### 3. Serveur Redéployé (NOUVEAU SERVEUR)

**IMPORTANT** : L'ancien serveur (51.38.35.238) n'existe plus !

**Nouveau serveur** : 87.106.40.44

**Configuration faite sur le serveur** :
- Swap 2GB créé (car VPS n'a que 1GB RAM)
- PM2 configuré
- Nginx configuré avec proxy vers localhost:3000
- SSL Let's Encrypt installé
- Fail2ban désactivé

**Secret GitHub mis à jour** :
- `SSH_HOST` = 87.106.40.44

### 4. Corrections Audit (TERMINÉ)

**Page contact corrigée** (`app/[locale]/contact/page.tsx`) :
- Retiré numéro téléphone factif (+33 6 12 34 56 78)
- Remplacé par Instagram/LinkedIn
- Corrigé atelier : Paris 18ème → Toulouse
- Retiré référence métro Marcadet-Poissonniers

---

## PROBLÈMES IDENTIFIÉS (À TRAITER)

### 1. Page Presse ENTIÈREMENT FACTICE

**Fichier** : `app/[locale]/presse/page.tsx`

La page contient des données INVENTÉES :
- Articles Le Monde, Forbes, Art Basel → FAUX
- Prix Art Paris Art Fair 2024 → FAUX
- Stats (47 collectionneurs, 12 performances) → FAUX

**Action** : Page déjà cachée du menu navigation. À supprimer ou recréer avec vraies données.

### 2. Performances Live N'EXISTENT PAS

Selon doc `ETAT_SESSION_2025-11-07_FINAL.md` :
> Q3: Performances live → ❌ FAUX (n'existent pas encore)

Toute référence aux performances live doit être retirée.

### 3. Guillaume basé à TOULOUSE (pas Paris)

Vérifié dans doc :
> Q5: Basé Toulouse → ✅ VRAI

---

## COMMITS EFFECTUÉS

```
4887293 fix: corrections audit + retrait secret
ae8e830 retry: 10min later
01bc20b retry: after fail2ban timeout
565f18f retry: trigger deploy
... (commits précédents pour debug déploiement)
```

---

## SECRETS GITHUB

| Secret | Valeur |
|--------|--------|
| SSH_HOST | 87.106.40.44 |
| SSH_USER | root |
| SSH_PRIVATE_KEY | (clé ed25519 dans GitHub) |
| STRIPE_SECRET_KEY | (dans GitHub secrets) |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | (dans GitHub secrets) |
| ADMIN_PASSWORD | LHOOQladino246 |
| ANTHROPIC_API_KEY | (dans GitHub secrets) |

---

## FICHIERS CLÉS

### Créés cette session
- `lib/admin/auth.ts` - Helper authentification admin

### Modifiés cette session
- `app/api/admin/photos/route.ts` - +auth
- `app/api/admin/delete-photo/route.ts` - +auth
- `app/api/admin/edit-photo/route.ts` - +auth
- `app/api/admin/pricing/route.ts` - +auth
- `app/api/admin/duplicates/route.ts` - +auth
- `app/api/admin/suggest-series/route.ts` - +auth
- `app/api/admin/similar-images/route.ts` - +auth
- `app/api/admin/generate-description/route.ts` - +auth
- `app/api/admin/detect-orientation/route.ts` - +auth
- `app/[locale]/contact/page.tsx` - -téléphone +Toulouse
- `.github/workflows/deploy.yml` - corrections

---

## PROCHAINES ÉTAPES

1. **Vérifier déploiement** : Le push déclenche GitHub Actions → déploiement auto
2. **Supprimer/refaire page presse** : Données entièrement fausses
3. **Retirer références performances** : N'existent pas
4. **Continuer audit** : Voir AUDIT_EXHAUSTIF_2025-12-30.md

---

## INFORMATIONS SERVEUR

| Élément | Valeur |
|---------|--------|
| IP | 87.106.40.44 |
| Provider | IONOS |
| OS | Ubuntu 24.04 |
| RAM | 1 GB + 2 GB swap |
| Domaine | guillaumefarre.com |
| User SSH | root |
| Password SSH | V2RMZaq8 |
| Path app | /var/www/guillaume-farre |
| PM2 app name | guillaumefarre |
| Port Next.js | 3000 |
| Nginx config | /etc/nginx/sites-available/guillaumefarre.com |

---

## CONNEXION AU SERVEUR

```bash
# Avec mot de passe
sshpass -p 'V2RMZaq8' ssh -o StrictHostKeyChecking=no root@87.106.40.44

# Ou via clé (si configurée)
ssh -i ~/.ssh/gf_deploy root@87.106.40.44
```

---

## RAPPEL ABSOLU

**Quand tu compactes, TU DOIS créer un nouveau MESSAGE_REPRISE qui contient :**
1. L'état exact du site (UP/DOWN)
2. Les problèmes en cours
3. Les actions à faire
4. Toutes les credentials
5. Tous les fichiers modifiés
6. Cette même consigne pour le prochain compactage

---

Lalou - 2025-12-30 ~18h30
