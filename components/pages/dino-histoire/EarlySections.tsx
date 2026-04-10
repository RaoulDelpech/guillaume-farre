"use client";

import EditableText from "@/components/admin/EditableText";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative min-h-[60vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Dino_246_GT_%2824627987921%29.jpg/1600px-Dino_246_GT_%2824627987921%29.jpg")' }}>
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-white/60 text-xs font-light mb-6 tracking-[0.3em] uppercase">Histoire Automobile</div>
        <EditableText textKey="dinoHistoire.hero.title" as="h1"
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-wide mb-6 sm:mb-8 text-white">
          La Ferrari Dino
        </EditableText>
        <EditableText textKey="dinoHistoire.hero.subtitle" as="p"
          className="text-base sm:text-xl md:text-2xl font-light text-white/90 leading-relaxed max-w-3xl mx-auto" multiline>
          L'hommage d'Enzo Ferrari à son fils. Une légende née de la tragédie, devenue icône du design automobile italien.
        </EditableText>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/60 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export function AlfredoSection() {
  return (
    <section className="py-12 sm:py-24 md:py-32 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div>
            <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">1932 - 1956</div>
            <EditableText textKey="dinoHistoire.alfredo.title" as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 sm:mb-8 text-foreground">
              Alfredo "Dino" Ferrari
            </EditableText>
            <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
              <EditableText textKey="dinoHistoire.alfredo.p1" as="p" multiline>
                Alfredo Ferrari, surnommé "Dino", naît le 19 janvier 1932 à Modène. Fils unique d'Enzo Ferrari et de Laura Dominica Garello, il grandit dans l'univers de la course automobile qui obsède son père.
              </EditableText>
              <EditableText textKey="dinoHistoire.alfredo.p2" as="p" multiline>
                Brillant ingénieur malgré son jeune âge, Dino travaille aux côtés de Vittorio Jano sur le développement d'un moteur V6 révolutionnaire. Cette collaboration donnera naissance au légendaire moteur Dino V6.
              </EditableText>
              <EditableText textKey="dinoHistoire.alfredo.p3" as="p" multiline>
                Tragiquement, Dino est atteint de dystrophie musculaire de Duchenne. Il décède le 30 juin 1956, à seulement 24 ans, laissant derrière lui les plans d'un moteur qui allait révolutionner l'histoire de Ferrari.
              </EditableText>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden relative">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Dino_206_GT_%2815406731344%29.jpg/800px-Dino_206_GT_%2815406731344%29.jpg"
                alt="Ferrari Dino 206 GT" fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" loading="lazy" unoptimized />
            </div>
            <div className="mt-4 sm:absolute sm:-bottom-4 sm:-right-4 bg-primary/10 p-4 sm:p-6 rounded-lg border border-primary/20">
              <EditableText textKey="dinoHistoire.alfredo.quote" as="p" className="text-sm font-light text-foreground italic">
                "Il a vécu pour les voitures et les voitures vivront pour lui."
              </EditableText>
              <p className="text-xs text-muted-foreground mt-2">— Enzo Ferrari</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MoteurSection() {
  return (
    <section className="py-12 sm:py-24 md:py-32 bg-muted/30 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-16">
          <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">L'Héritage Technique</div>
          <EditableText textKey="dinoHistoire.moteur.title" as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 sm:mb-8 text-foreground">
            Le Moteur V6 Dino
          </EditableText>
          <EditableText textKey="dinoHistoire.moteur.subtitle" as="p"
            className="text-xl text-muted-foreground font-light leading-relaxed" multiline>
            Avant sa mort, Dino avait dessiné les grandes lignes d'un moteur V6 à 65° qui allait devenir l'un des plus beaux moteurs de l'histoire automobile.
          </EditableText>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { year: "1956", title: "Formule 2", key: "f2", text: "Le premier moteur Dino V6 1.5L fait ses débuts en Formule 2, remportant immédiatement des victoires." },
            { year: "1958", title: "Formule 1", key: "f1", text: "Mike Hawthorn remporte le championnat du monde de F1 avec un moteur dérivé du V6 Dino. Le rêve de Dino se réalise." },
            { year: "1967", title: "Route", key: "route", text: "La Dino 206 GT est présentée. Pour la première fois, le V6 Dino équipe une voiture de route, accessible au grand public." },
          ].map(({ year, title, key, text }) => (
            <div key={key} className="bg-background p-4 sm:p-8 rounded-lg border border-border">
              <div className="text-4xl font-light text-primary mb-4">{year}</div>
              <h3 className="text-xl font-light mb-4 text-foreground">{title}</h3>
              <EditableText textKey={`dinoHistoire.moteur.${key}`} as="p" className="text-muted-foreground font-light">
                {text}
              </EditableText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Lalou
