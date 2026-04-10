"use client";

import { motion } from "framer-motion";
import type { AnalyticsData } from "./types";

interface SalesFunnelProps {
  salesFunnel: AnalyticsData["salesFunnel"];
}

export default function SalesFunnel({ salesFunnel }: SalesFunnelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">🎯 Funnel de conversion</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel visuel */}
        <div className="lg:col-span-2">
          <div className="space-y-2">
            {salesFunnel.steps.map((step, i) => (
              <div key={step.name} className="relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step.value / salesFunnel.steps[0].value) * 100}%` }}
                  transition={{ delay: i * 0.1 }}
                  className="h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-between px-4"
                  style={{ minWidth: "150px" }}
                >
                  <span className="text-white font-semibold">{step.name}</span>
                  <span className="text-white">{step.value}</span>
                </motion.div>
                {step.dropoffRate > 0 && (
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-2 text-sm text-red-600">
                    -{step.dropoffRate}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Paniers abandonnés */}
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-3">
            🛒 Paniers abandonnés
          </h4>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {salesFunnel.abandonedCarts.total}
          </div>
          <p className="text-sm text-red-700 mb-4">
            Valeur moyenne: {salesFunnel.abandonedCarts.averageValue}€
          </p>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-800">Raisons principales:</p>
            {salesFunnel.abandonedCarts.reasons.map(reason => (
              <div key={reason.reason} className="flex justify-between text-sm">
                <span className="text-red-700">{reason.reason}</span>
                <span className="font-bold text-red-900">{reason.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Lalou
