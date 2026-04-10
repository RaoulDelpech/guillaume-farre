import Image from "next/image";
import { PhotoMetadata } from "@/lib/admin/photo-manager";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import SocialProof from "@/components/SocialProof";
import {
  FORMAT_CONFIG,
  FRAME_CONFIG,
  MATERIAL_CONFIG,
  getStockForFormat,
  calculatePrice,
  type FormatKey,
  type FrameKey,
  type MaterialKey,
} from "./shop-config";

interface ShopSelectionModalProps {
  photo: PhotoMetadata;
  selectedFormat: FormatKey;
  selectedFrame: FrameKey;
  selectedMaterial: MaterialKey;
  earlyCollectorMode: boolean;
  tEarly: (key: string) => string;
  onFormatChange: (format: FormatKey) => void;
  onFrameChange: (frame: FrameKey) => void;
  onMaterialChange: (material: MaterialKey) => void;
  onAddToCart: () => void;
  onClose: () => void;
}

export default function ShopSelectionModal({
  photo,
  selectedFormat,
  selectedFrame,
  selectedMaterial,
  earlyCollectorMode,
  tEarly,
  onFormatChange,
  onFrameChange,
  onMaterialChange,
  onAddToCart,
  onClose,
}: ShopSelectionModalProps) {
  const totalPrice = calculatePrice(photo.price || 2000, selectedFormat, selectedFrame, selectedMaterial);
  const stock = getStockForFormat(photo, selectedFormat);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-border">
        {/* Header sticky */}
        <div className="sticky top-0 bg-muted border-b border-border p-4 sm:p-8 rounded-t-2xl">
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-3xl font-light tracking-wide mb-1 sm:mb-2 truncate">
                {photo.title || photo.filename}
              </h2>
              <p className="text-muted-foreground font-light text-sm sm:text-base">Selectionnez vos options</p>
            </div>
            <button
              onClick={onClose}
              className="text-foreground hover:bg-background rounded-full p-2 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
            >
              &#x2715;
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Aperçu */}
          <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden relative">
            <Image
              src={photo.path}
              alt={photo.title || photo.filename}
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
              {(Object.entries(FORMAT_CONFIG) as [FormatKey, (typeof FORMAT_CONFIG)[FormatKey]][]).map(([key, value]) => {
                const formatStock = getStockForFormat(photo, key);
                const isGrand = value.type === "grand";

                return (
                  <button
                    key={key}
                    onClick={() => onFormatChange(key)}
                    className={`p-3 sm:p-5 rounded-lg border transition-all min-h-[44px] ${
                      selectedFormat === key ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-light text-base sm:text-lg tracking-wide">{key}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-light">
                      {value.width} x {value.height} cm
                    </div>
                    <div className="text-xs text-amber-600 mt-1">
                      {isGrand
                        ? `${formatStock.total - formatStock.available + 1}/9`
                        : `${formatStock.total - formatStock.available + 1}/99`}
                    </div>
                    <div className="text-xs sm:text-sm font-medium mt-1">
                      {value.price ? `${value.price}\u20AC` : "Devis"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matériau */}
          <div>
            <h3 className="text-lg font-light tracking-wide mb-4">Mat&eacute;riau</h3>
            <div className="space-y-3">
              {(Object.entries(MATERIAL_CONFIG) as [MaterialKey, (typeof MATERIAL_CONFIG)[MaterialKey]][]).map(
                ([key, value]) => (
                  <button
                    key={key}
                    onClick={() => onMaterialChange(key)}
                    className={`w-full p-4 sm:p-5 rounded-lg border transition-all min-h-[44px] ${
                      selectedMaterial === key ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-light tracking-wide">{value.label}</span>
                      <span className="text-muted-foreground font-light">+{value.price.toFixed(2)}&euro;</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">{value.description}</p>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Cadre */}
          <div>
            <h3 className="text-lg font-light tracking-wide mb-4">Encadrement</h3>
            <div className="space-y-3">
              {(Object.entries(FRAME_CONFIG) as [FrameKey, (typeof FRAME_CONFIG)[FrameKey]][]).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => onFrameChange(key)}
                  className={`w-full p-4 sm:p-5 rounded-lg border transition-all min-h-[44px] ${
                    selectedFrame === key ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-light tracking-wide">{value.label}</span>
                    <span className="text-muted-foreground font-light">
                      {value.price > 0 ? `+${value.price}\u20AC` : "Inclus"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">{value.description}</p>
                </button>
              ))}
            </div>
          </div>

          <DeliveryEstimate variant="detailed" className="mb-6" />

          <SocialProof
            photoPath={photo.path}
            stockAvailable={stock.available}
            stockTotal={stock.total}
            variant="detailed"
            className="mb-6"
          />

          {/* Prix total et ajout */}
          <div className="bg-muted rounded-lg p-4 sm:p-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <span className="text-base sm:text-lg font-light tracking-wide">Prix total</span>
              <span className="text-2xl sm:text-3xl font-light text-amber-600">{totalPrice}&euro;</span>
            </div>
            <button
              onClick={onAddToCart}
              className="w-full bg-black hover:bg-gray-900 text-white py-4 px-6 rounded-lg font-light tracking-wide text-base sm:text-lg transition-all min-h-[48px]"
            >
              {earlyCollectorMode ? tEarly("reserveThis") : "Ajouter au panier"}
            </button>
          </div>

          <div className="text-sm text-muted-foreground space-y-2 font-light">
            <p>&bull; Tirage num&eacute;rot&eacute; et sign&eacute; par l&apos;artiste</p>
            <p>&bull; Papier Fine Art 300g/m&sup2; - Garantie 100 ans</p>
            <p>&bull; Livraison s&eacute;curis&eacute;e sous 2-3 semaines</p>
            <p>&bull; Certificat d&apos;authenticit&eacute; inclus</p>
          </div>
        </div>
      </div>
    </div>
  );
}
