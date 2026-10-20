// Moduł 9 „Badanie zmienności funkcji jednej zmiennej”: procedura z zajęć, tabele znaków, tabele zmienności i wykresy.
// Każde zadanie z listy to dane: funkcja (wzór i JS), dziedzina, linie rachunku pochodnej (format jak w lib/pochodne.js),
// czynniki pochodnej z punktami próbnymi i ekstrema/punkty przegięcia. Tabele i wykres liczy budowniczy `badanie()`
// i sam sprawdza, czy znaki z czynników zgadzają się z pochodną liczoną numerycznie (błąd w danych = błąd buildu).
// Linie: e — etap procedury (1 dziedzina, 2 pochodna, 3 warunek konieczny, 4 znak, 5 tabela i wnioski),
// typ — co sprawdza skrypt weryfikujący (mat-check/t9): 'f' = f(x), 'd' = f'(x), 'd2' = f''(x), 'p' = pochodna kawałka, 'x' = nic.
import { tex } from './tex.js';
import { skala, sciezka, osie } from './wykres.js';
import { zWaskimi } from './waskie.js';
const R = String.raw;

// ---------- procedury ze slajdów (etapy rachunku) ----------
export const ETAPY_M = [
  { nr: 1, nazwa: 'dziedzina', co: 'wypisz, czego nie wolno: dzielenia przez zero, logarytmu z liczby ujemnej albo z zera, pierwiastka kwadratowego z liczby ujemnej',
    po: 'Na samym początku, bo poza dziedziną funkcji nie ma — nie ma tam ani wykresu, ani pochodnej. Punkty wyrzucone z dziedziny dzielą potem oś na osobne przedziały.' },
  { nr: 2, nazwa: 'pochodna', co: 'policz $f\'(x)$ wzorami i regułami z modułu 8, a na końcu rozłóż ją na czynniki',
    po: 'Znak pochodnej mówi, gdzie funkcja rośnie, a gdzie maleje. Postać iloczynu (czynniki) jest potrzebna, bo znak iloczynu łatwo odczytać ze znaków czynników.' },
  { nr: 3, nazwa: 'warunek konieczny', co: 'rozwiąż równanie $f\'(x) = 0$ — rozwiązania z dziedziny to punkty stacjonarne',
    po: 'Tam, gdzie pochodna istnieje, ekstremum może być tylko w punkcie, w którym styczna jest pozioma, czyli $f\'(x) = 0$. Te punkty to kandydaci — sprawdzi ich etap 5.' },
  { nr: 4, nazwa: 'znak pochodnej', co: 'rozwiąż nierówności $f\'(x) > 0$ i $f\'(x) < 0$: w każdym przedziale między punktami podstaw jedną liczbę',
    po: 'Między punktami stacjonarnymi i dziurami w dziedzinie pochodna nie zmienia znaku. Wystarczy więc jedna liczba z przedziału, żeby poznać znak w całym przedziale.' },
  { nr: 5, nazwa: 'tabela i wnioski', co: 'przepisz znaki do tabeli zmienności, dorysuj strzałki, sprawdź zmianę znaku (warunek dostateczny) i policz wartości ekstremów',
    po: 'Tabela zbiera wszystko w jednym miejscu: gdzie funkcja rośnie, gdzie maleje i gdzie zawraca. Ekstremum jest tylko tam, gdzie znak się zmienia.' },
];
export const ETAPY_W = [
  { nr: 1, nazwa: 'dziedzina', co: 'wypisz, czego nie wolno: dzielenia przez zero, logarytmu z liczby ujemnej albo z zera, pierwiastka kwadratowego z liczby ujemnej',
    po: 'Na samym początku, bo poza dziedziną funkcji nie ma. Punkty wyrzucone z dziedziny dzielą oś na osobne przedziały.' },
  { nr: 2, nazwa: 'druga pochodna', co: 'policz $f\'(x)$, potem $f\'\'(x)$ — pochodną pochodnej — i rozłóż ją na czynniki',
    po: 'O kształcie wykresu (wypukły czy wklęsły) mówi znak drugiej pochodnej, nie pierwszej.' },
  { nr: 3, nazwa: 'warunek konieczny', co: 'rozwiąż równanie $f\'\'(x) = 0$',
    po: 'Tam, gdzie druga pochodna istnieje, punkt przegięcia może być tylko w punkcie, w którym $f\'\'(x) = 0$. To kandydaci — sprawdzi ich etap 5.' },
  { nr: 4, nazwa: 'znak drugiej pochodnej', co: 'rozwiąż nierówności $f\'\'(x) > 0$ i $f\'\'(x) < 0$: w każdym przedziale podstaw jedną liczbę',
    po: 'Między zerami $f\'\'$ i dziurami w dziedzinie druga pochodna nie zmienia znaku, więc jedna liczba z przedziału wystarczy.' },
  { nr: 5, nazwa: 'tabela i wnioski', co: 'przepisz znaki do tabeli, zapisz kształt (∪ wypukła, ∩ wklęsła), sprawdź zmianę znaku i policz współrzędne punktów przegięcia',
    po: 'Punkt przegięcia jest tylko tam, gdzie znak $f\'\'$ się zmienia. Podajesz go jako punkt na wykresie: $(x_0, f(x_0))$.' },
];

