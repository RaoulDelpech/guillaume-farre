'use client';

/**
 * Selecteur multi-modes de paiement pour une toile VIP signee (Sprint 5).
 *
 * Trois options (par ordre visuel) :
 *  1. Intégral CB maintenant (recommande, primaire) -> POST /api/stripe/checkout/canvas
 *  2. En 2 fois (acompte 30% + solde 70% sous 14 jours) -> POST /api/stripe/checkout/canvas-deposit
 *  3. Recevoir une facture par email (paiement asynchrone 7 jours) -> POST /api/stripe/invoices/canvas-email
 *
 * Chaque CTA gere son propre etat loading + error. Apres succes :
 *  - Modes 1 et 2 : redirect vers sessionUrl Stripe Checkout
 *  - Mode 3 : affiche un message de confirmation (la facture est envoyee par Stripe)
 *
 * @author Lalou
 */

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

type Mode = 'integral' | 'deposit' | 'invoice';
type ErrorKind =
  | 'unauthorized'
  | 'reservation_not_found'
  | 'invalid_state'
  | 'stripe_failed'
  | 'network';

interface PaymentMethodsSelectorProps {
  reservationId: string;
  locale: string;
  totalPrice: number;
  depositAmount: number;
  balanceAmount: number;
}

export default function PaymentMethodsSelector({
  reservationId,
  locale,
  totalPrice,
  depositAmount,
  balanceAmount,
}: PaymentMethodsSelectorProps) {
  const t = useTranslations('vipCheckout');
  const tErrors = useTranslations('vipCheckout.errors');
  const [loadingMode, setLoadingMode] = useState<Mode | null>(null);
  const [error, setError] = useState<{ mode: Mode; kind: ErrorKind } | null>(null);
  const [invoiceSent, setInvoiceSent] = useState(false);

  const handleClick = useCallback(
    async (mode: Mode) => {
      setError(null);
      setLoadingMode(mode);
      try {
        const endpoint =
          mode === 'integral'
            ? '/api/stripe/checkout/canvas'
            : mode === 'deposit'
              ? '/api/stripe/checkout/canvas-deposit'
              : '/api/stripe/invoices/canvas-email';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationId, locale }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          sessionUrl?: string;
          hostedUrl?: string;
          error?: string;
        };

        if (res.status === 200 && data?.ok) {
          if (mode === 'invoice') {
            setInvoiceSent(true);
            return;
          }
          if (data.sessionUrl) {
            window.location.href = data.sessionUrl;
            return;
          }
        }

        const kind: ErrorKind =
          res.status === 401
            ? 'unauthorized'
            : res.status === 404
              ? 'reservation_not_found'
              : res.status === 400
                ? 'invalid_state'
                : res.status === 502
                  ? 'stripe_failed'
                  : 'network';
        setError({ mode, kind });
      } catch (err) {
        console.error('[PaymentMethodsSelector] failed', err);
        setError({ mode, kind: 'network' });
      } finally {
        setLoadingMode(null);
      }
    },
    [reservationId, locale],
  );

  if (invoiceSent) {
    return (
      <div
        role="status"
        className="border border-emerald-300 bg-emerald-50 px-4 py-4 text-sm font-light text-emerald-900 space-y-1"
      >
        <p className="font-medium">{t('invoice_sent_title')}</p>
        <p>{t('invoice_sent_message')}</p>
      </div>
    );
  }

  const fmt = (n: number) => n.toLocaleString('fr-FR') + ' €';

  return (
    <div className="space-y-4">
      {/* Mode 1 : Intégral CB (primaire) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => handleClick('integral')}
          disabled={loadingMode !== null}
          className="w-full px-6 py-4 text-xs tracking-[0.25em] uppercase border border-[#8c6e32] bg-[#8c6e32] text-white hover:bg-[#705624] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMode === 'integral'
            ? t('button_loading')
            : t('mode_integral_cta', { amount: fmt(totalPrice) })}
        </button>
        <p className="text-xs font-light text-neutral-600 px-1">{t('mode_integral_hint')}</p>
        {error?.mode === 'integral' ? (
          <div role="alert" className="text-sm font-light text-red-700 bg-red-50 border border-red-200 px-3 py-2">
            {tErrors(error.kind)}
          </div>
        ) : null}
      </div>

      {/* Mode 2 : Acompte 30% + solde 70% (secondaire) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => handleClick('deposit')}
          disabled={loadingMode !== null}
          className="w-full px-6 py-4 text-xs tracking-[0.25em] uppercase border border-[#8c6e32] text-[#8c6e32] bg-transparent hover:bg-[#f1e8d8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMode === 'deposit'
            ? t('button_loading')
            : t('mode_deposit_cta', { deposit: fmt(depositAmount) })}
        </button>
        <p className="text-xs font-light text-neutral-600 px-1">
          {t('mode_deposit_hint', { balance: fmt(balanceAmount) })}
        </p>
        {error?.mode === 'deposit' ? (
          <div role="alert" className="text-sm font-light text-red-700 bg-red-50 border border-red-200 px-3 py-2">
            {tErrors(error.kind)}
          </div>
        ) : null}
      </div>

      {/* Mode 3 : Facture par email (lien discret) */}
      <div className="space-y-2 pt-2 text-center">
        <button
          type="button"
          onClick={() => handleClick('invoice')}
          disabled={loadingMode !== null}
          className="text-xs font-light tracking-wider underline text-neutral-600 hover:text-[#8c6e32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingMode === 'invoice' ? t('button_loading') : t('mode_invoice_cta')}
        </button>
        <p className="text-xs font-light text-neutral-500 px-1">{t('mode_invoice_hint')}</p>
        {error?.mode === 'invoice' ? (
          <div role="alert" className="text-sm font-light text-red-700 bg-red-50 border border-red-200 px-3 py-2">
            {tErrors(error.kind)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Lalou
