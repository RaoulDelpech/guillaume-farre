import { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import AmericanFrame from "@/components/AmericanFrame";
import { Link } from "@/i18n/routing";
import photos from "@/data/photos.json";
import blurMap from "@/data/blur-placeholders.json";

export const metadata: Metadata = {
  title: "Photographies — Guillaume Farré",
  description:
    "Photographies de Guillaume Farré. Concept Car Art — quand la Ferrari peint la toile.",
};

/** Disposition des photos en rangees */
const ROWS: number[][] = [
  [1],
  [2, 3, 4],
  [5, 6, 7],
  [8, 9, 10],
  [11, 12, 13],
  [14, 15],
  [16],
];

const BLUR: Record<string, string> = blurMap;

function getFrameColor(id: number): "black" | "oak" | "walnut" {
  if (id % 3 === 0) return "walnut";
  if (id % 3 === 1) return "black";
  return "oak";
}

/** Legende sous chaque photo */
function PhotoCaption({ name }: { name: string }) {
  return (
    <div className="mt-3 px-1">
      <p className="text-sm font-light text-[#1a1a1a] tracking-wide">
        {name}
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
  );
}

/**
 * Page Galerie — photographies
 * Layout en rangees avec hauteurs egalisees par flex proportionnel.
 * Toutes les images utilisent next/image via AmericanFrame,
 * avec blur placeholder et priority sur le hero.
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
            Concept Car Art — l&apos;instant où la Ferrari peint la toile
          </p>
        </div>

        {/* Grille en rangees */}
        <div className="max-w-6xl mx-auto space-y-10">
          {ROWS.map((rowIds, rowIndex) => {
            const rowPhotos = rowIds.map(
              (id) => photos.find((p) => p.id === id)!
            );
            const isSolo = rowPhotos.length === 1;
            const isHero = rowIndex === 0;

            if (isSolo) {
              const photo = rowPhotos[0];
              return (
                <div key={rowIndex} className="flex justify-center">
                  <div
                    className={`group w-full ${
                      isHero
                        ? "sm:w-3/4 lg:w-[70%] max-w-[1000px]"
                        : "sm:w-2/3 lg:w-[55%] max-w-[800px]"
                    }`}
                  >
                    <AmericanFrame
                      src={photo.image}
                      alt={photo.name}
                      imageWidth={photo.imageWidth}
                      imageHeight={photo.imageHeight}
                      frameColor={getFrameColor(photo.id)}
                      className="w-full"
                      blurDataURL={BLUR[photo.image]}
                      priority={isHero}
                    />
                    <PhotoCaption name={photo.name} />
                  </div>
                </div>
              );
            }

            return (
              <div key={rowIndex} className="flex flex-wrap gap-4 sm:gap-6">
                {rowPhotos.map((photo) => {
                  const aspectRatio = photo.imageWidth / photo.imageHeight;
                  return (
                    <div
                      key={photo.id}
                      className="group basis-full sm:basis-0"
                      style={{ flexGrow: aspectRatio }}
                    >
                      <AmericanFrame
                        src={photo.image}
                        alt={photo.name}
                        imageWidth={photo.imageWidth}
                        imageHeight={photo.imageHeight}
                        frameColor={getFrameColor(photo.id)}
                        className="w-full"
                        blurDataURL={BLUR[photo.image]}
                      />
                      <PhotoCaption name={photo.name} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
