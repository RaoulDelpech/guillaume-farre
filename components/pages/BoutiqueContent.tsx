"use client";

import EditableText from "@/components/admin/EditableText";

interface BoutiqueContentProps {
  translations: {
    heroTag: string;
    heroTitle: string;
    heroDescription: string;
  };
}

/**
 * Contenu Hero de la page Boutique avec textes éditables
 *
 * @author Lalou
 * @date 2025-12-29
 */
export default function BoutiqueContent({ translations: t }: BoutiqueContentProps) {
  return (
    <div className="bg-gradient-to-b from-accent/20 to-background border-b border-border py-16 md:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-3 bg-primary rounded-full text-sm font-light tracking-widest mb-6">
              <EditableText textKey="shop.heroTag" as="span">
                {t.heroTag}
              </EditableText>
            </div>
            <EditableText
              textKey="shop.heroTitle"
              as="h1"
              className="text-3xl sm:text-5xl md:text-7xl font-light tracking-wide mb-6 sm:mb-8"
            >
              {t.heroTitle}
            </EditableText>
            <EditableText
              textKey="shop.heroDescription"
              as="p"
              className="text-lg sm:text-2xl font-light text-muted-foreground max-w-4xl mx-auto mb-8 sm:mb-10 leading-relaxed"
              multiline
            >
              {t.heroDescription}
            </EditableText>
          </div>

          {/* Avantages */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
              <div>
                <EditableText
                  textKey="shop.benefits.certificate.title"
                  as="div"
                  className="font-light tracking-wide text-base mb-2"
                >
                  Certificat authenticité
                </EditableText>
                <EditableText
                  textKey="shop.benefits.certificate.desc"
                  as="div"
                  className="text-sm text-muted-foreground font-light"
                >
                  Garantie d'origine
                </EditableText>
              </div>
              <div>
                <EditableText
                  textKey="shop.benefits.delivery.title"
                  as="div"
                  className="font-light tracking-wide text-base mb-2"
                >
                  Livraison premium
                </EditableText>
                <EditableText
                  textKey="shop.benefits.delivery.desc"
                  as="div"
                  className="text-sm text-muted-foreground font-light"
                >
                  Assurée et sécurisée
                </EditableText>
              </div>
              <div>
                <EditableText
                  textKey="shop.benefits.payment.title"
                  as="div"
                  className="font-light tracking-wide text-base mb-2"
                >
                  Paiement 3x
                </EditableText>
                <EditableText
                  textKey="shop.benefits.payment.desc"
                  as="div"
                  className="text-sm text-muted-foreground font-light"
                >
                  Sans frais dès 500€
                </EditableText>
              </div>
              <div>
                <EditableText
                  textKey="shop.benefits.club.title"
                  as="div"
                  className="font-light tracking-wide text-base mb-2"
                >
                  Club collectionneurs
                </EditableText>
                <EditableText
                  textKey="shop.benefits.club.desc"
                  as="div"
                  className="text-sm text-muted-foreground font-light"
                >
                  Dès la 1ère acquisition
                </EditableText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
