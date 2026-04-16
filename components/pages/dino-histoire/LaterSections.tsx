"use client";

import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export function Dino206Section() {
  return (
    <section className="py-12 sm:py-24 md:py-32 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Petersen_Museum_%2852042599362%29.jpg/800px-Petersen_Museum_%2852042599362%29.jpg"
                alt="Ferrari Dino au Petersen Museum" fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" loading="lazy" unoptimized />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">1967 - 1969</div>
            <EditableText textKey="dinoHistoire.206gt.title" as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 sm:mb-8 text-foreground">
              Dino 206 GT
            </EditableText>
            <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
              <EditableText textKey="dinoHistoire.206gt.p1" as="p" multiline>
                Dessinée par Pininfarina sous la direction d'Aldo Brovarone, la Dino 206 GT est présentée au Salon de Turin 1967. Ses lignes fluides et sensuelles en font immédiatement une icône.
              </EditableText>
              <EditableText textKey="dinoHistoire.206gt.p2" as="p" multiline>
                Fait unique : Enzo Ferrari refuse que la Dino porte le badge Ferrari. Pour lui, seuls les V12 méritent cet honneur. La voiture est donc vendue simplement sous le nom "Dino".
              </EditableText>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6">
              {[
                { val: "2.0L V6", label: "Cylindrée" }, { val: "180 ch", label: "Puissance" },
                { val: "900 kg", label: "Poids" }, { val: "152", label: "Exemplaires" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="text-3xl font-light text-foreground">{val}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Dino246Section() {
  const versions = [
    { label: "246 GT (Type L)", count: "357 ex." },
    { label: "246 GT (Type M)", count: "507 ex." },
    { label: "246 GT (Type E)", count: "1 274 ex." },
    { label: "246 GTS", count: "1 274 ex." },
  ];

  return (
    <section className="py-12 sm:py-24 md:py-32 bg-muted/30 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div>
            <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">1969 - 1974</div>
            <EditableText textKey="dinoHistoire.246gt.title" as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 sm:mb-8 text-foreground">
              Dino 246 GT & GTS
            </EditableText>
            <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
              <EditableText textKey="dinoHistoire.246gt.p1" as="p" multiline>
                La 246 GT succède à la 206 avec un moteur agrandi à 2.4 litres et 195 chevaux. La carrosserie passe de l'aluminium à l'acier, rendant la voiture plus accessible.
              </EditableText>
              <EditableText textKey="dinoHistoire.246gt.p2" as="p" multiline>
                En 1972, la version GTS (Gran Turismo Spider) apparaît avec un toit Targa amovible. Cette configuration deviendra emblématique de la Dino.
              </EditableText>
              <EditableText textKey="dinoHistoire.246gt.p3" as="p" multiline>
                Plus de 3 700 exemplaires seront produits, faisant de la Dino 246 la première Ferrari vraiment accessible. Son succès commercial assure la survie de la marque.
              </EditableText>
            </div>
          </div>
          <div>
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/1973_Dino_246GTS.jpg/800px-1973_Dino_246GTS.jpg"
                alt="Ferrari Dino 246 GTS 1973" fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" loading="lazy" unoptimized />
            </div>
            <div className="mt-8 p-6 bg-background rounded-lg border border-border">
              <h4 className="font-light text-lg mb-4 text-foreground">Versions produites</h4>
              <div className="space-y-3 text-sm">
                {versions.map(v => (
                  <div key={v.label} className="flex justify-between">
                    <span className="text-muted-foreground">{v.label}</span>
                    <span className="text-foreground">{v.count}</span>
                  </div>
                ))}
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
  );
}

export function HeritageSection() {
  return (
    <section className="py-12 sm:py-24 md:py-32 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">Un Héritage Éternel</div>
            <EditableText textKey="dinoHistoire.heritage.title" as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 sm:mb-8 text-foreground">
              La Dino Aujourd'hui
            </EditableText>
          </div>
          <div className="space-y-8 text-lg text-muted-foreground font-light leading-relaxed">
            <EditableText textKey="dinoHistoire.heritage.p1" as="p" multiline>
              Aujourd'hui, la Dino est considérée comme l'une des plus belles voitures jamais produites. Ses lignes, dessinées il y a plus de 50 ans, n'ont pas pris une ride.
            </EditableText>
            <EditableText textKey="dinoHistoire.heritage.p2" as="p" multiline>
              Sur le marché des collectionneurs, les prix ont explosé. Une Dino 246 GTS en excellent état peut atteindre 400 000 à 500 000 euros. Les 152 exemplaires de la 206 GT sont encore plus rares et précieux.
            </EditableText>
            <EditableText textKey="dinoHistoire.heritage.p3" as="p" multiline>
              Le nom "Dino" a été officiellement intégré à la gamme Ferrari en 2004, quand la marque a reconnu que toutes les Dino étaient bien des Ferrari. Une réconciliation posthume avec l'héritage d'Enzo.
            </EditableText>
          </div>
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-muted/30 p-4 sm:p-8 rounded-lg">
              <div className="text-3xl sm:text-5xl font-light text-primary mb-4">50+</div>
              <p className="text-foreground font-light">années depuis la dernière Dino, et son design reste intemporel</p>
            </div>
            <div className="bg-muted/30 p-4 sm:p-8 rounded-lg">
              <div className="text-3xl sm:text-5xl font-light text-primary mb-4">3 913</div>
              <p className="text-foreground font-light">exemplaires produits au total (206 GT + 246 GT/GTS)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MaDinoSection() {
  return (
    <section className="py-12 sm:py-24 md:py-32 bg-muted/30 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/1972_Ferrari_Dino_246_GTS_2.4_Interior.jpg/800px-1972_Ferrari_Dino_246_GTS_2.4_Interior.jpg"
                alt="Intérieur Ferrari Dino 246 GTS 1972" fill sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" loading="lazy" unoptimized />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="text-sm uppercase tracking-widest text-primary mb-4 font-light">Dans Mon Atelier</div>
            <EditableText textKey="dinoHistoire.maDino.title" as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 sm:mb-8 text-foreground">
              Ma Dino 246 GT
            </EditableText>
            <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
              <EditableText textKey="dinoHistoire.maDino.p1" as="p" multiline>
                Ma Dino 246 GT occupe une place particulière dans mon atelier. Elle incarne cette période où Ferrari a osé démocratiser l'excellence.
              </EditableText>
              <EditableText textKey="dinoHistoire.maDino.p2" as="p" multiline>
                Quand je la fais rouler sur mes toiles, je pense à Alfredo. À ce jeune ingénieur qui n'a jamais vu son rêve se réaliser. Chaque empreinte est un hommage à sa vision.
              </EditableText>
            </div>
            <div className="mt-8">
              <Link href="/dino"
                className="inline-block px-6 sm:px-8 py-3.5 sm:py-4 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide rounded transition-all min-h-[44px]">
                Voir ma Dino en action →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-12 sm:py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <EditableText textKey="dinoHistoire.cta.title" as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-6 sm:mb-8 text-foreground">
            Découvrir les œuvres
          </EditableText>
          <EditableText textKey="dinoHistoire.cta.text" as="p"
            className="text-xl font-light text-muted-foreground mb-12 leading-relaxed" multiline>
            Ma Dino crée des empreintes uniques sur la toile. Chaque passage est un dialogue entre l'histoire et l'art.
          </EditableText>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/galerie"
              className="px-8 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded transition-all min-h-[48px] flex items-center justify-center">
              Voir la galerie
            </Link>
            <Link href="/galerie"
              className="px-8 sm:px-12 py-4 sm:py-5 border border-border hover:border-foreground text-foreground font-light tracking-wide rounded transition-all min-h-[48px] flex items-center justify-center">
              Commander une œuvre
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Lalou
