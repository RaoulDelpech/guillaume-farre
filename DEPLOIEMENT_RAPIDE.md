# 🚀 DÉPLOIEMENT RAPIDE - PRODUCTION

**Dernière mise à jour** : 2025-11-16
**Temps estimé** : 10 min

---

## ✅ PRÉREQUIS

- [x] Code commité sur branche `main`
- [x] Compilation TypeScript : 0 erreurs
- [x] Tests locaux : OK
- [ ] Clés API configurées sur serveur production

---

## 📋 ÉTAPES DÉPLOIEMENT

### 1. Build local (2 min)

```bash
npm run build
```

Vérifier : aucune erreur

---

### 2. Connexion serveur (1 min)

```bash
ssh root@51.38.35.238
cd /var/www/guillaume-farre
```

---

### 3. Pull dernières modifications (2 min)

```bash
git fetch origin
git pull origin main
```

---

### 4. Installer dépendances (2 min)

```bash
npm install
```

---

### 5. Build production (2 min)

```bash
npm run build
```

---

### 6. Restart serveur (1 min)

```bash
pm2 restart guillaume-farre
pm2 logs guillaume-farre --lines 50
```

Vérifier : aucune erreur dans les logs

---

## 🔑 VÉRIFIER CLÉS API

Sur le serveur, vérifier `.env.local` :

```bash
cat .env.local | grep -E '(STRIPE|GELATO|RESEND|DEEPL|ANTHROPIC)'
```

**Clés requises** :
- `STRIPE_SECRET_KEY` (paiements)
- `GELATO_API_KEY` (impression)
- `RESEND_API_KEY` (emails)
- `DEEPL_API_KEY` (traductions)
- `ANTHROPIC_API_KEY` (descriptions IA)

---

## ✅ VALIDATION

Tester sur https://guillaumefarre.com/ :

- [ ] Homepage charge correctement
- [ ] Carousel fonctionne (50vh-55vh, 9s autoplay)
- [ ] Boutique affiche photos
- [ ] Panier fonctionne
- [ ] Paiement Stripe fonctionne

---

## 🐛 DÉPANNAGE

### Erreur 500
```bash
pm2 logs guillaume-farre --err --lines 100
```

### Port déjà utilisé
```bash
pm2 restart guillaume-farre
```

### Clé API manquante
```bash
nano .env.local
# Ajouter clé manquante
pm2 restart guillaume-farre
```

---

**Lalou**
