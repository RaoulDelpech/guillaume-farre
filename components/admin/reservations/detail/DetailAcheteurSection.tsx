"use client";

import { Section, KV } from "./Section";
import { Reservation } from "./types";

/**
 * Section "Acheteur" : nom, email, telephone, type, adresse, message.
 *
 * @author Lalou
 */
export function DetailAcheteurSection({ reservation }: { reservation: Reservation }) {
  return (
    <Section title="Acheteur">
      <KV k="Nom" v={reservation.name || `${reservation.firstName} ${reservation.lastName}`} />
      <KV k="Email" v={reservation.email} />
      <KV k="Téléphone" v={reservation.phone} />
      <KV k="Type" v={reservation.buyerType} />
      {reservation.buyerType === "professionnel" && (
        <>
          <KV k="Société" v={reservation.companyName || "—"} />
          <KV k="SIRET" v={reservation.siret || "—"} />
        </>
      )}
      <KV
        k="Adresse"
        v={[
          reservation.address?.line1,
          reservation.address?.line2,
          `${reservation.address?.postalCode} ${reservation.address?.city}`,
          reservation.address?.country,
        ]
          .filter(Boolean)
          .join(", ")}
      />
      {reservation.message && <KV k="Message" v={reservation.message} />}
    </Section>
  );
}

// Lalou
