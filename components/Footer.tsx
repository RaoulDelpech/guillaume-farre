"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/20 border-t border-border mt-auto">
      <div className="container mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {/* Colonne 1 : À propos */}
          <div>
            <h3 className="text-lg font-light tracking-wide mb-6 text-primary">Guillaume Farré</h3>
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              Artiste sculpteur et photographe. Quand l'automobile devient pinceau.
            </p>
          </div>

          {/* Colonne 2 : Navigation rapide */}
          <div>
            <h3 className="text-lg font-light tracking-wide mb-6">Navigation</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/galerie" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/histoire" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  Histoire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors font-light">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Informations légales */}
          <div>
            <h3 className="text-lg font-light tracking-wide mb-6">Informations</h3>
            <ul className="space-y-3 text-sm">
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
