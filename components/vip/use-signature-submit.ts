'use client';

/**
 * Hook de soumission de signature electronique vers
 * POST /api/reservations/{id}/sign.
 *
 * Extrait du composant SignaturePad pour respecter la limite 200 lignes
 * et faciliter le test unitaire de la logique reseau.
 *
 * @author Lalou
 */

import { useCallback, useState } from 'react';

export type SignError =
  | 'unauthorized'
  | 'not_found'
  | 'already_signed'
  | 'validation'
  | 'try_again'
  | 'network'
  | 'pdf_failed';

export interface SignSuccessPayload {
  reservationId: string;
  contractHash: string;
  signedAt: string;
}

interface UseSignatureSubmitParams {
  reservationId: string;
  onSignSuccess: (payload: SignSuccessPayload) => void;
}

interface SubmitArgs {
  dataUrl: string;
  fullName: string;
}

export function useSignatureSubmit({ reservationId, onSignSuccess }: UseSignatureSubmitParams) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<SignError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const submit = useCallback(
    async ({ dataUrl, fullName }: SubmitArgs): Promise<boolean> => {
      setError(null);
      setSubmitting(true);
      try {
        const res = await fetch(
          `/api/reservations/${encodeURIComponent(reservationId)}/sign`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ signatureImage: dataUrl, fullName }),
          },
        );
        const data = await res.json().catch(() => ({}));

        if (res.status === 200 && data?.ok) {
          onSignSuccess({
            reservationId,
            contractHash: String(data.contractHash ?? ''),
            signedAt: String(data.signedAt ?? ''),
          });
          return true;
        }

        if (res.status === 401) setError('unauthorized');
        else if (res.status === 404) setError('not_found');
        else if (res.status === 409) setError('already_signed');
        else if (res.status === 400) setError('validation');
        else if (res.status === 503) setError('try_again');
        else if (res.status === 500) setError('pdf_failed');
        else setError('network');
        return false;
      } catch (err) {
        console.error('[SignaturePad] submit failed', err);
        setError('network');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [onSignSuccess, reservationId],
  );

  return { submit, submitting, error, clearError };
}
