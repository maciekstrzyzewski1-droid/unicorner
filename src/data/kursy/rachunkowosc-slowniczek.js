// Słowniczek kursu „Rachunkowość” (pojęcia i skróty z zajęć). Każdy nowy moduł dopisuje tu swoje pozycje (pole `modul` = slug modułu).
// t = skrót w LaTeX-u (opcjonalnie), czytamy = jak powiedzieć na głos, znaczy = jedno-dwa zdania prostym językiem.

export const SLOWNICZEK = [
  // --- Bilans ---
  { nazwa: 'Bilans', znaczy: 'Zestawienie majątku firmy (aktywa) i źródeł jego finansowania (pasywa) na jeden dzień. Aktywa = pasywa.', modul: 'bilans' },
  { nazwa: 'Aktywa', znaczy: 'Majątek firmy: co firma ma, także pieniądze, które inni są jej winni (należności).', modul: 'bilans' },
  { nazwa: 'Pasywa', znaczy: 'Źródła finansowania majątku: kapitał własny (właścicieli) i kapitał obcy (zobowiązania i rezerwy).', modul: 'bilans' },
  { nazwa: 'Aktywa trwałe', znaczy: 'Majątek używany dłużej niż rok: WNiP, rzeczowe aktywa trwałe, należności i inwestycje długoterminowe.', modul: 'bilans' },
  { nazwa: 'Aktywa obrotowe', znaczy: 'Majątek zużywany, sprzedawany albo zamieniany na gotówkę w ciągu roku: zapasy, należności krótkoterminowe, pieniądze.', modul: 'bilans' },
  { nazwa: 'Należności', znaczy: 'Pieniądze, które inni są winni firmie. Aktywa.', modul: 'bilans' },
  { nazwa: 'Zobowiązania', znaczy: 'Pieniądze, które firma jest winna innym. Pasywa (kapitał obcy).', modul: 'bilans' },
  { nazwa: 'Rezerwy na zobowiązania', znaczy: 'Pewne albo prawie pewne przyszłe wydatki o niepewnej kwocie lub terminie, np. odprawy emerytalne.', modul: 'bilans' },
  { nazwa: 'Kapitał własny', znaczy: 'Pieniądze właścicieli i zyski zostawione w firmie. Kapitał własny = aktywa − zobowiązania i rezerwy.', modul: 'bilans' },
  { nazwa: 'Leasing operacyjny', znaczy: 'Korzystanie z cudzej rzeczy za raty. Rzecz zostaje w bilansie leasingodawcy, nie użytkownika.', modul: 'bilans' },
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
