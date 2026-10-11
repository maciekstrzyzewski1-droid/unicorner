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
  { nr: 1, nazwa: 'Wyłączenie stałej przed pochodną', t: R`(c \cdot f(x))' = c \cdot f'(x)` },
  { nr: 2, nazwa: 'Pochodna sumy i różnicy', t: R`(f(x) \pm g(x))' = f'(x) \pm g'(x)` },
  { nr: 3, nazwa: 'Pochodna iloczynu', t: R`(f(x) \cdot g(x))' = f'(x)g(x) + f(x)g'(x)` },
  { nr: 4, nazwa: 'Pochodna ilorazu', t: R`\left(\frac{f(x)}{g(x)}\right)' = \frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}` },
  { nr: 5, nazwa: 'Pochodna funkcji złożonej', t: R`[f(g(x))]' = f'(g(x)) \cdot g'(x)` },
];

export const LEG = {
  potega: [['fiolet', R`wykładnik: schodzi przed $x$, a w wykładniku zostaje o $1$ mniej`]],
  iloczyn: [['cyan', R`pierwszy czynnik i jego pochodna`], ['zloto', R`drugi czynnik i jego pochodna`]],
  iloraz: [['cyan', R`licznik i jego pochodna`], ['zloto', R`mianownik i jego pochodna`]],
  zlozona: [['zloto', R`środek i jego pochodna`], ['fiolet', R`wykładnik funkcji zewnętrznej`]],
  wykladnicza: [['zloto', R`wykładnik (środek) i jego pochodna`]],
};

// teksty powtarzane w wielu rachunkach
const ZEWN = 'Policz pochodną zewnętrznej (wzór 3, środek bez zmian) i pomnóż przez pochodną środka.';
const EKSP = R`Przepisz $e^{\square}$ bez zmian (wzór 5) i pomnóż przez pochodną wykładnika (reguła 5).`;
const WZ_ILOCZYN = 'Wstaw do wzoru: pochodna pierwszego razy drugi, plus pierwszy razy pochodna drugiego.';
const WZ_ILORAZ = 'Wstaw do wzoru: pochodna licznika razy mianownik, minus licznik razy pochodna mianownika — wszystko przez mianownik do kwadratu.';

