"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BatchOperation } from "./types";

interface ConfirmationModalProps {
  operation: BatchOperation | null;
  selectedCount: number;
  onConfirm: (operationId: string) => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  operation,
  selectedCount,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {operation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
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
              <div className="text-5xl mb-4">{operation.icon}</div>
              <h2 className="text-2xl font-bold mb-2">
                Confirmer : {operation.label}
              </h2>
              <p className="text-gray-600">
                Cette action sera appliquée à {selectedCount} éléments.
                {operation.dangerLevel === "high" && (
                  <span className="block mt-2 text-red-600 font-semibold">
                    ⚠️ Cette action est irréversible !
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => onConfirm(operation.id)}
                className={`flex-1 px-6 py-3 rounded-lg text-white transition-colors ${
                  operation.dangerLevel === "high"
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
  );
}

// Lalou
