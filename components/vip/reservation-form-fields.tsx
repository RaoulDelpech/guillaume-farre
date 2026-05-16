'use client';

/**
 * Sous-composants champs pour ReservationForm.
 * Extraits pour conserver le composant parent sous 200 lignes.
 *
 * @author Lalou
 */

import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ id, label, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-[0.15em] text-neutral-600 font-light"
      >
        {label}
        {required ? <span className="text-[#8c6e32] ml-1">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600 font-light" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface InputProps {
  id: string;
  type?: 'text' | 'email' | 'tel';
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  autoComplete?: string;
  placeholder?: string;
  invalid?: boolean;
}

export function TextInput({
  id,
  type = 'text',
  value,
  onChange,
  maxLength,
  autoComplete,
  placeholder,
  invalid,
}: InputProps) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      autoComplete={autoComplete}
      placeholder={placeholder}
      aria-invalid={invalid || undefined}
      className={`px-3 py-2 text-sm font-light border bg-white/80 transition-colors focus:outline-none focus:ring-1 focus:ring-[#8c6e32] focus:border-[#8c6e32] ${
        invalid ? 'border-red-500' : 'border-neutral-300'
      }`}
    />
  );
}

interface TextareaProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  invalid?: boolean;
}

export function TextArea({ id, value, onChange, maxLength, invalid }: TextareaProps) {
  return (
    <>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={4}
        aria-invalid={invalid || undefined}
        className={`px-3 py-2 text-sm font-light border bg-white/80 transition-colors focus:outline-none focus:ring-1 focus:ring-[#8c6e32] focus:border-[#8c6e32] resize-y ${
          invalid ? 'border-red-500' : 'border-neutral-300'
        }`}
      />
      <p className="text-[10px] text-neutral-400 font-light text-right">
        {value.length} / {maxLength}
      </p>
    </>
  );
}

interface RadioGroupProps {
  name: string;
  value: 'particulier' | 'professionnel';
  onChange: (v: 'particulier' | 'professionnel') => void;
  labels: { particulier: string; professionnel: string };
}

export function BuyerTypeRadio({ name, value, onChange, labels }: RadioGroupProps) {
  return (
    <div className="flex gap-6">
      {(['particulier', 'professionnel'] as const).map((kind) => (
        <label
          key={kind}
          className="flex items-center gap-2 cursor-pointer text-sm font-light text-neutral-700"
        >
          <input
            type="radio"
            name={name}
            value={kind}
            checked={value === kind}
            onChange={() => onChange(kind)}
            className="accent-[#8c6e32]"
          />
          <span>{labels[kind]}</span>
        </label>
      ))}
    </div>
  );
}
