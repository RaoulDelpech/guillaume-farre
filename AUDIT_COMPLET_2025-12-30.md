# AUDIT COMPLET - Site Guillaume Farré

**Date** : 30 décembre 2025
**Auditeur** : Lalou
**Niveau** : Exhaustif - Section par section, texte par texte, bouton par bouton

---

# PARTIE 1 : ARCHITECTURE GLOBALE

## 1.1 Stack Technique

| Élément | Version | Observation |
|---------|---------|-------------|
| Next.js | 15.5.6 | OK - Version récente |
| React | 19.1.0 | OK - Version récente |
| TypeScript | 5.8.3 | OK |
| Tailwind CSS | 4.1.8 | OK |
| next-intl | 4.1.0 | OK |
| Stripe | 18.2.0 | OK |

### Préconisation ARCHITECTURE-001
**Problème** : Pas de tests automatisés (ni Jest, ni Vitest, ni Playwright)
**Impact** : Risque de régression à chaque déploiement
**Solution** : Ajouter au minimum des tests E2E sur les parcours critiques (panier, paiement)

### Préconisation ARCHITECTURE-002
**Problème** : Pas de CI/CD visible (GitHub Actions vide ?)
**Question** : Le déploiement se fait-il manuellement via SSH ?
**Solution** : Configurer GitHub Actions pour build automatique + déploiement

---

## 1.2 Structure des Fichiers

### Points Positifs
- Bonne organisation des pages dans `app/[locale]/`
- Composants bien séparés par domaine (`admin/`, `shop/`, `pages/`, `navigation/`)
- Contexts bien isolés
- Hooks custom réutilisables

### Points à Améliorer

### Préconisation ARCHITECTURE-003
**Problème** : Fichier `data/photo-metadata.json` (5588 lignes) stocké dans le repo
**Impact** : Risque de conflits Git, pas de versioning propre
**Solution** : Migrer vers base de données (PostgreSQL ou SQLite)

### Préconisation ARCHITECTURE-004
**Problème** : Beaucoup de fichiers de documentation (.md) dans le repo principal
**Impact** : Confusion, maintenance difficile
**Solution** : Créer un dossier `/docs/` ou `/documentation/` dédié

---

# PARTIE 2 : ANALYSE PAGE PAR PAGE

## 2.1 Homepage (/)

### Textes
| Élément | Texte actuel | Observation | Action |
|---------|--------------|-------------|--------|
| Hero carousel | Images + overlay | OK mais hauteur 80vh trop grande | Réduire à 60vh |
| Section artiste | "Guillaume Farré" | OK |  |
| Bio artiste | "Sculpteur et plasticien..." | Texte correct mais pas traduit en EN/IT | Vérifier traductions |

### Boutons
| Bouton | Texte | Action | Observation |
|--------|-------|--------|-------------|
| "Découvrir l'histoire" | Link | → /histoire | OK |
| "Voir toute la galerie" | Link | → /galerie | OK |

### Préconisation HOMEPAGE-001
**Problème** : Carousel trop rapide (5s) et trop grand (80vh)
**Solution** :
- Réduire height de 80vh à 60vh
- Ralentir autoplay de 5000ms à 9000ms
**Fichier** : `components/HeroCarousel.tsx`

### Préconisation HOMEPAGE-002
**Problème** : Section "Dernières œuvres" affiche des œuvres aléatoires à chaque refresh
**Question** : Est-ce intentionnel ou faut-il les fixer ?
**Solution possible** : Permettre à Guillaume de choisir les œuvres "featured" dans l'admin

---

## 2.2 Page /galerie

### Textes
| Élément | Observation |
|---------|-------------|
| Titre "Galerie" | OK - Éditable avec ?admin=true |
| Sous-titre | OK - "Trois séries photographiques" |

### Composants
| Composant | Observation |
|-----------|-------------|
| GalleryClient | Fonctionne bien |
| Lightbox | Élégant, immersif |
| Filtres | Fonctionnels |

### Préconisation GALERIE-001
**Problème** : Pas de lazy loading explicite sur les images de la grille masonry
**Solution** : Ajouter `loading="lazy"` sur les images

