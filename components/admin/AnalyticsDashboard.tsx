"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

/**
 * Analytics Dashboard — real data from server-side counters
 * Fetches from /api/admin/analytics (requires auth cookie)
 *
 * @author Lalou
 */

interface DailyStats {
  visitors: number;
  pageViews: number;
  addToCart: number;
  purchases: number;
  revenue: number;
}

interface AnalyticsResponse {
  today: DailyStats;
  week: DailyStats;
  month: DailyStats;
  topArtworks: Array<{ slug: string; views: number }>;
  funnel: {
    home: number;
    galerie: number;
    boutique: number;
    checkout: number;
    purchase: number;
  };
}

const GA4_URL = "https://analytics.google.com/analytics/web/";
const CLARITY_URL = "https://clarity.microsoft.com/projects/view/";

function StatCard({
  icon: Icon,
  label,
  today,
  week,
  month,
  isCurrency,
}: {
  icon: typeof Eye;
  label: string;
  today: number;
  week: number;
  month: number;
  isCurrency?: boolean;
}) {
  const fmt = (v: number) =>
    isCurrency ? `${v.toLocaleString("fr-FR")} EUR` : v.toLocaleString("fr-FR");

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-zinc-500" />
        <span className="text-xs font-medium tracking-wide uppercase text-zinc-500">
          {label}
        </span>
      </div>
      <p className="text-2xl font-light text-zinc-900 mb-3">{fmt(today)}</p>
      <div className="flex gap-4 text-xs text-zinc-400">
        <span>7j : {fmt(week)}</span>
        <span>30j : {fmt(month)}</span>
      </div>
    </div>
  );
}

function FunnelBar({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-500 w-20 text-right">{label}</span>
      <div className="flex-1 bg-zinc-100 rounded-full h-5 overflow-hidden">
        <div
          className="bg-zinc-800 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <span className="text-xs text-zinc-600 w-16 tabular-nums">
        {value} ({pct}%)
      </span>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <BarChart3 className="w-6 h-6 mx-auto mb-2 animate-pulse" />
        <p className="text-sm">Chargement des statistiques...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p className="text-sm">
          {error
            ? `Erreur : ${error}`
            : "Aucune donnée disponible"}
        </p>
      </div>
    );
  }

  const funnelMax = Math.max(
    data.funnel.home,
    data.funnel.galerie,
    data.funnel.boutique,
    data.funnel.checkout,
    data.funnel.purchase,
    1
  );

  return (
    <div className="space-y-8">
      {/* Compteurs principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Eye}
          label="Visiteurs"
          today={data.today.visitors}
          week={data.week.visitors}
          month={data.month.visitors}
        />
        <StatCard
          icon={BarChart3}
          label="Pages vues"
          today={data.today.pageViews}
          week={data.week.pageViews}
          month={data.month.pageViews}
        />
        <StatCard
          icon={ShoppingCart}
          label="Ajouts panier"
          today={data.today.addToCart}
          week={data.week.addToCart}
          month={data.month.addToCart}
        />
        <StatCard
          icon={CreditCard}
          label="Achats"
          today={data.today.purchases}
          week={data.week.purchases}
          month={data.month.purchases}
        />
      </div>

      {/* Revenu */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-medium tracking-wide uppercase text-zinc-500">
            Revenu
          </span>
        </div>
        <p className="text-3xl font-light text-zinc-900">
          {data.today.revenue.toLocaleString("fr-FR")} EUR
          <span className="text-sm text-zinc-400 ml-2">aujourd&apos;hui</span>
        </p>
        <div className="flex gap-6 mt-2 text-sm text-zinc-400">
          <span>7j : {data.week.revenue.toLocaleString("fr-FR")} EUR</span>
          <span>30j : {data.month.revenue.toLocaleString("fr-FR")} EUR</span>
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <h3 className="text-xs font-medium tracking-wide uppercase text-zinc-500 mb-4">
          Entonnoir de conversion
        </h3>
        <div className="space-y-2.5">
          <FunnelBar label="Accueil" value={data.funnel.home} maxValue={funnelMax} />
          <FunnelBar label="Galerie" value={data.funnel.galerie} maxValue={funnelMax} />
          <FunnelBar label="Boutique" value={data.funnel.boutique} maxValue={funnelMax} />
          <FunnelBar label="Checkout" value={data.funnel.checkout} maxValue={funnelMax} />
          <FunnelBar label="Achat" value={data.funnel.purchase} maxValue={funnelMax} />
        </div>
      </div>

      {/* Top oeuvres */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <h3 className="text-xs font-medium tracking-wide uppercase text-zinc-500 mb-4">
          Top 5 oeuvres consultées
        </h3>
        {data.topArtworks.length > 0 ? (
          <div className="space-y-2">
            {data.topArtworks.map((art, i) => (
              <div
                key={art.slug}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-700">
                  <span className="text-zinc-400 mr-2">{i + 1}.</span>
                  {art.slug}
                </span>
                <span className="text-zinc-500 tabular-nums">
                  {art.views} vues
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400">Pas encore de données</p>
        )}
      </div>

      {/* Liens externes */}
      <div className="flex flex-wrap gap-3">
        <a
          href={GA4_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide uppercase bg-zinc-100 text-zinc-600 rounded hover:bg-zinc-200 transition-colors"
        >
          Google Analytics
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href={CLARITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide uppercase bg-zinc-100 text-zinc-600 rounded hover:bg-zinc-200 transition-colors"
        >
          Microsoft Clarity
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
