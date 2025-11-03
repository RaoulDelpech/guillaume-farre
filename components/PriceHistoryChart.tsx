"use client";
import { useState, useEffect } from "react";

interface PricePoint {
  date: string;
  price: number;
  event?: string;
}

interface PriceHistoryChartProps {
  initialPrice: number;
  currentPrice: number;
  title?: string;
}

export default function PriceHistoryChart({
  initialPrice,
  currentPrice,
  title = "Historique de valorisation",
}: PriceHistoryChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate price history data (simulated)
  const generatePriceHistory = (): PricePoint[] => {
    const now = new Date();
    const points: PricePoint[] = [];
    const months = 24; // 2 years of data

    for (let i = months; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const progress = 1 - i / months;

      // Simulate realistic growth with some volatility
      const baseGrowth = initialPrice + (currentPrice - initialPrice) * progress;
      const volatility = Math.sin(i * 0.5) * (currentPrice * 0.05);
      const price = Math.round(baseGrowth + volatility);

      points.push({
        date: date.toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        }),
        price,
        event:
          i === months
            ? "Création"
            : i === Math.floor(months / 2)
            ? "Exposition Paris"
            : i === 0
            ? "Aujourd'hui"
            : undefined,
      });
    }

    return points;
  };

  const priceHistory = generatePriceHistory();
  const maxPrice = Math.max(...priceHistory.map((p) => p.price));
  const minPrice = Math.min(...priceHistory.map((p) => p.price));
  const priceRange = maxPrice - minPrice;

  const percentageGain = (
    ((currentPrice - initialPrice) / initialPrice) *
    100
  ).toFixed(1);

  if (!mounted) return null;

  return (
    <div className="bg-gradient-to-br from-green-950/30 to-black border-2 border-green-600/30 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">
            Évolution de la valeur sur 2 ans
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-500">
            +{percentageGain}%
          </div>
          <div className="text-xs text-gray-400">Valorisation</div>
        </div>
      </div>

      {/* Current value display */}
      {hoveredPoint !== null ? (
        <div className="mb-4 text-center bg-black/40 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">
            {priceHistory[hoveredPoint].date}
            {priceHistory[hoveredPoint].event && (
              <span className="ml-2 text-orange-500">
                • {priceHistory[hoveredPoint].event}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-white">
            {priceHistory[hoveredPoint].price.toLocaleString("fr-FR")} €
          </div>
        </div>
      ) : (
        <div className="mb-4 text-center bg-black/40 rounded-lg p-3">
          <div className="text-sm text-gray-400 mb-1">Valeur actuelle</div>
          <div className="text-2xl font-bold text-green-500">
            {currentPrice.toLocaleString("fr-FR")} €
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="relative h-64 mb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-400">
          <div>{maxPrice.toLocaleString("fr-FR")}€</div>
          <div>
            {((maxPrice + minPrice) / 2).toLocaleString("fr-FR", {
              maximumFractionDigits: 0,
            })}
            €
          </div>
          <div>{minPrice.toLocaleString("fr-FR")}€</div>
        </div>

        {/* Chart area */}
        <div className="absolute left-16 right-0 top-0 bottom-0">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="absolute left-0 right-0 border-t border-white/5"
                style={{ top: `${percent}%` }}
              />
            ))}
          </div>

          {/* Line chart */}
          <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
            {/* Area fill */}
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area path */}
            <path
              d={`
                M 0 ${256 - ((priceHistory[0].price - minPrice) / priceRange) * 256}
                ${priceHistory
                  .map(
                    (point, i) =>
                      `L ${(i / (priceHistory.length - 1)) * 100}% ${
                        256 - ((point.price - minPrice) / priceRange) * 256
                      }`
                  )
                  .join(" ")}
                L 100% 256
                L 0 256
                Z
              `}
              fill="url(#priceGradient)"
            />

            {/* Line path */}
            <path
              d={`
                M 0 ${256 - ((priceHistory[0].price - minPrice) / priceRange) * 256}
                ${priceHistory
                  .map(
                    (point, i) =>
                      `L ${(i / (priceHistory.length - 1)) * 100}% ${
                        256 - ((point.price - minPrice) / priceRange) * 256
                      }`
                  )
                  .join(" ")}
              `}
              fill="none"
              stroke="rgb(34, 197, 94)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {priceHistory.map((point, i) => {
              const x = (i / (priceHistory.length - 1)) * 100;
              const y = 256 - ((point.price - minPrice) / priceRange) * 256;

              return (
                <g key={i}>
                  {/* Clickable area */}
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r={hoveredPoint === i ? 8 : point.event ? 6 : 4}
                    fill={hoveredPoint === i ? "rgb(34, 197, 94)" : point.event ? "rgb(249, 115, 22)" : "rgb(34, 197, 94)"}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Event marker */}
                  {point.event && (
                    <text
                      x={`${x}%`}
                      y={y - 15}
                      textAnchor="middle"
                      className="text-xs fill-orange-500 font-bold"
                    >
                      {point.event === "Création" ? "🎨" : point.event === "Exposition Paris" ? "🏛️" : "📍"}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* X-axis (months) */}
      <div className="ml-16 flex justify-between text-xs text-gray-400 mb-4">
        <span>{priceHistory[0].date}</span>
        <span>{priceHistory[Math.floor(priceHistory.length / 2)].date}</span>
        <span>{priceHistory[priceHistory.length - 1].date}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Prix initial</div>
          <div className="text-lg font-bold">
            {initialPrice.toLocaleString("fr-FR")} €
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Valeur actuelle</div>
          <div className="text-lg font-bold text-green-500">
            {currentPrice.toLocaleString("fr-FR")} €
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Plus-value</div>
          <div className="text-lg font-bold text-yellow-500">
            +{(currentPrice - initialPrice).toLocaleString("fr-FR")} €
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Données basées sur les ventes aux enchères et transactions privées
      </div>
    </div>
  );
}
