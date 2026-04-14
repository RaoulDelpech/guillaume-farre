"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { BatchOperation } from "./batch/types";
import type { BatchOperationsProps } from "./batch/types";
import { batchOperations } from "./batch/operations-config";
import ConfirmationModal from "./batch/ConfirmationModal";
import ExpandedPanel from "./batch/ExpandedPanel";

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedItems.length) return;

      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setQuickMode(!quickMode);
      }

      if (quickMode) {
        if (e.key === "p") executeOperation("publish");
        if (e.key === "d") executeOperation("delete");
        if (e.key === "t") executeOperation("add-tags");
        if (e.key === "e") executeOperation("export-zip");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [quickMode, selectedItems]);

  const executeOperation = async (operationId: string) => {
    const operation = batchOperations.find(op => op.id === operationId);
    if (!operation) return;

    if (operation.requiresConfirmation && !confirmOperation) {
      setConfirmOperation(operation);
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      const totalSteps = selectedItems.length;
      for (let i = 0; i < totalSteps; i++) {
        await onOperation(operationId, [selectedItems[i]]);
        setProgress(((i + 1) / totalSteps) * 100);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      toast.success(
        `✅ ${operation.label} appliqué à ${selectedItems.length} éléments`,
        { duration: 3000 }
      );
      setConfirmOperation(null);
    } catch (error) {
      toast.error(`Erreur lors de l'opération ${operation.label}`);
      console.error(error);
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  if (selectedItems.length === 0) return null;

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">
                {selectedItems.length} / {totalItems} sélectionnés
              </span>
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
              <button
                onClick={() => setQuickMode(!quickMode)}
                className="text-xs bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 transition-colors"
                title="Mode rapide (Cmd+Shift+B)"
              >
                {quickMode ? "Mode normal" : "Mode rapide"}
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                {isExpanded ? "▼" : "▲"}
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="px-4 py-3 flex items-center gap-2 bg-gray-50">
            <button onClick={() => executeOperation("publish")} disabled={processing}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <span>🚀</span><span>Publier</span>
            </button>
            <button onClick={() => executeOperation("add-tags")} disabled={processing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <span>🏷️</span><span>Tagger</span>
            </button>
            <button onClick={() => executeOperation("set-price")} disabled={processing}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <span>💶</span><span>Tarifer</span>
            </button>
            <div className="flex-1" />
            <button onClick={() => executeOperation("delete")} disabled={processing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <span>🗑️</span><span>Supprimer</span>
            </button>
          </div>

          <ExpandedPanel
            isExpanded={isExpanded}
            operations={batchOperations}
            quickMode={quickMode}
            processing={processing}
            onExecute={executeOperation}
          />

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

      <ConfirmationModal
        operation={confirmOperation}
        selectedCount={selectedItems.length}
        onConfirm={executeOperation}
        onCancel={() => setConfirmOperation(null)}
      />
    </>
  );
}

// Lalou
