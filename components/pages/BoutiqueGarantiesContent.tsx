"use client";

import EditableText from "@/components/admin/EditableText";

/**
 * Section Garanties de la page Boutique avec textes éditables
 *
 * @author Lalou
 * @date 2025-12-29
 */
export default function BoutiqueGarantiesContent() {
  return (
    <div className="bg-card border-t border-border py-10 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <EditableText
            textKey="shop.guarantees.title"
            as="h3"
            className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-center mb-8 sm:mb-16"
          >
            Nos garanties
          </EditableText>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
            <div className="text-center">
              <EditableText
                textKey="shop.guarantees.authenticity.title"
                as="h4"
                className="font-light tracking-wide text-xl mb-4"
              >
                Authenticité
              </EditableText>
              <EditableText
                textKey="shop.guarantees.authenticity.desc"
                as="p"
                className="text-base text-muted-foreground font-light leading-relaxed"
                multiline
              >
                Chaque œuvre est signée, numérotée et certifiée. Traçabilité totale garantie.
              </EditableText>
            </div>
            <div className="text-center">
              <EditableText
                textKey="shop.guarantees.quality.title"
                as="h4"
                className="font-light tracking-wide text-xl mb-4"
              >
                Qualité galerie
              </EditableText>
              <EditableText
                textKey="shop.guarantees.quality.desc"
                as="p"
                className="text-base text-muted-foreground font-light leading-relaxed"
                multiline
              >
                Œuvres uniques créées dans l'atelier de l'artiste. Standards muséaux pour chaque pièce.
              </EditableText>
            </div>
            <div className="text-center">
              <EditableText
                textKey="shop.guarantees.protection.title"
                as="h4"
                className="font-light tracking-wide text-xl mb-4"
              >
                Protection
              </EditableText>
              <EditableText
                textKey="shop.guarantees.protection.desc"
                as="p"
                className="text-base text-muted-foreground font-light leading-relaxed"
                multiline
              >
                Livraison assurée, encadrement professionnel disponible, garantie satisfaction 14 jours.
              </EditableText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
