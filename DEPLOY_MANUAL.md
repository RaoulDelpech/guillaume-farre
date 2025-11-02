# ⚠️ PROBLÈME DE DÉPLOIEMENT DÉTECTÉ

## 🔴 Situation Actuelle

Le déploiement automatique via GitHub Actions **NE FONCTIONNE PAS**.

Le site en production (guillaumefarre.com) affiche encore l'ancienne version :
- ❌ Pas de Hero Carousel
- ❌ Pas de mode dark
- ❌ Anciens textes ("Concept car art" au lieu de "Ferrari Live")

## 🔍 Cause Probable

Les **secrets GitHub** ne sont pas configurés. Le workflow ne peut pas se connecter au VPS IONOS.

Secrets manquants :
- `SSH_HOST` - L'adresse du serveur IONOS
- `SSH_USER` - Le nom d'utilisateur SSH
- `SSH_PRIVATE_KEY` - La clé privée SSH
- `STRIPE_SECRET_KEY` - Clé Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Clé publique Stripe
- `ADMIN_PASSWORD` - Mot de passe admin

## ✅ SOLUTION : Configurer les Secrets GitHub

### Étape 1 : Aller dans les Settings GitHub

1. Va sur : https://github.com/RaoulDelpech/guillaume-farre/settings/secrets/actions
2. Clique sur "New repository secret"

### Étape 2 : Ajouter chaque secret

Pour chaque secret ci-dessous, clique "New repository secret" :

#### SSH_HOST
- **Name** : `SSH_HOST`
- **Value** : L'adresse IP ou le domaine du VPS IONOS (exemple : `123.45.67.89` ou `vps.ionos.com`)

#### SSH_USER
- **Name** : `SSH_USER`
- **Value** : Le nom d'utilisateur SSH (souvent `root` ou `ubuntu`)

#### SSH_PRIVATE_KEY
- **Name** : `SSH_PRIVATE_KEY`
- **Value** : La clé privée SSH complète (commence par `-----BEGIN OPENSSH PRIVATE KEY-----`)

**Pour obtenir la clé SSH** :
```bash
cat ~/.ssh/id_rsa
```
Copie TOUT le contenu, y compris les lignes BEGIN et END.

#### STRIPE_SECRET_KEY
- **Name** : `STRIPE_SECRET_KEY`
- **Value** : `sk_test_...` ou `sk_live_...` depuis Stripe Dashboard

#### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **Name** : `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Value** : `pk_test_...` ou `pk_live_...` depuis Stripe Dashboard

#### ADMIN_PASSWORD
- **Name** : `ADMIN_PASSWORD`
- **Value** : Un mot de passe sécurisé pour l'admin (exemple : `MonMotDePasseSecurise123!`)

### Étape 3 : Relancer le Déploiement

Une fois TOUS les secrets configurés :

1. Va sur : https://github.com/RaoulDelpech/guillaume-farre/actions
2. Clique sur le dernier workflow qui a échoué
3. Clique sur "Re-run all jobs"

OU push un nouveau commit :
```bash
git commit --allow-empty -m "Test deploy with secrets"
git push origin main
```

## 🚨 ALTERNATIVE : Déploiement Manuel SSH

Si tu ne peux pas configurer les secrets maintenant, tu peux déployer manuellement via SSH :

```bash
# Se connecter au VPS
ssh utilisateur@ton-serveur-ionos.com

# Aller dans le dossier du projet
cd /var/www/guillaume-farre

# Mettre à jour le code
git pull origin main

# Installer les dépendances
bun install

# Configurer .env.local
nano .env.local
# Ajouter tes clés Stripe, etc.

# Build
bun run build

# Redémarrer
pm2 restart guillaumefarre
```

## 📊 Vérifier que ça Fonctionne

Après le déploiement, tu devrais voir sur https://guillaumefarre.com :
- ✅ Hero Carousel plein écran
- ✅ Fond sombre anthracite
- ✅ "Ferrari Live" dans le menu
- ✅ Pas de bordures blanches

---

**IMPORTANT** : Sans les secrets GitHub configurés, AUCUN déploiement automatique ne fonctionnera.
