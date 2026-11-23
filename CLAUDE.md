# CLAUDE.md

Unicorner (unicorner.pl): Astro 7 + MDX, bez Reacta (procesor Markdown: unified z `@astrojs/markdown-remark`, nie domyślny Sätteri). Opis projektu, struktura i „jak dodać treść": `README.md`. Czytaj go tylko wtedy, gdy zadanie tego wymaga.

## Rozmowa
- Odpowiadaj po polsku. Krótko i konkretnie. Jeśli coś się nie opłaca, powiedz to wprost.

## Praca w toku i kontekst spoza `main` (sprawdź, zanim napiszesz „nie ma”)
- Część pracy żyje na gałęziach i w otwartych PR-ach, nie na `main`. Na start: `gh pr list` i `git fetch && git branch -r`. Treść PR: `gh pr view <nr>`, pliki z gałęzi: `git show origin/<gałąź>:<plik>`.
- Decyzje, roadmapa narzędzi, raporty i przekazania sesji są w **prywatnym** repo `maciekstrzyzewski1-droid/scratchbook` (sklonuj obok: `gh repo clone maciekstrzyzewski1-droid/scratchbook ../scratchbook`). Czytaj najpierw najnowszy `narzedzia/radar/HANDOFF-*.md`, potem dziennik na końcu `narzedzia/radar/ROADMAP.md`; plan potrzeb Unicornera (U1–U10): `narzedzia/radar/mapa-potrzeb.md`.
- Stan „co teraz” dla strony: sekcja „W toku” w `ROADMAP.md` tego repo.
- Na `main` nie wypychaj bez słowa „publikuj” od Maćka; zmiany idą gałęzią + PR, scala Maciek. Przy każdym zadaniu nazwij rolę specjalisty (np. inżynier bezpieczeństwa). Przepisy prawa cytuj ze źródła, nie z pamięci.
- Szczegółów bezpieczeństwa (audyty, podatności) nie wpisuj do tego publicznego repo — idą do `scratchbook`.

