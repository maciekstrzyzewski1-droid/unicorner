// Silnik strony głównej (wariant „Siatka”): wygładzone przewijanie, menu i jedna pętla klatek dla wszystkiego,
// co zależy od scrolla albo kursora.
// Zasady:
//  - jedna pętla requestAnimationFrame; najpierw wszystkie odczyty położeń, potem wszystkie zapisy stylów,
//  - liczymy tylko to, co jest w pobliżu ekranu (IntersectionObserver),
//  - ruszamy wyłącznie transform, opacity, clip-path i zmienne CSS na małych poddrzewach,
//  - przy „ogranicz ruch” pętla nie startuje: CSS pokazuje stan końcowy, napis rysuje jedną nieruchomą klatkę.
import Lenis from 'lenis';
import { startNapis } from './napis.js';

const html = document.documentElement;
const RM = html.classList.contains('rm');
const mysz = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const ogr = (v, a, b) => Math.min(b, Math.max(a, v));
const lagodnie = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const nav = $('[data-nav]');
const marka = $('[data-marka]');

// ---------- wygładzone przewijanie: tylko mysz albo gładzik, nigdy na dotyku i nigdy przy „ogranicz ruch” ----------
let lenis = null;
if (!RM && mysz) lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, autoRaf: false, anchors: { duration: 1.3 } });

// ---------- menu na wąskich ekranach: natywny <dialog> ----------
const menu = $('#menu');
if (menu && menu.showModal) {
  $('[data-menu-otworz]').addEventListener('click', () => { menu.showModal(); if (lenis) lenis.stop(); });
  $('[data-menu-zamknij]', menu).addEventListener('click', () => menu.close());
  menu.addEventListener('click', (e) => { if (e.target === menu) menu.close(); });
  menu.addEventListener('close', () => { if (lenis) lenis.start(); });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => { if (lenis) lenis.start(); menu.close(); }));
  matchMedia('(min-width: 960px)').addEventListener('change', (m) => { if (m.matches && menu.open) menu.close(); });
}

// ---------- co jest w pobliżu ekranu ----------
const widac = new Map();
const io = new IntersectionObserver((w) => w.forEach((e) => widac.set(e.target, e.isIntersecting)), { rootMargin: '20% 0px 20% 0px' });
const sledz = (el) => { if (el) { widac.set(el, false); io.observe(el); } return el; };

const heroWrap = sledz($('[data-hero]'));
const hero = $('.hero');
const scena = $('[data-napis]');
const tytulNapisu = scena ? $('.napis-t', scena) : null;
const podlogi = $$('[data-podloga]').map((el) => ({ el, rodzic: sledz(el.parentNode), anim: null, w: null, tempo: 0 }));
const swiatlo = $('[data-swiatlo]');
const swSiatka = swiatlo ? $('.sw-siatka', swiatlo) : null;
const grupy = $$('[data-poswiata]').map((el) => ({ el: sledz(el), panele: $$('.pw', el).map((p) => ({ el: p, x: 0, y: 0, w: 0, h: 0, gi: 0, blask: null })), czysto: true }));
// blask ramek tylko przy myszy (na dotyku świeci cała karta na wysokości wzroku, klasą .na)
if (mysz && !RM) for (const g of grupy) for (const p of g.panele) {
  const b = document.createElement('i');
  b.className = 'pw-blask'; b.setAttribute('aria-hidden', 'true');
  p.el.insertBefore(b, p.el.firstChild);
  p.blask = b;
}
const karty = grupy.find((g) => g.el.classList.contains('karty'));
const tytuly = $$('[data-tytul]').map((el) => ({ el: sledz(el), w: -1, tx: 0 }));
const zdanie = sledz($('[data-zdanie]'));
const slowa = zdanie ? $$('.s', zdanie) : [];
const krokiBlok = sledz($('[data-kroki]'));
const kroki = krokiBlok ? $$('.kroki li', krokiBlok) : [];
const demo = sledz($('[data-demo]'));

