// Relacje: macierze 0-1 liczone przy buildzie + opisy „dlaczego” dla komórek i własności.
// Umowa z zajęć: wiersze macierzy = elementy dziedziny (pierwszy element pary), kolumny = przeciwdziedziny (drugi).
import { tex, texInline } from './tex.js';

const L = (x) => tex(String(x));

export const macierz = (A, B, pred) => A.map((x) => B.map((y) => (pred(x, y) ? 1 : 0)));
export const pary = (A, B, m) => A.flatMap((x, i) => B.filter((_, j) => m[i][j]).map((y) => [x, y]));
export const odwrotna = (m) => m[0].map((_, j) => m.map((row) => row[j]));
export const dopelnienie = (m) => m.map((row) => row.map((v) => 1 - v));
const zip = (a, b, f) => {
  if (a.length !== b.length || a[0].length !== b[0].length) throw new Error('Relacje: macierze mają różne rozmiary (inne dziedziny lub przeciwdziedziny)');
  return a.map((row, i) => row.map((v, j) => f(v, b[i][j])));
};
export const suma = (a, b) => zip(a, b, (x, y) => (x || y ? 1 : 0));
export const iloczyn = (...ms) => ms.reduce((a, b) => zip(a, b, (x, y) => (x && y ? 1 : 0)));
export const roznica = (a, b) => zip(a, b, (x, y) => (x && !y ? 1 : 0));

// Złożenie Q∘P (najpierw P ⊂ A×B, potem Q ⊂ B×C) → A×C. Komórka (x, z) = 1, gdy istnieje y: xPy i yQz.
export function zlozenie(mP, mQ) {
  if (mP[0].length !== mQ.length) throw new Error('Relacje: złożenie niewykonalne (przeciwdziedzina P ≠ dziedzina Q)');
  return mP.map((row) => mQ[0].map((_, z) => (row.some((v, y) => v && mQ[y][z]) ? 1 : 0)));
}
// Wspólne „przesiadki” y dla komórki (i, k) złożenia
export const posrednie = (mP, mQ, i, k) => mP[i].map((v, y) => (v && mQ[y][k] ? y : -1)).filter((y) => y >= 0);

// Zaostrzenie S = (M⁻¹)′ ∩ M: zostają jedynki, które nie leżą na przekątnej i nie mają symetrycznej jedynki.
export const zaostrzenie = (m) => m.map((row, i) => row.map((v, j) => (v && !m[j][i] ? 1 : 0)));
export const zeroweKolumny = (m) => m[0].map((_, j) => j).filter((j) => m.every((row) => !row[j]));

// Relacja preferencji dla jednego kryterium: X P Y ⇔ X nie jest gorszy od Y.
export const preferencja = (wartosci, kierunek) =>
  wartosci.map((a) => wartosci.map((b) => ((kierunek === 'max' ? a >= b : a <= b) ? 1 : 0)));

// ---------- własności relacji w jednym zbiorze (macierz kwadratowa) ----------
export const NAZWY = {
  zwrotna: 'zwrotna', antyzwrotna: 'antyzwrotna', symetryczna: 'symetryczna', asymetryczna: 'asymetryczna',
  quasi: 'quasi-asymetryczna', spojna: 'spójna', przechodnia: 'przechodnia',
};
export const KOLEJNOSC = ['zwrotna', 'antyzwrotna', 'symetryczna', 'asymetryczna', 'quasi', 'spojna', 'przechodnia'];

const offPairs = (n) => { const out = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]); return out; };

