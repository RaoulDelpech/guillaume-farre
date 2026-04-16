import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { routing } from '@/i18n/routing';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import AdminWrapper from '@/components/admin/AdminWrapper';
import ClientShell from '@/components/ClientShell';
import "./globals.css";

// SEO - Décisions audit 2025-01-20
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com'),
  title: {
    default: "Guillaume Farré",
    template: "%s | Guillaume Farré",
  },
  description: "Guillaume Farré — Toiles et Photographies.",
  keywords: ["Guillaume Farré", "artiste", "Dino", "art abstrait", "photographie d'art", "séries limitées", "tableaux contemporains"],
  icons: {
    icon: "/favicon.svg",
  },
  authors: [{ name: "Guillaume Farré" }],
  creator: "Guillaume Farré",
  publisher: "Guillaume Farré",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US", "it_IT"],
    url: "https://guillaumefarre.com",
    siteName: "Guillaume Farré",
    title: "Guillaume Farré - Artiste",
    description: "Découvrez l'univers artistique unique de Guillaume Farré : tableaux abstraits créés par le passage direct de la Dino sur toile, photographies d'art en séries limitées.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Guillaume Farré — Toiles et Photographies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guillaume Farré - Artiste",
    description: "Découvrez l'univers artistique unique de Guillaume Farré : tableaux abstraits créés avec la Dino, photographies d'art en séries limitées.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://guillaumefarre.com",
    languages: {
      'fr-FR': "https://guillaumefarre.com/fr",
      'en-US': "https://guillaumefarre.com/en",
      'it-IT': "https://guillaumefarre.com/it",
      'x-default': "https://guillaumefarre.com/fr", // Lalou: Fallback pour hreflang
    },
  },
  verification: {
    // Lalou: Codes a remplacer avec vrais codes depuis Google/Bing Search Console
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  // VIP visitors get a stripped-down layout (no footer, no overlays)
  const cookieStore = await cookies();
  const isVipVisitor = !!cookieStore.get('gf_vip') && !cookieStore.get('gf_auth')?.value;
  const isPreLaunch = process.env.SITE_MODE === 'pre-launch';

  return (
    <html lang={locale}>
      <head>
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
            <AdminWrapper>
              <ClientShell isVipVisitor={isVipVisitor} isPreLaunch={isPreLaunch}>
                {children}
              </ClientShell>
              {!isVipVisitor && !isPreLaunch && <Footer />}
            </AdminWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
