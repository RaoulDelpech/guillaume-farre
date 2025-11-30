import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import { Link } from "@/i18n/routing";

/**
 * Page Histoire de la Ferrari Dino
 * L'histoire complète de la Dino dans le monde automobile
 *
 * @author Lalou
 * @date 2025-11-30
 */
export default async function DinoHistoirePage() {
  const t = await getTranslations("dinoHistoire");

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero immersif - Image historique Ferrari Dino */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1600&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center px-6 lg:px-8 max-w-5xl">
          <div className="text-white/60 text-xs font-light mb-6 tracking-[0.3em] uppercase">
            Histoire Automobile
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wide mb-8 text-white">
            La Ferrari Dino
          </h1>
          <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed max-w-3xl mx-auto">
            L'hommage d'Enzo Ferrari à son fils. Une légende née de la tragédie,
            devenue icône du design automobile italien.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Section 1 : Alfredo "Dino" Ferrari */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">
                1932 - 1956
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8 text-foreground">
                Alfredo "Dino" Ferrari
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  Alfredo Ferrari, surnommé "Dino", naît le 19 janvier 1932 à Modène.
                  Fils unique d'Enzo Ferrari et de Laura Dominica Garello, il grandit
                  dans l'univers de la course automobile qui obsède son père.
                </p>
                <p>
                  Brillant ingénieur malgré son jeune âge, Dino travaille aux côtés de
                  Vittorio Jano sur le développement d'un moteur V6 révolutionnaire.
                  Cette collaboration donnera naissance au légendaire moteur Dino V6.
                </p>
                <p>
                  Tragiquement, Dino est atteint de dystrophie musculaire de Duchenne.
                  Il décède le 30 juin 1956, à seulement 24 ans, laissant derrière lui
                  les plans d'un moteur qui allait révolutionner l'histoire de Ferrari.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80"
                  alt="Ferrari Dino classique rouge"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary/10 p-6 rounded-lg border border-primary/20">
                <p className="text-sm font-light text-foreground italic">
                  "Il a vécu pour les voitures et les voitures vivront pour lui."
                </p>
                <p className="text-xs text-muted-foreground mt-2">— Enzo Ferrari</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : Le Moteur V6 */}
      <section className="py-24 md:py-32 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">
              L'Héritage Technique
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8 text-foreground">
              Le Moteur V6 Dino
            </h2>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Avant sa mort, Dino avait dessiné les grandes lignes d'un moteur V6
              à 65° qui allait devenir l'un des plus beaux moteurs de l'histoire automobile.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg border border-border">
              <div className="text-4xl font-light text-primary mb-4">1956</div>
              <h3 className="text-xl font-light mb-4 text-foreground">Formule 2</h3>
              <p className="text-muted-foreground font-light">
                Le premier moteur Dino V6 1.5L fait ses débuts en Formule 2,
                remportant immédiatement des victoires.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg border border-border">
              <div className="text-4xl font-light text-primary mb-4">1958</div>
              <h3 className="text-xl font-light mb-4 text-foreground">Formule 1</h3>
              <p className="text-muted-foreground font-light">
                Mike Hawthorn remporte le championnat du monde de F1 avec un
                moteur dérivé du V6 Dino. Le rêve de Dino se réalise.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg border border-border">
              <div className="text-4xl font-light text-primary mb-4">1967</div>
              <h3 className="text-xl font-light mb-4 text-foreground">Route</h3>
              <p className="text-muted-foreground font-light">
                La Dino 206 GT est présentée. Pour la première fois, le V6 Dino
                équipe une voiture de route, accessible au grand public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 : La Dino 206 GT */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800&q=80"
                  alt="Ferrari Dino 206 GT rouge"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">
                1967 - 1969
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8 text-foreground">
                Dino 206 GT
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  Dessinée par Pininfarina sous la direction d'Aldo Brovarone,
                  la Dino 206 GT est présentée au Salon de Turin 1967. Ses lignes
                  fluides et sensuelles en font immédiatement une icône.
                </p>
                <p>
                  Fait unique : Enzo Ferrari refuse que la Dino porte le badge
                  Ferrari. Pour lui, seuls les V12 méritent cet honneur. La voiture
                  est donc vendue simplement sous le nom "Dino".
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-light text-foreground">2.0L V6</div>
                  <div className="text-sm text-muted-foreground">Cylindrée</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-foreground">180 ch</div>
                  <div className="text-sm text-muted-foreground">Puissance</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-foreground">900 kg</div>
                  <div className="text-sm text-muted-foreground">Poids</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-foreground">152</div>
                  <div className="text-sm text-muted-foreground">Exemplaires</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 : La Dino 246 GT */}
      <section className="py-24 md:py-32 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">
                1969 - 1974
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8 text-foreground">
                Dino 246 GT & GTS
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  La 246 GT succède à la 206 avec un moteur agrandi à 2.4 litres
                  et 195 chevaux. La carrosserie passe de l'aluminium à l'acier,
                  rendant la voiture plus accessible.
                </p>
                <p>
                  En 1972, la version GTS (Gran Turismo Spider) apparaît avec un
                  toit Targa amovible. Cette configuration deviendra emblématique
                  de la Dino.
                </p>
                <p>
                  Plus de 3 700 exemplaires seront produits, faisant de la Dino 246
                  la première Ferrari vraiment accessible. Son succès commercial
                  assure la survie de la marque.
                </p>
              </div>
            </div>
            <div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"
                  alt="Ferrari Dino 246 GTS rouge"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-8 p-6 bg-background rounded-lg border border-border">
                <h4 className="font-light text-lg mb-4 text-foreground">Versions produites</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">246 GT (Type L)</span>
                    <span className="text-foreground">357 ex.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">246 GT (Type M)</span>
                    <span className="text-foreground">507 ex.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">246 GT (Type E)</span>
                    <span className="text-foreground">1 274 ex.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">246 GTS</span>
                    <span className="text-foreground">1 274 ex.</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 mt-3">
                    <span className="text-foreground font-medium">Total 246</span>
                    <span className="text-foreground font-medium">3 761 ex.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 : L'Héritage */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">
                Un Héritage Éternel
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8 text-foreground">
                La Dino Aujourd'hui
              </h2>
            </div>

            <div className="space-y-8 text-lg text-muted-foreground font-light leading-relaxed">
              <p>
                Aujourd'hui, la Dino est considérée comme l'une des plus belles
                voitures jamais produites. Ses lignes, dessinées il y a plus de
                50 ans, n'ont pas pris une ride.
              </p>
              <p>
                Sur le marché des collectionneurs, les prix ont explosé. Une Dino
                246 GTS en excellent état peut atteindre 400 000 à 500 000 euros.
                Les 152 exemplaires de la 206 GT sont encore plus rares et précieux.
              </p>
              <p>
                Le nom "Dino" a été officiellement intégré à la gamme Ferrari en
                2004, quand la marque a reconnu que toutes les Dino étaient bien
                des Ferrari. Une réconciliation posthume avec l'héritage d'Enzo.
              </p>
            </div>

            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-8 rounded-lg">
                <div className="text-5xl font-light text-primary mb-4">50+</div>
                <p className="text-foreground font-light">
                  années depuis la dernière Dino, et son design reste intemporel
                </p>
              </div>
              <div className="bg-muted/30 p-8 rounded-lg">
                <div className="text-5xl font-light text-primary mb-4">3 913</div>
                <p className="text-foreground font-light">
                  exemplaires produits au total (206 GT + 246 GT/GTS)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 : La Dino de Guillaume */}
      <section className="py-24 md:py-32 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80"
                  alt="Ferrari rouge dans l'atelier"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">
                Dans Mon Atelier
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8 text-foreground">
                Ma Dino 246 GT
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  Parmi les quatre Ferrari de mon atelier, ma Dino 246 GT occupe
                  une place particulière. Elle incarne cette période où Ferrari
                  a osé démocratiser l'excellence.
                </p>
                <p>
                  Quand je la fais rouler sur mes toiles, je pense à Alfredo.
                  À ce jeune ingénieur qui n'a jamais vu son rêve se réaliser.
                  Chaque empreinte est un hommage à sa vision.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/dino"
                  className="inline-block px-8 py-4 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide rounded transition-all"
                >
                  Voir ma Dino en action →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-8 text-foreground">
              Découvrir les œuvres
            </h2>
            <p className="text-xl font-light text-muted-foreground mb-12 leading-relaxed">
              Ma Dino crée des empreintes uniques sur la toile.
              Chaque passage est un dialogue entre l'histoire et l'art.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/galerie"
                className="px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded transition-all"
              >
                Voir la galerie
              </Link>
              <Link
                href="/boutique"
                className="px-12 py-5 border border-border hover:border-foreground text-foreground font-light tracking-wide rounded transition-all"
              >
                Commander une œuvre
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