// ---------- liczby i zapis ----------
// liczba → LaTeX z przecinkiem dziesiętnym ({,}), bez zbędnych zer
export const fmt = (v) => {
  const r = Math.round(v * 10000) / 10000;
  const s = String(Math.abs(r)).replace('.', '{,}');
  return (r < 0 ? '-' : '') + s;
};
export const par = (t) => (String(t).trim().startsWith('-') ? `(${t})` : String(t));
const ZNAK = (v) => (Math.abs(v) < 1e-9 ? 0 : v > 0 ? 1 : -1);
const INF = '\\infty';
const kon = (x, t) => (x === -Infinity ? `-${INF}` : x === Infinity ? INF : t);
export const przedzial = (a, b) => `(${a}, ${b})`;
// pochodne liczone numerycznie — tylko do kontroli danych przy buildzie
const d1 = (f, x) => { const h = 1e-5; return (f(x + h) - f(x - h)) / (2 * h); };
const d2 = (f, x) => { const h = 1e-4; return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h); };

// czynnik liniowy a·x + b z rachunkiem „na kartce” dla punktu próbnego (np. x − 1 → „−2 − 1 = −3”)
export function lin(t, a, b) {
  return {
    t, f: (x) => a * x + b,
    w: (p) => {
      const ax = a === 1 ? p.t : a === -1 ? `-${par(p.t)}` : `${a} \\cdot ${par(p.t)}`;
      const bb = b === 0 ? '' : b > 0 ? ` + ${b}` : ` - ${-b}`;
      return `${ax}${bb} = ${fmt(a * p.x + b)}`;
    },
  };
}

