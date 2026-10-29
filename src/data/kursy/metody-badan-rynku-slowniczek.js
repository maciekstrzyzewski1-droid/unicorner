// Słowniczek kursu „Metody badań rynku”. Każdy nowy moduł dopisuje tu swoje pozycje (pole `modul` = slug modułu).
// t = symbol w LaTeX-u (opcjonalnie), czytamy = jak powiedzieć na głos, znaczy = jedno-dwa zdania prostym językiem.

export const SLOWNICZEK = [
  // --- Minimalna wielkość próby ---
  { nazwa: 'Populacja', t: 'N', czytamy: 'en', znaczy: 'Wszyscy, o których chcemy coś wiedzieć. W zadaniu: konsumenci pokoleń X, Y i Z w Wielkopolsce.', modul: 'wielkosc-proby' },
  { nazwa: 'Próba', t: 'n', czytamy: 'en (małe)', znaczy: 'Ta część populacji, którą naprawdę pytamy. Wynik z próby przenosimy na całą populację.', modul: 'wielkosc-proby' },
  { nazwa: 'Poziom ufności', t: '1-\\alpha', czytamy: 'jeden minus alfa', znaczy: 'Jak pewni chcemy być wyniku. Najczęściej 95%. Im wyższy, tym większa próba.', modul: 'wielkosc-proby' },
  { nazwa: 'Z alfa', t: 'Z_\\alpha', czytamy: 'zet alfa', znaczy: 'Wielokrotność standardowego błędu średniej, odczytywana z tablic dla poziomu ufności. Dla 95% to 1,96.', modul: 'wielkosc-proby' },
  { nazwa: 'Błąd maksymalny', t: 'e', czytamy: 'e', znaczy: 'Maksymalny dopuszczalny błąd szacunku: o ile wynik z próby może się mylić w górę lub w dół.', modul: 'wielkosc-proby' },
  { nazwa: 'Najliczniejsza frakcja', t: 'p', czytamy: 'pe', znaczy: 'Odsetek jednostek w największej grupie według badanej cechy, zapisany ułamkiem (41% to 0,41).', modul: 'wielkosc-proby' },
  { nazwa: 'Współczynnik wielkości próby', t: '\\text{WWP}', czytamy: 'wu wu pe', znaczy: 'Mnożnik dla populacji wielodzielnych, czyli cech z co najmniej trzema kategoriami. Odczytywany z tabeli (3 kategorie, 95%: 1,53).', modul: 'wielkosc-proby' },
  { nazwa: 'Odchylenie standardowe', t: '\\sigma', czytamy: 'sigma', znaczy: 'O ile przeciętnie wartości cechy ilościowej różnią się od średniej. Na slajdach także $\\delta$ (delta).', modul: 'wielkosc-proby' },
  { nazwa: 'Współczynnik zmienności', t: 'V', czytamy: 'fau', znaczy: 'Odchylenie standardowe podzielone przez średnią. Używamy go, gdy błąd jest podany w procentach średniej.', modul: 'wielkosc-proby' },
  { nazwa: 'Wzór ze znanym N', znaczy: 'Wersja wzoru, w której jest liczebność populacji. Przy małej populacji daje mniejszą próbę, przy bardzo dużej prawie nic nie zmienia.', modul: 'wielkosc-proby' },
  { nazwa: 'Dobór kwotowy', znaczy: 'Nielosowy dobór próby: strukturę populacji (np. wiek, płeć) przenosimy na skład próby.', modul: 'wielkosc-proby' },
  { nazwa: 'Kwota', znaczy: 'Ile osób z danej grupy ma przebadać jeden ankieter.', modul: 'wielkosc-proby' },
];