### Préconisation GALERIE-002
**Problème** : Le lightbox redirige vers /boutique mais pas vers la fiche produit spécifique
**Solution** : Modifier le CTA "Commander" pour pointer vers `/galerie-item/{slug}`

---

## 2.3 Page /boutique

### Textes
| Élément | Observation |
|---------|-------------|
| Hero tag "BOUTIQUE OFFICIELLE" | OK - Éditable |
| Stats (48, 22, 3, 26) | FAUX ! Les valeurs sont calculées dynamiquement mais les labels sont statiques |

### Préconisation BOUTIQUE-001
**Problème** : Les stats affichées sont incohérentes avec les données réelles
**Observation** : `stats.limitedEditions` = 0, `stats.unlimited` = 0 alors qu'il y a des photos
**Cause probable** : Les photos n'ont pas le champ `categories` correctement rempli
**Solution** : Audit du fichier photo-metadata.json + migration des données

### Préconisation BOUTIQUE-002
**Problème** : Section garanties ("Certificat authenticité", etc.) n'est pas éditable
**Solution** : Ajouter EditableText sur BoutiqueGarantiesContent.tsx - FAIT

### Préconisation BOUTIQUE-003
**Problème** : Les filtres "Éditions limitées" et "Pièces uniques" ne fonctionnent pas correctement
**Cause** : Les photos n'ont pas `edition.type` correctement défini
**Solution** : Corriger les données dans photo-metadata.json

---

## 2.4 Page /galerie-item/[slug]

### Composants
| Composant | Observation |
|-----------|-------------|
| AddToCartSection | Fonctionne mais prix hardcodés |
| Images multiples | OK - Affiche toutes les images de l'œuvre |

### Préconisation GALERIEITEM-001
**Problème** : Les prix sont HARDCODÉS dans AddToCartSection.tsx
```typescript
const FORMATS: Format[] = [
  { size: "60×40 cm", price: 1200, available: true },
  { size: "120×80 cm", price: 2400, available: true },
  // ...
];
```
**Impact** : Les vrais prix de lib/pricing-config.ts ne sont pas utilisés
**Solution** : Utiliser les prix depuis la configuration centrale

### Préconisation GALERIEITEM-002
**Problème** : Badge "Édition limitée 9 ex." est hardcodé
**Solution** : Afficher le vrai compteur depuis photo-metadata.json (limitedEditionGrand/limitedEditionPetit)

---

## 2.5 Page /histoire

### Textes
| Section | Observation |
|---------|-------------|
| Hero | OK - Éditable avec ?admin=true |
| Sections 01-04 | OK - Contenu riche et bien structuré |

### Préconisation HISTOIRE-001
**Problème** : Page très longue, pas d'ancres de navigation
**Solution** : Ajouter un sommaire cliquable en haut de page

---

## 2.6 Page /atelier

### Textes
| Élément | Observation |
|---------|-------------|
| Titre "L'Atelier" | OK - Éditable |
| Sections Ferrari | Contenu riche |

### Préconisation ATELIER-001
**Problème** : Les 4 cartes Ferrari (noire, grises) ont des descriptions génériques
**Question** : Guillaume veut-il personnaliser chaque description de voiture ?
**Solution** : Ajouter EditableText pour chaque description de voiture

---

## 2.7 Page /dino

### Textes
| Élément | Observation |
|---------|-------------|
| Titre "DINO" | OK - Éditable |
| Specs techniques | OK |
| Images | Proviennent d'Unsplash - Pas les vraies Dino de Guillaume |

### Préconisation DINO-001
**Problème** : Images Unsplash au lieu des vraies photos de la Dino de Guillaume
**Solution** : Remplacer par les vraies photos de l'atelier

### Préconisation DINO-002
**Problème** : Lien vers /dino-histoire - Page existe-t-elle ?
**Vérification** : OUI, page créée session 2025-12-07

---

## 2.8 Page /dino-histoire

### Textes
| Section | Observation |
|---------|-------------|
| Alfredo "Dino" Ferrari | Contenu historique correct |
| Moteur V6 | OK |
| 206 GT / 246 GT | OK |
| Images | Wikipedia Commons - OK pour le contexte historique |

### Préconisation DINOHISTOIRE-001
**Problème** : Certaines images Wikipedia peuvent être supprimées à l'avenir
**Solution** : Télécharger localement les images les plus importantes

