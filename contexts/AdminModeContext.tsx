"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface AdminModeContextType {
  isAdminMode: boolean;
  setAdminMode: (value: boolean) => void;
  pendingChanges: Map<string, string>;
  setPendingChange: (key: string, value: string) => void;
  saveAllChanges: () => Promise<boolean>;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

const AdminModeContext = createContext<AdminModeContextType | null>(null);

/**
 * Provider pour le mode administration
 * Activé via ?admin=true dans l'URL
 *
 * @author Lalou
 * @date 2025-11-30
 */
export function AdminModeProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [isAdminMode, setAdminMode] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, string>>(new Map());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const adminParam = searchParams.get("admin");
    setAdminMode(adminParam === "true");
  }, [searchParams]);

  const setPendingChange = (key: string, value: string) => {
    setPendingChanges((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  };

  const saveAllChanges = async (): Promise<boolean> => {
    if (pendingChanges.size === 0) return true;

    setIsSaving(true);
    try {
      const changes = Object.fromEntries(pendingChanges);
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes, locale: "fr" }),
      });

      if (res.ok) {
        setPendingChanges(new Map());
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminModeContext.Provider
      value={{
        isAdminMode,
        setAdminMode,
        pendingChanges,
        setPendingChange,
        saveAllChanges,
        hasUnsavedChanges: pendingChanges.size > 0,
        isSaving,
      }}
    >
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  const context = useContext(AdminModeContext);
  if (!context) {
    throw new Error("useAdminMode must be used within AdminModeProvider");
  }
  return context;
}
