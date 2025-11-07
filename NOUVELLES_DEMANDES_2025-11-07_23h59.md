# Nouvelles Demandes Client - 7 novembre 2025, 23h59

Date: 7 novembre 2025, 23h59
Client: Raoul (pour Guillaume Farré)
Par: Lalou

---

## DEMANDES URGENTES

### 1. ❌ Supprimer expression "à partir de" pour les prix

**Demande exacte de Raoul**:
> "j'en profite pour une remaurq,e guillaume ne veut pas de l'exrepssion 'à partir de' pour les prix. il faut trouver d'autres chsoes"

**Problème**:
- Expression "à partir de X €" jugée cheap/discount
- Incompatible avec positionnement haut de gamme
- Besoin alternatives plus élégantes

**Alternatives à proposer**:

**Option 1 - Prix direct simple**:
```
Tirages illimités
150 € (A4) • 250 € (A3) • 400 € (A2)

Séries limitées (1-7)
500 € (A3) • 800 € (A2) • 1200 € (A1)

Formats monumentaux
Sur devis
```

**Option 2 - Fourchettes tarifaires**:
```
Tirages illimités: 150 € - 400 €
Séries limitées: 500 € - 1200 €
Formats monumentaux: Sur consultation
```

**Option 3 - Langage art gallery**:
```
Tirages illimités
Prix: 150 € à 400 € selon format

Séries limitées (éditions numérotées 1/7)
Prix: 500 € à 1200 € selon format

Formats monumentaux (>120cm)
Prix: Sur demande
```

**Option 4 - Ultra épuré luxe**:
```
TIRAGE ILLIMITÉ
A4: 150 €
A3: 250 €
A2: 400 €

SÉRIE LIMITÉE (1-7)
A3: 500 €
A2: 800 €
A1: 1200 €

MONUMENTAL
Devis personnalisé
```

**Fichiers à corriger**:
- `messages/fr.json` - Clés shop.* avec "à partir de"
- `messages/en.json` - Équivalents EN "from" / "starting at"
- `messages/it.json` - Équivalents IT "a partire da"
- `components/shop/ShopGrid.tsx` - Affichage prix cards
- `components/shop/PriceDisplay.tsx` (si existe)

**Recherche des occurrences**:
```bash
grep -r "à partir de" messages/
grep -r "from" messages/en.json | grep -i price
grep -r "partire" messages/it.json
```

---

### 2. ✅ Séries limitées: Maximum 7 exemplaires (pas plus)

**Demande exacte de Raoul**:
> "les series numérotes doivent aussi aller jusqu'à 7, pas plus"

**Status**: ✅ DÉJÀ IMPLÉMENTÉ

**Vérifications faites**:

1. **Metadata schema** (`lib/admin/photo-manager.ts`):
```typescript
limitedEdition?: {
  total: 7;        // ✅ Toujours 7
  sold: number;    // 0-7
  available: number; // 7 - sold
  closed: boolean;
}
```

2. **Affichage boutique** (`components/shop/ShopGrid.tsx`):
```tsx
Édition limitée · {photo.limitedEdition.available}/7 restants
```

3. **Compteur disponibilité**:
- Badge "X/7 restants" (hardcodé)
- Alerte si ≤2 restants
- Badge "ÉPUISÉ" si 0/7

**Aucune correction requise** - Le code force déjà maximum 7.

**Documentation à vérifier**:
- `CLAUDE.md` - Confirmer "1/7 à 7/7"
- `messages/*.json` - Textes mentionnant éditions limitées
- Interface admin - Validation création série (max 7)

---

### 3. 📋 Questions stratégiques pour atteindre niveau top mondial

**Demande exacte de Raoul**:
> "en même teps je voudrais que me poses une longue serie de question pour qu'on améliore le site point par poinr, pour qu'il soit au niveau des meilleurs artistes du monde qui font de lart contemporain et quie vendent leurs creations (idéalement aussi des toiles et/ou des photos) sur leur site."

