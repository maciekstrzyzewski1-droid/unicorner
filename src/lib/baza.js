// Obliczenia do modułu „Baza danych z ankiety” (kurs „Metody badań rynku”).
// Dane: zagregowana „Baza danych – zajęcia 1/2” (ankieta o AI w aplikacji bankowej, 361 respondentów),
// wygenerowana skryptem narzedzia/mat-check/badania-rynku/baza-agregaty.py. W repo są tylko zliczenia i sumy.
// Każda liczba, którą moduł podaje w tekście, powstaje tutaj — tekst i tabele nie mogą się rozjechać.
import B from '../data/mbr/baza-ai.js';
import { fmt } from './proba.js';

export { B, fmt };
export const N = B.n;
export const LIKERT = B.likert;
export const zm = (id) => B.zmienne[id];
export const kat = (id) => B.zmienne[id].kat;

// procent z dwoma miejscami jak w tabeli przestawnej Excela („48,65%”); d = liczba miejsc po przecinku
export const pr = (x, d = 2) => fmt(x, d) + '%';
// procent z ułamka: 0,4865 → „48,65%”
export const prU = (x, d = 2) => pr(100 * x, d);

// Kolejność etykiet, w jakiej tabela przestawna Excela ustawia je sama: najpierw liczby (rosnąco),
// potem teksty alfabetycznie (cyfry przed literami, „1-2” przed „ani razu”).
export function porzadekExcela(etykiety) {
  const liczba = (t) => /^\d+$/.test(t);
  return [...etykiety].sort((a, b) => {
    if (liczba(a) && liczba(b)) return Number(a) - Number(b);
    if (liczba(a)) return -1;
    if (liczba(b)) return 1;
    return a.localeCompare(b, 'pl', { sensitivity: 'base' });
  });
}

// Tabela krzyżowa (liczebności): wiersze = pytanie w, kolumny = zmienna grupująca k.
// o.bezW / o.bezK — kategorie wyrzucone filtrem; o.excel — kolejność jak ustawia ją Excel (domyślnie: jak w kafeterii).
export function tabela(w, k, o = {}) {
  const kw = kat(w), kk = kat(k);
  const m = B.krzyz[`${w}|${k}`];
  if (!m) throw new Error(`baza.js: brak tabeli krzyżowej ${w}|${k}`);
  let wi = kw.map((_, i) => i).filter((i) => !(o.bezW ?? []).includes(kw[i]));
  let ki = kk.map((_, j) => j).filter((j) => !(o.bezK ?? []).includes(kk[j]));
  if (o.excel) {
    const pw = porzadekExcela(wi.map((i) => kw[i])), pk = porzadekExcela(ki.map((j) => kk[j]));
    wi = pw.map((t) => kw.indexOf(t));
    ki = pk.map((t) => kk.indexOf(t));
  }
  const liczby = wi.map((i) => ki.map((j) => m[i][j]));
  const sumyW = liczby.map((r) => r.reduce((a, b) => a + b, 0));
  const sumyK = ki.map((_, j) => liczby.reduce((a, r) => a + r[j], 0));
  const suma = sumyW.reduce((a, b) => a + b, 0);
  return { w, k, wiersze: wi.map((i) => kw[i]), kolumny: ki.map((j) => kk[j]), liczby, sumyW, sumyK, suma };
}

// Rozkład jednej zmiennej (tabela przestawna z jednym polem w Wierszach)
export function rozklad(id, o = {}) {
  const kk = kat(id);
  let idx = kk.map((_, i) => i).filter((i) => !(o.bez ?? []).includes(kk[i]));
  if (o.excel) idx = porzadekExcela(idx.map((i) => kk[i])).map((t) => kk.indexOf(t));
  const liczby = idx.map((i) => B.rozklad[id][i]);
  const suma = liczby.reduce((a, b) => a + b, 0);
  return { id, kat: idx.map((i) => kk[i]), liczby, suma, proc: liczby.map((x) => (100 * x) / suma) };
}

