import { Metadata } from 'next';
import Navigation from '@/components/navigation/Navigation';
import { GalerieContent } from '@/components/galerie/GalerieContent';

export const metadata: Metadata = {
  title: 'Photographies — Guillaume Farré',
  description:
    'Photographies de Guillaume Farré. Concept Car Art — quand la Ferrari peint la toile.',
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

      <div
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: '#FAF7F2',
          backgroundImage: [
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.008) 2px, rgba(0,0,0,0.008) 3px)',
            'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.006) 3px, rgba(0,0,0,0.006) 4px)',
            'radial-gradient(ellipse at 50% 30%, rgba(255,255,245,0.5) 0%, transparent 70%)',
          ].join(', '),
        }}
      >
        <GalerieContent />
      </div>
    </main>
  );
}
