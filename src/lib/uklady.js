// Układy równań liniowych (moduł 5): zapis układu, analiza postaci bazowej, rozwiązanie ogólne
// i rozwiązania bazowe. Wszystko liczone przy buildzie na ułamkach (Q z lib/macierze.js).
// Zmienne x_1, x_2, … — w kodzie indeksy kolumn od 0. Macierz rozszerzona R = [A | b]: ostatnia kolumna to b.
import { Q, mat } from './macierze.js';

export const zm = (j) => `x_{${j + 1}}`;
const SUB = '₀₁₂₃₄₅₆₇₈₉';
export const zmTxt = (j) => `x${String(j + 1).split('').map((d) => SUB[+d]).join('')}`;

// współczynnik przy zmiennej (bez znaku): 1 → '', 3 → '3', 1/2 → '\frac{1}{2}'
const wsp = (a) => (a.jeden ? '' : a.tex());
// dokleja składnik z właściwym znakiem: pierwszy bez plusa
const doklej = (s, ujemny, t) => (!s ? (ujemny ? `-${t}` : t) : `${s} ${ujemny ? '-' : '+'} ${t}`);

// lewa strona równania: x_1 + 2x_2 - 7x_3 (zera pomijamy; same zera → 0)
export function lewaTex(row, n = row.length) {
  let s = '';
  for (let j = 0; j < n; j++) {
    const a = Q.of(row[j]);
    if (!a.zero) s = doklej(s, a.ujemna, `${wsp(a.abs())}${zm(j)}`);
  }
  return s || '0';
}
export const rownanieTex = (row, rhs) => `${lewaTex(row)} = ${Q.of(rhs).tex()}`;
// układ w klamrze z macierzy A i wektora b
export const ukladTex = (A, b) => `\\begin{cases} ${A.map((row, i) => rownanieTex(row, b[i])).join(' \\\\ ')} \\end{cases}`;
// to samo z macierzy rozszerzonej [A | b]
export const ukladR = (R) => { const M = mat(R); const n = M[0].length - 1; return ukladTex(M.map((r) => r.slice(0, n)), M.map((r) => r[n])); };
export const rozszerzona = (A, b) => mat(A).map((r, i) => [...r, Q.of(b[i])]);

// ---------- analiza postaci bazowej ----------
// R — macierz rozszerzona po operacjach elementarnych. Zwraca rodzaj układu, kolumny jednostkowe,
// zmienne bazowe (po jednej na wiersz), wolne (→ parametry) i zmienne „samotne” (wartość ustalona).
export function analiza(R) {
  const M = mat(R);
  const n = M[0].length - 1;
  const zerowe = [], sprzeczne = [];
  M.forEach((row, i) => { if (row.slice(0, n).every((v) => v.zero)) (row[n].zero ? zerowe : sprzeczne).push(i); });
  const jedn = [];
  for (let j = 0; j < n; j++) {
    const col = M.map((r) => r[j]);
    const i = col.findIndex((v) => v.jeden);
    if (i >= 0 && col.every((v, k) => (k === i ? v.jeden : v.zero))) jedn.push({ j, i });
  }
  const pivot = new Map(); // wiersz → kolumna z jego jedynką
  jedn.forEach(({ j, i }) => { if (!pivot.has(i)) pivot.set(i, j); });
  const niezerowe = M.map((_, i) => i).filter((i) => !zerowe.includes(i) && !sprzeczne.includes(i));
  const gotowa = sprzeczne.length > 0 || niezerowe.every((i) => pivot.has(i));
  const bazowe = [...pivot.values()].sort((a, b) => a - b);
  const wolne = [...Array(n).keys()].filter((j) => !bazowe.includes(j));
  const rodzaj = sprzeczne.length ? 'sprzeczny' : wolne.length ? 'nieoznaczony' : 'oznaczony';
  const samotne = niezerowe.filter((i) => M[i].slice(0, n).filter((v) => !v.zero).length === 1).map((i) => pivot.get(i)).filter((j) => j !== undefined);
  return { n, M, zerowe, sprzeczne, jedn, pivot, niezerowe, gotowa, bazowe, wolne, rodzaj, samotne, rzad: pivot.size };
}

