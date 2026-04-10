"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BatchOperation } from "./types";
import { groupOperationsByCategory, getCategoryLabel, getDangerColor } from "./operations-config";

interface ExpandedPanelProps {
  isExpanded: boolean;
  operations: BatchOperation[];
  quickMode: boolean;
  processing: boolean;
  onExecute: (operationId: string) => void;
}

export default function ExpandedPanel({
  isExpanded,
  operations,
  quickMode,
  processing,
  onExecute
}: ExpandedPanelProps) {
  const groupedOperations = groupOperationsByCategory(operations);

  return (
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
                  {getCategoryLabel(category)}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {ops.map(op => (
                    <button
                      key={op.id}
                      onClick={() => onExecute(op.id)}
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
  );
}

// Lalou
