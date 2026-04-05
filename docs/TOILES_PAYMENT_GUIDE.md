# Guide utilisateur : Paiement des toiles

Pour : Guillaume Farré
Par : Lalou
Date : 2025-04-06

---

## Comment ça marche ?

Tu as maintenant un système complet pour vendre tes toiles en ligne avec paiement Stripe Invoice.

---

## Étape 1 : Un client VIP réserve une toile

Le client accède à `/toiles` (page VIP secrète) et remplit le formulaire :
- Nom
- Email
- Téléphone
- Toile souhaitée (ex : "Klein d'oeil")
- Message optionnel

La réservation est sauvegardée avec le statut **"pending"** (en attente).

---

## Étape 2 : Tu reçois la réservation

Va sur : **[guillaumefarre.com/fr/admin/reservations](https://guillaumefarre.com/fr/admin/reservations)**

Tu verras la liste de toutes les réservations avec :
- Date de réservation
- Nom du client + email + téléphone
- Toile demandée (nom, dimensions, technique)
- Prix de la toile
- Statut (pending, invoiced, paid, etc.)

---

## Étape 3 : Tu envoies la facture Stripe

Pour une réservation **"pending"**, clique sur le bouton **"Envoyer facture"**.

Cela va :
1. Créer un client Stripe avec les infos du client
2. Créer une facture Stripe avec la toile et son prix
3. Envoyer la facture par email au client
4. Changer le statut de la réservation en **"invoiced"**

Le client reçoit un email Stripe avec un lien vers sa facture.

---

## Étape 4 : Le client paie

Le client clique sur le lien dans l'email et accède à la facture Stripe.

Il peut payer par :
- **Carte bancaire** (CB, Visa, Mastercard, Amex)
- **Prélèvement SEPA** (SEPA Direct Debit)
- **Virement bancaire européen** (EU bank transfer, IBAN français)

**Délai de paiement : 30 jours**

---

## Étape 5 : Confirmation automatique

Dès que le client paie :

1. **Le statut change automatiquement en "paid"**
2. **Une commande est créée** (numéro GF-XXXXXX)
3. **Le client reçoit un email de confirmation** avec :
   - Numéro de commande
   - Détails de la toile
   - Message de retrait à l'atelier
4. **Tu reçois un email de notification** à `contact@guillaumefarre.com`

---

## Interface admin

### URL : [guillaumefarre.com/fr/admin/reservations](https://guillaumefarre.com/fr/admin/reservations)

### Statuts des réservations :

| Statut | Couleur | Signification | Action disponible |
|--------|---------|---------------|-------------------|
| **pending** | 🟡 Jaune | En attente de facture | Bouton "Envoyer facture" |
| **invoiced** | 🔵 Bleu | Facture envoyée, paiement en attente | Bouton "Voir facture" |
| **paid** | 🟢 Vert | Payée | Bouton "Voir facture" + n° commande |
| **declined** | 🔴 Rouge | Refusée | (aucune action) |

---

## Exemple complet

### 1. Client réserve "Klein d'oeil" (20 000€)

```
Nom : Jean Dupont
Email : jean.dupont@example.com
Téléphone : 06 12 34 56 78
Toile : Klein d'oeil
```

### 2. Tu vas sur /admin/reservations

Tu vois :

```
Date        Client              Toile           Prix        Statut
-----------------------------------------------------------------------
06/04/2025  Jean Dupont         Klein d'oeil    20 000€     🟡 pending
            jean.dupont@...
            06 12 34 56 78
```

### 3. Tu cliques sur "Envoyer facture"

Le système crée la facture Stripe et l'envoie.

Statut devient : **🔵 invoiced**

### 4. Jean reçoit l'email Stripe

```
Sujet : Facture de Guillaume Farré

Bonjour Jean Dupont,

Vous avez une nouvelle facture de 20 000€ à payer.

[Voir et payer la facture]

Date limite : 06/05/2025 (30 jours)
```

### 5. Jean paie par carte bancaire

### 6. Automatique :

- Statut → **🟢 paid**
- Commande créée : **GF-123456**
- Email confirmation → Jean
- Email notification → toi

---

## Sécurité

- **Accès admin protégé** : seul toi peux accéder à `/admin/reservations` (cookie `gf_auth`)
- **Paiements sécurisés** : géré entièrement par Stripe (PCI-DSS compliant)
- **Webhooks vérifiés** : signature Stripe validée avant traitement

---

## Que faire après paiement ?

1. **Contacter le client** pour organiser le retrait à l'atelier
2. **Préparer la toile** (emballage si besoin)
3. **Remettre un certificat d'authenticité** (optionnel, à imprimer)

---

## Questions fréquentes

### Que se passe-t-il si le client ne paie pas dans les 30 jours ?

La facture Stripe expire automatiquement. Le statut reste **"invoiced"**. Tu peux :
- Relancer le client manuellement
- Créer une nouvelle facture
- Décliner la réservation

### Puis-je annuler une facture ?

Oui, directement depuis le dashboard Stripe :
1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Invoices → Recherche la facture
3. Clique sur "Void invoice" (annuler)

### Puis-je modifier le prix d'une toile ?

Oui, mais il faut modifier le fichier `data/toiles.json` :

```json
{
  "id": 1,
  "name": "Klein d'oeil",
  "price": 20000  // ← Modifier ici
}
```

Puis redéployer le site.

### Puis-je voir toutes les factures ?

Oui, sur le dashboard Stripe : [dashboard.stripe.com/invoices](https://dashboard.stripe.com/invoices)

---

## Fichiers importants

- **data/reservations.json** : Toutes les réservations
- **data/toiles.json** : Liste des toiles et prix
- **data/orders.json** : Toutes les commandes (photos + toiles)

---

## Support

Pour toute question technique, contacte Lalou.

---

Bon courage avec tes ventes de toiles ! 🎨

Lalou
