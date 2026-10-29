#!/usr/bin/env node
// Test sieciowy zbudowanego dist/.
//
// Dla KAZDEJ strony HTML w dist/: otwiera ja w przegladarce (Chromium przez Playwright),
// przewija, zapisuje wszystkie zadania sieciowe i:
//   - BLAD (exit 1), gdy strona laczy sie z zewnetrznym origin spoza allowlist.json;
//   - BLAD (exit 1), gdy strona sie nie laduje (blad nawigacji lub status >= 400);
//   - OSTRZEZENIE (adnotacja GitHub), gdy zbior lokalnych skryptow i zadan fetch/xhr
//     strony rozni sie od zapisanego snapshot.json (nazwy bez hashy buildu).
//
// Zewnetrzne zadania sa tylko zapisywane i PRZERYWANE (nic nie wychodzi do internetu,
// test nie odpytuje produkcyjnego Workera ani Google).
//
// Uzycie:   node narzedzia/siec-check/sprawdz.cjs dist
//           node narzedzia/siec-check/sprawdz.cjs dist --update-snapshot
// Wymaga:   pakiet `playwright` (w CI instalowany osobno, z przypieta wersja).
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const here = __dirname;
const distDir = path.resolve(process.argv[2] || 'dist');
const update = process.argv.includes('--update-snapshot');
const allow = JSON.parse(fs.readFileSync(path.join(here, 'allowlist.json'), 'utf8'));
const snapFile = path.join(here, 'snapshot.json');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.wasm': 'application/wasm', '.glb': 'model/gltf-binary', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
};

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(path.relative(distDir, p).split(path.sep).join('/'));
  }
  return acc;
}

function startServer() {
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(distDir, rel);
    if (!file.startsWith(distDir + path.sep) && file !== distDir) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404).end('nie ma'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// Nazwy plikow Astro maja hash (np. HeroSkull.B1SEp9PW.js); do porownan go zdejmujemy.
const unhash = p => p.replace(/\.[A-Za-z0-9_-]{8}\.(js|mjs|css)$/, '.$1');

async function crawlOne(browser, origin, rel) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const externals = new Set();
  const local = new Set();
  await ctx.route('**/*', route => {
    const u = new URL(route.request().url());
    if (u.origin === origin) return route.continue();
    if (u.protocol === 'data:' || u.protocol === 'blob:') return route.continue();
    externals.add(u.origin);
    return route.abort();
  });
  const page = await ctx.newPage();
  // CSP z <meta> blokuje obce skrypty ZANIM wyjda do sieci, wiec route() ich nie zobaczy.
  // Zbieramy wiec tez naruszenia CSP (blockedURI) i traktujemy je jak zewnetrzne origin.
  const cspOther = new Set();
  await page.exposeFunction('__cspNaruszenie', (blocked, directive) => {
    try {
      const u = new URL(blocked, origin);
      if (u.protocol === 'http:' || u.protocol === 'https:') { if (u.origin !== origin) externals.add(u.origin); }
      else cspOther.add(directive + ':' + blocked);
    } catch (e) { cspOther.add(directive + ':' + blocked); }
  });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', e => {
      window.__cspNaruszenie(e.blockedURI || '', e.effectiveDirective || '');
    });
  });
  page.on('request', r => {
    const u = new URL(r.url());
    if (u.origin !== origin) return;
    const t = r.resourceType();
    if (t === 'script' || t === 'fetch' || t === 'xhr') local.add(unhash(u.pathname));
  });
  let problem = null;
  try {
    const resp = await page.goto(origin + '/' + rel, { waitUntil: 'networkidle', timeout: 30000 });
    if (!resp || resp.status() >= 400) problem = 'status ' + (resp ? resp.status() : 'brak odpowiedzi');
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(200); }
    await page.waitForTimeout(800);
  } catch (e) { problem = 'nawigacja: ' + String(e.message).split('\n')[0]; }
  await ctx.close();
  return { rel, problem, externals: [...externals].sort(), local: [...local].sort(), cspOther: [...cspOther].sort() };
}

(async () => {
  const pages = walk(distDir).sort();
  if (!pages.length) { console.error('Brak plikow HTML w ' + distDir); process.exit(2); }
  const server = await startServer();
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();
  const queue = pages.slice();
  const results = [];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) results.push(await crawlOne(browser, origin, queue.shift()));
  }));
  await browser.close();
  server.close();
  results.sort((a, b) => a.rel.localeCompare(b.rel));

  let failed = 0;
  const seenOrigins = new Map();
  for (const r of results) {
    if (r.problem) { failed++; console.log(`::error::${r.rel}: strona sie nie laduje (${r.problem})`); }
    for (const c of r.cspOther) { failed++; console.log(`::error::${r.rel}: CSP zablokowala wlasny/inline zasob (${c}); strona moze dzialac niepoprawnie`); }
    const okOrigins = new Set([...(allow.global || []), ...((allow.perPage || {})[r.rel] || [])]);
    for (const o of r.externals) {
      seenOrigins.set(o, (seenOrigins.get(o) || 0) + 1);
      if (!okOrigins.has(o)) { failed++; console.log(`::error::${r.rel}: niedozwolony origin zewnetrzny ${o} (dodaj do narzedzia/siec-check/allowlist.json tylko po swiadomej decyzji)`); }
    }
  }

  const current = {};
  for (const r of results) current[r.rel] = r.local;
  if (update) {
    fs.writeFileSync(snapFile, JSON.stringify(current, null, 1) + '\n');
    console.log('Zapisano snapshot.json (' + results.length + ' stron).');
  } else if (fs.existsSync(snapFile)) {
    const prev = JSON.parse(fs.readFileSync(snapFile, 'utf8'));
    for (const rel of Object.keys(current)) {
      const a = new Set(prev[rel] || []), b = new Set(current[rel]);
      const added = [...b].filter(x => !a.has(x)), removed = [...a].filter(x => !b.has(x));
      if (!(rel in prev)) console.log(`::warning::${rel}: nowa strona, brak w snapshot.json`);
      else if (added.length || removed.length) console.log(`::warning::${rel}: zmiana lokalnych skryptow/zadan. Dodane: ${added.join(', ') || '-'}; usuniete: ${removed.join(', ') || '-'}`);
    }
    for (const rel of Object.keys(prev)) if (!(rel in current)) console.log(`::warning::${rel}: byla w snapshot.json, nie ma w dist`);
  } else {
    console.log('::notice::Brak snapshot.json (uruchom z --update-snapshot, aby go utworzyc).');
  }

  console.log(`Stron: ${results.length}. Zewnetrzne origin: ${[...seenOrigins].map(([o, n]) => `${o} (${n})`).join(', ') || 'brak'}.`);
  if (failed) { console.log(`BLAD: ${failed} naruszen.`); process.exit(1); }
  console.log('OK: brak niedozwolonych origin, wszystkie strony sie laduja.');
})();
