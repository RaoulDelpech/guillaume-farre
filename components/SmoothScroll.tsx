"use client";

import { useEffect } from "react";

/**
 * Initialise Lenis smooth scroll sur desktop.
 * Import dynamique de Lenis/GSAP dans useEffect pour :
 * - eviter le CLS (pas de dynamic + ssr:false qui bloquait le rendu serveur)
 * - garder le code-splitting (libs chargees a la demande)
 * - pas de risque SSR (imports uniquement cote client)
 *
 * @author Lalou
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Respecter prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    // Desactiver sur mobile/tactile — le scroll natif est plus fluide
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    let cleanup: (() => void) | undefined;

    async function initSmoothScroll() {
      const { default: Lenis } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        orientation: "vertical",
        gestureOrientation: "vertical",
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.destroy();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }

    initSmoothScroll();

    return () => { cleanup?.(); };
  }, []);

  return null;
}
