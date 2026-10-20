// Moduł 12 „Całka nieoznaczona”: rachunki krok po kroku (komponent pochodne/Rachunek).
// Linia: e — etap, typ — co sprawdza skrypt weryfikujący ('x' — w zmiennej x: każda część łańcucha ma pochodną równą
// funkcji podcałkowej, a gdy linia zaczyna się od nowej całki — funkcji spod tej całki; 'g' — każda część równa funkcji
// podcałkowej (przekształcenie); 't' — w zmiennej t po podstawieniu; 'p' — linia pomocnicza, wcięta: ramka albo rachunek
// z boku (skrypt jej nie sprawdza — tylko jej 'k'); 'sz' — szablon wzoru; '-' — nic),
// o — co robisz, r — etykieta (np. 'reguły całkowe 1, 2 · wzór całkowy 3'), d — dlaczego, k — na kartce.
// Kolorowe kawałki (\mF, \mG, \mH z lib/katex-opcje.js) przelatują w trybie „krok po kroku” — jak w module 8.
import { dl } from './waskie.js';

export const ETAPY_EL = [
  { nr: 1, nazwa: 'przekształć', co: 'zapisz funkcję podcałkową tak, żeby pasowała do wzorów: pierwiastki i ułamki jako potęgi, iloczyn nawiasów wymnożony, ułamek z sumą w liczniku rozbity na składniki. Potęga przez potęgę — wykładniki odejmujesz; liczba z mianownika zostaje jako ułamek (np. $\\frac13$), który potem wyłączysz przed całkę',
    po: 'Wzory ze slajdu działają tylko na klocki z tabeli: $x^n$, $a^x$, $e^x$, $\\frac1x$. Dopóki pod całką jest pierwiastek, iloczyn nawiasów, potęga przez potęgę albo ułamek z sumą w liczniku, żaden wzór nie pasuje. Gdy nie ma czego przekształcać, zaczynasz od etapu 2.' },
  { nr: 2, nazwa: 'rozbij na składniki', co: 'każdy składnik osobno (reguła 2), liczby przed całkę (reguła 1)',
    po: 'Całka sumy to suma całek — tak jak pochodna sumy. Liczba przed funkcją nie przeszkadza, więc wychodzi przed całkę.' },
  { nr: 3, nazwa: 'wzory', co: 'każdą małą całkę policz wzorem ze slajdu (najczęściej wzór 3: $x^n \\to \\frac{x^{n+1}}{n+1}$). Nowy wykładnik $n + 1$ możesz policzyć od razu albo przy upraszczaniu. W linii, w której znika ostatni znak całki, dopisz $+ C$',
    po: 'To właściwe całkowanie — „pochodna od tyłu”. Całka nieoznaczona to cała rodzina funkcji różniących się o stałą — $C$ to ta stała. Pojawia się raz: tam, gdzie znika ostatni znak całki.' },
  { nr: 4, nazwa: 'uprość', co: 'policz nowe wykładniki (jeśli jeszcze stoją jako $n + 1$), uprość ułamki i potęgi. $C$ już stoi — tylko je przepisujesz',
    po: 'Wynik już jest — teraz tylko porządkujesz zapis. Krótszy zapis łatwiej porównać z odpowiedziami.' },
];
export const ETAPY_PS = [
  { nr: 1, nazwa: 'wybierz t', co: 'za $t$ weź „środek” — wyrażenie wewnątrz innej funkcji (w nawiasie z potęgą, pod pierwiastkiem, w wykładniku, w mianowniku) albo sam $\\ln x$, gdy obok stoi $\\frac1x$. Sprawdź, czy po zamianie zostanie funkcja z tabeli albo suma takich funkcji',
    po: 'Podstawienie zadziała, gdy po zamianie na $t$ zostaje funkcja z tabeli albo suma takich funkcji ($t^n$, $\\frac1t$, $e^t$, $a^t$), a nie iloczyn. Dwie typowe sytuacje: obok środka stoi jego pochodna, w której jest $x$ (może być pomnożona przez liczbę), albo środek jest liniowy ($kx + b$), a reszty funkcji nie ma albo po zapisaniu jej przez $t$ cała funkcja staje się sumą potęg $t$. W $\\int xe^{2x} \\, dx$ po $t = 2x$ zostaje $\\frac14 \\int te^t \\, dt$ — iloczyn, więc podstawienie nie pomoże.' },
  { nr: 2, nazwa: 'policz dt', co: '$dt = (\\text{pochodna } t) \\, dx$; wyznacz z tego to, co stoi w całce obok środka (np. $x \\, dx = \\frac12 dt$). Gdy przy środku liniowym stoi jeszcze licznik z $x$, zapisz go przez $t$',
    po: 'W całce jest $dx$, a po zmianie potrzebne jest $dt$. Ta linijka mówi, jak jedno zamienić na drugie.' },
  { nr: 3, nazwa: 'zamień na t', co: 'wstaw $t$ i $dt$ — w całce nie może zostać żaden $x$. Potem przygotuj całkę po $t$ do wzorów: liczbę wyłącz przed całkę (reguła 1), pierwiastek zapisz jako potęgę, ułamek z sumą w liczniku rozbij na składniki',
    po: 'Gdy zostanie choć jeden $x$, całki po $t$ nie da się policzyć.' },
  { nr: 4, nazwa: 'policz całkę po t', co: 'wzory ze slajdu, tak jak w całkowaniu elementarnym (zmienna nazywa się teraz $t$). W linii, w której znika ostatni znak całki, dopisz $+ C$',
    po: 'Po podstawieniu zostaje funkcja z tabeli albo suma takich funkcji (najczęściej potęgi $t$ albo $\\frac1t$) — to był cel podstawienia.' },
  { nr: 5, nazwa: 'wróć do x', co: 'za $t$ wstaw z powrotem środek, czyli wyrażenie z $x$. $C$ już stoi — tylko je przepisujesz',
    po: 'Zadanie było o $x$, więc wynik też musi być w $x$.' },
];
export const ETAPY_CZ = [
  { nr: 1, nazwa: 'wybierz u i v′', co: 'najpierw sprawdź podstawianie. Gdy obok środka stoi jego pochodna, w której jest $x$ (np. $xe^{x^2}$, $\\frac{\\ln x}{x}$), liczysz przez podstawianie, nie przez części — chyba że polecenie mówi „przez części”, jak w Zad. 3 m). Potem: $\\ln$ razy potęga $x^n$ ($n \\neq -1$) — $\\ln$ do $u$. Wielomian razy $e^{kx}$ ($k \\neq 0$) albo $a^x$ — wielomian do $u$. Sam logarytm (np. $\\ln x$, $\\ln^2 x$) — cały do $u$, a $v\' = 1$. Dwa wielomiany — wymnóż je albo do $u$ weź ten, który szybciej zamieni się w liczbę, jak w Zad. 3 i)',
    po: 'Wzór zamienia całkę z $u \\cdot v\'$ na całkę z $u\' \\cdot v$. Ma być łatwiejsza — dlatego do $u$ idzie to, co po pochodnej się upraszcza, a do $v\'$ to, co umiesz scałkować.' },
  { nr: 2, nazwa: 'policz u′ i v', co: '$u\'$ — pochodna $u$; $v$ — całka z $v\'$ (bez $+ C$)',
    po: 'To cztery kawałki ramki. Liczysz je przed wzorem, żeby potem tylko przepisywać. $C$ pojawi się raz — w linii, w której zniknie ostatni znak całki.' },
  { nr: 3, nazwa: 'wzór', co: 'wstaw do wzoru $\\int u v\' \\, dx = u v - \\int u\' v \\, dx$ i od razu uprość $u\' \\cdot v$ w nowej całce: skróć, a liczbę wyłącz przed całkę',
    po: 'Wzór ze slajdu. Zostaje nowa całka $\\int u\' v \\, dx$.' },
  { nr: 4, nazwa: 'nowa całka', co: 'policz nową całkę. Gdy nie ma jej w tabeli, a nadal jest w niej $\\ln$, wielomian razy $e^{kx}$ lub $a^x$ albo dwa wielomiany, policz ją jeszcze raz przez części. Całkę z $e^{kx}$ policz podstawieniem $t = kx$ (skrót spoza slajdu: $\\frac1k e^{kx}$). Nową całkę liczoną z boku (pomocniczo) piszesz bez $C$ — stała pojawia się raz, w głównym rachunku, gdy znika w nim ostatni znak całki',
    po: 'Jeśli $u$ dobrano dobrze, nowa całka jest prostsza niż wyjściowa. Przy drugim przejściu przez części zapisujesz nową ramkę, a wynik wstawiasz do głównego rachunku.' },
  { nr: 5, nazwa: 'uprość', co: 'zbierz wynik, wyłącz wspólny czynnik. $C$ już stoi — tylko je przepisujesz',
    po: 'Krótszy zapis łatwiej porównać z odpowiedziami. Wyłączenie wspólnego czynnika nie jest obowiązkowe.' },
];

