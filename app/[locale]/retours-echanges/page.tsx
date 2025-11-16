import Navigation from '@/components/navigation/Navigation';
import { Link } from '@/i18n/routing';

export default function RetoursPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-6 lg:px-8 py-20 md:py-28 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-12">
          Retours & Échanges
        </h1>

        <div className="prose prose-lg max-w-none">
          {/* Délai de rétractation */}
          <section className="mb-12">
            <h2 className="text-3xl font-light mb-6">Délai de rétractation : 14 jours</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Conformément à la loi française, vous disposez de <strong>14 jours calendaires</strong> à compter de la réception de votre œuvre pour exercer votre droit de rétractation, <strong>sans avoir à justifier de motif</strong>.
            </p>
          </section>

          {/* Conditions */}
          <section className="mb-12">
            <h2 className="text-3xl font-light mb-6">Conditions</h2>
            <div className="bg-card border border-border rounded-xl p-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-muted-foreground">
                  L'œuvre doit être <strong className="text-foreground">retournée dans son emballage d'origine</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-muted-foreground">
                  En <strong className="text-foreground">parfait état</strong> (non accrochée, non encadrée si vous avez choisi "sans cadre")
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <p className="text-muted-foreground">
                  Avec <strong className="text-foreground">tous les accessoires</strong> (certificat d'authenticité, facture)
                </p>
              </div>
            </div>
          </section>

          {/* Procédure */}
          <section className="mb-12">
            <h2 className="text-3xl font-light mb-6">Procédure de retour</h2>
            <div className="space-y-6">
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Contactez-nous</h3>
                    <p className="text-muted-foreground">
                      Envoyez un email à{' '}
                      <a href="mailto:contact@guillaumefarre.com" className="text-primary hover:underline">
                        contact@guillaumefarre.com
                      </a>{' '}
                      avec votre numéro de commande et le motif de retour.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Renvoi de l'œuvre</h3>
                    <p className="text-muted-foreground">
                      Vous disposez de <strong>14 jours</strong> pour renvoyer l'œuvre à l'adresse que nous vous communiquerons. Les frais de retour sont à votre charge.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Remboursement</h3>
                    <p className="text-muted-foreground">
                      Sous <strong>14 jours</strong> après réception du retour en bon état, nous vous rembourserons sur votre moyen de paiement initial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Exceptions */}
          <section className="mb-12">
            <h2 className="text-3xl font-light mb-6">Exceptions</h2>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <p className="text-muted-foreground">
                  Œuvres <strong className="text-foreground">personnalisées ou sur-mesure</strong> (formats XXL/monumentaux sur commande)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <p className="text-muted-foreground">
                  Certificats d'authenticité signés pour <strong className="text-foreground">éditions limitées</strong> (sauf défaut qualité avéré)
                </p>
              </div>
            </div>
          </section>

          {/* Garantie Qualité */}
          <section className="mb-12">
            <h2 className="text-3xl font-light mb-6">Garantie Qualité</h2>
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Si votre tirage présente un <strong className="text-foreground">défaut de qualité</strong> (couleurs incorrectes, dommage durant transport, défaut d'impression), nous le remplaçons <strong className="text-foreground">gratuitement</strong> ou vous remboursons <strong className="text-foreground">intégralement</strong>, frais de retour inclus.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Tous nos tirages sont imprimés sur papier Fine Art Giclee 12 couleurs, 200 gsm archival, certifié qualité musée. Nous contrôlons chaque tirage avant expédition.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-card border border-border rounded-xl p-8 text-center">
            <h3 className="text-2xl font-light mb-6">Une question sur votre commande ?</h3>
            <p className="text-muted-foreground mb-8">
              Notre équipe est à votre disposition pour vous accompagner
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@guillaumefarre.com"
                className="inline-block px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all"
              >
                📧 Nous contacter
              </a>
              <Link
                href="/faq"
                className="inline-block px-12 py-5 border-2 border-border hover:border-primary text-foreground font-light tracking-wide rounded-lg text-lg transition-all"
              >
                📋 Voir la FAQ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// Lalou
