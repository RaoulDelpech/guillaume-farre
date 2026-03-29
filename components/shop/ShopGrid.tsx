"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoMetadata } from "@/lib/admin/photo-manager";
import { useTranslations } from "next-intl";
import { useFavorites } from "@/hooks/useFavorites";
import { useWishlist } from "@/hooks/useWishlist";
import { useConfetti } from "@/hooks/useConfetti";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import ShareButtons from "@/components/ShareButtons";
import SizeVisualizer from "@/components/SizeVisualizer";
import StockBadge from "@/components/StockBadge";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import SocialProof from "@/components/SocialProof";
import { isEarlyAccess } from "@/lib/early-access";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { toast } from "sonner";

interface ShopGridProps {
  photos: PhotoMetadata[];
}

interface CartItem {
  photo: PhotoMetadata;
  format: string;
  frame: string;
  material: string;
  price: number;
}

export default function ShopGrid({ photos }: ShopGridProps) {
  const t = useTranslations("shop");
  const tEarly = useTranslations("earlyAccess");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("A2");
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [selectedMaterial, setSelectedMaterial] = useState("semi-glossy");
  const [earlyCollectorMode, setEarlyCollectorMode] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { fireHeartConfetti, fireConfetti } = useConfetti();
  const { playCartAdd, playClick, playHover } = useSoundEffects();

  // Vérifier si en mode early collector
  useEffect(() => {
    setEarlyCollectorMode(isEarlyAccess());
  }, []);

  // Formats disponibles avec info grand/petit
  const allFormats = {
    "A4": { width: 21, height: 29.7, priceMultiplier: 0.31, type: 'petit' as const, price: 250 },
    "A3": { width: 29.7, height: 42, priceMultiplier: 0.63, type: 'petit' as const, price: 500 },
    "A2": { width: 42, height: 59.4, priceMultiplier: 1.0, type: 'petit' as const, price: 800 },
    "A1": { width: 59.4, height: 84.1, priceMultiplier: 1.5, type: 'grand' as const, price: 1200 },
    "A0": { width: 84.1, height: 118.9, priceMultiplier: 2.0, type: 'grand' as const, price: null }, // Sur devis
  };

  // Helper pour déterminer si un format est grand ou petit
  const isGrandFormat = (format: string) => ['A1', 'A0', '2A0'].includes(format);
  const isPetitFormat = (format: string) => ['A2', 'A3', 'A4'].includes(format);

  // Obtenir le stock selon le format sélectionné
  const getStockForFormat = (photo: PhotoMetadata, format: string) => {
    if (isGrandFormat(format)) {
      return photo.limitedEditionGrand || photo.limitedEdition || { total: 9, available: 9, sold: 0, closed: false };
    }
    return photo.limitedEditionPetit || photo.limitedEdition || { total: 99, available: 99, sold: 0, closed: false };
  };

  // Formats disponibles selon la catégorie de la photo
  const getAvailableFormats = (photo: PhotoMetadata | null) => {
    if (!photo) return allFormats;

    // Tous les formats disponibles : A2, A1, A0
    return allFormats;
  };

  const frames = {
    "none": { label: "Sans cadre", price: 0, description: "Impression livrée à plat ou roulée" },
    "black": { label: "Cadre bois noir", price: 150, description: "Cadre en bois noir avec plexiglas (encadrement artisanal après impression)" },
    "white": { label: "Cadre bois blanc", price: 150, description: "Cadre en bois blanc avec plexiglas (encadrement artisanal après impression)" },
  };

  const materials = {
    "semi-glossy": {
      label: "Papier Semi-Brillant",
      price: 13.20,
      description: "Papier Fine Art 200gsm, finition semi-brillante, rendu des couleurs exceptionnel"
    },
    "aluminum": {
      label: "Aluminium Brossé",
      price: 16.81,
      description: "Impression directe sur aluminium, effet moderne et durable, résistant aux UV"
    },
  };

  const calculatePrice = (basePrice: number, format: string, frame: string, material: string) => {
    const formatPrice = basePrice * allFormats[format as keyof typeof allFormats].priceMultiplier;
    const framePrice = frames[frame as keyof typeof frames].price;
    const materialPrice = materials[material as keyof typeof materials].price;
    return Math.round(formatPrice + framePrice + materialPrice);
  };

  // Réinitialiser le format quand une photo est sélectionnée
  useEffect(() => {
    if (selectedPhoto) {
      const availableFormats = getAvailableFormats(selectedPhoto);
      const formatKeys = Object.keys(availableFormats);

      // Si le format actuel n'est pas disponible, prendre le premier disponible
      if (!formatKeys.includes(selectedFormat)) {
        setSelectedFormat(formatKeys[0] || 'A2');
      }
    }
  }, [selectedPhoto]);

  const handleAddToCart = () => {
    if (!selectedPhoto) return;

    const price = calculatePrice(selectedPhoto.price || 2000, selectedFormat, selectedFrame, selectedMaterial);
    const item: CartItem = {
      photo: selectedPhoto,
      format: selectedFormat,
      frame: selectedFrame,
      material: selectedMaterial,
      price,
    };

    setCart([...cart, item]);

    // GA4 tracking - Add to cart
    trackAddToCart({
      id: selectedPhoto.filename,
      name: selectedPhoto.title || selectedPhoto.filename,
      price: price,
      quantity: 1,
      category: selectedPhoto.category || "Photographie",
    });

    setSelectedPhoto(null);
    playCartAdd();
    fireConfetti();
    toast.success(`${selectedPhoto.title || selectedPhoto.filename} ajouté au panier`);
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
            photoPath: item.photo.path,
            format: item.format,
            material: item.material,
            orientation: item.photo.orientation === 'auto'
              ? item.photo.aiDetectedOrientation || 'vertical'
              : item.photo.orientation || 'vertical',
            frame: item.frame,
          })),
          locale: 'fr',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[ShopGrid] Erreur HTTP:', response.status, data);
        toast.error(data.error || 'Erreur lors de la création de la session de paiement');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Pas d\'URL de redirection reçue');
      }
    } catch (error) {
      console.error('[ShopGrid] Checkout error:', error);
      toast.error(`Erreur lors du paiement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div>
      {/* Panier flottant */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-auto sm:top-24 sm:right-6 sm:w-80 bg-card text-foreground p-4 sm:p-6 rounded-lg shadow-2xl z-50 border border-border">
          <h3 className="font-light tracking-wide text-base sm:text-lg mb-2 sm:mb-3">Panier ({cart.length})</h3>
          <p className="text-sm sm:text-base font-light mb-3 sm:mb-4">
            Total: {cart.reduce((sum, item) => sum + item.price, 0)}€
          </p>
          <button
            onClick={handleCheckout}
            className="w-full bg-black hover:bg-gray-900 text-white py-3 px-4 rounded-lg font-light tracking-wide transition-colors min-h-[44px]"
          >
            Payer maintenant
          </button>
          <button
            onClick={() => setCart([])}
            className="w-full mt-2 sm:mt-3 bg-muted hover:bg-muted/80 text-foreground py-2 px-4 rounded-lg text-sm font-light transition-colors min-h-[44px]"
          >
            Vider le panier
          </button>
        </div>
      )}

      {/* Grille de photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {photos.map((photo, index) => {
          // Note: Pour l'instant, on n'a que des photos, pas de toiles
          // La logique de masquage des toiles sera implémentée quand on aura un champ pour les distinguer

          return (
          <div
            key={photo.path}
            className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            <div className="relative aspect-[4/3] bg-zinc-900 group overflow-hidden">
              <Image
                src={photo.path}
                alt={photo.title || photo.filename}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                quality={85}
              />

              {/* Wishlist button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const wasNotInWishlist = !isInWishlist(photo.path);
                  toggleWishlist({
                    photoPath: photo.path,
                    title: photo.title || photo.filename,
                    price: photo.price,
                    thumbnailUrl: photo.path,
                  });
                  if (wasNotInWishlist) {
                    fireHeartConfetti();
                  }
                }}
                className="absolute top-3 left-3 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white w-11 h-11 rounded-full transition-all hover:scale-110 z-10 flex items-center justify-center"
                title={isInWishlist(photo.path) ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                {isInWishlist(photo.path) ? (
                  <span className="text-lg">♥</span>
                ) : (
                  <span className="text-lg">♡</span>
                )}
              </button>

              {/* Badge avant-premiere */}
              {photo.earlyAccess && earlyCollectorMode && (
                <div className="absolute top-14 left-3 sm:top-3 sm:left-14 bg-black text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide z-10">
                  {tEarly("preview")}
                </div>
              )}

              {/* Badge édition limitée - Affiche le plus restrictif (grand format 9 ex.) */}
              {(photo.categories?.includes('limited') || photo.edition?.type === 'limited') && (
                <div className="absolute top-3 right-3">
                  <StockBadge
                    available={photo.limitedEditionGrand?.available || photo.limitedEdition?.available || 9}
                    total={photo.limitedEditionGrand?.total || photo.limitedEdition?.total || 9}
                    size="sm"
                    formatType="grand"
                  />
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-light tracking-wide mb-2 sm:mb-3">
                {photo.title || `Photo ${index + 1}`}
              </h3>

              {photo.year && (
                <p className="text-sm text-muted-foreground font-light mb-4">{photo.year}</p>
              )}

              <p className="text-2xl font-light text-amber-600 mb-4">
                {photo.price || 2000}€
              </p>

              {/* Badge paiement 3x/4x si montant ≥ €100 */}
              {(photo.price || 2000) >= 100 && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-4">
                  <span>💳</span>
                  <span className="font-medium">Paiement 3x/4x sans frais</span>
                </div>
              )}

              {/* Délai de livraison */}
              <div className="mb-4">
                <DeliveryEstimate variant="compact" />
              </div>

              {/* Social proof */}
              <div className="mb-6">
                <SocialProof
                  photoPath={photo.path}
                  stockAvailable={photo.limitedEdition?.available}
                  stockTotal={photo.limitedEdition?.total}
                  variant="compact"
                />
              </div>

              {/* Afficher "Bientot disponible" si l'oeuvre est early access mais la periode est terminee */}
              {photo.earlyAccess && !earlyCollectorMode ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-light tracking-wide cursor-not-allowed min-h-[44px]"
                >
                  {tEarly("comingSoon")}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedPhoto(photo);
                    // GA4 tracking - View item when modal opens
                    trackViewItem({
                      id: photo.filename,
                      name: photo.title || photo.filename,
                      price: photo.price || 2000,
                      category: photo.category || "Photographie",
                    });
                  }}
                  className="w-full bg-black hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-light tracking-wide transition-colors min-h-[44px]"
                >
                  {earlyCollectorMode ? tEarly("reserve") : t("addToCart")}
                </button>
              )}
            </div>
          </div>
        );
        })}
      </div>

      {/* Modal de selection */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-card rounded-t-2xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 bg-muted border-b border-border p-4 sm:p-8 rounded-t-2xl">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-3xl font-light tracking-wide mb-1 sm:mb-2 truncate">
                    {selectedPhoto.title || selectedPhoto.filename}
                  </h2>
                  <p className="text-muted-foreground font-light text-sm sm:text-base">Selectionnez vos options</p>
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-foreground hover:bg-background rounded-full p-2 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              {/* Aperçu */}
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden relative">
                <Image
                  src={selectedPhoto.path}
                  alt={selectedPhoto.title || selectedPhoto.filename}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>

              {/* Format */}
              <div>
                <h3 className="text-lg font-light tracking-wide mb-4">Format</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
                  {Object.entries(getAvailableFormats(selectedPhoto)).map(([key, value]) => {
                    const stock = getStockForFormat(selectedPhoto, key);
                    const formatInfo = allFormats[key as keyof typeof allFormats];
                    const isGrand = formatInfo?.type === 'grand';

                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedFormat(key)}
                        className={`p-3 sm:p-5 rounded-lg border transition-all min-h-[44px] ${
                          selectedFormat === key
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-light text-base sm:text-lg tracking-wide">{key}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground font-light">
                          {value.width} x {value.height} cm
                        </div>
                        <div className="text-xs text-amber-600 mt-1">
                          {isGrand ? `${stock.total - stock.available + 1}/9` : `${stock.total - stock.available + 1}/99`}
                        </div>
                        <div className="text-xs sm:text-sm font-medium mt-1">
                          {formatInfo?.price ? `${formatInfo.price}€` : 'Devis'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Matériau */}
              <div>
                <h3 className="text-lg font-light tracking-wide mb-4">Matériau</h3>
                <div className="space-y-3">
                  {Object.entries(materials).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedMaterial(key)}
                      className={`w-full p-4 sm:p-5 rounded-lg border transition-all min-h-[44px] ${
                        selectedMaterial === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-light tracking-wide">{value.label}</span>
                        <span className="text-muted-foreground font-light">
                          +{value.price.toFixed(2)}€
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        {value.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cadre */}
              <div>
                <h3 className="text-lg font-light tracking-wide mb-4">Encadrement</h3>
                <div className="space-y-3">
                  {Object.entries(frames).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedFrame(key)}
                      className={`w-full p-4 sm:p-5 rounded-lg border transition-all min-h-[44px] ${
                        selectedFrame === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-light tracking-wide">{value.label}</span>
                        <span className="text-muted-foreground font-light">
                          {value.price > 0 ? `+${value.price}€` : 'Inclus'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        {value.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Délai de livraison détaillé */}
              <DeliveryEstimate variant="detailed" className="mb-6" />

              {/* Social proof détaillé - selon format sélectionné */}
              {(() => {
                const stock = getStockForFormat(selectedPhoto, selectedFormat);
                return (
                  <SocialProof
                    photoPath={selectedPhoto.path}
                    stockAvailable={stock.available}
                    stockTotal={stock.total}
                    variant="detailed"
                    className="mb-6"
                  />
                );
              })()}

              {/* Prix total et ajout */}
              <div className="bg-muted rounded-lg p-4 sm:p-8">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <span className="text-base sm:text-lg font-light tracking-wide">Prix total</span>
                  <span className="text-2xl sm:text-3xl font-light text-amber-600">
                    {calculatePrice(selectedPhoto.price || 2000, selectedFormat, selectedFrame, selectedMaterial)}€
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black hover:bg-gray-900 text-white py-4 px-6 rounded-lg font-light tracking-wide text-base sm:text-lg transition-all min-h-[48px]"
                >
                  {earlyCollectorMode ? tEarly("reserveThis") : "Ajouter au panier"}
                </button>
              </div>

              {/* Informations */}
              <div className="text-sm text-muted-foreground space-y-2 font-light">
                <p>• Tirage numéroté et signé par l'artiste</p>
                <p>• Papier Fine Art 300g/m² - Garantie 100 ans</p>
                <p>• Livraison sécurisée sous 2-3 semaines</p>
                <p>• Certificat d'authenticité inclus</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
