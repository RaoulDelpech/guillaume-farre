import Navigation from "@/components/navigation/Navigation";
import ToilesContent from "@/components/toiles/ToilesContent";
import toiles from "@/data/toiles.json";
import { getAccessLevel } from "@/lib/access";

/**
 * Page Toiles
 * Accessible a tous. Le contenu s'adapte au niveau d'acces :
 * - normal/hidden : pas de prix, CTA = formulaire d'interet
 * - secret (VIP) : prix affiches, CTA = reservation
 *
 * @author Lalou
 */
export default async function ToilesPage() {
  const accessLevel = await getAccessLevel();
  const isVip = accessLevel === 'secret';

  return (
    <main className="min-h-screen">
      <Navigation />
      <ToilesContent toiles={toiles} showPrices={isVip} />
    </main>
  );
}
