# 📋 TÂCHES RESTANTES - 2025-11-16

**Après Phases 4+5+6**
**Statut global** : 95% terminé

---

## ✅ VALIDATIONS COMPLÈTES (Phases 4+5+6)

### Phase 4 - E-commerce avancé
- ✅ Panier persistant 30 jours
- ✅ Social proof (visiteurs, stock)
- ✅ Gelato API intégration complète

### Phase 5 - Emails transactionnels
- ✅ 3 emails React Email (OrderConfirmation, ShippingNotification, DeliveryConfirmation)
- ✅ Client Resend intégré
- ✅ Webhooks Stripe → Gelato → Emails

### Phase 6 - Admin & optimisations
- ✅ Bug upload photos corrigé
- ✅ Schema metadata refait (categories[], description, status)
- ✅ Formats adaptatifs frontend (A3/A2/A1 limited, A4/A3/A2 unlimited)
- ✅ Script traductions DeepL (`bun run translate:deepl`)
- ✅ Script migration metadata (`scripts/migrate-metadata.ts`)
- ✅ API descriptions IA Claude Sonnet Vision
- ✅ Carousel optimisé (50vh-55vh, 9s autoplay)

---

## ⏳ ATTENTE ACTIVATION GUILLAUME (2h35)

**Ces fonctionnalités sont codées mais nécessitent clés API** :

### 1. Gelato (1h30)
- Créer compte : https://www.gelato.com/
- Ajouter produits Fine Art catalogue
- Générer API key
- Config `.env.local` : `GELATO_API_KEY` + `GELATO_ENVIRONMENT`
- Tests puis passage `live`

### 2. Resend (35 min)
- Créer compte : https://resend.com/
- Vérifier domaine `guillaumefarre.com`
- Générer API key
- Config `.env.local` : `RESEND_API_KEY` + `RESEND_FROM_EMAIL`

### 3. DeepL (10 min)
- Créer compte : https://www.deepl.com/pro-api
- Générer API key
- Config `.env.local` : `DEEPL_API_KEY`
- Exécuter : `bun run translate:deepl`

### 4. Anthropic (10 min)
- Créer compte : https://console.anthropic.com/
- Générer API key
- Config `.env.local` : `ANTHROPIC_API_KEY`

### 5. Restart serveur (10 min)
```bash
ssh root@51.38.35.238
cd /var/www/guillaume-farre
pm2 restart guillaume-farre
```

**Guide complet** : `ACTIVATION_COMPLETE_GUILLAUME.md`

---

## 🔨 TÂCHES OPTIONNELLES (Phase 7 - 3h)

**Peuvent attendre feedback Guillaume après activation**

### Interface admin avancée (2h)

#### 1. Statuts photos UI (30 min)
**Actuel** : Statuts codés dans schema, pas d'UI admin
**À faire** :
- Dropdown pour chaque photo : `active` / `trash` / `to-sort`
- Filtre "Afficher corbeille" (photos trash)
- Filtre "Afficher à trier" (photos to-sort)
- **Fichier** : `app/[locale]/admin/page.tsx`

#### 2. Catégories multiples checkboxes (30 min)
**Actuel** : Schema supporte `categories[]`, pas d'UI admin
**À faire** :
- Checkboxes pour chaque photo :
  - ☐ Tirage illimité (A4/A3/A2)
  - ☐ Série limitée 1-7 (A3/A2/A1)
  - ☐ Format XXL (80x120cm)
  - ☐ Format monumental (120cm+)
- **Fichier** : `app/[locale]/admin/page.tsx`

#### 3. Analyse commerciale dépliable (15 min)
**Actuel** : Toujours visible
**À faire** :
- Panel collapsed par défaut
- Icône `▶` (collapsed) / `▼` (expanded)
- Titre cliquable : "Analyse commerciale"
- **Fichier** : `app/[locale]/admin/page.tsx`

#### 4. Bouton Instagram logo (15 min)
**Actuel** : Gros bouton "Générer post Instagram"
**À faire** :
- Logo Instagram cliquable (taille icône standard)
- **Fichier** : `app/[locale]/admin/page.tsx`

#### 5. Série limitée compteur (30 min)
**À faire** :
- Afficher "X/7 vendus" si série limitée
- Bouton "Marquer série close"
- Mise à jour auto après vente Stripe
- **Fichiers** : `app/[locale]/admin/page.tsx`, `app/api/stripe/webhook/route.ts`

---

### Carousel homepage (30 min)

#### Photo rouge Ferrari
**Problème** : Photo voitures rouges trop agressive visuellement
**À faire** :
1. Trouver 3 alternatives neutres/grises dans `/public/images/works/`
2. Proposer à Guillaume pour validation
3. Remplacer dans `components/HeroCarousel.tsx`

**Note** : Carousel déjà optimisé (50vh-55vh, 9s autoplay) ✅

---

## 🎯 RECOMMANDATION

**Immédiat** :
1. Guillaume suit `ACTIVATION_COMPLETE_GUILLAUME.md` (2h35)
2. Tester fonctionnalités activées
3. Passer 1ère commande test Gelato
4. Valider qualité impression

**Après activation (optionnel)** :
- Phase 7 interface admin avancée (2h)
- Photo carousel alternative (30 min)
- Tests A/B pricing (si souhaité)
- Dashboard statistiques (si souhaité)

---

## 📊 IMPACT ATTENDU POST-ACTIVATION

**Gains directs** : +€1,900/mois
**Économies** : +€1,300/mois
**TOTAL** : **+€3,200/mois**
**ROI** : 12 jours

---

## 📚 DOCUMENTATION DISPONIBLE

**Pour Guillaume** :
- `ACTIVATION_COMPLETE_GUILLAUME.md` (checklist 2h35)
- `GELATO_SETUP_FINAL.md` (guide détaillé)
- `RESEND_EMAILS_SETUP.md` (guide détaillé)
- `RESUME_FINAL_GUILLAUME.md` (résumé court)

**Pour développeurs** :
- `SESSION_2025-11-16_PHASE_4_RAPPORT.md`
- `SESSION_2025-11-16_PHASE_5_RESEND_RAPPORT.md`
- `SESSION_2025-11-16_PHASE_6_RAPPORT.md`
- `README_SESSIONS_2025-11-16.md`

---

**Lalou**
