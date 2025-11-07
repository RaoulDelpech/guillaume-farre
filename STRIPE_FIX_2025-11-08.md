# Fix Stripe - 8 novembre 2025

**Problème rapporté** : "Stripe ne marche pas même en version de test"

---

## DIAGNOSTIC

### Configuration actuelle (.env.local)

```bash
STRIPE_SECRET_KEY=sk_live_51SOcU4EBNbSya4pr...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SOcU4EBNbSya4pr...
```

**Problème identifié** :
- ✅ Code Stripe correct (`app/api/stripe/checkout/route.ts`)
- ❌ **Clés LIVE utilisées en développement**
- ❌ Mode TEST non configuré

---

## POURQUOI ÇA NE MARCHE PAS

### Clés LIVE vs TEST

| Type | Préfixe | Utilisation | Activation requise |
|------|---------|-------------|-------------------|
| **TEST** | `sk_test_...` | Développement | ❌ Non (immédiat) |
| **LIVE** | `sk_live_...` | Production | ✅ Oui (vérification KYC) |

**En mode LIVE** :
- Stripe exige vérification identité (passeport, KBIS...)
- Peut prendre 1-7 jours
- Paiements réels, argent réel
- Frais Stripe prélevés

**En mode TEST** :
- Fonctionne immédiatement
- Cartes test Stripe (4242 4242 4242 4242)
- Pas de vrai argent
- Pas de frais

---

## SOLUTION

### Étape 1 : Obtenir clés TEST

1. Aller sur https://dashboard.stripe.com/test/apikeys
2. Copier les clés TEST :
   - **Publishable key** : `pk_test_...`
   - **Secret key** : `sk_test_...`

### Étape 2 : Créer .env.local.test

Créer fichier `.env.local.test` avec clés TEST :

```bash
# Configuration Stripe MODE TEST
# Pour développement uniquement

STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_TEST_ICI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_TEST_ICI

# URL du site (local pour développement)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Mot de passe admin
ADMIN_PASSWORD=GuillaumeFarre2025Secure!

# WhiteWall (mode test)
WHITEWALL_API_KEY=votre_cle_api_whitewall
WHITEWALL_PARTNER_ID=votre_id_partenaire_whitewall
WHITEWALL_API_URL=https://api.whitewall.com/v1
WHITEWALL_TEST_MODE=true
```

### Étape 3 : Utiliser .env.local.test

```bash
# En développement
cp .env.local.test .env.local
bun run dev
```

### Étape 4 : Tester avec carte test

Aller sur http://localhost:3000/fr/boutique

Ajouter photo au panier → Payer

**Carte test Stripe** :
- Numéro : `4242 4242 4242 4242`
- Date : N'importe quelle date future (ex: 12/34)
- CVC : N'importe quoi (ex: 123)
- ZIP : N'importe quoi (ex: 75001)

**Résultat attendu** :
- ✅ Paiement accepté
- ✅ Redirection vers `/panier?success=true`
- ✅ Commande visible dans Stripe Dashboard TEST

---

## ACTIVATION MODE LIVE (Pour production)

**Quand** : Après tests validés en mode TEST

**Étapes** :
1. Aller sur https://dashboard.stripe.com/account/onboarding
2. Fournir documents :
   - Passeport ou CNI Guillaume
   - KBIS entreprise (si auto-entrepreneur)
   - RIB bancaire
3. Attendre validation (1-7 jours)
4. Une fois activé : utiliser clés LIVE

**Fichier .env.local.prod (production)** :
```bash
# Configuration Stripe MODE LIVE
# Pour production uniquement

STRIPE_SECRET_KEY=sk_live_51SOcU4EBNbSya4pr...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SOcU4EBNbSya4pr...
NEXT_PUBLIC_SITE_URL=https://guillaumefarre.com
ADMIN_PASSWORD=GuillaumeFarre2025Secure!
```

---

## CODES DE TEST STRIPE

### Cartes bancaires

| Numéro | Résultat |
|--------|----------|
| `4242 4242 4242 4242` | ✅ Paiement accepté |
| `4000 0000 0000 0002` | ❌ Carte refusée |
| `4000 0000 0000 9995` | ❌ Fonds insuffisants |
| `4000 0025 0000 3155` | ⚠️ Authentification 3D Secure requise |

**Documentation complète** : https://stripe.com/docs/testing

---

## VÉRIFICATIONS RAPIDES

### Test 1 : Vérifier mode actuel

```bash
grep "STRIPE_SECRET_KEY" .env.local
```

Si affiche `sk_live_...` → Mode LIVE (erreur en dev)
Si affiche `sk_test_...` → Mode TEST (correct)

### Test 2 : Vérifier Dashboard Stripe

Mode TEST : https://dashboard.stripe.com/test/payments
Mode LIVE : https://dashboard.stripe.com/payments

### Test 3 : Console navigateur

Ouvrir console (F12) lors du paiement.

Si erreur :
```
Stripe: Invalid API Key provided
```
→ Clé incorrecte ou compte non activé

Si erreur :
```
Stripe: This account cannot currently make live charges
```
→ Compte LIVE pas encore activé (KYC requis)

---

## FICHIERS MODIFIÉS

**Aucun** - Le code Stripe est déjà correct.

Seule modification : utiliser clés TEST en `.env.local`

---

## PROCHAINES ÉTAPES

1. **Immédiat (5 min)** :
   - Récupérer clés TEST sur Stripe Dashboard
   - Créer `.env.local.test`
   - Copier vers `.env.local`
   - Tester avec carte 4242 4242 4242 4242

2. **Après validation tests (30 min)** :
   - Activer compte LIVE Stripe
   - Fournir documents KYC
   - Attendre validation

3. **Avant déploiement production** :
   - Vérifier compte LIVE activé
   - Utiliser `.env.local.prod` avec clés LIVE
   - Tester une vraie transaction 1€
   - Annuler immédiatement (remboursement)

---

## DOCUMENTATION

- **Stripe Dashboard** : https://dashboard.stripe.com/
- **Clés API TEST** : https://dashboard.stripe.com/test/apikeys
- **Clés API LIVE** : https://dashboard.stripe.com/apikeys
- **Cartes test** : https://stripe.com/docs/testing
- **Activation compte** : https://dashboard.stripe.com/account/onboarding
- **Webhooks** : https://dashboard.stripe.com/test/webhooks (TEST) ou /webhooks (LIVE)

---

**Créé par** : Lalou
**Date** : 8 novembre 2025, 00h35
**Statut** : ✅ Diagnostic terminé, fix prêt
