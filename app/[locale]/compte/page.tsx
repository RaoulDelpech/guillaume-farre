/**
 * Mon Compte page - Account management with magic link authentication
 *
 * Two states:
 * - Not authenticated: Show magic link request form
 * - Authenticated: Show order list and account info
 *
 * @author Lalou
 */

import { Metadata } from 'next';
import { cookies } from 'next/headers';
import AccountLoginForm from '@/components/account/AccountLoginForm';
import AccountDashboard from '@/components/account/AccountDashboard';

export const metadata: Metadata = {
  title: 'Mon compte',
  description: 'Accédez à votre espace personnel et consultez vos commandes',
};

export default async function ComptePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const email = cookieStore.get('gf_account_email')?.value;
  const params = await searchParams;

  const isAuthenticated = !!email;

  // Parse error/success messages from URL
  const error = params.error as string | undefined;
  const token = params.token as string | undefined;

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isAuthenticated ? (
          <AccountDashboard email={email} />
        ) : (
          <AccountLoginForm error={error} hasToken={!!token} />
        )}
      </div>
    </div>
  );
}

// Lalou
