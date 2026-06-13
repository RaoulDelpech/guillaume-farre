import Navigation from "@/components/navigation/Navigation";

export default async function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl font-bold mb-8">Politique de Confidentialité</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p>
              La protection de vos données personnelles est une priorité pour Guillaume Farré.
              Cette politique de confidentialité explique quelles informations nous collectons,
              comment nous les utilisons et quels sont vos droits.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">2. Responsable du traitement</h2>
            <p>
              <strong>Guillaume Farré</strong><br />
              Artiste - Action painting automobile<br />
              Adresse : 31000 Toulouse, France<br />
              Email : contact@guillaumefarre.com
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">3. Données collectées</h2>
            <p>
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Données d'identité :</strong> nom, prénom</li>
              <li><strong>Données de contact :</strong> adresse email, numéro de téléphone, adresse postale</li>
              <li><strong>Données de commande :</strong> historique d'achats, préférences</li>
              <li><strong>Données de paiement :</strong> traitées de manière sécurisée par Stripe (nous ne stockons jamais vos données bancaires)</li>
              <li><strong>Données de connexion :</strong> adresse IP, type de navigateur, pages visitées</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">4. Finalités du traitement</h2>
            <p>
              Vos données sont collectées pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Traiter et livrer vos commandes</li>
              <li>Gérer votre compte client</li>
              <li>Vous envoyer des informations sur vos commandes</li>
              <li>Améliorer nos services et notre site web</li>
              <li>Mesurer l&apos;audience et analyser la navigation (statistiques de fréquentation, cartes de chaleur des clics), sous réserve de votre consentement</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">5. Base légale du traitement</h2>
            <p>
              Le traitement de vos données repose sur :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>L'exécution d'un contrat :</strong> pour traiter vos commandes</li>
              <li><strong>Notre intérêt légitime :</strong> pour améliorer nos services</li>
              <li><strong>Nos obligations légales :</strong> comptabilité, facturation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">6. Destinataires des données</h2>
            <p>
              Vos données peuvent être transmises à :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe :</strong> pour le traitement sécurisé des paiements</li>
              <li><strong>Transporteurs :</strong> pour la livraison de vos commandes</li>
              <li><strong>Google (Google Analytics) :</strong> mesure d&apos;audience, uniquement si vous avez accepté les cookies de mesure d&apos;audience</li>
              <li><strong>Microsoft (Clarity) :</strong> analyse de la navigation et cartes de chaleur des clics, uniquement si vous avez accepté les cookies de mesure d&apos;audience</li>
            </ul>
            <p>
              Nous ne vendons jamais vos données à des tiers.
            </p>
            <p>
              <strong>Transferts hors UE :</strong> Stripe Inc., Google LLC et Microsoft Corporation sont basés aux États-Unis. Les transferts de données sont encadrés par les clauses contractuelles types de la Commission européenne (article 46 du RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">7. Durée de conservation</h2>
            <p>
              Vos données sont conservées pendant :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Données de commande :</strong> 10 ans (obligations comptables)</li>
              <li><strong>Données de compte client :</strong> 3 ans après la dernière activité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">8. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à : contact@guillaumefarre.com
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">9. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>L'accès non autorisé</li>
              <li>La perte accidentelle</li>
              <li>La destruction ou les dommages</li>
            </ul>
            <p>
              Les paiements sont sécurisés par Stripe, certifié PCI DSS niveau 1 (norme de sécurité la plus stricte).
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">10. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation.
              Vous pouvez configurer votre navigateur pour refuser les cookies.
            </p>
            <p>
              Types de cookies utilisés :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies nécessaires :</strong> Cookie d&apos;authentification administration (<code>gf_auth</code>, durée 30 jours)</li>
              <li><strong>Cookies de paiement :</strong> Cookies Stripe déposés lors du checkout pour sécuriser le processus de paiement</li>
              <li><strong>Cookies de mesure d&apos;audience (soumis à votre consentement) :</strong> Google Analytics (<code>_ga</code>, <code>_ga_*</code>) pour les statistiques de fréquentation et Microsoft Clarity (<code>_clck</code>, <code>_clsk</code>) pour l&apos;analyse de la navigation et les cartes de chaleur des clics. Ces cookies ne sont déposés qu&apos;après votre acceptation et ne sont jamais chargés si vous refusez.</li>
            </ul>
            <p>
              Vous pouvez à tout moment retirer votre consentement aux cookies de mesure d&apos;audience.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">11. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
              Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">12. Contact et réclamation</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou l'exercice de vos droits :
            </p>
            <p>
              Email : contact@guillaumefarre.com
            </p>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :
            </p>
            <p>
              Commission Nationale de l'Informatique et des Libertés<br />
              3 Place de Fontenoy - TSA 80715<br />
              75334 PARIS CEDEX 07<br />
              Téléphone : 01 53 73 22 22<br />
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
            </p>
          </section>

          <section className="border-t border-border pt-6 mt-8">
            <p className="text-sm text-muted-foreground">
              <strong>Dernière mise à jour :</strong> 15 avril 2026
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
