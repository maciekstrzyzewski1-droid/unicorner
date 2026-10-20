// Operacje na wierszach „w ruchu”: plan animacji (kroki, podpisy, kartka) i objaśnienia rachunków.
// Wszystko liczone przy buildzie — przeglądarka tylko pokazuje gotowe elementy i przesuwa ich kopie.
// Kartka = odejmowanie (albo dodawanie) pisemne: na górze wiersz, który zmieniasz, pod nim wiersz pomocniczy
// pomnożony przez liczbę z operacji (znak operacji z lewej), pod linią wynik.
import { Q, opTex } from './macierze.js';

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const lcm = (a, b) => (a / gcd(a, b)) * b;
const W = (i) => `w_{${i + 1}}`;
const liczba = (n) => (n < 0 ? `-${-n}` : `${n}`);

// ---------- objaśnienia rachunków („jak to policzyć”) ----------
// schodki po osi liczbowej: schodki(1, 2, -1) → 1 \to 0 \to -1
function schodki(start, ile, kier) {
  const t = [start];
  let v = start;
  for (let k = 0; k < ile; k++) { v += kier; t.push(v); }
  return t.map(liczba).join(' \\to ');
}
// a − b dla liczb całkowitych, b ≥ 0
function odejmijCalk(a, b) {
  const r = a - b;
  if (b === 0 || (a >= 0 && r >= 0)) return '';
  if (a >= 0) {
    if (b <= 4) return `Odejmujesz więcej, niż masz: stoisz na $${a}$ i schodzisz o $${b}$ w dół: $${schodki(a, b, -1)}$.`;
    return `Odejmujesz więcej, niż masz. Do zera schodzisz o $${a}$, a z $${b}$ zostaje jeszcze $${b - a}$ — o tyle schodzisz poniżej zera. Wynik: $${liczba(r)}$.`;
  }
  if (b <= 4) return `Jesteś już poniżej zera i schodzisz jeszcze niżej: $${schodki(a, b, -1)}$.`;
  return `Jesteś już poniżej zera ($${liczba(a)}$) i schodzisz o $${b}$ niżej: $${-a} + ${b} = ${-r}$, więc wynik to $${liczba(r)}$.`;
}
// a + b dla liczb całkowitych, b ≥ 0
function dodajCalk(a, b) {
  const r = a + b;
  if (b === 0 || a >= 0) return '';
  if (b <= 4) return `Stoisz na $${liczba(a)}$ i idziesz o $${b}$ w górę: $${schodki(a, b, 1)}$.`;
  if (r >= 0) return `Stoisz na $${liczba(a)}$ i idziesz o $${b}$ w górę. Do zera potrzebujesz $${-a}$, zostaje jeszcze $${r}$ — wynik: $${r}$.`;
  return `Stoisz na $${liczba(a)}$ i idziesz o $${b}$ w górę. Do zera nie dojdziesz (brakowałoby $${-a}$), więc zostajesz poniżej: $${-a} - ${b} = ${-r}$, wynik to $${liczba(r)}$.`;
}
function calkowite(a, znak, b) {
  if (znak === '-' && b < 0) {
    const t = `Odjąć liczbę ujemną to tak samo, jak dodać liczbę przeciwną: $${a} - (${b}) = ${a} + ${-b}$.`;
    const dalej = dodajCalk(a, -b);
    return dalej ? `${t} ${dalej}` : t;
  }
  if (znak === '+' && b < 0) {
    const t = `Dodać liczbę ujemną to tak samo, jak ją odjąć: $${a} + (${b}) = ${a} - ${-b}$.`;
    const dalej = odejmijCalk(a, -b);
    return dalej ? `${t} ${dalej}` : t;
  }
  return znak === '-' ? odejmijCalk(a, b) : dodajCalk(a, b);
}
function ulamki(a, znak, b) {
  const d = lcm(a.d, b.d);
  const A = a.n * (d / a.d), B = b.n * (d / b.d);
  const r = znak === '-' ? A - B : A + B;
  const f = (x) => (x < 0 ? `-\\frac{${-x}}{${d}}` : `\\frac{${x}}{${d}}`);
  const fp = (x) => (x < 0 ? `\\left(-\\frac{${-x}}{${d}}\\right)` : `\\frac{${x}}{${d}}`);
  const wynik = new Q(r, d);
  const skrot = wynik.d === d ? '' : ` = ${wynik.tex()}`;
  const pocz = a.d === d && b.d === d ? 'Ułamki mają ten sam mianownik, więc liczysz same liczniki' : `Sprowadzasz ułamki do wspólnego mianownika $${d}$`;
  return `${pocz}: $${f(A)} ${znak} ${fp(B)} = \\frac{${A} ${znak} ${B < 0 ? `(${B})` : B}}{${d}} = ${f(r)}${skrot}$.`;
}
// a ± b: wyrażenie, wynik i (dla trudniejszych przypadków) zdanie „jak to policzyć”
export function dzialanie(a, znak, b) {
  a = Q.of(a); b = Q.of(b);
  const wynik = znak === '-' ? a.sub(b) : a.add(b);
  const expr = `${a.tex()} ${znak} ${b.tex(true)}`;
  const uwaga = a.calk && b.calk ? calkowite(a.n, znak, b.n) : ulamki(a, znak, b);
  return { expr, wynik, uwaga };
}
// v · c: wyrażenie, wynik, zdanie „jak to policzyć” i typ (do jednego zdania zbiorczego w podpisie)
export function iloczyn(v, c) {
  v = Q.of(v); c = Q.of(c);
  const wynik = v.mul(c);
  const expr = `${v.tex(true)} \\cdot ${c.tex(true)}`;
  if (v.zero) return { expr, wynik, typ: 'zero', uwaga: 'Zero razy dowolna liczba to zero.' };
  if (c.jeden) return { expr, wynik, typ: '', uwaga: '' };
  if (c.eq(-1)) return { expr, wynik, typ: 'znak', uwaga: 'Mnożenie przez $-1$ zmienia tylko znak.' };
  if (v.calk && c.calk) {
    const iw = `$${v.abs().tex()} \\cdot ${c.abs().tex()} = ${wynik.abs().tex()}$`;
    if (v.ujemna && !c.ujemna) return { expr, wynik, typ: 'mp', uwaga: `Minus razy plus daje minus: ${iw}, więc wynik to $${wynik.tex()}$.` };
    if (!v.ujemna && c.ujemna) return { expr, wynik, typ: 'pm', uwaga: `Plus razy minus daje minus: ${iw}, więc wynik to $${wynik.tex()}$.` };
    if (v.ujemna && c.ujemna) return { expr, wynik, typ: 'mm', uwaga: `Minus razy minus daje plus: ${iw}.` };
    return { expr, wynik, typ: '', uwaga: '' };
  }
  if (c.abs().n === 1 && c.d > 1) {
    const k = c.d, iq = v.div(k);
    if (!c.ujemna) return { expr, wynik, typ: 'dziel', uwaga: `Mnożenie przez $${c.tex()}$ to dzielenie przez $${k}$: $${v.tex(true)} : ${k} = ${wynik.tex()}$.` };
    return { expr, wynik, typ: 'dziel', uwaga: `Mnożenie przez $${c.tex()}$ to dzielenie przez $${k}$ i zmiana znaku: $${v.tex(true)} : ${k} = ${iq.tex()}$, a po zmianie znaku $${wynik.tex()}$.` };
  }
  const num = v.n * c.n, den = v.d * c.d;
  const surowy = num < 0 ? `-\\frac{${-num}}{${den}}` : `\\frac{${num}}{${den}}`;
  const skrot = wynik.n === num && wynik.d === den ? '' : ` = ${wynik.tex()}`;
  return { expr, wynik, typ: 'ulamek', uwaga: `Mnożysz licznik przez licznik, a mianownik przez mianownik: $${expr} = ${surowy}${skrot}$.` };
}
const ZASADA = {
  zero: 'Zero razy dowolna liczba to zero.',
  znak: 'Mnożenie przez $-1$ zmienia tylko znak.',
  mp: 'Minus razy plus daje minus.',
  pm: 'Plus razy minus daje minus.',
  mm: 'Minus razy minus daje plus.',
  dziel: 'Mnożenie przez ułamek z jedynką w liczniku to dzielenie przez jego mianownik.',
  ulamek: 'Przy ułamku mnożysz licznik przez licznik, a mianownik przez mianownik.',
};

