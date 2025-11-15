# Gelato - Intégration API d'Impression

**Fournisseur** : Gelato (https://www.gelato.com/)
**Service** : Impression Fine Art professionnelle
**Documentation** : https://developers.gelato.com/

---

## 📋 Vue d'ensemble

Gelato permet l'impression et la livraison automatique des photographies vendues sur le site.

**Avantages** :
- ✅ Production locale en France (livraison rapide)
- ✅ Fine Art Giclee 12 couleurs (qualité musée)
- ✅ Papier archival 200 gsm FSC-certified
- ✅ API REST complète + webhooks
- ✅ Gratuit (payé uniquement produits vendus)
- ✅ Marges estimées 88-93%

---

## 🚀 Configuration rapide

### 1. Créer un compte Gelato

1. Aller sur https://www.gelato.com/
2. Créer un compte professionnel
3. Activer l'accès API dans les paramètres

### 2. Obtenir la clé API

1. Se connecter au dashboard Gelato
2. Aller dans **Settings → API Keys**
3. Créer une nouvelle clé API
4. Copier la clé

### 3. Configurer l'environnement

Ajouter dans `.env.local` :

```bash
GELATO_API_KEY=your_api_key_here
GELATO_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_GELATO_ENABLED=true
```

### 4. Tester l'intégration

```bash
npm run test:gelato
```

---

## 💰 Tarification (estimations France 2025)

| Format | Prix Gelato | Prix vente | Marge |
|--------|-------------|------------|-------|
| A4 (21x29.7cm) | ~18€ | 150€ | 88% |
| A3 (29.7x42cm) | ~28€ | 250-500€ | 89-94% |
| A2 (42x59.4cm) | ~45€ | 400-800€ | 89-94% |
| A1 (59.4x84.1cm) | ~80€ | 1200€ | 93% |

**Note** : Prix indicatifs, vérifier sur le dashboard Gelato pour les tarifs exacts.

---

## 🔄 Flux de commande

```
1. Client achète photo sur site
   ↓
2. Webhook Stripe → Notre API
   ↓
3. Notre API → Gelato API (création commande)
   ↓
4. Gelato imprime et expédie
   ↓
5. Webhook Gelato → Notre API (tracking)
   ↓
6. Email client (confirmé + tracking)
```

---

## 📦 Livraison

**Pays supportés** :
- France, Belgique, Suisse, Luxembourg, Monaco
- Italie, Espagne, Allemagne, UK
- USA, Canada (délais plus longs)

**Délais estimés** :
- Production : 3-5 jours ouvrés
- Livraison France : 2-4 jours
- Livraison Europe : 4-7 jours
- Livraison internationale : 7-14 jours

---

<details>
<summary><strong>🔧 Configuration avancée (cliquez pour déplier)</strong></summary>

## Architecture technique

### Client Gelato API

Fichier : `lib/gelato-client.ts`

```typescript
import { GelatoOrder, GelatoProduct } from '@/types/gelato';

export class GelatoClient {
  private apiKey: string;
  private baseUrl = 'https://api.gelato.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createOrder(order: GelatoOrder): Promise<{ orderId: string }> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'X-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error(`Gelato API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getOrderStatus(orderId: string): Promise<GelatoOrder> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      headers: {
        'X-API-KEY': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Gelato API error: ${response.statusText}`);
    }

    return response.json();
  }
}
```

### Webhook Stripe → Gelato

Fichier : `app/api/webhooks/stripe/route.ts`

```typescript
import { GelatoClient } from '@/lib/gelato-client';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const gelato = new GelatoClient(process.env.GELATO_API_KEY!);

  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Créer commande Gelato
    const order = await gelato.createOrder({
      items: session.line_items.map(item => ({
        productUid: 'fine-art-print',
        fileUrl: item.description, // URL de la photo
        quantity: item.quantity,
        options: {
          size: item.price.metadata.format, // A3, A2, etc.
          material: 'fine-art-paper',
        },
      })),
      shippingAddress: session.shipping_details.address,
      recipientEmail: session.customer_email,
    });

    console.log('[Gelato] Commande créée:', order.orderId);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

### Types TypeScript

Fichier : `types/gelato.ts`

```typescript
export interface GelatoOrder {
  orderId?: string;
  items: GelatoItem[];
  shippingAddress: Address;
  recipientEmail: string;
  currency?: 'EUR';
}

export interface GelatoItem {
  productUid: string;
  fileUrl: string;
  quantity: number;
  options: {
    size: 'A4' | 'A3' | 'A2' | 'A1';
    material: 'fine-art-paper' | 'canvas' | 'alu-dibond';
  };
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}
```

</details>

---

<details>
<summary><strong>🐛 Dépannage (cliquez pour déplier)</strong></summary>

## Problèmes courants

### Erreur : "Invalid API key"

**Cause** : Clé API invalide ou expirée

**Solution** :
1. Vérifier que `GELATO_API_KEY` est bien dans `.env.local`
2. Regénérer une nouvelle clé dans le dashboard Gelato
3. Redémarrer le serveur après modification

### Erreur : "File URL not accessible"

**Cause** : Gelato ne peut pas accéder à l'URL de l'image

**Solution** :
1. Vérifier que l'image est accessible publiquement (HTTPS)
2. Vérifier que l'URL est complète et valide
3. Tester l'URL dans un navigateur

### Commande en attente ("pending")

**Cause** : Gelato traite la commande

**Solution** :
- Attendre 5-10 minutes
- Vérifier le statut dans le dashboard Gelato
- Contacter le support si > 24h

### Webhook Gelato non reçu

**Cause** : URL webhook mal configurée

**Solution** :
1. Vérifier l'URL dans le dashboard Gelato
2. URL doit être : `https://guillaumefarre.com/api/webhooks/gelato`
3. Vérifier que le endpoint renvoie 200 OK

</details>

---

<details>
<summary><strong>📊 Monitoring (cliquez pour déplier)</strong></summary>

## Dashboard Gelato

**Accès** : https://dashboard.gelato.com/

**Métriques à surveiller** :
- Nombre de commandes par mois
- Taux d'erreur (doit être < 1%)
- Délais de production moyens
- Coûts totaux vs marges

## Logs serveur

Fichier : `logs/gelato.log`

```bash
# Afficher dernières commandes
tail -f logs/gelato.log | grep "Commande créée"

# Afficher erreurs
tail -f logs/gelato.log | grep "ERROR"
```

## Notifications email

Configurer dans `.env.local` :

```bash
GELATO_NOTIFY_EMAIL=guillaume@example.com
GELATO_NOTIFY_ON_ERROR=true
```

</details>

---

<details>
<summary><strong>🧪 Tests (cliquez pour déplier)</strong></summary>

## Mode test Gelato

Utiliser l'API de test pour éviter les frais :

```bash
GELATO_API_URL=https://api.sandbox.gelato.com/v1
```

## Scripts de test

```bash
# Tester création commande
npm run test:gelato:order

# Tester webhook
npm run test:gelato:webhook

# Tester tous les endpoints
npm run test:gelato:all
```

## Exemple commande test

```typescript
const testOrder = {
  items: [{
    productUid: 'fine-art-print',
    fileUrl: 'https://guillaumefarre.com/images/works/test.jpg',
    quantity: 1,
    options: {
      size: 'A3',
      material: 'fine-art-paper',
    },
  }],
  shippingAddress: {
    line1: '123 Test Street',
    city: 'Paris',
    postalCode: '75001',
    country: 'FR',
  },
  recipientEmail: 'test@example.com',
};
```

</details>

---

## 📞 Support

**Documentation officielle** : https://developers.gelato.com/
**Support Gelato** : support@gelato.com
**Dashboard** : https://dashboard.gelato.com/

---

**Dernière mise à jour** : 2025-11-15
**Par** : Lalou
