import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import GalleryClient from "@/components/GalleryClient";
import GalerieContent from "@/components/pages/GalerieContent";
import GalerieSalles from "@/components/pages/GalerieSalles";
import GalerieOeuvresUniques from "@/components/pages/GalerieOeuvresUniques";
import { getWorksFromMetadata } from "@/lib/works";
import { getPageImages } from "@/lib/page-images";
import { getAccessLevel } from "@/lib/access";

export const metadata: Metadata = {
  title: "Créations",
  description: "Découvrez les photographies d'art de Guillaume Farré : traces de Dino sur toile. Séries Empreintes, Atelier et Projections.",
  openGraph: {
    title: "Créations | Guillaume Farré",
    description: "Photographies d'art documentant le processus créatif unique de Guillaume Farré avec sa Dino.",
  },
};

export default async function GaleriePage() {
  const t = await getTranslations("gallery");
  const accessLevel = await getAccessLevel();
  const works = await getWorksFromMetadata(accessLevel);
  const pageImages = await getPageImages();
  const showPrices = accessLevel === 'secret';

  const translations = {
    title: t("title"),
    subtitle: t("subtitle"),
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <GalerieContent translations={translations} />
      {/* Section 3 salles - Décision audit 2025-01-20 */}
      <GalerieSalles images={pageImages.galerieSalles} />
      {/* Section Œuvres uniques - Décision audit 2025-01-20 */}
      <GalerieOeuvresUniques />
      {/* Galerie complète avec filtres */}
      <GalleryClient works={works} showPrices={showPrices} />
    </main>
  );
}
