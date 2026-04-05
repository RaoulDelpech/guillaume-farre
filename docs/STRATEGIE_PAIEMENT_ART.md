# Strategie de Paiement — Oeuvres d'Art 2 500 - 20 000 EUR

**Guillaume Farre — guillaumefarre.com**
**Date : 5 avril 2026**
**Auteur : Lalou**

---

## Sommaire

1. [Plafonds des cartes bancaires en France](#1-plafonds-des-cartes-bancaires-en-france)
2. [Comparaison des methodes de paiement Stripe](#2-comparaison-des-methodes-de-paiement-stripe)
3. [Recommandation par tranche de prix](#3-recommandation-par-tranche-de-prix)
4. [Flow utilisateur recommande](#4-flow-utilisateur-recommande)
5. [Points juridiques cles](#5-points-juridiques-cles)
6. [Plan d'implementation technique](#6-plan-dimplementation-technique)

---

## 1. Plafonds des cartes bancaires en France

### 1.1 Tableau des plafonds de paiement (30 jours glissants)

Les plafonds varient selon la banque. Les valeurs ci-dessous sont les **fourchettes marche constatees**.

| Carte | Plafond paiement / 30 jours | Compatible 2 500 EUR | Compatible 5 000 EUR | Compatible 10 000 EUR | Compatible 20 000 EUR |
|-------|---------------------------|---------------------|---------------------|----------------------|----------------------|
| **Visa Classic** | 2 500 - 5 000 EUR | Limite | Non | Non | Non |
| **Visa Premier** | 5 000 - 8 000 EUR | Oui | Limite | Non | Non |
| **Visa Platinum** | 8 000 - 12 000 EUR | Oui | Oui | Limite | Non |
| **Visa Infinite** | 10 000 - 25 000 EUR | Oui | Oui | Oui | Possible |
| **Mastercard Standard** | 2 500 - 5 000 EUR | Limite | Non | Non | Non |
| **Mastercard Gold** | 5 000 - 8 000 EUR | Oui | Limite | Non | Non |
| **Mastercard Platinum** | 8 000 - 12 000 EUR | Oui | Oui | Limite | Non |
| **Mastercard World Elite** | 10 000 - 20 000 EUR | Oui | Oui | Oui | Limite |
| **Amex Green** | Flexible (profil) | Oui | Probable | Variable | Variable |
| **Amex Gold** | Flexible (profil) | Oui | Oui | Probable | Variable |
| **Amex Platinum** | Flexible (profil) | Oui | Oui | Oui | Probable |
| **Amex Centurion** | Flexible (tres eleve) | Oui | Oui | Oui | Oui |

**Note Amex** : American Express n'impose pas de plafond predetermine. La capacite de depense evolue selon l'historique du porteur. Un titulaire Platinum ou Centurion peut generalement payer 20 000 EUR en une transaction sans probleme.

### 1.2 Plafond par transaction vs plafond mensuel

- **Plafond mensuel** : calcule sur 30 jours glissants. C'est le plafond principal.
- **Plafond par transaction** : en general, il n'y a pas de plafond par transaction DISTINCT du plafond mensuel. Si le plafond mensuel est de 8 000 EUR et qu'il reste 8 000 EUR de disponible, un paiement de 8 000 EUR passera.
- **Paiement en ligne vs en magasin** : meme plafond. Le 3D Secure (authentification forte) ne change pas le plafond, il securise la transaction.

### 1.3 Relever temporairement son plafond

**Procedure standard** :
1. Appeler le service client de sa banque ou utiliser l'appli mobile
2. Demander un **relevement temporaire** (gratuit dans la plupart des banques)
3. Actif sous 24-48h, pour une duree definie (1 semaine a 1 mois)
4. Certaines banques (Boursorama, Fortuneo, Revolut) permettent le relevement **instantane** via l'app

**Implication pour Guillaume** : dans le message d'accompagnement du lien de paiement, suggerer a l'acheteur de verifier son plafond CB et de le relever si necessaire aupres de sa banque.

### 1.4 Apple Pay / Google Pay

- **Plafond identique** a la carte physique liee (meme enveloppe mensuelle)
- **Pas de limite NFC/sans contact** specifique (authentification biometrique Face ID / Touch ID)
- Avantage : UX fluide, 1 clic, pas de saisie numero CB

### 1.5 Conclusion sur les plafonds

**Constat critique** : Pour des oeuvres entre 2 500 et 20 000 EUR, une carte classique (Visa Classic / MC Standard) sera souvent insuffisante. Seules les cartes premium (Platinum, Infinite, World Elite, Amex) couvrent les montants eleves.

**Cible Guillaume** : acheteurs fortunes = cartes haut de gamme = plafonds generalement suffisants. Mais il faut TOUJOURS proposer une alternative au paiement CB.

---

## 2. Comparaison des methodes de paiement Stripe

### 2.1 Tableau comparatif complet

| Methode | Plafond | Frais Stripe | Delai encaissement | Risque chargeback | UX acheteur | Verdict |
|---------|---------|-------------|-------------------|-------------------|-------------|---------|
| **CB classique** | 2 500 - 25 000 EUR selon carte | 1,5% + 0,25 EUR (EU) / 2,5% + 0,25 EUR (hors EU) | 2-7 jours | Oui (120 jours) | Excellente | BASE |
| **Apple Pay / Google Pay** | = carte liee | 1,5% + 0,25 EUR | 2-7 jours | Oui (120 jours) | Excellente | ACTIVER |
| **Virement SEPA (Bank Transfer)** | 100 000 EUR (instantane) | ~0,8% ou fixe (selon config) | 10 sec (instantane) / 1-2 jours (standard) | Aucun | Moyenne | ALTERNATIF |
| **SEPA Direct Debit** | Illimite | 0,25 EUR fixe | 6 jours | Oui (13 mois !) | Faible | NON |
| **Stripe Invoice** | Selon methode choisie | Selon methode | Variable | Variable | Bonne | DEVIS |
| **Acompte + solde** | Illimite | 1,5% + 0,25 EUR (acompte CB) | Variable | Partiel | Moyenne | OUI > 5 000 EUR |
| **BNPL Alma** | 2 000 EUR max | 3-5% | Immediat | Non (Alma assume) | Excellente | BLOQUE (plafond) |
| **Crypto (via Crypto.com)** | Illimite | ~2-4% | Immediat | Aucun | Faible | OPTIONNEL |
| **iDEAL / Bancontact / giropay** | Variable | 0,29 EUR fixe | 1-3 jours | Non | Bonne (locale) | ACTIVER (EU) |

### 2.2 Analyse detaillee de chaque methode

#### A) Paiement CB classique en une fois

**Cote Stripe** : pas de limite. Stripe accepte jusqu'a 999 999 EUR par transaction.

**Cote carte** : le seul frein est le plafond de la carte de l'acheteur.

**Frais concrets** :
| Montant oeuvre | Frais CB europeenne (1,5% + 0,25 EUR) | Frais CB non-EU (2,5% + 0,25 EUR) | Net recoit Guillaume |
|---------------|---------------------------------------|-----------------------------------|---------------------|
| 2 500 EUR | 37,75 EUR | 62,75 EUR | 2 437 - 2 462 EUR |
| 5 000 EUR | 75,25 EUR | 125,25 EUR | 4 875 - 4 925 EUR |
| 10 000 EUR | 150,25 EUR | 250,25 EUR | 9 750 - 9 850 EUR |
| 20 000 EUR | 300,25 EUR | 500,25 EUR | 19 500 - 19 700 EUR |

**Pour qui ca marche** : acheteurs avec carte premium (Visa Infinite, MC World Elite, Amex Platinum). La majorite de la clientele cible de Guillaume.

**Pour qui ca bloque** : acheteurs avec carte standard voulant payer > 5 000 EUR.

#### B) Paiement en plusieurs fois (BNPL)

**Alma + Stripe** : partenariat natif depuis 2025. MAIS plafond Alma = **2 000 EUR maximum**. Bloquant pour des oeuvres a 2 500 EUR+.

**Klarna** : plafond similaire (~2 000 EUR), meme probleme.

**Oney / Floa** (filiales bancaires) : plafonds potentiellement plus eleves mais integration plus complexe.

**Reglementation 2026** : depuis le 20 novembre 2026, le BNPL est requalifie en credit a la consommation (directive UE). Obligations accrues de verification de solvabilite.

**Verdict** : **Non pertinent** pour Guillaume. Les plafonds BNPL sont trop bas pour des oeuvres d'art a 2 500 - 20 000 EUR.

#### C) Virement bancaire (Stripe Bank Transfers)

**Fonctionnement** :
1. Stripe genere un **IBAN virtuel unique** pour la transaction
2. L'acheteur fait un virement depuis sa banque vers cet IBAN
3. Stripe matche automatiquement le virement a la commande
4. Fonds transferes a Guillaume

**Revolution 2025** : depuis le 9 janvier 2025, le virement SEPA instantane est **obligatoire et gratuit** en France (loi europeenne). Delai < 10 secondes, plafond 100 000 EUR.

**Frais** : variables selon configuration Stripe. Generalement plus bas que les frais CB.

**Avantages majeurs** :
- Pas de plafond CB (virement jusqu'a 100 000 EUR)
- Pas de chargeback possible (virement = definitif)
- Frais potentiellement plus bas

**Inconvenients** :
- UX inferieure (copier IBAN, ouvrir appli bancaire, saisir montant)
- Risque d'erreur de saisie
- Pas d'achat impulsif

**Ideal pour** : montants > 5 000 EUR ou acheteurs dont la CB est insuffisante.

#### D) Prelevement SEPA (SEPA Direct Debit)

**Fonctionnement** : l'acheteur donne son IBAN + signe un mandat de prelevement. Stripe debite le compte.

**Delai** : 6 jours ouvrés avant confirmation. Trop long pour une vente d'art.

**Risque** : l'acheteur peut contester le prelevement pendant **8 semaines** (sans justification) ou **13 mois** (si prelevement non autorise). C'est un risque inacceptable sur une oeuvre a 10 000 EUR.

**Frais** : 0,25 EUR fixe par transaction (ultra-competitif).

**Verdict** : **NON RECOMMANDE**. Le risque de contestation a 13 mois est redhibitoire pour des oeuvres d'art uniques (oeuvre livree + argent reverse = catastrophe).

#### E) Stripe Invoice / Payment Links

**Invoice** : creer une facture pro dans le dashboard Stripe, envoyer par email. L'acheteur clique et choisit son moyen de paiement.

**Payment Link** : lien de paiement unique (ou reutilisable). Personnalisable. Pas de code requis.

**Avantage pour Guillaume** : deja parfaitement adapte au modele de lien secret temporaire (24h). Un Payment Link ou une Invoice = exactement ce flow.

**Methodes disponibles** dans un Payment Link/Invoice :
- CB (Visa, MC, Amex)
- Apple Pay / Google Pay
- Virement bancaire SEPA
- Methodes locales EU (iDEAL, Bancontact, giropay)

**Verdict** : C'est la **methode principale a utiliser**.

#### F) Acompte + solde (Deposit Workflow)

**Fonctionnement** :
1. **Acompte 30%** (ex: 3 000 EUR sur 10 000 EUR) — paiement CB immediat
2. **Solde 70%** (7 000 EUR) — virement bancaire sous 7 jours
3. Expedition uniquement apres reception integrale

**Support Stripe** : natif via Invoice Payment Plans. Permet de creer une facture avec echeancier. Stripe gere les rappels automatiques.

**Pertinent pour** : oeuvres > 5 000 EUR quand l'acheteur a un plafond CB insuffisant pour payer en une fois.

**Point juridique** : l'acompte engage l'acheteur. En cas de non-paiement du solde, l'acompte peut etre conserve (clause a prevoir dans les CGV).

#### G) Crypto via Stripe + Crypto.com

Depuis janvier 2026, Stripe permet les paiements crypto via Crypto.com. Le client paie en crypto/stablecoin, Stripe convertit en EUR, Guillaume recoit des EUR.

**Avantages** : pas de plafond, pas de chargeback, clientele internationale.

**Inconvenients** : adoption limitee (<5% population), frais 2-4%, complexite.

**Verdict** : optionnel. A activer uniquement si la clientele est internationale/tech.

#### H) Methodes EU locales (iDEAL, Bancontact, giropay)

**Cout** : 0,29 EUR fixe par transaction (independant du montant). Sur 10 000 EUR, c'est 0,003% de frais. Extraordinairement competitif.

**Pertinence** : si Guillaume a des acheteurs neerlandais (iDEAL), belges (Bancontact), ou allemands (giropay), ces methodes sont quasi-gratuites.

**Verdict** : **ACTIVER** immediatement. Cout nul, activation gratuite dans Stripe.

---

## 3. Recommandation par tranche de prix

### 3.1 Oeuvres 2 500 - 5 000 EUR

| Priorite | Methode | Pourquoi |
|----------|---------|----------|
| 1 | CB classique (+ Apple Pay / Google Pay) | Fonctionne pour cartes Premier/Gold et superieur. UX optimale. |
| 2 | Virement SEPA instantane | Alternative si CB insuffisante. Gratuit pour l'acheteur. |
| 3 | Methodes EU locales | iDEAL/Bancontact/giropay pour acheteurs EU (frais 0,29 EUR). |

**Pas besoin d'acompte** a ce niveau. La majorite des cartes premium couvrent 5 000 EUR.

### 3.2 Oeuvres 5 000 - 10 000 EUR

| Priorite | Methode | Pourquoi |
|----------|---------|----------|
| 1 | CB premium (Platinum/Infinite/World Elite/Amex) | Fonctionne si plafond suffisant. |
| 2 | Virement SEPA instantane | Zero plafond, zero chargeback. Recommander activement. |
| 3 | Acompte 30% CB + solde 70% virement | Contourne le plafond CB. Securise la vente. |
| 4 | Methodes EU locales | Pour acheteurs EU non-francais. |

**Mentionner dans le message** : "Si votre plafond carte ne permet pas le paiement en une fois, vous pouvez opter pour le virement bancaire ou un acompte suivi du solde par virement."

### 3.3 Oeuvres 10 000 - 20 000 EUR

| Priorite | Methode | Pourquoi |
|----------|---------|----------|
| 1 | Stripe Invoice personnalisee | Envoi email pro avec choix de methode. |
| 2 | Virement SEPA (100% du montant) | La methode la plus simple pour ces montants. Frais minimaux. |
| 3 | Acompte 30-50% CB + solde virement | Mix securite + accessibilite. |
| 4 | CB premium (Amex Platinum/Centurion, Visa Infinite) | Possible mais plafond souvent atteint. |

**A ce niveau** : favoriser le contact direct. Guillaume envoie un email personnalise avec la Stripe Invoice. L'acheteur choisit son mode de paiement.

### 3.4 Tableau de synthese

| Tranche | Methode principale | Alternative 1 | Alternative 2 | Frais Guillaume |
|---------|-------------------|---------------|---------------|-----------------|
| 2 500 - 5 000 EUR | CB + Apple Pay | Virement SEPA | EU local | 1,5% (~37-75 EUR) |
| 5 000 - 10 000 EUR | CB premium / Virement | Acompte + solde | EU local | 1,5% ou ~0,8% (virement) |
| 10 000 - 20 000 EUR | Invoice (multi-methode) | Virement 100% | Acompte 30% + solde | 0,3-1,5% selon methode |

---

## 4. Flow utilisateur recommande

### 4.1 Parcours acheteur — Scenario type

```
ETAPE 1 : CONTACT INITIAL
Guillaume identifie un acheteur interesse (rencontre, expo, Instagram, bouche-a-oreille)
↓
ETAPE 2 : ENVOI DU LIEN SECRET (24h)
Guillaume genere un lien de paiement Stripe personnalise
Email a l'acheteur avec :
  - Photos HD de l'oeuvre
  - Description technique (dimensions, technique, annee)
  - Certificat d'authenticite en PDF
  - Prix TTC
  - Lien de paiement (expire dans 24h)
  - Mention : "Plusieurs moyens de paiement disponibles"
↓
ETAPE 3 : PAIEMENT
L'acheteur clique sur le lien → page Stripe Checkout
Methodes proposees (par ordre) :
  1. Carte bancaire (Visa, MC, Amex)
  2. Apple Pay / Google Pay
  3. Virement bancaire SEPA
  4. Methodes locales EU (si detecte)
↓
ETAPE 4 : CONFIRMATION
Paiement recu → email de confirmation automatique
  - Facture Stripe PDF
  - Certificat d'authenticite signe
  - Information livraison (delai, transporteur)
↓
ETAPE 5 : EXPEDITION
Guillaume emballe l'oeuvre (professionnel)
Transporteur specialise pour > 5 000 EUR
Assurance ad valorem
Numero de suivi communique a l'acheteur
↓
ETAPE 6 : LIVRAISON
Livraison contre signature
Email de suivi post-livraison
```

### 4.2 Parcours alternatif — Montant > 10 000 EUR

```
ETAPE 1 : CONTACT DIRECT
Echange personnalise (email, telephone, rencontre)
↓
ETAPE 2 : INVOICE STRIPE
Guillaume cree une Invoice dans le Dashboard Stripe
  - Description detaillee de l'oeuvre
  - Prix TTC
  - Conditions de vente
  - Option : Payment Plan (acompte + solde)
Envoi par email
↓
ETAPE 3 : PAIEMENT FLEXIBLE
L'acheteur recoit l'Invoice et choisit :
  A) Paiement integral par virement SEPA (recommande)
  B) Paiement integral par CB (si carte premium)
  C) Acompte 30% par CB + solde par virement sous 7 jours
↓
ETAPE 4-6 : identiques au flow standard
```

### 4.3 Message type a envoyer a l'acheteur

```
Objet : Votre oeuvre — [Titre] de Guillaume Farre

Bonjour [Prenom],

Suite a notre echange, je vous adresse le lien de paiement pour
l'oeuvre "[Titre]" ([dimensions], [technique], [annee]).

Prix : [MONTANT] EUR TTC

Lien de paiement (valable 24h) :
[LIEN STRIPE]

Plusieurs moyens de paiement sont disponibles :
- Carte bancaire (Visa, Mastercard, American Express)
- Apple Pay / Google Pay
- Virement bancaire SEPA

Si vous souhaitez proceder par virement bancaire ou echelonner
le paiement, n'hesitez pas a me contacter.

Chaque oeuvre est accompagnee d'un certificat d'authenticite signe.
La livraison est assuree par un transporteur specialise avec
assurance ad valorem.

Cordialement,
Guillaume Farre
```

---

## 5. Points juridiques cles

### 5.1 Droit de retractation — ZONE GRISE

**Principe** : tout achat a distance = droit de retractation de 14 jours (art L221-18 Code de la consommation).

**Exception possible** : art L221-28 exclut les "biens confectionnes selon les specifications du consommateur ou nettement personnalises".

**Le probleme pour Guillaume** : les toiles sont des pieces uniques MAIS elles ne sont pas commandees par l'acheteur. Elles existent deja. La jurisprudence francaise interprete **restrictivement** cette exception :
- CA Lyon, 7 juin 2018 : exige un "veritable travail specifique" de personnalisation
- CA Poitiers, 15 nov. 2022 : une simple option de couleur ne suffit pas

**Risque** : un acheteur pourrait invoquer le droit de retractation sur une oeuvre d'art achetee en ligne, meme unique, car elle n'a pas ete personnalisee "selon ses specifications".

**Strategie recommandee** :
1. **Mentionner clairement** le droit de retractation dans les CGV (obligation legale)
2. **Prevoir le retour** dans les conditions : frais de retour a la charge de l'acheteur, oeuvre restituee en parfait etat
3. **Oeuvres sur commande** : si Guillaume cree une oeuvre specifiquement pour un client, l'exception s'applique. Le mentionner explicitement dans le contrat.
4. **Ne pas tenter d'exclure illegalement** le droit de retractation (sanctions : 15 000 EUR d'amende)

**Si retractation exercee** : remboursement integral dans les 14 jours. L'acheteur supporte les frais de retour.

### 5.2 TVA sur les oeuvres d'art

**Taux reduit 5,5%** (art 278-0 bis CGI, reforme 1er janvier 2025) :
- S'applique a TOUTES les livraisons d'oeuvres d'art
- Y compris ventes directes par l'artiste
- Tableaux, peintures, collages = oeuvres d'art (art 98 A annexe III CGI)

**Franchise en base de TVA** (micro-entreprise) :
- Si CA annuel < 37 500 EUR : pas de TVA facturee
- Mention obligatoire : "TVA non applicable — Article 293 B du CGI"
- Si CA > 41 250 EUR : TVA a 5,5% obligatoire des le mois de depassement

**Cas concret Guillaume** :
- S'il vend 4 toiles a 5 000 EUR = 20 000 EUR de CA → franchise en base, pas de TVA
- S'il vend 2 toiles a 20 000 EUR = 40 000 EUR de CA → depassement seuil, TVA a 5,5% obligatoire

**Configuration Stripe** : parametrer le taux de TVA a 5,5% (ou 0% si franchise en base) dans les produits Stripe.

### 5.3 Contrat de vente et CGV

**Pas de contrat signe obligatoire** : la vente est consensuelle (art 1583 Code civil). La facture Stripe + confirmation email = preuve suffisante.

**CGV obligatoires** (art L111-1 Code de la consommation) :
1. Identification du vendeur (nom, adresse, SIRET, RCS)
2. Caracteristiques de l'oeuvre (titre, dimensions, technique, annee)
3. Prix TTC + frais de livraison
4. Delai de livraison
5. Droit de retractation (conditions, formulaire type)
6. Garanties legales (conformite 2 ans, vices caches)
7. Mediateur de la consommation (obligatoire, art L612-1)
8. RGPD (politique de confidentialite)

**Certificat d'authenticite** : pas d'obligation legale stricte mais fortement recommande (Decret Marcus du 3 mars 1981). Contenu : titre, date, nom artiste, technique, dimensions, signature.

### 5.4 Droits d'auteur et propriete

**REGLE FONDAMENTALE** (art L111-3 CPI) : la vente de l'oeuvre physique ne transfere AUCUN droit d'auteur. L'acheteur possede la toile mais ne peut pas :
- Reproduire l'oeuvre (photos pour publication commerciale)
- Exploiter commercialement l'image (posters, NFT, merchandising)
- Modifier l'oeuvre

L'acheteur PEUT : exposer chez lui, revendre l'original (droit de suite applicable sur reventes futures).

**Droit de suite** : pas applicable a la premiere vente par l'artiste. Applicable uniquement sur les reventes ulterieures si un professionnel intervient. Taux : 4% jusqu'a 50 000 EUR.

### 5.5 Assurance et transport

**Transport d'oeuvres 2 500 - 20 000 EUR** :
- Assurance ad valorem OBLIGATOIRE (l'assurance transport standard limite a 30 EUR/kg = derisoire)
- Prime : 0,5% a 2% de la valeur declaree
- Transfert de risque : preciser dans CGV que le risque est a la charge du vendeur jusqu'a livraison effective

**Transporteurs recommandes** :
- < 5 000 EUR : DHL Express / FedEx avec option declaration de valeur
- > 5 000 EUR : transporteur specialise art (Chenue, AXA Art, Fine Art Shippers)
- Emballage professionnel : caisse bois pour grands formats, triple cannelure + mousse pour formats standard

---

## 6. Plan d'implementation technique

### 6.1 Phase 1 — Immediat (1 jour)

**Activer dans Stripe Dashboard** :
- [ ] Apple Pay / Google Pay
- [ ] Virement bancaire SEPA (Bank Transfers)
- [ ] iDEAL (Pays-Bas)
- [ ] Bancontact (Belgique)
- [ ] giropay (Allemagne)

**Cout** : 0 EUR. Activation gratuite dans Stripe. Aucun code a ecrire.

**Comment** : Stripe Dashboard → Settings → Payment Methods → Activer chaque methode.

### 6.2 Phase 2 — Court terme (1 semaine)

**Configurer les Payment Links / Invoices** :
- [ ] Creer un template de produit par oeuvre dans Stripe
- [ ] Configurer les metadonnees (titre, dimensions, technique, annee)
- [ ] Parametrer le taux TVA (5,5% ou exempt)
- [ ] Tester la generation d'un Payment Link avec toutes les methodes activees
- [ ] Tester l'envoi d'une Invoice avec Payment Plan (acompte + solde)

**Rediger les CGV** :
- [ ] Mentions legales completes
- [ ] CGV conformes (voir section 5.3)
- [ ] Politique de retractation (14 jours)
- [ ] Politique RGPD
- [ ] Designation d'un mediateur de la consommation

### 6.3 Phase 3 — Moyen terme (2-4 semaines)

**Implementer le flow dans le site Next.js** :

```
Interface admin (page admin) :
  → Bouton "Generer lien de paiement" par oeuvre
  → Formulaire : prix, duree validite (24h par defaut), methodes de paiement
  → Genere le Payment Link via Stripe API
  → Copie le lien dans le presse-papier
  → Option : envoyer directement par email depuis l'interface

Webhooks Stripe :
  → payment_intent.succeeded : email confirmation + facture PDF + certificat authenticite
  → invoice.paid : mise a jour statut commande
  → charge.refunded : gestion retour/retractation
```

**Endpoints API a creer** :
- `POST /api/payments/create-link` — generer un Payment Link Stripe
- `POST /api/payments/create-invoice` — generer une Invoice Stripe (gros montants)
- `POST /api/webhooks/stripe` — recevoir les evenements Stripe

### 6.4 Phase 4 — Optionnel

- [ ] Paiements crypto via Crypto.com (si clientele internationale detectee)
- [ ] Dashboard de suivi des paiements dans l'admin
- [ ] Relance automatique pour Invoices impayees
- [ ] Integration transporteur (numero de suivi automatique)

### 6.5 Budget frais Stripe annuel estime

**Scenario : 10 oeuvres vendues par an, prix moyen 7 500 EUR = 75 000 EUR de CA**

| Methode | % du CA | Montant | Frais | Frais annuels |
|---------|---------|---------|-------|---------------|
| CB europeenne (60%) | 60% | 45 000 EUR | 1,5% + 0,25 EUR | 681,50 EUR |
| Virement SEPA (25%) | 25% | 18 750 EUR | ~0,8% | 150 EUR |
| Methodes EU locales (10%) | 10% | 7 500 EUR | 0,29 EUR/tx | 0,29 EUR |
| Acompte CB + solde virement (5%) | 5% | 3 750 EUR | ~1% mixte | 37,50 EUR |
| **TOTAL** | 100% | 75 000 EUR | | **~870 EUR** |

**Taux effectif moyen** : environ **1,16%** du CA. C'est tres competitif compare aux frais de galerie (30-50% de commission).

---

## Annexe A — Checklist avant lancement

### Obligations legales
- [ ] Mentions legales completes sur le site (LCEN)
- [ ] CGV accessibles avant validation commande
- [ ] Formulaire type de retractation
- [ ] Politique RGPD
- [ ] Mediateur de la consommation designe
- [ ] TVA configuree correctement (5,5% ou franchise en base)

### Configuration Stripe
- [ ] Compte Stripe en mode live
- [ ] Methodes de paiement activees (CB, Apple Pay, Google Pay, SEPA, EU locales)
- [ ] Taux TVA parametre
- [ ] Webhooks configures
- [ ] Emails de confirmation automatiques actifs

### Documents vente
- [ ] Template certificat d'authenticite
- [ ] Template facture (mentions obligatoires)
- [ ] Template email acheteur (avec lien paiement)

### Logistique
- [ ] Transporteur identifie (standard < 5 000 EUR, specialise > 5 000 EUR)
- [ ] Assurance ad valorem contractee
- [ ] Materiel emballage professionnel

---

## Annexe B — Sources

### Plafonds cartes bancaires
- [Plafond maximum de carte bancaire — Guide pratique 2026](https://www.connectbanque.com/fr/guide/banque/plafond-carte-bancaire)
- [Plafonds des cartes bancaires — Le Comparatif](https://www.lecomparatif.com/banque/plafond-carte)
- [Plafond de depense American Express](https://www.americanexpress.com/fr/conseils-paiement/plafond-carte-paiement/)
- [Carte American Express Centurion](https://www.comparabanques.fr/american-express/centurion)

### Stripe
- [Stripe Pricing France](https://stripe.com/fr/pricing)
- [Stripe Bank Transfers](https://docs.stripe.com/payments/bank-transfers)
- [Stripe SEPA Direct Debit](https://docs.stripe.com/payments/sepa-debit)
- [Stripe Payment Links](https://stripe.com/payments/payment-links)
- [Stripe Invoice Payment Methods](https://stripe.com/resources/more/invoice-payment-methods-101)
- [Stripe Deposit Invoices](https://stripe.com/resources/more/deposit-invoices-101-what-they-are-and-how-to-use-them)
- [Stripe Apple Pay](https://docs.stripe.com/apple-pay)
- [Stripe + Crypto.com Integration 2026](https://www.pymnts.com/cryptocurrency/2026/stripe-integrates-cryptocom-facilitate-crypto-payments/)
- [Alma + Stripe Partnership](https://finyear.com/alma-et-stripe-sassocient-pour-offrir-aux-marchands-un-nouveau-levier-de-croissance_a51023.html)

### Virement instantane France
- [Virement instantane gratuit en France (loi 2025)](https://stripe.com/en-fr/resources/more/free-instant-wire-law-france)
- [SEPA Transfer Processing Time France](https://stripe.com/resources/more/sepa-transfer-processing-time-france)

### Juridique
- [Droit de retractation marche de l'art — Fournol Avocat](https://www.fournol-avocat.fr/actualite/2019/11/27/lapplication-du-droit-de-rtractation-sur-le-march-de-lart)
- [Exception biens personnalises — Marine de la Clergerie](https://mdc-avocat.fr/retractation-exception-biens-confectionnes-selon-les-specifications-du-consommateur-ou-nettement-personnalises/)
- [TVA oeuvres d'art 2025 — De Baecque Avocats](https://debaecque-avocats.com/nouvelles-regles-tva-marche-art-2025/)
- [TVA oeuvres d'art — Achetezdelart](https://achetezdelart.com/tva/)
- [Franchise TVA micro-entreprise — Service-Public](https://entreprendre.service-public.fr/vosdroits/F21746)
- [Certificat d'authenticite — La Maison des Artistes](https://www.lamaisondesartistes.fr/site/nouvelle-fiche-pratique-le-certificat-dauthenticite/)
- [Droits patrimoniaux de l'auteur — CNAP](https://www.cnap.fr/ressource-professionnelle/droit-dauteur/questions-reponses)
- [Cession des droits d'auteur — ARTCENA](https://www.artcena.fr/precis-juridique/droits-dauteurs-et-droits-voisins/droit-dauteur/cession-des-droits-dauteur)

### Obligations e-commerce
- [Mentions legales site internet — France Num](https://www.francenum.gouv.fr/guides-et-conseils/developpement-commercial/site-web/quelles-sont-les-mentions-legales-pour-un-site)
- [Obligations legales e-commerce 2026 — Blog du Dirigeant](https://www.leblogdudirigeant.com/obligations-legales-pour-lancer-un-site-e-commerce/)
- [CGV e-commerce conformes 2025 — RGPDKit](https://www.rgpdkit.fr/blog/cgv-ecommerce-guide-complet)

### Transport et assurance
- [Assurance transport oeuvres d'art — Trans-Pass](https://www.trans-pass.com/assurances/expositions-oeuvres-d-art)
- [Assurance objets d'art — WTW](https://www.wtwco.com/fr-fr/insights/2025/11/assurer-linestimable-comprendre-le-fonctionnement-des-assurances-dobjets-dart)

---

*Document genere le 5 avril 2026 — Lalou*
