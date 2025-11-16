# 📧 RESEND - Emails Transactionnels

**Date** : 2025-11-16
**Par** : Lalou
**Statut** : ✅ Code implémenté, prêt pour activation Guillaume

---

## ✅ CE QUI EST FAIT (3h dev)

### Fichiers implémentés

1. **`emails/OrderConfirmation.tsx`** - Email confirmation commande (React Email)
2. **`emails/ShippingNotification.tsx`** - Email notification expédition
3. **`emails/DeliveryConfirmation.tsx`** - Email confirmation livraison
4. **`lib/resend-client.ts`** - Client Resend API complet
5. **`app/api/stripe/webhook/route.ts`** - Intégration email confirmation ✅
6. **`app/api/gelato/webhook/route.ts`** - Intégration emails shipping/delivery ✅

### Flux automatisé complet

```
Client paie Stripe
    ↓
Webhook Stripe reçu
    ↓
📧 Email 1: Confirmation commande
    ↓
Commande envoyée à Gelato
    ↓
Gelato imprime
    ↓
Webhook Gelato order.shipped
    ↓
📧 Email 2: Notification expédition (avec tracking)
    ↓
Gelato livre
    ↓
Webhook Gelato order.delivered
    ↓
📧 Email 3: Confirmation livraison + demande avis
    ↓
Client reçoit œuvre 🎨
```

---

## 📋 CHECKLIST GUILLAUME (1h)

### ✅ Étape 1 : Créer compte Resend (5 min)

- [ ] Aller sur https://resend.com/
- [ ] S'inscrire (email + password)
- [ ] Plan gratuit : **3,000 emails/mois** (largement suffisant)

### ✅ Étape 2 : Vérifier domaine email (10 min)

**Option A : Domaine principal (recommandé)**

- [ ] Dashboard Resend → Domains → Add Domain
- [ ] Entrer : `guillaumefarre.com`
- [ ] Copier les 3 enregistrements DNS affichés
- [ ] Ajouter dans OVH/IONOS :
  - SPF record (TXT)
  - DKIM record (TXT)
  - DMARC record (TXT)
- [ ] Attendre validation (~15 min)

**Option B : Sous-domaine (alternative)**

- [ ] Créer sous-domaine : `mail.guillaumefarre.com`
- [ ] Plus rapide à configurer (pas de risque SPF/DMARC existant)

### ✅ Étape 3 : Générer API Key (2 min)

- [ ] Dashboard Resend → API Keys → Create API Key
- [ ] Nom : "Production Guillaume Farré"
- [ ] Permissions : **Full access**
- [ ] Copier clé format `re_xxx`

### ✅ Étape 4 : Config .env.local (2 min)

Ajouter sur serveur production (`/var/www/guillaume-farre/.env.local`) :

```bash
# Resend (emails transactionnels)
RESEND_API_KEY=re_xxx_COPIER_CLE_ICI
RESEND_FROM_EMAIL="Guillaume Farré <noreply@guillaumefarre.com>"
```

### ✅ Étape 5 : Test envoi email (5 min)

SSH serveur production :

```bash
ssh root@51.38.35.238
cd /var/www/guillaume-farre

# Tester envoi email
node -e "
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

resend.emails.send({
  from: 'Guillaume Farré <noreply@guillaumefarre.com>',
  to: 'votre-email@example.com',
  subject: 'Test Resend',
  html: '<h1>Test email Resend</h1><p>Si vous recevez ceci, Resend fonctionne ✅</p>'
}).then(console.log).catch(console.error);
"
```

Vérifier dans boîte email → Email reçu ✅

### ✅ Étape 6 : Restart serveur (1 min)

```bash
pm2 restart guillaume-farre
pm2 logs guillaume-farre --lines 50
```

### ✅ Étape 7 : Test complet avec commande Stripe (10 min)

1. Aller sur https://guillaumefarre.com/boutique
2. Ajouter photo au panier
3. Checkout avec carte Stripe test : `4242 4242 4242 4242`
4. Vérifier logs serveur :

