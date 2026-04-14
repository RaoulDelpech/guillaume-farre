import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import AmericanFrame from "@/components/AmericanFrame";
import { getPageImages } from "@/lib/page-images";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");
  const pageImages = await getPageImages();

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFEFA" }}>
      <Navigation />

      {/* Hero Carousel */}
      <HeroCarousel slides={pageImages.hero.slides} />

      {/* 2 panneaux elegants : Photographies | Toiles */}
      <section
        className="py-20 md:py-28 lg:py-32 px-6 md:px-10"
        style={{ backgroundColor: "#FEFEFA" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 lg:gap-24">
          {/* Bloc Photographies */}
          <Link
            href="/galerie"
            className="group flex flex-col items-center text-center"
          >
            <div className="transition-transform duration-500 group-hover:-translate-y-1 w-full max-w-[420px]">
              <AmericanFrame
                src="/images/works/photos/2.jpg"
                alt="Photographies de Guillaume Farre"
                imageWidth={1333}
                imageHeight={2000}
                frameColor="walnut"
                priority
                className="w-full"
              />
            </div>
            <h2
              className="mt-10 text-2xl md:text-3xl font-extralight tracking-[0.25em] uppercase"
              style={{ color: "#1a1a1a" }}
            >
              {t("photos.title")}
            </h2>
            <div
              className="mt-4 w-12 h-px"
              style={{ backgroundColor: "#8c6e32" }}
            />
            <p
              className="mt-5 text-sm md:text-base font-light tracking-wide max-w-xs"
              style={{ color: "#4a4a4a" }}
            >
              {t("photos.subtitle")}
            </p>
            <span
              className="mt-8 inline-block text-xs tracking-[0.3em] uppercase font-light border-b pb-1 transition-all duration-300 group-hover:tracking-[0.35em]"
              style={{ color: "#8c6e32", borderColor: "#8c6e32" }}
            >
              {t("photos.cta")}
            </span>
          </Link>

          {/* Bloc Toiles */}
          <Link
            href="/toiles"
            className="group flex flex-col items-center text-center"
          >
            <div className="transition-transform duration-500 group-hover:-translate-y-1 w-full max-w-[420px]">
              <AmericanFrame
                src="/images/toiles/6.jpg"
                alt="Toiles de Guillaume Farre"
                imageWidth={1800}
                imageHeight={2700}
                frameColor="black"
                priority
                className="w-full"
              />
            </div>
            <h2
              className="mt-10 text-2xl md:text-3xl font-extralight tracking-[0.25em] uppercase"
              style={{ color: "#1a1a1a" }}
            >
              {t("toiles.title")}
            </h2>
            <div
              className="mt-4 w-12 h-px"
              style={{ backgroundColor: "#8c6e32" }}
            />
            {t("toiles.subtitle") && (
              <p
                className="mt-5 text-sm md:text-base font-light tracking-wide max-w-xs"
                style={{ color: "#4a4a4a" }}
              >
                {t("toiles.subtitle")}
              </p>
            )}
            <span
              className="mt-8 inline-block text-xs tracking-[0.3em] uppercase font-light border-b pb-1 transition-all duration-300 group-hover:tracking-[0.35em]"
              style={{ color: "#8c6e32", borderColor: "#8c6e32" }}
            >
              {t("toiles.cta")}
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
