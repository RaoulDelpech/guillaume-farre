'use client'

import Image from 'next/image'

type FrameColor = 'oak' | 'walnut' | 'black' | 'white'

interface AmericanFrameProps {
  src: string
  alt: string
  frameColor?: FrameColor
  frameWidth?: number
  gapWidth?: number
  rotation?: number
  className?: string
}

// --- Frame color themes ---
// Each theme defines the 4 side tones (directional lighting from top-left),
// wood grain patterns, inner edge color, and highlight/shadow values.

interface FrameTheme {
  sides: { top: string; right: string; bottom: string; left: string }
  innerEdge: string
  grainFine: string
  grainWide: string
  mitreLineColor: string
  sheen: string
  lighting: string
  highlightTop: string
  highlightLeft: string
  shadowBottom: string
  shadowRight: string
  outerEdge: string
}

const themes: Record<FrameColor, FrameTheme> = {
  black: {
    sides: {
      top: '#292929',
      left: '#242424',
      right: '#191919',
      bottom: '#151515',
    },
    innerEdge: '#0a0a0a',
    grainFine: `repeating-linear-gradient(
      87deg,
      transparent 0px, transparent 3px,
      rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 3.8px,
      transparent 3.8px, transparent 7.5px,
      rgba(255,255,255,0.01) 7.5px, rgba(255,255,255,0.01) 8.3px
    )`,
    grainWide: `repeating-linear-gradient(
      88deg,
      transparent 0px, transparent 20px,
      rgba(255,255,255,0.025) 20px, rgba(255,255,255,0.025) 23px,
      transparent 23px, transparent 48px
    )`,
    mitreLineColor: 'rgba(0,0,0,0.35)',
    sheen: 'radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.045) 0%, transparent 50%)',
    lighting: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.04) 100%)',
    highlightTop: 'rgba(255,255,255,0.09)',
    highlightLeft: 'rgba(255,255,255,0.05)',
    shadowBottom: 'rgba(0,0,0,0.25)',
    shadowRight: 'rgba(0,0,0,0.18)',
    outerEdge: 'rgba(0,0,0,0.5)',
  },

  oak: {
    sides: {
      top: '#c9a86c',
      left: '#bfa060',
      right: '#a88548',
      bottom: '#9c7a3e',
    },
    innerEdge: '#8a6832',
    grainFine: `repeating-linear-gradient(
      87deg,
      transparent 0px, transparent 2.5px,
      rgba(101,67,33,0.08) 2.5px, rgba(101,67,33,0.08) 3.5px,
      transparent 3.5px, transparent 6px,
      rgba(101,67,33,0.05) 6px, rgba(101,67,33,0.05) 7px
    )`,
    grainWide: `repeating-linear-gradient(
      89deg,
      transparent 0px, transparent 14px,
      rgba(101,67,33,0.1) 14px, rgba(101,67,33,0.1) 17px,
      transparent 17px, transparent 35px,
      rgba(101,67,33,0.06) 35px, rgba(101,67,33,0.06) 37px
    )`,
    mitreLineColor: 'rgba(60,35,10,0.3)',
    sheen: 'radial-gradient(ellipse at 25% 20%, rgba(255,220,160,0.1) 0%, transparent 50%)',
    lighting: 'linear-gradient(135deg, rgba(255,235,200,0.08) 0%, transparent 35%, transparent 65%, rgba(60,35,10,0.08) 100%)',
    highlightTop: 'rgba(255,220,160,0.18)',
    highlightLeft: 'rgba(255,220,160,0.1)',
    shadowBottom: 'rgba(80,50,20,0.22)',
    shadowRight: 'rgba(80,50,20,0.15)',
    outerEdge: 'rgba(100,60,20,0.35)',
  },

  walnut: {
    sides: {
      top: '#6b4226',
      left: '#624030',
      right: '#4e2d1a',
      bottom: '#452718',
    },
    innerEdge: '#321a0e',
    grainFine: `repeating-linear-gradient(
      86deg,
      transparent 0px, transparent 2px,
      rgba(30,15,5,0.1) 2px, rgba(30,15,5,0.1) 3px,
      transparent 3px, transparent 5.5px,
      rgba(30,15,5,0.07) 5.5px, rgba(30,15,5,0.07) 6.5px
    )`,
    grainWide: `repeating-linear-gradient(
      87.5deg,
      transparent 0px, transparent 12px,
      rgba(30,15,5,0.12) 12px, rgba(30,15,5,0.12) 15px,
      transparent 15px, transparent 30px,
      rgba(30,15,5,0.08) 30px, rgba(30,15,5,0.08) 32px
    )`,
    mitreLineColor: 'rgba(20,10,0,0.4)',
    sheen: 'radial-gradient(ellipse at 25% 20%, rgba(180,120,60,0.07) 0%, transparent 50%)',
    lighting: 'linear-gradient(135deg, rgba(180,120,60,0.06) 0%, transparent 35%, transparent 65%, rgba(20,10,5,0.08) 100%)',
    highlightTop: 'rgba(180,120,60,0.14)',
    highlightLeft: 'rgba(180,120,60,0.08)',
    shadowBottom: 'rgba(20,10,5,0.28)',
    shadowRight: 'rgba(20,10,5,0.2)',
    outerEdge: 'rgba(30,15,5,0.45)',
  },

  white: {
    sides: {
      top: '#f2efea',
      left: '#edebe6',
      right: '#e0ddd6',
      bottom: '#d8d4cc',
    },
    innerEdge: '#ccc8be',
    grainFine: `repeating-linear-gradient(
      88deg,
      transparent 0px, transparent 4px,
      rgba(0,0,0,0.012) 4px, rgba(0,0,0,0.012) 5px,
      transparent 5px, transparent 10px
    )`,
    grainWide: `repeating-linear-gradient(
      89deg,
      transparent 0px, transparent 25px,
      rgba(0,0,0,0.018) 25px, rgba(0,0,0,0.018) 28px,
      transparent 28px, transparent 55px
    )`,
    mitreLineColor: 'rgba(0,0,0,0.1)',
    sheen: 'radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.35) 0%, transparent 50%)',
    lighting: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.04) 100%)',
    highlightTop: 'rgba(255,255,255,0.5)',
    highlightLeft: 'rgba(255,255,255,0.3)',
    shadowBottom: 'rgba(0,0,0,0.07)',
    shadowRight: 'rgba(0,0,0,0.05)',
    outerEdge: 'rgba(0,0,0,0.12)',
  },
}

