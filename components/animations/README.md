# Composants d'Animation Ultra-Luxe

Collection de 6 composants d'animation sobres et cinématiques pour galerie d'art.

Stack : GSAP + Lenis + Framer Motion
Style : Élégant, pas flashy. Inspiration Gagosian.

---

## 1. SmoothScroll

**Provider global** pour smooth scroll Lenis.

### Usage
```tsx
// app/layout.tsx
import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
```

### Configuration
- Duration : 1.2s
- Easing : exponentiel
- Respecte `prefers-reduced-motion`
- Synchronisé avec GSAP ScrollTrigger

---

## 2. ScrollReveal

**Wrapper générique** pour révéler éléments au scroll.

### Props
```typescript
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;         // Délai avant animation (default 0)
  duration?: number;      // Durée animation (default 1.2)
  y?: number;            // Translation Y initiale (default 60)
  className?: string;
}
```

### Usage
```tsx
import ScrollReveal from "@/components/animations/ScrollReveal";

<ScrollReveal delay={0.2} y={80}>
  <div className="card">Contenu</div>
</ScrollReveal>
```

### Animation
- From : `{ y: 60, opacity: 0 }`
- To : `{ y: 0, opacity: 1 }`
- Ease : `power3.out`
- Trigger : start `top 85%`
- Once only (pas de replay)

---

## 3. TextReveal

**Split text** lettre par lettre avec stagger.

### Props
```typescript
interface TextRevealProps {
  children: string;        // Texte à animer
  tag?: "h1" | "h2" | "p"; // Tag HTML (default "h1")
  delay?: number;          // Délai avant animation
  className?: string;
}
```

### Usage
```tsx
import TextReveal from "@/components/animations/TextReveal";

<TextReveal tag="h1" delay={0.3} className="text-4xl">
  Galerie d'art contemporain
</TextReveal>
```

### Animation
- Split caractère par caractère (espaces = `&nbsp;`)
- Stagger : 0.03s entre chaque lettre
- Duration : 0.8s par lettre
- From : `{ y: 30, opacity: 0 }`
- To : `{ y: 0, opacity: 1 }`
- Ease : `power3.out`

---

## 4. LineReveal

**Ligne horizontale** qui s'étend du centre.

### Props
```typescript
interface LineRevealProps {
  color?: string;   // Couleur ligne (default "rgba(196,165,112,0.4)")
  width?: string;   // Largeur ligne (default "12rem")
  delay?: number;   // Délai avant animation
  className?: string;
}
```

### Usage
```tsx
import LineReveal from "@/components/animations/LineReveal";

<LineReveal
  color="rgba(196,165,112,0.4)"
  width="16rem"
  delay={0.5}
  className="mx-auto my-8"
/>
```

### Animation
- scaleX : `0 → 1`
- transformOrigin : `center`
- Duration : 1.2s
- Ease : `power2.inOut`
- Trigger : start `top 90%`

---

## 5. ImageReveal

**Révèle image** par clip-path + zoom out subtil.

### Props
```typescript
interface ImageRevealProps {
  children: React.ReactNode;  // Image ou contenu
  delay?: number;            // Délai avant animation
  className?: string;
}
```

### Usage
```tsx
import ImageReveal from "@/components/animations/ImageReveal";
import Image from "next/image";

<ImageReveal delay={0.4}>
  <Image
    src="/images/photo.jpg"
    alt="Description"
    width={800}
    height={600}
    className="w-full h-auto"
  />
</ImageReveal>
```

### Animation
- clipPath : `inset(50% 50% 50% 50%) → inset(0% 0% 0% 0%)`
- scale : `1.15 → 1` (zoom out simultané)
- Duration : 1.4s
- Ease : `power4.inOut`
- Trigger : start `top 80%`

---

## 6. MagneticButton

**Bouton magnétique** qui suit légèrement le curseur.

### Props
```typescript
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;  // Force attraction (default 0.3)
}
```

### Usage
```tsx
import MagneticButton from "@/components/animations/MagneticButton";

<MagneticButton
  strength={0.4}
  className="px-8 py-4 bg-black text-white rounded"
>
  Découvrir
</MagneticButton>
```

### Comportement
- **Desktop only** : vérifie `(hover: hover)`
- onMouseMove : calcul deltaX/deltaY depuis centre bouton
- Animation : `duration 0.4s, ease power2.out`
- onMouseLeave : retour élastique `duration 0.7s, ease elastic.out(1, 0.4)`
- Mobile : pas d'effet (performances)

---

## Import groupé

```tsx
// Tous les composants d'un coup
import {
  ScrollReveal,
  TextReveal,
  LineReveal,
  ImageReveal,
  MagneticButton,
} from "@/components/animations";
```

---

## Accessibilité

Tous les composants respectent `prefers-reduced-motion` :
- Si activé → affichage direct, sans animation
- Méthode : `window.matchMedia("(prefers-reduced-motion: reduce)")`

---

## Performance

- Cleanup automatique des ScrollTrigger au unmount
- GSAP context pour isolation
- Lenis RAF synchronisé avec GSAP ticker
- Mobile : animations optimisées (pas de smoothTouch)

---

## Exemple complet

```tsx
"use client";

import SmoothScroll from "@/components/SmoothScroll";
import {
  ScrollReveal,
  TextReveal,
  LineReveal,
  ImageReveal,
  MagneticButton,
} from "@/components/animations";
import Image from "next/image";

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-950 text-white">
        {/* Hero */}
        <section className="h-screen flex flex-col items-center justify-center">
          <TextReveal tag="h1" className="text-6xl font-light mb-8">
            Galerie Guillaume Farré
          </TextReveal>

          <LineReveal width="20rem" className="mb-12" />

          <ScrollReveal delay={0.6}>
            <p className="text-xl text-zinc-400 max-w-2xl text-center">
              Art automobile, sculptures cinétiques
            </p>
          </ScrollReveal>
        </section>

        {/* Galerie */}
        <section className="py-24 px-8">
          <ScrollReveal delay={0.2}>
            <h2 className="text-4xl font-light text-center mb-16">
              Œuvres récentes
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ImageReveal delay={0.3}>
              <Image
                src="/images/work1.jpg"
                alt="Œuvre 1"
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </ImageReveal>

            <ImageReveal delay={0.5}>
              <Image
                src="/images/work2.jpg"
                alt="Œuvre 2"
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </ImageReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 flex justify-center">
          <MagneticButton
            strength={0.3}
            className="px-12 py-6 bg-white text-black rounded-full text-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            Découvrir le catalogue
          </MagneticButton>
        </section>
      </main>
    </SmoothScroll>
  );
}
```

---

**Auteur** : Lalou
**Projet** : Guillaume Farré
**Style** : Galerie d'art ultra-luxe, sobre, cinématique
**Inspiration** : Gagosian, pas Las Vegas
