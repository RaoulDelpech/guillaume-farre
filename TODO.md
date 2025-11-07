# TODO - Corrections Guillaume Farré

Dernière mise à jour: 2025-11-07
Source: CORRECTIONS_URGENTES_2025-11-07.md

---

## Phase 1 - CRITIQUE (3h)

### 🔴 Bug upload photos
- [ ] Corriger `app/[locale]/admin/page.tsx:47-58`
- [ ] Forcer refresh UI après upload
- [ ] Afficher miniatures immédiatement (pas rectangles gris)
- [ ] Tester upload 3 photos

**Temps**: 30 min
**Fichier**: app/[locale]/admin/page.tsx

---

### 🔴 Schema metadata refactoring
- [ ] Lire `scripts/MIGRATION_METADATA_PLAN.md`
- [ ] Créer backup metadata actuel
- [ ] Créer interface PhotoMetadataV2
- [ ] Créer fonction migration
- [ ] Créer script scripts/migrate-metadata.ts
- [ ] Tester migration sur données test
- [ ] Migration données réelles
- [ ] Mettre à jour interface admin
- [ ] Mettre à jour interface boutique
- [ ] Tests finaux

**Temps**: 1h
**Fichiers**: lib/admin/photo-manager.ts, app/[locale]/admin/page.tsx

---

### 🔴 Formats selon catégorie
- [ ] Interface boutique: PAS A4 si édition limitée
- [ ] Interface boutique: A4 OK si tirage illimité
- [ ] Validation côté serveur formats
- [ ] Tester achat A3 limited (doit fonctionner)
- [ ] Tester achat A4 limited (doit être bloqué)

**Temps**: 1h
**Fichiers**: app/[locale]/boutique/page.tsx, app/api/create-checkout-session/route.ts

---

## Phase 2 - HAUTE (3h)

### 🟠 Traductions DeepL professionnelles
- [ ] Lire `DEEPL_SETUP.md`
- [ ] Créer compte DeepL (gratuit 500k chars/mois)
- [ ] Obtenir API key
- [ ] Ajouter DEEPL_API_KEY dans .env.local
- [ ] Créer script scripts/translate.ts
- [ ] Traduire 100% messages/fr.json → en.json
- [ ] Traduire 100% messages/fr.json → it.json
- [ ] Vérifier qualité traductions
- [ ] Commit traductions

**Temps**: 2h
**Fichiers**: messages/en.json, messages/it.json, scripts/translate.ts

---

### 🟠 Réduire carousel
- [ ] Ouvrir `app/[locale]/page.tsx`
- [ ] Chercher `h-[80vh]`
- [ ] Remplacer par `h-[60vh]`
- [ ] Tester visuellement homepage
- [ ] Commit

**Temps**: 15 min
**Fichiers**: app/[locale]/page.tsx

---

### 🟠 Ralentir carousel
- [ ] Ouvrir `app/[locale]/page.tsx`
- [ ] Chercher `Autoplay({ delay: 5000 })`
- [ ] Remplacer par `Autoplay({ delay: 9000 })`
- [ ] Tester carousel (doit défiler toutes les 9s)
- [ ] Commit

**Temps**: 15 min
**Fichiers**: app/[locale]/page.tsx

---

### 🟠 Changer photo rouge
- [ ] Identifier photo rouge dans carousel
- [ ] Proposer 3 alternatives neutres/grises
- [ ] Valider choix avec Guillaume
- [ ] Remplacer photo
- [ ] Commit

**Temps**: 30 min
**Fichiers**: public/images/*, app/[locale]/page.tsx

---

## Phase 3 - MOYENNE (5h)

### 🟡 Descriptions IA photos
- [ ] Lire `ANTHROPIC_VISION_SETUP.md`
- [ ] Créer compte Anthropic
- [ ] Obtenir API key
- [ ] Ajouter ANTHROPIC_API_KEY dans .env.local
- [ ] Créer lib/anthropic-vision.ts
- [ ] Interface admin: bouton "Générer description"
- [ ] Interface admin: zone texte éditable description
- [ ] Interface admin: flag aiGenerated
- [ ] Tester génération description 3 photos
- [ ] Commit

**Temps**: 2h
**Fichiers**: lib/anthropic-vision.ts, app/[locale]/admin/page.tsx

---

### 🟡 Interface admin avancée
- [ ] Statuts photos (active/trash/to-sort)
- [ ] Dropdown statut pour chaque photo
- [ ] Filtre "Afficher corbeille"
- [ ] Filtre "Afficher à trier"
- [ ] Catégories multiples (checkboxes unlimited/limited/xxl/monumental)
- [ ] Analyse commerciale dépliable (collapsed par défaut)
- [ ] Tester toutes fonctionnalités
- [ ] Commit

**Temps**: 3h
**Fichiers**: app/[locale]/admin/page.tsx, lib/admin/photo-manager.ts

---

### 🟡 Logo Instagram
- [ ] Trouver icône Instagram (lucide-react ou heroicons)
- [ ] Remplacer gros bouton par icône
- [ ] Taille standard (24x24px)
- [ ] Tester clic fonctionne
- [ ] Commit

**Temps**: 15 min
**Fichiers**: app/[locale]/admin/page.tsx

---

## Phase 4 - GELATO (5 jours après pricing vérifié)

### Vérification pricing
- [ ] Lire `GELATO_PRICING_VERIFICATION.md`
- [ ] Créer compte Gelato
- [ ] Vérifier pricing France réel
- [ ] Calculer marges réelles
- [ ] Décision GO/NO-GO Gelato
- [ ] Remplir template vérification

**Temps**: 30 min

---

### Implémentation API (si GO)
- [ ] Lire `GELATO_VALIDATION_GUIDE.md`
- [ ] Lire `lib/gelato-client.ts.SKELETON`
- [ ] Obtenir API key Gelato
- [ ] Ajouter GELATO_API_KEY dans .env.local
- [ ] Implémenter lib/gelato-client.ts complet
- [ ] Créer app/api/gelato-webhook/route.ts
- [ ] Webhook Stripe → Gelato (création commande auto)
- [ ] Webhook Gelato → Email tracking client
- [ ] Tests sandbox
- [ ] Commande test réelle (avec carte perso)
- [ ] Validation Guillaume qualité impression
- [ ] Basculer mode production
- [ ] Commit

**Temps**: 2 jours
**Fichiers**: lib/gelato-client.ts, app/api/stripe-webhook/route.ts, app/api/gelato-webhook/route.ts

---

## LÉGENDE

- [ ] À faire
- [x] Terminé

**Phases**:
- 🔴 CRITIQUE: Blocage utilisateurs
- 🟠 HAUTE: Impact important UX/business
- 🟡 MOYENNE: Amélioration significative

---

Lalou
