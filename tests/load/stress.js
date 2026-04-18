import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const PHOTO_SLUG = __ENV.PHOTO_SLUG || 'photos-1';

const homepageTrend = new Trend('homepage_duration', true);
const galerieTrend = new Trend('galerie_duration', true);
const itemTrend = new Trend('item_duration', true);
const healthTrend = new Trend('health_duration', true);
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 20 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<5000'],
  },
  tags: {
    test_type: 'stress',
  },
};

function checkResponse(res, name) {
  const ok = check(res, {
    [`${name} status 200`]: (r) => r.status === 200,
  });
  if (!ok) errorRate.add(1);
  return ok;
}

export default function () {
  const pages = [
    { name: 'homepage', url: `${BASE_URL}/fr`, trend: homepageTrend, tag: 'homepage', weight: 3 },
    { name: 'galerie', url: `${BASE_URL}/fr/galerie`, trend: galerieTrend, tag: 'galerie', weight: 2 },
    { name: 'galerie-item', url: `${BASE_URL}/fr/galerie-item/${PHOTO_SLUG}`, trend: itemTrend, tag: 'galerie_item', weight: 1 },
    { name: 'api-health', url: `${BASE_URL}/api/health`, trend: healthTrend, tag: 'api_health', weight: 1 },
  ];

  const total = pages.reduce((s, p) => s + p.weight, 0);
  const r = Math.random() * total;
  let acc = 0;
  const chosen = pages.find((p) => {
    acc += p.weight;
    return r <= acc;
  });

  group(chosen.name, () => {
    const res = http.get(chosen.url, { tags: { endpoint: chosen.tag } });
    chosen.trend.add(res.timings.duration);
    checkResponse(res, chosen.name);
  });

  sleep(Math.random() * 1.5 + 0.5);
}

export function handleSummary(data) {
  return {
    'tests/load/reports/stress-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  };
}

function textSummary(data) {
  const lines = [];
  lines.push('\n=== STRESS TEST SUMMARY ===\n');
  lines.push(`VUs max: ${data.metrics.vus_max?.values?.max || 0}`);
  lines.push(`Duration: ${(data.state.testRunDurationMs / 1000).toFixed(1)}s`);
  lines.push(`Total requests: ${data.metrics.http_reqs?.values?.count || 0}`);
  lines.push(`Req/s: ${(data.metrics.http_reqs?.values?.rate || 0).toFixed(2)}`);
  lines.push(`Error rate: ${((data.metrics.http_req_failed?.values?.rate || 0) * 100).toFixed(2)}%`);
  lines.push('');
  const trends = ['homepage_duration', 'galerie_duration', 'item_duration', 'health_duration'];
  trends.forEach((t) => {
    const m = data.metrics[t];
    if (m) {
      lines.push(`${t}: p50=${(m.values['p(50)'] || 0).toFixed(0)}ms p95=${(m.values['p(95)'] || 0).toFixed(0)}ms p99=${(m.values['p(99)'] || 0).toFixed(0)}ms`);
    }
  });
  return lines.join('\n') + '\n';
}
