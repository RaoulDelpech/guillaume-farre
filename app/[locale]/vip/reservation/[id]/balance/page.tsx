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
import {
  readReservations,
  readToiles,
  writeReservations,
  writeToiles,
} from '@/lib/reservations-store';
import {
  computeBalanceAmount,
  isBalanceExpired,
} from '@/lib/canvas-payment-helpers';
import { verifyBalanceToken } from '@/lib/balance-token';
import { checkAndMarkExpired } from '@/lib/expiration-checker';
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
  searchParams: Promise<{ bt?: string | string[] }>;
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

export default async function BalancePage({ params, searchParams }: PageProps) {
  const { locale, id } = await params;
  const { bt: btParam } = await searchParams;
  const balanceToken = Array.isArray(btParam) ? btParam[0] : btParam;

  // Acces autorise si :
  //  (a) cookie VIP `secret` valide, OU
  //  (b) Sprint 6 : token HMAC `bt` signe valide pour CE reservationId
  // Si aucun des deux : on affiche un ecran "lien invalide" plutot que de
  // rediriger silencieusement (meilleur UX pour l'acheteur qui clique sur
  // un lien email perime — il comprend pourquoi il est bloque).
  const level = await getAccessLevel();
  let tokenGranted = false;
  if (level !== 'secret') {
    const verification = verifyBalanceToken(balanceToken);
    if (verification.valid && verification.reservationId === id) {
      tokenGranted = true;
    } else {
      const t = await getTranslations({ locale, namespace: 'vipBalance' });
      return (
        <main className="min-h-screen bg-[#f7f3eb] py-12 px-4">
          <div className="max-w-xl mx-auto">
            <section
              role="alert"
              className="bg-white border border-neutral-300 p-8 text-center space-y-4 shadow-sm"
            >
              <h1 className="text-xl font-extralight tracking-[0.15em] uppercase text-[#1a1a1a]">
                {t('token_invalid_title')}
              </h1>
              <p className="text-sm font-light text-neutral-700 leading-relaxed">
                {t('token_invalid_message')}
              </p>
              <Link
                href="/contact"
                locale={locale}
                className="inline-block mt-4 px-5 py-3 text-xs uppercase tracking-[0.2em] border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                {t('token_invalid_cta_contact')}
              </Link>
            </section>
          </div>
        </main>
      );
    }
  }

  const reservations = await readReservations();
  const reservationIdx = reservations.findIndex((r) => r.id === id);
  if (reservationIdx === -1) {
    redirect({ href: '/vip', locale });
    return null;
  }

  let reservation = reservations[reservationIdx];

  if (reservation.status === 'paid') {
    redirect({
      href: `/vip/reservation/${id}/confirmation`,
      locale,
    });
    return null;
  }

  const toiles = await readToiles();
  const toileIdx = toiles.findIndex((tt) => tt.name === reservation.canvasTitle);
  if (toileIdx === -1) {
    redirect({ href: '/vip', locale });
    return null;
  }
  let toile = toiles[toileIdx];

  // Sprint 6 : expiration intelligente. Si la reservation a depasse son
  // delai (balanceDueAt pour partial_paid, expiresAt sinon), on la marque
  // expired ET on libere la toile immediatement. Persistance synchrone
  // avant rendu pour que d'autres acheteurs puissent reserver.
  const checked = checkAndMarkExpired(reservation, toile);
  if (checked.wasExpired) {
    reservations[reservationIdx] = checked.reservation;
    toiles[toileIdx] = checked.toile;
    try {
      await writeReservations(reservations);
      await writeToiles(toiles);
    } catch (err) {
      console.error('[balance page] failed to persist expiration:', err);
      // On continue avec les versions in-memory meme si l'ecriture echoue —
      // pire cas : le prochain access retentera. Pas de blocage utilisateur.
    }
  }
  reservation = checked.reservation;
  toile = checked.toile;

  // Si la reservation est expiree mais l'acheteur avait paye un acompte,
  // on affiche l'ecran "delai depasse" avec CTA contact. S'il n'a jamais
  // paye d'acompte (status etait pending/signed), on redirige vers /vip
  // car il n'a rien a regler ici.
  if (reservation.status === 'expired' && !reservation.depositPaidAt) {
    redirect({ href: '/vip', locale });
    return null;
  }

  if (reservation.status !== 'partial_paid' && reservation.status !== 'expired') {
    redirect({ href: '/vip', locale });
    return null;
  }

  const t = await getTranslations({ locale, namespace: 'vipBalance' });
  const balanceAmount = computeBalanceAmount(toile.price, reservation.depositAmount);
  const depositAmount = reservation.depositAmount ?? toile.price - balanceAmount;
  const expired =
    reservation.status === 'expired' ||
    (reservation.balanceDueAt ? isBalanceExpired(reservation.balanceDueAt) : false);
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
              balanceToken={tokenGranted ? balanceToken : undefined}
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
