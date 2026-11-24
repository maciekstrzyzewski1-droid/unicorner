// Kontrola modułu „Baza danych z ankiety” w przeglądarce: błędy JS, szerokości na 1440/390/360 px (po „Pokaż wszystko”),
// kotwice, tabele przestawne (przełączanie „Pokaż wartości jako” = te same liczby co przy buildzie, klik → wyjaśnienie),
// animacja Ctrl+H (krok po kroku), ćwiczenie „zakoduj sam” (Pokaż → Sprawdź = wszystko dobrze; zła komórka → wyjaśnienie),
// quizy przy samych dobrych odpowiedziach, eksport tekstu strony (kod zamiast liczby, NaN, undefined) i zrzuty.
// Użycie: npx astro preview (osobno), potem URL=… OUT=… node kontrola-baza.cjs   (Playwright z systemu albo NODE_PATH)
const { chromium } = require('playwright');
const fs = require('fs');
const URL = process.env.URL || 'http://localhost:4321/metody-badan-rynku/baza-danych.html';
const OUT = (process.env.OUT || './zrzuty-baza') + '/';
fs.mkdirSync(OUT, { recursive: true });
const problemy = [];
const zle = (s) => { problemy.push(s); console.log('✗', s); };
(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  for (const w of [1440, 390, 360]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const bledy = [];
    p.on('pageerror', (e) => bledy.push(e.message));
    // skrypt analityki Cloudflare na podglądzie lokalnym zawsze dostaje CORS — to nie błąd strony
    p.on('console', (m) => { if (m.type() === 'error' && !/cloudflareinsights|ERR_FAILED/.test(m.text())) bledy.push(m.text()); });
    await p.goto(URL, { waitUntil: 'networkidle' });
    for (const btn of await p.locator('.k-rozw-ctl [data-all]').all()) if (await btn.isVisible()) await btn.click();
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const out = { szer: [], strona: document.documentElement.scrollWidth, okno: window.innerWidth, brak: [], przewija: [] };
      document.querySelectorAll('.k-ramka, .k-tab, .k-pol, .k-ct, .k-fig, .k-sciaga, .k-dwa, .k-pyt, .k-leg, .k-rozw').forEach((el) => {
        if (el.offsetParent === null) return;
        const ov = getComputedStyle(el).overflowX;
        if (el.scrollWidth > el.clientWidth + 1 && ov !== 'auto' && ov !== 'scroll') out.szer.push(`${el.className.slice(0, 30)} ${el.scrollWidth}>${el.clientWidth} „${(el.textContent || '').trim().slice(0, 40)}”`);
      });
      document.querySelectorAll('.k-pp-scroll, .k-bz-scroll, .k-zam-scroll, .k-ck-scroll, .k-prz-scroll, .k-tab, .k-fig-box').forEach((el) => {
        if (el.offsetParent && el.scrollWidth > el.clientWidth + 1) out.przewija.push(`${el.className.slice(0, 20)}: „${(el.textContent || '').trim().slice(0, 40)}” ${el.scrollWidth}>${el.clientWidth}`);
      });
      const ids = new Set(Array.from(document.querySelectorAll('[id]')).map((e) => e.id));
      out.brak = Array.from(document.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href').slice(1)).filter((h) => h && !ids.has(h));
      return out;
    });
    console.log(`\n== ${w}px: strona ${r.strona} / okno ${r.okno}`);
    if (r.strona > r.okno) zle(`${w}px: poziome przewijanie strony (${r.strona} > ${r.okno})`);
    r.szer.forEach((s) => zle(`${w}px: wystaje ${s}`));
    if (r.przewija.length) console.log(`  przewija się w bok (${r.przewija.length}):`, r.przewija.slice(0, 12));
    r.brak.forEach((h) => zle(`brak kotwicy #${h}`));
    if (w === 1440) {
      await p.screenshot({ path: OUT + 'top-1440.png' });
      // tabele przestawne: przełączanie trybów = wartości z buildu; klik → wyjaśnienie
      const pp = p.locator('[data-pp]');
      const n = await pp.count();
      console.log('tabel przestawnych:', n);
      for (let i = 0; i < n; i++) {
        const box = pp.nth(i);
        const tryby = box.locator('[data-pp-tryb]');
        const t = await tryby.count();
        const start = await box.getAttribute('data-tryb');
        for (let j = 0; j < t; j++) {
          await tryby.nth(j).click();
          await p.waitForTimeout(50);
        }
        // wróć do trybu startowego i porównaj z HTML z buildu
        if (t) {
          const startBtn = box.locator(`[data-pp-tryb="${start}"]`);
          if (await startBtn.count()) await startBtn.click();
        }
        const td = box.locator('td[data-r]').first();
        await td.click();
        const txt = await box.locator('[data-pp-out]').innerText();
        if (!/\d/.test(txt) || /NaN|undefined/.test(txt)) zle(`przestawna ${i}: wyjaśnienie „${txt.slice(0, 80)}”`);
      }
      // porównanie: wartości po przełączeniu tam i z powrotem = wartości z buildu (świeża strona)
      const p2 = await b.newPage({ viewport: { width: 1440, height: 900 } });
      await p2.goto(URL, { waitUntil: 'networkidle' });
      const zBuildu = await p2.$$eval('[data-pp]', (bx) => bx.map((x) => Array.from(x.querySelectorAll('td[data-r]')).map((t) => t.textContent.trim())));
      const poKlikach = await p.$$eval('[data-pp]', (bx) => bx.map((x) => Array.from(x.querySelectorAll('td[data-r]')).map((t) => t.textContent.trim())));
      zBuildu.forEach((a, i) => { if (a.join('|') !== poKlikach[i].join('|')) zle(`przestawna ${i}: po przełączeniu trybów inne liczby niż z buildu\n   ${a.join(' ')}\n   ${poKlikach[i].join(' ')}`); });
      // tryby: % sumy kolumny w tabeli P5 × generacja — każda kolumna = 100%
      const krzyz = p2.locator('[data-pp][data-dwa="1"]').first();
      await krzyz.locator('[data-pp-tryb="kol"]').click();
      const sumy = await krzyz.locator('tr.is-suma td').allInnerTexts();
      if (!sumy.every((s) => s === '100,00%')) zle(`% sumy kolumny: suma końcowa ≠ 100% (${sumy.join(' ')})`);
      await krzyz.locator('td[data-r="0"][data-c="2"]').click();
      console.log('klik (tak, Z) w % kolumny:', (await krzyz.locator('[data-pp-out]').innerText()).slice(0, 160));
      await krzyz.screenshot({ path: OUT + 'przestawna-kol-1440.png' });
      await p2.close();
      // animacja Ctrl+H
      const zam = p.locator('[data-zam]').first();
      await zam.locator('[data-kk-start]').click();
      for (let k = 0; k < 3; k++) { await zam.locator('[data-kk-next]').click(); await p.waitForTimeout(250); }
      console.log('Ctrl+H krok:', (await zam.locator('[data-kk-cap]').innerText()).slice(0, 160));
      await zam.screenshot({ path: OUT + 'zamiana-krok-1440.png' });
      await zam.locator('[data-kk-stop]').click();
      // ćwiczenie „zakoduj sam”
      const ck = p.locator('[data-ck]').first();
      await ck.locator('[data-ck-show]').click();
      await ck.locator('[data-ck-check]').click();
      const s1 = await ck.locator('[data-ck-sum]').innerText();
      if (!/Wszystko dobrze/.test(s1)) zle(`CwiczenieKody: Pokaż → Sprawdź daje „${s1}”`);
      const pierwsze = ck.locator('.k-ck-in').first();
      await pierwsze.fill('0');
      await ck.locator('[data-ck-check]').click();
      console.log('CwiczenieKody, zła komórka:', (await ck.locator('[data-ck-bledy]').innerText()).slice(0, 200));
      await ck.screenshot({ path: OUT + 'cwiczenie-kody-1440.png' });
      // quizy: same dobre odpowiedzi → pełny wynik
      const quizy = p.locator('.k-quiz');
      const q = await quizy.count();
      for (let i = 0; i < q; i++) {
        const box = quizy.nth(i);
        const items = box.locator('.k-pyt-item');
        const ile = await items.count();
        for (let j = 0; j < ile; j++) {
          const it = items.nth(j);
          const d = await it.getAttribute('data-dobra');
          await it.locator(`.k-opt[data-i="${d}"]`).click();
        }
        const wyn = await box.locator('[data-wynik]').innerText();
        if (Number(wyn) !== ile) zle(`quiz ${i}: wynik ${wyn}/${ile}`);
      }
      console.log('quizów:', q);
      // eksport tekstu
      const tekst = await p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
      fs.writeFileSync(OUT + 'tekst.txt', tekst);
      const podejrzane = tekst.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /NaN|undefined|\[object|=fmt|=P\(|\bS\.\w|=>|\$\{/.test(l));
      podejrzane.forEach(([i, l]) => zle(`tekst, linia ${i}: ${l.slice(0, 100)}`));
    }
    if (w === 390) {
      await p.screenshot({ path: OUT + 'top-390.png' });
      const krzyz = p.locator('[data-pp][data-dwa="1"]').first();
      await krzyz.scrollIntoViewIfNeeded();
      await krzyz.locator('td[data-r="0"][data-c="2"]').click();
      await p.waitForTimeout(500);
      await p.screenshot({ path: OUT + 'przestawna-klik-390.png' });
      const out = await krzyz.locator('[data-pp-out]').boundingBox();
      if (!out || out.y + out.height > 900 + 1 || out.y < 0) zle(`390px: panel wyjaśnienia poza ekranem (${JSON.stringify(out)})`);
      for (const [sel, nazwa] of [['[data-zam]', 'zamiana'], ['[data-ck]', 'cwiczenie-kody'], ['.k-flt', 'filtr'], ['.k-prz', 'przesuniecie']]) {
        const el = p.locator(sel).first();
        await el.scrollIntoViewIfNeeded();
        await el.screenshot({ path: OUT + `${nazwa}-390.png` });
      }
    }
    bledy.forEach((e) => zle(`${w}px: błąd JS: ${e}`));
    await p.close();
  }
  await b.close();
  console.log(problemy.length ? `\nProblemów: ${problemy.length}` : '\nOK: bez problemów.');
  process.exit(problemy.length ? 1 : 0);
})();
