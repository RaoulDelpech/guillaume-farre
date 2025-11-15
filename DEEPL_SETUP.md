# Configuration DeepL API - Traductions Professionnelles

**Temps requis**: 5 minutes  
**Coût**: GRATUIT (500 000 caractères/mois)  
**Usage estimé**: ~4000 caractères (< 1% du quota)

**Mis à jour**: 2025-11-15  
**Par**: Lalou

---

## Pourquoi DeepL ?

DeepL est le meilleur service de traduction automatique pour:
- ✅ **Qualité supérieure** à Google Translate (surtout FR→EN/IT)
- ✅ **Préserve le ton artistique** des textes
- ✅ **API gratuite** jusqu'à 500k caractères/mois
- ✅ **Traductions professionnelles** utilisées par entreprises Fortune 500

**Problème actuel du site**:
- `messages/en.json` et `messages/it.json` incomplets (manque section `dino`)
- Traductions faites à la main (qualité variable)
- ~43 lignes manquantes par langue

---

## Étapes d'inscription

### 1. Créer un compte gratuit

Accédez à: https://www.deepl.com/pro-api

Cliquez sur **"Sign up for free"**

Remplissez:
- Email professionnel
- Mot de passe
- Prénom/Nom
- Pays: France

**Choisissez le plan**: **DeepL API Free**
- 500 000 caractères/mois
- Pas de carte bancaire requise
- Suffisant pour toutes les traductions du site

### 2. Vérifier votre email

Cliquez sur le lien de vérification reçu par email.

### 3. Récupérer votre clé API

Une fois connecté:
1. Allez dans **"Account" → "Account"** (menu en haut à droite)
2. Scrollez jusqu'à **"Authentication Key for DeepL API"**
3. Copiez votre clé API (format: `12345678-abcd-1234-abcd-123456789abc:fx`)
4. Gardez-la confidentielle (ne JAMAIS la partager)

### 4. Ajouter la clé dans le projet

Ouvrez le fichier `.env.local` à la racine du projet.

Ajoutez cette ligne:

```bash
# DeepL API pour traductions professionnelles FR→EN/IT
DEEPL_API_KEY=votre_cle_api_ici
```

Remplacez `votre_cle_api_ici` par votre vraie clé copiée à l'étape 3.

**Exemple**:
```bash
DEEPL_API_KEY=12345678-abcd-1234-abcd-123456789abc:fx
```

Sauvegardez le fichier.

---

## Utilisation du script de traduction

### Lancer la traduction automatique

```bash
bun run translate:deepl
```

**Ce que fait le script**:
1. ✅ Lit `messages/fr.json` (source vérité)
2. ✅ Détecte clés manquantes dans `messages/en.json` et `messages/it.json`
3. ✅ Traduit UNIQUEMENT les clés manquantes (économise quota)
4. ✅ Crée un backup automatique avant modification
5. ✅ Affiche progression en temps réel
6. ✅ Sauvegarde fichiers traduits

**Sortie attendue**:
```
🌍 TRADUCTION DEEPL - Guillaume Farré

📂 Chargement fichiers traduction...

✅ FR: 10 sections
✅ EN: 9 sections
✅ IT: 9 sections

🔍 Détection clés manquantes...

🇬🇧 EN: 12 clés manquantes
🇮🇹 IT: 12 clés manquantes

📦 Backup créé: en.backup-2025-11-15T14-30-00.json
📦 Backup créé: it.backup-2025-11-15T14-30-00.json

🇬🇧 TRADUCTION EN (Anglais britannique)...

📝 Clé: dino.tag
  🔄 Traduction: "La Dino en mouvement"
  ✅ Résultat: "The Dino in Motion"

[...]

✅ TRADUCTION TERMINÉE!

🇫🇷 FR: 10 sections (source)
🇬🇧 EN: 10 sections (+12 traduites)
🇮🇹 IT: 10 sections (+12 traduites)
```