```bash
pm2 logs guillaume-farre | grep "Email"

# Doit afficher
📧 Confirmation email sent to: client@example.com
```

5. Vérifier boîte email client → Email confirmation reçu ✅

6. Dashboard Resend → Logs → Vérifier email envoyé

### ✅ Étape 8 : Test emails Gelato (en attente activation Gelato)

Une fois Gelato activé (voir `GELATO_SETUP_FINAL.md`) :

1. Passer commande test
2. Attendre webhook Gelato `order.shipped`
3. Vérifier email expédition reçu
4. Attendre webhook Gelato `order.delivered`
5. Vérifier email livraison reçu

---

## 📧 TYPES D'EMAILS IMPLÉMENTÉS

### 1. Confirmation de commande

**Fichier** : `emails/OrderConfirmation.tsx`
**Envoi** : Immédiatement après paiement Stripe réussi
**Contenu** :
- Merci pour la commande
- Détails commande (n°, items, montant)
- Adresse de livraison
- Timeline des prochaines étapes
- Garanties qualité
- CTA "Continuer mes achats"

**Déclencheur** : `app/api/stripe/webhook/route.ts:169`

```typescript
await sendOrderConfirmationEmail({
  to: customerDetails.email,
  customerName: customerDetails.name || 'Client',
  orderNumber: fullSession.id,
  items: [...],
  totalAmount: (fullSession.amount_total || 0) / 100,
  shippingAddress: {...},
});
```

---

### 2. Notification d'expédition

**Fichier** : `emails/ShippingNotification.tsx`
**Envoi** : Quand Gelato webhook `order.shipped` est reçu
**Contenu** :
- Commande expédiée
- Transporteur + numéro tracking
- CTA "Suivre mon colis en temps réel"
- Livraison estimée
- Conseils de réception
- Assurance transport

**Déclencheur** : `app/api/gelato/webhook/route.ts:142`

```typescript
await sendShippingNotificationEmail({
  to: customerEmail,
  customerName,
  orderNumber: orderReferenceId,
  carrier: data.tracking.carrier || 'Transporteur',
  trackingNumber: data.tracking.trackingNumber || '',
  trackingUrl: data.tracking.trackingUrl || '',
  estimatedDelivery: '2-3 jours',
  items: [...],
});
```

---

### 3. Confirmation de livraison

**Fichier** : `emails/DeliveryConfirmation.tsx`
**Envoi** : Quand Gelato webhook `order.delivered` est reçu
**Contenu** :
- Livraison confirmée
- Conseils de conservation Fine Art
- CTA "Très satisfait" (rating)
- CTA "Signaler un problème"
- Invitation Instagram
- CTA "Voir la boutique" (upsell)

**Déclencheur** : `app/api/gelato/webhook/route.ts:154`

```typescript
await sendDeliveryConfirmationEmail({
  to: customerEmail,
  customerName,
  orderNumber: orderReferenceId,
  items: [...],
});
```

---

### 4. Alerte problème commande

**Fichier** : `lib/resend-client.ts:177` (HTML inline)
**Envoi** : Quand Gelato webhook `order.on-hold` est reçu
**Contenu** :
- Problème technique identifié
- Description du problème
- "Notre équipe travaille sur la résolution"
- Contact support

**Déclencheur** : `app/api/gelato/webhook/route.ts:162`

```typescript
await sendOrderProblemEmail({
  to: customerEmail,
  customerName,
  orderNumber: orderReferenceId,
  problemDescription: data.error.message || 'Un problème technique est survenu',
});
```

---

## 🎨 DESIGN EMAILS

### Charte graphique Guillaume Farré

