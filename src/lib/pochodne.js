// Moduł „Pochodna funkcji jednej zmiennej”: rachunki krok po kroku, dane do rysunków i ćwiczeń.
// Każdy rachunek to lista linii (komponent pochodne/Rachunek):
//   t  — wzór (LaTeX, display); kolorowe kawałki makrami \mF{id}{…} \mG{id}{…} \mH{id}{…} (lib/katex-opcje.js):
//        kawałek z tym samym id w linii wyżej „przelatuje” na nowe miejsce w animacji krok po kroku,
//   typ — co sprawdza skrypt weryfikujący: 'f' = linia równa f(x), 'd' = równa f'(x),
//         'p' = pomocniczo: (kawałek)' = jego pochodna, 'x' = bez sprawdzania,
//   o  — co robisz (jedno zdanie), r — etykieta reguły/wzoru, d — dlaczego, k — rachunki „na kartce”,
//   z  — źródła lotów { idDocelowy: idŹródłowy }, gdy kawałek zmienia nazwę.
// Wszystkie linie i rachunki na kartce są przeliczane niezależnie (sympy) przed publikacją.
const R = String.raw;

// numery jak na slajdach z zajęć
export const REGULY = [
  { nr: 1, nazwa: 'Wyłączenie stałej przed pochodną', t: R`(c \cdot f(x))' = c \cdot f'(x)`, po: 'liczba czeka z przodu, a pochodną liczysz z samej funkcji' },
  { nr: 2, nazwa: 'Pochodna sumy i różnicy', t: R`(f(x) \pm g(x))' = f'(x) \pm g'(x)`, po: 'każdy składnik osobno, znak między nimi zostaje' },
  { nr: 3, nazwa: 'Pochodna iloczynu', t: R`(f(x) \cdot g(x))' = f'(x)g(x) + f(x)g'(x)`, po: 'pochodna pierwszego razy drugi, plus pierwszy razy pochodna drugiego' },
  { nr: 4, nazwa: 'Pochodna ilorazu', t: R`\left(\frac{f(x)}{g(x)}\right)' = \frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}`, po: 'pochodna licznika razy mianownik, minus licznik razy pochodna mianownika — przez mianownik do kwadratu' },
  { nr: 5, nazwa: 'Pochodna funkcji złożonej', t: R`[f(g(x))]' = f'(g(x)) \cdot g'(x)`, po: 'pochodna zewnętrznej (środek bez zmian) razy pochodna środka' },
];
// tabela wzorów ze slajdu (numeracja jak na zajęciach)
export const WZORY = [
  { nr: 1, t: R`(c)' = 0`, po: 'stała się nie zmienia' },
  { nr: 2, t: R`(x)' = 1`, po: 'prosta $y = x$: krok w prawo, jeden w górę' },
  { nr: 3, t: R`(x^n)' = nx^{n-1}`, po: 'wykładnik schodzi przed $x$, w wykładniku zostaje o $1$ mniej' },
  { nr: 4, t: R`(a^x)' = a^x \ln a`, po: '$a^x$ zostaje, dopisujesz razy $\\ln$ podstawy' },
  { nr: 5, t: R`(e^x)' = e^x`, po: '$e^x$ się nie zmienia' },
  { nr: 6, t: R`(\log_a x)' = \frac{1}{x \ln a}`, po: 'jedynka przez: $x$ razy $\\ln$ podstawy' },
  { nr: 7, t: R`(\ln x)' = \frac{1}{x}`, po: 'jedynka przez $x$' },
  { nr: 8, t: R`(\sin x)' = \cos x` },
  { nr: 9, t: R`(\cos x)' = -\sin x` },
  { nr: 10, t: R`(\operatorname{tg} x)' = \frac{1}{\cos^2 x}` },
  { nr: 11, t: R`(\operatorname{ctg} x)' = -\frac{1}{\sin^2 x}` },
];
// moduł 12 — całki: reguły i wzory ze slajdów (numeracja jak na zajęciach); etykiety „reguła całkowa 1”, „wzory całkowe 3, 5”
export const REGULY_C = [
  { nr: 1, nazwa: 'Wyłączenie stałej przed symbol całki', t: R`\int c \, f(x) \, dx = c \int f(x) \, dx`, po: 'liczba wychodzi przed całkę i czeka na wynik' },
  { nr: 2, nazwa: 'Całka sumy i różnicy', t: R`\int (f(x) \pm g(x)) \, dx = \int f(x) \, dx \pm \int g(x) \, dx`, po: 'każdy składnik całkujesz osobno, znak między nimi zostaje' },
  { nr: 3, nazwa: 'Całka funkcji postaci f′/f', t: R`\int \frac{f'(x)}{f(x)} \, dx = \ln|f(x)| + C`, po: 'gdy w liczniku stoi pochodna mianownika — wynik to logarytm mianownika' },
];
export const WZORY_C = [
  { nr: 1, t: R`\int 0 \, dx = C`, po: 'pochodna stałej to zero, więc całka z zera to stała' },
  { nr: 2, t: R`\int dx = x + C`, po: 'samo $\\int dx$ to całka z jedynki' },
  { nr: 3, t: R`\int x^n \, dx = \frac{x^{n+1}}{n + 1} + C, \quad n \neq -1`, po: 'wykładnik rośnie o $1$ i przez nowy wykładnik dzielisz' },
  { nr: 4, t: R`\int a^x \, dx = \frac{a^x}{\ln a} + C, \quad a > 0, \ a \neq 1`, po: '$a^x$ zostaje, dzielisz przez $\\ln$ podstawy' },
  { nr: 5, t: R`\int e^x \, dx = e^x + C`, po: '$e^x$ się nie zmienia' },
  { nr: 6, t: R`\int \frac{dx}{x} = \ln|x| + C, \quad x \neq 0`, po: 'jedyny wyjątek od wzoru 3: dla $n = -1$ wychodzi logarytm' },
  { nr: 7, t: R`\int \sin x \, dx = -\cos x + C` },
  { nr: 8, t: R`\int \cos x \, dx = \sin x + C` },
  { nr: 9, t: R`\int \frac{dx}{\cos^2 x} = \operatorname{tg} x + C` },
  { nr: 10, t: R`\int \frac{dx}{\sin^2 x} = -\operatorname{ctg} x + C` },
];
// zasady liceum, na które powołują się etykiety „potęgi”, „logarytmy”, „umowa”
const TOZSAMOSCI = {
  potegi: [
    { tytul: 'Pierwiastek jako potęga', t: R`\sqrt{x} = x^{\frac12}, \quad \sqrt[n]{x^m} = x^{\frac{m}{n}}` },
    { tytul: 'Jedynka przez potęgę', t: R`\frac{1}{x^n} = x^{-n}` },
    { tytul: 'Mnożenie i dzielenie potęg', t: R`x^a \cdot x^b = x^{a+b}, \quad \frac{x^a}{x^b} = x^{a-b}` },
    { tytul: 'Potęga ułamka', t: R`\left(\frac{a}{b}\right)^{k} = \frac{a^k}{b^k}, \quad \left(\frac{a}{b}\right)^{-k} = \left(\frac{b}{a}\right)^{k}` },
  ],
  logarytmy: [
    { tytul: 'Wykładnik przed logarytm', t: R`\ln(a^k) = k\ln a` },
    { tytul: 'e i ln się znoszą', t: R`e^{\ln a} = a, \quad \ln(e^a) = a` },
    { tytul: 'Suma w wykładniku', t: R`e^{a+b} = e^a \cdot e^b` },
  ],
  umowa: [{ tytul: 'Zapis ln²', t: R`\ln^2 x = (\ln x)^2`, po: 'kwadrat całego logarytmu' }],
  // moduł 9 (badanie zmienności funkcji): warunki ze slajdów i narzędzia z liceum
  konieczny: [{ tytul: 'Warunek konieczny ekstremum', t: R`f'(x_0) = 0`, po: 'Jeżeli $f$ ma w $x_0$ ekstremum i $f\'(x_0)$ istnieje, to $f\'(x_0) = 0$. Takie punkty to punkty stacjonarne.' }],
  dostateczny: [{ tytul: 'Warunek dostateczny ekstremum', t: R`+ \to - \ \text{maksimum}, \qquad - \to + \ \text{minimum}`, po: 'Pochodna zmienia znak przy przejściu przez $x_0$. Bez zmiany znaku nie ma ekstremum.' }],
  konieczny2: [{ tytul: 'Warunek konieczny przegięcia', t: R`f''(x_0) = 0`, po: 'Jeżeli $f$ ma w $x_0$ punkt przegięcia i $f\'\'(x_0)$ istnieje, to $f\'\'(x_0) = 0$.' }],
  dostateczny2: [{ tytul: 'Warunek dostateczny przegięcia', t: R`f'' \ \text{zmienia znak w} \ x_0`, po: 'Druga pochodna zmienia znak przy przejściu przez $x_0$: wykres zmienia kształt z wklęsłego na wypukły albo odwrotnie.' }],
  skrocone: [{ tytul: 'Wzory skróconego mnożenia', t: R`\begin{aligned} &a^2 - b^2 = (a - b)(a + b) \\ &(a + b)^2 = a^2 + 2ab + b^2 \\ &(a - b)^2 = a^2 - 2ab + b^2 \end{aligned}` }],
  szescian: [{ tytul: 'Wzory skróconego mnożenia — sześcian', t: R`\begin{aligned} &(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3 \\ &(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3 \end{aligned}` }],
  delta: [{ tytul: 'Trójmian kwadratowy', t: R`\Delta = b^2 - 4ac, \quad x_{1,2} = \frac{-b \mp \sqrt{\Delta}}{2a}`, po: 'Gdy $\\Delta > 0$: $ax^2 + bx + c = a(x - x_1)(x - x_2)$.' }],
  // moduł 10 — funkcje dwóch zmiennych
  czastkowa: [{ tytul: 'Pochodna cząstkowa', t: R`\frac{\partial f}{\partial x}: \ y \ \text{jak liczba}, \qquad \frac{\partial f}{\partial y}: \ x \ \text{jak liczba}`, po: 'Liczysz zwykłą pochodną po jednej zmiennej, a drugą traktujesz jak stałą — tymi samymi wzorami i regułami co w module 8.' }],
  schwarz: [{ tytul: 'Twierdzenie Schwarza', t: R`\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}`, po: 'Gdy drugie pochodne mieszane istnieją i są ciągłe (w zadaniach z listy zawsze), są sobie równe. Liczysz jedną, a drugą — dla sprawdzenia.' }],
  wyznacznik: [{ tytul: 'Wyznacznik macierzy 2 × 2', t: R`\det = a_{11} \cdot a_{22} - a_{12} \cdot a_{21}`, po: 'Iloczyn liczb na przekątnej (lewy górny róg razy prawy dolny) minus iloczyn liczb na drugiej przekątnej (prawy górny razy lewy dolny).' }],
  konieczny2d: [{ tytul: 'Warunek konieczny ekstremum (dwie zmienne)', t: R`\nabla f(x, y) = 0 \iff \frac{\partial f}{\partial x} = 0 \ \text{i} \ \frac{\partial f}{\partial y} = 0`, po: 'Obie pierwsze pochodne cząstkowe równe zeru — układ dwóch równań. Jego rozwiązania to punkty stacjonarne $P_0 = (x_0, y_0)$.' }],
  dostateczny2d: [{ tytul: 'Warunek dostateczny ekstremum (dwie zmienne)', t: R`W(P_0) = \det H_f(x_0, y_0)`, po: '$W > 0$ — ekstremum: maksimum, gdy $a_{11} < 0$, minimum, gdy $a_{11} > 0$. $W < 0$ — brak ekstremum. $W = 0$ — tą metodą nic nie wiadomo.' }],
  uklad: [{ tytul: 'Układ dwóch równań — podstawianie', t: R`\text{z jednego równania wyznacz zmienną} \to \text{wstaw do drugiego}`, po: 'Wybierz równanie, z którego najłatwiej wyznaczyć $x$ albo $y$. Po wstawieniu zostaje równanie z jedną niewiadomą. Gdy wyjdzie iloczyn równy zeru, rozpatrz każdy czynnik osobno.' }],
  dziedzina: [{ tytul: 'Dziedzina — czego nie wolno', t: R`\frac{\cdot}{0}, \quad \ln(\le 0), \quad \sqrt{< 0}`, po: 'Mianownik różny od zera, pod logarytmem liczba dodatnia, pod pierwiastkiem kwadratowym liczba nieujemna.' }],
  // moduł 12 — metody całkowania (wzory ze slajdów)
  podstawianie: [{ tytul: 'Całkowanie przez podstawianie (slajd)', t: R`\int f(g(x)) \, g'(x) \, dx = \int f(t) \, dt, \quad t = g(x), \ dt = g'(x) \, dx`, po: 'Środek $g(x)$ zamieniasz na $t$, a $g\'(x) \\, dx$ — na $dt$. W całce po zamianie nie może zostać żaden $x$.' }],
  czesci: [{ tytul: 'Całkowanie przez części (slajd)', t: R`\int u(x) \, v'(x) \, dx = u(x) \, v(x) - \int u'(x) \, v(x) \, dx`, po: '$u$ — to, co upraszcza się po pochodnej (np. $\\ln x$, wielomian). $v\'$ — to, co umiesz scałkować.' }],
  // moduł 11 — ekstrema warunkowe (Lagrange)
  phi: [{ tytul: 'Warunek w postaci φ(x, y) = 0', t: R`x + y = 1 \iff x + y - 1 = 0 \ \Rightarrow \ \phi(x, y) = x + y - 1`, po: 'Przenieś wszystko na lewą stronę (liczba zmienia znak). Lewa strona to $\\phi(x, y)$.' }],
  lagrange: [{ tytul: 'Funkcja Lagrange’a (slajd)', t: R`L(x, y) = f(x, y) + \lambda \cdot \phi(x, y)`, po: '$\\lambda$ — mnożnik Lagrange’a, nieznana liczba. $\\phi$ zawsze w nawiasie.' }],
  koniecznyL: [{ tytul: 'Warunek konieczny ekstremum warunkowego', t: R`\begin{cases} \frac{\partial L}{\partial x} = 0 \\ \frac{\partial L}{\partial y} = 0 \\ \phi(x, y) = 0 \end{cases}`, po: 'Układ trzech równań z trzema niewiadomymi: $x$, $y$, $\\lambda$. Rozwiązania to punkty stacjonarne, każdy ze swoją $\\lambda$.' }],
  uklad3: [{ tytul: 'Układ trzech równań — typowa droga', t: R`x, \ y \ \text{przez} \ \lambda \ \to \ \text{wstaw do} \ \phi = 0`, po: 'Z pierwszych dwóch równań wyznacz $x$ i $y$ (wyjdą z $\\lambda$), wstaw do warunku. Zostaje równanie z samą $\\lambda$.' }],
  iloczyn0: [{ tytul: 'Iloczyn równy zeru', t: R`a \cdot b = 0 \iff a = 0 \ \text{lub} \ b = 0`, po: 'Każdy czynnik przyrównujesz do zera osobno — każdy daje osobny przypadek. Nie dziel przez zmienną: zgubisz rozwiązanie.' }],
  macierzL: [{ tytul: 'Macierz ze slajdu (krok 5)', t: R`\overline{H} = \begin{bmatrix} 0 & \phi_x & \phi_y \\ \phi_x & L_{xx} & L_{xy} \\ \phi_y & L_{xy} & L_{yy} \end{bmatrix}`, po: 'W rogu $0$, na brzegu pochodne warunku $\\phi$, w środku drugie pochodne $L$. Skrót $\\phi_x$ to $\\frac{\\partial \\phi}{\\partial x}$, $L_{xy}$ to $\\frac{\\partial^2 L}{\\partial x \\partial y}$.' }],
  sarrus: [{ tytul: 'Reguła Sarrusa (moduł 4)', t: R`\begin{aligned} \det = {} & a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} \\ & - a_{13}a_{22}a_{31} - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33} \end{aligned}`, po: 'Dopisz z prawej dwie pierwsze kolumny. Trzy przekątne w dół dodajesz, trzy w górę odejmujesz.' }],
  dostatecznyL: [{ tytul: 'Warunek dostateczny ekstremum warunkowego (slajd)', t: R`W(P_0) = \det \overline{H}(P_0)`, po: '$W > 0$ — maksimum warunkowe. $W < 0$ — minimum warunkowe. Odwrotnie niż $a_{11}$ w ekstremach bezwarunkowych.' }],
};
// treść chmurki dla etykiety reguły w rachunku, np. 'reguła 5 · wzory 3, 7' → reguła 5, wzór 3, wzór 7
export function podpowiedz(r) {
  const out = [];
  const liczby = (s) => s.split(/,|\si\s/).map((v) => parseInt(v, 10)).filter((n) => !Number.isNaN(n));
  // kolejność jak w etykiecie: „wzór 3 · reguły 1, 2” → wzór 3, reguła 1, reguła 2
  for (const m of r.matchAll(/(regu(?:ła|ły)|wz(?:ór|ory))\s+([\d,\si]+)/g)) {
    for (const n of liczby(m[2])) {
      if (m[1].startsWith('regu')) { const g = REGULY[n - 1]; out.push({ tytul: `Reguła ${n} · ${g.nazwa.toLowerCase()}`, t: g.t, po: g.po }); }
      else { const w = WZORY[n - 1]; out.push({ tytul: `Wzór ${n}`, t: w.t, po: w.po }); }
    }
  }
  for (const m of r.matchAll(/(regu(?:ła|ły)|wz(?:ór|ory)) całkow\S*\s+([\d,\si]+)/g)) {
    for (const n of liczby(m[2])) {
      if (m[1].startsWith('regu')) { const g = REGULY_C[n - 1]; out.push({ tytul: `Reguła całkowa ${n} · ${g.nazwa.toLowerCase()}`, t: g.t, po: g.po }); }
      else { const w = WZORY_C[n - 1]; out.push({ tytul: `Wzór całkowy ${n}`, t: w.t, po: w.po }); }
    }
  }
  if (/potęg/.test(r)) out.push(...TOZSAMOSCI.potegi);
  if (/logarytm/.test(r)) out.push(...TOZSAMOSCI.logarytmy);
  if (/umowa/.test(r)) out.push(...TOZSAMOSCI.umowa);
  if (/warunek konieczny Lagrange/.test(r)) out.push(...TOZSAMOSCI.koniecznyL);
  else if (/warunek konieczny przegięcia/.test(r)) out.push(...TOZSAMOSCI.konieczny2);
  else if (/warunek konieczny ∇/.test(r)) out.push(...TOZSAMOSCI.konieczny2d);
  else if (/warunek konieczny/.test(r)) out.push(...TOZSAMOSCI.konieczny);
  if (/warunek dostateczny Lagrange/.test(r)) out.push(...TOZSAMOSCI.dostatecznyL);
  else if (/warunek dostateczny przegięcia/.test(r)) out.push(...TOZSAMOSCI.dostateczny2);
  else if (/warunek dostateczny W/.test(r)) out.push(...TOZSAMOSCI.dostateczny2d);
  else if (/warunek dostateczny/.test(r)) out.push(...TOZSAMOSCI.dostateczny);
  if (/cząstkow/.test(r)) out.push(...TOZSAMOSCI.czastkowa);
  if (/Schwarz/.test(r)) out.push(...TOZSAMOSCI.schwarz);
  if (/wyznacznik/.test(r)) out.push(...TOZSAMOSCI.wyznacznik);
  if (/układ trzech/.test(r)) out.push(...TOZSAMOSCI.uklad3);
  else if (/układ/.test(r)) out.push(...TOZSAMOSCI.uklad);
  if (/warunek φ/.test(r)) out.push(...TOZSAMOSCI.phi);
  if (/funkcja Lagrange/.test(r)) out.push(...TOZSAMOSCI.lagrange);
  if (/iloczyn równy zeru/.test(r)) out.push(...TOZSAMOSCI.iloczyn0);
  if (/macierz ze slajdu/.test(r)) out.push(...TOZSAMOSCI.macierzL);
  if (/Sarrus/.test(r)) out.push(...TOZSAMOSCI.sarrus);
  if (/sześcian/.test(r)) out.push(...TOZSAMOSCI.szescian);
  else if (/skrócone/.test(r)) out.push(...TOZSAMOSCI.skrocone);
  if (/delta/.test(r)) out.push(...TOZSAMOSCI.delta);
  if (/dziedzina/.test(r)) out.push(...TOZSAMOSCI.dziedzina);
  if (/podstawianie/.test(r)) out.push(...TOZSAMOSCI.podstawianie);
  if (/przez części/.test(r)) out.push(...TOZSAMOSCI.czesci);
  return out;
}