// ---------- plan animacji jednego kroku ----------
// k — wynik krok()/lancuch() z lib/macierze.js; kreska — kolumna, po której stoi pionowa kreska.
// Zwraca { kroki: [{ a, op, j?, w?, z?, wa?, wb?, rows, html }], kartki: [{ tex, linie } | null], wstaw: { wiersz: nrKroku } }.
export function planRuchu(k, kreska) {
  const przed = k.przed, po = k.po, n = przed[0].length;
  const doKreski = kreska === undefined ? n : kreska + 1;
  const zaKreska = n - doKreski;
  const kolNazwa = (j) => (j < doKreski ? `Kolumna ${j + 1}` : zaKreska === 1 ? 'Kolumna za kreską' : `Kolumna ${j + 1} (za kreską)`);
  const wektor = (R) => `\\left(${R.map((v, j) => `${v.tex()}${j === n - 1 ? '' : kreska === j ? ' \\mid ' : ',\\ '}`).join('')}\\right)`;
  const kroki = [], kartki = [], wstaw = {};
  const dodaj = (s) => { kroki.push(s); return kroki.length - 1; };
  const sprawdz = (R, w) => R.forEach((v, j) => { if (!v.eq(po[w][j])) throw new Error(`Ruch: wynik w wierszu ${w + 1}, kolumnie ${j + 1} nie zgadza się z krokiem`); });
  const opisy = [];

  dodaj({ a: 'start', op: '', rows: null, html: '' }); // treść uzupełniona na końcu
  k.ops.forEach((o, nr) => {
    if (o.t === 'zam') {
      opisy.push(`zamieniasz miejscami wiersze ${o.a + 1} i ${o.b + 1}`);
      const s = dodaj({ a: 'zamien', op: String(nr), wa: o.a, wb: o.b, rows: [o.a, o.b],
        html: `Wiersze ${o.a + 1} i ${o.b + 1} zamieniają się miejscami. Liczby w nich zostają te same — zmienia się tylko kolejność wierszy.` });
      wstaw[o.a] = s; wstaw[o.b] = s;
      kartki.push(null);
      return;
    }
    const T = przed[o.w], c = Q.of(o.c);
    if (o.t === 'razy') {
      const R = T.map((v) => v.mul(c));
      sprawdz(R, o.w);
      const cel = R.findIndex((v, j) => j < doKreski && v.jeden && !T[j].jeden);
      opisy.push(`mnożysz wiersz ${o.w + 1} przez $${c.tex()}$${cel >= 0 ? ` — cel: jedynka w kolumnie ${cel + 1} (teraz stoi tam $${T[cel].tex()}$)` : ''}`);
      const sP = dodaj({ a: 'przepisz', op: String(nr), w: o.w, rows: [o.w], html: `Zapisz na kartce wiersz ${o.w + 1} — ten, który zmieniasz.` });
      const wyniki = T.map((v, j) => {
        const m = iloczyn(v, c);
        const s = dodaj({ a: 'kol', op: String(nr), j, rows: [o.w],
          html: `${kolNazwa(j)}: $${m.expr} = ${m.wynik.tex()}$.${m.uwaga ? ` ${m.uwaga}` : ''}${j === cel ? ' To jest jedynka, o którą chodziło.' : ''}` });
        return { v: m.wynik.tex(), e: m.expr, od: s };
      });
      const sW = dodaj({ a: 'wstaw', op: String(nr), w: o.w, rows: [o.w],
        html: `Wynik spod linii to nowy wiersz ${o.w + 1}: $${wektor(R)}$. Wstawiasz go do macierzy po prawej w miejsce starego.` });
      wstaw[o.w] = sW;
      kartki.push({ tex: opTex(o), linie: [
        { op: '', lab: W(o.w), cls: 'is-t', cells: T.map((v) => ({ v: v.tex(), od: sP })) },
        { op: `\\cdot\\, ${c.tex(true)}`, lab: `${W(o.w)}'`, cls: 'is-w', cells: wyniki },
      ] });
      return;
    }
    // dodawanie wielokrotności: w' = w + c · z — na kartce jako w ∓ |c| · z
    const m = c.abs(), znak = c.ujemna ? '-' : '+', Z = przed[o.z];
    const P = Z.map((v) => v.mul(m));
    const R = T.map((v, j) => (c.ujemna ? v.sub(P[j]) : v.add(P[j])));
    sprawdz(R, o.w);
    const cel = R.findIndex((v, j) => j < doKreski && v.zero && !T[j].zero);
    const pomocTxt = k.zmienione.includes(o.z)
      ? `wiersza ${o.z + 1} (w tej operacji tylko pomaga — bierzesz jego liczby z macierzy po lewej)`
      : `wiersza ${o.z + 1} (turkusowy — on się nie zmienia)`;
    opisy.push(`zmieniasz wiersz ${o.w + 1} (złoty) za pomocą ${pomocTxt}${cel >= 0 ? `. Cel: zero w kolumnie ${cel + 1} wiersza ${o.w + 1} — teraz stoi tam $${T[cel].tex()}$` : ''}`);
    const sP = dodaj({ a: 'przepisz', op: String(nr), w: o.w, rows: [o.w, o.z], html: `Zapisz na kartce wiersz ${o.w + 1} — ten, który zmieniasz.` });
    const ilo = Z.map((v) => iloczyn(v, m));
    const znakTxt = c.ujemna ? 'Minus z lewej przypomina, że ten wiersz odejmujesz.' : 'Plus z lewej przypomina, że ten wiersz dodajesz.';
    let mnozHtml;
    if (m.jeden) mnozHtml = `Pod spodem przepisz wiersz ${o.z + 1}. Mnożysz go przez $1$, więc liczby się nie zmieniają. ${znakTxt}`;
    else {
      const typy = [...new Set(ilo.map((x) => x.typ).filter(Boolean))].map((t) => ZASADA[t]).join(' ');
      mnozHtml = `Pod spodem zapisz wiersz ${o.z + 1} pomnożony przez $${m.tex()}$ — każdą liczbę osobno: ${ilo.map((x) => `$${x.expr} = ${x.wynik.tex()}$`).join(', ')}.${typy ? ` ${typy}` : ''} ${znakTxt}`;
    }
    const sM = dodaj({ a: 'mnoz', op: String(nr), z: o.z, rows: [o.w, o.z], html: mnozHtml });
    const wyniki = T.map((v, j) => {
      const d = dzialanie(v, znak, P[j]);
      const s = dodaj({ a: 'kol', op: String(nr), j, rows: [o.w, o.z],
        html: `${kolNazwa(j)}: $${d.expr} = ${d.wynik.tex()}$.${d.uwaga ? ` ${d.uwaga}` : ''}${j === cel ? ' To zero było celem tej operacji.' : ''}` });
      return { v: d.wynik.tex(), e: d.expr, od: s };
    });
    const sW = dodaj({ a: 'wstaw', op: String(nr), w: o.w, rows: [o.w],
      html: `Wynik spod linii to nowy wiersz ${o.w + 1}: $${wektor(R)}$. Wstawiasz go do macierzy po prawej w miejsce starego.` });
    wstaw[o.w] = sW;
    kartki.push({ tex: opTex(o), linie: [
      { op: '', lab: W(o.w), cls: 'is-t', cells: T.map((v) => ({ v: v.tex(), od: sP })) },
      { op: znak, lab: m.jeden ? W(o.z) : `${m.tex()} \\cdot ${W(o.z)}`, cls: 'is-z', cells: P.map((v, j) => ({ v: v.tex(), e: m.jeden ? null : ilo[j].expr, od: sM })) },
      { op: '', lab: `${W(o.w)}'`, cls: 'is-w', cells: wyniki },
    ] });
  });

  const duzaLitera = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const lpOp = k.ops.length;
  kroki[0].html = lpOp === 1
    ? `Po lewej macierz przed krokiem. ${duzaLitera(opisy[0])}.`
    : `Po lewej macierz przed krokiem. W tym kroku są ${lpOp} operacje — liczysz je po kolei, zawsze na wierszach z macierzy po lewej. ${opisy.map((t, i) => `${i + 1}) ${duzaLitera(t)}.`).join(' ')}`;
  const bezZmian = [...Array(przed.length).keys()].filter((i) => !k.zmienione.includes(i)).map((i) => i + 1);
  const lista = (a) => (a.length <= 2 ? a.join(' i ') : `${a.slice(0, -1).join(', ')} i ${a[a.length - 1]}`);
  dodaj({ a: 'koniec', op: '', rows: null,
    html: `Gotowe — tak powstała macierz po prawej.${bezZmian.length ? ` ${bezZmian.length > 1 ? 'Wiersze' : 'Wiersz'} ${lista(bezZmian)} przepisujesz bez zmian.` : ''}` });
  return { kroki, kartki, wstaw };
}
