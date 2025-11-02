# Guide de l'Interface d'Administration

## 🎯 Accès à l'Administration

L'interface d'administration est accessible à l'adresse :

```
https://guillaumefarre.com/admin
```

Ou en local :
```
http://localhost:3000/admin
```

## 📸 Gestion des Photos

### Vue d'ensemble

L'interface admin vous permet de :

1. **Voir toutes vos photos** organisées par catégorie
2. **Masquer/Afficher** des photos sur le site
3. **Changer de catégorie** pour chaque photo
4. **Mettre en vente** ou retirer de la vente
5. **Définir les prix** pour chaque photo
6. **Créer des séries numérotées** (éditions limitées)
7. **Sauvegarder** toutes vos modifications d'un coup

### Fonctionnalités par Photo

Pour chaque photo, vous pouvez configurer :

#### ✅ Visibilité
- **Cochée** = La photo apparaît sur le site
- **Décochée** = La photo est masquée (utile pour les photos avec tabac/alcool)

#### 📁 Catégorie
Choisissez parmi :
- **Empreintes** - Série des empreintes
- **Atelier** - Photos de l'atelier
- **Projection** - Projections lumineuses
- **Toiles** - Peintures sur toile
- **Autres** - Autres créations

#### 💰 À la vente
- **Cochée** = La photo apparaît dans la galerie et la boutique
- **Décochée** = La photo est visible mais pas à la vente

#### 🔢 Série numérotée
Si "À la vente" est activée :
- **Cochée** = Édition limitée (vous pouvez définir le nombre d'exemplaires)
- **Décochée** = Édition ouverte

#### 💶 Prix
- Définissez le prix en euros
- Le système génère automatiquement 3 tailles :
  - **Petit** = Prix saisi
  - **Moyen** = Prix × 1,5
  - **Grand** = Prix × 2

#### 📝 Titre (optionnel)
- Titre personnalisé pour la photo
- Si vide, utilise automatiquement "Catégorie + Numéro"

#### 📅 Année
- Année de création (par défaut : 2024)

## 🔍 Filtres

### Par Catégorie
Filtrez l'affichage pour ne voir qu'une catégorie spécifique :
- **Toutes** - Affiche toutes les photos
- **Empreintes** - Seulement les empreintes
- **Atelier** - Seulement l'atelier
- etc.

### Par Visibilité
- **Toutes** - Affiche tout
- **Visibles uniquement** - Photos qui apparaissent sur le site
- **Masquées uniquement** - Photos cachées

## 💾 Sauvegarde

### Comment sauvegarder ?

1. **Modifiez les photos** - Les cartes avec des modifications auront une bordure bleue
2. **Cliquez sur "Sauvegarder"** - Le bouton devient actif dès qu'il y a des modifications
3. **Confirmation** - Un message apparaît quand c'est sauvegardé

### Bouton flottant
Quand il y a des modifications non sauvegardées, un bouton bleu flotte en bas à droite pour sauvegarder rapidement.

## 📊 Statistiques

En haut de la page, vous voyez :

- **Total photos** - Nombre total de photos scannées
- **Visibles** - Photos affichées sur le site
- **Masquées** - Photos cachées
- **À la vente** - Photos disponibles à l'achat

## 🔄 Workflow Recommandé

### 1️⃣ Première utilisation - Tri des photos

1. Accédez à `/admin`
2. **Parcourez toutes les photos** par catégorie
3. **Masquez les photos indésirables** :
   - Photos avec cigarettes/tabac → Décocher "Visible"
   - Photos avec alcool en gros plan → Décocher "Visible"
   - Photos floues ou ratées → Décocher "Visible"
4. **Sauvegardez** vos modifications

### 2️⃣ Configuration des ventes

1. Pour chaque photo que vous voulez vendre :
   - Cocher "À la vente"
   - Définir le prix (ex: 300€)
   - Si édition limitée, cocher "Série numérotée" et mettre le nombre (ex: 10)
2. **Sauvegardez**

### 3️⃣ Organisation par catégories

1. Si une photo est dans la mauvaise catégorie :
   - Changez la catégorie dans le menu déroulant
2. **Sauvegardez**

### 4️⃣ Ajout de nouvelles photos

1. **Copiez les photos** dans `public/images/works/[categorie]/`
2. **Rechargez la page admin** - Elles apparaissent automatiquement
3. **Configurez** visibilité, prix, etc.
4. **Sauvegardez**

## 📂 Stockage des Données

Les métadonnées sont sauvegardées dans :
```
data/photo-metadata.json
```

Ce fichier contient toutes vos configurations :
- Visibilité
- Catégories
- Prix
- Éditions
- Titres personnalisés

**Important** : Sauvegardez ce fichier régulièrement !

## 🌐 Impact sur le Site

### Galerie (`/galerie`)
Affiche **uniquement** les photos :
- ✅ Visibles
- ✅ À la vente (ou toutes, selon configuration)
- Avec bordures blanches alternées (1 sur 2)

### Boutique (`/boutique`)
Affiche **uniquement** les photos :
- ✅ Visibles
- ✅ À la vente
- ✅ Avec prix défini

## 🎨 Exemple de Configuration

### Photo de l'atelier SANS tabac
```
✅ Visible sur le site
📁 Catégorie: Atelier
💰 À la vente: Oui
💶 Prix: 400€
🔢 Série numérotée: Oui (10 exemplaires)
```

### Photo avec cigarette
```
❌ Masquée
📁 Catégorie: Atelier
💰 À la vente: Non
```

### Empreinte premium
```
✅ Visible sur le site
📁 Catégorie: Empreintes
💰 À la vente: Oui
💶 Prix: 800€
🔢 Série numérotée: Oui (5 exemplaires)
📝 Titre: "Empreinte Dorée"
```

## 🚀 Déploiement

Quand vous sauvegardez dans l'admin :

1. Les données sont écrites dans `data/photo-metadata.json`
2. Le site lit ce fichier pour afficher les photos
3. Si vous utilisez Git :
   ```bash
   git add data/photo-metadata.json
   git commit -m "Mise à jour des photos"
   git push
   ```
4. Le déploiement automatique met à jour le site

## ⚠️ Important

- **Sauvegardez régulièrement** vos modifications
- **Vérifiez le site** après chaque sauvegarde
- **Le fichier JSON est critique** - ne le supprimez pas !
- **Les modifications sont immédiates** après déploiement

## 🆘 En Cas de Problème

### Les photos n'apparaissent pas
- Vérifiez que le fichier est dans `public/images/works/[categorie]/`
- Format supporté : `.jpg`, `.jpeg`, `.png`
- Rechargez la page admin

### Les modifications ne sont pas sauvegardées
- Vérifiez que vous avez cliqué sur "Sauvegarder"
- Regardez le message de confirmation
- Vérifiez les droits d'écriture sur `data/`

### Une photo est dans la mauvaise catégorie
- Changez simplement la catégorie dans le menu
- Sauvegardez

---

**L'interface admin vous donne le contrôle total sur vos photos, sans toucher au code ! 🎉**
