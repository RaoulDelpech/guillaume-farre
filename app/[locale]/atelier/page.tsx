import { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import AtelierContent from "@/components/pages/AtelierContent";

export const metadata: Metadata = {
  title: "Atelier",
  description: "L'atelier de Guillaume Farré : la Dino, 1020 kilos d'instrument de création. Découvrez l'espace où naissent les œuvres, entre mécanique et peinture.",
  openGraph: {
    title: "Atelier | Guillaume Farré",
    description: "Visitez l'atelier où Guillaume Farré crée ses œuvres avec ses Ferrari Dino.",
  },
};

export default function AtelierPage() {
  return (
    <main>
      <Navigation />
      <AtelierContent />
    </main>
  );
}
