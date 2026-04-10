import Image from "next/image";
import { PhotoMetadata } from "@/lib/admin/photo-manager";
import { useWishlist } from "@/hooks/useWishlist";
import { useConfetti } from "@/hooks/useConfetti";
import StockBadge from "@/components/StockBadge";
import DeliveryEstimate from "@/components/DeliveryEstimate";
import SocialProof from "@/components/SocialProof";

interface ShopPhotoCardProps {
  photo: PhotoMetadata;
  index: number;
  earlyCollectorMode: boolean;
  tShop: (key: string) => string;
  tEarly: (key: string) => string;
  onSelect: (photo: PhotoMetadata) => void;
}

export default function ShopPhotoCard({
  photo,
  index,
  earlyCollectorMode,
  tShop,
  tEarly,
  onSelect,
}: ShopPhotoCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { fireHeartConfetti } = useConfetti();

  const inWishlist = isInWishlist(photo.path);

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg">
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            const wasNotInWishlist = !inWishlist;
            toggleWishlist({
              photoPath: photo.path,
              title: photo.title || photo.filename,
              price: photo.price,
              thumbnailUrl: photo.path,
            });
            if (wasNotInWishlist) fireHeartConfetti();
          }}
          className="absolute top-3 left-3 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white w-11 h-11 rounded-full transition-all hover:scale-110 z-10 flex items-center justify-center"
          title={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <span className="text-lg">{inWishlist ? "\u2665" : "\u2661"}</span>
        </button>

        {photo.earlyAccess && earlyCollectorMode && (
          <div className="absolute top-14 left-3 sm:top-3 sm:left-14 bg-black text-white px-3 py-1 rounded-full text-xs font-medium tracking-wide z-10">
            {tEarly("preview")}
          </div>
        )}

        {(photo.categories?.includes("limited") || photo.edition?.type === "limited") && (
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

        {photo.year && <p className="text-sm text-muted-foreground font-light mb-4">{photo.year}</p>}

        <p className="text-2xl font-light text-amber-600 mb-4">{photo.price || 2000}&euro;</p>

        {(photo.price || 2000) >= 100 && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-4">
            <span>&#x1F4B3;</span>
            <span className="font-medium">Paiement 3x/4x sans frais</span>
          </div>
        )}

        <div className="mb-4">
          <DeliveryEstimate variant="compact" />
        </div>

        <div className="mb-6">
          <SocialProof
            photoPath={photo.path}
            stockAvailable={photo.limitedEdition?.available}
            stockTotal={photo.limitedEdition?.total}
            variant="compact"
          />
        </div>

        {photo.earlyAccess && !earlyCollectorMode ? (
          <button
            disabled
            className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-light tracking-wide cursor-not-allowed min-h-[44px]"
          >
            {tEarly("comingSoon")}
          </button>
        ) : (
          <button
            onClick={() => onSelect(photo)}
            className="w-full bg-black hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-light tracking-wide transition-colors min-h-[44px]"
          >
            {earlyCollectorMode ? tEarly("reserve") : tShop("addToCart")}
          </button>
        )}
      </div>
    </div>
  );
}
