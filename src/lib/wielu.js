// Moduł 10 „Funkcje wielu zmiennych”: pochodne cząstkowe (Zad. 1) i ekstrema bezwarunkowe (Zad. 2).
// Linie rachunku mają format jak w lib/pochodne.js (e — etap, typ — co sprawdza skrypt mat-check/t10, o — co robisz,
// r — etykieta wzoru/reguły, d — dlaczego, k — „na kartce”). Linia może mieć `mx` — rząd macierzy rysowanych komponentem Mx.
// typ: 'fx', 'fy' — pierwsze pochodne cząstkowe; 'fxx', 'fyy', 'fxy', 'fyx' — drugie; 'f' — sama funkcja; 'x' — nic.
// Kolor złoty (\cG{…}) = zmienna „zamrożona”, czyli traktowana jak liczba.
import { dl, SZEROKO, zWaskimi } from './waskie.js';

// ---------- przepisy (etapy przy liniach rachunku) ----------
export const ETAPY_P = [
  { nr: 1, nazwa: 'pierwsze pochodne', co: 'policz $\\frac{\\partial f}{\\partial x}$ (litera $y$ zamrożona — jak liczba) i $\\frac{\\partial f}{\\partial y}$ (zamrożony $x$)',
    po: 'Od nich wszystko się zaczyna: drugie pochodne liczysz z pierwszych. Zamrożona litera zachowuje się jak zwykła liczba, więc działają wzory i reguły z modułu 8.' },
  { nr: 2, nazwa: 'drugie po tej samej zmiennej', co: '$\\frac{\\partial^2 f}{\\partial x^2}$: wynik $\\frac{\\partial f}{\\partial x}$ zróżniczkuj jeszcze raz po $x$; $\\frac{\\partial^2 f}{\\partial y^2}$: wynik $\\frac{\\partial f}{\\partial y}$ — jeszcze raz po $y$',
    po: 'Druga pochodna to pochodna pochodnej — tak jak $f\'\'$ w module 9. Zamrażasz tę samą literę co przy pierwszej pochodnej.' },
  { nr: 3, nazwa: 'pochodne mieszane', co: '$\\frac{\\partial^2 f}{\\partial x \\partial y}$: wynik $\\frac{\\partial f}{\\partial x}$ zróżniczkuj po $y$; $\\frac{\\partial^2 f}{\\partial y \\partial x}$: wynik $\\frac{\\partial f}{\\partial y}$ — po $x$',
    po: 'Teraz zmieniasz literę: pochodną po $x$ liczysz po $y$ i odwrotnie. Z twierdzenia Schwarza obie wychodzą takie same — druga to sprawdzenie rachunku.' },
  { nr: 4, nazwa: 'gradient i hesjan', co: 'pierwsze pochodne zapisz jako wektor (gradient $\\nabla f$), drugie — jako macierz (hesjan $H_f$)',
    po: 'To tylko uporządkowany zapis wyników. Przyda się w zadaniach o ekstremach: gradient daje układ równań, hesjan — wyznacznik $W$.' },
];
export const ETAPY_E = [
  { nr: 1, nazwa: 'pierwsze pochodne', co: 'wyznacz $\\frac{\\partial f}{\\partial x}$ i $\\frac{\\partial f}{\\partial y}$',
    po: 'Na szczycie i w dołku powierzchnia jest „płaska” w każdym kierunku. Pierwsze pochodne mierzą nachylenie w kierunku $x$ i w kierunku $y$.' },
  { nr: 2, nazwa: 'warunek konieczny', co: 'przyrównaj obie pochodne do zera ($\\nabla f(x, y) = 0$) i rozwiąż układ — wyjdą punkty stacjonarne $P_0 = (x_0, y_0)$',
    po: 'Ekstremum może być tylko tam, gdzie obie pochodne cząstkowe są zerem (gdy istnieją). Te punkty to kandydaci — sprawdzą ich kroki 3–6. Gdy układ nie ma rozwiązań, nie ma też ekstremów.' },
  { nr: 3, nazwa: 'drugie pochodne', co: 'wyznacz $\\frac{\\partial^2 f}{\\partial x^2}$, $\\frac{\\partial^2 f}{\\partial y^2}$, $\\frac{\\partial^2 f}{\\partial x \\partial y}$, $\\frac{\\partial^2 f}{\\partial y \\partial x}$',
    po: 'Same pierwsze pochodne nie odróżnią szczytu od dołka ani od siodła. Rozstrzygają to drugie pochodne — tak jak $f\'\'$ mówiła o kształcie w module 9.' },
  { nr: 4, nazwa: 'hesjan w punkcie', co: 'ułóż drugie pochodne w hesjan $H_f(x, y)$ i wstaw do niego kolejno każdy punkt stacjonarny',
    po: 'Hesjan zbiera wszystkie drugie pochodne w jednym miejscu. Gdy w drugich pochodnych są $x$ albo $y$, w każdym punkcie stacjonarnym hesjan ma inne liczby — dlatego wstawiasz każdy punkt osobno.' },
  { nr: 5, nazwa: 'wyznacznik', co: 'policz $W(P_0) = \\det H_f(x_0, y_0)$: iloczyn na przekątnej minus iloczyn na drugiej przekątnej',
    po: 'Jedna liczba $W$ mówi, czy powierzchnia wygina się w obu kierunkach tak samo (miska albo górka), czy w jednym w górę, a w drugim w dół (siodło).' },
  { nr: 6, nazwa: 'warunek dostateczny', co: '$W > 0$ — ekstremum (maksimum, gdy $a_{11} < 0$; minimum, gdy $a_{11} > 0$); $W < 0$ — brak ekstremum; $W = 0$ — nie wiadomo',
    po: 'Dopiero teraz, bo potrzebny jest gotowy $W$ z kroku 5 (to warunek dostateczny ze slajdu). $a_{11}$ to lewy górny element hesjanu, czyli $\\frac{\\partial^2 f}{\\partial x^2}$ w punkcie. Wartość ekstremum liczysz, wstawiając punkt do wzoru funkcji $f$.' },
];

