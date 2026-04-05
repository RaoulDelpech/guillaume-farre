import Navigation from "@/components/navigation/Navigation";

export default async function CGVPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl font-bold mb-8">Conditions Générales de Vente</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informations légales</h2>
            <p>
              <strong>Guillaume Farré</strong><br />
              Artiste - Auto-entrepreneur<br />
              SIRET : À compléter<br />
              Adresse : Toulouse, France<br />
              Email : contact@guillaumefarre.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objet</h2>
            <p>
              Les présentes conditions générales de vente (CGV) régissent la vente d&apos;œuvres d&apos;art par Guillaume Farré via le site guillaumefarre.com. Deux types d&apos;œuvres sont proposés :
            </p>
            <p>
              <strong>Photographies</strong> : tirages Fine Art Giclee numérotés et signés, disponibles en éditions limitées de 9 exemplaires (grands formats A1 à 2A0) ou 99 exemplaires (petits formats A4 à A2). Formats disponibles : A4 (250 €), A3 (500 €), A2 (800 €), A1 (1 200 €), A0 et 2A0 (sur devis). Chaque tirage est accompagné d&apos;un certificat d&apos;authenticité précisant le numéro d&apos;édition (ex: 3/9).
            </p>
            <p>
              <strong>Toiles</strong> : pièces uniques créées par friction automobile sur toile vierge, prix de 2 500 € à 20 000 €. Les toiles sont accessibles uniquement sur invitation VIP et nécessitent une réservation préalable. Elles ne sont pas vendues en ligne.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Prix</h2>
            <p>
              Les prix sont indiqués en euros, toutes taxes comprises (TTC). Les frais de port sont en sus et calculés selon la destination.
            </p>
            <p>
              <strong>TVA applicable :</strong> Si le chiffre d&apos;affaires annuel est inférieur à 37 500 €, franchise en base de TVA (article 293B du Code général des impôts). Si le chiffre d&apos;affaires dépasse ce seuil, TVA au taux réduit de 5,5 % applicable aux œuvres d&apos;art originales (article 278-0 bis du CGI).
            </p>
            <p>
              Les prix peuvent être modifiés à tout moment, mais les œuvres seront facturées sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Produits</h2>
            <p>
              <strong>Photographies</strong> : tirages Fine Art Giclee 12 couleurs sur papier archival 200 gsm, numérotés et signés par l&apos;artiste. Éditions limitées strictes : une fois tous les exemplaires vendus, la série est close définitivement. Formats : A4 (21 x 29,7 cm), A3 (29,7 x 42 cm), A2 (42 x 59,4 cm), A1 (59,4 x 84,1 cm), A0 (84,1 x 118,9 cm), 2A0 (118,9 x 168,2 cm).
            </p>
            <p>
              <strong>Toiles</strong> : pièces uniques, totalement irréplicables, créées par peinture industrielle déposée par friction, chaleur et pression lors du passage direct d&apos;une Ferrari sur toile vierge. Formats variables. Prix : de 2 500 € à 20 000 € selon format et technique. Accessibles uniquement sur invitation VIP, sur réservation uniquement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Commande et paiement</h2>
            <p>
              <strong>Photographies</strong> : commande en ligne via le panier sur le site. Paiement sécurisé via Stripe.
            </p>
            <p>
              <strong>Toiles</strong> : réservation via le formulaire de demande VIP. Une facture Stripe personnalisée est envoyée par l&apos;artiste après validation.
            </p>
            <p>
              <strong>Moyens de paiement acceptés :</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Carte bancaire (Visa, Mastercard, American Express)</li>
              <li>Apple Pay et Google Pay</li>
              <li>Virement bancaire SEPA (recommandé pour les commandes supérieures à 1 000 €)</li>
              <li>Acompte de 30 % possible pour les toiles (le solde est à régler par virement sous 7 jours)</li>
            </ul>
            <p>
              Les données bancaires ne sont jamais stockées sur nos serveurs. Elles sont traitées directement par Stripe, plateforme de paiement sécurisée certifiée PCI-DSS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Livraison</h2>
            <p>
              Les œuvres sont emballées professionnellement pour garantir leur intégrité durant le transport. Une assurance transport est incluse pour les toiles.
            </p>
            <p>
              <strong>Délais de livraison indicatifs :</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>France : 5 à 7 jours ouvrés</li>
              <li>Europe : 7 à 14 jours ouvrés</li>
              <li>International : 14 à 30 jours ouvrés</li>
            </ul>
            <p>
              Ces délais sont donnés à titre indicatif et ne constituent pas un engagement contractuel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Droit de rétractation</h2>
            <p>
              Conformément à l&apos;article L221-18 du Code de la consommation, l&apos;acheteur consommateur dispose d&apos;un délai de <strong>14 jours</strong> à compter de la réception de l&apos;œuvre pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
            </p>
            <p>
              <strong>Modalités de rétractation :</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>L&apos;œuvre doit être retournée dans son emballage d&apos;origine, en parfait état</li>
              <li>Les frais de retour sont à la charge de l&apos;acheteur</li>
              <li>Le remboursement intégral intervient sous 14 jours après réception du retour</li>
            </ul>
            <p>
              Pour exercer votre droit de rétractation, vous pouvez utiliser le formulaire type ci-dessous ou nous contacter par email à l&apos;adresse : contact@guillaumefarre.com
            </p>
            <p>
              <strong>Exceptions :</strong> Le droit de rétractation ne s&apos;applique pas si l&apos;œuvre a été créée sur mesure selon les spécifications du client (article L221-28, 3° du Code de la consommation), ni pour les achats effectués par un professionnel dans le cadre de son activité.
            </p>
            <div className="bg-gray-50 p-4 border border-gray-300 mt-4">
              <h3 className="font-bold mb-2">Formulaire type de rétractation</h3>
              <p className="text-sm">
                À l&apos;attention de Guillaume Farré, contact@guillaumefarre.com :<br />
                Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous :<br />
                - Œuvre : [titre]<br />
                - Commandée le : [date]<br />
                - Reçue le : [date]<br />
                - Nom de l&apos;acheteur : [nom]<br />
                - Adresse de l&apos;acheteur : [adresse]<br />
                - Signature de l&apos;acheteur (uniquement en cas de notification papier) :<br />
                - Date :
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propriété intellectuelle</h2>
            <p>
              Conformément à l&apos;article L111-1 du Code de la propriété intellectuelle, l&apos;achat d&apos;une œuvre confère à l&apos;acquéreur la propriété physique de l&apos;objet uniquement. Aucun droit d&apos;auteur n&apos;est transféré.
            </p>
            <p>
              <strong>L&apos;acheteur ne peut pas :</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reproduire l&apos;œuvre à des fins commerciales (affiches, posters, produits dérivés, NFT, etc.)</li>
              <li>Publier l&apos;image de l&apos;œuvre à des fins publicitaires</li>
              <li>Modifier l&apos;œuvre</li>
            </ul>
            <p>
              <strong>L&apos;acheteur peut :</strong> exposer l&apos;œuvre chez lui, la revendre (le droit de suite s&apos;applique sur les reventes futures si un professionnel intervient).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Certificat d&apos;authenticité</h2>
            <p>
              Chaque œuvre (photographie et toile) est accompagnée d&apos;un certificat d&apos;authenticité signé par l&apos;artiste, comportant un numéro unique. Pour les éditions limitées, le numéro d&apos;édition est précisé (exemple : 3/9 pour le 3e exemplaire d&apos;une série de 9).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Protection des données personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), les données personnelles collectées lors de la commande sont utilisées uniquement pour le traitement de celle-ci et la gestion de la relation client.
            </p>
            <p>
              Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à : contact@guillaumefarre.com
            </p>
            <p>
              Consultez notre <a href="/politique-de-confidentialite" className="text-blue-600 hover:underline">politique de confidentialité</a> pour plus d&apos;informations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Médiateur de la consommation</h2>
            <p>
              Conformément aux articles L611-1 et R612-1 du Code de la consommation, il est prévu que pour tout litige n&apos;ayant pu être résolu à l&apos;amiable entre le professionnel et le consommateur, ce dernier a la possibilité de saisir gratuitement le médiateur de la consommation dont relève le professionnel.
            </p>
            <p>
              Le médiateur de la consommation est : <strong>[NOM DU MÉDIATEUR - À COMPLÉTER]</strong><br />
              Site internet : <strong>[URL - À COMPLÉTER]</strong>
            </p>
            <p>
              En cas de litige, le consommateur peut également saisir la plateforme européenne de règlement en ligne des litiges à l&apos;adresse suivante : <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Loi applicable et tribunaux compétents</h2>
            <p>
              Les présentes conditions générales de vente sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut d&apos;accord, les tribunaux de Toulouse seront seuls compétents.
            </p>
          </section>

          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Dernière mise à jour :</strong> 5 avril 2026
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
