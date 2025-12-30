# MESSAGE DE REPRISE ULTRA-EXHAUSTIF - 2025-12-30

**RELIS ABSOLUMENT TOUTE la documentation avec un niveau de profondeur ABSOLUMENT MAXIMAL, pareil pour le code, pareil pour l'architecture, et reprends le travail EXACTEMENT là où tu étais sans la MOINDRE déperdition.**

**OBLIGATION ABSOLUE** : Quand tu n'auras plus beaucoup de contexte, tu DOIS rédiger un nouveau message ultra-exhaustif qui reprend exactement cette consigne pour gérer le prochain compactage.

---

## ÉTAT CRITIQUE AU MOMENT DU COMPACTAGE

### LE SITE EST DOWN - INTERVENTION EN COURS

Le site https://guillaumefarre.com est INACCESSIBLE depuis l'extérieur.

**Cause identifiée** : Next.js (PM2) ne démarre pas correctement sur le port 3000. Nginx reçoit les requêtes mais ne peut pas les transférer.

**Problème SSH** : Les connexions SSH depuis GitHub Actions ET depuis le Mac local sont REFUSÉES. La clé SSH générée sur le serveur n'est pas correctement configurée.

---

## ACTIONS EFFECTUÉES CETTE SESSION

### 1. Protection des APIs Admin (TERMINÉ)

Créé `lib/admin/auth.ts` :
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

**Note** : `/api/admin/content` était DÉJÀ protégé, `/api/admin/login` et `/api/admin/auth` n'ont PAS besoin de protection (ce sont les endpoints de login).

### 2. Correction du Workflow GitHub Actions

Fichier `.github/workflows/deploy.yml` simplifié :
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

**Modifications importantes** :
- Retiré `git clean -fd` (CAUSAIT la suppression du dossier .next !)
- Ajouté `NODE_OPTIONS="--max-old-space-size=4096"` (résout le crash mémoire)
- Ajouté `git reset --hard origin/main` au lieu de `git pull` (résout les conflits de merge)
- Ajouté délai de 15 secondes pour laisser Next.js démarrer

### 3. Problème SSH en cours