---

## 2.9 Page /contact

### Éléments
| Élément | Observation |
|---------|-------------|
| Email | contact@guillaumefarre.com - À vérifier si existe |
| Téléphone | +33 6 12 34 56 78 - FAUX numéro placeholder |
| WhatsApp | Même faux numéro |
| Adresse | "75018 Paris" - Correct ? |

### Préconisation CONTACT-001
**Problème CRITIQUE** : Numéro de téléphone factice "+33 6 12 34 56 78"
**Impact** : Site non professionnel si quelqu'un appelle ce numéro
**Solution** : Remplacer par le vrai numéro de Guillaume ou retirer la section

### Préconisation CONTACT-002
**Problème** : Les boutons CTA ("Demander un rendez-vous", etc.) ne font rien
**Solution** : Implémenter les formulaires de contact ou au moins des mailto:

### Préconisation CONTACT-003
**Problème** : FAQ non éditable
**Solution** : Ajouter mode admin édition sur cette page

---

## 2.10 Page /concept-car-art

### Observation Générale
Page avec EMOJIS (contrairement aux règles du projet)

### Préconisation CONCEPTCARART-001
**Problème** : Emojis dans le titre "🏎️ Ferrari Live Performance"
**Règle** : Pas d'emojis sauf demande explicite
**Solution** : Retirer tous les emojis de cette page

### Préconisation CONCEPTCARART-002
**Problème** : Page non éditable avec ?admin=true
**Solution** : Créer ConceptCarArtContent.tsx avec EditableText

### Préconisation CONCEPTCARART-003
**Problème** : "V12 engine" mentionné mais les Dino ont des V6
**Vérification** : La Dino 246 a un V6 2.4L, pas un V12
**Solution** : Corriger le texte

---

## 2.11 Page /presse

### Observation Générale
Design très différent du reste du site (gradients bleus, style "gamer")

### Préconisation PRESSE-001
**Problème** : Style incohérent avec le reste du site (épuré, zinc, minimaliste)
**Solution** : Refaire la page en suivant le design system du site

### Préconisation PRESSE-002
**Problème** : Articles presse FACTICES (Le Monde, Forbes, Art Basel...)
**Impact** : Problème légal potentiel, fausses déclarations
**Question** : Ces articles existent-ils vraiment ?
**Solution** : Retirer les faux articles ou les remplacer par de vrais

### Préconisation PRESSE-003
**Problème** : Prix et distinctions probablement factifs
**Question** : Ces prix ont-ils été réellement gagnés ?
**Solution** : Vérifier avec Guillaume et retirer si faux

---

## 2.12 Page /origine

### Textes
| Section | Observation |
|---------|-------------|
| Timeline 1985-2025 | Contenu narratif de qualité |
| Citation finale | Élégante |

### Préconisation ORIGINE-001
**Problème** : Chiffres "47 collectionneurs", "12 performances", "850K€" sont-ils vrais ?
**Question** : Ces chiffres sont-ils réels ou aspirationnels ?
**Solution** : Vérifier avec Guillaume

---

## 2.13 Page /panier

### Composants
| Composant | Observation |
|-----------|-------------|
| PanierClient | Fonctionne |
| CartContext | Bien implémenté avec expiration 30 jours |

### Préconisation PANIER-001
**Problème** : Pas de validation des stocks avant paiement
**Impact** : Quelqu'un pourrait payer pour une édition épuisée
**Solution** : Vérifier disponibilité des éditions limitées avant checkout Stripe

---

# PARTIE 3 : PANEL ADMIN

## 3.1 Observations Générales

Le panel admin est TRÈS complet (870 lignes) avec :
- Upload photos avec drag & drop
- Détection de doublons
- Détection d'images similaires
- Suggestions de séries IA
- Configuration Instagram
- Dashboard commercial
- Gestionnaire de prix
- Filtres avancés
- Actions groupées

### Préconisation ADMIN-001
**Problème** : Page admin trop longue (870 lignes)
**Solution** : Découper en sous-composants/tabs

### Préconisation ADMIN-002
**Problème** : Pas de confirmation avant suppression définitive
**Solution** : Ajouter modal de confirmation

