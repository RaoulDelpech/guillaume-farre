'use client';

/**
 * Hook etat + soumission du formulaire de reservation VIP.
 *
 * Separe pour garder le composant React sous la limite de 200 lignes
 * et permettre la reutilisation eventuelle (page dediee, mobile drawer).
 *
 * @author Lalou
 */

import { useCallback, useState } from 'react';
import { ZodError } from 'zod';
import { reservationBodySchema } from '@/lib/schemas/reservation';

export type BuyerType = 'particulier' | 'professionnel';

export interface ReservationFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
  buyerType: BuyerType;
  siret: string;
  companyName: string;
  message: string;
}

export type ReservationFieldErrors = Record<string, string>;

export type ReservationSubmitOutcome =
  | { kind: 'success'; reservationId: string; reservedUntil: string }
  | { kind: 'validation'; fieldErrors: ReservationFieldErrors }
  | { kind: 'error'; errorKey: 'unauthorized' | 'not_found' | 'already_reserved' | 'try_again' | 'network' };

const EMPTY: ReservationFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  postalCode: '',
  country: 'FR',
  buyerType: 'particulier',
  siret: '',
  companyName: '',
  message: '',
};

function flattenZodIssues(err: ZodError): ReservationFieldErrors {
  const out: ReservationFieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.map((p) => String(p)).join('.');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function buildPayload(state: ReservationFormState, canvasId: number | string) {
  return {
    canvasId,
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    phone: state.phone,
    address: {
      line1: state.line1,
      line2: state.line2 || undefined,
      city: state.city,
      postalCode: state.postalCode,
      country: state.country,
    },
    buyerType: state.buyerType,
    siret: state.buyerType === 'professionnel' ? state.siret : undefined,
    companyName: state.buyerType === 'professionnel' ? state.companyName : undefined,
    message: state.message || undefined,
  };
}

export function useReservationForm(canvasId: number | string) {
  const [state, setState] = useState<ReservationFormState>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<ReservationFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback(
    <K extends keyof ReservationFormState>(key: K, value: ReservationFormState[K]): void => {
      setState((s) => ({ ...s, [key]: value }));
    },
    [],
  );

  const submit = useCallback(async (): Promise<ReservationSubmitOutcome> => {
    setFieldErrors({});
    const payload = buildPayload(state, canvasId);

    try {
      reservationBodySchema.parse(payload);
    } catch (err) {
      if (err instanceof ZodError) {
        const errs = flattenZodIssues(err);
        setFieldErrors(errs);
        return { kind: 'validation', fieldErrors: errs };
      }
      return { kind: 'error', errorKey: 'network' };
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 201) {
        return {
          kind: 'success',
          reservationId: String(data?.id ?? ''),
          reservedUntil: String(data?.reservedUntil ?? ''),
        };
      }
      if (res.status === 400 && Array.isArray(data?.details)) {
        const next: ReservationFieldErrors = {};
        for (const d of data.details) {
          const k = Array.isArray(d.path) ? d.path.join('.') : String(d.path ?? '');
          if (k && !next[k]) next[k] = String(d.message ?? '');
        }
        setFieldErrors(next);
        return { kind: 'validation', fieldErrors: next };
      }
      if (res.status === 401) return { kind: 'error', errorKey: 'unauthorized' };
      if (res.status === 404) return { kind: 'error', errorKey: 'not_found' };
      if (res.status === 409) return { kind: 'error', errorKey: 'already_reserved' };
      if (res.status === 503) return { kind: 'error', errorKey: 'try_again' };
      return { kind: 'error', errorKey: 'network' };
    } catch (err) {
      console.error('[reservation-form] submit failed', err);
      return { kind: 'error', errorKey: 'network' };
    } finally {
      setSubmitting(false);
    }
  }, [canvasId, state]);

  return { state, setField, fieldErrors, submitting, submit };
}
