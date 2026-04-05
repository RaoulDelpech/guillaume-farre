# Système de paiement Stripe Invoice pour les toiles

Mis en place le : 2025-04-06
Par : Lalou

---

## Vue d'ensemble

Les toiles de Guillaume Farré (2500-20000€) ne sont pas vendues directement en ligne comme les photos. Le processus est le suivant :

1. **Réservation** : Le visiteur VIP remplit le formulaire sur `/toiles` (nom, email, téléphone, toile souhaitée)
2. **Validation admin** : Guillaume reçoit la réservation dans `/admin/reservations`
3. **Envoi facture** : Guillaume clique sur "Envoyer facture" → création facture Stripe Invoice
4. **Paiement client** : Le client reçoit un email avec un lien vers la facture Stripe (30 jours pour payer)
5. **Confirmation** : Quand le client paie, webhook `invoice.paid` → création commande + emails

---

## Architecture

### 1. Route API `/api/admin/invoices`

**POST** — Créer et envoyer une facture Stripe Invoice

- Input : `{ reservationId: string }`
- Protection : `requireAdminAuth()` (cookie `gf_auth`)
- Process :
  1. Lire la réservation depuis `data/reservations.json`
  2. Lire la toile correspondante depuis `data/toiles.json`
  3. Créer un Customer Stripe (nom, email, téléphone)
  4. Créer une Invoice Stripe avec :
     - Line item : nom toile, prix (en centimes)
     - Métadonnées : reservationId, canvasTitle, dimensions, technique, année
     - `collection_method: 'send_invoice'`
     - `days_until_due: 30`
     - Payment methods : card, sepa_debit, customer_balance (virement SEPA FR)
  5. Finaliser l'invoice (`finalizeInvoice`)
  6. Envoyer l'invoice par email (`sendInvoice`)
  7. Mettre à jour la réservation : `status = 'invoiced'`, + champs Stripe
  8. Retourner `{ success: true, invoiceUrl, invoiceId }`

**GET** — Lister toutes les réservations (admin only)

- Retourne `{ reservations: Reservation[] }` enrichi avec les infos toile

---

### 2. Webhook `invoice.paid`

Handler ajouté dans `/app/api/stripe/webhook/route.ts`

**Process** :
1. Vérifier `metadata.reservationId` (facture toile ou autre ?)
2. Lire la réservation depuis `data/reservations.json`
3. Mettre à jour réservation : `status = 'paid'`, `paidAt`
4. Créer une commande avec `lib/orders.ts` (type: 'canvas')
5. Mettre à jour réservation avec `orderNumber`
6. Envoyer email confirmation au client (`sendOrderConfirmationEmail`)
7. Envoyer email notification à Guillaume (`contact@guillaumefarre.com`)

---

### 3. Page admin `/admin/reservations`

Interface de gestion des réservations de toiles.

**Fonctionnalités** :
- Liste toutes les réservations avec :
  - Date
  - Client (nom, email, téléphone)
  - Toile (nom, dimensions, technique)
  - Prix
  - Statut (pending, invoiced, paid, declined)
  - Actions :
    - `pending` → Bouton "Envoyer facture"
    - `invoiced` → Bouton "Voir facture" (lien Stripe)
    - `paid` → Bouton "Voir facture" + numéro commande

**Statuts** :
- `pending` (jaune) : Réservation en attente
- `invoiced` (bleu) : Facture envoyée, paiement en attente
- `paid` (vert) : Payé
- `declined` (rouge) : Refusé
- `confirmed` (violet) : Confirmé manuellement (futur)

---

## Types de données

### Reservation

```typescript
interface Reservation {
  id: string;
  canvasTitle: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'declined' | 'invoiced' | 'paid';
  stripeInvoiceId?: string;        // ID invoice Stripe
  stripeInvoiceUrl?: string;       // URL facture hébergée
  stripeCustomerId?: string;       // ID customer Stripe
  paidAt?: string;                 // Date paiement
  orderNumber?: string;            // Numéro commande (GF-XXXXXX)
}
```

