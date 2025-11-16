# SPÉCIFICATIONS PARCOURS CLIENT - Guillaume Farré
## Fonctionnelles & Techniques

**Date** : 16 novembre 2025
**Projet** : Optimisation tunnel conversion e-commerce
**Objectif** : Passer de 0% à 4-5% de conversion en 8 semaines

---

## 📋 TABLE DES MATIÈRES

1. [Phase 1 - CRITIQUES (Semaines 1-2)](#phase-1)
2. [Phase 2 - HAUTES PRIORITÉS (Semaines 3-5)](#phase-2)
3. [Phase 3 - MOYENNES (Semaines 6-8)](#phase-3)
4. [Architecture technique](#architecture)
5. [Roadmap détaillée](#roadmap)

---

## PHASE 1 - CRITIQUES (Semaines 1-2)
### Impossible de lancer sans ces fonctionnalités

---

### 1.1 Compteur Stock Éditions Limitées

**Problème** : Les collectionneurs ne savent pas combien d'exemplaires restent disponibles pour les séries limitées 1-7.

**Solution** : Afficher badge "X/7 restants" en temps réel.

#### Spécifications fonctionnelles

**Où afficher** :
- Badge en haut à droite de chaque photo (grille boutique)
- Badge sur page produit (plus grand)
- Panier (rappel disponibilité)
- Page checkout (dernière vérification)

**Comportement** :
- Si `limitedEdition.available === 7` → "7/7 disponibles" (vert)
- Si `limitedEdition.available <= 2 && > 0` → "⚠️ Derniers exemplaires - X/7 restants" (orange)
- Si `limitedEdition.available === 0` → "❌ ÉPUISÉ" (rouge, bouton achat désactivé)
- Mise à jour temps réel après chaque vente Stripe (webhook)

**Urgence psychologique** :
- Badge orange clignote doucement (animation CSS subtile)
- Texte "Plus que X disponibles" sur page produit
- Pop-up si ajout panier alors que stock === 1 : "Vous achetez le dernier exemplaire !"

#### Spécifications techniques

**Fichiers à modifier** :
```typescript
// 1. Mise à jour schema metadata (DÉJÀ FAIT ✅)
interface PhotoMetadata {
  limitedEdition?: {
    total: 7;
    sold: number;        // Incrémenté après vente
    available: number;   // Calculé : 7 - sold
    closed: boolean;     // Fermeture manuelle série
  }
}

// 2. Composant Badge Stock
// components/StockBadge.tsx (NOUVEAU)
interface StockBadgeProps {
  available: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StockBadge({ available, total, size = 'md' }: StockBadgeProps) {
  const getColor = () => {
    if (available === 0) return 'bg-red-500';
    if (available <= 2) return 'bg-orange-500 animate-pulse-subtle';
    return 'bg-green-500';
  };

  return (
    <div className={`${getColor()} text-white px-3 py-1 rounded-full text-xs font-medium`}>
      {available === 0 ? '❌ ÉPUISÉ' : `${available}/${total} restants`}
    </div>
  );
}

// 3. Intégration grille boutique
// components/shop/ShopGrid.tsx (ligne ~189)
{(photo.categories?.includes('limited') || photo.edition?.type === 'limited') && (
  <div className="absolute top-3 right-3">
    <StockBadge
      available={photo.limitedEdition?.available || 0}
      total={photo.limitedEdition?.total || 7}
      size="sm"
    />
  </div>
)}

// 4. Webhook Stripe pour décrémenter stock
// app/api/webhooks/stripe/route.ts
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;

  // Pour chaque item acheté
  for (const item of session.line_items) {
    const photoPath = item.metadata.photoPath;

    // Charger metadata
    const photos = await loadPhotoMetadata();
    const photo = photos.find(p => p.path === photoPath);

    if (photo?.limitedEdition) {
      // Décrémenter stock
      photo.limitedEdition.sold += 1;
      photo.limitedEdition.available = photo.limitedEdition.total - photo.limitedEdition.sold;

      // Si épuisé, marquer série comme close
      if (photo.limitedEdition.available === 0) {
        photo.limitedEdition.closed = true;
        photo.forSale = false; // Retirer de la vente
      }

      // Sauvegarder
      await savePhotoMetadata(photos);

      // Logger
      console.log(`[Stock] Photo ${photoPath} : ${photo.limitedEdition.available}/${photo.limitedEdition.total} restants`);
    }
  }
}
```

**Estimation** : 4 heures (composant + webhook + tests)

---

### 1.2 Délais Production + Livraison Affichés

**Problème** : Principal frein à l'achat online = incertitude sur délai de réception.

**Solution** : Afficher délais estimés partout où le client peut se poser la question.

#### Spécifications fonctionnelles

**Où afficher** :
- Page produit (sous prix) : "📦 Livraison estimée : 7-9 jours ouvrés"
- Panier (pour chaque item)
- Page checkout (récapitulatif avant paiement)
- Email confirmation (date livraison estimée précise)
- Page "Merci" post-paiement (DÉJÀ FAIT ✅)

**Calcul délais** :
```
Production Gelato Fine Art : 3-5 jours ouvrés
Expédition France : 2-4 jours ouvrés
Expédition Europe : 4-7 jours ouvrés
Expédition International : 7-14 jours ouvrés

Total France : 5-9 jours (afficher "7-9 jours" pour être prudent)
Total Europe : 7-12 jours
Total International : 10-19 jours
```

**Date estimée dynamique** :
- Si commande passée lundi 9h → "Livraison estimée : mardi 18 novembre"
- Si commande passée vendredi 18h → "Livraison estimée : jeudi 28 novembre" (skip weekend)
- Prendre en compte jours fériés (API ou hardcodé)

#### Spécifications techniques

```typescript
// lib/shipping/delivery-estimates.ts (NOUVEAU)

export interface DeliveryEstimate {
  minDays: number;
  maxDays: number;
  estimatedDate: Date;
  label: string; // "7-9 jours ouvrés"
}

export function calculateDeliveryEstimate(countryCode: string): DeliveryEstimate {
  const today = new Date();

  // Délais selon pays
  const delays = {
    'FR': { production: [3, 5], shipping: [2, 4] },
    'BE': { production: [3, 5], shipping: [3, 5] },
    'CH': { production: [3, 5], shipping: [4, 6] },
    'IT': { production: [3, 5], shipping: [4, 7] },
    'ES': { production: [3, 5], shipping: [4, 7] },
    'DE': { production: [3, 5], shipping: [4, 6] },
    'GB': { production: [3, 5], shipping: [5, 8] },
    'US': { production: [3, 5], shipping: [7, 14] },
    // Default international
    'DEFAULT': { production: [3, 5], shipping: [7, 14] },
  };

  const delay = delays[countryCode] || delays['DEFAULT'];
  const minDays = delay.production[0] + delay.shipping[0];
  const maxDays = delay.production[1] + delay.shipping[1];

  // Calculer date estimée (en sautant weekends)
  const estimatedDate = addBusinessDays(today, maxDays);

  return {
    minDays,
    maxDays,
    estimatedDate,
    label: `${minDays}-${maxDays} jours ouvrés`,
  };
}

function addBusinessDays(date: Date, days: number): Date {
  let current = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    current.setDate(current.getDate() + 1);
    // Skip weekends
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      addedDays++;
    }
  }

  return current;
}

// Composant affichage
// components/DeliveryEstimate.tsx (NOUVEAU)
export default function DeliveryEstimate({ countryCode = 'FR' }: { countryCode?: string }) {
  const estimate = calculateDeliveryEstimate(countryCode);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>📦</span>
      <span>
        Livraison estimée : <strong className="text-foreground">{estimate.label}</strong>
        {' '}(avant le {estimate.estimatedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })})
      </span>
    </div>
  );
}
```

**Estimation** : 3 heures

---

### 1.3 Politique Retour Claire & Visible

**Problème** : Sans garantie retour, les collectionneurs hésitent (peur de recevoir une impression décevante).

**Solution** : Politique retour 14 jours affichée partout + page dédiée.

#### Spécifications fonctionnelles

**Contenu politique** :
```markdown
## Retours & Échanges

### Délai de rétractation : 14 jours

Conformément à la loi française, vous disposez de 14 jours calendaires à compter de la réception de votre œuvre pour exercer votre droit de rétractation, sans avoir à justifier de motif.

### Conditions

✅ L'œuvre doit être retournée dans son emballage d'origine
✅ En parfait état (non accrochée, non encadrée si vous avez choisi "sans cadre")
✅ Avec tous les accessoires (certificat d'authenticité, facture)

### Procédure

1. **Contactez-nous** : Envoyez un email à contact@guillaumefarre.com avec votre numéro de commande
2. **Renvoi** : Vous disposez de 14 jours pour renvoyer l'œuvre (frais de retour à votre charge)
3. **Remboursement** : Sous 14 jours après réception du retour, sur votre moyen de paiement initial

### Exceptions

❌ Œuvres personnalisées ou sur-mesure (format XXL/monumental)
❌ Certificats d'authenticité signés pour éditions limitées (sauf défaut qualité)

### Garantie Qualité

Si votre tirage présente un défaut de qualité (couleurs incorrectes, dommage durant transport, défaut d'impression), nous le remplaçons gratuitement ou vous remboursons intégralement, frais de retour inclus.

Contact : **contact@guillaumefarre.com** | Tél : +33 X XX XX XX XX
```

**Où afficher** :
- Footer (lien "Retours & Échanges")
- Page produit (accordéon "Politique de retour")
- Panier (badge "✅ Retour 14 jours")
- Page checkout (checkbox "J'ai lu la politique de retour")
- Email confirmation (section dédiée)

#### Spécifications techniques

```typescript
// app/[locale]/retours-echanges/page.tsx (NOUVEAU)
import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/navigation/Navigation';

export default async function RetoursPage() {
  const t = await getTranslations('returns');

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-6 lg:px-8 py-20 md:py-28 max-w-4xl">
        <h1 className="text-5xl font-light mb-12">Retours & Échanges</h1>

        {/* Contenu Markdown rendu */}
        <div className="prose prose-lg max-w-none">
          {/* ... politique complète ... */}
        </div>

        {/* CTA Contact */}
        <div className="mt-16 p-8 bg-muted rounded-xl text-center">
          <h3 className="text-2xl font-light mb-4">Une question sur votre commande ?</h3>
          <a
            href="mailto:contact@guillaumefarre.com"
            className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </main>
  );
}

// Ajout badge dans panier
// app/[locale]/panier/PanierClient.tsx
<div className="space-y-3 text-sm text-muted-foreground">
  <div className="flex items-start gap-2">
    <span>✓</span>
    <span>Paiement sécurisé par Stripe</span>
  </div>
  <div className="flex items-start gap-2">
    <span>✓</span>
    <span>Retour 14 jours satisfait ou remboursé</span>
  </div>
  {/* ... */}
</div>
```

**Estimation** : 2 heures

---

### 1.4 FAQ Exhaustive

**Problème** : Les clients ont des questions récurrentes qui bloquent l'achat (formats, matériaux, livraison, etc.).

**Solution** : Page FAQ avec 20+ questions couvrant 90% des interrogations.

#### Spécifications fonctionnelles

**Structure FAQ** :
```
## Commande & Paiement (5 questions)
- Comment passer commande ?
- Quels moyens de paiement acceptez-vous ?
- Puis-je payer en plusieurs fois ?
- Ma commande est-elle sécurisée ?
- Puis-je modifier ma commande après validation ?

## Produits & Qualité (6 questions)
- Quelle est la différence entre tirage illimité et édition limitée ?
- Quels formats proposez-vous ?
- Sur quel papier sont imprimées les photos ?
- Les couleurs seront-elles fidèles ?
- Qu'est-ce qu'un certificat d'authenticité ?
- Les photos sont-elles signées par l'artiste ?

## Livraison (4 questions)
- Quels sont les délais de livraison ?
- Livrez-vous à l'international ?
- Comment suivre ma commande ?
- Que faire si mon colis est endommagé ?

## Retours & SAV (3 questions)
- Puis-je retourner mon achat ?
- Comment faire un échange ?
- Garantie qualité ?

## Encadrement (2 questions)
- Proposez-vous des cadres ?
- Comment accrocher mon tirage ?
```

**Interactivité** :
- Accordéons (chaque question = collapse/expand)
- Recherche en temps réel (filtrer questions par mots-clés)
- Ancres directes (lien FAQ depuis page produit → ouvre bonne question)

#### Spécifications techniques

```typescript
// app/[locale]/faq/page.tsx (NOUVEAU)
'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Commande & Paiement',
    questions: [
      {
        q: 'Comment passer commande ?',
        a: 'Sélectionnez l\'œuvre qui vous plaît, choisissez le format et l\'encadrement, puis cliquez sur "Ajouter au panier". Validez ensuite votre commande en cliquant sur l\'icône panier en haut à droite.',
      },
      // ... 19 autres questions
    ],
  },
  // ... autres catégories
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // Filtrer questions par recherche
  const filteredFAQ = FAQ_DATA.map(cat => ({
    ...cat,
    questions: cat.questions.filter(item =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="container mx-auto px-6 lg:px-8 py-20 max-w-4xl">
      <h1 className="text-5xl font-light mb-8">Foire Aux Questions</h1>

      {/* Recherche */}
      <input
        type="text"
        placeholder="🔍 Rechercher une question..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-6 py-4 border rounded-lg mb-12 text-lg"
      />

      {/* Questions par catégorie */}
      {filteredFAQ.map((cat, catIndex) => (
        <div key={catIndex} className="mb-12">
          <h2 className="text-2xl font-light mb-6">{cat.category}</h2>
          <div className="space-y-4">
            {cat.questions.map((item, qIndex) => {
              const globalIndex = catIndex * 100 + qIndex;
              const isOpen = openIndex === globalIndex;

              return (
                <div key={qIndex} className="border rounded-lg">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-lg">{item.q}</span>
                    <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-muted-foreground">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredFAQ.length === 0 && (
        <p className="text-center text-muted-foreground">Aucune question trouvée pour "{search}"</p>
      )}
    </div>
  );
}
```

**Estimation** : 6 heures (rédaction contenu + développement)

---

## Résumé Phase 1

**Total estimé** : **15 heures** (2 jours de dev)

**Impact attendu** :
- Conversion : 0% → 2-3%
- Panier abandonné : -35%
- Tickets support : -40%

**Ordre d'implémentation** :
1. FAQ (rédaction peut se faire en parallèle)
2. Politique retour (texte simple)
3. Délais livraison (calculs simples)
4. Compteur stock + webhook Stripe (plus technique)

---

*Suite du document : Phase 2 et 3 à venir...*

