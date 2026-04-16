"use client";

import { useEffect, useState } from "react";
import { hasConsent } from "@/lib/cookie-consent";

/**
 * Microsoft Clarity — RGPD-compliant heatmaps & session recordings
 * Only loads if user has accepted cookies and project ID is configured
 *
 * Lalou
 */
export default function ClarityAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  useEffect(() => {
    if (!projectId) return;

    const initialConsent = hasConsent();
    setConsentGiven(initialConsent);

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const accepted = customEvent.detail?.accepted || false;
      setConsentGiven(accepted);
    };

    window.addEventListener("consentChanged", handleConsentChange);

    return () => {
      window.removeEventListener("consentChanged", handleConsentChange);
    };
  }, [projectId]);

  useEffect(() => {
    if (!consentGiven || !projectId) return;

    // Don't inject twice
    if (document.getElementById("clarity-script")) return;

    const script = document.createElement("script");
    script.id = "clarity-script";
    script.type = "text/javascript";
    script.async = true;
    script.textContent = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,"clarity","script","${projectId}");
    `;
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("clarity-script");
      if (existing) existing.remove();
    };
  }, [consentGiven, projectId]);

  return null;
}
