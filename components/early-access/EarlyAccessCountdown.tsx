"use client";

/**
 * Compteur Early Access homepage
 *
 * Affiche le nombre de jours avant l'ouverture officielle.
 * Apres le 15 avril midi : affiche un message de transition pendant 7 jours.
 * Disparait completement apres la periode de transition.
 *
 * @author Lalou
 */

import { useEffect, useState } from 'react';
import { isEarlyAccess, isTransitionPeriod, getCountdownText } from '@/lib/early-access';

export default function EarlyAccessCountdown() {
  const [text, setText] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Si ni early access ni transition, ne rien afficher
    if (!isEarlyAccess() && !isTransitionPeriod()) {
      return;
    }

    // Obtenir le texte du compteur
    setText(getCountdownText());

    // Rafraichir toutes les minutes (le compteur affiche les heures/minutes)
    const interval = setInterval(() => {
      setText(getCountdownText());
    }, 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  if (!isClient || !text) {
    return null;
  }

  return (
    <div className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4">
        <p className="
          text-center
          text-sm
          md:text-base
          text-zinc-600
          font-light
          tracking-wider
          leading-relaxed
        ">
          {text}
        </p>
      </div>
    </div>
  );
}

// Lalou
