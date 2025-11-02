import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";

export default async function PanierPage() {
  const t = await getTranslations("nav");

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{t("panier")}</h1>
        <p className="text-muted-foreground">
          Votre panier est vide.
        </p>
      </div>
    </main>
  );
}
