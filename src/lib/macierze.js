// Macierze: rachunek na ułamkach liczony przy buildzie + opisy „krok po kroku” dla komponentów modułu 4.
// Umowa z zajęć: a_ij — i to numer wiersza, j to numer kolumny (liczone od 1). W kodzie indeksy są od 0.
// Operacje elementarne zapisujemy jak na zajęciach: w_2' = w_2 - w_1, w_1 ↔ w_3, w_3' = w_3 · 1/2.
import { tex } from './tex.js';

// ---------- liczby wymierne ----------
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

export class Q {
  constructor(n, d = 1) {
    if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) throw new Error(`Macierze: zły ułamek ${n}/${d}`);
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d);
    this.n = n / g || 0; // || 0 usuwa -0
    this.d = d / g;
  }
  static of(x) {
    if (x instanceof Q) return x;
    if (typeof x === 'number') {
      if (Number.isInteger(x)) return new Q(x);
      throw new Error(`Macierze: liczba niecałkowita ${x} — podaj ją jako napis 'a/b'`);
    }
    if (typeof x === 'string') {
      const m = x.trim().replace('−', '-').match(/^(-?\d+)(?:\/(\d+))?$/);
      if (!m) throw new Error(`Macierze: nie umiem odczytać liczby „${x}”`);
      return new Q(Number(m[1]), m[2] ? Number(m[2]) : 1);
    }
    throw new Error(`Macierze: nieznany typ wartości ${x}`);
  }
  add(o) { o = Q.of(o); return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = Q.of(o); return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = Q.of(o); return new Q(this.n * o.n, this.d * o.d); }
  div(o) { o = Q.of(o); if (o.n === 0) throw new Error('Macierze: dzielenie przez 0'); return new Q(this.n * o.d, this.d * o.n); }
  neg() { return new Q(-this.n, this.d); }
  eq(o) { o = Q.of(o); return this.n === o.n && this.d === o.d; }
  get zero() { return this.n === 0; }
  get jeden() { return this.n === 1 && this.d === 1; }
  get calk() { return this.d === 1; }
  get ujemna() { return this.n < 0; }
  abs() { return new Q(Math.abs(this.n), this.d); }
  // LaTeX: -\frac{4}{3}; tex(true) → w nawiasie, gdy ujemna: (-3), \left(-\frac{1}{3}\right)
  tex(nawias = false) {
    const a = Math.abs(this.n);
    const s = this.d === 1 ? `${a}` : `\\frac{${a}}{${this.d}}`;
    if (!this.ujemna) return s;
    if (!nawias) return `-${s}`;
    return this.d === 1 ? `(-${s})` : `\\left(-${s}\\right)`;
  }
  txt() { return `${this.ujemna ? '−' : ''}${Math.abs(this.n)}${this.d === 1 ? '' : `/${this.d}`}`; }
  valueOf() { return this.n / this.d; }
}
export const q = (x) => Q.of(x);

