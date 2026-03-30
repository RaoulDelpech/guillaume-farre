"use client";

import { useState } from "react";
import EditableText from "@/components/admin/EditableText";
import { Link } from "@/i18n/routing";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * Contenu de la page Contact - Style Shangti (minimaliste)
 * Simplifié selon audit 2025-01-20 : suppression sections redondantes
 *
 * @author Lalou
 * @date 2025-01-20
 */

// Options du dropdown - Décision audit 2025-01-20
const subjectOptions = [
  { value: "", label: "Choisir un sujet..." },
  { value: "oeuvre", label: "J'aimerais acquérir une œuvre" },
  { value: "visite", label: "J'aimerais visiter l'atelier" },
  { value: "question", label: "J'ai une question" },
  { value: "autre", label: "Autre" },
];

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero minimaliste */}
      <ScrollReveal className="py-12 sm:py-24 md:py-32 border-b border-border">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <EditableText
            textKey="contact.hero.title"
            as="h1"
            className="text-3xl sm:text-5xl md:text-7xl font-light tracking-wide mb-6 sm:mb-8 text-foreground"
          >
            Contact
          </EditableText>
          <EditableText
            textKey="contact.hero.subtitle"
            as="p"
            className="text-xl md:text-2xl font-light text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            multiline
          >
            Acquisition, visite d'atelier, collaboration. Je réponds personnellement à chaque message.
          </EditableText>
        </div>
      </ScrollReveal>

      {/* Formulaire de contact simple */}
      <section className="py-20 md:py-28 border-b border-border">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            {submitStatus === "success" ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-6">✓</div>
                <h3 className="text-2xl font-light mb-4">Message envoyé</h3>
                <p className="text-muted-foreground font-light">
                  Je vous réponds sous 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-light tracking-wide mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 bg-background border border-border rounded font-light focus:outline-none focus:border-primary transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-light tracking-wide mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-4 bg-background border border-border rounded font-light focus:outline-none focus:border-primary transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Sujet - Dropdown */}
                <div>
                  <label className="block text-sm font-light tracking-wide mb-2">
                    Sujet
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-4 bg-background border border-border rounded font-light focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-light tracking-wide mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-4 bg-background border border-border rounded font-light focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all disabled:opacity-50 min-h-[48px]"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact direct - Une seule ligne épurée */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
              <a
                href="mailto:contact@guillaumefarre.com"
                className="text-muted-foreground hover:text-foreground font-light transition-colors"
              >
                contact@guillaumefarre.com
              </a>
              <span className="hidden md:inline text-border">|</span>
              <a
                href="https://instagram.com/guillaumefarre.art"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground font-light transition-colors"
              >
                @guillaumefarre.art
              </a>
              <span className="hidden md:inline text-border">|</span>
              <span className="text-muted-foreground font-light">
                Toulouse, France
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <ScrollReveal className="py-12 sm:py-24 md:py-32">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <EditableText
              textKey="contact.cta.title"
              as="h2"
              className="text-3xl md:text-4xl font-light tracking-wide mb-8"
            >
              Découvrez les œuvres disponibles
            </EditableText>
            <div className="flex justify-center">
              <Link
                href="/galerie"
                className="px-8 sm:px-10 py-4 sm:py-5 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all text-center min-h-[48px] flex items-center justify-center"
              >
                Voir les créations
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
