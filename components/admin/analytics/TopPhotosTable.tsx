"use client";

import type { AnalyticsData } from "./types";

interface TopPhotosTableProps {
  topPhotos: AnalyticsData["photoClicks"]["topPhotos"];
}

export default function TopPhotosTable({ topPhotos }: TopPhotosTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">🖼️ Photos les plus populaires</h3>
      <div className="space-y-3">
        {topPhotos.map((photo, i) => (
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
  );
}

// Lalou
