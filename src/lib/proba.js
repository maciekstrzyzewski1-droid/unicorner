// Obliczenia do kursu „Metody badań rynku”, moduł „Minimalna wielkość próby”.
// Dane: GUS, ludność Wielkopolski wg grup wieku i płci, stan na 31.12.2025 (BDL).
// Wszystko, co kurs podaje jako liczbę, jest liczone tutaj, żeby tekst i rachunek się nie rozjechały.

// osoby wg grup wieku: [mężczyźni, kobiety]
export const GUS = {
  '18': [19875, 18759],
  '19': [18844, 17498],
  '20-24': [86493, 81898],
  '25-29': [95346, 92679],
  '30-34': [116248, 113466],
  '35-39': [133698, 130778],
  '40-44': [150497, 147642],
  '45-49': [141845, 140061],
  '50-54': [120966, 121999],
  '55-59': [96373, 100584],
};

// Pokolenia przyjęte w zadaniu (przybliżenie do grup 5-letnich z GUS, tylko osoby dorosłe).
export const POKOLENIA = [
  { id: 'Z', nazwa: 'Pokolenie Z', wiek: '18–29 lat', grupy: ['18', '19', '20-24', '25-29'] },
  { id: 'Y', nazwa: 'Pokolenie Y', wiek: '30–44 lata', grupy: ['30-34', '35-39', '40-44'] },
  { id: 'X', nazwa: 'Pokolenie X', wiek: '45–59 lat', grupy: ['45-49', '50-54', '55-59'] },
];

const suma = (grupy, i) => grupy.reduce((s, g) => s + GUS[g][i], 0);
export const populacja = POKOLENIA.map((p) => {
  const m = suma(p.grupy, 0);
  const k = suma(p.grupy, 1);
  return { ...p, m, k, razem: m + k };
});
export const N = populacja.reduce((s, p) => s + p.razem, 0);
export const NM = populacja.reduce((s, p) => s + p.m, 0);
export const NK = populacja.reduce((s, p) => s + p.k, 0);
export const udzial = (x) => x / N;

// Wartości Z alfa z tablic, jak na zajęciach (99% = 2,575)
export const Z_UFNOSCI = { 90: 1.645, 95: 1.96, 99: 2.575, 99.99: 5 };
// Współczynnik wielkości próby dla populacji wielodzielnych (WWP): liczba proporcji (kategorii) → współczynnik.
// Tabela z zajęć zaczyna się od 3 kategorii; przy 2 kategoriach (np. płeć) współczynnika nie ma, czyli 1.
export const WWP = {
  95: { 3: 1.53, 4: 1.66, 5: 1.73, 10: 2.05 },
  90: { 3: 1.71, 4: 1.84, 5: 2.04, 10: 2.44 },
};
export const wwp = (ufnosc, k) => (k <= 2 ? 1 : WWP[ufnosc][k]);

// Cecha jakościowa: n = Z² p(1−p) / e² · WWP; ze znanym N: n = Z² p(1−p) N / (Z² p(1−p) + (N−1) e²) · WWP
// p = odsetek najliczniejszej frakcji. Zwraca wynik przed zaokrągleniem.
export function nJak(ufnosc, p, e, Npop = null, k = 2) {
  const z = Z_UFNOSCI[ufnosc];
  const a = z * z * p * (1 - p);
  const n = Npop ? (a * Npop) / (a + (Npop - 1) * e * e) : a / (e * e);
  return n * wwp(ufnosc, k);
}
// Cecha ilościowa: n = Z² σ² / e²; ze znanym N: n = Z² σ² N / (Z² σ² + (N−1) e²)
// Przy błędzie podanym w % średniej: σ → współczynnik zmienności V = σ / średnia, e → ułamek (0,04).
export function nIl(ufnosc, sigma, e, Npop = null) {
  const z = Z_UFNOSCI[ufnosc];
  const a = z * z * sigma * sigma;
  return Npop ? (a * Npop) / (a + (Npop - 1) * e * e) : a / (e * e);
}
export const w_gore = (x) => Math.ceil(x - 1e-9);

// Rozdział próby metodą największych reszt (suma zawsze równa n)
export function alokuj(n, wagi) {
  const s = wagi.reduce((a, b) => a + b, 0);
  const dokl = wagi.map((w) => (n * w) / s);
  const wynik = dokl.map(Math.floor);
  let brak = n - wynik.reduce((a, b) => a + b, 0);
  dokl
    .map((d, i) => [d - Math.floor(d), i])
    .sort((a, b) => b[0] - a[0])
    .slice(0, brak)
    .forEach(([, i]) => wynik[i]++);
  return { dokladnie: dokl, wynik };
}

// Formatowanie po polsku: spacja co trzy cyfry, przecinek dziesiętny
export const fmt = (x, d = 0) =>
  x.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/ /g, ' ');
export const proc = (x, d = 2) => fmt(x * 100, d) + '%';

// Błąd maksymalny (połowa przedziału ufności) dla danej liczby respondentów, z poprawką na skończoną populację
export const blad = (n, Npop, z = 1.96, p = 0.5) => z * Math.sqrt((p * (1 - p)) / n) * Math.sqrt((Npop - n) / (Npop - 1));