/**
 * Build the multi-layer CSS background for the frame face.
 *
 * Layer stack (top to bottom):
 * 1. Specular sheen (radial-gradient, top-left hotspot)
 * 2. Directional lighting (linear-gradient, top-left to bottom-right)
 * 3. Fine wood grain (repeating-linear-gradient)
 * 4. Wide wood grain bands (repeating-linear-gradient)
 * 5-8. Mitre joint dark lines (4x linear-gradient, one per corner)
 * 9-12. Mitre base colors forming the 4 frame sides (4x linear-gradient)
 */
function buildFrameFaceBackground(theme: FrameTheme): string {
  const { top, right, bottom, left } = theme.sides
  const ml = theme.mitreLineColor

  // Each corner quarter gets a gradient that splits diagonally.
  // The gradient direction is chosen so the 50% iso-line runs from
  // the outer corner to the center of the frame = the mitre line.
  const mitreLines = [
    `linear-gradient(to bottom left, transparent 48%, ${ml} 49.5%, ${ml} 50.5%, transparent 52%) 0 0 / 50% 50% no-repeat`,
    `linear-gradient(to bottom right, transparent 48%, ${ml} 49.5%, ${ml} 50.5%, transparent 52%) 100% 0 / 50% 50% no-repeat`,
    `linear-gradient(to top right, transparent 48%, ${ml} 49.5%, ${ml} 50.5%, transparent 52%) 100% 100% / 50% 50% no-repeat`,
    `linear-gradient(to top left, transparent 48%, ${ml} 49.5%, ${ml} 50.5%, transparent 52%) 0 100% / 50% 50% no-repeat`,
  ]

  const mitreBase = [
    `linear-gradient(to bottom left, ${top} 49%, ${left} 51%) 0 0 / 50% 50% no-repeat`,
    `linear-gradient(to bottom right, ${top} 49%, ${right} 51%) 100% 0 / 50% 50% no-repeat`,
    `linear-gradient(to top right, ${bottom} 49%, ${right} 51%) 100% 100% / 50% 50% no-repeat`,
    `linear-gradient(to top left, ${bottom} 49%, ${left} 51%) 0 100% / 50% 50% no-repeat`,
  ]

  return [
    theme.sheen,
    theme.lighting,
    theme.grainFine,
    theme.grainWide,
    ...mitreLines,
    ...mitreBase,
  ].join(', ')
}

