import { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import HistoireContent from "@/components/pages/HistoireContent";

export const metadata: Metadata = {
  title: "Histoire",
  description: "L'histoire de Guillaume Farré : de la petite Ferrari n°20 de son enfance aux quatre Ferrari Dino de son atelier. Quarante ans de passion automobile transformée en art.",
  openGraph: {
    title: "Histoire | Guillaume Farré",
    description: "Découvrez le parcours artistique de Guillaume Farré, de l'enfance à aujourd'hui.",
  },
};

/**
 * Page Histoire avec textes éditables en mode admin
 * Accès mode édition : ?admin=true
 *
 * @author Lalou
 * @date 2025-11-30
 */
export default function HistoirePage() {
  return (
    <main>
      <Navigation />
      <HistoireContent />
    </main>
  );
}
