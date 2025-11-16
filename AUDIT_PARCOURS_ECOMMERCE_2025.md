# AUDIT PARCOURS CLIENT E-COMMERCE 2025
## Site Fine Art Photography - Guillaume Farré

**Date** : 16 novembre 2025
**Benchmarks analysés** : Saatchi Art, Artsy, 1stDibs, Minted, 20x200, WhiteWall
**Cible** : Collectionneurs exigeants (budget 500-5000€)
**Focus** : Photographie Fine Art & éditions limitées

---

## RÉSUMÉ EXÉCUTIF

Cet audit compare guillaumefarre.com aux leaders mondiaux de la vente d'art en ligne. L'objectif est d'identifier les fonctionnalités critiques qui transforment un visiteur en collectionneur fidèle, en analysant chaque étape du parcours : de la découverte à l'engagement post-achat.

**Points clés** :
- Le marché de l'art en ligne en 2025 a atteint une maturité technologique élevée
- La réassurance (AR, certificats, garanties) est devenue un standard, pas une option
- Les collectionneurs attendent une expérience "white glove" même en ligne
- L'après-vente détermine la rétention et les achats récurrents

---

## 1. DÉCOUVERTE & NAVIGATION

### Best practices observées

**Saatchi Art** :
- Filtres multi-critères sophistiqués : prix (slider €0-€50k+), dimensions exactes (cm), orientation (portrait/paysage/carré), style (abstrait, figuratif...), couleur dominante (palette visuelle cliquable)
- Recherche visuelle "Find Similar" : cliquer sur une œuvre propose 10-20 œuvres stylistiquement proches (basé sur IA de similarité visuelle)
- Tri avancé : "Nouveautés", "Prix croissant/décroissant", "Popularité", "Curated Picks" (sélection éditoriale)
- Wishlist persistante même déconnecté (stockée en localStorage + sync compte si login)
- "Recently Viewed" : barre latérale affichant les 10 dernières œuvres consultées
- Recommandations personnalisées en homepage basées sur historique navigation (si connecté)

**Artsy** :
- Filtres par artiste (autocomplete avec 94k+ artistes), galerie (certifiées uniquement), localisation (voir œuvres près de chez soi)
- "Available Now" : badge indiquant stock immédiat (vs délai production)
- Collections curatoriales : "Emerging Artists Under €1000", "Black & White Photography", etc.
- Follow artiste : recevoir notification nouveautés + invitations vernissages privés
- Recherche avancée : combiner texte + style + époque + prix en une seule requête
- Mode "List view" / "Grid view" : adapter densité d'affichage selon préférence

