// Silnik ścieżki językowej (hiszpański; angielski użyje tego samego kodu z innym plikiem danych).
// Dane: start({ kurs, odznaki }) z modułu src/data/jezyki/*.js, importowanego w <script> komponentu Sciezka.astro.
// Ścieżka jest wyrenderowana statycznie (src/components/jezyki/Sciezka.astro); tu tylko ożywiamy stany
// węzłów, prowadzimy lekcje i zapisujemy postęp w localStorage (bez logowania; prywatne okno = brak zapisu).
import { awatar } from './awatar.js';
import { $, $$, h, tasuj, ruch } from './dom.js';
import { ustawJezyk, mowa, przyciskMowy, ozywMowe } from './mowa.js';
import { R, ETYKIETA, klawiatura, ustawPo } from './cwiczenia.js';

let KURS = null;

// ── zapis postępu ──
const dataStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dzis = () => dataStr(new Date());
const dzienPrzed = (s) => { const [r, m, d] = s.split('-').map(Number); return dataStr(new Date(r, m - 1, d - 1)); };
const wczoraj = () => dzienPrzed(dzis());
function nowyStan() { return { xp: 0, dzien: { data: dzis(), xp: 0 }, seria: { n: 0, ostatni: null }, lekcje: {}, odznaki: {}, bledy: [], odblok: {}, comboMax: 0, cel: 30 }; }
let KLUCZ = '';
let st = nowyStan();
const obiekt = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
const liczba = (x, d = 0) => (Number.isFinite(x) && x >= 0 ? x : d);
/** Zapis z localStorage może być stary albo uszkodzony — bierzemy z niego tylko poprawne pola. */
function napraw(z) {
  const s = nowyStan();
  if (!obiekt(z)) return s;
  s.xp = liczba(z.xp);
  s.comboMax = liczba(z.comboMax);
  s.cel = liczba(z.cel, 30) || 30;
  if (obiekt(z.dzien) && typeof z.dzien.data === 'string') s.dzien = { data: z.dzien.data, xp: liczba(z.dzien.xp) };
  if (obiekt(z.seria) && (z.seria.ostatni === null || typeof z.seria.ostatni === 'string')) s.seria = { n: liczba(z.seria.n), ostatni: z.seria.ostatni };
  if (obiekt(z.lekcje)) for (const [id, r] of Object.entries(z.lekcje)) {
    if (LEK.has(id) && obiekt(r)) s.lekcje[id] = { best: Math.min(100, liczba(r.best)), gw: Math.min(3, Math.round(liczba(r.gw))), razy: liczba(r.razy) };
  }
  if (obiekt(z.odznaki)) for (const [id, d] of Object.entries(z.odznaki)) if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) s.odznaki[id] = d;
  if (Array.isArray(z.bledy)) s.bledy = [...new Set(z.bledy.filter((k) => typeof k === 'string' && CW.has(k)))].slice(-80);
  if (obiekt(z.odblok)) for (const [sid, v] of Object.entries(z.odblok)) if (v === true) s.odblok[sid] = true;
  return s;
}
function wczytaj() {
  let zapis = null;
  try { const raw = localStorage.getItem(KLUCZ); if (raw) zapis = JSON.parse(raw); } catch { /* prywatne okno albo zły JSON */ }
  st = napraw(zapis);
  if (st.dzien.data !== dzis()) st.dzien = { data: dzis(), xp: 0 };
}
function zapisz() { try { localStorage.setItem(KLUCZ, JSON.stringify(st)); } catch { /* brak zapisu */ } }
const seriaTeraz = () => (st.seria.ostatni === dzis() || st.seria.ostatni === wczoraj() ? st.seria.n : 0);
/** Seria liczy dzień, w którym lekcja się zaczęła (lekcja przez północ nie zeruje serii). */
function zaliczDzien(d) {
  if (st.seria.ostatni === d) return;
  if (st.seria.ostatni && d < st.seria.ostatni) return;
  st.seria.n = st.seria.ostatni === dzienPrzed(d) ? st.seria.n + 1 : 1;
  st.seria.ostatni = d;
}

// ── struktura kursu ──
let WEZLY = [];          // kolejność na ścieżce: lekcje, powtórki sekcji, boss
const CW = new Map();    // klucz ćwiczenia → ćwiczenie
const LEK = new Map();   // id węzła → węzeł
let ODZNAKI = [];

function zbuduj(kurs) {
  WEZLY = [];
  for (const s of kurs.sekcje) {
    for (const u of s.jednostki) {
      for (const l of u.lekcje) {
        const w = { id: l.id, typ: 'lekcja', sekcja: s.id, jednostka: u.id, tytul: l.tytul, l, u, s };
        WEZLY.push(w);
        l.pula.forEach((c, i) => CW.set(`${l.id}#${i}`, c));
      }
    }
    if (s.powtorka) WEZLY.push({ id: s.powtorka.id, typ: 'powtorka', sekcja: s.id, tytul: s.powtorka.tytul, l: s.powtorka, s });
    if (s.boss) {
      WEZLY.push({ id: s.boss.id, typ: 'boss', sekcja: s.id, tytul: s.boss.tytul, l: s.boss, s });
      s.boss.retos.forEach((r, ri) => r.pula.forEach((c, i) => CW.set(`${s.boss.id}#${ri}.${i}`, { ...c, reto: ri })));
    }
  }
  WEZLY.forEach((w, i) => { w.nr = i; LEK.set(w.id, w); });
}

