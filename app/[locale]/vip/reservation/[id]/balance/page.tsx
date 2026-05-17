/**
 * Page `/vip/reservation/[id]/balance` (Sprint 5).
 *
 * Recap du solde 70% restant a regler apres versement de l'acompte 30%.
 * L'acheteur arrive ici depuis :
 *  - le redirect post-acompte (confirmation page step=deposit)
 *  - le lien dans l'email "Acompte recu"
 *  - le redirect automatique si il revient sur /checkout en status partial_paid
 *
 * Server Component : check niveau secret + statut `partial_paid`. Redirect
 * vers /vip si autre statut. Affiche un message d'expiration si balanceDueAt
 * depasse.
 *
 * @author Lalou
 */
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/routing';
import { getAccessLevel } from '@/lib/access';
import { readReservations, readToiles } from '@/lib/reservations-store';
import {
  computeBalanceAmount,
  isBalanceExpired,
} from '@/lib/canvas-payment-helpers';
import BalanceCheckoutButton from '@/components/vip/BalanceCheckoutButton';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'vipBalance' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    robots: { index: false, follow: false },
  };
}

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : locale === 'it' ? 'it-IT' : 'en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default async function BalancePage({ params }: PageProps) {
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

  if (reservation.status !== 'partial_paid') {
    redirect({ href: '/vip', locale });
    return null;
  }

  const toiles = await readToiles();
  const toile = toiles.find((t) => t.name === reservation.canvasTitle);
  if (!toile) {
    redirect({ href: '/vip', locale });
    return null;
  }

  const t = await getTranslations({ locale, namespace: 'vipBalance' });
  const balanceAmount = computeBalanceAmount(toile.price, reservation.depositAmount);
  const depositAmount = reservation.depositAmount ?? toile.price - balanceAmount;
  const expired = reservation.balanceDueAt
    ? isBalanceExpired(reservation.balanceDueAt)
    : false;
  const dueDateLabel = formatDate(reservation.balanceDueAt, locale);

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

          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-neutral-500">{t('total_label')}</span>
              <span className="font-light text-neutral-700">
                {toile.price.toLocaleString('fr-FR')} €
              </span>
            </div>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-neutral-500">{t('deposit_paid_label')}</span>
              <span className="font-light text-neutral-700">
                {depositAmount.toLocaleString('fr-FR')} €
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-neutral-200 pt-3">
              <span className="text-xs uppercase tracking-wider text-neutral-500">
                {t('balance_due_label')}
              </span>
              <span className="text-2xl font-light text-[#1a1a1a]">
                {balanceAmount.toLocaleString('fr-FR')} €
              </span>
            </div>
            {dueDateLabel ? (
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-neutral-500">{t('due_date_label')}</span>
                <span className="font-light text-neutral-700">{dueDateLabel}</span>
              </div>
            ) : null}
          </div>

          {expired ? (
            <div
              role="alert"
              className="border border-red-300 bg-red-50 px-4 py-4 text-sm font-light text-red-900 space-y-2"
            >
              <p className="font-medium">{t('expired_title')}</p>
              <p>{t('expired_message')}</p>
              <Link
                href="/contact"
                locale={locale}
                className="inline-block mt-2 px-4 py-2 text-xs uppercase tracking-wider border border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-colors"
              >
                {t('expired_cta_contact')}
              </Link>
            </div>
          ) : (
            <BalanceCheckoutButton
              reservationId={reservation.id}
              locale={locale}
              balanceAmount={balanceAmount}
            />
          )}

          <div className="border-t border-neutral-200 pt-4 text-sm font-light text-neutral-600 leading-relaxed">
            {t('note')}
          </div>
        </section>
      </div>
    </main>
  );
}
