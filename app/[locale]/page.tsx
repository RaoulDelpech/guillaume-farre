import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import HomeClient from "@/components/HomeClient";
import HomePageContent from "@/components/pages/HomePageContent";
import HomeWorksSection from "@/components/pages/HomeWorksSection";
import HomeCitation from "@/components/pages/HomeCitation";
import EarlyAccessCountdown from "@/components/early-access/EarlyAccessCountdown";
import { getWorksFromMetadata } from "@/lib/works";
import { getPageImages } from "@/lib/page-images";

export default async function HomePage() {
  const t = await getTranslations("home");
  const allWorks = await getWorksFromMetadata();
  const pageImages = await getPageImages();

  // Sélectionner 9 œuvres : 3 par série - Décision audit 2025-01-20
  // Empreintes, Atelier, Projections (pas aléatoire !)
  const empreintes = allWorks.filter(w => w.slug.startsWith('empreintes')).slice(0, 3);
  const atelier = allWorks.filter(w => w.slug.startsWith('atelier')).slice(0, 3);
  const projection = allWorks.filter(w => w.slug.startsWith('projection')).slice(0, 3);
  const featuredWorks = [...empreintes, ...atelier, ...projection];

  const translations = {
    artist: {
      label: t("artist.label"),
      name: t("artist.name"),
      bio: t("artist.bio"),
      cta: t("artist.cta"),
    },
  };

  return (
    <main className="min-h-[80vh]">
      <Navigation />
      <HomeClient />
      {/* Compteur Early Access - avant le carousel */}
      <EarlyAccessCountdown />
      <HeroCarousel slides={pageImages.hero.slides} />
      {/* Citation - Décision audit 2025-01-20 */}
      <HomeCitation />
      <HomePageContent translations={translations} artistPhoto={pageImages.home.artistPhoto} />
      <HomeWorksSection works={featuredWorks} />
    </main>
  );
}
