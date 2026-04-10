import { ShopCartItem } from "./shop-config";

interface ShopFloatingCartProps {
  items: ShopCartItem[];
  onCheckout: () => void;
  onClear: () => void;
}

export default function ShopFloatingCart({ items, onCheckout, onClear }: ShopFloatingCartProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-auto sm:top-24 sm:right-6 sm:w-80 bg-card text-foreground p-4 sm:p-6 rounded-lg shadow-2xl z-50 border border-border">
      <h3 className="font-light tracking-wide text-base sm:text-lg mb-2 sm:mb-3">
        Panier ({items.length})
      </h3>
      <p className="text-sm sm:text-base font-light mb-3 sm:mb-4">Total: {total}&euro;</p>
      <button
        onClick={onCheckout}
        className="w-full bg-black hover:bg-gray-900 text-white py-3 px-4 rounded-lg font-light tracking-wide transition-colors min-h-[44px]"
      >
        Payer maintenant
      </button>
      <button
        onClick={onClear}
        className="w-full mt-2 sm:mt-3 bg-muted hover:bg-muted/80 text-foreground py-2 px-4 rounded-lg text-sm font-light transition-colors min-h-[44px]"
      >
        Vider le panier
      </button>
    </div>
  );
}
