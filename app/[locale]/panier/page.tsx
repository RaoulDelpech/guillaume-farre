"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Navigation from "@/components/navigation/Navigation";

export default function PanierPage() {
  const t = useTranslations("cart");

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <Navigation />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-light text-4xl tracking-wide text-zinc-900 mb-8">
            {t("title")}
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-12 mb-8">
            <p className="text-zinc-600 text-lg mb-6 font-light tracking-wide">
              {t("empty")}
            </p>
            <p className="text-zinc-500 text-sm mb-8 font-light">
              {t("info")}
            </p>
            <Link
              href="/galerie"
              className="inline-block px-8 py-3 bg-zinc-900 text-white font-light tracking-wide rounded-md hover:bg-zinc-800 transition-colors"
            >
              {t("browseGallery")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
