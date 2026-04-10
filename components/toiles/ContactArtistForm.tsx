'use client';

/**
 * ContactArtistForm — Formulaire d'interet elegant pour une toile
 * Mode public : pas de prix, pas de reservation. Juste un moyen
 * de manifester son interet et contacter Guillaume.
 *
 * @author Lalou
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ContactArtistFormProps {
  toileName: string;
  onClose: () => void;
}

const GOLD = '#8c6e32';
const GOLD_LIGHT = 'rgba(140,110,50,0.15)';

export default function ContactArtistForm({ toileName, onClose }: ContactArtistFormProps) {
  const t = useTranslations('canvas.interestForm');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const subject = `${t('mailSubject')} — ${toileName}`;
    const lines = [
      `${t('fromLabel')} ${name}`,
      `Email : ${email}`,
      phone ? `${t('phoneLabel')} ${phone}` : '',
      '',
      message ? `${t('messageLabel')}\n${message}` : '',
      '',
      `---`,
      `${t('aboutWork')} ${toileName}`,
    ].filter(Boolean).join('\n');

    const mailto = `mailto:contact@guillaumefarre.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
    window.open(mailto, '_blank');
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-4 px-6 py-5 rounded-sm border border-[rgba(140,110,50,0.25)] bg-[rgba(140,110,50,0.04)]">
        <p className="text-sm text-neutral-600 font-light text-center">
          {t('success')}
        </p>
        <button
          onClick={onClose}
          className="block mx-auto mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition-colors tracking-wider uppercase"
        >
          {t('close')}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 px-5 py-5 rounded-sm border border-[rgba(140,110,50,0.2)] bg-[rgba(250,247,242,0.6)]"
    >
      <p className="text-sm font-light text-neutral-600 text-center mb-4 tracking-wide">
        {t('heading')}
      </p>

      <div className="space-y-3">
        {/* Nom */}
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('name')}
          className="w-full px-3 py-3 text-base sm:text-sm font-light bg-white/80 border border-neutral-200 rounded-sm
                     placeholder:text-neutral-400 text-neutral-700
                     focus:outline-none focus:border-[rgba(140,110,50,0.4)] transition-colors"
        />

        {/* Email */}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          className="w-full px-3 py-3 text-base sm:text-sm font-light bg-white/80 border border-neutral-200 rounded-sm
                     placeholder:text-neutral-400 text-neutral-700
                     focus:outline-none focus:border-[rgba(140,110,50,0.4)] transition-colors"
        />

        {/* Telephone */}
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('phone')}
          className="w-full px-3 py-3 text-base sm:text-sm font-light bg-white/80 border border-neutral-200 rounded-sm
                     placeholder:text-neutral-400 text-neutral-700
                     focus:outline-none focus:border-[rgba(140,110,50,0.4)] transition-colors"
        />

        {/* Message */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          rows={3}
          className="w-full px-3 py-3 text-base sm:text-sm font-light bg-white/80 border border-neutral-200 rounded-sm
                     placeholder:text-neutral-400 text-neutral-700 resize-none
                     focus:outline-none focus:border-[rgba(140,110,50,0.4)] transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          className="flex-1 py-3 text-xs tracking-[0.25em] uppercase font-light text-white transition-all duration-300 rounded-sm min-h-[44px]"
          style={{ backgroundColor: GOLD }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7a5f2a')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GOLD)}
        >
          {t('send')}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-3 text-xs tracking-[0.25em] uppercase font-light text-neutral-400 hover:text-neutral-600 transition-colors min-h-[44px]"
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}
