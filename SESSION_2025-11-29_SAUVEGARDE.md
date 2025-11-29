# SESSION 2025-11-29 - SAUVEGARDE COMPLÈTE

**Date** : 2025-11-29
**Par** : Lalou

---

## DEMANDES DE RAOUL (recap discussion Guillaume)

### Demandes initiales reçues :

1. **Bandeau** : on supprime
2. **Performances** : On rajoute l'atelier (→ supprimé page performances)
3. **Carousel** : on augmente la hauteur, voir on réduit la largeur (laissé tel quel pour l'instant)
4. **CTA** : On vire "comprendre le processus" → "Découvrir l'atelier"
5. **Textes** : On passe tous les textes à la 1ère personne
6. **Section vendu** : remplacer par "dernières œuvres" + bouton galerie
7. **Supprimer** : "Rejoignez la communauté / Chaque trace raconte une histoire / Éditions limitées / Réserver une œuvre"
8. **Supprimer** : "Certificat d'authenticité / Livraison sécurisée / Paiement en 3x" (pas sur homepage)
9. **Son** : Pas besoin de son
10. **Boutons rouges** : laids → boutons discrets et élégants
11. **Galerie** : photo pleine page, sans filtre blanc pourri, "galerie" écrit deux fois
12. **Texte galerie** : "Toiles. Photographies. Empreintes irréversibles."
13. **Clic photo** : proposer d'aller l'acheter dans la boutique
14. **Supprimer** : "Vous souhaitez acquérir une œuvre? / Rejoignez ceux qui possèdent une trace"
15. **Page Dino** : enlever Ferrari rose rouge, laid → sensation photo noir et blanc
16. **"La Dino en images"** : on fera plus tard
17. **Boutique** : Changer pour "Commandes"
18. **Éditions limitées** : 3 tailles × 9 exemplaires = 27 total
19. **Tirages grand public** : 99 exemplaires numérotés signés

### Clarifications obtenues :

- **Performances** : Option A - Supprimer /performances complètement
- **Carousel hauteur** : Laisser comme c'est pour l'instant (50vh/60vh)
- **Textes 1ère personne** : TOUT le site
- **Boutons** : Discrets et élégants (pas tape-à-l'œil, humble)
- **Page Dino** : Option B - Juste supprimer mentions couleurs (pas filtre CSS)
- **Exemplaires** : 9 (pas 7) - confirmé par Raoul
- **Formats** :
  - Grands formats (2A0/A0/A1) : 9 exemplaires par format
  - Petits formats (A2/A3/A4) : 99 exemplaires par format
- **Tirages 99ex** : Nouvelle structure, plus de "unlimited"

---

## TRAVAUX RÉALISÉS

### 1. Navigation
- ✅ Supprimé page `/performances` (fichier + dossier)
- ✅ Retiré "Performances" du menu desktop (`Navigation.tsx`)
- ✅ Retiré "Performances" + "Concept Car Art" + "Presse" du menu mobile (`MobileNav.tsx`)
- ✅ Renommé "Boutique" → "Commandes" dans les deux navs

### 2. Textes 1ère personne (messages/fr.json)
- ✅ hero.creations.description : "Mes toiles naissent..."
- ✅ hero.photographies.description : "Mes empreintes montrent..."
- ✅ hero.conceptCarArt.description : "Ma Ferrari rejoint..."
- ✅ hero.acquerir.description : "Mes photographies documentent..."
- ✅ home.artist.bio : "j'utilise la Ferrari comme matière première de mon art"
- ✅ home.artist.cta : "Découvrir mon histoire"
- ✅ gallery.subtitle : "Toiles. Photographies. Empreintes irréversibles."
- ✅ gallery.intro : "Ces images documentent ma création"
- ✅ gallery.empreintes.description : "Ce que mes roues..."
- ✅ gallery.atelier.description : "Mes Ferrari au repos..."
- ✅ shop.heroTag : "COMMANDES"
- ✅ shop.heroTitle : "Mes œuvres disponibles"
- ✅ shop.heroDescription : "Découvrez mon art automobile"
- ✅ shop.intro : "Mes photographies capturent..."
- ✅ dino.subtitle : "Mon instrument en action"
- ✅ dino.origin.title : "De l'enfance à l'atelier" (était "De la rose à la rouge")
- ✅ dino.origin.text1/text2 : à la 1ère personne
- ✅ dino.specs.color : "Finition" (était "Couleur")
- ✅ dino.specs.colorValue : "Rosso Corsa" (retiré "Rouge Ferrari")
- ✅ dino.creative.title : "Mon instrument de création"
- ✅ dino.creative.text1 : "Ma Dino n'est pas préservée..."

### 3. Homepage (app/[locale]/page.tsx)
- ✅ Section "Œuvres disponibles" → "Dernières œuvres"
- ✅ Sous-titre : "Toiles. Photographies. Empreintes irréversibles."
- ✅ Lien "Voir tout →" vers /galerie (pas /boutique)
- ✅ Bouton CTA : "Voir toute la galerie" (style discret)

### 4. Boutons discrets (HeroCarousel.tsx)
- ✅ CTA slides : bordure fine blanche, transparent, hover subtil
- ✅ Quick access menu : bordures blanches fines (plus de bg-primary)
- ✅ Bouton "Commandes" au lieu de t("boutique")

### 5. Lightbox (components/lightbox/Lightbox.tsx)
- ✅ Bouton "Commander cette œuvre" (style discret)
- ✅ Bordure fine, hover subtil

### 6. Specs formats (SPECIFICATIONS_METIER_2025-11-19.md)
- ✅ Grands formats (2A0/A0/A1) : 9 exemplaires par format
- ✅ Petits formats (A2/A3/A4) : 99 exemplaires par format
- ✅ Supprimé section "Tirages illimités"
- ✅ Mis à jour règles éditions limitées

---

## COMMITS

1. `56464d7` - docs: correction 7 exemplaires (pas 9) + sync metadata production
2. `29d22a4` - fix: carousel réduit (60vh) + textes FR variés (anti-répétitions)
3. `ea912a5` - feat: refonte selon specs Guillaume - textes 1ère personne + boutons discrets

---

## ÉTAT PRODUCTION

- **Site** : https://guillaumefarre.com
- **Build** : 105 pages générées
- **PM2** : online (PID 439880)
- **Dernier déploiement** : 2025-11-29

---

## FICHIERS MODIFIÉS

```
app/[locale]/page.tsx
app/[locale]/performances/page.tsx (SUPPRIMÉ)
components/HeroCarousel.tsx
components/lightbox/Lightbox.tsx
components/navigation/MobileNav.tsx
components/navigation/Navigation.tsx
messages/fr.json
SPECIFICATIONS_METIER_2025-11-19.md
```

---

## CE QUI RESTE À FAIRE (mentionné mais pas encore fait)

1. **Carousel** : Guillaume voulait augmenter hauteur / réduire largeur (laissé tel quel pour l'instant - à revoir avec lui)
2. **Galerie** : "photo pleine page, sans filtre blanc" - le style actuel n'a pas été modifié en profondeur
3. **"La Dino en images"** : à faire plus tard
4. **Traductions EN/IT** : DeepL pas fait (demandé de ne pas faire)

---

**Maintenu par** : Lalou
**Sauvegardé** : 2025-11-29
