import Navigation from "@/components/navigation/Navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />

      {/* 2 blocs egaux : Photographies | Toiles */}
      <section className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
        {/* Bloc Photographies */}
        <Link
          href="/galerie"
          className="relative flex-1 min-h-[50vh] md:min-h-0 group overflow-hidden"
        >
          <Image
            src="/images/works/photos/5.jpg"
            alt="Photographies"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.15em] uppercase text-white/90 mb-4">
              {t("photos.title")}
            </h2>
            <div className="w-10 h-px bg-white/30 mb-4" />
            <p className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-sm">
              {t("photos.subtitle")}
            </p>
            <span className="mt-8 inline-block px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-light text-white/70 border border-white/20 group-hover:border-white/40 group-hover:text-white transition-all duration-300 min-h-[44px] flex items-center">
              {t("photos.cta")}
            </span>
          </div>
        </Link>

        {/* Bloc Toiles */}
        <Link
          href="/toiles"
          className="relative flex-1 min-h-[50vh] md:min-h-0 group overflow-hidden"
        >
          <Image
            src="/images/toiles/8.jpg"
            alt="Toiles"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.15em] uppercase text-white/90 mb-4">
              {t("toiles.title")}
            </h2>
            <div className="w-10 h-px bg-white/30 mb-4" />
            {t("toiles.subtitle") && (
              <p className="text-sm md:text-base font-light tracking-wide text-white/60 max-w-sm">
                {t("toiles.subtitle")}
              </p>
            )}
            <span className="mt-8 inline-block px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-light text-white/70 border border-white/20 group-hover:border-white/40 group-hover:text-white transition-all duration-300 min-h-[44px] flex items-center">
              {t("toiles.cta")}
            </span>
          </div>
        </Link>
      </section>
    </main>
  );
}
