# Composants Open Source Recommandés - Guillaume Farré

Date: 2025-11-08
Projet: Site artiste + boutique Fine Art

---

## 🎨 INTERFACE UTILISATEUR (SITE PUBLIC)

### Galerie & Images

1. **react-easy-crop** ✅ DÉJÀ INSTALLÉ
   - Usage: Crop/rotation photos dans admin
   - License: MIT
   - Installation: `npm install react-easy-crop`
   - Priorité: HAUTE

2. **yet-another-react-lightbox**
   - Usage: Lightbox moderne pour galerie (remplacer actuel)
   - Features: Zoom, fullscreen, swipe, thumbnails
   - License: MIT
   - Installation: `npm install yet-another-react-lightbox`
   - Priorité: MOYENNE
   - URL: https://yet-another-react-lightbox.com/

3. **react-photo-album**
   - Usage: Grille masonry responsive avancée
   - Features: Layout automatique, lazy loading
   - License: MIT
   - Installation: `npm install react-photo-album`
   - Priorité: MOYENNE

4. **react-compare-slider**
   - Usage: Comparaison avant/après (tableaux vs photos)
   - License: MIT
   - Installation: `npm install react-compare-slider`
   - Priorité: BASSE

### UI Components (shadcn/ui manquants)

5. **Dialog / Modal**
   - Usage: Modales pour confirmations, édition
   - Installation: Créer `components/ui/dialog.tsx`
   - Priorité: HAUTE
   - Utilisation: Confirmations suppression, édition photos

6. **Toast / Sonner**
   - Usage: Notifications élégantes (succès, erreurs)
   - License: MIT
   - Installation: `npm install sonner`
   - Priorité: HAUTE
   - Alternative: `react-hot-toast`

7. **Tabs**
   - Usage: Onglets dans admin (infos, metadata, IA)
   - Installation: Créer `components/ui/tabs.tsx`
   - Priorité: MOYENNE

8. **Progress**
   - Usage: Barre progression upload/traitement images
   - Installation: Créer `components/ui/progress.tsx`
   - Priorité: HAUTE

9. **Skeleton**
   - Usage: Loading states élégants
   - Installation: Créer `components/ui/skeleton.tsx`
   - Priorité: MOYENNE

10. **Popover**
    - Usage: Info-bulles riches, menus contextuels
    - Installation: Créer `components/ui/popover.tsx`
    - Priorité: MOYENNE

### Navigation & UX

11. **react-scroll**
    - Usage: Smooth scroll vers sections
    - License: MIT
    - Installation: `npm install react-scroll`
    - Priorité: BASSE

12. **framer-motion**
    - Usage: Animations fluides (déjà installé?)
    - License: MIT
    - Installation: `npm install framer-motion`
    - Priorité: MOYENNE
    - Utilisation: Transitions galerie, hover effects

---

## 🛠️ INTERFACE ADMIN

### Gestion Images

13. **react-dropzone**
    - Usage: Drag & drop fichiers avancé
    - Features: Multi-files, preview, validation
    - License: MIT
    - Installation: `npm install react-dropzone`
    - Priorité: HAUTE
    - Note: Peut remplacer DragDropUpload actuel

14. **react-image-crop**
    - Usage: Alternative à react-easy-crop
    - License: MIT
    - Installation: `npm install react-image-crop`
    - Priorité: BASSE (déjà react-easy-crop)

15. **compressorjs**
    - Usage: Compression images côté client avant upload
    - License: MIT
    - Installation: `npm install compressorjs`
    - Priorité: HAUTE
    - Benefit: Réduit bande passante upload

16. **exifr**
    - Usage: Extraction metadata EXIF photos
    - Features: Date, appareil, GPS, orientation
    - License: MIT
    - Installation: `npm install exifr`
    - Priorité: MOYENNE

### Tableaux & Listes

17. **@tanstack/react-table**
    - Usage: Tableau admin photos avec tri/filtres
    - Features: Tri, pagination, filtres, export
    - License: MIT
    - Installation: `npm install @tanstack/react-table`
    - Priorité: HAUTE
    - Utilisation: Vue tableau photos (alternative grille)

18. **react-virtualized** ou **@tanstack/react-virtual**
    - Usage: Virtualisation liste 1000+ photos
    - Features: Performance optimale grandes listes
    - License: MIT
    - Installation: `npm install @tanstack/react-virtual`
    - Priorité: MOYENNE

