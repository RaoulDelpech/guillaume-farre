"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Download, ExternalLink, ChevronRight } from "lucide-react";

/**
 * Page admin liste des reservations VIP enrichie (Sprint 7).
 *
 * Filtres : statut (multi), mode paiement (multi), toile, recherche texte.
 * Stats agregees + bouton export CSV. Pagination basique cote client.
 *
 * @author Lalou
 */

interface Reservation {
  id: string;
  canvasId: number | string;
  canvasTitle: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  status: string;
  paymentMode?: string;
  depositAmount?: number;
  depositPaidAt?: string;
  balanceDueAt?: string;
  paidAt?: string;
  orderNumber?: string;
}

interface Stats {
  total: number;
  pending: number;
  signed: number;
  partialPaid: number;
  paid: number;
  closed: number;
  caTotalPaid: number;
  caEnCours: number;
}

interface ToileLite {
  id: number | string;
  name: string;
  price: number;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  signed: "Signée",
  partial_paid: "Acompte versé",
  paid: "Payée",
  expired: "Expirée",
  cancelled: "Annulée",
  refunded: "Remboursée",
  confirmed: "Confirmée",
  declined: "Refusée",
  invoiced: "Facturée",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  signed: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  partial_paid: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  paid: "bg-green-500/20 text-green-300 border-green-500/30",
  expired: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  refunded: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  confirmed: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  declined: "bg-red-500/20 text-red-300 border-red-500/30",
  invoiced: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

const MODE_LABELS: Record<string, string> = {
  integral: "Intégral",
  deposit_balance: "Acompte + solde",
  invoice_email: "Facture email",
};

const ALL_STATUSES = [
  "pending",
  "signed",
  "partial_paid",
  "paid",
  "expired",
  "cancelled",
  "refunded",
];

const ALL_MODES = ["integral", "deposit_balance", "invoice_email"];

const PAGE_SIZE = 20;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatEur(amount: number | undefined): string {
  if (typeof amount !== "number") return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

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

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <StatCard label="Total" value={stats.total} />
            <StatCard label="En attente" value={stats.pending} accent="yellow" />
            <StatCard label="Signées" value={stats.signed} accent="purple" />
            <StatCard label="Acompte" value={stats.partialPaid} accent="blue" />
            <StatCard label="Payées" value={stats.paid} accent="green" />
            <StatCard label="Closes" value={stats.closed} accent="zinc" />
          </div>
        )}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <CaCard label="CA encaissé" value={stats.caTotalPaid} />
            <CaCard label="CA encours (acomptes)" value={stats.caEnCours} />
          </div>
        )}

        {/* Filtres */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded p-5 mb-6 space-y-4">
          {/* Recherche */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher : nom, email, n° commande, ID, titre…"
              className="flex-1 bg-transparent border-b border-zinc-700 focus:border-[#C4A570] py-2 text-sm outline-none"
            />
          </div>

          {/* Statuts */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Statut</p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s) => {
                const active = selectedStatuses.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleStatus(s)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      active
                        ? STATUS_COLORS[s]
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modes */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              Mode paiement
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_MODES.map((m) => {
                const active = selectedModes.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => toggleMode(m)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      active
                        ? "bg-[#C4A570]/20 text-[#C4A570] border-[#C4A570]/50"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {MODE_LABELS[m]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toile + actions */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCanvasId}
              onChange={(e) => setSelectedCanvasId(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-sm px-3 py-2 rounded text-zinc-200 focus:border-[#C4A570] outline-none"
            >
              <option value="">Toutes les toiles</option>
              {toiles.map((t) => (
                <option key={String(t.id)} value={String(t.id)}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              onClick={clearFilters}
              className="text-xs px-3 py-2 text-zinc-400 hover:text-white border border-zinc-700 rounded transition-colors"
            >
              Réinitialiser
            </button>
            <a
              href={exportUrl}
              className="ml-auto text-xs px-4 py-2 bg-[#C4A570] text-[#0A0A0A] hover:bg-[#d4b580] transition-colors rounded flex items-center gap-2 font-medium"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </a>
          </div>
        </div>

        {/* Etats */}
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
          <>
            <p className="text-xs text-zinc-500 mb-2">
              {reservations.length} résultat{reservations.length > 1 ? "s" : ""}
              {totalPages > 1 ? ` — page ${page}/${totalPages}` : ""}
            </p>

            <div className="overflow-x-auto border border-zinc-800 rounded">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Acheteur</th>
                    <th className="text-left p-3">Toile</th>
                    <th className="text-left p-3">Statut</th>
                    <th className="text-left p-3">Mode</th>
                    <th className="text-right p-3">Acompte</th>
                    <th className="text-left p-3">Échéance solde</th>
                    <th className="text-right p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                    >
                      <td className="p-3 text-zinc-300">{formatDate(r.createdAt)}</td>
                      <td className="p-3">
                        <p className="font-medium">{r.name || `${r.firstName} ${r.lastName}`}</p>
                        <p className="text-xs text-zinc-500">{r.email}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-medium">{r.canvasTitle}</p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs border ${
                            STATUS_COLORS[r.status] || ""
                          }`}
                        >
                          {STATUS_LABELS[r.status] || r.status}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-300">
                        {r.paymentMode ? MODE_LABELS[r.paymentMode] : "—"}
                      </td>
                      <td className="p-3 text-right text-zinc-300">
                        {formatEur(r.depositAmount)}
                      </td>
                      <td className="p-3 text-zinc-400 text-xs">
                        {r.balanceDueAt ? formatDate(r.balanceDueAt) : "—"}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/fr/admin/vip/reservations/${r.id}`}
                          className="inline-flex items-center gap-1 text-xs text-[#C4A570] hover:underline"
                        >
                          Détail
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-xs border border-zinc-700 rounded disabled:opacity-30"
                >
                  Précédent
                </button>
                <span className="text-xs text-zinc-400 px-3">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-xs border border-zinc-700 rounded disabled:opacity-30"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
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
