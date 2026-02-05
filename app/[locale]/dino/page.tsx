import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navigation from "@/components/navigation/Navigation";
import DinoContent from "@/components/pages/DinoContent";
import { getPageImages } from "@/lib/page-images";

export const metadata: Metadata = {
  title: "La Dino",
  description: "La Dino 246 GT : l'instrument de création de Guillaume Farré. V6 de 195 chevaux, carrosserie Pininfarina.",
  openGraph: {
    title: "La Dino | Guillaume Farré",
    description: "Découvrez la Dino 246 GT, l'instrument au cœur du processus créatif de Guillaume Farré.",
  },
};

export default async function DinoPage() {
  const t = await getTranslations("dino");
  const pageImages = await getPageImages();

  // Préparer les traductions pour le composant client
  const translations = {
    tag: t("tag"),
    title: t("title"),
    subtitle: t("subtitle"),
    origin: {
      label: t("origin.label"),
      title: t("origin.title"),
      text1: t("origin.text1"),
      text2: t("origin.text2"),
    },
    specs: {
      label: t("specs.label"),
      title: t("specs.title"),
      model: t("specs.model"),
      modelValue: t("specs.modelValue"),
      year: t("specs.year"),
      yearValue: t("specs.yearValue"),
      color: t("specs.color"),
      colorValue: t("specs.colorValue"),
      engine: t("specs.engine"),
      engineValue: t("specs.engineValue"),
      power: t("specs.power"),
      powerValue: t("specs.powerValue"),
      weight: t("specs.weight"),
      weightValue: t("specs.weightValue"),
    },
    creative: {
      label: t("creative.label"),
      title: t("creative.title"),
      text1: t("creative.text1"),
      text2: t("creative.text2"),
    },
    gallery: {
      label: t("gallery.label"),
      title: t("gallery.title"),
    },
    cta: {
      title: t("cta.title"),
      text: t("cta.text"),
      button1: t("cta.button1"),
      button2: t("cta.button2"),
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <DinoContent translations={translations} images={pageImages.dino} />
    </main>
  );
}
