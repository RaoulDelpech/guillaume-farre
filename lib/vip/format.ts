/**
 * Helpers purs pour la gestion des codes VIP (formatage, statut, WhatsApp).
 *
 * Extraits de la page admin VIP pour respecter la limite de taille des
 * composants. Aucune dependance React ni i18n ici : ce sont des fonctions
 * pures et testables. Les libelles dependant de la langue (ex : temps
 * restant) restent dans les composants qui ont acces a `useTranslations`.
 */

export interface VipCode {
  code: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
  accessLevel?: "hidden" | "secret";
}

export type VipCodeStatus = "active" | "used" | "expired";

/**
 * Normalise un numero de telephone pour wa.me :
 * - 0X XX XX XX XX (10 chiffres) -> 33XXXXXXXXX
 * - +33... -> 33... (retire le +)
 * - sinon : retourne les chiffres tels quels
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/[\s\-.()]/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    return "33" + digits.slice(1);
  }
  if (digits.startsWith("+")) return digits.slice(1);
  return digits;
}

/** Construit l'URL wa.me avec le message d'invitation pre-rempli. */
export function buildWaUrl(phone: string, vipUrl: string): string {
  const message = `Invitation privée — Guillaume Farré\n\nDécouvrez mes toiles originales et photographies en accès exclusif (24h) :\n${vipUrl}`;
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}

/** Statut d'un code : utilise, expire (date depassee) ou actif. */
export function getCodeStatus(code: VipCode): VipCodeStatus {
  if (code.used) return "used";
  if (new Date(code.expiresAt) < new Date()) return "expired";
  return "active";
}

/** Formate une date ISO en "JJ/MM HH:MM" (locale fr-FR). */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
