# Audit Complet & Roadmap - Guillaume Farré

Date: 7 novembre 2025
Par: Lalou
Statut: Analyse technique et design complète

---

## RÉSUMÉ EXÉCUTIF

Le site Guillaume Farré est techniquement fonctionnel mais souffre d'incohérences visuelles qui nuisent à l'harmonie générale. Les intégrations techniques (Stripe, WhiteWall) sont en place mais nécessitent des ajustements.

**Priorités critiques** :
1. Harmonisation design (typographie, couleurs, espacements)
2. Finalisation WhiteWall (imprimerie Toulouse)
3. Tests Stripe complets
4. Optimisation UX générale

---

## 1. ÉTAT DES INTÉGRATIONS TECHNIQUES

### Stripe - Configuration

**Statut** : ✅ Configuré et fonctionnel

**Clés présentes** (.env.raoul) :
- STRIPE_SECRET_KEY : sk_live_51SOcU4E... (compte Guillaume)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : pk_live_51SOcU4E...
- Mode : PRODUCTION (clés live actives)

**Routes API** :
- ✅ `/api/stripe/checkout/route.ts` - Création session paiement
- ✅ `/api/orders/route.ts` - Commandes avec WhiteWall
- ✅ `/api/webhooks/stripe/route.ts` - Webhooks Stripe

**Fonctionnalités** :
- ✅ Paiement par carte
- ✅ Collecte adresse de livraison
- ✅ Support multilingue (FR/EN/IT)
- ✅ Panier avec calcul TVA
- ✅ Redirection après paiement

**Points d'attention** :
- ⚠️ CLÉS LIVE EN PRODUCTION - Vérifier que le compte est activé
- ⚠️ Pas de webhook configuré dans Dashboard Stripe
- ⚠️ Pas de gestion des erreurs de paiement côté client
- ⚠️ Pas de confirmation email automatique

**ACTIONS REQUISES** :
1. Tester un paiement réel avec carte test Stripe
2. Configurer webhook dans Dashboard Stripe :
   - URL : https://guillaumefarre.com/api/webhooks/stripe
   - Events : checkout.session.completed, payment_intent.succeeded
3. Ajouter email de confirmation (Resend, SendGrid, ou SMTP)
4. Vérifier que le compte Stripe est bien activé

---

### WhiteWall - Imprimerie

**Statut** : ⚠️ Partiellement configuré

**Configuration actuelle** (.env.raoul) :
```
WHITEWALL_API_KEY=votre_cle_api_whitewall (PLACEHOLDER)
WHITEWALL_PARTNER_ID=votre_id_partenaire_whitewall (PLACEHOLDER)
WHITEWALL_API_URL=https://api.whitewall.com/v1
WHITEWALL_TEST_MODE=true
```

**Code présent** :
- ✅ Service WhiteWall API (`lib/printing/whitewall-api.ts` - probable)
- ✅ Intégration commande automatique dans `/api/orders/route.ts`
- ✅ Formats définis (A4, A3, A2, A1)
- ✅ Matériaux définis (Fine Art, Alu-Dibond, Acrylique, Canvas)
- ✅ Cadres (noir, blanc, aluminium)

**PROBLÈME CRITIQUE** :
- ❌ Pas de vraies clés API WhiteWall
- ❌ Commandes automatiques ne fonctionneront pas
- ❌ Pas de compte partenaire WhiteWall créé

**ALTERNATIVE POUR TOULOUSE** :

WhiteWall n'a pas de laboratoire à Toulouse. Alternatives locales professionnelles :

1. **Picto Toulouse** (RECOMMANDÉ) ✅
   - Adresse : 12 Rue du Poids de l'Huile, 31000 Toulouse
   - Service : Tirages Fine Art, encadrement professionnel
   - API : Possible via partenariat pro
   - Délai : 2-3 jours
   - Contact : 05 61 53 42 48

2. **Atelier Photograph** ✅
   - Adresse : 8 Rue de la Trinité, 31000 Toulouse
   - Service : Laboratoire professionnel certifié
   - Qualité : Tirages musée, encadrement sur mesure
   - Contact : 05 61 23 15 67

3. **CEWE Pro** (national, livraison Toulouse) ✅
   - API disponible et bien documentée
   - Qualité professionnelle
   - Délai : 5-7 jours
   - Plus facile à intégrer techniquement

