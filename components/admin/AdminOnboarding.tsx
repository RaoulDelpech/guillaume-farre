"use client";

import { useState, useEffect } from "react";
import { useAdminMode } from "@/contexts/AdminModeContext";

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Bienvenue en mode édition",
    description:
      "Tu peux maintenant modifier les textes directement sur le site. Clique sur n'importe quel texte surligné en jaune pour le modifier.",
    icon: "✏️",
  },
  {
    title: "Modifier un texte",
    description:
      "Les textes éditables sont entourés d'un contour jaune au survol. Clique dessus, modifie, puis clique ailleurs pour valider.",
    icon: "📝",
  },
  {
    title: "Sauvegarder les modifications",
    description:
      "Une barre flottante apparaît en bas de l'écran quand tu as des modifications en attente. Clique sur \"Sauvegarder\" pour les enregistrer.",
    icon: "💾",
  },
  {
    title: "C'est parti !",
    description:
      "Tu peux fermer cette fenêtre et commencer à personnaliser ton site. Pour revenir en mode normal, retire ?admin=true de l'URL.",
    icon: "🚀",
  },
];

const STORAGE_KEY = "gf_admin_onboarding_completed";

/**
 * Composant d'onboarding pour le mode admin
 * Affiche des modals explicatifs la première fois que l'admin accède au mode édition
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function AdminOnboarding() {
  const { isAdminMode } = useAdminMode();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Vérifie si l'onboarding a déjà été vu
    if (isAdminMode && typeof window !== "undefined") {
      const completed = localStorage.getItem(STORAGE_KEY);
      if (!completed) {
        setShowOnboarding(true);
      }
    }
  }, [isAdminMode]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marque comme complété
      localStorage.setItem(STORAGE_KEY, "true");
      setShowOnboarding(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShowOnboarding(false);
  };

  if (!showOnboarding || !isAdminMode) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header avec progression */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-1.5">
              {ONBOARDING_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx <= currentStep
                      ? "bg-amber-500 w-8"
                      : "bg-gray-200 w-4"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
            >
              Passer
            </button>
          </div>

          {/* Icône */}
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl mb-4">
            {step.icon}
          </div>

          {/* Contenu */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {step.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleNext}
            className="w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors"
          >
            {isLastStep ? "Commencer" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}
