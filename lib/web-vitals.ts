/**
 * Web Vitals reporter — sends CLS, LCP, INP metrics to GA4
 * Only reports if GA4 is loaded and consent is given
 *
 * @author Lalou
 */

import type { Metric } from 'web-vitals';

function sendToGA4(metric: Metric) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    metric_rating: metric.rating,
    non_interaction: true,
  });
}

export function reportWebVitals() {
  if (typeof window === 'undefined') return;

  import('web-vitals').then(({ onCLS, onLCP, onINP }) => {
    onCLS(sendToGA4);
    onLCP(sendToGA4);
    onINP(sendToGA4);
  });
}
