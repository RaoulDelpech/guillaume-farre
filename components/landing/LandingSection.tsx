import Image from "next/image";

/**
 * Section landing réutilisable — Grille 6 photos
 * Utilisée en bas des pages /toiles et /galerie
 *
 * @author Lalou
 */
export default function LandingSection() {
  return (
    <div className="bg-white text-[#1a1a1a]">
      <div className="container mx-auto px-4 pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 3, 5, 8, 11, 14].map((num, index) => (
            <div key={num} className="relative aspect-[4/3]">
              <Image
                src={`/images/works/photos/${num}.jpg`}
                alt={`Photographie de Guillaume Farré — n°${num}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
