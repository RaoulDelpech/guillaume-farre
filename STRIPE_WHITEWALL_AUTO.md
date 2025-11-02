# 🚀 Système Automatique Stripe + WhiteWall

## 🎯 Objectif

**Automatisation 100% du processus de vente de tirages photographiques :**

1. Client choisit photo + format + matériau + cadre
2. Client paie via Stripe
3. **Automatiquement** : commande envoyée à WhiteWall
4. WhiteWall imprime et expédie directement au client
5. Tu ne fais **RIEN** - tout est automatique !

---

## ✨ Formats Disponibles

### Formats Classiques
- **A4** (21 × 29.7 cm) - 150€
- **A3** (29.7 × 42 cm) - 250€
- **A2** (42 × 59.4 cm) - 400€
- **A1** (59.4 × 84.1 cm) - 650€
- **A0** (84.1 × 118.9 cm) - 950€

### Formats XXL - Grand Format
- **100 × 70 cm** - 1 200€
- **120 × 80 cm** - 1 500€
- **150 × 100 cm** - 2 200€

### Formats XXXXXXXL - Très Grand Format (Plusieurs mètres!)
- **200 × 133 cm** (2 mètres) - 3 500€
- **250 × 167 cm** (2.5 mètres) - 4 800€
- **300 × 200 cm** (3 mètres) - 6 500€

### Matériaux Disponibles
- **Papier Fine Art** ⭐ (recommandé) - Base
- **Alu-Dibond** - +30%
- **Acrylique** - +50%
- **Canvas (Toile)** - +20%

### Encadrement (Optionnel)
- Bois noir - +80€
- Bois blanc - +80€
- Aluminium brossé - +120€

---

## 📋 Configuration Complète - Étape par Étape

### ÉTAPE 1 : Configuration Stripe

#### 1.1 - Créer le compte Stripe

1. Va sur https://dashboard.stripe.com
2. Créé un compte Stripe (ou connecte-toi)
3. Active ton compte en mode production

#### 1.2 - Récupérer les clés API

1. Va dans **Développeurs** → **Clés API**
2. Copie :
   - **Clé publique** : `pk_live_...`
   - **Clé secrète** : `sk_live_...`

#### 1.3 - Configurer le Webhook Stripe

**TRÈS IMPORTANT** : C'est ce qui envoie automatiquement à WhiteWall !

1. Va dans **Développeurs** → **Webhooks**
2. Clique sur **Ajouter un point de terminaison**
3. URL du webhook : `https://guillaumefarre.com/api/webhooks/stripe`
4. Événements à écouter : Sélectionne **checkout.session.completed**
5. Clique sur **Ajouter un point de terminaison**
6. Copie le **Secret de signature du webhook** : `whsec_...`

---

### ÉTAPE 2 : Configuration WhiteWall

#### 2.1 - Créer le compte partenaire WhiteWall

1. Va sur https://www.whitewall.com/fr/partners
2. Remplis le formulaire de demande de partenariat
3. Indique :
   - Activité : Photographe professionnel / Galerie en ligne
   - Volume prévu : 20-50 tirages/mois
   - Site web : guillaumefarre.com

#### 2.2 - Demander l'accès API

**IMPORTANT** : Envoie un email à **partners@whitewall.com** :

```
Objet : Demande d'accès API pour boutique en ligne

Bonjour,

Je suis photographe professionnel (guillaumefarre.com) et je souhaiterais
intégrer votre service d'impression via API pour ma boutique en ligne.

Pouvez-vous m'envoyer :
- Clé API (WHITEWALL_API_KEY)
- ID Partenaire (WHITEWALL_PARTNER_ID)
- Documentation API

Cordialement,
Guillaume Farré
guillaumefarre.com
```

#### 2.3 - Recevoir les identifiants API

Tu vas recevoir :
- `WHITEWALL_API_KEY` : ta clé API
- `WHITEWALL_PARTNER_ID` : ton ID partenaire

---

### ÉTAPE 3 : Configurer les Variables d'Environnement

#### 3.1 - Sur ton ordinateur (développement)

Crée le fichier `.env.local` :

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_ICI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_ICI
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_ICI

# WhiteWall
WHITEWALL_API_KEY=votre_cle_api_whitewall
WHITEWALL_PARTNER_ID=votre_id_partenaire
WHITEWALL_API_URL=https://api.whitewall.com/v1
WHITEWALL_TEST_MODE=false

# Site
NEXT_PUBLIC_SITE_URL=https://guillaumefarre.com
ADMIN_PASSWORD=votre_mot_de_passe
```

#### 3.2 - Sur GitHub (production)

Ajoute les **GitHub Secrets** :

1. Va sur https://github.com/RaoulDelpech/guillaume-farre/settings/secrets/actions
2. Clique sur **New repository secret**
3. Ajoute chaque secret :

| Nom | Valeur |
|-----|--------|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `WHITEWALL_API_KEY` | Ta clé WhiteWall |
| `WHITEWALL_PARTNER_ID` | Ton ID WhiteWall |

---

### ÉTAPE 4 : Tester le Système

#### 4.1 - Test en local

```bash
# Démarre le serveur
npm run dev

