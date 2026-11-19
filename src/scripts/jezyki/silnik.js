// Silnik ścieżki językowej (hiszpański; angielski użyje tego samego kodu z innym plikiem danych).
// Dane: <script type="application/json" id="jz-dane"> z obiektem { kurs, odznaki } (src/data/jezyki/*.js).
// Ścieżka jest wyrenderowana statycznie (src/components/jezyki/Sciezka.astro); tu tylko ożywiamy stany
// węzłów, prowadzimy lekcje i zapisujemy postęp w localStorage (bez logowania; prywatne okno = brak zapisu).
import { awatar } from './awatar.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const tasuj = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const bezTagow = (s) => String(s).replace(/<[^>]+>/g, '');
const ruch = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── porównywanie odpowiedzi ──
const norm = (s) => String(s).normalize('NFC').toLowerCase().replace(/[¿?¡!.,;:„”"«»()]/g, ' ').replace(/\s+/g, ' ').trim();
const bezAkc = (s) => norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// Słowa, w których akcent zmienia znaczenie (tu = twój, tú = ty; que = że, qué = co?; esta = ta, está = jest).
// Tu brak akcentu to inne słowo, nie literówka. Celowo bez solo/sólo i este/éste: RAE dopuszcza je bez akcentu.
const AKC_SLOWO = new Set([
  'tu', 'tú', 'mi', 'mí', 'el', 'él', 'si', 'sí', 'se', 'sé', 'te', 'té', 'de', 'dé', 'mas', 'más',
  'que', 'qué', 'como', 'cómo', 'donde', 'dónde', 'adonde', 'adónde', 'cuando', 'cuándo', 'cual', 'cuál', 'cuales', 'cuáles',
  'quien', 'quién', 'quienes', 'quiénes', 'cuanto', 'cuánto', 'cuanta', 'cuánta', 'cuantos', 'cuántos', 'cuantas', 'cuántas',
  'esta', 'está', 'estas', 'estás',
]);
/** 'ok' — dokładnie; 'akcent' — dobrze poza akcentem/ñ; null — źle. */
function porownaj(wpis, dobre) {
  const w = norm(wpis);
  if (!w) return null;
  for (const d of dobre) if (norm(d) === w) return 'ok';
  const ws = w.split(' ');
  for (const d of dobre) {
    if (bezAkc(d) !== bezAkc(wpis)) continue;
    const ds = norm(d).split(' ');
    if (ds.some((x, i) => x !== ws[i] && AKC_SLOWO.has(x) && AKC_SLOWO.has(ws[i]))) continue;
    return 'akcent';
  }
  return null;
}

// ── synteza mowy ──
let KURS = null;
const mowa = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
function mow(tekst) {
  if (!mowa) return false;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(bezTagow(tekst));
    u.lang = KURS.jezyk;
    const glos = window.speechSynthesis.getVoices().find((v) => (v.lang || '').toLowerCase().startsWith(KURS.jezyk.slice(0, 2)));
    if (glos) u.voice = glos;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}
function przyciskMowy(tekst, cls = 'jz-mow') {
  const b = h('button', cls, '🔊');
  b.type = 'button';
  b.setAttribute('aria-label', 'Odsłuchaj: ' + bezTagow(tekst));
  b.addEventListener('click', (e) => { e.stopPropagation(); mow(tekst); });
  return b;
}
/** Dokleja 🔊 do każdego fragmentu po hiszpańsku (span.es) w kontenerze. */
function ozywMowe(el) {
  if (!mowa) return;
  for (const s of $$('span.es', el)) {
    if (s.dataset.mow) continue;
    s.dataset.mow = '1';
    s.append(przyciskMowy(s.textContent, 'jz-mow jz-mow-mini'));
  }
}

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
  if (w.nr === 0 || zrobione(w.id)) return true;
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
  if (typeof tresc === 'string') m.textContent = tresc; else m.append(tresc);
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

// ── ćwiczenia ──
const ETYKIETA = { wybor: 'Wybierz', wiele: 'Zaznacz wszystkie', wpisz: 'Wpisz', uloz: 'Ułóż zdanie', pary: 'Połącz w pary', kat: 'Posortuj', odm: 'Odmień', luki: 'Uzupełnij tekst', sluchaj: 'Posłuchaj', pisz: 'Twoja wypowiedź' };
// ¿ i ¡ pomijamy: porównanie odpowiedzi ignoruje znaki przestankowe, a 7 przycisków po 40 px mieści się w jednym rzędzie na 360 px
const ZNAKI = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü'];

function klawiatura(getPole) {
  const bar = h('div', 'jz-znaki');
  bar.setAttribute('aria-label', 'Znaki hiszpańskie');
  for (const z of ZNAKI) {
    const b = h('button', 'jz-znak', z);
    b.type = 'button';
    b.tabIndex = -1;
    b.addEventListener('mousedown', (e) => e.preventDefault());
    b.addEventListener('click', () => {
      const p = getPole();
      if (!p || p.readOnly) return;
      const a = p.selectionStart ?? p.value.length, bb = p.selectionEnd ?? p.value.length;
      p.value = p.value.slice(0, a) + z + p.value.slice(bb);
      p.setSelectionRange(a + 1, a + 1);
      p.dispatchEvent(new Event('input', { bubbles: true }));
      p.focus();
    });
    bar.append(b);
  }
  return bar;
}
function pole(placeholder) {
  const i = h('input', 'jz-pole');
  i.type = 'text';
  i.autocomplete = 'off';
  i.autocapitalize = 'off';
  i.spellcheck = false;
  i.setAttribute('autocorrect', 'off');
  i.lang = KURS.jezyk;
  i.enterKeyHint = 'done';
  if (placeholder) i.placeholder = placeholder;
  return i;
}

/** Każdy renderer zwraca { el, gotowe(), sprawdz() → { ok, akcent?, poprawnie?, mowic? }, pierwszyFokus? }. */
const R = {
  wybor(c, gotowy) {
    const el = h('div', 'jz-opcje');
    const dobra = c.o[0];
    let wyb = null;
    tasuj(c.o).forEach((o, i) => {
      const b = h('button', 'jz-opcja', `<kbd>${i + 1}</kbd><span>${o}</span>`);
      b.type = 'button';
      b.dataset.v = o;
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', (e) => {
        if (el.dataset.zablokuj) return;
        $$('.jz-opcja', el).forEach((x) => { x.classList.remove('is-sel'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('is-sel');
        b.setAttribute('aria-pressed', 'true');
        wyb = o;
        gotowy();
        if (e.detail > 0) b.blur(); // klik myszą/palcem: Enter ma sprawdzić, a nie kliknąć opcję drugi raz
      });
      el.append(b);
    });
    return {
      el,
      gotowe: () => wyb !== null,
      klawisz: (k) => { const b = $$('.jz-opcja', el)[k - 1]; if (b) b.click(); },
      sprawdz() {
        el.dataset.zablokuj = '1';
        for (const b of $$('.jz-opcja', el)) { if (b.dataset.v === dobra) b.classList.add('is-ok'); else if (b.dataset.v === wyb) b.classList.add('is-bad'); }
        return { ok: wyb === dobra, poprawnie: dobra, mowic: dobra };
      },
    };
  },
  sluchaj(c, gotowy) {
    const r = R.wybor(c, gotowy);
    const box = h('div', 'jz-sluchaj');
    const b = h('button', 'jz-gloso', '🔊 <span>Odtwórz</span>');
    b.type = 'button';
    b.addEventListener('click', () => mow(c.mow));
    box.append(b);
    if (!mowa) box.append(h('p', 'jz-uwaga', `Twoja przeglądarka nie czyta na głos. Przeczytaj: <b lang="es">${c.mow}</b>`));
    box.append(r.el);
    setTimeout(() => mow(c.mow), 250);
    return { ...r, el: box };
  },
  wiele(c, gotowy) {
    const el = h('div', 'jz-opcje jz-wiele');
    const dobre = new Set(c.d.map((i) => c.o[i]));
    const wyb = new Set();
    tasuj(c.o).forEach((o) => {
      const b = h('button', 'jz-opcja', `<i class="jz-check" aria-hidden="true"></i><span lang="es">${o}</span>`);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.dataset.v = o;
      b.addEventListener('click', (e) => {
        if (el.dataset.zablokuj) return;
        if (wyb.has(o)) wyb.delete(o); else wyb.add(o);
        b.classList.toggle('is-sel', wyb.has(o));
        b.setAttribute('aria-pressed', String(wyb.has(o)));
        gotowy();
        if (e.detail > 0) b.blur();
      });
      el.append(b);
    });
    return {
      el,
      gotowe: () => wyb.size > 0,
      sprawdz() {
        el.dataset.zablokuj = '1';
        let ok = true;
        for (const b of $$('.jz-opcja', el)) {
          const v = b.dataset.v, d = dobre.has(v), w = wyb.has(v);
          if (d && w) b.classList.add('is-ok');
          else if (d && !w) { b.classList.add('is-brak'); ok = false; }
          else if (!d && w) { b.classList.add('is-bad'); ok = false; }
        }
        return { ok, poprawnie: [...dobre].join(' '), mowic: [...dobre].join(' ') };
      },
    };
  },
  wpisz(c, gotowy) {
    const el = h('div', 'jz-wpisz');
    const i = pole(c.pod || 'wpisz odpowiedź');
    i.addEventListener('input', gotowy);
    el.append(i, klawiatura(() => i));
    return {
      el, pierwszyFokus: i,
      gotowe: () => i.value.trim().length > 0,
      sprawdz() {
        i.readOnly = true;
        const w = porownaj(i.value, c.a);
        i.classList.add(w ? 'is-ok' : 'is-bad');
        return { ok: !!w, akcent: w === 'akcent', poprawnie: c.a[0], mowic: c.a[0] };
      },
    };
  },
  uloz(c, gotowy) {
    const slowa = (s) => s.replace(/[¿?¡!.,:;„”"]/g, ' ').split(/\s+/).filter(Boolean);
    const cel = slowa(c.a);
    const el = h('div', 'jz-uloz');
    const linia = h('div', 'jz-linia');
    linia.setAttribute('aria-label', 'Twoje zdanie');
    const bank = h('div', 'jz-bank');
    const kafel = (t) => {
      const b = h('button', 'jz-kafel', t);
      b.type = 'button';
      b.lang = KURS.jezyk;
      b.addEventListener('click', () => {
        if (el.dataset.zablokuj) return;
        (b.parentElement === bank ? linia : bank).append(b);
        if (b.parentElement === linia && ruch()) b.animate([{ transform: 'scale(.85)' }, { transform: 'scale(1)' }], { duration: 160, easing: 'ease-out' });
        gotowy();
      });
      return b;
    };
    for (const t of tasuj([...cel, ...(c.extra || [])])) bank.append(kafel(t));
    el.append(linia, bank);
    return {
      el,
      gotowe: () => linia.children.length > 0,
      sprawdz() {
        el.dataset.zablokuj = '1';
        const wpis = $$('.jz-kafel', linia).map((k) => k.textContent).join(' ');
        // inne poprawne szyki z tych samych kafelków (pole `alt` w danych)
        const wzory = [c.a, ...(c.alt || [])].map((z) => norm(slowa(z).join(' ')));
        const ok = wzory.includes(norm(wpis));
        linia.classList.add(ok ? 'is-ok' : 'is-bad');
        return { ok, poprawnie: c.a, mowic: c.a };
      },
    };
  },
  pary(c, gotowy, natychmiast) {
    const el = h('div', 'jz-pary');
    const L = h('div', 'jz-pary-k'), P = h('div', 'jz-pary-k');
    let lewy = null, prawy = null, bledy = 0, dopasowane = 0;
    const mapa = new Map(c.p.map(([a, b]) => [a, b]));
    const sprobuj = () => {
      if (!lewy || !prawy) return;
      const ok = mapa.get(lewy.dataset.v) === prawy.dataset.v;
      const [a, b] = [lewy, prawy];
      lewy = prawy = null;
      a.classList.remove('is-sel'); b.classList.remove('is-sel');
      if (ok) {
        a.classList.add('is-ok'); b.classList.add('is-ok'); a.disabled = b.disabled = true;
        dopasowane++;
        if (KURS && /[a-záéíóúñ¿¡]/i.test(a.dataset.v)) mow(a.dataset.v);
        if (dopasowane === c.p.length) { gotowy(); natychmiast(); }
      } else {
        bledy++;
        for (const x of [a, b]) { x.classList.add('is-bad'); setTimeout(() => x.classList.remove('is-bad'), 450); }
      }
    };
    const przycisk = (t, strona) => {
      const b = h('button', 'jz-para', t);
      b.type = 'button';
      b.dataset.v = t;
      if (strona === 'L') b.lang = KURS.jezyk;
      b.addEventListener('click', () => {
        if (strona === 'L') { if (lewy) lewy.classList.remove('is-sel'); lewy = b; } else { if (prawy) prawy.classList.remove('is-sel'); prawy = b; }
        b.classList.add('is-sel');
        sprobuj();
      });
      return b;
    };
    for (const [a] of tasuj(c.p)) L.append(przycisk(a, 'L'));
    for (const [, b] of tasuj(c.p)) P.append(przycisk(b, 'P'));
    el.append(L, P);
    return {
      el,
      gotowe: () => dopasowane === c.p.length,
      sprawdz: () => ({ ok: bledy === 0, info: bledy ? `Pomyłki przy łączeniu: ${bledy}. Pary są już połączone poprawnie — zapamiętaj je.` : '' }),
    };
  },
  kat(c, gotowy) {
    const el = h('div', 'jz-kat');
    const pula = h('div', 'jz-kat-pula');
    const kosze = h('div', 'jz-kosze');
    let wybrany = null;
    const dozwolone = (e) => [].concat(e[1]);
    c.k.forEach((nazwa, ki) => {
      const k = h('div', 'jz-kosz', `<b>${nazwa}</b><div class="jz-kosz-in"></div>`);
      k.dataset.k = ki;
      k.setAttribute('role', 'button');
      k.tabIndex = 0;
      const wrzuc = () => {
        if (!wybrany || el.dataset.zablokuj) return;
        $('.jz-kosz-in', k).append(wybrany);
        wybrany.classList.remove('is-sel');
        wybrany = null;
        el.classList.remove('is-wybor');
        gotowy();
      };
      k.addEventListener('click', (e) => { if (e.target.closest('.jz-chip')) return; wrzuc(); });
      k.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.key === ' ') e.preventDefault();   // spacja nie przewija strony
        if (!wybrany) return;                     // nic do wrzucenia: Enter idzie dalej i sprawdza
        e.preventDefault();
        e.stopPropagation();                      // wrzucenie słowa nie sprawdza od razu
        wrzuc();
      });
      kosze.append(k);
    });
    for (const e of tasuj(c.e)) {
      const b = h('button', 'jz-chip', e[0]);
      b.type = 'button';
      b.lang = KURS.jezyk;
      b.dataset.v = e[0];
      b.addEventListener('click', () => {
        if (el.dataset.zablokuj) return;
        if (wybrany === b) { b.classList.remove('is-sel'); wybrany = null; el.classList.remove('is-wybor'); return; }
        if (b.parentElement !== pula && !wybrany) { pula.append(b); gotowy(); return; }
        if (wybrany) wybrany.classList.remove('is-sel');
        wybrany = b; b.classList.add('is-sel'); el.classList.add('is-wybor');
      });
      pula.append(b);
    }
    const podp = h('p', 'jz-podp', 'Stuknij słowo, potem kategorię. Stuknięcie słowa w kategorii odsyła je z powrotem.');
    el.append(podp, pula, kosze);
    return {
      el,
      gotowe: () => pula.children.length === 0,
      sprawdz() {
        el.dataset.zablokuj = '1';
        const zle = [];
        for (const k of $$('.jz-kosz', el)) for (const ch of $$('.jz-chip', k)) {
          const e = c.e.find((x) => x[0] === ch.dataset.v);
          const ok = dozwolone(e).includes(Number(k.dataset.k));
          ch.classList.add(ok ? 'is-ok' : 'is-bad');
          if (!ok) zle.push(`<b lang="es">${e[0]}</b> → ${dozwolone(e).map((i) => c.k[i]).join(' / ')}`);
        }
        return { ok: zle.length === 0, info: zle.length ? `Popraw: ${zle.join('; ')}.` : '' };
      },
    };
  },
  odm(c, gotowy) {
    const el = h('div', 'jz-odm');
    const OS = ['yo', 'tú', 'él / ella / usted', 'nosotros / nosotras', 'vosotros / vosotras', 'ellos / ellas / ustedes'];
    let akt = null;
    const pola = c.f.map((_, i) => {
      const w = h('label', 'jz-odm-w');
      w.append(h('span', 'jz-odm-os', OS[i]));
      const p = pole('');
      p.addEventListener('focus', () => { akt = p; });
      p.addEventListener('input', gotowy);
      w.append(p);
      el.append(w);
      return p;
    });
    akt = pola[0];
    pola.forEach((p, k) => { p.enterKeyHint = k < pola.length - 1 ? 'next' : 'done'; });
    el.append(klawiatura(() => akt));
    return {
      el, pierwszyFokus: pola[0],
      gotowe: () => pola.every((p) => p.value.trim()),
      sprawdz() {
        let ok = true, akcent = false;
        pola.forEach((p, i) => {
          p.readOnly = true;
          const w = porownaj(p.value, [c.f[i]]);
          p.classList.add(w ? 'is-ok' : 'is-bad');
          if (!w) {
            ok = false;
            const pop = h('span', 'jz-odm-pop');
            pop.lang = 'es';
            pop.textContent = c.f[i];
            p.insertAdjacentElement('afterend', pop);
          }
          if (w === 'akcent') akcent = true;
        });
        return { ok, akcent, poprawnie: c.f.join(', '), mowic: c.f.join(', ') };
      },
    };
  },
  luki(c, gotowy) {
    const el = h('div', 'jz-luki');
    const dobre = [];
    const tekst = h('p', 'jz-luki-t');
    tekst.lang = KURS.jezyk;
    const czesci = c.tekst.split(/\[\[(.+?)\]\]/);
    const pola = [];
    let akt = null;
    czesci.forEach((cz, i) => {
      if (i % 2 === 0) { tekst.append(document.createTextNode(cz)); return; }
      const alt = cz.split('|');
      dobre.push(alt);
      const p = pole('');
      p.classList.add('jz-luka');
      p.setAttribute('aria-label', `Luka ${pola.length + 1}`);
      p.size = Math.max(4, alt[0].length + 1);
      p.addEventListener('focus', () => { akt = p; });
      p.addEventListener('input', gotowy);
      pola.push(p);
      tekst.append(p);
    });
    akt = pola[0];
    pola.forEach((p, k) => { p.enterKeyHint = k < pola.length - 1 ? 'next' : 'done'; });
    el.append(tekst);
    if (c.bank && c.bank.length) {
      const bank = h('div', 'jz-luki-bank');
      bank.append(h('span', 'jz-podp', 'Słowa do wyboru (stuknij, żeby wstawić):'));
      const chipy = [];
      // przygaszone są dokładnie te słowa, które teraz stoją w polach (po skasowaniu albo nadpisaniu wracają)
      const odswiezBank = () => {
        const zostalo = pola.map((p) => norm(p.value)).filter(Boolean);
        for (const b of chipy) {
          const i = zostalo.indexOf(norm(b.textContent));
          b.classList.toggle('is-uzyte', i >= 0);
          if (i >= 0) zostalo.splice(i, 1);
        }
      };
      pola.forEach((p) => p.addEventListener('input', odswiezBank));
      for (const s of tasuj(c.bank)) {
        const b = h('button', 'jz-chip', s);
        b.type = 'button';
        b.lang = KURS.jezyk;
        chipy.push(b);
        b.addEventListener('click', () => {
          if (el.dataset.zablokuj) return;
          const cel = (akt && !akt.value) ? akt : (pola.find((p) => !p.value) || akt);
          if (!cel) return;
          cel.value = s;
          odswiezBank();
          const nast = pola.find((p) => !p.value);
          if (nast) { akt = nast; if (window.matchMedia('(pointer:fine)').matches) nast.focus({ preventScroll: true }); }
          gotowy();
        });
        bank.append(b);
      }
      el.append(bank);
    }
    el.append(klawiatura(() => akt));
    return {
      el, pierwszyFokus: pola[0],
      gotowe: () => pola.every((p) => p.value.trim()),
      sprawdz() {
        el.dataset.zablokuj = '1';
        let ok = true, akcent = false;
        const pisownia = [];
        pola.forEach((p, i) => {
          p.readOnly = true;
          const w = porownaj(p.value, dobre[i]);
          p.classList.add(w ? 'is-ok' : 'is-bad');
          if (!w) ok = false;
          // przy samym akcencie pokazujemy właściwą pisownię tego słowa, przy błędzie — dobrą odpowiedź
          const wzor = w === 'akcent' ? (dobre[i].find((d) => bezAkc(d) === bezAkc(p.value)) || dobre[i][0]) : dobre[i][0];
          if (w === 'akcent') { akcent = true; pisownia.push(wzor); }
          if (w !== 'ok') { const pop = h('span', 'jz-luka-pop'); pop.lang = KURS.jezyk; pop.textContent = wzor; p.after(pop); }
        });
        const pelny = c.tekst.replace(/\[\[(.+?)\]\]/g, (_, a) => a.split('|')[0]);
        return { ok, akcent, poprawnie: ok && pisownia.length ? pisownia.join(', ') : null, mowic: pelny };
      },
    };
  },
  pisz(c, gotowy) {
    const el = h('div', 'jz-pisz');
    const t = h('textarea', 'jz-pole jz-pisz-t');
    t.rows = 4;
    t.lang = KURS.jezyk;
    t.placeholder = 'Napisz po hiszpańsku (możesz też powiedzieć na głos i od razu sprawdzić wzór).';
    t.addEventListener('input', gotowy);
    el.append(t, klawiatura(() => t));
    return {
      el, pierwszyFokus: t,
      gotowe: () => true,
      sprawdz() {
        t.readOnly = true;
        const lista = (c.punkty || []).map((p) => `<li>${p}</li>`).join('');
        return { ok: true, neutral: true, info: `<b>Wzór:</b> <span lang="es">${c.wzor}</span>${lista ? `<br><b>Sprawdź u siebie:</b><ul class="jz-lista">${lista}</ul>` : ''}`, mowic: c.wzor };
      },
    };
  },
};

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
  box.innerHTML = `<div class="jz-l-top"><button type="button" class="jz-x" aria-label="Zamknij lekcję">✕</button><div class="jz-l-pasek" aria-hidden="true"><i></i></div><span class="jz-combo" aria-live="polite"></span></div>
    <div class="jz-l-haslo" hidden></div><div class="jz-l-body"></div>
    <div class="jz-l-dol"><div class="jz-fb" aria-live="polite"></div><div class="jz-l-akcje"><button type="button" class="jz-btn jz-btn-glow jz-spr" disabled>Sprawdź</button></div></div>`;
  document.body.append(box);
  // tło za oknem: bez Tab, kliknięć i Entera (aria-modal sam tego nie robi)
  const uspione = [...document.body.children].filter((e) => e !== box && !e.inert);
  uspione.forEach((e) => { e.inert = true; });
  box.focus({ preventScroll: true });
  const body = $('.jz-l-body', box), fb = $('.jz-fb', box), spr = $('.jz-spr', box), dol = $('.jz-l-dol', box);
  const haslo = $('.jz-l-haslo', box);

  // telefon: okno lekcji ma wysokość widocznej części ekranu, więc klawiatura nie zasłania „Sprawdź”
  const vv = window.visualViewport;
  const dopasuj = () => {
    if (vv.scale > 1.01) { box.style.top = ''; box.style.height = ''; box.style.removeProperty('--jz-h'); return; }
    box.style.top = `${vv.offsetTop}px`;
    box.style.height = `${vv.height}px`;
    box.style.setProperty('--jz-h', `${vv.height}px`);
  };
  if (vv) { vv.addEventListener('resize', dopasuj); vv.addEventListener('scroll', dopasuj); dopasuj(); }
  body.addEventListener('focusin', (e) => {
    if (!e.target.matches?.('.jz-pole')) return;
    setTimeout(() => {
      const r = e.target.getBoundingClientRect(), b = body.getBoundingClientRect();
      const zn = $('.jz-odm .jz-znaki, .jz-luki .jz-znaki, .jz-pisz .jz-znaki', body);
      const dolG = zn ? Math.min(b.bottom, zn.getBoundingClientRect().top) : b.bottom;
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
    haslo.textContent = '';
    [...w.l.haslo].forEach((lit, i) => {
      const span = document.createElement('span');
      if (retoWynik[i].koniec) span.className = retoWynik[i].ok ? 'is-ok' : 'is-meh';
      span.textContent = retoWynik[i].koniec ? lit : '•';
      haslo.appendChild(span);
    });
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
    if (boss && (poz === 0 || CW.get(kolejka[poz - 1].k).reto !== c.reto)) {
      karta.append(h('div', 'jz-reto', `Reto ${c.reto + 1}/${w.l.retos.length} · ${w.l.retos[c.reto].nazwa}`));
    }
    karta.append(h('div', 'jz-typ', `${ETYKIETA[c.t] || ''}${wpis.proba ? ' · <span class="jz-znow">jeszcze raz</span>' : ''}`));
    if (c.aw) karta.append(h('div', 'jz-aw-box', awatar(c.aw)));
    if (c.kol) { const s = h('div', 'jz-swatch'); s.style.background = c.kol; s.setAttribute('aria-hidden', 'true'); karta.append(s); }
    const q = h('div', 'jz-q', c.q || '');
    karta.append(q);
    ozywMowe(q);
    renderer = R[c.t](c, () => { spr.disabled = !renderer.gotowe(); }, () => { if (faza === 'cw') sprawdz(); });
    karta.append(renderer.el);
    body.append(karta);
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

    const naglowek = r.neutral ? '📝 Porównaj ze wzorem' : (r.ok ? (r.akcent ? '✓ Dobrze — uwaga na akcent' : ['✓ ¡Muy bien!', '✓ ¡Perfecto!', '✓ ¡Genial!', '✓ Dobrze!'][Math.floor(Math.random() * 4)]) : '✗ Nie tym razem');
    dol.className = `jz-l-dol ${r.neutral ? 'is-neutral' : (r.ok ? 'is-ok' : 'is-bad')}`;
    fb.innerHTML = `<b class="jz-fb-h">${naglowek}</b>`;
    if (r.poprawnie && (r.akcent || !r.ok)) {
      const p = h('div', 'jz-fb-pop', `${r.ok ? 'Pisownia' : 'Poprawnie'}: <b lang="es">${r.poprawnie}</b> `);
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
      ${nowe.length ? `<div class="jz-nowe-odz" data-nowe-odz></div>` : ''}`;
    body.append(k);
    if (nowe.length) {
      const wrap = $('[data-nowe-odz]', k);
      if (wrap) {
        const nag = document.createElement('h3');
        nag.textContent = 'Nowy kamień milowy!';
        wrap.append(nag);
        nowe.forEach((o) => {
          const mini = document.createElement('div');
          mini.className = 'jz-odz-mini';
          const ico = document.createElement('span');
          ico.textContent = o.ikona == null ? '' : String(o.ikona);
          const naz = document.createElement('b');
          naz.textContent = o.nazwa == null ? '' : String(o.nazwa);
          const op = document.createElement('small');
          op.textContent = o.opis == null ? '' : String(o.opis);
          mini.append(ico, naz, op);
          wrap.append(mini);
        });
      }
    }
    if (ruch()) k.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
    const akcje = $('.jz-l-akcje', box);
    akcje.innerHTML = '';
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
export function start() {
  const daneEl = document.getElementById('jz-dane');
  if (!daneEl) return;
  const D = JSON.parse(daneEl.textContent);
  KURS = D.kurs;
  ODZNAKI = D.odznaki || [];
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
      const tresc = document.createElement('div');
      const nag = document.createElement('h3');
      nag.textContent = `🔒 ${w.tytul}`;
      const p = document.createElement('p');
      p.textContent = 'Ta lekcja jest dalej na ścieżce. Najlepiej przejść po kolei, bo każda lekcja korzysta z poprzednich. Kolokwium za pasem? Możesz otworzyć ją od razu.';
      tresc.append(nag, p);
      modal(tresc,
        [['Otwórz mimo to', 'jz-btn-glow', () => otworz(w)], ['Wracam do ścieżki', 'jz-btn-ghost']]);
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
      k.innerHTML = src.innerHTML;
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
