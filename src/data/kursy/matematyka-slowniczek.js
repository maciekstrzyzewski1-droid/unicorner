// Słowniczek kursu „Matematyka” (symbole). Każdy nowy moduł dopisuje tu swoje pozycje (pole `modul` = slug modułu).
// t = LaTeX, czytamy = jak powiedzieć na głos, znaczy = jedno-dwa zdania prostym językiem.

export const SLOWNICZEK = [
  // --- Logika ---
  { t: '0,\\ 1', nazwa: 'Wartości logiczne', czytamy: 'zero — fałsz, jeden — prawda', znaczy: 'Zamiast słów „fałsz” i „prawda” piszemy 0 i 1.', modul: 'logika' },
  { t: 'p,\\ q,\\ r', nazwa: 'Zdania proste', czytamy: 'pe, ku, er', znaczy: 'Małe litery to skróty („ksywki”) konkretnych zdań, np. $p$ = „pada deszcz”.', modul: 'logika' },
  { t: '\\neg p', nazwa: 'Negacja', czytamy: 'nieprawda, że p', znaczy: 'Odwraca wartość zdania: 1 → 0, 0 → 1.', modul: 'logika' },
  { t: 'p \\land q', nazwa: 'Koniunkcja', czytamy: 'p i q', znaczy: 'Prawdziwa tylko, gdy oba zdania są prawdziwe.', modul: 'logika' },
  { t: 'p \\lor q', nazwa: 'Alternatywa', czytamy: 'p lub q', znaczy: 'Prawdziwa, gdy co najmniej jedno zdanie jest prawdziwe (także oba).', modul: 'logika' },
  { t: 'p \\Rightarrow q', nazwa: 'Implikacja', czytamy: 'jeżeli p, to q', znaczy: 'Fałszywa tylko wtedy, gdy $p = 1$, a $q = 0$.', modul: 'logika' },
  { t: 'p \\Leftrightarrow q', nazwa: 'Równoważność', czytamy: 'p wtedy i tylko wtedy, gdy q', znaczy: 'Prawdziwa, gdy oba zdania mają tę samą wartość.', modul: 'logika' },
  { t: 'P(x)', nazwa: 'Funkcja zdaniowa', czytamy: 'P od x', znaczy: 'Wyrażenie ze zmienną $x$; staje się zdaniem po wstawieniu wartości albo dodaniu kwantyfikatora.', modul: 'logika' },
  { t: '\\forall', nazwa: 'Kwantyfikator ogólny', czytamy: 'dla każdego', znaczy: 'Warunek ma zachodzić dla wszystkich elementów. Obalasz go jednym kontrprzykładem.', modul: 'logika' },
  { t: '\\exists', nazwa: 'Kwantyfikator szczegółowy', czytamy: 'istnieje', znaczy: 'Wystarczy jeden element spełniający warunek.', modul: 'logika' },
  { t: '\\exists!', nazwa: 'Istnieje dokładnie jeden', czytamy: 'istnieje dokładnie jeden', znaczy: 'Warunek spełnia jeden element — nie zero i nie dwa.', modul: 'logika' },
  { t: '\\forall_{x \\in \\mathbb{R}}', nazwa: 'Kwantyfikator ze zbiorem', czytamy: 'dla każdego x należącego do R', znaczy: 'Indeks na dole mówi, skąd bierzemy $x$.', modul: 'logika' },
  { t: 'x \\in A', nazwa: 'Należenie', czytamy: 'x należy do A', znaczy: 'Element $x$ jest w zbiorze $A$. Przekreślone $\\notin$ — nie należy.', modul: 'logika' },
  { t: '\\mathbb{N}', nazwa: 'Liczby naturalne', czytamy: 'en', znaczy: '$0, 1, 2, 3, \\ldots$ (w tym kursie z zerem — sprawdź konwencję prowadzącego).', modul: 'logika' },
  { t: '\\mathbb{Z}', nazwa: 'Liczby całkowite', czytamy: 'zet', znaczy: '$\\ldots, -2, -1, 0, 1, 2, \\ldots$', modul: 'logika' },
  { t: '\\mathbb{R}', nazwa: 'Liczby rzeczywiste', czytamy: 'er', znaczy: 'Wszystkie liczby z osi liczbowej, także ułamki, $\\sqrt{2}$, $\\pi$.', modul: 'logika' },
  { t: '\\neq,\\ \\leq,\\ \\geq', nazwa: 'Relacje między liczbami', czytamy: 'różne od, mniejsze lub równe, większe lub równe', znaczy: 'Zaprzeczeniem $<$ jest $\\geq$, a zaprzeczeniem $>$ jest $\\leq$.', modul: 'logika' },
];
