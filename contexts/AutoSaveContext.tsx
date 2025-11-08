"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  const [showIndicator, setShowIndicator] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const hideIndicatorTimeoutRef = useRef<NodeJS.Timeout>();

  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  const saveNow = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    setShowIndicator(true);

    try {
      // Appeler la fonction de sauvegarde personnalisée si fournie
      if (onSave) {
        await onSave();
      } else {
        // Simuler une sauvegarde
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setLastSaved(new Date());
      setIsDirty(false);

      // Afficher un toast de succès subtil
      toast.success("Modifications sauvegardées", {
        duration: 2000,
        position: "bottom-right",
      });

      // Masquer l'indicateur après 3 secondes
      if (hideIndicatorTimeoutRef.current) {
        clearTimeout(hideIndicatorTimeoutRef.current);
      }
      hideIndicatorTimeoutRef.current = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur de sauvegarde", {
        description: "Les modifications n'ont pas pu être sauvegardées",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onSave]);

  const toggleAutoSave = useCallback(() => {
    setAutoSaveEnabled(prev => !prev);
    if (!autoSaveEnabled) {
      toast.info("Sauvegarde automatique activée");
    } else {
      toast.info("Sauvegarde automatique désactivée");
    }
  }, [autoSaveEnabled]);

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
      <AutoSaveIndicator
        show={showIndicator || isSaving || isDirty}
        isSaving={isSaving}
        isDirty={isDirty}
        lastSaved={lastSaved}
        autoSaveEnabled={autoSaveEnabled}
      />
    </AutoSaveContext.Provider>
  );
}

// Composant indicateur visuel de sauvegarde
function AutoSaveIndicator({
  show,
  isSaving,
  isDirty,
  lastSaved,
  autoSaveEnabled,
}: {
  show: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
}) {
  const getStatusText = () => {
    if (isSaving) return "Sauvegarde en cours...";
    if (isDirty) return "Modifications non sauvegardées";
    if (lastSaved) {
      const secondsAgo = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      if (secondsAgo < 60) return `Sauvegardé il y a ${secondsAgo}s`;
      const minutesAgo = Math.floor(secondsAgo / 60);
      if (minutesAgo < 60) return `Sauvegardé il y a ${minutesAgo}min`;
      return `Sauvegardé à ${lastSaved.toLocaleTimeString()}`;
    }
    return "Tout est à jour";
  };

  const getStatusColor = () => {
    if (isSaving) return "bg-blue-500";
    if (isDirty) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusIcon = () => {
    if (isSaving) return "⏳";
    if (isDirty) return "⚠️";
    return "✅";
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 left-8 z-50"
        >
          <div className={`${getStatusColor()} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
            {/* Icône animée */}
            <motion.span
              animate={isSaving ? { rotate: 360 } : {}}
              transition={isSaving ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              className="text-xl"
            >
              {getStatusIcon()}
            </motion.span>

            {/* Texte de statut */}
            <div className="flex flex-col">
              <span className="font-medium">{getStatusText()}</span>
              {autoSaveEnabled && !isSaving && (
                <span className="text-xs opacity-80">
                  Sauvegarde auto activée
                </span>
              )}
            </div>

            {/* Indicateur de progression pour la sauvegarde */}
            {isSaving && (
              <div className="ml-2">
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}

            {/* Badge pour modifications non sauvegardées */}
            {isDirty && !isSaving && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto bg-white/20 px-2 py-1 rounded text-xs"
              >
                Cmd+S
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook personnalisé pour utiliser l'auto-save dans les formulaires
export function useAutoSaveForm<T extends Record<string, any>>(
  initialValues: T,
  onSave: (values: T) => Promise<void>
) {
  const { markDirty, markClean } = useAutoSave();
  const [values, setValues] = useState<T>(initialValues);
  const prevValuesRef = useRef<T>(initialValues);

  // Détecter les changements
  useEffect(() => {
    const hasChanges = JSON.stringify(values) !== JSON.stringify(prevValuesRef.current);
    if (hasChanges) {
      markDirty();
    } else {
      markClean();
    }
  }, [values, markDirty, markClean]);

  // Fonction pour mettre à jour une valeur
  const updateValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  // Fonction pour sauvegarder
  const save = useCallback(async () => {
    await onSave(values);
    prevValuesRef.current = values;
    markClean();
  }, [values, onSave, markClean]);

  return {
    values,
    updateValue,
    save,
    reset: () => {
      setValues(initialValues);
      prevValuesRef.current = initialValues;
      markClean();
    },
  };
}

// Lalou