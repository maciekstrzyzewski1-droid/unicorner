// Zbiory: działania na zbiorach skończonych liczone przy buildzie + opis „dlaczego” dla pojedynczego elementu.
// Elementy to liczby albo krótkie napisy. Działanie dostaje dwie wartości logiczne: „x ∈ A” i „x ∈ B”.
import { tex, texInline } from './tex.js';

export const DZIALANIA = {
  suma: { t: 'A \\cup B', f: (a, b) => a || b, regula: 'do sumy należy wszystko, co jest <b>w A lub w B</b> (wystarczy jeden ze zbiorów)' },
  iloczyn: { t: 'A \\cap B', f: (a, b) => a && b, regula: 'do części wspólnej należy tylko to, co jest <b>w A i w B</b> naraz' },
  roznicaAB: { t: 'A \\setminus B', f: (a, b) => a && !b, regula: 'do $A \\setminus B$ należy to, co jest <b>w A i nie jest w B</b>' },
  roznicaBA: { t: 'B \\setminus A', f: (a, b) => b && !a, regula: 'do $B \\setminus A$ należy to, co jest <b>w B i nie jest w A</b>' },
  dopA: { t: "A'", f: (a) => !a, regula: "do $A'$ należy wszystko z $U$, czego <b>nie ma w A</b>" },
  dopB: { t: "B'", f: (a, b) => !b, regula: "do $B'$ należy wszystko z $U$, czego <b>nie ma w B</b>" },
  dopSumy: { t: "(A \\cup B)'", f: (a, b) => !(a || b), regula: "do $(A \\cup B)'$ należy to, czego <b>nie ma ani w A, ani w B</b>" },
  dopIloczynu: { t: "(A \\cap B)'", f: (a, b) => !(a && b), regula: "do $(A \\cap B)'$ należy wszystko poza częścią wspólną" },
  // do sprawdzania praw de Morgana
  dopAidopB: { t: "A' \\cap B'", f: (a, b) => !a && !b, regula: "do $A' \\cap B'$ należy to, czego nie ma w A <b>i</b> nie ma w B" },
  dopAlubdopB: { t: "A' \\cup B'", f: (a, b) => !a || !b, regula: "do $A' \\cup B'$ należy to, czego nie ma w A <b>lub</b> nie ma w B" },
};

const op = (k) => {
  const o = DZIALANIA[k];
  if (!o) throw new Error(`Zbiory: nieznane działanie „${k}”`);
  return o;
};

export function sprawdz(U, A, B) {
  const u = new Set(U.map(String));
  for (const [n, Z] of [['A', A], ['B', B]]) for (const x of Z) if (!u.has(String(x))) throw new Error(`Zbiory: element ${x} ze zbioru ${n} nie należy do U`);
}

export const nalezy = (Z, x) => Z.some((z) => String(z) === String(x));

export function wynik(U, A, B, k) {
  const o = op(k);
  return U.filter((x) => o.f(nalezy(A, x), nalezy(B, x)));
}

// { 1, 2, 3 } albo ∅ — w LaTeX-u
export function zapis(Z) {
  return Z.length ? `\\{${Z.join(',\\ ')}\\}` : '\\emptyset';
}

// „5 należy do A, ale nie należy do B, więc nie należy do A ∩ B. Do części wspólnej…”
export function dlaczego(A, B, k, x) {
  const o = op(k);
  const a = nalezy(A, x), b = nalezy(B, x);
  const w = o.f(a, b);
  const jest = (v) => (v ? 'należy' : 'nie należy');
  const dop = k === 'dopA' || k === 'dopB';
  const fakty = dop
    ? `${tex(String(x))} ${jest(k === 'dopA' ? a : b)} do ${tex(k === 'dopA' ? 'A' : 'B')}`
    : `${tex(String(x))} ${jest(a)} do ${tex('A')}${a === b ? ' i' : ', ale'} ${jest(b)} do ${tex('B')}`;
  return `${fakty}, więc ${jest(w)} do ${tex(o.t)}. ${texInline(cap(o.regula))}.`;
}

// Region diagramu Venna: '10' = tylko A, '11' = A i B, '01' = tylko B, '00' = poza A i B.
export const region = (A, B, x) => `${nalezy(A, x) ? 1 : 0}${nalezy(B, x) ? 1 : 0}`;
export const regiony = (k) => ['10', '11', '01', '00'].filter((r) => op(k).f(r[0] === '1', r[1] === '1'));

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
