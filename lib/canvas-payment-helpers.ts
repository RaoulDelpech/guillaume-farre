/**
 * Helpers de calcul pour le paiement multi-modes des toiles VIP (Sprint 5).
 *
 * - `computeDepositAmount(price)` : 30% arrondi superieur (entier EUR)
 * - `computeBalanceAmount(price)` : solde 70% = prix - depositAmount
 * - `computeBalanceDueAt(fromIso, days=14)` : ISO date a J+days
 *
 * Les arrondis sont volontairement entiers en EUR pour eviter les centimes
 * residuels lors du split 30/70 sur des prix ronds (ex : 5000 EUR → 1500 / 3500).
 * Pour des prix non-ronds, l'acompte est arrondi au superieur et le solde
 * absorbe la difference (toujours egal a price - deposit).
 *
 * @author Lalou
 */

export const DEPOSIT_RATIO = 0.3;
export const BALANCE_DUE_DEFAULT_DAYS = 14;

export function computeDepositAmount(price: number): number {
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('computeDepositAmount: price must be a positive number');
  }
  return Math.ceil(price * DEPOSIT_RATIO);
}

export function computeBalanceAmount(price: number, depositAmount?: number): number {
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('computeBalanceAmount: price must be a positive number');
  }
  const deposit = depositAmount ?? computeDepositAmount(price);
  return price - deposit;
}

export function computeBalanceDueAt(
  fromIso: string,
  days: number = BALANCE_DUE_DEFAULT_DAYS,
): string {
  const d = new Date(fromIso);
  if (Number.isNaN(d.getTime())) {
    throw new Error('computeBalanceDueAt: invalid fromIso date');
  }
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export function isBalanceExpired(balanceDueAtIso: string, now: Date = new Date()): boolean {
  const due = new Date(balanceDueAtIso);
  if (Number.isNaN(due.getTime())) return true;
  return now.getTime() > due.getTime();
}

// Lalou
