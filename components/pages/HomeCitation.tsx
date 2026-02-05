"use client";

import EditableText from "@/components/admin/EditableText";

/**
 * Section Citation sur la Homepage - Décision audit 2025-01-20
 * "Il n'y a jamais de deuxième prise."
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function HomeCitation() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-6 lg:px-8">
        <blockquote className="max-w-3xl mx-auto text-center">
          <EditableText
            textKey="home.citation"
            as="p"
            className="text-xl md:text-2xl lg:text-3xl font-light italic tracking-wide text-foreground/90 leading-relaxed"
          >
            Il n'y a jamais de deuxième prise.
          </EditableText>
          <footer className="mt-6">
            <EditableText
              textKey="home.citationAuthor"
              as="cite"
              className="text-base font-light text-muted-foreground not-italic tracking-wider"
            >
              — Guillaume Farré
            </EditableText>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
