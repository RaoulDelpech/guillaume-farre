import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">
          Contactez Guillaume Farré pour toute demande.
        </p>
      </div>
    </main>
  );
}
