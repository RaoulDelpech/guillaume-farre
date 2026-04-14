import { Metadata } from 'next';
import Navigation from '@/components/navigation/Navigation';
import { GalerieContent } from '@/components/galerie/GalerieContent';

export const metadata: Metadata = {
  title: 'Photographies',
  description:
    'Photographies de Guillaume Farré — tirages numérotés et signés, éditions limitées.',
  openGraph: {
    title: 'Photographies | Guillaume Farré',
    description: 'Photographies de Guillaume Farré — tirages numérotés et signés.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Photographies de Guillaume Farré' }],
  },
};

/**
 * Page Galerie — photographies avec prix et lightbox
 * Fond ivoire texture, grille responsive, cadres americains
 * @author Lalou
 */
export default function GaleriePage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <GalerieContent />
      </div>
    </main>
  );
}
