# 🚀 GUIDE UTILISATION QUOTIDIENNE - GUILLAUME FARRÉ

**Pour** : Guillaume Farré & Raoul Delpech
**Dernière MAJ** : 2025-11-17
**Temps lecture** : 5 min

---

## ⚡ DÉMARRAGE RAPIDE (30 secondes)

### Lancer le Projet

```bash
# Terminal 1 : Aller dans répertoire
cd ~/Desktop/Claude/guillaume-farre/guillaume-farre-from-github

# Terminal 2 : Lancer serveur dev
npm run dev
```

**Résultat** :
- ✅ Site accessible : http://localhost:3000/ (FR)
- ✅ Admin accessible : http://localhost:3000/admin
- ✅ EN : http://localhost:3000/en/
- ✅ IT : http://localhost:3000/it/

---

## 📋 TÂCHES QUOTIDIENNES

### 1. Upload Photos (5 min)

**URL** : http://localhost:3000/admin

**Étapes** :
1. Cliquer **"Upload Photos"**
2. Sélectionner 1 ou plusieurs photos
3. Attendre upload (preview apparaît automatiquement)
4. Photos dans section **"À trier"** par défaut

**Formats acceptés** : JPG, PNG, WEBP
**Taille max** : 10 MB par photo

### 2. Organiser Photos (10 min)

**Pour chaque photo** :

#### a) Statut

Dropdown **"Statut"** :
- **Active** : Photo visible sur site, en vente
- **À trier** : Photo cachée, à traiter plus tard
- **Corbeille** : Photo archivée (soft delete)

#### b) Catégories (Checkboxes)

☐ **Tirage illimité** (A4/A3/A2, 150€-400€)
☐ **Série limitée** (1/7, A3/A2/A1, 500€-1200€)
☐ **Format XXL** (80×120 cm, sur devis)
☐ **Format monumental** (120+ cm, sur devis)

**IMPORTANT** : Plusieurs cases peuvent être cochées !

**Exemple** :
```
Photo "Ferrari Noire Atelier"
☑ Tirage illimité
☑ Série limitée
☑ Format XXL
→ Disponible dans 3 catégories simultanément
```

#### c) Informations

- **Titre** : Nom photo (ex: "Ferrari Noire Atelier")
- **Année** : 2024, 2025, etc.
- **Série** : Empreintes, Atelier, Projection

#### d) Description IA (Optionnel)

**Bouton** : "Générer description IA"

- ✅ Cliquer → Description générée automatiquement
- ✅ Éditer texte si besoin
- ✅ Zone texte libre

**Requis** : Clé API Anthropic configurée

### 3. Gérer Séries Limitées (2 min)

**Si photo cochée "Série limitée"** :

Section **"Édition Limitée"** apparaît :
- **Total** : Toujours 7 (fixe)
- **Vendus** : Nombre vendus (0-7)
- **Disponibles** : Restants (7 - vendus)
- **Série close** : Cocher si série terminée

**Mise à jour automatique** :
- Quand client achète → compteur décrémenté automatiquement
- Email notification quand ≤2 restants

### 4. Ajuster Pricing (5 min)

**URL** : http://localhost:3000/admin (section "Pricing")

#### Pricing Unlimited (Tirages illimités)

**Prix de base** : 150€
**Multiplicateurs** :
- A4 : ×1.0 = 150€
- A3 : ×1.67 = 251€
- A2 : ×2.67 = 401€

**Pour changer** :
1. Modifier "Prix de base" (ex: 150€ → 200€)
2. Ou modifier multiplicateurs (ex: A3 ×1.67 → ×2.0)
3. Prix recalculés automatiquement

**Override manuel** :
- Toggle "Auto/Manuel"
- Entrer prix custom

#### Pricing Limited (Séries limitées)

**Prix de base** : 1500€
**Multiplicateurs** :
- A3 : ×1.0 = 1500€
- A2 : ×1.53 = 2295€
- A1 : ×2.0 = 3000€

**Même système** : Base + multiplicateurs ou override manuel

### 5. Traduire Site (1 min)

**Requis** : Clé API DeepL configurée

```bash
# Terminal
cd ~/Desktop/Claude/guillaume-farre/guillaume-farre-from-github
bun run translate
```

**Résultat** :
- ✅ `messages/fr.json` (source) traduit vers :
- ✅ `messages/en.json` (English)
- ✅ `messages/it.json` (Italiano)

**Qualité** : Professionnelle (DeepL)

### 6. Tester Commande (5 min)

**Workflow complet** :

