import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAccessLevel } from "@/lib/access";
import VipDoorEntry from "@/components/vip/VipDoorEntry";
import VipPrivateView from "@/components/vip/VipPrivateView";

/**
 * Page `/vip` tout-en-un (Sprint 1) :
 *
 * - Sans cookie HMAC valide -> on rend `VipDoorEntry` (porte d'entree
 *   avec saisie code + animation portes en bois).
 * - Avec cookie HMAC valide, non revoque, non expire -> on rend
 *   `VipPrivateView` (header epure + galerie ToilesContent avec prix
 *   si le niveau est `secret`, sans prix si `hidden`).
 *
 * Server Component : `getAccessLevel()` lit les cookies cote serveur
 * via `next/headers` et applique deja la verification HMAC + check
 * revocation (cf. lib/access.ts -> lib/vip-cookie.ts + lib/vip-revocation.ts).
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
  // On lit locale meme si on ne le passe plus aux composants enfants —
  // necessaire pour generateMetadata et utile si un futur sprint veut
  // segmenter le contenu prive par langue cote serveur.
  await params;

  const accessLevel = await getAccessLevel();

  if (accessLevel === "secret") {
    return <VipPrivateView showPrices={true} />;
  }
  if (accessLevel === "hidden") {
    return <VipPrivateView showPrices={false} />;
  }

  return <VipDoorEntry />;
}
