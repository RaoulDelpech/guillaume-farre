/**
 * Account Login Form - Request magic link email
 *
 * State A: Not authenticated
 * User enters email and receives magic link
 *
 * @author Lalou
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface AccountLoginFormProps {
  error?: string;
  hasToken?: boolean;
}

export default function AccountLoginForm({ error, hasToken }: AccountLoginFormProps) {
  const t = useTranslations('account');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle URL errors
  const getErrorMessage = () => {
    if (error === 'invalid') return t('errors.invalidToken');
    if (error === 'expired') return t('errors.expiredToken');
    if (error === 'server') return t('errors.server');
    return null;
  };

  const urlError = getErrorMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(t('errors.invalidEmail'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/account/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setSent(true);
      } else {
        setErrorMessage(t('errors.sendFailed'));
      }
    } catch (error) {
      console.error('[AccountLogin] Error:', error);
      setErrorMessage(t('errors.network'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
          {t('login.title')}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {t('login.subtitle')}
        </p>
      </div>

      {/* Error messages from URL */}
      {urlError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{urlError}</p>
        </div>
      )}

      {/* Success state - Email sent */}
      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-light mb-3">{t('login.emailSentTitle')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('login.emailSentMessage')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('login.emailSentCheck')}
          </p>
        </div>
      ) : (
        /* Login form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-light mb-2">
              {t('login.emailLabel')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              disabled={loading}
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-3 px-6 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-light tracking-wide"
          >
            {loading ? t('login.sending') : t('login.submit')}
          </button>

          {/* Help text */}
          <p className="text-xs text-muted-foreground text-center">
            {t('login.helpText')}
          </p>
        </form>
      )}
    </div>
  );
}

// Lalou
