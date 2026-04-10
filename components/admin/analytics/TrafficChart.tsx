"use client";

import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import type { AnalyticsData } from "./types";

interface TrafficChartProps {
  pageViews: AnalyticsData["pageViews"];
}

export default function TrafficChart({ pageViews }: TrafficChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">📈 Évolution du trafic</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={pageViews.data}>
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
          <p className="text-2xl font-bold">{pageViews.total.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Vues totales</p>
        </div>
        <div className={`text-right ${pageViews.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <p className="text-xl font-bold">
            {pageViews.trend > 0 ? "↑" : "↓"} {Math.abs(pageViews.trend)}%
          </p>
          <p className="text-sm">vs période précédente</p>
        </div>
      </div>
    </div>
  );
}

// Lalou