### Toile

```typescript
interface Toile {
  id: number;
  name: string;
  dimensions: string;
  technique: string;
  year: number;
  price: number;
  image?: string;
  triptych?: boolean;
  images?: string[];
}
```

### Order (type canvas)

```typescript
interface Order {
  orderNumber: string;
  stripeSessionId: string;  // Invoice ID pour toiles
  customerEmail: string;
  customerName: string;
  type: 'photo' | 'canvas'; // 'canvas' pour toiles
  items: {
    title: string;
    format: string;           // Dimensions pour toiles
    frame: string;            // 'Toile originale' pour toiles
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'problem';
  createdAt: string;
  paidAt?: string;
  // ... autres champs (tracking, etc.)
}
```

---

## Fichiers modifiés

1. **app/api/admin/invoices/route.ts** (nouveau)
   - POST : créer facture
   - GET : lister réservations

2. **app/api/stripe/webhook/route.ts**
   - Ajout case `invoice.paid`
   - Fonction `processCanvasInvoicePaid()`

3. **app/[locale]/admin/reservations/page.tsx** (nouveau)
   - Interface admin gestion réservations

4. **app/api/reservations/route.ts**
   - Mise à jour type `Reservation` (nouveaux champs)

5. **lib/orders.ts**
   - Mise à jour type `Order` (champ `type: 'photo' | 'canvas'`)

---

## Moyens de paiement

Stripe Invoice supporte :
- **Carte bancaire** (CB, Visa, Mastercard, Amex)
- **SEPA Direct Debit** (prélèvement SEPA)
- **Virement bancaire EU** (EU bank transfer)

Configuration dans `payment_settings` :
```typescript
payment_settings: {
  payment_method_types: ['card', 'sepa_debit', 'customer_balance'],
  payment_method_options: {
    customer_balance: {
      bank_transfer: {
        type: 'eu_bank_transfer',
        eu_bank_transfer: { country: 'FR' }
      },
      funding_type: 'bank_transfer'
    }
  }
}
```

---

## Délai de paiement

**30 jours** après réception de la facture.

Configuré via : `days_until_due: 30`

---

## Emails

### 1. Email facture (Stripe)

Envoyé automatiquement par Stripe après `sendInvoice()`.

Contient :
- Lien vers facture hébergée (`hosted_invoice_url`)
- Montant total
- Date limite paiement
- Moyens de paiement disponibles

### 2. Email confirmation paiement (notre système)

Envoyé par `sendOrderConfirmationEmail()` après `invoice.paid`.

Contient :
- Numéro commande (GF-XXXXXX)
- Détails toile
- Montant payé
- Message retrait atelier

### 3. Email notification Guillaume

Email simple à `contact@guillaumefarre.com` pour l'informer du paiement.

---

## Tests

### Test création facture

1. Créer une réservation VIP sur `/toiles`
2. Se connecter à `/admin/reservations`
3. Cliquer sur "Envoyer facture"
4. Vérifier :
   - Statut passe à "invoiced"
   - URL facture apparaît
   - Email reçu (vérifier inbox Stripe test)

### Test paiement facture

1. Ouvrir l'URL de la facture
2. Payer avec carte test Stripe : `4242 4242 4242 4242`
3. Vérifier :
   - Webhook `invoice.paid` reçu
   - Statut réservation passe à "paid"
   - Commande créée (GF-XXXXXX)
   - Email confirmation reçu

---

## Variables d'environnement requises

```bash
# Stripe (déjà configuré)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (emails, déjà configuré)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Guillaume Farré <noreply@guillaumefarre.com>
```

---

## Prochaines étapes (optionnel)

1. **Relances automatiques** : Stripe peut envoyer des relances avant la date limite
2. **Annulation facture** : Bouton admin pour annuler une facture impayée
3. **Paiements partiels** : Autoriser le paiement en plusieurs fois
4. **Export comptable** : Export factures payées pour Pennylane/comptable

---

Documenté par : Lalou
Date : 2025-04-06