// wejście kart: raz, gdy siatka kart pojawi się na ekranie
const wejscie = $('[data-wejscie]');
if (wejscie) {
  const raz = new IntersectionObserver((w) => { if (w[0].isIntersecting) { wejscie.classList.add('wchodzi'); raz.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
  raz.observe(wejscie);
}

// ---------- kursor: jedno źródło prawdy dla światła na siatce, poświaty ramek i refleksu na napisie ----------
let kx = -9999, ky = -9999, kJest = false, lx = 0, ly = 0, lStart = false;
if (mysz && !RM) {
  addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; kx = e.clientX; ky = e.clientY; kJest = true; }, { passive: true });
  document.addEventListener('pointerleave', () => { kJest = false; });
  addEventListener('blur', () => { kJest = false; });
}

// ---------- pomiary (na starcie, po zmianie rozmiaru i po wczytaniu fontów) ----------
let vh = innerHeight;
const dok = { gotowy: false, tx: 0, ty: 0, s: 1 };
function prostokatTekstu(el) { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); }
function pomiar() {
  vh = innerHeight;
  for (const g of grupy) for (const p of g.panele) { p.x = p.el.offsetLeft; p.y = p.el.offsetTop; p.w = p.el.offsetWidth; p.h = p.el.offsetHeight; }
  // dokowanie napisu do nawigacji: dokąd i jak bardzo trzeba go zmniejszyć (liczone bez bieżącej transformacji)
  if (scena && marka && tytulNapisu) {
    const poprz = scena.style.transform; scena.style.transform = 'none';
    const rs = scena.getBoundingClientRect(), rh = hero.getBoundingClientRect(), rt = prostokatTekstu(tytulNapisu), rm = prostokatTekstu(marka);
    scena.style.transform = poprz;
    if (rt.width > 10 && rm.width > 2) {
      const s = rm.width / rt.width;
      // scena ma transform-origin w lewym górnym rogu; przy przypiętym hero jego róg leży w (0,0) okna
      dok.s = s;
      dok.tx = rm.left - (rs.left - rh.left) - s * (rt.left - rs.left);
      dok.ty = rm.top - (rs.top - rh.top) - s * (rt.top - rs.top);
      dok.gotowy = true;
    }
  }
}

// ---------- hasło w hero: krótkie „odszyfrowanie” po wczytaniu (motyw znany z dotychczasowej strony) ----------
function odszyfruj(el, opoznienie) {
  const calosc = el.textContent, znaki = 'ΞΔΣΨΩλØ¥§¤µ†‡/\\|=+<>^?#%$@01'.split('');
  el.setAttribute('aria-label', calosc);
  let start = -1;
  const krok = (t) => {
    if (start < 0) start = t;
    const czas = t - start - opoznienie;
    if (czas < 0) { el.textContent = ''; requestAnimationFrame(krok); return; }
    const gotowe = Math.floor(czas / 34);
    if (gotowe >= calosc.length) { el.textContent = calosc; return; }
    let s = calosc.slice(0, gotowe);
    for (let i = gotowe; i < Math.min(calosc.length, gotowe + 5); i++) s += calosc[i] === ' ' ? ' ' : znaki[(Math.random() * znaki.length) | 0];
    el.textContent = s;
    requestAnimationFrame(krok);
  };
  requestAnimationFrame(krok);
}

// ---------- pętla ----------
let wynik = { napis: null, dopasuj() {} };
let ostY = scrollY, ostT = 0, pred = 0;
let oHp = -1, oG = -1, oP = -1, oSw = -1, oNa = null, oPrzew = null, oPoHero = null, oZgasl = null, oDok = null, oE = -1, oLx = -1, oLy = -1, oJest = null;

