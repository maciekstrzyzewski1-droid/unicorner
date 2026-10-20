// Moduł 11 „Ekstrema warunkowe”: metoda mnożników Lagrange’a (procedura ze slajdów, 6 kroków).
// Linie rachunku jak w lib/wielu.js: e — etap, typ — co sprawdza skrypt mat-check/t11, o — co robisz, r — etykieta reguły,
// d — dlaczego, k — „na kartce”, mx — rząd macierzy (Mx), t/tm — wzór (szeroki / na telefon).
// typ: 'phi' — warunek φ(x, y), 'L' — funkcja Lagrange’a, 'Lx', 'Ly', 'Lxx', 'Lyy', 'Lxy', 'Lyx', 'phix', 'phiy'; 'x' — nic.
// Złote \cG{…} = zmienna „zamrożona” (liczba) przy pochodnej cząstkowej. λ to zwykła liczba (stała) przy każdej pochodnej.
import { Q, przekatne, przekatneSumaTex } from './macierze.js';
import { dl, SZEROKO, zWaskimi } from './waskie.js';

export const ETAPY_W = [
  { nr: 1, nazwa: 'funkcja Lagrange’a', co: 'zapisz warunek w postaci $\\phi(x, y) = 0$ (wszystko na lewą stronę) i utwórz $L(x, y) = f(x, y) + \\lambda \\cdot \\phi(x, y)$',
    po: 'Funkcja Lagrange’a skleja funkcję i warunek w jeden wzór. Dzięki temu pierwsze pochodne liczysz tak jak w ekstremach bezwarunkowych — tylko na $L$ zamiast na $f$. Macierz i reguła znaku (kroki 5–6) będą już inne.' },
  { nr: 2, nazwa: 'pierwsze pochodne L', co: 'policz $\\frac{\\partial L}{\\partial x}$ (zamrożone $y$) i $\\frac{\\partial L}{\\partial y}$ (zamrożony $x$); $\\lambda$ jest zawsze liczbą',
    po: 'Pochodne cząstkowe liczysz tak samo jak w module 10. $\\lambda$ to niewiadoma liczba, ale przy różniczkowaniu zachowuje się jak każda inna liczba.' },
  { nr: 3, nazwa: 'warunek konieczny', co: 'przyrównaj $\\frac{\\partial L}{\\partial x}$, $\\frac{\\partial L}{\\partial y}$ i $\\phi(x, y)$ do zera i rozwiąż układ trzech równań — wyjdą punkty $P_0 = (x_0, y_0)$ i do każdego jego $\\lambda_0$',
    po: 'Ekstremum warunkowe może być tylko w takim punkcie (o ile pochodne $\\phi$ nie są tam naraz zerem — w zadaniach z listy to wystarcza). Trzecie równanie, $\\phi(x, y) = 0$, pilnuje, żeby punkt leżał na warunku.' },
  { nr: 4, nazwa: 'drugie pochodne L i pochodne φ', co: 'policz $\\frac{\\partial^2 L}{\\partial x^2}$, $\\frac{\\partial^2 L}{\\partial y^2}$, $\\frac{\\partial^2 L}{\\partial x \\partial y}$, $\\frac{\\partial^2 L}{\\partial y \\partial x}$ oraz $\\frac{\\partial \\phi}{\\partial x}$, $\\frac{\\partial \\phi}{\\partial y}$',
    po: 'To są wszystkie liczby potrzebne do macierzy z kroku 5.' },
  { nr: 5, nazwa: 'wyznacznik', co: 'ułóż macierz $3 \\times 3$ ze slajdu (w rogu $0$, na brzegach pochodne $\\phi$, w środku drugie pochodne $L$), wstaw punkt i jego $\\lambda_0$, policz wyznacznik regułą Sarrusa',
    po: 'Jedna liczba — znak tego wyznacznika — rozstrzyga, czy w punkcie jest maksimum, czy minimum warunkowe.' },
  { nr: 6, nazwa: 'warunek dostateczny', co: 'wyznacznik $> 0$ — maksimum warunkowe; $< 0$ — minimum warunkowe; wartość: wstaw punkt do $f$',
    po: 'Tak brzmi warunek ze slajdu. Uwaga: to odwrotnie niż przy $a_{11}$ w module 10 — tu plus oznacza maksimum.' },
];