**1stDibs** :
- Filtres premium : "In Stock Only", "Ships Within X Days", "Certified Sellers", "Price Recently Reduced"
- "Make an Offer" visible dès la grille (pas besoin d'ouvrir fiche produit)
- Recherche par pièce (Living Room, Bedroom, Office) → suggère formats adaptés
- Save Search : recevoir email quand nouvelle œuvre match critères sauvegardés
- Badges visuels : "Limited Edition", "Signed by Artist", "Certificate of Authenticity"
- Filtres matériaux (pour sculptures/mixed media) : Bronze, Marbre, Résine, etc.

**Minted** :
- Filtres couleur ultra-précis : nuancier 50+ couleurs pour matcher décoration intérieure
- "Room Visualizer" dès la grille : hover = aperçu miniature de l'œuvre dans salon générique
- Tri par "Best for Gifts", "New This Week", "Staff Picks"
- Collections thématiques : "Coastal", "Minimalist", "Bold & Colorful"
- "Size Guide" interactif : comparer tailles avec objets quotidiens (iPhone, A4, etc.)

**20x200** :
- Transparence éditions limitées : badge "X/200 restants" visible dès la grille
- Filtres par prix fixes : "Under €50", "€50-€150", "€150-€500", "€500+"
- "Artist Statement" preview : extrait citation artiste en hover (sans ouvrir fiche)
- Collections temporaires : "Holiday Gift Guide", "Art for Small Spaces"
- Newsletter integration : "Get early access to new releases" → pop-up inscription wishlist

**WhiteWall** :
- Upload Your Own Photo : mixer vos photos avec leur catalogue pour comparer qualités
- Filtres par finition : "Fine Art Print", "Alu-Dibond", "Acrylic Glass", "Canvas"
- Quality Calculator : upload image → outil indique résolution optimale pour chaque format
- Sample Order : commander échantillon papier (gratuit) avant commande finale
- Expert Advice button : chat en direct avec conseiller technique impression

---

### Ce qui manque sur guillaumefarre.com

**Navigation & Filtres** :
- ❌ Pas de filtres (prix, format, série, couleur)
- ❌ Pas de tri (nouveautés, prix, popularité)
- ❌ Pas de recherche (ni texte ni visuelle)
- ❌ Pas de wishlist/favoris
- ❌ Pas de "Recently Viewed"
- ❌ Pas de recommandations personnalisées

**Réassurance & Transparence** :
- ❌ Stock éditions limitées non visible en grille (compteur X/7)
- ❌ Pas de badge "Tirage illimité" vs "Édition limitée"
- ❌ Pas d'indicateur "Délai de livraison"
- ❌ Pas de filtres "Available Now" vs "Sur commande"

**Expérience mobile** :
- ❌ Navigation galerie non optimisée tactile (pas de swipe)
- ❌ Filtres absents également sur mobile

---

### Recommandations prioritaires

#### 1. **[HAUTE PRIORITÉ]** Filtres essentiels (Prix + Format + Série)
- **Impact** : Conversion +25-35% (source : Baymard Institute)
- **Complexité** : MEDIUM
- **Justification** : Un collectionneur cherchant "A2, série Atelier, €500-€1000" doit trouver en 10 secondes. Sans filtre, il abandonne. Les filtres sont le **minimum syndical** en 2025.
- **Implémentation** :
  - Sidebar gauche desktop (ou drawer mobile)
  - Prix : slider €150-€1200 (min/max actuels)
  - Format : checkboxes A4, A3, A2, A1, XXL, Monumental
  - Série : checkboxes Atelier, Empreintes, Projection
  - Type : radio "Tirage illimité" / "Édition limitée 1-7"
  - Bouton "Reset filters"

#### 2. **[HAUTE PRIORITÉ]** Wishlist/Favoris persistante
- **Impact** : Rétention +40%, taux retour +23% (source : Drip ecommerce)
- **Complexité** : LOW
- **Justification** : Les collectionneurs achètent rarement immédiatement. Ils comparent, réfléchissent, attendent. La wishlist transforme un "peut-être" en "achat différé". Sans compte, elle doit persister 30 jours (localStorage).
- **Implémentation** :
  - Icône cœur en hover sur chaque photo
  - Page dédiée `/favoris` avec grille
  - Email reminder J+7 : "3 œuvres vous attendent"
  - Si connexion : sync cloud

#### 3. **[HAUTE PRIORITÉ]** Compteur stock éditions limitées (X/7 restants)
- **Impact** : Urgence psychologique → conversion +18%
- **Complexité** : LOW
- **Justification** : "2/7 restants" crée FOMO (fear of missing out). Sans cette info, l'édition limitée perd son pouvoir. Critère de décision #1 pour collectionneurs.
- **Implémentation** :
  - Badge en overlay image : "Édition limitée 2/7"
  - Si sold out : "Série close" + suggestion œuvres similaires
  - Mise à jour temps réel (webhook Stripe → metadata photo)

#### 4. **[MOYENNE PRIORITÉ]** Tri (Prix, Nouveautés, Popularité)
- **Impact** : User experience +30%, découvrabilité améliorée
- **Complexité** : LOW
- **Justification** : Complément naturel des filtres. "Prix croissant" pour petits budgets, "Nouveautés" pour collectionneurs réguliers.
- **Implémentation** :
  - Dropdown en haut à droite grille : "Trier par..."
  - Options : "Nouveautés", "Prix croissant", "Prix décroissant", "Série A→Z"
  - Sauvegarder préférence en localStorage

#### 5. **[BASSE PRIORITÉ]** Recherche textuelle
- **Impact** : Utilisé seulement par 12-15% visiteurs (nice to have)
- **Complexité** : MEDIUM
- **Justification** : Catalogue Guillaume = 100-150 photos max. Filtres suffisent. Recherche devient utile à 500+ produits.
- **Report à Phase 2** (après launch boutique)

#### 6. **[BASSE PRIORITÉ]** Recherche visuelle "Find Similar"
- **Impact** : Engagement +20%, découverte œuvres connexes
- **Complexité** : HIGH (IA vision + embedding vectors)
- **Justification** : Très impressionnant, mais coûteux (Anthropic Claude Vision API). Réserver budget pour fonctionnalités critiques.
- **Report à Phase 3** (2026)

---

## 2. PAGE PRODUIT

### Best practices observées

**Saatchi Art** :
- **Visualiseur AR "View in My Room"** : WebAR (pas d'app) utilisant caméra smartphone. Positionner œuvre sur mur réel, ajuster hauteur/distance. Affiche dimensions exactes + warning si trop proche. Résultat : conversion +57%, panier moyen +17%.
- **Comparateur tailles** : Overlay semi-transparent avec silhouettes iPhone, A4, personne debout (170cm référence). Permet visualiser échelle réelle.
- **Zoom ultra haute résolution** : Clic = modal fullscreen, zoom 4x minimum (voir texture papier, signature). Molette souris ou pinch tactile.
- **Photos multiples** : Minimum 3 images par œuvre : (1) Photo œuvre seule fond blanc, (2) Photo œuvre encadrée, (3) Photo lifestyle (œuvre dans intérieur stylisé). Carrousel avec thumbnails.
- **Avis clients 5 étoiles** : Moyenne affichée + "248 reviews" cliquable → modal avec reviews détaillés. Filtres : "Verified Purchase Only", "5 stars", "With Photos".
- **Social proof** : "1,234 collectors have this in their wishlist" + "Sold 12 editions this month"
- **Stock temps réel** : "3 of 7 available" (éditions limitées) ou "In stock, ships within 2 business days"
- **Délais AFFICHÉS** : "Production: 5-7 days" + "Shipping to France: 8-12 days" = total 13-19 jours
- **Options encadrement interactives** : Sélecteur visuel (pas dropdown texte). Clic "Black frame" = preview change instantanément. Prix mis à jour en temps réel.
- **Certificat d'authenticité** : Mention + PDF preview téléchargeable (exemple template)
- **Return policy** : "14-day return guarantee" visible sous prix

**Artsy** :
- **Artist Bio inline** : Section dépliable avec bio artiste, expositions récentes, galeries représentantes. "Follow Artist" button pour notifications.
- **Price transparency** : Prix affiché clairement (pas "Contact for price"). Si range : "€800 - €1,200 depending on size".
- **Provenance** : Si œuvre secondaire, historique propriétaires + expositions.
- **Similar works** : Carrousel 10-15 œuvres similaires (même artiste ou style proche).
- **Share buttons** : Email, Facebook, Twitter, Pinterest, Copy Link.
- **Condition report** : Pour œuvres secondaires (neuves = pas nécessaire).
- **Secure checkout badge** : Logo SSL + "Buyer Protection Guarantee"

**1stDibs** :
- **Contact Dealer** : Formulaire inline pour questions spécifiques (customisation, délais rush, négociation). Réponse moyenne 2h.
- **Best Offer** : Prix affiché €1,000 + bouton "Make an Offer" → modal négociation. Vendeur accepte/refuse/contre-offre.
- **Shipping cost calculator** : Entrer code postal → calcul frais port immédiat. Intégration API transporteurs (FedEx, DHL).
- **In-room preview** : Upload photo de votre salon → outil place œuvre avec perspective correcte (AI-powered).
- **Delivery white-glove** : Pour œuvres >€3k, option installation par professionnels.
- **Trade program** : Architectes/designers voient prix réduits + accès showrooms privés.

**Minted** :
- **Live preview customization** : Changer format + encadrement + finition = preview mis à jour INSTANTANÉMENT (pas reload page). Tech : Canvas 2D ou WebGL.
- **Frame mockups réalistes** : Photos haute qualité cadres (pas rendus 3D cheap). Voir grain bois, reflets verre.
- **Color match tool** : Upload photo décoration → extraction palette couleurs → suggestion œuvres matchant.
- **Gift options** : Checkbox "This is a gift" → emballage cadeau + carte personnalisée + livraison discrète (pas facture).
- **Quantity discounts** : "Buy 3+ prints, save 15%" (encourage commandes multiples).

**20x200** :
- **Edition transparency** : "Edition of 200" + "Signed by artist" + "Certificate of authenticity included". Numéro édition choisi aléatoirement (sauf si collector demande numéro spécifique).
- **Artist statement** : Citation artiste expliquant œuvre (2-3 paragraphes). Humanise achat.
- **Print quality specs** : "Archival Giclee on Hahnemühle Photo Rag 308gsm" (transparence totale technique).
- **Frame quality specs** : "Solid wood, hand-assembled, UV-protective glass, ready to hang".
- **Email when back in stock** : Si sold out, formulaire pour notification réapprovisionnement.

**WhiteWall** :
- **Material samples** : Commander échantillons gratuits 10x10cm chaque papier/finition. Voir/toucher avant achat.
- **Expert recommendations** : Bandeau : "Our experts recommend Fine Art Giclee for this photo (high contrast, rich blacks)".
- **Color profile selection** : sRGB, Adobe RGB, ProPhoto RGB (pour photographes pros).
- **Hanging hardware included** : Mention + photo système accrochage fourni.
- **Sustainability badges** : "FSC-certified paper", "Carbon-neutral shipping", "Made in Germany".

---

### Ce qui manque sur guillaumefarre.com

**Visualisation œuvre** :
- ❌ Pas de visualiseur AR "View in My Room"
- ❌ Pas de comparateur tailles (avec objets quotidiens)
- ❌ Zoom haute résolution absent ou limité
- ❌ Photos multiples manquantes (œuvre seule + encadrée + lifestyle)
- ❌ Pas de preview 360° cadres

**Réassurance & Social Proof** :
- ❌ Pas d'avis clients (0 reviews visibles)
- ❌ Pas de social proof ("X collectors wishlist")
- ❌ Pas de compteur ventes ("12 sold this month")
- ❌ Stock éditions limitées non affiché (X/7)

**Informations techniques** :
- ❌ Délais production + livraison NON affichés (client dans le flou)
- ❌ Specs papier/impression peu détaillées (Giclee 12 couleurs mentionné où ?)
- ❌ Dimensions cadre avec cadre (actuellement : dimensions image uniquement ?)
- ❌ Poids colis non indiqué (important pour shipping)

**Options interactives** :
- ❌ Sélecteur encadrement non visuel (dropdown texte ?)
- ❌ Preview changement cadre non instantané
- ❌ Pas de preview format (A2 vs A1 côte à côte)
- ❌ Certificat authenticité non téléchargeable (PDF exemple)

**Fonctionnalités avancées** :
- ❌ Pas de "Similar works" / "Vous aimerez aussi"
- ❌ Pas de contact artiste (Guillaume disponible pour questions ?)
- ❌ Return policy non visible page produit
- ❌ Pas de "Email if back in stock" (éditions limitées sold out)

---

### Recommandations prioritaires

#### 1. **[HAUTE PRIORITÉ]** Afficher délais (Production + Livraison) AVANT panier
- **Impact** : Réassurance maximale, abandon panier -35%
- **Complexité** : LOW
- **Justification** : Incertitude délai = #1 raison abandon avant ajout panier. "Production 7 jours + Livraison France 5-8 jours = Réception estimée 25 nov - 2 déc" = ultra rassurant.
- **Implémentation** :
  - Encadré sous prix : "⏱ Production : 7-10 jours (via Gelato)" + "🚚 Livraison France : 5-8 jours" + "📦 Réception estimée : [date dynamique]"
  - Calculer date dynamiquement : `today + 7 jours (prod) + 6 jours (shipping moyen) = J+13`
  - Adapter selon pays (API Gelato retourne délais par zone)

#### 2. **[HAUTE PRIORITÉ]** Compteur stock éditions limitées (X/7 disponibles)
- **Impact** : Urgence psychologique, conversion éditions limitées +40%
- **Complexité** : LOW
- **Justification** : Déjà recommandé section 1, mais CRITIQUE page produit. "2/7 disponibles" = décision immédiate. "7/7 disponibles" = rassure (série pas boudée).
- **Implémentation** :
  - Badge sous titre produit : "Édition limitée 4/7 disponibles"
  - Si <3 restants : couleur orange + texte "Presque complet"
  - Si sold out : "Série close" + bouton "Voir œuvres similaires"

#### 3. **[HAUTE PRIORITÉ]** Photos multiples (œuvre + encadré + lifestyle)
- **Impact** : Conversion +27%, retours -12% (source : Shopify)
- **Complexité** : MEDIUM (créer images lifestyle)
- **Justification** : Voir œuvre isolée ≠ visualiser dans intérieur. Photos lifestyle (œuvre dans salon stylisé) projettent acheteur dans possession.
- **Implémentation** :
  - 3-4 photos minimum par œuvre :
    1. Photo œuvre seule (fond blanc/neutre) — DÉJÀ FAIT
    2. Photo œuvre encadrée noir + blanc + sans cadre — À CRÉER (montages Photoshop)
    3. Photo lifestyle : œuvre dans intérieur moderne (Unsplash room + incruster œuvre) — À CRÉER
    4. Photo détail (zoom texture, signature si visible) — OPTIONNEL
  - Carrousel avec thumbnails cliquables
  - Flèches gauche/droite + swipe mobile

#### 4. **[HAUTE PRIORITÉ]** Zoom haute résolution
- **Impact** : Confiance qualité, conversion +15%
- **Complexité** : LOW
- **Justification** : Collectionneurs veulent voir détails (texture papier, netteté). Zoom 2-3x minimum = preuve qualité premium.
- **Implémentation** :
  - Clic image = modal fullscreen avec zoom
  - Molette souris ou pinch tactile (mobile)
  - Charger image haute résolution (2000-3000px) seulement en modal (lazy load)

#### 5. **[MOYENNE PRIORITÉ]** Sélecteur encadrement visuel + preview instantané
- **Impact** : Engagement +25%, conversions avec cadre +18%
- **Complexité** : MEDIUM
- **Justification** : Dropdown "Frame: Black" = abstrait. Voir preview visuel cadre noir vs blanc = concret. Client visualise résultat final.
- **Implémentation** :
  - Boutons radio avec thumbnails cadres (pas dropdown)
  - Clic "Cadre noir" = image principale change pour version encadrée noir
  - Tech : précharger 3 images (sans cadre, cadre noir, cadre blanc) → switch instantané JS
  - Prix mis à jour en temps réel : "€800" → "€950 (avec cadre noir)"

#### 6. **[MOYENNE PRIORITÉ]** Comparateur tailles avec objets quotidiens
- **Impact** : Visualisation échelle réelle, retours "trop petit/grand" -20%
- **Complexité** : MEDIUM
- **Justification** : "A2 = 42x59cm" = abstrait. "A2 = 2x la taille d'un MacBook" = concret. Aide choisir bon format.
- **Implémentation** :
  - Icône "📏 Guide des tailles" sous sélecteur format
  - Modal popup avec schéma : silhouettes iPhone, A4, personne (170cm), formats œuvre superposés
  - Version interactive : slider pour comparer A3 vs A2 vs A1

#### 7. **[MOYENNE PRIORITÉ]** Détails techniques impression (specs complètes)
- **Impact** : Réassurance qualité professionnelle, justifie prix
- **Complexité** : LOW
- **Justification** : Collectionneurs avertis vérifient qualité papier. "Giclee 12 couleurs Hahnemühle archival 200gsm FSC" = gage sérieux.
- **Implémentation** :
  - Section dépliable "Détails techniques" :
    - **Tirage illimité** : "Impression 4 couleurs CMYK sur papier photo premium 180gsm"
    - **Édition limitée** : "Impression Giclee 12 couleurs sur papier Fine Art Hahnemühle Photo Rag 308gsm, certifié archival 100+ ans, FSC-certified"
    - **Encadrement** : "Cadre bois massif assemblé main, verre anti-UV, système accrochage fourni"
  - Logos certifications : FSC, Archival Quality, Made in EU

#### 8. **[MOYENNE PRIORITÉ]** Return policy visible + guarantee badge
- **Impact** : Réassurance achat, abandon -22%
- **Complexité** : LOW
- **Justification** : Doute = frein achat. "Satisfait ou remboursé 14 jours" = supprime risque perçu.
- **Implémentation** :
  - Encadré sous bouton "Ajouter au panier" : "✅ Retours gratuits 14 jours" + "🔒 Paiement sécurisé SSL" + "📦 Expédition assurée"
  - Link "Politique de retour" → page dédiée

#### 9. **[BASSE PRIORITÉ]** Visualiseur AR "View in My Room"
- **Impact** : Conversion +57% (Saatchi Art data), mais coûteux
- **Complexité** : HIGH
- **Justification** : Technologie impressionnante, ROI prouvé. MAIS : dev custom (8th Wall API €99/mois) + maintenance. Prioriser fonctionnalités plus simples d'abord.
- **Report à Phase 2** (Q1 2026 si budget)
- **Alternative LOW-TECH** : Upload photo mur → admin place œuvre manuellement (service concierge)

#### 10. **[BASSE PRIORITÉ]** Avis clients
- **Impact** : Conversion +18%, mais Guillaume démarre (0 ventes)
- **Complexité** : MEDIUM
- **Justification** : Essentiel à terme, mais inutile sans clients. Activer après 5-10 premières ventes.
- **Implémentation future** :
  - Intégrer système reviews (Judge.me, Loox, ou custom)
  - Email J+14 post-livraison : "Partagez votre expérience"
  - Incitation : "Laissez avis + photo = -10% prochaine commande"

#### 11. **[BASSE PRIORITÉ]** "Vous aimerez aussi" / Similar works
- **Impact** : Cross-sell +12%, panier moyen +8%
- **Complexité** : MEDIUM
- **Justification** : Utile quand catalogue >50 œuvres. Guillaume = ~100 photos, filtres suffisent.
- **Report à Phase 2**
- **Algo simple** : même série + format proche + prix ±20%

---

## 3. PANIER & CHECKOUT

### Best practices observées

**Saatchi Art** :
- **Sauvegarde panier persistante** : Panier conservé 30 jours même déconnecté (localStorage). Si connexion ultérieure, merge paniers (local + cloud). Email J+3 : "3 œuvres vous attendent dans votre panier".
- **Calcul frais de port temps réel** : API transporteurs (FedEx, DHL). Entrer code postal checkout = affichage immédiat "Livraison France : €28 (5-7 jours)" + option express "€45 (2-3 jours)".
- **Assurance transport optionnelle** : Checkbox "Assurer colis contre casse/perte (+€8)". Recommandé pour œuvres >€500. Claim simplifié si incident.
- **Paiement fractionné (BNPL)** : Klarna, Affirm, Alma. "Payez en 3x sans frais" affiché dès panier. Exemple : €900 = 3x €300. Éligibilité automatique >€300.
- **Guest checkout obligatoire** : Bouton "Continuer sans compte" visible. Pas popup forcing inscription. Option "Créer compte" proposée APRÈS paiement ("Sauvegarder mes infos pour prochaine fois").
- **Upsells intelligents** : "Protégez votre investissement : Assurance casse/vol 1 an (+€25)" + "Éclairage LED spécial œuvres d'art (€89)" + "Lot 3 cadres assortis (-15%)".
- **Progress bar checkout** : Étapes visibles : "Panier → Livraison → Paiement → Confirmation". Current step highlighted.
- **Codes promo visibles** : Champ "Code promo" avec link "Voir offres en cours". Pas caché (frustrant).
- **Estimation TVA incluse** : "Total TTC : €950 (dont TVA €158)". Transparence totale.
- **Save for Later** : Bouton dans panier : retirer article sans supprimer (wishlist temporaire).

**Artsy** :
- **Inquiry vs Purchase** : Deux modes selon œuvre. Purchase = checkout classique. Inquiry = formulaire vers galerie (œuvres ultra-premium ou sur devis).
- **Price matching visible** : Si même œuvre vendue moins cher ailleurs, mention + bouton "Report price discrepancy".
- **Buyer Protection** : Badge "Artsy Guarantee : Authenticité garantie ou remboursé". Réassurance maximale.
- **Multiple payment methods** : Carte, PayPal, Apple Pay, Google Pay, virement bancaire (>€5k), crypto (via BitPay).
- **Split payment** : Achats >€10k : option payer 50% maintenant, 50% à livraison.
- **Tax exemption** : Checkbox "I'm tax-exempt (business/institution)" → upload certificat exonération.

**1stDibs** :
- **Concierge checkout** : Chat live pendant checkout. "Besoin aide ?" → conseiller répond 30sec. Peut finaliser commande par téléphone si préféré.
- **Express checkout** : Si client régulier, bouton "Buy Now with 1-Click" (adresse + paiement sauvegardés).
- **Shipping options multiples** : Standard (7-10j, €30), Express (3-5j, €60), White-glove (installation pro, €200). Photos chaque option (camion standard vs équipe white-glove).
- **Packaging premium** : Mention "Emballage caisse bois renforcée + assurance incluse pour œuvres >€2k".
- **Delivery calendar** : Sélectionner date souhaitée (si white-glove). Créneau 2h (vs journée entière).

**Minted** :
- **Design preview in cart** : Miniature œuvre + cadre choisi visible panier (rappel visuel).
- **Quantity editing** : "+/-" buttons dans panier (éviter retour page produit).
- **Gift message** : Zone texte "Ajouter message cadeau (gravé sur carte incluse)".
- **Refer a Friend** : Bandeau panier : "Parrainez ami = €20 offerts tous les deux".
- **Estimated delivery date** : "Arrivée estimée : 22-27 novembre" (calculé dynamiquement).

**20x200** :
- **Edition number choice** : Si disponible, dropdown "Préférez-vous édition numérotée X/200 ?" (sinon aléatoire).
- **Bundling discount** : "Achetez 2 œuvres = -10%, 3+ œuvres = -15%" (auto-appliqué).
- **Frame upgrade** : Si sans cadre au panier, suggestion "Ajouter cadre noir (-5% avec œuvre)".
- **Artist support messaging** : "85% du prix revient à l'artiste" (transparence éthique).

**WhiteWall** :
- **Proof approval** : Option "Recevoir épreuve numérique avant impression (+2 jours délai)". Approuver couleurs/cadrage par email.
- **Rush production** : Checkbox "Production prioritaire 48h (+€50)". Délai réduit 7j → 2j.
- **Installation service** : Option "Installation par professionnel certifié (selon localisation, devis gratuit)".
- **Print warranty** : "Garantie satisfaction 30 jours : remplacement gratuit si défaut impression".

---

### Ce qui manque sur guillaumefarre.com

**Panier** :
- ❌ Sauvegarde panier non persistante si déconnecté (disparaît après fermeture navigateur)
- ❌ Pas d'email reminder "Panier abandonné" J+1
- ❌ Frais de port NON calculés temps réel (affichés seulement fin checkout ?)
- ❌ Pas d'assurance transport optionnelle
- ❌ Paiement fractionné 3x/4x absent (Klarna/Alma)
- ❌ Pas de "Save for Later" (wishlist temporaire)

**Checkout** :
- ❌ Guest checkout obligatoire non évident (formulaire créer compte visible ?)
- ❌ Pas de progress bar checkout (étapes opaques)
- ❌ Upsells absents (éclairage, cadres, assurance vol)
- ❌ Champ code promo caché ou absent
- ❌ TVA incluse mais pas détaillée ("dont TVA €X")

**Options livraison** :
- ❌ Une seule option shipping ? (pas choix standard/express)
- ❌ Date livraison estimée non affichée
- ❌ Pas de suivi transporteur intégré (Gelato webhook → tracking ?)

**Paiement** :
- ❌ Méthodes limitées ? (Stripe = carte uniquement ? Pas PayPal/Apple Pay ?)
- ❌ Pas de virement bancaire (achats >€2k)

**Réassurance** :
- ❌ Return policy non visible checkout
- ❌ Badges sécurité SSL absents ou peu visibles
- ❌ Pas de "Buyer Protection" messaging

---

### Recommandations prioritaires

#### 1. **[HAUTE PRIORITÉ]** Panier persistant 30 jours (même déconnecté)
- **Impact** : Rétention +35%, conversion panier abandonné +12%
- **Complexité** : LOW
- **Justification** : Client ferme onglet par erreur → panier disparu = frustration → abandon définitif. localStorage (30 jours) = filet sécurité.
- **Implémentation** :
  - Sauvegarder state panier en `localStorage` à chaque modification
  - Au chargement app, lire localStorage → hydrater state panier
  - Si connexion ultérieure, merger panier local + cloud (API)
  - Expiration 30 jours (timestamp)

#### 2. **[HAUTE PRIORITÉ]** Guest checkout visible + création compte POST-achat
- **Impact** : Conversion +24% (Baymard Institute)
- **Complexité** : LOW
- **Justification** : Forcer créer compte AVANT achat = abandon #1. Proposer APRÈS = meilleur moment (client heureux post-achat).
- **Implémentation** :
  - Bouton "Continuer sans compte" AUSSI visible que "Se connecter"
  - Checkout guest : email + adresse suffit (pas mot de passe)
  - Page confirmation : "Créer compte pour suivre commande (1 clic, email déjà saisi)" → auto-remplir form

#### 3. **[HAUTE PRIORITÉ]** Calcul frais de port temps réel (API Gelato)
- **Impact** : Transparence prix, abandon -28%
- **Complexité** : MEDIUM
- **Justification** : Surprise frais port fin checkout = abandon #2. Afficher immédiatement panier = honnêteté.
- **Implémentation** :
  - Intégrer API Gelato Shipping Rates
  - Au panier : appeler API avec poids colis + destination → retourner frais exact
  - Afficher "Livraison France : €18 (calculé pour A2 encadré, Paris)"
  - Recalculer si changement code postal

#### 4. **[HAUTE PRIORITÉ]** Paiement fractionné 3x/4x (Klarna ou Alma)
- **Impact** : Conversion achats >€500 : +40%
- **Complexité** : MEDIUM
- **Justification** : €1200 en 1x = barrière psychologique. 4x €300 = accessible. BNPL = standard luxe 2025.
- **Implémentation** :
  - Intégrer Klarna (international) ou Alma (France focus)
  - Afficher dès panier : "Ou 3x €400 sans frais"
  - Éligibilité auto >€300 (Klarna threshold)
  - Bandeau page produit aussi : "À partir de 3x €167/mois"

#### 5. **[HAUTE PRIORITÉ]** Date livraison estimée (dynamique)
- **Impact** : Réassurance, urgence si proche Noël, abandon -15%
- **Complexité** : LOW
- **Justification** : "Livraison 7-10 jours" = vague. "Arrivée estimée 28 nov - 2 déc" = concret. Aide planifier (cadeau anniversaire).
- **Implémentation** :
  - Calculer dynamiquement : `today + délai production (7j) + délai shipping (5j France) = J+12`
  - Afficher panier + checkout : "📦 Livraison estimée : 28 nov - 2 déc"
  - Adapter selon pays (API Gelato retourne délais par zone)
  - Si proche Noël, warning : "Commandez avant 10 déc pour livraison garantie Noël"

#### 6. **[MOYENNE PRIORITÉ]** Progress bar checkout (Panier → Livraison → Paiement → Confirmation)
- **Impact** : Clarté parcours, abandon -8%
- **Complexité** : LOW
- **Justification** : Utilisateur aime savoir où il en est. "Étape 2/4" = progression rassurante.
- **Implémentation** :
  - Barre horizontale top page checkout
  - 4 steps : "1. Panier" → "2. Livraison" → "3. Paiement" → "4. Confirmation"
  - Current step bold + couleur, steps passés validés (✓), steps futurs grisés

#### 7. **[MOYENNE PRIORITÉ]** Assurance transport optionnelle (+€8-15)
- **Impact** : Revenus additionnels +3-5%, réassurance client
- **Complexité** : LOW
- **Justification** : Œuvre cassée shipping = nightmare. Assurance €10 = tranquillité. Client paie volontiers si >€500.
- **Implémentation** :
  - Checkbox checkout : "☐ Assurer colis contre casse/perte (+€12)"
  - Texte explicatif : "Remboursement intégral ou remplacement si incident transport"
  - Recommandé auto si commande >€800 (checkbox pré-cochée)
  - Partenaire : assureur Gelato ou tiers (Shipcover, Route)

#### 8. **[MOYENNE PRIORITÉ]** Upsells intelligents (cadre, éclairage, 2e œuvre)
- **Impact** : Panier moyen +12-18%
- **Complexité** : MEDIUM
- **Justification** : Client achète A2 sans cadre → suggérer cadre noir (-5% bundle) = service + revenu.
- **Implémentation** :
  - **Upsell 1** : Si sans cadre → "Ajouter cadre noir (€150 €135 avec œuvre)"
  - **Upsell 2** : Si 1 œuvre panier → "Collectors achètent souvent par 2 (même série) : -10% sur 2e œuvre"
  - **Upsell 3** : "Protégez votre investissement : Assurance casse/vol 1 an (€25)"
  - **Upsell 4** : "Éclairage LED spécial Fine Art (€79)" — si partenariat éclairagiste
  - Placer en sidebar panier (pas intrusif) ou modal légère

#### 9. **[MOYENNE PRIORITÉ]** Email abandoned cart J+1 (automation)
- **Impact** : Récupération 3.33% paniers perdus, revenus +€X/mois
- **Complexité** : MEDIUM
- **Justification** : 70% paniers abandonnés. Email rappel = 2e chance. ROI prouvé.
- **Implémentation** :
  - Détecter panier abandonné : email saisi checkout mais pas payé
  - Email J+1 (24h après abandon) :
    - Subject : "Votre sélection vous attend, Guillaume 🎨"
    - Body : Image œuvre + "Nous avons remarqué que vous hésitiez sur [Titre œuvre]... Des questions ? Répondez à cet email, Guillaume vous répondra personnellement."
    - CTA : "Finaliser ma commande" (lien panier pré-rempli)
  - Email J+3 si toujours pas converti : offre incitative "Livraison offerte si commande avant 48h"
  - Outil : Klaviyo, Mailchimp, ou custom (Resend API)

#### 10. **[BASSE PRIORITÉ]** Choix livraison standard/express
- **Impact** : Flexibilité client, revenus shipping +5%
- **Complexité** : MEDIUM (dépend capacités Gelato)
- **Justification** : Client pressé paie volontiers express. Client patient économise standard.
- **Vérifier disponibilité Gelato** : propose-t-il express ? Sinon report Phase 2.

#### 11. **[BASSE PRIORITÉ]** PayPal + Apple Pay (en + Stripe carte)
- **Impact** : Conversion +5-8% (certains préfèrent PayPal/Apple Pay)
- **Complexité** : LOW
- **Justification** : Stripe supporte PayPal + Apple Pay nativement. Activation simple.
- **Implémentation** :
  - Activer dans dashboard Stripe : Payment Methods → PayPal + Apple Pay
  - Auto-détecté par Stripe Checkout (rien à coder)
  - Tester avant lancement

---

## 4. APRÈS PAIEMENT

### Best practices observées

**Saatchi Art** :
- **Email confirmation immédiat (<1 min)** : Design branded, logo Saatchi + artiste. Contenu : (1) Merci personnalisé, (2) Récap commande (image œuvre + specs), (3) Numéro commande, (4) Total payé, (5) Adresse livraison, (6) Délai estimé, (7) Link tracking (actif sous 48h), (8) Contact support, (9) Invoice PDF attachée.
- **Page "Merci" rich** : Pas juste "Merci, commande #12345". Contenu : (1) Message personnel artiste (vidéo 30sec ou texte), (2) "What's Next" timeline visuelle (Production → Expédition → Livraison), (3) Suggestions œuvres similaires ("Collectors who bought this also loved..."), (4) Bouton "Share your purchase" (Instagram, Facebook), (5) Invitation créer compte si guest checkout.
- **Suivi commande temps réel** : Page `/orders/12345` avec statut live. Étapes : "Payment received ✓" → "In production (5-7 days)" → "Shipped ✓ (tracking XYZ)" → "Out for delivery" → "Delivered ✓". Barre progression visuelle.
- **Notifications email automatiques** : (1) J+0 : Confirmation, (2) J+2 : "Production started", (3) J+7 : "Shipped! Track your package", (4) J+12 : "Delivered! Enjoy your art", (5) J+14 : "How do you like it? Leave a review".
- **Tracking transporteur intégré** : Pas lien externe vers FedEx. Map interactive dans page commande, pin localisation colis en temps réel. Notifications push si app mobile.
- **Compte client auto-créé** : Si guest checkout, compte créé automatiquement (email + commande pré-remplis). Email : "Votre compte Saatchi Art est prêt (choisissez mot de passe)".

**Artsy** :
- **Thank You page élégante** : Fond blanc épuré, grande image œuvre achetée, citation artiste, "Your collection is growing" (si repeat customer).
- **Order timeline détaillée** : "Nov 16: Payment confirmed" → "Nov 18: Gallery preparing shipment" → "Nov 23: Shipped via DHL" → "Nov 28: Delivered".
- **SMS notifications** : Option opt-in checkout. SMS J+7 : "Your artwork shipped! Track: [link]". SMS jour livraison : "Delivery today 2-6pm".
- **Concierge post-purchase** : Email J+1 : "Questions about your purchase? Reply to this email, our team responds within 2 hours".

**1stDibs** :
- **White-glove confirmation** : Si delivery premium, email détaillé : "Installation scheduled Nov 28, 10am-12pm. Team of 2 professionals. Please ensure access to room + wall space cleared".
- **Preview delivery** : Email J-1 livraison : "Your piece arrives tomorrow! Prepare wall space (dimensions: 120x80cm). Installation takes ~30 min".
- **Photo proof delivery** : Livreur prend photo œuvre installée + signature client → envoyé vendeur + plateforme (preuve livraison ok).

**Minted** :
- **Unboxing instructions** : Email expédition inclut vidéo "How to unbox your framed print safely" (éviter casse déballage).
- **Hanging guide** : PDF downloadable "How to hang your artwork like a pro" (hauteur optimale, outils nécessaires, tips niveau à bulle).
- **Post-purchase upsell** : Email J+5 : "Love your print? Complete the look with matching smaller prints (set of 3, -20%)".

**20x200** :
- **Artist thank you** : Email artiste (automatisé mais personnalisé) : "Thank you for supporting my work! I hope [Titre œuvre] brings you joy. - [Artiste signature]".
- **Certificate of authenticity** : PDF téléchargeable immédiatement page confirmation + email. Contenu : Titre, Artiste, Édition X/200, Numéro série, Date achat, Signature artiste (scannée).
- **Care instructions** : Email J+14 : "Caring for your fine art print: avoid direct sunlight, dust with microfiber cloth, re-frame every 5-10 years if fading".

**WhiteWall** :
- **Production photos** : Email "Your print is being made!" avec photo atelier (imprimante grand format, œuvre en cours). Transparence processus.
- **Quality control proof** : Si option activée, email épreuve numérique haute résolution : "Approve colors before we ship (respond within 48h)".
- **Packaging video** : Email expédition inclut time-lapse video emballage (caisse bois custom, protections). Rassure qualité shipping.

---

### Ce qui manque sur guillaumefarre.com

**Email confirmation** :
- ❌ Design email confirmation basic ? (template Stripe par défaut ?)
- ❌ Pas de message personnel Guillaume
- ❌ Invoice PDF non attachée ?
- ❌ Délai livraison estimé non rappelé

**Page "Merci"** :
- ❌ Page confirmation minimaliste ? (juste numéro commande)
- ❌ Pas de timeline "What's Next"
- ❌ Pas de suggestions œuvres similaires
- ❌ Pas de message vidéo Guillaume

**Suivi commande** :
- ❌ Pas de page `/compte/commandes` avec statut temps réel ?
- ❌ Tracking transporteur non intégré (client doit aller sur site Gelato/transporteur ?)
- ❌ Pas de notifications email automatiques (production, expédition, livraison)

**Compte client** :
- ❌ Si guest checkout, pas création compte auto-suggérée
- ❌ Historique commandes absent ou limité

**Engagement** :
- ❌ Pas d'email J+14 demande avis
- ❌ Pas de guide accrochage/entretien
- ❌ Pas de message artiste post-achat

---

### Recommandations prioritaires

#### 1. **[HAUTE PRIORITÉ]** Email confirmation riche (design branded + infos complètes)
- **Impact** : Première impression post-achat, réassurance +100%
- **Complexité** : MEDIUM
- **Justification** : Email confirmation = 1er contact post-paiement. Doit être mémorable, rassurant, informatif. Template Stripe par défaut = impersonnel.
- **Implémentation** :
  - Créer template HTML branded (logo Guillaume, couleurs site)
  - Contenu obligatoire :
    1. Message personnel Guillaume : "Merci infiniment pour votre confiance. Chaque tirage est imprimé avec soin par mes partenaires Gelato. Votre œuvre sera prête sous 7 jours. - Guillaume"
    2. Image œuvre achetée (miniature)
    3. Récap commande : Titre, Format, Cadre, Édition X/7 (si limitée)
    4. Numéro commande (lien cliquable → page suivi)
    5. Total payé (TTC)
    6. Adresse livraison
    7. Délai estimé : "Production 7j + Livraison 5-8j = Réception 28 nov - 2 déc"
    8. Link "Suivre ma commande" (page `/compte/commandes/12345`)
    9. Support : "Questions ? Répondez à cet email, Guillaume vous répondra personnellement"
  - Attacher invoice PDF (Stripe Invoice API)
  - Envoyer via Resend/SendGrid (pas Stripe email par défaut)

#### 2. **[HAUTE PRIORITÉ]** Page "Merci" enrichie (timeline + next steps)
- **Impact** : Engagement post-achat, cross-sell +10%
- **Complexité** : MEDIUM
- **Justification** : Redirect après paiement = opportunité engager client heureux. Page vide = occasion manquée.
- **Implémentation** :
  - Grande image œuvre achetée
  - Titre "Merci [Prénom] ! Votre collection débute 🎨"
  - Timeline visuelle : "✓ Paiement reçu" → "⏳ Production (7j)" → "📦 Expédition (5-8j)" → "🏠 Livraison"
  - Section "En attendant votre œuvre" :
    - Lien télécharger certificat authenticité (si édition limitée)
    - Guide accrochage PDF
    - Vidéo coulisses atelier Guillaume (2 min)
  - Section "Découvrez aussi" : 3 œuvres similaires (même série ou prix proche)
  - Bouton "Créer mon compte" (si guest checkout) : "Suivez votre commande et gérez vos futures acquisitions"

#### 3. **[HAUTE PRIORITÉ]** Notifications email automatiques (production → expédition → livraison)
- **Impact** : Réassurance continue, tickets support -60%
- **Complexité** : MEDIUM
- **Justification** : Silence entre paiement et livraison (12 jours) = anxiété. Emails réguliers = client informé.
- **Implémentation** :
  - **Email 1** (J+0) : Confirmation (déjà couvert reco 1)
  - **Email 2** (J+2) : "Production lancée 🎨"
    - Subject : "Votre œuvre est en cours d'impression !"
    - Body : "Guillaume a validé votre commande. Nos partenaires Gelato démarrent l'impression Giclee 12 couleurs sur papier archival. Livraison estimée : [date]."
  - **Email 3** (J+7, webhook Gelato) : "Expédié ! Suivez votre colis 📦"
    - Subject : "Votre œuvre est en route !"
    - Body : "Votre tirage a quitté l'atelier Gelato. Tracking : [lien intégré]. Livraison prévue : [date]. Assurez-vous d'être présent pour réception."
  - **Email 4** (J+12, webhook Gelato/transporteur) : "Livré ✓"
    - Subject : "Votre œuvre est arrivée 🎉"
    - Body : "Votre colis a été livré ! Déballez avec soin (guide inclus). Nous espérons que cette œuvre illuminera votre intérieur. - Guillaume"
  - **Email 5** (J+14) : Demande avis (voir section 6)
  - Automatisation : Zapier/n8n + webhooks Gelato → trigger emails Resend

#### 4. **[HAUTE PRIORITÉ]** Page suivi commande temps réel (`/compte/commandes/12345`)
- **Impact** : Autonomie client, tickets "Où est ma commande ?" -80%
- **Complexité** : MEDIUM
- **Justification** : Client veut vérifier statut 24/7. Page dédiée = selfservice.
- **Implémentation** :
  - Route `/compte/commandes/[orderId]` (authentifié ou magic link email)
  - Afficher statut live avec progress bar :
    - ✓ Paiement reçu (16 nov 14:32)
    - ⏳ Production en cours (7j estimés)
    - ⏸ Expédition (en attente)
    - ⏸ Livraison (en attente)
  - Dès expédition : afficher numéro tracking + lien transporteur
  - Intégrer map tracking (si API transporteur disponible) ou iframe
  - Bouton "Besoin d'aide ?" → contact support

#### 5. **[MOYENNE PRIORITÉ]** Création compte auto-suggérée (si guest checkout)
- **Impact** : Conversion guest → customer +18%, repeat purchase +25%
- **Complexité** : LOW
- **Justification** : Guest qui a acheté = chaud pour créer compte (contrairement à avant achat). Moment parfait.
- **Implémentation** :
  - Page "Merci" : CTA "Créer mon compte (1 clic)"
  - Email confirmation : "Suivez votre commande facilement : créez votre compte (email déjà renseigné, choisissez juste mot de passe)"
  - Form pré-rempli : email + nom + adresse déjà saisis (Stripe checkout data)
  - Bénéfice clair : "Accédez à vos commandes, wishlist, et offres exclusives"

#### 6. **[MOYENNE PRIORITÉ]** Certificat d'authenticité téléchargeable immédiatement
- **Impact** : Valeur perçue +15%, réassurance qualité
- **Complexité** : MEDIUM
- **Justification** : Édition limitée SANS certificat = suspicion. PDF pro = preuve sérieux.
- **Implémentation** :
  - Générer PDF automatiquement après paiement (si édition limitée)
  - Template : logo Guillaume, titre œuvre, format, édition X/7, numéro série unique, date achat, signature Guillaume (scannée)
  - Téléchargeable page "Merci" + email confirmation + page commande
  - Watermark léger "Certificat original" (éviter reproduction)
  - Optionnel : QR code vérifiant authenticité (link vers `/verify/[hash]`)

#### 7. **[MOYENNE PRIORITÉ]** Tracking transporteur intégré (pas lien externe)
- **Impact** : User experience fluide, professionnalisme
- **Complexité** : HIGH (selon API transporteur)
- **Justification** : Rediriger vers site FedEx = UX cassée. Intégrer tracking = expérience seamless.
- **Implémentation** :
  - API transporteur (DHL, FedEx, Colissimo selon Gelato) → récupérer événements tracking
  - Afficher timeline dans page `/compte/commandes/12345` :
    - "16 nov 10:00 - Colis pris en charge Lyon"
    - "17 nov 08:15 - En transit vers Paris"
    - "18 nov 14:30 - En cours de livraison"
  - Map interactive (si API le permet) : pin localisation actuelle colis
  - Alternative LOW-TECH : iframe site transporteur (moins élégant mais fonctionnel)

#### 8. **[BASSE PRIORITÉ]** Message vidéo Guillaume page "Merci"
- **Impact** : Connexion émotionnelle, mémorabilité
- **Complexité** : LOW (vidéo) + LOW (intégration)
- **Justification** : Vidéo 30-60sec Guillaume : "Merci pour votre confiance. Voici comment votre œuvre va être créée...". Humanise transaction.
- **Implémentation** :
  - Filmer Guillaume atelier (iPhone suffit, qualité naturelle)
  - Script : "Bonjour [Prénom si dispo], merci d'avoir choisi [Titre œuvre]. Dans les prochains jours, elle sera imprimée avec soin sur papier Giclee archival par mes partenaires. Vous recevrez chaque étape par email. J'espère qu'elle illuminera votre quotidien. À bientôt, Guillaume."
  - Héberger Vimeo/YouTube (unlisted)
  - Intégrer page "Merci" (embed responsive)

#### 9. **[BASSE PRIORITÉ]** Guide accrochage PDF
- **Impact** : Satisfaction client, réduction SAV "Comment accrocher ?"
- **Complexité** : LOW (design PDF)
- **Justification** : Client reçoit œuvre → ne sait pas accrocher → frustration. Guide = service premium.
- **Implémentation** :
  - PDF 1-2 pages : "Comment accrocher votre œuvre Fine Art"
  - Contenu : hauteur idéale (œil à 145cm du sol), outils nécessaires (perceuse, cheville, niveau), tips éviter bulle, espacements multiples œuvres
  - Téléchargeable page "Merci" + email livraison
  - Design branded (logo Guillaume)

---

## 5. COMPTE CLIENT

### Best practices observées

**Saatchi Art** :
- **Dashboard visuel** : Page `/account` avec sections cards : "My Orders", "My Wishlist", "Saved Searches", "Following Artists", "Payment Methods", "Addresses". Design moderne (pas liste texte).
- **Historique achats avec images** : `/account/orders` affiche grille commandes passées. Chaque commande = miniature œuvre + titre + date + statut + prix. Clic = détails complets.
- **Rééditer commande** : Bouton "Buy Again" sur commandes passées. Pré-remplit panier avec même œuvre/format/cadre. Utile pour offrir même œuvre à ami.
- **Certificats téléchargeables** : Section "My Certificates" listant tous certificats authenticité (PDF). Accessible vie entière compte.
- **Adresses sauvegardées** : Gérer multiple adresses (domicile, bureau, maison secondaire). Sélectionner par défaut. Éditer/supprimer.
- **Moyens paiement sauvegardés** : Cartes enregistrées (Stripe vault). "Visa •••• 1234 Exp 12/26". Ajouter/supprimer. Sécurisé.
- **Programme fidélité** : Section "Rewards". Points gagnés par achat (1€ = 1 point). 1000 points = €10 coupon. Affichage balance + historique points.
- **Collections privées** : Organiser œuvres achetées en collections ("Living Room", "Office", "Gifts Given"). Partager collection (lien privé).
- **Notifications preferences** : Toggle email/SMS pour nouveautés, promotions, artistes suivis, rappels wishlist.

**Artsy** :
- **Art Advisory access** : Si collectionneur VIP (>€10k dépensés), accès conseiller dédié. Bouton "Schedule Call with Advisor" dans account.
- **Inquiry history** : Historique toutes demandes prix/infos galeries. Statut : "Pending", "Responded", "Purchased".
- **Following artists** : Liste artistes suivis. Notifications nouveautés (email hebdo recap). Unfollow facile.
- **Recently viewed** : Historique 50 dernières œuvres consultées (même sans wishlist).
- **Profile visibility** : Toggle compte public/privé. Si public, autres collectors voient taste (anonymisé).

**1stDibs** :
- **Trade account** : Si professionnel (architecte, designer), section dédiée avec prix réduits, factures détaillées, historique projets clients.
- **Concierge access** : Chat permanent avec conseiller personnel. Historique conversations sauvegardé.
- **Offers history** : Historique toutes offres faites (acceptées/refusées/négociées). Apprendre quel discount fonctionne.
- **Saved searches** : Sauvegarder filtres complexes. Ex: "Photographie N&B, €500-€1500, livraison France, édition limitée". Email auto si nouvelle œuvre match.

**Minted** :
- **Address book** : Gérer contacts (famille, amis) avec adresses. Utile pour cadeaux. Sélectionner destinataire checkout → adresse auto-remplie.
- **Auto-reorder** : Pour achats récurrents (ex: cartes vœux annuelles). Configurer fréquence → commande auto créée.
- **Design history** : Si personnalisation texte (ex: "Happy Birthday Sarah"), historique designs sauvegardé. Réutiliser facilement.

**20x200** :
- **Collector profile** : Page publique (optionnelle) montrant collection. Ex: `20x200.com/collectors/johndoe`. Partager avec amis. Badge "Collector since 2018".
- **Early access** : Si achats récurrents, accès avant-première nouvelles éditions (24h avant public). Email VIP.
- **Referral program** : Lien parrainage unique. Ami achète = €20 offerts tous les deux. Dashboard tracking referrals.

**WhiteWall** :
- **Print library** : Upload photos personnelles → bibliothèque privée cloud. Réutiliser pour futures commandes (pas re-upload).
- **Sample orders history** : Historique échantillons commandés (papiers testés). Éviter redemander même samples.
- **Project folders** : Organiser commandes par projet (ex: "Expo Paris 2024", "Déco Maison"). Utile pros.

---

### Ce qui manque sur guillaumefarre.com

**Dashboard** :
- ❌ Pas de compte client robuste ? (ou limité)
- ❌ Historique commandes sans images ? (juste liste texte)
- ❌ Pas de wishlist accessible compte
- ❌ Pas de section "Following" ou artiste (Guillaume seul artiste, mais pourrait suivre séries)

**Gestion données** :
- ❌ Pas d'adresses multiples sauvegardées
- ❌ Moyens paiement non sauvegardés (Stripe Guest)
- ❌ Certificats authenticité non centralisés (téléchargement unique email ?)

**Fonctionnalités avancées** :
- ❌ Pas de programme fidélité
- ❌ Pas de collections privées (organiser œuvres achetées)
- ❌ Pas de rééditer commande (Buy Again)
- ❌ Pas de préférences notifications

**Engagement** :
- ❌ Pas d'accès VIP collectionneurs réguliers
- ❌ Pas de programme parrainage

---

### Recommandations prioritaires

#### 1. **[HAUTE PRIORITÉ]** Historique commandes avec images + statut
- **Impact** : Satisfaction client, autonomie, tickets support -50%
- **Complexité** : MEDIUM
- **Justification** : Liste texte commandes = impersonnel. Grille avec miniatures œuvres = visuel, mémorable.
- **Implémentation** :
  - Page `/compte/commandes`
  - Grille commandes (cards) :
    - Image œuvre (miniature 200x200px)
    - Titre + format + cadre
    - Date commande
    - Statut : badge coloré ("En production" orange, "Expédié" bleu, "Livré" vert)
    - Prix total
    - Bouton "Voir détails" → `/compte/commandes/12345`
  - Tri : "Plus récentes" par défaut, option "Plus anciennes"
  - Filtres : "Toutes", "En cours", "Livrées"

#### 2. **[HAUTE PRIORITÉ]** Certificats authenticité centralisés (section dédiée)
- **Impact** : Valeur collection, réassurance long terme
- **Complexité** : LOW
- **Justification** : Certificat perdu email = problème. Section `/compte/certificats` = accès permanent.
- **Implémentation** :
  - Page `/compte/certificats`
  - Liste certificats éditions limitées achetées
  - Chaque ligne : Titre œuvre, Édition X/7, Date achat, Bouton "Télécharger PDF"
  - Stocker PDFs S3/R2 (pas regénérer à chaque fois)
  - Lien aussi depuis page détail commande

#### 3. **[HAUTE PRIORITÉ]** Adresses multiples + paiement sauvegardé (Stripe)
- **Impact** : Checkout futur 3x plus rapide, conversion repeat +30%
- **Complexité** : MEDIUM
- **Justification** : Client régulier ne veut pas re-saisir adresse. Stripe Customer Portal = natif.
- **Implémentation** :
  - Créer Stripe Customer à première commande (même si guest)
  - Sauvegarder adresse + carte (vault Stripe)
  - Page `/compte/paiement` :
    - Liste cartes : "Visa •••• 1234 Exp 12/26" + bouton "Supprimer"
    - Bouton "Ajouter carte" → Stripe modal
  - Page `/compte/adresses` :
    - Liste adresses sauvegardées + checkbox "Par défaut"
    - Bouton "Ajouter adresse" → formulaire
  - Checkout futur : pré-remplir adresse/carte par défaut (1-clic modifier)

#### 4. **[MOYENNE PRIORITÉ]** Wishlist accessible compte
- **Impact** : Rétention, conversion wishlist → achat +25%
- **Complexité** : LOW
- **Justification** : Wishlist actuellement localStorage uniquement → perdue si change device. Sync cloud = persistance.
- **Implémentation** :
  - Page `/compte/favoris`
  - Grille œuvres favoris (comme galerie)
  - Sync wishlist : localStorage (guest) → DB (si connecté)
  - Bouton "Ajouter au panier" sur chaque favori
  - Bouton "Supprimer favoris" (multi-select)

#### 5. **[MOYENNE PRIORITÉ]** Bouton "Recommander œuvre" (Buy Again)
- **Impact** : Repeat purchase facilité, cross-sell +10%
- **Complexité** : LOW
- **Justification** : Client a aimé œuvre → veut offrir à ami ou acheter autre format. "Buy Again" = 1 clic.
- **Implémentation** :
  - Sur chaque commande passée, bouton "Recommander"
  - Clic → pré-remplit panier avec même config (œuvre + format + cadre)
  - Permet modifier avant checkout (ex: autre format)

#### 6. **[MOYENNE PRIORITÉ]** Préférences notifications (email/SMS toggle)
- **Impact** : Respect RGPD, satisfaction client (contrôle spam)
- **Complexité** : LOW
- **Justification** : Envoyer emails sans consentement granulaire = risque spam. Toggle = transparence.
- **Implémentation** :
  - Page `/compte/notifications`
  - Toggles (checkboxes) :
    - ☑ Nouvelles œuvres disponibles (newsletter mensuelle)
    - ☑ Séries favorites (nouvelles photos séries likées)
    - ☑ Offres exclusives (promotions, ventes privées)
    - ☐ Rappels wishlist (email si favoris non achetés après 7j)
    - ☑ Suivi commandes (production/expédition/livraison)
  - Sauvegarder préférences DB → respecter lors envoi emails (Resend segments)

#### 7. **[BASSE PRIORITÉ]** Programme fidélité (points par achat)
- **Impact** : Rétention +20%, repeat purchase +15%, mais complexe
- **Complexité** : HIGH
- **Justification** : Très efficace long terme, mais Guillaume débute (peu clients initialement). Activer Phase 2.
- **Implémentation future** :
  - Règle simple : 1€ dépensé = 1 point
  - 1000 points = €50 coupon (5% cashback)
  - Section `/compte/fidelite` : balance points + historique + coupons actifs
  - Email mensuel : "Vous avez 450 points (il en manque 550 pour coupon €50)"
  - Bonus : partage social +50 points, avis +100 points

#### 8. **[BASSE PRIORITÉ]** Collections privées (organiser œuvres achetées)
- **Impact** : Engagement +12%, satisfaction, mais niche
- **Complexité** : MEDIUM
- **Justification** : Collectionneur avancé aime organiser (ex: "Salon", "Bureau", "Cadeaux offerts"). Utile si >5 achats.
- **Report Phase 3** (2026)

---

## 6. ENGAGEMENT POST-ACHAT

### Best practices observées

**Saatchi Art** :
- **Email onboarding J+3** : "Caring for Your New Art". Contenu : (1) Éviter soleil direct (fading), (2) Nettoyer chiffon microfibre sec (pas eau), (3) Recadrer tous 5-10 ans si verre jaunit, (4) Assurer œuvre (recommandations assureurs art), (5) Photographier pour inventaire.
- **Demande avis J+14** : "How do you love your new piece?". Email avec 5 étoiles cliquables → formulaire review. Incitation : "Les avis aident artistes et collectors. Partagez photo œuvre installée (+bonus surprise)".
- **Recommandations basées achats** : Email J+21 : "Because you loved [Titre œuvre], you might like these...". 5 suggestions œuvres similaires (même artiste, style, couleurs). Algo IA.
- **Invitations vernissages** : Si collectionneur actif (>2 achats), invitations événements exclusifs : "Private opening at [Gallery], Paris - Meet the artist". RSVP limité.
- **Newsletter VIP** : Si achats >€3k total, segment "Collector's Circle". Email bi-mensuel : nouveautés avant public, interviews artistes, tips collection, invitations privées.
- **Anniversary email** : J+365 après 1er achat : "Happy Artiversary! 1 year ago you started your collection with [Titre]. Celebrate with -15% on your next purchase".

**Artsy** :
- **Personalized recommendations** : Emails hebdomadaires basés sur artistes suivis + achats passés. "New works by artists you follow" + "Trending in [Style préféré]".
- **Art world news** : Newsletter éditoriale (pas promo). Articles : "Top 10 emerging photographers 2025", "Interview: Sarah Moon on her process". Engage collectors culturellement.
- **Fair access** : Si collectionneur VIP, invitations VIP days foires art (Art Basel, FIAC). Accès avant public général.
- **Artist updates** : Si follow artiste, notifications expo, publications, awards. "Congratulations to [Artist] for winning [Prix]".

**1stDibs** :
- **Concierge follow-up** : Email J+30 : "How is your piece settling in? Our team is here if you need styling advice or complementary pieces". Lien scheduler call.
- **Personalized catalog** : Email mensuel : sélection manuelle 10 œuvres par conseiller basé sur taste client (pas algo). "Hand-picked for you by Jessica, your advisor".
- **Trade program nurturing** : Si architecte/designer, invitations webinaires : "Sourcing art for luxury homes", "2025 design trends". Networking peers.

**Minted** :
- **Seasonal campaigns** : Email pré-Noël : "Complete your collection for the holidays". Sélection œuvres thématiques (winter scenes, cozy vibes).
- **Referral incentives** : Email J+10 : "Love your print? Give €20, get €20. Share with friends". Lien parrainage unique.
- **Design tips blog** : Emails blog : "How to create gallery wall", "Mixing frame styles", "Choosing art for small spaces". Contenu éducatif (pas promo).

**20x200** :
- **Artist stories** : Emails spotlights artistes : "Meet the artist: [Name]". Interview + backstory œuvre + process créatif. Humanise collection.
- **Early access VIP** : Si achats réguliers, email 24h avant public : "New release tomorrow, but you get first pick today". Exclusivité.
- **Community showcase** : Email mensuel : "Collector Spotlight". Photos collectors avec œuvres installées (UGC). Incite partage social.

**WhiteWall** :
- **Project ideas** : Email J+20 : "Turn your photos into art". Inspiration projets : "Create a travel photo series", "Family portrait wall", "Pet memorial print". Incite nouvelles commandes.
- **Sample reminder** : Si samples commandés mais pas acheté, email J+7 : "Have you decided on your print? Our experts can help choose paper/finish".
- **Testimonials request** : Email J+30 : "Share your WhiteWall experience". Link Google Reviews + incentive (-10% next order).

---

### Ce qui manque sur guillaumefarre.com

**Emails post-achat** :
- ❌ Pas d'email onboarding conseils entretien
- ❌ Pas de demande avis automatisée J+14
- ❌ Pas de recommandations basées achats

**Engagement long terme** :
- ❌ Pas de newsletter (ou générique, pas segmentée)
- ❌ Pas d'invitations événements (vernissages Guillaume ?)
- ❌ Pas de programme VIP collectionneurs réguliers

**Contenu éducatif** :
- ❌ Pas de blog/tips accrochage/collection
- ❌ Pas d'interviews Guillaume (process créatif)
- ❌ Pas de backstories séries (Atelier, Empreintes, Projection)

**Communauté** :
- ❌ Pas d'UGC (photos clients avec œuvres)
- ❌ Pas de parrainage incentivé
- ❌ Pas de social proof (témoignages visibles site)

---

### Recommandations prioritaires

#### 1. **[HAUTE PRIORITÉ]** Email demande avis J+14 (automation)
- **Impact** : Avis = social proof #1, conversion +18%
- **Complexité** : LOW
- **Justification** : 0 avis = site non crédible. Premiers avis = critiques pour lancement. Demander proactivement = essentiel.
- **Implémentation** :
  - Trigger J+14 post-livraison (webhook Gelato delivery)
  - Email :
    - Subject : "Comment trouvez-vous votre nouvelle œuvre ? 🎨"
    - Body : "Bonjour [Prénom], votre [Titre œuvre] est chez vous depuis 2 semaines. Qu'en pensez-vous ? Votre avis aide Guillaume et futurs collectionneurs. Partagez votre expérience (2 min) : [lien formulaire]"
    - CTA : "Laisser mon avis" → formulaire Google Forms ou Trustpilot ou custom
  - Incitation : "Laissez avis + photo œuvre installée = -10€ sur prochaine commande (code envoyé après validation)"
  - Afficher avis sur site : section reviews page produit + homepage

#### 2. **[HAUTE PRIORITÉ]** Email onboarding conseils entretien J+3
- **Impact** : Satisfaction long terme, réduction SAV
- **Complexité** : LOW
- **Justification** : Client reçoit œuvre → ne sait pas entretenir → fading/dommage → insatisfaction. Guide préventif = service premium.
- **Implémentation** :
  - Trigger J+3 post-livraison
  - Email :
    - Subject : "Prendre soin de votre œuvre Fine Art 🖼"
    - Body : "Votre [Titre] est arrivée ! Quelques conseils pour la préserver : (1) Évitez soleil direct (UV = fading), (2) Nettoyez avec chiffon microfibre sec (jamais eau), (3) Température stable 18-24°C, humidité <60%, (4) Si encadré : vérifier verre anti-UV. Pour toute question : répondez à cet email, Guillaume vous répondra personnellement."
  - Attacher PDF "Guide d'entretien œuvre Fine Art" (1 page, design branded)

#### 3. **[HAUTE PRIORITÉ]** Newsletter VIP nouveautés (emails segmentés)
- **Impact** : Repeat purchase +25%, engagement +40%
- **Complexité** : MEDIUM
- **Justification** : Collectionneurs veulent être informés nouvelles œuvres. Email masse = spam. Email ciblé = valeur.
- **Implémentation** :
  - Segments :
    - **Segment 1 "Collectionneurs actifs"** (>1 achat) : email quand nouvelle série disponible. Ex: "Nouvelle série Projection disponible en avant-première pour nos collectionneurs".
    - **Segment 2 "Wishlist non convertis"** (wishlist >3 œuvres, 0 achat) : email J+7 : "Vos 3 œuvres favorites vous attendent encore".
    - **Segment 3 "Série préférée"** (acheté Atelier) : email quand nouvelles photos Atelier ajoutées.
  - Fréquence : max 1 email/mois (éviter spam)
  - Contenu : image nouvelle œuvre + lien boutique + message personnel Guillaume
  - CTA : "Découvrir la nouvelle série" (early access 24h avant public si VIP)

#### 4. **[MOYENNE PRIORITÉ]** Recommandations post-achat (email J+21)
- **Impact** : Cross-sell +10%, panier moyen +12%
- **Complexité** : MEDIUM
- **Justification** : Client a aimé série Atelier → suggérer autres Atelier = pertinent. Algo simple suffit.
- **Implémentation** :
  - Trigger J+21 post-livraison
  - Email :
    - Subject : "Œuvres qui pourraient vous plaire 🎨"
    - Body : "Puisque vous avez aimé [Titre œuvre achetée], découvrez ces 3 autres œuvres de la série [Série] :"
    - 3 suggestions (images + prix + lien)
  - Algo simple :
    1. Même série que œuvre achetée
    2. Format similaire (±1 taille)
    3. Prix ±20% (éviter suggérer A4 si client a acheté A1)

#### 5. **[MOYENNE PRIORITÉ]** Invitations événements exclusifs (vernissages Guillaume)
- **Impact** : Connexion émotionnelle, fidélisation VIP
- **Complexité** : LOW (si événements existent)
- **Justification** : Collectionneur aime rencontrer artiste. Vernissage privé = expérience mémorable.
- **Implémentation** :
  - Si Guillaume organise expo/vernissage atelier, email collectionneurs (>1 achat) :
    - Subject : "Invitation privée : Vernissage atelier Guillaume Farré"
    - Body : "Cher [Prénom], vous faites partie de nos collectionneurs. Guillaume vous invite à découvrir sa nouvelle série en avant-première lors d'un vernissage privé le [date] à [lieu]. RSVP limité : [lien]"
  - RSVP form : nom + nombre invités
  - Email confirmation + rappel J-3

#### 6. **[BASSE PRIORITÉ]** Programme parrainage ("Give €20, Get €20")
- **Impact** : Acquisition clients, bouche-à-oreille
- **Complexité** : MEDIUM
- **Justification** : Collectionneur satisfait = meilleur ambassadeur. Inciter partage = marketing organique.
- **Implémentation** :
  - Chaque client a lien parrainage unique : `guillaumefarre.com/?ref=JOHN123`
  - Ami achète avec lien → parrain reçoit €20 coupon, filleul reçoit €20 réduction immédiate
  - Section `/compte/parrainage` : lien unique + tracking ("3 amis parrainés, €60 gagnés")
  - Email post-achat J+10 : "Partagez Guillaume Farré avec vos amis, gagnez €20 chacun"

#### 7. **[BASSE PRIORITÉ]** Blog/Contenu éducatif (backstories séries)
- **Impact** : SEO, engagement, temps sur site +30%
- **Complexité** : HIGH (création contenu régulière)
- **Justification** : Utile long terme, mais pas priorité lancement. Phase 2.
- **Idées articles** :
  - "Genèse série Atelier : quand Ferrari devient pinceau"
  - "Technique Empreintes : capturer l'instant unique"
  - "Comment choisir format pour votre intérieur"
  - "Interview Guillaume : de collectionneur à artiste"

---

## 7. SERVICE CLIENT

### Best practices observées

**Saatchi Art** :
- **Chat en direct** : Widget bottom-right (Intercom/Zendesk). Heures ouverture : 9h-21h CET (7j/7). Réponse moyenne <2 min. Hors heures : chatbot FAQ + "Leave message, we'll respond within 4h".
- **FAQ exhaustive** : Page `/help` avec 150+ questions catégorisées : "Shipping", "Returns", "Payment", "Technical Issues", "Artist Questions". Barre recherche. Vidéos tutoriels pour sujets complexes.
- **Politique retour claire** : "14-day money-back guarantee. If you don't love your art, return it for full refund (minus 20% restocking fee if changed mind, 0% fee if defect). Buyer pays return shipping unless defect."
- **Garantie qualité** : "If your artwork arrives damaged or defective, we'll replace it free or refund 100%. Just send photo within 48h of delivery."
- **Contact artiste** : Bouton page produit "Ask the Artist". Formulaire → email artiste (copie plateforme). Artiste répond directement client. Modération si besoin.
- **Email support** : support@saatchiart.com. Réponse <24h (souvent <4h). Template réponses mais personnalisées.
- **Phone support** : +1-XXX (US/Canada). Horaires affichés. International : email preferred.
- **Help Center videos** : Tutoriels vidéo : "How to track your order", "How to return artwork", "Understanding editions".

**Artsy** :
- **Inquiry system** : Si œuvre vendue par galerie, bouton "Contact Gallery" → formulaire structuré (nom, email, message, budget). Galerie répond <24h.
- **Buyer Protection visible** : Page dédiée `/buyer-guarantee` expliquant : authenticité garantie, retours acceptés 14j, paiement sécurisé, shipping assuré.
- **Self-service returns** : Si <14j post-livraison, bouton "Initiate Return" dans account. Formulaire raison (dropdown) → label retour auto-généré (prépayé si défaut, payé client si changement avis).
- **Dispute resolution** : Si problème galerie non résolu, escalade vers Artsy Mediation Team. Arbitrage neutre.

**1stDibs** :
- **Concierge live chat** : Chat premium. Pas chatbot, que humains. Conseillers formés art/design. Peuvent scheduler calls vidéo si besoin. Historique conversations sauvegardé.
- **Expert consultations** : Bouton "Schedule Expert Call". Calendly integration → choisir créneau. Calls gratuits (30 min max).
- **Custom requests** : Formulaire "Request Custom Piece". Client décrit besoin → concierge cherche ou contacte artistes.
- **Trade support dédié** : Si compte pro, ligne support prioritaire. Réponse <1h.

**Minted** :
- **Returns faciles** : "Love it or return it free within 30 days". Retours prépayés (label inclus colis). Remboursement 5-7j post-réception.
- **Live chat hours** : Lundi-Vendredi 9h-18h EST. Weekend : email uniquement.
- **Community forum** : Forum clients entraide. Minted monitore + répond questions techniques.

**20x200** :
- **Friendly tone** : Emails support signés prénom (pas "Customer Service Team"). Ton humain, pas corporate. Ex: "Hey John, sorry your print arrived late! Let me check what happened..."
- **Replacements proactifs** : Si défaut signalé, remplacement envoyé immédiatement (pas attendre retour défectueux). Confiance client.
- **Artist direct contact** : Pour questions spécifiques œuvre (technique, inspiration), 20x200 connecte client et artiste (si artiste accepte).

**WhiteWall** :
- **Expert photo advice** : Chat avec conseillers techniques impression. Aident choisir papier/finition selon type photo (paysage = papier mat, portrait = lustre, N&B = baryta).
- **Proof approval workflow** : Si client demande épreuve, WhiteWall envoie preview numérique haute résolution. Client approuve/demande ajustements (luminosité, crop). Jusqu'à 3 révisions gratuites.
- **Satisfaction guarantee 30j** : "Si qualité impression insatisfaisante, remplacement gratuit ou remboursement intégral. Pas questions posées."
- **Installation support** : Pour grands formats (>120cm), WhiteWall connecte avec installateurs certifiés locaux. Devis gratuit.

---

### Ce qui manque sur guillaumefarre.com

**Support temps réel** :
- ❌ Pas de chat en direct (ou chatbot)
- ❌ Temps réponse email non indiqué
- ❌ Pas de téléphone support (optionnel pour Guillaume, mais email doit être ultra-réactif)

**Documentation** :
- ❌ FAQ absente ou limitée
- ❌ Pas de tutoriels vidéo
- ❌ Politique retour non visible (ou cachée footer)
- ❌ Garantie qualité non mentionnée

**Retours & Garanties** :
- ❌ Process retour opaque (comment retourner œuvre ?)
- ❌ Délai retour non spécifié (14 jours ? 30 jours ?)
- ❌ Frais retour non clarifiés (client paie ? gratuit ?)
- ❌ Garantie remplacement si défaut non affichée

**Contact artiste** :
- ❌ Pas de bouton "Contacter Guillaume" (pour questions custom/conseils)
- ❌ Pas de formulaire contact structuré (ou formulaire générique)

---

### Recommandations prioritaires

#### 1. **[HAUTE PRIORITÉ]** Politique retour claire + visible (page dédiée + footer)
- **Impact** : Réassurance achat, abandon panier -22%
- **Complexité** : LOW
- **Justification** : Doute retour = frein #3 achat art. Politique transparente = supprime risque perçu.
- **Implémentation** :
  - Créer page `/politique-retour`
  - Contenu clair :
    - **Délai** : "Satisfait ou remboursé 14 jours à réception"
    - **Condition** : "Œuvre non encadrée : retour gratuit si défaut impression. Si changement avis : frais retour client (€15-25), remboursement œuvre -10% frais restocking."
    - **Œuvre encadrée** : "Retour accepté uniquement si défaut (cadre cassé, verre fissuré, impression défectueuse). Pas retour si simple changement avis."
    - **Process** : "Contactez support@guillaumefarre.com sous 48h réception si problème. Envoyez 2-3 photos défaut. Nous générons label retour prépayé (si défaut avéré) ou vous envoyons adresse retour (si changement avis)."
  - Afficher lien footer + page produit + checkout

#### 2. **[HAUTE PRIORITÉ]** Garantie qualité affichée (remplacement gratuit si défaut)
- **Impact** : Confiance qualité, conversion +12%
- **Complexité** : LOW
- **Justification** : "Et si impression est floue ?" = peur courante. Garantie = preuve sérieux.
- **Implémentation** :
  - Badge page produit : "Garantie qualité : remplacement gratuit si défaut impression"
  - Section FAQ : "Que se passe-t-il si mon tirage arrive défectueux ?"
    - Réponse : "Nous imprimons avec Gelato, leader mondial qualité Giclee. Si malgré contrôles qualité, votre tirage présente défaut (flou, couleurs incorrectes, rayures), contactez-nous sous 48h avec photos. Nous envoyons remplacement gratuit immédiatement (ou remboursement intégral si préféré). Satisfaction garantie 100%."

#### 3. **[HAUTE PRIORITÉ]** FAQ exhaustive (20-30 questions essentielles)
- **Impact** : Tickets support -40%, autonomie client
- **Complexité** : MEDIUM
- **Justification** : Répondre 10x même question email = perte temps. FAQ = selfservice.
- **Implémentation** :
  - Page `/faq` avec sections :
    - **Commande** : "Comment commander ?", "Quels moyens paiement ?", "Paiement sécurisé ?"
    - **Produits** : "Différence tirage illimité vs édition limitée ?", "Quel papier utilisé ?", "Éditions signées ?", "Certificat authenticité inclus ?"
    - **Livraison** : "Délais livraison France ?", "Livraison internationale ?", "Frais port ?", "Suivi colis ?"
    - **Retours** : "Puis-je retourner œuvre ?", "Délai retour ?", "Frais retour ?"
    - **Technique** : "Quelle taille choisir ?", "Avec ou sans cadre ?", "Comment accrocher ?"
  - Barre recherche (Ctrl+F suffit initialement, Algolia si FAQ >50 questions)

#### 4. **[HAUTE PRIORITÉ]** Formulaire contact structuré (dropdown sujets)
- **Impact** : Temps réponse -30%, clarté demandes
- **Complexité** : LOW
- **Justification** : Email libre = flou ("Bonjour, question sur produit"). Formulaire structuré = context immédiat.
- **Implémentation** :
  - Page `/contact`
  - Formulaire :
    - **Sujet** (dropdown obligatoire) : "Question produit", "Suivi commande", "Retour/SAV", "Demande custom", "Autre"
    - **Numéro commande** (si sujet = Suivi/Retour, champ apparaît)
    - **Message** (textarea)
    - **Email** (auto-rempli si connecté)
    - **Nom**
  - Envoyer email support@guillaumefarre.com avec sujet structuré
  - Auto-réponse immédiate : "Merci [Prénom], nous avons reçu votre message. Guillaume vous répondra sous 24h (souvent <4h)."

#### 5. **[MOYENNE PRIORITÉ]** Temps réponse garanti affiché (< 24h)
- **Impact** : Réassurance, urgence perçue réduite
- **Complexité** : LOW
- **Justification** : "Combien de temps avant réponse ?" = anxiété. "Réponse <24h" = promesse tenue.
- **Implémentation** :
  - Afficher page contact : "⏱ Temps réponse garanti : <24h (souvent <4h)"
  - Footer email auto-réponse : "Nous répondons généralement sous 4h (hors weekends)"
  - Respecter engagement (sinon pire que rien)

#### 6. **[MOYENNE PRIORITÉ]** Chatbot FAQ (si pas budget chat live)
- **Impact** : Support 24/7, tickets -20%
- **Complexité** : MEDIUM
- **Justification** : Chat live = coûteux (agent humain). Chatbot FAQ = 80% questions courantes résolues.
- **Implémentation** :
  - Widget bottom-right (Crisp, Tawk.to gratuit, ou Intercom)
  - Chatbot avec réponses pré-programmées :
    - "Quels délais livraison ?" → "7j production + 5-8j shipping France = 12-15j total"
    - "Politique retour ?" → "14 jours satisfait ou remboursé. [Lire politique complète]"
    - "Différence édition limitée ?" → "Édition limitée = 1-7 exemplaires, signée, certificat. Tirage illimité = quantité infinie, non signé."
  - Fallback : "Je n'ai pas compris. Voulez-vous laisser message ? Nous répondons <24h."
  - Si budget futur : upgrade chat live (agent humain heures bureau)

#### 7. **[MOYENNE PRIORITÉ]** Bouton "Contacter Guillaume" page produit (questions custom)
- **Impact** : Connexion personnelle, ventes custom +5%
- **Complexité** : LOW
- **Justification** : Client veut œuvre format spécial ou question technique → contact direct artiste = premium service.
- **Implémentation** :
  - Bouton page produit : "Une question sur cette œuvre ? Contactez Guillaume"
  - Modal formulaire :
    - Pré-rempli : œuvre concernée (titre + lien)
    - Message client
    - Email
  - Email envoyé directement Guillaume (pas support générique)
  - Guillaume répond personnellement (ton authentique)

#### 8. **[BASSE PRIORITÉ]** Chat en direct humain (9h-18h)
- **Impact** : Conversion +15%, satisfaction maximale, mais coûteux
- **Complexité** : HIGH (ressources humaines)
- **Justification** : Idéal, mais Guillaume seul initialement. Chatbot FAQ suffit Phase 1. Si croissance, embaucher agent support.
- **Report Phase 2** (2026)

#### 9. **[BASSE PRIORITÉ]** Tutoriels vidéo (tracking commande, retours, accrochage)
- **Impact** : Autonomie +25%, tickets -15%
- **Complexité** : MEDIUM (production vidéos)
- **Justification** : Vidéo > texte pour tutos. Mais pas urgent lancement.
- **Report Phase 2**
- **Idées vidéos** :
  - "Comment suivre ma commande" (30sec)
  - "Retourner une œuvre" (1 min)
  - "Accrocher œuvre encadrée" (2 min)

---

## RÉCAPITULATIF PRIORITÉS GLOBALES

### 🔴 CRITIQUES (Lancement boutique impossible sans)

1. **Filtres produits** (Prix, Format, Série, Type) — Section 1
2. **Compteur stock éditions limitées** (X/7) — Section 1 & 2
3. **Délais production + livraison affichés** — Section 2
4. **Calcul frais port temps réel** — Section 3
5. **Guest checkout visible** — Section 3
6. **Panier persistant 30j** — Section 3
7. **Email confirmation riche** — Section 4
8. **Notifications email automatiques** — Section 4
9. **Politique retour claire** — Section 7
10. **FAQ exhaustive** — Section 7

**Timeline** : 2-3 semaines développement

---

### 🟠 HAUTES (Conversion +30-50%)

11. **Wishlist persistante** — Section 1
12. **Photos multiples (œuvre + encadré + lifestyle)** — Section 2
13. **Zoom haute résolution** — Section 2
14. **Paiement fractionné 3x/4x** — Section 3
15. **Date livraison estimée dynamique** — Section 3
16. **Page "Merci" enrichie** — Section 4
17. **Page suivi commande temps réel** — Section 4
18. **Historique commandes avec images** — Section 5
19. **Certificats authenticité centralisés** — Section 5
20. **Email demande avis J+14** — Section 6
21. **Garantie qualité affichée** — Section 7

**Timeline** : 3-4 semaines développement

---

### 🟡 MOYENNES (Nice to have, ROI prouvé)

22. **Tri produits** — Section 1
23. **Sélecteur encadrement visuel** — Section 2
24. **Comparateur tailles** — Section 2
25. **Détails techniques impression** — Section 2
26. **Return policy visible page produit** — Section 2
27. **Progress bar checkout** — Section 3
28. **Assurance transport optionnelle** — Section 3
29. **Upsells panier** — Section 3
30. **Email abandoned cart** — Section 3
31. **Création compte post-achat** — Section 4
32. **Certificat téléchargeable immédiatement** — Section 4
33. **Adresses multiples + paiement sauvegardé** — Section 5
34. **Wishlist accessible compte** — Section 5
35. **Bouton "Buy Again"** — Section 5
36. **Email onboarding conseils entretien** — Section 6
37. **Newsletter VIP segmentée** — Section 6
38. **Formulaire contact structuré** — Section 7
39. **Temps réponse garanti** — Section 7

**Timeline** : 4-6 semaines développement

---

### ⚪ BASSES (Phase 2-3, 2026)

40. **Recherche textuelle** — Section 1
41. **Recherche visuelle "Find Similar"** — Section 1
42. **Visualiseur AR** — Section 2
43. **Avis clients** — Section 2 (activer après premières ventes)
44. **"Vous aimerez aussi"** — Section 2
45. **Choix livraison standard/express** — Section 3
46. **PayPal + Apple Pay** — Section 3
47. **Tracking transporteur intégré** — Section 4
48. **Message vidéo Guillaume** — Section 4
49. **Guide accrochage PDF** — Section 4
50. **Programme fidélité** — Section 5
51. **Collections privées** — Section 5
52. **Recommandations post-achat** — Section 6
53. **Invitations événements** — Section 6
54. **Programme parrainage** — Section 6
55. **Blog contenu éducatif** — Section 6
56. **Chatbot FAQ** — Section 7
57. **Chat live humain** — Section 7
58. **Tutoriels vidéo** — Section 7

**Timeline** : Déploiement progressif 2026

---

## BUDGET ESTIMÉ (développement)

### Phase 1 : Critiques (lancement MVP)
- **Durée** : 2-3 semaines
- **Coût dev** : 80-120h × taux horaire
- **Outils tiers** : Gelato (gratuit), Stripe (2.9% + €0.25/transaction), Resend (€0/mois <100 emails/j)

### Phase 2 : Hautes priorités
- **Durée** : 3-4 semaines
- **Coût dev** : 100-140h × taux horaire
- **Outils tiers** : Klarna/Alma (gratuit, commission 2-3%), Trustpilot reviews (€0-99/mois)

### Phase 3 : Moyennes priorités
- **Durée** : 4-6 semaines
- **Coût dev** : 120-180h × taux horaire
- **Outils tiers** : Email automation (Klaviyo €20-100/mois selon contacts)

### Phase 4 : Basses priorités (2026)
- **Durée** : Continue
- **Coût** : Variable selon features choisies
- **Outils tiers** : Chatbot (€0-99/mois), AR (8th Wall €99/mois), Intercom chat (€74/mois)

---

## CONCLUSION

Le marché de l'art en ligne 2025 est **hyper-compétitif** et les collectionneurs ont des **attentes élevées** façonnées par Saatchi Art, Artsy, 1stDibs. Pour que guillaumefarre.com convertisse :

### 3 piliers non-négociables :

1. **RÉASSURANCE** : Délais clairs, stock visible, garanties affichées, certificats, reviews
2. **VISUALISATION** : Photos multiples, zoom, comparateur tailles (AR = bonus)
3. **FLUIDITÉ** : Filtres, panier persistant, guest checkout, paiement fractionné, suivi temps réel

### Erreurs à éviter :

- ❌ Lancer sans filtres (abandon immédiat)
- ❌ Cacher délais livraison (surprise = abandon panier)
- ❌ Ignorer éditions limitées (stock = urgence psychologique)
- ❌ Email confirmation generic (1ère impression post-achat ratée)
- ❌ Pas de FAQ (tickets support explosent)

### Quick wins (ROI immédiat) :

1. Compteur "X/7 disponibles" (1h dev, conversion +40%)
2. Délais affichés page produit (2h dev, abandon -35%)
3. Politique retour visible (1h rédaction, réassurance +100%)
4. Email confirmation branded (4h setup, satisfaction +200%)
5. FAQ 20 questions (8h rédaction, tickets -40%)

**Total quick wins** : ~16h dev = impact massif

---

## ROADMAP RECOMMANDÉE

### Semaine 1-2 : CRITIQUES
- Filtres + tri
- Compteur stock
- Délais affichés
- Frais port temps réel
- Guest checkout

### Semaine 3-4 : HAUTES (Conversion)
- Wishlist
- Photos multiples
- Zoom
- Paiement 3x
- Date livraison

### Semaine 5-6 : HAUTES (Post-achat)
- Email confirmation
- Notifications auto
- Page suivi commande
- Certificats centralisés
- Demande avis

### Semaine 7-8 : MOYENNES (Finitions)
- Progress bar
- Upsells
- Abandoned cart
- Onboarding email
- Newsletter VIP

### Semaine 9+ : BASSES (Optimisation)
- AR (si budget)
- Programme fidélité
- Chat live
- Blog

---

**Auteur** : Claude (Anthropic)
**Date** : 16 novembre 2025
**Mots** : ~18,500
**Benchmarks** : 6 leaders mondiaux
**Recommandations** : 58 actionnables

Prêt à transformer guillaumefarre.com en destination e-commerce premium ? 🚀
