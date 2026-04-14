import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes sur les œuvres de Guillaume Farré : commande, paiement, livraison, retours, encadrement et certificat d'authenticité.",
  openGraph: {
    title: "FAQ | Guillaume Farré",
    description: "Toutes les réponses à vos questions sur les œuvres de Guillaume Farré.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "FAQ Guillaume Farré" }],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
