# ⚡ Quick Start - Déploiement en 3 Minutes

## 🎯 Objectif

Mettre le site Guillaume Farré en ligne sur **guillaumefarre.com** en 3 langues (FR/EN/IT).

## ✅ État Actuel

Tout est prêt ! Le code est commité, le build fonctionne, il ne reste que 3 étapes.

---

## 📋 3 Étapes Simples

### 1️⃣ Connecter GitHub (2 minutes)

Dans Same :
1. Cliquez sur **"Tools"** (en haut à droite)
2. Cherchez **"GitHub"**
3. Cliquez sur **"Connect"**
4. Autorisez l'accès

✅ **Vérification** : Vous devriez voir "GitHub ✓" dans la barre d'outils

---

### 2️⃣ Pousser le Code (1 minute)

Dans le terminal Same :
```bash
cd guillaume-farre-work
git remote add origin https://github.com/RaoulDelpech/guillaume-farre.git
git push -u origin main
```

✅ **Vérification** : Allez sur https://github.com/RaoulDelpech/guillaume-farre - le code doit être là

---

### 3️⃣ Ajouter la Clé SSH (1 minute)

1. Dans Same, ouvrez le fichier **`vps_key`** (à la racine du workspace)
2. **Copiez tout** le contenu (Ctrl+A puis Ctrl+C)
3. Allez sur : https://github.com/RaoulDelpech/guillaume-farre/settings/secrets/actions
4. Cliquez **"New repository secret"**
5. Remplissez :
   - Name : `VPS_SSH_KEY`
   - Value : Collez le contenu copié
6. Cliquez **"Add secret"**

✅ **Vérification** : Vous devriez voir `VPS_SSH_KEY` dans la liste des secrets

---

## 🚀 Déploiement Automatique

Une fois l'étape 2 terminée, GitHub Actions déploie automatiquement !

**Suivre le déploiement** :
1. Allez sur https://github.com/RaoulDelpech/guillaume-farre/actions
2. Cliquez sur le workflow en cours
3. Attendez ~5 minutes

✅ **Résultat** : Site en ligne sur https://guillaumefarre.com

---

## 🌐 Tester le Site

Après déploiement, vérifiez :

- 🇫🇷 https://guillaumefarre.com/ (Français)
- 🇬🇧 https://guillaumefarre.com/en/ (English)
- 🇮🇹 https://guillaumefarre.com/it/ (Italiano)
- 🔐 https://guillaumefarre.com/admin (Admin - mot de passe : `guillaume2025`)

---

## ❓ En Cas de Problème

### Le push Git échoue
```bash
# Vérifier que GitHub est connecté
cd guillaume-farre-work
gh auth status

# Si pas connecté, authentifier
gh auth login
```

### Le déploiement échoue
1. Vérifiez que la clé SSH est bien dans GitHub Secrets
2. Consultez les logs : https://github.com/RaoulDelpech/guillaume-farre/actions

### Le site ne s'affiche pas
1. Vérifiez que le domaine pointe vers le VPS
2. Connectez-vous au VPS : `ssh root@guillaumefarre.com`
3. Vérifiez PM2 : `pm2 status`

---

## 📞 Support

Besoin d'aide ? Consultez :
- **GUIDE-DEPLOIEMENT.md** : Guide complet
- **STATUS.md** : État du projet
- **README.md** : Documentation générale

---

## 🎉 C'est Fait !

En seulement 3 étapes, le site est déployé et accessible au monde entier en 3 langues !

**Prochaine étape** : Gérer le contenu via le panneau admin → https://guillaumefarre.com/admin