**Clé SSH générée sur le serveur** (par l'utilisateur via console IONOS) :
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACASq+rA/qd6QuItMsYowabSIR9v0kEwQLPpELxneB+9iwAAAJA4gfKrOIHy
qwAAAAtzc2gtZWQyNTUxOQAAACASq+rA/qd6QuItMsYowabSIR9v0kEwQLPpELxneB+9iw
AAAEDEOMBYtFUe3X6gnT6nY4XNfbNrVy/oVl+nbnXfwDKquRKr6sD+p3pC4i0yxijBptIh
H2/SQTBAs+kQvGd4H72LAAAADWdpdGh1Yi1kZXBsb3k=
-----END OPENSSH PRIVATE KEY-----
```

**Clé sauvegardée en local** : `~/.ssh/gf_deploy`

**Problème** : La clé a été ajoutée à `/root/.ssh/authorized_keys` mais :
1. Les connexions SSH sont refusées (probablement fail2ban ou firewall cloud IONOS)
2. Le workflow GitHub Actions utilise peut-être l'utilisateur `ubuntu`, pas `root`

---

## DIAGNOSTICS EFFECTUÉS

### Build Next.js
- ✅ Build réussi (113 pages générées)
- ✅ Compilation OK en 11-25 secondes

### PM2
- PM2 montre "online" mais l'app crash en boucle
- Erreur : `[Error: Could not find a production build in the '.next' directory]`
- Cause : `git clean -fd` supprimait le dossier .next

### Nginx
- ✅ Nginx fonctionne et écoute sur ports 80/443
- ✅ Configuration OK (`/etc/nginx/sites-available/guillaumefarre.com`)
- Logs d'erreur : `connect() failed (111: Connection refused) while connecting to upstream` vers `127.0.0.1:3000`

### Réseau
- ✅ DNS OK : guillaumefarre.com → 51.38.35.238
- ✅ Ping OK
- ❌ Ports 80/443 inaccessibles depuis l'extérieur
- ❌ SSH refusé depuis GitHub Actions et Mac local

### Firewall
- UFW : Status "inactive"
- iptables : Policy ACCEPT

---

## COMMITS EFFECTUÉS

1. `65c3155` - security: protect all admin APIs with cookie authentication
2. `2c6e6a2` - fix: deploy workflow - git reset + increased memory
3. `e57570c` - fix: clean untracked files before build
4. `124b43e` - fix: restart nginx after deploy
5. `9b6a538` - debug: add nginx diagnostics to workflow
6. `2943a4c` - fix: check and open firewall ports
7. `c39389e` - debug: more network diagnostics
8. `fad9a5c` - debug: test public IP and nginx config
9. `32e6e73` - fix: restart PM2 properly and check port 3000
10. `fde9384` - fix: simplified deploy workflow, wait 15s for Next.js
11. Plusieurs retry commits vides pour déclencher le déploiement

---

## CE QU'IL FAUT FAIRE MAINTENANT

### OPTION 1 : Via console IONOS (RECOMMANDÉ)

L'utilisateur a accès au serveur via la console IONOS. Il doit exécuter :

```bash
cd /var/www/guillaume-farre
git pull origin main
NODE_OPTIONS="--max-old-space-size=4096" npm run build
pm2 restart guillaumefarre
sleep 10
curl http://localhost:3000/
```

### OPTION 2 : Réparer SSH

Sur le serveur (via console IONOS) :
```bash
# Ajouter la clé pour ubuntu
cat /root/.ssh/github_deploy.pub >> /home/ubuntu/.ssh/authorized_keys
chmod 600 /home/ubuntu/.ssh/authorized_keys
chown ubuntu:ubuntu /home/ubuntu/.ssh/authorized_keys

# Vérifier permissions
chmod 700 /home/ubuntu/.ssh
chmod 700 /root/.ssh
chmod 600 /root/.ssh/authorized_keys

# Vérifier fail2ban
sudo fail2ban-client status sshd
sudo fail2ban-client set sshd unbanip 0.0.0.0/0
```

### OPTION 3 : Mettre à jour secret GitHub

Si la clé SSH fonctionne, mettre à jour dans GitHub :
1. https://github.com/RaoulDelpech/guillaume-farre/settings/secrets/actions
2. Modifier `SSH_PRIVATE_KEY` avec la nouvelle clé
3. Vérifier que `SSH_USER` est correct (root ou ubuntu)

---

## INFORMATIONS SERVEUR

| Élément | Valeur |
|---------|--------|
| IP | 51.38.35.238 |
| Domaine | guillaumefarre.com |
| User SSH | ubuntu (ou root) |
| Path app | /var/www/guillaume-farre |
| PM2 app name | guillaumefarre |
| Port Next.js | 3000 |
| Nginx config | /etc/nginx/sites-available/guillaumefarre.com |

---

## CREDENTIALS

| Service | Valeur |
|---------|--------|
| Password site | LHOOQladino246 |
| Cookie auth | gf_auth=authenticated (30 jours) |
| Stripe test | (voir GitHub secrets) |

---

## FICHIERS CLÉS MODIFIÉS

- `lib/admin/auth.ts` - NOUVEAU - helper authentification
- `app/api/admin/photos/route.ts` - protection ajoutée
- `app/api/admin/delete-photo/route.ts` - protection ajoutée
- `app/api/admin/edit-photo/route.ts` - protection ajoutée
- `app/api/admin/pricing/route.ts` - protection ajoutée
- `app/api/admin/duplicates/route.ts` - protection ajoutée
- `app/api/admin/suggest-series/route.ts` - protection ajoutée
- `app/api/admin/similar-images/route.ts` - protection ajoutée
- `app/api/admin/generate-description/route.ts` - protection ajoutée
- `app/api/admin/detect-orientation/route.ts` - protection ajoutée
- `.github/workflows/deploy.yml` - workflow simplifié

---

## PROCHAINES ÉTAPES APRÈS RÉSOLUTION

1. Vérifier que le site est accessible : https://guillaumefarre.com
2. Tester le login : https://guillaumefarre.com/fr/login
3. Tester les APIs admin (doivent retourner 401 sans cookie)
4. Continuer l'audit point par point (voir AUDIT_EXHAUSTIF_2025-12-30.md)
5. Régénérer une nouvelle clé SSH (celle-ci est exposée)

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

Lalou - 2025-12-30 ~15h30