**Objectif**:
- Atteindre niveau des meilleurs sites d'artistes contemporains mondiaux
- Artistes vendant toiles + photos en ligne
- Amélioration point par point

**Benchmarks à considérer**:
- Peter Lik (photographe, $6.5M pour "Phantom")
- Andreas Gursky (photographe, records monde)
- Jeff Koons (sculptures, site vente directe)
- Banksy (Pest Control, authentification)
- Yayoi Kusama (œuvres + expériences)
- Damien Hirst (vente NFT + physique)

**Catégories de questions à poser**:

1. **Expérience utilisateur & Design**
   - Navigation
   - Hiérarchie visuelle
   - Storytelling
   - Immersion

2. **Stratégie commerciale**
   - Pricing
   - Scarcity
   - Exclusivité
   - Vente privée / VIP

3. **Contenu & Communication**
   - Histoire artiste
   - Processus création
   - Vidéos atelier
   - Presse & reconnaissance

4. **Fonctionnalités avancées**
   - Visualiseur AR (voir œuvre chez soi)
   - Configurateur de taille/cadre
   - Réservation/liste d'attente
   - Newsletter collectors

5. **Trust & Crédibilité**
   - Certificats authenticité
   - Expositions passées
   - Collections (musées, privées)
   - Témoignages collectors

6. **Technique & Performance**
   - Vitesse chargement
   - Images haute qualité
   - Responsive
   - SEO art market

**Questions préparées** (voir section suivante)

---

## QUESTIONS STRATÉGIQUES POUR GUILLAUME

### CATÉGORIE 1: POSITIONNEMENT & IDENTITÉ

**Q1.1 - Clientèle cible**
Guillaume, qui sont vos 3 types de clients idéaux ?
- [ ] Collectors d'art contemporain (budgets €5k-€50k+)
- [ ] Décorateurs d'intérieur / architectes (projets B2B)
- [ ] Amateurs d'art passionnés (budgets €500-€5k)
- [ ] Entreprises (art offices, lobbies)
- [ ] Autre: _________________

**Q1.2 - Positionnement prix**
Comment voulez-vous être perçu ?
- [ ] Artiste émergent accessible (prix modérés)
- [ ] Artiste établi milieu de gamme
- [ ] Artiste haut de gamme / luxe
- [ ] Artiste ultra-premium (records)

**Q1.3 - Unicité du concept**
Qu'est-ce qui rend votre art TOTALEMENT unique au monde ?
(Réponse libre attendue - pour textes homepage)

**Q1.4 - Storytelling**
Quelle émotion/message voulez-vous transmettre en priorité ?
- [ ] Performance brute / puissance mécanique
- [ ] Accident contrôlé / chaos maîtrisé
- [ ] Fusion art-automobile / hybridation
- [ ] Instant fugace / éphémère capturé
- [ ] Autre: _________________

---

### CATÉGORIE 2: EXPÉRIENCE UTILISATEUR

**Q2.1 - Homepage**
Actuellement: Carousel 6 slides + textes.
Préférez-vous:
- [ ] Garder carousel (mais optimiser)
- [ ] Vidéo plein écran (Ferrari en action)
- [ ] Image héroïque fixe + CTA fort
- [ ] Split-screen (vidéo gauche / texte droite)

**Q2.2 - Navigation**
Le menu actuel est-il clair ?
- Accueil / Galerie / Boutique / Histoire / Atelier / Contact
- Manque-t-il des sections ? (Ex: Expositions, Presse, Vidéos)

**Q2.3 - Galerie**
Comment voulez-vous que les visiteurs explorent vos œuvres ?
- [ ] Par série (Empreintes / Atelier / Projection)
- [ ] Par Ferrari (Noire / Grise 1 / Grise 2 / Rouge)
- [ ] Par année de création
- [ ] Par format (Small / Medium / Large / Monumental)
- [ ] Mosaïque libre (tout mélangé)

