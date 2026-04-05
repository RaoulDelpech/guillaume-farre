import { notFound } from "next/navigation";
import Image from "next/image";
import Navigation from "@/components/navigation/Navigation";
import { getWorksFromMetadata } from "@/lib/works";
import { Link } from "@/i18n/routing";
import AddToCartSection from "@/components/AddToCartSection";
import GalerieItemClient from "./GalerieItemClient";
import { safeJsonLd } from "@/lib/safe-json-ld";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const works = await getWorksFromMetadata();
  return works.map((work) => ({
    slug: work.slug,
  }));
}

// Lalou: Generate metadata with Open Graph for each artwork
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const works = await getWorksFromMetadata();
  const work = works.find((w) => w.slug === slug);

  if (!work) {
    return {};
  }

  return {
    title: work.title,
    description: work.description || `${work.title} - Photographie d'art par Guillaume Farré`,
    openGraph: {
      title: work.title,
      description: work.description || `${work.title} - Photographie d'art par Guillaume Farré`,
      images: [
        {
          url: work.images[0],
          width: 1200,
          height: 900,
          alt: work.title,
        },
      ],
      type: "website",
    },
  };
}

export default async function GalerieItemPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const works = await getWorksFromMetadata();
  const work = works.find((w) => w.slug === slug);

  if (!work) {
    notFound();
  }

  // Lalou: JSON-LD Product schema for SEO
  const prices = work.prices;
  const hasLimitedPrices = prices?.small || prices?.medium || prices?.large;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": work.title,
    "image": work.images.map((img) => `https://guillaumefarre.com${img}`),
    "description": work.description || `${work.title} - Photographie d'art fine art par Guillaume Farré, créée avec une Ferrari Dino comme pinceau sur toile.`,
    "brand": {
      "@type": "Person",
      "name": "Guillaume Farré"
    },
    "category": "Fine Art Photography",
    ...(hasLimitedPrices && {
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": Math.min(
          prices?.small || Infinity,
          prices?.medium || Infinity,
          prices?.large || Infinity
        ).toString(),
        "highPrice": Math.max(
          prices?.small || 0,
          prices?.medium || 0,
          prices?.large || 0
        ).toString(),
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": `https://guillaumefarre.com/fr/galerie-item/${work.slug}`,
      }
    }),
    ...(work.edition?.type === 'limited' && work.edition.count && {
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "Edition",
        "value": `Édition limitée à ${work.edition.count} exemplaires`
      }
    })
  };

  return (
    <main className="min-h-screen">
      {/* Lalou: JSON-LD structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productSchema) }}
      />

      {/* GA4 tracking - View item */}
      <GalerieItemClient
        itemId={work.slug}
        itemName={work.title}
        itemPrice={
          Math.min(
            work.prices?.small || Infinity,
            work.prices?.medium || Infinity,
            work.prices?.large || Infinity
          ) || 0
        }
        itemCategory={work.type === "photo" ? "Photographie" : "Toile"}
      />

      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-light text-sm mb-8 sm:mb-12 transition-colors min-h-[44px]"
          >
            ← Retour a la galerie
          </Link>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
            {/* Image */}
            <div className="space-y-4 sm:space-y-6">
              {work.images.map((image, idx) => (
                <div key={idx} className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${work.title} - ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx === 0}
                    loading={idx === 0 ? undefined : "lazy"}
                  />
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <div className="text-xs font-light tracking-[0.2em] text-primary uppercase mb-3 sm:mb-4">
                  {work.type === 'toile' ? 'Toile' :
                   work.photoCategory === 'empreinte' ? 'Empreinte' :
                   work.photoCategory === 'projection' ? 'Projection' :
                   work.photoCategory === 'atelier' ? 'Atelier' :
                   'Photographie'}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-4 sm:mb-6">
                  {work.title}
                </h1>
                {work.collection && (
                  <p className="text-sm font-light text-muted-foreground/70 mb-3">
                    {work.collection}
                  </p>
                )}
                <p className="text-xl font-light text-muted-foreground leading-relaxed">
                  {work.description}
                </p>
              </div>

              {/* Informations */}
              <div className="border-t border-border pt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-muted-foreground">Annee</span>
                  <span className="font-light">{work.year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-muted-foreground">Type</span>
                  <span className="font-light capitalize">
                    {work.type === 'toile' ? 'Toile' :
                     work.photoCategory === 'empreinte' ? 'Empreinte' :
                     work.photoCategory === 'projection' ? 'Projection' :
                     work.photoCategory === 'atelier' ? 'Atelier' :
                     'Photographie'}
                  </span>
                </div>
                {/* Details toile */}
                {work.type === 'toile' && work.canvasDetails && (
                  <>
                    {work.canvasDetails.dimensions && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light text-muted-foreground">Dimensions</span>
                        <span className="font-light">{work.canvasDetails.dimensions}</span>
                      </div>
                    )}
                    {work.canvasDetails.technique && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light text-muted-foreground">Technique</span>
                        <span className="font-light">{work.canvasDetails.technique}</span>
                      </div>
                    )}
                    {work.canvasDetails.price > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light text-muted-foreground">Prix</span>
                        <span className="font-light text-lg">{work.canvasDetails.price.toLocaleString('fr-FR')} EUR</span>
                      </div>
                    )}
                  </>
                )}
                {/* Prix photos signe / non signe */}
                {(work.photoCategory === 'empreinte' || work.photoCategory === 'projection') && (work.priceUnsigned || work.priceSigned) && (
                  <>
                    {work.priceUnsigned && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light text-muted-foreground">Tirage non signe</span>
                        <span className="font-light">{work.priceUnsigned.toLocaleString('fr-FR')} EUR</span>
                      </div>
                    )}
                    {work.priceSigned && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-light text-muted-foreground">Tirage signe</span>
                        <span className="font-light">{work.priceSigned.toLocaleString('fr-FR')} EUR</span>
                      </div>
                    )}
                  </>
                )}
                {/* Badge publication future */}
                {work.publishDate && work.publishDate > new Date().toISOString().split('T')[0] && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-light text-muted-foreground">Publication</span>
                    <span className="font-light text-amber-400">
                      {new Date(work.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Section achat (pas pour atelier) */}
              {work.photoCategory !== 'atelier' && (
                <div className="pt-8">
                  <AddToCartSection
                    productId={work.slug}
                    productTitle={work.title}
                    productImage={work.images[0]}
                    productCategory={work.type === 'toile' ? 'Toile' : 'Photographie'}
                    photoPath={work.images[0]}
                  />
                </div>
              )}
              {work.photoCategory === 'atelier' && (
                <div className="pt-8">
                  <a
                    href={`mailto:contact@guillaumefarre.com?subject=${encodeURIComponent(`A propos de : ${work.title}`)}`}
                    className="inline-block px-8 py-4 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all hover:bg-foreground/5"
                  >
                    Me contacter pour cette oeuvre
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
