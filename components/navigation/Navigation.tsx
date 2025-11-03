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
    { href: "/galerie", label: "Galerie" },
    { href: "/boutique", label: t("boutique") },
    { href: "/origine", label: "Origine" },
    { href: "/performances", label: "Performances" },
    { href: "/collectionneurs", label: "Club" },
    { href: "/actualites", label: "Actualités" },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <nav className="bg-card border-b border-border text-foreground sticky top-0 z-40">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-light tracking-wide hover:text-primary transition-colors">
            Guillaume Farré
          </Link>
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-light tracking-wide hover:text-primary transition-colors ${
                  pathname === link.href ? "text-primary font-normal" : ""
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
