'use client';

/**
 * Bouton client qui declenche la creation d'une Stripe Checkout Session
 * pour le paiement du solde 70% d'une toile VIP (Sprint 5).
 *
 * Au clic : POST `/api/stripe/checkout/canvas-balance` avec `{ reservationId, locale }`.
 * En reponse `{ sessionUrl }` -> redirect.
 *
 * @author Lalou
 */
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

interface BalanceCheckoutButtonProps {
  reservationId: string;
  locale: string;
  balanceAmount: number;
  /**
   * Sprint 6 : token HMAC permettant de creer la session Stripe Checkout
   * meme sans cookie VIP `secret` (acheteur depuis email sur autre device).
   * Inutilise si l'acheteur a son cookie — la route accepte les 2 chemins.
   */
  balanceToken?: string;
}

type CheckoutError =
  | 'unauthorized'
  | 'reservation_not_found'
  | 'invalid_state'
  | 'balance_expired'
  | 'stripe_failed'
  | 'network';

export default function BalanceCheckoutButton({
  reservationId,
  locale,
  balanceAmount,
  balanceToken,
}: BalanceCheckoutButtonProps) {
  const t = useTranslations('vipBalance');
  const tErrors = useTranslations('vipBalance.errors');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CheckoutError | null>(null);

  const handleClick = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout/canvas-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          locale,
          ...(balanceToken ? { balanceToken } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        sessionUrl?: string;
        error?: string;
      };

      if (res.status === 200 && data?.ok && data.sessionUrl) {
        window.location.href = data.sessionUrl;
        return;
      }

      if (res.status === 401) setError('unauthorized');
      else if (res.status === 404) setError('reservation_not_found');
      else if (res.status === 400) setError('invalid_state');
      else if (res.status === 410) setError('balance_expired');
      else if (res.status === 502) setError('stripe_failed');
      else setError('network');
    } catch (err) {
      console.error('[BalanceCheckoutButton] failed', err);
      setError('network');
    } finally {
      setLoading(false);
    }
  }, [reservationId, locale, balanceToken]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full px-6 py-4 text-xs tracking-[0.25em] uppercase border border-[#8c6e32] bg-[#8c6e32] text-white hover:bg-[#705624] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? t('button_loading')
          : t('button_pay_balance', { amount: balanceAmount.toLocaleString('fr-FR') + ' €' })}
      </button>
      {error ? (
        <div role="alert" className="text-sm font-light text-red-700 bg-red-50 border border-red-200 px-3 py-2">
          {tErrors(error)}
        </div>
      ) : null}
    </div>
  );
}

// Lalou
