// Kurs „Rachunkowość” (UEP) — opis kursu i lista modułów.
// status: 'live' = strona istnieje w src/pages/rachunkowosc/<slug>.mdx i jest linkowana; 'soon' = kafelek „wkrótce”.
// Kolejność: od podstaw (zasady, bilans, konta) do ewidencji poszczególnych składników.
import { SLOWNICZEK } from './rachunkowosc-slowniczek.js';

export const COURSE = {
  slug: 'rachunkowosc',
  name: 'Rachunkowość',
  h1: 'Rachunkowość',
  h1Grad: '— od bilansu do konta',
  seoTitle: 'Rachunkowość od zera — kurs dla studentów ekonomii i zarządzania',
  desc: 'Bilans, konta teowe, Wn i Ma, podwójny zapis, a potem ewidencja pieniędzy, rozrachunków, środków trwałych i materiałów. Każde pojęcie wyjaśnione, każdy zapis z „dlaczego”.',
  seoDesc: 'Kurs rachunkowości od zera: bilans, operacje gospodarcze, konto teowe, strony Wn i Ma, saldo, podwójny zapis, środki pieniężne, rozrachunki, środki trwałe i materiały. Zadania z zajęć krok po kroku.',
  dlaKogo: 'pierwszy kurs rachunkowości, ekonomia i zarządzanie',
  wymagania: 'nic — zaczynamy od zera',
  slowniczek: { tytul: 'Słowniczek pojęć', url: '/rachunkowosc/pojecia.html', kolumna: 'Skrót' },
};

export const MODULES = [
  { nr: 1, slug: 'istota', title: 'Istota i zasady rachunkowości', short: 'Po co jest rachunkowość, kto z niej korzysta, zasady i księgi rachunkowe.', status: 'soon' },
  { nr: 2, slug: 'bilans', title: 'Bilans', short: 'Aktywa i pasywa, układ bilansu z ustawy i przypisywanie składników do pozycji.', status: 'soon' },
  { nr: 3, slug: 'konta', title: 'Operacje i konta bilansowe', short: 'Zdarzenie a operacja, cztery typy operacji, konto teowe, Wn i Ma, saldo i podwójny zapis.', status: 'live', minutes: 75, cwiczenia: 'cwiczenia' },
  { nr: 4, slug: 'konta-w-praktyce', title: 'Konta w praktyce', short: 'Konta wynikowe, storno czarne i czerwone, konta syntetyczne i analityczne.', status: 'soon' },
  { nr: 5, slug: 'srodki-pieniezne', title: 'Środki pieniężne', short: 'Kasa, rachunek bankowy, czeki, weksle i dyskonto.', status: 'soon' },
  { nr: 6, slug: 'inwestycje-krotkoterminowe', title: 'Inwestycje krótkoterminowe', short: 'Papiery wartościowe i inne krótkoterminowe aktywa finansowe.', status: 'soon' },
  { nr: 7, slug: 'rozrachunki', title: 'Rozrachunki', short: 'Należności i zobowiązania, rozrachunki z pracownikami, różnice kursowe.', status: 'soon' },
  { nr: 8, slug: 'srodki-trwale', title: 'Środki trwałe', short: 'Klasyfikacja, amortyzacja i ulepszenie środka trwałego.', status: 'soon' },
  { nr: 9, slug: 'materialy', title: 'Materiały', short: 'Dokumenty obrotu, wycena i ewidencja materiałów.', status: 'soon' },
  { nr: 10, slug: 'koszty', title: 'Koszty', short: 'Układ rodzajowy i funkcjonalno-kalkulacyjny, działalność pomocnicza.', status: 'soon' },
];

export { SLOWNICZEK };
