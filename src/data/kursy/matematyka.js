// Kurs „Matematyka” (UEP, 1. rok) — opis kursu i lista modułów.
// status: 'live' = strona istnieje w src/pages/matematyka/<slug>.mdx i jest linkowana; 'soon' = kafelek „wkrótce”.
// cwiczenia: id kotwicy sekcji „Ćwiczenia przed kolokwium” w module (link na stronie kursu i w nagłówku modułu).
// Kolejność = kolejność tematów na zajęciach (Temat 1 … Temat 13).
import { SLOWNICZEK } from './matematyka-slowniczek.js';

export const COURSE = {
  slug: 'matematyka',
  name: 'Matematyka',
  h1: 'Matematyka',
  h1Grad: '— od zera, bez dziur',
  seoTitle: 'Matematyka od zera — kurs dla studentów ekonomii',
  desc: 'Od logiki i zbiorów, przez macierze i programowanie liniowe, po pochodne i całki. Każdy symbol wyjaśniony, każdy krok z „dlaczego”.',
  seoDesc: 'Kurs matematyki od zera: logika, zbiory, relacje, macierze, układy równań, programowanie liniowe, matematyka finansowa, pochodne i całki. Każdy symbol wyjaśniony, zadania krok po kroku.',
  dlaKogo: '1. rok, ekonomia i zarządzanie',
  wymagania: 'matematyka z liceum (podstawa)',
  slowniczek: { tytul: 'Słowniczek symboli', url: '/matematyka/symbole.html', kolumna: 'Symbol' },
};

export const MODULES = [
  { nr: 1, slug: 'logika', title: 'Logika', short: 'Zdania, spójniki, tabelki zero-jedynkowe, tautologie i kwantyfikatory.', status: 'live', minutes: 70, cwiczenia: 'cwiczenia' },
  { nr: 2, slug: 'zbiory', title: 'Zbiory', short: 'Działania na zbiorach, przedziały, iloczyn kartezjański, zasada włączeń i wyłączeń.', status: 'live', minutes: 60, cwiczenia: 'cwiczenia' },
  { nr: 3, slug: 'relacje', title: 'Relacje', short: 'Macierz i graf relacji, własności, złożenie, relacje porządkujące i optimum Pareto.', status: 'live', minutes: 70, cwiczenia: 'cwiczenia' },
  { nr: 4, slug: 'macierze', title: 'Macierze', short: 'Mnożenie, wyznacznik, rząd i macierz odwrotna — kiedy działa, a kiedy nie.', status: 'soon' },
  { nr: 5, slug: 'uklady-rownan', title: 'Układy równań liniowych', short: 'Metoda eliminacji, układy oznaczone, nieoznaczone i sprzeczne, rozwiązania bazowe.', status: 'soon' },
  { nr: 6, slug: 'programowanie-liniowe', title: 'Programowanie liniowe', short: 'Model decyzyjny, zbiór rozwiązań dopuszczalnych i metoda geometryczna.', status: 'soon' },
  { nr: 7, slug: 'matematyka-finansowa', title: 'Matematyka finansowa', short: 'Procent prosty i składany, wartość bieżąca i przyszła, stopa zwrotu.', status: 'soon' },
  { nr: 8, slug: 'pochodne', title: 'Pochodna funkcji jednej zmiennej', short: 'Co mierzy pochodna, wzory i reguły różniczkowania krok po kroku.', status: 'soon' },
  { nr: 9, slug: 'badanie-funkcji', title: 'Badanie zmienności funkcji', short: 'Monotoniczność, ekstrema, wypukłość i punkty przegięcia — z tabelką.', status: 'soon' },
  { nr: 10, slug: 'funkcje-wielu-zmiennych', title: 'Funkcje wielu zmiennych', short: 'Pochodne cząstkowe i ekstrema bezwarunkowe.', status: 'soon' },
  { nr: 11, slug: 'ekstrema-warunkowe', title: 'Ekstrema warunkowe', short: 'Funkcja Lagrange’a i wyznacznik obrzeżony.', status: 'soon' },
  { nr: 12, slug: 'calka-nieoznaczona', title: 'Całka nieoznaczona', short: 'Wzory, całkowanie przez podstawienie i przez części.', status: 'soon' },
  { nr: 13, slug: 'calka-oznaczona', title: 'Całka oznaczona', short: 'Pole pod wykresem i między wykresami.', status: 'soon' },
];

export { SLOWNICZEK };
