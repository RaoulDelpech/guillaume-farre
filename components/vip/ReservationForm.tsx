'use client';

/**
 * Modal de reservation d'une toile pour les invites VIP.
 *
 * Le hook `useReservationForm` gere etat + soumission + mapping des
 * erreurs HTTP. Les sections JSX sont dans `ReservationFormSections`.
 * Ce composant orchestre uniquement : modal shell, footer, succes,
 * erreur globale.
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

interface ReservationFormProps {
  canvasId: number | string;
  canvasTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReservationForm({
  canvasId,
  canvasTitle,
  onClose,
  onSuccess,
}: ReservationFormProps) {
  const t = useTranslations('reservation');
  const fid = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { state, setField, fieldErrors, submitting, submit } = useReservationForm(canvasId);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose, submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);

    const outcome = await submit();
    if (outcome.kind === 'success') {
      setSuccess(true);
      return;
    }
    if (outcome.kind === 'error') {
      setGlobalError(t(`errors.${outcome.errorKey}`));
    }
    // validation: les erreurs sont deja dans fieldErrors via le hook
  }

  function handleSuccessClose() {
    onSuccess();
    onClose();
  }

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
            {t('form_title', { title: canvasTitle })}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            disabled={submitting}
            className="text-neutral-500 hover:text-[#8c6e32] disabled:opacity-40 text-2xl leading-none px-2"
          >
            ×
          </button>
        </header>

        {success ? (
          <div className="p-8 text-center space-y-6">
            <p className="text-sm font-light text-neutral-700 leading-relaxed">
              {t('success')}
            </p>
            <button
              type="button"
              onClick={handleSuccessClose}
              className="px-6 py-3 text-xs tracking-[0.25em] uppercase border border-neutral-400 text-neutral-700 hover:border-[#8c6e32] hover:text-[#8c6e32] transition-colors"
            >
              {t('close')}
            </button>
          </div>
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
