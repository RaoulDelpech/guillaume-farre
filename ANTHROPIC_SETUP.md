# Configuration Anthropic Claude - Guillaume Farré

Date: 7 novembre 2025
Par: Lalou

---

## Objectif

Activer l'analyse IA réelle pour suggérer automatiquement des séries de photos similaires lors de l'upload dans l'admin.

**Ce qui va changer** :
- Avant : Pas de suggestions automatiques
- Après : L'IA Claude analyse les photos et propose des regroupements intelligents

---

## Étapes de configuration (5 minutes)

### 1. Créer un compte Anthropic

1. Allez sur https://console.anthropic.com/
2. Cliquez sur **"Sign Up"**
3. Utilisez votre email (guillaume@... ou autre)
4. Validez votre email

### 2. Obtenir votre clé API

1. Une fois connecté, allez dans **Settings** (roue dentée en haut à droite)
2. Cliquez sur **"API Keys"** dans le menu de gauche
3. Cliquez sur **"Create Key"**
4. Donnez un nom à la clé : `Guillaume Farre Site`
5. Copiez la clé qui apparaît (commence par `sk-ant-api03-...`)

⚠️ **IMPORTANT** : Copiez la clé immédiatement, vous ne pourrez plus la voir après !

### 3. Ajouter la clé dans le projet

1. Ouvrez le fichier `.env.raoul` à la racine du projet
2. Trouvez la ligne :
   ```
   ANTHROPIC_API_KEY=votre_cle_api_anthropic_ici
   ```
3. Remplacez `votre_cle_api_anthropic_ici` par votre vraie clé :
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXXXXXXXX
   ```
4. Sauvegardez le fichier

### 4. Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis relancer
npm run dev
```

---

## Vérification que ça fonctionne

### Test 1 : Upload de photos

1. Allez dans l'admin : http://localhost:3000/fr/admin
2. Entrez le mot de passe : `GuillaumeFarre2025Secure!`
3. Uploadez au moins 3 photos similaires (par exemple 3 photos de Ferrari grises)
4. Après l'upload, une popup devrait apparaître avec des suggestions de séries

**Si ça fonctionne** : ✅ Vous verrez :
```
🤖 L'IA a identifié des séries potentielles
Veux-tu regrouper automatiquement ces photos en séries ?
```

**Si ça ne fonctionne pas** : ❌ Vérifiez :
- La clé API est bien copiée dans `.env.raoul`
- Le serveur a été redémarré après modification
- Pas d'erreur dans la console du navigateur (F12)

### Test 2 : Suggestions manuelles

1. Dans l'admin, sélectionnez plusieurs photos existantes
2. Cliquez sur le bouton **"Suggérer des séries"**
3. L'IA devrait analyser et proposer des regroupements

---

## Ce que l'IA va faire

L'IA Claude Vision va analyser :
- **Similitudes visuelles** : couleurs, compositions, textures
- **Sujets communs** : Ferrari grise vs Ferrari en action vs détails
- **Style et technique** : même type d'éclairage, même angle
- **Atmosphère** : émotion similaire dégagée

**Exemple de suggestions** :
```
Série suggérée: "Ferrari Grises Atelier"
Confiance: Haute
3 photos
Analyse: Ces trois photos montrent toutes des Ferrari grises
dans l'atelier, avec un éclairage naturel similaire et une
composition centrée sur les véhicules au repos.
```

---

## Crédit gratuit Anthropic

Anthropic offre **$50 de crédit gratuit** à l'inscription.

**Coût par analyse** :
- ~$0.01 par session de suggestions (plusieurs photos)
- Donc $50 = **~5000 analyses gratuites**

**Usage estimé Guillaume Farré** :
- 10 uploads/mois avec 5 photos chacun = 10 analyses/mois
- Coût mensuel = $0.10/mois
- **Durée du crédit gratuit : 500 mois = 41 ans** 😄

**Conclusion** : C'est **GRATUIT pour toujours** dans la pratique.

---

## Sécurité

⚠️ **NE JAMAIS** :
- Commiter le fichier `.env.raoul` sur Git (déjà dans .gitignore)
- Partager votre clé API publiquement
- Mettre la clé dans le code source

✅ **TOUJOURS** :
- Garder la clé dans `.env.raoul` uniquement
- Créer une nouvelle clé si la première est compromise
- Révoquer les vieilles clés dans le dashboard Anthropic

---

## En cas de problème

### Erreur "Invalid API Key"

**Solution** :
1. Vérifiez que la clé commence bien par `sk-ant-api03-`
2. Vérifiez qu'il n'y a pas d'espace avant/après la clé
3. Essayez de créer une nouvelle clé dans le dashboard Anthropic

### Erreur "Rate limit exceeded"

**Solution** :
- Vous avez dépassé le quota (impossible avec $50 gratuits)
- Attendez 1 minute et réessayez

### L'IA ne suggère aucune série

**C'est normal** :
- L'IA ne suggère QUE si elle détecte de vraies similitudes fortes
- Si vos photos sont trop différentes, elle renvoie "Aucune série suggérée"
- C'est mieux qu'une fausse suggestion !

### Erreur "ANTHROPIC_API_KEY is not defined"

**Solution** :
1. Vérifiez que `.env.raoul` contient bien la ligne `ANTHROPIC_API_KEY=...`
2. Redémarrez le serveur (Ctrl+C puis `npm run dev`)
3. Vérifiez qu'il n'y a pas de faute de frappe dans le nom de la variable

---

## Désactiver temporairement l'IA

Si vous voulez désactiver les suggestions automatiques sans supprimer la clé :

1. Ouvrez `/app/api/upload/route.ts`
2. Commentez le bloc qui appelle `/api/admin/suggest-series`
3. Ou mettez une condition :
   ```typescript
   if (process.env.ENABLE_AI_SUGGESTIONS === 'true') {
     // Appel API suggestions
   }
   ```

---

## Différence avec Juris-Power

**Guillaume Farré** :
- IA : Anthropic Claude (Vision pour photos)
- Usage : Suggestions de séries photos
- Coût : Gratuit (crédit $50)

**Juris-Power** :
- IA : Mistral AI (Texte pour simulateurs juridiques)
- Usage : Calculs juridiques, conseils légaux
- Coût : Variable selon usage

**Les deux sont complètement séparés** - aucun risque de confusion.

---

## Prochaines améliorations possibles

Une fois l'API Anthropic configurée, on pourra facilement ajouter :

1. **Analyse commerciale réelle** (remplacer le simulacre actuel)
   - Prix suggérés basés sur analyse visuelle réelle
   - Identification artistes similaires
   - Stratégie marketing personnalisée

2. **Descriptions automatiques**
   - L'IA génère une description de chaque photo
   - Tu valides et publies

3. **Suggestions de performances**
   - L'IA analyse les tendances
   - Suggère quelles œuvres mettre en avant

Tout ça pour ~$1-2/mois avec le même compte Anthropic.

---

## Support

Si tu as des questions ou problèmes :
1. Vérifie d'abord cette documentation
2. Regarde les erreurs dans la console navigateur (F12)
3. Regarde les logs serveur (terminal où tourne `npm run dev`)
4. Demande-moi de l'aide si nécessaire

Lalou
