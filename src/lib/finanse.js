// Matematyka finansowa (moduł 7): dokładny rachunek na ułamkach (BigInt), zaokrąglanie do groszy,
// polski zapis liczb (przecinek) i plany rysunków „krok po kroku” (oś czasu, plan spłaty kredytu).
// Konwencja z zajęć: PV — wartość bieżąca, FV — wartość przyszła, n — liczba okresów, i — stopa na 1 okres.

const babs = (a) => (a < 0n ? -a : a);
const bgcd = (a, b) => { a = babs(a); b = babs(b); while (b) [a, b] = [b, a % b]; return a || 1n; };

// ---------- liczby wymierne na BigInt (bez błędów zaokrągleń w środku rachunku) ----------
export class R {
  constructor(n, d = 1n) {
    n = BigInt(n); d = BigInt(d);
    if (d === 0n) throw new Error('Finanse: dzielenie przez 0');
    if (d < 0n) { n = -n; d = -d; }
    const g = bgcd(n, d);
    this.n = n / g; this.d = d / g;
  }
  // 1000, '0.05', '0,05', '5/100', R → R
  static of(x) {
    if (x instanceof R) return x;
    if (typeof x === 'bigint') return new R(x);
    if (typeof x === 'number') {
      if (Number.isInteger(x)) return new R(BigInt(x));
      return R.of(String(x));
    }
    if (typeof x === 'string') {
      let s = x.trim().replace(/\s+/g, '').replace(',', '.').replace('−', '-');
      if (s.includes('/')) { const [a, b] = s.split('/'); return new R(BigInt(a), BigInt(b)); }
      const neg = s.startsWith('-');
      if (neg || s.startsWith('+')) s = s.slice(1);
      const [a, b = ''] = s.split('.');
      if (!/^\d*$/.test(a) || !/^\d*$/.test(b)) throw new Error(`Finanse: nie umiem odczytać liczby „${x}”`);
      const n = BigInt((a || '0') + b);
      return new R(neg ? -n : n, 10n ** BigInt(b.length));
    }
    throw new Error(`Finanse: nieznany typ ${x}`);
  }
  add(o) { o = R.of(o); return new R(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = R.of(o); return new R(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = R.of(o); return new R(this.n * o.n, this.d * o.d); }
  div(o) { o = R.of(o); if (o.n === 0n) throw new Error('Finanse: dzielenie przez 0'); return new R(this.n * o.d, this.d * o.n); }
  pow(k) { let w = new R(1n); for (let j = 0; j < k; j++) w = w.mul(this); return w; }
  neg() { return new R(-this.n, this.d); }
  abs() { return new R(babs(this.n), this.d); }
  cmp(o) { o = R.of(o); const a = this.n * o.d, b = o.n * this.d; return a < b ? -1 : a > b ? 1 : 0; }
  eq(o) { return this.cmp(o) === 0; }
  get zero() { return this.n === 0n; }
  get ujemna() { return this.n < 0n; }
  get calk() { return this.d === 1n; }
  toNumber() { return Number(this.n) / Number(this.d); }
  // zaokrąglenie do k miejsc po przecinku: połowa „od zera” (1157,625 → 1157,63)
  round(k = 2) {
    const m = 10n ** BigInt(k), x = this.n * m;
    let q = x / this.d;
    const r = x % this.d;
    if (babs(r) * 2n >= this.d) q += x >= 0n ? 1n : -1n;
    return new R(q, m);
  }
  // ile cyfr po przecinku ma dokładny zapis (null, gdy ułamek okresowy)
  get miejsca() {
    let d = this.d, k = 0;
    while (d % 10n === 0n) { d /= 10n; k++; }
    while (d % 2n === 0n) { d /= 2n; k++; }
    while (d % 5n === 0n) { d /= 5n; k++; }
    return d === 1n ? k : null;
  }
}
export const r = (x) => R.of(x);

// ---------- zapis liczb po polsku ----------
// cyfry całości z odstępem co trzy (od 10 000), przecinek dziesiętny
function rozbij(x, k) {
  const v = x.round(k);
  const neg = v.ujemna;
  const m = 10n ** BigInt(k);
  const a = babs(v.n) * (m / v.d); // v.d dzieli m
  const cal = (a / m).toString();
  const ul = k ? (a % m).toString().padStart(k, '0') : '';
  return { neg, cal, ul };
}
const grupuj = (s, sep) => (s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, sep));
// LaTeX: 1\,157{,}63; stale — zawsze k miejsc (kwoty), inaczej bez końcowych zer
export function liczTex(x, k = 2, stale = true) {
  x = R.of(x);
  let { neg, cal, ul } = rozbij(x, k);
  if (!stale) ul = ul.replace(/0+$/, '');
  const s = `${grupuj(cal, '\\,')}${ul ? `{,}${ul}` : ''}`;
  return `${neg ? '-' : ''}${s}`;
}
export function liczTxt(x, k = 2, stale = true) {
  x = R.of(x);
  let { neg, cal, ul } = rozbij(x, k);
  if (!stale) ul = ul.replace(/0+$/, '');
  return `${neg ? '−' : ''}${grupuj(cal, ' ')}${ul ? `,${ul}` : ''}`;
}
// kwota w złotych: zawsze 2 miejsca, chyba że całkowita i calkowite=true
export const zlTex = (x, calkowite = true) => { x = R.of(x).round(2); return calkowite && x.calk ? liczTex(x, 0) : liczTex(x, 2); };
export const zlTxt = (x, calkowite = true) => { x = R.of(x).round(2); return calkowite && x.calk ? liczTxt(x, 0) : liczTxt(x, 2); };
// dokładna liczba, jeśli ma ≤ max cyfr po przecinku; inaczej zaokrąglona z ≈
export function dokladnie(x, max = 6) {
  x = R.of(x);
  const m = x.miejsca;
  if (m !== null && m <= max) return { tex: liczTex(x, m, false), txt: liczTxt(x, m, false), przybl: false };
  return { tex: liczTex(x, max, false), txt: liczTxt(x, max, false), przybl: true };
}
// „= 1157,625 ≈ 1157,63” — wynik dokładny i (gdy trzeba) zaokrąglony do groszy
export function wynikZl(x) {
  x = R.of(x);
  const d = dokladnie(x, 6);
  const gr = x.round(2);
  if (!d.przybl && gr.eq(x)) return zlTex(x);
  return `${d.tex} ${d.przybl ? '\\ldots ' : ''}\\approx ${zlTex(gr, false)}`;
}
export const procTex = (i) => `${liczTex(R.of(i).mul(100), 4, false)}\\%`;
export const procTxt = (i) => `${liczTxt(R.of(i).mul(100), 4, false)}%`;
// 1 + i jako liczba z przecinkiem, np. 1{,}05
export const czynnikTex = (i) => dokladnie(R.of(i).add(1), 6).tex;

// ---------- wzory z zajęć ----------
export const fv = (pv, i, n) => R.of(pv).mul(R.of(i).add(1).pow(n));
export const pv = (fvv, i, n) => R.of(fvv).div(R.of(i).add(1).pow(n));


// ---------- liczby w środku rachunku ----------
// obcięcie (nie zaokrąglenie) do k miejsc — do zapisu „1886,7924…”
export function obetnij(x, k = 4) {
  x = R.of(x);
  const m = 10n ** BigInt(k);
  const q = (babs(x.n) * m) / x.d;
  return new R(x.ujemna ? -q : q, m);
}
// kwota w rachunku: do 2 miejsc jak w złotych (1102,50), do 6 dokładnie (1157,625), dłuższa — 4 miejsca i „…”
export function kwTex(x) {
  x = R.of(x);
  if (x.round(2).eq(x)) return zlTex(x);
  const m = x.miejsca;
  if (m !== null && m <= 6) return liczTex(x, m, false);
  return `${liczTex(obetnij(x, 4), 4)}\\ldots`;
}
// wynik działania: dokładnie, a gdy ma więcej niż 2 miejsca po przecinku — „≈” i grosze
export function kwWynik(x) {
  x = R.of(x);
  if (x.round(2).eq(x)) return zlTex(x);
  return `${kwTex(x)} \\approx ${zlTex(x.round(2), false)}`;
}
// p% z kwoty „jak na kartce”: najpierw kwota · p, potem : 100
export function procentZ(kwota, i) {
  const K = R.of(kwota), p = R.of(i).mul(100);
  const iloczyn = K.mul(p), wynik = iloczyn.div(100);
  const pT = liczTex(p, 4, false);
  return { p, pTex: `${pT}\\%`, iloczyn, wynik, tex1: `${kwTex(K)} \\cdot ${pT} = ${kwTex(iloczyn)}`, tex2: `${kwTex(iloczyn)} : 100 = ${kwTex(wynik)}` };
}
// 1 kwota, 2–4 kwoty, 5 kwot
export const odmiana = (n, [jeden, kilka, wiele]) => (n === 1 ? jeden : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? kilka : wiele);
const duza = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const OKRESY = {
  rok: { m: 'rok', d: 'roku' },
  'kwartał': { m: 'kwartał', d: 'kwartału' },
  'miesiąc': { m: 'miesiąc', d: 'miesiąca' },
  okres: { m: 'okres', d: 'okresu' },
};

// ---------- oś czasu: kwoty przenoszone w czasie (w przód: · (1+i), w tył: : (1+i)) ----------
// wplaty: [{ t, kwota, nazwa? }] (t = 0 to „dziś”), cel — moment, na który liczysz wartość, i — stopa na okres.
// wynik — nazwa wyniku w podpisie (np. 'FV'). Zwraca wiersze (momenty), kolumny (kwoty), komórki i kroki animacji.
export function osCzasu({ wplaty, i, cel, okres = 'rok', zero = 'dziś', wynik = null, od = null }) {
  i = R.of(i);
  const f = i.add(1);
  const fTex = czynnikTex(i);
  const pTex = procTex(i);
  const O = OKRESY[okres] ?? OKRESY.okres;
  const ts = [...wplaty.map((w) => w.t), cel];
  // od — pierwszy wiersz osi (np. 0, żeby pokazać „dziś”, choć pierwsza kwota jest później)
  const t0 = Math.min(...ts, ...(od !== null ? [od] : [])), t1 = Math.max(...ts);
  const momenty = [];
  for (let t = t0; t <= t1; t++) momenty.push(t);
  const etykieta = (t) => (t === 0 ? zero : `koniec ${t}.\u00a0${O.d}`);
  const etD = (t) => (t === 0 ? zero : `końca ${t}.\u00a0${O.d}`);
  const wiele = wplaty.length > 1;
  const kroki = [{ a: 'start', html: '' }];
  let pierwszyProcent = true;
  const kolumny = wplaty.map((w, k) => {
    const kier = cel >= w.t ? 1 : -1;
    const nazwa = w.nazwa ?? (wiele ? `${k + 1}. ${kier > 0 ? 'wpłata' : 'wypłata'}` : 'kwota');
    let v = R.of(w.kwota);
    const komorki = { [w.t]: { v, tex: zlTex(v), typ: w.t === cel ? 'cel' : 'start', od: 0 } };
    for (let t = w.t + kier; kier > 0 ? t <= cel : t >= cel; t += kier) {
      const prev = v;
      v = kier > 0 ? prev.mul(f) : prev.div(f);
      const s = kroki.length;
      const nag = wiele ? `<b>${duza(nazwa)}</b>: ${etykieta(t - kier)} → ${etykieta(t)}.` : `<b>${duza(etykieta(t - kier))} → ${etykieta(t)}.</b>`;
      let html;
      if (kier > 0) {
        const pz = procentZ(prev, i);
        html = `${nag} Przez ${O.m} dochodzą odsetki: $${pTex}$ z $${kwTex(prev)}$.<br>`
          + `Odsetki: $${pz.tex1}$, potem $${pz.tex2}$${pierwszyProcent ? ' (dzielenie przez 100 przesuwa przecinek o dwa miejsca w lewo)' : ''}.<br>`
          + `Nowa kwota: $${kwTex(prev)} + ${kwTex(pz.wynik)} = ${kwWynik(v)}$.`;
        pierwszyProcent = false;
      } else {
        const pierwszyKrok = t - kier === w.t;
        const zaokr = v.round(2), spr = zaokr.mul(f).round(2);
        html = `${nag} Cofasz się o ${O.m}: szukasz kwoty, która razem z odsetkami za ten ${O.m} da $${kwTex(prev)}$ — odsetki doliczasz mnożeniem przez $${fTex}$, więc teraz dzielisz:<br>`
          + `$${kwTex(prev)} : ${fTex} = ${kwWynik(v)}$ (kalkulator).`
          + (pierwszyKrok && spr.eq(prev)
            ? `<br>Sprawdzenie: $${zlTex(zaokr, false)} \\cdot ${fTex} \\approx ${zlTex(prev)}$ ✓`
            : !pierwszyKrok && !prev.round(2).eq(prev) && t - 2 * kier === w.t ? '<br>Dzielisz wynik z poprzedniego kroku prosto z kalkulatora — bez zaokrąglania. Zaokrąglasz dopiero to, co wpisujesz do tabeli.' : '');
      }
      komorki[t] = { v, tex: zlTex(v.round(2)), typ: t === cel ? 'cel' : 'ruch', od: s, op: `${kier > 0 ? '\\cdot' : ':'} ${fTex}`,
        ex: `${kwTex(prev)} ${kier > 0 ? '\\cdot' : ':'} ${fTex}` };
      kroki.push({ a: 'skok', k, z: t - kier, t, html });
    }
    return { nazwa, t: w.t, kier, komorki, wynik: v };
  });
  const czesci = kolumny.map((c) => c.wynik.round(2));
  const sumaCz = czesci.reduce((a, x) => a.add(x), new R(0n));
  const sumaV = kolumny.reduce((a, c) => a.add(c.wynik), new R(0n));
  let kartka = null;
  if (wiele) {
    kartka = { od: kroki.length, linie: kolumny.map((c, k) => ({ k, nazwa: c.nazwa, tex: liczTex(czesci[k], 2) })), wynik: liczTex(sumaCz, 2) };
    kroki.push({ a: 'suma', html: `W zielonym wierszu („${etykieta(cel)}”) masz teraz ${kolumny.length} ${odmiana(kolumny.length, ['kwotę', 'kwoty', 'kwot'])}. Dodajesz je — najwygodniej pisemnie, jak na kartce pod tabelą:<br>$${czesci.map((x) => liczTex(x, 2)).join(' + ')} = ${liczTex(sumaCz, 2)}$.${sumaCz.eq(sumaV.round(2)) ? '' : ` Z kwot bez zaokrągleń wychodzi $${zlTex(sumaV.round(2), false)}$ — grosz różnicy to skutek zaokrągleń.`}` });
  }
  const wynikTex = zlTex(wiele ? sumaCz : czesci[0], false);
  const nazwaW = wynik ? `$${wynik} = ${wynikTex}$` : `$${wynikTex}$`;
  kroki.push({ a: 'koniec', html: wiele
    ? `Gotowe: ${nazwaW} zł. Tyle są warte wszystkie kwoty razem w chwili „${etykieta(cel)}”.`
    : `Gotowe: ${nazwaW} zł. Tyle jest warta ta kwota w chwili „${etykieta(cel)}”.` });
  const wDol = kolumny.every((c) => c.kier > 0), wGore = kolumny.every((c) => c.kier < 0);
  const ruch = wDol ? `Jeden wiersz w dół to jeden ${O.m} odsetek: mnożysz przez $${fTex}$.`
    : wGore ? `Jeden wiersz w górę to cofnięcie o jeden ${O.m}: dzielisz przez $${fTex}$.`
      : `W dół (w przyszłość) mnożysz przez $${fTex}$, w górę (w przeszłość) dzielisz przez $${fTex}$.`;
  const kiedy = (t) => (t === 0 ? zero : `na koniec ${t}.\u00a0${O.d}`);
  const gdzie = wDol ? ' w dół' : wGore ? ' w górę' : '';
  const zlote = wiele
    ? (wDol ? 'Złote kratki to wpłaty — każda w chwili, w której ją wpłacasz.' : wGore ? 'Złote kratki to wypłaty — każda w chwili, w której ją dostajesz.' : 'Złote kratki to kwoty w chwili, w której się pojawiają.')
      + ` Każdą przesuwasz${gdzie} do zielonego wiersza „${etykieta(cel)}”.`
    : (wDol ? `Złota kratka to kwota, którą wpłacasz ${kiedy(kolumny[0].t)}.` : `Złota kratka to kwota, którą dostaniesz ${kiedy(kolumny[0].t)}.`)
      + ` Przesuwasz ją${gdzie} do zielonego wiersza „${etykieta(cel)}”.`;
  kroki[0].html = `Tabela to oś czasu z góry na dół: każdy wiersz to jeden moment, od ${etD(t0)} do ${etD(t1)}. ${zlote} ${ruch}`;
  return { momenty, etykieta, kolumny, cel, suma: sumaV, sumaCz, kartka, kroki, fTex, pTex, wiele };
}

// ---------- plan spłaty kredytu w ratach malejących ----------
// Kolumny jak w szablonie z zajęć. Kroki animacji i opisy komórek („skąd ta liczba”) liczone tutaj.
export const KOLUMNY_PLANU = [
  { id: 'okres', nazwa: 'Okres' },
  { id: 'kp', nazwa: 'Kapitał początkowy' },
  { id: 'ods', nazwa: 'Odsetki' },
  { id: 'ro', nazwa: 'Rata odsetkowa' },
  { id: 'rk', nazwa: 'Rata kapitałowa' },
  { id: 'rl', nazwa: 'Rata łączna' },
  { id: 'kk', nazwa: 'Kapitał końcowy' },
];
export function planMalejacy(kredyt, n, i) {
  const K = R.of(kredyt), I = R.of(i);
  const rk = K.div(n);
  if (!rk.round(2).eq(rk)) throw new Error('Finanse: rata kapitałowa nie wychodzi w pełnych groszach — wybierz inny kredyt');
  const wiersze = [];
  let kp = K;
  for (let k = 1; k <= n; k++) {
    const ods = kp.mul(I);
    if (!ods.round(2).eq(ods)) throw new Error(`Finanse: odsetki w okresie ${k} nie wychodzą w pełnych groszach`);
    const rl = ods.add(rk);
    const kk = kp.sub(rk);
    wiersze.push({ k, kp, ods, ro: ods, rk, rl, kk });
    kp = kk;
  }
  if (!wiersze[n - 1].kk.zero) throw new Error('Finanse: kredyt nie został spłacony');
  const sumaOds = wiersze.reduce((a, w) => a.add(w.ods), new R(0n));
  const sumaRl = wiersze.reduce((a, w) => a.add(w.rl), new R(0n));
  const z = (x) => zlTex(x);
  const pT = procTex(I);
  // opisy komórek: klucz `${wiersz}-${kolumna}`
  const opisy = {};
  wiersze.forEach((w, x) => {
    const pz = procentZ(w.kp, I);
    opisy[`${x}-kp`] = x === 0
      ? `<b>Kapitał początkowy</b> w 1. okresie to cały kredyt: $${z(K)}$.`
      : `<b>Kapitał początkowy</b> = kapitał końcowy z poprzedniego wiersza: $${z(w.kp)}$.`;
    opisy[`${x}-ods`] = `<b>Odsetki</b> = $${pT}$ kapitału początkowego: $${pz.tex1}$, potem $${pz.tex2}$.`;
    opisy[`${x}-ro`] = `<b>Rata odsetkowa</b> = odsetki z tego okresu (płacisz je od razu w całości): $${z(w.ods)}$.`;
    opisy[`${x}-rk`] = `<b>Rata kapitałowa</b> = kredyt : liczba rat $= ${z(K)} : ${n} = ${z(rk)}$ — w każdym wierszu tyle samo.`;
    opisy[`${x}-rl`] = `<b>Rata łączna</b> = rata odsetkowa + rata kapitałowa $= ${z(w.ro)} + ${z(rk)} = ${z(w.rl)}$.`;
    opisy[`${x}-kk`] = `<b>Kapitał końcowy</b> = kapitał początkowy − rata kapitałowa $= ${z(w.kp)} - ${z(rk)} = ${z(w.kk)}$.${x === n - 1 ? ' Zero na końcu = kredyt spłacony.' : ''}`;
  });
  opisy['suma-ods'] = `Suma odsetek: $${wiersze.map((w) => z(w.ods)).join(' + ')} = ${z(sumaOds)}$ — tyle kosztuje ten kredyt.`;
  opisy['suma-ro'] = opisy['suma-ods'];
  opisy['suma-rk'] = `Suma rat kapitałowych: $${n} \\cdot ${z(rk)} = ${z(K)}$ — dokładnie kwota kredytu ✓.`;
  opisy['suma-rl'] = `Suma rat łącznych: $${wiersze.map((w) => z(w.rl)).join(' + ')} = ${z(sumaRl)}$ — kredyt $${z(K)}$ plus odsetki $${z(sumaOds)}$.`;
  // kroki animacji
  const kroki = [];
  kroki.push({ a: 'start', html: `Dane: kredyt $${z(K)}$ zł, ${n} ${odmiana(n, ['rata', 'raty', 'rat'])} (płacisz na koniec każdego okresu), oprocentowanie $${pT}$ na okres. Tabela jest pusta — wypełnisz ją wiersz po wierszu, od lewej do prawej.` });
  kroki.push({ a: 'rk0', html: `Zaczynasz od <b>raty kapitałowej</b> — to część raty, która spłaca sam kredyt. W ratach malejących dzielisz kredyt na równe części: $${z(K)} : ${n} = ${z(rk)}$. Ta liczba będzie w każdym wierszu.` });
  wiersze.forEach((w, x) => {
    const pz = procentZ(w.kp, I);
    const nr = `<b>Okres ${w.k}.</b>`;
    kroki.push({ a: 'lot', w: x, c: 'kp', z: x === 0 ? 'dane-K' : `${x - 1}-kk`,
      html: x === 0
        ? `${nr} Na początku do spłaty jest cały kredyt, więc <b>kapitał początkowy</b> = $${z(K)}$.`
        : `${nr} Zaczynasz od tego, co zostało do spłaty po poprzednim okresie: <b>kapitał początkowy</b> = kapitał końcowy z wiersza wyżej = $${z(w.kp)}$.` });
    kroki.push({ a: 'licz', w: x, c: 'ods', z: `${x}-kp`, ex: `${z(w.kp)} \\cdot ${pT}`,
      html: `${nr} <b>Odsetki</b> to opłata za to, że przez cały okres pożyczasz $${z(w.kp)}$ zł. Liczysz $${pT}$ z kapitału początkowego:<br>$${pz.tex1}$, potem $${pz.tex2}$.` });
    kroki.push({ a: 'lot', w: x, c: 'ro', z: `${x}-ods`,
      html: `${nr} <b>Rata odsetkowa</b> to część raty przeznaczona na odsetki. W planach w tym module płacisz od razu wszystkie odsetki za okres, więc rata odsetkowa = odsetki = $${z(w.ods)}$.` });
    kroki.push({ a: 'lot', w: x, c: 'rk', z: 'dane-rk',
      html: `${nr} <b>Rata kapitałowa</b> — zawsze ta sama, policzona na początku: $${z(rk)}$.` });
    kroki.push({ a: 'licz', w: x, c: 'rl', z: `${x}-ro,${x}-rk`, ex: `${z(w.ro)} + ${z(rk)}`,
      html: `${nr} <b>Rata łączna</b> to tyle, ile przelewasz bankowi w tym okresie, czyli rata odsetkowa + rata kapitałowa:<br>$${z(w.ro)} + ${z(rk)} = ${z(w.rl)}$.` });
    kroki.push({ a: 'licz', w: x, c: 'kk', z: `${x}-kp,${x}-rk`, ex: `${z(w.kp)} - ${z(rk)}`,
      html: `${nr} <b>Kapitał końcowy</b> — ile kredytu zostało do spłaty. Dług zmniejsza tylko rata kapitałowa:<br>$${z(w.kp)} - ${z(rk)} = ${z(w.kk)}$.${x === 0 ? ' (Odsetek nie odejmujesz — one nie spłacają długu, to opłata za pożyczanie.)' : ''}${x === n - 1 ? ' Zero na końcu — kredyt spłacony ✓.' : ''}` });
  });
  kroki.push({ a: 'suma', html: `Sprawdzenie w wierszu „Razem”. Raty kapitałowe razem: $${n} \\cdot ${z(rk)} = ${z(K)}$, czyli cały kredyt ✓.<br>Odsetki razem: $${wiersze.map((w) => z(w.ods)).join(' + ')} = ${z(sumaOds)}$ — tyle kosztuje ten kredyt.<br>Raty łączne razem: $${wiersze.map((w) => z(w.rl)).join(' + ')} = ${z(sumaRl)}$, czyli kredyt + odsetki: $${z(K)} + ${z(sumaOds)}$.` });
  return { K, I, n, rk, wiersze, sumaOds, sumaRl, opisy, kroki };
}

// ---------- dane do ćwiczeń „wypełnij tabelę” (CwiczenieKwoty.astro) ----------
// dokładna wartość jako tekst z kropką (do porównania w przeglądarce)
const decStr = (x) => { const v = R.of(x).round(8); const neg = v.ujemna; const m = 10n ** 8n; const a = babs(v.n) * (m / v.d); const c = (a / m).toString(); const u = (a % m).toString().padStart(8, '0').replace(/0+$/, ''); return `${neg ? '-' : ''}${c}${u ? `.${u}` : ''}`; };
const doWpisania = (x, opis) => ({ v: decStr(x), pok: zlTxt(x.round(2)), opis });
// procent składany rok po roku: Rok | Kapitał na początku | Odsetki | Kapitał na koniec
export function cwSkladany(kwota, i, n, okres = 'rok') {
  const K = R.of(kwota), I = R.of(i), f = I.add(1);
  const O = OKRESY[okres] ?? OKRESY.okres;
  const pT = procTex(I);
  const kolumny = [duza(okres), `Kapitał na początku ${O.d}`, 'Odsetki', `Kapitał na koniec ${O.d}`];
  const wiersze = [];
  let kp = K;
  for (let k = 1; k <= n; k++) {
    const pz = procentZ(kp, I);
    const kk = kp.mul(f);
    const et = `${k}. ${O.m}`;
    wiersze.push([
      { dana: true, tex: `${k}` },
      k === 1 ? { dana: true, tex: zlTex(K) } : { ...doWpisania(kp, `<b>${et}, kapitał na początku</b> = kapitał na koniec poprzedniego ${O.d}: $${kwTex(kp)}$.`), et },
      { ...doWpisania(pz.wynik, `<b>${et}, odsetki</b> = $${pT}$ z $${kwTex(kp)}$: $${pz.tex1}$, potem $${pz.tex2}$.`), et },
      { ...doWpisania(kk, `<b>${et}, kapitał na koniec</b> = kapitał na początku + odsetki: $${kwTex(kp)} + ${kwTex(pz.wynik)} = ${kwWynik(kk)}$.`), et },
    ]);
    kp = kk;
  }
  return { kolumny, wiersze, wynik: kp };
}
// plan spłaty w ratach malejących: szablon z zajęć, kapitał początkowy w 1. okresie podany
export function cwPlan(kredyt, n, i) {
  const p = planMalejacy(kredyt, n, i);
  const kolumny = KOLUMNY_PLANU.map((c) => c.nazwa);
  const wiersze = p.wiersze.map((w, x) => {
    const et = `okres ${w.k}`;
    const kom = (c) => ({ ...doWpisania(w[c], `Okres ${w.k} · ${p.opisy[`${x}-${c}`]}`), et });
    return [
      { dana: true, tex: `${w.k}` },
      x === 0 ? { dana: true, tex: zlTex(w.kp) } : kom('kp'),
      kom('ods'), kom('ro'), kom('rk'), kom('rl'), kom('kk'),
    ];
  });
  return { kolumny, wiersze, plan: p };
}