1. **Aller sur boutique** : http://localhost:3000/fr/boutique
2. **Choisir photo** : Cliquer photo
3. **Sélectionner format** : A3, A2, etc.
4. **Ajouter au panier** : Bouton "Ajouter"
5. **Voir panier** : Icône panier (haut droite)
6. **Passer commande** : Bouton "Commander"
7. **Payer Stripe** : Utiliser carte test :
   ```
   Numéro : 4242 4242 4242 4242
   Date : 12/34
   CVC : 123
   ```
8. **Vérifier email** : Email OrderConfirmation reçu (si Resend configuré)
9. **Vérifier Gelato** : Commande créée (si Gelato configuré)

---

## 🔑 CLÉS API (Configuration une fois)

### État Actuel

**✅ Configurées** :
- Stripe (paiements)
- WhiteWall (ancien, peut-être obsolète)
- Anthropic (peut-être à renouveler)

**⏳ Manquantes (2h35)** :
1. **Gelato** (1h30) - Impression automatique
2. **Resend** (35 min) - Emails transactionnels
3. **DeepL** (10 min) - Traductions
4. **Anthropic** (10 min - vérifier clé actuelle)
5. **Restart** (10 min) - Redémarrer serveur

**Guide complet** : `ACTIVATION_COMPLETE_GUILLAUME.md`

### Vérifier Clés Manquantes

```bash
./scripts/check-api-keys.sh
```

**Résultat** :
```
✅ Stripe Secret
✅ Stripe Publishable
❌ Resend API Key - Manquante
❌ Resend From Email - Manquante
❌ Gelato API Key - Manquante
❌ Gelato Environment - Manquante
❌ DeepL API Key - Manquante

⚠️  Il manque 5 clé(s) API

📖 Guide complet:
   ACTIVATION_COMPLETE_GUILLAUME.md
```

---

## 🛠️ COMMANDES UTILES

### Développement

```bash
# Lancer serveur dev
npm run dev

# Build production
npm run build

# Lancer production local
npm run start

# Vérifier erreurs TypeScript
npx tsc --noEmit

# Linter
npm run lint
```

### Tests

```bash
# Tests unitaires
bun test

# Tests avec watch
bun test:watch

# Coverage
bun test:coverage
```

### Traductions

```bash
# Traduire FR → EN + IT (DeepL)
bun run translate
```

### Scripts Admin

```bash
# Vérifier clés API
./scripts/check-api-keys.sh

# Valider projet complet
./scripts/validate-project.sh

# Setup environnement
./scripts/setup-env.sh
```

### Git

```bash
# Voir changements
git status
git diff

# Commit
git add .
git commit -m "Description changement"

# Push
git push origin main

# Pull dernières modifs
git pull origin main

# Historique
git log --oneline -10
```

### Déploiement Production

```bash
# SSH vers VPS
ssh root@51.38.35.238

# Une fois connecté
cd /var/www/guillaume-farre
git pull origin main
npm install
npm run build
pm2 restart guillaume-farre

# Voir logs
pm2 logs guillaume-farre
pm2 status
```

---

## 🐛 DÉPANNAGE

### Problème #1 : Photos Upload Rectangles Gris

**Symptôme** : Photos uploadées apparaissent comme rectangles gris

**Cause** : Upload fonctionne, mais UI ne refresh pas

**Solution** : ✅ **CORRIGÉ** (2025-11-16)
- Preview automatique maintenant
- Si problème persiste : F5 (recharger page)

### Problème #2 : Erreurs TypeScript

**Symptôme** :
```
npm run dev
Error: TypeScript compilation failed
```

**Solution** :
```bash
# Vérifier erreurs
npx tsc --noEmit

# Corriger erreurs affichées
# Relancer dev
npm run dev
```

### Problème #3 : Port 3000 Occupé

**Symptôme** :
```
⚠ Port 3000 is in use, using available port 3001 instead
```

**Solution** :
```bash
# Tuer processus port 3000
lsof -ti:3000 | xargs kill

# Relancer
npm run dev
```

### Problème #4 : Clés API Manquantes

**Symptôme** :
```
Error: Missing API key GELATO_API_KEY
```

**Solution** :
1. Vérifier `.env.local`
2. Ajouter clé manquante
3. Redémarrer serveur (Ctrl+C puis `npm run dev`)

**Guide** : `ACTIVATION_COMPLETE_GUILLAUME.md`

### Problème #5 : Panier Vide Après Refresh

**Symptôme** : Panier vide après recharger page

**Cause** : localStorage expiré (30 jours)

**Solution** : ✅ **NORMAL**
- Panier persiste 30 jours
- Après 30j → vidé automatiquement
- Si problème avant 30j → bug (signaler)

