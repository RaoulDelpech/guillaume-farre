'use client'

import Image from 'next/image'

type FrameColor = 'oak' | 'walnut' | 'black' | 'white'

interface AmericanFrameProps {
  src: string
  alt: string
  imageWidth?: number
  imageHeight?: number
  frameColor?: FrameColor
  className?: string
  blurDataURL?: string
  priority?: boolean
  /** Skip the mat gap (passe-partout). True for canvases that sit flush against the frame. */
  noMat?: boolean
}

// --- Visual tuning constants ---
// FIXE en pixels — meme cadre quelle que soit la taille du tableau
// Principe caisse americaine : 2.5cm de face + 0.5cm de profondeur fond noir
const FRAME_FACE = '18px'
const FRAME_LIP = '2px'
const FRAME_GAP = '4px'

// Constantes numeriques pour exports (calculs de layout)
export const FRAME_FACE_PX = 18
export const FRAME_LIP_PX = 2
export const GAP_PX = 4

const RECESS_SHADOW =
  '0 0 2px rgba(0,0,0,0.6), 1px 2px 5px rgba(0,0,0,0.4)'

// --- Theme per frame color ---
interface FrameTheme {
  face: {
    top: string
    right: string
    bottom: string
    left: string
  }
  // Inner bevel — the step down from face into the lip
  innerBevel: { top: string; right: string; bottom: string; left: string }
  lip: string
  fond: string
  grain: string
  grainWide: string
  sheen: string
  lighting: string
  fondShadow: string
  // Box-shadow on the frame face for 3D relief (no external borders)
  faceHighlight: string
  faceShadow: string
}

