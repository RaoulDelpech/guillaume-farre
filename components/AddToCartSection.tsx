"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

interface Format {
  size: string;
  price: number;
  available: boolean;
}

interface AddToCartSectionProps {
  productId: string;
  productTitle: string;
  productImage: string;
  productCategory: string;
  photoPath: string;
}

const FORMATS: Format[] = [
  { size: "60×40 cm", price: 1200, available: true },
  { size: "120×80 cm", price: 2400, available: true },
  { size: "180×120 cm", price: 4800, available: true },
  { size: "300×200 cm", price: 0, available: false }, // Sur demande
];

export default function AddToCartSection({
  productId,
  productTitle,
  productImage,
  productCategory,
  photoPath,
}: AddToCartSectionProps) {
  const [selectedFormat, setSelectedFormat] = useState<Format>(FORMATS[1]); // 120×80 par défaut
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!selectedFormat.available) return;

    addItem({
      id: `${productId}-${selectedFormat.size}`,
      title: productTitle,
      price: selectedFormat.price,
      format: selectedFormat.size,
      material: 'semi-glossy',
      orientation: 'vertical',
      frame: 'none',
      image: productImage,
      category: productCategory,
      photoPath,
    });

    // Afficher message de succès
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push('/panier');
    }, 300);
  };

  return (
    <div className="border border-border rounded-lg p-8 bg-card/50">
      <div className="space-y-6">
        {/* Prix */}
        <div>
          <div className="text-sm text-muted-foreground mb-2">Prix</div>
          <div className="text-4xl font-light tracking-wide">
            {selectedFormat.price.toLocaleString('fr-FR')} €
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            ou 3x {Math.round(selectedFormat.price / 3).toLocaleString('fr-FR')}€ sans frais
          </div>
        </div>

        {/* Édition limitée */}
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
            Édition limitée 9 ex.
          </span>
        </div>

        {/* Sélection format */}
        <div>
          <div className="text-sm text-muted-foreground mb-3">Format d'impression</div>
          <div className="grid grid-cols-2 gap-3">
            {FORMATS.map((format) => (
              <button
                key={format.size}
                onClick={() => format.available && setSelectedFormat(format)}
                disabled={!format.available}
                className={`px-4 py-3 border rounded-lg text-sm transition-all ${
                  selectedFormat.size === format.size
                    ? 'border-2 border-primary bg-primary/5'
                    : format.available
                    ? 'border-border hover:border-primary'
                    : 'border-border opacity-50 cursor-not-allowed'
                }`}
              >
                {format.size}
                <br />
                <span className={`text-xs ${selectedFormat.size === format.size ? 'text-primary' : 'text-muted-foreground'}`}>
                  {format.available ? `${format.price.toLocaleString('fr-FR')} €` : 'Sur demande'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message de succès */}
        {showSuccess && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600 animate-fade-in">
            ✓ Ajouté au panier avec succès !
          </div>
        )}

        {/* Boutons CTA */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleAddToCart}
            disabled={!selectedFormat.available}
            className="w-full px-12 py-5 bg-black hover:bg-gray-900 text-white font-light tracking-wide rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter au panier
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!selectedFormat.available}
            className="w-full px-12 py-5 border-2 border-border hover:border-primary text-foreground font-light tracking-wide rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Acheter maintenant
          </button>
        </div>

        {/* Garanties */}
        <div className="pt-6 border-t space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>✓</span> Certificat d'authenticité inclus
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span> Livraison assurée offerte
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span> Retour 14 jours satisfait ou remboursé
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span> Paiement sécurisé par Stripe
          </div>
        </div>
      </div>
    </div>
  );
}