# Va sur http://localhost:3000/fr/boutique
# Choisis une photo
# Configure : format + matériau + cadre
# Clique "Ajouter au panier"
# Vérifie que le prix se calcule bien
```

#### 4.2 - Test Stripe (mode test)

1. Utilise les clés de test de Stripe (`sk_test_...`)
2. Numéro de carte test : `4242 4242 4242 4242`
3. Date : n'importe quelle date future
4. CVC : n'importe quel 3 chiffres

#### 4.3 - Test WhiteWall (mode test)

1. Configure `WHITEWALL_TEST_MODE=true`
2. Les commandes seront marquées comme "test"
3. Pas de vraie production ni facturation

---

## 🔄 Comment ça Fonctionne

### Processus Automatique

```
┌─────────────────┐
│   CLIENT        │
│  Choisit photo  │
│  + format       │
│  + matériau     │
│  + cadre        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  BOUTIQUE       │
│  Calcule prix   │
│  Affiche total  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  STRIPE         │
│  Paiement       │
│  sécurisé       │
└────────┬────────┘
         │ Paiement réussi
         ▼
┌─────────────────┐
│  WEBHOOK        │
│  Reçoit notif   │
│  Stripe         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WHITEWALL API  │
│  Crée commande  │
│  automatique    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WHITEWALL      │
│  Imprime        │
│  + Expédie      │
│  directement    │
│  au client      │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  CLIENT         │
│  Reçoit son     │
│  tirage à       │
│  domicile       │
└─────────────────┘

TU NE FAIS RIEN ! ✨
```

---

## 💰 Modèle Économique

### Exemple de Prix Final Client

**Photo A3 - Papier Fine Art - Cadre bois noir**

- Format A3 : 250€
- Matériau Fine Art : x1.0 = 250€
- Cadre bois noir : +80€
- **Total client** : **330€**

### Coût WhiteWall (estimé)

- Impression A3 Fine Art : ~80€
- Cadre bois : ~40€
- Expédition : ~15€
- **Total WhiteWall** : ~135€

### Ta Marge

- Prix client : 330€
- Coût WhiteWall : -135€
- Frais Stripe (1.4% + 0.25€) : -5€
- **Marge nette** : **~190€** (58%)

---

## 📊 Dashboard & Suivi

### Stripe Dashboard

- https://dashboard.stripe.com
- Vois toutes les ventes en temps réel
- Télécharge les rapports
- Gère les remboursements

### WhiteWall Dashboard

- https://www.whitewall.com/partner-portal
- Vois toutes les commandes en cours
- Tracking de production
- Numéros de suivi

---

## ⚠️ Points d'Attention

### Fichiers Haute Résolution

WhiteWall exige :
- **Résolution minimale** : 300 DPI
- **Format** : JPEG, PNG ou TIFF
- **Profil colorimétrique** : Adobe RGB ou sRGB

Pour formats XXL (2-3 mètres) :
- Fichier de **100+ MB** recommandé
- Vérifier que tes photos d'origine sont haute résolution

### Délais

- **Production** : 3-5 jours ouvrés
- **Livraison France** : 2-4 jours
- **Livraison International** : 5-7 jours
- **Total** : ~7-12 jours

**Informe toujours le client des délais !**

### Politique de Retour

- Retour possible sous 14 jours
- Frais de retour à la charge du client (sauf défaut)
- Remboursement intégral si problème qualité WhiteWall

---

## 🚨 Que Faire en Cas de Problème

### Le webhook Stripe ne se déclenche pas

1. Vérifie que `STRIPE_WEBHOOK_SECRET` est configuré
2. Teste le webhook dans Stripe Dashboard
3. Vérifie les logs sur le serveur :
   ```bash
   ssh root@87.106.40.44
   pm2 logs guillaumefarre
   ```

### La commande WhiteWall échoue

1. Vérifie que les clés API WhiteWall sont correctes
2. Vérifie que `WHITEWALL_TEST_MODE=false` en production
3. Contacte WhiteWall : api-support@whitewall.com

### Le client n'a pas reçu sa commande

1. Vérifie le statut dans WhiteWall Dashboard
2. Récupère le numéro de suivi
3. Contacte le support WhiteWall

---

## ✅ Checklist de Lancement

Avant d'activer en production :

- [ ] Compte Stripe activé en mode production
- [ ] Clés Stripe configurées (secret + publique + webhook)
- [ ] Webhook Stripe créé et testé
- [ ] Compte partenaire WhiteWall activé
- [ ] Clés API WhiteWall reçues et configurées
- [ ] Test de commande effectué en mode test
- [ ] Prix vérifiés et validés
- [ ] CGV mises à jour (délais, retours, etc.)
- [ ] Email de confirmation personnalisé
- [ ] Page boutique testée sur mobile + desktop

---

## 📞 Contacts Utiles

### Stripe
- **Support** : https://support.stripe.com
- **Email** : support@stripe.com

### WhiteWall
- **Partners** : partners@whitewall.com
- **API Support** : api-support@whitewall.com
- **Téléphone** : +49 2236 398 130

---

## 🎨 Recommandations Artistiques

Pour Guillaume Farré :

1. **Série "L'Atelier"** → Alu-Dibond (effet moderne, contrastes)
2. **Série "Empreintes"** → Papier Fine Art (conservation, authenticité)
3. **Série "Projection"** → Acrylique (effet galerie premium)

**Formats recommandés** :
- A3 / A2 pour vente standard
- A0 / XXL pour collectionneurs
- MEGA (2-3m) pour galeries / entreprises

---

**🚀 Une fois tout configuré, le système est 100% AUTOMATIQUE !**

**Tu n'as plus qu'à encaisser les paiements. 💰**
