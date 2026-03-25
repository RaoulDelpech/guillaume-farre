"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { isEarlyAccess } from '@/lib/early-access';

export default function EngagementsClient() {
  const router = useRouter();
  const locale = useLocale();
  const { engagementsAccepted, acceptEngagements } = useCart();
  const [accepted, setAccepted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Si pas en early access, rediriger vers panier
      if (!isEarlyAccess()) {
        router.push(`/${locale}/panier`);
        return;
      }

      // Si engagements déjà acceptés, rediriger vers panier
      if (engagementsAccepted) {
        router.push(`/${locale}/panier`);
        return;
      }
    }
  }, [isClient, engagementsAccepted, router, locale]);

  const handleConfirm = () => {
    if (!accepted) return;

    acceptEngagements();
    router.push(`/${locale}/panier`);
  };

  if (!isClient) {
    return null; // Éviter le flash pendant hydration
  }

  return (
    <div className="max-w-3xl mx-auto py-10 sm:py-16 px-4">
      {/* En-tete */}
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-2xl sm:text-4xl font-light mb-3 sm:mb-4">Avant de confirmer votre reservation</h1>
        <p className="text-base sm:text-xl text-muted-foreground">
          En reservant une oeuvre avant l'ouverture officielle du 15 mai 2026, vous vous engagez sur les points suivants.
        </p>
      </div>

      {/* Section 1 : Confidentialite */}
      <div className="mb-8 sm:mb-12 p-5 sm:p-8 bg-card border border-border rounded-xl">
        <h2 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Confidentialite</h2>
        <p className="text-muted-foreground leading-relaxed">
          Nous vous demandons de ne rien publier concernant le site, les œuvres ou les prix avant le 15 mai 2026 —
          ni sur les réseaux sociaux, ni dans la presse. Le bouche-à-oreille privé auprès de vos proches est
          bien entendu autorisé.
        </p>
      </div>

      {/* Section 2 : Pret pour exposition */}
      <div className="mb-8 sm:mb-12 p-5 sm:p-8 bg-card border border-border rounded-xl">
        <h2 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Pret pour la premiere exposition</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Si Guillaume Farré vous le demande (avec un préavis de 30 jours minimum), vous acceptez de mettre
          votre œuvre à sa disposition pendant 15 jours maximum pour sa toute première exposition.
          Ce prêt ne peut être demandé qu'une seule fois, avant le 31 décembre 2026.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          L'ensemble des frais (transport aller-retour, assurance tous risques) sont intégralement pris en charge
          par Guillaume Farré. En cas de dommage, l'œuvre sera remplacée à l'identique ou intégralement remboursée,
          à votre choix.
        </p>
      </div>

      {/* Section 3 : Invitation VIP */}
      <div className="mb-8 sm:mb-12 p-5 sm:p-8 bg-card border border-border rounded-xl">
        <h2 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Votre invitation</h2>
        <p className="text-muted-foreground leading-relaxed">
          En contrepartie, vous serez invité en tant qu'hôte d'honneur à la première exposition de Guillaume Farré.
          Vous recevrez votre invitation personnelle dès que les détails seront annoncés.
        </p>
      </div>

      {/* Lien vers conditions complètes */}
      <div className="mb-8 text-center">
        <a
          href="/cgv"
          target="_blank"
          className="text-sm text-muted-foreground hover:text-primary underline transition-colors"
        >
          Lire les conditions détaillées
        </a>
      </div>

      {/* Checkbox */}
      <div className="mb-6 sm:mb-8">
        <label className="flex items-start gap-3 cursor-pointer group min-h-[44px]">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 w-6 h-6 rounded border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer flex-shrink-0"
          />
          <span className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors">
            J'ai lu et j'accepte les engagements ci-dessus
          </span>
        </label>
      </div>

      {/* Bouton de confirmation */}
      <button
        onClick={handleConfirm}
        disabled={!accepted}
        className="w-full px-6 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black min-h-[48px]"
      >
        Confirmer et proceder au paiement
      </button>

      {/* Note de sécurité */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Paiement sécurisé · Certificat d'authenticité inclus · Livraison assurée offerte</p>
      </div>
    </div>
  );
}

// Lalou
