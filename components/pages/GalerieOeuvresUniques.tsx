"use client";

import { Link } from "@/i18n/routing";
import EditableText from "@/components/admin/EditableText";

/**
 * Section "Œuvres uniques" - Décision audit 2025-01-20
 * Toiles originales, visibles uniquement à l'atelier
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function GalerieOeuvresUniques() {
  return (
    <section className="py-16 md:py-24 bg-muted/10 border-t border-border">
      <div className="container px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <EditableText
            textKey="gallery.uniques.title"
            as="h2"
            className="text-3xl md:text-4xl font-light tracking-wide mb-6"
          >
            Œuvres uniques
          </EditableText>

          <EditableText
            textKey="gallery.uniques.description"
            as="p"
            className="text-lg text-muted-foreground font-light leading-relaxed mb-8"
            multiline
          >
            Les toiles originales sont des pièces uniques, créées par le passage direct de la Dino sur la toile. Chaque œuvre est irréplicable, marquée par l'instant de sa création.
          </EditableText>

          <EditableText
            textKey="gallery.uniques.location"
            as="p"
            className="text-base text-muted-foreground/80 font-light mb-10"
          >
            Visibles uniquement à l'atelier, sur rendez-vous.
          </EditableText>

          <Link
            href="/contact"
            className="inline-block px-8 py-4 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all group"
          >
            <EditableText textKey="gallery.uniques.cta" as="span">
              Prendre rendez-vous
            </EditableText>
            <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
