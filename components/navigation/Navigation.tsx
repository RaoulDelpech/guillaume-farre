"use client";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "./MobileNav";

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const links = [
    { href: "/", label: t("accueil") },
    { href: "/galerie", label: t("galerie") },
    { href: "/boutique", label: t("boutique") },
    { href: "/origine", label: "Origine" },
    { href: "/performances", label: "Performances" },
    { href: "/collectionneurs", label: "Club" },
    { href: "/actualites", label: "Actualités" },
    { href: "/presse", label: t("presse") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <nav className="bg-zinc-900 text-white sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold hover:text-red-500 transition-colors">
            Guillaume Farré
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm hover:text-red-500 transition-colors ${
                  pathname === link.href ? "text-red-500" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
