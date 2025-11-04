import Navigation from "@/components/navigation/Navigation";

export default async function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Éditeur du site</h2>
            <p>
              <strong>Guillaume Farré</strong><br />
              Artiste sculpteur - Concept car art<br />
              Email : contact@guillaumefarre.com<br />
              Site web : guillaumefarre.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Directeur de publication</h2>
            <p>
              Guillaume Farré
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              [Nom de l'hébergeur]<br />
              [Adresse]<br />
              [Pays]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
            </p>
            <p>
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur un support électronique ou autre quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de publication.
            </p>
            <p>
              Les photographies, textes, slogans, dessins, images, séquences animées sonores ou non ainsi que toutes les œuvres intégrées dans le site sont la propriété de Guillaume Farré ou de tiers ayant autorisé Guillaume Farré à les utiliser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Crédits photographiques</h2>
            <p>
              Toutes les photographies d'œuvres présentes sur ce site sont la propriété exclusive de Guillaume Farré.
              Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p>
              Le site peut être amené à vous demander l'acceptation des cookies pour des besoins de statistiques et d'affichage.
              Un cookie est une information déposée sur votre disque dur par le serveur du site que vous visitez.
            </p>
            <p>
              Il contient plusieurs données qui sont stockées sur votre ordinateur dans un simple fichier texte auquel un serveur accède pour lire et enregistrer des informations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Protection des données personnelles</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
            </p>
            <p>
              Pour exercer ce droit, vous pouvez nous contacter à l'adresse : contact@guillaumefarre.com
            </p>
            <p>
              Pour plus d'informations, consultez notre <a href="/politique-de-confidentialite" className="text-blue-600 hover:underline">politique de confidentialité</a>.
            </p>
          </section>

          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
