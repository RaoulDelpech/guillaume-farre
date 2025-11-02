"use client";
import { useState } from 'react';
import { WHITEWALL_FORMATS, WHITEWALL_MATERIALS } from '@/lib/printing/whitewall-api';

interface PhotoOrderFormProps {
  photoPath: string;
  photoTitle: string;
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

export default function PhotoOrderForm({ photoPath, photoTitle, onAddToCart }: PhotoOrderFormProps) {
  const [format, setFormat] = useState<keyof typeof WHITEWALL_FORMATS>('A3');
  const [material, setMaterial] = useState<keyof typeof WHITEWALL_MATERIALS>('fine-art');
  const [frame, setFrame] = useState<'black-wood' | 'white-wood' | 'aluminum' | 'none'>('none');
  const [quantity, setQuantity] = useState(1);

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
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-bold">Configurez votre tirage</h3>

      {/* Sélection du format */}
      <div>
        <label className="block text-sm font-medium mb-2">Format</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(WHITEWALL_FORMATS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setFormat(key as any)}
              className={`p-3 border rounded-md text-sm transition-all ${
                format === key
                  ? 'border-primary bg-primary/10 font-bold'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="font-medium">{data.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{data.price}€</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {format.includes('MEGA') && '🎨 Format XXXXXXXL - Impression monumentale !'}
          {format.includes('XXL') && '🖼️ Format XXL - Grand format premium'}
        </p>
      </div>

      {/* Sélection du matériau */}
      <div>
        <label className="block text-sm font-medium mb-2">Support d'impression</label>
        <div className="space-y-2">
          {Object.entries(WHITEWALL_MATERIALS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setMaterial(key as any)}
              className={`w-full p-3 border rounded-md text-left transition-all ${
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
            className={`p-3 border rounded-md text-sm ${
              frame === 'none'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border hover:border-primary/50'
            }`}
          >
            Sans cadre
          </button>
          <button
            onClick={() => setFrame('black-wood')}
            className={`p-3 border rounded-md text-sm ${
              frame === 'black-wood'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border hover:border-primary/50'
            }`}
          >
            Bois noir (+80€)
          </button>
          <button
            onClick={() => setFrame('white-wood')}
            className={`p-3 border rounded-md text-sm ${
              frame === 'white-wood'
                ? 'border-primary bg-primary/10 font-bold'
                : 'border-border hover:border-primary/50'
            }`}
          >
            Bois blanc (+80€)
          </button>
          <button
            onClick={() => setFrame('aluminum')}
            className={`p-3 border rounded-md text-sm ${
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
          className="w-full p-2 border rounded-md bg-background"
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
          className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-colors"
        >
          🛒 Ajouter au panier
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
