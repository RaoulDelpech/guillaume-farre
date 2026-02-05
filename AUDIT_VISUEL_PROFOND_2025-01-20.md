# AUDIT VISUEL PROFOND - PROBLÈMES CRITIQUES

**Date** : 20 janvier 2025
**Objectif** : Identifier TOUS les problèmes visuels et de cohérence
**Référence** : philippeshangti.com (minimaliste noir-blanc, élégant, unifié)

---

## CONSTAT BRUTAL

Le site actuel est **décousu, laid, incohérent**. Chaque page a son propre style.
Ça n'a RIEN à voir avec la référence Shangti.

---

## PROBLÈME #1 : IMAGES UNSPLASH AU LIEU DES VRAIES PHOTOS

### Diagnostic
- **139 vraies images** disponibles dans `/public/images/` et `/public/uploads-preview/`
- **6 images Unsplash** utilisées (toutes dans DinoContent.tsx)
- Les vraies photos de Guillaume ne sont PAS utilisées sur la page Dino

### Fichiers concernés
```
components/pages/DinoContent.tsx
  - Ligne 68: unsplash Ferrari (hero)
  - Ligne 137: unsplash Ferrari détails
  - Ligne 325: unsplash Ferrari mouvement
  - Lignes 357-370: 3 images unsplash galerie
```

### Conséquence
La page Dino montre des Ferrari génériques, pas les vraies Dino de Guillaume.

---

## PROBLÈME #2 : PALETTE DE COULEURS INCOHÉRENTE

### Diagnostic
Le CSS définit une palette bronze/taupe complexe :
- `--primary: 38 45% 48%` (bronze)
- `--secondary: 30 22% 55%` (taupe)
- `--accent: 38 35% 58%` (bronze clair)
- `--muted: 30 12% 88%`