// ---------- rozwiązanie ogólne ----------
// Zmienne spoza kolumn jednostkowych → parametry (litery a, c, d…; b zajęte przez wektor wyrazów wolnych).
export function ogolne(R, litery = ['a', 'c', 'd', 'e']) {
  const a = analiza(R);
  if (!a.gotowa) throw new Error('Układy: macierz nie jest w postaci bazowej');
  if (a.rodzaj === 'sprzeczny') throw new Error('Układy: układ sprzeczny nie ma rozwiązania ogólnego');
  const par = new Map(a.wolne.map((j, k) => [j, litery[k]]));
  const wierszZm = new Map([...a.pivot.entries()].map(([i, j]) => [j, i]));
  const wzory = [...Array(a.n).keys()].map((j) => {
    if (par.has(j)) return { j, wolna: true, prawa: par.get(j), tex: `${zm(j)} = ${par.get(j)}` };
    const row = a.M[wierszZm.get(j)];
    let s = row[a.n].zero ? '' : row[a.n].tex();
    a.wolne.forEach((k) => {
      const c = row[k].neg(); // przenosimy na prawą stronę — znak się zmienia
      if (!c.zero) s = doklej(s, c.ujemna, `${wsp(c.abs())}${par.get(k)}`);
    });
    return { j, wolna: false, prawa: s || '0', tex: `${zm(j)} = ${s || '0'}` };
  });
  const parametry = [...par.values()].map((p) => `${p} \\in \\mathbb{R}`).join(',\\ ');
  // wartość wektora dla konkretnych parametrów (do sprawdzeń)
  const dla = (vals) => [...Array(a.n).keys()].map((j) => {
    if (par.has(j)) return Q.of(vals[par.get(j)]);
    const row = a.M[wierszZm.get(j)];
    return a.wolne.reduce((acc, k) => acc.sub(row[k].mul(Q.of(vals[par.get(k)]))), row[a.n]);
  });
  return { ...a, par, wzory, parametry, dla };
}

// ---------- sprawdzenie: podstawienie wektora do równań ----------
// Zwraca linijki LaTeX „1 + 2 \cdot 2 = 5” dla każdego równania; rzuca błąd, gdy coś się nie zgadza.
export function sprawdz(A, b, x) {
  const M = mat(A), X = x.map(Q.of);
  return M.map((row, i) => {
    let s = '', sum = new Q(0);
    row.forEach((c, j) => {
      if (c.zero) return;
      sum = sum.add(c.mul(X[j]));
      const t = c.abs().jeden ? X[j].tex(true) : `${c.abs().tex()} \\cdot ${X[j].tex(true)}`;
      s = doklej(s, c.ujemna, t);
    });
    if (!sum.eq(b[i])) throw new Error(`Układy: wektor nie spełnia równania ${i + 1}`);
    return `${s || '0'} = ${sum.tex()}`;
  });
}

