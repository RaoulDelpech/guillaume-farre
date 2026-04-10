"use client";

import { motion } from "framer-motion";
import type { AnalyticsData } from "./types";

interface RealTimePanelProps {
  metrics: AnalyticsData["realTimeMetrics"];
}

export default function RealTimePanel({ metrics }: RealTimePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6"
    >
      <h2 className="text-xl font-bold mb-4">⚡ Activité en temps réel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-3xl font-bold">{metrics.activeUsers}</p>
          <p className="text-blue-100">Utilisateurs actifs</p>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Pages vues maintenant</p>
          {metrics.currentViewing.map(page => (
            <div key={page.page} className="flex justify-between text-sm">
              <span>{page.page}</span>
              <span className="font-bold">{page.users}</span>
            </div>
          ))}
        </div>

        <div className="col-span-2">
          <p className="text-sm font-semibold mb-2">Événements récents</p>
          <div className="space-y-1">
            {metrics.recentEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-blue-200">{event.timestamp}</span>
                <span className="font-semibold">
                  {event.type === "view" ? "👁️" :
                   event.type === "cart" ? "🛒" :
                   event.type === "purchase" ? "💰" : "⚠️"}
                </span>
                <span>{event.details}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Lalou