### Préconisation ADMIN-003
**Problème** : Les APIs admin ne sont pas protégées par authentification
**Fichier** : `app/api/admin/photos/route.ts` - Pas de vérification de cookie
**Impact** : N'importe qui peut modifier les photos via API
**Solution CRITIQUE** : Ajouter vérification du cookie gf_auth sur TOUTES les APIs admin

---

## 3.2 Mode Admin Édition Inline

### État actuel
Pages converties :
- ✅ /histoire
- ✅ /atelier
- ✅ /dino
- ✅ /dino-histoire
- ✅ /galerie
- ✅ /boutique
- ✅ Homepage

Pages NON converties :
- ❌ /contact
- ❌ /concept-car-art
- ❌ /presse
- ❌ /origine
- ❌ /faq
- ❌ /quiz
- ❌ /collectionneurs
- ❌ /favoris
- ❌ /comparer
- ❌ /actualites
- ❌ Pages légales (CGV, mentions, etc.)

### Préconisation ADMIN-004
**Action** : Convertir les pages restantes pour mode édition inline

---

# PARTIE 4 : UI/UX

## 4.1 Cohérence Visuelle

### Points Positifs
- Thème zinc cohérent sur la plupart des pages
- Typographie légère et élégante
- Espacements généreux

### Points Négatifs
- Page /presse avec style complètement différent
- Page /concept-car-art avec emojis
- Incohérence dans les tailles de boutons

### Préconisation UIUX-001
**Problème** : Tailles de boutons variables
- Certains `px-6 py-3`, d'autres `px-12 py-6`, d'autres `px-8 py-4`
**Solution** : Créer des variants de boutons standardisés

### Préconisation UIUX-002
**Problème** : Pas de design tokens centralisés
**Solution** : Créer un fichier de constantes pour espacements, tailles, etc.

---

## 4.2 Responsive

### Observations
- Navigation mobile : OK (hamburger menu)
- Grilles : OK (responsive cols)
- Images : OK (aspect ratios préservés)

### Préconisation UIUX-003
**Problème** : Hero carousel sur mobile prend trop de place (80vh)
**Solution** : Réduire à 50vh sur mobile

---

## 4.3 Performance

### Préconisation PERF-001
**Problème** : Images non optimisées (pas de WebP)
**Solution** : Utiliser next/image avec formats modernes

### Préconisation PERF-002
**Problème** : Pas de Service Worker / PWA
**Solution** : Ajouter manifest.json et service worker pour offline

---

# PARTIE 5 : SEO & ACCESSIBILITÉ

## 5.1 SEO

### Préconisation SEO-001
**Problème** : Pas de metadata dynamique sur les pages
**Solution** : Ajouter `generateMetadata` sur chaque page avec :
- title
- description
- openGraph
- twitter

### Préconisation SEO-002
**Problème** : Pas de sitemap.xml
**Solution** : Générer sitemap automatique avec next-sitemap

### Préconisation SEO-003
**Problème** : Pas de structured data (JSON-LD)
**Solution** : Ajouter schema.org pour :
- Person (Guillaume)
- ArtGallery
- Product (œuvres)
- Organization

---

## 5.2 Accessibilité

### Préconisation A11Y-001
**Problème** : Boutons sans aria-label
**Solution** : Ajouter aria-label sur tous les boutons icône

### Préconisation A11Y-002
**Problème** : Images sans alt descriptif
**Solution** : Améliorer les alt texts avec descriptions détaillées

### Préconisation A11Y-003
**Problème** : Contraste insuffisant sur certains textes gris
**Solution** : Vérifier ratio WCAG AA (4.5:1)

---

# PARTIE 6 : SÉCURITÉ

## 6.1 Authentification

### État actuel
- ✅ Middleware de protection fonctionnel
- ✅ Cookie httpOnly
- ✅ Mot de passe non exposé côté client

### Problème Critique

