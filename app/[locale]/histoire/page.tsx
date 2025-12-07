import Navigation from "@/components/navigation/Navigation";
import HistoireContent from "@/components/pages/HistoireContent";

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
