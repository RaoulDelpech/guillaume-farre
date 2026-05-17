/**
 * Verification d'expiration intelligente des reservations VIP (Sprint 6).
 *
 * Avant Sprint 6 : aucun mecanisme automatique ne marquait une reservation
 * `expired`. Une reservation `signed` dont `expiresAt` est passe, ou une
 * reservation `partial_paid` dont `balanceDueAt` est passe, restait
 * indefiniment dans cet etat — bloquant la toile alors qu'elle aurait du
 * etre remise en vente.
 *
 * Ce module fournit un check synchrone idempotent applique a la volee (lazy)
 * quand un endpoint consulte une reservation potentiellement expiree :
 *  - Page `/vip/reservation/[id]/balance` (acces depuis email)
 *  - Future route GET `/api/reservations/[id]` si ajoutee
 *
 * Pas de cron / sweep periodique : si personne ne consulte la reservation,
 * elle reste `signed`/`partial_paid` jusqu'au prochain access (et la libere
 * a ce moment-la). Acceptable car le but est de debloquer la toile pour les
 * autres acheteurs, et ces consultations arrivent en pratique (Guillaume,
 * pilote VIP, acheteur sur lien email).
 *
 * Idempotence : si le statut est deja terminal (paid, cancelled, refunded,
 * expired, declined), no-op. Pas de re-ecriture inutile, pas de notif.
 *
 * @author Lalou
 */
import type { Reservation, ReservationStatus } from '@/lib/reservations-store';
import type { Toile } from '@/components/toiles/types';

/**
 * Statuts considerees comme terminaux — ne sont JAMAIS re-marquees expired.
 * `expired` est inclus pour rendre l'operation idempotente (un 2e appel sur
 * une reservation deja expiree ne refait rien).
 */
const TERMINAL_STATUSES: ReadonlySet<ReservationStatus> = new Set<ReservationStatus>([
  'paid',
  'cancelled',
  'refunded',
  'expired',
  'declined',
]);

export interface CheckExpirationResult {
  reservation: Reservation;
  toile: Toile;
  wasExpired: boolean;
}

/**
 * Determine si une reservation doit basculer en `expired` selon son statut
 * et la date courante.
 *
 *  - `pending` / `signed` / `invoiced` : on regarde `expiresAt`
 *  - `partial_paid` : on regarde `balanceDueAt` (avec fallback `expiresAt`)
 *  - autres statuts terminaux : jamais
 */
function shouldExpire(reservation: Reservation, now: Date): boolean {
  if (TERMINAL_STATUSES.has(reservation.status)) return false;

  const nowMs = now.getTime();

  if (reservation.status === 'partial_paid') {
    const ref = reservation.balanceDueAt ?? reservation.expiresAt;
    if (!ref) return false;
    const refMs = new Date(ref).getTime();
    return Number.isFinite(refMs) && nowMs > refMs;
  }

  if (!reservation.expiresAt) return false;
  const expMs = new Date(reservation.expiresAt).getTime();
  return Number.isFinite(expMs) && nowMs > expMs;
}

/**
 * Verifie si une reservation doit etre marquee expiree, et si oui produit
 * les nouvelles versions de la reservation ET de la toile associee.
 *
 * Pure function : NE PERSISTE PAS. L'appelant doit ecrire les versions
 * retournees via `writeReservations` / `writeToiles` si `wasExpired === true`.
 *
 * Garanties d'idempotence :
 *  - Statut terminal -> retourne les inputs tels quels, `wasExpired: false`
 *  - Pas encore expire selon l'horloge -> idem
 *  - Expire -> reservation.status = 'expired', toile.status = 'available',
 *    toile.reservationId = null, toile.reservedUntil = null
 */
export function checkAndMarkExpired(
  reservation: Reservation,
  toile: Toile,
  now: Date = new Date(),
): CheckExpirationResult {
  if (!shouldExpire(reservation, now)) {
    return { reservation, toile, wasExpired: false };
  }

  const updatedReservation: Reservation = {
    ...reservation,
    status: 'expired',
  };

  const updatedToile: Toile = {
    ...toile,
    status: 'available',
    reservationId: null,
    reservedUntil: null,
  };

  return {
    reservation: updatedReservation,
    toile: updatedToile,
    wasExpired: true,
  };
}

// Lalou