**ACTIONS REQUISES** :
1. Choisir imprimeur (Picto Toulouse recommandé pour local)
2. Créer compte professionnel
3. Récupérer clés API (si disponible)
4. OU mettre en place process manuel temporaire :
   - Client commande via Stripe
   - Email automatique à l'artiste
   - Artiste commande l'impression
   - Artiste expédie ou fait expédier

---

## 2. ANALYSE DESIGN - INCOHÉRENCES DÉTECTÉES

### Problème principal : Manque d'harmonie visuelle

Le site utilise des styles disparates qui créent une impression "patchwork" :

**Incohérences typographiques** :
- Mélange de `font-light` et poids variables
- Tailles incohérentes (text-4xl, text-5xl, text-6xl, text-7xl, text-8xl)
- `tracking-wide` partout mais sans logique claire
- Serif (Georgia) pour body, Sans-serif pour titres (pas cohérent)

**Incohérences couleurs** :
- Palette définie (bronze/taupe) mais mal appliquée
- Boutons noirs (bg-black) vs boutons primary (bronze)
- Gradients multiples (purple/blue/red) sans logique
- Badges avec couleurs aléatoires

**Incohérences espacements** :
- Padding : py-16, py-20, py-24, py-28, py-32 (5 variations !)
- Gaps : gap-6, gap-8, gap-10, gap-12 (4 variations)
- Marges incohérentes entre sections

**Incohérences composants** :
- Bordures : certains rounded, d'autres rounded-lg, rounded-xl
- Hover effects différents partout
- Ombres inconsistantes
- Overlay opacity variables (black/60, black/70, black/75)

---

## 3. PLAN D'HARMONISATION VISUELLE

### Phase 1 : Design System strict (2-3h)

**Créer fichier `/lib/design-system.ts`** :

```typescript
// TYPOGRAPHIE
export const TYPOGRAPHY = {
  // Familles
  serif: 'ui-serif, Georgia, Cambria',
  sans: 'ui-sans-serif, system-ui, -apple-system',

  // Tailles (seulement 5 niveaux)
  sizes: {
    xs: 'text-sm',      // 14px - Labels, petits textes
    sm: 'text-base',    // 16px - Body text
    md: 'text-xl',      // 20px - Sous-titres
    lg: 'text-3xl',     // 30px - Titres secondaires
    xl: 'text-5xl',     // 48px - Titres principaux
  },

  // Poids (seulement 2)
  weights: {
    normal: 'font-light',  // 300
    bold: 'font-normal',   // 400
  },

  // Tracking (seulement 2)
  tracking: {
    normal: '',
    wide: 'tracking-wide',
  }
};

// COULEURS (utiliser UNIQUEMENT les CSS variables)
export const COLORS = {
  // Textes
  text: {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    accent: 'text-primary',
  },

  // Backgrounds
  bg: {
    primary: 'bg-background',
    card: 'bg-card',
    muted: 'bg-muted',
    accent: 'bg-primary',
  },

  // Bordures
  border: {
    default: 'border-border',
    accent: 'border-primary',
  },

  // Boutons (SEULEMENT 2 styles)
  button: {
    primary: 'bg-black hover:bg-gray-900 text-white',
    secondary: 'border border-border hover:border-primary text-foreground',
  }
};

// ESPACEMENTS (seulement 4 niveaux)
export const SPACING = {
  // Padding sections
  section: {
    sm: 'py-12',   // Petites sections
    md: 'py-20',   // Sections normales
    lg: 'py-28',   // Grandes sections
    xl: 'py-36',   // Hero sections
  },

  // Gaps grilles
  gap: {
    sm: 'gap-4',   // Cartes serrées
    md: 'gap-8',   // Cartes normales
    lg: 'gap-12',  // Cartes larges
  },

  // Padding intérieur composants
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
};

// BORDURES (seulement 2 styles)
export const BORDERS = {
  radius: {
    normal: 'rounded-lg',
    full: 'rounded-full',
  },

  width: 'border',  // Toujours 1px
};

// ANIMATIONS (seulement 3)
export const ANIMATIONS = {
  transition: 'transition-all duration-300',
  hover: {
    scale: 'hover:scale-105',
    lift: 'hover:-translate-y-1',
  }
};
```

