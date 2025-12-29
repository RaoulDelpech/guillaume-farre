import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import HomeClient from "@/components/HomeClient";
import HomePageContent from "@/components/pages/HomePageContent";
import HomeWorksSection from "@/components/pages/HomeWorksSection";
import { getWorksFromMetadata } from "@/lib/works";

export default async function HomePage() {
  const t = await getTranslations("home");
  const allWorks = await getWorksFromMetadata();

  // Sélectionner 6 œuvres aléatoires pour l'aperçu
  const featuredWorks = allWorks
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

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
      <HeroCarousel />
      <HomePageContent translations={translations} />
      <HomeWorksSection works={featuredWorks} />
    </main>
  );
}