## Oszczędzaj kontekst
Wiele plików ma 50–115 KB. Nie czytaj ich w całości: najpierw `grep -n`, potem czytaj tylko potrzebny zakres linii.
- Strony przedmiotów `src/pages/{zarzadzanie-jakoscia,mitz,marketing,etir,ort,geografia}.astro`: dane quizów i fiszek siedzą w `<script is:inline>` w tym samym pliku. Silnik quizu etir, geografii, marketingu i ort jest wspólny: `src/scripts/przedmiot/quiz-silnik.js` (wstawiany przez `?raw`); dane `RAW`/`SETS` zostają w pliku strony.
- Makroekonomia: dane fiszek i quizu w `src/scripts/makroekonomia/{fiszki,dane}.js` (wstawiane przez `?raw`), logika na stronie.
- Wspólny CSS stron przedmiotów i statystyki: `src/styles/{przedmiot-motyw,stat-*,giga-napis}.css`, wstawiany przez `?raw` + `<style is:inline set:html>`. Zwykły `import` CSS zmieniłby kolejność stylów.
- Strony statystyki (`dynamika`, `trend`, `korelacja`, …) i moduły `src/pages/matematyka/*.mdx` (46–88 KB).
- `src/lib/*-zadania.js`, `src/lib/pochodne.js` (do 95 KB).
- Moduły `src/pages/rachunkowosc/*.mdx` (do 96 KB) i `src/pages/zarzadzanie-jakoscia.astro` (100 KB).
- Kursy językowe: dane `src/data/jezyki/*.js` (hiszpański 112 KB) i silnik `src/scripts/jezyki/silnik.js` (50 KB).
- `src/teksty/*.html` (artykuły, do ok. 107 KB każdy).
- Nie otwieraj bez potrzeby: `package-lock.json` (ok. 250 KB), `worker.js` (ok. 73 KB, endpointy opisane na górze), `public/assets/generator.js`.
- Dawnych efektów WebGL na React i three (szkielet 3D, `FaultyTerminal`, `BorderGlow`) nie ma już w drzewie ani w zależnościach (usunięte 2026-11-23, PR #85). Nie szukaj ich w repo: przywracanie z gita opisuje `KATALOG-ELEMENTOW.md`.

## Pułapki
- Strony przedmiotów i statystyki mają własny JS i część własnego CSS. Zmiana w nich nie przenosi się na inne strony. Wyjątek: `src/scripts/przedmiot/quiz-silnik.js` zmienia 4 strony naraz (etir, geografia, marketing, ort). Zmiana we wspólnym pliku z `src/styles/` działa na wszystkie strony, które go importują.
- Skrypty `is:inline` nie mogą importować modułów.
- Strona główna (`src/pages/index.astro`, wariant „Siatka”) ma własny CSS `src/styles/siatka.css` i skrypty w `src/scripts/siatka/` (zwykły `<script>` z importami, pakowany przez Astro). Elementy dawnych wersji (strona live sprzed przebudowy, wariant „Świt”) są spisane w `KATALOG-ELEMENTOW.md` z commitem i ścieżką: gdy Maciek wspomni coś z nich, przywracaj stamtąd (`git show <commit>:<ścieżka>`), w palecie i zasadach ruchu „Siatki”. `global.css` to dawny landing: od PR #70 nie importuje go żaden plik (`kurs-szeroki.css` wspomina go tylko w komentarzu o palecie), więc zmiany w nim nie trafiają na stronę; zostaje jako źródło elementów z `KATALOG-ELEMENTOW.md`. Animacje strony głównej steruje jedna pętla w `silnik.js` przez zmienne CSS (`--hp`, `--w`, `--tx`, `--p`, `--g`), a blask ramek kart to osobna warstwa `.pw-blask` przesuwana przez `transform`/`opacity`; nowy efekt dopisuj tam, nie w osobnym `requestAnimationFrame`. Ruch, który trwa cały czas (podłoga z siatki, blask kursora na ramkach), ma iść animacją CSS albo zmianą `transform`/`opacity` osobnej warstwy; przestawianie ze skryptu co klatkę transformu w scenie 3D albo gradientu tła zmuszało przeglądarkę do malowania od nowa (pomiar 2026-11-15: telefon 34 → 60 kl/s, desktop z kursorem 30 → 47 kl/s).
- Gust Maćka w designie (stan na 2026-11-14, jego słowa po obejrzeniu podglądu): cyberpunk; kolor główny to fiolet napisu ze stopki `#bd8bff`; żadnych tęczowych gradientów (`--iris`) na przyciskach ani w animacjach; neonowa siatka w tle ma zostać; lubi fioletową poświatę ramek, która sunie za kursorem; płynność scrolla jest dla niego ważniejsza niż efekty.
- Artykuły (`src/teksty/`) pisze się w palecie źródłowej (ciemna zieleń `#14150f`, złoty `#d1a13f`, Fraunces + Work Sans). Strona artykułu pokazuje je w tej palecie bez przekolorowania (`src/lib/wiedza.js` tylko zawęża CSS do `.art` i wycina `<script>`); czcionki są hostowane lokalnie w `public/fonts/fonty-artykul.css`, a ramka strony dostaje tę paletę przez zmienne na `body` w `src/pages/wiedza/[slug].astro`. Lista `wiedza.astro` zostaje w stylu cyberpunkowym.
- Alerty CodeQL naprawiamy w kodzie, zwykłym PR-em (build, testy, sprawdzenie strony w przeglądarce). Nie klikaj „Commit fix” (Copilot Autofix): w #73 autopoprawki zepsuły silnik języków na żywej stronie (naprawa: #75).

## Sprawdzanie
Testów jednostkowych nie ma. Po każdej zmianie: `npm run build` musi przejść (ok. 1 min), potem `node narzedzia/tresc-check/sprawdz.mjs dist` (kod zamiast liczby we wzorach, błędy KaTeX, `NaN`/`undefined` w tekście). Przy zmianach w kursach językowych także `node narzedzia/jezyki-check/sprawdz.mjs`. Na każdym PR CI robi build, test treści, kontrolę danych kursów językowych (`node narzedzia/jezyki-check/sprawdz.mjs`), test sieciowy (`narzedzia/siec-check`) i test dymny strony kursu językowego w Chromium (`node narzedzia/jezyki-check/dymny.cjs dist`); do tego CodeQL i Dependabot (akcje i npm co tydzień, zgrupowane). Deploy po buildzie uruchamia test treści. Wyrażeń `{…}` nie wpisuj do środka `$…$`: MDX ich tam nie policzy. Przy zmianach CSS porównaj zbudowany `dist/` przed i po.
