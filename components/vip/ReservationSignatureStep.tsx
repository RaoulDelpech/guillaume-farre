'use client';

/**
 * Etape 2 du flow de reservation VIP : signature electronique.
 *
 * Affiche le contrat (apercu HTML) puis le canvas de signature.
 * Au succes, declenche `onSigned` (qui ferme la modal et rafraichit
 * la page parent).
 *
 * @author Lalou
 */

import { useTranslations } from 'next-intl';
import ContractPreview from './ContractPreview';
import SignaturePad from './SignaturePad';
import type { ReservationFormState } from './use-reservation-form';
import type { SignSuccessPayload } from './use-signature-submit';

export interface ReservationSignatureStepProps {
  reservationId: string;
  buyerState: ReservationFormState;
  canvas: {
    title: string;
    dimensions: string;
    technique: string;
    year: number;
    price: number;
  };
  onSigned: (payload: SignSuccessPayload) => void;
}

export default function ReservationSignatureStep({
  reservationId,
  buyerState,
  canvas,
  onSigned,
}: ReservationSignatureStepProps) {
  const t = useTranslations('signature');

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-extralight tracking-[0.15em] uppercase text-neutral-700">
          {t('step_title')}
        </h3>
        <p className="text-sm font-light text-neutral-600 leading-relaxed">
          {t('step_intro')}
        </p>
      </div>

      <ContractPreview
        reservationId={reservationId}
        buyer={{
          name: `${buyerState.firstName} ${buyerState.lastName}`.trim(),
          email: buyerState.email,
          phone: buyerState.phone,
          addressLine1: buyerState.line1,
          addressLine2: buyerState.line2 || undefined,
          city: buyerState.city,
          postalCode: buyerState.postalCode,
          country: buyerState.country,
          buyerType: buyerState.buyerType,
          siret: buyerState.buyerType === 'professionnel' ? buyerState.siret : undefined,
          companyName:
            buyerState.buyerType === 'professionnel' ? buyerState.companyName : undefined,
        }}
        artwork={canvas}
      />

      <SignaturePad reservationId={reservationId} onSignSuccess={onSigned} />
    </div>
  );
}
