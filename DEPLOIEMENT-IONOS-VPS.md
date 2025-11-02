# 🚀 Déploiement COMPLET sur IONOS VPS

## ✅ Site dynamique avec Stripe + Admin + Auto-déploiement

Ce guide vous permet de déployer votre site **COMPLET** (avec panier Stripe, interface admin, API routes) sur un serveur IONOS qui supporte Node.js.

---

## 📋 Prérequis

Vous avez besoin d'un **VPS IONOS** ou **Serveur Cloud** avec :
- ✅ Accès SSH root
- ✅ Ubuntu/Debian (ou autre Linux)
- ✅ Au moins 2 GB RAM
- ✅ 20 GB espace disque

**⚠️ IONOS Deploy Now ne suffit PAS** (sites statiques seulement)

### Comment obtenir un VPS IONOS

1. Allez sur https://www.ionos.fr/serveurs/vps
2. Choisissez un VPS (à partir de ~1€/mois)
3. Sélectionnez Ubuntu 22.04 LTS
4. Notez l'IP du serveur et le mot de passe root

---

## 🔧 Étape 1 : Configuration du serveur

### 1.1 Connexion SSH

```bash
ssh root@VOTRE-IP-IONOS
```

### 1.2 Installation de Node.js et dépendances

```bash
# Mise à jour du système
apt update && apt upgrade -y

# Installation Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Vérification
node -v  # devrait afficher v20.x
npm -v   # devrait afficher 10.x

# Installation de Bun (optionnel mais recommandé)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### 1.3 Installation PM2 (gestionnaire de processus)

```bash
npm install -g pm2
pm2 startup systemd
```

### 1.4 Installation NGINX (reverse proxy)

```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 1.5 Installation Certbot (SSL gratuit)

```bash
apt install -y certbot python3-certbot-nginx
```

---

## 📦 Étape 2 : Déploiement du site

### 2.1 Cloner le projet depuis GitHub

D'abord, poussez votre code sur GitHub :

```bash
# Sur votre machine locale
cd guillaume-farre
git init
git add .
git commit -m "Site Guillaume Farré complet"
git remote add origin https://github.com/VOTRE-USERNAME/guillaume-farre.git
git push -u origin main
```

Ensuite, sur le serveur :

```bash
# Sur le serveur IONOS
cd /var/www
git clone https://github.com/VOTRE-USERNAME/guillaume-farre.git
cd guillaume-farre
```

### 2.2 Installation des dépendances

```bash
# Avec Bun (recommandé)
bun install

# OU avec npm
npm install
```

### 2.3 Configuration des variables d'environnement

```bash
nano .env.local
```

Ajoutez :

```env
# Stripe (en production)
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLIQUE

# URL du site
NEXT_PUBLIC_SITE_URL=https://guillaumefarre.com
```

Sauvegardez (Ctrl+X, puis Y, puis Entrée)

### 2.4 Build de production

```bash
bun run build

# OU
npm run build
```

### 2.5 Démarrage avec PM2

```bash
pm2 start bun --name "guillaumefarre" -- run start

# OU avec npm
pm2 start npm --name "guillaumefarre" -- start

# Sauvegarder la configuration PM2
pm2 save
```

Votre site tourne maintenant sur `http://localhost:3000` !

---

## 🌐 Étape 3 : Configuration NGINX

### 3.1 Créer la configuration NGINX

```bash
nano /etc/nginx/sites-available/guillaumefarre.com
```

Collez cette configuration :

```nginx
server {
    listen 80;
    server_name guillaumefarre.com www.guillaumefarre.com;

    # Redirect www to non-www
    if ($host = www.guillaumefarre.com) {
        return 301 https://guillaumefarre.com$request_uri;
    }

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

Sauvegardez et activez :

```bash
ln -s /etc/nginx/sites-available/guillaumefarre.com /etc/nginx/sites-enabled/
nginx -t  # Tester la configuration
systemctl reload nginx
```

---

## 🔒 Étape 4 : SSL avec Let's Encrypt

```bash
certbot --nginx -d guillaumefarre.com -d www.guillaumefarre.com
```

Suivez les instructions. Certbot va :
- ✅ Obtenir un certificat SSL gratuit
- ✅ Configurer NGINX automatiquement
- ✅ Rediriger HTTP → HTTPS

Renouvellement automatique (testons) :

```bash
certbot renew --dry-run
```

---

## 🔄 Étape 5 : Auto-déploiement avec GitHub Actions

### 5.1 Créer une clé SSH pour GitHub Actions

Sur le serveur :

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy  # Copiez cette clé PRIVÉE
```

### 5.2 Ajouter la clé dans GitHub

