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
  return {
    title: t("title"),
    description: t("subtitle"),
    robots: { index: false, follow: false },
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
