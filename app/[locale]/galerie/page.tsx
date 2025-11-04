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
            Toiles. Photographies. Traces de Ferrari.<br />
            Chaque œuvre est unique. Irréversible.
          </p>
        </div>
      </div>

      {/* Filtres et Galerie avec interactivité */}
      <GalleryClient works={works} />

      {/* CTA élégant */}
      <section className="bg-muted/20 border-t border-border py-28 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8">
              Vous souhaitez acquérir une œuvre ?
            </h2>
            <p className="text-xl font-light text-muted-foreground mb-12 leading-relaxed">
              Les œuvres disponibles. Rejoignez ceux qui possèdent une trace.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/boutique"
                className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded text-xl transition-all"
              >
                Voir la boutique
              </a>
              <a
                href="/contact"
                className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded text-xl transition-all"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
