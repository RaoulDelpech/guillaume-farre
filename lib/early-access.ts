/**
 * Systeme Early Collector - Guillaume Farre
 *
 * Gere la periode d'acces anticipe avant l'ouverture officielle (15 avril 2026 a midi).
 * Les visiteurs en early access beneficient d'avantages exclusifs :
 * - Reduction -25% sur toutes les oeuvres
 * - Acces aux oeuvres avant-premiere
 * - Invitation VIP premiere exposition
 *
 * @author Lalou
 */

// Date d'ouverture officielle (fuseau Paris)
const EARLY_ACCESS_END_DATE = '2026-04-15T12:00:00+02:00';

// Periode de transition (7 jours apres ouverture)
const TRANSITION_PERIOD_DAYS = 7;

// Constantes publiques
export const EARLY_ACCESS_DISCOUNT = 0.25; // 25%
export const EARLY_ACCESS_END_DATE_STR = '15 avril 2026 à midi';

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
 * Periode de transition : entre le 15 avril midi et le 22 avril (7 jours)
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
 * Calcule les heures restantes avant l'ouverture
 *
 * @returns nombre d'heures restantes (0 si ouverture passee)
 */
export function hoursUntilOpening(): number {
  const now = new Date();
  const endDate = new Date(EARLY_ACCESS_END_DATE);
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 0;

  return Math.ceil(diff / (1000 * 60 * 60));
}

/**
 * Calcule les minutes restantes avant l'ouverture
 *
 * @returns nombre de minutes restantes (0 si ouverture passee)
 */
export function minutesUntilOpening(): number {
  const now = new Date();
  const endDate = new Date(EARLY_ACCESS_END_DATE);
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) return 0;

  return Math.ceil(diff / (1000 * 60));
}

/**
 * Retourne le texte du compteur selon la periode
 *
 * Affiche en jours si >= 24h, en heures si >= 1h, en minutes sinon.
 *
 * @returns texte formaté pour affichage
 */
export function getCountdownText(): string {
  if (isEarlyAccess()) {
    const hours = hoursUntilOpening();
    const minutes = minutesUntilOpening();

    if (hours >= 24) {
      const days = daysUntilOpening();
      return `Ouverture au public dans ${days} jour${days > 1 ? 's' : ''}`;
    }

    if (hours >= 1) {
      return `Ouverture au public dans ${hours} heure${hours > 1 ? 's' : ''}`;
    }

    if (minutes > 0) {
      return `Ouverture au public dans ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return 'Ouverture imminente';
  }

  if (isTransitionPeriod()) {
    return "Site ouvert depuis le 15 avril 2026";
  }

  return '';
}

// Lalou
