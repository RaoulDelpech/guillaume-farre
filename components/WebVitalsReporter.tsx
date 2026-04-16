"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/web-vitals";

/**
 * Client component that reports Core Web Vitals (CLS, LCP, INP) to GA4
 *
 * Lalou
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return null;
}
