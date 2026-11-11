# tresc-check: kod zamiast liczby w zbudowanym `dist/`

Po co: build Astro przechodzi, nawet gdy na stronie zamiast wartości stoi kod. Przykład z modułu „Dobór kwotowy”: `$n = {S.n}$` wypisało się jako „n = S.n”, bo MDX nie liczy wyrażeń `{…}` wewnątrz wzoru `$…$`, a KaTeX pokazuje je dosłownie.

## Co sprawdza (każdy plik HTML w `dist/`)
- **Kod we wzorze KaTeX:** grupa `{…}`, która nie stoi za komendą TeX (`\frac{`, `\text{`), `^`, `_` ani inną klamrą, a w środku ma `nazwa.pole` (`S.n`), funkcję o nazwie z 2+ liter (`fmt(x)`) albo nazwę camelCase (`sN`, `sPct[0]`). Zwykłe `{f(x)}` czy `{r([A \mid b])}` przechodzą.
- **Błąd KaTeX:** element `katex-error` (wzór, którego KaTeX nie umiał złożyć).
- **Śmieci z JS w widocznym tekście:** `NaN`, `undefined`, `Infinity`, `[object Object]` (bez `<script>`, `<style>` i źródła TeX).

Exit 1 przy pierwszym znalezisku z listy. W GitHub Actions każde znalezisko to adnotacja `::error::`.

## Uruchomienie
```
npm run build
node narzedzia/tresc-check/sprawdz.mjs dist
```

## Jak naprawić
Liczbę wyjmij ze wzoru: zamiast `$n = {S.n}$` napisz `$n$ = {S.n}`. Jeśli wzór musi zawierać wartość, policz cały napis TeX w JS i wstaw go komponentem (KaTeX w `src/lib/`).

## Ograniczenia
- Widzi tylko HTML z builda. Treść dopisywana przez JS w przeglądarce (ćwiczenia, quizy, kroki krokówki) nie jest sprawdzana.
- Reguła wzorów to heurystyka. Jeśli kiedyś złapie poprawny TeX, zawęź regułę `JS_W_WZORZE` i dopisz przypadek do opisu.
