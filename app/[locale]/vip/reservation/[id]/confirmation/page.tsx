/**
 * Page `/vip/reservation/[id]/confirmation` (Sprint 4).
 *
 * Page de retour Stripe Checkout (success_url). On verifie que la session
 * Stripe est bien `paid` ET que son metadata.reservationId correspond.
 *
 * Le webhook `checkout.session.completed` (cote serveur) est la source de
 * verite : il a deja persiste la reservation en `paid`, marque la toile,
 * cree la commande et envoye les emails. Cette page n'est qu'un affichage
 * de remerciement avec recap.
 *
 * Si Stripe n'est pas configure ou si la session ne matche pas, on affiche
 * un message neutre "en attente de confirmation" plutot que d'echouer.
 *
 * @author Lalou
 */
import { Metadata } from 'next';
import Stripe from 'stripe';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/routing';
import { getAccessLevel } from '@/lib/access';
import { readReservations, readToiles } from '@/lib/reservations-store';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'vipConfirmation' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
    robots: { index: false, follow: false },
  };
}

const STRIPE_API_VERSION = '2025-10-29.clover';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

async function verifyStripeSession(
  sessionId: string,
  reservationId: string,
): Promise<{ paid: boolean; amountTotal: number | null }> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { paid: false, amountTotal: null };
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: STRIPE_API_VERSION,
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.reservationId !== reservationId) {
      return { paid: false, amountTotal: null };
    }
    return {
      paid: session.payment_status === 'paid',
      amountTotal: session.amount_total ?? null,
    };
  } catch (err) {
    console.error('[confirmation] stripe.checkout.sessions.retrieve failed:', err);
    return { paid: false, amountTotal: null };
  }
}

export default async function ConfirmationPage({ params, searchParams }: PageProps) {
  const { locale, id } = await params;
  const { session_id: sessionId } = await searchParams;

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

  const toiles = await readToiles();
  const toile = toiles.find((t) => t.name === reservation.canvasTitle);

  const t = await getTranslations({ locale, namespace: 'vipConfirmation' });

  let stripePaid = false;
  let amountFromStripe: number | null = null;
  if (sessionId) {
    const verified = await verifyStripeSession(sessionId, id);
    stripePaid = verified.paid;
    amountFromStripe = verified.amountTotal;
  }

  const reservationPaid = reservation.status === 'paid';
  const displayAmount =
    amountFromStripe !== null ? amountFromStripe / 100 : toile?.price ?? null;

  const isSettled = stripePaid || reservationPaid;

  return (
    <main className="min-h-screen bg-[#f7f3eb] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 space-y-3 text-center">
          <h1 className="text-2xl font-extralight tracking-[0.15em] uppercase text-[#1a1a1a]">
            {isSettled ? t('title_paid') : t('title_pending')}
          </h1>
          <p className="text-sm font-light text-neutral-600">
            {isSettled ? t('subtitle_paid') : t('subtitle_pending')}
          </p>
        </header>

        <section className="bg-white border border-neutral-300 p-6 sm:p-8 space-y-6 shadow-sm">
          {reservation.orderNumber ? (
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                {t('order_label')}
              </p>
              <p className="text-lg font-light text-[#1a1a1a]">{reservation.orderNumber}</p>
            </div>
          ) : null}

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              {t('canvas_label')}
            </p>
            <p className="text-base font-light text-[#1a1a1a]">{reservation.canvasTitle}</p>
            {toile ? (
              <p className="text-sm font-light text-neutral-600">
                {toile.dimensions} — {toile.technique}, {toile.year}
              </p>
            ) : null}
          </div>

          {displayAmount !== null ? (
            <div className="border-t border-neutral-200 pt-4 flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-500">
                {t('amount_label')}
              </span>
              <span className="text-xl font-light text-[#1a1a1a]">
                {displayAmount.toLocaleString('fr-FR')} €
              </span>
            </div>
          ) : null}

          <div className="border-t border-neutral-200 pt-4 text-sm font-light text-neutral-600 leading-relaxed">
            {isSettled ? t('next_steps_paid') : t('next_steps_pending')}
          </div>

          <Link
            href="/vip"
            locale={locale}
            className="block text-center w-full px-6 py-3 text-xs tracking-[0.25em] uppercase border border-[#8c6e32] text-[#8c6e32] hover:bg-[#8c6e32] hover:text-white transition-colors"
          >
            {t('continue_vip')}
          </Link>
        </section>
      </div>
    </main>
  );
}
