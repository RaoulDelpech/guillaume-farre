# Guide de Test - Matériaux et Orientation

Date: 2025-11-18
Auteur: Lalou

## Instructions pour tester les nouvelles fonctionnalités

---

## 1. Préparation

### Démarrer le serveur de développement
```bash
cd /Users/raouldelpech/Desktop/Claude/guillaume-farre/guillaume-farre-from-github
bun run dev
```

### Ouvrir l'interface admin
```
http://localhost:3000/fr/admin
```

**Mot de passe:** `LHOOQladino246`

---

## 2. Test Interface Admin

### A. Test Sélection Matériau

1. **Localiser la section "Matériau"**
   - Position: Après la section "Tags"
   - Avant la section "Options de vente"

2. **Tester le dropdown**
   - Ouvrir le dropdown "Matériau"
   - Vérifier les 2 options:
     - ✅ Papier Semi-Brillant (€13.20)
     - ✅ Aluminium Brossé (€16.81)

3. **Sélectionner un matériau**
   - Choisir "Aluminium Brossé"
   - Cliquer sur "Sauvegarder" (bouton sticky en bas à droite)
   - Recharger la page
   - ✅ Vérifier que "Aluminium Brossé" est toujours sélectionné

---

### B. Test Détection Orientation (Auto)

1. **Sélectionner "Automatique (IA détecte)"**
   - Localiser la section "Orientation"
   - Cocher le radio button "✅ Automatique (IA détecte)"

2. **Observer la détection**
   - Une requête API est envoyée automatiquement
   - Attendre 2-3 secondes
   - ✅ Le résultat s'affiche à côté: `→ 📐 Vertical` ou `→ 📐 Horizontal`

3. **Vérifier la persistance**
   - Cliquer "Sauvegarder"
   - Recharger la page
   - ✅ La détection IA est toujours affichée (pas besoin de re-détecter)

---

### C. Test Override Orientation (Forcer)

1. **Forcer orientation verticale**
   - Cocher "📐 Vertical (forcer)"
   - ✅ La suggestion IA disparaît (normale, on force la valeur)

2. **Forcer orientation horizontale**
   - Cocher "📐 Horizontal (forcer)"
   - ✅ Pas d'appel API (on ne détecte pas)

3. **Vérifier la persistance**
   - Cliquer "Sauvegarder"
   - Recharger la page
   - ✅ L'orientation forcée est toujours sélectionnée

---

### D. Test avec Plusieurs Photos

1. **Uploader 3 photos:**
   - 1 photo verticale (portrait)
   - 1 photo horizontale (paysage)
   - 1 photo carrée

2. **Pour chaque photo:**
   - Sélectionner "Automatique"
   - Vérifier la détection:
     - ✅ Photo portrait → "Vertical"
     - ✅ Photo paysage → "Horizontal"
     - ✅ Photo carrée → Résultat variable (OK)

3. **Mixer les matériaux:**
   - Photo 1: Papier Semi-Brillant
   - Photo 2: Aluminium
   - Photo 3: Papier Semi-Brillant
   - Sauvegarder
   - ✅ Tous les choix sont bien persistés

---

## 3. Test Interface Boutique

### A. Accéder à la boutique
```
http://localhost:3000/fr/boutique
```

### B. Tester la Sélection de Matériau

1. **Cliquer sur "Ajouter au panier"** sur une photo

2. **Observer le modal**
   - Section "Format" (A4/A3/A2) → Déjà existante
   - **Section "Matériau"** → NOUVELLE
   - Section "Encadrement" → Déjà existante

3. **Tester "Papier Semi-Brillant"**
   - Sélectionner cette option
   - Observer le prix en bas du modal
   - ✅ Prix augmente de +€13.20

4. **Tester "Aluminium Brossé"**
   - Sélectionner cette option
   - Observer le prix
   - ✅ Prix augmente de +€16.81 (€3.61 de plus que papier)

5. **Lire la description**
   - Sous chaque option, une description est affichée:
     - Papier: "Papier Fine Art 200gsm, finition semi-brillante..."
     - Aluminium: "Impression directe sur aluminium, effet moderne..."
   - ✅ Les descriptions sont claires et informatives

---

