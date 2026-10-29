// Kurs „Metody badań rynku” (UEP) — opis kursu i lista modułów.
// status: 'live' = strona istnieje w src/pages/metody-badan-rynku/<slug>.mdx i jest linkowana; 'soon' = kafelek „wkrótce”.
// Na razie jest jeden moduł (pilot). Kolejne dojdą, gdy będą materiały z zajęć.
import { SLOWNICZEK } from './metody-badan-rynku-slowniczek.js';

export const COURSE = {
  slug: 'metody-badan-rynku',
  name: 'Metody badań rynku',
  h1: 'Metody badań rynku',
  h1Grad: '— od populacji do próby',
  seoTitle: 'Metody badań rynku — wielkość próby krok po kroku',
  desc: 'Kogo badamy, ilu respondentów wystarczy i jak rozdzielić ich między ankieterów. Wzory z zajęć rozebrane na części, dane GUS i zadania krok po kroku, a potem zagadnienia na egzamin.',
  seoDesc: 'Metody badań rynku: minimalna liczebność próby dla cechy jakościowej i ilościowej, Z alfa, błąd szacunku, najliczniejsza frakcja, współczynnik WWP, znane N i dobór kwotowy. Zadania z danymi GUS krok po kroku.',
  dlaKogo: 'pierwszy kurs badań rynku, ekonomia i zarządzanie',
  wymagania: 'nic — wzór rozbieramy od zera',
  slowniczek: { tytul: 'Słowniczek pojęć', url: '/metody-badan-rynku/pojecia.html', kolumna: 'Symbol' },
};

export const MODULES = [
  { nr: 1, slug: 'wielkosc-proby', title: 'Minimalna liczebność próby', short: 'Populacja z danych GUS, wzory dla cechy jakościowej i ilościowej, WWP, kilka kryteriów naraz i kwoty dla ankieterów.', status: 'soon', minutes: 60, cwiczenia: 'cwiczenia' },
  { nr: 2, slug: 'dobor-proby', title: 'Dobór próby', short: 'Operat losowania, błędy doboru próby, nielosowe i internetowe metody doboru.', status: 'soon' },
  { nr: 3, slug: 'proces-badania', title: 'Proces badania marketingowego', short: 'Decyzje w przedsiębiorstwie, marketingowy system informacyjny, fazy i etapy badania.', status: 'soon' },
  { nr: 4, slug: 'pomiar-i-skale', title: 'Pomiar i skale', short: 'Cechy ilościowe i jakościowe konsumenta, skale pomiarowe i skale postaw.', status: 'soon' },
  { nr: 5, slug: 'kwestionariusz', title: 'Kwestionariusz', short: 'Pytania otwarte i zamknięte, zrównoważone i niezrównoważone skalowanie odpowiedzi.', status: 'soon' },
  { nr: 6, slug: 'zbieranie-danych', title: 'Metody zbierania danych', short: 'Źródła wtórne, ankiety, panele, wywiady, obserwacja, eksperyment, pomiar fizjologiczny i etyka.', status: 'soon' },
];

export { SLOWNICZEK };