export default function AmericanFrame({
  src,
  alt,
  frameColor = 'black',
  frameWidth = 24,
  gapWidth = 10,
  rotation = 0,
  className = '',
}: AmericanFrameProps) {
  const theme = themes[frameColor]

  // Clamp rotation to safe range
  const clampedRotation = Math.max(-5, Math.min(5, rotation))

  // Rabbet width proportional to frame (the inner step/depth)
  const rabbetWidth = Math.max(2, Math.round(frameWidth * 0.14))

  // Scale image slightly when rotated so corners don't show the gap background
  const imageScale = clampedRotation !== 0 ? 1 + Math.abs(clampedRotation) * 0.02 : 1

  const frameFaceBg = buildFrameFaceBackground(theme)

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        // Wall shadow: the frame casts a shadow on the wall behind it
        boxShadow: [
          '5px 8px 24px -4px rgba(0,0,0,0.50)',
          '2px 3px 10px -2px rgba(0,0,0,0.35)',
          '0 1px 4px rgba(0,0,0,0.25)',
        ].join(', '),
      }}
    >
      {/* Frame face — the wide visible front with wood grain + mitre joints */}
      <div
        style={{
          padding: frameWidth,
          background: frameFaceBg,
          // Edge bevels: highlight top-left (light source), shadow bottom-right
          boxShadow: [
            `inset 0 1px 0 0 ${theme.highlightTop}`,
            `inset 1px 0 0 0 ${theme.highlightLeft}`,
            `inset 0 -1px 0 0 ${theme.shadowBottom}`,
            `inset -1px 0 0 0 ${theme.shadowRight}`,
            `0 0 0 1px ${theme.outerEdge}`,
          ].join(', '),
        }}
      >
        {/* Inner rabbet — the depth step between face and gap */}
        <div
          style={{
            padding: rabbetWidth,
            background: theme.innerEdge,
            boxShadow:
              'inset 1px 2px 4px rgba(0,0,0,0.6), inset -1px -1px 2px rgba(0,0,0,0.25)',
          }}
        >
          {/* Gap — the dark recessed fond de caisse */}
          <div
            style={{
              padding: gapWidth,
              background: '#080808',
            }}
          >
            {/* Canvas wrapper — the artwork floats above the gap */}
            <div
              style={{
                overflow: 'hidden',
                lineHeight: 0,
                position: 'relative',
                boxShadow: [
                  '0 1px 4px rgba(0,0,0,0.75)',
                  '1px 2px 8px rgba(0,0,0,0.45)',
                  '0 0 1px rgba(0,0,0,0.9)',
                ].join(', '),
              }}
            >
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={900}
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 50vw, 40vw"
                quality={90}
                className="w-full h-auto"
                style={{
                  display: 'block',
                  transform:
                    clampedRotation !== 0
                      ? `rotate(${clampedRotation}deg) scale(${imageScale})`
                      : undefined,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