function klatka(t) {
  if (lenis) lenis.raf(t);
  const dt = ogr(t - ostT || 16.7, 1, 64); ostT = t;
  const y = scrollY, dy = y - ostY; ostY = y;
  pred += (ogr((Math.abs(dy) * (16.7 / dt)) / (vh * 0.03), 0, 1.6) - pred) * 0.1;

  // --- odczyty ---
  const heroWidac = widac.get(heroWrap);
  const rHero = heroWidac ? heroWrap.getBoundingClientRect() : null;
  const rScena = heroWidac && wynik.napis && kJest ? scena.getBoundingClientRect() : null;
  const rGrupy = grupy.map((g) => (widac.get(g.el) && (kJest || !g.czysto || (!mysz && g === karty)) ? g.el.getBoundingClientRect() : null));
  const rTytuly = tytuly.map((ty) => (widac.get(ty.el) ? ty.el.getBoundingClientRect() : null));
  const rZd = widac.get(zdanie) ? zdanie.getBoundingClientRect() : null;
  const rKr = widac.get(krokiBlok) ? krokiBlok.getBoundingClientRect() : null;
  const rDemo = widac.get(demo) ? demo.getBoundingClientRect() : null;

  // --- zapisy ---
  const przew = dok.gotowy ? oDok === true : y > 24;
  if (przew !== oPrzew) { nav.classList.toggle('przewiniete', przew); oPrzew = przew; }
  const poHero = y > vh * 0.35;
  if (poHero !== oPoHero) { nav.classList.toggle('po-hero', poHero); oPoHero = poHero; }

  // hero: 0 na górze, 1 gdy przypięcie się kończy; napis leci do nawigacji
  if (rHero) {
    const zakres = rHero.height - vh;
    const hp = zakres > 10 ? ogr(-rHero.top / zakres, 0, 1) : 0;
    if (Math.abs(hp - oHp) > 0.0005) { hero.style.setProperty('--hp', hp.toFixed(4)); oHp = hp; }
    const zgasl = hp > 0.4;
    if (zgasl !== oZgasl) { hero.classList.toggle('zgaszony', zgasl); oZgasl = zgasl; }
    if (dok.gotowy) {
      const e = lagodnie(ogr((hp - 0.04) / 0.88, 0, 1));
      if (Math.abs(e - oE) > 0.0004) {
        scena.style.transform = `translate3d(${(dok.tx * e).toFixed(2)}px,${(dok.ty * e).toFixed(2)}px,0) scale(${(1 + (dok.s - 1) * e).toFixed(5)})`;
        oE = e;
      }
      const zadok = e > 0.992;
      if (zadok !== oDok) { nav.classList.toggle('zadokowany', zadok); scena.style.opacity = zadok ? '0' : ''; oDok = zadok; }
    }
  } else if (oDok !== true && y > vh * 0.5) {
    // hero zniknął z okolic ekranu (np. skok kotwicą): marka w nawigacji musi być widoczna
    nav.classList.add('zadokowany'); scena.style.opacity = '0'; oDok = true;
  }

  // podłogi: dryf to animacja CSS liczona przez kartę graficzną; tu tylko zmieniamy jej tempo (szybciej przy scrollu)
  // i pauzujemy ją poza ekranem. Przestawianie transformu ze skryptu co klatkę zmuszało przeglądarkę do malowania
  // warstwy 3D od nowa (pomiar: telefon 34 kl/s zamiast 60).
  for (const p of podlogi) {
    const w = !!widac.get(p.rodzic);
    if (!p.anim) { p.anim = document.getAnimations().find((a) => a.animationName === 'podloga' && a.effect && a.effect.target === p.el) || null; if (!p.anim) continue; }
    if (w !== p.w) { p.w = w; if (w) p.anim.play(); else p.anim.pause(); }
    if (!w) continue;
    const tempo = Math.round((1 + pred * 18) * 2) / 2;   // skok co 0,5, żeby nie wysyłać zmiany co klatkę
    if (tempo !== p.tempo) { p.tempo = tempo; if (p.anim.updatePlaybackRate) p.anim.updatePlaybackRate(tempo); else p.anim.playbackRate = tempo; }
  }

  // światło kursora na siatce tła
  if (swiatlo) {
    if (kJest !== oJest) { swiatlo.classList.toggle('jest', kJest); oJest = kJest; }
    if (kJest) {
      if (!lStart) { lx = kx; ly = ky; lStart = true; }
      lx += (kx - lx) * 0.2; ly += (ky - ly) * 0.2;
      if (Math.abs(lx - oLx) > 0.1 || Math.abs(ly - oLy) > 0.1) {
        swiatlo.style.transform = `translate3d(${lx.toFixed(1)}px,${ly.toFixed(1)}px,0)`;
        swSiatka.style.transform = `translate3d(${(320 - lx).toFixed(1)}px,${(320 - ly).toFixed(1)}px,0)`;
        oLx = lx; oLy = ly;
      }
    }
  }

  // poświata ramek: im bliżej kursora, tym jaśniej; środek poświaty w miejscu kursora
  const R = 380, blisko = R * 0.5, daleko = R * 0.75;
  grupy.forEach((g, i) => {
    const r = rGrupy[i];
    if (!r) return;
    if (!mysz) {
      if (g !== karty) return;
      // dotyk: świeci karta na wysokości wzroku
      const cel = vh * 0.42 - r.top;
      let naj = null, najOdl = 1e9;
      for (const p of g.panele) { const o = Math.abs(p.y + p.h / 2 - cel); if (o < najOdl) { najOdl = o; naj = p.el; } }
      if (najOdl > vh * 0.5) naj = null;
      if (naj !== oNa) { if (oNa) oNa.classList.remove('na'); if (naj) naj.classList.add('na'); oNa = naj; }
      return;
    }
    let cos = false;
    for (const p of g.panele) {
      let gi = 0;
      const mx = kx - r.left - p.x, my = ky - r.top - p.y;
      if (kJest) {
        const odl = Math.max(0, Math.hypot(mx - p.w / 2, my - p.h / 2) - Math.max(p.w, p.h) / 2);
        gi = odl <= blisko ? 1 : odl <= daleko ? (daleko - odl) / (daleko - blisko) : 0;
      }
      if (gi > 0 || p.gi > 0) {
        // blask to osobna warstwa: przesuwamy ją i rozjaśniamy (transform + opacity), więc nic nie jest malowane od nowa
        const st = p.blask.style;
        if (gi > 0) st.transform = `translate3d(${mx.toFixed(1)}px,${my.toFixed(1)}px,0) scale(4)`;
        st.opacity = gi.toFixed(3);
        p.gi = gi;
      }
      if (gi > 0) cos = true;
    }
    g.czysto = !cos;
  });

  // refleks kursora na napisie
  if (wynik.napis) {
    if (rScena) wynik.napis.kursor(kx, ky, rScena, true); else wynik.napis.kursor(0, 0, null, false);
    if (heroWidac && oDok !== true) wynik.napis.klatka(t, pred);
  }

  // tytuły sekcji: obrys wypełnia się fioletem, napis lekko dryfuje w bok
  tytuly.forEach((ty, i) => {
    const r = rTytuly[i];
    if (!r) return;
    const w = ogr((vh * 0.98 - r.top) / (vh * 0.5), 0, 1);
    const zasieg = Math.min(46, innerWidth * 0.025);   // na wąskich ekranach dryf jest mniejszy, żeby tytuł nie wyjeżdżał poza margines
    const tx = ogr(((r.top + r.height / 2 - vh / 2) / vh) * zasieg, -zasieg, zasieg);
    if (Math.abs(w - ty.w) > 0.002) { ty.el.style.setProperty('--w', w.toFixed(3)); ty.w = w; }
    if (Math.abs(tx - ty.tx) > 0.2) { ty.el.style.setProperty('--tx', tx.toFixed(1) + 'px'); ty.tx = tx; }
  });

  // zdanie: słowa zapalają się w miarę przewijania, ostatnie zapalone ma kursor terminala
  if (rZd) {
    const p = ogr((vh * 0.86 - rZd.top) / (rZd.height + vh * 0.2), 0, 1), ile = Math.round(p * slowa.length);
    if (ile !== oSw) {
      const a = Math.min(ile, oSw < 0 ? 0 : oSw), b = Math.max(ile, oSw < 0 ? slowa.length : oSw);
      for (let k = Math.max(0, a - 1); k < Math.min(slowa.length, b + 1); k++) {
        slowa[k].classList.toggle('on', k < ile);
        slowa[k].classList.toggle('czolo', k === ile - 1 && ile < slowa.length);
      }
      oSw = ile;
    }
  }

  // kroki: szyna się wypełnia, panele zapalają się po kolei
  if (rKr) {
    const p = ogr((vh * 0.86 - rKr.top) / (vh * 0.42), 0, 1);
    if (Math.abs(p - oP) > 0.002) {
      krokiBlok.style.setProperty('--p', p.toFixed(3)); oP = p;
      kroki.forEach((li, k) => { const on = p >= (k + 0.12) / kroki.length; if (li._on !== on) { li._on = on; li.classList.toggle('on', on); } });
    }
  }

  // generator: scena liczy się w CSS ze zmiennej --g
  if (rDemo) {
    const g = ogr((vh * 0.92 - rDemo.top) / (vh * 0.72), 0, 1);
    if (Math.abs(g - oG) > 0.002) { demo.style.setProperty('--g', g.toFixed(3)); oG = g; }
  }

  requestAnimationFrame(klatka);
}

// ---------- start ----------
pomiar();
let czekaj = 0;
addEventListener('resize', () => {
  clearTimeout(czekaj);
  czekaj = setTimeout(() => { wynik.dopasuj(); pomiar(); oE = -1; if (RM && wynik.napis) wynik.napis.klatka(performance.now(), 0); }, 150);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(pomiar);

startNapis().then((w) => {
  wynik = w;
  pomiar();   // wielkość liter jest już dopasowana, więc cel dokowania liczymy jeszcze raz
  oE = -1;
  if (RM && w.napis) w.napis.klatka(performance.now(), 0);
});

html.classList.add('gotowe');
if (RM) {
  const tlo = () => { nav.classList.toggle('przewiniete', scrollY > 24); nav.classList.toggle('po-hero', scrollY > innerHeight * 0.35); };
  addEventListener('scroll', tlo, { passive: true }); tlo();
} else {
  const haslo = $('[data-szyfr]');
  if (haslo) odszyfruj(haslo, 620);
  requestAnimationFrame(klatka);
}