1. Allez sur votre repo GitHub
2. Settings → Secrets and variables → Actions
3. Cliquez sur "New repository secret"
4. Nom : `SSH_PRIVATE_KEY`
5. Valeur : Collez la clé privée copiée ci-dessus
6. Ajoutez aussi :
   - `SSH_HOST` → Votre IP IONOS
   - `SSH_USER` → `root`
   - `STRIPE_SECRET_KEY` → Votre clé Stripe production
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → Votre clé publique Stripe

### 5.3 Créer le workflow GitHub Actions

Sur votre machine locale, créez :

```bash
mkdir -p .github/workflows
nano .github/workflows/deploy.yml
```

Collez :

```yaml
name: Deploy to IONOS VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/guillaume-farre
            git pull origin main
            bun install
            echo "STRIPE_SECRET_KEY=${{ secrets.STRIPE_SECRET_KEY }}" > .env.local
            echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}" >> .env.local
            echo "NEXT_PUBLIC_SITE_URL=https://guillaumefarre.com" >> .env.local
            bun run build
            pm2 restart guillaumefarre
```

Sauvegardez et poussez :

```bash
git add .github/workflows/deploy.yml
git commit -m "Ajout auto-déploiement GitHub Actions"
git push
```

✅ **Maintenant, chaque fois que vous faites `git push`, le site se déploie automatiquement sur IONOS !**

---

## 🎯 Étape 6 : Configurer le domaine

### Dans votre panel IONOS

1. Allez dans "Domaines & SSL"
2. Cliquez sur `guillaumefarre.com`
3. Allez dans "Paramètres DNS"
4. Configurez :

```
Type    Nom    Valeur
A       @      VOTRE-IP-VPS
A       www    VOTRE-IP-VPS
```

5. Attendez 5-30 minutes (propagation DNS)

---

## ✅ Vérification finale

Testez :

1. **HTTP** : http://guillaumefarre.com → devrait rediriger vers HTTPS
2. **HTTPS** : https://guillaumefarre.com → site fonctionnel ✅
3. **Panier** : Ajoutez une œuvre au panier
4. **Admin** : https://guillaumefarre.com/admin
5. **Paiement Stripe** : Testez avec une vraie carte (en mode production)

---

## 📊 Commandes utiles

```bash
# Voir les logs en temps réel
pm2 logs guillaumefarre

# Redémarrer le site
pm2 restart guillaumefarre

# Voir le statut
pm2 status

# Voir l'utilisation CPU/RAM
pm2 monit

# Vérifier NGINX
systemctl status nginx

# Voir les logs NGINX
tail -f /var/log/nginx/error.log

# Mise à jour manuelle
cd /var/www/guillaume-farre
git pull
bun install
bun run build
pm2 restart guillaumefarre
```

---

## 🔧 Maintenance

### Renouvellement SSL automatique

Le certificat SSL se renouvelle automatiquement tous les 90 jours.

Vérifiez :

```bash
certbot renew --dry-run
```

### Mise à jour du serveur

```bash
apt update && apt upgrade -y
pm2 update
```

### Backup de la base de données (admin-overrides.json)

```bash
# Backup manuel
cp /var/www/guillaume-farre/src/data/admin-overrides.json ~/backup-$(date +%Y%m%d).json

# Backup automatique quotidien (cron)
crontab -e
# Ajoutez :
0 3 * * * cp /var/www/guillaume-farre/src/data/admin-overrides.json ~/backups/admin-$(date +\%Y\%m\%d).json
```

---

## 🚀 Workflow agile complet

1. **Développement local** : Modifiez votre code
2. **Test** : `bun run dev` → Testez en local
3. **Commit** : `git add . && git commit -m "Nouvelle fonctionnalité"`
4. **Push** : `git push`
5. **✅ Déploiement automatique** : GitHub Actions déploie sur IONOS en 2-3 minutes !

---

## 🆘 Problèmes courants

### Le site ne démarre pas

```bash
pm2 logs guillaumefarre
# Regardez les erreurs
```

### Erreur "Port 3000 déjà utilisé"

```bash
pm2 delete guillaumefarre
pm2 start bun --name "guillaumefarre" -- run start
```

### Le domaine ne pointe pas

- Vérifiez les DNS : `dig guillaumefarre.com`
- Attendez 30 minutes max
- Vérifiez l'IP dans le panel IONOS

### Stripe ne fonctionne pas

- Vérifiez `.env.local` sur le serveur
- Utilisez les clés de PRODUCTION (`sk_live_...`)
- Vérifiez que le webhook Stripe pointe vers `https://guillaumefarre.com/api/checkout`

---

## 🎉 C'est terminé !

Votre site est maintenant :

- ✅ Hébergé sur votre VPS IONOS
- ✅ Accessible sur `https://guillaumefarre.com`
- ✅ Auto-déployé à chaque `git push`
- ✅ Avec panier Stripe fonctionnel
- ✅ Avec interface admin
- ✅ SSL automatique
- ✅ Workflow agile complet

**Chaque modification que vous faites ici (dans Same) → git push → se déploie automatiquement sur IONOS !** 🚀
