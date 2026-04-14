import { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import ToilesContent from "@/components/toiles/ToilesContent";
import toiles from "@/data/toiles.json";
import { getAccessLevel } from "@/lib/access";

export const metadata: Metadata = {
  title: "Toiles",
  description: "Les toiles de Guillaume Farré — peintures abstraites créées par le passage direct de la Dino sur toile vierge. Pièces uniques, irréplicables.",
  openGraph: {
    title: "Toiles | Guillaume Farré",
    description: "Peintures abstraites créées par le passage direct de la Dino sur toile vierge.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Toiles de Guillaume Farré" }],
  },
};

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
