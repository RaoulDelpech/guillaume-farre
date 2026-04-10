'use client'

import Image from 'next/image'
import { useState } from 'react'

/**
 * Page de demo — 4 variantes de navigation laterale pour la page Toiles.
 * Temporaire — a supprimer apres choix de la variante.
 *
 * @author Lalou
 */

interface MiniToile {
  id: number
  name: string
  image: string
  imageWidth: number
  imageHeight: number
}

const toiles: MiniToile[] = [
  { id: 1, name: "Klein d'oeil", image: '/images/toiles/1.jpg', imageWidth: 1262, imageHeight: 1660 },
  { id: 2, name: 'Land HO', image: '/images/toiles/2.jpg', imageWidth: 1291, imageHeight: 1550 },
  { id: 3, name: 'Across the Ocean', image: '/images/toiles/3.jpg', imageWidth: 988, imageHeight: 1968 },
  { id: 4, name: 'Angle', image: '/images/toiles/4.jpg', imageWidth: 1687, imageHeight: 2058 },
  { id: 5, name: 'Evasion', image: '/images/toiles/5.jpg', imageWidth: 1224, imageHeight: 1598 },
  { id: 6, name: 'Tifosi', image: '/images/toiles/6.jpg', imageWidth: 1495, imageHeight: 1989 },
  { id: 7, name: 'Coquelicot', image: '/images/toiles/7.jpg', imageWidth: 1260, imageHeight: 1677 },
  { id: 8, name: 'Biarritz', image: '/images/toiles/8.jpg', imageWidth: 1389, imageHeight: 1393 },
  { id: 9, name: 'Shaolin Premium', image: '/images/toiles/9.jpg', imageWidth: 1281, imageHeight: 1281 },
  { id: 10, name: 'BW Gum', image: '/images/toiles/10.jpg', imageWidth: 1212, imageHeight: 1484 },
  { id: 11, name: 'Cavalino', image: '/images/toiles/11.jpg', imageWidth: 1144, imageHeight: 2282 },
  { id: 12, name: '3451', image: '/images/toiles/12.jpg', imageWidth: 1221, imageHeight: 1550 },
  { id: 13, name: 'High efficiency', image: '/images/toiles/13.jpg', imageWidth: 900, imageHeight: 2344 },
  { id: 14, name: 'Shaolin Dream', image: '/images/toiles/14.jpg', imageWidth: 1585, imageHeight: 1786 },
  { id: 15, name: 'Euskadi', image: '/images/toiles/15.jpg', imageWidth: 1478, imageHeight: 1604 },
  { id: 16, name: "Dino's Lament", image: '/images/toiles/16.jpg', imageWidth: 1155, imageHeight: 1397 },
  { id: 17, name: 'No U Turn', image: '/images/toiles/17-milieu.jpg', imageWidth: 1084, imageHeight: 2771 },
  { id: 18, name: 'Divergence', image: '/images/toiles/18.jpg', imageWidth: 1612, imageHeight: 1492 },
  { id: 19, name: 'Traces', image: '/images/toiles/19.jpg', imageWidth: 675, imageHeight: 1344 },
  { id: 20, name: 'Amazonia', image: '/images/toiles/20.jpg', imageWidth: 1031, imageHeight: 1377 },
]

/* ================================================================
   OPTION A — Arc de cercle avec miniature active
   ================================================================ */