/** Ukończona = przerobiona do końca; boss (escape room) dopiero od 80% za pierwszym razem. */
const zrobione = (id) => {
  const r = st.lekcje[id];
  if (!r) return false;
  return LEK.get(id)?.typ === 'boss' ? r.best >= 80 : r.razy > 0;
};
/** Następny węzeł do zrobienia; po „Zacznij tutaj” prowadzimy od najdalszej odblokowanej sekcji. */
function nastepnyWezel() {
  const ok = (x) => dostepny(x) && !zrobione(x.id) && x.typ !== 'powtorka';
  const od = Math.max(0, ...Object.keys(st.odblok).map((sid) => WEZLY.findIndex((x) => x.sekcja === sid)));
  return WEZLY.slice(od).find(ok) || WEZLY.find(ok) || null;
}
function dostepny(w) {
  if (KURS.otwarte || w.nr === 0 || zrobione(w.id)) return true;
  const pierwszyWSekcji = WEZLY.find((x) => x.sekcja === w.sekcja) === w;
  if (pierwszyWSekcji && st.odblok[w.sekcja]) return true;
  let i = w.nr - 1;
  // powtórka sekcji nie blokuje dalszej drogi
  while (i >= 0 && WEZLY[i].typ === 'powtorka') i--;
  return i < 0 || zrobione(WEZLY[i].id);
}

function gotowosc() {
  const k = KURS.kolokwium;
  if (!k) return 0;
  const lekcje = WEZLY.filter((w) => w.typ === 'lekcja' && k.jednostki.includes(w.jednostka));
  const sr = lekcje.reduce((a, w) => a + (st.lekcje[w.id]?.best ?? 0), 0) / Math.max(1, lekcje.length);
  const boss = st.lekcje[k.boss]?.best ?? 0;
  return Math.round(sr * 0.75 + boss * 0.25);
}

// ── odznaki ──
function przyznaj(id, nowe) {
  if (st.odznaki[id]) return;
  st.odznaki[id] = dzis();
  const o = ODZNAKI.find((x) => x.id === id);
  if (o) nowe.push(o);
}
function sprawdzOdznaki(wynik) {
  const nowe = [];
  const ile = Object.values(st.lekcje).filter((x) => x.best > 0).length;
  if (ile >= 1) przyznaj('start', nowe);
  if (wynik && wynik.proc === 100 && wynik.typ !== 'bledy') przyznaj('perfekt', nowe);
  if (st.comboMax >= 10) przyznaj('combo10', nowe);
  if (seriaTeraz() >= 3) przyznaj('seria3', nowe);
  if (seriaTeraz() >= 7) przyznaj('seria7', nowe);
  if (st.xp >= 250) przyznaj('xp250', nowe);
  if (st.xp >= 1000) przyznaj('xp1000', nowe);
  if (wynik && wynik.typ === 'bledy') przyznaj('bledy', nowe);
  const s1 = WEZLY.filter((w) => w.typ === 'lekcja' && w.sekcja === 's1');
  if (s1.length && s1.every((w) => zrobione(w.id))) przyznaj('sekcja1', nowe);
  if (zrobione('u7l4')) przyznaj('opis', nowe);
  const u9 = WEZLY.filter((w) => w.jednostka === 'u9');
  if (u9.length && u9.every((w) => zrobione(w.id))) przyznaj('posesivos', nowe);
  if ((st.lekcje.boss1?.best ?? 0) >= 80) przyznaj('boss1', nowe);
  if (gotowosc() >= 90) przyznaj('gotowy', nowe);
  // odznaki opisane w danych kursu: { jednostka: 'uX' } albo { boss: 'id' }
  for (const o of ODZNAKI) {
    const wj = o.jednostka ? WEZLY.filter((w) => w.jednostka === o.jednostka) : [];
    if (wj.length && wj.every((w) => zrobione(w.id))) przyznaj(o.id, nowe);
    if (o.boss && (st.lekcje[o.boss]?.best ?? 0) >= 80) przyznaj(o.id, nowe);
  }
  return nowe;
}

