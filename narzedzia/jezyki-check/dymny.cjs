#!/usr/bin/env node
// Test dymny kursu językowego na zbudowanym dist/.
//
// Otwiera /hiszpanski.html w Chromium (Playwright) i przechodzi krótką drogę ucznia:
//   1. strona ładuje się bez błędów JS (pageerror, console.error) i silnik kursu startuje;
//   2. „Ucz się dalej” ([data-akcja="dalej"]) otwiera okno lekcji .jz-lekcja z position: fixed;
//   3. karty „Nowe” przechodzą przyciskiem .jz-spr;
//   4. w ćwiczeniu z opcjami (.jz-opcja) wybór opcji i „Sprawdź” dają wynik
//      (.jz-l-dol.is-ok albo .is-bad) i przycisk „Dalej”;
//   5. okno lekcji się zamyka.
// Kolejność ćwiczeń jest losowa. Gdy pierwsze ćwiczenie nie ma opcji, test zamyka lekcję i otwiera ją od nowa.
// Żądania do obcych originów są przerywane: test nic nie wysyła do internetu.
//
// Użycie:   node narzedzia/jezyki-check/dymny.cjs dist
// Wymaga:   pakiet `playwright` z Chromium. W CI instalowany poza projektem jak dla siec-check,
//           NODE_PATH wskazuje jego node_modules (patrz narzedzia/siec-check/README.md).
// Kod wyjścia 1 = test nie przeszedł.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const STRONA = 'hiszpanski.html';
const MAKS_PROB = 15;        // tyle razy otwieramy lekcję, żeby trafić na ćwiczenie z opcjami
const MAKS_KART_NOWE = 20;   // bezpiecznik pętli kart „Nowe”
const LIMIT_MS = 15000;      // limit czekania na element lub akcję

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.wasm': 'application/wasm', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon',
};

// Błędy strony zbierane przez cały przebieg; wypisujemy je także wtedy, gdy wcześniej zawiedzie inny krok.
const bledyStrony = [];

class Porazka extends Error {}
const porazka = (komunikat) => { throw new Porazka(komunikat); };

// Krok testu: każdy błąd Playwrighta (np. przekroczony czas) zamienia na czytelny komunikat po polsku.
async function krok(opis, dzialanie) {
  try {
    return await dzialanie();
  } catch (e) {
    if (e instanceof Porazka) throw e;
    throw new Porazka(`${opis} (${String(e.message).split('\n')[0]})`);
  }
}

function wczytajPlaywright() {
  try {
    return require('playwright');
  } catch {
    return porazka('brak pakietu playwright; zainstaluj go poza projektem i ustaw NODE_PATH (patrz narzedzia/siec-check/README.md)');
  }
}

