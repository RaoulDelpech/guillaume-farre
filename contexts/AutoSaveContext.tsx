"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface AutoSaveContextType {
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  markDirty: () => void;
  markClean: () => void;
  toggleAutoSave: () => void;
  setAutoSaveInterval: (interval: number) => void;
  saveNow: () => Promise<void>;
}

const AutoSaveContext = createContext<AutoSaveContextType | undefined>(undefined);

export function useAutoSave() {
  const context = useContext(AutoSaveContext);
  if (!context) {
    throw new Error("useAutoSave must be used within AutoSaveProvider");
  }
  return context;
}

interface AutoSaveProviderProps {
  children: React.ReactNode;
  onSave?: () => Promise<void>;
  defaultInterval?: number;
  defaultEnabled?: boolean;
}

export function AutoSaveProvider({
  children,
  onSave,
  defaultInterval = 30000, // 30 secondes par défaut
  defaultEnabled = true,
}: AutoSaveProviderProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(defaultEnabled);
  const [autoSaveInterval, setAutoSaveInterval] = useState(defaultInterval);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  const saveNow = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      if (onSave) {
        await onSave();
      } else {
        // Simuler une sauvegarde
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setLastSaved(new Date());
      setIsDirty(false);
      console.log("✅ Sauvegarde automatique réussie");
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onSave]);

  const toggleAutoSave = useCallback(() => {
    setAutoSaveEnabled(prev => !prev);
  }, []);

  // Sauvegarde automatique périodique
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveNow();
    }, autoSaveInterval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [autoSaveEnabled, isDirty, autoSaveInterval, saveNow]);

  // Raccourci clavier Cmd+S
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveNow();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [saveNow]);

  // Sauvegarder avant de quitter la page si des modifications sont en cours
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Des modifications non sauvegardées seront perdues. Voulez-vous vraiment quitter ?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return (
    <AutoSaveContext.Provider
      value={{
        isDirty,
        isSaving,
        lastSaved,
        autoSaveEnabled,
        autoSaveInterval,
        markDirty,
        markClean,
        toggleAutoSave,
        setAutoSaveInterval,
        saveNow,
      }}
    >
      {children}
    </AutoSaveContext.Provider>
  );
}

// Lalou