// ── odświeżenie ścieżki i paneli ──
function odswiez() {
  if (st.dzien.data !== dzis()) st.dzien = { data: dzis(), xp: 0 };
  for (const w of WEZLY) {
    const el = document.querySelector(`[data-wezel="${w.id}"]`);
    if (!el) continue;
    const r = st.lekcje[w.id];
    const otw = dostepny(w);
    const gotowa = zrobione(w.id);
    el.classList.toggle('is-done', gotowa);
    el.classList.toggle('is-locked', !otw);
    const gw = $('.jz-gw', el);
    const ileGw = r ? Math.min(3, r.gw || 0) : 0;
    if (gw) gw.textContent = ileGw ? '★'.repeat(ileGw) + '☆'.repeat(3 - ileGw) : '';
    const stan = !otw ? 'zablokowana' : gotowa ? `ukończona, ${ileGw} z 3 gwiazdek` : 'do zrobienia';
    el.setAttribute('aria-label', `${w.tytul}: ${stan}`);
    el.classList.remove('is-next');
  }
  const nw = nastepnyWezel();
  if (nw) document.querySelector(`[data-wezel="${nw.id}"]`)?.classList.add('is-next');
  // jednostki: pasek postępu i trofeum
  for (const s of KURS.sekcje) for (const u of s.jednostki) {
    const box = document.querySelector(`[data-jednostka="${u.id}"]`);
    if (!box) continue;
    const ile = u.lekcje.filter((l) => zrobione(l.id)).length;
    const p = $('.jz-u-pasek i', box);
    if (p) p.style.width = `${(ile / u.lekcje.length) * 100}%`;
    const t = $('.jz-u-licz', box);
    if (t) t.textContent = `${ile}/${u.lekcje.length}`;
    const meta = document.querySelector(`[data-meta="${u.id}"]`);
    if (meta) meta.classList.toggle('is-done', ile === u.lekcje.length);
  }
  // HUD
  const set = (sel, v) => { for (const e of $$(sel)) e.textContent = v; };
  set('[data-hud="seria"]', seriaTeraz());
  set('[data-hud="xp"]', st.xp);
  set('[data-hud="dzis"]', `${st.dzien.xp}/${st.cel}`);
  for (const e of $$('[data-hud="dzis-pasek"]')) e.style.width = `${Math.min(100, (st.dzien.xp / st.cel) * 100)}%`;
  const g = gotowosc();
  set('[data-hud="gotowosc"]', `${g}%`);
  for (const e of $$('[data-hud="gotowosc-pasek"]')) e.style.width = `${g}%`;
  const nb = st.bledy.filter((k) => CW.has(k)).length;
  for (const b of $$('[data-akcja="bledy"]')) { b.disabled = nb === 0; $('.jz-ile', b) && ($('.jz-ile', b).textContent = nb); }
  // odznaki
  for (const o of $$('[data-odznaka]')) {
    const d = st.odznaki[o.dataset.odznaka];
    o.classList.toggle('is-got', !!d);
    const t = $('.jz-od-data', o);
    if (t) t.textContent = d ? `zdobyta ${d.split('-').reverse().join('.')}` : 'jeszcze nie';
  }
  for (const e of $$('[data-hud="odznaki"]')) e.textContent = `${Object.keys(st.odznaki).length}/${ODZNAKI.length}`;
}

// ── okna (modal) ──
function modal(tresc, przyciski = []) {
  const tlo = h('div', 'jz-modal-tlo');
  const m = h('div', 'jz-modal');
  m.setAttribute('role', 'dialog');
  m.setAttribute('aria-modal', 'true');
  if (typeof tresc === 'string') m.innerHTML = tresc; else m.append(tresc);
  const nag = $('h3', m);
  if (nag) { nag.id = nag.id || `jz-m-${Math.random().toString(36).slice(2, 8)}`; m.setAttribute('aria-labelledby', nag.id); }
  const powrot = document.activeElement;
  const dol = h('div', 'jz-modal-dol');
  const zamknij = () => {
    tlo.remove();
    document.removeEventListener('keydown', esc);
    if (!$('.jz-lekcja')) document.documentElement.classList.remove('jz-lock');
    if (powrot?.isConnected && !powrot.closest('[inert]')) powrot.focus({ preventScroll: true });
  };
  const esc = (e) => { if (e.key === 'Escape') zamknij(); };
  for (const [tekst, cls, fn] of przyciski) {
    const b = h('button', `jz-btn ${cls || ''}`, tekst);
    b.type = 'button';
    b.addEventListener('click', () => { zamknij(); fn && fn(); });
    dol.append(b);
  }
  if (!przyciski.length) {
    const b = h('button', 'jz-btn', 'Zamknij'); b.type = 'button'; b.addEventListener('click', zamknij); dol.append(b);
  }
  m.append(dol);
  tlo.append(m);
  tlo.addEventListener('click', (e) => { if (e.target === tlo) zamknij(); });
  document.addEventListener('keydown', esc);
  document.body.append(tlo);
  document.documentElement.classList.add('jz-lock');
  ozywMowe(m);
  $('button', dol)?.focus();
  return zamknij;
}