// przepis na każdą pochodną — numer etapu stoi przy liniach rachunku (pole e)
export const ETAPY = [
  { nr: 1, nazwa: 'przygotuj', co: 'pierwiastki i ułamki zapisz jako potęgi, stałe postaw przed wyrażeniem, rozpisz logarytm albo nietypowy zapis (np. $\\ln^2$, $x^x$)',
    po: 'Na samym początku, bo wzory z tabeli pasują tylko do „czystych” klocków: $x^n$, $e^x$, $\\ln x$… Po przygotowaniu często wystarcza prostsza reguła: $\\frac{2}{x^5} = 2x^{-5}$ to już nie dzielenie, tylko liczba razy potęga. Gdy nie ma czego przygotowywać, zaczynasz od etapu 2.' },
  { nr: 2, nazwa: 'rozpoznaj', co: 'testem ostatniego działania wybierz regułę, nazwij kawałki i zapisz szablon reguły słowami',
    po: 'Regułę wybierasz po kształcie funkcji, a prawdziwy kształt widać dopiero po przygotowaniu. Szablon mówi, jakich kawałków będzie potrzeba.' },
  { nr: 3, nazwa: 'policz kawałki', co: 'pochodne kawałków policz z boku, „pomocniczo”',
    po: 'Przed wstawianiem, żeby potem tylko przenosić gotowe wyniki, a nie liczyć dwóch rzeczy naraz. Policzony kawałek od razu upraszczasz — do szablonu trafia wtedy krótszy wzór.' },
  { nr: 4, nazwa: 'wstaw', co: 'każdy kawałek wpisz w jego miejsce w szablonie',
    po: 'Najpierw cały wzór, bez upraszczania. Wtedy łatwo sprawdzić, czy każdy kawałek trafił na swoje miejsce. Gdy szablon nie potrzebuje pochodnych liczonych z boku (np. sam wzór 3), etap 3 odpada i wstawiasz liczby, które widać w funkcji.' },
  { nr: 5, nazwa: 'uprość', co: 'policz liczby, skróć, wyłącz wspólny czynnik',
    po: 'Na końcu, gdy wszystko stoi już na swoim miejscu. Upraszczanie w trakcie wstawiania miesza się z regułą i łatwo wtedy zgubić kawałek. Wyłączenie wspólnego czynnika nie jest obowiązkowe — wynik bez niego też jest dobry. Robimy to, bo wynik wychodzi krótszy, a w module 9 z takiej postaci łatwiej odczytać znak pochodnej.' },
];

export const LEG = {
  potega: [['fiolet', R`wykładnik: schodzi przed $x$, a w wykładniku zostaje o $1$ mniej`]],
  iloczyn: [['cyan', R`pierwszy czynnik i jego pochodna`], ['zloto', R`drugi czynnik i jego pochodna`]],
  iloraz: [['cyan', R`licznik i jego pochodna`], ['zloto', R`mianownik i jego pochodna`]],
  zlozona: [['zloto', R`środek i jego pochodna`], ['fiolet', R`wykładnik funkcji zewnętrznej`]],
  wykladnicza: [['zloto', R`wykładnik (środek) i jego pochodna`]],
};

// szablony reguł zapisane słowami (linia typu 'sz'); \sF{id}/\sG{id}/\sH{id} — miejsca w szablonie,
// które podświetlają się, gdy kawałek o tym samym id wlatuje do wzoru w linii „wstaw” (wst: true).
// t — wersja szeroka, tm — wąska (telefon). OPISY: podpis kawałka w czasie lotu; kolejność kluczy = kolejność lotów.
export const SZ = {
  iloczyn: {
    t: R`f'(x) = \sF{fp}{(\text{pierwszy})'} \cdot \sG{g}{\text{drugi}} + \sF{f}{\text{pierwszy}} \cdot \sG{gp}{(\text{drugi})'}`,
    tm: R`\begin{aligned} f'(x) = &\ \sF{fp}{(\text{pierwszy})'} \cdot \sG{g}{\text{drugi}} \\ &+ \sF{f}{\text{pierwszy}} \cdot \sG{gp}{(\text{drugi})'} \end{aligned}`,
  },
  iloraz: {
    t: R`f'(x) = \dfrac{\sF{fp}{(\text{licznik})'} \cdot \sG{g}{\text{mianownik}} - \sF{f}{\text{licznik}} \cdot \sG{gp}{(\text{mianownik})'}}{(\sG{g2}{\text{mianownik}})^2}`,
    tm: R`f'(x) = \dfrac{\begin{gathered} \sF{fp}{(\text{licznik})'} \cdot \sG{g}{\text{mianownik}} \\ - \sF{f}{\text{licznik}} \cdot \sG{gp}{(\text{mianownik})'} \end{gathered}}{(\sG{g2}{\text{mianownik}})^2}`,
  },
  // zewnętrzna potęga ze środkiem: n · (środek)^(n − 1) · (środek)′ — n wpisane liczbą (nw: ta sama liczba w wykładniku),
  // przod: to, co stoi przed całością (np. stała albo minus)
  potega: (n, nw = n, przod = '') => ({
    t: R`f'(x) = ${przod}\sH{n}{${n}} \cdot (\sG{g}{\text{środek}})^{\sH{n}{${nw}} - 1} \cdot \sG{gp}{(\text{środek})'}`,
    tm: R`\begin{aligned} f'(x) = &\ ${przod}\sH{n}{${n}} \cdot (\sG{g}{\text{środek}})^{\sH{n}{${nw}} - 1} \\ &\cdot \sG{gp}{(\text{środek})'} \end{aligned}`,
  }),
  // wzór 3 słowami-literami: sama potęga albo liczba (stała c) razy potęga
  potegaW: { t: R`(x^{\sH{n}{n}})' = \sH{n}{n} \cdot x^{\sH{n}{n} - 1}` },
  potegaS: { t: R`(\sF{s}{c} \cdot x^{\sH{n}{n}})' = \sF{s}{c} \cdot \sH{n}{n} \cdot x^{\sH{n}{n} - 1}` },
  eksp: { t: R`f'(x) = e^{\sG{g}{\text{wykładnik}}} \cdot \sG{gp}{(\text{wykładnik})'}` },
  // ten sam szablon dla jednego składnika sumy (np. r): po lewej pochodna składnika, nie całej funkcji
  ekspS: {
    t: R`(e^{\cG{\text{wykładnik}}})' = e^{\sG{g}{\text{wykładnik}}} \cdot \sG{gp}{(\text{wykładnik})'}`,
    tm: R`\begin{aligned} &(e^{\cG{\text{wykładnik}}})' \\ &= e^{\sG{g}{\text{wykładnik}}} \cdot \sG{gp}{(\text{wykładnik})'} \end{aligned}`,
  },
};
export const OPISY = {
  iloczyn: { fp: 'pochodna pierwszego', g: 'drugi bez zmian', f: 'pierwszy bez zmian', gp: 'pochodna drugiego' },
  iloraz: { fp: 'pochodna licznika', g: 'mianownik bez zmian', f: 'licznik bez zmian', gp: 'pochodna mianownika', g2: 'mianownik na dół, do kwadratu' },
  potega: { n: 'wykładnik', g: 'środek bez zmian', gp: 'pochodna środka' },
  eksp: { g: 'wykładnik bez zmian', gp: 'pochodna wykładnika' },
};