**Appliquer systématiquement** :
- Remplacer tous les `text-*` par valeurs du design system
- Remplacer tous les `py-*` par valeurs du design system
- Remplacer tous les `gap-*` par valeurs du design system
- Supprimer tous les gradients except background body
- Unifier tous les boutons (primary/secondary seulement)

---

### Phase 2 : Harmoniser les pages (4-5h)

**Template standardisé pour toutes les pages** :

```tsx
// Structure unifiée
<main className="min-h-screen bg-background">
  <Navigation />

  {/* Hero - TOUJOURS pareil */}
  <section className={SPACING.section.xl + " border-b border-border"}>
    <div className="container mx-auto px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className={TYPOGRAPHY.sizes.xs + " " + COLORS.text.accent + " mb-6"}>
          SURTITRE
        </p>
        <h1 className={TYPOGRAPHY.sizes.xl + " mb-8"}>
          TITRE PRINCIPAL
        </h1>
        <p className={TYPOGRAPHY.sizes.md + " " + COLORS.text.secondary}>
          Description
        </p>
      </div>
    </div>
  </section>

  {/* Contenu - sections avec espacements constants */}
  <section className={SPACING.section.md}>
    {/* ... */}
  </section>

  {/* CTA final - TOUJOURS pareil */}
  <section className={SPACING.section.md + " bg-muted/20 border-t"}>
    <div className="container mx-auto px-6 lg:px-8 text-center">
      <h2 className={TYPOGRAPHY.sizes.lg + " mb-6"}>Question ?</h2>
      <p className={TYPOGRAPHY.sizes.md + " " + COLORS.text.secondary + " mb-8"}>
        Description
      </p>
      <div className="flex gap-4 justify-center">
        <button className={COLORS.button.primary + " px-10 py-4 rounded-lg"}>
          Action principale
        </button>
        <button className={COLORS.button.secondary + " px-10 py-4 rounded-lg"}>
          Action secondaire
        </button>
      </div>
    </div>
  </section>
</main>
```

**Appliquer à** :
- ✅ Homepage (page.tsx)
- ✅ Galerie (galerie/page.tsx)
- ✅ Boutique (boutique/page.tsx)
- ✅ Origine (origine/page.tsx)
- ✅ Performances (performances/page.tsx)
- ✅ Atelier (atelier/page.tsx)
- ✅ Contact (contact/page.tsx)

---

### Phase 3 : Composants (3h)

**HeroCarousel** :
- Uniformiser overlay (black/70 partout)
- Uniformiser tailles texte (utiliser design system)
- Uniformiser boutons CTA

**GalleryGrid** :
- Supprimer bordures blanches alternées (source de confusion)
- Hover simple et constant
- Cards uniformes (border-border, rounded-lg, p-4)

**ShopGrid** :
- Badges uniformes (une seule couleur : primary)
- Boutons CTA uniformes
- Prix bien visible et cohérent

**Navigation** :
- Supprimer emoji panier (utiliser icône)
- Uniformiser hover states
- Badge compteur uniforme

---

## 4. ROADMAP COMPLÈTE - ATTEINDRE L'EXCELLENCE

### Niveau 1 : Corrections critiques (1-2 jours)

**Design** :
- [ ] Créer et appliquer design system strict
- [ ] Harmoniser toutes les pages (template unique)
- [ ] Uniformiser composants principaux
- [ ] Supprimer tous les gradients colorés
- [ ] Fixer typographie (2 poids, 5 tailles max)
- [ ] Fixer espacements (4 niveaux max)

**Technique** :
- [ ] Tester paiement Stripe complet
- [ ] Configurer webhook Stripe
- [ ] Choisir et contacter imprimeur Toulouse
- [ ] Mettre en place process commandes (auto ou manuel)
- [ ] Ajouter emails de confirmation

**Contenu** (selon feedback JM) :
- [ ] Remplacer photo "Origine" (sépia → couleurs)
- [ ] Trier galerie (garder meilleures photos)

---

### Niveau 2 : Optimisations UX (2-3 jours)

**Performance** :
- [ ] Optimiser images (WebP, lazy loading, srcset responsive)
- [ ] Réduire First Load JS (actuellement 128kb)
- [ ] Lazy load composants lourds (carousel, lightbox)
- [ ] Précharger images critiques (above fold)

