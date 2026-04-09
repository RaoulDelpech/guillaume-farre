import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import AtelierDoors from "@/components/AtelierDoors";
import { getPageImages } from "@/lib/page-images";

export default async function HomePage() {
  const pageImages = await getPageImages();

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroCarousel slides={pageImages.hero.slides} />
      <AtelierDoors />
    </main>
  );
}
