"use client";

import { Suspense, ReactNode } from "react";
import { AdminModeProvider } from "@/contexts/AdminModeContext";
import AdminToolbar from "./AdminToolbar";

/**
 * Wrapper pour le mode admin
 * Encapsule le provider et la toolbar
 *
 * @author Lalou
 * @date 2025-11-30
 */
export default function AdminWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdminModeProvider>
        {children}
        <AdminToolbar />
      </AdminModeProvider>
    </Suspense>
  );
}