export const LEG_C = [];
export const LEG = {
  potega: [['fiolet', 'wykładnik: rośnie o $1$, a przez nowy wykładnik dzielisz']],
  podst: [['zloto', 'środek, czyli $t$'], ['cyan', 'to, co stoi obok środka, i jego zamiennik z $dt$']],
  srodek: [['zloto', 'środek, czyli $t$']],
  czesci: [['cyan', '$u$ i jego pochodna $u\'$'], ['zloto', '$v\'$ i jego całka $v$']],
};
const R = String.raw;
// ramka podstawienia jak w zeszycie: | t = …  ;  dt = … |
export const ramkaP = (wiersze) => R`\left| \begin{aligned} ${wiersze.map((w) => w.replace(/=/, '&=')).join(' \\\\ ')} \end{aligned} \right|`;
// to samo z wersją na telefon: wiersz „dt = … ⇒ x dx = …” dzielimy na dwa (⇒ na początku drugiego)
export const rP = (wiersze) => ({
  t: ramkaP(wiersze),
  tm: ramkaP(wiersze.flatMap((w) => w.split(/\s*\\ \\Rightarrow \\ \s*/).map((c, i) => (i ? `\\Rightarrow \\ ${c}` : c)))),
});
// ramka części jak w zeszycie z zajęć: | u(x) = …   u′(x) = … ;  v′(x) = …   v(x) = … |
// (u, v′ — wybrane w etapie 1; u′, v — policzone w etapie 2). Na telefonie: cztery wiersze jeden pod drugim.
export const rC = (u, v1, u1, v) => ({
  t: R`\left| \begin{array}{ll} u(x) = ${u} & u'(x) = ${u1} \\[6pt] v'(x) = ${v1} & v(x) = ${v} \end{array} \right|`,
  tm: R`\left| \begin{array}{l} u(x) = ${u} \\[2pt] u'(x) = ${u1} \\[6pt] v'(x) = ${v1} \\[2pt] v(x) = ${v} \end{array} \right|`,
});
export const ramkaC = (u, v1, u1, v) => rC(u, v1, u1, v).t;
// etap 1 w częściach: sam wybór „u(x) = …, v′(x) = …” (linia typu '-'); na telefonie dwa wiersze jeden pod drugim
export const wybC = (u, v1) => ({
  t: R`u(x) = ${u}, \qquad v'(x) = ${v1}`,
  tm: R`\begin{aligned} u(x) &= ${u} \\ v'(x) &= ${v1} \end{aligned}`,
});

