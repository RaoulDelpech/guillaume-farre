"use client";

import type { AnalyticsData } from "./types";

interface UserBehaviorCardsProps {
  userBehavior: AnalyticsData["userBehavior"];
}

export default function UserBehaviorCards({ userBehavior }: UserBehaviorCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Durée session */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">⏱️ Durée moyenne session</h4>
        <p className="text-3xl font-bold">
          {Math.floor(userBehavior.averageSessionDuration / 60)}:{String(userBehavior.averageSessionDuration % 60).padStart(2, '0')}
        </p>
        <p className="text-sm text-gray-500 mt-1">minutes</p>
      </div>

      {/* Bounce rate */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">📉 Taux de rebond</h4>
        <p className="text-3xl font-bold text-orange-600">{userBehavior.bounceRate}%</p>
        <p className="text-sm text-gray-500 mt-1">des visiteurs</p>
      </div>

      {/* Pages par session */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">📄 Pages/session</h4>
        <p className="text-3xl font-bold">{userBehavior.pagesPerSession}</p>
        <p className="text-sm text-gray-500 mt-1">en moyenne</p>
      </div>

      {/* Appareils */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">📱 Types d'appareils</h4>
        <div className="space-y-2">
          {userBehavior.deviceTypes.map(device => (
            <div key={device.type} className="flex justify-between">
              <span className="text-sm">{device.type}</span>
              <span className="font-bold">{device.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Lalou
