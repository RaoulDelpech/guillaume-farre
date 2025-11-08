"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface DashboardMetrics {
  totalPhotos: number;
  photosPublished: number;
  photosDraft: number;
  photosTrash: number;
  totalSales: number;
  salesThisMonth: number;
  revenueMonth: number;
  revenueTotal: number;
  limitedEditions: {
    total: number;
    sold: number;
    available: number;
    almostSoldOut: number;
  };
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: "upload" | "sale" | "edit" | "publish";
    title: string;
    timestamp: string;
    icon: string;
  }>;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month" | "year">("month");
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, [selectedPeriod]);

  const loadMetrics = async () => {
    try {
      // Simuler le chargement des métriques
      setTimeout(() => {
        setMetrics({
          totalPhotos: 247,
          photosPublished: 186,
          photosDraft: 42,
          photosTrash: 19,
          totalSales: 89,
          salesThisMonth: 12,
          revenueMonth: 8400,
          revenueTotal: 67300,
          limitedEditions: {
            total: 35,
            sold: 127,
            available: 118,
            almostSoldOut: 8
          },
          topCategories: [
            { name: "Empreintes", count: 87, percentage: 35 },
            { name: "Atelier", count: 72, percentage: 29 },
            { name: "Projection", count: 58, percentage: 24 },
            { name: "Concept Car", count: 30, percentage: 12 }
          ],
          recentActivity: [
            { id: "1", type: "sale", title: "Édition limitée 'Ferrari Noire #23' vendue", timestamp: "Il y a 2h", icon: "💰" },
            { id: "2", type: "upload", title: "15 nouvelles photos uploadées", timestamp: "Il y a 5h", icon: "📸" },
            { id: "3", type: "publish", title: "Série 'Atelier 2024' publiée", timestamp: "Il y a 1j", icon: "🚀" },
            { id: "4", type: "edit", title: "Prix mis à jour pour 8 photos", timestamp: "Il y a 2j", icon: "✏️" }
          ]
        });
        setLoading(false);

        // Célébrer si nouvelle vente
        if (Math.random() > 0.8) {
          celebrateSale();
        }
      }, 1000);
    } catch (error) {
      console.error("Erreur chargement métriques:", error);
      setLoading(false);
    }
  };

  const celebrateSale = () => {
    setShowCelebration(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setShowCelebration(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header avec message de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl p-6"
      >
        <h1 className="text-3xl font-bold mb-2">Bonjour Guillaume ! 👋</h1>
        <p className="text-gray-200">
          Votre art touche {metrics.totalSales} collectionneurs à travers le monde.
          {metrics.salesThisMonth > 0 && ` ${metrics.salesThisMonth} nouvelles ventes ce mois-ci !`}
        </p>
      </motion.div>

      {/* Sélecteur de période */}
      <div className="flex justify-end">
        <div className="bg-white rounded-lg shadow-sm border p-1 flex gap-1">
          {(["day", "week", "month", "year"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-md transition-all ${
                selectedPeriod === period
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {period === "day" ? "Jour" : period === "week" ? "Semaine" : period === "month" ? "Mois" : "Année"}
            </button>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Photos actives"
          value={metrics.photosPublished}
          total={metrics.totalPhotos}
          icon="📸"
          color="blue"
          trend="+12%"
        />
        <MetricCard
          title="Ventes totales"
          value={metrics.totalSales}
          icon="🛒"
          color="green"
          trend={`+${metrics.salesThisMonth} ce mois`}
        />
        <MetricCard
          title="Revenus du mois"
          value={`${metrics.revenueMonth.toLocaleString()}€`}
          icon="💶"
          color="purple"
          trend="+23%"
        />
        <MetricCard
          title="Éditions limitées"
          value={`${metrics.limitedEditions.available}/245`}
          icon="🎨"
          color="orange"
          alert={metrics.limitedEditions.almostSoldOut > 0 ? `${metrics.limitedEditions.almostSoldOut} bientôt épuisées` : undefined}
        />
      </div>

      {/* Graphiques et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par catégorie */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">📊 Répartition par catégorie</h3>
          <div className="space-y-4">
            {metrics.topCategories.map((category, index) => (
              <div key={category.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-gray-500">{category.count} photos</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      index === 0 ? "bg-blue-500" :
                      index === 1 ? "bg-green-500" :
                      index === 2 ? "bg-purple-500" : "bg-orange-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold mb-4">⚡ Activité récente</h3>
          <div className="space-y-3">
            {metrics.recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
                {activity.type === "sale" && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    Nouvelle vente!
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">🚀 Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction icon="📸" label="Uploader photos" onClick={() => {}} color="blue" />
          <QuickAction icon="✏️" label="Éditer prix" onClick={() => {}} color="green" />
          <QuickAction icon="📱" label="Post Instagram" onClick={() => {}} color="purple" />
          <QuickAction icon="📊" label="Export données" onClick={() => {}} color="orange" />
        </div>
      </motion.div>

      {/* Notification de célébration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold">Nouvelle vente!</p>
                <p className="text-sm">Félicitations pour cette nouvelle vente!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Composant pour les cartes de métriques
function MetricCard({ title, value, total, icon, color, trend, alert }: any) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl">{icon}</span>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">
        {value}
        {total && <span className="text-gray-400 text-base font-normal">/{total}</span>}
      </p>
      {alert && (
        <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
          <span>⚠️</span> {alert}
        </p>
      )}
    </motion.div>
  );
}

// Composant pour les actions rapides
function QuickAction({ icon, label, onClick, color }: any) {
  const colorClasses = {
    blue: "hover:bg-blue-50 hover:border-blue-300",
    green: "hover:bg-green-50 hover:border-green-300",
    purple: "hover:bg-purple-50 hover:border-purple-300",
    orange: "hover:bg-orange-50 hover:border-orange-300"
  };

  return (
    <button
      onClick={onClick}
      className={`bg-white border-2 rounded-xl p-4 text-center transition-all ${colorClasses[color as keyof typeof colorClasses]} hover:shadow-md`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </button>
  );
}

// Lalou