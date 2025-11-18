import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

export default async function DinoPage() {
  const t = await getTranslations("dino");

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero avec image Dino */}
      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1605559424843-9e4c3febae90?w=1600&q=80")',
          }}
        >
          {/* Overlay sombre pour lisibilité texte */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Contenu centré */}
        <div className="relative z-10 text-center px-6 lg:px-8 max-w-5xl">
          <div className="text-white/60 text-xs font-light mb-6 tracking-[0.3em] uppercase">
            {t("tag")}
          </div>
          <h1 className="text-6xl md:text-8xl font-light tracking-wide mb-6 text-white">
            {t("title")}
          </h1>
          <p className="text-2xl md:text-3xl font-light text-white/90 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Section L'Origine */}
      <section className="py-24 md:py-32 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&q=80"
                alt="Ferrari Dino détails"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* Texte */}
            <div className="order-1 md:order-2">
              <div className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-light">
                {t("origin.label")}
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-foreground">
                {t("origin.title")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
                {t("origin.text1")}
              </p>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                {t("origin.text2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Caractéristiques */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-light">
              {t("specs.label")}
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-16 text-foreground">
              {t("specs.title")}
            </h2>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Gauche */}
              <div className="space-y-8">
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t("specs.model")}
                  </div>
                  <p className="text-2xl font-light text-foreground">
                    {t("specs.modelValue")}
                  </p>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t("specs.year")}
                  </div>
                  <p className="text-2xl font-light text-foreground">
                    {t("specs.yearValue")}
                  </p>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t("specs.color")}
                  </div>
                  <p className="text-2xl font-light text-foreground">
                    {t("specs.colorValue")}
                  </p>
                </div>
              </div>

              {/* Droite */}
              <div className="space-y-8">
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t("specs.engine")}
                  </div>
                  <p className="text-lg font-light text-muted-foreground">
                    {t("specs.engineValue")}
                  </p>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t("specs.power")}
                  </div>
                  <p className="text-lg font-light text-muted-foreground">
                    {t("specs.powerValue")}
                  </p>
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-light">
                    {t("specs.weight")}
                  </div>
                  <p className="text-lg font-light text-muted-foreground">
                    {t("specs.weightValue")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Rôle Créatif */}
      <section className="py-24 md:py-32 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Texte */}
            <div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-light">
                {t("creative.label")}
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6 text-foreground">
                {t("creative.title")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-6">
                {t("creative.text1")}
              </p>
              <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
                {t("creative.text2")}
              </p>
            </div>

            {/* Image */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1600181087505-57e38b27ea59?w=800&q=80"
                alt="Ferrari en mouvement"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Galerie */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-light">
              {t("gallery.label")}
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-wide text-foreground">
              {t("gallery.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <img
              src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80"
              alt="Dino rouge détail"
              className="w-full h-80 object-cover rounded-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1617654112368-307921291f42?w=400&q=80"
              alt="Dino intérieur"
              className="w-full h-80 object-cover rounded-lg"
            />
            <img
              src="https://images.unsplash.com/photo-1605559424843-9e4c3febae90?w=400&q=80"
              alt="Dino vue latérale"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 md:py-32 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8">
              {t("cta.title")}
            </h2>
            <p className="text-xl font-light text-muted-foreground mb-12 leading-relaxed">
              {t("cta.text")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/atelier"
                className="px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded text-xl transition-all"
              >
                {t("cta.button1")}
              </Link>
              <Link
                href="/galerie"
                className="px-12 py-6 border border-border hover:border-primary text-foreground hover:text-primary font-light tracking-wide rounded text-xl transition-all"
              >
                {t("cta.button2")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
