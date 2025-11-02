import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";

export default async function BoutiquePage() {
  const t = await getTranslations("shop");

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">
          La boutique est en construction.
        </p>
      </div>
    </main>
  );
}
