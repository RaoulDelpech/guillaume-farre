import { notFound } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import { getWorksFromMetadata } from "@/lib/works";
import { Link } from "@/i18n/routing";

export async function generateStaticParams() {
  const works = await getWorksFromMetadata();
  return works.map((work) => ({
    slug: work.slug,
  }));
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

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-light text-sm mb-12 transition-colors"
          >
            ← Retour à la galerie
          </Link>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Image */}
            <div className="space-y-6">
              {work.images.map((image, idx) => (
                <div key={idx} className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${work.title} - ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="space-y-8">
              <div>
                <div className="text-xs font-light tracking-[0.2em] text-primary uppercase mb-4">
                  {work.type === 'photo' ? 'Photographie' : 'Toile'}
                </div>
                <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-6">
                  {work.title}
                </h1>
                <p className="text-xl font-light text-muted-foreground leading-relaxed">
                  {work.description}
                </p>
              </div>

              {/* Informations */}
              <div className="border-t border-border pt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-muted-foreground">Année</span>
                  <span className="font-light">{work.year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-muted-foreground">Type</span>
                  <span className="font-light capitalize">{work.type}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-8">
                <Link
                  href="/contact"
                  className="inline-block w-full px-12 py-6 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-xl text-center transition-all"
                >
                  Demander des informations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
