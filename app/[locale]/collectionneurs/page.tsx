import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default function CollectionneursPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero exclusif */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-black to-black"></div>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/photos/empreintes/empreinte-01.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-block px-4 py-2 bg-purple-600 rounded-full text-sm font-bold mb-6">
            CERCLE PRIVÉ
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Club des<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-500">
              Collectionneurs
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Un cercle exclusif pour les passionnés d'art automobile.
            Avantages VIP, accès prioritaire et expériences uniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold rounded-lg text-xl transition-all transform hover:scale-105 shadow-2xl"
            >
              💎 Rejoindre le club
            </Link>
            <div className="px-8 py-5 bg-white/5 backdrop-blur-md border-2 border-purple-500/30 rounded-lg text-center">
              <div className="text-sm text-gray-400">Déjà membre ?</div>
              <div className="text-purple-400 font-bold">Se connecter →</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pourquoi rejoindre */}
      <section className="container px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pourquoi rejoindre le cercle ?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Bien plus qu'un simple achat, c'est une entrée dans un monde exclusif
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-950/30 to-black border-2 border-purple-900/30 rounded-2xl p-8">
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold mb-4">Accès prioritaire</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">✓</span>
                <span>Early access aux nouvelles créations (24h avant le public)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">✓</span>
                <span>Réservation prioritaire pour les performances live</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">✓</span>
                <span>First call sur les éditions ultra-limitées</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-950/30 to-black border-2 border-red-900/30 rounded-2xl p-8">
            <div className="text-6xl mb-6">💼</div>
            <h3 className="text-2xl font-bold mb-4">Avantages exclusifs</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✓</span>
                <span>Tarifs préférentiels sur les nouvelles acquisitions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✓</span>
                <span>Service de conseil personnalisé pour votre collection</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✓</span>
                <span>Certificat d'authenticité numérique (blockchain)</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-950/30 to-black border-2 border-yellow-900/30 rounded-2xl p-8">
            <div className="text-6xl mb-6">🌟</div>
            <h3 className="text-2xl font-bold mb-4">Expériences VIP</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Invitations aux vernissages privés</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Rencontres exclusives avec Guillaume Farré</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">✓</span>
                <span>Visites de l'atelier sur rendez-vous</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Niveaux du club */}
      <section className="bg-gradient-to-b from-black via-purple-950/10 to-black py-16 md:py-24 border-y border-purple-900/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Les niveaux du cercle
            </h2>
            <p className="text-xl text-gray-400">
              Évoluez dans le cercle au fil de vos acquisitions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Bronze */}
            <div className="bg-gradient-to-br from-orange-950/20 to-black border-2 border-orange-800/30 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-900/30 to-transparent p-6 border-b border-orange-800/30">
                <div className="text-4xl mb-3">🥉</div>
                <h3 className="text-2xl font-bold mb-2">Bronze</h3>
                <p className="text-gray-400 text-sm">Première acquisition</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-orange-500 mb-4">1 œuvre</div>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>Newsletter mensuelle exclusive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>Accès au catalogue complet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>Certificat d'authenticité premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">✓</span>
                    <span>-5% sur prochaine acquisition</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Silver */}
            <div className="bg-gradient-to-br from-gray-400/20 to-black border-2 border-gray-400/30 rounded-2xl overflow-hidden transform md:scale-105 shadow-2xl">
              <div className="bg-gradient-to-r from-gray-500/30 to-transparent p-6 border-b border-gray-400/30">
                <div className="inline-block px-3 py-1 bg-purple-600 rounded-full text-xs font-bold mb-3">
                  POPULAIRE
                </div>
                <div className="text-4xl mb-3">🥈</div>
                <h3 className="text-2xl font-bold mb-2">Silver</h3>
                <p className="text-gray-400 text-sm">Collectionneur confirmé</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-gray-300 mb-4">3-5 œuvres</div>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">✓</span>
                    <span>Tout Bronze +</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">✓</span>
                    <span>Early access 24h nouvelles œuvres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">✓</span>
                    <span>Invitation performances privées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">✓</span>
                    <span>-10% sur acquisitions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">✓</span>
                    <span>Rencontre annuelle avec l'artiste</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Gold */}
            <div className="bg-gradient-to-br from-yellow-600/20 to-black border-2 border-yellow-600/30 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-600/30 to-transparent p-6 border-b border-yellow-600/30">
                <div className="text-4xl mb-3">🥇</div>
                <h3 className="text-2xl font-bold mb-2">Gold</h3>
                <p className="text-gray-400 text-sm">Cercle d'élite</p>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-yellow-500 mb-4">6+ œuvres</div>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">✓</span>
                    <span>Tout Silver +</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">✓</span>
                    <span>Accès 48h AVANT annonce publique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">✓</span>
                    <span>Œuvres sur-mesure sur demande</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">✓</span>
                    <span>-15% permanent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">✓</span>
                    <span>Ligne directe artiste</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">✓</span>
                    <span>Visite atelier illimitée</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages de membres */}
      <section className="container px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ils font partie du cercle
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-purple-950/20 to-black border border-purple-900/30 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-2xl font-bold">
                AL
              </div>
              <div>
                <div className="font-bold text-lg">Antoine L.</div>
                <div className="text-sm text-gray-400">Membre Gold • 8 œuvres</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              "Le club m'a permis d'accéder à des pièces exceptionnelles avant tout le monde.
              Ma collection a pris 32% de valeur en 18 mois. Les événements privés sont incroyables."
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-500">+32% valeur</span>
              <span className="text-gray-500">•</span>
              <span className="text-purple-500">8 œuvres possédées</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-950/20 to-black border border-purple-900/30 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-400 rounded-full flex items-center justify-center text-2xl font-bold">
                SM
              </div>
              <div>
                <div className="font-bold text-lg">Sophie M.</div>
                <div className="text-sm text-gray-400">Membre Silver • 4 œuvres</div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              "Les rencontres avec Guillaume sont des moments privilégiés. Comprendre sa vision
              donne encore plus de valeur aux œuvres. Le early access est un vrai plus."
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-yellow-500">Rencontres privées</span>
              <span className="text-gray-500">•</span>
              <span className="text-purple-500">Early access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services inclus */}
      <section className="bg-gradient-to-b from-black via-red-950/10 to-black py-16 md:py-24 border-y border-red-900/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Services inclus pour tous
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-black/40 border border-red-900/30 rounded-xl">
              <div className="text-5xl mb-4">📜</div>
              <h3 className="font-bold mb-2">Certificat blockchain</h3>
              <p className="text-sm text-gray-400">Authenticité garantie et traçabilité</p>
            </div>

            <div className="text-center p-6 bg-black/40 border border-red-900/30 rounded-xl">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-bold mb-2">Valorisation</h3>
              <p className="text-sm text-gray-400">Suivi de la valeur de votre collection</p>
            </div>

            <div className="text-center p-6 bg-black/40 border border-red-900/30 rounded-xl">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="font-bold mb-2">Livraison premium</h3>
              <p className="text-sm text-gray-400">Installation et assurance incluses</p>
            </div>

            <div className="text-center p-6 bg-black/40 border border-red-900/30 rounded-xl">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="font-bold mb-2">Buyback garanti</h3>
              <p className="text-sm text-gray-400">Rachat possible à valeur de marché</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-950/30 via-red-950/30 to-black border-2 border-purple-600/30 rounded-3xl p-12 text-center">
            <div className="inline-block px-4 py-2 bg-purple-600 rounded-full text-sm font-bold mb-6">
              REJOIGNEZ-NOUS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à rejoindre<br />
              le cercle exclusif ?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Devenez membre dès votre première acquisition et profitez immédiatement des avantages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/boutique"
                className="px-10 py-5 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold rounded-lg text-xl transition-all transform hover:scale-105 shadow-2xl"
              >
                🏎️ Voir les œuvres disponibles
              </Link>
              <Link
                href="/contact"
                className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-lg text-xl transition-all border-2 border-white/30"
              >
                💬 Poser vos questions
              </Link>
            </div>

            <div className="text-sm text-gray-400">
              47 collectionneurs font déjà partie du cercle
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