// rachunki z listy zadań („Zadanie 1. Oblicz pochodną funkcji”, przykłady a–y) i jeden spoza listy (Zad. 1 e ze str. 171).
// Kawałki nazywamy słowami (pierwszy/drugi, licznik/mianownik, środek) i kolorem — litera f oznacza w zadaniu całą funkcję.
// Każda linia ma etap przepisu (e: 1 przygotuj, 2 rozpoznaj, 3 policz kawałki, 4 wstaw, 5 uprość; linia bez e dziedziczy etap).
const BEZ_PRZYG = 'Zaczynamy od rozpoznania, bo nie ma czego przygotowywać: nie ma pierwiastków ani ułamków z $x$ pod kreską.';
const BEZ_PRZYG_POT = 'Zaczynamy od rozpoznania, bo zapis jest już potęgą — nie ma czego przygotowywać.';
const PRZYG_POT = 'Na samym początku, bo do potęgi jest gotowy wzór 3, a do pierwiastka w tabeli wzoru nie ma.';
const SZ_O = (nr) => `Zapisz szablon reguły ${nr} słowami. Pokazuje, jakich kawałków potrzebujesz i gdzie trafi każdy z nich.`;
// pochodna kawałka, który sam jest ilorazem / iloczynem / potęgą: najpierw reguła z kawałkami w miejscach słów
const KRESKA = 'kreska $\'$ przy nawiasie to pochodna, którą zaraz policzysz';
const WST_ILOCZYN = 'Wstaw kawałki w szablon. Każdy kolor trafia w swoje miejsce: turkusowe tam, gdzie „pierwszy”, złote tam, gdzie „drugi”.';
const WST_ILORAZ = 'Wstaw kawałki w szablon — po kolei, każdy w swoje miejsce. Kolejność w liczniku ma znaczenie: zaczynasz od pochodnej licznika.';
const WST_POTEGA = 'Wstaw kawałki w szablon: wykładnik trafia przed nawias i do nowego wykładnika (ten „minus $1$”), środek przepisujesz bez zmian, a na końcu dopisujesz policzoną pochodną środka.';
const WST_EKSP = 'Wstaw kawałki w szablon: wykładnik przepisujesz bez zmian, a na końcu mnożysz przez policzoną pochodną wykładnika.';
const BEZ_ETAPU_3 = 'Etap 3 odpada: szablon wzoru 3 nie potrzebuje pochodnych liczonych z boku — liczby i wykładniki widać od razu w funkcji.';
const WYLACZ = 'Na samym końcu. To nieobowiązkowe — wynik z poprzedniej linii też jest dobry. Wyłączamy, bo wynik wychodzi krótszy, a w module 9 z takiej postaci łatwiej odczytać znak pochodnej.';
export const LISTA = {
  a: {
    f: R`f(x) = \frac{2}{x^5} - \frac{1}{\sqrt{x}}`, leg: [['cyan', R`liczba przed $x$`], ...LEG.potega],
    wynik: R`-10x^{-6} + \tfrac12 x^{-\frac32} = -\frac{10}{x^6} + \frac{1}{2x\sqrt{x}}`,
    linie: [
      { e: 1, t: R`f(x) = \frac{2}{x^5} - \frac{1}{\sqrt{x}} = 2 \cdot \frac{1}{x^5} - \frac{1}{x^{\frac12}}`, typ: 'f', r: 'potęgi',
        o: R`Wyciągnij stałą $2$ przed ułamek, a pierwiastek zapisz jako potęgę $\tfrac12$.`,
        kiedy: R`Na samym początku, bo wzór 3 działa tylko na postać „liczba razy $x$ do potęgi”. Gdyby zacząć liczyć od razu, $\frac{2}{x^5}$ wyglądałoby jak dzielenie i trzeba by użyć reguły ilorazu — dłużej i łatwiej o błąd.`,
        d: R`$\frac{2}{x^5} = 2 \cdot \frac{1}{x^5}$ — dwójka to stała, zostanie z przodu (reguła 1). $\sqrt{x} = x^{\frac12}$, bo pierwiastek kwadratowy to potęga $\tfrac12$.` },
      { e: 1, t: R`= 2x^{-5} - x^{-\frac12}`, typ: 'f', r: 'potęgi',
        o: 'Zapisz „jedynkę przez potęgę” jako potęgę z minusem.',
        kiedy: 'To jeszcze przygotowanie. Dopiero teraz oba składniki mają postać „liczba razy $x^n$” — taką, do której pasuje wzór 3.',
        d: R`$\frac{1}{x^n} = x^{-n}$: potęga przechodzi z mianownika do licznika, a wykładnik zmienia znak.` },
      { e: 2, t: R`f(x) = \mF{s1}{2}x^{\mH{n1}{-5}} - x^{\mH{n2}{-\frac12}}`, typ: 'f', r: 'reguły 1, 2 · wzór 3',
        o: R`Rozpoznaj regułę i nazwij kawałki. To różnica dwóch składników, więc każdy liczysz osobno (reguła 2). Każdy składnik to liczba razy potęga: liczba przed $x$ (turkusowa) i wykładnik (fioletowy).`,
        d: R`Test ostatniego działania: przy $x = 1$ liczysz osobno $2 \cdot 1^{-5} = 2$ i $1^{-\frac12} = 1$, a na końcu odejmujesz. Ostatnie działanie to odejmowanie — reguła 2. W drugim składniku liczby przed $x$ nie widać — to $1$.` },
      { e: 2, typ: 'sz', ...SZ.potegaS, r: 'wzór 3 · reguła 1',
        o: 'Zapisz szablon wzoru 3 dla jednego składnika. Zastosujesz go w obu składnikach.',
        d: R`Liczba przed $x$ czeka z przodu (reguła 1). Wykładnik schodzi przed $x$ i mnoży tę liczbę, a w wykładniku zostaje o $1$ mniej (wzór 3).` },
      { e: 4, wst: true, opisy: { s1: 'liczba przed x', n1: 'wykładnik pierwszego składnika', n2: 'wykładnik drugiego składnika' }, typ: 'd', r: 'wzór 3 · reguły 1, 2',
        t: R`\begin{aligned} f'(x) &= \mF{s1}{2} \cdot \mH{n1}{(-5)} \cdot x^{\mH{n1}{-5} - 1} \\ &\quad - \mH{n2}{\left(-\tfrac12\right)} \cdot x^{\mH{n2}{-\frac12} - 1} \end{aligned}`,
        o: R`Wstaw liczby do szablonu w każdym składniku: wykładnik schodzi przed $x$, a w wykładniku zostaje „stary wykładnik minus $1$”. Minus między składnikami zostaje.`,
        kiedy: BEZ_ETAPU_3 },
      { e: 5, t: R`= -10x^{-6} + \tfrac12 x^{-\frac32}`, typ: 'd', o: R`Policz liczby przed $x$ i nowe wykładniki.`,
        k: [R`2 \cdot (-5) = -10`, R`-5 - 1 = -6`, R`-\left(-\tfrac12\right) = \tfrac12`, R`-\tfrac12 - 1 = -\tfrac12 - \tfrac22 = -\tfrac32`],
        d: R`Minus przed nawiasem i minus w nawiasie dają plus. Od ułamka odejmujesz $1$ zapisaną jako $\tfrac22$ — wtedy oba ułamki mają ten sam mianownik.` },
      { e: 5, t: R`= -\frac{10}{x^6} + \frac{1}{2x\sqrt{x}}`, typ: 'd', o: 'Jeśli chcesz, wróć do zapisu z ułamkami i pierwiastkiem — oba zapisy są poprawne.',
        k: [R`x^{-6} = \frac{1}{x^6}`, R`\tfrac12 x^{-\frac32} = \frac{1}{2x^{\frac32}}`, R`x^{\frac32} = x^{1} \cdot x^{\frac12} = x\sqrt{x}`],
        d: R`Potęga z minusem to jedynka przez potęgę. $x^{\frac32}$ rozkładasz na $x^1 \cdot x^{\frac12}$, bo przy mnożeniu potęg wykładniki się dodają: $1 + \tfrac12 = \tfrac32$.` },
    ],
  },
  b: {
    f: R`f(x) = \sqrt[3]{x^4} - \frac{1}{\sqrt[3]{x}}`, leg: LEG.potega,
    wynik: R`\tfrac43 x^{\frac13} + \tfrac13 x^{-\frac43} = \tfrac43\sqrt[3]{x} + \frac{1}{3x\sqrt[3]{x}}`,
    linie: [
      { e: 1, t: R`f(x) = \sqrt[3]{x^4} - \frac{1}{\sqrt[3]{x}} = x^{\frac43} - x^{-\frac13}`, typ: 'f', r: 'potęgi',
        o: 'Zapisz oba pierwiastki jako potęgi.', kiedy: PRZYG_POT,
        d: R`$\sqrt[3]{x^4} = x^{\frac43}$: wykładnik spod pierwiastka idzie do licznika, stopień pierwiastka — do mianownika. $\frac{1}{\sqrt[3]{x}} = \frac{1}{x^{\frac13}} = x^{-\frac13}$.` },
      { e: 2, t: R`f(x) = x^{\mH{n1}{\frac43}} - x^{\mH{n2}{-\frac13}}`, typ: 'f', r: 'reguła 2 · wzór 3',
        o: R`Rozpoznaj regułę i nazwij kawałki: różnica dwóch potęg, więc każdy składnik osobno (reguła 2), każdy wzorem 3. Wykładniki są fioletowe.`,
        d: R`Test ostatniego działania: przy $x = 8$ liczysz osobno $\sqrt[3]{8^4} = 16$ i $\frac{1}{\sqrt[3]{8}} = \frac12$, a na końcu odejmujesz. Ostatnie działanie to odejmowanie — reguła 2.` },
      { e: 2, typ: 'sz', ...SZ.potegaW, r: 'wzór 3', o: 'Zapisz szablon wzoru 3. Zastosujesz go w obu składnikach.' },
      { e: 4, wst: true, opisy: { n1: 'wykładnik pierwszego składnika', n2: 'wykładnik drugiego składnika' }, typ: 'd', r: 'wzór 3 · reguła 2',
        t: R`\begin{aligned} f'(x) &= \mH{n1}{\tfrac43} \cdot x^{\mH{n1}{\frac43} - 1} \\ &\quad - \mH{n2}{\left(-\tfrac13\right)} \cdot x^{\mH{n2}{-\frac13} - 1} \end{aligned}`,
        o: 'Wstaw wykładniki do szablonu w każdym składniku. Minus między składnikami zostaje.' },
      { e: 5, t: R`= \tfrac43 x^{\frac13} + \tfrac13 x^{-\frac43}`, typ: 'd', o: 'Policz nowe wykładniki i znaki.',
        k: [R`\tfrac43 - 1 = \tfrac43 - \tfrac33 = \tfrac13`, R`-\left(-\tfrac13\right) = \tfrac13`, R`-\tfrac13 - 1 = -\tfrac13 - \tfrac33 = -\tfrac43`],
        d: R`Jedynkę zapisujesz jako $\tfrac33$, żeby odjąć ułamki o tym samym mianowniku. Minus razy minus daje plus.` },
      { e: 5, t: R`= \tfrac43\sqrt[3]{x} + \frac{1}{3x\sqrt[3]{x}}`, typ: 'd', o: 'Jeśli chcesz, wróć do pierwiastków.',
        k: [R`x^{\frac13} = \sqrt[3]{x}`, R`x^{\frac43} = x^{1} \cdot x^{\frac13} = x\sqrt[3]{x}`],
        d: R`Potęga z minusem to jedynka przez potęgę: $\tfrac13 x^{-\frac43} = \frac{1}{3x^{\frac43}}$.` },
    ],
  },
  c: {
    f: R`f(x) = \frac{2}{\ln x}`, leg: LEG.iloraz,
    wynik: R`-\frac{2}{x(\ln x)^2}`,
    linie: [
      { e: 2, t: R`f(x) = \frac{\mF{f}{2}}{\mG{g}{\ln x}}`, typ: 'f', r: 'reguła 4 · iloraz',
        o: R`Rozpoznaj regułę i nazwij kawałki: licznik to $\cF{2}$, mianownik to $\cG{\ln x}$.`,
        kiedy: R`Zaczynamy od rozpoznania, choć przepis pozwala też przygotować ułamek: $\frac{2}{\ln x} = 2(\ln x)^{-1}$. Tu celowo liczymy regułą ilorazu, bo to przykład do tej sekcji. Drogę przez potęgę pokazujemy po sekcji o funkcji złożonej.`,
        d: R`Test ostatniego działania: przy $x = 3$ liczysz najpierw $\ln 3$, a na końcu dzielisz $2$ przez wynik. Ostatnie działanie to dzielenie — więc reguła 4.` },
      { e: 2, typ: 'sz', ...SZ.iloraz, r: 'reguła 4', o: SZ_O(4) },
      { e: 3, t: R`(2)' = \mF{fp}{0}`, typ: 'p', r: 'wzór 1', o: 'Policz pochodną licznika.', d: R`$2$ to stała, a pochodna stałej to $0$.` },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną mianownika — jest wprost w tabeli.' },
      { e: 4, wst: true, opisy: OPISY.iloraz, z: { g2: 'g' }, typ: 'd', r: 'reguła 4', o: WST_ILORAZ,
        t: R`f'(x) = \frac{\mF{fp}{0} \cdot \mG{g}{\ln x} - \mF{f}{2} \cdot \mG{gp}{\frac1x}}{(\mG{g2}{\ln x})^2}` },
      { e: 5, t: R`= \frac{0 - \frac2x}{(\ln x)^2}`, typ: 'd', o: 'Policz oba iloczyny w liczniku.', k: [R`0 \cdot \ln x = 0`, R`2 \cdot \frac1x = \frac2x`] },
      { e: 5, t: R`= -\frac{2}{x(\ln x)^2}`, typ: 'd', o: R`Uprość piętrowy ułamek: $-\frac2x$ dzielisz przez $(\ln x)^2$.`,
        d: R`Dzielenie przez $(\ln x)^2$ to dopisanie $(\ln x)^2$ do mianownika, obok $x$. Minus zostaje przed całym ułamkiem.` },
    ],
  },
  d: {
    f: R`f(x) = \left(\frac{x-1}{x+1}\right)^4`, leg: LEG.zlozona,
    wynik: R`\frac{8(x-1)^3}{(x+1)^5}`,
    linie: [
      { e: 2, t: R`f(x) = \left(\mG{g}{\frac{x-1}{x+1}}\right)^{\mH{n}{4}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj warstwy: na zewnątrz potęga $\square^4$, w środku ułamek $\cG{\frac{x-1}{x+1}}$.`,
        kiedy: BEZ_PRZYG_POT,
        d: R`Test ostatniego działania: przy $x = 3$ liczysz najpierw $\frac{3-1}{3+1} = \frac24$, a na końcu podnosisz wynik do potęgi $4$. Ostatnie działanie to potęga czegoś, co nie jest samym $x$ — funkcja złożona, reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.potega('4'), r: 'reguła 5 · wzór 3',
        o: 'Zapisz szablon reguły 5 dla zewnętrznej potęgi: wykładnik schodzi przed nawias, środek przepisujesz bez zmian, na końcu razy pochodna środka.' },
      { e: 3, t: R`\begin{aligned} &\left(\frac{x-1}{x+1}\right)' \\ &= \frac{(x-1)' \cdot (x+1) - (x-1) \cdot (x+1)'}{(x+1)^2} \end{aligned}`, typ: 'p', r: 'reguła 4',
        tm: R`\begin{aligned} &\left(\frac{x-1}{x+1}\right)' \\ &= \dfrac{\begin{gathered} (x-1)' \cdot (x+1) \\ - (x-1) \cdot (x+1)' \end{gathered}}{(x+1)^2} \end{aligned}`,
        o: `Policz pochodną środka. Środek to iloraz: licznik $x - 1$, mianownik $x + 1$. Zapisz regułę 4 z tymi kawałkami — ${KRESKA}.`,
        d: R`To szablon reguły 4 (najedź na „reguła 4”), w którym zamiast słów „licznik” i „mianownik” stoją $x - 1$ i $x + 1$. Każdy kawałek stoi na swoim miejscu, więc w następnej linii wystarczy podstawić pochodne.` },
      { e: 3, t: R`= \frac{1 \cdot (x+1) - (x-1) \cdot 1}{(x+1)^2}`, typ: 'p', r: 'reguła 2 · wzory 1, 2',
        o: 'Policz pochodne licznika i mianownika i podstaw je w miejsca z kreską.',
        k: [R`(x - 1)' = 1 - 0 = 1`, R`(x + 1)' = 1 + 0 = 1`] },
      { e: 3, t: R`= \frac{x + 1 - x + 1}{(x+1)^2} = \mG{gp}{\frac{2}{(x+1)^2}}`, typ: 'p', o: 'Uprość licznik.',
        k: [R`-(x - 1) = -x + 1`, R`x - x = 0`, R`1 + 1 = 2`], d: 'Minus przed nawiasem zmienia znaki obu wyrazów w nawiasie.' },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguła 5 · wzór 3', o: WST_POTEGA,
        t: R`\begin{aligned} f'(x) &= \mH{n}{4} \cdot \left(\mG{g}{\frac{x-1}{x+1}}\right)^{\mH{n}{4} - 1} \\ &\quad \cdot \mG{gp}{\frac{2}{(x+1)^2}} \end{aligned}` },
      { e: 5, t: R`= 4\left(\frac{x-1}{x+1}\right)^{3} \cdot \frac{2}{(x+1)^2}`, typ: 'd', o: 'Policz nowy wykładnik.', k: [R`4 - 1 = 3`] },
      { e: 5, t: R`= \frac{4(x-1)^3}{(x+1)^3} \cdot \frac{2}{(x+1)^2}`, typ: 'd', r: 'potęgi', o: 'Rozpisz potęgę ułamka: potęga licznika przez potęgę mianownika.',
        d: R`$\left(\frac{a}{b}\right)^3 = \frac{a^3}{b^3}$.` },
      { e: 5, t: R`= \frac{8(x-1)^3}{(x+1)^5}`, typ: 'd', o: 'Pomnóż ułamki: licznik razy licznik, mianownik razy mianownik.',
        k: [R`4 \cdot 2 = 8`, R`(x+1)^3 \cdot (x+1)^2 = (x+1)^{3+2} = (x+1)^5`], d: 'Przy mnożeniu potęg o tej samej podstawie wykładniki się dodają.' },
    ],
  },
  e: {
    f: R`f(x) = -\frac{1}{(\ln x)^2}`, leg: LEG.zlozona,
    wynik: R`\frac{2}{x(\ln x)^3}`,
    linie: [
      { e: 1, t: R`f(x) = -\frac{1}{(\ln x)^2} = -(\ln x)^{-2}`, typ: 'f', r: 'potęgi',
        o: R`Zapisz ułamek jako potęgę z minusem: $\frac{1}{\square^2} = \square^{-2}$.`,
        kiedy: 'Na początku, bo wtedy zamiast reguły ilorazu wystarczy potęga — rachunek jest krótszy.',
        d: R`Jedynka przez coś do kwadratu to to samo do potęgi $-2$. Minus przed całością to stała $-1$ — zostanie przed pochodną (reguła 1).` },
      { e: 2, t: R`f(x) = -(\mG{g}{\ln x})^{\mH{n}{-2}}`, typ: 'f', r: 'reguły 1, 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: minus przed całością to stała $-1$ (reguła 1), a reszta to potęga ze środkiem $\cG{\ln x}$ (reguła 5). Wykładnik to $\cH{-2}$.`,
        d: R`Test ostatniego działania: przy $x = 3$ liczysz $\ln 3$, potem potęgę $-2$, a na końcu zmieniasz znak. Zmiana znaku to mnożenie przez stałą $-1$ — stała czeka z przodu (reguła 1). Przed nią jest potęga czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.potega('(-2)', '-2', '-'), r: 'reguły 1, 5 · wzór 3', o: 'Zapisz szablon reguły 5; minus czeka z przodu.' },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną środka — jest w tabeli.' },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguły 1, 5 · wzór 3', o: WST_POTEGA,
        t: R`f'(x) = -\mH{n}{(-2)} \cdot (\mG{g}{\ln x})^{\mH{n}{-2} - 1} \cdot \mG{gp}{\tfrac1x}` },
      { e: 5, t: R`= 2(\ln x)^{-3} \cdot \frac1x`, typ: 'd', o: 'Policz znak przed całością i nowy wykładnik.', k: [R`-(-2) = 2`, R`-2 - 1 = -3`] },
      { e: 5, t: R`= \frac{2}{x(\ln x)^3}`, typ: 'd', o: 'Zapisz bez potęgi z minusem i pomnóż ułamki.',
        k: [R`(\ln x)^{-3} = \frac{1}{(\ln x)^3}`, R`2 \cdot \frac{1}{(\ln x)^3} \cdot \frac1x = \frac{2}{x(\ln x)^3}`] },
    ],
  },
  f: {
    f: R`f(x) = \sqrt{5x - 7}`, leg: LEG.zlozona,
    wynik: R`\frac{5}{2\sqrt{5x - 7}}`,
    linie: [
      { e: 1, t: R`f(x) = \sqrt{5x - 7} = (5x - 7)^{\frac12}`, typ: 'f', r: 'potęgi',
        o: R`Zapisz pierwiastek jako potęgę $\tfrac12$.`, kiedy: PRZYG_POT,
        d: R`Pierwiastek kwadratowy to potęga $\tfrac12$: $\sqrt{\square} = \square^{\frac12}$. W miejscu kratki stoi całe $5x - 7$.` },
      { e: 2, t: R`f(x) = (\mG{g}{5x - 7})^{\mH{n}{\frac12}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: to potęga, w której środku stoi $\cG{5x - 7}$, a nie sam $x$ — funkcja złożona (reguła 5). Wykładnik to $\cH{\tfrac12}$.`,
        d: R`Test ostatniego działania: przy $x = 3$ liczysz $5 \cdot 3 - 7 = 8$, a na końcu potęgę $\tfrac12$, czyli pierwiastek. Ostatnie działanie to potęga czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.potega(R`\tfrac12`, R`\frac12`), r: 'reguła 5 · wzór 3', o: SZ_O(5) },
      { e: 3, t: R`(5x - 7)' = 5 \cdot 1 - 0 = \mG{gp}{5}`, typ: 'p', r: 'reguły 1, 2 · wzory 1, 2', o: 'Policz pochodną środka.',
        d: R`$(5x)' = 5 \cdot (x)' = 5 \cdot 1$, a $(7)' = 0$, bo $7$ to stała.` },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguła 5 · wzór 3', o: WST_POTEGA,
        t: R`f'(x) = \mH{n}{\tfrac12} \cdot (\mG{g}{5x - 7})^{\mH{n}{\frac12} - 1} \cdot \mG{gp}{5}` },
      { e: 5, t: R`= \tfrac12 (5x - 7)^{-\frac12} \cdot 5`, typ: 'd', o: 'Policz nowy wykładnik.', k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`] },
      { e: 5, t: R`= \frac{5}{2\sqrt{5x - 7}}`, typ: 'd', o: R`Pomnóż liczby, a potęgę $-\tfrac12$ zapisz jako jedynkę przez pierwiastek.`,
        k: [R`\tfrac12 \cdot 5 = \tfrac52`, R`(5x-7)^{-\frac12} = \frac{1}{\sqrt{5x-7}}`] },
    ],
  },
  g: {
    f: R`f(x) = (\ln x)^3 + x^{\frac32}`, leg: [['zloto', R`środek $\ln x$ i jego pochodna`], ['fiolet', 'wykładnik funkcji zewnętrznej']],
    wynik: R`\frac{3(\ln x)^2}{x} + \tfrac32\sqrt{x}`,
    linie: [
      { e: 2, t: R`f(x) = (\mG{g}{\ln x})^{\mH{n}{3}} + x^{\frac32}`, typ: 'f', r: 'reguła 2 · suma',
        o: R`Rozpoznaj regułę: suma dwóch składników, więc każdy osobno (reguła 2). Pierwszy to potęga logarytmu — funkcja złożona ze środkiem $\cG{\ln x}$. Drugi to zwykła potęga.`,
        kiedy: 'Zaczynamy od rozpoznania, bo oba składniki są już potęgami — nie ma czego przygotowywać.',
        d: R`Test: przy $x = 4$ liczysz osobno $(\ln 4)^3$ i $4^{\frac32}$, a na końcu dodajesz. Ostatnie działanie to dodawanie.` },
      { e: 2, typ: 'sz', t: R`f'(x) = \sH{n}{3} \cdot (\sG{g}{\text{środek}})^{\sH{n}{3} - 1} \cdot \sG{gp}{(\text{środek})'} + \tfrac32 x^{\frac32 - 1}`, r: 'reguły 2, 5 · wzór 3',
        tm: R`\begin{aligned} f'(x) = &\ \sH{n}{3} \cdot (\sG{g}{\text{środek}})^{\sH{n}{3} - 1} \cdot \sG{gp}{(\text{środek})'} \\ &+ \tfrac32 x^{\frac32 - 1} \end{aligned}`,
        o: R`Zapisz szablon: pierwszy składnik regułą 5 (zewnętrzna potęga $\square^3$), drugi od razu wzorem 3.` },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną środka — jest w tabeli.' },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguły 2, 5 · wzór 3', o: WST_POTEGA,
        t: R`f'(x) = \mH{n}{3} \cdot (\mG{g}{\ln x})^{\mH{n}{3} - 1} \cdot \mG{gp}{\tfrac1x} + \tfrac32 x^{\frac32 - 1}` },
      { e: 5, t: R`= \frac{3(\ln x)^2}{x} + \tfrac32\sqrt{x}`, typ: 'd', o: R`Policz wykładniki, pomnóż przez $\frac1x$ i zapisz potęgę $\tfrac12$ jako pierwiastek.`,
        k: [R`3 - 1 = 2`, R`\tfrac32 - 1 = \tfrac32 - \tfrac22 = \tfrac12`, R`3(\ln x)^2 \cdot \frac1x = \frac{3(\ln x)^2}{x}`, R`x^{\frac12} = \sqrt{x}`] },
    ],
  },
  h: {
    f: R`f(x) = (\ln x)^3 + \ln(x^3)`, leg: [['zloto', R`środek $\ln x$ i jego pochodna`], ['fiolet', 'wykładnik funkcji zewnętrznej']],
    wynik: R`\frac{3\left((\ln x)^2 + 1\right)}{x}`,
    linie: [
      { e: 1, t: R`f(x) = (\ln x)^3 + \ln(x^3) = (\ln x)^3 + 3\ln x`, typ: 'f', r: 'logarytmy',
        tm: R`\begin{aligned} f(x) &= (\ln x)^3 + \ln(x^3) \\ &= (\ln x)^3 + 3\ln x \end{aligned}`,
        o: R`Przygotuj drugi składnik: $\ln(x^3) = 3\ln x$.`,
        kiedy: R`Na początku, bo po tej zamianie drugi składnik to stała razy $\ln x$ — wystarczy tabela, bez reguły 5.`,
        d: R`Uwaga na zapis: $(\ln x)^3$ to logarytm podniesiony do potęgi, a $\ln(x^3)$ to logarytm z potęgi. Wykładnik spod logarytmu wychodzi przed logarytm: $\ln(a^k) = k\ln a$ dla $a > 0$. Wolno, bo $\ln x$ istnieje tylko dla $x > 0$.` },
      { e: 2, t: R`f(x) = (\mG{g}{\ln x})^{\mH{n}{3}} + 3\ln x`, typ: 'f', r: 'reguła 2 · suma',
        o: R`Rozpoznaj regułę i nazwij kawałki: suma, więc każdy składnik osobno (reguła 2). Pierwszy to potęga ze środkiem $\cG{\ln x}$ (reguła 5), drugi to stała $3$ razy $\ln x$.`,
        d: R`Test ostatniego działania: przy $x = 2$ liczysz osobno $(\ln 2)^3$ i $3\ln 2$, a na końcu dodajesz. Ostatnie działanie to dodawanie — reguła 2.` },
      { e: 2, typ: 'sz', t: R`f'(x) = \sH{n}{3} \cdot (\sG{g}{\text{środek}})^{\sH{n}{3} - 1} \cdot \sG{gp}{(\text{środek})'} + 3 \cdot \tfrac1x`, r: 'reguły 1, 2, 5 · wzory 3, 7',
        tm: R`\begin{aligned} f'(x) = &\ \sH{n}{3} \cdot (\sG{g}{\text{środek}})^{\sH{n}{3} - 1} \cdot \sG{gp}{(\text{środek})'} \\ &+ 3 \cdot \tfrac1x \end{aligned}`,
        o: R`Zapisz szablon: pierwszy składnik regułą 5 (zewnętrzna potęga $\square^3$), drugi to stała $3$ razy $\ln x$ — od razu z wzoru 7.` },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną środka — jest w tabeli.' },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguły 1, 2, 5 · wzory 3, 7', o: WST_POTEGA,
        t: R`f'(x) = \mH{n}{3} \cdot (\mG{g}{\ln x})^{\mH{n}{3} - 1} \cdot \mG{gp}{\tfrac1x} + 3 \cdot \tfrac1x` },
      { e: 5, t: R`= \frac{3(\ln x)^2}{x} + \frac3x`, typ: 'd', o: R`Policz wykładnik i pomnóż przez $\frac1x$.`,
        k: [R`3 - 1 = 2`, R`3(\ln x)^2 \cdot \frac1x = \frac{3(\ln x)^2}{x}`, R`3 \cdot \frac1x = \frac3x`] },
      { e: 5, t: R`= \frac{\mN{w1}{3}(\ln x)^2 + \mN{w2}{3}}{x}`, typ: 'd', o: 'Zapisz na wspólnej kresce ułamkowej.',
        d: R`Oba składniki mają mianownik $x$, więc liczniki dodajesz nad jedną kreską.` },
      { e: 5, z: { w: ['w1', 'w2'] }, t: R`= \frac{\mN{w}{3}\left((\ln x)^2 + 1\right)}{x}`, typ: 'd',
        o: R`Wyłącz wspólny czynnik $3$ przed nawias: obie trójki z licznika trafiają przed nawias, a w nawiasie zostaje to, co przy nich stało.`,
        k: [R`3(\ln x)^2 + 3 = 3 \cdot (\ln x)^2 + 3 \cdot 1 = 3\left((\ln x)^2 + 1\right)`] },
    ],
  },
  i: {
    f: R`f(x) = \sqrt[3]{(\ln x)^2}`, leg: LEG.zlozona,
    wynik: R`\frac{2}{3x\sqrt[3]{\ln x}}`,
    linie: [
      { e: 1, t: R`f(x) = \sqrt[3]{(\ln x)^2} = (\ln x)^{\frac23}`, typ: 'f', r: 'potęgi',
        o: R`Zapisz pierwiastek z potęgi jako jedną potęgę: $\sqrt[3]{\square^2} = \square^{\frac23}$.`, kiedy: PRZYG_POT,
        d: R`Wykładnik spod pierwiastka ($2$) idzie do licznika, stopień pierwiastka ($3$) — do mianownika.` },
      { e: 2, t: R`f(x) = (\mG{g}{\ln x})^{\mH{n}{\frac23}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: potęga ze środkiem $\cG{\ln x}$ — funkcja złożona (reguła 5). Wykładnik to $\cH{\tfrac23}$.`,
        d: R`Test ostatniego działania: przy $x = 3$ liczysz $\ln 3$, a na końcu potęgę $\tfrac23$. Ostatnie działanie to potęga czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.potega(R`\tfrac23`, R`\frac23`), r: 'reguła 5 · wzór 3', o: SZ_O(5) },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną środka — jest w tabeli.' },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguła 5 · wzór 3', o: WST_POTEGA,
        t: R`f'(x) = \mH{n}{\tfrac23} \cdot (\mG{g}{\ln x})^{\mH{n}{\frac23} - 1} \cdot \mG{gp}{\tfrac1x}` },
      { e: 5, t: R`= \tfrac23 (\ln x)^{-\frac13} \cdot \frac1x`, typ: 'd', o: 'Policz nowy wykładnik.', k: [R`\tfrac23 - 1 = \tfrac23 - \tfrac33 = -\tfrac13`] },
      { e: 5, t: R`= \frac{2}{3x\sqrt[3]{\ln x}}`, typ: 'd', o: 'Zapisz bez potęgi z minusem i pomnóż ułamki.',
        k: [R`(\ln x)^{-\frac13} = \frac{1}{\sqrt[3]{\ln x}}`, R`\tfrac23 \cdot \frac1x = \frac{2}{3x}`] },
    ],
  },
  j: {
    f: R`f(x) = x^2\ln(x^2)`, leg: LEG.iloczyn,
    wynik: R`2x\ln(x^2) + 2x = 2x\left(\ln(x^2) + 1\right)`,
    linie: [
      { e: 2, t: R`f(x) = \mF{f}{x^2} \cdot \mG{g}{\ln(x^2)}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Rozpoznaj regułę i nazwij kawałki: pierwszy to $\cF{x^2}$, drugi to $\cG{\ln(x^2)}$.`,
        kiedy: R`Zaczynamy od rozpoznania. Kusi przygotowanie $\ln(x^2) = 2\ln x$, ale ta zamiana działa tylko dla $x > 0$, a ta funkcja ma sens także dla ujemnych $x$.`,
        d: R`Test ostatniego działania: przy $x = 2$ liczysz $2^2 = 4$ i osobno $\ln(2^2) = \ln 4$, a na końcu mnożysz. Ostatnie działanie to mnożenie — reguła 3.` },
      { e: 2, typ: 'sz', ...SZ.iloczyn, r: 'reguła 3', o: SZ_O(3) },
      { e: 3, t: R`(x^2)' = \mF{fp}{2x}`, typ: 'p', r: 'wzór 3', o: 'Policz pochodną pierwszego kawałka.' },
      { e: 3, t: R`(\ln(x^2))' = \frac{1}{x^2} \cdot (x^2)'`, typ: 'p', r: 'reguła 5 · wzór 7',
        o: R`Policz pochodną drugiego kawałka. To funkcja złożona: $\ln\square$, w środku $x^2$. Pochodna $\ln\square$ to $\frac{1}{\square}$, potem razy pochodna środka.` },
      { e: 3, t: R`= \frac{1}{x^2} \cdot 2x = \mG{gp}{\frac2x}`, typ: 'p', r: 'wzór 3', o: R`Podstaw $(x^2)' = 2x$ i skróć.`, k: [R`\frac{1}{x^2} \cdot 2x = \frac{2x}{x^2} = \frac2x`] },
      { e: 4, wst: true, opisy: OPISY.iloczyn, typ: 'd', r: 'reguła 3', o: WST_ILOCZYN,
        t: R`f'(x) = \mF{fp}{2x} \cdot \mG{g}{\ln(x^2)} + \mF{f}{x^2} \cdot \mG{gp}{\frac2x}` },
      { e: 5, t: R`= \mN{w1}{2x}\mN{r1}{\ln(x^2)} + \mN{w2}{2x}`, typ: 'd', o: R`Uprość drugi składnik: $x^2 \cdot \frac2x = 2x$.`, k: [R`x^2 \cdot \frac2x = \frac{2x^2}{x} = 2x`] },
      { e: 5, z: { w: ['w1', 'w2'] }, t: R`= \mN{w}{2x}\left(\mN{r1}{\ln(x^2)} + 1\right)`, typ: 'd',
        o: R`Wyłącz wspólny czynnik $2x$ przed nawias. Oba $2x$ trafiają przed nawias; w nawiasie zostaje $\ln(x^2)$ z pierwszego składnika i $1$ z drugiego.`,
        k: [R`2x = 2x \cdot 1`] },
    ],
  },
  k: {
    f: R`f(x) = \sqrt{\frac{x-1}{x+1}}`, leg: LEG.zlozona, pkt: [2, 3, 5, -3, -5],
    wynik: R`\frac{1}{(x+1)^2}\sqrt{\frac{x+1}{x-1}}`,
    linie: [
      { e: 1, t: R`f(x) = \sqrt{\frac{x-1}{x+1}} = \left(\frac{x-1}{x+1}\right)^{\frac12}`, typ: 'f', r: 'potęgi',
        o: R`Zapisz pierwiastek jako potęgę $\tfrac12$.`, kiedy: PRZYG_POT },
      { e: 2, t: R`f(x) = \left(\mG{g}{\frac{x-1}{x+1}}\right)^{\mH{n}{\frac12}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: potęga, w której środku stoi ułamek $\cG{\frac{x-1}{x+1}}$ — ten sam co w przykładzie d). Funkcja złożona (reguła 5), wykładnik $\cH{\tfrac12}$.`,
        d: R`Test ostatniego działania: przy $x = 3$ liczysz $\frac{3-1}{3+1} = \frac24$, a na końcu potęgę $\tfrac12$, czyli pierwiastek. Ostatnie działanie to potęga czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.potega(R`\tfrac12`, R`\frac12`), r: 'reguła 5 · wzór 3', o: SZ_O(5) },
      { e: 3, t: R`\begin{aligned} &\left(\frac{x-1}{x+1}\right)' \\ &= \frac{(x-1)' \cdot (x+1) - (x-1) \cdot (x+1)'}{(x+1)^2} \end{aligned}`, typ: 'p', r: 'reguła 4',
        tm: R`\begin{aligned} &\left(\frac{x-1}{x+1}\right)' \\ &= \dfrac{\begin{gathered} (x-1)' \cdot (x+1) \\ - (x-1) \cdot (x+1)' \end{gathered}}{(x+1)^2} \end{aligned}`,
        o: `Policz pochodną środka. Środek to iloraz: licznik $x - 1$, mianownik $x + 1$. Zapisz regułę 4 z tymi kawałkami — ${KRESKA}.` },
      { e: 3, t: R`= \frac{1 \cdot (x+1) - (x-1) \cdot 1}{(x+1)^2}`, typ: 'p', r: 'reguła 2 · wzory 1, 2',
        o: 'Policz pochodne licznika i mianownika i podstaw je w miejsca z kreską.',
        k: [R`(x - 1)' = 1 - 0 = 1`, R`(x + 1)' = 1 + 0 = 1`] },
      { e: 3, t: R`= \frac{x + 1 - x + 1}{(x+1)^2} = \mG{gp}{\frac{2}{(x+1)^2}}`, typ: 'p', o: 'Uprość licznik.', k: [R`-(x-1) = -x + 1`, R`1 + 1 = 2`] },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguła 5 · wzór 3', o: WST_POTEGA,
        t: R`\begin{aligned} f'(x) &= \mH{n}{\tfrac12} \cdot \left(\mG{g}{\frac{x-1}{x+1}}\right)^{\mH{n}{\frac12} - 1} \\ &\quad \cdot \mG{gp}{\frac{2}{(x+1)^2}} \end{aligned}` },
      { e: 5, t: R`= \tfrac12\left(\frac{x-1}{x+1}\right)^{-\frac12} \cdot \frac{2}{(x+1)^2}`, typ: 'd', o: 'Policz nowy wykładnik.', k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`] },
      { e: 5, t: R`= \left(\frac{x+1}{x-1}\right)^{\frac12} \cdot \frac{1}{(x+1)^2}`, typ: 'd', r: 'potęgi', o: R`Pomnóż $\tfrac12 \cdot 2 = 1$ i odwróć ułamek: minus w wykładniku zamienia licznik z mianownikiem.`,
        d: R`$\left(\frac{a}{b}\right)^{-\frac12} = \left(\frac{b}{a}\right)^{\frac12}$ — potęga z minusem to odwrotność.` },
      { e: 5, t: R`= \frac{1}{(x+1)^2}\sqrt{\frac{x+1}{x-1}}`, typ: 'd', o: R`Zapisz potęgę $\tfrac12$ jako pierwiastek.` },
    ],
  },
  l: {
    f: R`f(x) = \left(\ln(2x+1)\right)^3`,
    leg: [['zloto', R`środek $\ln(2x+1)$ i jego pochodna`], ['cyan', R`środek logarytmu: $2x + 1$ i jego pochodna`], ['fiolet', 'wykładnik funkcji zewnętrznej']],
    wynik: R`\frac{6\left(\ln(2x+1)\right)^2}{2x+1}`,
    linie: [
      { e: 2, t: R`f(x) = \left(\mG{g}{\ln(2x+1)}\right)^{\mH{n}{3}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj warstwy. Na zewnątrz potęga $\square^3$, w środku $\cG{\ln(2x+1)}$ — a w środku logarytmu jeszcze $\cF{2x + 1}$.`,
        kiedy: BEZ_PRZYG_POT,
        d: R`Test: przy $x = 2$ liczysz $2 \cdot 2 + 1 = 5$, potem $\ln 5$, na końcu $(\ln 5)^3$. Trzy działania jedno w drugim — trzy warstwy, jak w cebuli.` },
      { e: 2, typ: 'sz', ...SZ.potega('3'), r: 'reguła 5 · wzór 3', o: 'Zapisz szablon reguły 5 dla zewnętrznej warstwy (potęgi $\\square^3$).' },
      { e: 3, t: R`\begin{aligned} \left(\ln(\mF{u}{2x+1})\right)' &= \frac{1}{\mF{u}{2x+1}} \\ &\quad \cdot \mF{up}{(2x+1)'} \end{aligned}`, typ: 'p', r: 'reguła 5 · wzór 7',
        o: R`Policz pochodną środka. To znowu funkcja złożona: $\ln\square$ ze środkiem $\cF{2x + 1}$. Pochodna $\ln\square$ to $\frac{1}{\square}$, potem razy pochodna środka.` },
      { e: 3, t: R`= \frac{1}{2x+1} \cdot \mF{up}{2} = \mG{gp}{\frac{2}{2x+1}}`, typ: 'p', r: 'reguły 1, 2 · wzory 1, 2', o: R`Policz najgłębszą warstwę: $(2x + 1)' = 2$.`,
        k: [R`(2x+1)' = 2 \cdot 1 + 0 = 2`] },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguła 5 · wzór 3', o: WST_POTEGA,
        t: R`f'(x) = \mH{n}{3} \cdot \left(\mG{g}{\ln(2x+1)}\right)^{\mH{n}{3} - 1} \cdot \mG{gp}{\frac{2}{2x+1}}` },
      { e: 5, t: R`= \frac{6\left(\ln(2x+1)\right)^2}{2x+1}`, typ: 'd', o: 'Policz nowy wykładnik i pomnóż liczby.', k: [R`3 - 1 = 2`, R`3 \cdot 2 = 6`] },
    ],
  },
  m: {
    f: R`f(x) = \ln^2(2x)`, leg: LEG.zlozona,
    wynik: R`\frac{2\ln(2x)}{x}`,
    linie: [
      { e: 1, t: R`f(x) = \ln^2(2x) = \left(\ln(2x)\right)^2`, typ: 'f', r: 'umowa · zapis',
        o: R`Rozszyfruj zapis: $\ln^2(2x)$ to kwadrat całego logarytmu, czyli $(\ln(2x))^2$.`,
        kiedy: 'Najpierw zapis, bo od niego zależy, którą regułę wybierzesz: kwadrat logarytmu to co innego niż logarytm z kwadratu.',
        d: R`To umowa w zapisie: potęga przy „ln” dotyczy całego logarytmu. Nie chodzi o $\ln(4x^2)$ ani o logarytm z logarytmu.` },
      { e: 2, t: R`f(x) = \left(\mG{g}{\ln(2x)}\right)^{\mH{n}{2}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: kwadrat, w którego środku stoi $\cG{\ln(2x)}$ — funkcja złożona (reguła 5). Wykładnik to $\cH{2}$.`,
        d: R`Test ostatniego działania: przy $x = 1$ liczysz $2 \cdot 1 = 2$, potem $\ln 2$, a na końcu kwadrat. Ostatnie działanie to potęga czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.potega('2'), r: 'reguła 5 · wzór 3', o: SZ_O(5) },
      { e: 3, t: R`\left(\ln(2x)\right)' = \frac{1}{2x} \cdot (2x)'`, typ: 'p', r: 'reguła 5 · wzór 7',
        o: R`Policz pochodną środka. To znowu funkcja złożona: $\ln\square$ ze środkiem $2x$. Pochodna $\ln\square$ to $\frac{1}{\square}$, potem razy pochodna środka.` },
      { e: 3, t: R`= \frac{1}{2x} \cdot 2 = \mG{gp}{\frac1x}`, typ: 'p', r: 'reguła 1 · wzór 2', o: R`Podstaw $(2x)' = 2$ i skróć.`,
        k: [R`(2x)' = 2 \cdot 1 = 2`, R`\frac{1}{2x} \cdot 2 = \frac{2}{2x} = \frac1x`],
        d: R`Wyszło tyle samo co $(\ln x)'$. To nie przypadek: $\ln(2x) = \ln 2 + \ln x$, a $\ln 2$ to stała, więc jej pochodna to $0$.` },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguła 5 · wzór 3', o: WST_POTEGA,
        t: R`f'(x) = \mH{n}{2} \cdot \left(\mG{g}{\ln(2x)}\right)^{\mH{n}{2} - 1} \cdot \mG{gp}{\frac1x}` },
      { e: 5, t: R`= 2\ln(2x) \cdot \frac1x = \frac{2\ln(2x)}{x}`, typ: 'd', o: 'Policz nowy wykładnik i pomnóż.', k: [R`2 - 1 = 1`],
        d: R`Potęgi $1$ się nie pisze: $\square^1 = \square$.` },
    ],
  },
  n: {
    f: R`f(x) = x^2e^x\ln x`, leg: LEG.iloczyn,
    wynik: R`xe^x(2\ln x + x\ln x + 1)`,
    linie: [
      { e: 2, t: R`f(x) = \mF{f}{x^2e^x} \cdot \mG{g}{\ln x}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Trzy czynniki, a reguła 3 jest dla dwóch. Pogrupuj: pierwszy kawałek to $\cF{x^2e^x}$, drugi to $\cG{\ln x}$.`,
        kiedy: BEZ_PRZYG,
        d: R`Mnożenie można grupować dowolnie, więc dwa pierwsze czynniki traktujesz jak jeden kawałek. Test ostatniego działania: przy $x = 2$ liczysz $2^2e^2$ i osobno $\ln 2$, a na końcu mnożysz — reguła 3.` },
      { e: 2, typ: 'sz', ...SZ.iloczyn, r: 'reguła 3', o: SZ_O(3) },
      { e: 3, t: R`(x^2e^x)' = (x^2)' \cdot e^x + x^2 \cdot (e^x)'`, typ: 'p', r: 'reguła 3',
        o: `Policz pochodną pierwszego kawałka. To też iloczyn: $x^2$ razy $e^x$. Zapisz regułę 3 z tymi czynnikami — ${KRESKA}.` },
      { e: 3, t: R`= \mF{fp}{2xe^x + x^2e^x}`, typ: 'p', r: 'wzory 3, 5',
        o: 'Policz pochodne obu czynników i podstaw je w miejsca z kreską.', k: [R`(x^2)' = 2x`, R`(e^x)' = e^x`, R`2x \cdot e^x = 2xe^x`] },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną drugiego kawałka.' },
      { e: 4, wst: true, opisy: OPISY.iloczyn, typ: 'd', r: 'reguła 3', o: WST_ILOCZYN,
        t: R`\begin{aligned} f'(x) &= (\mF{fp}{2xe^x + x^2e^x}) \cdot \mG{g}{\ln x} \\ &\quad + \mF{f}{x^2e^x} \cdot \mG{gp}{\frac1x} \end{aligned}` },
      { e: 5, t: R`= (2xe^x + x^2e^x)\ln x + xe^x`, typ: 'd', o: R`Uprość drugi składnik: $x^2e^x \cdot \frac1x = xe^x$.`, k: [R`x^2e^x \cdot \frac1x = \frac{x^2}{x}e^x = xe^x`] },
      { e: 5, t: R`= \mN{w1}{xe^x} \cdot 2\ln x + \mN{w2}{xe^x} \cdot x\ln x + \mN{w3}{xe^x}`, typ: 'd',
        o: R`Wymnóż nawias przez $\ln x$ i w każdym składniku pokaż czynnik $xe^x$.`,
        k: [R`2xe^x\ln x = xe^x \cdot 2\ln x`, R`x^2e^x\ln x = xe^x \cdot x\ln x`],
        d: R`$x^2e^x = x \cdot xe^x$, więc w drugim składniku zostaje $x\ln x$.` },
      { e: 5, z: { w: ['w1', 'w2', 'w3'] }, t: R`= \mN{w}{xe^x}(2\ln x + x\ln x + 1)`, typ: 'd',
        o: R`Wyłącz wspólny czynnik $xe^x$ przed nawias. W nawiasie zostaje $2\ln x$, $x\ln x$ i $1$ — bo $xe^x = xe^x \cdot 1$.`,
        kiedy: WYLACZ },
    ],
  },
  o: {
    f: R`f(x) = \frac{1}{\sqrt{x^2+1}}`, leg: LEG.zlozona,
    wynik: R`-\frac{x}{(x^2+1)^{\frac32}}`,
    linie: [
      { e: 1, t: R`f(x) = \frac{1}{\sqrt{x^2+1}} = (x^2+1)^{-\frac12}`, typ: 'f', r: 'potęgi',
        o: R`Zapisz jako potęgę: $\frac{1}{\sqrt{\square}} = \square^{-\frac12}$.`,
        kiedy: 'Na początku, bo zamiast reguły ilorazu z pierwiastkiem w mianowniku wystarczy wtedy jedna potęga.',
        d: R`Najpierw $\sqrt{\square} = \square^{\frac12}$, potem jedynka przez potęgę: wykładnik zmienia znak.` },
      { e: 2, t: R`f(x) = (\mG{g}{x^2+1})^{\mH{n}{-\frac12}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: potęga ze środkiem $\cG{x^2 + 1}$ — funkcja złożona (reguła 5). Wykładnik to $\cH{-\tfrac12}$.`,
        d: R`Test ostatniego działania: przy $x = 2$ liczysz $2^2 + 1 = 5$, a na końcu potęgę $-\tfrac12$. Ostatnie działanie to potęga czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.potega(R`\left(-\tfrac12\right)`, R`-\frac12`), r: 'reguła 5 · wzór 3', o: SZ_O(5) },
      { e: 3, t: R`(x^2+1)' = 2x + 0 = \mG{gp}{2x}`, typ: 'p', r: 'reguła 2 · wzory 1, 3', o: 'Policz pochodną środka.' },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguła 5 · wzór 3', o: WST_POTEGA,
        t: R`\begin{aligned} f'(x) &= \mH{n}{\left(-\tfrac12\right)} \cdot (\mG{g}{x^2+1})^{\mH{n}{-\frac12} - 1} \\ &\quad \cdot \mG{gp}{2x} \end{aligned}` },
      { e: 5, t: R`= -\tfrac12 (x^2+1)^{-\frac32} \cdot 2x`, typ: 'd', o: 'Policz nowy wykładnik.', k: [R`-\tfrac12 - 1 = -\tfrac12 - \tfrac22 = -\tfrac32`] },
      { e: 5, t: R`= -\frac{x}{(x^2+1)^{\frac32}}`, typ: 'd', o: 'Pomnóż liczby i zapisz bez potęgi z minusem.', k: [R`-\tfrac12 \cdot 2x = -x`, R`(x^2+1)^{-\frac32} = \frac{1}{(x^2+1)^{\frac32}}`] },
    ],
  },
  p: {
    f: R`f(x) = x\sqrt{\ln x}`, leg: LEG.iloczyn,
    wynik: R`\sqrt{\ln x} + \frac{1}{2\sqrt{\ln x}} = \frac{2\ln x + 1}{2\sqrt{\ln x}}`,
    linie: [
      { e: 1, t: R`f(x) = x\sqrt{\ln x} = x(\ln x)^{\frac12}`, typ: 'f', r: 'potęgi', o: R`Zapisz pierwiastek jako potęgę: $\sqrt{\ln x} = (\ln x)^{\frac12}$.`,
        kiedy: 'Na początku, bo pochodną pierwiastka policzysz wtedy wzorem 3 (z regułą 5).' },
      { e: 2, t: R`f(x) = \mF{f}{x} \cdot \mG{g}{(\ln x)^{\frac12}}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Rozpoznaj regułę i nazwij kawałki: pierwszy to $\cF{x}$, drugi to $\cG{(\ln x)^{\frac12}}$.`,
        d: R`Test: przy $x = 4$ liczysz $\ln 4$, potem pierwiastek, a na końcu mnożysz przez $4$. Ostatnie działanie to mnożenie — reguła 3.` },
      { e: 2, typ: 'sz', ...SZ.iloczyn, r: 'reguła 3', o: SZ_O(3) },
      { e: 3, t: R`(x)' = \mF{fp}{1}`, typ: 'p', r: 'wzór 2', o: 'Policz pochodną pierwszego kawałka.' },
      { e: 3, t: R`\left((\ln x)^{\frac12}\right)' = \tfrac12(\ln x)^{\frac12 - 1} \cdot (\ln x)'`, typ: 'p', r: 'reguła 5 · wzór 3',
        o: `Policz pochodną drugiego kawałka. To funkcja złożona: potęga $\\tfrac12$ ze środkiem $\\ln x$. Zapisz regułę 5 z tymi kawałkami: wykładnik schodzi przed nawias, środek bez zmian — ${KRESKA}.` },
      { e: 3, t: R`= \tfrac12(\ln x)^{-\frac12} \cdot \tfrac1x`, typ: 'p', r: 'wzór 7',
        o: R`Policz nowy wykładnik i podstaw pochodną środka: $(\ln x)' = \tfrac1x$.`,
        k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`] },
      { e: 3, t: R`= \mG{gp}{\frac{1}{2x\sqrt{\ln x}}}`, typ: 'p', o: 'Zapisz jednym ułamkiem.',
        k: [R`(\ln x)^{-\frac12} = \frac{1}{\sqrt{\ln x}}`, R`\tfrac12 \cdot \frac{1}{\sqrt{\ln x}} \cdot \frac1x = \frac{1}{2x\sqrt{\ln x}}`] },
      { e: 4, wst: true, opisy: OPISY.iloczyn, typ: 'd', r: 'reguła 3', o: WST_ILOCZYN,
        t: R`f'(x) = \mF{fp}{1} \cdot \mG{g}{(\ln x)^{\frac12}} + \mF{f}{x} \cdot \mG{gp}{\frac{1}{2x\sqrt{\ln x}}}`,
        tm: R`\begin{aligned} f'(x) = &\ \mF{fp}{1} \cdot \mG{g}{(\ln x)^{\frac12}} \\ &+ \mF{f}{x} \cdot \mG{gp}{\frac{1}{2x\sqrt{\ln x}}} \end{aligned}` },
      { e: 5, t: R`= \sqrt{\ln x} + \frac{1}{2\sqrt{\ln x}}`, typ: 'd', o: R`Zapisz $(\ln x)^{\frac12}$ jako pierwiastek, a w drugim składniku skróć $x$.`,
        k: [R`1 \cdot (\ln x)^{\frac12} = \sqrt{\ln x}`, R`x \cdot \frac{1}{2x\sqrt{\ln x}} = \frac{1}{2\sqrt{\ln x}}`] },
      { e: 5, t: R`= \frac{2\ln x + 1}{2\sqrt{\ln x}}`, typ: 'd', o: 'Jeśli chcesz, zapisz wynik na jednej kresce ułamkowej.',
        k: [R`\sqrt{\ln x} = \frac{2\ln x}{2\sqrt{\ln x}}`],
        d: R`Zapisz $\sqrt{\ln x}$ jako $\frac{\sqrt{\ln x}}{1}$ i pomnóż licznik i mianownik przez $2\sqrt{\ln x}$. W liczniku wyjdzie $2\ln x$, bo $\sqrt{\ln x} \cdot \sqrt{\ln x} = \ln x$.` },
    ],
  },
  q: {
    f: R`f(x) = x\ln x`, leg: LEG.iloczyn,
    wynik: R`\ln x + 1`,
    linie: [
      { e: 2, t: R`f(x) = \mF{f}{x} \cdot \mG{g}{\ln x}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Rozpoznaj regułę i nazwij kawałki: pierwszy to $\cF{x}$, drugi to $\cG{\ln x}$.`, kiedy: BEZ_PRZYG,
        d: R`Test ostatniego działania: przy $x = 3$ liczysz $\ln 3$, a na końcu mnożysz przez $3$. Ostatnie działanie to mnożenie — reguła 3.` },
      { e: 2, typ: 'sz', ...SZ.iloczyn, r: 'reguła 3', o: SZ_O(3) },
      { e: 3, t: R`(x)' = \mF{fp}{1}`, typ: 'p', r: 'wzór 2', o: 'Policz pochodną pierwszego kawałka.' },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną drugiego kawałka.' },
      { e: 4, wst: true, opisy: OPISY.iloczyn, typ: 'd', r: 'reguła 3', o: WST_ILOCZYN,
        t: R`f'(x) = \mF{fp}{1} \cdot \mG{g}{\ln x} + \mF{f}{x} \cdot \mG{gp}{\tfrac1x}` },
      { e: 5, t: R`= \ln x + 1`, typ: 'd', o: 'Policz oba iloczyny.', k: [R`1 \cdot \ln x = \ln x`, R`x \cdot \frac1x = \frac{x}{x} = 1`] },
    ],
  },
  r: {
    f: R`f(x) = e^{-x} + e^{2x}`, leg: LEG.wykladnicza,
    wynik: R`-e^{-x} + 2e^{2x}`,
    linie: [
      { e: 2, t: R`f(x) = e^{\mG{g1}{-x}} + e^{\mG{g2}{2x}}`, typ: 'f', r: 'reguła 2 · suma',
        o: R`Rozpoznaj regułę i nazwij kawałki: suma dwóch składników — każdy osobno (reguła 2). Każdy to $e^{\square}$, ale w wykładniku nie stoi sam $x$ — to funkcje złożone (reguła 5). Wykładniki są złote.`,
        kiedy: BEZ_PRZYG,
        d: R`Test ostatniego działania: przy $x = 2$ liczysz osobno $e^{-2}$ i $e^{4}$, a na końcu dodajesz — reguła 2. Wzór 5, $(e^x)' = e^x$, działa tylko wtedy, gdy w wykładniku jest dokładnie $x$. Tu są $-x$ i $2x$, więc dochodzi pochodna wykładnika.` },
      { e: 2, typ: 'sz', ...SZ.ekspS, r: 'reguła 5 · wzór 5', o: 'Zapisz szablon reguły 5 dla jednego składnika $e^{\\square}$ — użyjesz go w każdym składniku.' },
      { e: 3, t: R`(-x)' = \mG{gp1}{-1}`, typ: 'p', r: 'reguła 1 · wzór 2', o: 'Policz pochodną pierwszego wykładnika.', d: R`$-x = (-1) \cdot x$, więc pochodna to $(-1) \cdot 1 = -1$.` },
      { e: 3, t: R`(2x)' = \mG{gp2}{2}`, typ: 'p', r: 'reguła 1 · wzór 2', o: 'Policz pochodną drugiego wykładnika.' },
      { e: 4, wst: true, opisy: { g1: 'pierwszy wykładnik bez zmian', gp1: 'pochodna pierwszego wykładnika', g2: 'drugi wykładnik bez zmian', gp2: 'pochodna drugiego wykładnika' },
        typ: 'd', r: 'reguły 2, 5 · wzór 5', o: 'Wstaw kawałki w szablon w każdym składniku: wykładnik bez zmian, potem razy jego pochodna.',
        t: R`f'(x) = e^{\mG{g1}{-x}} \cdot (\mG{gp1}{-1}) + e^{\mG{g2}{2x}} \cdot \mG{gp2}{2}` },
      { e: 5, t: R`= -e^{-x} + 2e^{2x}`, typ: 'd', o: R`Uporządkuj: liczbę piszesz przed $e$.` },
    ],
  },
  s: {
    f: R`f(x) = x^2e^{3x}`, leg: LEG.iloczyn,
    wynik: R`2xe^{3x} + 3x^2e^{3x} = xe^{3x}(2 + 3x)`,
    linie: [
      { e: 2, t: R`f(x) = \mF{f}{x^2} \cdot \mG{g}{e^{3x}}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Rozpoznaj regułę i nazwij kawałki: pierwszy to $\cF{x^2}$, drugi to $\cG{e^{3x}}$.`, kiedy: BEZ_PRZYG,
        d: R`Test: przy $x = 1$ liczysz $1^2 = 1$ i osobno $e^{3}$, a na końcu mnożysz. Ostatnie działanie to mnożenie — reguła 3.` },
      { e: 2, typ: 'sz', ...SZ.iloczyn, r: 'reguła 3', o: SZ_O(3) },
      { e: 3, t: R`(x^2)' = \mF{fp}{2x}`, typ: 'p', r: 'wzór 3', o: 'Policz pochodną pierwszego kawałka.', k: [R`2 - 1 = 1`] },
      { e: 3, t: R`(e^{3x})' = e^{3x} \cdot (3x)' = \mG{gp}{3e^{3x}}`, typ: 'p', r: 'reguła 5 · wzór 5',
        o: R`Policz pochodną drugiego kawałka. To funkcja złożona: $e^{\square}$ z wykładnikiem $3x$. $e^{3x}$ przepisujesz bez zmian i mnożysz przez pochodną wykładnika.`,
        k: [R`(3x)' = 3 \cdot 1 = 3`, R`e^{3x} \cdot 3 = 3e^{3x}`] },
      { e: 4, wst: true, opisy: OPISY.iloczyn, typ: 'd', r: 'reguła 3', o: WST_ILOCZYN,
        t: R`f'(x) = \mF{fp}{2x} \cdot \mG{g}{e^{3x}} + \mF{f}{x^2} \cdot \mG{gp}{3e^{3x}}` },
      { e: 5, t: R`= \mN{a1}{2}\mN{w1}{xe^{3x}} + \mN{a2}{3x} \cdot \mN{w2}{xe^{3x}}`, typ: 'd',
        o: R`Uporządkuj iloczyny tak, żeby w obu składnikach było widać ten sam czynnik $xe^{3x}$.`,
        k: [R`2x \cdot e^{3x} = 2xe^{3x}`, R`x^2 \cdot 3e^{3x} = 3x \cdot xe^{3x}`],
        d: R`$x^2 = x \cdot x$, więc $3x^2e^{3x}$ to $3x$ razy $xe^{3x}$.` },
      { e: 5, z: { w: ['w1', 'w2'] }, t: R`= \mN{w}{xe^{3x}}(\mN{a1}{2} + \mN{a2}{3x})`, typ: 'd',
        o: R`Wyłącz wspólny czynnik $xe^{3x}$ przed nawias. Oba $xe^{3x}$ trafiają przed nawias; w nawiasie zostaje $2$ z pierwszego składnika i $3x$ z drugiego.` },
    ],
  },
  t: {
    f: R`f(x) = \tfrac13 e^{\ln x + x^2}`, leg: LEG.wykladnicza,
    wynik: R`\tfrac13 e^{x^2}\left(1 + 2x^2\right)`,
    linie: [
      { e: 2, t: R`f(x) = \tfrac13 e^{\mG{g}{\ln x + x^2}}`, typ: 'f', r: 'reguły 1, 5',
        o: R`Rozpoznaj regułę i nazwij kawałki: stała $\tfrac13$ czeka z przodu (reguła 1), a reszta to $e^{\square}$ z wykładnikiem $\cG{\ln x + x^2}$ — funkcja złożona (reguła 5).`,
        kiedy: R`Zaczynamy od rozpoznania i liczymy wprost. Można też najpierw przygotować $e^{\ln x + x^2} = xe^{x^2}$ — tę drogę pokazuje ramka „Inne drogi” pod przykładami.`,
        d: R`Test ostatniego działania: przy $x = 1$ liczysz $\ln 1 + 1^2 = 1$, potem $e^1$, a na końcu mnożysz przez $\tfrac13$. Mnożenie przez stałą to reguła 1 — stała czeka z przodu. Przed nim jest $e^{\square}$ z czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', t: R`f'(x) = \tfrac13 e^{\sG{g}{\text{wykładnik}}} \cdot \sG{gp}{(\text{wykładnik})'}`, r: 'reguła 5 · wzór 5', o: 'Zapisz szablon reguły 5 dla $e^{\\square}$; stała $\\tfrac13$ czeka z przodu.' },
      { e: 3, t: R`(\ln x + x^2)' = \mG{gp}{\tfrac1x + 2x}`, typ: 'p', r: 'reguła 2 · wzory 3, 7', o: 'Policz pochodną wykładnika — to suma, każdy składnik z tabeli.' },
      { e: 4, wst: true, opisy: OPISY.eksp, typ: 'd', r: 'reguła 5 · wzór 5', o: WST_EKSP,
        t: R`f'(x) = \tfrac13 e^{\mG{g}{\ln x + x^2}}\left(\mG{gp}{\tfrac1x + 2x}\right)` },
      { e: 5, t: R`= \tfrac13 xe^{x^2}\left(\tfrac1x + 2x\right)`, typ: 'd', r: 'potęgi i logarytmy', o: R`Uprość potęgę: $e^{\ln x + x^2} = xe^{x^2}$.`,
        k: [R`e^{\ln x + x^2} = e^{\ln x} \cdot e^{x^2} = xe^{x^2}`],
        d: R`Suma w wykładniku to iloczyn potęg: $e^{a+b} = e^a \cdot e^b$. A $e^{\ln x} = x$, bo $\ln x$ to wykładnik, do którego trzeba podnieść $e$, żeby dostać $x$.` },
      { e: 5, t: R`= \tfrac13 e^{x^2}\left(1 + 2x^2\right)`, typ: 'd', o: R`Wymnóż $x$ przez nawias.`, k: [R`x \cdot \tfrac1x = 1`, R`x \cdot 2x = 2x^2`] },
    ],
  },
  u: {
    f: R`f(x) = (2x+1) \cdot 2^{2x+1}`, leg: LEG.iloczyn,
    wynik: R`2 \cdot 2^{2x+1}\left(1 + (2x+1)\ln 2\right) = 2^{2x+2}\left(1 + (2x+1)\ln 2\right)`,
    linie: [
      { e: 2, t: R`f(x) = \mF{f}{(2x+1)} \cdot \mG{g}{2^{2x+1}}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Rozpoznaj regułę i nazwij kawałki: pierwszy to $\cF{2x + 1}$, drugi to $\cG{2^{2x+1}}$.`, kiedy: BEZ_PRZYG,
        d: R`Test: przy $x = 1$ liczysz $2 \cdot 1 + 1 = 3$ i osobno $2^3 = 8$, a na końcu mnożysz $3 \cdot 8$. Ostatnie działanie to mnożenie — reguła 3.` },
      { e: 2, typ: 'sz', ...SZ.iloczyn, r: 'reguła 3', o: SZ_O(3) },
      { e: 3, t: R`(2x+1)' = \mF{fp}{2}`, typ: 'p', r: 'reguły 1, 2 · wzory 1, 2', o: 'Policz pochodną pierwszego kawałka.' },
      { e: 3, t: R`\left(2^{2x+1}\right)' = 2^{2x+1}\ln 2 \cdot (2x+1)'`, typ: 'p', r: 'reguła 5 · wzór 4',
        o: R`Policz pochodną drugiego kawałka: wzór 4 z podstawą $a = 2$. W wykładniku stoi $2x + 1$, a nie sam $x$ — więc razy pochodna wykładnika.` },
      { e: 3, t: R`= \mG{gp}{2 \cdot 2^{2x+1}\ln 2}`, typ: 'p', r: 'reguły 1, 2 · wzory 1, 2',
        o: R`Podstaw pochodną wykładnika i przestaw ją na początek.`, k: [R`(2x + 1)' = 2 \cdot 1 + 0 = 2`] },
      { e: 4, wst: true, opisy: OPISY.iloczyn, typ: 'd', r: 'reguła 3', o: WST_ILOCZYN,
        t: R`\begin{aligned} f'(x) &= \mF{fp}{2} \cdot \mG{g}{2^{2x+1}} \\ &\quad + \mF{f}{(2x+1)} \cdot \mG{gp}{2 \cdot 2^{2x+1}\ln 2} \end{aligned}` },
      { e: 5, t: R`= 2 \cdot 2^{2x+1}\left(1 + (2x+1)\ln 2\right)`, typ: 'd',
        o: R`Wyłącz wspólny czynnik $2 \cdot 2^{2x+1}$ przed nawias. Z pierwszego składnika zostaje $1$, z drugiego $(2x+1)\ln 2$.`,
        k: [R`2 \cdot 2^{2x+1} = 2 \cdot 2^{2x+1} \cdot 1`, R`(2x+1) \cdot 2 \cdot 2^{2x+1}\ln 2 = 2 \cdot 2^{2x+1} \cdot (2x+1)\ln 2`] },
      { e: 5, t: R`= 2^{2x+2}\left(1 + (2x+1)\ln 2\right)`, typ: 'd', o: R`Jeśli chcesz, zapisz $2 \cdot 2^{2x+1}$ jako jedną potęgę.`,
        k: [R`2 \cdot 2^{2x+1} = 2^{1 + 2x + 1} = 2^{2x+2}`] },
    ],
  },
  v: {
    f: R`f(x) = e^{-\frac{x^2}{2}}`, leg: LEG.wykladnicza,
    wynik: R`-xe^{-\frac{x^2}{2}}`,
    linie: [
      { e: 2, t: R`f(x) = e^{\mG{g}{-\frac{x^2}{2}}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: $e^{\square}$ z wykładnikiem $\cG{-\frac{x^2}{2}}$. To nie sam $x$, więc funkcja złożona — reguła 5.`, kiedy: BEZ_PRZYG,
        d: R`Test ostatniego działania: przy $x = 2$ liczysz $-\frac{2^2}{2} = -2$, a na końcu $e^{-2}$. Ostatnie działanie to $e^{\square}$ z czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.eksp, r: 'reguła 5 · wzór 5', o: SZ_O(5) },
      { e: 3, t: R`\left(-\tfrac12 x^2\right)' = -\tfrac12 \cdot 2x = \mG{gp}{-x}`, typ: 'p', r: 'reguła 1 · wzór 3',
        o: R`Policz pochodną wykładnika: $-\frac{x^2}{2} = -\tfrac12 x^2$, stała zostaje z przodu, a $(x^2)' = 2x$.`, k: [R`-\tfrac12 \cdot 2 = -1`] },
      { e: 4, wst: true, opisy: OPISY.eksp, typ: 'd', r: 'reguła 5 · wzór 5', o: WST_EKSP,
        t: R`f'(x) = e^{\mG{g}{-\frac{x^2}{2}}} \cdot (\mG{gp}{-x})` },
      { e: 5, t: R`= -xe^{-\frac{x^2}{2}}`, typ: 'd', o: R`Uporządkuj: $-x$ piszesz na początku.` },
    ],
  },
  w: {
    f: R`f(x) = \frac{\ln x}{e^x}`, leg: LEG.iloraz,
    wynik: R`\frac{1 - x\ln x}{xe^x}`,
    linie: [
      { e: 2, t: R`f(x) = \frac{\mF{f}{\ln x}}{\mG{g}{e^x}}`, typ: 'f', r: 'reguła 4 · iloraz',
        o: R`Rozpoznaj regułę i nazwij kawałki: licznik to $\cF{\ln x}$, mianownik to $\cG{e^x}$.`,
        kiedy: R`Zaczynamy od rozpoznania. Pod kreską stoi $e^x$ — klocek z tabeli, a nie potęga $x$ ani pierwiastek — więc nie ma czego zamieniać na potęgę. Ułamek liczymy wprost regułą ilorazu.`,
        d: R`Test ostatniego działania: przy $x = 2$ liczysz $\ln 2$ i osobno $e^2$, a na końcu dzielisz. Ostatnie działanie to dzielenie — reguła 4.` },
      { e: 2, typ: 'sz', ...SZ.iloraz, r: 'reguła 4', o: SZ_O(4) },
      { e: 3, t: R`(\ln x)' = \mF{fp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną licznika.' },
      { e: 3, t: R`(e^x)' = \mG{gp}{e^x}`, typ: 'p', r: 'wzór 5', o: 'Policz pochodną mianownika.' },
      { e: 4, wst: true, opisy: OPISY.iloraz, z: { g2: 'g' }, typ: 'd', r: 'reguła 4', o: WST_ILORAZ,
        t: R`f'(x) = \frac{\mF{fp}{\frac1x} \cdot \mG{g}{e^x} - \mF{f}{\ln x} \cdot \mG{gp}{e^x}}{(\mG{g2}{e^x})^2}` },
      { e: 5, t: R`= \frac{\mN{r1}{\frac1x} \cdot \mN{w1}{e^x} - \mN{r2}{\ln x} \cdot \mN{w2}{e^x}}{e^{2x}}`, typ: 'd',
        o: R`Policz mianownik: $(e^x)^2 = e^{2x}$. W liczniku zostaw iloczyny tak, jak są — zaraz z nich skorzystasz.`, k: [R`(e^x)^2 = e^{2x}`],
        d: 'Przy potędze potęgi wykładniki się mnożą: $x \\cdot 2 = 2x$.' },
      { e: 5, z: { w: ['w1', 'w2'] }, t: R`= \frac{\mN{w}{e^x}\left(\mN{r1}{\frac1x} - \mN{r2}{\ln x}\right)}{e^{2x}}`, typ: 'd',
        o: R`Wyłącz wspólny czynnik $e^x$ w liczniku. Oba $e^x$ trafiają przed nawias; w nawiasie zostaje $\frac1x$ z pierwszego składnika i $\ln x$ z drugiego.` },
      { e: 5, t: R`= \frac{\frac1x - \ln x}{e^x}`, typ: 'd', o: R`Skróć $e^x$ z licznika z jednym $e^x$ z mianownika.`, k: [R`\frac{e^x}{e^{2x}} = \frac{1}{e^x}`],
        d: 'Przy dzieleniu potęg o tej samej podstawie wykładniki się odejmują: $2x - x = x$.' },
      { e: 5, t: R`= \frac{1 - x\ln x}{xe^x}`, typ: 'd', o: R`Pomnóż licznik i mianownik przez $x$, żeby pozbyć się ułamka w liczniku.`,
        k: [R`\left(\tfrac1x - \ln x\right) \cdot x = 1 - x\ln x`, R`e^x \cdot x = xe^x`] },
    ],
  },
  x: {
    f: R`f(x) = e^x\ln(2x)`, leg: LEG.iloczyn,
    wynik: R`e^x\left(\ln(2x) + \frac1x\right)`,
    linie: [
      { e: 2, t: R`f(x) = \mF{f}{e^x} \cdot \mG{g}{\ln(2x)}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Rozpoznaj regułę i nazwij kawałki: pierwszy to $\cF{e^x}$, drugi to $\cG{\ln(2x)}$.`, kiedy: BEZ_PRZYG,
        d: R`Test: przy $x = 1$ liczysz $e^1$ i osobno $\ln 2$, a na końcu mnożysz — reguła 3.` },
      { e: 2, typ: 'sz', ...SZ.iloczyn, r: 'reguła 3', o: SZ_O(3) },
      { e: 3, t: R`(e^x)' = \mF{fp}{e^x}`, typ: 'p', r: 'wzór 5', o: 'Policz pochodną pierwszego kawałka.' },
      { e: 3, t: R`\left(\ln(2x)\right)' = \frac{1}{2x} \cdot (2x)'`, typ: 'p', r: 'reguła 5 · wzór 7',
        o: R`Policz pochodną drugiego kawałka. To funkcja złożona: $\ln\square$ ze środkiem $2x$. Pochodna $\ln\square$ to $\frac{1}{\square}$, potem razy pochodna środka.` },
      { e: 3, t: R`= \frac{1}{2x} \cdot 2 = \mG{gp}{\frac1x}`, typ: 'p', r: 'reguła 1 · wzór 2', o: R`Podstaw $(2x)' = 2$ i skróć.`,
        k: [R`(2x)' = 2 \cdot 1 = 2`, R`\frac{1}{2x} \cdot 2 = \frac{2}{2x} = \frac1x`] },
      { e: 4, wst: true, opisy: OPISY.iloczyn, typ: 'd', r: 'reguła 3', o: WST_ILOCZYN,
        t: R`f'(x) = \mF{fp}{e^x} \cdot \mG{g}{\ln(2x)} + \mF{f}{e^x} \cdot \mG{gp}{\frac1x}` },
      { e: 5, z: { w: ['fp', 'f'], r1: 'g', r2: 'gp' }, t: R`= \mN{w}{e^x}\left(\mN{r1}{\ln(2x)} + \mN{r2}{\frac1x}\right)`, typ: 'd',
        o: R`Wyłącz wspólny czynnik $e^x$ przed nawias. Oba $e^x$ trafiają przed nawias; w nawiasie zostaje $\ln(2x)$ z pierwszego składnika i $\frac1x$ z drugiego.` },
    ],
  },
  y: {
    f: R`f(x) = x^x`, leg: LEG.wykladnicza,
    wynik: R`x^x(\ln x + 1)`,
    linie: [
      { e: 1, t: R`f(x) = x^x = e^{\ln(x^x)} = e^{x\ln x}`, typ: 'f', r: 'logarytmy', o: R`Zapisz $x^x$ jako potęgę liczby $e$.`,
        kiedy: R`To przygotowanie jest konieczne: do $x^x$ nie pasuje żaden wzór z tabeli. Wzór 3 ($x^n$) wymaga stałego wykładnika, a wzór 4 ($a^x$) — stałej podstawy. Do $e^{\square}$ wzór jest.`,
        d: R`Każdą liczbę dodatnią $a$ można zapisać jako $e^{\ln a}$ — logarytm naturalny to właśnie wykładnik, do którego trzeba podnieść $e$, żeby dostać $a$. Potem $\ln(x^x) = x\ln x$: wykładnik wychodzi przed logarytm.` },
      { e: 2, t: R`f(x) = e^{\mG{g}{x\ln x}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: $e^{\square}$ z wykładnikiem $\cG{x\ln x}$ — to nie sam $x$, więc funkcja złożona (reguła 5).`,
        d: R`Test ostatniego działania: przy $x = 2$ liczysz $2\ln 2$, a na końcu $e^{2\ln 2}$. Ostatnie działanie to $e^{\square}$ z czegoś, co nie jest samym $x$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.eksp, r: 'reguła 5 · wzór 5', o: SZ_O(5) },
      { e: 3, t: R`(x\ln x)' = (x)' \cdot \ln x + x \cdot (\ln x)'`, typ: 'p', r: 'reguła 3',
        o: `Policz pochodną wykładnika — to iloczyn, ten sam co w przykładzie q). Zapisz regułę 3 z tymi czynnikami — ${KRESKA}.` },
      { e: 3, t: R`= 1 \cdot \ln x + x \cdot \tfrac1x = \mG{gp}{\ln x + 1}`, typ: 'p', r: 'wzory 2, 7',
        o: 'Podstaw pochodne czynników i policz.', k: [R`(x)' = 1`, R`(\ln x)' = \tfrac1x`, R`x \cdot \tfrac1x = 1`] },
      { e: 4, wst: true, opisy: OPISY.eksp, typ: 'd', r: 'reguła 5 · wzór 5', o: WST_EKSP,
        t: R`f'(x) = e^{\mG{g}{x\ln x}} \cdot (\mG{gp}{\ln x + 1})` },
      { e: 5, t: R`= x^x(\ln x + 1)`, typ: 'd', o: R`Wróć do zapisu $x^x$: $e^{x\ln x} = x^x$.` },
    ],
  },
  z171e: {
    f: R`f(x) = \sqrt{\frac{x^2+5}{x^2-5}}`, leg: LEG.zlozona, pkt: [2.5, 3, 4, -3],
    wynik: R`\frac{-10x}{(x^2+5)^{\frac12}(x^2-5)^{\frac32}}`,
    linie: [
      { e: 1, t: R`\begin{aligned} f(x) &= \sqrt{\frac{x^2+5}{x^2-5}} \\ &= \left(\frac{x^2+5}{x^2-5}\right)^{\frac12} \end{aligned}`, typ: 'f', r: 'potęgi',
        o: R`Zapisz pierwiastek jako potęgę $\tfrac12$.`, kiedy: PRZYG_POT },
      { e: 2, t: R`f(x) = \left(\mG{g}{\frac{x^2+5}{x^2-5}}\right)^{\mH{n}{\frac12}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: potęga, w której środku stoi ułamek $\cG{\frac{x^2+5}{x^2-5}}$ — funkcja złożona (reguła 5). Wykładnik to $\cH{\tfrac12}$.`,
        d: R`Test ostatniego działania: przy $x = 3$ liczysz $\frac{9+5}{9-5} = \frac{14}{4}$, a na końcu pierwiastek, czyli potęgę $\tfrac12$ — reguła 5.` },
      { e: 2, typ: 'sz', ...SZ.potega(R`\tfrac12`, R`\frac12`), r: 'reguła 5 · wzór 3', o: SZ_O(5) },
      { e: 3, t: R`\begin{aligned} &\left(\frac{x^2+5}{x^2-5}\right)' \\ &= \frac{(x^2+5)' \cdot (x^2-5) - (x^2+5) \cdot (x^2-5)'}{(x^2-5)^2} \end{aligned}`, typ: 'p', r: 'reguła 4',
        tm: R`\begin{aligned} &\left(\frac{x^2+5}{x^2-5}\right)' \\ &= \dfrac{\begin{gathered} (x^2+5)' \cdot (x^2-5) \\ - (x^2+5) \cdot (x^2-5)' \end{gathered}}{(x^2-5)^2} \end{aligned}`,
        o: `Policz pochodną środka. Środek to iloraz: licznik $x^2 + 5$, mianownik $x^2 - 5$. Zapisz regułę 4 z tymi kawałkami — ${KRESKA}.` },
      { e: 3, t: R`= \frac{2x(x^2-5) - (x^2+5) \cdot 2x}{(x^2-5)^2}`, typ: 'p', r: 'reguła 2 · wzory 1, 3',
        o: 'Policz pochodne licznika i mianownika i podstaw je w miejsca z kreską. Obie wynoszą $2x$.',
        k: [R`(x^2 + 5)' = 2x + 0 = 2x`, R`(x^2 - 5)' = 2x - 0 = 2x`] },
      { e: 3, t: R`= \frac{2x^3 - 10x - 2x^3 - 10x}{(x^2-5)^2}`, typ: 'p', o: 'Wymnóż nawiasy w liczniku.',
        k: [R`2x(x^2-5) = 2x^3 - 10x`, R`(x^2+5) \cdot 2x = 2x^3 + 10x`, R`-(2x^3 + 10x) = -2x^3 - 10x`] },
      { e: 3, t: R`= \mG{gp}{\frac{-20x}{(x^2-5)^2}}`, typ: 'p', o: 'Zredukuj wyrazy podobne.', k: [R`2x^3 - 2x^3 = 0`, R`-10x - 10x = -20x`] },
      { e: 4, wst: true, opisy: OPISY.potega, typ: 'd', r: 'reguła 5 · wzór 3', o: WST_POTEGA,
        t: R`\begin{aligned} f'(x) &= \mH{n}{\tfrac12}\left(\mG{g}{\frac{x^2+5}{x^2-5}}\right)^{\mH{n}{\frac12} - 1} \\ &\quad \cdot \mG{gp}{\frac{-20x}{(x^2-5)^2}} \end{aligned}` },
      { e: 5, t: R`= \tfrac12 \cdot \frac{(x^2-5)^{\frac12}}{(x^2+5)^{\frac12}} \cdot \frac{-20x}{(x^2-5)^2}`, typ: 'd',
        o: R`Policz nowy wykładnik: $\tfrac12 - 1 = -\tfrac12$. Potęga $-\tfrac12$ odwraca ułamek.`, k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`],
        d: R`$\left(\frac{a}{b}\right)^{-\frac12} = \frac{b^{\frac12}}{a^{\frac12}}$ — minus w wykładniku zamienia licznik z mianownikiem.` },
      { e: 5, t: R`= \frac{-10x}{(x^2+5)^{\frac12}(x^2-5)^{\frac32}}`, typ: 'd', o: R`Pomnóż liczby, a potęgi $x^2 - 5$ podziel: wykładniki się odejmują.`,
        k: [R`\tfrac12 \cdot (-20x) = -10x`, R`2 - \tfrac12 = \tfrac42 - \tfrac12 = \tfrac32`],
        d: R`W liczniku jest $(x^2-5)^{\frac12}$, w mianowniku $(x^2-5)^2$. Przy dzieleniu potęg o tej samej podstawie wykładniki się odejmują, więc w mianowniku zostaje $(x^2-5)^{2 - \frac12} = (x^2-5)^{\frac32}$.` },
    ],
  },
};

// plany do przykładów zwiniętych w <details> (komponent Przyklad): cel jest zawsze ten sam — wzór na f'(x),
// plan mówi w jednym–dwóch zdaniach, którą drogą idziemy i dlaczego
export const PLANY = {
  r: R`Ostatnie działanie to dodawanie, więc każdy składnik liczymy osobno (reguła 2). Każdy składnik to $e^{\square}$ z wykładnikiem innym niż sam $x$ — funkcja złożona: potęgę przepisujemy i mnożymy przez pochodną wykładnika. Dlatego r) jest w tej sekcji.`,
  v: R`Funkcja złożona: $e^{\square}$ z wykładnikiem $-\frac{x^2}{2}$. Potęgę przepisujemy bez zmian i mnożymy przez pochodną wykładnika, policzoną z boku.`,
  o: R`Najpierw zamieniamy ułamek z pierwiastkiem na jedną potęgę — wtedy wystarczy reguła 5 zamiast reguły ilorazu. Środek to $x^2 + 1$.`,
  e: R`Ułamek zamieniamy na potęgę z minusem. Zostaje potęga ze środkiem $\ln x$ (reguła 5), a minus przed całością czeka z przodu (reguła 1).`,
  i: R`Pierwiastek z potęgi zapisujemy jako jedną potęgę $\frac23$. Potem reguła 5 ze środkiem $\ln x$.`,
  m: R`Najpierw rozszyfrowujemy zapis $\ln^2$ — to kwadrat całego logarytmu. Potem reguła 5 ze środkiem $\ln(2x)$, a pochodną środka liczymy z boku — znowu regułą 5.`,
  l: R`Trzy warstwy: potęga, w niej logarytm, a w nim $2x + 1$. Reguła 5 dla potęgi, a pochodną środka liczymy z boku — znowu regułą 5.`,
  d: R`Potęga, w której środku stoi ułamek. Reguła 5 dla potęgi, a pochodną środka liczymy z boku regułą ilorazu.`,
  k: R`Pierwiastek zapisujemy jako potęgę $\frac12$. Środek to ten sam ułamek co w d), więc jego pochodną liczymy tak samo — regułą ilorazu.`,
  x: R`Iloczyn $e^x$ i $\ln(2x)$ (reguła 3). Pochodną drugiego czynnika liczymy z boku regułą 5. Na końcu wyłączamy wspólny czynnik $e^x$.`,
  j: R`Iloczyn $x^2$ i $\ln(x^2)$ (reguła 3). Pochodną $\ln(x^2)$ liczymy z boku regułą 5. Na końcu wyłączamy wspólny czynnik $2x$.`,
  p: R`Pierwiastek zapisujemy jako potęgę. Potem iloczyn (reguła 3), w którym drugi czynnik to funkcja złożona — jego pochodną liczymy z boku regułą 5.`,
  u: R`Iloczyn (reguła 3). Pochodną drugiego czynnika, $2^{2x+1}$, liczymy z boku wzorem 4 z regułą 5 — w wykładniku nie stoi sam $x$.`,
  t: R`Stała $\frac13$ czeka z przodu (reguła 1), a reszta to $e^{\square}$ z wykładnikiem $\ln x + x^2$ (reguła 5). Na końcu upraszczamy $e^{\ln x}$.`,
  g: R`Suma dwóch składników (reguła 2): pierwszy to potęga ze środkiem $\ln x$ (reguła 5), drugi — zwykła potęga (wzór 3).`,
  h: R`Najpierw przygotowujemy drugi składnik: $\ln(x^3) = 3\ln x$. Potem suma (reguła 2): pierwszy składnik regułą 5, drugi wprost z tabeli.`,
};

// krótkie rachunki do sekcji z regułami (poza listą)
export const PRZYKLADY = {
  // cały przepis na jednym przykładzie: √x · ln x (sekcja „Przepis na każdą pochodną”)
  przepis: {
    f: R`f(x) = \sqrt{x}\ln x`, leg: LEG.iloczyn,
    linie: [
      { e: 1, t: R`f(x) = \sqrt{x} \cdot \ln x = x^{\frac12} \cdot \ln x`, typ: 'f', r: 'potęgi',
        o: R`Zapisz pierwiastek jako potęgę: $\sqrt{x} = x^{\frac12}$.`,
        kiedy: R`To pierwszy ruch, bo do potęgi jest gotowy wzór 3, a do pierwiastka w tabeli osobnego wzoru nie ma.`,
        d: R`Pierwiastek kwadratowy to potęga $\tfrac12$.` },
      { e: 2, t: R`f(x) = \mF{f}{x^{\frac12}} \cdot \mG{g}{\ln x}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Wybierz regułę i nazwij kawałki: pierwszy to $\cF{x^{\frac12}}$, drugi to $\cG{\ln x}$.`,
        d: R`Test ostatniego działania: przy $x = 4$ liczysz $4^{\frac12} = 2$ i osobno $\ln 4$, a na końcu mnożysz. Ostatnie działanie to mnożenie — więc reguła 3.` },
      { e: 2, typ: 'sz', ...SZ.iloczyn, r: 'reguła 3', o: 'Zapisz szablon reguły 3 słowami.',
        d: 'Szablon mówi, czego potrzebujesz: pochodnej pierwszego kawałka i pochodnej drugiego. Policzysz je teraz z boku.' },
      { e: 3, t: R`(x^{\frac12})' = \tfrac12 x^{\frac12 - 1} = \mF{fp}{\tfrac12 x^{-\frac12}}`, typ: 'p', r: 'wzór 3',
        o: 'Policz pochodną pierwszego kawałka: wykładnik schodzi przed $x$, w wykładniku zostaje o $1$ mniej.',
        k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`] },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną drugiego kawałka — jest wprost w tabeli.' },
      { e: 4, wst: true, opisy: OPISY.iloczyn, typ: 'd', r: 'reguła 3',
        t: R`f'(x) = \mF{fp}{\tfrac12 x^{-\frac12}} \cdot \mG{g}{\ln x} + \mF{f}{x^{\frac12}} \cdot \mG{gp}{\tfrac1x}`,
        tm: R`\begin{aligned} f'(x) = &\ \mF{fp}{\tfrac12 x^{-\frac12}} \cdot \mG{g}{\ln x} \\ &+ \mF{f}{x^{\frac12}} \cdot \mG{gp}{\tfrac1x} \end{aligned}`,
        o: 'Wstaw kawałki w szablon. Każdy kolor trafia w swoje miejsce: turkusowe tam, gdzie „pierwszy”, złote tam, gdzie „drugi”.' },
      { e: 5, t: R`= \tfrac12 x^{-\frac12}\ln x + x^{-\frac12}`, typ: 'd', r: 'potęgi',
        o: R`Uprość drugi składnik: $x^{\frac12} \cdot \frac1x$ to jedna potęga.`,
        k: [R`\tfrac1x = x^{-1}`, R`x^{\frac12} \cdot x^{-1} = x^{\frac12 - 1} = x^{-\frac12}`],
        d: R`Przy mnożeniu potęg tej samej podstawy wykładniki się dodają: $\tfrac12 + (-1) = -\tfrac12$.` },
      { e: 5, t: R`= \frac{\ln x}{2\sqrt{x}} + \frac{1}{\sqrt{x}} = \frac{\ln x + 2}{2\sqrt{x}}`, typ: 'd',
        o: R`Zapisz bez potęg z minusem i sprowadź do wspólnego mianownika $2\sqrt{x}$.`,
        k: [R`x^{-\frac12} = \frac{1}{\sqrt{x}}`, R`\frac{1}{\sqrt{x}} = \frac{2}{2\sqrt{x}}`],
        d: R`Potęga $-\tfrac12$ to „jedynka przez pierwiastek”. Drugi ułamek rozszerzasz przez $2$, żeby oba miały na dole $2\sqrt{x}$.` },
    ],
  },
  // skąd wzór (x²)' = 2x: iloraz różnicowy z literami (sekcja „Skąd się bierze wzór”); sprawdzany osobno
  x2: {
    f: R`f(x) = x^2`,
    linie: [
      { t: R`\frac{\Delta y}{\Delta x} = \frac{f(x_0 + \cH{\Delta x}) - f(x_0)}{\cH{\Delta x}} = \frac{(x_0 + \cH{\Delta x})^2 - x_0^2}{\cH{\Delta x}}`, typ: 'x',
        tm: R`\begin{aligned} \frac{\Delta y}{\Delta x} &= \frac{f(x_0 + \cH{\Delta x}) - f(x_0)}{\cH{\Delta x}} \\ &= \frac{(x_0 + \cH{\Delta x})^2 - x_0^2}{\cH{\Delta x}} \end{aligned}`,
        o: R`Zapisz nachylenie siecznej tak jak w tabeli, ale literami: start w $x_0$, krok w prawo $\cH{\Delta x}$.`,
        kiedy: R`Liczby z tabeli dały „$2$ razy punkt”. Litery pokażą, że tak jest w każdym punkcie, a nie tylko w $1$, $2$ i $3$.`,
        d: R`Wartość na końcu: $f(x_0 + \Delta x) = (x_0 + \Delta x)^2$. Wartość na starcie: $f(x_0) = x_0^2$. Ich różnica to $\Delta y$.` },
      { t: R`= \frac{x_0^2 + 2x_0\cH{\Delta x} + (\cH{\Delta x})^2 - x_0^2}{\cH{\Delta x}}`, typ: 'x',
        o: 'Rozpisz kwadrat sumy wzorem z liceum.', k: [R`(a + b)^2 = a^2 + 2ab + b^2`],
        d: R`Za $a$ wstawiasz $x_0$, za $b$ — $\Delta x$. Wychodzi $x_0^2 + 2x_0\Delta x + (\Delta x)^2$.` },
      { t: R`= \frac{2x_0\cH{\Delta x} + (\cH{\Delta x})^2}{\cH{\Delta x}}`, typ: 'x',
        o: R`Skreśl $x_0^2$ i $-x_0^2$ — razem dają $0$.` },
      { t: R`= 2x_0 + \cH{\Delta x}`, typ: 'x', o: R`Podziel każdy składnik licznika przez $\Delta x$.`,
        k: [R`\frac{2x_0\Delta x}{\Delta x} = 2x_0`, R`\frac{(\Delta x)^2}{\Delta x} = \Delta x`],
        d: R`Dzielić wolno, bo $\Delta x$ to krok w prawo — mały, ale nie zero. Sprawdź z tabelą: dla $x_0 = 3$ i $\Delta x = 0{,}01$ wychodzi $2 \cdot 3 + 0{,}01 = 6{,}01$.` },
      { t: R`f'(x_0) = \lim_{\cH{\Delta x} \to 0} \left(2x_0 + \cH{\Delta x}\right) = 2x_0`, typ: 'x',
        o: R`Zmniejszaj krok do zera: składnik $\Delta x$ znika, zostaje $2x_0$.`,
        d: R`To dokładnie to, co pokazała tabela: $2{,}01 \to 2$, $4{,}01 \to 4$, $6{,}01 \to 6$. Pochodna $x^2$ w punkcie $x_0$ to $2x_0$.` },
    ],
  },
  pot1: {
    f: R`f(x) = 3x^4`, leg: [['cyan', 'liczba przed $x$'], ...LEG.potega],
    linie: [
      { e: 2, t: R`f(x) = \mF{s}{3}x^{\mH{n}{4}}`, typ: 'f', r: 'wzór 3 · reguła 1',
        o: R`Odczytaj liczbę przed $x$ ($\cF{3}$) i wykładnik ($\cH{4}$). To liczba razy potęga — wzór 3 z regułą 1.`,
        kiedy: 'Zaczynamy od rozpoznania, bo funkcja jest już liczbą razy potęga — nie ma czego przygotowywać.' },
      { e: 2, typ: 'sz', ...SZ.potegaS, r: 'wzór 3 · reguła 1', o: 'Zapisz szablon: liczba czeka z przodu, wykładnik schodzi przed $x$, w wykładniku zostaje o $1$ mniej.' },
      { e: 4, wst: true, opisy: { s: 'liczba przed x', n: 'wykładnik' }, t: R`f'(x) = \mF{s}{3} \cdot \mH{n}{4} \cdot x^{\mH{n}{4} - 1}`, typ: 'd', r: 'wzór 3 · reguła 1',
        o: 'Wstaw liczbę i wykładnik do szablonu. Fioletowy wykładnik ląduje w dwóch miejscach.', kiedy: BEZ_ETAPU_3 },
      { e: 5, t: R`= 12x^{3}`, typ: 'd', o: 'Policz liczbę przed $x$ i nowy wykładnik.', k: [R`3 \cdot 4 = 12`, R`4 - 1 = 3`] },
    ],
  },
  pot2: {
    f: R`f(x) = x^{\frac43}`, leg: LEG.potega,
    linie: [
      { e: 2, t: R`f(x) = x^{\mH{n}{\frac43}}`, typ: 'f', r: 'wzór 3', o: R`Odczytaj wykładnik: to ułamek $\cH{\tfrac43}$ — wzór 3 działa tak samo.`,
        kiedy: 'Zaczynamy od rozpoznania, bo funkcja jest już potęgą.' },
      { e: 2, typ: 'sz', ...SZ.potegaW, r: 'wzór 3', o: 'Zapisz szablon wzoru 3.' },
      { e: 4, wst: true, opisy: { n: 'wykładnik' }, t: R`f'(x) = \mH{n}{\tfrac43} \cdot x^{\mH{n}{\frac43} - 1}`, typ: 'd', r: 'wzór 3',
        o: R`Wstaw wykładnik do szablonu: przed $x$ i do wykładnika.` },
      { e: 5, t: R`= \tfrac43 x^{\frac13}`, typ: 'd', o: R`Odejmij $1$ od ułamka: zapisz $1$ jako $\tfrac33$.`, k: [R`\tfrac43 - 1 = \tfrac43 - \tfrac33 = \tfrac13`] },
      { e: 5, t: R`= \tfrac43\sqrt[3]{x}`, typ: 'd', o: R`Zapisz potęgę $\tfrac13$ jako pierwiastek trzeciego stopnia.` },
    ],
  },
  ilo1: {
    f: R`f(x) = \frac{x}{x+1}`, leg: LEG.iloraz,
    linie: [
      { e: 2, t: R`f(x) = \frac{\mF{f}{x}}{\mG{g}{x+1}}`, typ: 'f', r: 'reguła 4 · iloraz', o: R`Rozpoznaj regułę i nazwij kawałki: licznik to $\cF{x}$, mianownik to $\cG{x + 1}$.`,
        kiedy: R`Zaczynamy od rozpoznania. Pod kreską stoi $x + 1$, a nie sama potęga $x$ — zamiana na potęgę nic by tu nie uprościła.`,
        d: R`Test ostatniego działania: przy $x = 1$ liczysz osobno $1$ i $1 + 1 = 2$, a na końcu dzielisz. Ostatnie działanie to dzielenie — reguła 4.` },
      { e: 2, typ: 'sz', ...SZ.iloraz, r: 'reguła 4', o: 'Zapisz szablon reguły 4 słowami. Pokazuje, jakich kawałków potrzebujesz i gdzie trafi każdy z nich.' },
      { e: 3, t: R`(x)' = \mF{fp}{1}`, typ: 'p', r: 'wzór 2', o: 'Policz pochodną licznika.' },
      { e: 3, t: R`(x+1)' = 1 + 0 = \mG{gp}{1}`, typ: 'p', r: 'reguła 2 · wzory 1, 2', o: 'Policz pochodną mianownika.' },
      { e: 4, wst: true, opisy: OPISY.iloraz, z: { g2: 'g' }, typ: 'd', r: 'reguła 4',
        o: 'Wstaw kawałki w szablon — po kolei, każdy w swoje miejsce. Kolejność w liczniku ma znaczenie: zaczynasz od pochodnej licznika.',
        t: R`f'(x) = \frac{\mF{fp}{1} \cdot \mG{g}{(x+1)} - \mF{f}{x} \cdot \mG{gp}{1}}{(\mG{g2}{x+1})^2}` },
      { e: 5, t: R`= \frac{x + 1 - x}{(x+1)^2} = \frac{1}{(x+1)^2}`, typ: 'd', o: 'Policz oba iloczyny w liczniku i odejmij. Mianownika do kwadratu nie wymnażasz.',
        k: [R`1 \cdot (x+1) = x + 1`, R`x \cdot 1 = x`, R`x + 1 - x = 1`] },
    ],
  },
  c2: {
    f: R`f(x) = \frac{2}{\ln x}`, leg: LEG.zlozona,
    linie: [
      { e: 1, t: R`f(x) = \frac{2}{\ln x} = 2(\ln x)^{-1}`, typ: 'f', r: 'potęgi', o: R`Zapisz ułamek jako stałą razy potęgę: $\frac{2}{\square} = 2\square^{-1}$.`,
        kiedy: R`To przygotowanie zmienia regułę: zamiast ilorazu masz potęgę ze środkiem $\ln x$.` },
      { e: 2, t: R`f(x) = 2(\mG{g}{\ln x})^{\mH{n}{-1}}`, typ: 'f', r: 'reguły 1, 5 · złożona',
        o: R`Rozpoznaj regułę i nazwij kawałki: stała $2$ czeka z przodu (reguła 1), a reszta to potęga ze środkiem $\cG{\ln x}$ (reguła 5). Wykładnik to $\cH{-1}$.` },
      { e: 2, typ: 'sz', ...SZ.potega('(-1)', '-1', R`2 \cdot `), r: 'reguły 1, 5 · wzór 3', o: 'Zapisz szablon reguły 5; stała $2$ czeka z przodu.' },
      { e: 3, t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pochodną środka — jest w tabeli.' },
      { e: 4, wst: true, opisy: OPISY.potega, t: R`f'(x) = 2 \cdot \mH{n}{(-1)} \cdot (\mG{g}{\ln x})^{\mH{n}{-1} - 1} \cdot \mG{gp}{\tfrac1x}`, typ: 'd', r: 'reguły 1, 5 · wzory 3, 7',
        o: 'Wstaw kawałki w szablon: wykładnik, środek bez zmian i pochodną środka.' },
      { e: 5, t: R`= -2(\ln x)^{-2} \cdot \frac1x = -\frac{2}{x(\ln x)^2}`, typ: 'd', o: 'Policz i zapisz bez potęgi z minusem — wynik jest ten sam co regułą ilorazu.', k: [R`2 \cdot (-1) = -2`, R`-1 - 1 = -2`] },
    ],
  },
};

