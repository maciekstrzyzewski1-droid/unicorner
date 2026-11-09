// Kurs „Metody badań rynku” (UEP) — opis kursu i lista modułów.
// status: 'live' = strona istnieje w src/pages/badania-rynku/<slug>.mdx i jest linkowana; 'soon' = kafelek „wkrótce”.
// Kolejność jak na zajęciach: najpierw narzędzie (kwestionariusz i skale), potem próba (ile osób i jak je dobrać).
import { SLOWNICZEK } from './badania-rynku-slowniczek.js';

export const COURSE = {
  slug: 'badania-rynku',
  name: 'Metody badań rynku',
  h1: 'Metody badań rynku',
  h1Grad: '— od ankiety do próby',
  seoTitle: 'Metody badań rynku od zera — skale, kafeteria, liczebność i dobór próby',
  desc: 'Jak zbudować dobre pytanie do ankiety, jaką skalą mierzyć, ile osób zbadać i jak je dobrać. Każde pojęcie wyjaśnione, każde zadanie z zajęć krok po kroku.',
  seoDesc: 'Kurs metod badań rynku od zera: skale pomiarowe (nominalna, porządkowa, stosunkowa), skale postaw (Likerta, semantyczna, pozycyjna, rang), zasady budowy kafeterii, błędy w pytaniach ankiety, minimalna liczebność próby i dobór kwotowy.',
  dlaKogo: 'pierwszy kurs badań rynku i badań marketingowych, ekonomia i zarządzanie',
  wymagania: 'nic — zaczynamy od zera',
  slowniczek: { tytul: 'Słowniczek pojęć', url: '/badania-rynku/pojecia.html', kolumna: 'Pojęcie' },
};

export const MODULES = [
  { nr: 1, slug: 'skale', title: 'Skale pomiarowe i kafeteria', short: 'Skale nominalna, porządkowa i stosunkowa, skale postaw, cztery zasady budowy kafeterii i typowe błędy w pytaniach ankiety.', status: 'soon', minutes: 60, cwiczenia: 'cwiczenia' },
  { nr: 2, slug: 'liczebnosc-proby', title: 'Minimalna liczebność próby', short: 'Poziom ufności, błąd szacunku, współczynnik zmienności i frakcje. Ile osób trzeba zbadać.', status: 'soon' },
  { nr: 3, slug: 'dobor-kwotowy', title: 'Dobór kwotowy', short: 'Struktura populacji, struktura próby i kwoty dla ankietera — tabela po tabeli.', status: 'soon' },
];

export { SLOWNICZEK };
