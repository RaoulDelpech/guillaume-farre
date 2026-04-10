import type { AnalyticsData, TimeRange } from "./types";

export function generateTimeSeriesData(range: TimeRange) {
  const points = range === "day" ? 24 : range === "week" ? 7 : range === "month" ? 30 : 12;
  return Array.from({ length: points }, (_, i) => ({
    date: `Point ${i + 1}`,
    views: Math.floor(Math.random() * 500) + 200
  }));
}

export function generateHeatmapData() {
  const data = [];
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      data.push({ x, y, intensity: Math.random() });
    }
  }
  return data;
}

export function generateRandomEvent() {
  const events = [
    "Ferrari Noir #23 vue",
    "Empreinte Rouge ajoutée au panier",
    "Atelier 2024 achetée (500€)",
    "Panier abandonné (850€)",
    "Nouvelle visite depuis Instagram"
  ];
  return events[Math.floor(Math.random() * events.length)];
}

export function buildMockAnalytics(timeRange: TimeRange): AnalyticsData {
  return {
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
      averageSessionDuration: 245,
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
  };
}

// Lalou
