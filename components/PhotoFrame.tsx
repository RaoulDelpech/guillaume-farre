'use client'

import Image from 'next/image'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface PhotoFrameProps {
  src: string
  alt: string
  imageWidth?: number
  imageHeight?: number
  className?: string
  blurDataURL?: string
  priority?: boolean
}

// --- Proportions calibrees sur la photo reelle de Guillaume ---
// Desktop : genereux (cadre + passe-partout epais)
// Mobile : reduit pour maximiser l'espace image
const FRAME_DESKTOP = { frame: 24, mat: 40, bevel: 2, paper: 12 }
const FRAME_MOBILE = { frame: 12, mat: 16, bevel: 1, paper: 6 }

/**
 * Cadre photo classique fidelite Guillaume Farre.
 *
 * Layers (dehors vers dedans) :
 *   1. Cadre noir mat epais, avec fort relief 3D
 *   2. Passe-partout gris clair/taupe (large, genereux)
 *   3. Biseau blanc 45° (coupe du passe-partout)
 *   4. Bordure blanche du tirage (papier photo)
 *   5. La photo
 *
 * @author Lalou
 */
export default function PhotoFrame({
  src,
  alt,
  imageWidth = 1200,
  imageHeight = 900,
  className = '',
  blurDataURL,
  priority = false,
}: PhotoFrameProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const dims = isDesktop ? FRAME_DESKTOP : FRAME_MOBILE

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        boxShadow: [
          '6px 10px 30px -4px rgba(0,0,0,0.55)',
          '3px 5px 12px -3px rgba(0,0,0,0.35)',
          '1px 2px 4px rgba(0,0,0,0.2)',
          '0 2px 6px rgba(0,0,0,0.25)',
        ].join(', '),
      }}
    >
      {/* 1. Cadre noir mat — relief 3D marque */}
      <div
        style={{
          padding: dims.frame,
          background: 'linear-gradient(145deg, #222222 0%, #141414 35%, #0c0c0c 70%, #080808 100%)',
          boxShadow: [
            'inset 2px 2px 0 rgba(255,255,255,0.10)',
            'inset 1px 1px 2px rgba(255,255,255,0.05)',
            'inset -2px -2px 0 rgba(0,0,0,0.7)',
            'inset -1px -1px 3px rgba(0,0,0,0.5)',
            'inset 0 -3px 6px rgba(0,0,0,0.5)',
            'inset -3px 0 6px rgba(0,0,0,0.35)',
            'inset 3px 0 4px rgba(0,0,0,0.15)',
            'inset 0 3px 4px rgba(0,0,0,0.1)',
          ].join(', '),
        }}
      >
        {/* 2. Passe-partout gris clair/taupe */}
        <div
          style={{
            padding: dims.mat,
            background: '#b5b0a8',
            boxShadow: [
              'inset 0 3px 8px rgba(0,0,0,0.35)',
              'inset 3px 0 7px rgba(0,0,0,0.2)',
              'inset -2px 0 5px rgba(0,0,0,0.12)',
              'inset 0 -2px 4px rgba(0,0,0,0.08)',
              'inset -1px -1px 0 rgba(255,255,255,0.06)',
            ].join(', '),
          }}
        >
          {/* 3. Biseau blanc 45° */}
          <div
            style={{
              padding: dims.bevel,
              background: 'linear-gradient(135deg, #d8d5d0 0%, #eae7e2 50%, #f0ede8 100%)',
              boxShadow: [
                'inset 0 0 1px rgba(0,0,0,0.12)',
                '0 0 1px rgba(255,255,255,0.3)',
              ].join(', '),
            }}
          >
            {/* 4. Bordure blanche du tirage (papier photo) */}
            <div
              style={{
                padding: dims.paper,
                background: '#faf9f7',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {/* 5. Photo */}
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  lineHeight: 0,
                  boxShadow: '0 0 1px rgba(0,0,0,0.1)',
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
