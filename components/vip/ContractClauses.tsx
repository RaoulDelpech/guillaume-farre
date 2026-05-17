'use client';

/**
 * Clauses juridiques statiques du contrat de vente (articles 5 a 10
 * + footer eIDAS). Textes verbatim de FLOW_VIP_2026-05.md section 6.
 *
 * Extrait de ContractPreview pour respecter la limite 200 lignes par
 * composant. Aucun etat ni prop variable — ces clauses sont identiques
 * pour toutes les ventes (Sprint 3, Sprint 4 reverra si paiement
 * change la formulation).
 *
 * @author Lalou
 */

const ARRHES_VERBATIM =
  'Les sommes versées à la signature du présent contrat constituent des arrhes au sens de l\'article 1590 du Code civil. Au-delà du délai légal de rétractation de 14 jours, en cas de renonciation de l\'acheteur, lesdites arrhes resteront acquises au vendeur.';

const FRAIS_VERBATIM =
  'En cas de rétractation au-delà des 14 jours légaux, une indemnité forfaitaire de 300 EUR sera retenue au titre des frais de gestion, frais bancaires non récupérables et préparation du certificat.';

const EIDAS_VERBATIM =
  'Ce document constituera une signature électronique simple au sens du Règlement eIDAS (UE) n° 910/2014 et de l\'article 1367 du Code civil.';

export default function ContractClauses() {
  return (
    <>
      <section>
        <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
          Article 5 — Garantie d&apos;authenticité
        </h4>
        <p>
          L&apos;artiste garantit être l&apos;unique auteur de l&apos;œuvre. Un certificat
          d&apos;authenticité distinct sera remis à l&apos;acquéreur après paiement intégral
          du prix.
        </p>
      </section>

      <section>
        <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
          Article 6 — Droit de rétractation (14 jours)
        </h4>
        <p>
          Conformément aux articles L221-18 et suivants du Code de la consommation,
          l&apos;acquéreur consommateur dispose d&apos;un délai de 14 jours pour exercer son
          droit de rétractation. Cet article s&apos;applique aux acheteurs particuliers
          uniquement, et non aux professionnels.
        </p>
      </section>

      <section>
        <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
          Article 7 — Qualification des sommes versées (arrhes)
        </h4>
        <p>{ARRHES_VERBATIM}</p>
      </section>

      <section>
        <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
          Article 8 — Frais de gestion forfaitaires post-14j
        </h4>
        <p>{FRAIS_VERBATIM}</p>
      </section>

      <section>
        <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
          Article 9 — Mode de retrait et risque transport
        </h4>
        <p>
          Mode de retrait : à l&apos;atelier de l&apos;artiste (Toulouse) ou livraison
          professionnelle sur devis distinct. Les risques liés au transport sont à la
          charge de l&apos;acquéreur dès sortie de l&apos;atelier.
        </p>
      </section>

      <section>
        <h4 className="text-sm font-medium uppercase tracking-wider mb-2">
          Article 10 — Loi applicable et juridiction
        </h4>
        <p>
          Le présent contrat est soumis au droit français. Tout litige sera porté devant
          le tribunal compétent de Toulouse. Conformément à l&apos;article R631-3 du Code
          de la consommation, le consommateur conserve le droit de saisir au choix le
          tribunal de son lieu de résidence ou celui du lieu d&apos;exécution du contrat.
        </p>
      </section>

      <footer className="border-t border-neutral-300 pt-3 text-[11px] text-neutral-600 italic">
        {EIDAS_VERBATIM}
      </footer>
    </>
  );
}
