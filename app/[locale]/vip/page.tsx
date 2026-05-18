import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAccessLevel } from "@/lib/access";
import VipCodeForm from "@/components/vip/VipCodeForm";
import VipPrivateView from "@/components/vip/VipPrivateView";

/**
 * Page `/vip` tout-en-un (Sprint 6 : splash supprime).
 *
 * - Sans cookie HMAC valide -> on rend `VipCodeForm` direct (formulaire
 *   sobre noir/blanc en plein ecran). Apres validation, le composant
 *   reload la page, ce Server Component s'execute a nouveau et bascule
 *   vers la vue privee.
 * - Avec cookie HMAC valide, non revoque, non expire -> on rend
 *   `VipPrivateView` (header epure + galerie ToilesContent avec prix
 *   si le niveau est `secret`, sans prix si `hidden`).
 *
 * Sprint 4.5 avait introduit un splash anime "Bienvenue dans l'atelier"
 * (VipDoorEntry + VipWelcomeOverlay). Concept abandonne en Sprint 6 :
 * la transition directe vers la zone privee est plus efficace et coherente
 * avec l'identite minimaliste du site.
 *
 * @author Lalou
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vip" });
  const title = t("seoTitle");
  const description = t("seoDescription");
  const canonical = `https://guillaumefarre.com/${locale}/vip`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: "https://guillaumefarre.com/fr/vip",
        en: "https://guillaumefarre.com/en/vip",
        it: "https://guillaumefarre.com/it/vip",
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "Guillaume Farré",
      locale,
      images: [
        {
          url: "https://guillaumefarre.com/images/og/vip.jpg",
          width: 1200,
          height: 630,
          alt: "Guillaume Farré — Invitation privée",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://guillaumefarre.com/images/og/vip.jpg"],
    },
  };
}

export default async function VipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  const accessLevel = await getAccessLevel();

  if (accessLevel === "secret") {
    return <VipPrivateView showPrices={true} />;
  }
  if (accessLevel === "hidden") {
    return <VipPrivateView showPrices={false} />;
  }

  return <VipCodeForm />;
}
