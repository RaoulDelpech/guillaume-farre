"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DetailAcheteurSection } from "@/components/admin/reservations/detail/DetailAcheteurSection";
import {
  DetailActionPanel,
  ReservationAction,
} from "@/components/admin/reservations/detail/DetailActionPanel";
import { DetailOeuvreSection } from "@/components/admin/reservations/detail/DetailOeuvreSection";
import { DetailPaymentSection } from "@/components/admin/reservations/detail/DetailPaymentSection";
import { DetailReservationSection } from "@/components/admin/reservations/detail/DetailReservationSection";
import { DetailSignatureSection } from "@/components/admin/reservations/detail/DetailSignatureSection";
import {
  Reservation,
  STATUS_COLORS,
  STATUS_LABELS,
  Toile,
} from "@/components/admin/reservations/detail/types";

/**
 * Page admin detail reservation VIP (Sprint 7).
 *
 * Compose 6 sous-sections (acheteur, oeuvre, reservation, signature, paiement,
 * action panel). La logique fetch + doAction reste dans cette page maitre.
 *
 * @author Lalou
 */
export default function AdminReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [toile, setToile] = useState<Toile | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    if (id) void loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`);
      if (res.status === 401) {
        router.push("/fr/login");
        return;
      }
      if (res.status === 404) {
        setError("Réservation introuvable");
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      setReservation(data.reservation);
      setToile(data.toile);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function doAction(action: ReservationAction, confirmText: string) {
    if (!confirm(confirmText)) return;
    setActing(action);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/reservations/${id}/${action}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg(`Erreur : ${data.error || res.status}`);
      } else {
        if (action === "regenerate-balance-link") {
          const emailMsg = data.emailSent
            ? "Email envoyé."
            : `Email NON envoyé (${data.emailError || "erreur"}). Lien : ${data.balanceCheckoutUrl}`;
          setActionMsg(`Nouveau lien généré. ${emailMsg}`);
        } else {
          setActionMsg("Action effectuée.");
        }
        await loadData();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "erreur inconnue";
      setActionMsg(`Erreur réseau : ${message}`);
    } finally {
      setActing(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-zinc-500">Chargement…</div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link
            href="/fr/admin/vip/reservations"
            className="text-sm text-zinc-400 hover:text-[#C4A570]"
          >
            ← Liste des réservations
          </Link>
          <div className="mt-8 text-red-400 bg-red-500/10 border border-red-500/30 rounded p-4">
            {error || "Réservation introuvable"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/fr/admin/vip/reservations"
          className="text-sm text-zinc-400 hover:text-[#C4A570]"
        >
          ← Liste des réservations
        </Link>

        <div className="mt-4 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extralight tracking-[0.05em] uppercase">
              {reservation.canvasTitle}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Réservation <code className="text-zinc-400">{reservation.id}</code>
            </p>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm border ${
              STATUS_COLORS[reservation.status] || ""
            }`}
          >
            {STATUS_LABELS[reservation.status] || reservation.status}
          </span>
        </div>

        {actionMsg && (
          <div className="mt-6 p-4 bg-zinc-900/50 border border-[#C4A570]/30 rounded text-sm">
            {actionMsg}
          </div>
        )}

        <DetailActionPanel
          reservation={reservation}
          acting={acting}
          onAction={doAction}
        />

        <DetailAcheteurSection reservation={reservation} />
        <DetailOeuvreSection reservation={reservation} toile={toile} />
        <DetailReservationSection reservation={reservation} />
        <DetailSignatureSection reservation={reservation} />
        <DetailPaymentSection reservation={reservation} />
      </div>
    </div>
  );
}

// Lalou
