# 📸 ALTERNATIVES PHOTO CAROUSEL HOMEPAGE

**Date** : 2025-11-16
**Problème** : Photo voitures rouges trop agressive visuellement
**Objectif** : Remplacer par photo neutre/grise (pas sepia non plus)

---

## 🔍 PHOTOS ACTUELLES DU CAROUSEL

**Fichier** : `components/HeroCarousel.tsx` (lignes 11-54)

1. `/images/works/atelier/atelier-004.jpg` - Slide "Créations"
2. `/images/works/empreintes/empreintes-025.jpg` - Slide "Atelier"
3. `/images/works/empreintes/empreintes-023.jpg` - Slide "Photographies"
4. `/images/works/projection/projection-027.jpg` - Slide "Concept Car Art"
5. `/images/works/empreintes/empreintes-001.jpg` - Slide "Origine"
6. `/images/works/projection/projection-011.jpg` - Slide "Acquérir"

**À identifier** : Quelle(s) photo(s) contient(ent) les voitures rouges ?

---

## 🎨 PROPOSITIONS D'ALTERNATIVES

### Catégorie : Atelier

**Photos disponibles** :
- `atelier-001.jpg` à `atelier-020.jpg` (20 photos)

**Suggestions à tester** (visuellement neutres/grises potentielles) :
- `/images/works/atelier/atelier-002.jpg`
- `/images/works/atelier/atelier-005.jpg`
- `/images/works/atelier/atelier-007.jpg`
- `/images/works/atelier/atelier-010.jpg`
- `/images/works/atelier/atelier-012.jpg`

**Comment choisir** :
1. Ouvrir chaque photo dans navigateur
2. Vérifier dominance couleurs grises/noires
3. Éviter photos avec trop de rouge/sepia
4. Privilégier contraste noir/blanc/gris

---

### Catégorie : Empreintes

**Photos disponibles** :
- `empreintes-001.jpg` à `empreintes-033.jpg` (17 photos numéros impairs)

**Suggestions à tester** (visuellement neutres/grises potentielles) :
- `/images/works/empreintes/empreintes-003.jpg`
- `/images/works/empreintes/empreintes-007.jpg`
- `/images/works/empreintes/empreintes-011.jpg`
- `/images/works/empreintes/empreintes-015.jpg`
- `/images/works/empreintes/empreintes-019.jpg`

**Actuellement utilisées dans carousel** :
- empreintes-001.jpg (Slide "Origine")
- empreintes-023.jpg (Slide "Photographies")
- empreintes-025.jpg (Slide "Atelier")

**Note** : Éviter doublons

---

### Catégorie : Projection

**Photos disponibles** :
- `projection-001.jpg` à `projection-027.jpg` (14 photos numéros impairs)

**Suggestions à tester** (visuellement neutres/grises potentielles) :
- `/images/works/projection/projection-003.jpg`
- `/images/works/projection/projection-007.jpg`
- `/images/works/projection/projection-013.jpg`
- `/images/works/projection/projection-017.jpg`
- `/images/works/projection/projection-021.jpg`

**Actuellement utilisées dans carousel** :
- projection-011.jpg (Slide "Acquérir")
- projection-027.jpg (Slide "Concept Car Art")

**Note** : Éviter doublons

---

## 📋 PROCESSUS DE VALIDATION GUILLAUME

### Étape 1 : Identifier photo(s) rouge(s)

1. Ouvrir site en local : http://localhost:3000/
2. Regarder carousel homepage
3. Noter quelle(s) slide(s) contient(ent) voitures rouges agressives

**Photos actuelles** :
- [ ] atelier-004.jpg (Slide "Créations")
- [ ] empreintes-025.jpg (Slide "Atelier")
- [ ] empreintes-023.jpg (Slide "Photographies")
- [ ] projection-027.jpg (Slide "Concept Car Art")
- [ ] empreintes-001.jpg (Slide "Origine")
- [ ] projection-011.jpg (Slide "Acquérir")

**Photo(s) à remplacer** : ___________________

---

### Étape 2 : Tester alternatives

Pour chaque catégorie concernée, ouvrir les photos suggérées :

