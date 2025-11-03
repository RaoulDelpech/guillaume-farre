import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default function OriginePage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero dramatique */}
      <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/50 via-black to-black"></div>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/photos/atelier/ferrari-roues.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="text-red-500 text-sm md:text-base font-bold mb-4 tracking-widest">
            L'ORIGINE
          </div>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
            Tout commence avec<br />
            une petite <span className="text-red-500">Ferrari n°20</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            De la chambre d'enfant aux galeries internationales,
            l'histoire d'un rêve devenu art
          </p>
        </div>
      </div>

      {/* Timeline visuelle */}
      <section className="container px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Étape 1 : L'enfance */}
          <div className="relative mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-4 py-2 bg-red-600 rounded-full text-sm font-bold mb-4">
                  1985 - L'enfance
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  La petite Ferrari n°20
                </h2>
                <div className="prose prose-invert prose-lg max-w-none space-y-4 text-gray-300">
                  <p>
                    Guillaume, 6 ans, possède une petite voiture Ferrari miniature portant le numéro 20.
                    Une simple voiture jouet, mais qui allait tout changer.
                  </p>
                  <p>
                    Au lieu de simplement la faire rouler comme les autres enfants, Guillaume a une idée :
                    <strong className="text-white"> tremper les roues dans la peinture</strong> et laisser des traces sur des feuilles de papier.
                  </p>
                  <blockquote className="border-l-4 border-red-500 pl-6 italic text-xl my-8">
                    « Cette petite Ferrari n°20 n'était pas qu'un jouet. C'était mon premier pinceau,
                    mon premier outil créateur. »
                  </blockquote>
                  <p>
                    Ces gestes d'enfant contenaient déjà toute la philosophie de son art futur :
                    <strong className="text-white"> transformer le mouvement automobile en création artistique</strong>.
                  </p>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent rounded-3xl transform rotate-3"></div>
                  <div className="relative bg-gradient-to-br from-red-950/30 to-black border-2 border-red-900/30 rounded-2xl p-8 md:p-12">
                    <div className="text-9xl text-center mb-4">🏎️</div>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-red-500 mb-2">n°20</div>
                      <div className="text-gray-400">Ferrari miniature</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flèche de progression */}
            <div className="absolute left-1/2 bottom-[-80px] transform -translate-x-1/2 text-red-500 text-6xl animate-bounce">
              ↓
            </div>
          </div>

          {/* Étape 2 : Le rêve grandit */}
          <div className="relative mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent rounded-3xl transform -rotate-3"></div>
                  <div className="relative bg-gradient-to-br from-orange-950/30 to-black border-2 border-orange-900/30 rounded-2xl p-8 md:p-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">👶</div>
                        <div className="text-2xl">→</div>
                        <div className="text-4xl">👨</div>
                      </div>
                      <div className="text-center text-gray-300">
                        <div className="text-3xl font-bold mb-2">Des années plus tard...</div>
                        <div className="text-lg">Le rêve n'a jamais disparu</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="inline-block px-4 py-2 bg-orange-600 rounded-full text-sm font-bold mb-4">
                  2015 - La révélation
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Et si... ?
                </h2>
                <div className="prose prose-invert prose-lg max-w-none space-y-4 text-gray-300">
                  <p>
                    Devenu adulte, Guillaume n'a jamais oublié cette petite Ferrari n°20.
                    Le geste est resté, mais l'ambition a grandi.
                  </p>
                  <p className="text-2xl font-bold text-white">
                    « Et si, au lieu d'une voiture miniature,<br />
                    j'utilisais une vraie Ferrari ? »
                  </p>
                  <p>
                    Cette question simple a donné naissance à un concept artistique unique :
                    les <strong className="text-orange-500">Ferrari Live Performances</strong>.
                  </p>
                  <p>
                    Le principe reste le même qu'enfant - faire rouler une Ferrari dans la peinture pour créer des empreintes -
                    mais <strong className="text-white">à l'échelle 1:1</strong>, sur des toiles monumentales pouvant atteindre 6 mètres.
                  </p>
                </div>
              </div>
            </div>

            {/* Flèche de progression */}
            <div className="absolute left-1/2 bottom-[-80px] transform -translate-x-1/2 text-orange-500 text-6xl animate-bounce">
              ↓
            </div>
          </div>

          {/* Étape 3 : La réalisation */}
          <div className="relative mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block px-4 py-2 bg-yellow-600 rounded-full text-sm font-bold mb-4">
                  2018 - Première performance
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Le rêve devient réalité
                </h2>
                <div className="prose prose-invert prose-lg max-w-none space-y-4 text-gray-300">
                  <p>
                    La première performance live a lieu en 2018. Une vraie Ferrari, de la vraie peinture,
                    une toile de 4 mètres. Le public est fasciné.
                  </p>
                  <p>
                    Chaque roue qui touche la toile crée une trace unique. Le ronronnement du moteur V12,
                    le crissement des pneus sur la peinture fraîche, la tension du moment...
                  </p>
                  <p className="text-xl font-bold text-yellow-500">
                    L'automobile n'est plus seulement un objet. Elle devient artiste.
                  </p>
                  <ul className="space-y-2">
                    <li>✓ Performances devant public</li>
                    <li>✓ Œuvres strictement uniques</li>
                    <li>✓ Toiles jusqu'à 6 mètres</li>
                    <li>✓ Éditions limitées photographiées</li>
                  </ul>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-transparent rounded-3xl transform rotate-3"></div>
                  <div className="relative bg-gradient-to-br from-yellow-950/30 to-black border-2 border-yellow-900/30 rounded-2xl p-8 md:p-12">
                    <div className="text-center space-y-6">
                      <div className="text-8xl">🎨</div>
                      <div className="text-4xl font-bold text-yellow-500">Ferrari Live Performance</div>
                      <div className="text-gray-300 text-sm">
                        Vraie Ferrari • Vraie peinture • Vraie toile
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flèche de progression */}
            <div className="absolute left-1/2 bottom-[-80px] transform -translate-x-1/2 text-yellow-500 text-6xl animate-bounce">
              ↓
            </div>
          </div>

          {/* Étape 4 : Aujourd'hui */}
          <div className="relative">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-green-600 rounded-full text-sm font-bold mb-4">
                2025 - Aujourd'hui
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-950/30 to-black border-2 border-green-900/30 rounded-3xl p-8 md:p-16">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
                Une vision devenue réalité
              </h2>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-500 mb-2">47</div>
                  <div className="text-gray-400">Collectionneurs</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-500 mb-2">12</div>
                  <div className="text-gray-400">Performances live</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-500 mb-2">850K€</div>
                  <div className="text-gray-400">Valeur totale</div>
                </div>
              </div>

              <div className="prose prose-invert prose-lg max-w-3xl mx-auto text-center space-y-6 text-gray-300">
                <p className="text-xl">
                  Guillaume Farré continue d'explorer ce concept unique. Performances live lors d'événements automobiles prestigieux,
                  créations monumentales pour collectionneurs, collaborations avec des marques de luxe...
                </p>
                <p className="text-2xl font-bold text-white">
                  Mais l'essence reste la même que dans la chambre d'enfant :
                  <span className="text-green-500"> faire rouler une Ferrari dans la peinture pour créer de l'art</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparaison visuelle */}
      <section className="bg-gradient-to-b from-black via-red-950/10 to-black py-16 md:py-24 border-y border-red-900/30">
        <div className="container px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            De la miniature au monumental
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-950/30 to-black border-2 border-blue-900/30 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👶</div>
                <h3 className="text-2xl font-bold mb-4">Enfance</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">●</span>
                  Ferrari miniature n°20
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">●</span>
                  Feuilles de papier A4
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">●</span>
                  Peinture pour enfants
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">●</span>
                  Chambre d'enfant
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-950/30 to-black border-2 border-red-900/30 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold mb-4">Aujourd'hui</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-red-500">●</span>
                  Ferrari authentique (échelle 1:1)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-500">●</span>
                  Toiles jusqu'à 6 mètres
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-500">●</span>
                  Peintures acryliques professionnelles
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-500">●</span>
                  Performances live publiques
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12 text-gray-400 text-lg">
            <strong className="text-white">Même geste, même passion, échelle différente.</strong>
          </div>
        </div>
      </section>

      {/* Citation finale */}
      <section className="container px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <blockquote className="text-3xl md:text-4xl font-bold text-center leading-relaxed">
            <span className="text-red-500">"</span>
            De la petite Ferrari n°20 aux performances monumentales,
            c'est la même histoire qui continue de s'écrire.
            Une histoire où <span className="text-red-500">l'enfance rencontre l'art contemporain</span>,
            où le rêve devient réalité à l'échelle 1:1.
            <span className="text-red-500">"</span>
          </blockquote>
          <div className="text-center mt-8 text-gray-400 text-xl">
            — Guillaume Farré
          </div>
        </div>
      </section>

      {/* CTAs finaux */}
      <section className="container px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-950/30 to-black border-2 border-red-900/30 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Faites partie de l'histoire
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/boutique"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-all transform hover:scale-105 text-center"
              >
                🏎️ Découvrir les œuvres
              </Link>
              <Link
                href="/performances"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-lg text-lg transition-all border-2 border-white/30 text-center"
              >
                🎬 Voir les performances
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-lg text-lg transition-all border-2 border-white/30 text-center"
              >
                💬 Contacter l'artiste
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
