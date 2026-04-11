"use client";

/**
 * Overlay de bienvenue Early Collector
 *
 * Affiche un message personnel de Guillaume aux premiers visiteurs du site.
 * S'affiche une seule fois par navigateur (cookie gf_early_seen).
 * Disparait completement apres le 15 mai 2026.
 *
 * @author Lalou
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isEarlyAccess, daysUntilOpening } from '@/lib/early-access';

const COOKIE_NAME = 'gf_early_seen';
const COOKIE_EXPIRATION_DAYS = 365;

export default function EarlyAccessOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Ne s'affiche que si :
    // 1. On est en periode early access
    // 2. Le cookie n'existe pas (premiere visite)
    if (!isEarlyAccess()) {
      return;
    }

    const hasSeen = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`));

    if (!hasSeen) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    // Enregistrer le cookie
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_EXPIRATION_DAYS);
    document.cookie = `${COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  };

  if (!isClient || !isVisible) {
    return null;
  }

  const days = daysUntilOpening();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-[700px] w-full bg-white p-6 sm:p-8 md:p-12 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Contenu */}
          <div className="space-y-5 sm:space-y-6">
            {/* Texte principal */}
            <div className="space-y-3 sm:space-y-4 leading-relaxed text-zinc-800 font-light tracking-wide text-sm sm:text-base">
              <p>
                Bienvenu et merci. D'être présent dans ces premiers instants d'ouverture de l'atelier et de cette aventure. J'essaie sur ce site de faire découvrir ce qui me passionne ; j'espère que vous y trouverez de la joie et de l'inspiration.
              </p>
              <p>
                Je vous demande de ne pas prendre de copies d'écran, de ne pas diffuser ce que vous trouverez sur ce site.
              </p>
              <p>
                Si vous réservez une toile, j'aimerais pouvoir vous la demander pendant quinze jours pour ma toute première exposition. Je prendrai en charge le transport aller-retour et l'assurance, et vous serez naturellement invité en tant qu'hôte d'honneur.
              </p>
              <p>
                N'hésitez pas à{' '}
                <a
                  href="mailto:guillaume@guillaumefarre.com"
                  className="underline hover:text-zinc-600 transition-colors"
                >
                  m'écrire
                </a>, je serais heureux de vous connaître et de vous inviter à visiter l'atelier.
              </p>
            </div>

            {/* Signature */}
            <div className="pt-4 font-light text-zinc-700 tracking-wider">
              Guillaume
            </div>

            {/* Compteur */}
            <div className="pt-6 text-sm text-zinc-500 font-light tracking-wide text-center">
              Ouverture au public dans {days} jour{days > 1 ? 's' : ''}
            </div>

            {/* Bouton */}
            <div className="pt-4 sm:pt-6 flex justify-center">
              <button
                onClick={handleClose}
                className="
                  px-8 sm:px-12 py-3.5 sm:py-4
                  bg-white
                  text-black
                  border border-zinc-300
                  font-light
                  tracking-wider
                  uppercase
                  text-sm
                  hover:bg-zinc-50
                  hover:border-zinc-400
                  transition-all
                  duration-300
                  min-h-[44px]
                "
              >
                Découvrir l'atelier
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Lalou
