"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasConsent, getConsentStatus } from "@/lib/cookie-consent";

/**
 * Google Analytics 4 with RGPD-compliant cookie consent
 * Only loads GA4 scripts if user has accepted cookies
 *
 * Lalou
 */
export default function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Ne rien rendre si pas de Measurement ID configuré
  if (!measurementId) {
    return null;
  }

  useEffect(() => {
    // Vérifier le consentement initial
    const initialConsent = hasConsent();
    setConsentGiven(initialConsent);

    // Configurer gtag avec le consentement par défaut (denied)
    if (typeof window !== "undefined") {
      window.gtag = window.gtag || function () {
        (window.dataLayer = window.dataLayer || []).push(arguments);
      };
      window.dataLayer = window.dataLayer || [];

      // Mode par défaut : analytics refusé
      window.gtag("consent", "default", {
        analytics_storage: initialConsent ? "granted" : "denied",
      });

      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        page_path: window.location.pathname,
      });
    }

    // Écouter les changements de consentement
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const accepted = customEvent.detail?.accepted || false;

      setConsentGiven(accepted);

      if (typeof window !== "undefined" && window.gtag) {
        // Mettre à jour le consentement GA4
        window.gtag("consent", "update", {
          analytics_storage: accepted ? "granted" : "denied",
        });

        // Si consentement accordé, forcer un page_view
        if (accepted) {
          window.gtag("event", "page_view", {
            page_path: window.location.pathname,
          });
        }
      }
    };

    window.addEventListener("consentChanged", handleConsentChange);

    return () => {
      window.removeEventListener("consentChanged", handleConsentChange);
    };
  }, [measurementId]);

  // Ne charger les scripts que si consentement accordé
  if (!consentGiven) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
    </>
  );
}

// Déclaration TypeScript pour gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
