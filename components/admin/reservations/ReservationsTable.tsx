"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  MODE_LABELS,
  Reservation,
  STATUS_COLORS,
  STATUS_LABELS,
  formatDate,
  formatEur,
} from "./types";

/**
 * Tableau des reservations + pagination basique.
 *
 * @author Lalou
 */
export interface ReservationsTableProps {
  reservations: Reservation[];
  paginated: Reservation[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ReservationsTable({
  reservations,
  paginated,
  page,
  totalPages,
  onPageChange,
}: ReservationsTableProps) {
  return (
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
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-xs border border-zinc-700 rounded disabled:opacity-30"
          >
            Précédent
          </button>
          <span className="text-xs text-zinc-400 px-3">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-xs border border-zinc-700 rounded disabled:opacity-30"
          >
            Suivant
          </button>
        </div>
      )}
    </>
  );
}

// Lalou
