# Module Early Access

## Description

Module de gestion de l'accès anticipé pour le site Guillaume Farré.
Période : avant le 15 mai 2026.

## Composants

### EarlyAccessOverlay.tsx
Overlay de bienvenue affichée une seule fois (cookie `gf_early_seen`).
- Texte personnel de Guillaume
- Compteur de jours avant ouverture
- Lien email + bouton CTA
- Animation douce (framer-motion)

### EarlyAccessCountdown.tsx
Compteur homepage affiché entre Navigation et HeroCarousel.
- "Ouverture au public dans X jours"
- Après le 15 mai : message de transition pendant 7 jours
- Disparaît complètement après

## Logique

Voir `lib/early-access.ts` :
- `isEarlyAccess()` : true avant le 15 mai 2026
- `daysUntilOpening()` : nombre de jours restants
- `isTransitionPeriod()` : 7 jours après ouverture
- `getCountdownText()` : texte formaté selon période

## Variables d'environnement

Override possible avec `NEXT_PUBLIC_EARLY_ACCESS_OVERRIDE` :
- `'true'` : force early access actif (tests)
- `'false'` : force early access inactif (tests)
- undefined : utilise la date réelle

## Intégration

- **Layout** : `<EarlyAccessOverlay />` après `<CartProvider>`
- **Homepage** : `<EarlyAccessCountdown />` après `<Navigation />`

Lalou
