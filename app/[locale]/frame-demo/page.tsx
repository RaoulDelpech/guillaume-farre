import AmericanFrame from '@/components/AmericanFrame'

/**
 * Page de demonstration du composant AmericanFrame (caisse americaine).
 * Affiche les 4 variantes de couleur.
 *
 * Temporaire — a supprimer apres integration dans /toiles.
 *
 * @author Lalou
 */
export default function FrameDemoPage() {
  const testImage = '/images/toiles/1.jpg'
  const testAlt = 'Klein d\'oeil — Guillaume Farre'

  return (
    <main className="min-h-screen bg-neutral-100 py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-light text-neutral-800 mb-2 tracking-wide">
          Caisse americaine — Demo
        </h1>
        <p className="text-neutral-500 mb-12 text-sm">
          Composant AmericanFrame — 4 finitions, rendu CSS pur
        </p>

        {/* 4 variantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          {/* Black */}
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src={testImage}
              alt={testAlt}
              frameColor="black"
              className="max-w-full"
            />
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Noir mat
            </span>
          </div>

          {/* Oak */}
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src={testImage}
              alt={testAlt}
              frameColor="oak"
              className="max-w-full"
            />
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Chene clair
            </span>
          </div>

          {/* Walnut */}
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src={testImage}
              alt={testAlt}
              frameColor="walnut"
              className="max-w-full"
            />
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Noyer fonce
            </span>
          </div>

          {/* White */}
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src={testImage}
              alt={testAlt}
              frameColor="white"
              className="max-w-full"
            />
            <span className="text-xs uppercase tracking-widest text-neutral-500">
              Blanc mat
            </span>
          </div>
        </div>

        {/* Exemples couleurs avec images differentes */}
        <h2 className="text-xl font-light text-neutral-800 mb-8 tracking-wide">
          Autres exemples
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src="/images/toiles/6.jpg"
              alt="Tifosi"
              frameColor="walnut"
              className="max-w-full"
            />
            <span className="text-xs text-neutral-400">Noyer</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src="/images/toiles/8.jpg"
              alt="Biarritz"
              frameColor="black"
              className="max-w-full"
            />
            <span className="text-xs text-neutral-400">Noir</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src="/images/toiles/6.jpg"
              alt="Tifosi"
              frameColor="oak"
              className="max-w-full"
            />
            <span className="text-xs text-neutral-400">Chene</span>
          </div>
        </div>
      </div>
    </main>
  )
}