export const LEG_ZAMROZ = [['zloto', 'zmienna „zamrożona” — w tej pochodnej traktujesz ją jak liczbę']];
// liczba z danych → LaTeX (ułamek „4/5” jako \tfrac{4}{5})
const tn = (v) => { const s = String(v); const m = s.match(/^(-?)(\d+)\/(\d+)$/); return m ? `${m[1]}\\tfrac{${m[2]}}{${m[3]}}` : s; };
const ZNAK = (v) => (Math.abs(v) < 1e-9 ? 0 : v > 0 ? 1 : -1);
const nazwa = { fx: '\\frac{\\partial f}{\\partial x}', fy: '\\frac{\\partial f}{\\partial y}', fxx: '\\frac{\\partial^2 f}{\\partial x^2}', fyy: '\\frac{\\partial^2 f}{\\partial y^2}', fxy: '\\frac{\\partial^2 f}{\\partial x \\partial y}', fyx: '\\frac{\\partial^2 f}{\\partial y \\partial x}' };
export const NAZWA = nazwa;

// wersja na telefon: lib/waskie.js
// łańcuch „etykieta = w1 = w2 …” w wierszach; krótka etykieta zostaje z pierwszym krokiem, długa — w osobnym wierszu
const lancuch = (et, kroki) => (dl(et) + 2 + Math.max(...kroki.flatMap((w) => w.split('\\\\')).map(dl)) <= SZEROKO
  ? `\\begin{aligned} ${et} ${kroki.map((w) => `&= ${w}`).join(' \\\\ ')} \\end{aligned}`
  : `\\begin{aligned} &${et} \\\\ ${kroki.map((w) => `&= ${w}`).join(' \\\\ ')} \\end{aligned}`);
// komórki macierzy w klamrach: KaTeX nie łamie wtedy wyrażenia w środku kratki (np. „18√5 −” / „6√5”)
const caly = (r) => r.map((c) => (typeof c === 'string' && !/^-?\d+(\/\d+)?$/.test(c) ? `{${c}}` : c));

