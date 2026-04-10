"use client";

import { useState, useEffect } from "react";
import type { AnalyticsData, TimeRange } from "./analytics/types";
import { buildMockAnalytics, generateRandomEvent } from "./analytics/mock-data";
import RealTimePanel from "./analytics/RealTimePanel";
import TrafficChart from "./analytics/TrafficChart";
import TopPhotosTable from "./analytics/TopPhotosTable";
import SalesFunnel from "./analytics/SalesFunnel";
import UserBehaviorCards from "./analytics/UserBehaviorCards";
import TrafficSourcesTable from "./analytics/TrafficSourcesTable";
import AIRecommendations from "./analytics/AIRecommendations";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAnalytics(buildMockAnalytics(timeRange));
    setLoading(false);

    const interval = setInterval(() => {
      if (realTimeEnabled) {
        updateRealTimeMetrics();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange, realTimeEnabled]);

  const updateRealTimeMetrics = () => {
    setAnalytics(prev => {
      if (!prev) return null;
      return {
        ...prev,
        realTimeMetrics: {
          ...prev.realTimeMetrics,
          activeUsers: Math.floor(Math.random() * 20) + 30,
          recentEvents: [
            {
              timestamp: "À l'instant",
              type: ["view", "cart", "purchase", "abandon"][Math.floor(Math.random() * 4)],
              details: generateRandomEvent()
            },
            ...prev.realTimeMetrics.recentEvents.slice(0, 3)
          ]
        }
      };
    });
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec sélecteurs */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              📊 Analytics & Comportement
              {realTimeEnabled && (
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full animate-pulse">
                  ● Temps réel
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Comprenez vos visiteurs et optimisez vos ventes
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(["day", "week", "month", "year"] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    timeRange === range
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {range === "day" ? "24h" :
                   range === "week" ? "7j" :
                   range === "month" ? "30j" : "1 an"}
                </button>
              ))}
            </div>

            <button
              onClick={() => setRealTimeEnabled(!realTimeEnabled)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                realTimeEnabled
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {realTimeEnabled ? "⚡ Temps réel ON" : "⏸️ Temps réel OFF"}
            </button>
          </div>
        </div>
      </div>

      {realTimeEnabled && <RealTimePanel metrics={analytics.realTimeMetrics} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficChart pageViews={analytics.pageViews} />
        <TopPhotosTable topPhotos={analytics.photoClicks.topPhotos} />
      </div>

      <SalesFunnel salesFunnel={analytics.salesFunnel} />
      <UserBehaviorCards userBehavior={analytics.userBehavior} />
      <TrafficSourcesTable trafficSources={analytics.userBehavior.trafficSources} />
      <AIRecommendations />
    </div>
  );
}

// Lalou
