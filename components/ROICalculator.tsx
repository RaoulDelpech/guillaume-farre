"use client";
import { useState } from "react";

export default function ROICalculator() {
  const [investment, setInvestment] = useState(10000);
  const [years, setYears] = useState(5);

  // Valorisation annuelle moyenne : 22% (basé sur les stats du site)
  const annualGrowth = 0.22;

  const calculateROI = () => {
    const futureValue = investment * Math.pow(1 + annualGrowth, years);
    const profit = futureValue - investment;
    const roi = ((profit / investment) * 100).toFixed(1);

    return {
      futureValue: Math.round(futureValue),
      profit: Math.round(profit),
      roi,
    };
  };

  const result = calculateROI();

  // Comparaisons avec d'autres investissements
  const comparisons = [
    {
      name: "Livret A (3%)",
      value: Math.round(investment * Math.pow(1.03, years)),
      color: "blue",
    },
    {
      name: "Actions (8%)",
      value: Math.round(investment * Math.pow(1.08, years)),
      color: "green",
    },
    {
      name: "Art Guillaume Farré (22%)",
      value: result.futureValue,
      color: "red",
      highlight: true,
    },
  ];

  const maxValue = Math.max(...comparisons.map((c) => c.value));

  return (
    <div className="bg-gradient-to-br from-purple-950/30 to-black border-2 border-purple-600/30 rounded-3xl p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Calculateur d'investissement
        </h2>
        <p className="text-gray-400">
          Simulez la valorisation potentielle de votre collection
        </p>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Investment amount */}
        <div>
          <label className="block text-sm font-bold mb-3">
            Investissement initial
          </label>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full h-2 bg-purple-900/30 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">1 000€</span>
            <span className="text-2xl font-bold text-purple-500">
              {investment.toLocaleString("fr-FR")}€
            </span>
            <span className="text-sm text-gray-400">100 000€</span>
          </div>
        </div>

        {/* Years */}
        <div>
          <label className="block text-sm font-bold mb-3">
            Durée de détention
          </label>
          <input
            type="range"
            min="1"
            max="15"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-purple-900/30 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">1 an</span>
            <span className="text-2xl font-bold text-purple-500">
              {years} an{years > 1 ? "s" : ""}
            </span>
            <span className="text-sm text-gray-400">15 ans</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-r from-red-950/30 to-black border-2 border-red-600/30 rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-sm text-gray-400 mb-2">Valeur future</div>
            <div className="text-3xl md:text-4xl font-bold text-green-500">
              {result.futureValue.toLocaleString("fr-FR")}€
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">Plus-value</div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-500">
              +{result.profit.toLocaleString("fr-FR")}€
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">ROI total</div>
            <div className="text-3xl md:text-4xl font-bold text-red-500">
              +{result.roi}%
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-center">
          Comparaison avec d'autres placements
        </h3>
        <div className="space-y-4">
          {comparisons.map((comp) => {
            const percentage = (comp.value / maxValue) * 100;
            return (
              <div key={comp.name}>
                <div className="flex justify-between mb-2">
                  <span className={comp.highlight ? "font-bold" : ""}>
                    {comp.name}
                  </span>
                  <span className="font-bold">
                    {comp.value.toLocaleString("fr-FR")}€
                  </span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      comp.highlight
                        ? "bg-gradient-to-r from-red-600 to-orange-600"
                        : comp.color === "blue"
                        ? "bg-blue-600"
                        : "bg-green-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-950/20 border border-yellow-600/30 rounded-xl p-4 text-sm text-gray-400 text-center">
        <p className="mb-2">
          ⚠️ <strong>Avertissement :</strong> Ces calculs sont basés sur une
          valorisation annuelle moyenne historique de 22%.
        </p>
        <p>
          Les performances passées ne garantissent pas les résultats futurs.
          L'art reste un investissement à long terme.
        </p>
      </div>
    </div>
  );
}
