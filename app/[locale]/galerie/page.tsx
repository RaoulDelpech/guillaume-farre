import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import GalleryGrid from "@/components/GalleryGrid";
import { getWorksFromMetadata } from "@/lib/works";

export default async function GaleriePage() {
  const t = await getTranslations("gallery");
  const works = await getWorksFromMetadata();

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez l'univers créatif de Guillaume Farré
        </p>
        <GalleryGrid works={works} />
      </div>
    </main>
  );
}
