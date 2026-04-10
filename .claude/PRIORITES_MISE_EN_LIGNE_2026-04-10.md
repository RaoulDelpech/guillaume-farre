# Priorites mise en ligne site public — 2026-04-10

**Source** : session de pilotage Claude Opus 4.6 avec Raoul (Lalou).
**Objectif** : finaliser et mettre en ligne publiquement le site guillaumefarre.com cette semaine.
**Statut** : decisions en cours, tri des pages et composants.

---

## REGLE #0 : DEUX PHASES

- **PHASE 1 (maintenant, priorite absolue)** : site public visible, fonctionnel, qui vend des photos. Rien d'autre.
- **PHASE 2 (apres mise en ligne phase 1)** : site secret toiles (avec prix), systeme VIP, codes d'acces.

**Consequence** : on ne touche PAS en phase 1 a : `/vip`, `/toiles` (si c'est la version secrete avec prix), `/api/vip/validate`, `data/vip-codes.json`, `lib/vip-codes.ts`. A clarifier : est-ce que `/toiles` est la page publique ou la page secrete ?

---

## OBJECTIF DU SITE PUBLIC (version Raoul)

> "On va virer tous les textes. Garde le carousel. Juste avec une belle section avec les photos et une autre belle section avec les toiles. Et il faut que les gens puissent acheter les photos et que ca marche. Pour acheter les toiles il y a le site cache car on affiche pas les prix des toiles sur le site public. L'interface d'administration doit marcher mais ce n'est pas le plus important. Et tout ce qui est Instagram, analyse du prix des oeuvres etc etc on s'en fout."

**Traduction** :
- Homepage avec carousel (garde)
- Section photos (belle, sans textes)
- Section toiles (belle, sans prix visibles sur la version publique)
- Tunnel d'achat photos 100% fonctionnel (Stripe)
- Admin qui marche (mais pas bloquant)
- **Pas de textes editoriaux**
- **Pas d'Instagram**
- **Pas d'analyse commerciale / ROI / historique des prix**

---

## DECISIONS PRISES

### Features a DESACTIVER (invisible, code garde — menage plus tard)

**Motif** : "on s'en fout" (Raoul). On rend invisible cote site + admin, on ne supprime pas les fichiers pour ne pas casser le build.

- [ ] `components/PriceHistoryChart.tsx` (historique des prix)
- [ ] `components/ROICalculator.tsx` (calculateur retour investissement)
- [ ] `lib/art-market-expert.ts` + `lib/art-market/` (IA marche de l'art)
- [ ] `lib/ai-commercial-analyzer.ts` + `lib/ai-commercial/` (analyseur IA commercial)
- [ ] `lib/commercial-performance.ts` + `lib/commercial/`
- [ ] `components/admin/AIAnalysisPanel.tsx`
- [ ] `components/admin/CommercialDashboard.tsx`
- [ ] `components/admin/CommercialPerformancePanel.tsx`
- [ ] `lib/instagram-optimizer.ts` + `lib/instagram/`
- [ ] `components/admin/InstagramConfig.tsx`
- [ ] `components/admin/InstagramSuggestionPanel.tsx`

### Pages a VIRER (suppression complete des dossiers)

- [ ] `/quiz` — quiz (hors sujet)
- [ ] `/comparer` — comparateur d'oeuvres (hors sujet)
- [ ] `/favoris` — liste de favoris (hors sujet)
- [ ] `/nav-demo` — page de test dev
- [ ] `/frame-demo` — page de test dev
- [ ] `/admin-test` — admin de test dev
- [ ] `/engagements` — editorial (Raoul : vire complet)
- [ ] `/compte` — espace client (pas necessaire pour vendre en checkout invite)

### Pages a MASQUER (page existe mais pas de lien dans la nav publique)

**Motif** : toutes ces pages sont editoriales, dependent de textes qui ne sont pas finis/valides. On les cache plutot que de les supprimer pour pouvoir les re-activer plus tard.

- [ ] `/histoire` — bio Guillaume Farre
- [ ] `/atelier` — atelier de creation
- [ ] `/origine` — origines du projet
- [ ] `/dino` — page Ferrari Dino
- [ ] `/dino-histoire` — histoire de la Dino
- [ ] `/presse` — revue de presse
- [ ] `/actualites` — news
- [ ] `/collectionneurs` — page marketing avec temoignages fictifs

### Pages a GARDER

- [ ] `/` homepage (avec carousel + section photos + section toiles)
- [ ] `/galerie` + `/galerie-item` — section photos
- [ ] `/boutique` — catalogue achat
- [ ] `/panier` — panier + checkout
- [ ] `/commande` — suivi de commande
- [ ] `/contact` — formulaire de contact
- [ ] `/faq` — reduit support client
- [ ] `/login` — **critique pour admin** (pwd `LHOOQladino246`)
- [ ] `/admin` — back-office (non bloquant mais doit marcher)

### A NE PAS TOUCHER (phase 2)

- [ ] `/vip` — entree site secret (code VIP 8 caracteres)
- [ ] `/toiles` — page toiles (a clarifier : publique ou secrete ?)
- [ ] `app/api/vip/validate/` — validation code VIP
- [ ] `data/vip-codes.json`
- [ ] `lib/vip-codes.ts`

---

## RESTE A TRANCHER (a reprendre dans la prochaine session)

### Pages
- [ ] `/toiles` : c'est la page publique (sans prix) ou la page secrete (avec prix) ? **Question cle** car Raoul veut une "belle section toiles" sur le site public. Si `/toiles` = page secrete, il faut creer une vraie section toiles sur la homepage ou sur une nouvelle page publique.
- [ ] Pages legales (`/cgv`, `/mentions-legales`, `/politique-de-confidentialite`, `/retours-echanges`) : normalement obligatoires legalement, ma reco = GARDE (texte minimal accepte).

### Composants (sections 2 a 11 de l'inventaire, non encore tries)

**Section 2 — Homepage / visuels** : `HeroCarousel`, `HomeWorksSection`, `HomeCitation`, `AtelierDoors`, `WelcomeAnimation`, `DarkEntry`, `VideoIntro`, `AnimatedSection`, `PageProgressBar`, `ScrollProgress`, `SmoothScroll`, `ScrollToTopOnNav`, `BackToTop`, `SoundToggle`

**Section 3 — Galerie / oeuvres** : `GalleryGrid`, `GalleryClient`, `AmericanFrame` (SACRE), `lightbox/`, `ImageZoom`, `ImageCarouselZoom`, `ImageProtection`, `SizeVisualizer`

**Section 4 — Boutique** (critique) : `ShopGrid`, `ShopFilteredGrid`, `ShopPhotoCard`, `ShopFilters`, `ShopSelectionModal`, `ShopFloatingCart`, `PhotoOrderForm`, `PricingDisplay`, `ProductFilters`, `AddToCartSection`, `StockBadge`

**Section 5 — Engagement visiteur (potentiel bruit)** : `NewsletterPopup`, `CookieConsent` (obligatoire RGPD), `SocialProof`, `SocialProofNotifications`, `ShareButtons`, `CollectionTracker`, `DeliveryEstimate`

**Section 8 — Admin** : AdminAuth, AdminLogin, AdminDashboard, PhotoManager, PhotoCard, PhotoEditor, PhotoPreview, PhotoFilters, PhotoDescriptionAI, DragDropUpload, BatchOperations, BulkActions, DuplicateDetector, SimilarImagesPanel, SeriesSuggestButton, AIAssistant, AnalyticsDashboard, PricingManager, EditableText, AdminOnboarding, AdminQuickActions, AdminToolbar, AdminWrapper

**Section 10 — Backend** : gelato-client, printing, shipping, orders, pennylane-client, resend-client + resend/, pdf-generator + pdf/, analytics, GoogleAnalytics, StructuredData, early-access, image-similarity, content-manager, auth, magic-link

**Section 11 — Divers** : motion, animations, ui (shadcn), toiles components, navigation, Footer, LanguageSwitcher

---

## FICHIERS NON COMMITES DE LA SESSION PRECEDENTE (AVERTISSEMENT)

La session precedente a crash en plein refactoring. **Ne PAS commiter en l'etat** sans avoir verifie que ca compile et que c'est utile pour la phase 1. Fichiers concernes :

**Modifies (M)** :
- `app/[locale]/commande/page.tsx`
- `components/admin/AIAssistant.tsx` / `AnalyticsDashboard.tsx` / `BatchOperations.tsx` / `InstagramSuggestionPanel.tsx` / `PhotoFilters.tsx` / `PhotoManager.tsx` / `PhotoPreview.tsx`
- `components/pages/DinoContent.tsx` / `DinoHistoireContent.tsx`
- `components/shop/ShopFilters.tsx`
- `lib/ai-commercial-analyzer.ts` / `art-market-expert.ts` / `gelato-client.ts` / `pdf-generator.ts`

**Nouveaux (??)** :
- `app/[locale]/commande/OrderTimeline.tsx` / `types.ts`
- `app/[locale]/nav-demo/` (a virer selon decisions)
- `components/admin/ai/` / `analytics/` / `batch/` / `filters/` / `instagram/` / `photo-manager/` / `preview/`
- `components/pages/dino-histoire/` / `dino/`
- `components/shop/filters/`
- `data/vip-codes.json`
- `lib/ai-commercial/` / `art-market/` / `commercial/` / `gelato/` / `pdf/`

**Strategie recommandee** :
1. Reprise avec une session dediee fraiche
2. Premiere action : `npm run build` pour verifier que l'etat actuel compile
3. Si compile → trier fichier par fichier : garder ce qui sert pour phase 1, stash/discard le reste
4. Si ne compile pas → rollback vers dernier commit stable (`2540aec fix(toiles): crop white margins...`)

---

## PROCHAINES QUESTIONS A POSER A RAOUL (session suivante)

Dans l'ordre :

1. **`/toiles` : page publique (sans prix) ou page secrete (avec prix) ?** — question bloquante pour clarifier l'architecture
2. **Pages legales** : A/B/C (reco : garde)
3. **Composants section 5** (engagement visiteur) : NewsletterPopup, SocialProof, SocialProofNotifications — garde ou degage ?
4. **Backend** : pennylane-client, early-access, image-similarity, content-manager — utiles pour phase 1 ou pas ?
5. **Etat du tunnel d'achat actuel** : verifier que Stripe live est branche et que le parcours photo → panier → paiement → email → Gelato fonctionne end-to-end

---

## REGLES DE TRAVAIL POUR LA PROCHAINE SESSION

- **SESSION PILOTAGE NE CODE PAS.** Toute modification passe par une session dediee via `open-terminal`.
- **Lire ce fichier en premier** pour reprendre le contexte.
- **Ne pas demarrer un nouveau refactoring** — la session precedente a crash a cause de ca. On fait du tri, pas du refactoring, sauf si indispensable.
- **Commits frequents** (toutes les 30-45 min) pour eviter de reperdre du travail.
- **Ne pas toucher au systeme VIP/toiles secretes** — phase 2.

---

**Fin du fichier. Reprendre ici a la prochaine session.**