### Data Visualization

19. **recharts**
    - Usage: Graphiques ventes/stats
    - Features: Courbes, barres, camemberts
    - License: MIT
    - Installation: `npm install recharts`
    - Priorité: MOYENNE
    - Utilisation: Dashboard commercial

20. **react-chartjs-2**
    - Usage: Alternative Recharts (plus léger)
    - License: MIT
    - Installation: `npm install react-chartjs-2 chart.js`
    - Priorité: MOYENNE

### Formulaires

21. **react-hook-form**
    - Usage: Gestion formulaires performante
    - Features: Validation, erreurs, états
    - License: MIT
    - Installation: `npm install react-hook-form`
    - Priorité: HAUTE
    - Utilisation: Formulaires admin, contact

22. **zod**
    - Usage: Validation schéma TypeScript
    - Works with: react-hook-form
    - License: MIT
    - Installation: `npm install zod`
    - Priorité: HAUTE

### Éditeur de Texte

23. **tiptap**
    - Usage: Éditeur WYSIWYG descriptions
    - Features: Markdown, formatting, extensions
    - License: MIT
    - Installation: `npm install @tiptap/react @tiptap/starter-kit`
    - Priorité: MOYENNE
    - Utilisation: Descriptions longues œuvres

24. **react-quill**
    - Usage: Alternative Tiptap (plus simple)
    - License: BSD
    - Installation: `npm install react-quill`
    - Priorité: BASSE

---

## 🔧 OPTIMISATION & PERFORMANCE

### Images

25. **plaiceholder**
    - Usage: Placeholder blurred images
    - Features: LQIP (Low Quality Image Placeholder)
    - License: MIT
    - Installation: `npm install plaiceholder sharp`
    - Priorité: HAUTE
    - Benefit: Meilleure UX chargement

26. **sharp** ✅ DÉJÀ INSTALLÉ
    - Usage: Traitement images serveur
    - Features: Resize, crop, format, optimize
    - Priorité: HAUTE

27. **image-conversion**
    - Usage: Conversion format client-side
    - Features: WebP, AVIF, compression
    - License: MIT
    - Installation: `npm install image-conversion`
    - Priorité: MOYENNE

### Performance

28. **@vercel/analytics**
    - Usage: Analytics Vercel (gratuit tier)
    - License: MIT
    - Installation: `npm install @vercel/analytics`
    - Priorité: HAUTE

29. **@vercel/speed-insights**
    - Usage: Métriques performance réelles
    - License: MIT
    - Installation: `npm install @vercel/speed-insights`
    - Priorité: MOYENNE

30. **react-lazy-load-image-component**
    - Usage: Lazy loading images avancé
    - Features: Blur, fade, intersection observer
    - License: MIT
    - Installation: `npm install react-lazy-load-image-component`
    - Priorité: MOYENNE

---

## 📊 ANALYTICS & SEO

31. **next-sitemap**
    - Usage: Génération sitemap.xml automatique
    - License: MIT
    - Installation: `npm install next-sitemap`
    - Priorité: HAUTE
    - Config: Créer `next-sitemap.config.js`

32. **next-seo**
    - Usage: SEO meta tags simplifiés
    - License: MIT
    - Installation: `npm install next-seo`
    - Priorité: HAUTE

33. **@analytics/google-analytics**
    - Usage: Google Analytics 4
    - License: MIT
    - Installation: `npm install @analytics/google-analytics`
    - Priorité: MOYENNE

---

## 🎯 E-COMMERCE & PAIEMENTS

34. **@stripe/stripe-js** ✅ DÉJÀ UTILISÉ
    - Usage: Paiements Stripe
    - Priorité: HAUTE

35. **react-stripe-js**
    - Usage: Composants Stripe React
    - License: MIT
    - Installation: `npm install @stripe/react-stripe-js`
    - Priorité: HAUTE

---

## 📱 MOBILE & RESPONSIVE

36. **react-responsive**
    - Usage: Breakpoints React hooks
    - License: MIT
    - Installation: `npm install react-responsive`
    - Priorité: BASSE (Tailwind suffit)

37. **react-device-detect**
    - Usage: Détection mobile/desktop
    - License: MIT
    - Installation: `npm install react-device-detect`
    - Priorité: BASSE