### Vérifier les traductions

Après exécution, vérifiez:
- `messages/en.json` → traduit en anglais
- `messages/it.json` → traduit en italien

Si une traduction ne vous plaît pas, éditez manuellement le fichier.

---

## Commandes utiles

### Traduire clés manquantes
```bash
bun run translate:deepl
```

### Forcer retraduction complète
Si vous voulez retraduire TOUT (pas juste clés manquantes):
1. Supprimez `messages/en.json` et `messages/it.json`
2. Créez fichiers vides: `echo '{}' > messages/en.json && echo '{}' > messages/it.json`
3. Lancez `bun run translate:deepl`

### Restaurer un backup
Si traduction échoue:
```bash
# Trouver le dernier backup
ls -lt messages/*.backup-*.json | head -2

# Restaurer
cp messages/en.backup-2025-11-15T14-30-00.json messages/en.json
cp messages/it.backup-2025-11-15T14-30-00.json messages/it.json
```

---

## Quota et limites

### Plan gratuit
- **500 000 caractères/mois**
- Pas de limite par requête
- Pas de carte bancaire

### Estimation usage site Guillaume Farré
- Fichier FR complet: ~8400 caractères
- Section `dino` manquante: ~2000 caractères
- Total à traduire: ~4000 caractères (EN + IT)
- **Usage: < 1% du quota mensuel**

### Consulter usage
Connectez-vous sur https://www.deepl.com/account/usage

Vous verrez:
- Caractères utilisés ce mois
- Caractères restants
- Historique traductions

---

## Dépannage

### Erreur "Invalid authentication key"

**Cause**: Clé API incorrecte ou mal copiée

**Solution**:
1. Vérifiez `.env.local` → pas d'espaces avant/après clé
2. Reconnectez-vous sur https://www.deepl.com/account
3. Vérifiez que clé est bien celle de votre compte (section "Authentication Key for DeepL API")
4. Essayez de régénérer la clé API

### Erreur "Quota exceeded"

**Cause**: Quota mensuel dépassé (500k caractères)

**Solution**:
1. Attendez début du mois prochain (reset auto)
2. OU passez au plan payant (~5€/mois pour 1M caractères)

### Erreur "Network error" ou timeout

**Cause**: Problème connexion internet ou trop de requêtes

**Solution**:
1. Vérifiez connexion internet
2. Le script fait une pause de 100ms entre chaque requête (rate limiting)
3. Réessayez dans quelques secondes
4. Vérifiez firewall/VPN si bloqué

### Module 'deepl-node' introuvable

**Cause**: Package DeepL non installé

**Solution**:
```bash
bun install
```

Le package `deepl-node` est déjà dans `package.json`, il sera installé automatiquement.

---

## Sécurité

### ⚠️ RÈGLES ABSOLUES

1. **JAMAIS commiter `.env.local` sur Git**
   - Fichier déjà dans `.gitignore`
   - Contient clés API secrètes

2. **JAMAIS partager clé API DeepL**
   - Personnelle et confidentielle
   - Si compromise → régénérer immédiatement sur https://www.deepl.com/account

3. **Backups automatiques**
   - Script crée backups avant modification
   - Conservés dans `messages/*.backup-*.json`
   - Saufs à supprimer après validation

---

## Résumé (checklist)

- [ ] Créer compte gratuit DeepL → https://www.deepl.com/pro-api
- [ ] Récupérer clé API → Account → "Authentication Key for DeepL API"
- [ ] Ajouter dans `.env.local` → `DEEPL_API_KEY=...`
- [ ] Lancer traduction → `bun run translate:deepl`
- [ ] Vérifier résultats → `messages/en.json` + `messages/it.json`
- [ ] Tester site multilingue → http://localhost:3000/en et /it
- [ ] Commit si tout est OK

---

**Maintenu par**: Lalou  
**Date**: 2025-11-15
