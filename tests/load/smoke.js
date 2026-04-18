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
  vus: 1,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
    errors: ['rate<0.01'],
  },
  tags: {
    test_type: 'smoke',
  },
};

function checkResponse(res, name) {
  const ok = check(res, {
    [`${name} status 200`]: (r) => r.status === 200,
    [`${name} body not empty`]: (r) => r.body && r.body.length > 0,
  });
  if (!ok) errorRate.add(1);
  return ok;
}

export default function () {
  group('homepage', () => {
    const res = http.get(`${BASE_URL}/fr`, { tags: { endpoint: 'homepage' } });
    homepageTrend.add(res.timings.duration);
    checkResponse(res, 'homepage');
    sleep(1);
  });

  group('galerie', () => {
    const res = http.get(`${BASE_URL}/fr/galerie`, { tags: { endpoint: 'galerie' } });
    galerieTrend.add(res.timings.duration);
    checkResponse(res, 'galerie');
    sleep(1);
  });

  group('galerie-item', () => {
    const res = http.get(`${BASE_URL}/fr/galerie-item/${PHOTO_SLUG}`, {
      tags: { endpoint: 'galerie_item' },
    });
    itemTrend.add(res.timings.duration);
    checkResponse(res, 'galerie-item');
    sleep(1);
  });

  group('api-health', () => {
    const res = http.get(`${BASE_URL}/api/health`, { tags: { endpoint: 'api_health' } });
    healthTrend.add(res.timings.duration);
    check(res, {
      'health status 200': (r) => r.status === 200,
      'health is ok': (r) => r.json('status') === 'ok',
    }) || errorRate.add(1);
    sleep(1);
  });
}

export function handleSummary(data) {
  return {
    'tests/load/reports/smoke-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data),
  };
}

function textSummary(data) {
  const lines = [];
  lines.push('\n=== SMOKE TEST SUMMARY ===\n');
  lines.push(`VUs: ${data.metrics.vus_max?.values?.max || 1}`);
  lines.push(`Duration: ${(data.state.testRunDurationMs / 1000).toFixed(1)}s`);
  lines.push(`Total requests: ${data.metrics.http_reqs?.values?.count || 0}`);
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