const themes: Record<FrameColor, FrameTheme> = {
  black: {
    face: {
      top: '#151515',     // tres sombre partout
      left: '#121212',
      right: '#0c0c0c',
      bottom: '#090909',
    },
    innerBevel: {
      top: '#030303',     // step down sombre = creux perceptible
      left: '#040404',
      right: '#1a1a1a',   // edge catch-light du bevel (cote lumiere)
      bottom: '#1e1e1e',
    },
    lip: '#050505',
    fond: '#000000',
    // Grain tres discret (texture bois sans eclaircir)
    grain: `repeating-linear-gradient(87deg, transparent 0px, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 3.8px, transparent 3.8px, transparent 7.5px)`,
    grainWide: `repeating-linear-gradient(88deg, transparent 0px, transparent 20px, rgba(255,255,255,0.025) 20px, rgba(255,255,255,0.025) 23px, transparent 23px, transparent 48px)`,
    // PAS de sheen (evite la tache grise) — juste le grain
    sheen: 'none',
    lighting: 'none',
    fondShadow: 'rgba(0,0,0,0.95)',
    // Relief par les aretes : fine ligne de lumiere en haut-gauche, ombre en bas-droite
    faceHighlight: 'inset 1px 1px 0 rgba(255,255,255,0.10), inset 0 1px 2px rgba(255,255,255,0.06)',
    faceShadow: 'inset -1px -1px 0 rgba(0,0,0,0.8), inset 0 -1px 2px rgba(0,0,0,0.4)',
  },

  oak: {
    face: {
      top: '#d4b478',
      left: '#c5a565',
      right: '#a0803c',
      bottom: '#907030',
    },
    innerBevel: {
      top: '#8a6828',
      left: '#906e2c',
      right: '#c0a060',
      bottom: '#c8a868',
    },
    lip: '#6e4c1e',
    fond: '#3a2a14',
    grain: `repeating-linear-gradient(87deg, transparent 0px, transparent 2.5px, rgba(101,67,33,0.09) 2.5px, rgba(101,67,33,0.09) 3.5px, transparent 3.5px, transparent 6px, rgba(101,67,33,0.05) 6px, rgba(101,67,33,0.05) 7px)`,
    grainWide: `repeating-linear-gradient(89deg, transparent 0px, transparent 14px, rgba(101,67,33,0.11) 14px, rgba(101,67,33,0.11) 17px, transparent 17px, transparent 35px)`,
    sheen: 'radial-gradient(ellipse at 25% 18%, rgba(255,220,160,0.14) 0%, transparent 55%)',
    lighting: 'linear-gradient(140deg, rgba(255,235,200,0.1) 0%, transparent 35%, transparent 65%, rgba(60,35,10,0.1) 100%)',
    fondShadow: 'rgba(80,50,20,0.4)',
    faceHighlight: 'inset 1px 1px 0 rgba(255,220,160,0.15)',
    faceShadow: 'inset -1px -1px 0 rgba(60,35,10,0.25)',
  },

  walnut: {
    face: {
      top: '#7a5030',
      left: '#6e4828',
      right: '#50301a',
      bottom: '#442414',
    },
    innerBevel: {
      top: '#3a1e0c',
      left: '#3e2010',
      right: '#6a4828',
      bottom: '#705030',
    },
    lip: '#281208',
    fond: '#1e1008',
    grain: `repeating-linear-gradient(86deg, transparent 0px, transparent 2px, rgba(30,15,5,0.11) 2px, rgba(30,15,5,0.11) 3px, transparent 3px, transparent 5.5px)`,
    grainWide: `repeating-linear-gradient(87.5deg, transparent 0px, transparent 12px, rgba(30,15,5,0.13) 12px, rgba(30,15,5,0.13) 15px, transparent 15px, transparent 30px)`,
    sheen: 'radial-gradient(ellipse at 25% 18%, rgba(180,120,60,0.09) 0%, transparent 55%)',
    lighting: 'linear-gradient(140deg, rgba(180,120,60,0.08) 0%, transparent 35%, transparent 65%, rgba(20,10,5,0.1) 100%)',
    fondShadow: 'rgba(20,10,5,0.45)',
    faceHighlight: 'inset 1px 1px 0 rgba(180,120,60,0.12)',
    faceShadow: 'inset -1px -1px 0 rgba(20,10,5,0.3)',
  },

  white: {
    face: {
      top: '#f5f2ed',
      left: '#efece7',
      right: '#dedad2',
      bottom: '#d4d0c8',
    },
    innerBevel: {
      top: '#ccc8c0',
      left: '#d0ccc4',
      right: '#eae7e2',
      bottom: '#edeae5',
    },
    lip: '#bfbab0',
    fond: '#f5f3f0',
    grain: `repeating-linear-gradient(88deg, transparent 0px, transparent 4px, rgba(0,0,0,0.015) 4px, rgba(0,0,0,0.015) 5px, transparent 5px, transparent 10px)`,
    grainWide: `repeating-linear-gradient(89deg, transparent 0px, transparent 25px, rgba(0,0,0,0.02) 25px, rgba(0,0,0,0.02) 28px, transparent 28px, transparent 55px)`,
    sheen: 'radial-gradient(ellipse at 25% 18%, rgba(255,255,255,0.4) 0%, transparent 55%)',
    lighting: 'linear-gradient(140deg, rgba(255,255,255,0.2) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.05) 100%)',
    fondShadow: 'rgba(0,0,0,0.2)',
    faceHighlight: 'inset 1px 1px 0 rgba(255,255,255,0.35)',
    faceShadow: 'inset -1px -1px 0 rgba(0,0,0,0.08)',
  },
}

/**
 * Build the multi-layer CSS background for the frame face.
 * Uses a conic-gradient for seamless directional shading (no visible mitre lines).
 */
function buildFrameFace(theme: FrameTheme): string {
  const { top, right, bottom, left } = theme.face

  // Conic gradient: smooth transition around the frame surface
  // 0deg = top center, 90deg = right, 180deg = bottom, 270deg = left
  // Replicates how light falls on the 4 sides without any seam line
  const directional = `conic-gradient(${top} 0deg, ${right} 90deg, ${bottom} 180deg, ${left} 270deg, ${top} 360deg)`

  return [
    theme.sheen,
    theme.lighting,
    theme.grain,
    theme.grainWide,
    directional,
  ].filter(layer => layer !== 'none').join(', ')
}

