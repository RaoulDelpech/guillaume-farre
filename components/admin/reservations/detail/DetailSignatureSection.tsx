"use client";

import { Section, KV } from "./Section";
import { Reservation, formatDate } from "./types";

/**
 * Section "Signature contrat" : signedAt, nom, IP, UA, hash.
 * Affichee uniquement si reservation.signedAt est defini.
 *
 * @author Lalou
 */
export function DetailSignatureSection({ reservation }: { reservation: Reservation }) {
  if (!reservation.signedAt) return null;

  return (
    <Section title="Signature contrat">
      <KV k="Signée le" v={formatDate(reservation.signedAt)} />
      <KV k="Nom" v={reservation.signatureFullName || "—"} />
      <KV k="IP" v={reservation.signatureIp || "—"} />
      <KV k="User-Agent" v={reservation.signatureUserAgent || "—"} mono />
      <KV k="Hash contrat" v={reservation.contractHash || "—"} mono />
    </Section>
  );
}

// Lalou