**Q2.4 - Visualisation AR**
Souhaitez-vous que les clients puissent voir l'œuvre sur leur mur en réalité augmentée (via smartphone) ?
- [ ] Oui, priorité haute (budget ~€2k intégration)
- [ ] Oui, mais plus tard
- [ ] Non, pas nécessaire

**Q2.5 - Configurateur**
Voulez-vous un outil interactif où le client choisit:
- Format (A3/A2/A1...)
- Cadre (noir/blanc/naturel/sans)
- Montage (standard/dibond/acrylique)
- Voir le prix se calculer en temps réel ?

- [ ] Oui, essentiel
- [ ] Oui, si budget le permet
- [ ] Non, trop complexe

---

### CATÉGORIE 3: CONTENU & STORYTELLING

**Q3.1 - Vidéos atelier**
Avez-vous des vidéos de Ferrari peignant ?
- [ ] Oui, plusieurs (durées: _______)
- [ ] Oui, mais qualité amateur (smartphone)
- [ ] Non, mais on peut en tourner
- [ ] Non, et je préfère photos

**Q3.2 - Page "Histoire"**
Actuelle: Texte + photos. Manque-t-il:
- [ ] Timeline visuelle (années clés)
- [ ] Vidéo interview Guillaume (2-3min)
- [ ] Citations / philosophie artistique
- [ ] Influences / inspirations
- [ ] Rien, c'est complet

**Q3.3 - Page "Atelier"**
Souhaitez-vous montrer:
- [ ] Plan 3D interactif de l'atelier
- [ ] Visite virtuelle 360° (type Google Street View)
- [ ] Galerie photos haute qualité
- [ ] Vidéo immersive (drone + steadicam)

**Q3.4 - Processus création**
Les clients comprennent-ils vraiment comment ça marche ?
Voulez-vous:
- [ ] Schéma technique détaillé (pneus, peinture, toile)
- [ ] Vidéo explicative animée (2min)
- [ ] Infographie step-by-step
- [ ] Section FAQ dédiée

**Q3.5 - Blog / Actualités**
Voulez-vous publier régulièrement:
- [ ] Nouvelles créations
- [ ] Coulisses / work in progress
- [ ] Expositions / événements
- [ ] Réflexions artistiques
- [ ] Non, pas le temps

---

### CATÉGORIE 4: STRATÉGIE COMMERCIALE

**Q4.1 - Pricing affiché**
Actuellement: Prix affichés publiquement.
Préférez-vous:
- [ ] Prix publics (transparence totale)
- [ ] Prix sur demande (contact requis) - crée mystère/exclusivité
- [ ] Hybride: tirages illimités affichés, séries limitées sur demande

**Q4.2 - Scarcity tactics**
Pour créer urgence/désir:
- [ ] Compteur "X/7 restants" (déjà fait)
- [ ] "2 personnes consultent cette œuvre en ce moment"
- [ ] "Dernière vendue il y a 3 jours"
- [ ] Timer "Offre réservation VIP expire dans 48h"
- [ ] Rien, trop commercial

**Q4.3 - Programme VIP / Collectors**
Voulez-vous un espace privé où:
- [ ] Collectors inscrits voient œuvres en avant-première
- [ ] Pré-réservation avant vente publique
- [ ] Tarifs préférentiels
- [ ] Invitations expositions privées
- [ ] Non, vente ouverte à tous

**Q4.4 - Financement / Paiement échelonné**
Pour œuvres >€1000:
- [ ] Oui, proposer paiement 3x ou 4x sans frais
- [ ] Oui, mais avec frais (via Alma/Klarna)
- [ ] Non, paiement comptant uniquement

**Q4.5 - Trade-in / Rachat**
Si un collector veut revendre son œuvre:
- [ ] Oui, je rachète avec décote (X%)
- [ ] Oui, je facilite revente entre collectors (commission)
- [ ] Non, je ne m'en occupe pas

---