// Zwraca { klucz: { ok, komorki: [[i,j]...], tekst } } — komorki to dowód (gdy ok) albo kontrprzykład (gdy nie).
export function wlasnosci(m, et) {
  const n = m.length;
  if (m.some((r) => r.length !== n)) throw new Error('Relacje: własności bada się dla macierzy kwadratowej');
  const e = (i) => L(et[i]);
  const diag = [...Array(n).keys()].map((i) => [i, i]);
  const out = {};
  const d0 = diag.find(([i]) => m[i][i] === 0), d1 = diag.find(([i]) => m[i][i] === 1);
  out.zwrotna = d0
    ? { ok: false, komorki: [d0], tekst: `Na przekątnej w wierszu ${e(d0[0])} jest 0 — ${e(d0[0])} nie jest w relacji z samym sobą.` }
    : { ok: true, komorki: diag, tekst: 'Na przekątnej same jedynki: każdy element jest w relacji z samym sobą.' };
  out.antyzwrotna = d1
    ? { ok: false, komorki: [d1], tekst: `Na przekątnej w wierszu ${e(d1[0])} jest 1 — ${e(d1[0])} jest w relacji z samym sobą.` }
    : { ok: true, komorki: diag, tekst: 'Na przekątnej same zera: żaden element nie jest w relacji z samym sobą.' };
  const pp = offPairs(n);
  const nsym = pp.find(([i, j]) => m[i][j] !== m[j][i]);
  out.symetryczna = nsym
    ? { ok: false, komorki: [nsym, [nsym[1], nsym[0]]], tekst: `Komórki (${e(nsym[0])}, ${e(nsym[1])}) i (${e(nsym[1])}, ${e(nsym[0])}) leżą symetrycznie, ale mają różne wartości: ${m[nsym[0]][nsym[1]]} i ${m[nsym[1]][nsym[0]]}.` }
    : { ok: true, komorki: [], tekst: 'Każda jedynka ma jedynkę w lustrzanym miejscu po drugiej stronie przekątnej, a każde zero — zero.' };
  const sym1 = pp.find(([i, j]) => m[i][j] && m[j][i]);
  out.quasi = sym1
    ? { ok: false, komorki: [sym1, [sym1[1], sym1[0]]], tekst: `Symetryczne jedynki: (${e(sym1[0])}, ${e(sym1[1])}) i (${e(sym1[1])}, ${e(sym1[0])}) — ${e(sym1[0])} jest w relacji z ${e(sym1[1])} i na odwrót.` }
    : { ok: true, komorki: [], tekst: 'Poza przekątną żadna jedynka nie ma jedynki w lustrzanym miejscu (przekątna nie ma znaczenia).' };
  out.asymetryczna = d1
    ? { ok: false, komorki: [d1], tekst: `Na przekątnej jest 1 (wiersz ${e(d1[0])}), a asymetryczna wymaga samych zer na przekątnej.` }
    : sym1
      ? { ok: false, komorki: out.quasi.komorki, tekst: out.quasi.tekst }
      : { ok: true, komorki: diag, tekst: 'Na przekątnej same zera i nigdzie nie ma symetrycznych jedynek.' };
  const sym0 = pp.find(([i, j]) => !m[i][j] && !m[j][i]);
  out.spojna = sym0
    ? { ok: false, komorki: [sym0, [sym0[1], sym0[0]]], tekst: `Symetryczne zera: (${e(sym0[0])}, ${e(sym0[1])}) i (${e(sym0[1])}, ${e(sym0[0])}) — ${e(sym0[0])} i ${e(sym0[1])} nie są ze sobą w relacji w żadną stronę.` }
    : { ok: true, komorki: [], tekst: 'Poza przekątną nie ma symetrycznych zer: każde dwa różne elementy są w relacji przynajmniej w jedną stronę.' };
  let kontr = null;
  for (let i = 0; i < n && !kontr; i++) for (let j = 0; j < n && !kontr; j++) for (let k = 0; k < n && !kontr; k++)
    if (m[i][j] && m[j][k] && !m[i][k]) kontr = [i, j, k];
  out.przechodnia = kontr
    ? { ok: false, komorki: [[kontr[0], kontr[1]], [kontr[1], kontr[2]], [kontr[0], kontr[2]]], tekst: `${e(kontr[0])} jest w relacji z ${e(kontr[1])} i ${e(kontr[1])} z ${e(kontr[2])}, ale ${e(kontr[0])} nie jest w relacji z ${e(kontr[2])} (w komórce (${e(kontr[0])}, ${e(kontr[2])}) jest 0).` }
    : { ok: true, komorki: [], tekst: 'Dla każdych dwóch jedynek „x w relacji z y” i „y w relacji z z” jest też jedynka w komórce (x, z) — złożenie P∘P zawiera się w P.' };
  return out;
}

