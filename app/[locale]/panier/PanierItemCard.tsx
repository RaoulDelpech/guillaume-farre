import Image from "next/image";

interface CartItem {
  id: string;
  title: string;
  image: string;
  category: string;
  format: string;
  price: number;
}

interface PanierItemCardProps {
  item: CartItem;
  onRemove: () => void;
}

export default function PanierItemCard({ item, onRemove }: PanierItemCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-card border rounded-lg hover:border-primary/50 transition-colors">
      <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 128px"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-row sm:flex-col justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-light tracking-wide mb-1 sm:mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-1 sm:mb-3">{item.category}</p>
          <div className="text-sm text-muted-foreground">
            Format: <span className="text-foreground font-medium">{item.format}</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div className="text-xl sm:text-2xl font-light">{item.price.toLocaleString('fr-FR')} €</div>
          <button
            onClick={onRemove}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors min-h-[44px] flex items-center justify-center"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}
