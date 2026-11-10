// Dobór kwotowy (kurs „Metody badań rynku”, moduł 2). Wszystkie liczby na stronie i w ćwiczeniach liczą się stąd.
// Tabela = macierz [wiersz][kolumna]; „kratka” = jedna komórka (np. miasto × 18–24).
import { alokuj } from './proba.js';

export const suma = (m) => m.flat().reduce((a, b) => a + b, 0);
export const sumyW = (m) => m.map((w) => w.reduce((a, b) => a + b, 0));
export const sumyK = (m) => m[0].map((_, j) => m.reduce((a, w) => a + w[j], 0));
export const mapuj = (m, f) => m.map((w, i) => w.map((x, j) => f(x, i, j)));

// Struktura procentowa w pełnych procentach — tak jak w arkuszu z zajęć („Metody doboru próby – przykład”).
export const procentyPelne = (m) => { const N = suma(m); return mapuj(m, (x) => Math.round((100 * x) / N)); };
// Struktura próby z pełnych procentów: procent kratki razy n.
export const probaZProcentow = (pct, n) => mapuj(pct, (p) => (p * n) / 100);
// Struktura próby z dokładnych udziałów, zaokrąglana metodą największych reszt (suma zawsze równa n).
export function probaDokladna(m, n) {
  const k = m[0].length;
  const a = alokuj(n, m.flat());
  const tnij = (t) => m.map((_, i) => t.slice(i * k, i * k + k));
  return { dokladnie: tnij(a.dokladnie), wynik: tnij(a.wynik) };
}
// Liczba ankieterów: n podzielone przez liczbę ankiet na jednego ankietera, w górę.
export const ilu = (n, naAnk) => Math.ceil(n / naAnk - 1e-9);
// Schemat wyjściowy: każda kratka próby podzielona przez liczbę ankieterów (mogą wyjść ułamki).
export const wyjsciowy = (proba, ankieterow) => mapuj(proba, (x) => x / ankieterow);

// Sprawdzenie zestawu schematów: [{ nazwa, ilu, m }].
// Warunek 1: każdy schemat sumuje się do liczby ankiet na ankietera. Warunek 2: liczba ankieterów razem się zgadza.
// Warunek 3: schematy pomnożone przez liczbę ankieterów i dodane dają strukturę próby.
export function sprawdz(proba, schematy, naAnk, ankieterow) {
  const sumy = schematy.map((s) => suma(s.m));
  const razemAnk = schematy.reduce((a, s) => a + s.ilu, 0);
  const zebrane = mapuj(proba, (_, i, j) => schematy.reduce((a, s) => a + s.ilu * s.m[i][j], 0));
  const roznica = mapuj(proba, (x, i, j) => zebrane[i][j] - x);
  return {
    sumy, razemAnk, zebrane, roznica,
    okSumy: sumy.every((x) => x === naAnk),
    okAnk: razemAnk === ankieterow,
    okProba: roznica.flat().every((x) => x === 0),
    get ok() { return this.okSumy && this.okAnk && this.okProba; },
  };
}
// Reszta po rozdaniu schematu: ile osób w każdej kratce zostaje dla pozostałych ankieterów.
export const reszta = (proba, s) => mapuj(proba, (x, i, j) => x - s.ilu * s.m[i][j]);

