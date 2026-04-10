"use client";

import { PhotoMetadata } from "@/lib/admin/photo-manager";
import { useTranslations } from "next-intl";
import { useShopCart } from "@/hooks/useShopCart";
import ShopPhotoCard from "./ShopPhotoCard";
import ShopSelectionModal from "./ShopSelectionModal";
import ShopFloatingCart from "./ShopFloatingCart";
import type { FormatKey, FrameKey, MaterialKey } from "./shop-config";

interface ShopGridProps {
  photos: PhotoMetadata[];
}

export default function ShopGrid({ photos }: ShopGridProps) {
  const t = useTranslations("shop");
  const tEarly = useTranslations("earlyAccess");
  const {
    cart,
    clearCart,
    selectedPhoto,
    selectedFormat,
    selectedFrame,
    selectedMaterial,
    earlyCollectorMode,
    selectPhoto,
    closeModal,
    setSelectedFormat,
    setSelectedFrame,
    setSelectedMaterial,
    addToCart,
    checkout,
  } = useShopCart();

  return (
    <div>
      {cart.length > 0 && (
        <ShopFloatingCart items={cart} onCheckout={checkout} onClear={clearCart} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {photos.map((photo, index) => (
          <ShopPhotoCard
            key={photo.path}
            photo={photo}
            index={index}
            earlyCollectorMode={earlyCollectorMode}
            tShop={t}
            tEarly={tEarly}
            onSelect={selectPhoto}
          />
        ))}
      </div>

      {selectedPhoto && (
        <ShopSelectionModal
          photo={selectedPhoto}
          selectedFormat={selectedFormat}
          selectedFrame={selectedFrame}
          selectedMaterial={selectedMaterial}
          earlyCollectorMode={earlyCollectorMode}
          tEarly={tEarly}
          onFormatChange={(f: FormatKey) => setSelectedFormat(f)}
          onFrameChange={(f: FrameKey) => setSelectedFrame(f)}
          onMaterialChange={(m: MaterialKey) => setSelectedMaterial(m)}
          onAddToCart={addToCart}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
