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
    { href: "/boutique", label: t("boutique") },
    { href: "/quiz", label: "🎯 Quiz", highlight: true },
    { href: "/comparer", label: "⚖️ Comparer" },
    { href: "/origine", label: "Origine" },
    { href: "/performances", label: "Performances" },
    { href: "/collectionneurs", label: "Club" },
    { href: "/actualites", label: "Actualités" },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <nav className="bg-card border-b border-border text-foreground sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold hover:text-primary transition-colors">
            Guillaume Farré
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm hover:text-primary transition-colors ${
                  pathname === link.href ? "text-primary" : ""
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
