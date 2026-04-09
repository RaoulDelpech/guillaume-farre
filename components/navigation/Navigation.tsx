"use client";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "./MobileNav";

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const doors = [
    { href: "/toiles", label: "Toiles", subtitle: "Peintures sur toile" },
    { href: "/galerie", label: "Photographies", subtitle: "Concept Car Art" },
  ];

  return (
    <>
      {/* Barre de navigation sticky */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-700 ease-out ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
            : "bg-background border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              className={`text-xl sm:text-2xl font-extralight hover:text-primary transition-all duration-500 ${
                scrolled ? "tracking-[0.05em]" : "tracking-[0.08em]"
              }`}
            >
              Guillaume Farré
            </Link>
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {doors.map((door) => (
                <Link
                  key={door.href}
                  href={door.href}
                  className={`text-sm font-light tracking-[0.15em] uppercase hover:text-primary transition-colors duration-300 relative group ${
                    pathname === door.href ? "text-primary" : ""
                  }`}
                >
                  {door.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[rgba(196,165,112,0.5)] transition-all duration-500 ease-out ${
                      pathname === door.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
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

    </>
  );
}