// „Pokaż wartości jako”: 'liczba' | 'kol' (% sumy kolumny) | 'wiersz' (% sumy wiersza) | 'calosc' (% sumy końcowej)
// Zwraca macierz wartości (procenty 0–100 albo liczby) razem z sumami, w tym samym układzie co tabela.
export function pokaz(t, tryb) {
  const f = (x, i, j) => {
    if (tryb === 'kol') return (100 * x) / t.sumyK[j];
    if (tryb === 'wiersz') return (100 * x) / t.sumyW[i];
    if (tryb === 'calosc') return (100 * x) / t.suma;
    return x;
  };
  const kom = t.liczby.map((r, i) => r.map((x, j) => f(x, i, j)));
  const sW = t.sumyW.map((x, i) => (tryb === 'kol' ? (100 * x) / t.suma : tryb === 'wiersz' ? 100 : tryb === 'calosc' ? (100 * x) / t.suma : x));
  const sK = t.sumyK.map((x, j) => (tryb === 'kol' ? 100 : tryb === 'wiersz' ? (100 * x) / t.suma : tryb === 'calosc' ? (100 * x) / t.suma : x));
  const s = tryb === 'liczba' ? t.suma : 100;
  return { kom, sW, sK, s };
}

// Średnia kodów 1–5 stwierdzenia s (P7_k, P8_k) w grupach zmiennej g; 'N/D' nie wchodzi do średniej.
// o.nd0 = true liczy N/D jako 0 (błąd, który pokazujemy w pułapce).
export function srednie(s, g, o = {}) {
  const dane = g ? B.srednie[s][g] : [B.srednie[s]._];
  if (!dane) throw new Error(`baza.js: brak średnich ${s}|${g}`);
  const k = g ? kat(g) : ['wszyscy'];
  return k.map((et, i) => {
    const [n, suma, nd] = dane[i];
    const mian = o.nd0 ? n + nd : n;
    return { et, n, suma, nd, srednia: mian ? suma / mian : NaN };
  }).filter((r) => !(o.bez ?? []).includes(r.et));
}
export const sredniaOgolem = (s, o = {}) => srednie(s, null, o)[0];

// Odpowiedzi na stwierdzenie (liczebność każdego stopnia skali + N/D)
export const odpowiedzi = (s) => kat(s).map((t, i) => ({ t, n: B.rozklad[s][i], kod: LIKERT.indexOf(t) + 1 || null }));

// Pytanie wielokrotnego wyboru P6: ile osób zaznaczyło każdą odpowiedź (1 = zaznaczona)
export const P6 = Array.from({ length: 9 }, (_, i) => {
  const id = `P6_${i + 1}`;
  const [tak, nie] = B.rozklad[id];
  return { id, kol: B.zmienne[id].kol, t: B.zmienne[id].nazwa.replace(/^P6 \(\d\) /, ''), tak, nie };
});
export const P6suma = P6.reduce((a, p) => a + p.tak, 0);

// Indeks P7: średnia z ośmiu ocen jednej osoby, potem średnia w grupie
export function indeksP7(g) {
  if (!g) return B.indeksP7._[1] / B.indeksP7._[0];
  return kat(g).map((et, i) => ({ et, n: B.indeksP7[g][i][0], srednia: B.indeksP7[g][i][1] / B.indeksP7[g][i][0] }));
}

// Kontrole spójności bazy i dane do przekodowania (zajęcia 2)
export const K = B.kontrole;
export const G = B.grupy;

// Próbka: pierwsze wiersze bazy (tekst jak w Excelu). wiersz(i) = numer wiersza w Excelu (nagłówek w 1).
export const PROBKA = B.probka;
export const wierszExcela = (i) => i + 2;
export const kod = (t) => LIKERT.indexOf(t) + 1 || null;

