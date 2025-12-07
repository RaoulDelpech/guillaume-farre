import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import StructuredData from '@/components/StructuredData';
import AdminWrapper from '@/components/admin/AdminWrapper';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://guillaumefarre.com'),
  title: {
    default: "Guillaume Farré - Artiste Sculpteur & Collectionneur Ferrari",
    template: "%s | Guillaume Farré",
  },
  description: "Découvrez l'univers artistique unique de Guillaume Farré : tableaux abstraits créés par le passage direct de Ferrari sur toile, photographies d'art en séries limitées. Collection exclusive.",
  keywords: ["Guillaume Farré", "artiste sculpteur", "Ferrari", "art abstrait", "photographie d'art", "séries limitées", "tableaux contemporains", "collectionneur"],
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
    title: "Guillaume Farré - Artiste Sculpteur & Collectionneur Ferrari",
    description: "Découvrez l'univers artistique unique de Guillaume Farré : tableaux abstraits créés par le passage direct de Ferrari sur toile, photographies d'art en séries limitées.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Guillaume Farré - Artiste Sculpteur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guillaume Farré - Artiste Sculpteur & Collectionneur Ferrari",
    description: "Découvrez l'univers artistique unique de Guillaume Farré : tableaux abstraits créés par Ferrari, photographies d'art en séries limitées.",
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
      'fr': "https://guillaumefarre.com/fr",
      'en': "https://guillaumefarre.com/en",
      'it': "https://guillaumefarre.com/it",
    },
  },
  verification: {
    // À ajouter après création comptes
    // google: "google-site-verification-code",
    // yandex: "yandex-verification-code",
    // bing: "bing-verification-code",
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

  return (
    <html lang={locale}>
      <head>
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </head>
      <body className="flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <AdminWrapper>
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </AdminWrapper>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
