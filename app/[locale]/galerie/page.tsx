import { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import AmericanFrame from "@/components/AmericanFrame";
import { Link } from "@/i18n/routing";
import photos from "@/data/photos.json";

export const metadata: Metadata = {
  title: "Photographies — Guillaume Farré",
  description:
    "Photographies de Guillaume Farré. Concept Car Art — quand la Ferrari peint la toile.",
};

/**
 * Page Galerie — photographies
 * Grille masonry avec caisses americaines + liens achat
 *
 * @author Lalou
 */
export default function GaleriePage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#FAF7F2",
          backgroundImage: [
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.008) 2px, rgba(0,0,0,0.008) 3px)",
            "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.006) 3px, rgba(0,0,0,0.006) 4px)",
            "radial-gradient(ellipse at 50% 30%, rgba(255,255,245,0.5) 0%, transparent 70%)",
          ].join(", "),
        }}
      >
        {/* En-tete */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.08em] uppercase text-[#1a1a1a] mb-4">
            Photographies
          </h1>
          <div className="w-16 h-px bg-[rgba(140,110,50,0.4)] mx-auto mb-6" />
          <p className="text-lg font-light text-neutral-500 tracking-wide max-w-xl mx-auto">
            Concept Car Art — l'instant ou la Ferrari peint la toile
          </p>
        </div>

        {/* Grille masonry */}
        <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid group">
              <AmericanFrame
                src={photo.image}
                alt={photo.name}
                imageWidth={photo.imageWidth}
                imageHeight={photo.imageHeight}
                frameColor={photo.id % 3 === 0 ? "walnut" : photo.id % 3 === 1 ? "black" : "oak"}
                className="w-full"
              />

              {/* Legende + lien achat */}
              <div className="mt-3 px-1">
                <p className="text-sm font-light text-[#1a1a1a] tracking-wide">
                  {photo.name}
                </p>
                <p className="text-xs font-light text-neutral-400 tracking-wide mt-0.5">
                  Tirage numéroté et signé — Édition limitée
                </p>
                <Link
                  href="/boutique"
                  className="inline-block mt-2 text-xs font-light tracking-widest uppercase text-[#8c6e32] hover:text-[#6b5327] transition-colors duration-200"
                >
                  Acquérir ce tirage
                  <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