// szablony wzorów (linia typu 'sz') — miejsca \sF/\sG/\sH podświetlają się, gdy wlatuje do nich kawałek o tym id
export const SZ = {
  potega: { szEt: 'szablon wzoru', t: R`\int x^{\sH{n}{n}} \, dx = \frac{x^{\sH{n}{n} + 1}}{\sH{n}{n} + 1} + C`, o: 'Zapisz szablon wzoru 3. Za $n$ wstawisz wykładnik z całki.' },
  podst: { t: R`\int f(\sG{t}{g(x)}) \cdot \sF{dt}{g'(x) \, dx} = \int f(\sG{t}{t}) \, \sF{dt}{dt}`, o: 'Wzór ze slajdu: środek zamieniasz na $t$, a $g\'(x) \\, dx$ — na $dt$.' },
  czesci: {
    szEt: 'szablon wzoru',
    t: R`\int \sF{u}{u} \cdot \sG{vp}{v'} \, dx = \sF{u}{u} \cdot \sG{v}{v} - \int \sF{up}{u'} \cdot \sG{v}{v} \, dx`,
    o: 'Zapisz wzór ze slajdu. Każdy z czterech kawałków ramki trafi w swoje miejsce.' },
};

// ---------- łamanie długich łańcuchów ----------
// Kolumna wzoru w rachunku ma na komputerze ok. 530 px (≈ 38 jednostek dl), a na telefonie ok. 280 px (≈ 22).
// Dłuższy łańcuch dzielimy na wiersze (aligned): najpierw przed „=”, a gdy kawałek dalej nie mieści się —
// przed „+”/„−” na najwyższym poziomie (poza {…}, (…) i \left…\right). Wspólne waskie() z lib/waskie.js
// pomija linie z przecinkiem — a w całkach przecinek jest w każdym „\, dx”.
export const SZER_KOMP = 38, SZER_TEL = 22;
function ciecia(s) {
  const out = []; let g = 0, lr = 0, par = 0;
  for (let i = 0; i < s.length; i++) {
    const r = s.slice(i);
    if (r.startsWith('\\left')) { lr++; i += 5; continue; }
    if (r.startsWith('\\right')) { lr--; i += 6; continue; }
    if (s[i] === '\\') { const m = r.match(/^\\[a-zA-Z]+|^\\./); i += m[0].length - 1; continue; }
    if (s[i] === '{') g++; else if (s[i] === '}') g--;
    else if (s[i] === '(') par++; else if (s[i] === ')') par--;
    if (g || lr || par) continue;
    if (s[i] === '=') out.push({ i, z: '=' });
    else if ((s[i] === '+' || s[i] === '-') && /[^=(+\-{\s&]\s*$/.test(s.slice(0, i))) out.push({ i, z: s[i] });
  }
  return out;
}
function kawalki(s, znaki) {
  const cut = ciecia(s).filter((c) => znaki.includes(c.z));
  const out = []; let a = 0;
  for (const c of cut) { out.push(s.slice(a, c.i).trim()); a = c.i; }
  out.push(s.slice(a).trim());
  return out.filter((k, i) => k || i === 0);
}
export function lam(t, max) {
  if (!t || /\\begin\{(aligned|array|cases)\}/.test(t) || dl(t) <= max) return t;
  const wiersze = [];
  for (const k of kawalki(t, ['='])) {
    if (dl(k) <= max || !k) { wiersze.push(k); continue; }
    // za długi kawałek: przed + / − (pierwszy wiersz zaczyna się od „=” albo od początku)
    let bie = '';
    for (const c of kawalki(k, ['+', '-'])) {
      if (bie && dl(bie + c) > max) { wiersze.push(bie); bie = `\\quad ${c}`; } else bie = bie ? `${bie} ${c}` : c;
    }
    wiersze.push(bie);
  }
  // łączymy krótkie wiersze z powrotem, póki się mieszczą
  const zl = [];
  for (const w of wiersze) {
    if (zl.length && !w.startsWith('\\quad') && dl(`${zl[zl.length - 1]} ${w}`) <= max) zl[zl.length - 1] += ` ${w}`;
    else zl.push(w);
  }
  if (zl.length < 2) return t;
  return `\\begin{aligned} ${zl.map((w) => `&${w}`).join(' \\\\ ')} \\end{aligned}`;
}
const lamLinie = (linie) => linie.map((L) => {
  if (!L.t || L.mx || L.h) return L;
  const t = L.typ === 'p' ? L.t : lam(L.t, SZER_KOMP);
  const tm = L.tm ?? (L.typ === 'p' ? undefined : lam(L.t, SZER_TEL));
  return { ...L, t, tm: tm === t ? undefined : tm };
});

// D: { f, linie, wynik }
export function calka(D) {
  return { id: D.id, f: D.f, linie: lamLinie(D.linie), leg: D.leg ?? LEG_C, wynik: D.wynik };
}

// ---------- ćwiczenie „wpisz sam”: wzór 3 od tyłu, a·xⁿ → a/(n+1) · x^(n+1) ----------
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const ul = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const ulTex = ([n, d]) => (n < 0 ? '-' : '') + (d === 1 ? `${Math.abs(n)}` : `\\tfrac{${Math.abs(n)}}{${d}}`);
const nawias = (a) => (a[0] < 0 ? `\\left(${ulTex(a)}\\right)` : ulTex(a));
const plus1 = (a) => ul(a[0] + a[1], a[1]);
const przez = (a, b) => ul(a[0] * b[1], a[1] * b[0]);
const rachWykl = (n) => {
  const w = plus1(n);
  if (n[1] === 1) return `${ulTex(n)} + 1 = ${ulTex(w)}`;
  return `${ulTex(n)} + 1 = ${ulTex(n)} + \\tfrac{${n[1]}}{${n[1]}} = ${ulTex(w)}`;
};
export function cwCalkiPotegi(wiersze) {
  return wiersze.map(({ f, a, n }) => {
    const A = ul(...a), N = ul(...n);
    if (N[0] === -N[1]) throw new Error(`cwCalkiPotegi: n = −1 (${f}) — tu działa wzór 6, nie 3`);
    const wyk = plus1(N), wsp = przez(A, wyk);
    const jeden = A[0] === A[1] && A[1] === 1;
    return {
      f, wsp, wyk,
      dlaWyk: `Nowy wykładnik = stary plus 1: $${rachWykl(N)}$.`,
      dlaWsp: (jeden
        ? `Przed $x$ nie ma liczby — stoi tam niewidoczna $1$. Liczba przed $x$ = $1$ przez nowy wykładnik: $1 : ${nawias(wyk)} = ${ulTex(wsp)}$.`
        : `Liczba przed $x$ = stara liczba przez nowy wykładnik: $${ulTex(A)} : ${nawias(wyk)} = ${ulTex(wsp)}$.`)
        + (wyk[1] !== 1 ? ' Dzielenie przez ułamek to mnożenie przez jego odwrotność.' : ''),
    };
  });
}
