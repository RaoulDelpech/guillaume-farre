'use client';

/**
 * Modal de reservation d'une toile pour les invites VIP.
 *
 * Flow 3 etapes :
 *   1. `form` — formulaire reservation (-> POST /api/reservations -> pending)
 *   2. `signature` — apercu contrat + canvas signature (-> POST /sign -> signed)
 *   3. `done` — confirmation finale
 *
 * Sprint 2 : etape 1 seulement.
 * Sprint 3 : ajout etapes 2 et 3 (signature electronique).
 *
 * @author Lalou
 */

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useReservationForm } from './use-reservation-form';
import {
  ContactSection,
  AddressSection,
  BuyerTypeSection,
  MessageSection,
} from './ReservationFormSections';
import ReservationSignatureStep from './ReservationSignatureStep';
import type { SignSuccessPayload } from './use-signature-submit';

type Mode = 'form' | 'signature' | 'done';

interface ReservationFormProps {
  canvasId: number | string;
  canvasTitle: string;
  canvas?: {
    dimensions: string;
    technique: string;
    year: number;
    price: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReservationForm({
  canvasId,
  canvasTitle,
  canvas,
  onClose,
  onSuccess,
}: ReservationFormProps) {
  const t = useTranslations('reservation');
  const ts = useTranslations('signature');
  const fid = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { state, setField, fieldErrors, submitting, submit } = useReservationForm(canvasId);
  const [mode, setMode] = useState<Mode>('form');
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting && mode !== 'signature') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, submitting, mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    const outcome = await submit();
    if (outcome.kind === 'success') {
      setReservationId(outcome.reservationId);
      if (canvas) {
        setMode('signature');
      } else {
        // fallback : pas de canvas data -> on saute la signature
        setMode('done');
      }
      return;
    }
    if (outcome.kind === 'error') {
      setGlobalError(t(`errors.${outcome.errorKey}`));
    }
  }

  function handleSigned(_payload: SignSuccessPayload) {
    setMode('done');
  }

  function handleSuccessClose() {
    onSuccess();
    onClose();
  }

  function handleGoToCheckout() {
    if (!reservationId) return;
    const localePrefix =
      typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'fr' : 'fr';
    const allowed = new Set(['fr', 'en', 'it']);
    const safeLocale = allowed.has(localePrefix) ? localePrefix : 'fr';
    window.location.href = `/${safeLocale}/vip/reservation/${reservationId}/checkout`;
  }

  const isSigning = mode === 'signature';
  const headerTitle =
    mode === 'signature'
      ? ts('header_title', { title: canvasTitle })
      : t('form_title', { title: canvasTitle });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${fid}-title`}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto p-2 sm:p-4"
    >
      <div className="bg-[#f7f3eb] w-full max-w-2xl border border-neutral-300 shadow-2xl my-4 sm:my-8">
        <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2
            id={`${fid}-title`}
            className="text-base font-extralight tracking-[0.1em] uppercase text-[#1a1a1a]"
          >
            {headerTitle}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            disabled={submitting || isSigning}
            className="text-neutral-500 hover:text-[#8c6e32] disabled:opacity-40 text-2xl leading-none px-2"
          >
            ×
          </button>
        </header>

        {mode === 'done' ? (
          <div className="p-8 text-center space-y-6">
            <p className="text-sm font-light text-neutral-700 leading-relaxed">
              {ts('done_message')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleGoToCheckout}
                className="px-6 py-3 text-xs tracking-[0.25em] uppercase border border-[#8c6e32] bg-[#8c6e32] text-white hover:bg-[#705624] transition-colors"
              >
                {ts('proceed_to_payment')}
              </button>
              <button
                type="button"
                onClick={handleSuccessClose}
                className="px-6 py-3 text-xs tracking-[0.25em] uppercase border border-neutral-400 text-neutral-700 hover:border-[#8c6e32] hover:text-[#8c6e32] transition-colors"
              >
                {ts('pay_later')}
              </button>
            </div>
          </div>
        ) : mode === 'signature' && reservationId && canvas ? (
          <ReservationSignatureStep
            reservationId={reservationId}
            buyerState={state}
            canvas={{ title: canvasTitle, ...canvas }}
            onSigned={handleSigned}
          />
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            <ContactSection state={state} errors={fieldErrors} setField={setField} />
            <AddressSection state={state} errors={fieldErrors} setField={setField} />
            <BuyerTypeSection state={state} errors={fieldErrors} setField={setField} />
            <MessageSection state={state} errors={fieldErrors} setField={setField} />

            {globalError ? (
              <div
                role="alert"
                className="text-sm font-light text-red-700 bg-red-50 border border-red-200 px-4 py-3"
              >
                {globalError}
              </div>
            ) : null}

            <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-6 py-3 text-xs tracking-[0.25em] uppercase border border-neutral-300 text-neutral-600 hover:border-neutral-500 transition-colors disabled:opacity-40"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 text-xs tracking-[0.25em] uppercase border border-[#8c6e32] bg-[#8c6e32] text-white hover:bg-[#705624] transition-colors disabled:opacity-50"
              >
                {submitting ? t('submitting') : t('submit')}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}
