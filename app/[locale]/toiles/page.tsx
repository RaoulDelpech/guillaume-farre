import Navigation from "@/components/navigation/Navigation";
import ToilesContent from "@/components/toiles/ToilesContent";
import toiles from "@/data/toiles.json";

/**
 * Page Toiles
 * Server Component : charge les donnees puis delegue au client
 *
 * @author Lalou
 */
export default function ToilesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ToilesContent toiles={toiles} />
    </main>
  );
}
