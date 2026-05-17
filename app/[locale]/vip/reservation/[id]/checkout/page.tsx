/**
 * Page `/vip/reservation/[id]/checkout` (Sprint 4).
 *
 * Recap pre-paiement CB integral. L'acheteur a deja signe (Sprint 3), il
 * voit le recapitulatif (toile, dimensions, prix, identite acheteur) et
 * clique sur "Payer par carte" qui appelle `POST /api/stripe/checkout/canvas`
 * pour creer une Stripe Checkout Session et le rediriger.
 *
 * Server Component : check niveau secret + statut `signed`, sinon redirect.
 *
 * @author Lalou
 */
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/routing';
import { getAccessLevel } from '@/lib/access';
import { readReservations, readToiles } from '@/lib/reservations-store';
import PaymentMethodsSelector from '@/components/vip/PaymentMethodsSelector';
import {
  computeBalanceAmount,
  computeDepositAmount,
} from '@/lib/canvas-payment-helpers';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'vipCheckout' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    robots: { index: false, follow: false },
  };
}

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { locale, id } = await params;

  const level = await getAccessLevel();
  if (level !== 'secret') {
    redirect({ href: '/vip', locale });
  }

  const reservations = await readReservations();
  const reservation = reservations.find((r) => r.id === id);
  if (!reservation) {
    redirect({ href: '/vip', locale });
    return null;
  }

  if (reservation.status === 'paid') {
    redirect({
      href: `/vip/reservation/${id}/confirmation`,
      locale,
    });
    return null;
  }

  if (reservation.status === 'partial_paid') {
    redirect({
      href: `/vip/reservation/${id}/balance`,
      locale,
    });
    return null;
  }

  if (reservation.status !== 'signed') {
    redirect({ href: '/vip', locale });
    return null;
  }

  const toiles = await readToiles();
  const toile = toiles.find((t) => t.name === reservation.canvasTitle);
  if (!toile) {
    redirect({ href: '/vip', locale });
    return null;
  }

  const t = await getTranslations({ locale, namespace: 'vipCheckout' });
  const depositAmount = computeDepositAmount(toile.price);
  const balanceAmount = computeBalanceAmount(toile.price, depositAmount);

  return (
    <main className="min-h-screen bg-[#f7f3eb] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 space-y-2 text-center">
          <h1 className="text-2xl font-extralight tracking-[0.15em] uppercase text-[#1a1a1a]">
            {t('title')}
          </h1>
          <p className="text-sm font-light text-neutral-600">{t('subtitle')}</p>
        </header>

        <section className="bg-white border border-neutral-300 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              {t('canvas_label')}
            </p>
            <h2 className="text-xl font-light text-[#1a1a1a]">{reservation.canvasTitle}</h2>
            <p className="text-sm font-light text-neutral-600">
              {toile.dimensions} — {toile.technique}, {toile.year}
            </p>
          </div>

          <div className="border-t border-neutral-200 pt-4 space-y-1">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              {t('buyer_label')}
            </p>
            <p className="text-sm font-light text-neutral-700">{reservation.name}</p>
            <p className="text-sm font-light text-neutral-700">{reservation.email}</p>
          </div>

          <div className="border-t border-neutral-200 pt-4 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              {t('amount_label')}
            </span>
            <span className="text-2xl font-light text-[#1a1a1a]">
              {toile.price.toLocaleString('fr-FR')} €
            </span>
          </div>

          <div className="border-t border-neutral-200 pt-4 text-sm font-light text-neutral-600 leading-relaxed">
            {t('payment_note')}
          </div>

          <PaymentMethodsSelector
            reservationId={reservation.id}
            locale={locale}
            totalPrice={toile.price}
            depositAmount={depositAmount}
            balanceAmount={balanceAmount}
          />
        </section>
      </div>
    </main>
  );
}
