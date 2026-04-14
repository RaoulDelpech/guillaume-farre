import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guillaume Farré — Bientôt",
  description: "Le site de Guillaume Farré arrive bientôt. Inscrivez-vous pour être informé du lancement.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
