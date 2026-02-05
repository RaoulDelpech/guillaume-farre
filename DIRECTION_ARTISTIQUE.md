# DIRECTION ARTISTIQUE - Guillaume Farré

**Document de référence pour la cohérence visuelle**
**Auteur**: Lalou | **Date**: 2025-01-20

---

## INSPIRATION

Galeries d'art contemporain haut de gamme :
- Pace Gallery
- Gagosian
- Hauser & Wirth
- Philippe Shangti (référence directe)

**Mots-clés** : Minimalisme, Élégance, Respiration, Contemplation

---

## PALETTE DE COULEURS

### Mode Sombre (principal)
| Nom | Hex | Usage |
|-----|-----|-------|
| Background | #1C1915 | Fond principal |
| Foreground | #EDE9E3 | Texte principal |
| Card | #26221C | Cartes, surfaces secondaires |
| Primary | #C4A570 | Accents dorés/bronze |
| Muted | #2E2922 | Fonds subtils |
| Muted-foreground | #A39A8E | Texte secondaire |
| Border | #38302A | Séparateurs |

### Mode Clair
| Nom | Hex | Usage |
|-----|-----|-------|
| Background | #FAF8F5 | Fond blanc cassé chaud |
| Foreground | #1C1915 | Texte principal |
| Primary | #A68D5E | Bronze doré |

---

## TYPOGRAPHIE

### Hiérarchie
| Élément | Classes Tailwind |
|---------|------------------|
| H1 Page | `text-5xl md:text-7xl font-light tracking-wide` |
| H2 Section | `text-3xl md:text-4xl font-light tracking-wide` |
| H3 Sous-section | `text-2xl md:text-3xl font-light tracking-wide` |
| Corps | `text-lg md:text-xl font-light leading-relaxed` |
| Label | `text-xs uppercase tracking-[0.2em] text-muted-foreground` |
| Navigation | `text-sm font-light tracking-wide` |

### Règles
- **UNE seule famille** : System sans-serif
- **Jamais font-bold** sur les titres (utiliser font-light ou font-normal)
- **Jamais text-8xl ou text-9xl** (trop grand)
- **tracking-wide** sur tous les titres

---

## ESPACEMENTS

### Sections
```
py-24 md:py-32  // Standard entre sections
py-16 md:py-20  // Compact (galeries, filtres)
py-12           // Minimal (liens, badges)
```

### Container
```
container px-6 lg:px-8  // Standard
max-w-4xl mx-auto       // Texte long
max-w-6xl mx-auto       // Grilles
```

### Entre éléments
```
gap-4 md:gap-6   // Grilles serrées
gap-8 md:gap-12  // Grilles espacées
gap-16 md:gap-20 // Entre blocs majeurs
mb-4  // Labels vers titres
mb-8  // Titres vers contenu
mb-16 // Entre sections dans une page
```

---

## IMAGES

### Règles absolues
- **Aucun filtre** (pas de filter-bw, filter-vintage, filter-warm)
- **Couleurs naturelles** toujours
- **Pas de bordures** sur les images
- **Pas d'ombres** (shadow-none)

### Aspect Ratios
| Usage | Ratio |
|-------|-------|
| Hero plein écran | 16/9 ou libre |
| Grille galerie | 4/3 ou 1/1 |
| Portrait | 3/4 |
| Vignette | 1/1 |

### Hover
```
group-hover:scale-105  // Léger zoom (PAS 110)
transition-transform duration-500
```

---

## BOUTONS / CTA

### Style principal
```tsx
<Link
  href="/..."
  className="px-8 py-4 border border-foreground/30 hover:border-foreground
             text-foreground font-light tracking-wide transition-all"
>
  Texte du bouton →
</Link>
```

### Style secondaire (plein)
```tsx
<button className="px-8 py-4 bg-foreground text-background
                   font-light tracking-wide transition-all hover:bg-foreground/90">
  Action
</button>
```

### Règles
- **Pas de rounded-full** sur les CTA principaux
- **Pas de bg-gradient** (gradient interdit)
- **Flèche →** après le texte pour les liens de navigation
- **Padding généreux** : px-8 py-4 minimum

---

## ANIMATIONS

### Transitions
```
transition-all duration-300   // Standard
transition-colors duration-200 // Hover couleur
transition-transform duration-500 // Zoom images
```

### Règles
- **Pas d'animate-bounce** (amateur)
- **Pas d'animate-pulse** visible (distrayant)
- Animations d'entrée : fadeIn uniquement, subtiles

---

## BACKGROUNDS

### Sections alternées
```
bg-background          // Standard
bg-muted/10            // Légèrement différent (PAS /20 ou /30)
```

### Overlays sur images
```
bg-black/30  // Léger
bg-black/50  // Standard pour texte
bg-gradient-to-t from-black/80 via-black/30 to-transparent  // Galeries
```

---

## GRILLES

### Galerie principale
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8
```

### 3 colonnes feature
```
grid md:grid-cols-3 gap-8 md:gap-12
```

### 2 colonnes texte/image
```
grid md:grid-cols-2 gap-12 md:gap-16 items-center
```

---

## NAVIGATION

### Desktop
```
bg-background/95 backdrop-blur-sm border-b border-border
h-20
```

### Liens
```
text-sm font-light tracking-wide hover:text-primary transition-colors
```

---

## FOOTER

```
bg-muted/10 border-t border-border
py-12 md:py-16
```

---

## INTERDICTIONS

| Interdit | Pourquoi |
|----------|----------|
| Emojis | Amateur |
| font-bold sur titres | Trop lourd |
| text-8xl/9xl | Trop grand |
| animate-bounce | Amateur |
| bg-gradient | Pas galerie d'art |
| Couleurs vives (red, orange, amber) | Hors palette |
| Bordures épaisses | Lourd |
| Ombres portées fortes | Pas minimaliste |
| filter-bw incohérent | Toutes images en couleur OU toutes en N&B |

---

## CHECKLIST PAR PAGE

### Homepage
- [ ] Hero : overlay bg-black/30, titre text-5xl md:text-7xl
- [ ] Citation : text-xl md:text-2xl italic
- [ ] Section Artiste : bg-muted/10
- [ ] Grille œuvres : hover scale-105

### Galerie
- [ ] Hero : bg-black/50 overlay
- [ ] Filtres : bg-muted/10, py-8
- [ ] Grille : gap-6 md:gap-8

### Dino
- [ ] Titre : text-5xl md:text-7xl (PAS 9xl)
- [ ] Pas de décorations rotate-45
- [ ] Sections : bg-muted/10 alternées

### Atelier
- [ ] Pas d'emojis
- [ ] Padding cohérent px-6 lg:px-8
- [ ] Chiffres étapes : text-xl (pas 3xl)

### Contact
- [ ] Formulaire centré max-w-xl
- [ ] Pas de FAQ redondante
- [ ] Contact direct : une ligne simple

---

Maintenu par: Lalou