// ── lekcja ──
function zestaw(w) {
  if (w.typ === 'boss') {
    const out = [];
    w.l.retos.forEach((r, ri) => r.pula.forEach((c, i) => out.push(`${w.id}#${ri}.${i}`)));
    return out;
  }
  if (w.typ === 'bledy') return tasuj(st.bledy.filter((k) => CW.has(k))).slice(0, 12);
  if (w.typ === 'powtorka') {
    const klucze = [];
    for (const x of WEZLY) if (x.typ === 'lekcja' && x.sekcja === w.sekcja) x.l.pula.forEach((c, i) => { if (c.t !== 'pisz') klucze.push(`${x.id}#${i}`); });
    return tasuj(klucze).slice(0, w.l.ile || 14);
  }
  const klucze = w.l.pula.map((_, i) => `${w.id}#${i}`);
  // „pisz” zawsze na końcu, reszta losowo
  const zwykle = tasuj(klucze.filter((k) => CW.get(k).t !== 'pisz'));
  const pisz = klucze.filter((k) => CW.get(k).t === 'pisz');
  const n = Math.min(w.l.ile || 10, klucze.length);
  return [...zwykle.slice(0, n - Math.min(pisz.length, 1)), ...tasuj(pisz).slice(0, 1)];
}

function otworz(w) {
  if ($('.jz-lekcja')) return;                 // nigdy dwie lekcje naraz
  const klucze = zestaw(w);
  if (!klucze.length) return;
  const powrot = document.activeElement;       // tu wróci fokus po zamknięciu
  const dzienStartu = dzis();                  // seria liczy dzień rozpoczęcia lekcji
  document.documentElement.classList.add('jz-lock');
  const box = h('div', 'jz-lekcja');
  box.tabIndex = -1;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', `Lekcja: ${w.tytul}`);
  // .jz-lekcja zawsze kryje cały ekran (tło i kratka); do widocznej części ekranu dopasowuje się tylko ramka
  box.innerHTML = `<div class="jz-l-ramka"><div class="jz-l-top"><button type="button" class="jz-x" aria-label="Zamknij lekcję">✕</button><div class="jz-l-pasek" aria-hidden="true"><i></i></div><span class="jz-combo" aria-live="polite"></span></div>
    <div class="jz-l-haslo" hidden></div><div class="jz-l-body"></div>
    <div class="jz-l-dol"><div class="jz-fb" aria-live="polite"></div><div class="jz-l-znaki" hidden></div><div class="jz-l-akcje"><button type="button" class="jz-btn jz-btn-glow jz-spr" disabled>Sprawdź</button></div></div></div>`;
  document.body.append(box);
  // tło za oknem: bez Tab, kliknięć i Entera (aria-modal sam tego nie robi)
  const uspione = [...document.body.children].filter((e) => e !== box && !e.inert);
  uspione.forEach((e) => { e.inert = true; });
  box.focus({ preventScroll: true });
  const body = $('.jz-l-body', box), fb = $('.jz-fb', box), spr = $('.jz-spr', box), dol = $('.jz-l-dol', box);
  const haslo = $('.jz-l-haslo', box), ramka = $('.jz-l-ramka', box), znaki = $('.jz-l-znaki', box);

  // telefon: ramka ma wysokość widocznej części ekranu, więc klawiatura nie zasłania „Sprawdź”;
  // przy każdej niezgodności wysokości spod ramki widać tło lekcji, nigdy stronę
  const vv = window.visualViewport;
  const dopasuj = () => {
    if (vv.scale > 1.01) { ramka.style.top = ''; ramka.style.height = ''; ramka.style.removeProperty('--jz-h'); return; }
    ramka.style.top = `${vv.offsetTop}px`;
    ramka.style.height = `${vv.height}px`;
    ramka.style.setProperty('--jz-h', `${vv.height}px`);
  };
  if (vv) { vv.addEventListener('resize', dopasuj); vv.addEventListener('scroll', dopasuj); dopasuj(); }
  body.addEventListener('focusin', (e) => {
    if (!e.target.matches?.('.jz-pole')) return;
    setTimeout(() => {
      const r = e.target.getBoundingClientRect(), dolG = body.getBoundingClientRect().bottom;
      if (r.bottom > dolG - 8) body.scrollTop += r.bottom - dolG + 16;
    }, 350);
  });

  // stan przebiegu
  const kolejka = klucze.map((k) => ({ k, proba: 0 }));
  const unik = new Set(klucze.filter((k) => CW.get(k).t !== 'pisz'));
  const pierwszaDobra = new Set();
  const zle = new Set();
  let poz = 0, combo = 0, xpL = 0, faza = 'cw', biez = null, renderer = null;
  const boss = w.typ === 'boss';
  const retoWynik = boss ? w.l.retos.map(() => ({ ok: true, koniec: false })) : [];

  const zamknijLekcje = () => {
    box.remove();
    document.removeEventListener('keydown', klaw);
    if (vv) { vv.removeEventListener('resize', dopasuj); vv.removeEventListener('scroll', dopasuj); }
    uspione.forEach((e) => { e.inert = false; });
    document.documentElement.classList.remove('jz-lock');
    window.speechSynthesis?.cancel?.();
    odswiez();
    if (powrot?.isConnected) powrot.focus({ preventScroll: true });
  };
  $('.jz-x', box).addEventListener('click', () => {
    if (faza === 'koniec' || faza === 'nowe' || poz === 0) return zamknijLekcje();
    modal('<h3>Przerwać lekcję?</h3><p>Postęp tej lekcji przepadnie. XP za już rozwiązane ćwiczenia zostaje.</p>', [['Zostaję', 'jz-btn-glow'], ['Przerwij', 'jz-btn-ghost', zamknijLekcje]]);
  });

  const pasek = () => { $('.jz-l-pasek i', box).style.width = `${(poz / kolejka.length) * 100}%`; };
  const pokazHaslo = () => {
    if (!boss) return;
    haslo.hidden = false;
    haslo.innerHTML = [...w.l.haslo].map((lit, i) => `<span class="${retoWynik[i].koniec ? (retoWynik[i].ok ? 'is-ok' : 'is-meh') : ''}">${retoWynik[i].koniec ? lit : '•'}</span>`).join('');
  };

  function ustawPrzycisk(tekst, tryb) {
    spr.textContent = tekst;
    spr.dataset.tryb = tryb;
  }

  function pokazCwiczenie() {
    faza = 'cw';
    pasek();
    pokazHaslo();
    fb.innerHTML = '';
    dol.className = 'jz-l-dol';
    const wpis = kolejka[poz];
    biez = wpis;
    const c = CW.get(wpis.k);
    body.innerHTML = '';
    const karta = h('div', 'jz-cw');
    karta.dataset.cw = wpis.k;                 // klucz ćwiczenia (test przejścia lekcji: narzedzia/jezyki-check/przejdz.cjs)
    if (boss && (poz === 0 || CW.get(kolejka[poz - 1].k).reto !== c.reto)) {
      karta.append(h('div', 'jz-reto', `${KURS.etap || 'Reto'} ${c.reto + 1}/${w.l.retos.length} · ${w.l.retos[c.reto].nazwa}`));
    }
    karta.append(h('div', 'jz-typ', `${ETYKIETA[c.t] || ''}${wpis.proba ? ' · <span class="jz-znow">jeszcze raz</span>' : ''}`));
    if (c.aw) karta.append(h('div', 'jz-aw-box', awatar(c.aw)));
    if (c.kol) { const s = h('div', 'jz-swatch'); s.style.background = c.kol; s.setAttribute('aria-hidden', 'true'); karta.append(s); }
    const q = h('div', 'jz-q', c.q || '');
    karta.append(q);
    if (c.qp) { const sub = h('p', 'jz-q-sub', ''); sub.textContent = c.qp; karta.append(sub); }
    ozywMowe(q);
    renderer = R[c.t](c, () => { spr.disabled = !renderer.gotowe(); }, () => { if (faza === 'cw') sprawdz(); });
    renderer.el.classList.add('jz-odp');          // strefa odpowiedzi: na telefonie zjeżdża do kciuka
    karta.append(renderer.el);
    body.append(karta);
    // pasek znaków w dolnej belce (na dotyku ukrywa go CSS): tylko przy ćwiczeniach z polem
    znaki.replaceChildren();
    // KURS.znaki: własny zestaw znaków; pusta lista = bez paska (np. angielski)
    const zZnakami = renderer.aktywnePole && (!KURS.znaki || KURS.znaki.length > 0);
    if (zZnakami) znaki.append(klawiatura(renderer.aktywnePole, KURS.znaki || undefined));
    znaki.hidden = !zZnakami;
    ustawPrzycisk(c.t === 'pisz' ? 'Pokaż wzór' : 'Sprawdź', 'spr');
    spr.disabled = !renderer.gotowe();
    if (c.t === 'pary') spr.hidden = true; else spr.hidden = false;
    if (ruch()) karta.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)' });
    if (renderer.pierwszyFokus && window.matchMedia('(pointer:fine)').matches) renderer.pierwszyFokus.focus({ preventScroll: true });
    else { q.tabIndex = -1; q.focus({ preventScroll: true }); }   // nie na wyłączonym „Sprawdź” i nie pod oknem
    body.scrollTop = 0;
  }

  function sprawdz() {
    if (faza !== 'cw' || !renderer || !renderer.gotowe()) return;
    faza = 'fb';
    const c = CW.get(biez.k);
    // klawiatura ekranowa chowa się, więc panel wyniku jest widoczny; pasek znaków po sprawdzeniu znika
    if (document.activeElement instanceof Element && document.activeElement.matches('.jz-pole')) document.activeElement.blur();
    znaki.hidden = true;
    const r = renderer.sprawdz();
    const pierwsza = biez.proba === 0;
    if (!r.neutral) {
      if (r.ok) {
        if (pierwsza) pierwszaDobra.add(biez.k);
        combo++;
        st.comboMax = Math.max(st.comboMax, combo);
        let z = 1;
        if (combo > 0 && combo % 5 === 0) z += 2;
        xpL += z; dodajXp(z);
        if (w.typ === 'bledy') st.bledy = st.bledy.filter((k) => k !== biez.k);
      } else {
        combo = 0;
        zle.add(biez.k);
        if (!st.bledy.includes(biez.k)) st.bledy.push(biez.k);
        if (st.bledy.length > 80) st.bledy = st.bledy.slice(-80);
        if (boss) retoWynik[c.reto].ok = false;
        else if (biez.proba < 1) kolejka.push({ k: biez.k, proba: biez.proba + 1 });
      }
    }
    zapisz();
    const combEl = $('.jz-combo', box);
    combEl.textContent = combo >= 3 ? `×${combo} combo` : '';
    if (combo >= 3 && combo % 5 === 0 && ruch()) combEl.animate([{ transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'cubic-bezier(.16,1,.3,1)' });

    const naglowek = r.naglowek || (r.neutral ? '📝 Porównaj ze wzorem' : (r.ok ? (r.akcent ? '✓ Dobrze — uwaga na akcent' : ['✓ ¡Muy bien!', '✓ ¡Perfecto!', '✓ ¡Genial!', '✓ Dobrze!'][Math.floor(Math.random() * 4)]) : '✗ Nie tym razem'));
    dol.className = `jz-l-dol ${r.neutral ? 'is-neutral' : (r.ok ? 'is-ok' : 'is-bad')}`;
    fb.innerHTML = `<b class="jz-fb-h">${naglowek}</b>`;
    if (r.poprawnie && (r.akcent || !r.ok)) {
      const p = h('div', 'jz-fb-pop', `${r.ok ? 'Pisownia' : 'Poprawnie'}: <b lang="${KURS.jezyk.slice(0, 2)}">${r.poprawnie}</b> `);
      if (r.mowic) p.append(przyciskMowy(r.mowic));
      fb.append(p);
    } else if (r.mowic && !r.neutral) {
      const p = h('div', 'jz-fb-pop', '');
      p.append(przyciskMowy(r.mowic), h('span', 'jz-podp', ' odsłuchaj'));
      fb.append(p);
    }
    if (r.info) fb.append(h('div', 'jz-fb-x', r.info));
    if (c.x) { const x = h('div', 'jz-fb-x', c.x); ozywMowe(x); fb.append(x); }
    if (r.neutral && r.mowic) fb.append(przyciskMowy(r.mowic));
    // boss: koniec etapu → litera hasła
    if (boss) {
      const nast = kolejka[poz + 1];
      if (!nast || CW.get(nast.k).reto !== c.reto) {
        retoWynik[c.reto].koniec = true;
        pokazHaslo();
        fb.append(h('div', 'jz-fb-lit', `🔓 Litera hasła: <b>${w.l.haslo[c.reto]}</b>`));
      }
    }
    spr.hidden = false;
    spr.disabled = false;
    ustawPrzycisk(poz + 1 >= kolejka.length ? 'Zakończ' : 'Dalej', 'dalej');
    spr.focus({ preventScroll: true });
  }

  function dalej() {
    poz++;
    if (poz >= kolejka.length) return koniec();
    pokazCwiczenie();
  }

  function dodajXp(n) {
    st.xp += n;
    if (st.dzien.data !== dzis()) st.dzien = { data: dzis(), xp: 0 };
    st.dzien.xp += n;
  }

  function koniec() {
    faza = 'koniec';
    $('.jz-l-pasek i', box).style.width = '100%';
    const total = unik.size;
    const proc = total ? Math.round((pierwszaDobra.size / total) * 100) : 100;
    const gw = proc >= 90 ? 3 : proc >= 70 ? 2 : 1;
    const bonus = 10 + (proc === 100 ? 5 : 0) + (boss && proc >= 80 ? 20 : 0);
    dodajXp(bonus); xpL += bonus;
    if (w.typ !== 'bledy') {
      const r = st.lekcje[w.id] || { best: 0, gw: 0, razy: 0 };
      r.best = Math.max(r.best, proc); r.gw = Math.max(r.gw, gw); r.razy++;
      st.lekcje[w.id] = r;
    }
    // seria dni: liczy się dzień, w którym lekcja się zaczęła
    zaliczDzien(dzienStartu);
    const nowe = sprawdzOdznaki({ proc, typ: w.typ });
    zapisz();
    odswiez();
    pokazHaslo();
    const nast = WEZLY[w.nr + 1];
    const tytul = boss ? (proc >= 80 ? '🚪 Drzwi otwarte! ¡APROBADO!' : '🔒 Drzwi jeszcze zamknięte') : proc === 100 ? '💎 Bez ani jednego błędu!' : proc >= 70 ? '🎉 Lekcja zaliczona!' : '💪 Ukończone — powtórz, żeby utrwalić';
    const kom = boss ? (proc >= 80 ? 'Masz min. 80% za pierwszym razem. To dobry znak przed kolokwium.' : 'Do wyjścia potrzeba min. 80%. Wróć do lekcji z błędami albo zrób powtórkę błędów i spróbuj jeszcze raz.') : '';
    body.innerHTML = '';
    dol.className = 'jz-l-dol';
    fb.innerHTML = '';
    const k = h('div', 'jz-koniec');
    k.innerHTML = `<h2>${tytul}</h2>${kom ? `<p class="jz-podp">${kom}</p>` : ''}
      <div class="jz-wyniki">
        <div class="jz-wynik"><b>${proc}%</b><span>za pierwszym razem</span></div>
        <div class="jz-wynik"><b>+${xpL}</b><span>XP</span></div>
        <div class="jz-wynik"><b>${w.typ === 'bledy' ? '🩹' : '★'.repeat(gw) + '☆'.repeat(3 - gw)}</b><span>${w.typ === 'bledy' ? 'naprawione' : 'gwiazdki'}</span></div>
        <div class="jz-wynik"><b>🔥 ${seriaTeraz()}</b><span>dni z rzędu</span></div>
      </div>
      ${zle.size ? `<p class="jz-podp">Ćwiczenia z błędami (${zle.size}) trafiły do „Powtórz błędy”.</p>` : ''}
      ${nowe.length ? `<div class="jz-nowe-odz"><h3>Nowy kamień milowy!</h3>${nowe.map((o) => `<div class="jz-odz-mini"><span>${o.ikona}</span><b>${o.nazwa}</b><small>${o.opis}</small></div>`).join('')}</div>` : ''}`;
    body.append(k);
    if (ruch()) k.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
    const akcje = $('.jz-l-akcje', box);
    akcje.innerHTML = '';
    akcje.classList.add('is-koniec');
    const b1 = h('button', 'jz-btn jz-btn-ghost', 'Powtórz'); b1.type = 'button';
    b1.addEventListener('click', () => { zamknijLekcje(); otworz(w); });
    // po naprawieniu wszystkich błędów nie ma czego powtarzać
    if (w.typ !== 'bledy' || st.bledy.some((key) => CW.has(key))) akcje.append(b1);
    if (nast && w.typ !== 'bledy') {
      const b2 = h('button', 'jz-btn jz-btn-glow', 'Następna lekcja →'); b2.type = 'button';
      b2.addEventListener('click', () => { zamknijLekcje(); otworz(nast); });
      akcje.append(b2);
    }
    const b3 = h('button', 'jz-btn', 'Ścieżka'); b3.type = 'button';
    b3.addEventListener('click', zamknijLekcje);
    akcje.append(b3);
    (akcje.querySelector('.jz-btn-glow') || b3).focus();
  }

  let nastNowe = null;
  spr.addEventListener('click', () => {
    if (faza === 'nowe') nastNowe && nastNowe();
    else if (spr.dataset.tryb === 'dalej') dalej();
    else sprawdz();
  });

  function klaw(e) {
    if ($('.jz-modal-tlo')) return;
    if (e.key === 'Escape') { $('.jz-x', box).click(); return; }
    if (faza === 'cw' && /^[1-4]$/.test(e.key) && renderer?.klawisz && !(e.target instanceof HTMLInputElement)) renderer.klawisz(Number(e.key));
    // Enter na zaznaczonej opcji jednego wyboru = sprawdź (zamiast klikać ją drugi raz)
    if (e.key === 'Enter' && faza === 'cw' && e.target instanceof Element && e.target.matches('.jz-opcja.is-sel') && !e.target.closest('.jz-wiele') && renderer?.gotowe()) { e.preventDefault(); sprawdz(); return; }
    // Enter w polu, gdy nie wszystko wypełnione: przejdź do następnego pustego pola (klawiatura „dalej” na telefonie)
    if (e.key === 'Enter' && faza === 'cw' && e.target instanceof HTMLInputElement && renderer && !renderer.gotowe()) {
      e.preventDefault();
      const pola = $$('input.jz-pole', body);
      const i = pola.indexOf(e.target);
      [...pola.slice(i + 1), ...pola.slice(0, i)].find((p) => !p.value.trim())?.focus();
      return;
    }
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLButtonElement)) {
      e.preventDefault();
      if (faza === 'cw') sprawdz(); else if (faza === 'fb') dalej(); else if (faza === 'nowe' && nastNowe) nastNowe();
    }
  }
  document.addEventListener('keydown', klaw);

  // karty „Nowe” przed pierwszym podejściem
  const nowe = w.typ === 'lekcja' && w.l.nowe && w.l.nowe.length ? w.l.nowe : null;
  if (nowe && !zrobione(w.id)) {
    faza = 'nowe';
    let i = 0;
    const pokazNowe = () => {
      pasek();
      body.innerHTML = '';
      const n = nowe[i];
      const karta = h('div', 'jz-nowe');
      karta.innerHTML = `<div class="jz-typ">Nowe · ${i + 1}/${nowe.length}</div><h2>${n.h}</h2><div class="jz-nowe-t">${n.html}</div>`;
      ozywMowe(karta);
      body.append(karta);
      karta.tabIndex = -1;
      karta.focus({ preventScroll: true });
      ustawPrzycisk(i + 1 < nowe.length ? 'Dalej' : 'Zaczynamy ćwiczenia', 'nowe');
      spr.disabled = false;
      if (ruch()) karta.animate([{ opacity: 0, transform: 'translateX(16px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)' });
    };
    nastNowe = () => { i++; if (i < nowe.length) pokazNowe(); else pokazCwiczenie(); };
    pokazNowe();
  } else {
    pokazCwiczenie();
  }
}

