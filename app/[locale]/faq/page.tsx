'use client';

import { useState } from 'react';
import Navigation from '@/components/navigation/Navigation';
import { safeJsonLd } from '@/lib/safe-json-ld';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  icon: string;
  questions: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    category: 'Commande & Paiement',
    icon: '💳',
    questions: [
      {
        q: 'Comment passer commande ?',
        a: 'Sélectionnez l\'œuvre qui vous plaît dans la boutique, choisissez le format et l\'encadrement souhaités, puis cliquez sur "Ajouter au panier". Validez ensuite votre commande en cliquant sur l\'icône panier en haut à droite de la page, puis sur "Procéder au paiement".',
      },
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) ainsi que Google Pay et Apple Pay. Le paiement est 100% sécurisé par Stripe, leader mondial du paiement en ligne.',
      },
      {
        q: 'Puis-je payer en plusieurs fois ?',
        a: 'Oui ! Pour les commandes de 100€ et plus, le paiement en 3x ou 4x sans frais est disponible via Alma. L\'option vous sera proposée automatiquement lors du paiement. Exemple : pour une œuvre à 2,000€, payez 4x 500€/mois sans aucun frais supplémentaire. Validation instantanée, vous recevez immédiatement votre œuvre.',
      },
      {
        q: 'Comment fonctionne le paiement en plusieurs fois Alma ?',
        a: 'Alma vous permet de payer en 3 ou 4 fois sans frais. Lors du paiement, sélectionnez "Alma" comme moyen de paiement, vous serez redirigé vers leur plateforme sécurisée. Alma vérifie votre éligibilité instantanément (moins de 30 secondes), puis vous payez la première mensualité. Les suivantes sont prélevées automatiquement chaque mois. Nous recevons le paiement complet immédiatement et vous expédions l\'œuvre sans délai. Aucun frais caché, aucun intérêt.',
      },
      {
        q: 'Ma commande est-elle sécurisée ?',
        a: 'Absolument. Toutes les transactions sont cryptées SSL et traitées par Stripe (certification PCI-DSS niveau 1). Nous ne stockons aucune donnée de carte bancaire sur nos serveurs.',
      },
      {
        q: 'Puis-je modifier ma commande après validation ?',
        a: 'Vous disposez de 2 heures après validation pour modifier ou annuler votre commande gratuitement. Passé ce délai, la production démarre et seul un retour sous 14 jours sera possible (frais de retour à votre charge).',
      },
    ],
  },
  {
    category: 'Produits & Qualité',
    icon: '🎨',
    questions: [
      {
        q: 'Quelle est la différence entre tirage illimité et édition limitée ?',
        a: 'Les tirages illimités sont disponibles en quantité infinie (formats A4/A3/A2), imprimés sur papier photo standard 4 couleurs. Les éditions limitées sont strictement limitées à 7 exemplaires numérotés (formats A3/A2/A1), imprimés sur papier Fine Art Giclee 12 couleurs archival, signées par Guillaume Farré avec certificat d\'authenticité. Une fois les 7 exemplaires vendus, la série est définitivement close.',
      },
      {
        q: 'Quels formats proposez-vous ?',
        a: 'Tirages illimités : A4 (21×29.7 cm), A3 (29.7×42 cm), A2 (42×59.4 cm). Éditions limitées : A3 (29.7×42 cm), A2 (42×59.4 cm), A1 (59.4×84.1 cm). Formats XXL (80×120 cm) et monumentaux (120+ cm) sur demande.',
      },
      {
        q: 'Sur quel papier sont imprimées les photos ?',
        a: 'Éditions limitées : Papier Fine Art Giclee Hahnemühle 200 gsm, 100% coton, certifié archival (conservation 100+ ans), impression 12 couleurs. Tirages illimités : Papier photo premium 180 gsm, impression 4 couleurs CMYK. Toutes les impressions sont réalisées par Gelato, leader européen de l\'impression Fine Art.',
      },
      {
        q: 'Les couleurs seront-elles fidèles ?',
        a: 'Oui ! Chaque tirage est contrôlé qualité avant expédition. Nous utilisons des profils ICC calibrés et l\'impression Giclee 12 couleurs garantit une fidélité chromatique exceptionnelle. Si vous constatez un écart significatif à réception, nous remplaçons le tirage gratuitement.',
      },
      {
        q: 'Qu\'est-ce qu\'un certificat d\'authenticité ?',
        a: 'Pour chaque édition limitée, vous recevez un certificat officiel signé par Guillaume Farré, mentionnant : le titre de l\'œuvre, le numéro d\'édition (ex: 3/7), l\'année de création, le format, et un tampon de certification. Ce document augmente la valeur de collection de votre tirage.',
      },
      {
        q: 'Les photos sont-elles signées par l\'artiste ?',
        a: 'Les éditions limitées (1-7/7) portent la signature manuscrite de Guillaume Farré directement sur le tirage. Les tirages illimités incluent une signature imprimée.',
      },
    ],
  },
  {
    category: 'Livraison',
    icon: '📦',
    questions: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: 'Production : 3-5 jours ouvrés (impression Fine Art sur commande). Expédition France : 2-4 jours ouvrés. Total France métropolitaine : 7-9 jours ouvrés en moyenne. Europe : 7-12 jours. International : 10-19 jours. La date estimée précise est affichée sur chaque page produit.',
      },
      {
        q: 'Livrez-vous à l\'international ?',
        a: 'Oui ! Nous livrons dans le monde entier. France et pays limitrophes (Belgique, Suisse, Luxembourg, Monaco) : 7-9j. Europe (Allemagne, Italie, Espagne, UK, etc.) : 7-12j. USA/Canada : 10-19j. Frais de port calculés automatiquement au checkout selon destination.',
      },
      {
        q: 'Comment suivre ma commande ?',
        a: 'Vous recevez 3 emails automatiques : (1) Confirmation de commande (immédiat), (2) Notification d\'expédition avec numéro de tracking (J+3 à J+5), (3) Notification de livraison. Le tracking transporteur est accessible directement depuis l\'email d\'expédition.',
      },
      {
        q: 'Que faire si mon colis est endommagé ?',
        a: 'Refusez le colis lors de la livraison si l\'emballage est visiblement endommagé, ou photographiez les dommages avant d\'ouvrir. Contactez-nous sous 48h à contact@guillaumefarre.com avec photos. Nous enverrons un remplacement gratuit immédiatement, sans attendre le retour du colis endommagé.',
      },
    ],
  },
  {
    category: 'Retours & SAV',
    icon: '↩️',
    questions: [
      {
        q: 'Puis-je retourner mon achat ?',
        a: 'Oui, vous disposez de 14 jours calendaires après réception pour retourner votre œuvre, sans justification (droit de rétractation légal français). L\'œuvre doit être dans son emballage d\'origine, en parfait état, avec certificat et facture. Frais de retour à votre charge. Remboursement sous 14 jours après réception du retour. Voir notre page Retours & Échanges pour détails.',
      },
      {
        q: 'Comment faire un échange ?',
        a: 'Nous ne proposons pas d\'échange direct. Retournez l\'œuvre sous 14 jours pour remboursement complet, puis passez une nouvelle commande pour l\'œuvre ou le format souhaité. Cela garantit que vous ne perdez pas votre place pour les éditions limitées en cours d\'épuisement.',
      },
      {
        q: 'Garantie qualité ?',
        a: 'Garantie satisfait ou remboursé : Si votre tirage présente un défaut de qualité (couleurs incorrectes, défaut d\'impression, dommage transport), nous le remplaçons gratuitement OU vous remboursons intégralement, frais de retour inclus. Valable à vie sur les éditions limitées, 2 ans sur tirages illimités.',
      },
    ],
  },
  {
    category: 'Encadrement',
    icon: '🖼️',
    questions: [
      {
        q: 'Proposez-vous des cadres ?',
        a: 'Oui ! Lors de la commande, vous pouvez choisir : Cadre bois noir (+80€), Cadre bois blanc (+80€), Cadre aluminium brossé (+120€), ou Sans cadre (tirage seul). Les cadres sont fabriqués sur-mesure pour le format choisi, avec verre anti-reflet UV et passe-partout mu conservé si format ≥ A2.',
      },
      {
        q: 'Comment accrocher mon tirage ?',
        a: 'Si cadré : système d\'accrochage mural inclus (attaches triangle au dos). Si sans cadre : nous recommandons un encadrement professionnel sous verre anti-UV pour préserver les couleurs. Évitez la lumière directe du soleil et l\'humidité. Un guide d\'accrochage PDF est joint à chaque commande.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  // Filtrer questions par recherche
  const filteredFAQ = FAQ_DATA.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  // Lalou: JSON-LD FAQPage schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.flatMap((cat) =>
      cat.questions.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    )
  };

  return (
    <main className="min-h-screen">
      {/* Lalou: JSON-LD structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />

      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28 max-w-4xl">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide mb-6 sm:mb-8">
          Foire Aux Questions
        </h1>

        <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed">
          Toutes les réponses à vos questions sur nos œuvres, la commande, la livraison et le SAV.
        </p>

        {/* Recherche */}
        <div className="mb-8 sm:mb-12">
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 sm:px-6 py-3.5 sm:py-4 border border-border rounded-lg text-base sm:text-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Questions par catégorie */}
        {filteredFAQ.map((cat, catIndex) => (
          <div key={catIndex} className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl">{cat.icon}</span>
              <h2 className="text-2xl sm:text-3xl font-light">{cat.category}</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {cat.questions.map((item, qIndex) => {
                const globalIndex = catIndex * 100 + qIndex;
                const isOpen = openIndex === globalIndex;

                return (
                  <div key={qIndex} className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-muted transition-colors min-h-[48px]"
                    >
                      <span className="font-medium text-base sm:text-lg pr-4">{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
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
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground mb-4">
              Aucune question trouvée pour "{search}"
            </p>
            <button
              onClick={() => setSearch('')}
              className="text-primary hover:underline"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {/* Contact si question non repondue */}
        <div className="mt-12 sm:mt-16 bg-card border border-border rounded-xl p-5 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
          <a
            href="mailto:contact@guillaumefarre.com"
            className="inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all min-h-[48px]"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </main>
  );
}

// Lalou
