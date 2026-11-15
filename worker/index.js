// Serves the static site and two small endpoints for visit statistics:
//   POST /api/hit    counts a page view, a new daily visitor, a traffic source, or a tap on a buy button
//   GET  /api/stats  daily totals and top lists for the owner's dashboard (needs the STATS_KEY secret)
// Only per-day counters are stored. No IP address, cookie, or other identifier is kept.

const KINDS = new Set(['view', 'visitor', 'click', 'source']);
let tableReady = false;

async function ensureTable(db) {
  if (tableReady) return;
  await db.exec('CREATE TABLE IF NOT EXISTS hits (day TEXT NOT NULL, kind TEXT NOT NULL, key TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, kind, key))');
  tableReady = true;
}

// Days are counted in Indonesia's western time zone (UTC+7).
function dayOf(ms) {
  return new Date(ms + 7 * 3600e3).toISOString().slice(0, 10);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function cleanKey(kind, key) {
  if (typeof key !== 'string') return null;
  key = key.trim().slice(0, 120);
  if (kind === 'view') return /^\/[\w\-./%]*$/.test(key) ? key : null;
  if (kind === 'click') return /^[a-z0-9-]{1,80}$/.test(key) ? key : null;
  if (kind === 'source') return /^[\w .\-]{1,40}$/.test(key) ? key : null;
  return '';
}

async function handleHit(request, env) {
  // Counting is skipped quietly until the database is connected.
  if (!env.DB) return new Response(null, { status: 204 });
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== url.host) return new Response(null, { status: 403 });
  if (/bot|crawl|spider|slurp|preview/i.test(request.headers.get('user-agent') ?? '')) return new Response(null, { status: 204 });

  let events;
  try {
    const body = JSON.parse(await request.text());
    events = Array.isArray(body) ? body.slice(0, 4) : [];
  } catch {
    return new Response(null, { status: 400 });
  }
  const day = dayOf(Date.now());
  const rows = [];
  for (const event of events) {
    if (!event || !KINDS.has(event.kind)) continue;
    const key = cleanKey(event.kind, event.key ?? '');
    if (key === null) continue;
    rows.push([day, event.kind, key]);
  }
  if (rows.length === 0) return new Response(null, { status: 204 });

  await ensureTable(env.DB);
  const stmt = env.DB.prepare('INSERT INTO hits (day, kind, key, n) VALUES (?, ?, ?, 1) ON CONFLICT (day, kind, key) DO UPDATE SET n = n + 1');
  await env.DB.batch(rows.map((r) => stmt.bind(...r)));
  return new Response(null, { status: 204 });
}

function sameSecret(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function handleStats(request, env) {
  if (!env.DB) return json({ error: 'no-db' }, 503);
  if (!env.STATS_KEY) return json({ error: 'no-key' }, 503);
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!sameSecret(given, env.STATS_KEY)) return json({ error: 'wrong-key' }, 401);

  const url = new URL(request.url);
  const days = Math.min(Math.max(parseInt(url.searchParams.get('days') ?? '30', 10) || 30, 1), 365);
  const today = Date.now();
  const from = dayOf(today - (days - 1) * 86400e3);

  await ensureTable(env.DB);
  const daily = await env.DB.prepare('SELECT day, kind, SUM(n) AS n FROM hits WHERE day >= ? AND kind IN (\'view\', \'visitor\', \'click\') GROUP BY day, kind').bind(from).all();
  const tops = await env.DB.prepare('SELECT kind, key, SUM(n) AS n FROM hits WHERE day >= ? AND kind IN (\'view\', \'click\', \'source\') GROUP BY kind, key ORDER BY n DESC').bind(from).all();

  const dayList = [];
  for (let i = days - 1; i >= 0; i--) dayList.push({ day: dayOf(today - i * 86400e3), view: 0, visitor: 0, click: 0 });
  const byDay = new Map(dayList.map((d) => [d.day, d]));
  for (const row of daily.results) {
    const d = byDay.get(row.day);
    if (d) d[row.kind] = row.n;
  }
  const top = { view: [], click: [], source: [] };
  for (const row of tops.results) if (top[row.kind].length < 10) top[row.kind].push({ key: row.key, n: row.n });

  return json({ days: dayList, top });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/api/hit' && request.method === 'POST') return await handleHit(request, env);
      if (url.pathname === '/api/stats' && request.method === 'GET') return await handleStats(request, env);
    } catch {
      return json({ error: 'server' }, 500);
    }
    if (url.pathname.startsWith('/api/')) return json({ error: 'not-found' }, 404);

    // Any other path that matched no file gets the site's own 404 page.
    const page = await env.ASSETS.fetch(new Request(new URL('/404', url)));
    return new Response(page.body, { status: 404, headers: page.headers });
  },
};
