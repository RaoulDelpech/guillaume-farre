"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, FileText, RotateCw, Ban, RefreshCw } from "lucide-react";

/**
 * Page admin detail reservation VIP (Sprint 7).
 *
 * Recap complet + 4 actions :
 *  - Cancel (sauf statuts terminaux)
 *  - Refund (uniquement statut 'paid')
 *  - Regenerate balance link (uniquement 'partial_paid')
 *  - Telecharger contrat (si PDF dispo)
 *  - Voir dans Stripe (lien dashboard externe)
 *
 * @author Lalou
 */

interface ReservationAddress {
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Reservation {
  id: string;
  canvasId: number | string;
  canvasTitle: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: ReservationAddress;
  buyerType: "particulier" | "professionnel";
  siret?: string;
  companyName?: string;
  message?: string;
  createdAt: string;
  expiresAt: string;
  status: string;
  signedAt?: string;
  signatureIp?: string;
  signatureUserAgent?: string;
  signatureFullName?: string;
  contractHash?: string;
  contractPath?: string;
  paymentMode?: "integral" | "deposit_balance" | "invoice_email";
  depositAmount?: number;
  depositPaidAt?: string;
  balanceDueAt?: string;
  stripeDepositSessionId?: string;
  stripeBalanceSessionId?: string;
  stripeBalancePaymentIntentId?: string;
  stripeInvoiceId?: string;
  stripeInvoiceUrl?: string;
  stripeCustomerId?: string;
  paidAt?: string;
  orderNumber?: string;
  refundedAt?: string;
  cancelledAt?: string;
  balanceLinkLastRegeneratedAt?: string;
}

interface Toile {
  id: number | string;
  name: string;
  price: number;
  dimensions?: string;
  technique?: string;
  year?: number;
  status?: string;
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
};

const MODE_LABELS: Record<string, string> = {
  integral: "Paiement intégral",
  deposit_balance: "Acompte 30% + solde 70%",
  invoice_email: "Facture par email",
};

const TERMINAL_STATUSES = new Set(["cancelled", "refunded", "expired", "paid", "declined"]);

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fr-FR", {
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
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  async function doAction(
    action: "cancel" | "refund" | "regenerate-balance-link",
    confirmText: string,
  ) {
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
    } catch (err: any) {
      setActionMsg(`Erreur réseau : ${err.message}`);
    } finally {
      setActing(null);
    }
  }

  const stripeBase = "https://dashboard.stripe.com";
  const stripePaymentUrl = reservation?.stripeBalancePaymentIntentId
    ? `${stripeBase}/payments/${reservation.stripeBalancePaymentIntentId}`
    : null;
  const stripeInvoiceUrl = reservation?.stripeInvoiceUrl || null;

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

  const canCancel = !TERMINAL_STATUSES.has(reservation.status);
  const canRefund = reservation.status === "paid";
  const canRegenerate = reservation.status === "partial_paid";

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

        {/* Actions */}
        <div className="mt-8 bg-zinc-900/30 border border-zinc-800 rounded p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Actions admin</p>
          <div className="flex flex-wrap gap-3">
            {canRegenerate && (
              <button
                onClick={() =>
                  doAction(
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
                  doAction(
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
                  doAction(
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

        {/* Sections */}
        <Section title="Acheteur">
          <KV k="Nom" v={reservation.name || `${reservation.firstName} ${reservation.lastName}`} />
          <KV k="Email" v={reservation.email} />
          <KV k="Téléphone" v={reservation.phone} />
          <KV k="Type" v={reservation.buyerType} />
          {reservation.buyerType === "professionnel" && (
            <>
              <KV k="Société" v={reservation.companyName || "—"} />
              <KV k="SIRET" v={reservation.siret || "—"} />
            </>
          )}
          <KV
            k="Adresse"
            v={[
              reservation.address?.line1,
              reservation.address?.line2,
              `${reservation.address?.postalCode} ${reservation.address?.city}`,
              reservation.address?.country,
            ]
              .filter(Boolean)
              .join(", ")}
          />
          {reservation.message && <KV k="Message" v={reservation.message} />}
        </Section>

        <Section title="Œuvre">
          <KV k="Titre" v={reservation.canvasTitle} />
          <KV k="Canvas ID" v={String(reservation.canvasId)} />
          {toile && (
            <>
              <KV k="Dimensions" v={toile.dimensions || "—"} />
              <KV k="Technique" v={toile.technique || "—"} />
              <KV k="Année" v={String(toile.year || "—")} />
              <KV k="Prix" v={formatEur(toile.price)} />
              <KV k="Statut toile" v={toile.status || "available"} />
            </>
          )}
        </Section>

        <Section title="Réservation">
          <KV k="Créée le" v={formatDate(reservation.createdAt)} />
          <KV k="Expire le" v={formatDate(reservation.expiresAt)} />
          {reservation.cancelledAt && <KV k="Annulée le" v={formatDate(reservation.cancelledAt)} />}
          {reservation.refundedAt && <KV k="Remboursée le" v={formatDate(reservation.refundedAt)} />}
        </Section>

        {reservation.signedAt && (
          <Section title="Signature contrat">
            <KV k="Signée le" v={formatDate(reservation.signedAt)} />
            <KV k="Nom" v={reservation.signatureFullName || "—"} />
            <KV k="IP" v={reservation.signatureIp || "—"} />
            <KV k="User-Agent" v={reservation.signatureUserAgent || "—"} mono />
            <KV k="Hash contrat" v={reservation.contractHash || "—"} mono />
          </Section>
        )}

        {reservation.paymentMode && (
          <Section title="Paiement">
            <KV k="Mode" v={MODE_LABELS[reservation.paymentMode] || reservation.paymentMode} />
            {typeof reservation.depositAmount === "number" && (
              <KV k="Acompte versé" v={formatEur(reservation.depositAmount)} />
            )}
            {reservation.depositPaidAt && (
              <KV k="Acompte payé le" v={formatDate(reservation.depositPaidAt)} />
            )}
            {reservation.balanceDueAt && (
              <KV k="Échéance solde" v={formatDate(reservation.balanceDueAt)} />
            )}
            {reservation.paidAt && <KV k="Payée le" v={formatDate(reservation.paidAt)} />}
            {reservation.orderNumber && <KV k="N° commande" v={reservation.orderNumber} />}
            {reservation.balanceLinkLastRegeneratedAt && (
              <KV
                k="Lien balance régénéré le"
                v={formatDate(reservation.balanceLinkLastRegeneratedAt)}
              />
            )}
          </Section>
        )}

        {(reservation.stripeCustomerId ||
          reservation.stripeDepositSessionId ||
          reservation.stripeBalanceSessionId ||
          reservation.stripeBalancePaymentIntentId ||
          reservation.stripeInvoiceId) && (
          <Section title="Références Stripe">
            {reservation.stripeCustomerId && (
              <KV k="Customer ID" v={reservation.stripeCustomerId} mono />
            )}
            {reservation.stripeDepositSessionId && (
              <KV k="Deposit session" v={reservation.stripeDepositSessionId} mono />
            )}
            {reservation.stripeBalanceSessionId && (
              <KV k="Balance session" v={reservation.stripeBalanceSessionId} mono />
            )}
            {reservation.stripeBalancePaymentIntentId && (
              <KV k="Balance payment intent" v={reservation.stripeBalancePaymentIntentId} mono />
            )}
            {reservation.stripeInvoiceId && (
              <KV k="Invoice ID" v={reservation.stripeInvoiceId} mono />
            )}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 bg-zinc-900/30 border border-zinc-800 rounded p-5">
      <h2 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">{title}</h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 py-1 text-sm">
      <span className="text-zinc-500 min-w-[160px]">{k}</span>
      <span className={`text-zinc-200 ${mono ? "font-mono text-xs break-all" : ""}`}>{v}</span>
    </div>
  );
}

// Lalou
