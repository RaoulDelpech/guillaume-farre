'use client';

/**
 * Sections JSX du formulaire de reservation, extraites du composant
 * principal pour respecter la limite de 200 lignes par fichier.
 *
 * @author Lalou
 */

import { useTranslations } from 'next-intl';
import { MESSAGE_MAX_LENGTH } from '@/lib/schemas/reservation';
import { Field, TextInput, TextArea, BuyerTypeRadio } from './reservation-form-fields';
import type { ReservationFormState, BuyerType, ReservationFieldErrors } from './use-reservation-form';

interface SectionsProps {
  state: ReservationFormState;
  errors: ReservationFieldErrors;
  setField: <K extends keyof ReservationFormState>(key: K, value: ReservationFormState[K]) => void;
}

function useErrorResolver(errors: ReservationFieldErrors) {
  const t = useTranslations('reservation');
  return (path: string): string | undefined => {
    const code = errors[path];
    if (!code) return undefined;
    const i18nKey = `errors.fields.${code}`;
    const translated = t(i18nKey);
    return translated === i18nKey ? code : translated;
  };
}

export function ContactSection({ state, errors, setField }: SectionsProps) {
  const t = useTranslations('reservation');
  const err = useErrorResolver(errors);
  return (
    <section className="space-y-4">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[#8c6e32] font-light">
        {t('section_contact')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="firstName" label={t('field.firstName')} required error={err('firstName')}>
          <TextInput
            id="firstName"
            value={state.firstName}
            onChange={(v) => setField('firstName', v)}
            autoComplete="given-name"
            maxLength={50}
            invalid={Boolean(errors.firstName)}
          />
        </Field>
        <Field id="lastName" label={t('field.lastName')} required error={err('lastName')}>
          <TextInput
            id="lastName"
            value={state.lastName}
            onChange={(v) => setField('lastName', v)}
            autoComplete="family-name"
            maxLength={50}
            invalid={Boolean(errors.lastName)}
          />
        </Field>
        <Field id="email" label={t('field.email')} required error={err('email')}>
          <TextInput
            id="email"
            type="email"
            value={state.email}
            onChange={(v) => setField('email', v)}
            autoComplete="email"
            invalid={Boolean(errors.email)}
          />
        </Field>
        <Field id="phone" label={t('field.phone')} required error={err('phone')}>
          <TextInput
            id="phone"
            type="tel"
            value={state.phone}
            onChange={(v) => setField('phone', v)}
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
          />
        </Field>
      </div>
    </section>
  );
}

export function AddressSection({ state, errors, setField }: SectionsProps) {
  const t = useTranslations('reservation');
  const err = useErrorResolver(errors);
  return (
    <section className="space-y-4">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[#8c6e32] font-light">
        {t('section_address')}
      </h3>
      <Field id="line1" label={t('field.line1')} required error={err('address.line1')}>
        <TextInput
          id="line1"
          value={state.line1}
          onChange={(v) => setField('line1', v)}
          autoComplete="address-line1"
          maxLength={100}
          invalid={Boolean(errors['address.line1'])}
        />
      </Field>
      <Field id="line2" label={t('field.line2')} error={err('address.line2')}>
        <TextInput
          id="line2"
          value={state.line2}
          onChange={(v) => setField('line2', v)}
          autoComplete="address-line2"
          maxLength={100}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field id="postalCode" label={t('field.postalCode')} required error={err('address.postalCode')}>
          <TextInput
            id="postalCode"
            value={state.postalCode}
            onChange={(v) => setField('postalCode', v)}
            autoComplete="postal-code"
            maxLength={20}
            invalid={Boolean(errors['address.postalCode'])}
          />
        </Field>
        <Field id="city" label={t('field.city')} required error={err('address.city')}>
          <TextInput
            id="city"
            value={state.city}
            onChange={(v) => setField('city', v)}
            autoComplete="address-level2"
            maxLength={50}
            invalid={Boolean(errors['address.city'])}
          />
        </Field>
        <Field id="country" label={t('field.country')} required error={err('address.country')}>
          <TextInput
            id="country"
            value={state.country}
            onChange={(v) => setField('country', v.toUpperCase())}
            autoComplete="country"
            maxLength={2}
            invalid={Boolean(errors['address.country'])}
          />
        </Field>
      </div>
    </section>
  );
}

export function BuyerTypeSection({ state, errors, setField }: SectionsProps) {
  const t = useTranslations('reservation');
  const err = useErrorResolver(errors);
  return (
    <section className="space-y-4">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[#8c6e32] font-light">
        {t('section_type')}
      </h3>
      <BuyerTypeRadio
        name="buyerType"
        value={state.buyerType}
        onChange={(v: BuyerType) => setField('buyerType', v)}
        labels={{
          particulier: t('field.particulier'),
          professionnel: t('field.professionnel'),
        }}
      />
      {state.buyerType === 'professionnel' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="companyName" label={t('field.companyName')} required error={err('companyName')}>
            <TextInput
              id="companyName"
              value={state.companyName}
              onChange={(v) => setField('companyName', v)}
              maxLength={100}
              autoComplete="organization"
              invalid={Boolean(errors.companyName)}
            />
          </Field>
          <Field id="siret" label={t('field.siret')} required error={err('siret')}>
            <TextInput
              id="siret"
              value={state.siret}
              onChange={(v) => setField('siret', v.replace(/\D/g, '').slice(0, 14))}
              maxLength={14}
              placeholder="14 chiffres"
              invalid={Boolean(errors.siret)}
            />
          </Field>
        </div>
      ) : null}
    </section>
  );
}

export function MessageSection({ state, errors, setField }: SectionsProps) {
  const t = useTranslations('reservation');
  const err = useErrorResolver(errors);
  return (
    <section className="space-y-4">
      <h3 className="text-xs uppercase tracking-[0.2em] text-[#8c6e32] font-light">
        {t('section_message')}
      </h3>
      <Field id="message" label={t('field.message')} error={err('message')}>
        <TextArea
          id="message"
          value={state.message}
          onChange={(v) => setField('message', v)}
          maxLength={MESSAGE_MAX_LENGTH}
          invalid={Boolean(errors.message)}
        />
      </Field>
    </section>
  );
}
