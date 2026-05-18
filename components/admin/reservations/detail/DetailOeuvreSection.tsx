"use client";

import { Section, KV } from "./Section";
import { Reservation, Toile, formatEur } from "./types";

/**
 * Section "Œuvre" : titre, canvas id, dimensions, technique, annee, prix, statut.
 *
 * @author Lalou
 */
export function DetailOeuvreSection({
  reservation,
  toile,
}: {
  reservation: Reservation;
  toile: Toile | null;
}) {
  return (
    <Section title="Œuvre">
      <KV k="Titre" v={reservation.canvasTitle} />
      <KV k="Canvas ID" v={String(reservation.canvasId)} />
      {toile && (
        <>
          <KV k="Dimensions" v={toile.dimensions || "—"} />
          <KV k="Technique" v={toile.technique || "—"} />
          <KV k="Année" v={String(toile.year || "—")} />
          <KV k="Prix" v={formatEur(toile.price)} />
          <KV k="Statut toile" v={toile.status || "available"} />
        </>
      )}
    </Section>
  );
}

// Lalou
