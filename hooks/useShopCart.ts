"use client";

import { useState, useEffect } from "react";
import { PhotoMetadata } from "@/lib/admin/photo-manager";
import { isEarlyAccess } from "@/lib/early-access";
import { trackViewItem, trackAddToCart } from "@/lib/analytics";
import { useConfetti } from "@/hooks/useConfetti";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { toast } from "sonner";
import {
  type ShopCartItem,
  type FormatKey,
  type FrameKey,
  type MaterialKey,
  FORMAT_CONFIG,
  calculatePrice,
} from "@/components/shop/shop-config";

export function useShopCart() {
  const [cart, setCart] = useState<ShopCartItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FormatKey>("A2");
  const [selectedFrame, setSelectedFrame] = useState<FrameKey>("none");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialKey>("semi-glossy");
  const [earlyCollectorMode, setEarlyCollectorMode] = useState(false);
  const { fireConfetti } = useConfetti();
  const { playCartAdd } = useSoundEffects();

  useEffect(() => {
    setEarlyCollectorMode(isEarlyAccess());
  }, []);

  // Réinitialiser le format si non disponible
  useEffect(() => {
    if (selectedPhoto) {
      const formatKeys = Object.keys(FORMAT_CONFIG) as FormatKey[];
      if (!formatKeys.includes(selectedFormat)) {
        setSelectedFormat(formatKeys[0] || "A2");
      }
    }
  }, [selectedPhoto]);

  const selectPhoto = (photo: PhotoMetadata) => {
    setSelectedPhoto(photo);
    trackViewItem({
      id: photo.filename,
      name: photo.title || photo.filename,
      price: photo.price || 2000,
      category: photo.category || "Photographie",
    });
  };

  const addToCart = () => {
    if (!selectedPhoto) return;

    const price = calculatePrice(selectedPhoto.price || 2000, selectedFormat, selectedFrame, selectedMaterial);
    const item: ShopCartItem = {
      photo: selectedPhoto,
      format: selectedFormat,
      frame: selectedFrame,
      material: selectedMaterial,
      price,
    };

    setCart((prev) => [...prev, item]);

    trackAddToCart({
      id: selectedPhoto.filename,
      name: selectedPhoto.title || selectedPhoto.filename,
      price,
      quantity: 1,
      category: selectedPhoto.category || "Photographie",
    });

    setSelectedPhoto(null);
    playCartAdd();
    fireConfetti();
    toast.success(`${selectedPhoto.title || selectedPhoto.filename} ajouté au panier`);
  };

  const checkout = async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            title: item.photo.title || item.photo.filename,
            filename: item.photo.filename,
            category: item.photo.category,
            price: item.price,
            images: [item.photo.path],
            photoPath: item.photo.path,
            format: item.format,
            material: item.material,
            orientation:
              item.photo.orientation === "auto"
                ? item.photo.aiDetectedOrientation || "vertical"
                : item.photo.orientation || "vertical",
            frame: item.frame,
          })),
          locale: "fr",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[ShopGrid] Erreur HTTP:", response.status, data);
        toast.error(data.error || "Erreur lors de la création de la session de paiement");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Pas d'URL de redirection reçue");
      }
    } catch (err) {
      console.error("[ShopGrid] Checkout error:", err);
      toast.error(`Erreur lors du paiement: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
    }
  };

  return {
    cart,
    clearCart: () => setCart([]),
    selectedPhoto,
    selectedFormat,
    selectedFrame,
    selectedMaterial,
    earlyCollectorMode,
    selectPhoto,
    closeModal: () => setSelectedPhoto(null),
    setSelectedFormat,
    setSelectedFrame,
    setSelectedMaterial,
    addToCart,
    checkout,
  };
}
