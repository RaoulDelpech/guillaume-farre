# 🚀 GUIDE ACTIVATION COMPLET - GUILLAUME FARRÉ

**Date** : 2025-11-16
**Temps total** : 2h35
**Par** : Lalou

---

## 📋 CHECKLIST COMPLÈTE (cocher au fur et à mesure)

### ✅ ÉTAPE 1 : GELATO (1h30)

**Objectif** : Impression automatique des commandes

- [ ] **1.1** Créer compte sur https://www.gelato.com/ (5 min)
  - Choisir plan "Pay-as-you-go" (gratuit)
  - Email + mot de passe

- [ ] **1.2** Ajouter produits au catalogue (1h)
  - Dashboard → Products → Add Products
  - Rechercher "Fine Art Giclee 300gsm"
  - Ajouter formats :
    - [ ] A4 (copier UID exact)
    - [ ] A3 (copier UID exact)
    - [ ] A2 (copier UID exact)
    - [ ] A1 (copier UID exact)

- [ ] **1.3** Générer API key (2 min)
  - Dashboard → Settings → API Keys
  - Nom : "Production Guillaume Farré"
  - Copier clé format `xxx:fx`

- [ ] **1.4** Configurer serveur (5 min)
  ```bash
  ssh root@51.38.35.238
  cd /var/www/guillaume-farre
  nano .env.local
  ```

  Ajouter ces lignes :
  ```bash
  GELATO_API_KEY=votre_cle_ici
  GELATO_ENVIRONMENT=test
  ```

  Sauvegarder : `Ctrl+X`, `Y`, `Enter`

- [ ] **1.5** Update UIDs produits dans code (10 min)
  ```bash
  nano lib/gelato-client.ts
  ```

  Ligne 159, remplacer par les vrais UIDs Gelato :
  ```typescript
  'A4': 'VOTRE_UID_A4_EXACT',
  'A3': 'VOTRE_UID_A3_EXACT',
  'A2': 'VOTRE_UID_A2_EXACT',
  'A1': 'VOTRE_UID_A1_EXACT',
  ```

- [ ] **1.6** Configurer webhook Gelato (5 min)
  - Dashboard → Settings → Webhooks
  - URL : `https://guillaumefarre.com/api/gelato/webhook`
  - Cocher tous les événements
  - Save

- [ ] **1.7** Test mode test (15 min)
  ```bash
  pm2 restart guillaume-farre
  pm2 logs guillaume-farre | grep Gelato
  ```

  - Aller sur https://guillaumefarre.com/boutique
  - Passer commande test (carte `4242 4242 4242 4242`)
  - Vérifier logs : "🖨️ Gelato order created"
  - Dashboard Gelato → Orders → Vérifier commande apparaît (statut `draft`)

- [ ] **1.8** Passage production (quand tests OK)
  ```bash
  nano .env.local
  ```
  Changer :
  ```bash
  GELATO_ENVIRONMENT=live
  ```
  ```bash
  pm2 restart guillaume-farre
  ```

**📖 Guide détaillé** : `GELATO_SETUP_FINAL.md`

---

### ✅ ÉTAPE 2 : RESEND EMAILS (35 min)

**Objectif** : Emails automatiques à chaque étape commande

- [ ] **2.1** Créer compte sur https://resend.com/ (5 min)
  - Email + mot de passe
  - Plan gratuit : 3,000 emails/mois ✅

- [ ] **2.2** Vérifier domaine (10 min)
  - Dashboard → Domains → Add Domain
  - Entrer : `guillaumefarre.com`
  - Copier les 3 enregistrements DNS affichés
  - Aller sur OVH/IONOS → DNS
  - Ajouter :
    - [ ] SPF record (TXT)
    - [ ] DKIM record (TXT)
    - [ ] DMARC record (TXT)
  - Attendre validation (~15 min)

- [ ] **2.3** Générer API key (2 min)
  - Dashboard → API Keys → Create API Key
  - Nom : "Production Guillaume Farré"
  - Permissions : Full access
  - Copier clé `re_xxx`

- [ ] **2.4** Configurer serveur (2 min)
  ```bash
  ssh root@51.38.35.238
  cd /var/www/guillaume-farre
  nano .env.local
  ```

  Ajouter :
  ```bash
  RESEND_API_KEY=re_xxx_VOTRE_CLE
  RESEND_FROM_EMAIL="Guillaume Farré <noreply@guillaumefarre.com>"
  ```

- [ ] **2.5** Test envoi (5 min)
  ```bash
  node -e "
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  resend.emails.send({
    from: 'Guillaume Farré <noreply@guillaumefarre.com>',
    to: 'VOTRE_EMAIL@example.com',
    subject: 'Test Resend',
    html: '<h1>Test email</h1><p>Si vous recevez ceci, Resend fonctionne ✅</p>'
  }).then(console.log).catch(console.error);
  "
  ```

  Vérifier email reçu dans votre boîte

- [ ] **2.6** Restart serveur (1 min)
  ```bash
  pm2 restart guillaume-farre
  pm2 logs guillaume-farre --lines 50
  ```

- [ ] **2.7** Test complet (10 min)
  - Aller sur https://guillaumefarre.com/boutique
  - Passer commande test
  - Vérifier email confirmation reçu ✅
  - Dashboard Resend → Logs → Vérifier email envoyé

**📖 Guide détaillé** : `RESEND_EMAILS_SETUP.md`

---

### ✅ ÉTAPE 3 : DEEPL TRADUCTIONS (10 min)

**Objectif** : Traductions FR → EN + IT automatiques

- [ ] **3.1** Créer compte sur https://www.deepl.com/pro-api (3 min)
  - Email + mot de passe
  - Plan gratuit : 500,000 caractères/mois ✅

