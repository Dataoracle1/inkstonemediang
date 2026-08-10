// Lightweight, privacy-conscious page-view tracking.
// visitorId persists across visits (localStorage) so "unique visitors" is
// real. sessionId resets per browser session so "bounce rate" is real.
// Every call here is fire-and-forget — a tracking failure must never
// affect the actual page the visitor is using.

const getVisitorId = () => {
  let id = localStorage.getItem('sydlinesVisitorId');
  if (!id) {
    id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('sydlinesVisitorId', id);
  }
  return id;
};

const getSessionId = () => {
  let id = sessionStorage.getItem('sydlinesSessionId');
  if (!id) {
    id = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem('sydlinesSessionId', id);
  }
  return id;
};

const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

export const trackPageView = (path, postId = null) => {
  try {
    const payload = JSON.stringify({
      path,
      postId,
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      referrer: document.referrer || '',
    });
    fetch(`${getApiUrl()}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // tracking must never throw into the app
  }
};

export const trackDuration = (path, durationSeconds) => {
  if (!path || durationSeconds < 1) return;
  try {
    const payload = JSON.stringify({ sessionId: getSessionId(), path, durationSeconds });
    const url = `${getApiUrl()}/analytics/track/duration`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
    }
  } catch {
    // tracking must never throw into the app
  }
};