### Préconisation SECU-001
**CRITIQUE** : APIs admin non protégées
- `/api/admin/photos` : Pas de vérification auth
- `/api/admin/suggest-series` : Pas de vérification auth
- `/api/admin/delete-photo` : Pas de vérification auth
**Solution** : Ajouter vérification cookie sur TOUTES les routes /api/admin/*

### Préconisation SECU-002
**Problème** : Mot de passe en variable d'environnement mais fallback en dur
```typescript
const ADMIN_PASSWORD = process.env.SITE_PASSWORD || "LHOOQladino246";
```
**Solution** : Ne jamais avoir de fallback de mot de passe en dur

---

## 6.2 Données Sensibles

### Préconisation SECU-003
**Problème** : Clés Stripe en .env.local non versionnées mais mentionnées en clair dans la doc
**Solution** : S'assurer que .env.local est bien dans .gitignore

---

# PARTIE 7 : TRADUCTIONS

## 7.1 État des Traductions

| Langue | Couverture | Qualité |
|--------|------------|---------|
| FR | 100% | Source de vérité |
| EN | ~80% | Bonne mais incomplète |
| IT | ~80% | Bonne mais incomplète |

### Préconisation TRAD-001
**Problème** : Nouvelles clés ajoutées en FR non traduites en EN/IT
**Solution** : Script automatique avec DeepL API

### Préconisation TRAD-002
**Problème** : Certains textes hardcodés dans les composants (pas dans messages/)
**Exemple** : Page /contact avec FAQ en dur
**Solution** : Extraire vers messages/

---

# PARTIE 8 : DONNÉES

## 8.1 photo-metadata.json

### Préconisation DATA-001
**Problème** : 198 photos avec `categories: ["unlimited"]` mais le système attend `limited`
**Impact** : Compteurs boutique à 0
**Solution** : Migration des catégories

### Préconisation DATA-002
**Problème** : Champ `price` absent sur la plupart des photos
**Impact** : Prix affichés incorrects
**Solution** : Remplir les prix depuis pricing-config.ts

### Préconisation DATA-003
**Problème** : `limitedEditionGrand` et `limitedEditionPetit` non remplis
**Impact** : Pas de compteur d'éditions affiché
**Solution** : Initialiser ces champs pour toutes les photos en vente

---

# RÉSUMÉ DES PRÉCONISATIONS PAR PRIORITÉ

## CRITIQUE (À faire immédiatement)

1. **SECU-001** : Protéger APIs admin avec vérification cookie
2. **CONTACT-001** : Retirer faux numéro de téléphone
3. **PRESSE-002** : Retirer/corriger articles de presse factifs
4. **BOUTIQUE-001** : Corriger les stats affichées

## HAUTE (Cette semaine)

5. **ADMIN-003** : Protection authentification APIs
6. **GALERIEITEM-001** : Utiliser vrais prix depuis config
7. **DATA-001** : Migration catégories photos
8. **CONCEPTCARART-001** : Retirer emojis
9. **CONCEPTCARART-003** : Corriger "V12" en "V6"

## MOYENNE (Prochaines semaines)

10. **HOMEPAGE-001** : Ajuster carousel (taille/vitesse)
11. **PRESSE-001** : Refaire design page presse
12. **ADMIN-004** : Convertir pages restantes pour édition inline
13. **SEO-001** : Ajouter metadata dynamiques
14. **SEO-002** : Générer sitemap

## BASSE (Améliorations futures)

15. **ARCHITECTURE-001** : Ajouter tests E2E
16. **ARCHITECTURE-003** : Migrer metadata vers DB
17. **PERF-001** : Optimiser images WebP
18. **A11Y-001/002/003** : Améliorer accessibilité

---

# QUESTIONS POUR GUILLAUME

1. **Les articles de presse** (Le Monde, Forbes, Art Basel) sont-ils vrais ou factifs ?
2. **Les chiffres** (47 collectionneurs, 12 performances, 850K€) sont-ils réels ?
3. **Le numéro de téléphone** +33 6 12 34 56 78 est-il le vrai ?
4. **Les prix sur le site** correspondent-ils à ce que tu veux ?
5. **Les photos Dino** : Veux-tu remplacer les images Unsplash par tes vraies photos ?
6. **Les descriptions de chaque Ferrari** (noire, grises) : Veux-tu les personnaliser ?
7. **La photo rouge dans le carousel** : Veux-tu la remplacer ?
8. **L'ordre des œuvres sur la homepage** : Aléatoire ou fixe ?

---

**Fin de l'audit**
**Total préconisations** : 32
**Critiques** : 4
**Hautes** : 5
**Moyennes** : 5
**Basses** : 4
**Questions** : 8

Lalou - 30 décembre 2025
