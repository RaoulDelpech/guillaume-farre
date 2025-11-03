"use client";
import { useState } from "react";
import { PhotoMetadata } from "@/lib/admin/photo-manager";
import { useTranslations } from "next-intl";
import { useFavorites } from "@/hooks/useFavorites";
import { useConfetti } from "@/hooks/useConfetti";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import ShareButtons from "@/components/ShareButtons";
import SizeVisualizer from "@/components/SizeVisualizer";

interface ShopGridProps {
  photos: PhotoMetadata[];
}

interface CartItem {
  photo: PhotoMetadata;
  format: string;
  frame: string;
  price: number;
}

export default function ShopGrid({ photos }: ShopGridProps) {
  const t = useTranslations("shop");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("A3");
  const [selectedFrame, setSelectedFrame] = useState("none");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { fireHeartConfetti, fireConfetti } = useConfetti();
  const { playCartAdd, playClick, playHover } = useSoundEffects();

  const formats = {
    "A4": { width: 21, height: 29.7, priceMultiplier: 1.0 },
    "A3": { width: 29.7, height: 42, priceMultiplier: 1.5 },
    "A2": { width: 42, height: 59.4, priceMultiplier: 2.0 },
  };

  const frames = {
    "none": { label: "Sans cadre", price: 0 },
    "black": { label: "Cadre noir (bois)", price: 150 },
    "aluminum": { label: "Cadre aluminium", price: 200 },
  };

  const calculatePrice = (basePrice: number, format: string, frame: string) => {
    const formatPrice = basePrice * formats[format as keyof typeof formats].priceMultiplier;
    const framePrice = frames[frame as keyof typeof frames].price;
    return Math.round(formatPrice + framePrice);
  };

  const handleAddToCart = () => {
    if (!selectedPhoto) return;

    const price = calculatePrice(selectedPhoto.price || 2000, selectedFormat, selectedFrame);
    const item: CartItem = {
      photo: selectedPhoto,
      format: selectedFormat,
      frame: selectedFrame,
      price,
    };

    setCart([...cart, item]);
    setSelectedPhoto(null);
    playCartAdd(); // 💰 Sound effect!
    fireConfetti(); // 🎊 Confetti!
    alert(`✅ ${selectedPhoto.title || selectedPhoto.filename} ajouté au panier !`);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            title: item.photo.title || item.photo.filename,
            filename: item.photo.filename,
            category: item.photo.category,
            price: item.price,
            images: [item.photo.path],
          })),
          locale: 'fr',
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('❌ Erreur lors de la création de la session de paiement');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('❌ Erreur lors du paiement');
    }
  };

  return (
    <div>
      {/* Panier flottant */}
      {cart.length > 0 && (
        <div className="fixed top-20 right-4 bg-zinc-900 text-white p-4 rounded-lg shadow-2xl z-50 border-2 border-amber-500">
          <h3 className="font-bold mb-2">🛒 Panier ({cart.length})</h3>
          <p className="text-sm mb-3">
            Total: {cart.reduce((sum, item) => sum + item.price, 0)}€
          </p>
          <button
            onClick={handleCheckout}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-bold transition-colors"
          >
            💳 Payer maintenant
          </button>
          <button
            onClick={() => setCart([])}
            className="w-full mt-2 bg-zinc-700 hover:bg-zinc-600 text-white py-1 px-4 rounded-lg text-sm transition-colors"
          >
            Vider le panier
          </button>
        </div>
      )}

      {/* Grille de photos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo, index) => (
          <div
            key={photo.path}
            className="bg-card rounded-lg overflow-hidden border-2 border-border hover:border-amber-500 transition-all shadow-lg"
          >
            <div className="relative aspect-[4/3] bg-zinc-900 group">
              <img
                src={photo.path}
                alt={photo.title || photo.filename}
                className="w-full h-full object-cover"
              />

              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const wasNotFavorite = !isFavorite(photo.path);
                  toggleFavorite(photo.path);
                  if (wasNotFavorite) {
                    fireHeartConfetti(); // ❤️ Confetti coeurs!
                  }
                }}
                className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-full transition-all hover:scale-110 z-10"
                title={isFavorite(photo.path) ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                {isFavorite(photo.path) ? (
                  <span className="text-xl">❤️</span>
                ) : (
                  <span className="text-xl">🤍</span>
                )}
              </button>

              {photo.edition?.type === 'limited' && photo.edition?.count && (
                <div className="absolute top-2 right-2 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Édition limitée {photo.edition.count}
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                {photo.title || `Photo ${index + 1}`}
              </h3>

              {photo.year && (
                <p className="text-sm text-muted-foreground mb-3">{photo.year}</p>
              )}

              <p className="text-2xl font-bold text-amber-600 mb-4">
                À partir de {photo.price || 2000}€
              </p>

              <button
                onClick={() => setSelectedPhoto(photo)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-bold transition-colors"
              >
                {t("addToCart")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de sélection */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedPhoto.title || selectedPhoto.filename}
                  </h2>
                  <p className="text-amber-100">Sélectionnez vos options</p>
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Aperçu */}
              <div className="aspect-[4/3] bg-zinc-900 rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto.path}
                  alt={selectedPhoto.title || selectedPhoto.filename}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Format */}
              <div>
                <h3 className="text-lg font-bold mb-3">📐 Format</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(formats).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFormat(key)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedFormat === key
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <div className="font-bold text-lg">{key}</div>
                      <div className="text-sm text-muted-foreground">
                        {value.width} × {value.height} cm
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cadre */}
              <div>
                <h3 className="text-lg font-bold mb-3">🖼️ Encadrement</h3>
                <div className="space-y-2">
                  {Object.entries(frames).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFrame(key)}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex justify-between items-center ${
                        selectedFrame === key
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                          : 'border-border hover:border-amber-300'
                      }`}
                    >
                      <span className="font-medium">{value.label}</span>
                      <span className="text-muted-foreground">
                        {value.price > 0 ? `+${value.price}€` : 'Inclus'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix total et ajout */}
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Prix total</span>
                  <span className="text-3xl font-bold text-amber-600">
                    {calculatePrice(selectedPhoto.price || 2000, selectedFormat, selectedFrame)}€
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                >
                  ✅ Ajouter au panier
                </button>
              </div>

              {/* Informations */}
              <div className="text-sm text-muted-foreground space-y-2">
                <p>✍️ Tirage numéroté et signé par l'artiste</p>
                <p>🎨 Papier Fine Art 300g/m² - Garantie 100 ans</p>
                <p>📦 Livraison sécurisée sous 2-3 semaines</p>
                <p>🔐 Certificat d'authenticité inclus</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