// rachunki z listy zadań („Zadanie 1. Oblicz pochodną funkcji”, przykłady a–y) i jeden spoza listy (Zad. 1 e ze str. 171)
// Kawałki nazywamy słowami (pierwszy/drugi czynnik, licznik/mianownik, środek) i kolorem — litera f oznacza w zadaniu
// całą funkcję, więc nie używamy jej do nazywania kawałków (inaczej „f(x) = x” obok „f(x) = x ln x”).
export const LISTA = {
  a: {
    f: R`f(x) = \frac{2}{x^5} - \frac{1}{\sqrt{x}}`, leg: LEG.potega,
    wynik: R`-10x^{-6} + \tfrac12 x^{-\frac32} = -\frac{10}{x^6} + \frac{1}{2x\sqrt{x}}`,
    linie: [
      { t: R`f(x) = \frac{2}{x^5} - \frac{1}{\sqrt{x}}`, typ: 'f', r: 'reguła 2 · różnica', o: 'Przepisz funkcję.',
        d: R`To różnica dwóch składników — każdy policzysz osobno. Najpierw zamienisz oba na potęgi, bo do potęg jest gotowy wzór 3.` },
      { t: R`= 2 \cdot \frac{1}{x^5} - \frac{1}{x^{\frac12}}`, typ: 'f', r: 'potęgi', o: R`Wyciągnij stałą $2$ przed ułamek, a pierwiastek zapisz jako potęgę $\tfrac12$.`,
        d: R`$\frac{2}{x^5} = 2 \cdot \frac{1}{x^5}$ — stała przed ułamkiem zostanie przed pochodną (reguła 1). $\sqrt{x} = x^{\frac12}$ — pierwiastek kwadratowy to potęga $\tfrac12$.` },
      { t: R`= 2x^{\mH{n1}{-5}} - x^{\mH{n2}{-\frac12}}`, typ: 'f', r: 'potęgi', o: 'Zapisz „jedynkę przez potęgę” jako potęgę z minusem.',
        d: R`$\frac{1}{x^n} = x^{-n}$: potęga przechodzi z mianownika do licznika, a wykładnik zmienia znak. Teraz oba składniki mają postać „liczba razy $x^n$” i działa wzór 3.` },
      { t: R`\begin{aligned} f'(x) &= 2 \cdot \mH{n1}{(-5)} \cdot x^{\mH{n1}{-5} - 1} \\ &\quad - \mH{n2}{\left(-\tfrac12\right)} \cdot x^{\mH{n2}{-\frac12} - 1} \end{aligned}`, typ: 'd',
        r: 'wzór 3 · reguły 1, 2', o: R`Policz pochodną każdego składnika: wykładnik schodzi przed $x$, a nowy wykładnik jest o $1$ mniejszy.`,
        d: R`Wzór 3: $(x^n)' = n \cdot x^{n-1}$. Stała $2$ zostaje i mnoży wynik (reguła 1). Minus między składnikami zostaje (reguła 2).` },
      { t: R`= -10x^{-6} + \tfrac12 x^{-\frac32}`, typ: 'd', o: R`Policz współczynniki (liczby przed $x$) i wykładniki.`,
        k: [R`2 \cdot (-5) = -10`, R`-5 - 1 = -6`, R`-\left(-\tfrac12\right) = \tfrac12`, R`-\tfrac12 - 1 = -\tfrac12 - \tfrac22 = -\tfrac32`],
        d: R`Minus przed nawiasem i minus w nawiasie dają plus. Od ułamka odejmujesz $1$ zapisaną jako ułamek o tym samym mianowniku: $1 = \tfrac22$.` },
      { t: R`= -\frac{10}{x^6} + \frac{1}{2x\sqrt{x}}`, typ: 'd', o: 'Jeśli chcesz, wróć do zapisu z ułamkami i pierwiastkiem — oba zapisy są poprawne.',
        k: [R`x^{-6} = \frac{1}{x^6}`, R`\tfrac12 x^{-\frac32} = \frac{1}{2x^{\frac32}}`, R`x^{\frac32} = x^{1} \cdot x^{\frac12} = x\sqrt{x}`],
        d: R`Potęga z minusem to jedynka przez potęgę. $x^{\frac32}$ rozkładasz na $x^1 \cdot x^{\frac12}$, bo przy mnożeniu potęg wykładniki się dodają: $1 + \tfrac12 = \tfrac32$.` },
    ],
  },
  b: {
    f: R`f(x) = \sqrt[3]{x^4} - \frac{1}{\sqrt[3]{x}}`, leg: LEG.potega,
    wynik: R`\tfrac43 x^{\frac13} + \tfrac13 x^{-\frac43} = \tfrac43\sqrt[3]{x} + \frac{1}{3x\sqrt[3]{x}}`,
    linie: [
      { t: R`f(x) = \sqrt[3]{x^4} - \frac{1}{\sqrt[3]{x}}`, typ: 'f', r: 'reguła 2 · różnica', o: 'Przepisz funkcję.',
        d: R`Różnica dwóch składników z pierwiastkami. Oba zamienisz na potęgi, potem każdy policzysz wzorem 3.` },
      { t: R`= x^{\mH{n1}{\frac43}} - x^{\mH{n2}{-\frac13}}`, typ: 'f', r: 'potęgi', o: 'Zamień pierwiastki na potęgi.',
        d: R`$\sqrt[3]{x^4} = x^{\frac43}$: wykładnik spod pierwiastka idzie do licznika, stopień pierwiastka — do mianownika. $\frac{1}{\sqrt[3]{x}} = \frac{1}{x^{\frac13}} = x^{-\frac13}$.` },
      { t: R`\begin{aligned} f'(x) &= \mH{n1}{\tfrac43} \cdot x^{\mH{n1}{\frac43} - 1} \\ &\quad - \mH{n2}{\left(-\tfrac13\right)} \cdot x^{\mH{n2}{-\frac13} - 1} \end{aligned}`, typ: 'd',
        r: 'wzór 3 · reguła 2', o: 'Policz pochodną każdego składnika wzorem 3.',
        d: R`Wykładnik schodzi przed $x$, a w wykładniku zostaje „stary wykładnik minus 1”. Minus między składnikami zostaje (reguła 2).` },
      { t: R`= \tfrac43 x^{\frac13} + \tfrac13 x^{-\frac43}`, typ: 'd', o: 'Policz wykładniki i znaki.',
        k: [R`\tfrac43 - 1 = \tfrac43 - \tfrac33 = \tfrac13`, R`-\left(-\tfrac13\right) = \tfrac13`, R`-\tfrac13 - 1 = -\tfrac13 - \tfrac33 = -\tfrac43`],
        d: R`Jedynkę zapisujesz jako $\tfrac33$, żeby odjąć ułamki o tym samym mianowniku. Minus razy minus daje plus.` },
      { t: R`= \tfrac43\sqrt[3]{x} + \frac{1}{3x\sqrt[3]{x}}`, typ: 'd', o: 'Jeśli chcesz, wróć do pierwiastków.',
        k: [R`x^{\frac13} = \sqrt[3]{x}`, R`x^{\frac43} = x^{1} \cdot x^{\frac13} = x\sqrt[3]{x}`],
        d: R`Potęga z minusem to jedynka przez potęgę: $\tfrac13 x^{-\frac43} = \frac{1}{3x^{\frac43}}$.` },
    ],
  },
  c: {
    f: R`f(x) = \frac{2}{\ln x}`, leg: LEG.iloraz,
    wynik: R`-\frac{2}{x(\ln x)^2}`,
    linie: [
      { t: R`f(x) = \frac{\mF{f}{2}}{\mG{g}{\ln x}}`, typ: 'f', r: 'reguła 4 · iloraz', o: R`Nazwij części ilorazu: licznik to $\cF{2}$, mianownik to $\cG{\ln x}$.`,
        d: R`Test: przy $x = 3$ liczysz najpierw $\ln 3$, a na końcu dzielisz $2$ przez wynik. Ostatnie działanie to dzielenie — więc reguła 4.` },
      { t: R`(2)' = \mF{fp}{0}`, typ: 'p', r: 'wzór 1', o: 'Policz pomocniczo pochodną licznika.', d: 'Pochodna stałej to $0$.' },
      { t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pomocniczo pochodną mianownika.' },
      { t: R`f'(x) = \frac{\mF{fp}{0} \cdot \mG{g}{\ln x} - \mF{f}{2} \cdot \mG{gp}{\frac1x}}{(\mG{g}{\ln x})^2}`, typ: 'd', r: 'reguła 4', o: WZ_ILORAZ,
        d: 'Kolejność w liczniku ma znaczenie: zaczynasz od pochodnej licznika. Odwrócona kolejność daje wynik z przeciwnym znakiem.' },
      { t: R`= \frac{0 - \frac2x}{(\ln x)^2}`, typ: 'd', o: 'Policz iloczyny w liczniku.', k: [R`0 \cdot \ln x = 0`, R`2 \cdot \frac1x = \frac2x`] },
      { t: R`= -\frac{2}{x(\ln x)^2}`, typ: 'd', o: 'Uprość piętrowy ułamek.',
        d: R`Dzielenie $-\frac2x$ przez $(\ln x)^2$ to dopisanie $(\ln x)^2$ do mianownika, obok $x$.` },
    ],
  },
  d: {
    f: R`f(x) = \left(\frac{x-1}{x+1}\right)^4`, leg: LEG.zlozona,
    wynik: R`\frac{8(x-1)^3}{(x+1)^5}`,
    linie: [
      { t: R`f(x) = \left(\mG{g}{\frac{x-1}{x+1}}\right)^{\mH{n}{4}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Znajdź warstwy: na zewnątrz potęga $\square^4$, w środku ułamek $\cG{\frac{x-1}{x+1}}$.`,
        d: R`Test: przy $x = 3$ liczysz najpierw $\frac{3-1}{3+1} = \frac24$, a na końcu podnosisz wynik do potęgi $4$. Ostatnie działanie to potęga czegoś, co nie jest samym $x$ — funkcja złożona.` },
      { t: R`\begin{aligned} f'(x) &= \mH{n}{4} \cdot \left(\mG{g}{\frac{x-1}{x+1}}\right)^{\mH{n}{4} - 1} \\ &\quad \cdot \mG{gp}{\left(\frac{x-1}{x+1}\right)'} \end{aligned}`, typ: 'x',
        r: 'reguła 5 · wzór 3', o: ZEWN,
        d: R`Reguła 5: pochodna funkcji zewnętrznej — ze środkiem w miejscu $x$ — razy pochodna środka. Środek traktujesz jak jedno pudełko: $(\square^4)' = 4\square^3$, a pudełko przepisujesz. Na końcu dopisujesz „razy pochodna środka”.` },
      { t: R`\left(\frac{x-1}{x+1}\right)' = \frac{1 \cdot (x+1) - (x-1) \cdot 1}{(x+1)^2}`, typ: 'p', r: 'reguła 4',
        o: 'Policz pomocniczo pochodną środka — to iloraz.', d: R`Licznik $x - 1$ ma pochodną $1$, mianownik $x + 1$ też ma pochodną $1$.` },
      { t: R`= \frac{x + 1 - x + 1}{(x+1)^2} = \mG{gp}{\frac{2}{(x+1)^2}}`, typ: 'p', o: 'Uprość licznik.',
        k: [R`-(x - 1) = -x + 1`, R`x - x = 0`, R`1 + 1 = 2`], d: 'Minus przed nawiasem zmienia znaki obu wyrazów w nawiasie.' },
      { t: R`f'(x) = 4\left(\frac{x-1}{x+1}\right)^{3} \cdot \mG{gp}{\frac{2}{(x+1)^2}}`, typ: 'd', o: 'Wstaw pochodną środka i policz wykładnik.', k: [R`4 - 1 = 3`] },
      { t: R`= \frac{4(x-1)^3}{(x+1)^3} \cdot \frac{2}{(x+1)^2}`, typ: 'd', r: 'potęgi', o: 'Rozpisz potęgę ułamka.',
        d: R`Potęga ułamka to potęga licznika przez potęgę mianownika: $\left(\frac{a}{b}\right)^3 = \frac{a^3}{b^3}$.` },
      { t: R`= \frac{8(x-1)^3}{(x+1)^5}`, typ: 'd', o: 'Pomnóż ułamki: licznik razy licznik, mianownik razy mianownik.',
        k: [R`4 \cdot 2 = 8`, R`(x+1)^3 \cdot (x+1)^2 = (x+1)^{3+2} = (x+1)^5`], d: 'Przy mnożeniu potęg o tej samej podstawie wykładniki się dodają.' },
    ],
  },
  e: {
    f: R`f(x) = -\frac{1}{(\ln x)^2}`, leg: LEG.zlozona,
    wynik: R`\frac{2}{x(\ln x)^3}`,
    linie: [
      { t: R`f(x) = -\frac{1}{(\ln x)^2}`, typ: 'f', o: 'Przepisz funkcję.', r: 'potęgi',
        d: R`Jedynkę przez coś do kwadratu łatwiej liczyć jako potęgę z minusem niż regułą ilorazu.` },
      { t: R`= -(\mG{g}{\ln x})^{\mH{n}{-2}}`, typ: 'f', r: 'reguły 1, 5 · złożona', o: R`Zapisz ułamek jako potęgę: $\frac{1}{\square^2} = \square^{-2}$. Środek to $\cG{\ln x}$.`,
        d: R`Test na nowej postaci: przy $x = 3$ liczysz $\ln 3$, potem potęgę $-2$, a na końcu mnożysz przez $-1$. Minus to stała — zostaje z przodu (reguła 1). Zostaje potęga $\square^{-2}$ ze środkiem $\ln x$ — funkcja złożona.` },
      { t: R`\begin{aligned} f'(x) &= -\mH{n}{(-2)} \cdot (\mG{g}{\ln x})^{\mH{n}{-2} - 1} \\ &\quad \cdot \mG{gp}{(\ln x)'} \end{aligned}`, typ: 'x', r: 'reguły 1, 5 · wzór 3', o: ZEWN,
        d: R`Minus przed całością to stała $-1$ — zostaje z przodu (reguła 1). Wykładnik $-2$ schodzi przed nawias, więc z przodu stoi $-(-2)$.` },
      { t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pomocniczo pochodną środka — jest w tabeli.' },
      { t: R`f'(x) = 2(\ln x)^{-3} \cdot \mG{gp}{\frac1x}`, typ: 'd', o: 'Policz znak i wykładnik, wstaw pochodną środka.', k: [R`-(-2) = 2`, R`-2 - 1 = -3`] },
      { t: R`= \frac{2}{x(\ln x)^3}`, typ: 'd', o: 'Zapisz bez potęgi z minusem.',
        k: [R`(\ln x)^{-3} = \frac{1}{(\ln x)^3}`, R`2 \cdot \frac{1}{(\ln x)^3} \cdot \frac1x = \frac{2}{x(\ln x)^3}`] },
    ],
  },
  f: {
    f: R`f(x) = \sqrt{5x - 7}`, leg: LEG.zlozona,
    wynik: R`\frac{5}{2\sqrt{5x - 7}}`,
    linie: [
      { t: R`f(x) = \sqrt{5x - 7}`, typ: 'f', r: 'potęgi', o: 'Przepisz funkcję.',
        d: R`Pierwiastek najpierw zamienisz na potęgę — do potęgi jest gotowy wzór 3.` },
      { t: R`= (\mG{g}{5x - 7})^{\mH{n}{\frac12}}`, typ: 'f', r: 'reguła 5 · złożona', o: R`Zapisz pierwiastek jako potęgę $\tfrac12$. Środek to $\cG{5x - 7}$.`,
        d: R`Test na postaci potęgowej: przy $x = 3$ liczysz $5 \cdot 3 - 7 = 8$, a na końcu potęgę $\tfrac12$. Ostatnie działanie to potęga czegoś, co nie jest samym $x$ — funkcja złożona.` },
      { t: R`f'(x) = \mH{n}{\tfrac12} \cdot (\mG{g}{5x - 7})^{\mH{n}{\frac12} - 1} \cdot \mG{gp}{(5x - 7)'}`, typ: 'x', r: 'reguła 5 · wzór 3', o: ZEWN,
        d: R`Środek $5x - 7$ przepisujesz w całości — tak jak $x$ we wzorze 3. Dopiero na końcu mnożysz przez pochodną środka.` },
      { t: R`(5x - 7)' = 5 \cdot 1 - 0 = \mG{gp}{5}`, typ: 'p', r: 'reguły 1, 2 · wzory 1, 2', o: 'Policz pomocniczo pochodną środka.',
        d: R`$(5x)' = 5 \cdot (x)' = 5 \cdot 1$, a $(7)' = 0$, bo $7$ to stała.` },
      { t: R`f'(x) = \tfrac12 (5x - 7)^{-\frac12} \cdot \mG{gp}{5}`, typ: 'd', o: 'Wstaw pochodną środka i policz wykładnik.',
        k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`] },
      { t: R`= \frac{5}{2\sqrt{5x - 7}}`, typ: 'd', o: R`Uprość: potęga $-\tfrac12$ to jedynka przez pierwiastek.`,
        k: [R`\tfrac12 \cdot 5 = \tfrac52`, R`(5x-7)^{-\frac12} = \frac{1}{\sqrt{5x-7}}`] },
    ],
  },
  g: {
    f: R`f(x) = (\ln x)^3 + x^{\frac32}`, leg: [['zloto', R`środek $\ln x$ i jego pochodna`]],
    wynik: R`\frac{3(\ln x)^2}{x} + \tfrac32\sqrt{x}`,
    linie: [
      { t: R`f(x) = (\mG{g}{\ln x})^3 + x^{\frac32}`, typ: 'f', r: 'reguła 2 · suma',
        o: R`Rozpoznaj składniki: suma. Pierwszy składnik to funkcja złożona (środek $\cG{\ln x}$), drugi — zwykła potęga.`,
        d: R`Test: przy $x = 4$ liczysz osobno $(\ln 4)^3$ i $4^{\frac32}$, a na końcu dodajesz. Ostatnie działanie to dodawanie — więc każdy składnik osobno (reguła 2).` },
      { t: R`f'(x) = 3(\mG{g}{\ln x})^{2} \cdot \mG{gp}{(\ln x)'} + \tfrac32 x^{\frac12}`, typ: 'x', r: 'reguły 2, 5 · wzór 3',
        o: R`Policz pochodną każdego składnika: pierwszy regułą 5 (zewnętrzna $\square^3$, środek $\ln x$), drugi wzorem 3.`,
        k: [R`3 - 1 = 2`, R`\tfrac32 - 1 = \tfrac32 - \tfrac22 = \tfrac12`] },
      { t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pomocniczo pochodną środka — jest w tabeli.' },
      { t: R`f'(x) = \frac{3(\ln x)^2}{x} + \tfrac32\sqrt{x}`, typ: 'd', o: R`Wstaw pochodną środka i zapisz potęgę $\tfrac12$ jako pierwiastek.`,
        k: [R`3(\ln x)^2 \cdot \frac1x = \frac{3(\ln x)^2}{x}`, R`x^{\frac12} = \sqrt{x}`] },
    ],
  },
  h: {
    f: R`f(x) = (\ln x)^3 + \ln(x^3)`, leg: [['zloto', R`środek $\ln x$ i jego pochodna`]],
    wynik: R`\frac{3\left((\ln x)^2 + 1\right)}{x}`,
    linie: [
      { t: R`f(x) = (\ln x)^3 + \ln(x^3)`, typ: 'f', r: 'reguła 2 · suma', o: 'Przepisz funkcję.',
        d: R`Uwaga na zapis: $(\ln x)^3$ to logarytm podniesiony do potęgi, a $\ln(x^3)$ to logarytm z potęgi. To dwie różne rzeczy.` },
      { t: R`= (\mG{g}{\ln x})^3 + 3\ln x`, typ: 'f', r: 'logarytmy', o: R`Uprość drugi składnik: $\ln(x^3) = 3\ln x$.`,
        d: R`Wykładnik spod logarytmu wychodzi przed logarytm: $\ln(a^k) = k\ln a$ dla $a > 0$. Wolno, bo $x > 0$ — inaczej $\ln x$ nie istnieje.` },
      { t: R`f'(x) = 3(\mG{g}{\ln x})^2 \cdot \mG{gp}{\tfrac1x} + 3 \cdot \tfrac1x`, typ: 'd', r: 'reguły 1, 2, 5 · wzory 3, 7',
        o: R`Policz pochodną każdego składnika: pierwszy regułą 5 (zewnętrzna $\square^3$, środek $\ln x$), drugi to stała $3$ razy wzór 7.`, k: [R`3 - 1 = 2`] },
      { t: R`= \frac{3(\ln x)^2 + 3}{x}`, typ: 'd', o: 'Zapisz na wspólnej kresce ułamkowej.',
        k: [R`3(\ln x)^2 \cdot \frac1x = \frac{3(\ln x)^2}{x}`, R`3 \cdot \frac1x = \frac3x`],
        d: R`Oba składniki mają mianownik $x$, więc liczniki dodajesz nad jedną kreską.` },
      { t: R`= \frac{3\left((\ln x)^2 + 1\right)}{x}`, typ: 'd', o: R`Wyłącz wspólny czynnik $3$.` },
    ],
  },
  i: {
    f: R`f(x) = \sqrt[3]{(\ln x)^2}`, leg: LEG.zlozona,
    wynik: R`\frac{2}{3x\sqrt[3]{\ln x}}`,
    linie: [
      { t: R`f(x) = \sqrt[3]{(\ln x)^2}`, typ: 'f', r: 'potęgi', o: 'Przepisz funkcję.',
        d: R`Pierwiastek z potęgi zamienisz na jedną potęgę — do potęg jest wzór 3.` },
      { t: R`= (\mG{g}{\ln x})^{\mH{n}{\frac23}}`, typ: 'f', r: 'reguła 5 · złożona', o: R`Zapisz jako potęgę: $\sqrt[3]{\square^2} = \square^{\frac23}$. Środek to $\cG{\ln x}$.`,
        d: R`Test na postaci potęgowej: przy $x = 3$ liczysz $\ln 3$, a na końcu potęgę $\tfrac23$. Zewnętrzna to potęga, środek to $\ln x$ — funkcja złożona.` },
      { t: R`f'(x) = \mH{n}{\tfrac23} \cdot (\mG{g}{\ln x})^{\mH{n}{\frac23} - 1} \cdot \mG{gp}{(\ln x)'}`, typ: 'x', r: 'reguła 5 · wzór 3', o: ZEWN },
      { t: R`f'(x) = \tfrac23 (\ln x)^{-\frac13} \cdot \mG{gp}{\frac1x}`, typ: 'd', r: 'wzór 7', o: R`Policz wykładnik i wstaw pochodną środka: $(\ln x)' = \tfrac1x$.`,
        k: [R`\tfrac23 - 1 = \tfrac23 - \tfrac33 = -\tfrac13`] },
      { t: R`= \frac{2}{3x\sqrt[3]{\ln x}}`, typ: 'd', o: 'Zapisz bez potęgi z minusem.',
        k: [R`\tfrac23 \cdot \frac1x = \frac{2}{3x}`, R`(\ln x)^{-\frac13} = \frac{1}{\sqrt[3]{\ln x}}`] },
    ],
  },
  j: {
    f: R`f(x) = x^2\ln(x^2)`, leg: LEG.iloczyn,
    wynik: R`2x\ln(x^2) + 2x = 2x\left(\ln(x^2) + 1\right)`,
    linie: [
      { t: R`f(x) = \mF{f}{x^2} \cdot \mG{g}{\ln(x^2)}`, typ: 'f', r: 'reguła 3 · iloczyn', o: R`Nazwij czynniki: pierwszy to $\cF{x^2}$, drugi to $\cG{\ln(x^2)}$.`,
        d: R`Test: przy $x = 2$ liczysz $2^2 = 4$ i $\ln(2^2) = \ln 4$, a na końcu mnożysz. Ostatnie działanie to mnożenie — reguła 3.` },
      { t: R`(x^2)' = \mF{fp}{2x}`, typ: 'p', r: 'wzór 3', o: 'Policz pomocniczo pochodną pierwszego czynnika.' },
      { t: R`(\ln(x^2))' = \frac{1}{x^2} \cdot (x^2)'`, typ: 'p', r: 'reguła 5 · wzór 7', o: R`Policz pomocniczo pochodną drugiego czynnika — to funkcja złożona: $\ln\square$, w środku $x^2$.` },
      { t: R`= \frac{1}{x^2} \cdot 2x = \mG{gp}{\frac2x}`, typ: 'p', r: 'wzór 3', o: 'Policz i skróć.', k: [R`\frac{1}{x^2} \cdot 2x = \frac{2x}{x^2} = \frac2x`] },
      { t: R`f'(x) = \mF{fp}{2x} \cdot \mG{g}{\ln(x^2)} + \mF{f}{x^2} \cdot \mG{gp}{\frac2x}`, typ: 'd', r: 'reguła 3', o: WZ_ILOCZYN },
      { t: R`= 2x\ln(x^2) + 2x`, typ: 'd', o: 'Skróć drugi składnik.', k: [R`x^2 \cdot \frac2x = \frac{2x^2}{x} = 2x`] },
      { t: R`= 2x\left(\ln(x^2) + 1\right)`, typ: 'd', o: R`Wyłącz wspólny czynnik $2x$.` },
    ],
  },
  k: {
    f: R`f(x) = \sqrt{\frac{x-1}{x+1}}`, leg: LEG.zlozona, pkt: [2, 3, 5, -3, -5],
    wynik: R`\frac{1}{(x+1)^2}\sqrt{\frac{x+1}{x-1}}`,
    linie: [
      { t: R`f(x) = \sqrt{\frac{x-1}{x+1}}`, typ: 'f', r: 'potęgi', o: 'Przepisz funkcję.',
        d: R`Pierwiastek zamienisz na potęgę — do potęg jest wzór 3.` },
      { t: R`= \left(\mG{g}{\frac{x-1}{x+1}}\right)^{\mH{n}{\frac12}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Zapisz pierwiastek jako potęgę $\tfrac12$. Środek to ułamek $\cG{\frac{x-1}{x+1}}$ — ten sam co w przykładzie d).`,
        d: R`Test na postaci potęgowej: przy $x = 3$ liczysz $\frac{3-1}{3+1} = \frac24$, a na końcu potęgę $\tfrac12$ — funkcja złożona.` },
      { t: R`\begin{aligned} f'(x) &= \mH{n}{\tfrac12} \cdot \left(\mG{g}{\frac{x-1}{x+1}}\right)^{\mH{n}{\frac12} - 1} \\ &\quad \cdot \mG{gp}{\left(\frac{x-1}{x+1}\right)'} \end{aligned}`, typ: 'x',
        r: 'reguła 5 · wzór 3', o: ZEWN },
      { t: R`\left(\frac{x-1}{x+1}\right)' = \frac{1 \cdot (x+1) - (x-1) \cdot 1}{(x+1)^2}`, typ: 'p', r: 'reguła 4', o: 'Policz pomocniczo pochodną środka — to iloraz.' },
      { t: R`= \frac{x + 1 - x + 1}{(x+1)^2} = \mG{gp}{\frac{2}{(x+1)^2}}`, typ: 'p', o: 'Uprość licznik.', k: [R`-(x-1) = -x + 1`, R`1 + 1 = 2`] },
      { t: R`f'(x) = \tfrac12\left(\frac{x-1}{x+1}\right)^{-\frac12} \cdot \mG{gp}{\frac{2}{(x+1)^2}}`, typ: 'd', o: 'Wstaw pochodną środka i policz wykładnik.',
        k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`] },
      { t: R`= \left(\frac{x+1}{x-1}\right)^{\frac12} \cdot \frac{1}{(x+1)^2}`, typ: 'd', o: R`Pomnóż $\tfrac12 \cdot 2 = 1$ i odwróć ułamek: minus w wykładniku zamienia licznik z mianownikiem.`,
        d: R`$\left(\frac{a}{b}\right)^{-\frac12} = \left(\frac{b}{a}\right)^{\frac12}$ — potęga z minusem to odwrotność.` },
      { t: R`= \frac{1}{(x+1)^2}\sqrt{\frac{x+1}{x-1}}`, typ: 'd', o: R`Zapisz potęgę $\tfrac12$ jako pierwiastek.` },
    ],
  },
  l: {
    f: R`f(x) = \left(\ln(2x+1)\right)^3`,
    leg: [['zloto', R`środek $\ln(2x+1)$ i jego pochodna`], ['ok', R`środek logarytmu: $2x + 1$ i jego pochodna`], ['fiolet', 'wykładnik funkcji zewnętrznej']],
    wynik: R`\frac{6\left(\ln(2x+1)\right)^2}{2x+1}`,
    linie: [
      { t: R`f(x) = \left(\mG{g}{\ln(2x+1)}\right)^{\mH{n}{3}}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Znajdź warstwy. Na zewnątrz potęga $\square^3$, w środku $\cG{\ln(2x+1)}$ — a w środku logarytmu jeszcze $\cK{2x + 1}$.`,
        d: R`Test: przy $x = 2$ liczysz $2 \cdot 2 + 1 = 5$, potem $\ln 5$, na końcu $(\ln 5)^3$. Trzy działania jedno w drugim — trzy warstwy, jak w cebuli.` },
      { t: R`\begin{aligned} f'(x) &= \mH{n}{3}\left(\mG{g}{\ln(2x+1)}\right)^{2} \\ &\quad \cdot \mG{gp}{\left(\ln(2x+1)\right)'} \end{aligned}`, typ: 'x', r: 'reguła 5 · wzór 3',
        o: 'Policz pochodną zewnętrznej warstwy (wzór 3, środek bez zmian) i pomnóż przez pochodną środka.', k: [R`3 - 1 = 2`] },
      { t: R`\begin{aligned} \left(\ln(\mK{u}{2x+1})\right)' &= \frac{1}{\mK{u}{2x+1}} \\ &\quad \cdot \mK{up}{(2x+1)'} \end{aligned}`, typ: 'p', r: 'reguła 5 · wzór 7',
        o: R`Policz pomocniczo drugą warstwę: pochodna $\ln\square$ to $\frac{1}{\square}$, w środku $2x + 1$ — znowu razy pochodna środka.` },
      { t: R`= \frac{1}{2x+1} \cdot \mK{up}{2} = \mG{gp}{\frac{2}{2x+1}}`, typ: 'p', r: 'reguły 1, 2 · wzory 1, 2', o: R`Policz najgłębszą warstwę: $(2x + 1)' = 2$.`,
        k: [R`(2x+1)' = 2 \cdot 1 + 0 = 2`] },
      { t: R`f'(x) = 3\left(\ln(2x+1)\right)^2 \cdot \mG{gp}{\frac{2}{2x+1}}`, typ: 'd', o: 'Wstaw pochodną środka.' },
      { t: R`= \frac{6\left(\ln(2x+1)\right)^2}{2x+1}`, typ: 'd', o: 'Pomnóż liczby.', k: [R`3 \cdot 2 = 6`] },
    ],
  },
  m: {
    f: R`f(x) = \ln^2(2x)`, leg: LEG.zlozona,
    wynik: R`\frac{2\ln(2x)}{x}`,
    linie: [
      { t: R`f(x) = \ln^2(2x) = \left(\mG{g}{\ln(2x)}\right)^{\mH{n}{2}}`, typ: 'f', r: 'umowa · zapis',
        o: R`Rozszyfruj zapis: $\ln^2(2x)$ to kwadrat logarytmu, czyli $(\ln(2x))^2$.`,
        d: R`To umowa w zapisie: potęga przy „ln” dotyczy całego logarytmu. Nie chodzi o $\ln(4x^2)$ ani o logarytm z logarytmu.` },
      { t: R`f'(x) = \mH{n}{2} \cdot \mG{g}{\ln(2x)} \cdot \mG{gp}{\left(\ln(2x)\right)'}`, typ: 'x', r: 'reguła 5 · wzór 3',
        o: R`Policz pochodną zewnętrznej warstwy ($\square^2$, wzór 3, środek bez zmian) i pomnóż przez pochodną środka.`, k: [R`2 - 1 = 1`],
        d: R`Potęgi $1$ się nie pisze: $\square^1 = \square$.` },
      { t: R`\left(\ln(2x)\right)' = \frac{1}{2x} \cdot (2x)'`, typ: 'p', r: 'reguła 5 · wzór 7', o: R`Policz pomocniczo drugą warstwę: $\ln\square$ ze środkiem $2x$.` },
      { t: R`= \frac{1}{2x} \cdot 2 = \mG{gp}{\frac1x}`, typ: 'p', o: 'Policz i skróć.', k: [R`\frac{1}{2x} \cdot 2 = \frac{2}{2x} = \frac1x`],
        d: R`Wyszło tyle samo co $(\ln x)'$. To nie przypadek: $\ln(2x) = \ln 2 + \ln x$, a $\ln 2$ to stała, więc jej pochodna to $0$.` },
      { t: R`f'(x) = 2\ln(2x) \cdot \mG{gp}{\frac1x} = \frac{2\ln(2x)}{x}`, typ: 'd', o: 'Wstaw pochodną środka.' },
    ],
  },
  n: {
    f: R`f(x) = x^2e^x\ln x`, leg: LEG.iloczyn,
    wynik: R`xe^x\left((2 + x)\ln x + 1\right)`,
    linie: [
      { t: R`f(x) = \mF{f}{x^2e^x} \cdot \mG{g}{\ln x}`, typ: 'f', r: 'reguła 3 · iloczyn',
        o: R`Trzy czynniki, a reguła 3 jest dla dwóch. Pogrupuj: pierwszy czynnik to $\cF{x^2e^x}$, drugi to $\cG{\ln x}$.`,
        d: 'Mnożenie można grupować dowolnie, więc dwa pierwsze czynniki traktujesz jak jeden.' },
      { t: R`(x^2e^x)' = 2x \cdot e^x + x^2 \cdot e^x`, typ: 'p', r: 'reguła 3 · wzory 3, 5', o: 'Policz pomocniczo pochodną pierwszego czynnika — to też iloczyn, więc reguła 3 jeszcze raz.' },
      { t: R`= \mF{fp}{e^x(2x + x^2)}`, typ: 'p', o: R`Wyłącz wspólny czynnik $e^x$.` },
      { t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pomocniczo pochodną drugiego czynnika.' },
      { t: R`\begin{aligned} f'(x) &= \mF{fp}{e^x(2x + x^2)} \cdot \mG{g}{\ln x} \\ &\quad + \mF{f}{x^2e^x} \cdot \mG{gp}{\frac1x} \end{aligned}`, typ: 'd', r: 'reguła 3', o: WZ_ILOCZYN },
      { t: R`= e^x(2x + x^2)\ln x + xe^x`, typ: 'd', o: 'Skróć drugi składnik.', k: [R`x^2e^x \cdot \frac1x = \frac{x^2}{x}e^x = xe^x`] },
      { t: R`= xe^x\left((2 + x)\ln x + 1\right)`, typ: 'd', o: R`Wyłącz wspólny czynnik $xe^x$.`, k: [R`e^x(2x + x^2) = xe^x(2 + x)`, R`xe^x = xe^x \cdot 1`] },
    ],
  },
  o: {
    f: R`f(x) = \frac{1}{\sqrt{x^2+1}}`, leg: LEG.zlozona,
    wynik: R`-\frac{x}{(x^2+1)^{\frac32}}`,
    linie: [
      { t: R`f(x) = \frac{1}{\sqrt{x^2+1}}`, typ: 'f', r: 'potęgi', o: 'Przepisz funkcję.',
        d: R`Jedynka przez pierwiastek — łatwiej zapisać to jako potęgę niż liczyć regułą ilorazu.` },
      { t: R`= (\mG{g}{x^2+1})^{\mH{n}{-\frac12}}`, typ: 'f', r: 'reguła 5 · złożona', o: R`Zapisz jako potęgę: $\frac{1}{\sqrt{\square}} = \square^{-\frac12}$. Środek to $\cG{x^2 + 1}$.`,
        d: R`Test na postaci potęgowej: przy $x = 2$ liczysz $2^2 + 1 = 5$, a na końcu potęgę $-\tfrac12$ — funkcja złożona.` },
      { t: R`\begin{aligned} f'(x) &= \mH{n}{\left(-\tfrac12\right)} \cdot (\mG{g}{x^2+1})^{\mH{n}{-\frac12} - 1} \\ &\quad \cdot \mG{gp}{(x^2+1)'} \end{aligned}`, typ: 'x', r: 'reguła 5 · wzór 3', o: ZEWN },
      { t: R`(x^2+1)' = 2x + 0 = \mG{gp}{2x}`, typ: 'p', r: 'reguła 2 · wzory 1, 3', o: 'Policz pomocniczo pochodną środka.' },
      { t: R`f'(x) = -\tfrac12 (x^2+1)^{-\frac32} \cdot \mG{gp}{2x}`, typ: 'd', o: 'Wstaw pochodną środka i policz wykładnik.',
        k: [R`-\tfrac12 - 1 = -\tfrac12 - \tfrac22 = -\tfrac32`] },
      { t: R`= -\frac{x}{(x^2+1)^{\frac32}}`, typ: 'd', o: 'Uprość.', k: [R`-\tfrac12 \cdot 2x = -x`, R`(x^2+1)^{-\frac32} = \frac{1}{(x^2+1)^{\frac32}}`] },
    ],
  },
  p: {
    f: R`f(x) = x\sqrt{\ln x}`, leg: LEG.iloczyn,
    wynik: R`\sqrt{\ln x} + \frac{1}{2\sqrt{\ln x}} = \frac{2\ln x + 1}{2\sqrt{\ln x}}`,
    linie: [
      { t: R`f(x) = \mF{f}{x} \cdot \mG{g}{\sqrt{\ln x}}`, typ: 'f', r: 'reguła 3 · iloczyn', o: R`Nazwij czynniki: pierwszy to $\cF{x}$, drugi to $\cG{\sqrt{\ln x}}$.` },
      { t: R`(x)' = \mF{fp}{1}`, typ: 'p', r: 'wzór 2', o: 'Policz pomocniczo pochodną pierwszego czynnika.' },
      { t: R`\left((\ln x)^{\frac12}\right)' = \tfrac12(\ln x)^{-\frac12} \cdot \tfrac1x`, typ: 'p', r: 'reguła 5 · wzory 3, 7',
        o: R`Policz pomocniczo pochodną drugiego czynnika — to funkcja złożona: $\sqrt{\square} = \square^{\frac12}$, środek $\ln x$.`, k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`] },
      { t: R`= \mG{gp}{\frac{1}{2x\sqrt{\ln x}}}`, typ: 'p', o: 'Zapisz jednym ułamkiem.',
        k: [R`(\ln x)^{-\frac12} = \frac{1}{\sqrt{\ln x}}`, R`\tfrac12 \cdot \frac{1}{\sqrt{\ln x}} \cdot \frac1x = \frac{1}{2x\sqrt{\ln x}}`] },
      { t: R`f'(x) = \mF{fp}{1} \cdot \mG{g}{\sqrt{\ln x}} + \mF{f}{x} \cdot \mG{gp}{\frac{1}{2x\sqrt{\ln x}}}`, typ: 'd', r: 'reguła 3', o: WZ_ILOCZYN },
      { t: R`= \sqrt{\ln x} + \frac{1}{2\sqrt{\ln x}}`, typ: 'd', o: R`Skróć $x$ w drugim składniku.`, k: [R`x \cdot \frac{1}{2x\sqrt{\ln x}} = \frac{1}{2\sqrt{\ln x}}`] },
      { t: R`= \frac{2\ln x + 1}{2\sqrt{\ln x}}`, typ: 'd', o: 'Jeśli chcesz, zapisz wynik na jednej kresce ułamkowej.',
        k: [R`\sqrt{\ln x} = \frac{2\ln x}{2\sqrt{\ln x}}`],
        d: R`Zapisz $\sqrt{\ln x}$ jako $\frac{\sqrt{\ln x}}{1}$ i pomnóż licznik i mianownik przez $2\sqrt{\ln x}$. W liczniku wyjdzie $2\ln x$, bo $\sqrt{\ln x} \cdot \sqrt{\ln x} = \ln x$.` },
    ],
  },
  q: {
    f: R`f(x) = x\ln x`, leg: LEG.iloczyn,
    wynik: R`\ln x + 1`,
    linie: [
      { t: R`f(x) = \mF{f}{x} \cdot \mG{g}{\ln x}`, typ: 'f', r: 'reguła 3 · iloczyn', o: R`Nazwij czynniki: pierwszy to $\cF{x}$, drugi to $\cG{\ln x}$.`,
        d: R`Test: przy $x = 3$ liczysz $\ln 3$, a na końcu mnożysz przez $3$. Ostatnie działanie to mnożenie — reguła 3.` },
      { t: R`(x)' = \mF{fp}{1}`, typ: 'p', r: 'wzór 2', o: 'Policz pomocniczo pochodną pierwszego czynnika.' },
      { t: R`(\ln x)' = \mG{gp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pomocniczo pochodną drugiego czynnika.' },
      { t: R`f'(x) = \mF{fp}{1} \cdot \mG{g}{\ln x} + \mF{f}{x} \cdot \mG{gp}{\frac1x}`, typ: 'd', r: 'reguła 3', o: WZ_ILOCZYN },
      { t: R`= \ln x + 1`, typ: 'd', o: 'Policz iloczyny.', k: [R`1 \cdot \ln x = \ln x`, R`x \cdot \frac1x = \frac{x}{x} = 1`] },
    ],
  },
  r: {
    f: R`f(x) = e^{-x} + e^{2x}`, leg: LEG.wykladnicza,
    wynik: R`-e^{-x} + 2e^{2x}`,
    linie: [
      { t: R`f(x) = e^{\mG{g1}{-x}} + e^{\mG{g2}{2x}}`, typ: 'f', r: 'reguła 2 · suma',
        o: R`Rozpoznaj składniki: suma. Każdy składnik to $e^{\square}$, ale w wykładniku nie stoi sam $x$ — to funkcje złożone.`,
        d: R`Wzór 5, $(e^x)' = e^x$, działa tylko wtedy, gdy w wykładniku jest dokładnie $x$. Tu są $-x$ i $2x$, więc dochodzi reguła 5.` },
      { t: R`f'(x) = e^{\mG{g1}{-x}} \cdot \mG{gp1}{(-x)'} + e^{\mG{g2}{2x}} \cdot \mG{gp2}{(2x)'}`, typ: 'x', r: 'reguła 5 · wzór 5',
        o: R`W każdym składniku przepisz $e^{\square}$ bez zmian (wzór 5) i pomnóż przez pochodną wykładnika (reguła 5).` },
      { t: R`(-x)' = \mG{gp1}{-1}`, typ: 'p', r: 'reguła 1 · wzór 2', o: 'Policz pomocniczo pochodną pierwszego wykładnika.', d: R`$-x = (-1) \cdot x$, więc pochodna to $(-1) \cdot 1 = -1$.` },
      { t: R`(2x)' = \mG{gp2}{2}`, typ: 'p', r: 'reguła 1 · wzór 2', o: 'Policz pomocniczo pochodną drugiego wykładnika.' },
      { t: R`f'(x) = e^{-x} \cdot (\mG{gp1}{-1}) + e^{2x} \cdot \mG{gp2}{2}`, typ: 'd', o: 'Wstaw pochodne wykładników.' },
      { t: R`= -e^{-x} + 2e^{2x}`, typ: 'd', o: 'Uporządkuj.' },
    ],
  },
  s: {
    f: R`f(x) = x^2e^{3x}`, leg: LEG.iloczyn,
    wynik: R`2xe^{3x} + 3x^2e^{3x} = xe^{3x}(2 + 3x)`,
    linie: [
      { t: R`f(x) = \mF{f}{x^2} \cdot \mG{g}{e^{3x}}`, typ: 'f', r: 'reguła 3 · iloczyn', o: R`Nazwij czynniki: pierwszy to $\cF{x^2}$, drugi to $\cG{e^{3x}}$.`,
        d: R`Test: przy $x = 1$ liczysz $1^2 = 1$ i $e^{3}$, na końcu mnożysz. Ostatnie działanie to mnożenie — reguła 3.` },
      { t: R`(x^2)' = \mF{fp}{2x}`, typ: 'p', r: 'wzór 3', o: 'Policz pomocniczo pochodną pierwszego czynnika.', k: [R`2 - 1 = 1`] },
      { t: R`(e^{3x})' = e^{3x} \cdot (3x)' = \mG{gp}{3e^{3x}}`, typ: 'p', r: 'reguła 5 · wzór 5',
        o: R`Policz pomocniczo pochodną drugiego czynnika — to funkcja złożona: $e^{\square}$ z wykładnikiem $3x$, razy $(3x)' = 3$.` },
      { t: R`f'(x) = \mF{fp}{2x} \cdot \mG{g}{e^{3x}} + \mF{f}{x^2} \cdot \mG{gp}{3e^{3x}}`, typ: 'd', r: 'reguła 3', o: WZ_ILOCZYN },
      { t: R`= 2xe^{3x} + 3x^2e^{3x}`, typ: 'd', o: 'Uporządkuj iloczyny.', k: [R`x^2 \cdot 3e^{3x} = 3x^2e^{3x}`] },
      { t: R`= xe^{3x}(2 + 3x)`, typ: 'd', o: R`Wyłącz wspólny czynnik $xe^{3x}$.`, k: [R`2xe^{3x} = xe^{3x} \cdot 2`, R`3x^2e^{3x} = xe^{3x} \cdot 3x`] },
    ],
  },
  t: {
    f: R`f(x) = \tfrac13 e^{\ln x + x^2}`, leg: LEG.wykladnicza,
    wynik: R`\tfrac13 e^{x^2}\left(1 + 2x^2\right)`,
    linie: [
      { t: R`f(x) = \tfrac13 e^{\mG{g}{\ln x + x^2}}`, typ: 'f', r: 'reguły 1, 5',
        o: R`Rozpoznaj części: stała $\tfrac13$ zostaje przed pochodną, a reszta to $e^{\square}$ z wykładnikiem $\cG{\ln x + x^2}$ — funkcja złożona.` },
      { t: R`f'(x) = \tfrac13 e^{\mG{g}{\ln x + x^2}} \cdot \mG{gp}{(\ln x + x^2)'}`, typ: 'x', r: 'reguła 5 · wzór 5', o: EKSP },
      { t: R`(\ln x + x^2)' = \mG{gp}{\tfrac1x + 2x}`, typ: 'p', r: 'reguła 2 · wzory 3, 7', o: 'Policz pomocniczo pochodną wykładnika — to suma, każdy składnik z tabeli.' },
      { t: R`f'(x) = \tfrac13 e^{\ln x + x^2}\left(\mG{gp}{\tfrac1x + 2x}\right)`, typ: 'd', o: 'Wstaw pochodną wykładnika.' },
      { t: R`= \tfrac13 xe^{x^2}\left(\tfrac1x + 2x\right)`, typ: 'd', r: 'potęgi i logarytmy', o: R`Uprość potęgę: $e^{\ln x + x^2} = xe^{x^2}$.`,
        k: [R`e^{\ln x + x^2} = e^{\ln x} \cdot e^{x^2} = xe^{x^2}`],
        d: R`Suma w wykładniku to iloczyn potęg: $e^{a+b} = e^a \cdot e^b$. A $e^{\ln x} = x$, bo $\ln x$ to wykładnik, do którego trzeba podnieść $e$, żeby dostać $x$.` },
      { t: R`= \tfrac13 e^{x^2}\left(1 + 2x^2\right)`, typ: 'd', o: R`Wymnóż $x$ przez nawias.`, k: [R`x \cdot \tfrac1x = 1`, R`x \cdot 2x = 2x^2`] },
    ],
  },
  u: {
    f: R`f(x) = (2x+1) \cdot 2^{2x+1}`, leg: LEG.iloczyn,
    wynik: R`2 \cdot 2^{2x+1}\left(1 + (2x+1)\ln 2\right) = 2^{2x+2}\left(1 + (2x+1)\ln 2\right)`,
    linie: [
      { t: R`f(x) = \mF{f}{(2x+1)} \cdot \mG{g}{2^{2x+1}}`, typ: 'f', r: 'reguła 3 · iloczyn', o: R`Nazwij czynniki: pierwszy to $\cF{2x + 1}$, drugi to $\cG{2^{2x+1}}$.` },
      { t: R`(2x+1)' = \mF{fp}{2}`, typ: 'p', r: 'reguły 1, 2 · wzory 1, 2', o: 'Policz pomocniczo pochodną pierwszego czynnika.' },
      { t: R`\left(2^{2x+1}\right)' = 2^{2x+1}\ln 2 \cdot (2x+1)'`, typ: 'p', r: 'reguła 5 · wzór 4',
        o: R`Policz pomocniczo pochodną drugiego czynnika: wzór 4 z $a = 2$, a w wykładniku stoi $2x + 1$ — więc razy pochodna wykładnika.` },
      { t: R`= \mG{gp}{2 \cdot 2^{2x+1}\ln 2}`, typ: 'p', o: R`Wstaw pochodną wykładnika ($2$) i przestaw ją na początek.` },
      { t: R`\begin{aligned} f'(x) &= \mF{fp}{2} \cdot \mG{g}{2^{2x+1}} \\ &\quad + \mF{f}{(2x+1)} \cdot \mG{gp}{2 \cdot 2^{2x+1}\ln 2} \end{aligned}`, typ: 'd', r: 'reguła 3', o: WZ_ILOCZYN },
      { t: R`= 2 \cdot 2^{2x+1}\left(1 + (2x+1)\ln 2\right)`, typ: 'd', o: R`Wyłącz wspólny czynnik $2 \cdot 2^{2x+1}$.`,
        k: [R`(2x+1) \cdot 2 \cdot 2^{2x+1}\ln 2 = 2 \cdot 2^{2x+1} \cdot (2x+1)\ln 2`] },
      { t: R`= 2^{2x+2}\left(1 + (2x+1)\ln 2\right)`, typ: 'd', o: R`Jeśli chcesz, zapisz $2 \cdot 2^{2x+1}$ jako jedną potęgę.`,
        k: [R`2 \cdot 2^{2x+1} = 2^{1 + 2x + 1} = 2^{2x+2}`] },
    ],
  },
  v: {
    f: R`f(x) = e^{-\frac{x^2}{2}}`, leg: LEG.wykladnicza,
    wynik: R`-xe^{-\frac{x^2}{2}}`,
    linie: [
      { t: R`f(x) = e^{\mG{g}{-\frac{x^2}{2}}}`, typ: 'f', r: 'reguła 5 · złożona', o: R`Rozpoznaj funkcję złożoną: $e^{\square}$ z wykładnikiem $\cG{-\frac{x^2}{2}}$.` },
      { t: R`f'(x) = e^{\mG{g}{-\frac{x^2}{2}}} \cdot \mG{gp}{\left(-\frac{x^2}{2}\right)'}`, typ: 'x', r: 'reguła 5 · wzór 5', o: EKSP },
      { t: R`\left(-\tfrac12 x^2\right)' = -\tfrac12 \cdot 2x = \mG{gp}{-x}`, typ: 'p', r: 'reguła 1 · wzór 3',
        o: R`Policz pomocniczo pochodną wykładnika: $-\frac{x^2}{2} = -\tfrac12 x^2$, stała zostaje, a $(x^2)' = 2x$.`, k: [R`-\tfrac12 \cdot 2 = -1`] },
      { t: R`f'(x) = e^{-\frac{x^2}{2}} \cdot (\mG{gp}{-x}) = -xe^{-\frac{x^2}{2}}`, typ: 'd', o: 'Wstaw pochodną wykładnika i uporządkuj.' },
    ],
  },
  w: {
    f: R`f(x) = \frac{\ln x}{e^x}`, leg: LEG.iloraz,
    wynik: R`\frac{1 - x\ln x}{xe^x}`,
    linie: [
      { t: R`f(x) = \frac{\mF{f}{\ln x}}{\mG{g}{e^x}}`, typ: 'f', r: 'reguła 4 · iloraz', o: R`Nazwij części ilorazu: licznik to $\cF{\ln x}$, mianownik to $\cG{e^x}$.`,
        d: R`Test: przy $x = 2$ liczysz $\ln 2$ i $e^2$, a na końcu dzielisz. Ostatnie działanie to dzielenie — reguła 4.` },
      { t: R`(\ln x)' = \mF{fp}{\tfrac1x}`, typ: 'p', r: 'wzór 7', o: 'Policz pomocniczo pochodną licznika.' },
      { t: R`(e^x)' = \mG{gp}{e^x}`, typ: 'p', r: 'wzór 5', o: 'Policz pomocniczo pochodną mianownika.' },
      { t: R`f'(x) = \frac{\mF{fp}{\frac1x} \cdot \mG{g}{e^x} - \mF{f}{\ln x} \cdot \mG{gp}{e^x}}{(\mG{g}{e^x})^2}`, typ: 'd', r: 'reguła 4', o: WZ_ILORAZ },
      { t: R`= \frac{e^x\left(\frac1x - \ln x\right)}{e^{2x}}`, typ: 'd', o: R`W liczniku wyłącz $e^x$, w mianowniku policz potęgę.`, k: [R`(e^x)^2 = e^{2x}`] },
      { t: R`= \frac{\frac1x - \ln x}{e^x}`, typ: 'd', o: R`Skróć $e^x$.`, k: [R`\frac{e^x}{e^{2x}} = \frac{1}{e^x}`] },
      { t: R`= \frac{1 - x\ln x}{xe^x}`, typ: 'd', o: R`Pomnóż licznik i mianownik przez $x$, żeby pozbyć się piętrowego ułamka.`,
        k: [R`\left(\tfrac1x - \ln x\right) \cdot x = 1 - x\ln x`, R`e^x \cdot x = xe^x`] },
    ],
  },
  x: {
    f: R`f(x) = e^x\ln(2x)`, leg: LEG.iloczyn,
    wynik: R`e^x\left(\ln(2x) + \frac1x\right)`,
    linie: [
      { t: R`f(x) = \mF{f}{e^x} \cdot \mG{g}{\ln(2x)}`, typ: 'f', r: 'reguła 3 · iloczyn', o: R`Nazwij czynniki: pierwszy to $\cF{e^x}$, drugi to $\cG{\ln(2x)}$.` },
      { t: R`(e^x)' = \mF{fp}{e^x}`, typ: 'p', r: 'wzór 5', o: 'Policz pomocniczo pochodną pierwszego czynnika.' },
      { t: R`\left(\ln(2x)\right)' = \frac{1}{2x} \cdot 2 = \mG{gp}{\frac1x}`, typ: 'p', r: 'reguła 5 · wzór 7',
        o: R`Policz pomocniczo pochodną drugiego czynnika: $\ln\square$ ze środkiem $2x$, razy $(2x)' = 2$.`, k: [R`\frac{1}{2x} \cdot 2 = \frac{2}{2x} = \frac1x`] },
      { t: R`f'(x) = \mF{fp}{e^x} \cdot \mG{g}{\ln(2x)} + \mF{f}{e^x} \cdot \mG{gp}{\frac1x}`, typ: 'd', r: 'reguła 3', o: WZ_ILOCZYN },
      { t: R`= e^x\left(\ln(2x) + \frac1x\right)`, typ: 'd', o: R`Wyłącz wspólny czynnik $e^x$.` },
    ],
  },
  y: {
    f: R`f(x) = x^x`, leg: LEG.wykladnicza,
    wynik: R`x^x(\ln x + 1)`,
    linie: [
      { t: R`f(x) = x^x`, typ: 'f', o: 'Przepisz funkcję i sprawdź, który wzór pasuje.',
        d: R`Zmienna $x$ stoi i w podstawie, i w wykładniku. Wzór 3 ($x^n$) wymaga stałego wykładnika, wzór 4 ($a^x$) — stałej podstawy. Żaden nie pasuje.` },
      { t: R`= e^{\ln(x^x)} = e^{\mG{g}{x\ln x}}`, typ: 'f', r: 'logarytmy', o: R`Zapisz $x^x$ jako potęgę liczby $e$.`,
        d: R`Każdą liczbę dodatnią $a$ można zapisać jako $e^{\ln a}$ — logarytm naturalny to właśnie wykładnik, do którego trzeba podnieść $e$, żeby dostać $a$. Potem $\ln(x^x) = x\ln x$: wykładnik wychodzi przed logarytm.` },
      { t: R`f'(x) = e^{\mG{g}{x\ln x}} \cdot \mG{gp}{(x\ln x)'}`, typ: 'x', r: 'reguła 5 · wzór 5', o: EKSP },
      { t: R`(x\ln x)' = 1 \cdot \ln x + x \cdot \tfrac1x = \mG{gp}{\ln x + 1}`, typ: 'p', r: 'reguła 3', o: 'Policz pomocniczo pochodną wykładnika — to iloczyn, jak w przykładzie q).' },
      { t: R`f'(x) = e^{x\ln x}(\mG{gp}{\ln x + 1})`, typ: 'd', o: 'Wstaw pochodną wykładnika.' },
      { t: R`= x^x(\ln x + 1)`, typ: 'd', o: R`Wróć do zapisu $x^x$: $e^{x\ln x} = x^x$.` },
    ],
  },
  z171e: {
    f: R`f(x) = \sqrt{\frac{x^2+5}{x^2-5}}`, leg: LEG.zlozona, pkt: [2.5, 3, 4, -3],
    wynik: R`\frac{-10x}{(x^2+5)^{\frac12}(x^2-5)^{\frac32}}`,
    linie: [
      { t: R`\begin{aligned} f(x) &= \sqrt{\frac{x^2+5}{x^2-5}} \\ &= \left(\mG{g}{\frac{x^2+5}{x^2-5}}\right)^{\mH{n}{\frac12}} \end{aligned}`, typ: 'f', r: 'reguła 5 · złożona',
        o: R`Zapisz pierwiastek jako potęgę $\tfrac12$. Zewnętrzna: $\square^{\frac12}$, środek: ułamek $\cG{\frac{x^2+5}{x^2-5}}$.` },
      { t: R`\begin{aligned} f'(x) &= \mH{n}{\tfrac12}\left(\mG{g}{\frac{x^2+5}{x^2-5}}\right)^{-\frac12} \\ &\quad \cdot \mG{gp}{\left(\frac{x^2+5}{x^2-5}\right)'} \end{aligned}`, typ: 'x',
        r: 'reguła 5 · wzór 3', o: ZEWN, k: [R`\tfrac12 - 1 = \tfrac12 - \tfrac22 = -\tfrac12`] },
      { t: R`\begin{aligned} &\left(\frac{x^2+5}{x^2-5}\right)' \\ &= \frac{2x(x^2-5) - (x^2+5) \cdot 2x}{(x^2-5)^2} \end{aligned}`, typ: 'p', r: 'reguła 4',
        o: R`Policz pomocniczo pochodną środka — to iloraz. Licznik i mianownik mają tę samą pochodną: $2x$.` },
      { t: R`= \frac{2x^3 - 10x - 2x^3 - 10x}{(x^2-5)^2}`, typ: 'p', o: 'Wymnóż nawiasy w liczniku.',
        k: [R`2x(x^2-5) = 2x^3 - 10x`, R`(x^2+5) \cdot 2x = 2x^3 + 10x`, R`-(2x^3 + 10x) = -2x^3 - 10x`] },
      { t: R`= \mG{gp}{\frac{-20x}{(x^2-5)^2}}`, typ: 'p', o: 'Zredukuj wyrazy podobne.', k: [R`2x^3 - 2x^3 = 0`, R`-10x - 10x = -20x`] },
      { t: R`f'(x) = \tfrac12 \cdot \frac{(x^2-5)^{\frac12}}{(x^2+5)^{\frac12}} \cdot \mG{gp}{\frac{-20x}{(x^2-5)^2}}`, typ: 'd',
        o: R`Wstaw pochodną środka. Potęga $-\tfrac12$ odwraca ułamek.`,
        d: R`$\left(\frac{a}{b}\right)^{-\frac12} = \frac{b^{\frac12}}{a^{\frac12}}$ — minus w wykładniku zamienia licznik z mianownikiem.` },
      { t: R`= \frac{-10x}{(x^2+5)^{\frac12}(x^2-5)^{\frac32}}`, typ: 'd', o: R`Pomnóż liczby, a potęgi $x^2 - 5$ podziel: wykładniki się odejmują.`,
        k: [R`\tfrac12 \cdot (-20x) = -10x`, R`2 - \tfrac12 = \tfrac42 - \tfrac12 = \tfrac32`],
        d: R`W liczniku jest $(x^2-5)^{\frac12}$, w mianowniku $(x^2-5)^2$. Przy dzieleniu potęg o tej samej podstawie wykładniki się odejmują, więc w mianowniku zostaje $(x^2-5)^{2 - \frac12} = (x^2-5)^{\frac32}$.` },
    ],
  },
};

// krótkie rachunki do sekcji z regułami (poza listą)
export const PRZYKLADY = {
  pot1: {
    f: R`f(x) = 3x^4`, leg: LEG.potega,
    linie: [
      { t: R`f(x) = 3x^{\mH{n}{4}}`, typ: 'f', o: R`Odczytaj wykładnik ($4$) i stałą przed $x$ ($3$).` },
      { t: R`f'(x) = 3 \cdot \mH{n}{4} \cdot x^{\mH{n}{4} - 1}`, typ: 'x', r: 'wzór 3 · reguła 1',
        o: R`Przenieś wykładnik przed $x$ — mnoży stałą. W wykładniku zostaw o $1$ mniej.` },
      { t: R`= 12x^{3}`, typ: 'd', o: 'Policz.', k: [R`3 \cdot 4 = 12`, R`4 - 1 = 3`] },
    ],
  },
  pot2: {
    f: R`f(x) = x^{\frac43}`, leg: LEG.potega,
    linie: [
      { t: R`f(x) = x^{\mH{n}{\frac43}}`, typ: 'f', o: R`Odczytaj wykładnik: to ułamek $\tfrac43$ — wzór 3 działa tak samo.` },
      { t: R`f'(x) = \mH{n}{\tfrac43} \cdot x^{\mH{n}{\frac43} - 1}`, typ: 'x', r: 'wzór 3', o: R`Przenieś wykładnik przed $x$, a w wykładniku zostaw o $1$ mniej.` },
      { t: R`= \tfrac43 x^{\frac13}`, typ: 'd', o: R`Odejmij $1$ od ułamka: zapisz $1$ jako $\tfrac33$.`, k: [R`\tfrac43 - 1 = \tfrac43 - \tfrac33 = \tfrac13`] },
      { t: R`= \tfrac43\sqrt[3]{x}`, typ: 'd', o: R`Zapisz potęgę $\tfrac13$ jako pierwiastek trzeciego stopnia.` },
    ],
  },
  ilo1: {
    f: R`f(x) = \frac{x}{x+1}`, leg: LEG.iloraz,
    linie: [
      { t: R`f(x) = \frac{\mF{f}{x}}{\mG{g}{x+1}}`, typ: 'f', r: 'reguła 4 · iloraz', o: R`Nazwij części ilorazu: licznik to $\cF{x}$, mianownik to $\cG{x + 1}$.` },
      { t: R`(x)' = \mF{fp}{1}`, typ: 'p', r: 'wzór 2', o: 'Policz pomocniczo pochodną licznika.' },
      { t: R`(x+1)' = 1 + 0 = \mG{gp}{1}`, typ: 'p', r: 'reguła 2 · wzory 1, 2', o: 'Policz pomocniczo pochodną mianownika.' },
      { t: R`f'(x) = \frac{\mF{fp}{1} \cdot \mG{g}{(x+1)} - \mF{f}{x} \cdot \mG{gp}{1}}{(\mG{g}{x+1})^2}`, typ: 'd', r: 'reguła 4', o: WZ_ILORAZ },
      { t: R`= \frac{x + 1 - x}{(x+1)^2} = \frac{1}{(x+1)^2}`, typ: 'd', o: 'Uprość licznik.', k: [R`1 \cdot (x+1) = x + 1`, R`x \cdot 1 = x`, R`x + 1 - x = 1`] },
    ],
  },
  c2: {
    f: R`f(x) = \frac{2}{\ln x}`, leg: LEG.zlozona,
    linie: [
      { t: R`f(x) = \frac{2}{\ln x} = 2(\mG{g}{\ln x})^{\mH{n}{-1}}`, typ: 'f', r: 'potęgi', o: R`Zapisz ułamek jako stałą razy potęgę: $\frac{2}{\square} = 2\square^{-1}$. Środek to $\cG{\ln x}$.` },
      { t: R`f'(x) = 2 \cdot \mH{n}{(-1)} \cdot (\mG{g}{\ln x})^{\mH{n}{-1} - 1} \cdot \mG{gp}{\tfrac1x}`, typ: 'd', r: 'reguły 1, 5 · wzory 3, 7',
        o: ZEWN, k: [R`-1 - 1 = -2`] },
      { t: R`= -2(\ln x)^{-2} \cdot \frac1x = -\frac{2}{x(\ln x)^2}`, typ: 'd', o: 'Policz i zapisz bez potęgi z minusem — wynik jest ten sam co regułą ilorazu.', k: [R`2 \cdot (-1) = -2`] },
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
        ? `Współczynnik to sam wykładnik: $${ulTex(N)}$ — przed $x$ nie stoi żadna liczba (czyli $1$).`
        : `Współczynnik = liczba przed $x$ razy wykładnik: $${ulTex(A)} \\cdot ${nawias(N)} = ${ulTex(wsp)}$.`,
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