export const LEG_W = [['zloto', 'zmienna „zamrożona” — w tej pochodnej traktujesz ją jak liczbę']];
export const NAZWA_W = {
  Lx: '\\frac{\\partial L}{\\partial x}', Ly: '\\frac{\\partial L}{\\partial y}',
  Lxx: '\\frac{\\partial^2 L}{\\partial x^2}', Lyy: '\\frac{\\partial^2 L}{\\partial y^2}',
  Lxy: '\\frac{\\partial^2 L}{\\partial x \\partial y}', Lyx: '\\frac{\\partial^2 L}{\\partial y \\partial x}',
  phix: '\\frac{\\partial \\phi}{\\partial x}', phiy: '\\frac{\\partial \\phi}{\\partial y}',
};
// macierz ze slajdu (krok 5) — nazwa w kursie
export const HB = '\\overline{H}';

const caly = (r) => r.map((c) => (typeof c === 'string' && !/^-?\d+(\/\d+)?$/.test(c) ? `{${c}}` : c));
const tfrac = (s) => s.replace(/\\frac/g, '\\tfrac');
// łańcuch w wierszach (jak w lib/wielu.js)
const lancuch = (et, kroki) => (dl(et) + 2 + Math.max(...kroki.flatMap((w) => w.split('\\\\')).map(dl)) <= SZEROKO
  ? `\\begin{aligned} ${et} ${kroki.map((w) => `&= ${w}`).join(' \\\\ ')} \\end{aligned}`
  : `\\begin{aligned} &${et} \\\\ ${kroki.map((w) => `&= ${w}`).join(' \\\\ ')} \\end{aligned}`);

// Sarrus krok po kroku: iloczyny liczb → wartości iloczynów → same niezerowe składniki → (wspólny mianownik) → wynik.
// Na kartce: iloczyny z ułamkami i „minus minus”.
export function sarrus(M) {
  const p = przekatne(M);
  const czyn = (t) => t.wart.map((v) => tfrac(v.tex(true))).join(' \\cdot ');
  const plusy = p.skladniki.slice(0, 3).map(czyn).join(' + ');
  const minusy = p.skladniki.slice(3).map((t) => `- ${czyn(t)}`).join(' ');
  const wart = tfrac(przekatneSumaTex(p));
  const kroki = [`${plusy} ${minusy}`, wart];
  const wyr = [...p.skladniki.slice(0, 3).map((t, j) => `${j ? '+ ' : ''}${czyn(t)}`), ...p.skladniki.slice(3).map((t) => `- ${czyn(t)}`)];
  // na telefon: składniki w wierszach, ile się zmieści (zwykle po dwa)
  const wiersze = [];
  for (const w of wyr) {
    const ost = wiersze[wiersze.length - 1];
    if (ost !== undefined && dl(`${ost} ${w}`) <= SZEROKO - 4) wiersze[wiersze.length - 1] = `${ost} ${w}`; else wiersze.push(w);
  }
  const kroki_m = [wiersze.join(' \\\\ &\\quad '), wart];
  const dodaj = (s) => { if (s !== kroki[kroki.length - 1]) { kroki.push(s); kroki_m.push(s); } };
  const k = [];
  p.skladniki.filter((t) => !t.iloczyn.zero && t.wart.some((v) => !v.calk)).forEach((t) => k.push(`${czyn(t)} = ${tfrac(t.iloczyn.tex())}`));
  p.skladniki.filter((t) => t.znak < 0 && t.iloczyn.ujemna).forEach((t) => k.push(`- ${tfrac(t.iloczyn.tex(true))} = +${tfrac(t.iloczyn.neg().tex())}`));
  // składniki ze znakiem (minus z reguły Sarrusa już uwzględniony)
  const sk = p.skladniki.map((t) => t.iloczyn.mul(t.znak)).filter((v) => !v.zero);
  if (sk.length > 1) {
    dodaj(sk.map((v, j) => (j ? (v.ujemna ? `- ${tfrac(v.neg().tex())}` : `+ ${tfrac(v.tex())}`) : tfrac(v.tex()))).join(' '));
    // ułamki o wspólnym mianowniku: dodaj liczniki
    const mian = sk.map((v) => v.d);
    if (mian.some((d) => d > 1)) {
      const d = mian.reduce((a, b) => (a * b) / gcd(a, b));
      const licz = sk.reduce((a, v) => a + (v.n * d) / v.d, 0);
      dodaj(`${licz < 0 ? '-' : ''}\\tfrac{${Math.abs(licz)}}{${d}}`);
    }
  }
  dodaj(tfrac(p.wynik.tex()));
  return { kroki, kroki_m, k, wynik: p.wynik };
}
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

