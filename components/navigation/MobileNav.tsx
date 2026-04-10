"use client";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  // Focus trap pour accessibilité
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
    }

    if (e.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        '#mobile-menu a, #mobile-menu button'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  const links = [
    { href: "/galerie", label: t("photographies") },
    { href: "/toiles", label: t("toiles") },
    { href: "/contact", label: t("contact") },
  ];

  // MASQUE - Pages désactivées (code gardé pour réactivation future) :
  // { href: "/dino", label: "Dino" },
  // { href: "/origine", label: "Origines" },
  // { href: "/", label: t("accueil") },
  // { href: "/boutique", label: "Commandes" },
  // { href: "/histoire", label: t("histoire") },
  // { href: "/panier", label: t("panier") },

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 z-50"
        aria-label="Menu"
      >
        <span className={`w-6 h-0.5 bg-foreground transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`w-6 h-0.5 bg-foreground transition-all ${isOpen ? "opacity-0" : ""}`} />
        <span className={`w-6 h-0.5 bg-foreground transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel - utilise design token au lieu de hardcoded */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-xs bg-background border-l border-border z-50 transform transition-transform duration-300 md:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onKeyDown={handleKeyDown}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="font-light tracking-wide text-foreground">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-light tracking-wide transition-colors py-2.5 min-h-[44px] flex items-center ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
