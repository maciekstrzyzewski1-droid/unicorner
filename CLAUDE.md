# CLAUDE.md

Unicorner (unicorner.pl): Astro 5 + React (wyspy) + MDX. Opis projektu, struktura i „jak dodać treść": `README.md`. Czytaj go tylko wtedy, gdy zadanie tego wymaga.

## Rozmowa
- Odpowiadaj po polsku. Krótko i konkretnie. Jeśli coś się nie opłaca, powiedz to wprost.

## Oszczędzaj kontekst
Wiele plików ma 50–220 KB. Nie czytaj ich w całości: najpierw `grep -n`, potem czytaj tylko potrzebny zakres linii.
- Strony przedmiotów `src/pages/{zarzadzanie-jakoscia,mitz,marketing,etir,ort,geografia}.astro`: dane quizów i fiszek siedzą w `<script is:inline>` w tym samym pliku.
- Makroekonomia: dane fiszek i quizu w `src/scripts/makroekonomia/{fiszki,dane}.js` (wstawiane przez `?raw`), logika na stronie.
- Wspólny CSS stron przedmiotów i statystyki: `src/styles/{przedmiot-motyw,stat-*,giga-napis}.css`, wstawiany przez `?raw` + `<style is:inline set:html>`. Zwykły `import` CSS zmieniłby kolejność stylów.
- Strony statystyki (`dynamika`, `trend`, `korelacja`, …) i moduły `src/pages/matematyka/*.mdx` (46–88 KB).
- `src/lib/*-zadania.js`, `src/lib/pochodne.js` (do 95 KB).
- `src/teksty/*.html` (artykuły, do 63 KB każdy).
- Nie otwieraj bez potrzeby: `package-lock.json` (310 KB), `worker.js` (58 KB, endpointy opisane na górze), `public/assets/generator.js`.
- Efekty WebGL/animacje (`src/components/*.jsx`) ruszaj tylko, gdy zadanie ich dotyczy.

## Pułapki
- Strony przedmiotów i statystyki mają własny JS i część własnego CSS. Zmiana w nich nie przenosi się na inne strony. Zmiana we wspólnym pliku z `src/styles/` działa na wszystkie strony, które go importują.
- Skrypty `is:inline` nie mogą importować modułów.
- Artykuły (`src/teksty/`) pisze się w palecie źródłowej (złoty `#d1a13f`, Fraunces, Work Sans). `src/lib/wiedza.js` przekolorowuje je przy buildzie i wycina `<script>`. Nie zmieniaj palety w plikach artykułów.

## Sprawdzanie
Testów nie ma. Po każdej zmianie: `npm run build` musi przejść (ok. 35 s). Przy zmianach CSS porównaj zbudowany `dist/` przed i po.
