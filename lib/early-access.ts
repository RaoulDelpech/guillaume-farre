/**
 * Systeme Early Collector - Guillaume Farre
 *
 * Gere la periode d'acces anticipe avant l'ouverture officielle (15 mai 2026).
 * Les visiteurs en early access beneficient d'avantages exclusifs :
 * - Reduction -25% sur toutes les oeuvres
 * - Acces aux oeuvres avant-premiere
 * - Invitation VIP premiere exposition
 *
 * @author Lalou
 */

// Date d'ouverture officielle (fuseau Paris)
const EARLY_ACCESS_END_DATE = '2026-05-15T00:00:00+02:00';

// Periode de transition (7 jours apres ouverture)
const TRANSITION_PERIOD_DAYS = 7;

// Constantes publiques
export const EARLY_ACCESS_DISCOUNT = 0.25; // 25%
export const EARLY_ACCESS_END_DATE_STR = '15 mai 2026';

/**
 * Verifie si nous sommes en periode d'acces anticipe
 *
 * Peut etre override par variable d'environnement NEXT_PUBLIC_EARLY_ACCESS_OVERRIDE
 * - 'true' : force early access actif
 * - 'false' : force early access inactif
 * - undefined : utilise la date reelle
 *
 * @returns true si en periode early access
 */
export function isEarlyAccess(): boolean {
  // Override par env var (pour tests)
  const override = process.env.NEXT_PUBLIC_EARLY_ACCESS_OVERRIDE;
  if (override === 'true') return true;
  if (override === 'false') return false;

  // Sinon, compare avec la date d'ouverture
  const now = new Date();
  const endDate = new Date(EARLY_ACCESS_END_DATE);
  return now < endDate;
}

/**
 * Calcule le nombre de jours avant l'ouverture officielle
 *
 * @returns nombre de jours restants (0 si ouverture passee)
 */
export function daysUntilOpening(): number {
  const now = new Date();
  const endDate = new Date(EARLY_ACCESS_END_DATE);
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 0;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Verifie si nous sommes en periode de transition
 *
 * Periode de transition : entre le 15 mai et le 22 mai (7 jours)
 * Permet d'afficher un message special "Merci d'avoir ete la avant les autres"
 *
 * @returns true si en periode de transition
 */
export function isTransitionPeriod(): boolean {
  const now = new Date();
  const endDate = new Date(EARLY_ACCESS_END_DATE);
  const transitionEnd = new Date(endDate.getTime() + (TRANSITION_PERIOD_DAYS * 24 * 60 * 60 * 1000));

  return now >= endDate && now < transitionEnd;
}

/**
 * Retourne le texte du compteur selon la periode
 *
 * @returns texte formaté pour affichage
 */
export function getCountdownText(): string {
  if (isEarlyAccess()) {
    const days = daysUntilOpening();
    return `Ouverture au public dans ${days} jour${days > 1 ? 's' : ''}`;
  }

  if (isTransitionPeriod()) {
    return "Le site est désormais ouvert à tous. Merci d'avoir été là avant les autres.";
  }

  return '';
}

// Lalou
