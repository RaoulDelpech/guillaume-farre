import { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import OrigineContent from "@/components/pages/OrigineContent";
import { getPageImages } from "@/lib/page-images";

export const metadata: Metadata = {
  title: "Origine",
  description: "L'origine du projet : de la petite Ferrari n°20 à 6 ans aux vraies Ferrari Dino. Comment un rêve d'enfant est devenu une démarche artistique unique.",
  openGraph: {
    title: "Origine | Guillaume Farré",
    description: "Découvrez comment tout a commencé avec une petite Ferrari n°20.",
  },
};

/**
 * Page Origine avec textes éditables en mode admin
 * Accès mode édition : ?admin=true
 *
 * @author Lalou
 * @date 2025-12-31
 */
export default async function OriginePage() {
  const pageImages = await getPageImages();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <OrigineContent images={pageImages.origine} />
    </main>
  );
}
