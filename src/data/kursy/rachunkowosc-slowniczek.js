// Słowniczek kursu „Rachunkowość” (pojęcia i skróty z zajęć). Każdy nowy moduł dopisuje tu swoje pozycje (pole `modul` = slug modułu).
// t = skrót w LaTeX-u (opcjonalnie), czytamy = jak powiedzieć na głos, znaczy = jedno-dwa zdania prostym językiem.

export const SLOWNICZEK = [
  // --- Operacje i konta bilansowe ---
  { nazwa: 'Zdarzenie gospodarcze', znaczy: 'Wszystko, co dzieje się w firmie: zamówienie, oferta, podpisanie umowy, wpływ pieniędzy. Nie każde zdarzenie się księguje.', modul: 'konta' },
  { nazwa: 'Operacja gospodarcza', znaczy: 'Zdarzenie wyrażone w złotych, które zmienia majątek albo źródła jego finansowania i ma potwierdzenie w dokumencie. Tylko operacje się księguje.', modul: 'konta' },
  { nazwa: 'Operacja aktywna (A)', znaczy: 'Jeden składnik aktywów rośnie, drugi maleje o tyle samo. Suma bilansowa bez zmian.', modul: 'konta' },
  { nazwa: 'Operacja pasywna (P)', znaczy: 'Jeden składnik pasywów rośnie, drugi maleje o tyle samo. Suma bilansowa bez zmian.', modul: 'konta' },
  { nazwa: 'Operacja aktywno-pasywna zwiększająca (AP+)', znaczy: 'Aktywa i pasywa rosną o tę samą kwotę. Suma bilansowa rośnie.', modul: 'konta' },
  { nazwa: 'Operacja aktywno-pasywna zmniejszająca (AP−)', znaczy: 'Aktywa i pasywa maleją o tę samą kwotę. Suma bilansowa maleje.', modul: 'konta' },
  { nazwa: 'Operacja wynikowa', znaczy: 'Operacja, w której jedna strona to koszt albo przychód. Zmienia wynik finansowy (zysk lub stratę).', modul: 'konta' },
  { nazwa: 'Konto księgowe (konto teowe)', znaczy: 'Tabelka w kształcie litery T, na której zapisujemy zmiany jednego składnika bilansu. Lewa strona to Wn, prawa — Ma.', modul: 'konta' },
  { t: '\\text{Wn}', nazwa: 'Winien (Dt, debet)', czytamy: 'winien', znaczy: 'Lewa strona konta. Na koncie aktywnym zwiększenia, na pasywnym zmniejszenia.', modul: 'konta' },
  { t: '\\text{Ma}', nazwa: 'Ma (Ct, kredyt)', czytamy: 'ma', znaczy: 'Prawa strona konta. Na koncie aktywnym zmniejszenia, na pasywnym zwiększenia.', modul: 'konta' },
  { t: '\\text{Sp.}', nazwa: 'Saldo początkowe', czytamy: 'saldo początkowe', znaczy: 'Stan składnika na start, przepisany z bilansu otwarcia. Konto aktywne — po Wn, pasywne — po Ma.', modul: 'konta' },
  { t: '\\text{Obr.}', nazwa: 'Obroty', czytamy: 'obroty', znaczy: 'Suma jednej strony konta. Na zajęciach liczymy ją razem z saldem początkowym.', modul: 'konta' },
  { t: '\\text{Sk Wn},\\ \\text{Sk Ma}', nazwa: 'Saldo końcowe', czytamy: 'saldo końcowe winien, saldo końcowe ma', znaczy: 'Różnica obrotów: większe minus mniejsze. Nazwa od strony, która przeważa. Wpisujemy je po stronie mniejszej.', modul: 'konta' },
  { nazwa: 'Podwójny zapis', znaczy: 'Każdą operację zapisujemy na co najmniej dwóch kontach, po przeciwnych stronach, w tej samej kwocie.', modul: 'konta' },
  { nazwa: 'Suma bilansowa', znaczy: 'Suma aktywów (zawsze równa sumie pasywów).', modul: 'konta' },
];