### CATÉGORIE 5: TRUST & CRÉDIBILITÉ

**Q5.1 - Certificats d'authenticité**
Actuellement: Inclus pour séries limitées.
Format:
- [ ] PDF numérique + QR code blockchain
- [ ] Papier premium physique + hologramme
- [ ] Les deux (physique + NFT/blockchain)

**Q5.2 - Expositions & Reconnaissance**
Avez-vous exposé dans:
- [ ] Galeries (lesquelles: _________________)
- [ ] Musées (lesquels: _________________)
- [ ] Salons d'art (lesquels: _________________)
- [ ] Foires internationales (lesquelles: _________________)

→ Si oui, créer section "Expositions" avec logos/photos

**Q5.3 - Collections**
Vos œuvres sont-elles dans:
- [ ] Collections publiques (musées)
- [ ] Collections privées notables (noms si autorisés)
- [ ] Collections d'entreprises (bureaux, lobbies)

→ Si oui, valoriser sur site (social proof énorme)

**Q5.4 - Presse & Médias**
Articles/interviews parus dans:
- [ ] Presse auto (AutoHebdo, Sport Auto...)
- [ ] Presse art (Beaux-Arts Magazine, Art Press...)
- [ ] TV / Radio (lesquelles: _________________)
- [ ] Médias internationaux

→ Créer page "Presse" avec logos + extraits

**Q5.5 - Témoignages collectors**
Accepteriez-vous de demander à 3-5 clients satisfaits:
- [ ] Oui, témoignage texte + photo collection
- [ ] Oui, mais anonyme (initiales + ville)
- [ ] Non, trop intrusif

---

### CATÉGORIE 6: FONCTIONNALITÉS AVANCÉES

**Q6.1 - Wishlist / Favoris**
Les visiteurs peuvent-ils sauvegarder œuvres aimées ?
- [ ] Oui, sans compte (localStorage)
- [ ] Oui, avec compte (sync multi-devices)
- [ ] Non, pas utile

**Q6.2 - Alertes / Notifications**
Proposer de recevoir email quand:
- [ ] Nouvelle œuvre publiée (série X)
- [ ] Série limitée presque épuisée (reste 2/7)
- [ ] Vente privée VIP ouvre
- [ ] Prix œuvre baisse (rare)

**Q6.3 - Comparateur**
Permettre de comparer 2-3 œuvres côte à côte ?
- [ ] Oui (images + prix + specs)
- [ ] Non, chaque œuvre doit être contemplée seule

**Q6.4 - Recommandations IA**
"Vous avez aimé Empreinte #12 ? Découvrez aussi..."
- [ ] Oui, basé sur séries similaires
- [ ] Oui, basé sur prix similaires
- [ ] Non, trop Amazon-style

**Q6.5 - Chat / Support**
Actuellement: Formulaire contact.
Voulez-vous:
- [ ] Live chat (Intercom/Crisp) pendant heures bureau
- [ ] WhatsApp Business (+33...)
- [ ] Chatbot IA (réponses FAQ auto)
- [ ] Garder email uniquement

---

### CATÉGORIE 7: INTERNATIONAL & LANGUES

**Q7.1 - Langues prioritaires**
Actuellement: FR / EN / IT.
Ajouter:
- [ ] Allemand (collectors allemands)
- [ ] Espagnol (marché US/ES)
- [ ] Chinois (collectors asiatiques ultra-riches)
- [ ] Arabe (collectors Moyen-Orient)
- [ ] Suffisant avec FR/EN/IT

**Q7.2 - Shipping international**
Livrez-vous partout dans le monde ?
- [ ] Oui, worldwide (via Gelato)
- [ ] Europe uniquement (logistique simple)
- [ ] France + pays limitrophes
- [ ] France uniquement

**Q7.3 - Devises**
Afficher prix en:
- [ ] EUR uniquement
- [ ] EUR + USD (conversion auto)
- [ ] EUR + USD + GBP + CHF
- [ ] Détection auto selon IP visiteur

