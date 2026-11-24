// Kurs „Metody badań rynku” (UEP) — opis kursu i lista modułów.
// status: 'live' = strona istnieje w src/pages/metody-badan-rynku/<slug>.mdx i jest linkowana; 'soon' = kafelek „wkrótce”.
// Moduły 1 (liczebność próby) i 4 (skale i kafeteria) opublikowane 2026-11-09, moduł 2 (dobór kwotowy) dodany 2026-11-11.
// Moduł 6 (baza danych, Excel) dodany 2026-11-24 na gałęzi; moduł 7 i FGI/IDI oraz badania użyteczności — slajdy z wykładu są (zbiór „Badania rynkowe”).
// Teoria doboru próby pod egzamin (błędy doboru, operat losowania, metody nielosowe i internetowe) czeka na materiały z wykładów.
import { SLOWNICZEK } from './metody-badan-rynku-slowniczek.js';

export const COURSE = {
  slug: 'metody-badan-rynku',
  name: 'Metody badań rynku',
  h1: 'Metody badań rynku',
  h1Grad: '— od ankiety do próby',
  seoTitle: 'Metody badań rynku od zera — skale, kafeteria i wielkość próby',
  desc: 'Jak zbudować dobre pytanie do ankiety, ilu respondentów wystarczy i jak rozdzielić ich między ankieterów. Wzory z zajęć rozebrane na części, kwestionariusze z zajęć ocenione krok po kroku.',
  seoDesc: 'Metody badań rynku: skale pomiarowe i skale postaw, zasady budowy kafeterii, błędy w pytaniach ankiety, minimalna liczebność próby (Z alfa, błąd szacunku, frakcje, WWP, znane N) i dobór kwotowy. Zadania krok po kroku.',
  dlaKogo: 'pierwszy kurs badań rynku, ekonomia i zarządzanie',
  wymagania: 'nic — wzór rozbieramy od zera',
  slowniczek: { tytul: 'Słowniczek pojęć', url: '/metody-badan-rynku/pojecia.html', kolumna: 'Symbol' },
};

export const MODULES = [
  { nr: 1, slug: 'wielkosc-proby', title: 'Minimalna liczebność próby', short: 'Populacja z danych GUS, projekt w Excelu z kalkulatorem, wzory dla cechy jakościowej i ilościowej, WWP, kilka kryteriów naraz i kwoty dla ankieterów.', status: 'live', minutes: 80, cwiczenia: 'cwiczenia' },
  { nr: 2, slug: 'dobor-proby', title: 'Dobór kwotowy', short: 'Od tabeli populacji do kartek dla ankieterów: struktura w procentach, struktura próby, liczba ankieterów, schemat wyjściowy i komplet schematów A–D z trzema testami.', status: 'live', minutes: 50, cwiczenia: 'cwiczenia' },
  { nr: 3, slug: 'proces-badania', title: 'Proces badania marketingowego', short: 'Decyzje w przedsiębiorstwie, marketingowy system informacyjny, fazy i etapy badania.', status: 'soon' },
  { nr: 4, slug: 'skale', title: 'Skale, kafeteria i błędy w pytaniach', short: 'Skale nominalna, porządkowa i stosunkowa, skale postaw, cztery zasady budowy kafeterii, pytania otwarte i zamknięte, błędy w pytaniach ankiety.', status: 'live', minutes: 60, cwiczenia: 'cwiczenia' },
  { nr: 5, slug: 'zbieranie-danych', title: 'Metody zbierania danych', short: 'Źródła wtórne, ankiety, panele, wywiady, obserwacja, eksperyment, pomiar fizjologiczny i etyka.', status: 'soon' },
  { nr: 6, slug: 'baza-danych', title: 'Baza danych z ankiety', short: 'Excel na bazie z zajęć (361 osób): kodowanie odpowiedzi, sprawdzanie bazy, łączenie kategorii, tabele przestawne, tabele krzyżowe z procentami i średnie ocen w grupach.', status: 'soon', minutes: 75, cwiczenia: 'cwiczenia' },
  { nr: 7, slug: 'zaleznosci', title: 'Zależności między zmiennymi', short: 'Z wykładu: test chi-kwadrat, V Cramera i C Pearsona, testy dla skal porządkowych (U Manna-Whitneya, Kruskala-Wallisa, Spearman, tau Kendalla) i ilorazowych (test t, ANOVA, r Pearsona).', status: 'soon' },
];

export { SLOWNICZEK };
