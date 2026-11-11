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
  { nr: 1, slug: 'istota', title: 'Istota i zasady rachunkowości', short: 'Użytkownicy sprawozdań, cechy użytecznej informacji, zasady, sprawozdanie, księgi, dowody i cena nabycia.', status: 'live', minutes: 60, cwiczenia: 'cwiczenia' },
  { nr: 2, slug: 'bilans', title: 'Bilans', short: 'Aktywa i pasywa, układ bilansu z ustawy, pułapki przy przypisywaniu składników i brakująca pozycja.', status: 'live', minutes: 70, cwiczenia: 'cwiczenia' },
  { nr: 3, slug: 'konta', title: 'Operacje i konta bilansowe', short: 'Zdarzenie a operacja, cztery typy operacji, konto teowe, Wn i Ma, saldo i podwójny zapis.', status: 'live', minutes: 75, cwiczenia: 'cwiczenia' },
  { nr: 4, slug: 'zestawienie', title: 'Zestawienie obrotów i sald', short: 'Pełny cykl: bilans otwarcia, konta, zestawienie obrotów i sald, bilans zamknięcia. Strata na minusie i szukanie błędów.', status: 'live', minutes: 70, cwiczenia: 'cwiczenia' },
  { nr: 5, slug: 'wynik-finansowy', title: 'Konta wynikowe i wynik finansowy', short: 'Przychody i koszty, sprzedaż w dwóch zapisach, PPO i PKO, przeksięgowanie na wynik, podatek dochodowy i zysk netto.', status: 'live', minutes: 75, cwiczenia: 'cwiczenia' },
  { nr: 6, slug: 'srodki-pieniezne', title: 'Środki pieniężne', short: 'Kasa i raport kasowy, rachunek bieżący i wyciąg, środki pieniężne w drodze, akredytywa, czeki, weksle obce i własne, suma wekslowa i dyskonto.', status: 'live', minutes: 75, cwiczenia: 'cwiczenia' },
  { nr: 7, slug: 'inwestycje-krotkoterminowe', title: 'Inwestycje krótkoterminowe', short: 'Papiery wartościowe i inne krótkoterminowe aktywa finansowe.', status: 'soon' },
  { nr: 8, slug: 'rozrachunki', title: 'Rozrachunki', short: 'Należności i zobowiązania, konta analityczne, storno, rozrachunki z pracownikami, różnice kursowe.', status: 'soon' },
  { nr: 9, slug: 'srodki-trwale', title: 'Środki trwałe', short: 'Klasyfikacja, amortyzacja i ulepszenie środka trwałego.', status: 'soon' },
  { nr: 10, slug: 'materialy', title: 'Materiały', short: 'Dokumenty obrotu, wycena i ewidencja materiałów.', status: 'soon' },
  { nr: 11, slug: 'koszty', title: 'Koszty', short: 'Układ rodzajowy i funkcjonalno-kalkulacyjny, działalność pomocnicza.', status: 'soon' },
  { nr: 12, slug: 'wyroby-gotowe', title: 'Wyroby gotowe i wynik', short: 'Wyroby gotowe w rzeczywistym i stałym koszcie wytworzenia, zmiana stanu produktów i wynik finansowy firmy produkcyjnej.', status: 'soon' },
];

export { SLOWNICZEK };
