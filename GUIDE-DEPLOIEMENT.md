# 🚀 Guide de Déploiement - Guillaume Farré Portfolio

## ✅ État Actuel

Le site est **100% prêt** pour le déploiement ! Voici ce qui est fait :

- ✅ Build de production réussi sans erreur
- ✅ Support multilingue (FR/EN/IT) complet
- ✅ Galerie d'œuvres avec lightbox
- ✅ Panneau d'administration pour gérer les photos
- ✅ Workflow GitHub Actions configuré
- ✅ Commit initial créé dans Git
- ✅ 204 fichiers prêts à être déployés

## 📋 Étapes de Déploiement

### Étape 1 : Authentifier GitHub dans Same

**Important** : Vous devez d'abord vous connecter à GitHub.

1. Cliquez sur le bouton **"Tools"** en haut à droite de l'écran Same
2. Cherchez l'option GitHub et cliquez sur **"Connect"**
3. Autorisez l'accès à votre compte GitHub
4. Une fois connecté, vous verrez "GitHub ✓" dans la barre d'outils

### Étape 2 : Pousser le Code vers GitHub

Une fois authentifié, ouvrez le terminal dans Same et exécutez :

```bash
cd guillaume-farre-work
git remote add origin https://github.com/RaoulDelpech/guillaume-farre.git
git push -u origin main
```

**Résultat attendu** : Le code sera poussé vers GitHub.

### Étape 3 : Configurer la Clé SSH pour le VPS

Pour que GitHub Actions puisse déployer sur le VPS IONOS, vous devez ajouter la clé SSH :

1. Ouvrez le fichier `vps_key` dans le projet (racine du workspace)
2. Copiez **tout** le contenu du fichier
3. Allez sur https://github.com/RaoulDelpech/guillaume-farre/settings/secrets/actions
4. Cliquez sur **"New repository secret"**
5. Remplissez :
   - **Name** : `VPS_SSH_KEY`
   - **Value** : Collez le contenu complet de la clé SSH
6. Cliquez sur **"Add secret"**

### Étape 4 : Déploiement Automatique

Une fois que vous avez poussé le code (Étape 2), GitHub Actions va **automatiquement** :

1. Détecter le push sur la branche `main`
2. Builder l'application Next.js
3. Se connecter au VPS IONOS via SSH
4. Transférer les fichiers
5. Installer les dépendances avec Bun
6. Builder la version de production
7. Redémarrer l'application avec PM2

**Suivre le déploiement** :
- Allez sur https://github.com/RaoulDelpech/guillaume-farre/actions
- Cliquez sur le workflow le plus récent
- Suivez les logs en temps réel

## 🌐 URLs du Site (Après Déploiement)

### Français (par défaut)
- Page d'accueil : https://guillaumefarre.com/
- Galerie : https://guillaumefarre.com/galerie
- Boutique : https://guillaumefarre.com/boutique
- Histoire : https://guillaumefarre.com/histoire
- Atelier : https://guillaumefarre.com/atelier
- Contact : https://guillaumefarre.com/contact
- Admin : https://guillaumefarre.com/admin

### English
- Homepage : https://guillaumefarre.com/en/
- Gallery : https://guillaumefarre.com/en/galerie
- Shop : https://guillaumefarre.com/en/boutique
- Etc...

### Italiano
- Homepage : https://guillaumefarre.com/it/
- Galleria : https://guillaumefarre.com/it/galerie
- Negozio : https://guillaumefarre.com/it/boutique
- Etc...

## 🔐 Accès Admin

- **URL** : https://guillaumefarre.com/admin
- **Mot de passe** : `guillaume2025`

**IMPORTANT** : Changez le mot de passe en production !

Pour changer le mot de passe :
1. Modifiez la variable `ADMIN_PASSWORD` dans le fichier `.env.local`
2. Committez et poussez les changements
3. GitHub Actions redéploiera automatiquement

## 🎨 Modifier le Site Après Déploiement

Pour faire des modifications au site :

1. **Éditez les fichiers** dans Same (ou localement)
2. **Testez localement** :
   ```bash
   cd guillaume-farre-work
   bun run dev
   ```
3. **Committez les changements** :
   ```bash
   git add .
   git commit -m "Description de vos modifications"
   git push origin main
   ```
4. **Déploiement automatique** : GitHub Actions redéploiera le site !

## 📸 Gérer les Photos

### Via l'Interface Admin

1. Allez sur https://guillaumefarre.com/admin
2. Entrez le mot de passe
3. Vous pouvez :
   - Masquer/afficher des photos
   - Changer les catégories
   - Définir les prix
   - Marquer comme "à la vente"
   - Gérer les éditions limitées

### Ajouter de Nouvelles Photos

1. Ajoutez les photos dans `public/images/works/[catégorie]/`
2. Committez et poussez
3. Elles apparaîtront automatiquement dans l'admin

## 🔧 En Cas de Problème

### Le build échoue
```bash
cd guillaume-farre-work
bun run build
```
Vérifiez les erreurs et corrigez-les.

### Le déploiement GitHub Actions échoue
1. Allez sur https://github.com/RaoulDelpech/guillaume-farre/actions
2. Cliquez sur le workflow qui a échoué
3. Consultez les logs pour voir l'erreur

### Le site ne s'affiche pas après déploiement
1. Vérifiez que le VPS est accessible
2. Connectez-vous au VPS : `ssh root@guillaumefarre.com`
3. Vérifiez PM2 : `pm2 status`
4. Consultez les logs : `pm2 logs guillaume-farre`

## 📚 Documentation Complète

- **README.md** : Documentation générale du projet
- **I18N-INTEGRATION.md** : Système multilingue
- **DEPLOIEMENT-IONOS-VPS.md** : Configuration du VPS
- **ADMIN-GUIDE.md** : Guide du panneau admin
- **NEXT-STEPS.md** : Prochaines étapes

## 🎉 C'est Tout !

Le projet est **prêt à être déployé**. Une fois les étapes 1-3 complétées, le site sera en ligne et accessible en 3 langues !

---

**Workflow Simplifié** :
1. Authentifier GitHub dans Same ✓
2. Pousser le code : `git push -u origin main` ✓
3. Ajouter la clé SSH dans GitHub Secrets ✓
4. **Le site est en ligne !** 🎉
