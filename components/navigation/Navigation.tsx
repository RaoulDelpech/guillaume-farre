"use client";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "./MobileNav";
// MASQUE - E-commerce désactivé (code gardé pour réactivation future)
// import { useCart } from "@/contexts/CartContext";
// import { useWishlist } from "@/hooks/useWishlist";

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  // MASQUE - E-commerce désactivé
  // const { totalItems } = useCart();
  // const { count: wishlistCount } = useWishlist();

  // Navigation principale - Décisions audit 2025-01-20
  const links = [
    { href: "/galerie", label: "Créations" },
    { href: "/atelier", label: "L'Atelier" },
    { href: "/contact", label: "Contact" },
  ];

  // MASQUE - Pages désactivées (code gardé pour réactivation future) :
  // { href: "/dino", label: "Dino" },
  // { href: "/origine", label: "Origines" },
  // { href: "/", label: t("accueil") },
  // { href: "/boutique", label: "Commandes" },
  // { href: "/collectionneurs", label: "Club" },
  // { href: "/actualites", label: "Actualités" },

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border text-foreground sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-xl sm:text-2xl font-light tracking-wide hover:text-primary transition-colors">
            Guillaume Farré
          </Link>
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-light tracking-wide hover:text-primary transition-colors btn-underline-expand ${
                  pathname === link.href ? "text-primary font-normal" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* MASQUE - E-commerce désactivé (code gardé pour réactivation future)
            <Link
              href="/favoris"
              className="relative text-sm font-light tracking-wide hover:text-primary transition-colors"
              title="Mes favoris"
            >
              ♡
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/panier"
              className="relative text-sm font-light tracking-wide hover:text-primary transition-colors"
              title="Mon panier"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            */}
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