### C. Tester le Calcul du Prix Total

1. **Configuration test:**
   - Format: A2
   - Matériau: Aluminium Brossé (+€16.81)
   - Encadrement: Cadre Noir (+€150)

2. **Calcul attendu:**
   - Prix base photo: Ex. €500
   - Format A2: €500 × 2.0 = €1000
   - Matériau: +€16.81
   - Cadre: +€150
   - **Total: €1166.81**

3. **Vérification:**
   - ✅ Le prix affiché correspond au calcul

4. **Changer le matériau:**
   - Sélectionner "Papier Semi-Brillant" (+€13.20)
   - **Nouveau total: €1163.20**
   - ✅ Le prix se met à jour instantanément

---

### D. Tester le Panier

1. **Ajouter au panier**
   - Sélectionner toutes les options
   - Cliquer "Ajouter au panier"
   - ✅ Notification de confirmation
   - ✅ Panier flottant s'affiche en haut à droite

2. **Vérifier le panier**
   - Observer le nombre d'items: (1)
   - Observer le total
   - ✅ Le total inclut bien le coût du matériau

3. **Ajouter un 2e item**
   - Choisir une autre photo
   - Sélectionner un matériau différent (ex: Papier)
   - Ajouter au panier
   - ✅ Panier affiche (2) items
   - ✅ Total = Somme des 2 items

---

## 4. Test Processus de Paiement

⚠️ **Important:** Utiliser Stripe en mode TEST

### A. Initier le paiement

1. **Cliquer "Payer maintenant"** dans le panier flottant

2. **Vérifier la redirection:**
   - ✅ Redirection vers Stripe Checkout
   - ✅ URL contient `checkout.stripe.com`

3. **Observer la page Stripe:**
   - ✅ Nom des photos affichés
   - ✅ Prix corrects
   - ✅ Adresse de livraison demandée

---

### B. Tester avec carte test Stripe

**Carte de test:** `4242 4242 4242 4242`
- Date: N'importe quelle date future (ex: 12/25)
- CVV: N'importe quel 3 chiffres (ex: 123)

1. **Remplir le formulaire:**
   - Email: `test@guillaumefarre.com`
   - Numéro de carte: `4242 4242 4242 4242`
   - Date: `12/25`
   - CVV: `123`
   - Adresse de livraison: Adresse test valide

2. **Cliquer "Payer"**
   - ✅ Paiement réussi
   - ✅ Redirection vers page de succès

---

### C. Vérifier le Webhook

1. **Ouvrir les logs du serveur**
   - Dans le terminal où tourne `bun run dev`
   - Observer les logs en temps réel

2. **Logs attendus:**
```
🎉 Processing order for session: cs_test_...
📦 Order details: { customer: 'test@...', items: 2, ... }
🖨️ Creating Gelato order: cs_test_...
✅ Gelato order created: gel_...
✅ Order processed successfully
```

3. **Vérifier les métadonnées:**
```
Material: aluminum (ou semi-glossy)
Orientation: vertical (ou horizontal)
Product UID: flat_a2_200-gsm-80lb-coated-silk_4-0_ver (ou autre)
```

4. **✅ Pas d'erreurs dans les logs**

---

## 5. Test API Détection Orientation (Manuel)

### A. Tester avec curl

```bash
curl -X POST http://localhost:3000/api/admin/detect-orientation \
  -H "Content-Type: application/json" \
  -d '{"photoPath": "/images/works/atelier/photo.jpg"}'
```

**Réponse attendue:**
```json
{
  "success": true,
  "orientation": "vertical",
  "photoPath": "/images/works/atelier/photo.jpg"
}
```

### B. Tester avec Postman

