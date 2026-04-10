import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import AmericanFrame from "@/components/AmericanFrame";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getPageImages } from "@/lib/page-images";
import photosData from "@/data/photos.json";
import toilesData from "@/data/toiles.json";
import blurMap from "@/data/blur-placeholders.json";

const BLUR: Record<string, string> = blurMap;

/** Curated photo selection — flex-proportional rows */
const PHOTO_ROWS: number[][] = [
  [1, 3, 9],
  [5, 6, 7],
];

/** Curated toile selection — avoids triptych #17 */
const TOILE_ROWS: number[][] = [
  [1, 8, 9],
  [6, 18, 20],
];

function frameColor(id: number): "black" | "oak" | "walnut" {
  if (id % 3 === 0) return "walnut";
  if (id % 3 === 1) return "black";
  return "oak";
}

/** Safe toile extraction — handles triptych #17 that lacks single `image` */
function findToile(id: number) {
  const found = toilesData.find((item) => item.id === id);
  if (!found || !("image" in found)) return null;
  return {
    id: found.id,
    name: found.name,
    image: found.image as string,
    imageWidth: found.imageWidth,
    imageHeight: found.imageHeight,
  };
}

export default async function HomePage() {
  const pageImages = await getPageImages();
  const t = await getTranslations("home");

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroCarousel slides={pageImages.hero.slides} />

      {/* ── Photographies ── */}
      <section className="bg-zinc-950 py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.12em] uppercase text-white/90">
              {t("photos.title")}
            </h2>
            <div className="w-12 h-px bg-[rgba(140,110,50,0.35)] mx-auto mt-5 mb-5" />
            <p className="text-sm md:text-base font-light tracking-wide text-white/45 max-w-md mx-auto">
              {t("photos.subtitle")}
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {PHOTO_ROWS.map((rowIds, ri) => {
              const row = rowIds.map(
                (id) => photosData.find((p) => p.id === id)!
              );
              return (
                <div key={ri} className="flex flex-wrap gap-4 md:gap-6">
                  {row.map((photo) => (
                    <Link
                      key={photo.id}
                      href="/galerie"
                      className="basis-full sm:basis-0 group block"
                      style={{
                        flexGrow: photo.imageWidth / photo.imageHeight,
                      }}
                    >
                      <div className="transition-transform duration-500 group-hover:scale-[1.02]">
                        <AmericanFrame
                          src={photo.image}
                          alt={photo.name}
                          imageWidth={photo.imageWidth}
                          imageHeight={photo.imageHeight}
                          frameColor={frameColor(photo.id)}
                          className="w-full"
                          blurDataURL={BLUR[photo.image]}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-14 md:mt-20">
            <Link
              href="/galerie"
              className="inline-block px-8 py-3 text-sm tracking-[0.15em] uppercase font-light text-white/60 border border-white/15 hover:border-white/35 hover:text-white/90 transition-all duration-300"
            >
              {t("photos.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Toiles ── */}
      <section className="bg-[#0d0d0d] py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-extralight tracking-[0.12em] uppercase text-white/90">
              {t("toiles.title")}
            </h2>
            <div className="w-12 h-px bg-[rgba(140,110,50,0.35)] mx-auto mt-5 mb-5" />
            <p className="text-sm md:text-base font-light tracking-wide text-white/45 max-w-lg mx-auto leading-relaxed">
              {t("toiles.subtitle")}
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {TOILE_ROWS.map((rowIds, ri) => (
              <div key={ri} className="flex flex-wrap gap-4 md:gap-6">
                {rowIds.map((id) => {
                  const toile = findToile(id);
                  if (!toile) return null;
                  return (
                    <div
                      key={toile.id}
                      className="basis-full sm:basis-0 group"
                      style={{
                        flexGrow: toile.imageWidth / toile.imageHeight,
                      }}
                    >
                      <div className="relative overflow-hidden">
                        <Image
                          src={toile.image}
                          alt={toile.name}
                          width={toile.imageWidth}
                          height={toile.imageHeight}
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          {...(BLUR[toile.image]
                            ? {
                                placeholder: "blur" as const,
                                blurDataURL: BLUR[toile.image],
                              }
                            : {})}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
                      </div>
                      <div className="mt-3 px-1">
                        <p className="text-sm font-light text-white/70 tracking-wide">
                          {toile.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="text-center mt-14 md:mt-20">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 text-sm tracking-[0.15em] uppercase font-light text-white/60 border border-white/15 hover:border-white/35 hover:text-white/90 transition-all duration-300"
            >
              {t("toiles.cta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
