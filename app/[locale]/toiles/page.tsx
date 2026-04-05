import ToilesContent from "@/components/toiles/ToilesContent";
import toiles from "@/data/toiles.json";

/**
 * Page Toiles — VIP uniquement
 * Server Component : charge les donnees puis delegue au client
 *
 * @author Lalou
 */
export default function ToilesPage() {
  return <ToilesContent toiles={toiles} />;
}
