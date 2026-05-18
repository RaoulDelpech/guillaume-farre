"use client";

import { ReactNode } from "react";

/**
 * Composant section + ligne clé/valeur pour la page detail reservation.
 *
 * @author Lalou
 */

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 bg-zinc-900/30 border border-zinc-800 rounded p-5">
      <h2 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">{title}</h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

export function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 py-1 text-sm">
      <span className="text-zinc-500 min-w-[160px]">{k}</span>
      <span className={`text-zinc-200 ${mono ? "font-mono text-xs break-all" : ""}`}>{v}</span>
    </div>
  );
}

// Lalou
