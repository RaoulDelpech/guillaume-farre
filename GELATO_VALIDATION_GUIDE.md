# Gelato - Guide Validation & Setup

Date: 7 novembre 2025
Par: Lalou
Statut: Validé par Guillaume, en cours de setup

---

## ✅ DÉCISION : GELATO VALIDÉ

Guillaume a validé Gelato comme solution d'impression API avec production locale France.

---

## CE QUE JE SAIS SUR GELATO

### 🇫🇷 Production locale France

- ✅ 140+ hubs production dans 33 pays
- ✅ **Production locale France confirmée**
- ✅ Fulfillment depuis centre le plus proche du client
- ✅ Shipping France mini garanti

### 🎨 Fine Art Giclee confirmé

- ✅ **12 couleurs** (vs 4 CMYK standard) = gamme couleurs exceptionnelle
- ✅ **Papier 200 gsm FSC-certified**
- ✅ **Matte finish lisse**, qualité galerie
- ✅ **Encres archival fade-resistant**, conservation multi-génération
- ✅ **Museum-quality art printing**

### 🔌 API complète

- ✅ **REST API** : https://order.gelatoapis.com
- ✅ **Documentation** : https://dashboard.gelato.com/docs/
- ✅ **Webhooks** pour events commande
- ✅ **Authentification** : X-API-KEY header
- ✅ **Sandbox** pour tests (commandes auto-cancelled)
- ✅ **Intégrations** : Shopify, Etsy, WooCommerce, Custom API

### 💰 Modèle économique

- ✅ **Gratuit à utiliser** (inscription gratuite)
- ✅ **Pas de frais setup**
- ✅ **Pas de minimum commande**
- ✅ **Pas de frais mensuels** (sauf plans Gelato+ optionnels)
- ✅ **Payé uniquement** produits vendus + shipping
- ✅ **Pas de commissions**

### 📦 Formats disponibles

- ✅ A4 (21 x 29.7 cm)
- ✅ A3 (29.7 x 42 cm)
- ✅ A2 (42 x 59.4 cm)
- ✅ A1, A0 (et autres formats)

### 🎁 Promo actuelle

- ✅ **Free standard shipping France** sur wall art jusqu'au 10 décembre 2025 (à vérifier si applicable Fine Art)

---

## ❓ CE QU'IL FAUT VÉRIFIER

### Pricing exact France

**Pas de grille publique**. Il faut :
1. Créer compte gratuit : https://www.gelato.com/
2. Accéder dashboard : https://dashboard.gelato.com/
3. Product catalog → Fine Art Prints
4. Sélectionner destination : France
5. Vérifier prix :
   - Production A2 Fine Art Giclee
   - Production A3 Fine Art Giclee
   - Production A4 Fine Art Giclee
   - Shipping France (standard vs express)

**Profit calculator** disponible : https://www.gelato.com/print-on-demand (calcule marges automatiquement)

### Plans Gelato+ (optionnels)

**Free Plan** (recommandé pour démarrer) :
- ✅ Accès réseau production global
- ✅ Catalogue complet produits
- ✅ Intégrations e-commerce
- ✅ API complète
- **Prix** : Gratuit

**Gelato+ Monthly** ($23.99/mois) :
- ✅ Tout du Free Plan
- ✅ **-25% sur produits** (réduction coûts production)
- **Intéressant si** : Volume > 50 commandes/mois

