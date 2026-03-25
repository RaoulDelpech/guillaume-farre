import Navigation from "@/components/navigation/Navigation";
import { getTranslations } from "next-intl/server";

export default async function CGVPage() {
  const t = await getTranslations("cgv");

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
              Artiste - Action painting automobile<br />
              Email : contact@guillaumefarre.com<br />
              Atelier : Toulouse, France
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objet</h2>
            <p>
              Les présentes conditions générales de vente (CGV) régissent les ventes d&apos;œuvres d&apos;art
              (sculptures, photographies, éditions limitées) réalisées par Guillaume Farré via le site
              guillaumefarre.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Prix</h2>
            <p>
              Les prix sont indiqués en euros, toutes taxes comprises (TTC). Les frais de livraison sont
              calculés lors du passage de la commande et ajoutés au prix total.
            </p>
            <p>
              Guillaume Farré se réserve le droit de modifier ses prix à tout moment, mais les œuvres
              seront facturées sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Commande</h2>
            <p>
              Les commandes peuvent être passées directement sur le site ou par contact email.
              Toute commande vaut acceptation des présentes CGV.
            </p>
            <p>
              Une confirmation de commande sera envoyée par email avec les détails de votre achat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Paiement</h2>
            <p>
              Le paiement s&apos;effectue par carte bancaire via notre plateforme de paiement sécurisé
              Stripe. Les données bancaires ne sont jamais stockées sur nos serveurs.
            </p>
            <p>
              Moyens de paiement acceptés :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Carte bancaire (Visa, Mastercard, American Express)</li>
              <li>Virement bancaire (pour les commandes importantes, nous contacter)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Livraison</h2>
            <p>
              Les œuvres sont expédiées avec soin, emballées professionnellement pour garantir leur
              intégrité durant le transport.
            </p>
            <p>
              <strong>Délais de livraison :</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>France : 5-7 jours ouvrés</li>
              <li>Europe : 7-14 jours ouvrés</li>
              <li>International : 14-30 jours ouvrés</li>
            </ul>
            <p>
              Les délais sont donnés à titre indicatif et ne constituent pas un engagement contractuel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Droit de rétractation</h2>
            <p>
              Conformément à la loi, vous disposez d&apos;un délai de 14 jours à compter de la réception
              de l&apos;œuvre pour exercer votre droit de rétractation.
            </p>
            <p>
              Pour exercer ce droit, contactez-nous à : contact@guillaumefarre.com
            </p>
            <p>
              L&apos;œuvre doit être retournée dans son emballage d&apos;origine, en parfait état.
              Les frais de retour sont à la charge de l&apos;acheteur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Garanties</h2>
            <p>
              Toutes les œuvres sont garanties authentiques et accompagnées d&apos;un certificat
              d&apos;authenticité signé par l&apos;artiste.
            </p>
            <p>
              Pour les éditions limitées, le numéro de l&apos;édition est précisé sur le certificat.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Propriété intellectuelle</h2>
            <p>
              L&apos;achat d&apos;une œuvre confère à l&apos;acquéreur la propriété physique de l&apos;objet,
              mais ne transfère aucun droit de reproduction ou d&apos;exploitation.
            </p>
            <p>
              Tous les droits de propriété intellectuelle restent la propriété exclusive de Guillaume Farré.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Protection des données</h2>
            <p>
              Les données personnelles collectées sont utilisées uniquement pour traiter votre commande.
              Consultez notre <a href="/politique-confidentialite" className="text-blue-600 hover:underline">
              politique de confidentialité</a> pour plus d&apos;informations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Litiges</h2>
            <p>
              En cas de litige, une solution amiable sera recherchée en priorité.
              À défaut, les tribunaux français seront compétents.
            </p>
          </section>

          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Dernière mise à jour :</strong> 2 novembre 2025
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
