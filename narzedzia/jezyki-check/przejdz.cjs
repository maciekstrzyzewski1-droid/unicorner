#!/usr/bin/env node
// Przejście całego kursu językowego w Chromium (Playwright) z dobrymi odpowiedziami wziętymi z danych.
//
// Dla każdej lekcji i escape roomu: otwiera węzeł, przechodzi karty „Nowe”, w każdym ćwiczeniu czyta klucz
// (data-cw na .jz-cw), bierze poprawną odpowiedź z src/data/jezyki/<slug>.js, wpisuje ją albo klika,
// sprawdza i oczekuje „dobrze”. Na końcu lekcji wynik musi wynosić 100%. Wyłapuje ćwiczenia, których
// nie da się zaliczyć dobrą odpowiedzią (literówka w danych, apostrof, zły podział kafelków, zła kategoria).
//
// Użycie:   node narzedzia/jezyki-check/przejdz.cjs dist angielski [ile_razy=1]
// Wymaga:   playwright z Chromium (jak dymny.cjs). Kod wyjścia 1 = któraś lekcja nie przeszła.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');

const [distArg = 'dist', slug = 'angielski', ileArg = '1'] = process.argv.slice(2);
const DIST = path.resolve(distArg);
const ILE = Math.max(1, Number(ileArg) || 1);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon' };

function serwer() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const f = path.join(DIST, u === '/' ? 'index.html' : u);
      if (!f.startsWith(DIST) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    });
    s.listen(0, '127.0.0.1', () => ok(s));
  });
}