1. **Créer une requête POST:**
   - URL: `http://localhost:3000/api/admin/detect-orientation`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "photoPath": "/images/works/atelier/ferrari-noir-atelier-23.jpg"
     }
     ```

2. **Envoyer la requête**
   - ✅ Status: 200
   - ✅ Response: `{ "success": true, "orientation": "vertical", ... }`

---

## 6. Vérification des Données

### A. Vérifier photo-metadata.json

```bash
cat data/photo-metadata.json | grep -A 5 "ferrari-noir-atelier-23.jpg"
```

**Résultat attendu:**
```json
{
  "filename": "ferrari-noir-atelier-23.jpg",
  "path": "/images/works/atelier/ferrari-noir-atelier-23.jpg",
  "material": "aluminum",
  "orientation": "auto",
  "aiDetectedOrientation": "vertical",
  ...
}
```

### B. Vérifier Stripe Dashboard

1. **Ouvrir:** https://dashboard.stripe.com/test/payments

2. **Localiser le dernier paiement**

3. **Cliquer dessus → Onglet "Metadata"**

4. **Vérifier:**
   - ✅ `items_materials`: "aluminum,semi-glossy"
   - ✅ `items_orientations`: "vertical,horizontal"

---

## 7. Tests Edge Cases

### A. Photo sans détection IA

1. **Scénario:** Première fois qu'une photo est vue
2. **Action:** Sélectionner "Automatique"
3. **Attendu:** Détection déclenche automatiquement
4. **✅ Résultat affiché en 2-3 secondes**

---

### B. Photo avec orientation forcée

1. **Scénario:** Orientation forcée à "Horizontal" dans admin
2. **Action:** Ajouter au panier dans la boutique
3. **Attendu:** Orientation transmise = "horizontal" (pas "auto")
4. **✅ Gelato reçoit le bon product UID horizontal**

---

### C. Panier avec matériaux mixtes

1. **Scénario:** 2 photos dans le panier
   - Photo 1: Papier Semi-Brillant
   - Photo 2: Aluminium
2. **Action:** Payer
3. **Attendu:**
   - Stripe: `items_materials: "semi-glossy,aluminum"`
   - Gelato: 2 commandes avec product UIDs différents
4. **✅ Chaque photo imprimée avec le bon matériau**

---

### D. Erreur API Anthropic

1. **Scénario:** API key invalide ou quota dépassé
2. **Action:** Sélectionner "Automatique"
3. **Attendu:**
   - Erreur loggée dans la console
   - Message d'erreur clair pour Guillaume
   - Fallback: Pas de détection affichée
4. **✅ L'application ne crash pas**

---

## 8. Checklist Finale

Avant de valider l'implémentation, vérifier:

### Interface Admin
- [ ] Dropdown "Matériau" affiché
- [ ] 2 options matériau avec prix
- [ ] Radio buttons "Orientation" affichés
- [ ] Détection IA fonctionne (auto)
- [ ] Override fonctionne (forcer)
- [ ] Sauvegarde persiste les choix

### Interface Boutique
- [ ] Section "Matériau" dans le modal
- [ ] Descriptions des matériaux claires
- [ ] Prix se met à jour en temps réel
- [ ] Panier affiche le bon total

### Processus Paiement
- [ ] Redirection Stripe OK
- [ ] Paiement test réussi
- [ ] Webhook reçu et traité
- [ ] Métadonnées Stripe correctes
- [ ] Gelato reçoit les bonnes infos

### Données
- [ ] photo-metadata.json mis à jour
- [ ] material sauvegardé
- [ ] orientation sauvegardée
- [ ] aiDetectedOrientation sauvegardée

---

## 9. Problèmes Connus

### Détection IA lente
- **Normal:** Anthropic API peut prendre 2-5 secondes
- **Solution:** Patienter, pas d'erreur

### Photo très lourde
- **Problème:** Détection échoue si image > 10 MB
- **Solution:** Optimiser/compresser l'image avant upload

### Stripe Test Mode
- **Important:** Toujours utiliser clé TEST en développement
- **Vérifier:** URL Stripe contient `test.stripe.com`

---

## 10. Support

### Si un test échoue

1. **Vérifier les logs:**
   ```bash
   tail -f logs/app.log | grep -E "detect-orientation|Gelato|Stripe"
   ```

2. **Vérifier la config:**
   ```bash
   cat .env.local | grep -E "ANTHROPIC|STRIPE|GELATO"
   ```

3. **Vérifier les données:**
   ```bash
   cat data/photo-metadata.json | jq '.[] | select(.material != null)'
   ```

4. **Contacter:**
   - Développeur: Lalou
   - Documentation: IMPLEMENTATION_MATERIAUX_ORIENTATION.md

---

**Lalou**
