import AmericanFrame from '@/components/AmericanFrame'

/**
 * Page de demonstration du composant AmericanFrame.
 * Affiche les 4 variantes de couleur + un exemple avec rotation.
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
      <div className="max-w-6xl mx-auto">
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

        {/* Rotation demo */}
        <h2 className="text-xl font-light text-neutral-800 mb-2 tracking-wide">
          Redressement rotation
        </h2>
        <p className="text-neutral-500 mb-8 text-sm">
          Correction de -1.5 degres sur l&apos;image (le cadre reste droit)
        </p>

        <div className="flex flex-col items-center gap-4 mb-16">
          <AmericanFrame
            src="/images/toiles/8.jpg"
            alt="Biarritz — Guillaume Farre"
            frameColor="black"
            rotation={-1.5}
            frameWidth={28}
            gapWidth={12}
            className="max-w-lg"
          />
          <span className="text-xs uppercase tracking-widest text-neutral-500">
            rotation: -1.5 | frameWidth: 28 | gapWidth: 12
          </span>
        </div>

        {/* Tailles de cadre */}
        <h2 className="text-xl font-light text-neutral-800 mb-2 tracking-wide">
          Epaisseurs
        </h2>
        <p className="text-neutral-500 mb-8 text-sm">
          frameWidth 16 / 24 / 32 — gapWidth 6 / 10 / 14
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src="/images/toiles/6.jpg"
              alt="Tifosi"
              frameColor="walnut"
              frameWidth={16}
              gapWidth={6}
              className="max-w-full"
            />
            <span className="text-xs text-neutral-400">16px / 6px</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src="/images/toiles/6.jpg"
              alt="Tifosi"
              frameColor="walnut"
              frameWidth={24}
              gapWidth={10}
              className="max-w-full"
            />
            <span className="text-xs text-neutral-400">24px / 10px (defaut)</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <AmericanFrame
              src="/images/toiles/6.jpg"
              alt="Tifosi"
              frameColor="walnut"
              frameWidth={32}
              gapWidth={14}
              className="max-w-full"
            />
            <span className="text-xs text-neutral-400">32px / 14px</span>
          </div>
        </div>
      </div>
    </main>
  )
}
