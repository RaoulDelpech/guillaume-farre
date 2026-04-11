'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/navigation/Navigation';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface SessionStatus {
  payment_status?: string;
  status?: string;
  error?: string;
}

/**
 * Page de confirmation après paiement Stripe
 * Récupère le statut de la session via l'API /api/stripe/session-status
 * @author Lalou
 */
export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Paramètre session_id manquant');
      setLoading(false);
      return;
    }

    const fetchSessionStatus = async () => {
      try {
        const response = await fetch(
          `/api/stripe/session-status?session_id=${encodeURIComponent(sessionId)}`
        );

        if (!response.ok) {
          setError('Impossible de vérifier le statut de votre commande');
          setLoading(false);
          return;
        }

        const data: SessionStatus = await response.json();
        setSession(data);
      } catch (err) {
        setError('Erreur lors de la vérification du statut');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionStatus();
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 sm:p-10">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Chargement...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4 text-5xl">⚠️</div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Erreur
              </h1>
              <p className="text-gray-600 mb-8">{error}</p>
              <Link
                href={`/${locale}/galerie`}
                className="inline-block bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
              >
                Retour à la galerie
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="bg-green-50 p-4 rounded-full">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                Merci pour votre commande !
              </h1>

              <p className="text-gray-600 mb-6">
                Votre commande a bien été enregistrée. Vous recevrez un email
                de confirmation.
              </p>

              {sessionId && (
                <div className="bg-gray-50 p-4 rounded mb-8 break-words">
                  <p className="text-xs text-gray-500 mb-1">
                    Numéro de commande
                  </p>
                  <p className="text-sm font-mono text-gray-700">
                    {sessionId.substring(0, 20)}...
                  </p>
                </div>
              )}

              <Link
                href={`/${locale}/galerie`}
                className="inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium"
              >
                Retour à la galerie
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
