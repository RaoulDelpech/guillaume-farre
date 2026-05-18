"use client";

import { Stats, formatEur } from "./types";

/**
 * Bloc de statistiques agregees (6 stats cards + 2 CA cards).
 *
 * @author Lalou
 */
export function ReservationsStats({ stats }: { stats: Stats | null }) {
  if (!stats) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="En attente" value={stats.pending} accent="yellow" />
        <StatCard label="Signées" value={stats.signed} accent="purple" />
        <StatCard label="Acompte" value={stats.partialPaid} accent="blue" />
        <StatCard label="Payées" value={stats.paid} accent="green" />
        <StatCard label="Closes" value={stats.closed} accent="zinc" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <CaCard label="CA encaissé" value={stats.caTotalPaid} />
        <CaCard label="CA encours (acomptes)" value={stats.caEnCours} />
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "yellow" | "purple" | "blue" | "green" | "zinc";
}) {
  const colorClass =
    accent === "yellow"
      ? "text-yellow-300"
      : accent === "purple"
        ? "text-purple-300"
        : accent === "blue"
          ? "text-blue-300"
          : accent === "green"
            ? "text-green-300"
            : accent === "zinc"
              ? "text-zinc-400"
              : "text-white";

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded p-3">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className={`mt-1 text-2xl font-extralight ${colorClass}`}>{value}</p>
    </div>
  );
}

function CaCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-zinc-900/30 border border-[#C4A570]/30 rounded p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-2xl font-extralight text-[#C4A570]">{formatEur(value)}</p>
    </div>
  );
}

// Lalou
