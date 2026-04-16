"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import EditableText from "@/components/admin/EditableText";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/10 border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {/* Colonne 1 : Contact - Style Shangti - Éditable en mode admin */}
          <div>
            <EditableText
              textKey="footer.artistName"
              as="h3"
              className="text-lg font-light tracking-wide mb-6 text-foreground"
            >
              Guillaume Farré
            </EditableText>
            <div className="text-sm font-light text-muted-foreground leading-relaxed space-y-2">
              <EditableText textKey="footer.location" as="p">
                Atelier — Toulouse, France
              </EditableText>
              <p>
                <a
                  href="mailto:contact@guillaumefarre.com"
                  className="hover:text-primary transition-colors"
                >
                  contact@guillaumefarre.com
                </a>
              </p>
            </div>
          </div>

          {/* Colonne 2 : Navigation - Décisions audit 2025-01-20 - Éditable en mode admin */}
          <div>
            <EditableText
              textKey="footer.navTitle"
              as="h3"
              className="text-lg font-light tracking-wide mb-6"
            >
              Navigation
            </EditableText>
            <ul className="space-y-3 sm:space-y-3 text-sm">
              <li>
                <Link href="/galerie" className="text-muted-foreground hover:text-primary transition-colors font-light inline-block py-1 sm:py-0">
                  {t("photographs")}
                </Link>
              </li>
              <li>
                <Link href="/toiles" className="text-muted-foreground hover:text-primary transition-colors font-light inline-block py-1 sm:py-0">
                  {t("canvases")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-light inline-block py-1 sm:py-0">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors font-light inline-block py-1 sm:py-0">
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Informations légales - Éditable en mode admin */}
          <div>
            <EditableText
              textKey="footer.infoTitle"
              as="h3"
              className="text-lg font-light tracking-wide mb-6"
            >
              Informations
            </EditableText>
            <ul className="space-y-3 sm:space-y-3 text-sm">
              <li>
                <Link href="/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors font-light inline-block py-1 sm:py-0">
                  {t("legal")}
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-muted-foreground hover:text-primary transition-colors font-light inline-block py-1 sm:py-0">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="text-muted-foreground hover:text-primary transition-colors font-light inline-block py-1 sm:py-0">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/retours-echanges" className="text-muted-foreground hover:text-primary transition-colors font-light inline-block py-1 sm:py-0">
                  {t("returns")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-border flex justify-center">
          <div className="max-w-md w-full text-center">
            <NewsletterSubscribe variant="footer" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground font-light">
          <p>{t("rights", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
