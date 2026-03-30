"use client";

import EditableText from "@/components/admin/EditableText";
import ScrollReveal from "@/components/animations/ScrollReveal";
import LineReveal from "@/components/animations/LineReveal";

/**
 * Section Citation sur la Homepage
 * @author Lalou
 */
export default function HomeCitation() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <blockquote className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <EditableText
              textKey="home.citation"
              as="p"
              className="text-xl md:text-2xl lg:text-3xl font-extralight italic tracking-wide text-foreground/90 leading-relaxed"
            >
              Il n'y a jamais de deuxième prise.
            </EditableText>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <footer className="mt-8">
              <EditableText
                textKey="home.citationAuthor"
                as="cite"
                className="text-base font-extralight text-muted-foreground not-italic tracking-[0.15em]"
              >
                — Guillaume Farré
              </EditableText>
            </footer>
          </ScrollReveal>
          <div className="mt-10 flex justify-center">
            <LineReveal color="rgba(196,165,112,0.25)" width="60px" delay={0.4} />
          </div>
        </blockquote>
      </div>
    </section>
  );
}
