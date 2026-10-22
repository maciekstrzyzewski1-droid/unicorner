// Kontrola modułu „Operacje i konta bilansowe” w przeglądarce: błędy JS, szerokości na 1440/390/360 px (po „Pokaż wszystko”),
// animacje kont krok po kroku do końca, ćwiczenia (Pokaż → Sprawdź = wszystko dobrze), klasyfikatory, quizy, kotwice, zrzuty.
// Użycie: npx astro preview (osobno), potem NODE_PATH=<katalog z playwright>/node_modules URL=… OUT=… node kontrola.cjs
const { chromium } = require('playwright');
const URL = process.env.URL || 'http://localhost:4321/rachunkowosc/konta.html';
const OUT = (process.env.OUT || '/tmp/zrzuty') + '/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
  for (const w of [1440, 390, 360]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const bledy = [];
    p.on('pageerror', (e) => bledy.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error') bledy.push(m.text()); });
    await p.goto(URL, { waitUntil: 'networkidle' });
    if (w === 390) await p.screenshot({ path: OUT + 'top-390.png' });
    // pokaż wszystkie kroki rozwiązań
    for (const btn of await p.locator('.k-rozw-ctl [data-all]').all()) if (await btn.isVisible()) await btn.click();
    await p.waitForTimeout(300);
    const szer = await p.evaluate(() => {
      const zle = [];
      document.querySelectorAll('.k-ramka, .k-tab, .k-t, .k-ks-konta, .k-typy, .k-typ, .k-kr, .k-pol, .k-klas, .k-ct, .k-ks-bt, .k-fig-box, .k-sciaga, .k-symbole').forEach((el) => {
        if (el.offsetParent === null) return;
        if (el.scrollWidth > el.clientWidth + 1) zle.push({ cls: el.className.slice(0, 40), sw: el.scrollWidth, cw: el.clientWidth, ov: getComputedStyle(el).overflowX, txt: (el.textContent || '').slice(0, 50) });
      });
      const ids = new Set(Array.from(document.querySelectorAll('[id]')).map((e) => e.id));
      const brak = Array.from(document.querySelectorAll('a[href^="#"]')).map((a) => a.getAttribute('href').slice(1)).filter((h) => h && !ids.has(h));
      // saldo po właściwej stronie: liczba pod „Sk Ma” (lewa kolumna) tylko przy przewadze Ma, pod „Sk Wn” (prawa) — przy przewadze Wn
      const num = (el) => Number((el?.textContent || '').replace(/\D/g, '') || 0);
      const salda = [];
      document.querySelectorAll('.k-t').forEach((t) => {
        const ow = num(t.querySelector('[data-el="obr-wn"] .k-t-kw')), om = num(t.querySelector('[data-el="obr-ma"] .k-t-kw'));
        if (!t.querySelector('[data-el="obr-wn"]')) return;
        const lewa = num(t.querySelector('.k-t-foot .is-sk.is-wn .k-t-kw')), prawa = num(t.querySelector('.k-t-foot .is-sk.is-ma .k-t-kw'));
        const ok = ow > om ? (prawa === ow - om && !lewa) : om > ow ? (lewa === om - ow && !prawa) : (!lewa && !prawa);
        if (!ok) salda.push((t.querySelector('.k-t-nazwa')?.textContent || '') + ` ${ow}/${om} L${lewa} P${prawa}`);
      });
      return { doc: document.documentElement.scrollWidth, win: window.innerWidth, zle, brak, salda, ileKont: document.querySelectorAll('.k-t').length };
    });
    // animacje kont: start → Dalej do końca, sprawdź, że na końcu nic nie jest puste
    const anim = [];
    const boxy = await p.locator('[data-ks]').all();
    for (let i = 0; i < boxy.length; i++) {
      const box = boxy[i];
      const start = box.locator('[data-kk-start]');
      if (!(await start.isVisible())) { anim.push('niewidoczny start ' + i); continue; }
      await start.click();
      const licz = box.locator('[data-kk-licz]');
      let tekst = await licz.textContent();
      const ile = Number(tekst.match(/z (\d+)/)[1]);
      const puste0 = await box.locator('.is-pusta').count();
      for (let k = 1; k < ile; k++) { await box.locator('[data-kk-next]').click(); await p.waitForTimeout(w === 1440 ? 2000 : 1500); }
      tekst = await licz.textContent();
      const puste = await box.locator('.is-pusta').count();
      if (w === 390 && i === 0) await box.screenshot({ path: OUT + `anim${i}-koniec-390.png` });
      if (w === 1440) await box.screenshot({ path: OUT + `anim${i}-koniec-1440.png` });
      anim.push(`${i}: ${tekst}, pustych na starcie ${puste0}, na końcu ${puste}`);
      await box.locator('[data-kk-stop]').click();
    }
    // ćwiczenia „zaksięguj sam”: Pokaż odpowiedzi → Sprawdź → „Wszystko dobrze”
    const cw = [];
    for (const box of await p.locator('[data-ck], [data-cks]').all()) {
      await box.locator('[data-pokaz]').click();
      await box.locator('[data-check]').click();
      cw.push(((await box.locator('[data-sum]').textContent()) || '').slice(0, 40));
      await box.locator('[data-clear]').click();
    }
    // jedno złe pole → wyjaśnienie
    const ck = p.locator('[data-ck]').first();
    await ck.locator('[data-pole="obrWn"]').fill('123');
    await ck.locator('[data-check]').click();
    const zleWyj = await ck.locator('[data-bledy] li').count();
    if (w === 390) await ck.screenshot({ path: OUT + 'cw-konto-blad-390.png' });
    await ck.locator('[data-clear]').click();
    // klasyfikatory: klik w dobrą kategorię wszędzie
    let klasOk = 0, klasIle = 0;
    for (const it of await p.locator('.k-klas-item').all()) {
      const kat = await it.getAttribute('data-kat');
      await it.locator(`.k-opt[data-i="${kat}"]`).click();
      klasIle++; if ((await it.getAttribute('data-done')) === 'ok') klasOk++;
    }
    // quizy: same dobre odpowiedzi
    const quizy = [];
    for (const q of await p.locator('.k-pyt').all()) {
      for (const it of await q.locator('.k-pyt-item').all()) await it.locator(`.k-opt[data-i="${await it.getAttribute('data-dobra')}"]`).click();
      const wy = q.locator('[data-wynik]');
      if (await wy.count()) quizy.push(await wy.textContent());
    }
    console.log(JSON.stringify({ w, bledy, doc: szer.doc, win: szer.win, zle: szer.zle, brakKotwic: szer.brak, zleSalda: szer.salda, ileKont: szer.ileKont, anim, cw, zleWyj, klas: `${klasOk}/${klasIle}`, quizy }, null, 1));
    if (w === 1440) {
      await p.screenshot({ path: OUT + 'cala-1440.png', fullPage: true });
    }
    if (w === 390) await p.screenshot({ path: OUT + 'cala-390.png', fullPage: true });
    await p.close();
  }
  await b.close();
})();