// krótkie nazwy stwierdzeń (do nagłówków) — tekst po numerze
export const tresc = (s) => B.zmienne[s].nazwa.replace(/^P\d \(\d\) /, '');
export const kolumna = (id) => B.zmienne[id].kol;
export const kolumnaKodu = (s) => B.skale[s].kolKod;

// Pojedyncze wiersze bazy (numer wiersza Excela → odpowiedzi): pierwsze 10 z próbki + wiersze z błędami
export const WIERSZE = (() => {
  const w = {};
  for (let i = 0; i < PROBKA.P1.length; i++) w[i + 2] = Object.fromEntries(Object.keys(PROBKA).map((k) => [k, PROBKA[k][i]]));
  for (const [r, v] of Object.entries(B.wybrane)) w[r] = v;
  return w;
})();
export const wartosc = (r, id) => {
  const w = WIERSZE[r];
  if (!w || !(id in w)) throw new Error(`baza.js: brak wiersza ${r} / ${id} w próbce`);
  return w[id];
};

// Klucz kodowy używany w module. Skala Likerta: jak w kolumnach AP–AW bazy (1 = zdecydowanie się nie zgadzam,
// 5 = zdecydowanie się zgadzam). Pytania tak/nie: 1 = tak, 2 = nie (jak w kolumnach P6 bazy: 1 = zaznaczone).
// '' = pusta komórka (brak danych: N/D, odmowa odpowiedzi).
export const KLUCZ = {
  P5: { tak: 1, nie: 2 },
  PLEC: { kobieta: 1, 'mężczyzna': 2, 'odmowa odp.': '' },
  GEN: { X: 1, Y: 2, Z: 3 },
};
export const jestSkala = (id) => /^P[78]_/.test(id);
export function koduj(id, t) {
  if (jestSkala(id)) return t === 'N/D' ? '' : kod(t);
  const k = KLUCZ[id];
  if (!k || !(t in k)) throw new Error(`baza.js: brak klucza dla ${id} = ${t}`);
  return k[t];
}
// słownie, skąd kod (do wyjaśnień w ćwiczeniach)
export function dlaczegoKod(id, t) {
  if (jestSkala(id)) {
    if (t === 'N/D') return '„N/D” (nie dotyczy) to brak odpowiedzi. Zostaw pustą komórkę. Zero weszłoby do średniej i zaniżyło wynik.';
    return `W kluczu stopnie skali idą od 1 = „zdecydowanie się nie zgadzam” do 5 = „zdecydowanie się zgadzam”. „${t}” to ${kod(t)}.`;
  }
  if (id === 'P5') return 'W kluczu: tak = 1, nie = 2 (tak samo zakodowane są kolumny P6 w bazie).';
  if (id === 'PLEC') return t === 'odmowa odp.' ? 'Odmowa odpowiedzi to brak danych — pusta komórka, nie osobny kod.' : 'W kluczu: kobieta = 1, mężczyzna = 2.';
  if (id === 'GEN') return 'W kluczu: X = 1, Y = 2, Z = 3.';
  return '';
}

// krótka nazwa zmiennej do zdań („P5”, „P7 (1)”, „generacja”)
export function krotka(id) {
  const m = id.match(/^P(\d)(?:_(\d))?$/);
  if (m) return m[2] ? `P${m[1]} (${m[2]})` : `P${m[1]}`;
  return { PLEC: 'płeć', GEN: 'generacja', WYK: 'wykształcenie', SYT: 'sytuacja zawodowa', DOCH: 'dochód', ZMIANA: 'zmiana sytuacji finansowej', STAB: 'stabilność dochodów', MIEJSCE: 'miejsce zamieszkania' }[id] ?? id;
}
// odmiana „osoba / osoby / osób”
export function osob(n) {
  if (n === 1) return 'osoba';
  const d = n % 10, dd = n % 100;
  return d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14) ? 'osoby' : 'osób';
}
