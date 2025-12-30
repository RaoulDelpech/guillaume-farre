import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import GalleryClient from "@/components/GalleryClient";
import GalerieContent from "@/components/pages/GalerieContent";
import { getWorksFromMetadata } from "@/lib/works";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Découvrez les photographies d'art de Guillaume Farré : traces de Ferrari sur toile, action painting automobile. Séries Empreintes, Atelier et Projections.",
  openGraph: {
    title: "Galerie | Guillaume Farré",
    description: "Photographies d'art documentant le processus créatif unique de Guillaume Farré avec ses Ferrari Dino.",
  },
};

export default async function GaleriePage() {
  const t = await getTranslations("gallery");
  const works = await getWorksFromMetadata();

  const translations = {
    title: t("title"),
    subtitle: t("subtitle"),
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <GalerieContent translations={translations} />
      <GalleryClient works={works} />
    </main>
  );
}
