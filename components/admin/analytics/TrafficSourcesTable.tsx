"use client";

import type { AnalyticsData } from "./types";

interface TrafficSourcesTableProps {
  trafficSources: AnalyticsData["userBehavior"]["trafficSources"];
}

export default function TrafficSourcesTable({ trafficSources }: TrafficSourcesTableProps) {
  return (
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
            {trafficSources.map(source => (
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
  );
}

// Lalou
