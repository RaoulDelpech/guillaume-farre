import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import PanierClient from "./PanierClient";

export default async function PanierPage() {
  const t = await getTranslations("nav");

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-6 lg:px-8 py-20 md:py-28">
        <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-12">
          {t("panier")}
        </h1>
        <PanierClient />
      </div>
    </main>
  );
}
