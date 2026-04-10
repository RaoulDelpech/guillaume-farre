export interface AnalyticsData {
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

export type TimeRange = "day" | "week" | "month" | "year";

// Lalou