function startSerwera(distDir) {
  const server = http.createServer((req, res) => {
    let rel;
    try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; }
    if (rel.endsWith('/')) rel += 'index.html';
    const plik = path.join(distDir, rel);
    if (!plik.startsWith(distDir + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(plik, (err, buf) => {
      if (err) { res.writeHead(404).end('nie ma'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(plik).toLowerCase()] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function nowaStrona(browser, origin) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.origin === origin || u.protocol === 'data:' || u.protocol === 'blob:') return route.continue();
    return route.abort();
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(LIMIT_MS);
  page.on('pageerror', (e) => bledyStrony.push(`błąd JS: ${String(e.message).split('\n')[0]}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const zrodlo = m.location().url || '';
    // żądania do obcych originów przerywa sam test, więc to nie jest błąd strony
    if (zrodlo && !zrodlo.startsWith(origin) && m.text().startsWith('Failed to load resource')) return;
    bledyStrony.push(`konsola: ${m.text().split('\n')[0]}`);
  });
  return page;
}

async function otworzLekcje(page) {
  await krok('nie da się kliknąć „Ucz się dalej” ([data-akcja="dalej"])', () => page.locator('[data-akcja="dalej"]').first().click());
  await krok('po kliknięciu „Ucz się dalej” nie pojawiło się okno lekcji .jz-lekcja', () => page.locator('.jz-lekcja').waitFor({ state: 'visible' }));
}

async function sprawdzPozycjeOkna(page) {
  const pozycja = await page.$eval('.jz-lekcja', (el) => getComputedStyle(el).position);
  if (pozycja !== 'fixed') porazka(`okno lekcji .jz-lekcja ma position: ${pozycja}, a powinno mieć fixed (brak stylów kursu?)`);
}

// Zwraca liczbę przejętych kart „Nowe” (przy pierwszym podejściu do lekcji jest co najmniej jedna).
async function przejdzKartyNowe(page) {
  let karty = 0;
  while (karty < MAKS_KART_NOWE && (await page.locator('.jz-lekcja .jz-nowe').count())) {
    await krok('nie da się przejść karty „Nowe” przyciskiem .jz-spr', () => page.locator('.jz-lekcja .jz-spr').click());
    karty++;
  }
  await krok('po kartach „Nowe” nie pojawiło się ćwiczenie (.jz-cw)', () => page.locator('.jz-lekcja .jz-cw').waitFor({ state: 'visible' }));
  return karty;
}

async function zamknijLekcje(page) {
  await krok('nie da się zamknąć lekcji przyciskiem ✕ (.jz-x)', () => page.locator('.jz-lekcja .jz-x').click());
  const przerwij = page.locator('.jz-modal-tlo button', { hasText: 'Przerwij' });
  if (await przerwij.count()) await krok('nie da się potwierdzić „Przerwij”', () => przerwij.click());
  await krok('okno lekcji nie zniknęło po zamknięciu', () => page.locator('.jz-lekcja').waitFor({ state: 'detached' }));
}

async function znajdzCwiczenieZOpcjami(page) {
  let kartyNowe = 0;
  for (let proba = 1; proba <= MAKS_PROB; proba++) {
    await otworzLekcje(page);
    if (proba === 1) await sprawdzPozycjeOkna(page);
    const karty = await przejdzKartyNowe(page);
    if (proba === 1) kartyNowe = karty;
    if (await page.locator('.jz-lekcja .jz-cw .jz-opcja').count()) return { proba, kartyNowe };
    await zamknijLekcje(page);
  }
  return porazka(`w ${MAKS_PROB} otwarciach lekcji nie trafiło się ćwiczenie z opcjami (.jz-opcja)`);
}

async function rozwiazCwiczenieZOpcjami(page) {
  const spr = page.locator('.jz-lekcja .jz-spr');
  await krok('nie da się wybrać opcji .jz-opcja', () => page.locator('.jz-lekcja .jz-cw .jz-opcja').first().click());
  await krok('„Sprawdź” nie odblokował się po wyborze opcji', () => spr.click());
  await krok('po „Sprawdź” nie pojawił się wynik (.jz-l-dol.is-ok albo .jz-l-dol.is-bad)',
    () => page.locator('.jz-lekcja .jz-l-dol.is-ok, .jz-lekcja .jz-l-dol.is-bad').waitFor({ state: 'visible' }));
  const wynik = await page.$eval('.jz-lekcja .jz-l-dol', (el) => (el.classList.contains('is-ok') ? 'dobrze' : 'źle'));
  const tekst = (await spr.textContent()).trim();
  const gotowy = (await spr.getAttribute('data-tryb')) === 'dalej' && (await spr.isVisible()) && (await spr.isEnabled());
  if (!gotowy || !['Dalej', 'Zakończ'].includes(tekst)) porazka(`po sprawdzeniu brak aktywnego przycisku „Dalej” (jest: „${tekst}”)`);
  return { wynik, tekst };
}

async function przebieg(page, origin) {
  const odp = await krok(`nie da się otworzyć /${STRONA}`, () => page.goto(`${origin}/${STRONA}`, { waitUntil: 'load' }));
  if (!odp || odp.status() >= 400) porazka(`/${STRONA} zwraca status ${odp ? odp.status() : 'brak odpowiedzi'}`);
  await krok('silnik kursu nie wystartował (brak klasy jz-js na <html>)', () => page.locator('html.jz-js').waitFor({ state: 'attached' }));
  const { proba, kartyNowe } = await znajdzCwiczenieZOpcjami(page);
  const { wynik, tekst } = await rozwiazCwiczenieZOpcjami(page);
  await zamknijLekcje(page);
  if (bledyStrony.length) porazka(`strona zgłosiła błędy (${bledyStrony.length})`);
  return { proba, kartyNowe, wynik, tekst };
}

async function main() {
  const distDir = path.resolve(process.argv[2] || 'dist');
  if (!fs.existsSync(path.join(distDir, STRONA))) porazka(`brak ${STRONA} w ${distDir} (najpierw npm run build)`);
  const { chromium } = wczytajPlaywright();
  const server = await startSerwera(distDir);
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await krok('nie da się uruchomić Chromium (zainstaluj: playwright install chromium)', () => chromium.launch());
  try {
    return await przebieg(await nowaStrona(browser, origin), origin);
  } finally {
    await browser.close();
    server.close();
  }
}

main().then((r) => {
  console.log(`OK: ${STRONA}: okno lekcji ma position: fixed, kart „Nowe”: ${r.kartyNowe}, ćwiczenie z opcjami `
    + `w ${r.proba}. otwarciu, odpowiedź: ${r.wynik}, przycisk „${r.tekst}”, lekcja zamknięta. Brak błędów JS.`);
}).catch((e) => {
  console.log(`::error::${STRONA}: test dymny nie przeszedł: ${e.message}`);
  for (const b of bledyStrony) console.log(`::error::${STRONA}: ${b}`);
  process.exit(1);
});
