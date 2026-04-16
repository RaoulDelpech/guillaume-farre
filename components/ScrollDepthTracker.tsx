"use client";

import { useEffect, useRef } from "react";
import { trackScrollDepth } from "@/lib/analytics";

const THRESHOLDS = [25, 50, 75, 100];

/**
 * Tracks scroll depth milestones (25%, 50%, 75%, 100%) via GA4.
 * Uses scroll event listener with throttling to avoid excessive calls.
 *
 * Lalou
 */
export default function ScrollDepthTracker() {
  const firedRef = useRef<Set<number>>(new Set());
  const pathRef = useRef<string>("");

  useEffect(() => {
    // Reset on route change
    const currentPath = window.location.pathname;
    if (pathRef.current !== currentPath) {
      firedRef.current = new Set();
      pathRef.current = currentPath;
    }

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (docHeight <= 0) {
          ticking = false;
          return;
        }

        const percent = Math.round((scrollTop / docHeight) * 100);

        for (const threshold of THRESHOLDS) {
          if (percent >= threshold && !firedRef.current.has(threshold)) {
            firedRef.current.add(threshold);
            trackScrollDepth(threshold);
          }
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