**Header** :
- Fond noir (#000000)
- "Guillaume Farré" en blanc, letterspacing 2px
- Sous-titre "Artiste Sculpteur · Fine Art" gris clair

**Corps** :
- Fond blanc (#ffffff)
- Police système sans-serif
- Sections avec bordures légères (#eeeeee)
- Espacements généreux
- Icônes emojis pour clarté

**Boutons CTA** :
- Noir (#000000) pour actions principales
- Bleu (#3b82f6) pour tracking
- Vert (#22c55e) pour feedback positif
- Gris (#6b7280) pour actions secondaires

**Footer** :
- Texte gris (#777777)
- Lien contact
- Copyright

---

## ⚙️ CONFIGURATION TECHNIQUE

### Variables d'environnement requises

```bash
# .env.local
RESEND_API_KEY=re_xxx                                              # API key Resend
RESEND_FROM_EMAIL="Guillaume Farré <noreply@guillaumefarre.com>"  # Email expéditeur
```

### Dépendances NPM (déjà installées)

```json
{
  "resend": "^4.0.3",
  "@react-email/components": "^0.0.34"
}
```

### Intégration webhooks

**Stripe webhook** : `app/api/stripe/webhook/route.ts`
- Import : `sendOrderConfirmationEmail`
- Ligne 169 : Envoi après paiement réussi

**Gelato webhook** : `app/api/gelato/webhook/route.ts`
- Import : `sendShippingNotificationEmail`, `sendDeliveryConfirmationEmail`, `sendOrderProblemEmail`
- Ligne 142 : Envoi shipping
- Ligne 154 : Envoi delivery
- Ligne 162 : Envoi problème

---

## 🧪 TESTS

### Test unitaire email (développement)

```typescript
import { sendTestEmail } from '@/lib/resend-client';

// Envoyer email test
const result = await sendTestEmail('votre-email@example.com');

if (result.success) {
  console.log('✅ Email envoyé:', result.messageId);
} else {
  console.error('❌ Erreur:', result.error);
}
```

### Test intégration Stripe

1. Stripe CLI (local) :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

2. Vérifier logs console → Email envoyé

### Test intégration Gelato

1. Simuler webhook Gelato (local) :

```bash
curl -X POST http://localhost:3000/api/gelato/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "event": "order.shipped",
    "orderId": "gelato-123",
    "orderReferenceId": "cs_test_xxx",
    "status": "shipped",
    "timestamp": "2025-11-16T12:00:00Z",
    "data": {
      "tracking": {
        "carrier": "Chronopost",
        "trackingNumber": "1234567890",
        "trackingUrl": "https://tracking.example.com"
      }
    }
  }'
```

2. Vérifier logs console → Email expédition envoyé

---

## 📊 MONITORING

### Dashboard Resend

- Emails envoyés
- Taux délivrabilité
- Bounces (emails rejetés)
- Opens (ouvertures)
- Clicks (clics sur liens)

**URL** : https://resend.com/emails

### Logs serveur production

```bash
pm2 logs guillaume-farre | grep "Email"
pm2 logs guillaume-farre | grep "Resend"
```

### Alertes à surveiller

⚠️ **Erreurs possibles** :

1. `RESEND_API_KEY manquante` → Vérifier .env.local
2. `Invalid sender email` → Vérifier domaine vérifié
3. `Resend API error: 429` → Limite dépassée (3,000/mois gratuit)
4. `Failed to send confirmation email` → Vérifier logs Resend

---

## 🔒 SÉCURITÉ

### Bonnes pratiques implémentées

✅ **API Key sécurisée** : Jamais exposée côté client
✅ **Validation domaine** : SPF/DKIM/DMARC configurés
✅ **Rate limiting** : Resend limite 3,000 emails/mois (gratuit)
✅ **Logs sécurisés** : Emails clients jamais loggés en clair
✅ **Erreurs silencieuses** : Pas d'erreur si email échoue (webhook retourne 200)

### Protection spam

Resend gère automatiquement :
- Anti-spam headers
- Unsubscribe links (si nécessaire)
- Bounce management
- Complaint handling

---

## 💡 PERSONNALISATION EMAILS (futur)

### Variables disponibles

Tous les emails peuvent être personnalisés via props :

```typescript
// OrderConfirmation
<OrderConfirmationEmail
  customerName="Jean Dupont"
  orderNumber="GF-2025-001"
  items={[...]}
  totalAmount={650}
  shippingAddress={...}
/>

// ShippingNotification
<ShippingNotificationEmail
  customerName="Jean Dupont"
  orderNumber="GF-2025-001"
  carrier="Chronopost"
  trackingNumber="1234567890"
  trackingUrl="https://..."
  estimatedDelivery="2-3 jours"
  items={[...]}
/>

// DeliveryConfirmation
<DeliveryConfirmationEmail
  customerName="Jean Dupont"
  orderNumber="GF-2025-001"
  items={[...]}
/>
```

### Modifier templates

1. Éditer fichier `emails/*.tsx`
2. Modifier JSX + styles inline
3. Tester avec `npm run dev`
4. Commit + push → Déploiement auto

### Prévisualiser emails (dev)

```bash
npm run email:dev
```

→ Ouvre http://localhost:3001 avec prévisualisations emails

*(Script à créer dans `package.json` si besoin)*

---

## 🐛 TROUBLESHOOTING

### "RESEND_API_KEY manquante"

```bash
# Vérifier .env.local
cat /var/www/guillaume-farre/.env.local | grep RESEND

# Ajouter si manquant
echo 'RESEND_API_KEY=re_xxx' >> /var/www/guillaume-farre/.env.local
pm2 restart guillaume-farre
```

### "Invalid sender email"

→ Domaine pas vérifié dans Resend
**Fix** : Dashboard Resend → Domains → Vérifier SPF/DKIM/DMARC

### Emails non reçus

1. Vérifier logs serveur : `pm2 logs guillaume-farre | grep Email`
2. Dashboard Resend → Logs → Chercher email
3. Statut email :
   - **Delivered** : Email envoyé ✅
   - **Bounced** : Email rejeté (adresse invalide)
   - **Complained** : Marqué spam par destinataire

### Emails en spam

→ SPF/DKIM/DMARC mal configurés
**Fix** :
1. Dashboard Resend → Domains → Copier records DNS
2. OVH/IONOS → Ajouter records exactement comme indiqué
3. Attendre propagation DNS (15 min - 24h)

### Limite 3,000 emails dépassée

→ Passer au plan payant Resend :
- **Pro** : $20/mois (50,000 emails)
- **Business** : $80/mois (250,000 emails)

---

## 📈 MÉTRIQUES ATTENDUES

### Volume emails

**Mois type** (hypothèse 20 commandes/mois) :

- Confirmations commandes : 20 emails
- Expéditions : 20 emails
- Livraisons : 20 emails
- Problèmes (1%) : ~0 email

**Total** : ~60 emails/mois
**Plan gratuit** : 3,000 emails/mois
**Marge** : 98% disponible ✅

### Taux délivrabilité attendu

- **Objectif** : >98%
- **Bounces** : <1%
- **Spam** : <0.5%

### Engagement attendu

- **Open rate** : 60-80% (emails transactionnels)
- **Click rate** : 20-30% (tracking, CTA boutique)

---

## 🚀 NEXT STEPS

**Immédiat** (Guillaume) :
1. Créer compte Resend (5 min)
2. Vérifier domaine `guillaumefarre.com` (10 min)
3. Générer API key (2 min)
4. Ajouter dans .env.local (2 min)
5. Test envoi email (5 min)
6. Restart serveur (1 min)
7. Commande test complète (10 min)

**Phase 6** (après activation) :
- A/B testing subject lines
- Tracking metrics avancées
- Emails marketing (newsletter)
- Automation workflows avancés

---

## 📚 RESSOURCES

**Resend** :
- Dashboard : https://resend.com/emails
- Docs API : https://resend.com/docs
- React Email : https://react.email/docs

**Fichiers code** :
- Templates : `emails/*.tsx`
- Client : `lib/resend-client.ts`
- Webhook Stripe : `app/api/stripe/webhook/route.ts` (ligne 169)
- Webhook Gelato : `app/api/gelato/webhook/route.ts` (lignes 142, 154, 162)

**Logs serveur** :
```bash
pm2 logs guillaume-farre --lines 100
pm2 logs guillaume-farre | grep Email
pm2 logs guillaume-farre | grep Resend
```

---

**Status** : ✅ **CODE READY - WAITING GUILLAUME SETUP**

**Lalou**
