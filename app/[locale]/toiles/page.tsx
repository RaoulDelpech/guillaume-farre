import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import ToilesContent from "@/components/toiles/ToilesContent";
import { TOILES } from "@/lib/toiles-data";
import { getAccessLevel } from "@/lib/access";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.toiles" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: t("ogAlt") }],
    },
  };
}

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
      <ToilesContent toiles={TOILES} showPrices={isVip} />
    </main>
  );
}