/**
 * Caisse americaine (shadow box / American frame).
 *
 * Layers from outside in:
 *   1. Wall shadow (outer div)
 *   2. Frame face (wood grain, mitre joints, directional lighting, inset relief)
 *   3. Inner bevel (step down into the caisson — gives 3D depth to the frame)
 *   4. Frame lip (the depth of the L-profile, dark)
 *   5. Fond du caisson (matte back panel, visible around canvas)
 *   6. Canvas (artwork, recessed with cast shadow)
 *
 * @author Lalou
 */
export default function AmericanFrame({
  src,
  alt,
  imageWidth = 1200,
  imageHeight = 900,
  frameColor = 'black',
  className = '',
  blurDataURL,
  priority = false,
  noMat = false,
}: AmericanFrameProps) {
  const theme = themes[frameColor]
  const frameFaceBg = buildFrameFace(theme)
  const ib = theme.innerBevel

  // Canvas texture
  const canvasGrain = [
    'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px)',
    'repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px)',
  ].join(', ')

  return (
    <div
      className={className}
      style={{
        display: 'block',
        maxWidth: '100%',
        backgroundColor: theme.fond,
        // Wall shadow
        boxShadow: [
          '4px 6px 20px -3px rgba(0,0,0,0.5)',
          '2px 3px 8px -2px rgba(0,0,0,0.35)',
          '0 1px 3px rgba(0,0,0,0.2)',
        ].join(', '),
      }}
    >
      {/* Frame face — visible front wood surface with inset relief */}
      <div
        style={{
          padding: FRAME_FACE,
          background: frameFaceBg,
          boxShadow: [theme.faceHighlight, theme.faceShadow].join(', '),
        }}
      >
          {/* Inner bevel — step down from face surface into the lip (reverse lighting: top dark, bottom bright) */}
          <div
            style={{
              padding: 0,
              borderTop: `1px solid ${ib.top}`,
              borderLeft: `1px solid ${ib.left}`,
              borderRight: `1px solid ${ib.right}`,
              borderBottom: `1px solid ${ib.bottom}`,
            }}
          >
            {/* Frame lip — the visible depth edge of the L-profile */}
            <div
              style={{
                padding: FRAME_LIP,
                backgroundColor: theme.lip,
                boxShadow: [
                  'inset 1px 2px 4px rgba(0,0,0,0.6)',
                  'inset -1px -1px 3px rgba(0,0,0,0.25)',
                ].join(', '),
              }}
            >
              {/* Fond du caisson — matte back panel */}
              <div
                style={{
                  padding: noMat ? 0 : FRAME_GAP,
                  backgroundColor: theme.fond,
                  boxShadow: [
                    `inset 0 2px 5px ${theme.fondShadow}`,
                    `inset 2px 0 4px ${theme.fondShadow}`,
                  ].join(', '),
                }}
              >
                {/* Canvas — artwork, recessed with cast shadow + subtle edge highlight */}
                <div
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: theme.fond,
                    lineHeight: 0,
                    fontSize: 0,
                    boxShadow: [
                      RECESS_SHADOW,
                      // Subtle edge catch-light (canvas edge reflecting overhead light)
                      '0 -1px 0 rgba(255,255,255,0.02)',
                      '-1px 0 0 rgba(255,255,255,0.015)',
                    ].join(', '),
                  }}
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={imageWidth}
                    height={imageHeight}
                    sizes="(max-width: 640px) 95vw, (max-width: 1024px) 50vw, 40vw"
                    quality={90}
                    className="w-full h-auto"
                    style={{ display: 'block' }}
                    {...(blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {})}
                    priority={priority}
                  />
                  {/* Canvas woven texture */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: canvasGrain,
                      mixBlendMode: 'multiply',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Vignette — edges slightly darker */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      boxShadow: [
                        'inset 0 2px 8px rgba(0,0,0,0.1)',
                        'inset 0 -1px 6px rgba(0,0,0,0.06)',
                        'inset 2px 0 6px rgba(0,0,0,0.05)',
                        'inset -2px 0 6px rgba(0,0,0,0.05)',
                      ].join(', '),
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
