# 📱 Configuration Instagram - Publication Automatique

Ce guide vous explique comment configurer l'intégration Instagram pour publier automatiquement vos photos depuis l'interface admin.

## 🎯 Prérequis

1. Un compte **Instagram Business** ou **Instagram Creator**
2. Une page Facebook liée à votre compte Instagram
3. Un compte développeur Facebook/Meta

## 📋 Étapes de Configuration

### 1. Créer une App Facebook

1. Allez sur **[Facebook Developers](https://developers.facebook.com)**
2. Cliquez sur **"Mes Apps"** → **"Créer une app"**
3. Choisissez le type **"Business"**
4. Remplissez les informations :
   - Nom de l'app : "Guillaume Farré - Instagram Publisher"
   - Email de contact : votre email
   - Compte Business (optionnel)

### 2. Ajouter Instagram Graph API

1. Dans votre app, allez dans **"Produits"** (dans le menu latéral)
2. Recherchez **"Instagram"** et cliquez sur **"Configurer"**
3. Cela activera l'Instagram Graph API

### 3. Configurer les Permissions

1. Allez dans **"Autorisations et fonctionnalités"**
2. Demandez les permissions suivantes :
   - ✅ `instagram_basic`
   - ✅ `instagram_content_publish`
   - ✅ `pages_read_engagement`
   - ✅ `pages_show_list`

### 4. Obtenir votre Access Token

#### Option A : Via l'outil Graph API Explorer (Simple, mais token de courte durée)

1. Allez sur **[Graph API Explorer](https://developers.facebook.com/tools/explorer/)**
2. Sélectionnez votre app dans le menu déroulant
3. Cliquez sur **"Generate Access Token"**
4. Cochez les permissions : `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`
5. Copiez le token généré

**⚠️ Important** : Ce token expire après **1 heure**. Pour un usage en production, utilisez l'Option B.

#### Option B : Token Longue Durée (60 jours - Recommandé)

1. Obtenez d'abord un token de courte durée (Option A)
2. Utilisez l'API pour l'échanger contre un token longue durée :

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=VOTRE_APP_ID&client_secret=VOTRE_APP_SECRET&fb_exchange_token=VOTRE_SHORT_LIVED_TOKEN"
```

3. Le token longue durée sera retourné dans la réponse

**📚 Documentation complète** : [Long-Lived Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived)

### 5. Récupérer votre Instagram Account ID

1. Utilisez l'API Graph Explorer avec votre token
2. Exécutez la requête suivante :

```
GET /me/accounts?fields=instagram_business_account
```

3. Récupérez l'`instagram_business_account.id` de votre page Facebook

**Ou utilisez cette requête directe :**

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token=VOTRE_ACCESS_TOKEN"
```

### 6. Configurer les Variables d'Environnement

1. Ouvrez votre fichier `.env.local` (ou créez-le à la racine du projet)
2. Ajoutez ces deux lignes :

```env
INSTAGRAM_ACCESS_TOKEN=votre_access_token_ici
INSTAGRAM_ACCOUNT_ID=votre_instagram_account_id_ici
```

**Exemple :**

```env
INSTAGRAM_ACCESS_TOKEN=IGQVJYQ2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
INSTAGRAM_ACCOUNT_ID=17841234567890123
```

3. **Redémarrez le serveur Next.js** pour que les variables soient prises en compte

### 7. Vérifier la Configuration

1. Allez dans votre interface admin : `/fr/admin`
2. Recherchez la section **"📱 Connexion Instagram"**
3. Si tout est bien configuré, vous verrez :
   - ✅ **Connecté**
   - Votre nom d'utilisateur Instagram
   - Votre photo de profil

## 🚀 Utilisation

Une fois configuré, vous pouvez publier automatiquement sur Instagram :

1. Dans l'admin, cliquez sur **"📱 Générer post Instagram"** sur une photo
2. Le popup s'ouvre avec les suggestions optimisées
3. Cliquez sur **"📱 Publier sur Instagram"**
4. ✅ Votre photo est publiée instantanément sur votre compte !

## ⚠️ Limitations Instagram

- **Images uniquement** : Pas de support vidéo pour l'instant
- **Format** : L'image doit être accessible via une URL publique (HTTPS)
- **Ratio** : Instagram recommande 1:1 (carré) ou 4:5 (portrait)
- **Taille max** : 8 Mo
- **Rate limits** : Maximum 25 posts par jour

## 🔒 Sécurité

- **Ne commitez JAMAIS** votre `.env.local` dans Git
- Ajoutez `.env.local` dans votre `.gitignore`
- Renouvelez votre token régulièrement (tous les 60 jours pour les tokens longue durée)

## 🐛 Troubleshooting

### "Instagram non connecté"
- Vérifiez que `.env.local` contient les bonnes valeurs
- Redémarrez le serveur Next.js

### "Token invalide ou expiré"
- Générez un nouveau token sur Facebook Developers
- Mettez à jour `INSTAGRAM_ACCESS_TOKEN` dans `.env.local`
- Redémarrez le serveur

### "Erreur lors de la publication"
- Vérifiez que l'image est accessible publiquement (HTTPS)
- Vérifiez les permissions de votre app Facebook
- Vérifiez que votre compte Instagram est bien un compte Business/Creator

### "Configuration Instagram manquante"
- Les variables d'environnement ne sont pas chargées
- Vérifiez que le fichier s'appelle exactement `.env.local`
- Redémarrez le serveur avec `npm run dev`

## 📚 Ressources

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Content Publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [Facebook Developers](https://developers.facebook.com)

---

**Besoin d'aide ?** Consultez les logs du serveur pour plus de détails sur les erreurs.