// D: { id, f, fn, warunek (tekst z treści), linie: etapy 1–4, Mog: macierz ogólna [[…]] (LaTeX),
//      punkty: [{ xt, yt, lt, x, y, l, Mrach: [[…]], M: [[liczby]], wart?: [rachunek wartości f…], kw?, d? }], uwaga? }
export function lagrange(D) {
  const pts = D.punkty ?? [];
  const wiele = pts.length > 1;
  const Pn = (i) => (wiele ? `P_${i + 1}` : 'P_0');
  const linie = [...D.linie];
  const wyniki = [];
  if (pts.length) {
    linie.push({ e: 5, typ: 'x', mx: [{ tx: `${HB}(x, y) =` }, { m: D.Mog.map(caly) }], r: 'macierz ze slajdu',
      o: 'Ułóż macierz ze slajdu. W lewym górnym rogu $0$. Pierwszy wiersz i pierwsza kolumna: $0$, $\\frac{\\partial \\phi}{\\partial x}$, $\\frac{\\partial \\phi}{\\partial y}$. W prawym dolnym kwadracie $2 \\times 2$: drugie pochodne $L$ (jak hesjan).' });
  }
  pts.forEach((p, i) => {
    const P = `${Pn(i)} = (${p.xt}, ${p.yt})`;
    const lam = `\\lambda = ${p.lt}`;
    const M = p.M.map((r) => r.map((v) => Q.of(v)));
    const S = sarrus(M);
    // kontrola: wyznacznik z danych = wyznacznik z funkcji JS (D.M2(x, y, λ))
    if (D.M2) {
      const Mn = D.M2(p.x, p.y, p.l);
      const ok = M.every((r, a) => r.every((v, b) => Math.abs(v.n / v.d - Mn[a][b]) < 1e-9));
      if (!ok) throw new Error(`[${D.id}] macierz w punkcie (${p.xt}, ${p.yt}) nie zgadza się z M2`);
    }
    const zW = S.wynik.zero ? 0 : S.wynik.ujemna ? -1 : 1;
    const wn = zW > 0 ? 'max' : zW < 0 ? 'min' : 'nie wiadomo';
    linie.push(p.Mrach
      ? { e: 5, typ: 'x', mx: [{ tx: `${HB}(${Pn(i)}) =` }, { m: p.Mrach.map(caly) }, { zn: '=' }, { m: p.M }],
        o: `Wstaw do macierzy punkt $${P}$ i jego $${lam}$: za $x$ wstaw $${p.xt}$, za $y$ wstaw $${p.yt}$, za $\\lambda$ wstaw $${p.lt}$. Policz każdy element.`, d: p.dM }
      : { e: 5, typ: 'x', mx: [{ tx: `${HB}(${Pn(i)}) =` }, { m: p.M }],
        o: `Wstaw punkt $${P}$ do macierzy. Tu w macierzy nie ma ani $x$, ani $y$, ani $\\lambda$ — same liczby — więc nic się nie zmienia.`, d: p.dM });
    linie.push({ e: 5, typ: 'x', t: `W(${Pn(i)}) = \\det ${HB}(${Pn(i)}) = ${S.kroki.join(' = ')}`, r: 'reguła Sarrusa', sar: true,
      tm: `\\begin{aligned} &W(${Pn(i)}) = \\det ${HB}(${Pn(i)}) \\\\ ${S.kroki_m.map((w) => `&= ${w}`).join(' \\\\ ')} \\end{aligned}`, k: S.k.length ? S.k : undefined,
      o: 'Policz wyznacznik regułą Sarrusa: trzy przekątne w dół dodajesz, trzy przekątne w górę odejmujesz. Każdy iloczyn z zerem to $0$.' });
    const Wt = tfrac(S.wynik.tex());
    linie.push({ e: 6, typ: 'x', t: wn === 'nie wiadomo' ? `W(${Pn(i)}) = 0 \\ \\Rightarrow \\ \\text{nie wiadomo}` : `W(${Pn(i)}) = ${Wt} ${zW > 0 ? '> 0' : '< 0'} \\ \\Rightarrow \\ \\text{${wn === 'max' ? 'maksimum' : 'minimum'} warunkowe}`,
      r: 'warunek dostateczny Lagrange’a',
      o: wn === 'nie wiadomo' ? `Sprawdź warunek dostateczny. Wyznacznik jest zerem — ta metoda nie rozstrzyga, co jest w $${P}$.`
        : `Sprawdź warunek dostateczny. Wyznacznik jest ${zW > 0 ? 'dodatni' : 'ujemny'}, więc w punkcie $${P}$ jest <b>${wn === 'max' ? 'maksimum' : 'minimum'} warunkowe</b>.`,
      d: p.d });
    if (wn === 'max' || wn === 'min') {
      const fv = D.fn(p.x, p.y);
      linie.push({ e: 6, typ: 'x', t: `f_{\\${wn}}(${p.xt}, ${p.yt}) = ${p.wart.join(' = ')}`, w: p.wart,
        tm: lancuch(`f_{\\${wn}}(${p.xt}, ${p.yt})`, p.wartm ?? p.wart), k: p.kw,
        o: `Policz wartość ${wn === 'max' ? 'maksimum' : 'minimum'}: wstaw $x = ${p.xt}$ i $y = ${p.yt}$ do wzoru funkcji $f$ (nie do $L$).` });
      wyniki.push({ wn, P, xt: p.xt, yt: p.yt, w: p.wart[p.wart.length - 1], fv, W: S.wynik });
    } else wyniki.push({ wn, P, xt: p.xt, yt: p.yt, W: S.wynik });
  });
  const wiersze = pts.length
    ? wyniki.map((w) => (w.wn === 'max' || w.wn === 'min'
      ? `&f_{\\${w.wn}}(${w.xt}, ${w.yt}) = ${w.w}`
      : `&(${w.xt}, ${w.yt}) \\colon \\ \\text{nie wiadomo}`))
    : ['&\\text{brak punktów stacjonarnych}', '&\\text{brak ekstremów warunkowych}'];
  const ekstr = wyniki.filter((w) => w.wn === 'max' || w.wn === 'min');
  const zdanie = !pts.length ? 'Układ nie ma rozwiązań — nie ma punktów stacjonarnych, więc funkcja nie ma ekstremów warunkowych.'
    : ekstr.map((w) => `${w.wn === 'max' ? 'maksimum' : 'minimum'} warunkowe w punkcie $(${w.xt}, ${w.yt})$, równe $${w.w}$`).join('; ').replace(/^./, (z) => z.toUpperCase()) + '.';
  linie.push({ e: 6, typ: 'x', t: `\\begin{aligned} ${wiersze.join(' \\\\ ')} \\end{aligned}`, o: `Zapisz odpowiedź. ${zdanie}`, d: D.uwaga });
  return { id: D.id, f: `\\begin{aligned} &${D.f} \\\\ &\\phi(x, y)\\colon \\ ${D.warunek} \\end{aligned}`, fsam: D.f, warunek: D.warunek, linie: zWaskimi(linie), leg: LEG_W, wyniki, odp: `\\begin{aligned} ${wiersze.join(' \\\\ ')} \\end{aligned}`, zdanie };
}