---

## 🔐 SÉCURITÉ & AUTH

38. **bcrypt**
    - Usage: Hash mot de passe admin
    - License: MIT
    - Installation: `npm install bcrypt @types/bcrypt`
    - Priorité: HAUTE
    - Note: Remplacer password en clair actuel

39. **jose**
    - Usage: JWT tokens sécurisés
    - License: MIT
    - Installation: `npm install jose`
    - Priorité: HAUTE
    - Utilisation: Auth admin persistante

40. **next-auth**
    - Usage: Auth complète Next.js
    - License: ISC
    - Installation: `npm install next-auth`
    - Priorité: MOYENNE
    - Alternative: Auth manuelle actuelle

---

## 📧 COMMUNICATION

41. **nodemailer**
    - Usage: Envoi emails (confirmations commandes)
    - License: MIT
    - Installation: `npm install nodemailer`
    - Priorité: HAUTE

42. **react-email**
    - Usage: Templates emails React
    - License: MIT
    - Installation: `npm install react-email @react-email/components`
    - Priorité: MOYENNE
    - Benefit: Emails beaux + responsive

---

## 🗄️ DATA & STATE

43. **swr**
    - Usage: Cache données API
    - Features: Revalidation, offline
    - License: MIT
    - Installation: `npm install swr`
    - Priorité: MOYENNE

44. **zustand**
    - Usage: State management léger
    - License: MIT
    - Installation: `npm install zustand`
    - Priorité: BASSE (useState suffit)

---

## 🧪 TESTING (Important!)

45. **vitest**
    - Usage: Tests unitaires rapides
    - License: MIT
    - Installation: `npm install -D vitest`
    - Priorité: HAUTE

46. **@testing-library/react**
    - Usage: Tests composants React
    - License: MIT
    - Installation: `npm install -D @testing-library/react`
    - Priorité: HAUTE

47. **playwright**
    - Usage: Tests E2E navigateur
    - License: Apache 2.0
    - Installation: `npm install -D @playwright/test`
    - Priorité: MOYENNE

---

## 🛡️ QUALITÉ CODE

48. **prettier** ✅ (vérifier config)
    - Usage: Formatage code
    - License: MIT
    - Installation: `npm install -D prettier`
    - Priorité: HAUTE

49. **eslint-plugin-react-hooks**
    - Usage: Lint hooks React
    - License: MIT
    - Installation: `npm install -D eslint-plugin-react-hooks`
    - Priorité: HAUTE

50. **husky**
    - Usage: Git hooks (pre-commit checks)
    - License: MIT
    - Installation: `npm install -D husky`
    - Priorité: MOYENNE

51. **lint-staged**
    - Usage: Lint fichiers staged
    - Works with: husky
    - License: MIT
    - Installation: `npm install -D lint-staged`
    - Priorité: MOYENNE

---

## 🌐 INTERNATIONALISATION

52. **next-intl** ✅ DÉJÀ INSTALLÉ
    - Usage: i18n FR/EN/IT
    - Priorité: HAUTE

---

## 🎨 DESIGN SYSTEM

53. **class-variance-authority**
    - Usage: Variants composants Tailwind
    - License: Apache 2.0
    - Installation: `npm install class-variance-authority`
    - Priorité: HAUTE (déjà utilisé avec Badge)

54. **tailwind-merge**
    - Usage: Merge classes Tailwind intelligemment
    - License: MIT
    - Installation: `npm install tailwind-merge`
    - Priorité: HAUTE (utils cn())

55. **lucide-react** ✅ DÉJÀ INSTALLÉ
    - Usage: Icônes modernes
    - Priorité: HAUTE

---

## 📦 UTILITAIRES

56. **date-fns**
    - Usage: Manipulation dates
    - License: MIT
    - Installation: `npm install date-fns`
    - Priorité: MOYENNE

57. **clsx**
    - Usage: Conditional classes
    - License: MIT
    - Installation: `npm install clsx`
    - Priorité: HAUTE (avec tailwind-merge)

58. **nanoid**
    - Usage: IDs uniques courts
    - License: MIT
    - Installation: `npm install nanoid`
    - Priorité: BASSE

---

## 🚀 DÉPLOIEMENT & MONITORING