// do tabeli „wszystkie odpowiedzi”: kolejność i przypisanie do sekcji (kotwic) modułu
export const KOLEJNOSC = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z171e'];
export const ETYKIETA = (id) => (id === 'z171e' ? 'str. 171, e)' : `${id})`);

// ---------- rysunek „od siecznej do stycznej”: f(x) = x², x₀ = 1 ----------
// dokładne wartości liczone na ułamkach dziesiętnych (pomnożone przez 10 000, żeby uniknąć błędów zaokrągleń)
const fmt = (v) => {
  const s = (Math.round(v * 10000) / 10000).toString().replace('.', ',');
  return s.replace(/^-/, '−');
};
const fmtTex = (v) => fmt(v).replace(',', '{,}').replace('−', '-');
export function sieczna() {
  const x0 = 1, f = (x) => x * x;
  const kroki = [1, 0.5, 0.1, 0.01].map((dx) => {
    const x1 = x0 + dx;
    const fx1 = Math.round(f(x1) * 10000) / 10000;
    const dy = Math.round((fx1 - f(x0)) * 10000) / 10000;
    const q = Math.round((dy / dx) * 10000) / 10000;
    return { dx, x1, fx1, dy, q, t: { dx: fmt(dx), x1: fmt(x1), fx1: fmt(fx1), dy: fmt(dy), q: fmt(q) },
      tx: { dx: fmtTex(dx), x1: fmtTex(x1), fx1: fmtTex(fx1), dy: fmtTex(dy), q: fmtTex(q) } };
  });
  return { x0, fx0: f(x0), kroki, granica: 2 };
}

