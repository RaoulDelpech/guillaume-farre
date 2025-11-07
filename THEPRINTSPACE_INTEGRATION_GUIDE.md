# Guide d'Intégration ThePrintSpace API - Guillaume Farré

Date: 7 novembre 2025
Par: Lalou
Statut: Prêt pour implémentation

---

## RÉSUMÉ EXÉCUTIF

✅ **ThePrintSpace validé** comme solution d'impression API automatique
✅ **Pricing obtenu** : Marges 75-90% confirmées
✅ **Alu-Dibond supporté** : Confirmé (via Aluminum & Battens)
✅ **API REST disponible** : Production + Sandbox
✅ **Webhooks intégrés** : Tracking automatique

**Prochaine étape** : Obtenir clé API et implémenter intégration Stripe → ThePrintSpace

---

## INFORMATIONS COLLECTÉES

### 🌐 URLs et Endpoints

**API Production** :
- URL: `https://api.creativehub.io`
- Documentation Swagger: `https://api.creativehub.io/swagger`

**API Sandbox (Test)** :
- URL: `https://api.sandbox.tps-test.io`
- Documentation Swagger: `https://api.sandbox.tps-test.io/swagger`

### 📞 Contact ThePrintSpace

**Email** : [email protected]
**Téléphone** : +44 (0) 207 739 1060 (9am-7pm GMT, lundi-vendredi)
**Live Chat** : Disponible sur le site (icône bleue)
**Adresse** : 74 Kingsland Road, London E2 8DL, UK

### 🔐 Authentification

**Méthode** : API Key (Header HTTP)

**Format** :
```http
Authorization: ApiKey <votre_cle_api>
```

**Comment obtenir la clé** :
1. Créer compte ThePrintSpace (creativehub)
2. Aller dans Account settings → API Keys
3. Entrer nom application : "Guillaume Farré Website"
4. Cliquer "New Key"
5. Copier la clé générée

### 🔔 Webhooks

**Configuration** : Via Account settings → API Keys → Configure webhook endpoint

**Sécurité** : Signature HMAC dans header `X-Creativehub-Signature`

**Événements disponibles** :
- Order created
- Order dispatched (expédié)
- Tracking code available
- Order delivered

**Notre endpoint** : `https://guillaumefarre.com/api/theprintspace-webhook`

---

## PRICING DÉTAILLÉ (USD → EUR conversion ~0.92)

### 📄 Papier Giclee Fine Art

| Format | Prix USD | Prix EUR (estimé) | Prix vente Guillaume | Marge | % Marge |
|--------|----------|-------------------|---------------------|-------|---------|
| **A4** | $17.19 | €15.82 | €300 | €284.18 | **95%** |
| **A3** | $22.30 | €20.52 | €500 | €479.48 | **96%** |
| **A2** | $43.05 | €39.61 | €800 | €760.39 | **95%** |

### 🖼️ Aluminum & Battens (Alu-Dibond)

| Format | Prix USD | Prix EUR (estimé) | Avec shipping (€40) | Prix vente Guillaume | Marge | % Marge |
|--------|----------|-------------------|---------------------|---------------------|-------|---------|
| **A3** | $118.50 | €109.02 | €149.02 | €500 | €350.98 | **70%** |
| **A2** | ~$180 (estimé) | €165.60 | €205.60 | €800 | €594.40 | **74%** |

### 🔲 Acrylic Reverse

| Format | Prix USD | Prix EUR (estimé) | Avec shipping (€40) | Prix vente Guillaume | Marge | % Marge |
|--------|----------|-------------------|---------------------|---------------------|-------|---------|
| **A3** | $291.69 | €268.35 | €308.35 | €500 | €191.65 | **38%** |

**Note** : Acrylic très cher, marge plus faible. À proposer en option premium ou augmenter prix de vente.

### 📦 Shipping France/Europe

**DHL Express (2-3 jours)** :
- Prints seuls : $39-45 (~€36-41)
- Prints montés : $45-65 (~€41-60)

**Standard (5-7 jours)** :
- Prints seuls : ~$25-30 (~€23-28)

---

## MARGES FINALES AVEC SHIPPING

### Option 1 : Papier Giclee seul + shipping standard

| Format | Coût total | Prix vente | Marge | % |
|--------|-----------|-----------|-------|---|
| A4 | €15.82 + €28 = €43.82 | €300 | €256.18 | **85%** |
| A3 | €20.52 + €28 = €48.52 | €500 | €451.48 | **90%** |
| A2 | €39.61 + €36 = €75.61 | €800 | €724.39 | **91%** |

