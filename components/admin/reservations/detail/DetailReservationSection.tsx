"use client";

import { Section, KV } from "./Section";
import { Reservation, formatDate } from "./types";

/**
 * Section "Reservation" : dates createdAt, expiresAt, cancelledAt, refundedAt.
 *
 * @author Lalou
 */
export function DetailReservationSection({ reservation }: { reservation: Reservation }) {
  return (
    <Section title="Réservation">
      <KV k="Créée le" v={formatDate(reservation.createdAt)} />
      <KV k="Expire le" v={formatDate(reservation.expiresAt)} />
      {reservation.cancelledAt && (
        <KV k="Annulée le" v={formatDate(reservation.cancelledAt)} />
      )}
      {reservation.refundedAt && (
        <KV k="Remboursée le" v={formatDate(reservation.refundedAt)} />
      )}
    </Section>
  );
}

// Lalou