// ---------- „skąd 2x”: nachylenie siecznej dla Δx = 0,01 w punktach 1, 2, 3 ----------
export function wzor2x() {
  const dx = 0.01;
  return [1, 2, 3].map((x0) => {
    const x1 = Math.round((x0 + dx) * 100) / 100;
    const fx1 = Math.round(x1 * x1 * 10000) / 10000;
    const dy = Math.round((fx1 - x0 * x0) * 10000) / 10000;
    const q = Math.round((dy / dx) * 10000) / 10000;
    return { x0, fx0: x0 * x0, x1, fx1, dy, q, gr: 2 * x0,
      tx: { x1: fmtTex(x1), fx1: fmtTex(fx1), dy: fmtTex(dy), q: fmtTex(q) } };
  });
}

// ---------- rysunek „styczna i znak pochodnej”: f(x) = x³/3 − x, f'(x) = x² − 1 ----------
export function styczna() {
  const f = (x) => x ** 3 / 3 - x, fp = (x) => x * x - 1;
  const punkty = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2].map((x0) => {
    const k = Math.round(fp(x0) * 10000) / 10000;
    const kw = Math.round(x0 * x0 * 10000) / 10000;
    const znak = k > 0 ? 'plus' : k < 0 ? 'minus' : 'zero';
    return { x0, y0: f(x0), k, kw, znak, t: { x0: fmt(x0), kw: fmt(kw), k: fmt(k) }, tx: { x0: fmtTex(x0), kw: fmtTex(kw), k: fmtTex(k) } };
  });
  return { punkty };
}