function NavOptionA({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const total = toiles.length
  const centerY = 50 // % vertical center

  return (
    <nav className="fixed right-0 top-0 bottom-0 w-48 z-40 pointer-events-none hidden lg:flex items-center">
      <div className="relative w-full h-[70vh] pointer-events-auto">
        {toiles.map((toile, i) => {
          const isActive = i === active
          // Arc: elements form a curve — active item is rightmost, others curve left
          const distance = Math.abs(i - active)
          const normalizedPos = (i - active) / (total / 2) // -1 to 1 range
          const yPercent = centerY + normalizedPos * 42
          // Curve: closer to active = more to the right
          const xOffset = Math.pow(distance, 1.4) * 6
          const opacity = distance > 6 ? 0.2 : distance > 3 ? 0.4 : 0.7

          return (
            <button
              key={toile.id}
              onClick={() => onSelect(i)}
              className="absolute transition-all duration-500 ease-out flex items-center gap-2"
              style={{
                top: `${yPercent}%`,
                right: `${12 + xOffset}px`,
                transform: 'translateY(-50%)',
                opacity: isActive ? 1 : opacity,
              }}
            >
              {/* Nom — visible pour l'element actif */}
              {isActive && (
                <span className="text-[11px] tracking-wider font-light text-[#7A6030] whitespace-nowrap mr-1">
                  {toile.name}
                </span>
              )}
              {/* Miniature ou point */}
              {isActive ? (
                <div className="w-10 h-10 rounded-sm overflow-hidden shadow-lg ring-1 ring-[#7A6030]/40">
                  <Image
                    src={toile.image}
                    alt={toile.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <span
                  className="block rounded-full bg-neutral-400/50 hover:bg-neutral-500 hover:scale-150 transition-all"
                  style={{ width: distance <= 2 ? 5 : 3, height: distance <= 2 ? 5 : 3 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ================================================================
   OPTION B — Bande verticale avec miniatures empilees
   ================================================================ */
function NavOptionB({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <nav className="fixed right-3 xl:right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-1">
      {toiles.map((toile, i) => {
        const isActive = i === active
        return (
          <button
            key={toile.id}
            onClick={() => onSelect(i)}
            className="group relative flex items-center transition-all duration-300"
          >
            {/* Nom — visible pour actif et au hover */}
            <span
              className={`absolute right-full mr-2 text-[10px] tracking-wider font-light whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'opacity-100 text-[#7A6030]'
                  : 'opacity-0 group-hover:opacity-80 text-neutral-500'
              }`}
            >
              {toile.name}
            </span>
            {/* Miniature */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isActive
                  ? 'w-8 h-8 rounded-sm ring-1 ring-[#7A6030]/50 shadow-md'
                  : 'w-4 h-4 rounded-sm opacity-50 group-hover:opacity-80 group-hover:w-5 group-hover:h-5'
              }`}
            >
              <Image
                src={toile.image}
                alt={toile.name}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        )
      })}
    </nav>
  )
}

/* ================================================================
   OPTION C — Prev / Current / Next flottant (3 elements)
   ================================================================ */
function NavOptionC({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const prev = active > 0 ? toiles[active - 1] : null
  const current = toiles[active]
  const next = active < toiles.length - 1 ? toiles[active + 1] : null

  return (
    <nav className="fixed right-4 xl:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-6">
      {/* Compteur */}
      <span className="text-[10px] tracking-widest text-neutral-400 font-light tabular-nums">
        {active + 1} / {toiles.length}
      </span>

      {/* Prev */}
      {prev ? (
        <button
          onClick={() => onSelect(active - 1)}
          className="group flex items-center gap-2 opacity-40 hover:opacity-80 transition-all duration-300"
        >
          <span className="text-[10px] tracking-wider text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {prev.name}
          </span>
          <div className="w-7 h-7 rounded-sm overflow-hidden">
            <Image src={prev.image} alt={prev.name} width={28} height={28} className="w-full h-full object-cover" />
          </div>
        </button>
      ) : (
        <div className="h-7" />
      )}

      {/* Current */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] tracking-wider font-light text-[#7A6030] whitespace-nowrap">
          {current.name}
        </span>
        <div className="w-12 h-12 rounded-sm overflow-hidden ring-1 ring-[#7A6030]/40 shadow-lg">
          <Image
            src={current.image}
            alt={current.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Next */}
      {next ? (
        <button
          onClick={() => onSelect(active + 1)}
          className="group flex items-center gap-2 opacity-40 hover:opacity-80 transition-all duration-300"
        >
          <span className="text-[10px] tracking-wider text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {next.name}
          </span>
          <div className="w-7 h-7 rounded-sm overflow-hidden">
            <Image src={next.image} alt={next.name} width={28} height={28} className="w-full h-full object-cover" />
          </div>
        </button>
      ) : (
        <div className="h-7" />
      )}

      {/* Barre de progression */}
      <div className="w-px h-24 bg-neutral-300/40 relative">
        <div
          className="absolute top-0 left-0 w-full bg-[#7A6030]/60 transition-all duration-500"
          style={{ height: `${((active + 1) / toiles.length) * 100}%` }}
        />
      </div>
    </nav>
  )
}

/* ================================================================
   OPTION D — Timeline arc avec miniatures et noms
   ================================================================ */
function NavOptionD({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const total = toiles.length
  const visibleRange = 4 // combien d'items autour de l'actif

  return (
    <nav className="fixed right-2 xl:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end">
      {/* Compteur en haut */}
      <span className="text-[10px] tracking-widest text-neutral-400 font-light tabular-nums mb-4">
        {active + 1} / {total}
      </span>

      <div className="relative flex flex-col items-end gap-0">
        {/* Ligne verticale de fond */}
        <div className="absolute right-[5px] top-0 bottom-0 w-px bg-neutral-300/30" />

        {toiles.map((toile, i) => {
          const isActive = i === active
          const distance = Math.abs(i - active)
          const visible = distance <= visibleRange

          if (!visible) {
            // Points comprimes pour les elements lointains
            if (distance === visibleRange + 1) {
              return (
                <div key={toile.id} className="flex items-center justify-end h-3 my-px">
                  <span className="text-[8px] text-neutral-400/50 mr-2">...</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300/30" />
                </div>
              )
            }
            return null
          }

          // Arc horizontal — actif le plus a droite
          const arcOffset = Math.pow(distance, 1.2) * 8

          return (
            <button
              key={toile.id}
              onClick={() => onSelect(i)}
              className="relative flex items-center justify-end transition-all duration-500 ease-out"
              style={{
                height: isActive ? 48 : distance <= 1 ? 28 : 20,
                marginRight: arcOffset,
                opacity: isActive ? 1 : 1 - distance * 0.15,
              }}
            >
              {/* Nom */}
              <span
                className={`text-right whitespace-nowrap mr-2 transition-all duration-300 ${
                  isActive
                    ? 'text-[11px] tracking-wider font-light text-[#7A6030]'
                    : distance <= 1
                      ? 'text-[9px] tracking-wider text-neutral-400'
                      : 'text-[8px] text-neutral-400/60'
                }`}
              >
                {toile.name}
              </span>

              {/* Miniature / point */}
              {isActive ? (
                <div className="w-10 h-10 rounded-sm overflow-hidden ring-1 ring-[#7A6030]/40 shadow-lg flex-shrink-0">
                  <Image
                    src={toile.image}
                    alt={toile.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : distance <= 2 ? (
                <div className="w-5 h-5 rounded-sm overflow-hidden opacity-60 hover:opacity-90 transition-opacity flex-shrink-0">
                  <Image
                    src={toile.image}
                    alt={toile.name}
                    width={20}
                    height={20}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400/40 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ================================================================
   PAGE DE DEMO
   ================================================================ */
export default function NavDemoPage() {
  const [activeA, setActiveA] = useState(5)
  const [activeB, setActiveB] = useState(5)
  const [activeC, setActiveC] = useState(5)
  const [activeD, setActiveD] = useState(5)

  const [variant, setVariant] = useState<'A' | 'B' | 'C' | 'D'>('A')

  const activeMap = { A: activeA, B: activeB, C: activeC, D: activeD }
  const setMap = { A: setActiveA, B: setActiveB, C: setActiveC, D: setActiveD }

  return (
    <main className="min-h-screen bg-[#f5f0eb] relative">
      {/* Selecteur de variante */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
        {(['A', 'B', 'C', 'D'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              variant === v
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {v === 'A' && 'A — Arc + mini'}
            {v === 'B' && 'B — Minis empilees'}
            {v === 'C' && 'C — Prev/Next'}
            {v === 'D' && 'D — Timeline arc'}
          </button>
        ))}
      </div>

      {/* Description de la variante active */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 text-center">
        <p className="text-xs text-neutral-500 max-w-md">
          {variant === 'A' && "Arc de cercle — l'element actif est le plus a droite, les autres s'eloignent en arc. Miniature + nom sur l'actif."}
          {variant === 'B' && "Miniatures empilees — toutes les oeuvres en miniature, l'active est plus grande avec le nom. Compact."}
          {variant === 'C' && "Prev / Current / Next — montre seulement 3 elements : precedent, actuel (grand), suivant. Barre de progression."}
          {variant === 'D' && "Timeline arc avec noms — les elements proches de l'actif ont des miniatures, les lointains sont des points. Noms toujours visibles."}
        </p>
      </div>

      {/* Simule du contenu defilant */}
      <div className="max-w-xl mx-auto pt-32 pb-16 px-4">
        <h1 className="text-2xl font-light text-neutral-800 mb-4 tracking-widest text-center">
          NAVIGATION LATERALE — DEMO
        </h1>
        <p className="text-neutral-500 text-sm text-center mb-12">
          Clique sur les elements de la navigation a droite pour simuler le scroll.
          <br />
          Utilise les boutons A/B/C/D en haut pour comparer les variantes.
        </p>

        {/* Liste des tableaux */}
        {toiles.map((toile, i) => {
          const isActive = i === activeMap[variant]
          return (
            <div
              key={toile.id}
              onClick={() => setMap[variant](i)}
              className={`mb-8 p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'bg-white/80 shadow-md ring-1 ring-[#7A6030]/20'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={toile.image}
                    alt={toile.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className={`font-light tracking-wide ${isActive ? 'text-[#7A6030]' : 'text-neutral-700'}`}>
                    {toile.name}
                  </h3>
                  <p className="text-xs text-neutral-400">{i + 1} / {toiles.length}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation selon variante */}
      {variant === 'A' && <NavOptionA active={activeA} onSelect={setActiveA} />}
      {variant === 'B' && <NavOptionB active={activeB} onSelect={setActiveB} />}
      {variant === 'C' && <NavOptionC active={activeC} onSelect={setActiveC} />}
      {variant === 'D' && <NavOptionD active={activeD} onSelect={setActiveD} />}
    </main>
  )
}
