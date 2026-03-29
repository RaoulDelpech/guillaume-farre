"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  type: "pricing" | "description" | "category" | "seo" | "trend";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action?: string;
  icon: string;
  autoApply?: boolean;
}

interface PhotoItem {
  description?: string;
  price?: number;
  categories?: string[];
  alt?: string;
}

interface PhotoAnalysis {
  quality: number;
  composition: string;
  lighting: string;
  marketValue: string;
  suggestedCategories: string[];
  suggestedTags: string[];
  similarPhotos: number;
  salesPotential: string;
}

interface AIAssistantProps {
  photos?: PhotoItem[];
  onApplySuggestion?: (suggestion: Suggestion) => void;
}

export default function AIAssistant({ photos = [], onApplySuggestion }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [currentPhotoAnalysis, setCurrentPhotoAnalysis] = useState<PhotoAnalysis | null>(null);

  // Messages de l'assistant
  const assistantMessages = [
    "Je remarque que certaines photos n'ont pas de description...",
    "Les prix de vos éditions limitées sont très compétitifs!",
    "Voulez-vous que je génère des tags Instagram?",
    "J'ai détecté 3 photos similaires, voulez-vous créer une série?",
    "Conseil: Les photos avec descriptions détaillées se vendent 40% mieux",
  ];

  const [currentMessage, setCurrentMessage] = useState(assistantMessages[0]);

  useEffect(() => {
    // Changer le message toutes les 10 secondes
    const interval = setInterval(() => {
      setCurrentMessage(assistantMessages[Math.floor(Math.random() * assistantMessages.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Analyser les photos au chargement
    if (photos.length > 0) {
      analyzePhotos();
    }
  }, [photos]);

  const analyzePhotos = async () => {
    setIsAnalyzing(true);

    // Simuler une analyse IA
    setTimeout(() => {
      const newSuggestions: Suggestion[] = [];

      // Analyser les photos sans description
      const photosWithoutDescription = photos.filter((p) => !p.description);
      if (photosWithoutDescription.length > 0) {
        newSuggestions.push({
          id: "desc-1",
          type: "description",
          priority: "high",
          title: `${photosWithoutDescription.length} photos sans description`,
          description: "Les descriptions augmentent les ventes de 40%. Je peux les générer automatiquement.",
          action: "generate-descriptions",
          icon: "✍️",
          autoApply: true
        });
      }

      // Analyser les prix
      const avgPrice = photos.reduce((sum: number, p) => sum + (p.price || 0), 0) / photos.length;
      if (avgPrice < 300) {
        newSuggestions.push({
          id: "price-1",
          type: "pricing",
          priority: "medium",
          title: "Prix moyens bas détectés",
          description: `Prix moyen: ${avgPrice.toFixed(0)}€. Les œuvres similaires se vendent entre 400-600€.`,
          action: "adjust-prices",
          icon: "💶",
          autoApply: false
        });
      }

      // Suggérer des catégories
      const uncategorized = photos.filter((p) => !p.categories || p.categories.length === 0);
      if (uncategorized.length > 0) {
        newSuggestions.push({
          id: "cat-1",
          type: "category",
          priority: "medium",
          title: `${uncategorized.length} photos non catégorisées`,
          description: "Je peux analyser et suggérer des catégories automatiquement.",
          action: "auto-categorize",
          icon: "🏷️",
          autoApply: true
        });
      }

      // Tendances du marché
      newSuggestions.push({
        id: "trend-1",
        type: "trend",
        priority: "low",
        title: "Tendance: Art automobile en hausse",
        description: "Les œuvres Ferrari se vendent +23% ce mois. Moment idéal pour publier.",
        icon: "📈",
        autoApply: false
      });

      // SEO
      const photosWithoutAlt = photos.filter((p) => !p.alt);
      if (photosWithoutAlt.length > 0) {
        newSuggestions.push({
          id: "seo-1",
          type: "seo",
          priority: "low",
          title: "Optimisation SEO disponible",
          description: `${photosWithoutAlt.length} photos sans texte alternatif. Important pour le référencement.`,
          action: "generate-alt",
          icon: "🔍",
          autoApply: true
        });
      }

      setSuggestions(newSuggestions);
      setIsAnalyzing(false);

      // Auto-appliquer si activé
      if (autoMode) {
        newSuggestions
          .filter(s => s.autoApply && s.priority === "high")
          .forEach(s => {
            setTimeout(() => applySuggestion(s), 2000);
          });
      }
    }, 2000);
  };

  const applySuggestion = (suggestion: Suggestion) => {
    if (appliedSuggestions.has(suggestion.id)) {
      toast.info("Cette suggestion a déjà été appliquée");
      return;
    }

    switch (suggestion.action) {
      case "generate-descriptions":
        toast.success("Génération des descriptions en cours...", {
          description: "L'IA analyse vos photos et crée des descriptions uniques"
        });
        // Simuler la génération
        setTimeout(() => {
          toast.success("Descriptions générées pour 12 photos!");
          setAppliedSuggestions(new Set([...appliedSuggestions, suggestion.id]));
        }, 3000);
        break;

      case "adjust-prices":
        toast.info("Ajustement des prix suggéré", {
          action: {
            label: "Appliquer",
            onClick: () => {
              toast.success("Prix optimisés selon le marché");
              setAppliedSuggestions(new Set([...appliedSuggestions, suggestion.id]));
            }
          }
        });
        break;

      case "auto-categorize":
        toast.success("Catégorisation automatique en cours...");
        setTimeout(() => {
          toast.success("Photos catégorisées avec succès!");
          setAppliedSuggestions(new Set([...appliedSuggestions, suggestion.id]));
        }, 2000);
        break;

      case "generate-alt":
        toast.success("Génération des textes alternatifs...");
        setTimeout(() => {
          toast.success("SEO optimisé pour toutes les photos!");
          setAppliedSuggestions(new Set([...appliedSuggestions, suggestion.id]));
        }, 1500);
        break;

      default:
        toast.info("Suggestion notée");
    }

    // Callback vers le parent
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
  };

  const dismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
    toast.info("Suggestion ignorée");
  };

  const analyzePhoto = async (_photo: PhotoItem) => {
    setCurrentPhotoAnalysis(null);
    setIsAnalyzing(true);

    // Simuler une analyse détaillée
    setTimeout(() => {
      setCurrentPhotoAnalysis({
        quality: 92,
        composition: "Excellente",
        lighting: "Naturelle parfaite",
        marketValue: "500-800€",
        suggestedCategories: ["limited", "empreintes"],
        suggestedTags: ["#ferrari", "#artautomobile", "#contemporaryart", "#limitededition"],
        similarPhotos: 3,
        salesPotential: "Très élevé"
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <>
      {/* Bouton flottant de l'assistant */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white z-40"
      >
        <span className="text-2xl">🤖</span>
        {suggestions.filter(s => s.priority === "high").length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {suggestions.filter(s => s.priority === "high").length}
          </span>
        )}
      </motion.button>

      {/* Panneau de l'assistant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className={`fixed ${isMinimized ? "bottom-8" : "top-0"} right-0 ${isMinimized ? "w-80" : "w-96"} ${isMinimized ? "h-20" : "h-full"} bg-white shadow-2xl z-50 flex flex-col`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-semibold">Assistant IA</h3>
                    {!isMinimized && (
                      <p className="text-xs opacity-90">{currentMessage}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white/70 hover:text-white"
                  >
                    {isMinimized ? "⬆" : "⬇"}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Mode automatique */}
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mode automatique</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoMode}
                        onChange={(e) => setAutoMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Applique automatiquement les suggestions prioritaires
                  </p>
                </div>

                {/* Suggestions */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {isAnalyzing ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Analyse en cours...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg border ${
                          suggestion.priority === "high"
                            ? "border-red-200 bg-red-50"
                            : suggestion.priority === "medium"
                            ? "border-yellow-200 bg-yellow-50"
                            : "border-gray-200 bg-gray-50"
                        } ${appliedSuggestions.has(suggestion.id) ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{suggestion.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>

                            {!appliedSuggestions.has(suggestion.id) && (
                              <div className="flex gap-2 mt-2">
                                {suggestion.action && (
                                  <button
                                    onClick={() => applySuggestion(suggestion)}
                                    className="text-xs bg-white px-3 py-1 rounded border hover:bg-gray-50"
                                  >
                                    Appliquer
                                  </button>
                                )}
                                <button
                                  onClick={() => dismissSuggestion(suggestion.id)}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  Ignorer
                                </button>
                              </div>
                            )}

                            {appliedSuggestions.has(suggestion.id) && (
                              <p className="text-xs text-green-600 mt-2">✓ Appliqué</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <span className="text-4xl">✨</span>
                      <p className="mt-3 text-sm">Tout est optimisé!</p>
                      <p className="text-xs mt-1">Je continue à surveiller vos photos</p>
                    </div>
                  )}
                </div>

                {/* Analyse photo individuelle */}
                {currentPhotoAnalysis && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-t">
                    <h4 className="font-medium text-sm mb-3">Analyse de la photo</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Qualité</span>
                        <span className="font-medium">{currentPhotoAnalysis.quality}/100</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Valeur estimée</span>
                        <span className="font-medium">{currentPhotoAnalysis.marketValue}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Potentiel de vente</span>
                        <span className="font-medium text-green-600">{currentPhotoAnalysis.salesPotential}</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-1">Tags suggérés:</p>
                        <div className="flex flex-wrap gap-1">
                          {currentPhotoAnalysis.suggestedTags.map((tag: string) => (
                            <span key={tag} className="text-xs bg-white px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions rapides */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={analyzePhotos}
                      className="bg-white border rounded-lg p-2 text-xs hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      🔄 Réanalyser
                    </button>
                    <button
                      onClick={() => toast.info("Rapport en cours de génération...")}
                      className="bg-white border rounded-lg p-2 text-xs hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      📊 Rapport
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications flottantes de l'assistant */}
      <AnimatePresence>
        {!isOpen && suggestions.filter(s => s.priority === "high").length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-28 right-8 bg-white rounded-lg shadow-lg p-3 max-w-xs z-30"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💡</span>
              <p className="text-sm font-medium">Suggestion importante</p>
            </div>
            <p className="text-xs text-gray-600">
              {suggestions.find(s => s.priority === "high")?.title}
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="text-xs text-blue-600 mt-2 hover:underline"
            >
              Voir détails →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Lalou