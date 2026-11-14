// Silnik strony głównej: wygładzone przewijanie, menu i jedna pętla klatek dla wszystkiego, co zależy od scrolla.
// Zasady:
//  - jedna pętla requestAnimationFrame; najpierw wszystkie odczyty położeń, potem wszystkie zapisy stylów,
//  - liczymy tylko sekcje, które są w pobliżu ekranu (IntersectionObserver),
//  - ruszamy wyłącznie transform, opacity, clip-path i zmienne CSS na małych poddrzewach,
//  - przy „ogranicz ruch” pętla nie startuje: CSS pokazuje stan końcowy, chrom rysuje jedną nieruchomą klatkę.
import Lenis from 'lenis';
import { startChrom } from './chrom.js';

const html = document.documentElement;
const RM = html.classList.contains('rm');
const mysz = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const ogr = (v, a, b) => Math.min(b, Math.max(a, v));

const nav = $('[data-nav]');

// ---------- wygładzone przewijanie: tylko mysz albo gładzik, nigdy na dotyku i nigdy przy „ogranicz ruch” ----------
let lenis = null;
if (!RM && mysz) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, autoRaf: false, anchors: { offset: -(nav ? nav.offsetHeight : 0) + 1, duration: 1.3 } });
}

// ---------- menu na wąskich ekranach: natywny <dialog> (pułapka fokusu i Esc są w przeglądarce) ----------
const menu = $('#menu');
if (menu && menu.showModal) {
  const otworz = $('[data-menu-otworz]');
  otworz.addEventListener('click', () => { menu.showModal(); if (lenis) lenis.stop(); });
  $('[data-menu-zamknij]', menu).addEventListener('click', () => menu.close());
  menu.addEventListener('click', (e) => { if (e.target === menu) menu.close(); });
  menu.addEventListener('close', () => { if (lenis) lenis.start(); });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => { if (lenis) lenis.start(); menu.close(); }));
  matchMedia('(min-width: 960px)').addEventListener('change', (m) => { if (m.matches && menu.open) menu.close(); });
}

// ---------- co jest w pobliżu ekranu ----------
const widac = new Map();
const io = new IntersectionObserver((w) => w.forEach((e) => widac.set(e.target, e.isIntersecting)), { rootMargin: '25% 0px 25% 0px' });
const sledz = (el) => { if (el) { widac.set(el, false); io.observe(el); } return el; };

const heroWrap = sledz($('[data-hero]'));
const hero = $('.hero');
const tasmy = sledz($('.tasmy'));
const tory = $$('[data-tor]').map((el) => ({ el, v: parseFloat(el.dataset.predkosc) || 1, x: 0, w: 0 }));
const lista = sledz($('[data-lista]'));
const wiersze = lista ? $$('.wiersz', lista).map((el) => ({ el, gora: 0, wys: 0 })) : [];
const zdanie = sledz($('[data-zdanie]'));
const slowa = zdanie ? $$('.s', zdanie) : [];
const droga = sledz($('[data-droga]'));
const demo = sledz($('[data-demo]'));
const czyt = sledz($('[data-czyt]'));
const kreska = czyt ? $('.czyt-kreska', czyt) : null;
const stopka = sledz($('[data-stopka]'));

// wejście listy przedmiotów: raz, gdy lista pojawi się na ekranie
if (lista) {
  const raz = new IntersectionObserver((w) => { if (w[0].isIntersecting) { lista.classList.add('wchodzi'); raz.disconnect(); } }, { rootMargin: '0px 0px -12% 0px' });
  raz.observe(lista);
}

