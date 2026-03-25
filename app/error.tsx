'use client';

/**
 * Page d'erreur 500 — affichée en cas d'erreur serveur inattendue
 * @author Lalou
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-5xl md:text-7xl font-light tracking-wider text-foreground mb-4">
          Erreur
        </h1>
        <p className="text-2xl md:text-3xl font-light text-muted-foreground mb-8 tracking-wide">
          Quelque chose s'est mal passe
        </p>
        <p className="text-base text-muted-foreground/70 font-light mb-12 leading-relaxed">
          Une erreur inattendue est survenue. Veuillez reessayer.
        </p>
        <button
          onClick={() => reset()}
          className="inline-block px-8 py-4 border border-foreground/30 hover:border-foreground text-foreground font-light tracking-wide transition-all"
        >
          Reessayer
        </button>
      </div>
    </div>
  );
}