// ---------- Zad. 1: pochodne cząstkowe ----------
// D: { f, linie: [...], wynik: { fx, fy, fxx, fyy, fxy, fyx } } → dopisuje etap 4 (gradient i hesjan)
export function czastkowe(D) {
  const W = D.wynik;
  const linie = [
    ...D.linie,
    { e: 4, typ: 'x', mx: [{ tx: '\\nabla f(x, y) =' }, { m: [[W.fx], [W.fy]].map(caly) }], r: 'gradient',
      o: 'Zapisz gradient: wektor (kolumnę) z pierwszych pochodnych cząstkowych — u góry pochodna po $x$, na dole po $y$.' },
    { e: 4, typ: 'x', mx: [{ tx: 'H_f(x, y) =' }, { m: (D.Hkom ?? [[W.fxx, W.fxy], [W.fyx, W.fyy]]).map(caly) }], r: 'hesjan',
      o: 'Zapisz hesjan: macierz drugich pochodnych. W pierwszym wierszu pochodne liczone najpierw po $x$, w drugim — najpierw po $y$. Na przekątnej stoją drugie pochodne po tej samej zmiennej.',
      d: 'Hesjan jest symetryczny (twierdzenie Schwarza): wyrażenia nad przekątną i pod nią są takie same.' },
  ];
  return { f: D.f, linie: zWaskimi(linie), leg: LEG_ZAMROZ, wynik: W };
}