// ---------- droga „Jak korzystać”: krzywa, po której jedzie kropka ----------
// Krzywa rośnie tylko w prawo, więc postęp liczymy po osi X: kolorowa linia jest odsłaniana przycięciem,
// a wysokość kropki bierzemy z tabeli punktów krzywej.
let dr = null;
if (droga) {
  const rys = $('.droga-rys', droga), linia = $('.dr-linia', droga), kropka = $('.dr-kropka', droga), kroki = $$('.kroki li', droga);
  const dl = linia.getTotalLength(), tab = [];
  for (let i = 0; i <= 160; i++) { const p = linia.getPointAtLength((dl * i) / 160); tab.push([p.x / 1000, p.y / 200]); }
  const x0 = tab[0][0], x1 = tab[tab.length - 1][0];
  const wysokosc = (x) => {
    let a = 0, b = tab.length - 1;
    while (b - a > 1) { const m = (a + b) >> 1; if (tab[m][0] < x) a = m; else b = m; }
    const f = (x - tab[a][0]) / (tab[b][0] - tab[a][0] || 1);
    return tab[a][1] + (tab[b][1] - tab[a][1]) * ogr(f, 0, 1);
  };
  // węzły kroków na krzywej
  kroki.forEach((li, i) => {
    const x = x0 + ((x1 - x0) * i) / (kroki.length - 1);
    const w = document.createElement('span');
    w.className = 'dr-wezel'; w.setAttribute('aria-hidden', 'true');
    w.style.left = (x * 100).toFixed(2) + '%'; w.style.top = (wysokosc(x) * 100).toFixed(2) + '%';
    rys.insertBefore(w, kropka);
    li._wezel = w;
  });
  dr = { rys, kolor: $('.droga-kolor', droga), kropka, kroki, x0, x1, wysokosc, sw: 0, sh: 0, ost: -1 };
}

// ---------- pomiary (na starcie, po zmianie rozmiaru i po wczytaniu fontów) ----------
let vh = innerHeight;
function pomiar() {
  vh = innerHeight;
  for (const t of tory) t.w = t.el.scrollWidth / 2;
  for (const w of wiersze) { w.gora = w.el.offsetTop; w.wys = w.el.offsetHeight; }
  if (dr) { dr.sw = dr.rys.offsetWidth; dr.sh = dr.rys.offsetHeight; dr.ost = -1; }
}

// ---------- pętla ----------
let chrom = { lista: [], dopasuj() {} };
let ostY = scrollY, ostT = 0, pred = 0, kier = 1, kierS = 1;
let oHp = -1, oSp = -1, oG = -1, oCz = -1, oSw = -1, oNa = null, oPrzew = null, oPoHero = null;

