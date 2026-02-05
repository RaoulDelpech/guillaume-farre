"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Composant qui scroll en haut de page uniquement lors d'un vrai changement de page
 * Ne scroll PAS quand on reste sur la même page (ex: filtres galerie)
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function ScrollToTopOnNav() {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Extraire le chemin de base (sans /fr, /en, /it et sans query)
    const getBasePath = (path: string) => {
      // Enlever le préfixe de langue
      const withoutLocale = path.replace(/^\/(fr|en|it)/, "");
      return withoutLocale || "/";
    };

    const currentBase = getBasePath(pathname);
    const previousBase = previousPathRef.current ? getBasePath(previousPathRef.current) : null;

    // Ne scroll que si on change vraiment de page
    if (previousBase !== null && currentBase !== previousBase) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    previousPathRef.current = pathname;
  }, [pathname]);

  return null;
}

// Lalou
