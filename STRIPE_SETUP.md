# Configuration Stripe - Guide Complet

## 🎯 Objectif

Ce guide vous aide à configurer Stripe pour accepter les paiements sur le site Guillaume Farré.

## 📋 Prérequis

- Un compte Stripe (gratuit)
- Les clés API Stripe (test et production)

## 1️⃣ Créer un compte Stripe

1. Allez sur [https://stripe.com](https://stripe.com)
2. Cliquez sur **"Créer un compte"**
3. Remplissez les informations :
   - Email
   - Nom de votre entreprise : **"Guillaume Farré Art"**
   - Pays : **France**
4. Validez votre email

## 2️⃣ Récupérer vos clés API

### Mode Test (pour développement)

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. En haut à droite, assurez-vous que le toggle **"Mode test"** est activé
3. Allez dans **"Développeurs" → "Clés API"**
4. Vous verrez deux clés :
   - **Clé publiable** : commence par `pk_test_...`
   - **Clé secrète** : commence par `sk_test_...` (cliquez sur "Révéler la clé test")

### Mode Production (pour le site en ligne)

1. Désactivez le **"Mode test"** en haut à droite
2. Allez dans **"Développeurs" → "Clés API"**
3. Vous verrez deux clés :
   - **Clé publiable** : commence par `pk_live_...`
   - **Clé secrète** : commence par `sk_live_...`

⚠️ **IMPORTANT** : Avant d'utiliser les clés de production, vous devez :
- Activer votre compte Stripe
- Fournir vos informations bancaires
- Compléter les vérifications requises

## 3️⃣ Configurer le fichier .env.local

Le fichier `.env.local` a déjà été créé à la racine du projet. Vous devez maintenant le remplir avec vos clés :

```bash
# Ouvrez le fichier .env.local et remplacez les valeurs suivantes :

# Pour le développement (Mode Test)
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_TEST
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE_TEST

# Pour la production (Mode Live)
# STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_PRODUCTION
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLIQUE_PRODUCTION

# URL du site
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # En développement
# NEXT_PUBLIC_SITE_URL=https://guillaumefarre.com  # En production

# Mot de passe admin
ADMIN_PASSWORD=votre_mot_de_passe_securise_ici
```

## 4️⃣ Tester Stripe en local

1. Redémarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Allez sur la page boutique : [http://localhost:3000/fr/boutique](http://localhost:3000/fr/boutique)

3. Ajoutez une œuvre au panier

4. Procédez au paiement

5. Utilisez une **carte de test Stripe** :
   - Numéro : `4242 4242 4242 4242`
   - Date d'expiration : n'importe quelle date future (ex: `12/34`)
   - CVC : n'importe quel code 3 chiffres (ex: `123`)
   - Code postal : n'importe lequel

6. Si tout fonctionne, vous serez redirigé vers la page de confirmation !

## 5️⃣ Configurer les Webhooks (optionnel mais recommandé)

Les webhooks permettent à Stripe de notifier votre site lorsqu'un paiement est effectué.

1. Dans le Dashboard Stripe, allez dans **"Développeurs" → "Webhooks"**
2. Cliquez sur **"Ajouter un endpoint"**
3. URL du endpoint :
   - Mode test : `http://localhost:3000/api/stripe/webhook`
   - Mode production : `https://guillaumefarre.com/api/stripe/webhook`
4. Sélectionnez les événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiez le **"Signing secret"** (commence par `whsec_...`)
6. Ajoutez-le dans `.env.local` :
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_WEBHOOK
   ```

## 6️⃣ Passer en production

Quand vous êtes prêt à accepter de vrais paiements :

1. Activez votre compte Stripe (fournissez les infos bancaires, etc.)
2. Dans `.env.local`, remplacez les clés test par les clés de production
3. Changez `NEXT_PUBLIC_SITE_URL` pour pointer vers votre domaine de production
4. Redéployez votre site

## 🔒 Sécurité

- ⚠️ **JAMAIS** commiter le fichier `.env.local` sur Git
- ⚠️ Le fichier `.env.local` est déjà dans `.gitignore`
- ⚠️ Ne partagez JAMAIS vos clés secrètes Stripe
- ⚠️ Utilisez toujours les clés de test en développement

## 📊 Fonctionnalités actuelles

Le système Stripe intégré permet :

✅ Paiements par carte bancaire
✅ Paiements internationaux (EUR)
✅ Collecte des adresses de livraison
✅ Support multilingue (FR/EN/IT)
✅ Redirection automatique après paiement
✅ Gestion des erreurs

## 🆘 Problèmes courants

### "Stripe is not defined"
→ Vérifiez que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` est bien défini dans `.env.local`

### "Invalid API Key"
→ Vérifiez que vous avez copié la bonne clé (test vs production)

### "Webhook signature verification failed"
→ Vérifiez que `STRIPE_WEBHOOK_SECRET` correspond au secret du webhook configuré

### Le paiement ne se déclenche pas
→ Vérifiez que le serveur est bien redémarré après modification de `.env.local`

## 📚 Ressources

- [Documentation Stripe officielle](https://stripe.com/docs)
- [Guide Stripe pour Next.js](https://stripe.com/docs/checkout/quickstart?lang=node)
- [Cartes de test Stripe](https://stripe.com/docs/testing)
- [Dashboard Stripe](https://dashboard.stripe.com)

## ✅ Checklist finale

- [ ] Compte Stripe créé
- [ ] Clés API récupérées
- [ ] Fichier `.env.local` configuré
- [ ] Test de paiement réussi en mode test
- [ ] Webhooks configurés (optionnel)
- [ ] Compte Stripe activé pour la production (quand prêt)
- [ ] Clés de production configurées (quand prêt)

---

**Besoin d'aide ?** Contactez le support Stripe ou consultez la documentation.