// ---------- Zad. 2: ekstrema bezwarunkowe ----------
// D: { f, fn, d2: { xx, yy, xy } (funkcje JS do kontroli), linie: etapy 1–3, H: [[…], […]] (LaTeX, hesjan ogólnie),
//      punkty: [{ xt, yt, x, y, Hrach?: [[…]], H: [[…]], W: [rachunek…], wart?: [rachunek wartości f…], d? }], brak?: tekst }
export function ekstrema(D) {
  const pts = D.punkty ?? [];
  const wiele = pts.length > 1;
  const Pn = (i) => (wiele ? `P_${i + 1}` : 'P_0');
  const wyniki = [];
  const linie = [...D.linie];
  if (pts.length) {
    linie.push({ e: 4, typ: 'x', mx: [{ tx: 'H_f(x, y) =' }, { m: D.H.map(caly) }], r: 'hesjan',
      o: 'Ułóż drugie pochodne w hesjan. W pierwszym wierszu: $\\frac{\\partial^2 f}{\\partial x^2}$ i $\\frac{\\partial^2 f}{\\partial x \\partial y}$, w drugim: $\\frac{\\partial^2 f}{\\partial y \\partial x}$ i $\\frac{\\partial^2 f}{\\partial y^2}$.' });
  }
  pts.forEach((p, i) => {
    // kontrola danych: wyznacznik i a11 liczone z funkcji JS
    const a = D.d2.xx(p.x, p.y), b = D.d2.xy(p.x, p.y), c = D.d2.yy(p.x, p.y);
    const Wv = a * c - b * b;
    const zW = ZNAK(Wv), zA = ZNAK(a);
    const wn = zW > 0 ? (zA < 0 ? 'max' : 'min') : zW < 0 ? 'brak' : 'nie wiadomo';
    if (zW > 0 && zA === 0) throw new Error(`[${D.id}] W > 0, a a11 = 0 w punkcie ${p.xt}, ${p.yt}`);
    const P = `${Pn(i)} = (${p.xt}, ${p.yt})`;
    const Hpkt = `H_f(${p.xt}, ${p.yt}) =`;
    linie.push({ e: 4, typ: 'x', mx: p.Hrach ? [{ tx: Hpkt }, { m: p.Hrach.map(caly) }, { zn: '=' }, { m: p.H }] : [{ t: Hpkt, m: p.H }],
      o: p.Hrach ? `Wstaw punkt $${P}$ do hesjanu: za $x$ wstaw $${p.xt}$, za $y$ wstaw $${p.yt}$. Policz każdy element.`
        : `Wstaw punkt $${P}$ do hesjanu. W hesjanie nie ma ani $x$, ani $y$ — same liczby — więc w każdym punkcie jest taki sam.`, k: p.kH });
    linie.push({ e: 5, typ: 'x', t: `W(${Pn(i)}) = \\det H_f(${p.xt}, ${p.yt}) = ${p.W.join(' = ')}`, r: 'wyznacznik 2 × 2', w: p.W, pkt: [p.x, p.y],
      tm: lancuch(`W(${Pn(i)})`, [`\\det H_f(${p.xt}, ${p.yt})`, ...(p.Wm ?? p.W)]),
      o: 'Policz wyznacznik: iloczyn liczb na przekątnej (lewy górny razy prawy dolny) minus iloczyn liczb na drugiej przekątnej (prawy górny razy lewy dolny).', k: p.kW });
    const Wt = p.W[p.W.length - 1], At = tn(p.H[0][0]);
    const wniosek = wn === 'brak'
      ? `W(${Pn(i)}) = ${Wt} < 0 \\ \\Rightarrow \\ \\text{brak ekstremum}`
      : wn === 'nie wiadomo' ? `W(${Pn(i)}) = 0 \\ \\Rightarrow \\ \\text{nie wiadomo}`
        : `W(${Pn(i)}) = ${Wt} > 0, \\quad a_{11} = ${At} ${wn === 'max' ? '< 0' : '> 0'} \\ \\Rightarrow \\ \\text{${wn === 'max' ? 'maksimum' : 'minimum'}}`;
    linie.push({ e: 6, typ: 'x', t: wniosek, r: 'warunek dostateczny W',
      tm: wn === 'max' || wn === 'min' ? `\\begin{aligned} &W(${Pn(i)}) = ${Wt} > 0, \\quad a_{11} = ${At} ${wn === 'max' ? '< 0' : '> 0'} \\\\ &\\Rightarrow \\ \\text{${wn === 'max' ? 'maksimum' : 'minimum'}} \\end{aligned}` : undefined,
      o: wn === 'brak' ? `Sprawdź warunek dostateczny. $W < 0$, więc w punkcie $${P}$ <b>nie ma ekstremum</b>. Powierzchnia ma tu kształt siodła: w jednym kierunku idzie w górę, w drugim w dół.`
        : wn === 'nie wiadomo' ? `Sprawdź warunek dostateczny. $W = 0$ — ta metoda nie rozstrzyga, czy w $${P}$ jest ekstremum.`
          : `Sprawdź warunek dostateczny. $W > 0$, więc w punkcie $${P}$ jest ekstremum. Lewy górny element hesjanu $a_{11} = ${At}$ jest ${wn === 'max' ? 'ujemny — to <b>maksimum</b>' : 'dodatni — to <b>minimum</b>'}.`,
      d: p.d });
    if (wn === 'max' || wn === 'min') {
      const fv = D.fn(p.x, p.y);
      linie.push({ e: 6, typ: 'x', t: `f_{\\${wn}}(${p.xt}, ${p.yt}) = ${p.wart.join(' = ')}`, w: p.wart, pkt: [p.x, p.y],
        tm: lancuch(`f_{\\${wn}}(${p.xt}, ${p.yt})`, p.wartm ?? p.wart), k: p.kw,
        o: `Policz wartość ${wn === 'max' ? 'maksimum' : 'minimum'}: wstaw $x = ${p.xt}$ i $y = ${p.yt}$ do wzoru funkcji $f$.` });
      wyniki.push({ wn, P, xt: p.xt, yt: p.yt, w: p.wart[p.wart.length - 1], fv });
    } else wyniki.push({ wn, P, xt: p.xt, yt: p.yt });
  });
  // odpowiedź
  const wiersze = pts.length
    ? wyniki.map((w) => (w.wn === 'max' || w.wn === 'min'
      ? `&f_{\\${w.wn}}(${w.xt}, ${w.yt}) = ${w.w}`
      : `&(${w.xt}, ${w.yt}) \\colon \\ \\text{brak ekstremum}`))
    : ['&\\text{brak punktów stacjonarnych}', '&\\text{brak ekstremów}'];
  const ekstr = wyniki.filter((w) => w.wn === 'max' || w.wn === 'min');
  const zdanie = !pts.length ? 'Układ nie ma rozwiązań — nie ma punktów stacjonarnych, więc funkcja nie ma ekstremów.'
    : !ekstr.length ? 'W żadnym punkcie stacjonarnym nie ma ekstremum — funkcja nie ma ekstremów.'
      : ekstr.map((w) => `${w.wn === 'max' ? 'maksimum' : 'minimum'} w punkcie $(${w.xt}, ${w.yt})$, równe $${w.w}$`).join('; ').replace(/^./, (z) => z.toUpperCase()) + '.';
  linie.push({ e: 6, typ: 'x', t: `\\begin{aligned} ${wiersze.join(' \\\\ ')} \\end{aligned}`, o: `Zapisz odpowiedź. ${zdanie}`, d: D.uwaga });
  return { id: D.id, f: D.f, linie: zWaskimi(linie), leg: LEG_ZAMROZ, wyniki, odp: `\\begin{aligned} ${wiersze.join(' \\\\ ')} \\end{aligned}`, zdanie };
}
