"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";

/**
 * Contenu de la page Contact avec textes éditables
 *
 * @author Lalou
 * @date 2025-12-31
 */
export default function ContactContent() {
  const contactReasons = [
    {
      titleKey: "contact.reasons.acquire.title",
      title: "Acquérir une œuvre",
      descKey: "contact.reasons.acquire.desc",
      desc: "Achat, réservation, paiement fractionné",
      ctaKey: "contact.reasons.acquire.cta",
      cta: "Demander un rendez-vous",
    },
    {
      titleKey: "contact.reasons.visit.title",
      title: "Visiter l'atelier",
      descKey: "contact.reasons.visit.desc",
      desc: "Découvrir le processus créatif",
      ctaKey: "contact.reasons.visit.cta",
      cta: "Réserver une visite",
    },
    {
      titleKey: "contact.reasons.press.title",
      title: "Demande presse",
      descKey: "contact.reasons.press.desc",
      desc: "Interview, visuels HD, informations",
      ctaKey: "contact.reasons.press.cta",
      cta: "Accès presse",
    },
    {
      titleKey: "contact.reasons.collab.title",
      title: "Collaboration / Galerie",
      descKey: "contact.reasons.collab.desc",
      desc: "Partenariats, expositions, projets",
      ctaKey: "contact.reasons.collab.cta",
      cta: "Présenter mon projet",
    },
    {
      titleKey: "contact.reasons.other.title",
      title: "Autre demande",
      descKey: "contact.reasons.other.desc",
      desc: "Question générale, information",
      ctaKey: "contact.reasons.other.cta",
      cta: "Envoyer un message",
    }
  ];

  const faqs = [
    {
      qKey: "contact.faq.delay.q",
      q: "Quel est le délai de réponse ?",
      aKey: "contact.faq.delay.a",
      a: "Moins de 24h pour toute demande. Réponse prioritaire pour les demandes d'acquisition et les collectionneurs du club."
    },
    {
      qKey: "contact.faq.visit.q",
      q: "Puis-je visiter l'atelier ?",
      aKey: "contact.faq.visit.a",
      a: "Oui ! Les visites sont possibles sur rendez-vous, généralement les vendredis après-midi. Places limitées à 4 personnes par visite."
    },
    {
      qKey: "contact.faq.buy.q",
      q: "Comment acheter une œuvre ?",
      aKey: "contact.faq.buy.a",
      a: "Directement sur la boutique en ligne, ou contactez-moi pour un accompagnement personnalisé. Paiement en 3x disponible dès 500€."
    }
  ];

  return (
    <>
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
            <EditableText textKey="contact.hero.tag" as="span">
              Contact
            </EditableText>
          </div>
          <EditableText
            textKey="contact.hero.title"
            as="h1"
            className="text-6xl md:text-8xl font-light tracking-wide mb-10 text-foreground"
          >
            Parlons de votre projet
          </EditableText>
          <EditableText
            textKey="contact.hero.subtitle"
            as="p"
            className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl mx-auto mb-16 leading-relaxed"
            multiline
          >
            Acquisition, visite d'atelier, collaboration. Je réponds personnellement à chaque message sous 24h.
          </EditableText>

          {/* Trust signals élégants */}
          <div className="flex flex-wrap gap-8 md:gap-12 justify-center text-sm md:text-base text-muted-foreground font-light">
            <div className="flex items-center gap-3">
              <span className="text-primary">—</span>
              <EditableText textKey="contact.trust.response" as="span">
                Réponse sous 24h garantie
              </EditableText>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">—</span>
              <EditableText textKey="contact.trust.direct" as="span">
                Contact direct avec l'artiste
              </EditableText>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">—</span>
              <EditableText textKey="contact.trust.privacy" as="span">
                Confidentialité assurée
              </EditableText>
            </div>
          </div>
        </div>
      </div>

      {/* Motifs de contact - Cartes élégantes */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <EditableText
              textKey="contact.reasons.title"
              as="h2"
              className="text-5xl md:text-6xl font-light tracking-wide mb-6 text-foreground"
            >
              Je souhaite...
            </EditableText>
            <EditableText
              textKey="contact.reasons.subtitle"
              as="p"
              className="text-xl font-light text-muted-foreground leading-relaxed"
            >
              Choisissez le motif de contact pour une réponse optimale
            </EditableText>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {contactReasons.map((reason, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group"
              >
                <div className="p-10">
                  <EditableText
                    textKey={reason.titleKey}
                    as="h3"
                    className="text-3xl font-light tracking-wide mb-8 text-foreground"
                  >
                    {reason.title}
                  </EditableText>

                  <EditableText
                    textKey={reason.descKey}
                    as="p"
                    className="text-base text-muted-foreground font-light mb-10 leading-relaxed"
                  >
                    {reason.desc}
                  </EditableText>

                  <button className="w-full px-6 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-light tracking-wide rounded transition-all">
                    <EditableText textKey={reason.ctaKey} as="span">
                      {reason.cta}
                    </EditableText>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Méthodes de contact directes */}
      <section className="bg-muted/20 border-y border-border py-28 md:py-36">
        <div className="container px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <EditableText
                textKey="contact.direct.title"
                as="h2"
                className="text-5xl md:text-6xl font-light tracking-wide mb-6"
              >
                Ou contactez-moi directement
              </EditableText>
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

              {/* Instagram */}
              <a
                href="https://instagram.com/guillaumefarre.art"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border rounded-lg p-12 text-center hover:border-primary/50 transition-all group"
              >
                <div className="text-6xl font-light mb-6 text-primary">IG</div>
                <h3 className="text-2xl font-light tracking-wide mb-4">Instagram</h3>
                <p className="text-primary group-hover:text-primary/80 font-light text-base mb-3 tracking-wide">
                  @guillaumefarre.art
                </p>
                <p className="text-sm text-muted-foreground font-light">Messages directs</p>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/guillaumefarre"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border rounded-lg p-12 text-center hover:border-primary/50 transition-all group"
              >
                <div className="text-6xl font-light mb-6 text-primary">LI</div>
                <h3 className="text-2xl font-light tracking-wide mb-4">LinkedIn</h3>
                <p className="text-primary group-hover:text-primary/80 font-light text-base mb-3 tracking-wide">
                  Guillaume Farré
                </p>
                <p className="text-sm text-muted-foreground font-light">Réseau professionnel</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <EditableText
              textKey="contact.faq.title"
              as="h2"
              className="text-5xl md:text-6xl font-light tracking-wide mb-6"
            >
              Questions fréquentes
            </EditableText>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-10 hover:border-primary/50 transition-all"
              >
                <h3 className="text-xl md:text-2xl font-light mb-6 tracking-wide flex items-start gap-4">
                  <span className="text-primary">—</span>
                  <EditableText textKey={faq.qKey} as="span">
                    {faq.q}
                  </EditableText>
                </h3>
                <EditableText
                  textKey={faq.aKey}
                  as="p"
                  className="text-muted-foreground font-light leading-relaxed text-base md:text-lg pl-8"
                  multiline
                >
                  {faq.a}
                </EditableText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier - Localisation */}
      <section className="bg-muted/20 border-t border-border py-28 md:py-36">
        <div className="container px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
              <div>
                <EditableText
                  textKey="contact.atelier.title"
                  as="h2"
                  className="text-5xl md:text-6xl font-light tracking-wide mb-10"
                >
                  Visitez l'atelier
                </EditableText>
                <EditableText
                  textKey="contact.atelier.desc"
                  as="p"
                  className="text-xl font-light text-muted-foreground mb-12 leading-relaxed"
                  multiline
                >
                  L'atelier est situé à Toulouse. Visites possibles sur rendez-vous pour découvrir le processus créatif, voir les œuvres en cours, et rencontrer Guillaume.
                </EditableText>

                <div className="space-y-6 mb-12">
                  <div className="flex items-start gap-4">
                    <span className="text-primary text-xl mt-1">—</span>
                    <div>
                      <div className="font-light tracking-wide text-lg mb-2">Localisation</div>
                      <div className="text-muted-foreground font-light">Toulouse, France</div>
                      <div className="text-sm text-muted-foreground font-light">(Adresse exacte communiquée sur RDV)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-primary text-xl mt-1">—</span>
                    <div>
                      <div className="font-light tracking-wide text-lg mb-2">Horaires de visite</div>
                      <div className="text-muted-foreground font-light">Sur rendez-vous uniquement</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <span className="text-primary text-xl mt-1">—</span>
                    <div>
                      <div className="font-light tracking-wide text-lg mb-2">Contact</div>
                      <div className="text-muted-foreground font-light">contact@guillaumefarre.com</div>
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

      {/* CTA final */}
      <section className="container px-6 lg:px-8 py-28 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-16 md:p-20 text-center">
            <EditableText
              textKey="contact.cta.title"
              as="h2"
              className="text-4xl md:text-5xl font-light tracking-wide mb-8"
            >
              Prêt à démarrer votre collection ?
            </EditableText>
            <EditableText
              textKey="contact.cta.subtitle"
              as="p"
              className="text-2xl font-light text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
              multiline
            >
              Découvrez les œuvres disponibles ou rejoignez le club des collectionneurs
            </EditableText>
            <div className="flex justify-center">
              <Link
                href="/boutique"
                className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded text-xl transition-all"
              >
                Voir la boutique
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
