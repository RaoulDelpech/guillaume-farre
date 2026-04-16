import { promises as fs } from 'fs';
import path from 'path';

/**
 * Server-side analytics storage — lightweight JSON-based counters
 * Tracks page views, cart actions, purchases, and top artworks
 *
 * @author Lalou
 */

const DATA_PATH = path.join(process.cwd(), 'data', 'analytics.json');

interface DailyStats {
  visitors: number;
  pageViews: number;
  addToCart: number;
  purchases: number;
  revenue: number;
}

interface AnalyticsData {
  daily: Record<string, DailyStats>;
  topArtworks: Record<string, number>;
  funnel: {
    home: number;
    galerie: number;
    boutique: number;
    checkout: number;
    purchase: number;
  };
}

function getEmptyDayStats(): DailyStats {
  return { visitors: 0, pageViews: 0, addToCart: 0, purchases: 0, revenue: 0 };
}

function getEmptyData(): AnalyticsData {
  return {
    daily: {},
    topArtworks: {},
    funnel: { home: 0, galerie: 0, boutique: 0, checkout: 0, purchase: 0 },
  };
}

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

async function readData(): Promise<AnalyticsData> {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw) as AnalyticsData;
  } catch {
    return getEmptyData();
  }
}

async function writeData(data: AnalyticsData): Promise<void> {
  const dir = path.dirname(DATA_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function incrementPageView(): Promise<void> {
  const data = await readData();
  const key = todayKey();
  if (!data.daily[key]) data.daily[key] = getEmptyDayStats();
  data.daily[key].pageViews++;
  await writeData(data);
}

export async function incrementVisitor(): Promise<void> {
  const data = await readData();
  const key = todayKey();
  if (!data.daily[key]) data.daily[key] = getEmptyDayStats();
  data.daily[key].visitors++;
  await writeData(data);
}

export async function incrementAddToCart(): Promise<void> {
  const data = await readData();
  const key = todayKey();
  if (!data.daily[key]) data.daily[key] = getEmptyDayStats();
  data.daily[key].addToCart++;
  await writeData(data);
}

export async function recordPurchase(revenue: number): Promise<void> {
  const data = await readData();
  const key = todayKey();
  if (!data.daily[key]) data.daily[key] = getEmptyDayStats();
  data.daily[key].purchases++;
  data.daily[key].revenue += revenue;
  await writeData(data);
}

export async function incrementArtworkView(slug: string): Promise<void> {
  const data = await readData();
  data.topArtworks[slug] = (data.topArtworks[slug] || 0) + 1;
  await writeData(data);
}

export async function incrementFunnelStep(
  step: 'home' | 'galerie' | 'boutique' | 'checkout' | 'purchase'
): Promise<void> {
  const data = await readData();
  data.funnel[step]++;
  await writeData(data);
}

export async function getAnalytics(): Promise<{
  today: DailyStats;
  week: DailyStats;
  month: DailyStats;
  topArtworks: Array<{ slug: string; views: number }>;
  funnel: AnalyticsData['funnel'];
}> {
  const data = await readData();
  const now = new Date();
  const todayStr = todayKey();

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setDate(monthAgo.getDate() - 30);

  const today = data.daily[todayStr] || getEmptyDayStats();

  const week = getEmptyDayStats();
  const month = getEmptyDayStats();

  for (const [dateStr, stats] of Object.entries(data.daily)) {
    const date = new Date(dateStr);
    if (date >= weekAgo) {
      week.visitors += stats.visitors;
      week.pageViews += stats.pageViews;
      week.addToCart += stats.addToCart;
      week.purchases += stats.purchases;
      week.revenue += stats.revenue;
    }
    if (date >= monthAgo) {
      month.visitors += stats.visitors;
      month.pageViews += stats.pageViews;
      month.addToCart += stats.addToCart;
      month.purchases += stats.purchases;
      month.revenue += stats.revenue;
    }
  }

  const topArtworks = Object.entries(data.topArtworks)
    .map(([slug, views]) => ({ slug, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return { today, week, month, topArtworks, funnel: data.funnel };
}
