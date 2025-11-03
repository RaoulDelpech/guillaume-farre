import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const contactReasons = [
    {
      title: "Acquérir une œuvre",
      description: "Achat, réservation, paiement fractionné",
      cta: "Demander un rendez-vous",
    },
    {
      title: "Réserver une performance",
      description: "Événement privé ou public",
      cta: "Voir les disponibilités",
    },
    {
      title: "Rejoindre le club",
      description: "Devenir collectionneur privilégié",
      cta: "Candidater au club",
    },
    {
      title: "Demande presse",
      description: "Interview, visuels HD, informations",
      cta: "Accès presse",
    },
    {
      title: "Collaboration / Galerie",
      description: "Partenariats, expositions, projets",
      cta: "Présenter mon projet",
    },
    {
      title: "Autre demande",
      description: "Question générale, information",
      cta: "Envoyer un message",
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
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero élégant */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("/photos/atelier/ferrari-traces.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 text-center px-6 lg:px-8 max-w-5xl py-28">
          <div className="text-primary text-xs font-light mb-8 tracking-[0.3em] uppercase">
            Contact
          </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-10 text-foreground">
            Parlons de votre projet
          </h1>
          <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl mx-auto mb-16 leading-relaxed">
            Acquisition, performance privée, collaboration. Je réponds personnellement
            à chaque message sous 24h.
          </p>

          {/* Trust signals élégants */}
          <div className="flex flex-wrap gap-8 md:gap-12 justify-center text-sm md:text-base text-muted-foreground font-light">
            <div className="flex items-center gap-3">
              <span className="text-primary">—</span>
              <span>Réponse sous 24h garantie</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">—</span>
              <span>Contact direct avec l'artiste</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">—</span>
              <span>Confidentialité assurée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Motifs de contact - Cartes élégantes */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-foreground">
              Je souhaite...
            </h2>
            <p className="text-xl font-light text-muted-foreground leading-relaxed">
              Choisissez le motif de contact pour une réponse optimale
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {contactReasons.map((reason, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group"
              >
                <div className="p-10">
                  <h3 className="text-3xl font-light tracking-wide mb-8 text-foreground">{reason.title}</h3>

                  <p className="text-base text-muted-foreground font-light mb-10 leading-relaxed">
                    {reason.description}
                  </p>

                  <button className="w-full px-6 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded transition-all">
                    {reason.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Méthodes de contact directes - Sophistiquées */}
      <section className="bg-muted/20 border-y border-border py-28 md:py-36">
        <div className="container px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-6">
                Ou contactez-moi directement
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-16">
              {/* Email */}
              <a
                href="mailto:contact@guillaumefarre.com"
                className="bg-card border border-border rounded-lg p-12 text-center hover:border-primary/50 transition-all group"
              >
                <div className="text-6xl font-light mb-6 text-primary">@</div>
                <h3 className="text-2xl font-light tracking-wide mb-4">Email</h3>
                <p className="text-primary group-hover:text-primary/80 font-light text-base mb-3 tracking-wide">
                  contact@guillaumefarre.com
                </p>
                <p className="text-sm text-muted-foreground font-light">Réponse sous 24h</p>
              </a>

              {/* Téléphone */}
              <a
                href="tel:+33612345678"
                className="bg-card border border-border rounded-lg p-12 text-center hover:border-primary/50 transition-all group"
              >
                <div className="text-6xl font-light mb-6 text-primary">☎</div>
                <h3 className="text-2xl font-light tracking-wide mb-4">Téléphone</h3>
                <p className="text-primary group-hover:text-primary/80 font-light text-base mb-3 tracking-wide">
                  +33 6 12 34 56 78
                </p>
                <p className="text-sm text-muted-foreground font-light">Lun-Ven 9h-18h</p>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/33612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border rounded-lg p-12 text-center hover:border-primary/50 transition-all group"
              >
                <div className="text-6xl font-light mb-6 text-primary">✉</div>
                <h3 className="text-2xl font-light tracking-wide mb-4">WhatsApp</h3>
                <p className="text-primary group-hover:text-primary/80 font-light text-base mb-3 tracking-wide">
                  +33 6 12 34 56 78
                </p>
                <p className="text-sm text-muted-foreground font-light">Réponse rapide</p>
              </a>
            </div>

            {/* Réseaux sociaux - Minimalistes */}
            <div className="mt-20 text-center">
              <p className="text-muted-foreground font-light mb-8 text-lg">Suivez-moi sur les réseaux</p>
              <div className="flex gap-6 justify-center">
                <a
                  href="https://instagram.com/guillaumefarre.art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 border border-border hover:border-primary rounded-full flex items-center justify-center text-foreground hover:text-primary transition-all font-light text-xl"
                  title="Instagram"
                >
                  IG
                </a>
                <a
                  href="https://linkedin.com/in/guillaumefarre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 border border-border hover:border-primary rounded-full flex items-center justify-center text-foreground hover:text-primary transition-all font-light text-xl"
                  title="LinkedIn"
                >
                  LI
                </a>
                <a
                  href="https://youtube.com/@guillaumefarre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 border border-border hover:border-primary rounded-full flex items-center justify-center text-foreground hover:text-primary transition-all font-light text-xl"
                  title="YouTube"
                >
                  YT
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Élégantes */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-6">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-10 hover:border-primary/50 transition-all"
              >
                <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide flex items-start gap-4">
                  <span className="text-primary">—</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed text-base md:text-lg pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <p className="text-muted-foreground font-light mb-8 text-lg">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <a
              href="mailto:contact@guillaumefarre.com"
              className="inline-block px-12 py-5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded text-lg transition-all"
            >
              Contactez-moi directement
            </a>
          </div>
        </div>
      </section>

      {/* Atelier - Localisation épurée */}
      <section className="bg-muted/20 border-t border-border py-28 md:py-36">
        <div className="container px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
              <div>
                <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-10">
                  Visitez l'atelier
                </h2>
                <p className="text-xl font-light text-muted-foreground mb-12 leading-relaxed">
                  L'atelier est situé à Paris, 18ème arrondissement.
                  Visites possibles sur rendez-vous pour découvrir le processus créatif,
                  voir les œuvres en cours, et rencontrer Guillaume.
                </p>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <span className="text-primary text-xl mt-1">—</span>
                    <div>
                      <div className="font-light tracking-wide text-lg mb-2">Adresse</div>
                      <div className="text-muted-foreground font-light">75018 Paris, France</div>
                      <div className="text-sm text-muted-foreground font-light">(Adresse exacte communiquée sur RDV)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-primary text-xl mt-1">—</span>
                    <div>
                      <div className="font-light tracking-wide text-lg mb-2">Horaires de visite</div>
                      <div className="text-muted-foreground font-light">Vendredi 14h-18h (sur RDV)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-primary text-xl mt-1">—</span>
                    <div>
                      <div className="font-light tracking-wide text-lg mb-2">Accès</div>
                      <div className="text-muted-foreground font-light">Métro Marcadet-Poissonniers (L12)</div>
                    </div>
                  </div>
                </div>

                <a
                  href="mailto:contact@guillaumefarre.com?subject=Demande de visite d'atelier"
                  className="inline-block px-12 py-5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded text-lg transition-all"
                >
                  Réserver une visite
                </a>
              </div>

              <div className="bg-muted border border-border rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground font-light">
                  <div className="text-6xl mb-6 text-primary/20">◉</div>
                  <p className="text-lg">Carte interactive bientôt disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final - Sophistiqué */}
      <section className="container px-6 lg:px-8 py-28 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-16 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8">
              Prêt à démarrer votre collection ?
            </h2>
            <p className="text-2xl font-light text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Découvrez les œuvres disponibles ou rejoignez le club des collectionneurs
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/boutique"
                className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded text-xl transition-all"
              >
                Voir la boutique
              </Link>
              <Link
                href="/collectionneurs"
                className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded text-xl transition-all"
              >
                Rejoindre le club
              </Link>
            </div>

            <div className="mt-12 flex flex-col md:flex-row gap-8 justify-center text-sm text-muted-foreground font-light">
              <div>Spectacle unique</div>
              <div className="hidden md:block">·</div>
              <div>Rencontre avec l'artiste</div>
              <div className="hidden md:block">·</div>
              <div>Photos souvenirs</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