// ---------- budowniczy jednego zadania ----------
// dane: { id, rzad (1 albo 2), f, fn, dz: { od, do, odT?, doT?, wykl: [{ x, t }] }, linie: [...], czynniki, zera: [{ x, t }],
//         probne: [{ x, t }], wstep: linia (etap 4), punkty: { [t]: { w: [...], k?: [...] } }, okno, kx, ky, rowne, podpisy }
export function badanie(D) {
  const rzad = D.rzad ?? 1;
  const pochodna = rzad === 1 ? d1 : d2;
  const prim = rzad === 1 ? "f'" : "f''";
  const od = D.dz.od ?? -Infinity, doo = D.dz.do ?? Infinity;
  const wykl = (D.dz.wykl ?? []).map((p) => ({ ...p, rodzaj: 'wykl' }));
  const zera = (D.zera ?? []).map((p) => ({ ...p, rodzaj: 'zero' }));
  const punkty = [...wykl, ...zera].sort((a, b) => a.x - b.x);
  // przedziały między punktami (w dziedzinie)
  const brzegi = [{ x: od, t: kon(od, D.dz.odT) }, ...punkty, { x: doo, t: kon(doo, D.dz.doT) }];
  const kol = [];
  for (let i = 0; i + 1 < brzegi.length; i++) {
    const a = brzegi[i], b = brzegi[i + 1];
    const pr = (D.probne ?? []).find((p) => p.x > a.x && p.x < b.x);
    if (!pr) throw new Error(`[${D.id}] brak punktu próbnego w przedziale (${a.t}, ${b.t})`);
    // znak z czynników i kontrola z pochodną liczoną numerycznie
    const zn = D.czynniki.map((c) => ZNAK(c.f(pr.x)));
    const iloczyn = zn.reduce((s, v) => s * v, 1) * (D.znakStalych ?? 1);
    const num = ZNAK(D.znakFn ? D.znakFn(pr.x) : pochodna(D.fn, pr.x));
    if (iloczyn !== num) throw new Error(`[${D.id}] znak z czynników (${iloczyn}) ≠ znak ${prim} (${num}) w x = ${pr.x}`);
    kol.push({ rodzaj: 'przedzial', a, b, t: przedzial(a.t, b.t), pr, zn, znak: iloczyn });
    if (i + 1 < brzegi.length - 1) {
      const p = brzegi[i + 1];
      if (p.rodzaj === 'zero' && Math.abs(D.znakFn ? D.znakFn(p.x) : pochodna(D.fn, p.x)) > 1e-3) throw new Error(`[${D.id}] ${prim}(${p.x}) ≠ 0`);
      kol.push({ rodzaj: p.rodzaj, x: p.x, t: p.t, zn: D.czynniki.map((c) => (p.rodzaj === 'wykl' ? null : ZNAK(c.f(p.x)))) });
    }
  }
  // wnioski w punktach: zmiana znaku → ekstremum / przegięcie
  kol.forEach((c, i) => {
    if (c.rodzaj !== 'zero') return;
    const L = kol[i - 1].znak, P = kol[i + 1].znak;
    if (rzad === 1) c.wn = L > 0 && P < 0 ? 'max' : L < 0 && P > 0 ? 'min' : 'brak';
    else c.wn = L !== P ? 'przeg' : 'brak';
  });
  const przedzialy = kol.filter((c) => c.rodzaj === 'przedzial');
  const plus = przedzialy.filter((c) => c.znak > 0), minus = przedzialy.filter((c) => c.znak < 0);
  const wyniki = kol.filter((c) => c.rodzaj === 'zero');
  const jedenP = wyniki.filter((c) => c.wn === 'przeg').length === 1;  // jeden punkt przegięcia: P bez numeru

  // ---------- tabela znaków (etap 4) i tabela zmienności (etap 5) ----------
  const klasa = (v) => (v > 0 ? 'is-plus' : v < 0 ? 'is-minus' : 'is-zero');
  const zn = (v) => (v == null ? '×' : v > 0 ? '+' : v < 0 ? '−' : '0');
  const strz = (v) => (rzad === 1 ? (v > 0 ? '↗' : '↘') : v > 0 ? '∪' : '∩');
  const wnT = { max: 'max', min: 'min', brak: '—', przeg: 'przegięcie' };
  const naglowek = (c) => (c.rodzaj === 'przedzial' ? tex(c.t) : tex(c.t));
  const fx = D.fx ?? (rzad === 1 ? "f'(x)" : "f''(x)");
  const tabZnakow = () => {
    const rows = [
      `<tr class="is-x"><th>${tex('x')}</th>${kol.map((c) => `<th class="${c.rodzaj === 'przedzial' ? '' : 'is-pkt'}">${naglowek(c)}</th>`).join('')}</tr>`,
      `<tr class="is-pr"><th>liczba próbna</th>${kol.map((c) => `<td>${c.rodzaj === 'przedzial' ? tex(`x = ${c.pr.t}`) : ''}</td>`).join('')}</tr>`,
      ...D.czynniki.map((cz, j) => `<tr><th>${tex(cz.t)}</th>${kol.map((c) => (c.rodzaj === 'wykl' ? '<td class="is-wykl">×</td>' : `<td class="${klasa(c.zn[j])}">${zn(c.zn[j])}</td>`)).join('')}</tr>`),
      `<tr class="is-wyn"><th>${tex(fx)}</th>${kol.map((c) => (c.rodzaj === 'wykl' ? '<td class="is-wykl">×</td>' : c.rodzaj === 'zero' ? '<td class="is-zero">0</td>' : `<td class="${klasa(c.znak)}">${zn(c.znak)}</td>`)).join('')}</tr>`,
    ];
    // wersja pionowa (telefon): wiersz = przedział albo punkt
    const pion = `<table class="k-zn-tab is-v"><thead><tr><th>${tex('x')}</th>${D.czynniki.map((cz) => `<th>${tex(cz.t)}</th>`).join('')}<th>${tex(fx)}</th></tr></thead><tbody>${kol.map((c) => `<tr class="${c.rodzaj === 'przedzial' ? '' : 'is-pkt'}"><th>${naglowek(c)}${c.rodzaj === 'przedzial' ? `<span class="k-zn-pr">np. ${tex(c.pr.t)}</span>` : ''}</th>${D.czynniki.map((cz, j) => (c.rodzaj === 'wykl' ? '<td class="is-wykl">×</td>' : `<td class="${klasa(c.zn[j])}">${zn(c.zn[j])}</td>`)).join('')}${c.rodzaj === 'wykl' ? '<td class="is-wykl">×</td>' : c.rodzaj === 'zero' ? '<td class="is-zero">0</td>' : `<td class="${klasa(c.znak)} is-wyn">${zn(c.znak)}</td>`}</tr>`).join('')}</tbody></table>`;
    return `<div class="k-znt is-r${rzad} is-w${kol.length}"><table class="k-zn-tab is-h"><tbody>${rows.join('')}</tbody></table>${pion}</div>`;
  };
  const wierszF = (c) => (c.rodzaj === 'wykl' ? '<td class="is-wykl">×</td>' : c.rodzaj === 'zero' ? `<td class="is-wn is-${c.wn}">${wnT[c.wn]}</td>` : `<td class="${klasa(c.znak)} is-ksz">${strz(c.znak)}</td>`);
  const wierszD = (c) => (c.rodzaj === 'wykl' ? '<td class="is-wykl">×</td>' : c.rodzaj === 'zero' ? '<td class="is-zero">0</td>' : `<td class="${klasa(c.znak)}">${zn(c.znak)}</td>`);
  const tabZmiennosci = () => {
    const h = `<table class="k-zn-tab is-h"><tbody>
      <tr class="is-x"><th>${tex('x')}</th>${kol.map((c) => `<th class="${c.rodzaj === 'przedzial' ? '' : 'is-pkt'}">${naglowek(c)}</th>`).join('')}</tr>
      <tr><th>${tex(fx)}</th>${kol.map(wierszD).join('')}</tr>
      <tr class="is-wyn"><th>${tex('f(x)')}</th>${kol.map(wierszF).join('')}</tr></tbody></table>`;
    const v = `<table class="k-zn-tab is-v"><thead><tr><th>${tex('x')}</th><th>${tex(fx)}</th><th>${tex('f(x)')}</th></tr></thead><tbody>${kol.map((c) => `<tr class="${c.rodzaj === 'przedzial' ? '' : 'is-pkt'}"><th>${naglowek(c)}</th>${wierszD(c)}${wierszF(c)}</tr>`).join('')}</tbody></table>`;
    return `<div class="k-znt is-r${rzad} is-zm is-w${kol.length}">${h}${v}</div>`;
  };

  // ---------- rachunki „na kartce” dla punktów próbnych ----------
  // wstawienie liczby próbnej do czynnika: z rachunku czynnika (w) albo przez podmianę x (np. x^2 - 12 → (-4)^2 - 12)
  const podstaw = (cz, p) => {
    if (cz.w) return cz.w(p).split(' = ')[0];
    if (!/x/.test(cz.t)) return cz.t;
    const liczba = /^[0-9]+$/.test(p.t) ? p.t : `(${p.t})`;
    return cz.t.replace(/(\d)?x/g, (m, cyfra) => (cyfra ? `${cyfra} \\cdot ` : '') + liczba);
  };
  const jedenNawias = (t) => { if (!t.startsWith('(') || !t.endsWith(')')) return false; let g = 0; for (let i = 0; i < t.length; i++) { g += t[i] === '(' ? 1 : t[i] === ')' ? -1 : 0; if (g === 0 && i < t.length - 1) return false; } return true; };
  // nawias wokół czynnika w iloczynie, chyba że to już jedna „cegiełka”: liczba, (…) albo (…)^k
  const wNawias = (t) => {
    if (t.startsWith('-')) return `(${t})`;
    const baza = t.replace(/\^(\{[^}]*\}|\d)$/, '');
    return jedenNawias(baza) || /^[0-9{},.]+$|^\\tfrac\d\d$/.test(baza) ? t : `(${t})`;
  };
  const kartka = przedzialy.map((c) => {
    const czy = D.czynniki;
    let s;
    if (czy.length === 1) s = czy[0].w ? czy[0].w(c.pr) : `${podstaw(czy[0], c.pr)} = ${fmt(czy[0].f(c.pr.x))}`;
    else {
      const wst = czy.map((cz) => wNawias(podstaw(cz, c.pr)));
      const wart = czy.map((cz) => par(fmt(cz.f(c.pr.x))));
      const il = czy.reduce((s2, cz) => s2 * cz.f(c.pr.x), 1);
      const pom = wst.join(' \\cdot ') === wart.join(' \\cdot ');
      s = pom ? `${wart.join(' \\cdot ')} = ${fmt(il)}` : '';
      if (!pom) { c.kart = `\\begin{aligned} &x = ${c.pr.t}\\colon \\\\ &${wst.join(' \\cdot ')} \\\\ &= ${wart.join(' \\cdot ')} = ${fmt(il)} ${c.znak > 0 ? '> 0' : '< 0'} \\end{aligned}`; return c.kart; }
    }
    c.kart = `x = ${c.pr.t}\\colon \\ ${s} ${c.znak > 0 ? '> 0' : '< 0'}`;
    return c.kart;
  });

  // ---------- zapis wyniku ----------
  const lista = (cs) => { const t = cs.map((c) => `$${c.t}$`); return t.length < 2 ? t.join('') : `${t.slice(0, -1).join(', ')} i ${t[t.length - 1]}`; };
  const zbior = (cs) => cs.map((c) => c.t).join(' \\cup ');
  const nazwy = rzad === 1 ? ['rośnie', 'maleje'] : ['jest wypukła', 'wklęsła'];
  const wPrzedz = (cs) => (cs.length === 1 ? 'w przedziale' : 'w przedziałach');
  const zdanieWyniku = [
    plus.length ? `Funkcja ${nazwy[0]} ${wPrzedz(plus)} ${lista(plus)}` : '',
    minus.length ? `${plus.length ? 'a' : (rzad === 1 ? 'Funkcja' : 'Funkcja jest')} ${nazwy[1]} ${wPrzedz(minus)} ${lista(minus)}` : '',
  ].filter(Boolean).join(', ') + '.';

  // ---------- wykres ----------
  const wykres = wykresSvg({
    fn: D.fn, okno: D.okno, kx: D.kx, ky: D.ky, rowne: D.rowne,
    kawalki: przedzialy.map((c) => ({ od: Math.max(c.a.x, D.okno.x0), do: Math.min(c.b.x, D.okno.x1), kl: rzad === 1 ? (c.znak > 0 ? 'k-w-b' : 'k-w-r') : (c.znak > 0 ? 'k-w-a' : 'k-w-z') })),
    pion: wykl.map((p) => p.x),
    punkty: wyniki.filter((c) => c.wn !== 'brak' || rzad === 1).map((c, i) => {
      const y = D.fn(c.x);
      const nr = rzad === 2 ? wyniki.filter((w) => w.wn === 'przeg').indexOf(c) + 1 : 0;
      const etyk = c.wn === 'max' ? 'max' : c.wn === 'min' ? 'min' : c.wn === 'przeg' ? (jedenP ? 'P' : `P${'₁₂₃₄'[nr - 1] ?? ''}`) : 'f′ = 0, brak';
      return { x: c.x, y, kl: c.wn === 'przeg' ? 'is-p' : c.wn === 'brak' ? 'is-brak' : 'is-e', t: etyk, ...(D.podpisy?.[c.t] ?? {}), wn: c.wn };
    }),
  });

  // ---------- linie rachunku ----------
  // zdanie „co dzieli oś”: z tego, co naprawdę jest w zadaniu (punkty stacjonarne / zera f'' / dziury)
  const ileZer = zera.length, ileDziur = wykl.length;
  const kawalkiOsi = [
    ileZer ? (rzad === 1 ? (ileZer === 1 ? 'punkt stacjonarny' : 'punkty stacjonarne') : (ileZer === 1 ? "zero $f''$" : "zera $f''$")) : '',
    ileDziur ? (ileDziur === 1 ? 'dziura w dziedzinie' : 'dziury w dziedzinie') : '',
  ].filter(Boolean);
  const podzial = kawalkiOsi.length
    ? `${kawalkiOsi.join(' i ').replace(/^./, (z) => z.toUpperCase())} ${ileZer + ileDziur === 1 ? 'dzieli' : 'dzielą'} oś na przedziały.`
    : 'Nic nie dzieli osi — cała dziedzina to jeden przedział.';
  const wnLinie = wyniki.map((c) => {
    const P = { w: ['?'], ...(D.punkty?.[c.t] ?? {}) };
    if (c.wn === 'brak') {
      return { e: 5, typ: 'x', t: rzad === 1 ? `${prim}(${c.t}) = 0, \\ \\text{ale bez zmiany znaku}` : `${prim}(${c.t}) = 0, \\ \\text{ale bez zmiany znaku}`,
        r: rzad === 1 ? 'warunek dostateczny' : 'warunek dostateczny przegięcia',
        o: rzad === 1 ? `W punkcie $x = ${c.t}$ pochodna jest równa $0$, ale po obu stronach ma ten sam znak. Funkcja tu nie zawraca — <b>nie ma ekstremum</b>.`
          : `W punkcie $x = ${c.t}$ druga pochodna jest równa $0$, ale po obu stronach ma ten sam znak. Kształt się nie zmienia — <b>nie ma punktu przegięcia</b>.` };
    }
    if (rzad === 1) {
      const max = c.wn === 'max';
      return { e: 5, typ: 'x', w: P.w, x0: c.x, t: `f_{\\${max ? 'max' : 'min'}}(${c.t}) = f(${c.t}) = ${P.w.join(' = ')}`, k: P.k, r: 'warunek dostateczny',
        tm: `\\begin{aligned} f_{\\${max ? 'max' : 'min'}}(${c.t}) &= f(${c.t}) \\\\ ${P.w.map((w) => `&= ${w}`).join(' \\\\ ')} \\end{aligned}`,
        o: `W punkcie $x = ${c.t}$ pochodna zmienia znak z ${max ? '„+” na „−”' : '„−” na „+”'}: funkcja najpierw ${max ? 'rośnie, potem maleje' : 'maleje, potem rośnie'}. To <b>${max ? 'maksimum' : 'minimum'} lokalne</b> — policz jego wartość, wstawiając $x = ${c.t}$ do wzoru funkcji $f$, nie do pochodnej.`, d: P.d };
    }
    const nr = wyniki.filter((w) => w.wn === 'przeg').indexOf(c) + 1;
    const Pn = jedenP ? 'P' : `P_${nr}`;
    return { e: 5, typ: 'x', w: P.w, x0: c.x, t: `${Pn} = (${c.t}, f(${c.t})), \\quad f(${c.t}) = ${P.w.join(' = ')}`, tm: `\\begin{aligned} ${Pn} &= (${c.t}, f(${c.t})) \\\\ f(${c.t}) &= ${P.w.join(' \\\\ &= ')} \\end{aligned}`, k: P.k, r: 'warunek dostateczny przegięcia',
      o: `W punkcie $x = ${c.t}$ druga pochodna zmienia znak — wykres zmienia kształt. To <b>punkt przegięcia</b>. Podaj go jako punkt: obie współrzędne; drugą policz ze wzoru funkcji $f$.`, d: P.d };
  });
  // odpowiedź jako wzór: przedziały po dwa w wierszu (mieści się na telefonie), potem wartości ekstremów / punkty przegięcia
  const pary = (cs) => { const out = []; for (let i = 0; i < cs.length; i += 2) out.push(cs.slice(i, i + 2).map((c) => c.t).join(', \\ ')); return out; };
  const wierszeOdp = [];
  const opis = rzad === 1 ? ['\\text{rośnie w}', '\\text{maleje w}'] : ['\\text{wypukła w}', '\\text{wklęsła w}'];
  [[plus, opis[0]], [minus, opis[1]]].forEach(([cs, nazwa]) => {
    if (!cs.length) return;
    pary(cs).forEach((w, i) => wierszeOdp.push(`&${i === 0 ? nazwa + ' \\ ' : '\\qquad '}${w}`));
  });
  wyniki.filter((c) => c.wn !== 'brak').forEach((c) => {
    const w = (D.punkty?.[c.t]?.w ?? []).slice(-1)[0];
    if (rzad === 1) wierszeOdp.push(`&f_{\\${c.wn}}(${c.t}) = ${w}`);
    else wierszeOdp.push(`&${jedenP ? 'P' : `P_${wyniki.filter((q) => q.wn === 'przeg').indexOf(c) + 1}`} = \\left(${c.t}, ${w}\\right)`);
  });
  const odpowiedz = `\\begin{aligned} ${wierszeOdp.join(' \\\\ ')} \\end{aligned}`;
  const linie = [
    ...D.linie,
    D.wstep,
    { e: 4, typ: 'x', h: tabZnakow(), o: `Ustal znak ${rzad === 1 ? 'pochodnej' : 'drugiej pochodnej'} w każdym przedziale: weź z przedziału jedną liczbę i podstaw ją do każdego czynnika.`,
      k: kartka, d: `${podzial} W środku przedziału $${prim}$ nie przechodzi przez zero, więc nie zmienia znaku — jedna liczba mówi o całym przedziale. Znak iloczynu: parzysta liczba minusów daje plus, nieparzysta — minus.` },
    { e: 4, typ: 'x', t: [plus.length ? `${prim}(x) > 0 \\ \\text{dla} \\ x \\in ${zbior(plus)}` : `${prim}(x) > 0 \\ \\text{nigdzie}`, minus.length ? `${prim}(x) < 0 \\ \\text{dla} \\ x \\in ${zbior(minus)}` : `${prim}(x) < 0 \\ \\text{nigdzie}`].join(' \\\\ '),
      tm: `\\begin{aligned} ${[[plus, '>'], [minus, '<']].filter(([cs]) => cs.length).map(([cs, z]) => `&${prim}(x) ${z} 0 \\ \\text{dla:} \\\\ ${pary(cs).map((w) => `&\\quad ${w.replace(/, \\ /g, ' \\cup ')}`).join(' \\cup \\\\ ')}`).join(' \\\\ ')} \\end{aligned}`,
      o: `Odczytaj rozwiązania obu nierówności ze znaków $${fx}$ w tabeli: „+” to $${fx} > 0$, „−” to $${fx} < 0$.` },
    { e: 5, typ: 'x', h: tabZmiennosci(), r: rzad === 1 ? 'warunek dostateczny' : 'warunek dostateczny przegięcia',
      o: rzad === 1 ? 'Przepisz znaki do tabeli zmienności: przy „+” strzałka w górę ↗ (rośnie), przy „−” w dół ↘ (maleje). W punkcie stacjonarnym sprawdź, czy znak się zmienia.'
        : 'Przepisz znaki do tabeli: przy „+” kształt ∪ (wypukła), przy „−” ∩ (wklęsła). W punktach, gdzie $f\'\'(x) = 0$, sprawdź, czy znak się zmienia.',
      d: rzad === 1 ? 'To warunek dostateczny ze slajdu: zmiana z „+” na „−” daje maksimum, z „−” na „+” — minimum. Bez zmiany znaku nie ma ekstremum.' : 'To warunek dostateczny ze slajdu: punkt przegięcia jest tam, gdzie druga pochodna zmienia znak.' },
    ...wnLinie,
    { e: 5, typ: 'x', t: odpowiedz, o: 'Zapisz odpowiedź. ' + (rzad === 1 ? zdanieWyniku + (wyniki.some((c) => c.wn === 'max' || c.wn === 'min') ? '' : ' Funkcja nie ma ekstremów.') : zdanieWyniku + (wyniki.some((c) => c.wn === 'przeg') ? '' : ' Punktów przegięcia nie ma.')),
      d: D.uwaga },
    { e: 5, typ: 'x', h: wykres, o: rzad === 1 ? 'Sprawdź na wykresie: zielone kawałki rosną, różowe maleją, a pełne kropki stoją w ekstremach.' + (wyniki.some((c) => c.wn === 'brak') ? ' Pusta kropka to punkt stacjonarny bez ekstremum.' : '') : 'Sprawdź na wykresie: turkusowe kawałki są wypukłe (∪), złote — wklęsłe (∩), a fioletowe kropki to punkty przegięcia.' },
  ];
  const leg = rzad === 1
    ? [['ok', 'funkcja rośnie — pochodna dodatnia'], ['roz', 'funkcja maleje — pochodna ujemna']]
    : [['cyan', 'wypukła (∪) — druga pochodna dodatnia'], ['zloto', 'wklęsła (∩) — druga pochodna ujemna'], ['fiolet', 'punkt przegięcia']];
  // wynik do kafelków „Wszystkie odpowiedzi”
  const wynik = {
    rzad, plus: plus.map((c) => c.t), minus: minus.map((c) => c.t),
    punkty: wyniki.filter((c) => c.wn !== 'brak').map((c) => ({ wn: c.wn, t: c.t, x: c.x, w: (D.punkty?.[c.t]?.w ?? []).slice(-1)[0] })),
  };
  return { id: D.id, f: D.f, rzad, leg, linie: zWaskimi(linie), kol, wynik, wykres, zdanie: zdanieWyniku, odp: odpowiedz, tabZn: tabZnakow(), tabZm: tabZmiennosci() };
}