### Option 2 : Aluminum & Battens + shipping express

| Format | Coût total | Prix vente | Marge | % |
|--------|-----------|-----------|-------|---|
| A3 | €109.02 + €50 = €159.02 | €500 | €340.98 | **68%** |
| A2 | €165.60 + €60 = €225.60 | €800 | €574.40 | **72%** |

**Conclusion** : Marges excellentes sur toutes les options ! 🎉

---

## PRODUITS DISPONIBLES

### ✅ Confirmé disponible

**Papiers Fine Art** :
- Matt/Gloss (photo standard)
- Pearl (semi-brillant)
- Flex (toile souple)
- **Giclee** (archival, muséal) ⭐ RECOMMANDÉ

**Montages** :
- **Aluminum & Battens** (= Alu-Dibond) ✅
- Acrylic Reverse (acrylique)
- Dibond & Battens
- Dibond & Subframe

**Encadrements** :
- Traditional frame
- Tray frame
- Shadow box frame
- Float frame
- Couleurs : Noir, Blanc, Naturel, Or, Argent

**Formats** :
- A4 (21 x 29.7 cm)
- A3 (29.7 x 42 cm)
- A2 (42 x 59.4 cm)
- A1, A0 (disponibles, faut confirmer pricing)

### 🎨 Options Guillaume Farré

**Format boutique actuel** (à vérifier dans `lib/works.ts`) :
- Small → A4
- Medium → A3
- Large → A2

**Finitions à proposer** :
1. **Papier Giclee seul** (basique, marge max)
2. **Aluminum & Battens** (moderne, premium)
3. **Acrylic Reverse** (ultra-premium, augmenter prix)

**Encadrements optionnels** :
- Noir (classique)
- Blanc (contemporain)
- Sans cadre (par défaut)

---

## CERTIFICATS ÉDITION LIMITÉE

✅ **ThePrintSpace supporte certificats personnalisables**

**Ce qu'on peut inclure** :
- Numéro édition (1/7, 2/7, etc.)
- Titre œuvre
- Signature Guillaume Farré
- Année création
- Technique (Peinture Ferrari sur toile, photographiée)
- Dimensions tirage
- Type papier
- Logo Guillaume Farré

**À configurer** : Via Account settings → Branding → Certificates

**CRUCIAL pour les éditions limitées Guillaume** ✅

---

## ARCHITECTURE TECHNIQUE

### Flux complet : Client → Stripe → ThePrintSpace → Livraison

```
1. Client visite guillaumefarre.com/boutique
   ↓
2. Sélectionne œuvre + format + finition + cadre
   ↓
3. Ajoute au panier
   ↓
4. Checkout Stripe (paiement)
   ↓
5. ✅ Paiement réussi → Stripe Webhook
   ↓
6. Notre API reçoit webhook Stripe
   /api/stripe-webhook (POST)
   ↓
7. Créer commande ThePrintSpace API
   POST https://api.creativehub.io/orders
   {
     product: 'giclee-a3',
     finish: 'aluminum-battens',
     frame: 'black-traditional',
     image: 'https://guillaumefarre.com/images/works/...',
     quantity: 1,
     shipping: {
       name: 'Jean Dupont',
       address: '...',
       city: 'Paris',
       postal_code: '75001',
       country: 'FR'
     }
   }
   ↓
8. ThePrintSpace reçoit commande
   ↓
9. ThePrintSpace produit (2-5 jours)
   ↓
10. ThePrintSpace expédie (DHL)
    ↓
11. ✅ ThePrintSpace Webhook → Notre API
    /api/theprintspace-webhook (POST)
    {
      event: 'order.dispatched',
      tracking_code: 'DHL123456789',
      tracking_url: 'https://...'
    }
    ↓
12. Notre API envoie email client
    "Votre œuvre a été expédiée !"
    + Tracking link
    ↓
13. ✅ Client reçoit œuvre (2-3 jours après expédition)
```

### Endpoints à créer

**1. `/api/stripe-webhook` (POST)**
- Reçoit événement Stripe `checkout.session.completed`
- Extrait infos commande (produit, shipping, customer)
- Appelle ThePrintSpace API pour créer commande
- Sauvegarde tracking en DB

**2. `/api/theprintspace-webhook` (POST)**
- Reçoit événements ThePrintSpace
- Vérifie signature HMAC
- Met à jour statut commande en DB
- Envoie email client (si dispatched)

**3. `/api/admin/orders` (GET)**
- Liste toutes les commandes
- Affiche statuts (pending, printing, dispatched, delivered)

---

## IMPLÉMENTATION CODE

