"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Gere la navigation entre toiles : IntersectionObserver, scroll programmatique,
 * et navigation clavier dans la lightbox.
 */
export function useToilesNavigation(count: number) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const isScrolling = useRef(false);

  // Track which painting is in view (skip during programmatic scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = refs.current.indexOf(entry.target as HTMLDivElement);
            if (i !== -1) setActiveIdx(i);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-15% 0px -15% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightboxIdx === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight")
        setLightboxIdx((i) => (i !== null && i < count - 1 ? i + 1 : i));
      if (e.key === "ArrowLeft")
        setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i));
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [lightboxIdx, count]);

  const scrollTo = useCallback((i: number) => {
    setActiveIdx(i);
    isScrolling.current = true;
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => { isScrolling.current = false; }, 900);
  }, []);

  const setRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  }, []);

  return {
    activeIdx,
    lightboxIdx,
    setLightboxIdx,
    scrollTo,
    setRef,
  };
}