59. **@sentry/nextjs**
    - Usage: Error tracking production
    - License: MIT (plan gratuit 5k events/mois)
    - Installation: `npm install @sentry/nextjs`
    - Priorité: HAUTE

60. **pm2** ✅ DÉJÀ UTILISÉ
    - Usage: Process manager VPS
    - Priorité: HAUTE

---

## 📋 PRIORITÉS D'INSTALLATION

### 🔴 URGENT (Installer maintenant)

1. **sonner** - Notifications toast
2. **@tanstack/react-table** - Tableau admin photos
3. **react-hook-form + zod** - Formulaires validés
4. **bcrypt + jose** - Sécurité auth
5. **next-sitemap + next-seo** - SEO
6. **compressorjs** - Compression images upload
7. **plaiceholder** - Placeholders images
8. **nodemailer** - Emails confirmations
9. **@sentry/nextjs** - Error tracking
10. **vitest + @testing-library/react** - Tests

### 🟠 HAUTE PRIORITÉ (Cette semaine)

11. **yet-another-react-lightbox** - Lightbox moderne
12. **react-dropzone** - Drag & drop avancé
13. **@stripe/react-stripe-js** - Composants Stripe
14. **recharts** - Graphiques stats
15. **exifr** - Metadata photos
16. **Dialog/Toast/Progress UI components**

### 🟡 MOYENNE PRIORITÉ (Ce mois)

17. **tiptap** - Éditeur descriptions
18. **framer-motion** - Animations
19. **react-email** - Templates emails
20. **@vercel/analytics** - Analytics

### 🟢 BASSE PRIORITÉ (Futur)

21. **playwright** - Tests E2E
22. **react-photo-album** - Grille masonry avancée
23. **swr** - Cache API
24. **husky + lint-staged** - Git hooks

---

## 💰 COÛTS (Tous gratuits sauf mentions)

- **Tous les packages npm listés**: GRATUIT (open source)
- **Sentry**: Gratuit jusqu'à 5k events/mois
- **Vercel Analytics**: Gratuit tier hobby
- **Google Analytics**: Gratuit

**Total coût**: 0€/mois

---

## 📝 COMMANDES INSTALLATION RAPIDE

```bash
# UI Components essentiels
npm install sonner clsx tailwind-merge class-variance-authority

# Formulaires & Validation
npm install react-hook-form zod

# Sécurité
npm install bcrypt jose
npm install -D @types/bcrypt

# Images & Upload
npm install compressorjs exifr plaiceholder
npm install react-dropzone

# Tableaux & Data
npm install @tanstack/react-table

# SEO & Analytics
npm install next-sitemap next-seo
npm install @vercel/analytics @vercel/speed-insights

# Stripe
npm install @stripe/react-stripe-js

# Email
npm install nodemailer react-email @react-email/components

# Monitoring
npm install @sentry/nextjs

# Tests
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Graphiques
npm install recharts

# Lightbox
npm install yet-another-react-lightbox

# Utils
npm install date-fns
```

---

## ⚠️ NOTES IMPORTANTES

1. **Ne PAS installer**:
   - Packages redondants (ex: 2 libs lightbox)
   - Packages trop lourds si alternative existe
   - Auth libs si système actuel suffit

2. **Vérifier compatibilité**:
   - Next.js 15.5.6
   - React 19
   - TypeScript 5.8.3

3. **Tests avant prod**:
   - Tester chaque package en dev
   - Vérifier impact bundle size
   - Mesurer performance

4. **Documentation**:
   - Lire docs chaque package
   - Suivre best practices
   - Garder packages à jour

---

## 🎯 PLAN D'ACTION RECOMMANDÉ

### Semaine 1: Fondations
- Installer sonner, react-hook-form, zod
- Créer composants UI manquants (Dialog, Progress, Tabs)
- Implémenter bcrypt pour passwords

### Semaine 2: Admin
- Installer @tanstack/react-table
- Intégrer react-dropzone
- Ajouter compressorjs upload

### Semaine 3: SEO & Analytics
- Configurer next-sitemap
- Implémenter next-seo
- Intégrer @vercel/analytics

### Semaine 4: Tests & Qualité
- Setup vitest + testing-library
- Écrire tests critiques
- Configurer Sentry

---

Maintenu par: Lalou
Date: 2025-11-08
