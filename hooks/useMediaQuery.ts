'use client'

import { useState, useEffect } from 'react'

/**
 * Hook qui ecoute un media query CSS et retourne true/false.
 * Retourne false cote serveur (SSR-safe).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