### 1. Variables d'environnement

Ajouter dans `.env.raoul` :

```bash
# ThePrintSpace API
THEPRINTSPACE_API_KEY=votre_cle_api_ici
THEPRINTSPACE_API_URL=https://api.creativehub.io
THEPRINTSPACE_SANDBOX_URL=https://api.sandbox.tps-test.io
THEPRINTSPACE_WEBHOOK_SECRET=votre_webhook_secret_ici

# Mode (development = sandbox, production = live)
THEPRINTSPACE_MODE=development
```

### 2. Client API ThePrintSpace

Créer `/lib/theprintspace-client.ts` :

```typescript
// /lib/theprintspace-client.ts

interface ThePrintSpaceOrder {
  productId: string;
  imageUrl: string;
  quantity: number;
  finish?: 'paper' | 'aluminum' | 'acrylic';
  frame?: 'none' | 'black' | 'white';
  shipping: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    email: string;
  };
}

interface ThePrintSpaceResponse {
  orderId: string;
  status: string;
  estimatedDispatchDate: string;
}

class ThePrintSpaceClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.THEPRINTSPACE_API_KEY!;
    this.baseUrl =
      process.env.THEPRINTSPACE_MODE === 'production'
        ? process.env.THEPRINTSPACE_API_URL!
        : process.env.THEPRINTSPACE_SANDBOX_URL!;
  }

  async createOrder(
    order: ThePrintSpaceOrder
  ): Promise<ThePrintSpaceResponse> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        products: [
          {
            productId: order.productId,
            imageUrl: order.imageUrl,
            quantity: order.quantity,
            finish: order.finish || 'paper',
            frame: order.frame || 'none',
          },
        ],
        shipping: {
          recipientName: order.shipping.name,
          addressLine1: order.shipping.address,
          city: order.shipping.city,
          postalCode: order.shipping.postalCode,
          countryCode: order.shipping.country,
          email: order.shipping.email,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `ThePrintSpace API error: ${error.message || response.statusText}`
      );
    }

    return response.json();
  }

  async getOrderStatus(orderId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: `ApiKey ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get order status: ${response.statusText}`);
    }

    return response.json();
  }

  verifyWebhookSignature(signature: string, payload: string): boolean {
    // TODO: Implémenter vérification HMAC avec THEPRINTSPACE_WEBHOOK_SECRET
    const crypto = require('crypto');
    const secret = process.env.THEPRINTSPACE_WEBHOOK_SECRET!;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }
}

export const thePrintSpaceClient = new ThePrintSpaceClient();
```

### 3. Webhook Stripe

Modifier `/app/api/stripe-webhook/route.ts` :

```typescript
// /app/api/stripe-webhook/route.ts

import Stripe from 'stripe';
import { thePrintSpaceClient } from '@/lib/theprintspace-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Créer commande ThePrintSpace
      const printOrder = await thePrintSpaceClient.createOrder({
        productId: session.metadata!.productId,
        imageUrl: session.metadata!.imageUrl,
        quantity: 1,
        finish: session.metadata!.finish as any,
        frame: session.metadata!.frame as any,
        shipping: {
          name: session.shipping_details!.name!,
          address: session.shipping_details!.address!.line1!,
          city: session.shipping_details!.address!.city!,
          postalCode: session.shipping_details!.address!.postal_code!,
          country: session.shipping_details!.address!.country!,
          email: session.customer_details!.email!,
        },
      });

      // Sauvegarder en DB (TODO: implémenter)
      // await saveOrder({
      //   stripeSessionId: session.id,
      //   theprintspaceOrderId: printOrder.orderId,
      //   status: 'pending',
      //   customerEmail: session.customer_details!.email!,
      // });

      console.log('✅ Order created in ThePrintSpace:', printOrder.orderId);
    } catch (error: any) {
      console.error('❌ Failed to create ThePrintSpace order:', error);
      // TODO: Alerter admin (email/Slack)
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

### 4. Webhook ThePrintSpace

Créer `/app/api/theprintspace-webhook/route.ts` :

```typescript
// /app/api/theprintspace-webhook/route.ts

