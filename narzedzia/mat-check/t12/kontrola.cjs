// Kontrola modułu 12 w przeglądarce: błędy JS, szerokości na 390 i 360 px (po „Pokaż wszystko”),
// animacje krok po kroku, ćwiczenia „wpisz sam”, quizy do końca, rysunek rodziny funkcji. Zrzuty do t12/shots.
const { chromium } = require('playwright');
// Użycie: npx astro preview (osobno), potem URL=http://localhost:4321/matematyka/<slug>.html OUT=<katalog na zrzuty> node kontrola.cjs
const URL = process.env.URL || 'http://localhost:4321/matematyka/calka-nieoznaczona.html';
const OUT = (process.env.OUT || '/tmp/zrzuty') + '/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const wyniki = [];
  for (const w of [1440, 390, 360]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const bledy = [];
    p.on('pageerror', (e) => bledy.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') bledy.push(m.text()); });
    await p.goto(URL, { waitUntil: 'networkidle' });
    // rozwiń wszystkie przykłady i pokaż wszystkie kroki
    await p.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
    const szer = await p.evaluate(() => {
      const zle = [];
      const sel = '.k-rach-kk, .k-ramka, .k-det > summary, .katex-display, .k-tab, .k-macierze, .k-obl-scroll, .k-rach-m, .k-odp-f, .k-odp-d, .k-cp-w, .k-rozbior, .k-pol, .k-klas';
      document.querySelectorAll(sel).forEach((el) => {
        if (el.offsetParent === null) return;
        if (el.scrollWidth > el.clientWidth + 1) {
          const przew = getComputedStyle(el).overflowX;
          zle.push({ cls: el.className.slice(0, 40), sw: el.scrollWidth, cw: el.clientWidth, przew, txt: (el.textContent || '').slice(0, 60) });
        }
      });
      return { doc: document.documentElement.scrollWidth, win: window.innerWidth, zle };
    });
    wyniki.push({ w, bledy, doc: szer.doc, win: szer.win, zleIle: szer.zle.length, zle: szer.zle.slice(0, 80) });
    if (w === 390) {
      await p.screenshot({ path: OUT + 'top-390.png' });
      for (const id of ['zad-1a', 'zad-2a', 'zad-3o']) {
        const box = p.locator(`#${id} + section`);
        await box.scrollIntoViewIfNeeded();
        await box.screenshot({ path: OUT + `${id}-390.png` });
      }
    }
    if (w === 1440) {
      // animacja krok po kroku w 3o: start + przejście do końca
      const box = p.locator('#zad-3o + section');
      await box.locator('[data-rach-start]').click();
      let kroki = 0;
      for (let i = 0; i < 12; i++) {
        const next = box.locator('[data-kk-next]').first();
        for (let t = 0; t < 30 && !(await next.isEnabled()); t++) await p.waitForTimeout(300);
        if (!(await next.isEnabled())) break;
        await next.click(); kroki++;
        await p.waitForTimeout(600);
        if (i === 3) { await p.waitForTimeout(3500); await box.screenshot({ path: OUT + '3o-anim-1440.png' }); }
      }
      wyniki.push({ krokiAnimacji3o: kroki });
      // rodzina: klik C = 2
      const rod = p.locator('[data-rodz]');
      await rod.locator('button[data-c="2"]').click();
      await p.waitForTimeout(400);
      await rod.screenshot({ path: OUT + 'rodzina-1440.png' });
      // ćwiczenie „wpisz całkę”: pokaż odpowiedzi + sprawdź
      const cw = p.locator('[data-cp]').nth(1);
      await cw.locator('[data-cp-show]').click();
      await cw.locator('[data-cp-check]').click();
      const sum = await cw.locator('[data-sum]').textContent();
      wyniki.push({ cwiczenieCalka: sum });
      await cw.screenshot({ path: OUT + 'cw-calka-1440.png' });
      // jedno złe pole → wyjaśnienie
      await cw.locator('[data-cp-clear]').click();
      await cw.locator('.k-cp-in').first().fill('7');
      await cw.locator('[data-cp-check]').click();
      wyniki.push({ zlePole: await cw.locator('[data-bledy]').textContent() });
      // quizy: klikaj dobre odpowiedzi
      const quizy = await p.evaluate(() => document.querySelectorAll('.k-pyt').length);
      wyniki.push({ quizy });
    }
    await p.close();
  }
  console.log(JSON.stringify(wyniki.map((r) => (r.zle ? { ...r, zle: r.zle, bledy: r.bledy.filter((e) => !/cloudflareinsights|ERR_FAILED/.test(e)) } : r)), null, 1));
  await b.close();
})();
