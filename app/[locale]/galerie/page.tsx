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

      {/* Hero élégant */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("/images/works/empreintes/empreintes-007.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 text-center px-6 lg:px-8 max-w-5xl py-28">
          <div className="text-primary text-xs font-light mb-8 tracking-[0.3em] uppercase">
            Galerie
          </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-10 text-foreground">
            {t("title")}
          </h1>
          <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Toiles. Photographies. Empreintes irréversibles.
          </p>
        </div>
      </div>

      {/* Filtres et Galerie avec interactivité */}
      <GalleryClient works={works} />
    </main>
  );
}
