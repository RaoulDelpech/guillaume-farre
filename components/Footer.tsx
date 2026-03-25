"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import EditableText from "@/components/admin/EditableText";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/10 border-t border-border mt-auto">
      <div className="container mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
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
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/galerie" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  Créations
                </Link>
              </li>
              <li>
                <Link href="/dino" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  Dino
                </Link>
              </li>
              <li>
                <Link href="/atelier" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  L'Atelier
                </Link>
              </li>
              <li>
                <Link href="/origine" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  Origines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  Contact
                </Link>
              </li>
              {/* Lien discret vers la boutique - e-commerce masqué mais accessible */}
              <li className="pt-2 mt-2 border-t border-border/50">
                <Link href="/boutique" className="text-muted-foreground/60 hover:text-primary transition-colors font-light text-xs">
                  Commandes
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
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/compte" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  {t("account")}
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  {t("legal")}
                </Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground font-light">
          <p>{t("rights", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
