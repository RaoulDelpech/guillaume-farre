'use client';

/**
 * Canvas de signature electronique pour les reservations VIP.
 *
 * Flow utilisateur :
 *   1. Dessiner sa signature (souris ou tactile)
 *   2. Saisir son nom complet
 *   3. Cocher la case d'acceptation
 *   4. Cliquer "Signer le contrat" -> POST /api/reservations/{id}/sign
 *
 * La logique reseau (POST + mapping d'erreurs) est dans
 * `use-signature-submit`. Ce composant gere uniquement l'UI et la
 * validation cote client.
 *
 * @author Lalou
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useTranslations } from 'next-intl';
import { useSignatureSubmit, type SignSuccessPayload } from './use-signature-submit';

export interface SignaturePadProps {
  reservationId: string;
  onSignSuccess: (payload: SignSuccessPayload) => void;
}

export default function SignaturePad({ reservationId, onSignSuccess }: SignaturePadProps) {
  const t = useTranslations('signature');
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(600);
  const [fullName, setFullName] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [hasStroke, setHasStroke] = useState(false);
  const { submit, submitting, error } = useSignatureSubmit({ reservationId, onSignSuccess });

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const measure = (): void => {
      const next = Math.min(600, node.clientWidth - 2);
      if (next > 200) setCanvasWidth(next);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleClear = useCallback(() => {
    sigCanvasRef.current?.clear();
    setHasStroke(false);
  }, []);

  const handleStrokeEnd = useCallback(() => {
    const empty = sigCanvasRef.current?.isEmpty() ?? true;
    setHasStroke(!empty);
  }, []);

  const canSubmit =
    hasStroke && fullName.trim().length >= 2 && accepted && !submitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const pad = sigCanvasRef.current;
    if (!pad || pad.isEmpty()) return;
    const dataUrl = pad.getCanvas().toDataURL('image/png');
    await submit({ dataUrl, fullName: fullName.trim() });
  }, [canSubmit, fullName, submit]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-2">
          {t('canvas_label')}
        </label>
        <div ref={wrapperRef} className="border border-neutral-400 bg-white">
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="#1a1a1a"
            canvasProps={{
              width: canvasWidth,
              height: 250,
              className: 'w-full block touch-none',
              'aria-label': t('canvas_label'),
            }}
            onEnd={handleStrokeEnd}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <button
            type="button"
            onClick={handleClear}
            disabled={submitting}
            className="text-neutral-600 hover:text-[#8c6e32] underline disabled:opacity-40"
          >
            {t('clear')}
          </button>
          <span className="text-neutral-500 italic">
            {hasStroke ? t('stroke_ok') : t('stroke_empty')}
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="signature-fullname"
          className="block text-xs uppercase tracking-wider text-neutral-600 mb-1"
        >
          {t('fullName')}
        </label>
        <input
          id="signature-fullname"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={submitting}
          maxLength={100}
          autoComplete="name"
          className="w-full px-3 py-2 border border-neutral-300 bg-white text-sm font-light focus:outline-none focus:border-[#8c6e32]"
          placeholder={t('fullName_placeholder')}
        />
      </div>

      <label className="flex items-start gap-2 text-sm font-light text-neutral-700 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          disabled={submitting}
          className="mt-1 cursor-pointer"
        />
        <span>{t('accept_terms')}</span>
      </label>

      {error ? (
        <div
          role="alert"
          className="text-sm font-light text-red-700 bg-red-50 border border-red-200 px-3 py-2"
        >
          {t(`errors.${error}`)}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full px-6 py-3 text-xs tracking-[0.25em] uppercase border border-[#8c6e32] bg-[#8c6e32] text-white hover:bg-[#705624] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? t('submitting') : t('sign_contract')}
      </button>
    </div>
  );
}
