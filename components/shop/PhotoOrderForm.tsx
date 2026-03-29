"use client";
import { useState, useEffect } from 'react';
import { WHITEWALL_FORMATS, WHITEWALL_MATERIALS } from '@/lib/printing/formats';
import { isEarlyAccess } from '@/lib/early-access';
import { useTranslations } from 'next-intl';

interface PhotoOrderFormProps {
  photoPath: string;
  photoTitle: string;
  isLimitedEdition?: boolean; // Si true, format A4 interdit
  onAddToCart: (order: OrderConfig) => void;
}

export interface OrderConfig {
  photoPath: string;
  photoTitle: string;
  format: keyof typeof WHITEWALL_FORMATS;
  material: keyof typeof WHITEWALL_MATERIALS;
  frame: 'black-wood' | 'white-wood' | 'aluminum' | 'none';
  quantity: number;
  totalPrice: number;
}

export default function PhotoOrderForm({ photoPath, photoTitle, isLimitedEdition = false, onAddToCart }: PhotoOrderFormProps) {
  const tEarly = useTranslations("earlyAccess");
  const [format, setFormat] = useState<keyof typeof WHITEWALL_FORMATS>('A3');
  const [material, setMaterial] = useState<keyof typeof WHITEWALL_MATERIALS>('fine-art');
  const [frame, setFrame] = useState<'black-wood' | 'white-wood' | 'aluminum' | 'none'>('none');
  const [quantity, setQuantity] = useState(1);
  const [earlyCollectorMode, setEarlyCollectorMode] = useState(false);

  // Vérifier si en mode early collector
  useEffect(() => {
    setEarlyCollectorMode(isEarlyAccess());
  }, []);

  // Helper pour déterminer si un format est grand ou petit
  const isGrandFormat = (format: string) => ['A1', 'A0', '2A0'].includes(format);
  const isPetitFormat = (format: string) => ['A2', 'A3', 'A4'].includes(format);

  // Filtrer les formats selon le type d'édition
  const getAvailableFormats = () => {
    const allFormats = Object.entries(WHITEWALL_FORMATS);

    if (isLimitedEdition) {
      // Édition limitée: A3, A2, A1 UNIQUEMENT (PAS de A4)
      return allFormats.filter(([key]) => key === 'A3' || key === 'A2' || key === 'A1');
    } else {
      // Tirage illimité: A4, A3, A2 UNIQUEMENT (PAS de A1)
      return allFormats.filter(([key]) => key === 'A4' || key === 'A3' || key === 'A2');
    }
  };

  const availableFormats = getAvailableFormats();

  // Affichage stock selon format sélectionné (fictif pour l'instant, sera connecté plus tard)
  const getStockForFormat = () => {
    if (isGrandFormat(format)) {
      // Grands formats: 9 exemplaires
      return { available: 9, total: 9 };
    }
    // Petits formats: 99 exemplaires
    return { available: 99, total: 99 };
  };

  const stock = getStockForFormat();

  // Calcul du prix en temps réel
  const calculatePrice = () => {
    const formatData = WHITEWALL_FORMATS[format];
    let price = formatData.price;

    // Multiplier par matériau
    const materialMultipliers = {
      'fine-art': 1.0,
      'alu-dibond': 1.3,
      'acrylic': 1.5,
      'canvas': 1.2,
    };
    price *= materialMultipliers[material];

    // Ajouter cadre
    const framePrices = {
      'black-wood': 80,
      'white-wood': 80,
      'aluminum': 120,
      'none': 0,
    };
    price += framePrices[frame];

    return Math.round(price * quantity);
  };

  const handleAddToCart = () => {
    onAddToCart({
      photoPath,
      photoTitle,
      format,
      material,
      frame,
      quantity,
      totalPrice: calculatePrice(),
    });
  };

  return (
    <div className="bg-card border rounded-lg p-4 sm:p-6 space-y-6">
      <h3 className="text-xl font-bold">Configurez votre tirage</h3>

      {/* Sélection du format */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Format
          {isLimitedEdition && (
            <span className="ml-2 text-xs px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
              Édition limitée
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableFormats.map(([key, data]) => {
            const formatStock = isGrandFormat(key)
              ? { available: 9, total: 9 }
              : { available: 99, total: 99 };
            const remaining = formatStock.total - formatStock.available + 1;

            return (
              <button
                key={key}
                onClick={() => setFormat(key as any)}
                className={`p-3 border rounded-md text-sm transition-all min-h-[44px] ${
                  format === key
                    ? 'border-primary bg-primary/10 font-bold'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">{data.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{data.price}€</div>
                {isLimitedEdition && (
                  <div className="text-xs text-amber-600 mt-1">
                    {isGrandFormat(key) ? `${remaining}/9 restants` : `${remaining}/99 restants`}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {isLimitedEdition && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <span>ℹ️</span>
            <span>Format A4 non disponible pour les éditions limitées</span>
          </p>
        )}
        {!isLimitedEdition && (
          <p className="text-xs text-muted-foreground mt-2">
            Tirage illimité - Formats A4, A3, A2 disponibles
          </p>
        )}
      </div>

      {/* Sélection du matériau */}
      <div>
        <label className="block text-sm font-medium mb-2">Support d'impression</label>
        <div className="space-y-2">
          {Object.entries(WHITEWALL_MATERIALS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setMaterial(key as any)}
              className={`w-full p-3 border rounded-md text-left transition-all min-h-[44px] ${
                material === key
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {data.label}
                    {data.recommended && ' ⭐ Recommandé'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{data.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sélection du cadre */}
      <div>
        <label className="block text-sm font-medium mb-2">Encadrement (optionnel)</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setFrame('none')}
            className={`p-3 border rounded-md text-sm min-h-[44px] ${
              frame === 'none'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border hover:border-primary/50'
            }`}
          >
            Sans cadre
          </button>
          <button
            onClick={() => setFrame('black-wood')}
            className={`p-3 border rounded-md text-sm min-h-[44px] ${
              frame === 'black-wood'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border hover:border-primary/50'
            }`}
          >
            Bois noir (+80€)
          </button>
          <button
            onClick={() => setFrame('white-wood')}
            className={`p-3 border rounded-md text-sm min-h-[44px] ${
              frame === 'white-wood'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border hover:border-primary/50'
            }`}
          >
            Bois blanc (+80€)
          </button>
          <button
            onClick={() => setFrame('aluminum')}
            className={`p-3 border rounded-md text-sm min-h-[44px] ${
              frame === 'aluminum'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border hover:border-primary/50'
            }`}
          >
            Aluminium (+120€)
          </button>
        </div>
      </div>

      {/* Quantité */}
      <div>
        <label className="block text-sm font-medium mb-2">Quantité</label>
        <input
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full p-2 border rounded-md bg-background min-h-[44px]"
        />
      </div>

      {/* Prix total */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Prix total</span>
          <span className="text-2xl font-bold text-primary">{calculatePrice()}€</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-colors min-h-[48px]"
        >
          🛒 {earlyCollectorMode ? tEarly("reserveThis") : "Ajouter au panier"}
        </button>
      </div>

      {/* Informations */}
      <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
        <p>✅ Impression professionnelle WhiteWall</p>
        <p>📦 Livraison internationale sécurisée</p>
        <p>✍️ Certificat d'authenticité signé par l'artiste</p>
        <p>🎨 Garantie qualité musée - Conservation 100+ ans</p>
        <p>⏱️ Production 3-5 jours + Livraison 2-7 jours</p>
      </div>
    </div>
  );
}
