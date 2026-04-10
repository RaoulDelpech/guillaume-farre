import { Link } from "@/i18n/routing";

export default function PanierCanceled() {
  return (
    <div className="text-center py-16 sm:py-28 max-w-3xl mx-auto px-4">
      <div className="text-5xl sm:text-6xl mb-6 sm:mb-8">⚠️</div>
      <h2 className="text-3xl sm:text-4xl font-light mb-4 sm:mb-6">Paiement annule</h2>
      <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">
        Votre commande n'a pas ete finalisee. Vos articles sont toujours dans votre panier.
      </p>
      <Link
        href="/panier"
        className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-base sm:text-lg transition-all min-h-[48px]"
      >
        Retour au panier
      </Link>
    </div>
  );
}
