"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, Funnel, FunnelChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface AnalyticsData {
  pageViews: {
    total: number;
    trend: number;
    data: Array<{ date: string; views: number }>;
  };
  photoClicks: {
    topPhotos: Array<{
      id: string;
      title: string;
      clicks: number;
      conversionRate: number;
      revenue: number;
    }>;
    heatmap: Array<{ x: number; y: number; intensity: number }>;
  };
  salesFunnel: {
    steps: Array<{
      name: string;
      value: number;
      dropoffRate: number;
    }>;
    abandonedCarts: {
      total: number;
      reasons: Array<{ reason: string; count: number; percentage: number }>;
      averageValue: number;
    };
  };
  userBehavior: {
    averageSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
    deviceTypes: Array<{ type: string; percentage: number }>;
    trafficSources: Array<{ source: string; visits: number; conversion: number }>;
  };
  realTimeMetrics: {
    activeUsers: number;
    currentViewing: Array<{ page: string; users: number }>;
    recentEvents: Array<{
      timestamp: string;
      type: string;
      details: string;
    }>;
  };
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("week");
  const [selectedMetric, setSelectedMetric] = useState<"traffic" | "engagement" | "conversion" | "revenue">("traffic");
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(() => {
      if (realTimeEnabled) {
        updateRealTimeMetrics();
      }
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, [timeRange, realTimeEnabled]);

  const loadAnalytics = async () => {
    // Simulation de données analytics
    setAnalytics({
      pageViews: {
        total: 12847,
        trend: 23.5,
        data: generateTimeSeriesData(timeRange)
      },
      photoClicks: {
        topPhotos: [
          { id: "1", title: "Ferrari Noir #23", clicks: 1247, conversionRate: 8.2, revenue: 4200 },
          { id: "2", title: "Empreinte Rouge", clicks: 987, conversionRate: 6.5, revenue: 3100 },
          { id: "3", title: "Atelier 2024", clicks: 823, conversionRate: 7.1, revenue: 2900 },
          { id: "4", title: "Projection #12", clicks: 756, conversionRate: 5.3, revenue: 2400 },
          { id: "5", title: "Vitesse Pure", clicks: 612, conversionRate: 9.2, revenue: 3800 }
        ],
        heatmap: generateHeatmapData()
      },
      salesFunnel: {
        steps: [
          { name: "Visiteurs", value: 10000, dropoffRate: 0 },
          { name: "Vue photo", value: 6500, dropoffRate: 35 },
          { name: "Ajout panier", value: 1200, dropoffRate: 81.5 },
          { name: "Checkout", value: 450, dropoffRate: 62.5 },
          { name: "Paiement", value: 280, dropoffRate: 37.8 },
          { name: "Confirmation", value: 265, dropoffRate: 5.4 }
        ],
        abandonedCarts: {
          total: 170,
          reasons: [
            { reason: "Frais de livraison", count: 68, percentage: 40 },
            { reason: "Prix trop élevé", count: 51, percentage: 30 },
            { reason: "Processus trop long", count: 34, percentage: 20 },
            { reason: "Problème technique", count: 17, percentage: 10 }
          ],
          averageValue: 850
        }
      },
      userBehavior: {
        averageSessionDuration: 245, // secondes
        bounceRate: 42.3,
        pagesPerSession: 4.7,
        deviceTypes: [
          { type: "Desktop", percentage: 58 },
          { type: "Mobile", percentage: 35 },
          { type: "Tablet", percentage: 7 }
        ],
        trafficSources: [
          { source: "Direct", visits: 4200, conversion: 8.2 },
          { source: "Instagram", visits: 3100, conversion: 12.5 },
          { source: "Google", visits: 2800, conversion: 6.8 },
          { source: "Facebook", visits: 1500, conversion: 5.2 },
          { source: "Newsletter", visits: 800, conversion: 18.7 }
        ]
      },
      realTimeMetrics: {
        activeUsers: 42,
        currentViewing: [
          { page: "Galerie", users: 18 },
          { page: "Boutique", users: 12 },
          { page: "Ferrari Noir #23", users: 8 },
          { page: "Accueil", users: 4 }
        ],
        recentEvents: [
          { timestamp: "Il y a 2 min", type: "view", details: "Ferrari Noir #23 vue" },
          { timestamp: "Il y a 3 min", type: "cart", details: "Empreinte Rouge ajoutée au panier" },
          { timestamp: "Il y a 5 min", type: "purchase", details: "Atelier 2024 achetée (500€)" },
          { timestamp: "Il y a 8 min", type: "abandon", details: "Panier abandonné (1200€)" }
        ]
      }
    });
    setLoading(false);
  };

  const updateRealTimeMetrics = () => {
    // Mise à jour temps réel
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

  const generateTimeSeriesData = (range: string) => {
    const points = range === "day" ? 24 : range === "week" ? 7 : range === "month" ? 30 : 12;
    return Array.from({ length: points }, (_, i) => ({
      date: `Point ${i + 1}`,
      views: Math.floor(Math.random() * 500) + 200
    }));
  };

  const generateHeatmapData = () => {
    const data = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        data.push({
          x,
          y,
          intensity: Math.random()
        });
      }
    }
    return data;
  };

  const generateRandomEvent = () => {
    const events = [
      "Ferrari Noir #23 vue",
      "Empreinte Rouge ajoutée au panier",
      "Atelier 2024 achetée (500€)",
      "Panier abandonné (850€)",
      "Nouvelle visite depuis Instagram"
    ];
    return events[Math.floor(Math.random() * events.length)];
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

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

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
            {/* Sélecteur de période */}
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

            {/* Toggle temps réel */}
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

      {/* Métriques en temps réel */}
      {realTimeEnabled && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">⚡ Activité en temps réel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold">{analytics.realTimeMetrics.activeUsers}</p>
              <p className="text-blue-100">Utilisateurs actifs</p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Pages vues maintenant</p>
              {analytics.realTimeMetrics.currentViewing.map(page => (
                <div key={page.page} className="flex justify-between text-sm">
                  <span>{page.page}</span>
                  <span className="font-bold">{page.users}</span>
                </div>
              ))}
            </div>

            <div className="col-span-2">
              <p className="text-sm font-semibold mb-2">Événements récents</p>
              <div className="space-y-1">
                {analytics.realTimeMetrics.recentEvents.map((event, i) => (
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de trafic */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">📈 Évolution du trafic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.pageViews.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{analytics.pageViews.total.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Vues totales</p>
            </div>
            <div className={`text-right ${analytics.pageViews.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <p className="text-xl font-bold">
                {analytics.pageViews.trend > 0 ? "↑" : "↓"} {Math.abs(analytics.pageViews.trend)}%
              </p>
              <p className="text-sm">vs période précédente</p>
            </div>
          </div>
        </div>

        {/* Top photos cliquées */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">🖼️ Photos les plus populaires</h3>
          <div className="space-y-3">
            {analytics.photoClicks.topPhotos.map((photo, i) => (
              <div key={photo.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    i === 0 ? 'bg-yellow-500' :
                    i === 1 ? 'bg-gray-400' :
                    i === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium">{photo.title}</p>
                    <p className="text-sm text-gray-600">{photo.clicks} clics</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{photo.revenue}€</p>
                  <p className="text-xs text-gray-500">Conv: {photo.conversionRate}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel de conversion */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">🎯 Funnel de conversion</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funnel visuel */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              {analytics.salesFunnel.steps.map((step, i) => (
                <div key={step.name} className="relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(step.value / analytics.salesFunnel.steps[0].value) * 100}%` }}
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
              {analytics.salesFunnel.abandonedCarts.total}
            </div>
            <p className="text-sm text-red-700 mb-4">
              Valeur moyenne: {analytics.salesFunnel.abandonedCarts.averageValue}€
            </p>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-800">Raisons principales:</p>
              {analytics.salesFunnel.abandonedCarts.reasons.map(reason => (
                <div key={reason.reason} className="flex justify-between text-sm">
                  <span className="text-red-700">{reason.reason}</span>
                  <span className="font-bold text-red-900">{reason.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comportement utilisateur */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Durée session */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">⏱️ Durée moyenne session</h4>
          <p className="text-3xl font-bold">
            {Math.floor(analytics.userBehavior.averageSessionDuration / 60)}:{String(analytics.userBehavior.averageSessionDuration % 60).padStart(2, '0')}
          </p>
          <p className="text-sm text-gray-500 mt-1">minutes</p>
        </div>

        {/* Bounce rate */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">📉 Taux de rebond</h4>
          <p className="text-3xl font-bold text-orange-600">{analytics.userBehavior.bounceRate}%</p>
          <p className="text-sm text-gray-500 mt-1">des visiteurs</p>
        </div>

        {/* Pages par session */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">📄 Pages/session</h4>
          <p className="text-3xl font-bold">{analytics.userBehavior.pagesPerSession}</p>
          <p className="text-sm text-gray-500 mt-1">en moyenne</p>
        </div>

        {/* Appareils */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-2">📱 Types d'appareils</h4>
          <div className="space-y-2">
            {analytics.userBehavior.deviceTypes.map(device => (
              <div key={device.type} className="flex justify-between">
                <span className="text-sm">{device.type}</span>
                <span className="font-bold">{device.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sources de trafic */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">🌐 Sources de trafic & conversion</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Source</th>
                <th className="text-right py-2">Visites</th>
                <th className="text-right py-2">Conversion</th>
                <th className="text-right py-2">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.userBehavior.trafficSources.map(source => (
                <tr key={source.source} className="border-b hover:bg-gray-50">
                  <td className="py-3">{source.source}</td>
                  <td className="text-right">{source.visits.toLocaleString()}</td>
                  <td className="text-right">
                    <span className={`font-semibold ${
                      source.conversion > 10 ? 'text-green-600' :
                      source.conversion > 5 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {source.conversion}%
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.round(source.conversion / 4)
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommandations IA */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🤖 Recommandations basées sur l'analyse
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-purple-900 mb-2">🎯 Optimisation conversion</p>
            <p className="text-sm text-gray-700">
              Le taux d'abandon au checkout est élevé (62.5%).
              Considérez simplifier le processus et afficher les frais plus tôt.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">📱 Mobile experience</p>
            <p className="text-sm text-gray-700">
              35% de trafic mobile mais conversion plus faible.
              Optimisez l'expérience mobile pour augmenter les ventes.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-green-900 mb-2">📧 Newsletter performante</p>
            <p className="text-sm text-gray-700">
              Taux de conversion de 18.7% depuis newsletter.
              Augmentez la fréquence d'envoi et segmentez votre audience.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="font-semibold text-orange-900 mb-2">🖼️ Photos populaires</p>
            <p className="text-sm text-gray-700">
              Ferrari Noir #23 génère 30% plus de revenus.
              Créez plus de contenu similaire et mettez-le en avant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lalou