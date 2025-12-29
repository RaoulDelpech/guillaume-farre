import Navigation from "@/components/navigation/Navigation";
import DinoHistoireContent from "@/components/pages/DinoHistoireContent";

/**
 * Page Histoire de la Ferrari Dino
 * L'histoire complète de la Dino dans le monde automobile
 *
 * @author Lalou
 * @date 2025-11-30
 */
export default async function DinoHistoirePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <DinoHistoireContent />
    </main>
  );
}
