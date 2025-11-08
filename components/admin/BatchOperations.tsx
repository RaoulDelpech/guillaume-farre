"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface BatchOperation {
  id: string;
  label: string;
  icon: string;
  description: string;
  category: "edit" | "organize" | "publish" | "export";
  requiresConfirmation?: boolean;
  dangerLevel?: "low" | "medium" | "high";
}

interface BatchOperationsProps {
  selectedItems: string[];
  onOperation: (operationId: string, items: string[]) => Promise<void>;
  totalItems: number;
}

export default function BatchOperations({
  selectedItems,
  onOperation,
  totalItems
}: BatchOperationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmOperation, setConfirmOperation] = useState<BatchOperation | null>(null);
  const [quickMode, setQuickMode] = useState(false);

  const operations: BatchOperation[] = [
    // Edit Operations
    {
      id: "resize",
      label: "Redimensionner",
      icon: "📐",
      description: "Ajuster la taille de toutes les images sélectionnées",
      category: "edit",
      dangerLevel: "low"
    },
    {
      id: "watermark",
      label: "Filigrane",
      icon: "💧",
      description: "Ajouter votre signature sur les photos",
      category: "edit",
      dangerLevel: "low"
    },
    {
      id: "compress",
      label: "Compresser",
      icon: "📦",
      description: "Optimiser le poids des images pour le web",
      category: "edit",
      dangerLevel: "low"
    },
    {
      id: "convert",
      label: "Convertir format",
      icon: "🔄",
      description: "Changer le format (JPG, PNG, WebP)",
      category: "edit",
      dangerLevel: "medium"
    },

    // Organize Operations
    {
      id: "categorize",
      label: "Catégoriser",
      icon: "🏷️",
      description: "Assigner des catégories en masse",
      category: "organize",
      dangerLevel: "low"
    },
    {
      id: "add-tags",
      label: "Ajouter tags",
      icon: "🔖",
      description: "Ajouter des mots-clés pour le référencement",
      category: "organize",
      dangerLevel: "low"
    },
    {
      id: "move-series",
      label: "Déplacer série",
      icon: "📂",
      description: "Déplacer vers une autre série",
      category: "organize",
      dangerLevel: "medium"
    },
    {
      id: "set-price",
      label: "Définir prix",
      icon: "💶",
      description: "Appliquer un prix uniforme",
      category: "organize",
      dangerLevel: "medium"
    },

    // Publish Operations
    {
      id: "publish",
      label: "Publier",
      icon: "🚀",
      description: "Rendre visible sur le site",
      category: "publish",
      dangerLevel: "medium",
      requiresConfirmation: true
    },
    {
      id: "unpublish",
      label: "Dépublier",
      icon: "👁️‍🗨️",
      description: "Masquer temporairement du site",
      category: "publish",
      dangerLevel: "medium",
      requiresConfirmation: true
    },
    {
      id: "schedule",
      label: "Planifier",
      icon: "📅",
      description: "Programmer la publication",
      category: "publish",
      dangerLevel: "low"
    },
    {
      id: "feature",
      label: "Mettre en avant",
      icon: "⭐",
      description: "Marquer comme œuvre phare",
      category: "publish",
      dangerLevel: "low"
    },

    // Export Operations
    {
      id: "export-zip",
      label: "Export ZIP",
      icon: "📦",
      description: "Télécharger en archive compressée",
      category: "export",
      dangerLevel: "low"
    },
    {
      id: "generate-pdf",
      label: "Créer PDF",
      icon: "📄",
      description: "Générer un portfolio PDF",
      category: "export",
      dangerLevel: "low"
    },
    {
      id: "export-metadata",
      label: "Export données",
      icon: "📊",
      description: "Exporter les métadonnées CSV",
      category: "export",
      dangerLevel: "low"
    },
    {
      id: "delete",
      label: "Supprimer",
      icon: "🗑️",
      description: "Mettre à la corbeille",
      category: "export",
      dangerLevel: "high",
      requiresConfirmation: true
    }
  ];

  // Grouper les opérations par catégorie
  const groupedOperations = operations.reduce((acc, op) => {
    if (!acc[op.category]) acc[op.category] = [];
    acc[op.category].push(op);
    return acc;
  }, {} as Record<string, BatchOperation[]>);

  // Raccourcis clavier pour mode rapide
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedItems.length) return;

      // Cmd+Shift+B pour toggle batch mode
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setQuickMode(!quickMode);
      }

      // Mode rapide activé
      if (quickMode) {
        // P pour publier
        if (e.key === "p") executeOperation("publish");
        // D pour supprimer
        if (e.key === "d") executeOperation("delete");
        // T pour tagger
        if (e.key === "t") executeOperation("add-tags");
        // E pour exporter
        if (e.key === "e") executeOperation("export-zip");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [quickMode, selectedItems]);

  const executeOperation = async (operationId: string) => {
    const operation = operations.find(op => op.id === operationId);
    if (!operation) return;

    // Demander confirmation si nécessaire
    if (operation.requiresConfirmation && !confirmOperation) {
      setConfirmOperation(operation);
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      // Simuler le traitement avec progression
      const totalSteps = selectedItems.length;
      for (let i = 0; i < totalSteps; i++) {
        await onOperation(operationId, [selectedItems[i]]);
        setProgress(((i + 1) / totalSteps) * 100);

        // Petite pause pour voir la progression
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      toast.success(
        `✅ ${operation.label} appliqué à ${selectedItems.length} éléments`,
        { duration: 3000 }
      );

      // Reset après succès
      setConfirmOperation(null);
    } catch (error) {
      toast.error(`Erreur lors de l'opération ${operation.label}`);
      console.error(error);
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const getDangerColor = (level?: string) => {
    switch (level) {
      case "high": return "text-red-600 hover:bg-red-50";
      case "medium": return "text-orange-600 hover:bg-orange-50";
      default: return "text-gray-700 hover:bg-gray-50";
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Barre flottante d'opérations batch */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          {/* Header avec infos de sélection */}
          <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">
                {selectedItems.length} / {totalItems} sélectionnés
              </span>

              {/* Indicateur de mode rapide */}
              {quickMode && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-green-500 text-xs px-2 py-1 rounded-full"
                >
                  ⚡ Mode rapide
                </motion.span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle mode rapide */}
              <button
                onClick={() => setQuickMode(!quickMode)}
                className="text-xs bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 transition-colors"
                title="Mode rapide (Cmd+Shift+B)"
              >
                {quickMode ? "Mode normal" : "Mode rapide"}
              </button>

              {/* Toggle expand/collapse */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                {isExpanded ? "▼" : "▲"}
              </button>
            </div>
          </div>

          {/* Actions rapides toujours visibles */}
          <div className="px-4 py-3 flex items-center gap-2 bg-gray-50">
            <button
              onClick={() => executeOperation("publish")}
              disabled={processing}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🚀</span>
              <span>Publier</span>
            </button>

            <button
              onClick={() => executeOperation("add-tags")}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🏷️</span>
              <span>Tagger</span>
            </button>

            <button
              onClick={() => executeOperation("set-price")}
              disabled={processing}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>💶</span>
              <span>Tarifer</span>
            </button>

            <div className="flex-1" />

            <button
              onClick={() => executeOperation("delete")}
              disabled={processing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🗑️</span>
              <span>Supprimer</span>
            </button>
          </div>

          {/* Panneau étendu avec toutes les opérations */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t"
              >
                <div className="max-h-96 overflow-y-auto p-4">
                  {Object.entries(groupedOperations).map(([category, ops]) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-xs uppercase text-gray-500 font-semibold mb-2">
                        {category === "edit" ? "Édition" :
                         category === "organize" ? "Organisation" :
                         category === "publish" ? "Publication" : "Export"}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {ops.map(op => (
                          <button
                            key={op.id}
                            onClick={() => executeOperation(op.id)}
                            disabled={processing}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                              getDangerColor(op.dangerLevel)
                            } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <span className="text-2xl">{op.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{op.label}</p>
                              <p className="text-xs opacity-70">{op.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Info raccourcis clavier */}
                  {quickMode && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        Raccourcis mode rapide :
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
                        <div>P - Publier</div>
                        <div>D - Supprimer</div>
                        <div>T - Tagger</div>
                        <div>E - Exporter</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barre de progression */}
          {processing && (
            <div className="relative h-1 bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute inset-y-0 left-0 bg-blue-600"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {confirmOperation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmOperation(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{confirmOperation.icon}</div>
                <h2 className="text-2xl font-bold mb-2">
                  Confirmer : {confirmOperation.label}
                </h2>
                <p className="text-gray-600">
                  Cette action sera appliquée à {selectedItems.length} éléments.
                  {confirmOperation.dangerLevel === "high" && (
                    <span className="block mt-2 text-red-600 font-semibold">
                      ⚠️ Cette action est irréversible !
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmOperation(null)}
                  className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => executeOperation(confirmOperation.id)}
                  className={`flex-1 px-6 py-3 rounded-lg text-white transition-colors ${
                    confirmOperation.dangerLevel === "high"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Lalou