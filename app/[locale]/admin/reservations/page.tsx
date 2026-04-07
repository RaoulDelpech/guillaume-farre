"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Send, Check, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Page admin gestion réservations toiles
 * @author Lalou
 */

interface Reservation {
  id: string;
  canvasTitle: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
  status: "pending" | "confirmed" | "declined" | "invoiced" | "paid";
  stripeInvoiceId?: string;
  stripeInvoiceUrl?: string;
  stripeCustomerId?: string;
  paidAt?: string;
  orderNumber?: string;
  toile?: {
    name: string;
    dimensions: string;
    technique: string;
    price: number;
  } | null;
}

const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  invoiced: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  paid: "bg-green-500/20 text-green-300 border-green-500/30",
  declined: "bg-red-500/20 text-red-300 border-red-500/30",
  confirmed: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const STATUS_LABELS = {
  pending: "En attente",
  invoiced: "Facturée",
  paid: "Payée",
  declined: "Refusée",
  confirmed: "Confirmée",
};

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      const res = await fetch("/api/admin/invoices");
      if (res.status === 401) {
        router.push("/fr/login");
        return;
      }
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function sendInvoice(reservationId: string) {
    if (!confirm("Envoyer la facture Stripe ?")) return;

    setSending(reservationId);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur envoi facture");
      }

      const data = await res.json();
      alert(`Facture envoyée !\n\nURL: ${data.invoiceUrl}`);
      loadReservations();
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setSending(null);
    }
  }

  function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4A570] mx-auto mb-4"></div>
          <p className="text-zinc-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-8 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.08em] uppercase mb-4">
            Réservations Toiles
          </h1>
          <p className="text-zinc-400">
            {reservations.length} réservation{reservations.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Table */}
        {reservations.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            Aucune réservation pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-4 px-4 text-sm font-normal text-zinc-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-normal text-zinc-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-normal text-zinc-400 uppercase tracking-wider">
                    Toile
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-normal text-zinc-400 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-normal text-zinc-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-normal text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-900/20 transition-colors"
                  >
                    {/* Date */}
                    <td className="py-4 px-4 text-sm text-zinc-300">
                      {formatDate(reservation.createdAt)}
                    </td>

                    {/* Client */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium">{reservation.name}</p>
                        <p className="text-xs text-zinc-500">{reservation.email}</p>
                        <p className="text-xs text-zinc-500">{reservation.phone}</p>
                      </div>
                    </td>

                    {/* Toile */}
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium">{reservation.canvasTitle}</p>
                        {reservation.toile && (
                          <>
                            <p className="text-xs text-zinc-500">{reservation.toile.dimensions}</p>
                            <p className="text-xs text-zinc-500">{reservation.toile.technique}</p>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Prix */}
                    <td className="py-4 px-4 text-sm font-medium">
                      {reservation.toile ? formatPrice(reservation.toile.price) : "—"}
                    </td>

                    {/* Statut */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                          STATUS_COLORS[reservation.status]
                        }`}
                      >
                        {reservation.status === "pending" && <Clock className="h-3 w-3" />}
                        {reservation.status === "invoiced" && <Send className="h-3 w-3" />}
                        {reservation.status === "paid" && <Check className="h-3 w-3" />}
                        {reservation.status === "declined" && <X className="h-3 w-3" />}
                        {STATUS_LABELS[reservation.status]}
                      </span>
                      {reservation.paidAt && (
                        <p className="text-xs text-zinc-500 mt-1">
                          Payé le {formatDate(reservation.paidAt)}
                        </p>
                      )}
                      {reservation.orderNumber && (
                        <p className="text-xs text-zinc-500 mt-1">
                          Commande {reservation.orderNumber}
                        </p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {reservation.status === "pending" && (
                          <button
                            onClick={() => sendInvoice(reservation.id)}
                            disabled={sending === reservation.id}
                            className="px-4 py-2 bg-[#C4A570] text-[#0A0A0A] rounded hover:bg-[#d4b580] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {sending === reservation.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#0A0A0A]"></div>
                                Envoi...
                              </>
                            ) : (
                              <>
                                <Send className="h-3 w-3" />
                                Envoyer facture
                              </>
                            )}
                          </button>
                        )}

                        {reservation.status === "invoiced" && reservation.stripeInvoiceUrl && (
                          <a
                            href={reservation.stripeInvoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Voir facture
                          </a>
                        )}

                        {reservation.status === "paid" && reservation.stripeInvoiceUrl && (
                          <a
                            href={reservation.stripeInvoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors text-sm font-medium flex items-center gap-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Voir facture
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Lalou
