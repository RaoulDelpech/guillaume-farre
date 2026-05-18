"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ReservationsStats } from "@/components/admin/reservations/ReservationsStats";
import { ReservationsFilters } from "@/components/admin/reservations/ReservationsFilters";
import { ReservationsTable } from "@/components/admin/reservations/ReservationsTable";
import {
  PAGE_SIZE,
  Reservation,
  Stats,
  ToileLite,
} from "@/components/admin/reservations/types";

/**
 * Page admin liste des reservations VIP enrichie (Sprint 7).
 *
 * Compose 4 sous-composants : stats, filtres, table, export button.
 * La logique de fetch + pagination + filtres reste dans cette page maitre.
 *
 * @author Lalou
 */
export default function AdminVipReservationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [toiles, setToiles] = useState<ToileLite[]>([]);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedCanvasId, setSelectedCanvasId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    void loadData();
  }, [selectedStatuses, selectedModes, selectedCanvasId, search]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedStatuses.length) params.set("status", selectedStatuses.join(","));
      if (selectedModes.length) params.set("mode", selectedModes.join(","));
      if (selectedCanvasId) params.set("canvasId", selectedCanvasId);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/reservations?${params.toString()}`);
      if (res.status === 401) {
        router.push("/fr/login");
        return;
      }
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      setReservations(data.reservations || []);
      setStats(data.stats || null);
      setToiles(data.toiles || []);
      setPage(1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function toggleStatus(status: string) {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  }

  function toggleMode(mode: string) {
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode],
    );
  }

  function clearFilters() {
    setSelectedStatuses([]);
    setSelectedModes([]);
    setSelectedCanvasId("");
    setSearch("");
  }

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedStatuses.length) params.set("status", selectedStatuses.join(","));
    if (selectedModes.length) params.set("mode", selectedModes.join(","));
    if (selectedCanvasId) params.set("canvasId", selectedCanvasId);
    if (search.trim()) params.set("search", search.trim());
    return `/api/admin/reservations/export.csv?${params.toString()}`;
  }, [selectedStatuses, selectedModes, selectedCanvasId, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reservations.slice(start, start + PAGE_SIZE);
  }, [reservations, page]);

  const totalPages = Math.max(1, Math.ceil(reservations.length / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Link
            href="/fr/admin/vip"
            className="text-sm text-zinc-400 hover:text-[#C4A570] transition-colors"
          >
            ← Admin VIP
          </Link>
          <h1 className="mt-3 text-3xl md:text-4xl font-extralight tracking-[0.08em] uppercase">
            Réservations VIP
          </h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Toutes les réservations toiles : suivi, statuts, actions admin.
          </p>
        </div>

        <ReservationsStats stats={stats} />

        <ReservationsFilters
          search={search}
          selectedStatuses={selectedStatuses}
          selectedModes={selectedModes}
          selectedCanvasId={selectedCanvasId}
          toiles={toiles}
          exportUrl={exportUrl}
          onSearchChange={setSearch}
          onToggleStatus={toggleStatus}
          onToggleMode={toggleMode}
          onCanvasChange={setSelectedCanvasId}
          onClear={clearFilters}
        />

        {loading && <div className="text-zinc-500 py-12 text-center">Chargement…</div>}
        {error && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded p-4">
            {error}
          </div>
        )}

        {!loading && !error && reservations.length === 0 && (
          <div className="text-zinc-500 py-12 text-center border border-zinc-800 rounded">
            Aucune réservation ne correspond aux filtres.
          </div>
        )}

        {!loading && !error && reservations.length > 0 && (
          <ReservationsTable
            reservations={reservations}
            paginated={paginated}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

// Lalou