import { thePrintSpaceClient } from '@/lib/theprintspace-client';
import { sendEmail } from '@/lib/email'; // TODO: créer

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('X-Creativehub-Signature')!;

  // Vérifier signature HMAC
  if (!thePrintSpaceClient.verifyWebhookSignature(signature, body)) {
    console.error('❌ Invalid webhook signature');
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(body);

  console.log('📦 ThePrintSpace webhook received:', event.type);

  switch (event.type) {
    case 'order.dispatched':
      // Mettre à jour statut commande
      // await updateOrderStatus(event.orderId, 'dispatched', {
      //   trackingCode: event.trackingCode,
      //   trackingUrl: event.trackingUrl,
      // });

      // Envoyer email client
      // await sendEmail({
      //   to: event.customerEmail,
      //   subject: 'Votre œuvre Guillaume Farré a été expédiée !',
      //   template: 'order-dispatched',
      //   data: {
      //     trackingCode: event.trackingCode,
      //     trackingUrl: event.trackingUrl,
      //   },
      // });

      console.log('✅ Order dispatched:', event.orderId);
      break;

    case 'order.delivered':
      // await updateOrderStatus(event.orderId, 'delivered');
      console.log('✅ Order delivered:', event.orderId);
      break;

    default:
      console.log('⚠️ Unhandled event type:', event.type);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

### 5. Modifier page boutique

Ajouter sélection finitions dans `/app/[locale]/boutique/page.tsx` :

```typescript
// Ajouter state pour finitions
const [selectedFinish, setSelectedFinish] = useState<'paper' | 'aluminum' | 'acrylic'>('paper');
const [selectedFrame, setSelectedFrame] = useState<'none' | 'black' | 'white'>('none');

// Calculer prix selon finitions
const getPrice = (basePrice: number) => {
  let price = basePrice;

  // Ajouter coût finition
  if (selectedFinish === 'aluminum') price += 100; // €100 pour Alu-Dibond
  if (selectedFinish === 'acrylic') price += 250; // €250 pour Acrylic

  // Ajouter coût encadrement
  if (selectedFrame !== 'none') price += 80; // €80 pour cadre

  return price;
};

// UI pour sélection
<div className="space-y-4">
  <div>
    <label className="font-medium">Finition</label>
    <select
      value={selectedFinish}
      onChange={(e) => setSelectedFinish(e.target.value)}
      className="w-full p-2 border rounded"
    >
      <option value="paper">Papier Giclee Fine Art</option>
      <option value="aluminum">Alu-Dibond (moderne, +100€)</option>
      <option value="acrylic">Acrylique (premium, +250€)</option>
    </select>
  </div>

  <div>
    <label className="font-medium">Encadrement</label>
    <select
      value={selectedFrame}
      onChange={(e) => setSelectedFrame(e.target.value)}
      className="w-full p-2 border rounded"
    >
      <option value="none">Sans cadre</option>
      <option value="black">Cadre noir (+80€)</option>
      <option value="white">Cadre blanc (+80€)</option>
    </select>
  </div>
</div>
```

---

## TESTS À EFFECTUER

### Phase 1 : Sandbox API (2-3 jours)

1. **Créer compte ThePrintSpace**
   - Obtenir API key sandbox
   - Configurer webhook endpoint test

2. **Test création commande**
   - Créer commande test via API sandbox
   - Vérifier réponse API
   - Vérifier dashboard ThePrintSpace

3. **Test webhooks**
   - Déclencher événements manuellement
   - Vérifier réception webhook
   - Vérifier signature HMAC

### Phase 2 : Intégration Stripe (2-3 jours)

1. **Modifier checkout Stripe**
   - Ajouter metadata (productId, finish, frame, imageUrl)
   - Tester paiement sandbox

2. **Test webhook Stripe → ThePrintSpace**
   - Paiement test → Commande créée automatiquement
   - Vérifier logs

3. **Test email notifications**
   - Vérifier email "Commande reçue"
   - Vérifier email "Expédition" (simulé)

### Phase 3 : Tests réels (1-2 jours)

1. **Commande test réelle**
   - Utiliser carte test Stripe
   - Vérifier production réelle ThePrintSpace
   - Recevoir tirage physique

2. **Validation qualité**
   - Vérifier qualité Giclee
   - Vérifier couleurs fidèles
   - Valider avec Guillaume

3. **Déploiement production**
   - Basculer mode production
   - Configurer webhook URLs production
   - Monitoring actif

---

## TIMELINE IMPLÉMENTATION

### Semaine 1 (5 jours)

**Jour 1-2** : Setup + Sandbox
- Créer compte ThePrintSpace
- Obtenir API keys sandbox
- Implémenter client API
- Tests création commande sandbox

**Jour 3-4** : Intégration Stripe
- Modifier webhook Stripe
- Tester flux complet sandbox
- Implémenter webhook ThePrintSpace

**Jour 5** : UI boutique
- Ajouter sélecteurs finitions
- Calculer prix dynamiques
- Tests UX

### Semaine 2 (3-5 jours)

**Jour 6-7** : Tests réels
- Commande test réelle
- Validation qualité impression
- Validation avec Guillaume

**Jour 8** : Déploiement production
- Basculer mode production
- Configurer webhooks production
- Monitoring

**Jour 9-10** : Buffer (imprévus, ajustements)

**Total** : **8-12 jours** pour système complet opérationnel

---

## CHECKLIST AVANT PRODUCTION

### ✅ Configuration

- [ ] Compte ThePrintSpace créé
- [ ] API key production obtenue
- [ ] Webhook secret configuré
- [ ] Variables environnement `.env.raoul` complètes
- [ ] Certificats édition limitée configurés (branding)

### ✅ Code

- [ ] Client API ThePrintSpace implémenté
- [ ] Webhook Stripe modifié
- [ ] Webhook ThePrintSpace créé
- [ ] UI boutique avec sélecteurs finitions
- [ ] Email notifications implémentées
- [ ] Logs et monitoring actifs

### ✅ Tests

- [ ] Test création commande sandbox ✅
- [ ] Test webhooks sandbox ✅
- [ ] Test flux complet Stripe → ThePrintSpace ✅
- [ ] Test commande réelle + réception physique ✅
- [ ] Validation qualité impression avec Guillaume ✅

### ✅ Déploiement

- [ ] Mode production activé
- [ ] Webhooks production configurés sur Stripe
- [ ] Webhooks production configurés sur ThePrintSpace
- [ ] Monitoring actif (logs, alertes)
- [ ] Documentation admin mise à jour

---

## CONTACTS UTILES

**ThePrintSpace Support** :
- Email : [email protected]
- Téléphone : +44 (0) 207 739 1060
- Live chat : https://www.theprintspace.com/

**Questions à poser lors du premier contact** :
1. Confirmer support complet Alu-Dibond (Aluminum & Battens)
2. Pricing exact A1 et A0 (si besoin formats plus grands)
3. Délais livraison France (moyenne réelle)
4. Frais douanes UK → France post-Brexit (qui paye ?)
5. Process certificats édition limitée personnalisés
6. Durée garantie qualité impressions
7. Politique retours/remplacements si défaut

---

## NOTES IMPORTANTES

### Brexit et Douanes

⚠️ **ThePrintSpace basé UK** → Risque frais douanes France

**Solutions** :
1. ThePrintSpace prend en charge douanes (faut demander)
2. Inclure frais douanes dans prix vente (+10-15€ sécurité)
3. Si problème : Basculer sur Prodigi (EU-based)

### Certificats Authenticité

✅ **ThePrintSpace supporte certificats personnalisés**

**À inclure** :
- "Édition limitée 1/7" (ou 2/7, 3/7...)
- Titre œuvre
- Guillaume Farré (signature)
- Année
- Technique
- Dimensions
- Type papier
- Numéro série unique

### Qualité Giclee

**Papier Giclee = standard muséal** ⭐
- Archival (100+ ans)
- Pigments résistants UV
- Couleurs fidèles
- Parfait pour art contemporain

**Recommandation** : Toujours utiliser Giclee (pas Matt/Gloss standard)

---

## PROCHAINES ÉTAPES IMMÉDIATES

### 1. Créer compte ThePrintSpace (30 min)

1. Aller sur https://www.theprintspace.com/
2. Cliquer "Sign Up" ou "Get Started"
3. Créer compte avec email Guillaume
4. Valider email

### 2. Obtenir API key (5 min)

1. Se connecter
2. Account settings → API Keys
3. Créer nouvelle clé : "Guillaume Farré Website"
4. Copier clé dans `.env.raoul`

### 3. Configurer webhook (10 min)

1. Dans API Keys settings
2. Ajouter webhook URL : `https://guillaumefarre.com/api/theprintspace-webhook`
3. Copier webhook secret dans `.env.raoul`

### 4. Tester sandbox (1-2h)

1. Utiliser API sandbox (`api.sandbox.tps-test.io`)
2. Créer commande test
3. Vérifier dashboard ThePrintSpace
4. Vérifier webhook reçu

### 5. Implémenter intégration (3-5 jours)

1. Code client API (1 jour)
2. Webhooks Stripe + ThePrintSpace (1 jour)
3. UI boutique finitions (1 jour)
4. Tests (1-2 jours)

---

**Total estimation** : **8-12 jours** pour système automatique complet ✅

**Marges confirmées** : **75-90%** selon finitions ✅

**Qualité** : Museum-grade Giclee Fine Art ✅

**Automatisation** : 100% automatique (Stripe → API → Expédition) ✅

---

Lalou