// ---------- macierze ----------
export const mat = (rows) => rows.map((r) => r.map(Q.of));
export const wym = (A) => [A.length, A[0].length];
export const wymTex = (A) => `${A.length} \\times ${A[0].length}`;
export const jednostkowa = (n) => [...Array(n)].map((_, i) => [...Array(n)].map((_, j) => new Q(i === j ? 1 : 0)));
export const rowne = (A, B) => A.length === B.length && A.every((r, i) => r.length === B[i].length && r.every((v, j) => Q.of(v).eq(B[i][j])));
const zip = (A, B, f, co) => {
  A = mat(A); B = mat(B);
  if (A.length !== B.length || A[0].length !== B[0].length) throw new Error(`Macierze: ${co} wymaga tych samych wymiarów (${wymTex(A)} i ${wymTex(B)})`);
  return A.map((r, i) => r.map((v, j) => f(v, B[i][j])));
};
export const dodaj = (A, B) => zip(A, B, (x, y) => x.add(y), 'dodawanie');
export const odejmij = (A, B) => zip(A, B, (x, y) => x.sub(y), 'odejmowanie');
export const razyLiczba = (c, A) => mat(A).map((r) => r.map((v) => v.mul(c)));
export const T = (A) => mat(A)[0].map((_, j) => mat(A).map((r) => r[j]));
export const dasieMnozyc = (A, B) => A[0].length === B.length;
export function mnoz(A, B) {
  A = mat(A); B = mat(B);
  if (!dasieMnozyc(A, B)) throw new Error(`Macierze: mnożenie ${wymTex(A)} · ${wymTex(B)} niewykonalne`);
  return A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s.add(v.mul(B[k][j])), new Q(0))));
}
// macierz po skreśleniu wiersza i oraz kolumny j
export const podmacierz = (A, i, j) => mat(A).filter((_, r) => r !== i).map((row) => row.filter((_, c) => c !== j));
export function det(A) {
  A = mat(A);
  const n = A.length;
  if (A.some((r) => r.length !== n)) throw new Error('Macierze: wyznacznik liczymy tylko z macierzy kwadratowej');
  if (n === 1) return A[0][0];
  if (n === 2) return A[0][0].mul(A[1][1]).sub(A[0][1].mul(A[1][0]));
  return A[0].reduce((s, v, j) => s.add(v.mul(dop(A, 0, j))), new Q(0));
}
export const znak = (i, j) => ((i + j) % 2 === 0 ? 1 : -1); // (-1)^{i+j} — dla indeksów od 0 to samo co od 1
export const minor = (A, i, j) => det(podmacierz(A, i, j));
export const dop = (A, i, j) => minor(A, i, j).mul(znak(i, j));
export const macierzDop = (A) => mat(A).map((r, i) => r.map((_, j) => dop(A, i, j)));
export function odwrotna(A) {
  const d = det(A);
  if (d.zero) throw new Error('Macierze: macierz osobliwa (det = 0) nie ma odwrotnej');
  return T(macierzDop(A)).map((r) => r.map((v) => v.div(d)));
}
// postać schodkowa zredukowana — tylko do liczenia rzędu i do sprawdzania wyników
export function rzad(A) {
  const M = mat(A).map((r) => r.slice());
  let r = 0;
  for (let c = 0; c < M[0].length && r < M.length; c++) {
    const p = M.findIndex((row, i) => i >= r && !row[c].zero);
    if (p < 0) continue;
    [M[r], M[p]] = [M[p], M[r]];
    for (let i = 0; i < M.length; i++) {
      if (i === r || M[i][c].zero) continue;
      const f = M[i][c].div(M[r][c]);
      M[i] = M[i].map((v, k) => v.sub(f.mul(M[r][k])));
    }
    r++;
  }
  return r;
}

// ---------- zapis ----------
export const wektorTex = (row) => `(${row.map((v) => Q.of(v).tex()).join(',\\ ')})`;
export const bmatrix = (A) => `\\begin{bmatrix}${mat(A).map((r) => r.map((v) => v.tex()).join(' & ')).join(' \\\\ ')}\\end{bmatrix}`;
// suma składników z poprawnymi znakami: [6, 0, -4] → "6 + 0 - 4"
export const sumaTex = (xs) => xs.map((x, k) => { x = Q.of(x); return k === 0 ? x.tex() : x.ujemna ? `- ${x.abs().tex()}` : `+ ${x.tex()}`; }).join(' ');
const w = (i) => `w_{${i + 1}}`;
// współczynnik przed wierszem: 1 → "", -1 → "-", 2 → "2", 1/2 → "\frac{1}{2}"
const wsp = (c) => (c.jeden ? '' : c.eq(-1) ? '-' : c.tex());

// ---------- mnożenie: rozpisanie jednej kratki ----------
export function kratka(A, B, i, j) {
  A = mat(A); B = mat(B);
  const pary = A[i].map((a, k) => [a, B[k][j]]);
  const iloczyny = pary.map(([a, b]) => a.mul(b));
  const suma = iloczyny.reduce((s, x) => s.add(x), new Q(0));
  const rach = pary.map(([a, b]) => `${a.tex(true)} \\cdot ${b.tex(true)}`).join(' + ');
  return { pary, iloczyny, suma, tex: `${rach} = ${sumaTex(iloczyny)} = ${suma.tex()}` };
}
// HTML: tabelka „wiersz nad kolumną” + suma — do panelu po kliknięciu i do wyjaśnień w ćwiczeniach
export function kratkaHtml(A, B, i, j, nA = 'A', nB = 'B', nC = 'C') {
  const k = kratka(A, B, i, j);
  const td = (x) => `<td>${tex(x.tex())}</td>`;
  const nr = k.pary.map((_, n) => `<th class="k-zl-y">${n + 1}.</th>`).join('');
  return `<p><b>Kratka ${tex(`${nC.toLowerCase()}_{${i + 1}${j + 1}}`)}</b> (wiersz ${i + 1}, kolumna ${j + 1}): bierzesz <b>wiersz ${i + 1}</b> macierzy ${tex(nA)} i <b>kolumnę ${j + 1}</b> macierzy ${tex(nB)}. Mnożysz liczby parami — pierwszą z pierwszą, drugą z drugą… — i dodajesz iloczyny.</p>` +
    `<table class="k-zl-tab"><tr><th></th>${nr}</tr>` +
    `<tr><th>wiersz ${i + 1} z ${tex(nA)}</th>${k.pary.map(([a]) => td(a)).join('')}</tr>` +
    `<tr><th>kolumna ${j + 1} z ${tex(nB)}</th>${k.pary.map(([, b]) => td(b)).join('')}</tr>` +
    `<tr class="k-zl-wyn"><th>iloczyn</th>${k.iloczyny.map((x) => `<td class="is-hit">${tex(x.tex())}</td>`).join('')}</tr></table>` +
    `<p>${tex(`${nC.toLowerCase()}_{${i + 1}${j + 1}} = ${k.tex}`)}</p>`;
}