**Shangti utilise** : NOIR (#000) + BLANC (#fff) uniquement.

### Problème
La palette "artistique" bronze/taupe est **trop complexe** et **pas élégante**.
Elle donne un look amateur, pas galerie fine art.

---

## PROBLÈME #3 : TEXTURE DE FOND HORRIBLE

### Diagnostic (globals.css lignes 59-71)
```css
body {
  background-image:
    url("data:image/svg+xml,...noise..."),
    radial-gradient(ellipse at 10% 20%, ...),
    radial-gradient(ellipse at 90% 80%, ...),
    radial-gradient(ellipse at 50% 50%, ...),
    radial-gradient(circle at 30% 70%, ...),
    radial-gradient(circle at 75% 25%, ...),
    linear-gradient(125deg, ...),
    linear-gradient(215deg, ...);
}
```

C'est **8 couches de bruit visuel** sur le fond !

**Shangti utilise** : Fond blanc pur ou noir pur. Point.

### Conséquence
Le site a l'air d'une texture Photoshop années 2010, pas d'une galerie contemporaine.

---

## PROBLÈME #4 : TYPOGRAPHIE INCOHÉRENTE

### Diagnostic
Le CSS utilise **3 familles de polices différentes** :

1. **Body** : `ui-serif, Georgia, Cambria, Times New Roman`
2. **Titres** : `ui-sans-serif, system-ui, Segoe UI, Roboto`
3. **Page Dino** : `Playfair Display, Georgia` (classe .font-retro)

**Shangti utilise** : UNE seule famille, avec hiérarchie de tailles/poids.

### Conséquence
Chaque page a une typographie différente. Pas d'unité.

---

## PROBLÈME #5 : FILTRES "RÉTRO" INUTILES

### Diagnostic (globals.css lignes 166-183)
```css
.filter-vintage { filter: sepia(15%) contrast(1.05) brightness(0.95); }
.filter-bw { filter: grayscale(100%) contrast(1.1); }
.filter-warm { filter: sepia(8%) saturate(1.1) brightness(0.98); }
.border-retro { border: 1px solid rgba(166, 141, 94, 0.3); box-shadow: ... }
```

Ces filtres sont appliqués **arbitrairement** sur certaines images.

**Shangti** : Images pures, sans filtres. La qualité photographique parle d'elle-même.

### Conséquence
Certaines photos ont un look "Instagram 2012", d'autres sont normales.
Aucune cohérence.

---

## PROBLÈME #6 : CHAQUE PAGE A SON PROPRE STYLE

### Homepage
- Hero carousel avec overlay noir
- Section citation fond clair
- Section bio fond gris
- Galerie 9 œuvres

### Page Dino
- Style "rétro années 60-70"
- Typo Playfair Display italic
- Filtres vintage/sepia
- Images Unsplash (pas les vraies)

### Page Origines
- Style minimaliste
- Filtres noir & blanc
- Moins de texte

### Page Atelier
- Style différent encore
- Cartes avec emojis (⚫, ⚪)
- Processus en 3 étapes numérotées

### Page Contact
- Style formulaire classique
- Cartes "motifs de contact"
- FAQ dépliable

**AUCUNE COHÉRENCE ENTRE LES PAGES.**

---

## PROBLÈME #7 : TROP D'ÉLÉMENTS DÉCORATIFS

### Exemples trouvés
- Lignes décoratives rétro (DinoContent.tsx:100-104)
- Émojis dans les cartes (AtelierContent.tsx:82-103)
- Bordures .border-retro avec box-shadow
- Badges "Édition X/Y" avec couleurs différentes
- Gradients multiples

**Shangti** : AUCUN élément décoratif. Les photos suffisent.

---

## PROBLÈME #8 : MANQUE DE RESPIRATION VISUELLE

### Diagnostic
- Marges trop petites entre sections
- Contenu trop dense
- Pas assez d'espace blanc

**Shangti** : Marges généreuses (jusqu'à 3.38rem entre sections).
Le contenu "respire".

---

## PROBLÈME #9 : NAVIGATION CORRECTE MAIS STYLING INCOHÉRENT

La structure de navigation est bonne (5 liens), mais :
- Header trop haut (h-20 = 80px)
- Logo pas assez impactant
- Pas de hover élégant

**Shangti** : Navigation ultra-discrète, presque invisible.

---

## CE QUE SHANGTI FAIT BIEN

1. **Palette** : NOIR + BLANC uniquement
2. **Typographie** : Une seule famille, hiérarchie claire
3. **Images** : Pures, sans filtres, plein cadre
4. **Espacement** : Marges généreuses, respiration
5. **Navigation** : Discrète, épurée
6. **Décoration** : ZÉRO élément décoratif superflu
7. **Cohérence** : Chaque page a le MÊME style

---

## PLAN DE REFONTE TOTALE

### Phase 1 : Identité visuelle unifiée

1. **Nouvelle palette**
   - Fond : BLANC (#FFFFFF) ou NOIR (#0A0A0A)
   - Texte : inverse du fond
   - Accent : gris subtil uniquement

2. **Typographie unique**
   - Une seule famille : Inter ou système
   - Hiérarchie : taille + poids, pas style

3. **Supprimer TOUS les filtres**
   - Plus de .filter-vintage, .filter-bw, .filter-warm
   - Plus de .border-retro

4. **Supprimer texture de fond**
   - Plus de bruit SVG
   - Plus de gradients multiples

### Phase 2 : Remplacer images Unsplash

1. DinoContent.tsx : utiliser les vraies photos de Guillaume
2. Vérifier toutes les autres pages

### Phase 3 : Unifier le style de chaque page

1. Homepage : style Shangti
2. Créations : style Shangti (identique)
3. Dino : style Shangti (identique)
4. Origines : style Shangti (identique)
5. Atelier : style Shangti (identique)
6. Contact : style Shangti (identique)

### Phase 4 : Améliorer la respiration

1. Augmenter marges entre sections
2. Réduire densité de contenu
3. Plus d'espace blanc

---

## RÉSUMÉ DES CORRECTIONS URGENTES

| # | Problème | Action | Fichier(s) |
|---|----------|--------|------------|
| 1 | Images Unsplash | Remplacer par vraies photos | DinoContent.tsx |
| 2 | Palette complexe | Simplifier à noir/blanc | globals.css |
| 3 | Texture de fond | Supprimer | globals.css |
| 4 | Typo incohérente | Unifier | globals.css |
| 5 | Filtres rétro | Supprimer | globals.css + composants |
| 6 | Style par page | Unifier | Tous les composants |
| 7 | Éléments déco | Supprimer | Composants |
| 8 | Manque respiration | Augmenter marges | Tous |
| 9 | Header trop haut | Réduire | Navigation.tsx |

---

## ESTIMATION

- **Phase 1** (identité) : 2h
- **Phase 2** (images) : 30min
- **Phase 3** (unifier pages) : 4h
- **Phase 4** (respiration) : 1h

**Total : ~8h de refonte**

---

**Maintenu par** : Lalou
**Date** : 20 janvier 2025