---

## 📊 MONITORING

### Dashboard Admin

**URL** : http://localhost:3000/admin

**Sections** :
- **Photos** : Toutes photos avec statuts
- **Filtres** : Actives / À trier / Corbeille
- **Analyse Commerciale** : Stats ventes (dépliable)
- **Pricing** : Gestion prix
- **Upload** : Uploader nouvelles photos

### Analyse Commerciale

**Cliquer** "▶ Analyse commerciale" pour déplier

**Métriques** :
- Photos totales
- Photos actives
- Photos en vente
- Photos séries limitées
- Revenus estimés
- Stock restant

### Logs Serveur

**Terminal** où `npm run dev` tourne :

**Logs normaux** :
```
✓ Ready in 3.2s
✓ Compiled /api/stripe/checkout in 4.7s
POST /api/stripe/checkout 200 in 6795ms
```

**Erreurs** (rouge) :
```
Error: Missing API key
```

---

## 📚 DOCUMENTATION COMPLÈTE

### Guides Prioritaires (10 min)

1. **`COMMENCE_ICI.md`** (2 min)
   - Premier fichier à lire

2. **`ACTIVATION_COMPLETE_GUILLAUME.md`** (5 min)
   - Activer clés API (2h35)

3. **`GUIDE_UTILISATION_QUOTIDIENNE.md`** (3 min - ce fichier)
   - Utilisation quotidienne

### Documentation Technique

4. **`DOCUMENT_MAITRE.md`** (1258 lignes)
   - Source unique vérité projet
   - Historique complet
   - Toutes règles

5. **`CLAUDE.md`** (633 lignes)
   - Règles métier absolues

6. **`INDEX_DOCUMENTATION.md`**
   - Index 110 fichiers Markdown

### Guides Spécifiques

7. **`GELATO_SETUP_FINAL.md`** (1h30)
   - Setup Gelato impression

8. **`RESEND_EMAILS_SETUP.md`** (35 min)
   - Setup Resend emails

9. **`CAROUSEL_ALTERNATIVES_PHOTOS.md`** (5 min)
   - Changer photo carousel

10. **`DEPLOIEMENT_RAPIDE.md`** (10 min)
    - Déployer production

---

## 🎯 CHECKLIST QUOTIDIENNE

### Matin (10 min)

- [ ] `git pull origin main` (récupérer derniers changements)
- [ ] `npm run dev` (lancer serveur)
- [ ] Vérifier admin : http://localhost:3000/admin
- [ ] Vérifier site : http://localhost:3000/

### Upload Photos (15 min)

- [ ] Upload nouvelles photos
- [ ] Définir statut (active/à trier/corbeille)
- [ ] Cocher catégories (unlimited/limited/xxl/monumental)
- [ ] Remplir titre, année, série
- [ ] Générer description IA (optionnel)
- [ ] Sauvegarder

### Gestion (10 min)

- [ ] Vérifier séries limitées (compteurs)
- [ ] Ajuster pricing si besoin
- [ ] Vérifier analyse commerciale
- [ ] Répondre clients (emails)

### Fin Journée (5 min)

- [ ] `git add .` (si changements)
- [ ] `git commit -m "Description"` (si changements)
- [ ] `git push origin main` (si changements)
- [ ] Arrêter serveur (Ctrl+C)

---

## 🚀 RACCOURCIS CLAVIER

### Admin

- `Ctrl + S` : Sauvegarder photo (si formulaire)
- `Esc` : Fermer modal
- `Tab` : Navigation champs

### Boutique

- `←` / `→` : Navigation carousel
- `Esc` : Fermer lightbox photo

### Terminal

- `Ctrl + C` : Arrêter serveur dev
- `Ctrl + L` : Clear terminal
- `↑` / `↓` : Historique commandes

---

## 📞 AIDE

### Questions Fréquentes

**Q : Comment changer prix ?**
→ Admin > Section Pricing > Modifier base ou multiplicateurs

**Q : Comment traduire site ?**
→ Terminal : `bun run translate` (requis clé DeepL)

**Q : Comment déployer en production ?**
→ Suivre `DEPLOIEMENT_RAPIDE.md`

**Q : Comment activer clés API ?**
→ Suivre `ACTIVATION_COMPLETE_GUILLAUME.md` (2h35)

**Q : Où voir documentation complète ?**
→ `INDEX_DOCUMENTATION.md` (110 fichiers)

### Contact Dev

**Lalou (Raoul Delpech)**
- GitHub : RaoulDelpech
- Projet : guillaume-farre

---

**Lalou**