// ---------- wyznacznik 2×2 i reguła Sarrusa ----------
// składniki: { znak: 1|-1, kom: [[i,j]...] (w macierzy rozszerzonej), wart: [Q], iloczyn: Q, nazwa: 'a_{11}a_{22}' }
export function przekatne(A) {
  A = mat(A);
  const n = A.length;
  if (n === 2) {
    const s = [
      { znak: 1, kom: [[0, 0], [1, 1]] },
      { znak: -1, kom: [[0, 1], [1, 0]] },
    ];
    s.forEach((t) => { t.wart = t.kom.map(([i, j]) => A[i][j]); t.iloczyn = t.wart.reduce((a, b) => a.mul(b)); t.nazwa = t.kom.map(([i, j]) => `a_{${i + 1}${j + 1}}`).join(''); });
    return { n, ext: A, skladniki: s, wynik: det(A) };
  }
  if (n !== 3) throw new Error('Macierze: reguła Sarrusa działa tylko dla macierzy 3×3');
  const ext = A.map((r) => [...r, r[0], r[1]]);
  const s = [];
  for (let c = 0; c < 3; c++) s.push({ znak: 1, kom: [[0, c], [1, c + 1], [2, c + 2]] });
  // minusy w kolejności ze slajdu: a13a22a31, a11a23a32, a12a21a33 (każdy czytany od górnego wiersza)
  for (const c of [2, 3, 4]) s.push({ znak: -1, kom: [[0, c], [1, c - 1], [2, c - 2]] });
  s.forEach((t) => {
    t.wart = t.kom.map(([i, j]) => ext[i][j]);
    t.iloczyn = t.wart.reduce((a, b) => a.mul(b));
    t.nazwa = t.kom.map(([i, j]) => `a_{${i + 1}${(j % 3) + 1}}`).join('');
  });
  const wynik = s.reduce((acc, t) => acc.add(t.iloczyn.mul(t.znak)), new Q(0));
  if (!wynik.eq(det(A))) throw new Error('Macierze: Sarrus nie zgadza się z wyznacznikiem');
  return { n, ext, skladniki: s, wynik };
}
// zapis „6 + 0 + 0 - 0 - 4 - (-1) = 3”
export function przekatneSumaTex(p) {
  return p.skladniki.map((t, k) => {
    const v = t.iloczyn;
    if (t.znak > 0) return k === 0 ? v.tex() : v.ujemna ? `+ ${v.tex(true)}` : `+ ${v.tex()}`;
    return v.ujemna ? `- ${v.tex(true)}` : `- ${v.tex()}`;
  }).join(' ');
}

// ---------- rozwinięcie Laplace'a ----------
// typ 'w' (wiersz) albo 'k' (kolumna), idx od 0
export function laplace(A, typ, idx) {
  A = mat(A);
  const n = A.length;
  const poz = [...Array(n).keys()].map((t) => (typ === 'w' ? [idx, t] : [t, idx]));
  const skladniki = poz.map(([i, j]) => {
    const a = A[i][j];
    const sub = podmacierz(A, i, j);
    const M = det(sub);
    const zn = znak(i, j);
    return { i, j, a, znak: zn, sub, M, D: M.mul(zn), wartosc: a.mul(M).mul(zn) };
  });
  const wynik = skladniki.reduce((s, t) => s.add(t.wartosc), new Q(0));
  if (!wynik.eq(det(A))) throw new Error('Macierze: Laplace nie zgadza się z wyznacznikiem');
  return { typ, idx, skladniki, wynik, zera: skladniki.filter((t) => t.a.zero).length };
}

