"use client";

import EditableText from "@/components/admin/EditableText";
import { MotionSection } from "@/components/motion/MotionWrapper";

interface GalerieContentProps {
  translations: {
    title: string;
    subtitle: string;
  };
}

/**
 * Contenu Hero de la page Galerie avec textes éditables
 *
 * @author Lalou
 * @date 2025-12-29
 */
export default function GalerieContent({ translations: t }: GalerieContentProps) {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Image de fond pleine page */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/images/works/empreintes/empreintes-007.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      {/* Overlay sombre pour lisibilité du texte */}
      <div className="absolute inset-0 bg-black/50"></div>

      <MotionSection variant="fadeInUp" className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl py-28">
        <EditableText
          textKey="gallery.title"
          as="h1"
          className="text-5xl md:text-7xl font-light tracking-wide mb-10 text-white"
        >
          {t.title}
        </EditableText>
        <EditableText
          textKey="gallery.subtitle"
          as="p"
          className="text-2xl md:text-3xl font-light text-white/90 max-w-4xl mx-auto leading-relaxed"
          multiline
        >
          {t.subtitle}
        </EditableText>
      </MotionSection>
    </div>
  );
}
