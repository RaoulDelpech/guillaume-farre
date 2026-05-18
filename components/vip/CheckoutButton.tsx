'use client';

/**
 * Bouton client qui declenche la creation d'une Stripe Checkout Session
 * pour le paiement CB integral d'une toile VIP (Sprint 4).
 *
 * Au clic : POST `/api/stripe/checkout/canvas` avec `{ reservationId }`.
 * En reponse `{ sessionUrl }` -> `window.location.href = sessionUrl`.
 *
 * @author Lalou
 */
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

interface CheckoutButtonProps {
  reservationId: string;
  locale: string;
}

type CheckoutError =
  | 'unauthorized'
  | 'reservation_not_found'
  | 'invalid_state'
  | 'stripe_failed'
  | 'network';

export default function CheckoutButton({ reservationId, locale }: CheckoutButtonProps) {
  const t = useTranslations('vipCheckout');
  const tErrors = useTranslations('vipCheckout.errors');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CheckoutError | null>(null);

  const handleClick = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout/canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, locale }),
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
      else if (res.status === 502) setError('stripe_failed');
      else setError('network');
    } catch (err) {
      console.error('[CheckoutButton] failed', err);
      setError('network');
    } finally {
      setLoading(false);
    }
  }, [reservationId, locale]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full px-6 py-4 text-xs tracking-[0.25em] uppercase border border-[#8c6e32] bg-[#8c6e32] text-white hover:bg-[#705624] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t('button_loading') : t('button_pay')}
      </button>
      {error ? (
        <div
          role="alert"
          className="text-sm font-light text-red-700 bg-red-50 border border-red-200 px-3 py-2"
        >
          {tErrors(error)}
        </div>
      ) : null}
    </div>
  );
}