// ---------- ćwiczenia „wypełnij sam”: wzór 3 na ułamkach ----------
// każdy wiersz: funkcja a·x^n → pochodna (a·n)·x^(n−1); liczby jako [licznik, mianownik]
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const ul = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const ulTex = ([n, d], znak = true) => {
  const s = n < 0 ? '-' : '';
  const a = Math.abs(n);
  const v = d === 1 ? `${a}` : `\\tfrac{${a}}{${d}}`;
  return (znak ? s : '') + v;
};
const ulTxt = ([n, d]) => (n < 0 ? '−' : '') + (d === 1 ? `${Math.abs(n)}` : `${Math.abs(n)}/${d}`);
const razy = (a, b) => ul(a[0] * b[0], a[1] * b[1]);
const minus1 = (a) => ul(a[0] - a[1], a[1]);
const nawias = (a) => (a[0] < 0 ? `\\left(${ulTex(a)}\\right)` : ulTex(a));
// rachunek wykładnika na kartce: n − 1 = n − d/d = wynik
const rachWykl = (n) => {
  const w = minus1(n);
  if (n[1] === 1) return `${ulTex(n)} - 1 = ${ulTex(w)}`;
  return `${ulTex(n)} - 1 = ${ulTex(n)} - \\tfrac{${n[1]}}{${n[1]}} = ${ulTex(w)}`;
};
export function cwPotegi(wiersze) {
  return wiersze.map(({ f, a, n }) => {
    const A = ul(...a), N = ul(...n);
    const wsp = razy(A, N), wyk = minus1(N);
    return {
      f, wsp, wyk, wspTxt: ulTxt(wsp), wykTxt: ulTxt(wyk),
      wynik: `${ulTex(wsp)}${wyk[0] === wyk[1] ? 'x' : `x^{${ulTex(wyk)}}`}`,
      dlaWsp: A[0] === A[1] && A[1] === 1
        ? `Nowa liczba przed $x$ to sam wykładnik: $${ulTex(N)}$ — wcześniej przed $x$ nie stała żadna liczba (czyli $1$).`
        : `Nowa liczba przed $x$ = stara liczba przed $x$ razy wykładnik: $${ulTex(A)} \\cdot ${nawias(N)} = ${ulTex(wsp)}$.`,
      dlaWyk: `Nowy wykładnik = stary minus 1: $${rachWykl(N)}$.`,
    };
  });
}
// zamiana zapisu na potęgę: pole = wykładnik
export function cwZapis(wiersze) {
  return wiersze.map(({ t, n, jak }) => {
    const N = ul(...n);
    return { t, n: N, txt: ulTxt(N), tex: ulTex(N), jak };
  });
}
