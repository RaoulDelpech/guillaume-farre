"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-white border-t border-zinc-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonne 1 : À propos */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-red-500">Guillaume Farré</h3>
            <p className="text-sm text-zinc-400">
              Artiste sculpteur et photographe. Quand l'automobile devient pinceau.
            </p>
          </div>

          {/* Colonne 2 : Navigation rapide */}
          <div>
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/galerie" className="text-zinc-400 hover:text-red-500 transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-zinc-400 hover:text-red-500 transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/histoire" className="text-zinc-400 hover:text-red-500 transition-colors">
                  Histoire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-red-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Informations légales */}
          <div>
            <h3 className="text-lg font-bold mb-4">Informations</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cgv" className="text-zinc-400 hover:text-red-500 transition-colors">
                  {t("legal")}
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-zinc-400 hover:text-red-500 transition-colors">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
          <p>{t("rights", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