(async () => {
  const { JEZYKI } = await import(pathToFileURL(path.resolve('src/data/jezyki/index.js')).href);
  const { KURS } = JEZYKI[slug];
  const CW = {};
  const wezly = [];
  for (const s of KURS.sekcje) {
    for (const u of s.jednostki) for (const l of u.lekcje) { wezly.push(l.id); l.pula.forEach((c, i) => { CW[`${l.id}#${i}`] = c; }); }
    if (s.boss) { wezly.push(s.boss.id); s.boss.retos.forEach((r, ri) => r.pula.forEach((c, i) => { CW[`${s.boss.id}#${ri}.${i}`] = c; })); }
  }
  const srv = await serwer();
  const origin = `http://127.0.0.1:${srv.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const bledyJs = [];
  page.on('pageerror', (e) => bledyJs.push(String(e)));
  await page.route('**/*', (r) => (r.request().url().startsWith(origin) ? r.continue() : r.abort()));
  await page.goto(`${origin}/${slug}.html`);
  // bez zapisanego postępu z wcześniejszych przebiegów
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const porazki = [];
  let cwiczen = 0;
  for (let runda = 0; runda < ILE; runda++) {
    for (const id of wezly) {
      await page.evaluate((id) => document.querySelector(`[data-wezel="${id}"]`).click(), id);
      await page.waitForSelector('.jz-lekcja');
      for (let krok = 0; krok < 200; krok++) {
        // stan okna: karta „Nowe”, ćwiczenie, wynik
        const stan = await page.evaluate(() => {
          if (document.querySelector('.jz-wyniki')) return { t: 'koniec', proc: document.querySelector('.jz-wynik b').textContent };
          const k = document.querySelector('.jz-lekcja .jz-cw[data-cw]');
          const dol = document.querySelector('.jz-l-dol');
          const spr = document.querySelector('.jz-spr');
          if (k) return { t: 'cw', k: k.dataset.cw, tryb: spr && spr.dataset.tryb, fb: /is-ok|is-bad|is-neutral/.test(dol.className) ? dol.className : '' };
          return { t: 'inne' };
        });
        if (stan.t === 'koniec') {
          if (stan.proc !== '100%') porazki.push(`${id}: wynik ${stan.proc}`);
          break;
        }
        if (stan.t === 'inne') { await page.evaluate(() => document.querySelector('.jz-spr')?.click()); await page.waitForTimeout(30); continue; }
        if (stan.fb) {
          if (!/is-ok|neutral/.test(stan.fb)) porazki.push(`${stan.k}: odpowiedź z danych oceniona jako zła (${stan.fb})`);
          await page.evaluate(() => document.querySelector('.jz-spr').click());
          await page.waitForTimeout(20);
          continue;
        }
        const c = CW[stan.k];
        if (!c) { porazki.push(`${stan.k}: nie ma takiego ćwiczenia w danych`); break; }
        cwiczen++;
        const udane = await page.evaluate((c) => {
          const box = document.querySelector('.jz-lekcja .jz-cw');
          const tekst = (html) => { const d = document.createElement('div'); d.innerHTML = html; return d.textContent.replace(/\s+/g, ' ').trim(); };
          const wpisz = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
          const opcje = () => [...box.querySelectorAll('.jz-opcja')];
          // wybor: data-v = opcja z danych; wiele: tekst w <span> (przed nim numer <kbd> albo ikonka)
          const klik = (lista, v) => { const b = lista.find((x) => x.dataset.v === v || (x.querySelector('span') && x.querySelector('span').textContent.replace(/\s+/g, ' ').trim() === tekst(v))); if (!b) throw new Error(`brak opcji „${tekst(v)}”`); b.click(); };
          switch (c.t) {
            case 'wybor': case 'sluchaj': klik(opcje(), c.o[0]); break;
            case 'wiele': for (const i of c.d) klik(opcje(), c.o[i]); break;
            case 'wpisz': wpisz(box.querySelector('input.jz-pole'), c.a[0]); break;
            case 'pisz': wpisz(box.querySelector('textarea'), 'test'); break;
            case 'luki': {
              const pola = [...box.querySelectorAll('.jz-luka')];
              const luki = [...c.tekst.matchAll(/\[\[(.+?)\]\]/g)].map((m) => m[1].split('|')[0]);
              pola.forEach((p, i) => wpisz(p, luki[i]));
              break;
            }
            case 'uloz': {
              const slowa = c.a.replace(/[¿?¡!.,:;„”"]/g, ' ').split(/\s+/).filter(Boolean);
              for (const s of slowa) {
                const t = [...box.querySelectorAll('.jz-bank .jz-kafel')].find((k) => k.textContent === s);
                if (!t) throw new Error(`brak kafelka „${s}”`);
                t.click();
              }
              break;
            }
            case 'pary': {
              const [L, P] = box.querySelectorAll('.jz-pary-k');
              for (const [a, b] of c.p) {
                const l = [...L.children].find((x) => x.dataset.v === a), r = [...P.children].find((x) => x.dataset.v === b);
                if (!l || !r) throw new Error(`brak pary „${a}” – „${b}”`);
                l.click(); r.click();
              }
              break;
            }
            case 'kat': {
              for (const e of c.e) {
                const chip = [...box.querySelectorAll('.jz-chip')].find((x) => x.dataset.v === e[0]);
                chip.click();
                box.querySelector(`.jz-kosz[data-k="${[].concat(e[1])[0]}"]`).click();
              }
              break;
            }
            case 'fiszka': box.querySelector('.jz-fk').click(); box.querySelector('.jz-fk-tak').click(); break;
            default: throw new Error(`typ ${c.t} bez obsługi w teście`);
          }
        }, c).then(() => true, (e) => { porazki.push(`${stan.k}: ${e.message.split('\n')[0]}`); return false; });
        if (!udane) break;
        // „Sprawdź” (pary sprawdzają się same po ostatnim połączeniu)
        await page.evaluate(() => { const s = document.querySelector('.jz-spr'); if (s && !s.hidden && !s.disabled && s.dataset.tryb === 'spr') s.click(); });
        await page.waitForTimeout(20);
      }
      await page.evaluate(() => document.querySelector('.jz-lekcja .jz-x, .jz-lekcja [data-zamknij]')?.click());
      await page.waitForTimeout(50);
      if (await page.$('.jz-lekcja')) { await page.keyboard.press('Escape'); await page.waitForTimeout(50); }
    }
  }
  // poziome przewijanie na telefonie
  const szer = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  if (szer[0] > szer[1]) porazki.push(`strona przewija się w bok na 390 px (${szer[0]} > ${szer[1]})`);
  await browser.close();
  srv.close();
  for (const b of bledyJs) porazki.push(`błąd JS: ${b}`);
  if (porazki.length) { for (const p of porazki) console.log('BŁĄD  ', p); console.log(`\n${porazki.length} problemów (${cwiczen} ćwiczeń)`); process.exit(1); }
  console.log(`OK: ${slug}: ${wezly.length} węzłów × ${ILE}, ${cwiczen} ćwiczeń, każda lekcja 100%, bez błędów JS.`);
})().catch((e) => { console.error(e); process.exit(1); });
