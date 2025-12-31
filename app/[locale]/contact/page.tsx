import { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import ContactContent from "@/components/pages/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Guillaume Farré : acquisition d'œuvres, visite d'atelier, demandes presse ou collaborations. Atelier situé à Toulouse.",
  openGraph: {
    title: "Contact | Guillaume Farré",
    description: "Prenez contact avec Guillaume Farré pour une acquisition ou une visite d'atelier.",
  },
};

/**
 * Page Contact avec textes éditables en mode admin
 * Accès mode édition : ?admin=true
 *
 * @author Lalou
 * @date 2025-12-31
 */
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ContactContent />
    </main>
  );
}
