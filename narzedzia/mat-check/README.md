# mat-check — sprawdzanie rachunków kursu

Skrypty pomocnicze do modułów kursu (nie trafiają na stronę — Astro buduje tylko `src/` i `public/`).

## Moduł 12 — całka nieoznaczona (`t12/`)

```bash
python3 -m venv /tmp/venv && /tmp/venv/bin/pip install sympy==1.13.3 antlr4-python3-runtime==4.11.1 lark==1.2.2
node -e "import('./src/lib/calki-zadania.js').then(m => require('fs').writeFileSync('/tmp/dane12.json', JSON.stringify(m.DANE)))"
/tmp/venv/bin/python narzedzia/mat-check/t12/sprawdz12.py /tmp/dane12.json   # każda linia każdego rachunku (pochodna = funkcja podcałkowa)
/tmp/venv/bin/python narzedzia/mat-check/t12/cw12.py                          # odpowiedzi w ćwiczeniach i quizie
```

`sprawdz12.py`: funkcje podcałkowe są wpisane ręcznie (niezależnie od danych). Linie typu `x` — pochodna każdej części łańcucha
równa funkcji podcałkowej (albo funkcji spod nowej całki, gdy linia od niej się zaczyna), `g` — każda część równa funkcji,
`t` — po wstawieniu `t = pod` pochodna po `x` równa funkcji, `k` („na kartce”) — lewa = prawa.

`t12/kontrola.cjs` (Playwright): błędy JS, szerokości wzorów na 1440/390/360 px, animacja krok po kroku, ćwiczenia, zrzuty.

## Podgląd modułu

`podglad.py <strona w dist> <katalog>` — strona i potrzebne pliki z `dist/_astro` z względnymi ścieżkami (katalog `astro/`, bo artifact nie przyjmuje ścieżek od „_”), do publikacji jako artifact.
