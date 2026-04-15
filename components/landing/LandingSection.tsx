import Image from "next/image";
import { Link } from "@/i18n/routing";

/**
 * Grille 6 images (mix photos + toiles) — bas de la homepage
 * Chaque image est cliquable et renvoie vers la page correspondante.
 *
 * @author Lalou
 */

const ITEMS: { src: string; alt: string; href: "/galerie" | "/toiles" }[] = [
  { src: "/images/works/photos/1.jpg", alt: "Photographie n°1", href: "/galerie" },
  { src: "/images/toiles/6.jpg", alt: "Toile n°6", href: "/toiles" },
  { src: "/images/works/photos/5.jpg", alt: "Photographie n°5", href: "/galerie" },
  { src: "/images/toiles/3.jpg", alt: "Toile n°3", href: "/toiles" },
  { src: "/images/works/photos/8.jpg", alt: "Photographie n°8", href: "/galerie" },
  { src: "/images/toiles/10.jpg", alt: "Toile n°10", href: "/toiles" },
];

export default function LandingSection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {ITEMS.map((item) => (
            <Link
              key={item.src}
              href={item.href}
              className="relative aspect-[4/3] overflow-hidden group"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