function klatka(t) {
  if (lenis) lenis.raf(t);
  const dt = ogr(t - ostT || 16.7, 1, 64); ostT = t;
  const y = scrollY, dy = y - ostY; ostY = y;
  pred += (ogr((Math.abs(dy) * (16.7 / dt)) / (vh * 0.03), 0, 1.6) - pred) * 0.1;
  if (dy) kier = dy > 0 ? 1 : -1;
  kierS += (kier - kierS) * 0.06;

  // --- odczyty ---
  const rHero = widac.get(heroWrap) ? heroWrap.getBoundingClientRect() : null;
  const rLista = !mysz && widac.get(lista) ? lista.getBoundingClientRect() : null;
  const rZd = widac.get(zdanie) ? zdanie.getBoundingClientRect() : null;
  const rDr = dr && widac.get(droga) ? droga.getBoundingClientRect() : null;
  const rDemo = widac.get(demo) ? demo.getBoundingClientRect() : null;
  const rCz = widac.get(czyt) ? czyt.getBoundingClientRect() : null;
  const rSt = widac.get(stopka) ? stopka.getBoundingClientRect() : null;

  // --- zapisy ---
  const przew = y > 24;
  if (przew !== oPrzew) { nav.classList.toggle('przewiniete', przew); oPrzew = przew; }
  const poHero = y > vh * 0.35;
  if (poHero !== oPoHero) { nav.classList.toggle('po-hero', poHero); oPoHero = poHero; }

  // hero: 0 na górze, 1 gdy przypięcie się kończy
  let hp = oHp < 0 ? 0 : oHp;
  if (rHero) {
    const zakres = rHero.height - vh;
    hp = zakres > 10 ? ogr(-rHero.top / zakres, 0, 1) : 0;
    if (Math.abs(hp - oHp) > 0.0005) { hero.style.setProperty('--hp', hp.toFixed(4)); oHp = hp; }
  }

  // taśmy: stały dryf, szybciej przy scrollu, kierunek za kierunkiem przewijania
  if (widac.get(tasmy)) {
    for (const tr of tory) {
      tr.x -= tr.v * (34 + pred * 520) * (dt / 1000) * kierS;
      if (tr.w) { if (tr.x <= -tr.w) tr.x += tr.w; else if (tr.x > 0) tr.x -= tr.w; }
      tr.el.style.transform = `translate3d(${tr.x.toFixed(1)}px,0,0)`;
    }
  }

  // indeks na dotyku: podświetl wiersz, który jest na wysokości wzroku
  if (rLista) {
    const cel = vh * 0.42 - rLista.top;
    let naj = null, najOdl = 1e9;
    for (const w of wiersze) { const o = Math.abs(w.gora + w.wys / 2 - cel); if (o < najOdl) { najOdl = o; naj = w.el; } }
    if (najOdl > vh * 0.5) naj = null;
    if (naj !== oNa) { if (oNa) oNa.classList.remove('na'); if (naj) naj.classList.add('na'); oNa = naj; }
  }

  // zdanie: słowa zapalają się w miarę przewijania
  if (rZd) {
    const p = ogr((vh * 0.84 - rZd.top) / (rZd.height + vh * 0.3), 0, 1), ile = Math.round(p * slowa.length);
    if (ile !== oSw) {
      const a = Math.min(ile, oSw < 0 ? 0 : oSw), b = Math.max(ile, oSw < 0 ? slowa.length : oSw);
      for (let i = a; i < b; i++) slowa[i].classList.toggle('on', i < ile);
      oSw = ile;
    }
  }

  // droga: linia odsłania się, kropka jedzie po krzywej, kroki zapalają się po kolei
  if (rDr) {
    const p = ogr((vh * 0.82 - rDr.top) / (vh * 0.57), 0, 1);
    if (Math.abs(p - dr.ost) > 0.001) {
      dr.ost = p;
      droga.style.setProperty('--p', p.toFixed(4));
      const x = dr.x0 + (dr.x1 - dr.x0) * p;
      dr.kolor.style.clipPath = `inset(-20% ${((1 - x) * 100).toFixed(2)}% -20% 0)`;
      dr.kropka.style.transform = `translate3d(${(dr.sw * x).toFixed(1)}px,${(dr.sh * dr.wysokosc(x)).toFixed(1)}px,0)`;
      const n = dr.kroki.length - 1;
      dr.kroki.forEach((li, i) => { const on = p >= i / n - 0.015; if (li._on !== on) { li._on = on; li.classList.toggle('on', on); li._wezel.classList.toggle('on', on); } });
    }
  }

  // generator: scena liczy się w CSS ze zmiennej --g
  if (rDemo) {
    const g = ogr((vh * 0.92 - rDemo.top) / (vh * 0.74), 0, 1);
    if (Math.abs(g - oG) > 0.002) { demo.style.setProperty('--g', g.toFixed(3)); oG = g; }
  }

  // czytelnia: złota kreska rysuje się od lewej
  if (rCz && kreska) {
    const c = ogr((vh * 0.9 - rCz.top) / (vh * 0.6), 0, 1);
    if (Math.abs(c - oCz) > 0.002) { kreska.style.transform = `scaleX(${c.toFixed(3)})`; oCz = c; }
  }

  // stopka: wschód
  let sp = oSp < 0 ? 0 : oSp;
  if (rSt) {
    sp = ogr((vh - rSt.top) / vh, 0, 1);
    if (Math.abs(sp - oSp) > 0.002) { stopka.style.setProperty('--sp', sp.toFixed(3)); oSp = sp; }
  }

  for (const c of chrom.lista) if (c.widac) c.klatka(t, c.swit ? sp : hp, pred);

  requestAnimationFrame(klatka);
}

// ---------- start ----------
pomiar();
let czekaj = 0;
addEventListener('resize', () => {
  clearTimeout(czekaj);
  czekaj = setTimeout(() => { pomiar(); chrom.dopasuj(); if (RM) nieruchomo(); }, 150);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(pomiar);

function nieruchomo() { const t = performance.now(); for (const c of chrom.lista) c.klatka(t, c.swit ? 1 : 0, 0); }

startChrom().then((wynik) => {
  chrom = wynik;
  if (RM) nieruchomo();
});

html.classList.add('gotowe');
if (RM) {
  // bez pętli: nawigacja dostaje tło po przewinięciu zwykłym zdarzeniem
  const tlo = () => { nav.classList.toggle('przewiniete', scrollY > 24); nav.classList.toggle('po-hero', scrollY > innerHeight * 0.35); };
  addEventListener('scroll', tlo, { passive: true }); tlo();
} else {
  requestAnimationFrame(klatka);
}