**Q7.4 - Compliance**
Pour ventes internationales:
- [ ] TVA auto-calculée selon pays (Stripe Tax)
- [ ] Droits de douane expliqués clairement
- [ ] Assurance transport incluse
- [ ] Tout géré par Gelato

---

### CATÉGORIE 8: TECHNIQUE & PERFORMANCE

**Q8.1 - Vitesse actuelle**
Le site vous semble:
- [ ] Très rapide (<2s chargement)
- [ ] Correct (2-4s)
- [ ] Lent (>4s)
- [ ] Je ne sais pas

**Q8.2 - Images**
Format actuel: JPG.
Passer à WebP (poids -30%, qualité identique) ?
- [ ] Oui, toutes les images
- [ ] Oui, mais garder JPG haute-res pour zoom
- [ ] Non, JPG suffit

**Q8.3 - SEO**
Actuellement optimisé pour Google.
Voulez-vous:
- [ ] Audit SEO complet (identifier axes amélioration)
- [ ] Blog SEO-optimized (articles "art Ferrari", etc.)
- [ ] Backlinks galeries/presse (netlinking)
- [ ] Ça marche déjà bien

**Q8.4 - Analytics**
Quelles données vous intéressent:
- [ ] Pages les plus visitées
- [ ] Œuvres les plus consultées
- [ ] Taux abandon panier
- [ ] Origine visiteurs (géo + source)
- [ ] Temps passé sur site
- [ ] Tout ça (dashboard complet)

**Q8.5 - A/B Testing**
Tester 2 versions de homepage/boutique pour voir laquelle convertit mieux ?
- [ ] Oui, data-driven
- [ ] Non, trop complexe

---

### CATÉGORIE 9: COMMUNAUTÉ & SOCIAL

