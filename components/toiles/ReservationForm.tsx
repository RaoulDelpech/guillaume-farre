import { useTranslations } from "next-intl";
import type { ReservationForm as ReservationFormType } from "./types";

interface ReservationFormProps {
  form: ReservationFormType;
  onChange: (form: ReservationFormType) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
}

export default function ReservationForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitting,
}: ReservationFormProps) {
  const t = useTranslations("canvas");

  const inputClass =
    "w-full px-0 py-3 bg-transparent border-0 border-b border-neutral-300 text-[#1a1a1a] text-sm placeholder-neutral-400 font-light focus:outline-none focus:border-[#8c6e32] transition-colors";

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <input
        type="text"
        placeholder={t("reserveForm.name")}
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        className={inputClass}
      />
      <input
        type="email"
        placeholder={t("reserveForm.email")}
        value={form.email}
        onChange={(e) => onChange({ ...form, email: e.target.value })}
        className={inputClass}
      />
      <input
        type="tel"
        placeholder={t("reserveForm.phone")}
        value={form.phone}
        onChange={(e) => onChange({ ...form, phone: e.target.value })}
        className={inputClass}
      />
      <textarea
        placeholder={t("reserveForm.message")}
        value={form.message}
        onChange={(e) => onChange({ ...form, message: e.target.value })}
        rows={2}
        className={`${inputClass} resize-none`}
      />
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onSubmit}
          disabled={submitting || !form.name || !form.email || !form.phone}
          className="flex-1 py-4 sm:py-3 text-neutral-600 text-xs tracking-[0.25em] uppercase hover:text-[#8c6e32] transition-colors border border-neutral-300 hover:border-[#8c6e32] disabled:opacity-20 min-h-[44px]"
        >
          {submitting ? "···" : t("reserveForm.submit")}
        </button>
        <button
          onClick={onCancel}
          className="py-4 sm:py-3 px-6 text-neutral-400 text-xs tracking-[0.2em] uppercase hover:text-neutral-700 transition-colors min-h-[44px]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
