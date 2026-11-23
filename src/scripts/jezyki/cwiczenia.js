import { $, $$, h, tasuj, ruch } from './dom.js';
import { norm, bezAkc, porownaj, porownajForme, zaimekZwrotny } from './porownanie.js';
import { jezyk, mow, mowa, wskazowkaGlosu } from './mowa.js';

const RANGA_FORMY = { ok: 3, akcent: 2, zaimek: 1 };
const BRAK_ZAIMKA = '✗ Brakuje zaimka';

// „Wpisz” z c.forma: najlepszy wynik spośród dopuszczalnych odpowiedzi (ok > akcent > zaimek > null)
function sprawdzForme(i, c) {
  i.readOnly = true;
  let w = null, zaim = null;
  for (const a of c.a) {
    const r = porownajForme(i.value, a, c.forma.os);
    if ((RANGA_FORMY[r] || 0) > (RANGA_FORMY[w] || 0)) { w = r; if (r === 'zaimek') zaim = zaimekZwrotny(a); }
  }
  const ok = w === 'ok' || w === 'akcent';
  i.classList.add(ok ? 'is-ok' : 'is-bad');
  const wynik = { ok, akcent: w === 'akcent', poprawnie: c.a[0], mowic: c.a[0] };
  if (w === 'zaimek') {
    wynik.naglowek = BRAK_ZAIMKA;
    wynik.info = `Czasownik dobrze, ale zabrakło zaimka ${zaim}.`;
  }
  return wynik;
}

const formaPola = (n) => (n === 1 ? '1 polu' : `${n} polach`);

// pole odmiany -> wiersz z wynikiem; tekst ucznia tylko przez textContent
function wierszWyniku(p, wynik, poprawna) {
  const wpis = p.value.trim();
  const sp = h('span', 'jz-odm-wart', '');
  sp.lang = jezyk();
  if (wynik === 'ok') {
    sp.classList.add('is-ok');
    sp.textContent = p.value.trim();
  } else {
    sp.classList.add(wynik === 'akcent' ? 'is-ok' : 'is-bad');
    if (wynik === 'akcent') sp.classList.add('is-akcent');
    const b = document.createElement('b');
    b.textContent = poprawna;
    sp.append(b);
    if (wpis) { const sk = document.createElement('s'); sk.textContent = wpis; sp.append(sk); }
  }
  p.replaceWith(sp);
}

function infoZaimki(zaimkowe, mieszane, f) {
  const lista = zaimkowe.map((i) => zaimekZwrotny(f[i])).join(', ');
  const n = formaPola(zaimkowe.length);
  return mieszane
    ? `W ${n} zabrakło też zaimka: ${lista}.`
    : `Czasowniki dobrze, ale w ${n} zabrakło zaimka: ${lista}. Przy czasownikach na -se zaimek to część odpowiedzi.`;
}

function sprawdzOdmiane(pola, c) {
  const wyniki = pola.map((p, i) => porownajForme(p.value, c.f[i], i));
  pola.forEach((p, i) => { p.readOnly = true; wierszWyniku(p, wyniki[i], c.f[i]); });
  const zle = wyniki.map((w, i) => (w === 'ok' || w === 'akcent' ? -1 : i)).filter((i) => i >= 0);
  const zaimkowe = zle.filter((i) => wyniki[i] === 'zaimek');
  const wynik = { ok: zle.length === 0, akcent: wyniki.includes('akcent'), poprawnie: null, mowic: c.f.join(', ') };
  if (zaimkowe.length) {
    wynik.naglowek = BRAK_ZAIMKA;
    wynik.info = infoZaimki(zaimkowe, zaimkowe.length < zle.length, c.f);
  }
  return wynik;
}

export const ETYKIETA = { wybor: 'Wybierz', wiele: 'Zaznacz wszystkie', wpisz: 'Wpisz', uloz: 'Ułóż zdanie', pary: 'Połącz w pary', kat: 'Posortuj', odm: 'Odmień', luki: 'Uzupełnij tekst', sluchaj: 'Posłuchaj', pisz: 'Twoja wypowiedź' };
// pasek znaków w dolnej belce (tylko komputer). „ü” nie występuje w żadnej odpowiedzi kursu, więc go nie ma;
// ¿ i ¡ są, choć porównanie odpowiedzi ignoruje znaki przestankowe
export const ZNAKI = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

export function klawiatura(getPole) {
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
export function pole(placeholder) {
  const i = h('input', 'jz-pole');
  i.type = 'text';
  i.autocomplete = 'off';
  i.autocapitalize = 'off';
  i.spellcheck = false;
  i.setAttribute('autocorrect', 'off');
  i.lang = jezyk();
  i.enterKeyHint = 'done';
  if (placeholder) i.placeholder = placeholder;
  return i;
}

/**
 * Każdy renderer zwraca { el, gotowe(), sprawdz() → { ok, akcent?, poprawnie?, mowic? }, pierwszyFokus?, aktywnePole?() }.
 * aktywnePole() mają renderery z polami tekstowymi: silnik podpina do niego pasek znaków w dolnej belce.
 */
export const R = {
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
    b.addEventListener('click', () => { mow(c.mow); wskazowkaGlosu(); });
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
    el.append(i);
    return {
      el, pierwszyFokus: i, aktywnePole: () => i,
      gotowe: () => i.value.trim().length > 0,
      sprawdz() {
        i.readOnly = true;
        if (c.forma) return sprawdzForme(i, c);
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
      b.lang = jezyk();
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
        if (jezyk() && /[a-záéíóúñ¿¡]/i.test(a.dataset.v)) mow(a.dataset.v);
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
      if (strona === 'L') b.lang = jezyk();
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
      b.lang = jezyk();
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
    return {
      el, pierwszyFokus: pola[0], aktywnePole: () => akt,
      gotowe: () => pola.every((p) => p.value.trim()),
      sprawdz() { return sprawdzOdmiane(pola, c); },
    };
  },
  luki(c, gotowy) {
    const el = h('div', 'jz-luki');
    const dobre = [];
    const tekst = h('p', 'jz-luki-t');
    tekst.lang = jezyk();
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
        b.lang = jezyk();
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
    return {
      el, pierwszyFokus: pola[0], aktywnePole: () => akt,
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
          if (w !== 'ok') { const pop = h('span', 'jz-luka-pop'); pop.lang = jezyk(); pop.textContent = wzor; p.after(pop); }
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
    t.lang = jezyk();
    t.placeholder = 'Napisz po hiszpańsku (możesz też powiedzieć na głos i od razu sprawdzić wzór).';
    t.addEventListener('input', gotowy);
    el.append(t);
    return {
      el, pierwszyFokus: t, aktywnePole: () => t,
      gotowe: () => true,
      sprawdz() {
        t.readOnly = true;
        const lista = (c.punkty || []).map((p) => `<li>${p}</li>`).join('');
        return { ok: true, neutral: true, info: `<b>Wzór:</b> <span lang="es">${c.wzor}</span>${lista ? `<br><b>Sprawdź u siebie:</b><ul class="jz-lista">${lista}</ul>` : ''}`, mowic: c.wzor };
      },
    };
  },
};
