"use client";

import { Ban, ExternalLink, FileText, RefreshCw, RotateCw } from "lucide-react";
import { Reservation, TERMINAL_STATUSES } from "./types";

/**
 * Panel d'actions admin sur une reservation.
 *
 * Actions :
 *  - Regenerer lien balance (statut 'partial_paid')
 *  - Annuler (sauf statuts terminaux)
 *  - Marquer rembourse (statut 'paid')
 *  - Telecharger contrat PDF (si dispo)
 *  - Voir paiement Stripe (lien dashboard externe)
 *  - Voir facture Stripe (lien dashboard externe)
 *
 * @author Lalou
 */
export type ReservationAction = "cancel" | "refund" | "regenerate-balance-link";

export interface DetailActionPanelProps {
  reservation: Reservation;
  acting: string | null;
  onAction: (action: ReservationAction, confirmText: string) => void;
}

export function DetailActionPanel({
  reservation,
  acting,
  onAction,
}: DetailActionPanelProps) {
  const canCancel = !TERMINAL_STATUSES.has(reservation.status);
  const canRefund = reservation.status === "paid";
  const canRegenerate = reservation.status === "partial_paid";

  const stripeBase = "https://dashboard.stripe.com";
  const stripePaymentUrl = reservation.stripeBalancePaymentIntentId
    ? `${stripeBase}/payments/${reservation.stripeBalancePaymentIntentId}`
    : null;
  const stripeInvoiceUrl = reservation.stripeInvoiceUrl || null;

  return (
    <div className="mt-8 bg-zinc-900/30 border border-zinc-800 rounded p-5">
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Actions admin</p>
      <div className="flex flex-wrap gap-3">
        {canRegenerate && (
          <button
            onClick={() =>
              onAction(
                "regenerate-balance-link",
                "Régénérer le lien de paiement du solde et envoyer un email à l'acheteur ?",
              )
            }
            disabled={acting !== null}
            className="text-sm px-4 py-2 bg-[#C4A570] text-[#0A0A0A] rounded hover:bg-[#d4b580] disabled:opacity-50 flex items-center gap-2 font-medium"
          >
            <RotateCw className="h-3 w-3" />
            {acting === "regenerate-balance-link"
              ? "Génération…"
              : "Régénérer lien balance"}
          </button>
        )}
        {canCancel && (
          <button
            onClick={() =>
              onAction(
                "cancel",
                "Marquer cette réservation comme annulée et libérer la toile ?",
              )
            }
            disabled={acting !== null}
            className="text-sm px-4 py-2 bg-zinc-800 text-zinc-200 rounded hover:bg-zinc-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Ban className="h-3 w-3" />
            {acting === "cancel" ? "Annulation…" : "Annuler"}
          </button>
        )}
        {canRefund && (
          <button
            onClick={() =>
              onAction(
                "refund",
                "Marquer comme remboursée ? Le remboursement Stripe doit être effectué manuellement depuis le Dashboard.",
              )
            }
            disabled={acting !== null}
            className="text-sm px-4 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded hover:bg-orange-500/30 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            {acting === "refund" ? "…" : "Marquer remboursée"}
          </button>
        )}
        {reservation.contractPath && (
          <a
            href={`/api/reservations/${reservation.id}/contract`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-zinc-800 text-zinc-200 rounded hover:bg-zinc-700 flex items-center gap-2"
          >
            <FileText className="h-3 w-3" />
            Contrat PDF
          </a>
        )}
        {stripePaymentUrl && (
          <a
            href={stripePaymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-zinc-800 text-zinc-200 rounded hover:bg-zinc-700 flex items-center gap-2"
          >
            <ExternalLink className="h-3 w-3" />
            Voir paiement Stripe
          </a>
        )}
        {stripeInvoiceUrl && (
          <a
            href={stripeInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-2 bg-zinc-800 text-zinc-200 rounded hover:bg-zinc-700 flex items-center gap-2"
          >
            <ExternalLink className="h-3 w-3" />
            Facture Stripe
          </a>
        )}
        {!canCancel && !canRefund && !canRegenerate && (
          <p className="text-xs text-zinc-500">
            Aucune action disponible (statut terminal).
          </p>
        )}
      </div>
    </div>
  );
}

// Lalou
