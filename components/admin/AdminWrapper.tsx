"use client";

import { Suspense, ReactNode } from "react";
import { AdminModeProvider } from "@/contexts/AdminModeContext";
import AdminToolbar from "./AdminToolbar";
import AdminOnboarding from "./AdminOnboarding";

/**
 * Wrapper pour le mode admin
 * Encapsule le provider, l'onboarding et la toolbar
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function AdminWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdminModeProvider>
        {children}
        <AdminOnboarding />
        <AdminToolbar />
      </AdminModeProvider>
    </Suspense>
  );
}