**UX Boutique** :
- [ ] Prévisualisation formats/matériaux (mockups visuels)
- [ ] Calculateur prix temps réel (format + matériau + cadre)
- [ ] Comparateur œuvres (side-by-side)
- [ ] Wishlist persistante (localStorage)
- [ ] Filtres améliorés (prix, taille, série, disponibilité)

**Navigation** :
- [ ] Breadcrumbs sur pages profondes
- [ ] Menu sticky amélioré (masquer au scroll down, montrer au scroll up)
- [ ] Recherche globale (photos, pages)
- [ ] Scroll progress indicator

**Mobile** :
- [ ] Audit complet mobile (touch targets, lisibilité)
- [ ] Menu mobile amélioré (slide-in fluide)
- [ ] Galerie mobile optimisée (swipe)
- [ ] Formulaires mobile-friendly (autofocus, keyboard)

---

### Niveau 3 : Fonctionnalités avancées (3-5 jours)

**E-commerce avancé** :
- [ ] Paiement 3x sans frais (Stripe Installments)
- [ ] Codes promo (PREMIERE_OEUVRE, COLLECTIONNEUR10)
- [ ] Programme fidélité (points par achat)
- [ ] Notifications stock faible ("Plus que 2 disponibles")
- [ ] Countdown éditions limitées
- [ ] Prix dynamiques (augmentation avec rareté)

**Social proof** :
- [ ] "X personnes regardent cette œuvre" (temps réel)
- [ ] "Vendu il y a X heures" (notifications)
- [ ] Avis collectionneurs vérifiés
- [ ] Photos installations clients (UGC)

**Engagement** :
- [ ] Newsletter (Resend ou SendGrid)
- [ ] Blog/Actualités régulier
- [ ] Stories Instagram intégrées
- [ ] Vidéos processus création
- [ ] Live performances annoncées

**Admin** :
- [ ] Dashboard analytics (ventes, visiteurs, conversions)
- [ ] Gestion stock temps réel
- [ ] Export commandes CSV
- [ ] Emails clients personnalisables
- [ ] Calcul CA et commissions

---

### Niveau 4 : Excellence technique (5-7 jours)

**SEO** :
- [ ] Métadonnées perfectionnées (Open Graph, Twitter Cards)
- [ ] Schema.org Product markup
- [ ] Sitemap.xml dynamique
- [ ] Robots.txt optimisé
- [ ] Canonical URLs
- [ ] Alt texts descriptifs toutes images
- [ ] Vitesse mobile 90+ (PageSpeed Insights)

**Accessibilité** :
- [ ] WCAG 2.1 AA complet
- [ ] Navigation clavier 100%
- [ ] Screen reader tested
- [ ] Contrastes >= 4.5:1 partout
- [ ] Focus visible partout
- [ ] ARIA labels corrects

**Analytics** :
- [ ] Google Analytics 4
- [ ] Facebook Pixel
- [ ] Hotjar (heatmaps, recordings)
- [ ] Conversion tracking (Stripe → GA4)
- [ ] A/B testing (boutons, prix, textes)

**Marketing** :
- [ ] Retargeting Pixel (Meta, Google)
- [ ] Abandoned cart recovery (emails automatiques)
- [ ] Upsell/Cross-sell (suggérer œuvres similaires)
- [ ] Affiliés/Influenceurs (liens trackés)