// ---------- wykres SVG (statyczny, liczony przy buildzie) ----------
// kawalki: [{ od, do, kl }] — fragmenty krzywej w kolorze; pion: asymptoty pionowe (dziury w dziedzinie);
// punkty: [{ x, y, kl: 'is-e'|'is-p'|'is-brak', t, dx, dy, anchor }]
export function wykresSvg({ fn, okno, kx = 1, ky = 1, rowne = false, kawalki, pion = [], punkty = [], pasy = [], styczne = [], napisy = [], prowadnice = [], nazwy = ['x', 'y'], w = 440, h = 320 }) {
  const S = skala({ ...okno, w, h, pad: 26, rowne });
  const czesci = [];
  // pasy w tle (np. „otoczenie punktu”): prostokąty na całą wysokość
  pasy.forEach((p) => czesci.push(`<rect class="k-w-pas ${p.kl ?? ''}" x="${S.X(p.od).toFixed(1)}" y="${S.Y(okno.y1).toFixed(1)}" width="${(S.X(p.do) - S.X(p.od)).toFixed(1)}" height="${(S.Y(okno.y0) - S.Y(okno.y1)).toFixed(1)}"/>`));
  czesci.push(osie(S, { kx, ky, siatka: true, nx: nazwy[0], ny: nazwy[1] }));
  // odcinki stycznych: { x0, y0, k, dl, kl }
  styczne.forEach((t) => { const a = t.x0 - t.dl, c = t.x0 + t.dl; czesci.push(`<line class="k-w-styczna ${t.kl ?? ''}" x1="${S.X(a).toFixed(1)}" y1="${S.Y(t.y0 + t.k * (a - t.x0)).toFixed(1)}" x2="${S.X(c).toFixed(1)}" y2="${S.Y(t.y0 + t.k * (c - t.x0)).toFixed(1)}"/>`); });
  prowadnice.forEach((x) => czesci.push(`<line class="k-w-prow" x1="${S.X(x).toFixed(1)}" y1="${S.Y(okno.y0).toFixed(1)}" x2="${S.X(x).toFixed(1)}" y2="${S.Y(okno.y1).toFixed(1)}"/>`));
  pion.forEach((x) => { if (x > okno.x0 && x < okno.x1) czesci.push(`<line class="k-w-asym" x1="${S.X(x)}" y1="${S.Y(okno.y0)}" x2="${S.X(x)}" y2="${S.Y(okno.y1)}"/>`); });
  kawalki.forEach((k) => {
    const eps = (okno.x1 - okno.x0) * 1e-4;
    czesci.push(`<path class="k-w-krzywa ${k.kl}" d="${sciezka(fn, k.od + eps, k.do - eps, S, 220)}"/>`);
  });
  punkty.forEach((p) => {
    if (p.y < okno.y0 || p.y > okno.y1) return;
    const cx = S.X(p.x), cy = S.Y(p.y);
    const dy = p.dy ?? (p.wn === 'min' ? 24 : -12), dx = p.dx ?? 0;
    czesci.push(`<circle class="k-w-pkt ${p.kl}" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5.5"/>`);
    czesci.push(`<text class="k-w-tbig k-w-etp ${p.kl}" x="${(cx + dx).toFixed(1)}" y="${(cy + dy).toFixed(1)}" text-anchor="${p.anchor ?? 'middle'}">${p.t}</text>`);
  });
  napisy.forEach((n) => czesci.push(`<text class="k-w-t ${n.kl ?? 'k-w-tw'}" x="${S.X(n.x).toFixed(1)}" y="${S.Y(n.y).toFixed(1)}" text-anchor="${n.anchor ?? 'middle'}">${n.t}</text>`));
  return `<svg class="k-w k-zw" viewBox="0 0 ${w} ${h}" role="img" aria-label="Wykres funkcji z zaznaczonymi przedziałami i punktami">${czesci.join('')}</svg>`;
}
