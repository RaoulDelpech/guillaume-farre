import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Boutique en ligne Guillaume Farré — tirages fine art numérotés et signés. Photographies en éditions limitées, impression Giclee sur papier archival.",
  openGraph: {
    title: "Boutique | Guillaume Farré",
    description: "Tirages fine art numérotés et signés — photographies en éditions limitées.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Boutique Guillaume Farré" }],
  },
};

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
