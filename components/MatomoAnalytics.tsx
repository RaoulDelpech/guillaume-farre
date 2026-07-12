"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasConsent } from "@/lib/cookie-consent";

/**
 * Matomo Analytics — suivi de trafic souverain, auto-hébergé (guillaumefarre.com/stats/).
 * Aucune donnée envoyée à un tiers : le tracker et la base sont sur le VPS Guillaume Farré.
 * Le script n'est chargé qu'après consentement RGPD (même mécanisme que le bandeau cookies,
 * via l'évènement `consentChanged` et `hasConsent()`), sinon le composant ne rend rien.
 */
export default function MatomoAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
  const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

  useEffect(() => {
    if (!matomoUrl || !siteId) return;

    setConsentGiven(hasConsent());

    const handleConsentChange = (event: Event) => {
      const accepted = (event as CustomEvent).detail?.accepted || false;
      setConsentGiven(accepted);
    };

    window.addEventListener("consentChanged", handleConsentChange);
    return () => window.removeEventListener("consentChanged", handleConsentChange);
  }, [matomoUrl, siteId]);

  if (!matomoUrl || !siteId || !consentGiven) {
    return null;
  }

  const base = matomoUrl.endsWith("/") ? matomoUrl : `${matomoUrl}/`;

  return (
    <Script id="matomo-analytics" strategy="afterInteractive">
      {`
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u='${base}';
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '${siteId}']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
      `}
    </Script>
  );
}

declare global {
  interface Window {
    _paq: unknown[];
  }
}