// „Część pewna” i „dodatki”: kratka 2,3 przy 100 ankieterach = każdy ankieter dostaje 2 osoby (część pewna),
// a 0,3 · 100 = 30 ankieterów dostaje o jedną osobę więcej (dodatek).
export function dodatki(proba, ankieterow, naAnk) {
  const pewna = mapuj(proba, (x) => Math.floor(x / ankieterow + 1e-9));
  const potrzeba = mapuj(proba, (x, i, j) => x - pewna[i][j] * ankieterow); // ilu ankieterów dostaje +1 w tej kratce
  return { pewna, potrzeba, brak: naAnk - suma(pewna) }; // brak = ile dodatków dostaje każdy ankieter
}
// Jeden przykładowy schemat: część pewna + dodatki w kratkach z największą potrzebą (przy remisie wcześniejsza kratka).
export function przykladowy(proba, ankieterow, naAnk) {
  const { pewna, potrzeba, brak } = dodatki(proba, ankieterow, naAnk);
  const k = proba[0].length;
  const m = pewna.flat();
  potrzeba.flat().map((p, i) => [p, i]).filter(([p]) => p > 0).sort((a, b) => b[0] - a[0] || a[1] - b[1]).slice(0, brak).forEach(([, i]) => m[i]++);
  return proba.map((_, i) => m.slice(i * k, i * k + k));
}
// Pełny zestaw schematów: każdy schemat = część pewna + dodatki tam, gdzie potrzeba jest największa.
// Schemat dostaje tylu ankieterów, żeby (1) żadna wybrana kratka nie dostała dodatku za dużo razy
// i (2) pominięte kratki zdążyły dostać swoje dodatki u pozostałych ankieterów. Każda kratka ma wtedy
// u każdego ankietera część pewną albo o jedną osobę więcej.
export function ulozSchematy(proba, ankieterow, naAnk) {
  const { pewna, potrzeba, brak } = dodatki(proba, ankieterow, naAnk);
  const k = proba[0].length;
  const potrz = potrzeba.flat();
  const wynik = [];
  let zostalo = ankieterow;
  while (zostalo > 0) {
    const kolej = potrz.map((p, i) => [p, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    const wybrane = kolej.slice(0, brak);
    const pominiete = kolej.slice(brak);
    const ile = brak === 0 ? zostalo : Math.min(Math.min(...wybrane.map(([p]) => p)), zostalo - Math.max(0, ...pominiete.map(([p]) => p)));
    if (!(ile >= 1)) throw new Error('kwoty: nie da się ułożyć schematów — sprawdź, czy próba dzieli się na ankieterów');
    const m = pewna.flat();
    wybrane.forEach(([, i]) => { m[i]++; potrz[i] -= ile; });
    wynik.push({ nazwa: 'ABCDEFGHIJ'[wynik.length], ilu: ile, m: proba.map((_, i) => m.slice(i * k, i * k + k)), potrzebaPrzed: proba.map((_, i) => kolej.slice().sort((a, b) => a[1] - b[1]).map(([p]) => p).slice(i * k, i * k + k)), zostaloPrzed: zostalo });
    zostalo -= ile;
  }
  return wynik;
}

// ——— Dane ———
// Przykład ze slajdów „Schemat doboru kwotowego”: płeć × wykształcenie, N = 200, n = 100, 10 ankieterów.
export const SLAJD = {
  wiersze: ['K', 'M'],
  kolumny: ['podst. i zawod.', 'średnie', 'wyższe'],
  pop: [[40, 20, 40], [10, 50, 40]],
  n: 100,
  ankieterow: 10,
  naAnk: 10,
  schematy: [
    { nazwa: 'A', ilu: 5, m: [[2, 1, 2], [1, 2, 2]] },
    { nazwa: 'B', ilu: 5, m: [[2, 1, 2], [0, 3, 2]] },
  ],
};
// Przykład z arkusza „Metody doboru próby – przykład”: wiek × miejsce zamieszkania, n = 1000, 10 ankiet na ankietera.
export const ARKUSZ = {
  wiersze: ['18–24', '25–44', '45–64', '65 i więcej'],
  kolumny: ['Miasto', 'Wieś'],
  pop: [[2345, 1693], [6986, 4298], [5935, 3368], [3212, 1949]],
  // sumy wierszy wpisane w arkuszu (ostatnia różni się o 1 od sumy kratek: 3212 + 1949 = 5161)
  sumyWArkuszu: [4038, 11284, 9303, 5162],
  n: 1000,
  naAnk: 10,
  schematy: [
    { nazwa: 'A', ilu: 50, m: [[1, 1], [2, 1], [2, 1], [1, 1]] },
    { nazwa: 'B', ilu: 20, m: [[0, 0], [3, 2], [2, 1], [1, 1]] },
    { nazwa: 'C', ilu: 20, m: [[1, 0], [2, 2], [2, 1], [2, 0]] },
    { nazwa: 'D', ilu: 10, m: [[1, 1], [3, 1], [2, 2], [0, 0]] },
  ],
};
// Przykład własny (dane wymyślone): czytelnicy biblioteki miejskiej, płeć × wiek, n = 400, 20 ankiet na ankietera.
export const BIBLIOTEKA = {
  wiersze: ['K', 'M'],
  kolumny: ['18–29', '30–49', '50 i więcej'],
  pop: [[2290, 3480, 2110], [2540, 3390, 2190]],
  n: 400,
  naAnk: 20,
};
// Dane do ćwiczeń (wymyślone): klienci sklepu internetowego, płeć × wiek, n = 200, 10 ankiet na ankietera.
export const SKLEP = {
  wiersze: ['K', 'M'],
  kolumny: ['do 34 lat', '35 lat i więcej'],
  pop: [[1500, 1000], [1750, 750]],
  n: 200,
  naAnk: 10,
};
