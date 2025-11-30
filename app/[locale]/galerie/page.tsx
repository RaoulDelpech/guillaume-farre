import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import GalleryClient from "@/components/GalleryClient";
import { getWorksFromMetadata } from "@/lib/works";

export default async function GaleriePage() {
  const t = await getTranslations("gallery");
  const works = await getWorksFromMetadata();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero immersif - photo pleine page sans filtre */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Image de fond pleine page */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'url("/images/works/empreintes/empreintes-007.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        {/* Overlay sombre pour lisibilité du texte */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center px-6 lg:px-8 max-w-5xl py-28">
          <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-10 text-white">
            {t("title")}
          </h1>
          <p className="text-2xl md:text-3xl font-light text-white/90 max-w-4xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Filtres et Galerie avec interactivité */}
      <GalleryClient works={works} />
    </main>
  );
}
