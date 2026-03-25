'use client';

/**
 * Cookie Consent Banner (RGPD-compliant)
 * Banner discret en bas de page pour consentement cookies
 *
 * Lalou
 */

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { hasConsent, setConsent } from '@/lib/cookie-consent';

export default function CookieConsent() {
  const t = useTranslations('cookies');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si consentement déjà donné
    const alreadyConsented = hasConsent();
    if (!alreadyConsented) {
      // Afficher après un léger délai pour éviter flash
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setIsVisible(false);
  };

  const handleRefuse = () => {
    setConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end p-4 pointer-events-none transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="max-w-lg w-full bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-lg p-4 pointer-events-auto animate-slide-up">
        <p className="text-sm text-foreground/90 mb-3">
          {t('message')}
          {' '}
          <Link
            href="/politique-de-confidentialite"
            className="underline hover:text-primary transition-colors"
          >
            {t('learnMore')}
          </Link>
        </p>

        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefuse}
            className="hover:bg-accent"
          >
            {t('refuse')}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAccept}
          >
            {t('accept')}
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
