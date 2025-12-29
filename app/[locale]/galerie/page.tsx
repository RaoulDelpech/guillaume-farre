import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import GalleryClient from "@/components/GalleryClient";
import GalerieContent from "@/components/pages/GalerieContent";
import { getWorksFromMetadata } from "@/lib/works";

export default async function GaleriePage() {
  const t = await getTranslations("gallery");
  const works = await getWorksFromMetadata();

  const translations = {
    title: t("title"),
    subtitle: t("subtitle"),
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <GalerieContent translations={translations} />
      <GalleryClient works={works} />
    </main>
  );
}
