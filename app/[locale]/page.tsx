import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import EarlyAccessCountdown from "@/components/early-access/EarlyAccessCountdown";
import PhotoFrame from "@/components/PhotoFrame";
import AmericanFrame from "@/components/AmericanFrame";
import LandingSection from "@/components/landing/LandingSection";
import { getPageImages } from "@/lib/page-images";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import blurPlaceholders from "@/data/blur-placeholders.json";

const BLUR = blurPlaceholders as Record<string, string>;

export default async function HomePage() {
  const t = await getTranslations("home");
  const pageImages = await getPageImages();

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Carousel */}
      <HeroCarousel slides={pageImages.hero.slides} />

      {/* Compteur ouverture au public */}
      <EarlyAccessCountdown />

      {/* Texte de bienvenue Guillaume */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-[700px] mx-auto">
          <div className="w-16 h-px mx-auto mb-10" style={{ backgroundColor: "#8c6e32" }} />
          <div className="space-y-6 font-light leading-relaxed tracking-wide text-sm md:text-base" style={{ color: "#4a4a4a" }}>
            <p>{t("welcomeText1")}</p>
            <p>{t("welcomeText2")}</p>
            <p>{t("welcomeText3")}</p>
            <p>
              {t.rich("welcomeText4", {
                link: (chunks) => (
                  <a
                    href="mailto:guillaume@guillaumefarre.com"
                    className="underline underline-offset-2 transition-colors duration-200 hover:text-[#8c6e32]"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
          <p className="mt-6 italic font-light tracking-wider" style={{ color: "#1a1a1a" }}>
            {t("welcomeSignature")}
          </p>
        </div>
      </section>

      {/* Citation */}
      <section className="py-10 md:py-14 px-6">
        <blockquote className="max-w-[600px] mx-auto text-center">
          <p
            className="text-lg md:text-xl font-light italic tracking-wide"
            style={{ color: '#1a1a1a' }}
          >
            &laquo;&nbsp;Un adulte est un enfant qui a mal tourn&eacute;.&nbsp;&raquo;
          </p>
        </blockquote>
      </section>

      {/* 2 panneaux elegants : Photographies | Toiles */}
      <section className="py-20 md:py-28 lg:py-32 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 lg:gap-24 items-start">
          {/* Bloc Photographies */}
          <Link
            href="/galerie"
            className="group flex flex-col items-center text-center"
          >
            <div className="transition-transform duration-500 group-hover:-translate-y-1 w-full max-w-[420px]">
              <PhotoFrame
                src="/images/works/photos/2.jpg"
                alt="Photographies de Guillaume Farre"
                imageWidth={1333}
                imageHeight={2000}
                blurDataURL={BLUR["/images/works/photos/2.jpg"]}
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
                imageWidth={1483}
                imageHeight={1966}
                frameColor="black"
                blurDataURL={BLUR["/images/toiles/6.jpg"]}
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

      {/* Grille photos + toiles cliquables */}
      <LandingSection />
    </main>
  );
}
