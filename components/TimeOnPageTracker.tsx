"use client";

import { useEffect, useRef } from "react";
import { trackTimeOnPage } from "@/lib/analytics";

const MILESTONES_SECONDS = [30, 60, 120, 300];

/**
 * Tracks time spent on page via GA4 at milestones (30s, 60s, 2min, 5min).
 * Pauses when tab is hidden (visibility API).
 *
 * Lalou
 */
export default function TimeOnPageTracker() {
  const firedRef = useRef<Set<number>>(new Set());
  const elapsedRef = useRef(0);
  const pathRef = useRef("");

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (pathRef.current !== currentPath) {
      firedRef.current = new Set();
      elapsedRef.current = 0;
      pathRef.current = currentPath;
    }

    let active = !document.hidden;

    const onVisibilityChange = () => {
      active = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const interval = setInterval(() => {
      if (!active) return;

      elapsedRef.current += 1;

      for (const milestone of MILESTONES_SECONDS) {
        if (
          elapsedRef.current >= milestone &&
          !firedRef.current.has(milestone)
        ) {
          firedRef.current.add(milestone);
          trackTimeOnPage(milestone);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
