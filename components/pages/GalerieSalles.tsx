"use client";

import { Link } from "@/i18n/routing";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * Section salles de la galerie - Toiles + Photographies
 *
 * @author Lalou
 */

interface Salle {
  id: string;
  href: "/toiles" | "/galerie";
  image: string;
  serie: string;
  description: string;
}

export default function GalerieSalles() {
  const salles: Salle[] = [
    {
      id: "toiles",
      href: "/toiles",
      image: "/images/toiles/9.jpg",
      serie: "Toiles",
      description: "Peintures sur toile — quand la Ferrari laisse sa trace.",
    },
    {
      id: "photos",
      href: "/galerie",
      image: "/images/works/photos/1.jpg",
      serie: "Photographies",
      description: "",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
            Explorez les collections
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            Deux regards sur la création
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {salles.map((salle) => (
            <Link
              key={salle.id}
              href={salle.href}
              className="group relative block overflow-hidden rounded-lg aspect-[3/4] md:aspect-[2/3]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${salle.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-2">
                  {salle.serie}
                </h3>
                <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">
                  {salle.description}
                </p>
                <div className="mt-4 flex items-center text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm font-light tracking-wide">Découvrir</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
