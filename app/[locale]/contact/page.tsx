import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const contactReasons = [
    {
      icon: "🛒",
      title: "Acquérir une œuvre",
      description: "Achat, réservation, paiement fractionné",
      cta: "Demander un rendez-vous",
      urgent: false
    },
    {
      icon: "🎭",
      title: "Réserver une performance",
      description: "Événement privé ou public",
      cta: "Voir les disponibilités",
      urgent: false
    },
    {
      icon: "💎",
      title: "Rejoindre le club",
      description: "Devenir collectionneur privilégié",
      cta: "Candidater au club",
      urgent: false
    },
    {
      icon: "📰",
      title: "Demande presse",
      description: "Interview, visuels HD, informations",
      cta: "Accès presse",
      urgent: true
    },
    {
      icon: "🤝",
      title: "Collaboration / Galerie",
      description: "Partenariats, expositions, projets",
      cta: "Présenter mon projet",
      urgent: false
    },
    {
      icon: "💬",
      title: "Autre demande",
      description: "Question générale, information",
      cta: "Envoyer un message",
      urgent: false
    }
  ];

  const faqs = [
    {
      q: "Quel est le délai de réponse ?",
      a: "Moins de 24h pour toute demande. Réponse prioritaire pour les demandes d'acquisition et les collectionneurs du club."
    },
    {
      q: "Puis-je visiter l'atelier ?",
      a: "Oui ! Les visites sont possibles sur rendez-vous, généralement les vendredis après-midi. Places limitées à 4 personnes par visite."
    },
    {
      q: "Comment acheter une œuvre ?",
      a: "Directement sur la boutique en ligne, ou contactez-moi pour un accompagnement personnalisé. Paiement en 3x disponible dès 500€."
    },
    {
      q: "Organisez-vous des performances privées ?",
      a: "Oui, pour les événements corporate, collections privées, ou occasions spéciales. Budget à partir de 15 000€. Devis sur demande."
    }
  ];

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-950/20 to-black border-b border-blue-900/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-blue-600 rounded-full text-sm font-bold mb-6">
              CONTACT
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Parlons de votre projet
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Acquisition, performance privée, collaboration ? Je réponds personnellement
              à chaque message sous 24h.
            </p>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Réponse sous 24h garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Contact direct avec l'artiste</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Confidentialité assurée</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact rapide - Cartes par motif */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Je souhaite...
            </h2>
            <p className="text-gray-400">
              Choisissez le motif de contact pour une réponse optimale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {contactReasons.map((reason, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br from-gray-900 to-black border-2 rounded-2xl p-6 hover:border-blue-600 transition-all cursor-pointer group ${
                  reason.urgent ? "border-orange-600/50" : "border-gray-800"
                }`}
              >
                {reason.urgent && (
                  <div className="inline-block px-2 py-1 bg-orange-600 rounded-full text-xs font-bold mb-3">
                    PRIORITAIRE
                  </div>
                )}

                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{reason.description}</p>

                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all group-hover:scale-105">
                  {reason.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Méthodes de contact directes */}
      <section className="bg-gradient-to-b from-black via-blue-950/10 to-black border-y border-blue-900/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ou contactez-moi directement
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Email */}
              <a
                href="mailto:contact@guillaumefarre.com"
                className="bg-gradient-to-br from-blue-950/20 to-black border-2 border-blue-900/30 rounded-2xl p-8 text-center hover:border-blue-600 transition-all group"
              >
                <div className="text-6xl mb-4">📧</div>
                <h3 className="text-xl font-bold mb-3">Email</h3>
                <p className="text-blue-500 group-hover:text-blue-400 font-mono text-sm mb-2">
                  contact@guillaumefarre.com
                </p>
                <p className="text-xs text-gray-400">Réponse sous 24h</p>
              </a>

              {/* Téléphone */}
              <a
                href="tel:+33612345678"
                className="bg-gradient-to-br from-green-950/20 to-black border-2 border-green-900/30 rounded-2xl p-8 text-center hover:border-green-600 transition-all group"
              >
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-3">Téléphone</h3>
                <p className="text-green-500 group-hover:text-green-400 font-mono text-sm mb-2">
                  +33 6 12 34 56 78
                </p>
                <p className="text-xs text-gray-400">Lun-Ven 9h-18h</p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/33612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-emerald-950/20 to-black border-2 border-emerald-900/30 rounded-2xl p-8 text-center hover:border-emerald-600 transition-all group"
              >
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-3">WhatsApp</h3>
                <p className="text-emerald-500 group-hover:text-emerald-400 font-mono text-sm mb-2">
                  +33 6 12 34 56 78
                </p>
                <p className="text-xs text-gray-400">Réponse rapide</p>
              </a>
            </div>

            {/* Réseaux sociaux */}
            <div className="mt-12 text-center">
              <p className="text-gray-400 mb-4">Suivez-moi sur les réseaux</p>
              <div className="flex gap-4 justify-center">
                <a
                  href="https://instagram.com/guillaumefarre.art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-pink-600 to-orange-600 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-all"
                  title="Instagram"
                >
                  📷
                </a>
                <a
                  href="https://linkedin.com/in/guillaumefarre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-all"
                  title="LinkedIn"
                >
                  💼
                </a>
                <a
                  href="https://youtube.com/@guillaumefarre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-all"
                  title="YouTube"
                >
                  📹
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-blue-600 transition-all"
              >
                <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                  <span className="text-blue-500">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-gray-400 pl-7">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <a
              href="mailto:contact@guillaumefarre.com"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
            >
              Contactez-moi directement
            </a>
          </div>
        </div>
      </section>

      {/* Atelier - Localisation */}
      <section className="bg-gradient-to-b from-black to-gray-950 border-t border-gray-800 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Visitez l'atelier
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  L'atelier est situé à <strong>Paris, 18ème arrondissement</strong>.
                  Visites possibles sur rendez-vous pour découvrir le processus créatif,
                  voir les œuvres en cours, et rencontrer Guillaume.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">📍</span>
                    <div>
                      <div className="font-bold">Adresse</div>
                      <div className="text-gray-400">75018 Paris, France</div>
                      <div className="text-sm text-gray-500">(Adresse exacte communiquée sur RDV)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">🕐</span>
                    <div>
                      <div className="font-bold">Horaires de visite</div>
                      <div className="text-gray-400">Vendredi 14h-18h (sur RDV)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">🚇</span>
                    <div>
                      <div className="font-bold">Accès</div>
                      <div className="text-gray-400">Métro Marcadet-Poissonniers (L12)</div>
                    </div>
                  </div>
                </div>

                <a
                  href="mailto:contact@guillaumefarre.com?subject=Demande de visite d'atelier"
                  className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
                >
                  Réserver une visite
                </a>
              </div>

              <div className="bg-gray-800 rounded-2xl h-80 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p>Carte interactive bientôt disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-purple-950/30 to-black border-2 border-purple-600/30 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à démarrer votre collection ?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Découvrez les œuvres disponibles ou rejoignez le club des collectionneurs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/boutique"
                className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-all transform hover:scale-105"
              >
                🛒 Voir la boutique
              </Link>
              <Link
                href="/collectionneurs"
                className="px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xl transition-all transform hover:scale-105"
              >
                💎 Rejoindre le club
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
