/**
 * Cookie Consent Management Library
 * Gère le consentement cookies RGPD pour Guillaume Farré
 *
 * Lalou
 */

const STORAGE_KEY = 'gf_cookie_consent';
const STORAGE_DATE_KEY = 'gf_cookie_consent_date';
const CONSENT_DURATION_MONTHS = 13;

export type ConsentStatus = 'accepted' | 'refused' | 'pending';

/**
 * Vérifie si le consentement existe et est encore valide (< 13 mois)
 */
export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;

  const status = getConsentStatus();
  if (status === 'pending') return false;

  // Vérifier l'expiration (13 mois recommandés CNIL)
  const dateStr = localStorage.getItem(STORAGE_DATE_KEY);
  if (!dateStr) return false;

  const consentDate = new Date(dateStr);
  const now = new Date();
  const monthsElapsed = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  return monthsElapsed < CONSENT_DURATION_MONTHS;
}

/**
 * Récupère le statut du consentement
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'pending';

  const value = localStorage.getItem(STORAGE_KEY);

  if (value === 'accepted') return 'accepted';
  if (value === 'refused') return 'refused';
  return 'pending';
}

/**
 * Enregistre le consentement de l'utilisateur
 */
export function setConsent(accepted: boolean): void {
  if (typeof window === 'undefined') return;

  const status: ConsentStatus = accepted ? 'accepted' : 'refused';
  localStorage.setItem(STORAGE_KEY, status);
  localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString());

  // Dispatch event pour permettre aux autres composants de réagir
  window.dispatchEvent(new CustomEvent('consentChanged', {
    detail: { status, accepted }
  }));
}

/**
 * Réinitialise le consentement (pour debug/tests)
 */
export function resetConsent(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_DATE_KEY);
}