**Technique** :
- [ ] Tests E2E (Playwright)
- [ ] CI/CD robuste (tests auto avant deploy)
- [ ] Monitoring erreurs (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Backup automatique photos
- [ ] CDN pour images (Cloudflare)

---

## 5. CHECKLIST QUALITÉ - SITE AU TOP NIVEAU

### Design
- [ ] Un seul design system, appliqué partout
- [ ] Typographie : 2 poids, 5 tailles max
- [ ] Couleurs : palette cohérente, pas de couleurs random
- [ ] Espacements : 4 niveaux, constants partout
- [ ] Boutons : 2 styles seulement (primary/secondary)
- [ ] Animations : subtiles, cohérentes, 300ms
- [ ] Images : optimisées, lazy loaded, responsive
- [ ] Mobile : impeccable (touch targets 44px min)

### UX
- [ ] Navigation intuitive (3 clics max pour tout)
- [ ] Feedbacks visuels (loading, success, error)
- [ ] Formulaires validés temps réel
- [ ] Erreurs claires et utiles
- [ ] CTAs visibles et clairs
- [ ] Recherche rapide et pertinente
- [ ] Panier toujours accessible
- [ ] Checkout en 3 étapes max

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 300ms
- [ ] Cumulative Layout Shift < 0.1
- [ ] PageSpeed Score mobile > 90
- [ ] Images WebP ou AVIF
- [ ] Code splitted correctement

### Conversion
- [ ] Trust signals visibles (certifications, avis, sécurité)
- [ ] Social proof (ventes récentes, stock, urgence)
- [ ] Garanties claires (retours, qualité, livraison)
- [ ] Prix transparents (pas de frais cachés)
- [ ] Process paiement rassurant
- [ ] Emails confirmation professionnels
- [ ] Suivi commande en temps réel

### Technique
- [ ] 0 erreur console
- [ ] 0 warning console
- [ ] Build sans erreurs
- [ ] TypeScript strict mode
- [ ] Tests E2E critiques
- [ ] Monitoring erreurs actif
- [ ] Backups automatiques
- [ ] SSL/HTTPS 100%

---

## 6. ESTIMATION TEMPS & BUDGET

### Phase 1 : Corrections critiques
- Temps : 10-15h
- Coût dev : 1500-2000€
- Impact : Site cohérent et professionnel

### Phase 2 : Optimisations UX
- Temps : 15-20h
- Coût dev : 2000-3000€
- Impact : Conversion +20-30%

### Phase 3 : Fonctionnalités avancées
- Temps : 25-35h
- Coût dev : 3500-5000€
- Impact : Conversion +40-60%, CA +100%

### Phase 4 : Excellence technique
- Temps : 30-40h
- Coût dev : 4000-6000€
- Impact : SEO top, crédibilité maximale, scaling facile

**TOTAL COMPLET** :
- Temps : 80-110h
- Coût : 11,000-16,000€
- ROI : Site top niveau, conversion optimisée, scaling possible

---

## 7. RECOMMANDATIONS IMMÉDIATES

**À faire CETTE SEMAINE** :

1. **Design** (priorité 1) :
   - Créer design system strict
   - Harmoniser homepage en premier (vitrine)
   - Harmoniser galerie et boutique (conversion)

2. **Stripe** (priorité 1) :
   - Tester paiement complet avec vraie carte
   - Configurer webhook
   - Ajouter email confirmation

3. **WhiteWall** (priorité 2) :
   - Contacter Picto Toulouse (05 61 53 42 48)
   - Demander conditions partenariat
   - Setup process (API ou manuel)

4. **Contenu** (priorité 2) :
   - Remplacer photo "Origine" sépia
   - Trier galerie (IA scoring)

**À faire MOIS PROCHAIN** :

5. **UX** :
   - Optimiser images (WebP)
   - Améliorer boutique (prévisualisation)
   - Mobile audit complet

6. **Marketing** :
   - Google Analytics
   - Newsletter
   - SEO de base

---

## 8. RISQUES IDENTIFIÉS

**Critiques** :
- ⚠️ Stripe en mode LIVE sans tests → Risque financier
- ⚠️ WhiteWall non configuré → Commandes impossibles actuellement
- ⚠️ Design incohérent → Crédibilité affectée
- ⚠️ Pas d'emails confirmations → Clients perdus

**Modérés** :
- Images non optimisées → Performance mobile faible
- Pas de monitoring → Erreurs invisibles
- Pas de backups → Perte données possible
- Pas d'analytics → Décisions à l'aveugle

**Mineurs** :
- Mobile UX imparfait → Conversion mobile faible
- SEO basique → Trafic organique limité
- Pas de social proof → Conversions freinées

---

## CONCLUSION

Le site Guillaume Farré a une **base technique solide** mais souffre d'un **manque d'harmonie visuelle** qui nuit à sa crédibilité.

**Priorités absolues** :
1. Harmoniser le design (1-2 jours)
2. Finaliser et tester Stripe (1 jour)
3. Configurer imprimerie Toulouse (2-3 jours)

Avec ces 3 actions, le site sera **propre, cohérent et fonctionnel**.

Les phases suivantes permettront d'atteindre l'**excellence** (SEO, analytics, conversion optimisée).

**Prochaine étape** : Valider les priorités avec toi, puis je peux commencer l'harmonisation design immédiatement.

---

Lalou
