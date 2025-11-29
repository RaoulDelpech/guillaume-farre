"use client";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "./MobileNav";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();

  const links = [
    { href: "/", label: t("accueil") },
    { href: "/galerie", label: "Galerie" },
    { href: "/dino", label: "Dino" },
    { href: "/boutique", label: "Commandes" },
    { href: "/atelier", label: "Atelier" },
    { href: "/origine", label: "Origine" },
    { href: "/contact", label: t("contact") },
  ];

  // Pages temporairement retirées (à réactiver plus tard) :
  // { href: "/collectionneurs", label: "Club" },
  // { href: "/actualites", label: "Actualités" },

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