// ── start ──
/**
 * Dane kursu przychodzą jako moduł JS pakowany razem ze skryptem (src/data/jezyki/*), nie jako tekst
 * z HTML-a strony — treść lekcji (z <b>, tabelami) wstawiamy przez innerHTML, więc jej źródłem ma być
 * zawsze kod z repo, nigdy tekst odczytany z dokumentu.
 */
export function start({ kurs, odznaki } = {}) {
  if (!kurs || !document.querySelector('[data-wezel]')) return;
  ustawJezyk(kurs.jezyk);
  ustawPo(kurs.po);
  KURS = kurs;
  ODZNAKI = odznaki || [];
  KLUCZ = `uc-jezyki-v1:${KURS.slug}`;
  zbuduj(KURS);
  wczytaj();
  document.documentElement.classList.add('jz-js');
  if (mowa) { try { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => {}; } catch { /* nic */ } }

  for (const el of $$('[data-wezel]')) {
    el.addEventListener('click', () => {
      const w = LEK.get(el.dataset.wezel);
      if (!w) return;
      if (dostepny(w)) return otworz(w);
      const tresc = h('div');
      const nag = h('h3');
      nag.textContent = `🔒 ${w.tytul}`;
      const opis = h('p');
      opis.textContent = 'Ta lekcja jest dalej na ścieżce. Najlepiej przejść po kolei, bo każda lekcja korzysta z poprzednich. Kolokwium za pasem? Możesz otworzyć ją od razu.';
      tresc.append(nag, opis);
      modal(tresc, [['Otwórz mimo to', 'jz-btn-glow', () => otworz(w)], ['Wracam do ścieżki', 'jz-btn-ghost']]);
    });
  }
  for (const b of $$('[data-odblok]')) {
    b.addEventListener('click', () => {
      const sid = b.dataset.odblok;
      modal('<h3>Zacząć od tej sekcji?</h3><p>Odblokujemy pierwszą lekcję tej sekcji. Wcześniejsze lekcje zostaną na ścieżce — możesz do nich wrócić w każdej chwili.</p>',
        [['Tak, zaczynam tutaj', 'jz-btn-glow', () => { st.odblok[sid] = true; zapisz(); odswiez(); document.querySelector(`[data-sekcja="${sid}"]`)?.scrollIntoView({ behavior: ruch() ? 'smooth' : 'auto', block: 'start' }); }], ['Anuluj', 'jz-btn-ghost']]);
    });
  }
  for (const b of $$('[data-sciaga]')) {
    b.addEventListener('click', () => {
      const src = document.getElementById(`sciaga-${b.dataset.sciaga}`);
      if (!src) return;
      const k = h('div', 'jz-sciaga-m');
      k.append(...src.cloneNode(true).childNodes);   // kopia węzłów, bez ponownego parsowania HTML
      modal(k);
    });
  }
  for (const b of $$('[data-akcja="bledy"]')) b.addEventListener('click', () => { if (st.bledy.some((k) => CW.has(k))) otworz({ id: 'bledy', typ: 'bledy', tytul: 'Powtórka błędów', l: {}, nr: -1 }); });
  for (const b of $$('[data-akcja="dalej"]')) b.addEventListener('click', () => otworz(nastepnyWezel() || WEZLY[0]));
  for (const b of $$('[data-akcja="reset"]')) {
    b.addEventListener('click', () => modal('<h3>Wyzerować postęp?</h3><p>Znikną XP, gwiazdki, seria dni i odznaki w tym kursie (tylko w tej przeglądarce). Tego nie da się cofnąć.</p>',
      [['Anuluj', 'jz-btn-glow'], ['Wyzeruj', 'jz-btn-ghost', () => { st = nowyStan(); zapisz(); odswiez(); }]]));
  }
  // druga karta z kursem zapisała postęp: wczytaj go, żeby jej nie nadpisać starym stanem
  window.addEventListener('storage', (e) => {
    if (e.storageArea !== localStorage) return;
    if (e.key !== null && e.key !== KLUCZ) return;   // null = wyczyszczony storage
    wczytaj();
    odswiez();
  });
  // powrót do karty (np. następnego dnia): cel dzienny i seria pokazują dzisiejszy stan
  document.addEventListener('visibilitychange', () => { if (!document.hidden) odswiez(); });
  odswiez();
}
