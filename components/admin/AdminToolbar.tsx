"use client";

import { useAdminMode } from "@/contexts/AdminModeContext";

/**
 * Barre d'outils flottante en mode admin
 * Affiche le nombre de modifications et bouton sauvegarder
 *
 * @author Lalou
 * @date 2025-11-30
 */
export default function AdminToolbar() {
  const { isAdminMode, hasUnsavedChanges, pendingChanges, saveAllChanges, isSaving } =
    useAdminMode();

  if (!isAdminMode) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
        <span className="font-medium">Mode Édition</span>
      </div>

      {hasUnsavedChanges && (
        <>
          <div className="h-6 w-px bg-white/30" />
          <span className="text-yellow-400">
            {pendingChanges.size} modification{pendingChanges.size > 1 ? "s" : ""}
          </span>
        </>
      )}

      <button
        onClick={saveAllChanges}
        disabled={!hasUnsavedChanges || isSaving}
        className={`px-4 py-2 rounded font-medium transition-all ${
          hasUnsavedChanges
            ? "bg-yellow-400 text-black hover:bg-yellow-300"
            : "bg-white/20 text-white/50 cursor-not-allowed"
        }`}
      >
        {isSaving ? "Sauvegarde..." : "Sauvegarder"}
      </button>

      <a
        href={window.location.pathname}
        className="text-white/60 hover:text-white text-sm"
      >
        Quitter
      </a>
    </div>
  );
}