// ---------- rozwiązania bazowe ----------
const kombinacje = (arr, k) => (k === 0 ? [[]] : arr.flatMap((x, i) => kombinacje(arr.slice(i + 1), k - 1).map((c) => [x, ...c])));
const det = (M) => {
  if (M.length === 1) return M[0][0];
  return M[0].reduce((acc, v, j) => {
    const sub = M.slice(1).map((r) => r.filter((_, k) => k !== j));
    const t = v.mul(det(sub));
    return j % 2 ? acc.sub(t) : acc.add(t);
  }, new Q(0));
};
// równanie z podstawionymi wartościami: znane zmienne → liczby, niewiadome zostają literami
function podstawTex(row, n, val, niewiad) {
  let s = '';
  for (let j = 0; j < n; j++) {
    const c = row[j];
    if (c.zero) continue;
    if (niewiad.includes(j) && !val.has(j)) { s = doklej(s, c.ujemna, `${wsp(c.abs())}${zm(j)}`); continue; }
    const v = val.get(j);
    s = doklej(s, c.ujemna, c.abs().jeden ? v.tex(true) : `${c.abs().tex()} \\cdot ${v.tex(true)}`);
  }
  return `${s || '0'} = ${row[n].tex()}`;
}
// Dla każdej kombinacji r zmiennych (zawierającej zmienne samotne): niebazowe = 0, rozwiązujemy po kolei.
// A0, b0 — układ wyjściowy (do sprawdzenia wyniku).
export function bazowe(R, A0, b0) {
  const a = analiza(R);
  if (!a.gotowa) throw new Error('Układy: macierz nie jest w postaci bazowej');
  if (a.rodzaj !== 'nieoznaczony') throw new Error('Układy: rozwiązania bazowe liczymy dla układu nieoznaczonego');
  const n = a.n, r = a.rzad;
  const wszystkie = kombinacje([...Array(n).keys()], r);
  const odrzucone = wszystkie.filter((B) => !a.samotne.every((s) => B.includes(s)));
  const komb = wszystkie.filter((B) => a.samotne.every((s) => B.includes(s)));
  const wiersze = a.niezerowe;
  const wyniki = komb.map((B, idx) => {
    const val = new Map();
    const niebazowe = [...Array(n).keys()].filter((j) => !B.includes(j));
    niebazowe.forEach((j) => val.set(j, new Q(0)));
    const zera = wiersze.map((i) => ({ i, tex: podstawTex(a.M[i], n, val, B) }));
    const sub = wiersze.map((i) => B.map((j) => a.M[i][j]));
    const ok = !det(sub).zero;
    const kroki = [];
    if (ok) {
      let left = wiersze.slice(), guard = 0;
      while (left.length && guard++ < 20) {
        const k = left.findIndex((i) => B.filter((j) => !val.has(j) && !a.M[i][j].zero).length === 1);
        if (k < 0) throw new Error('Układy: tej bazy nie da się policzyć po kolei — dopisz rozwiązywanie układu');
        const i = left.splice(k, 1)[0];
        const row = a.M[i];
        const u = B.find((j) => !val.has(j) && !row[j].zero);
        let K = new Q(0);
        for (let j = 0; j < n; j++) if (j !== u && !row[j].zero) K = K.add(row[j].mul(val.get(j) ?? new Q(0)));
        const cu = row[u], prawa = row[n].sub(K), x = prawa.div(cu);
        const linie = [podstawTex(row, n, val, B)];
        const lu = `${cu.ujemna ? '-' : ''}${wsp(cu.abs())}${zm(u)}`;
        if (!K.zero) linie.push(`${lu} = ${row[n].tex()} ${K.ujemna ? '+' : '-'} ${K.abs().tex()} = ${prawa.tex()}`);
        else if (linie[0] !== `${lu} = ${row[n].tex()}`) linie.push(`${lu} = ${row[n].tex()}`);
        if (!cu.jeden) linie.push(`${zm(u)} = ${prawa.tex(true)} : ${cu.tex(true)} = ${x.tex()}`);
        kroki.push({ i, u, linie, wynik: `${zm(u)} = ${x.tex()}` });
        val.set(u, x);
      }
    }
    const wektor = ok ? [...Array(n).keys()].map((j) => val.get(j)) : null;
    if (ok && A0) sprawdz(A0, b0, wektor);
    // dla zbioru, który nie jest bazą: co się psuje (np. 0 = 2)
    const powod = ok ? null : (() => {
      const zle = wiersze.find((i) => B.every((j) => a.M[i][j].zero) && !a.M[i][n].zero);
      return zle !== undefined
        ? { typ: 'sprzecznosc', i: zle, tex: `0 = ${a.M[zle][n].tex()}` }
        : { typ: 'niejednoznaczne' };
    })();
    return { nr: idx + 1, B, niebazowe, ok, zera, kroki, wektor, powod,
      nazwa: `\\{${B.map(zm).join(', ')}\\}`,
      wektorTex: wektor ? `(${wektor.map((v) => v.tex()).join(',\\ ')})` : null };
  });
  // numeracja baz B^(1), B^(2)… tylko dla prawdziwych baz
  let k = 0;
  wyniki.forEach((w) => { if (w.ok) w.k = ++k; });
  return { ...a, r, wszystkie, odrzucone, komb, wyniki };
}

// ---------- opisy kratek macierzy rozszerzonej (do ćwiczeń i rysunków) ----------
// Skąd wzięła się liczba w wierszu i, kolumnie j macierzy [A | b] (j = n → wyraz wolny). Zwraca tekst z $…$.
export function opisKratki(A, b, i, j) {
  const M = mat(A), n = M[0].length, nr = i + 1;
  if (j === n) return `Po prawej stronie równania ${nr} stoi $${Q.of(b[i]).tex()}$. To wyraz wolny — trafia za kreskę, do ostatniej kolumny.`;
  const a = M[i][j], x = zm(j);
  if (a.zero) return `W równaniu ${nr} nie ma $${x}$. To tak, jakby stało $0 \\cdot ${x}$, więc wpisujesz 0.`;
  if (a.jeden) return `W równaniu ${nr} stoi samo $${x}$, czyli $1 \\cdot ${x}$. Wpisujesz 1.`;
  if (a.eq(-1)) return `W równaniu ${nr} stoi $-${x}$, czyli $(-1) \\cdot ${x}$. Wpisujesz −1.`;
  return `W równaniu ${nr} przy $${x}$ stoi $${a.tex()}$ — wpisujesz tę liczbę razem ze znakiem.`;
}
// kolumny jednostkowe i kolumny zmiennych wolnych — do kolorowania macierzy (Mx kolumny=…)
// tylko kolumny, które razem tworzą macierz jednostkową (po jednej na wiersz)
export const kolJedn = (R, styl = 'ok') => [...analiza(R).pivot.values()].map((j) => ({ j, styl }));
export const kolWolne = (R, styl = 'zloto') => analiza(R).wolne.map((j) => ({ j, styl }));
