"use client";

import { useState, useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import VipManager from "./VipManager";

/**
 * Page admin VIP — autonome pour l'authentification.
 *
 * Au montage, interroge GET /api/admin/check (le cookie gf_admin est HttpOnly,
 * donc le client ne peut pas le lire directement). Tant que le check n'a pas
 * repondu : ecran de chargement sobre. Si non authentifie : ecran de login
 * (le meme que /fr/admin). Une fois connecte, l'interface bascule sur le
 * gestionnaire VIP sans changer d'URL.
 */
export default function AdminVipPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/check", { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) setAuthenticated(true);
        }
      } catch {
        // Reseau KO : on reste non authentifie, l'ecran de login s'affiche.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/50 text-lg font-light tracking-wide">Chargement...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return <VipManager />;
}