// Typ relacji porządkującej wg schematu z zajęć.
export function typPorzadku(w) {
  if (!w.przechodnia.ok) return { typ: null, tekst: 'nie jest przechodnia, więc nie jest relacją porządkującą' };
  let base = null;
  if (w.asymetryczna.ok) base = 'ostry porządek';
  else if (w.quasi.ok && w.zwrotna.ok) base = 'porządek';
  else if (w.zwrotna.ok) base = 'preporządek';
  if (!base) return { typ: null, tekst: 'jest przechodnia, ale nie pasuje do żadnego pola schematu (nie jest ani zwrotna, ani asymetryczna)' };
  const typ = (w.spojna.ok ? 'liniowy ' : '') + base;
  return { typ, tekst: typ };
}

// ---------- opisy komórek do ćwiczeń ----------
export const fmtParaTex = (x, y) => `(${x}, ${y})`;
export function dlaczegoZlozenie(mP, mQ, A, B, C, i, k, nP = 'P', nQ = 'Q') {
  const ys = posrednie(mP, mQ, i, k);
  const x = A[i], z = C[k];
  if (ys.length) {
    const y = B[ys[0]];
    return texInline(`$${x}\\,${nP}\\,${y}$ i $${y}\\,${nQ}\\,${z}$ — da się przejść z $${x}$ do $${z}$ przez $${y}$, więc 1.`);
  }
  const zP = B.filter((_, j) => mP[i][j]), doQ = B.filter((_, j) => mQ[j][k]);
  return texInline(`Wiersz $${x}$ w $${nP}$ ma jedynki przy ${zP.length ? zP.map((v) => `$${v}$`).join(', ') : 'żadnym elemencie'}, a kolumna $${z}$ w $${nQ}$ — przy ${doQ.length ? doQ.map((v) => `$${v}$`).join(', ') : 'żadnym elemencie'}. Nie ma wspólnej „przesiadki”, więc 0.`);
}
export function dlaczegoZaostrzenie(m, et, i, j) {
  const a = et[i], b = et[j];
  if (i === j) return texInline(`To przekątna — w zaostrzeniu zawsze 0 (element nie dominuje sam siebie).`);
  if (!m[i][j]) return texInline(`W $M$ komórka $(${a}, ${b})$ ma 0, więc w $S$ też 0.`);
  if (m[j][i]) return texInline(`W $M$ jest 1 w $(${a}, ${b})$ i 1 w symetrycznej $(${b}, ${a})$ — symetryczne jedynki zamieniamy na 0.`);
  return texInline(`W $M$ jest 1 w $(${a}, ${b})$, a w symetrycznej $(${b}, ${a})$ jest 0 — ta jedynka zostaje: $${a}$ dominuje $${b}$.`);
}

// Oznaczenia do rysunku zaostrzenia: jedynki z przekątnej i symetryczne jedynki — skreślone, pozostałe — w kółku.
export const oznaczZaostrzenie = (m) => m.flatMap((row, i) => row.map((v, j) => (v ? { i, j, styl: i === j || m[j][i] ? 'skresl' : 'kolko' } : null))).filter(Boolean);
// Jedynki w macierzy do zakreślenia (np. złożenie, część wspólna)
export const jedynki = (m, styl = 'zloto') => m.flatMap((row, i) => row.map((v, j) => (v ? { i, j, styl } : null))).filter(Boolean);