**Exemple atelier** :
```
http://localhost:3000/images/works/atelier/atelier-002.jpg
http://localhost:3000/images/works/atelier/atelier-005.jpg
http://localhost:3000/images/works/atelier/atelier-007.jpg
```

**Exemple empreintes** :
```
http://localhost:3000/images/works/empreintes/empreintes-003.jpg
http://localhost:3000/images/works/empreintes/empreintes-007.jpg
http://localhost:3000/images/works/empreintes/empreintes-011.jpg
```

**Exemple projection** :
```
http://localhost:3000/images/works/projection/projection-003.jpg
http://localhost:3000/images/works/projection/projection-007.jpg
http://localhost:3000/images/works/projection/projection-013.jpg
```

**Choisir 1-3 photos** qui :
- ✅ Ont dominante grise/noire
- ✅ Sont visuellement neutres
- ✅ Ne sont pas sepia
- ✅ Représentent bien l'œuvre Guillaume Farré

---

### Étape 3 : Appliquer le changement

**Fichier à modifier** : `components/HeroCarousel.tsx`

**Ligne concernée** : Selon slide à remplacer (lignes 13, 20, 27, 34, 41, ou 48)

**Exemple** : Remplacer slide "Créations" (ligne 13)

**Avant** :
```tsx
{
  image: "/images/works/atelier/atelier-004.jpg",
  title: t("creations.title"),
  subtitle: t("creations.subtitle"),
  description: t("creations.description"),
  cta: { text: t("creations.cta"), href: "/histoire" },
},
```

**Après** (exemple avec atelier-007.jpg) :
```tsx
{
  image: "/images/works/atelier/atelier-007.jpg",
  title: t("creations.title"),
  subtitle: t("creations.subtitle"),
  description: t("creations.description"),
  cta: { text: t("creations.cta"), href: "/histoire" },
},
```

**Sauvegarder** et recharger page : http://localhost:3000/

---

### Étape 4 : Validation finale

**Vérifier** :
- [ ] Photo remplacée affichée dans carousel
- [ ] Dominante grise/neutre ✅
- [ ] Pas de rouge agressif ✅
- [ ] Pas de sepia ✅
- [ ] Qualité visuelle satisfaisante ✅

**Si OK** → Commit final :
```bash
git add components/HeroCarousel.tsx
git commit -m "fix: Remplace photo rouge carousel par alternative neutre

- Ancien: [NOM_PHOTO_ANCIENNE]
- Nouveau: [NOM_PHOTO_NOUVELLE]
- Raison: Photo rouge trop agressive visuellement

Lalou"
```

---

## 🎯 ALTERNATIVES RECOMMANDÉES (À TESTER)

**Option 1 : Palette grise atelier**
- Slide "Créations" → `atelier-002.jpg` ou `atelier-007.jpg`
- Slide "Atelier" → `atelier-010.jpg` ou `atelier-012.jpg`

**Option 2 : Palette grise empreintes**
- Slide "Photographies" → `empreintes-003.jpg` ou `empreintes-011.jpg`
- Slide "Origine" → `empreintes-007.jpg` ou `empreintes-015.jpg`

**Option 3 : Palette grise projection**
- Slide "Concept Car Art" → `projection-003.jpg` ou `projection-013.jpg`
- Slide "Acquérir" → `projection-007.jpg` ou `projection-017.jpg`

**Mixte recommandé** :
- Si photo rouge est dans "Créations" → `atelier-007.jpg`
- Si photo rouge est dans "Photographies" → `empreintes-011.jpg`
- Si photo rouge est dans "Concept Car Art" → `projection-013.jpg`

---

## 📝 NOTES

**Critères visuels importants** :
- Contraste noir/blanc/gris élégant
- Mouvement capturé (traces Ferrari)
- Pas de dominante chaude (rouge/orange/sepia)
- Pas de dominante froide excessive (bleu/cyan)
- Harmonie avec charte Guillaume Farré (noir/blanc/zinc)

**Photos à éviter** :
- Photos avec voitures rouges/oranges dominantes
- Photos avec effets sepia/vintage
- Photos avec trop de couleurs saturées

---

**Prêt pour validation Guillaume**

**Lalou**
