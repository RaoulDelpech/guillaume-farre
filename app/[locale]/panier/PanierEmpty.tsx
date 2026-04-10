import { Link } from "@/i18n/routing";

export default function PanierEmpty() {
  return (
    <div className="text-center py-16 sm:py-28 max-w-3xl mx-auto px-4">
      <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">🛒</div>
      <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6">Votre panier est vide</h2>
      <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">
        Decouvrez nos oeuvres disponibles
      </p>
      <Link
        href="/boutique"
        className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all min-h-[48px]"
      >
        Voir la boutique
      </Link>
    </div>
  );
}
