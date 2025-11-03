import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import GalleryGrid from "@/components/GalleryGrid";
import { getWorksFromMetadata } from "@/lib/works";

export default async function GaleriePage() {
  const t = await getTranslations("gallery");
  const works = await getWorksFromMetadata();

  // Statistiques
  const stats = {
    total: works.length,
    photos: works.filter(w => w.type === 'photo').length,
  };

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
          <p className="text-2xl md:text-3xl font-light text-muted-foreground max-w-4xl mx-auto mb-16 leading-relaxed">
            Toiles. Photographies. Traces de Ferrari.<br />
            Chaque œuvre est unique. Irréversible.
          </p>

          {/* Stats minimalistes */}
          <div className="flex flex-wrap gap-12 justify-center text-muted-foreground font-light">
            <div className="flex items-center gap-3">
              <span className="text-primary">—</span>
              <span>{stats.total} œuvres</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-primary">—</span>
              <span>{stats.photos} photographies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section filtres élégante */}
      <section className="bg-muted/20 border-b border-border py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 justify-center items-center">
            <button className="px-8 py-3 border border-primary text-primary bg-primary/5 font-light tracking-wide rounded transition-all">
              Toutes
            </button>
            <button className="px-8 py-3 border border-border text-foreground hover:border-primary hover:text-primary font-light tracking-wide rounded transition-all">
              Photographies
            </button>
            <button className="px-8 py-3 border border-border text-foreground hover:border-primary hover:text-primary font-light tracking-wide rounded transition-all">
              Toiles
            </button>
            <button className="px-8 py-3 border border-border text-foreground hover:border-primary hover:text-primary font-light tracking-wide rounded transition-all">
              Éditions limitées
            </button>
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="container mx-auto px-6 lg:px-8 py-28 md:py-36">
        <GalleryGrid works={works} />
      </section>

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
                className="px-12 py-6 bg-amber-600 hover:bg-amber-700 text-white font-light tracking-wide rounded text-xl transition-all"
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
