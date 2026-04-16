'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Navigation from '@/components/navigation/Navigation';
import { trackAddToCart, trackBeginCheckout, trackFunnelStep } from '@/lib/analytics';
import photos from '@/data/photos.json';
import blurPlaceholders from '@/data/blur-placeholders.json';

const BLUR = blurPlaceholders as Record<string, string>;

type Photo = {
  id: number;
  name: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
};

type FormatOption = '24x36' | '40x60' | '80x120';

const FORMAT_PRICES: Record<FormatOption, number> = {
  '24x36': 500,
  '40x60': 1000,
  '80x120': 2000,
};

/**
 * Page Boutique — tirages fine art numérotés et signés
 * Photos 1-15 : 3 formats avec prix + Stripe checkout
 * Photo 16 (Bettlejuice) : pièce unique, sur demande
 * @author Lalou
 */
export default function BoutiquePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  useEffect(() => {
    trackFunnelStep('boutique');
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'funnel', step: 'boutique' }),
    }).catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-900 mb-4">
            Boutique
          </h1>
          <p className="text-lg text-zinc-600">
            Tirages fine art numérotés et signés
          </p>
        </div>

        <p className="text-center text-sm text-zinc-500 mb-12">
          TVA non applicable, article 293 B du Code général des impôts
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} locale={locale} />
          ))}
        </div>
      </div>
    </main>
  );
}

function PhotoCard({ photo, locale }: { photo: Photo; locale: string }) {
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>('24x36');
  const [loading, setLoading] = useState(false);

  const isMonumental = photo.id === 16;

  const handlePurchase = async () => {
    if (isMonumental) {
      window.location.href = `/${locale}/contact`;
      return;
    }

    setLoading(true);

    try {
      const selectedPrice = FORMAT_PRICES[selectedFormat];

      // Track e-commerce events
      trackAddToCart({
        id: String(photo.id),
        name: photo.name,
        price: selectedPrice,
        quantity: 1,
        category: 'Photographie',
      });
      trackBeginCheckout(
        [{ id: String(photo.id), name: photo.name, price: selectedPrice, quantity: 1, category: 'Photographie' }],
        selectedPrice,
      );

      const orientation =
        photo.imageWidth > photo.imageHeight ? 'landscape' : 'vertical';

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              title: photo.name,
              price: selectedPrice,
              format: selectedFormat,
              images: [photo.image],
              photoPath: photo.image,
              material: 'semi-glossy',
              orientation,
              frame: 'none',
              category: 'Photographie',
            },
          ],
          locale,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur de paiement');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Erreur de paiement');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-white shadow-sm overflow-hidden">
        <Image
          src={photo.image}
          alt={photo.name}
          width={photo.imageWidth}
          height={photo.imageHeight}
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder={BLUR[photo.image] ? 'blur' : undefined}
          blurDataURL={BLUR[photo.image]}
        />
      </div>

      {/* Title */}
      <h2 className="text-xl font-light text-zinc-900">{photo.name}</h2>

      {/* Formats et Prix */}
      {isMonumental ? (
        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Pièce unique - Format monumental - Sur demande
          </p>
          <button
            onClick={handlePurchase}
            className="w-full px-6 py-3 bg-zinc-900 text-white font-light tracking-wide hover:bg-zinc-800 transition-colors"
          >
            Me contacter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Radio buttons pour formats */}
          <div className="space-y-2">
            {(Object.keys(FORMAT_PRICES) as FormatOption[]).map((format) => (
              <label
                key={format}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`format-${photo.id}`}
                  value={format}
                  checked={selectedFormat === format}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as FormatOption)
                  }
                  className="w-4 h-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900"
                />
                <span className="text-sm text-zinc-700">
                  {format} cm — {FORMAT_PRICES[format]} EUR
                </span>
              </label>
            ))}
          </div>

          {/* Bouton Acheter */}
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full px-6 py-3 bg-zinc-900 text-white font-light tracking-wide hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : 'Acheter'}
          </button>
        </div>
      )}
    </div>
  );
}
