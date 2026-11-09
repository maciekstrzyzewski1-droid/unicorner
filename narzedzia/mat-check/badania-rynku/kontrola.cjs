// Kontrola modułu kursu „Metody badań rynku” w przeglądarce: błędy JS, szerokości na 1440/390/360 px (po „Pokaż wszystko”),
// ćwiczenia „zaznacz sam” (Pokaż → Sprawdź = wszystko dobrze; jedna zła kratka → wyjaśnienie), klasyfikatory, quizy, kotwice, zrzuty.
// Użycie: npx astro preview (osobno), potem NODE_PATH=<katalog z playwright-core>/node_modules URL=… OUT=… CHROME=… node kontrola.cjs
let pw; try { pw = require('playwright'); } catch { pw = require('playwright-core'); }
const { chromium } = pw;
const URL = process.env.URL || 'http://localhost:4321/badania-rynku/skale.html';
const OUT = (process.env.OUT || './zrzuty') + '/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const w of [1440, 390, 360]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const bledy = [];
    p.on('pageerror', (e) => bledy.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') bledy.push(m.text()); });
    await p.goto(URL, { waitUntil: 'networkidle' });
    if (w !== 360) await p.screenshot({ path: OUT + `top-${w}.png` });
    for (const btn of await p.locator('.k-rozw-ctl [data-all]').all()) if (await btn.isVisible()) await btn.click();
    await p.waitForTimeout(300);
    const szer = await p.evaluate(() => {
      const zle = [];
      document.querySelectorAll('.k-ramka, .k-tab, .k-pol, .k-klas, .k-ct, .k-fig, .k-ank-box, .k-sciaga, .k-dwa, .k-pyt, .k-leg').forEach((el) => {
        if (el.offsetParent === null) return;
        const ov = getComputedStyle(el).overflowX;
        if (el.scrollWidth > el.clientWidth + 1 && ov !== 'auto' && ov !== 'scroll') zle.push({ cls: el.className.slice(0, 40), sw: el.scrollWidth, cw: el.clientWidth, txt: (el.textContent || '').slice(0, 50) });
      });
      const przewija = [];
      document.querySelectorAll('.k-ank-scroll, .k-tp-scroll, .k-tab').forEach((el) => { if (el.offsetParent && el.scrollWidth > el.clientWidth + 1) przewija.push((el.textContent || '').trim().slice(0, 40)); });
      const ids = new Set(Array.from(document.querySelectorAll('[id]')).map((e) => e.id));
      const brak = Array.from(document.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href').slice(1)).filter((h) => h && !ids.has(h));
      return { doc: document.documentElement.scrollWidth, win: window.innerWidth, zle, przewija, brak };
    });
    // ćwiczenia „zaznacz sam”: jedna zła kratka → wyjaśnienie; Pokaż + Sprawdź → wszystko dobrze
    const kaf = [];
    for (const box of await p.locator('[data-kaf]').all()) {
      await box.scrollIntoViewIfNeeded();
      await box.locator('.k-ct-c').first().click();
      await box.locator('[data-check]').click();
      const n1 = await box.locator('[data-bledy] li').count();
      await box.locator('[data-show]').click();
      await box.locator('[data-check]').click();
      const ok = await box.locator('.k-ct-ok').count();
      kaf.push({ wyjasnienia_po_bledzie: n1, wszystko_dobrze: ok === 1 });
      if (w === 390) await box.screenshot({ path: OUT + `kaf-${kaf.length}-390.png` });
    }
    // klasyfikatory i quizy: kliknij zawsze dobrą odpowiedź
    let klas = 0, quiz = 0;
    for (const it of await p.locator('.k-klas-item').all()) { const k = await it.getAttribute('data-kat'); await it.locator(`.k-opt[data-i="${k}"]`).click(); klas++; }
    for (const it of await p.locator('.k-pyt-item').all()) { const k = await it.getAttribute('data-dobra'); const o = it.locator(`.k-opt[data-i="${k}"]`); if (await o.isEnabled()) await o.click(); quiz++; }
    const wyniki = await p.locator('.k-quiz .k-pyt-wynik, .k-quiz [data-wynik]').allTextContents().catch(() => []);
    if (w === 390) {
      for (const [i, f] of (await p.locator('.k-ank').all()).entries()) if (i < 40 && await f.isVisible()) await f.screenshot({ path: OUT + `ank-${String(i).padStart(2, '0')}-390.png` });
    }
    if (w === 1440) await p.screenshot({ path: OUT + 'pelna-1440.png', fullPage: true });
    console.log(JSON.stringify({ w, bledy, ...szer, kaf, klas, quiz, wyniki }, null, 0));
    await p.close();
  }
  await b.close();
})();