- [ ] **3.2** Générer API key (2 min)
  - Dashboard → Account → API Keys
  - Create new key
  - Copier clé

- [ ] **3.3** Configurer serveur (2 min)
  ```bash
  ssh root@51.38.35.238
  cd /var/www/guillaume-farre
  nano .env.local
  ```

  Ajouter :
  ```bash
  DEEPL_API_KEY=votre_cle_api
  ```

- [ ] **3.4** Exécuter traductions (3 min)
  ```bash
  bun run translate:deepl
  ```

  Attendre fin (2-3 min)

  Vérifier :
  ```bash
  wc -l messages/fr.json messages/en.json messages/it.json
  ```

  EN et IT doivent avoir autant de lignes que FR ✅

---

### ✅ ÉTAPE 4 : ANTHROPIC DESCRIPTIONS IA (10 min)

**Objectif** : Descriptions photos automatiques avec Claude Vision

- [ ] **4.1** Créer compte sur https://console.anthropic.com/ (3 min)
  - Email + mot de passe
  - Plan Pay-as-you-go

- [ ] **4.2** Générer API key (2 min)
  - Settings → API Keys
  - Create Key
  - Copier clé `sk-ant-api03-xxx`

- [ ] **4.3** Configurer serveur (2 min)
  ```bash
  ssh root@51.38.35.238
  cd /var/www/guillaume-farre
  nano .env.local
  ```

  Ajouter :
  ```bash
  ANTHROPIC_API_KEY=sk-ant-api03-xxx_VOTRE_CLE
  ```

- [ ] **4.4** Restart serveur (1 min)
  ```bash
  pm2 restart guillaume-farre
  ```

- [ ] **4.5** Test admin (2 min)
  - Aller sur https://guillaumefarre.com/admin
  - Sélectionner une photo
  - Cliquer "Générer description IA"
  - Vérifier description générée ✅

---

### ✅ ÉTAPE 5 : VALIDATION FINALE (10 min)

- [ ] **5.1** Vérifier .env.local complet
  ```bash
  ssh root@51.38.35.238
  cd /var/www/guillaume-farre
  cat .env.local | grep -E "(GELATO|RESEND|DEEPL|ANTHROPIC)"
  ```

  Doit afficher les 4 clés API ✅

- [ ] **5.2** Restart final
  ```bash
  pm2 restart guillaume-farre
  pm2 logs guillaume-farre --lines 100
  ```

- [ ] **5.3** Tests fonctionnels
  - [ ] Upload photo admin → Preview immédiat ✅
  - [ ] Commande boutique → Email confirmation reçu ✅
  - [ ] Site en anglais → Textes traduits ✅
  - [ ] Générer description IA → Fonctionne ✅

- [ ] **5.4** Vérifier dashboards
  - [ ] Gelato : https://dashboard.gelato.com/
  - [ ] Resend : https://resend.com/emails
  - [ ] Stripe : https://dashboard.stripe.com/

---

## 🎯 RÉSUMÉ TEMPS

| Étape | Temps | Statut |
|-------|-------|--------|
| 1. Gelato | 1h30 | ⏳ |
| 2. Resend | 35 min | ⏳ |
| 3. DeepL | 10 min | ⏳ |
| 4. Anthropic | 10 min | ⏳ |
| 5. Validation | 10 min | ⏳ |
| **TOTAL** | **2h35** | |

---

## 💰 IMPACT APRÈS ACTIVATION

**Gains directs** :
- Gelato revenus : +€500/mois
- Conversions panier persistant : +€800/mois
- Conversions social proof : +€600/mois
- **Total revenus** : +€1,900/mois

**Économies** :
- Temps Guillaume : 20h/mois = €1,000/mois
- Support client : -50% = €300/mois
- **Total économies** : +€1,300/mois

### **IMPACT TOTAL : +€3,200/mois** 🚀

---

## 🐛 DÉPANNAGE RAPIDE

### Gelato : "API key manquante"
```bash
echo 'GELATO_API_KEY=xxx' >> /var/www/guillaume-farre/.env.local
pm2 restart guillaume-farre
```

### Resend : "Domaine non vérifié"
- Attendre 15 min - 24h propagation DNS
- Dashboard Resend → Domains → Vérifier statut

### DeepL : "Erreur traduction"
```bash
cat .env.local | grep DEEPL
# Vérifier clé présente et correcte
```

### Anthropic : "Clé invalide"
- Console Anthropic → Settings → API Keys
- Générer nouvelle clé
- Remplacer dans .env.local

### Serveur : "Logs erreur"
```bash
pm2 logs guillaume-farre --err --lines 100
```

---

## 📞 SUPPORT

**Problème bloquant** :
1. Copier logs erreur : `pm2 logs guillaume-farre --err --lines 50`
2. Contacter Lalou avec logs

**Guides détaillés** :
- `GELATO_SETUP_FINAL.md` (262 lignes)
- `RESEND_EMAILS_SETUP.md` (610 lignes)
- `RECAP_PHASES_4_5_COMPLETE.md` (vue d'ensemble)

---

## ✅ APRÈS ACTIVATION

**Nouvelles fonctionnalités actives** :
- ✅ Panier persistant 30 jours
- ✅ Social proof (visiteurs, stock)
- ✅ Gelato impression automatique
- ✅ 3 emails transactionnels (confirmation, shipping, delivery)
- ✅ Traductions DeepL FR/EN/IT
- ✅ Descriptions IA photos (Claude Vision)

**Monitoring** :
- Gelato : https://dashboard.gelato.com/orders
- Resend : https://resend.com/emails
- Stripe : https://dashboard.stripe.com/payments
- Logs serveur : `pm2 logs guillaume-farre`

---

**Bon courage pour l'activation !**

**Lalou**