// ---------- operacje elementarne na wierszach ----------
// { t: 'zam', a, b }  — zamiana wierszy a i b
// { t: 'razy', w, c } — w' = w · c (c ≠ 0)
// { t: 'dod', w, z, c } — w' = w + c · z
export function opTex(op) {
  if (op.t === 'zam') return `${w(op.a)} \\leftrightarrow ${w(op.b)}`;
  const c = Q.of(op.c);
  if (op.t === 'razy') return `${w(op.w)}' = ${w(op.w)} \\cdot ${c.tex(true)}`;
  const k = c.abs();
  return `${w(op.w)}' = ${w(op.w)} ${c.ujemna ? '-' : '+'} ${k.jeden ? '' : k.tex()}${w(op.z)}`;
}
// Kilka operacji w jednym kroku liczymy na wierszach sprzed kroku (jak na zajęciach).
// Wolno tylko tak, żeby dało się je ułożyć w kolejne pojedyncze operacje: wiersz używany do zmiany innego
// zmieniamy dopiero po nim, a dwa wiersze nie mogą zmieniać się „nawzajem”.
export function krok(A, ops) {
  const przed = mat(A);
  if (ops.some((o) => o.t === 'zam') && ops.length > 1) throw new Error('Macierze: zamianę wierszy rób w osobnym kroku');
  const cele = ops.filter((o) => o.t !== 'zam').map((o) => o.w);
  if (new Set(cele).size !== cele.length) throw new Error('Macierze: jeden wiersz zmieniony dwa razy w jednym kroku');
  ops.forEach((o) => { if (o.t !== 'zam' && Q.of(o.c).zero) throw new Error('Macierze: mnożenie przez 0 nie jest operacją elementarną'); });
  // kolejność: operacja czytająca wiersz r musi być przed operacją, która r zmienia
  const left = ops.slice(), order = [];
  while (left.length) {
    const k = left.findIndex((o) => o.t === 'zam' || !left.some((p) => p !== o && p.t === 'dod' && p.z === o.w));
    if (k < 0) throw new Error('Macierze: operacje w kroku zależą od siebie nawzajem — to nie są operacje elementarne');
    order.push(left.splice(k, 1)[0]);
  }
  const M = przed.map((r) => r.slice());
  for (const o of order) {
    if (o.t === 'zam') [M[o.a], M[o.b]] = [M[o.b], M[o.a]];
    else if (o.t === 'razy') M[o.w] = M[o.w].map((v) => v.mul(o.c));
    else M[o.w] = M[o.w].map((v, k) => v.add(Q.of(o.c).mul(M[o.z][k])));
  }
  // tabelki „w słupkach” do rachunku (wartości sprzed kroku)
  const tabele = ops.map((o) => {
    if (o.t === 'zam') return { op: o, tex: opTex(o), wiersze: [] };
    const c = Q.of(o.c);
    if (o.t === 'razy') return {
      op: o, tex: opTex(o),
      wiersze: [
        { lab: w(o.w), v: przed[o.w] },
        { lab: `${w(o.w)}'`, v: M[o.w], wynik: true },
      ],
    };
    return {
      op: o, tex: opTex(o),
      wiersze: [
        { lab: w(o.w), v: przed[o.w] },
        { lab: `${wsp(c)}${w(o.z)}`, v: przed[o.z].map((x) => x.mul(c)) },
        { lab: `${w(o.w)}'`, v: M[o.w], wynik: true },
      ],
    };
  });
  return {
    przed, ops, po: M, tabele,
    zrodla: [...new Set(ops.filter((o) => o.t === 'dod').map((o) => o.z))],
    zmienione: ops.flatMap((o) => (o.t === 'zam' ? [o.a, o.b] : [o.w])),
  };
}
export function lancuch(A, kroki) {
  const out = [];
  let M = mat(A);
  for (const ops of kroki) { const k = krok(M, ops); out.push(k); M = k.po; }
  return out;
}
// kolumny, które są kolumnami macierzy jednostkowej: [{ j, i }] — jedynka w wierszu i, poza nią zera
export const kolumnyJednostkowe = (A) => mat(A)[0].map((_, j) => j)
  .map((j) => { const col = A.map((r) => Q.of(r[j])); const i = col.findIndex((v) => v.jeden); return i >= 0 && col.every((v, k) => (k === i ? v.jeden : v.zero)) ? { j, i } : null; })
  .filter(Boolean);