**Gelato+ Annual** ($19.99/mois facturé annuel) :
- ✅ Tout du Free Plan
- ✅ **-35% sur produits** (jusqu'au 31 déc 2025, puis -25%)
- **Intéressant si** : Volume > 100 commandes/mois

**Ma recommandation** : Commencer avec **Free Plan**, upgrader à Gelato+ si volume important (économies -25%/-35% justifient abonnement).

### Catalogue à vérifier

**Confirmé disponible** :
- ✅ Fine Art Giclee prints
- ✅ Posters
- ✅ Framed posters

**À vérifier** :
- ❓ Alu-Dibond / Metal prints
- ❓ Acrylic prints
- ❓ Options encadrement (noir, blanc, alu)
- ❓ Certificats authenticité personnalisables

### Shipping France exact

**Ce qu'on sait** :
- Production locale France = shipping réduit
- Shipping dynamique temps-réel (pas fixe)
- Promo shipping gratuit France wall art (jusqu'au 10 déc)

**À vérifier** :
- Prix shipping exact A2/A3/A4 France
- Standard vs Express (délais + prix)
- Free shipping applicable Fine Art Giclee ?

---

## PLAN D'ACTION

### Étape 1 : Créer compte Gelato (5 min)

1. Aller sur https://www.gelato.com/
2. Cliquer "Sign up for free"
3. Options :
   - Email + password
   - OU Google account
   - OU Facebook account
4. Valider email
5. Accès dashboard : https://dashboard.gelato.com/

### Étape 2 : Explorer pricing (10 min)

1. Dashboard → Product catalog
2. Filtrer : Fine Art Prints
3. Sélectionner destination : France
4. Noter prix production :
   - A4 Fine Art : €X
   - A3 Fine Art : €X
   - A2 Fine Art : €X
5. Noter shipping France :
   - Standard : €X (délai Y jours)
   - Express : €X (délai Y jours)

### Étape 3 : Vérifier catalogue complet (10 min)

1. Parcourir catalogue wall art
2. Chercher :
   - Metal prints / Alu-Dibond
   - Acrylic prints
   - Framing options
3. Vérifier certificats :
   - Settings → Branding
   - Certificates personnalisables ?

### Étape 4 : Générer API key (5 min)

1. Dashboard → API settings
2. "Generate API key"
3. Copier clé
4. Tester endpoint :
   ```bash
   curl -H "X-API-KEY: votre_cle" \
        https://order.gelatoapis.com/v4/products
   ```

### Étape 5 : Calculer marges (5 min)

Avec pricing obtenu, calculer :

| Format | Prod | Shipping | Total | Vente Guillaume | Marge | % |
|--------|------|----------|-------|----------------|-------|---|
| A4 | €X | €Y | €Z | €300 | €W | ?% |
| A3 | €X | €Y | €Z | €500 | €W | ?% |
| A2 | €X | €Y | €Z | €800 | €W | ?% |

**Objectif** : Marges > 80%

---

## DÉCISION FINALE

### ✅ GO si :

- Marges > 80%
- Shipping France < €25
- Fine Art Giclee confirmé qualité
- API fonctionne correctement

### ⚠️ Réévaluer si :

- Marges < 70%
- Shipping France > €30
- Alu-Dibond indispensable et absent
- API incomplète

### ❌ Abandonner si :

- Marges < 60%
- Shipping France > €40
- Qualité Fine Art insuffisante
- Pas de production locale France

---

## ALTERNATIVE FALLBACK

Si Gelato KO → **Prodigi** (backup validé) :
- Production EU (UK + NL)
- Fine Art Trade Guild approved
- Shipping estimé €15-25 France
- API complète

---

## IMPLÉMENTATION SI VALIDÉ

### Phase 1 : Setup (Jour 1-2)

1. Créer compte production (non sandbox)
2. Configurer branding (logo Guillaume Farré)
3. Générer API key production
4. Tester commande manuelle (1 print test)

### Phase 2 : Intégration API (Jour 3-5)

1. Implémenter client Gelato API :
   ```typescript
   // /lib/gelato-client.ts
   class GelatoClient {
     async createOrder(params) {
       // POST https://order.gelatoapis.com/v4/orders
     }
     async getOrderStatus(orderId) {
       // GET https://order.gelatoapis.com/v4/orders/{id}
     }
   }
   ```

2. Webhook Stripe → Gelato :
   ```typescript
   // /app/api/stripe-webhook/route.ts
   if (event.type === 'checkout.session.completed') {
     await gelatoClient.createOrder({
       productUid: 'fine-art-a3-giclee',
       imageUrl: session.metadata.imageUrl,
       shipping: session.shipping_details,
     });
   }
   ```

3. Webhook Gelato → Notre API :
   ```typescript
   // /app/api/gelato-webhook/route.ts
   // Recevoir events : order.dispatched, order.delivered
   // Envoyer email tracking client
   ```

### Phase 3 : UI Boutique (Jour 6-7)

1. Ajouter sélecteurs finitions (si Alu/Acrylic dispos)
2. Calculer prix dynamiques selon finitions
3. Intégrer Gelato profit calculator ?

### Phase 4 : Tests (Jour 8-9)

1. Commande test réelle (avec ta carte)
2. Vérifier qualité impression reçue
3. Validation Guillaume
4. Ajustements si besoin

### Phase 5 : Production (Jour 10)

1. Basculer mode production
2. Configurer webhooks production
3. Monitoring actif
4. Première vente réelle

**Total** : 10 jours pour système complet

---

## PROCHAINES ÉTAPES IMMÉDIATES

### Option A : Guillaume crée compte (recommandé)

**Avantage** : Guillaume explore lui-même, voit tout
**Temps** : 30 min
**Action** :
1. Aller sur https://www.gelato.com/
2. Sign up free
3. Explorer dashboard pricing
4. Me dire les chiffres

### Option B : Je crée compte test (alternative)

**Avantage** : Je fais tout, Guillaume reçoit résumé
**Temps** : 30 min
**Action** :
1. Je crée compte avec email temporaire
2. J'explore pricing France
3. Je calcule marges
4. Je te présente résumé + recommandation GO/NO-GO

### Option C : On contacte Gelato sales

**Avantage** : Infos officielles + peut-être discount
**Temps** : 24-48h attente
**Action** :
1. Email sales@gelato.com
2. Questions : pricing France, Alu-Dibond, certificats
3. Attente réponse
4. Décision finale

---

## 🎯 MA RECOMMANDATION

**Option B** : Je crée compte test maintenant

**Pourquoi** :
1. **Rapide** : 30 min vs 24-48h
2. **Complet** : J'explore tout (pricing, catalogue, API)
3. **Efficace** : Tu reçois résumé clair avec chiffres exacts + décision GO/NO-GO
4. **Pas d'engagement** : Compte test, aucun risque

**Ce que je fais concrètement** :
1. Créer compte Gelato test (email temporaire)
2. Accéder dashboard pricing
3. Noter prix production A2/A3/A4 Fine Art
4. Noter shipping France
5. Calculer marges Guillaume
6. Vérifier catalogue (Alu-Dibond, etc.)
7. Tester API (générer key, requête test)
8. **Te présenter dans 30 min** :
   - Tableau marges exact
   - Produits dispos vs manquants
   - Recommandation finale GO/NO-GO Gelato

**Tu valides que je fasse Option B maintenant ?**

---

Lalou
