# CLAUDE.md

Unicorner (unicorner.pl): Astro 7 + React (wyspy) + MDX (procesor Markdown: unified z `@astrojs/markdown-remark`, nie domyślny Sätteri). Opis projektu, struktura i „jak dodać treść": `README.md`. Czytaj go tylko wtedy, gdy zadanie tego wymaga.

## Rozmowa
- Odpowiadaj po polsku. Krótko i konkretnie. Jeśli coś się nie opłaca, powiedz to wprost.

## Praca w toku i kontekst spoza `main` (sprawdź, zanim napiszesz „nie ma”)
- Część pracy żyje na gałęziach i w otwartych PR-ach, nie na `main`. Na start: `gh pr list` i `git fetch && git branch -r`. Treść PR: `gh pr view <nr>`, pliki z gałęzi: `git show origin/<gałąź>:<plik>`.
- Decyzje, roadmapa narzędzi, raporty i przekazania sesji są w **prywatnym** repo `maciekstrzyzewski1-droid/scratchbook` (sklonuj obok: `gh repo clone maciekstrzyzewski1-droid/scratchbook ../scratchbook`). Czytaj najpierw najnowszy `narzedzia/radar/HANDOFF-*.md`, potem dziennik na końcu `narzedzia/radar/ROADMAP.md`; plan potrzeb Unicornera (U1–U10): `narzedzia/radar/mapa-potrzeb.md`.
- Stan „co teraz” dla strony: sekcja „W toku” w `ROADMAP.md` tego repo.
- Na `main` nie wypychaj bez słowa „publikuj” od Maćka; zmiany idą gałęzią + PR, scala Maciek. Przy każdym zadaniu nazwij rolę specjalisty (np. inżynier bezpieczeństwa). Przepisy prawa cytuj ze źródła, nie z pamięci.
- Szczegółów bezpieczeństwa (audyty, podatności) nie wpisuj do tego publicznego repo — idą do `scratchbook`.

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
- Artykuły (`src/teksty/`) pisze się w palecie źródłowej (ciemna zieleń `#14150f`, złoty `#d1a13f`, Fraunces + Work Sans). Strona artykułu pokazuje je w tej palecie bez przekolorowania (`src/lib/wiedza.js` tylko zawęża CSS do `.art` i wycina `<script>`); czcionki są hostowane lokalnie w `public/fonts/fonty-artykul.css`, a ramka strony dostaje tę paletę przez zmienne na `body` w `src/pages/wiedza/[slug].astro`. Lista `wiedza.astro` zostaje w stylu cyberpunkowym.

## Sprawdzanie
Testów jednostkowych nie ma. Po każdej zmianie: `npm run build` musi przejść (ok. 35 s), potem `node narzedzia/tresc-check/sprawdz.mjs dist` (kod zamiast liczby we wzorach, błędy KaTeX, `NaN`/`undefined` w tekście; to samo robi CI w PR). Wyrażeń `{…}` nie wpisuj do środka `$…$`: MDX ich tam nie policzy. Przy zmianach CSS porównaj zbudowany `dist/` przed i po.
