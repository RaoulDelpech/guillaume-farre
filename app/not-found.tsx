import Link from "next/link";

/**
 * Page 404 personnalisée - Décision audit 2025-01-20
 * Theme dinosaure + "Pas de Dino ici"
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Dinosaure ASCII art stylisé */}
        <pre className="text-4xl md:text-6xl font-mono text-muted-foreground/30 mb-8 select-none" aria-hidden="true">
{`    __
   / _)
  / /
 / /|
(__/|`}
        </pre>

        {/* Message principal */}
        <h1 className="text-5xl md:text-7xl font-light tracking-wider text-foreground mb-4">
          404
        </h1>

        <p className="text-2xl md:text-3xl font-light text-muted-foreground mb-8 tracking-wide">
          Pas de Dino ici
        </p>

        <p className="text-base text-muted-foreground/70 font-light mb-12 leading-relaxed">
          Cette page n'existe pas ou a disparu, comme les dinosaures.
          <br />
          Mais la Dino, elle, est toujours à l'atelier.
        </p>

        {/* CTA retour */}
        <Link
          href="/"
          className="inline-block px-8 py-4 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all group"
        >
          Retourner à l'accueil
          <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      </div>
    </div>
  );
}
