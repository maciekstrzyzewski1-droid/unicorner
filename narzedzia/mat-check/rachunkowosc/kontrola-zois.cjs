// Kontrola komponentu „Zestawienie” (moduł zestawienie.html): klik w liczby (panel + podświetlenie w koncie), przełącznik
// grup kolumn na telefonie, ćwiczenie „wypełnij sam” (Pokaż → Sprawdź = wszystko dobrze; jedno złe pole → wyjaśnienie), zrzuty.
// Użycie: NODE_PATH=<…>/node_modules PW=playwright-core CHROME=<chrome.exe> URL=… OUT=… node kontrola-zois.cjs
const { chromium } = require(process.env.PW || 'playwright');
const URL = process.env.URL || 'http://localhost:4321/rachunkowosc/zestawienie.html';
const OUT = (process.env.OUT || '/tmp/zrzuty') + '/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
  for (const w of [1440, 390, 360]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const bledy = [];
    p.on('pageerror', (e) => bledy.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/cloudflareinsights|beacon/.test(m.text())) bledy.push(m.text()); });
    await p.goto(URL, { waitUntil: 'networkidle' });
    for (const btn of await p.locator('.k-rozw-ctl [data-all]').all()) if (await btn.isVisible()) await btn.click();
    await p.waitForTimeout(300);
    const wyniki = [];
    const boxy = await p.locator('[data-zs]').all();
    for (let i = 0; i < boxy.length; i++) {
      const box = boxy[i];
      const tryb = await box.getAttribute('data-tryb');
      const g = await box.getAttribute('data-g');
      const sc = await box.evaluate((el) => { const s = el.querySelector('.k-tp-scroll'); return s ? `${s.scrollWidth}/${s.clientWidth}` : '-'; });
      if (tryb === 'pokaz') {
        // klik w pierwszą niezerową liczbę każdej grupy kolumn (z przełączaniem grup na telefonie)
        const spr = [];
        for (const kol of ['sp', 'ob', 'na', 'sk']) {
          if (w < 700) await box.locator(`[data-gb="${kol}"]`).click();
          const c = box.locator(`.k-zs-c:not(.is-0)[data-c*="|${kol}|"]`).first();
          await c.click();
          await p.waitForTimeout(150);
          const st = await box.evaluate((el) => ({ txt: el.querySelector('[data-txt]')?.textContent?.slice(0, 60), hl: el.querySelectorAll('[data-kk]:not([hidden]) .is-hl').length, live: el.querySelector('[data-out]')?.classList.contains('is-live') }));
          spr.push(`${kol}: hl ${st.hl}, ${st.live ? 'live' : 'NIE live'}, „${st.txt}”`);
        }
        const razem = box.locator(`.k-zs-c[data-c^="razem|${w < 700 ? 'sk' : 'sp'}|"]`).first();
        await razem.click();
        const src = await box.locator('.k-zs-c.is-src').count();
        spr.push(`razem: źródeł ${src}`);
        if (i === boxy.length - 1 || i === 1) await box.screenshot({ path: OUT + `zois${i}-${w}.png` });
        wyniki.push({ i, tryb, g, scroll: sc, spr });
      } else {
        await box.locator('[data-show]').click();
        await box.locator('[data-check]').click();
        const ok = (await box.locator('[data-sum]').textContent()).slice(0, 30);
        const pierwsze = box.locator('.k-zs-in').first();
        await pierwsze.fill('123');
        await box.locator('[data-check]').click();
        const zle = await box.locator('[data-bledy] li').count();
        if (w === 390) await box.screenshot({ path: OUT + `zois-cw-${w}.png` });
        await box.locator('[data-clear]').click();
        wyniki.push({ i, tryb, g, scroll: sc, ok, zleWyj: zle });
      }
    }
    console.log(JSON.stringify({ w, bledy, doc: await p.evaluate(() => `${document.documentElement.scrollWidth}/${window.innerWidth}`), wyniki }, null, 1));
    await p.close();
  }
  await b.close();
})();