**Q9.1 - Instagram**
Actuellement: Feed affiché sur site.
Améliorer avec:
- [ ] Bouton "Générer post Instagram" admin (déjà fait)
- [ ] Stories automatiques (nouvelle œuvre)
- [ ] Reels courts (Ferrari en action)
- [ ] Hashtags optimisés (#ferrarart, etc.)

**Q9.2 - Autres réseaux**
Actifs sur:
- [ ] Facebook
- [ ] TikTok (jeune audience)
- [ ] YouTube (vidéos longues atelier)
- [ ] LinkedIn (B2B, décorateurs)
- [ ] Pinterest (inspiration déco)
- [ ] X/Twitter
- [ ] Instagram uniquement

**Q9.3 - Newsletter**
Fréquence envoi:
- [ ] Hebdomadaire (actualités)
- [ ] Mensuelle (digest)
- [ ] Ponctuelle (nouvelle œuvre uniquement)
- [ ] Jamais (pas le temps)

**Q9.4 - Communauté collectors**
Créer espace privé (forum/Discord) où collectors:
- [ ] Partagent photos œuvres chez eux
- [ ] Discutent entre passionnés
- [ ] Ont accès backstage/WIP
- [ ] Non, trop de gestion

**Q9.5 - User-Generated Content**
Encourager clients à poster photos œuvres chez eux ?
- [ ] Oui, concours mensuel (repost + cadeau)
- [ ] Oui, galerie "Chez nos collectors"
- [ ] Non, contrôle qualité/image

---

### CATÉGORIE 10: BUSINESS MODEL

**Q10.1 - Revenus actuels**
Quelle part vient de:
- [ ] Vente en ligne directe (site)
- [ ] Vente galeries (commission)
- [ ] Vente expositions/salons
- [ ] Commandes privées (B2B)

**Q10.2 - Objectif CA annuel**
Cible 2025-2026:
- [ ] €50k - €100k (démarrage)
- [ ] €100k - €250k (croissance)
- [ ] €250k - €500k (scale)
- [ ] €500k+ (maturité)

**Q10.3 - Modèle exclusif**
Vente uniquement sur votre site, ou aussi:
- [ ] Site uniquement (100% marges)
- [ ] Site + 2-3 galeries partenaires (visibilité)
- [ ] Site + marketplace (Saatchi Art, Artsy)

**Q10.4 - Commandes sur-mesure**
Acceptez-vous:
- [ ] Oui, client choisit Ferrari (si accès)
- [ ] Oui, client choisit couleurs/format
- [ ] Non, œuvres existantes uniquement

**Q10.5 - Licensing / Produits dérivés**
Intéressé par:
- [ ] Prints petit format (cartes postales, posters)
- [ ] Objets (coques iPhone, mugs) - via print-on-demand
- [ ] NFT (version digitale certifiée blockchain)
- [ ] Livres d'art (monographie)
- [ ] Non, dévalue l'art

---

## PRIORITÉS APRÈS RÉPONSES

Une fois réponses reçues, implémenter par ordre:

### 🔴 CRITIQUE (Semaine 1)
- Corriger "à partir de" → alternatives validées
- Optimiser homepage (selon Q2.1)
- Améliorer galerie (selon Q2.3)
- Videos atelier si disponibles (selon Q3.1)

### 🟠 HAUTE (Semaine 2-3)
- Configurateur format/cadre si validé (Q2.5)
- Page Expositions si éléments fournis (Q5.2)
- Programme VIP si souhaité (Q4.3)
- AR viewer si budget alloué (Q2.4)

### 🟡 MOYENNE (Mois 2)
- Blog/actualités si volonté publier (Q3.5)
- Chat support si requis (Q6.5)
- Langues additionnelles (Q7.1)
- Analytics dashboard (Q8.4)

### 🟢 BASSE (Mois 3+)
- A/B testing (Q8.5)
- Communauté collectors (Q9.4)
- Produits dérivés (Q10.5)

---

## BENCHMARKS À ANALYSER

Sites artistes contemporains top mondial (photos/toiles):

### Photographes
1. **Peter Lik** (lik.com)
   - Record $6.5M pour "Phantom"
   - Site ultra-premium
   - Galleries physiques worldwide

2. **Andreas Gursky** (andreasgursky.com)
   - Records enchères (>$4M)
   - Minimaliste, focus œuvre
   - Représenté grandes galeries

3. **Gregory Crewdson** (gregorycrewdson.com)
   - Cinematic photography
   - Storytelling fort
   - Éditions limitées claires

### Artistes mixtes (sculptures/peintures)
4. **Jeff Koons** (jeffkoons.com)
   - Vente directe + galeries
   - Certificats blockchain
   - Configurateur 3D

5. **Damien Hirst** (damienhirst.com)
   - Vente NFT + physique
   - Timers / scarcity
   - Exclusivités

6. **Banksy - Pest Control** (pestcontroloffice.com)
   - Authentification uniquement
   - Anti-commercial mais cher
   - Social proof énorme

### Automobilia Artists
7. **Tom Palumbo** (artistswanted.com)
   - Ferrari art photography
   - Éditions limitées
   - Certificats inclus

**À analyser pour chaque**:
- Structure navigation
- Storytelling (textes + vidéos)
- Pricing (affiché ou caché)
- Fonctionnalités (AR, config, VIP)
- Design (minimaliste vs. rich)
- Trust signals (expos, presse, collections)

---

## COMMIT & NEXT STEPS

1. ✅ Sauvegarder ce fichier
2. ⏳ Commit + push
3. ⏳ Poser questions à Raoul (copier/coller section QUESTIONS)
4. ⏳ Pendant qu'il répond: Corriger "à partir de" + séries limitées
5. ⏳ Analyser benchmarks (Peter Lik, Gursky, Koons)
6. ⏳ Préparer plan action selon réponses

---

**Créé par**: Lalou
**Date**: 7 novembre 2025, 23h59
**Durée rédaction**: ~45 min
**Nombre questions**: 50 questions stratégiques
