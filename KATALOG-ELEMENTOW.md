# Katalog elementów strony głównej

Po co: Maciek chce móc powiedzieć „wróćmy do X z dawnej wersji” i dostać to szybko z powrotem. Tu jest spis
wszystkiego, co było na stronie głównej we wcześniejszych wersjach, z dokładnym miejscem w historii git.
Aktualna strona główna to wariant **„Siatka”** (`src/pages/index.astro`, `src/styles/siatka.css`, `src/scripts/siatka/`).

## Jak przywrócić element

```
git show <commit>:<ścieżka>            # podgląd pliku z danej wersji
git show <commit>:<ścieżka> > /tmp/x   # zapis do porównania
```

- **Strona live sprzed przebudowy** = commit `30970aa` na `main` (zawsze dostępny).
- **Wariant „Świt”** = commit `4bf9314` (z PR #70, scalonego 2026-11-17 merge commitem, więc jest w historii `main`).
- **Komponenty React** (`FaultyTerminal`, `HeroSkull`, `BorderGlow`), model `skeleton.glb` i opis jego kompresji
  (`narzedzia/model-3d/README.md`) zostały usunięte z drzewa 2026-11-23 (PR #85, decyzja U1 (b)). Ostatni raz są w commicie
  `2218f05` na `main`:

  ```
  git show 2218f05:src/components/HeroSkull.jsx                                   # podgląd
  git restore --source=2218f05 -- src/components/HeroSkull.jsx public/assets/skeleton.glb   # przywrócenie
  ```

  Plik `.glb` przywracaj przez `git restore`, nie przez `git show … >`, bo w PowerShellu przekierowanie psuje pliki binarne.
  Komponent zadziała dopiero z zależnościami i integracją Reacta z tego samego commitu (wersje: `git show 2218f05:package.json`):
  `@astrojs/react`, `react`, `react-dom` (dla wszystkich trzech), `ogl` (`FaultyTerminal`), `three`, `@react-three/fiber`
  i `@react-three/drei` (`HeroSkull`), do tego `react()` w `integrations` w `astro.config.mjs` i dyrektywa `client:` na stronie.
- Przenosząc element do „Siatki”: kolory zamień na fiolet (`--fiolet #bd8bff` i odcienie, bez tęczy), a ruch, który trwa
  cały czas, zrób animacją CSS albo `transform`/`opacity` osobnej warstwy (patrz `CLAUDE.md`, „Pułapki”).

## Strona live sprzed przebudowy (`30970aa`)

Pliki: `src/pages/index.astro`, style w `src/styles/global.css` (plik nadal jest w repo: używa go `kurs-szeroki.css`),
komponenty React w `src/components/*.jsx` (od PR #70 nieużywane, usunięte 2026-11-23; przywracanie z `2218f05`, patrz wyżej).

| Element | Gdzie | Uwagi |
| --- | --- | --- |
| Tło hero ze znaków (fioletowy terminal) | `2218f05:src/components/FaultyTerminal.jsx` (+ `.css`), w `index.astro` jako `<FaultyTerminal client:load tint="#bb1cfc" …>` | WebGL (ogl), ok. 55 KB skryptu |
| Chromowany szkielet 3D w hero | `2218f05:src/components/HeroSkull.jsx`, model `2218f05:public/assets/skeleton.glb` (205 KB, opis w `2218f05:narzedzia/model-3d/README.md`) | three.js + R3F, ok. 1 MB skryptu; automatyczna przeglądarka wiesza się na nim; model „three-skull” (Cullen Webber), licencja MIT: po przywróceniu wraca też podpis autora w stopce |
| HUD hero: „Edukacja po ludzku.”, „Jedno miejsce. Cała Twoja nauka.”, napis `unicorner` w rogu, „// 01 Scroll to explore” | `index.astro` (`.hero-hud`, `.hh-*`), style `global.css` sekcja „HERO HUD” | |
| Przycisk „Zacznij naukę” z poświatą krawędzi | `2218f05:src/components/BorderGlow.jsx` (+ `.css`) | React, poświata podąża za kursorem |
| Hero przy przewijaniu: jedzie w górę i gaśnie maską od dołu, pojawia się siatka | skrypt na końcu `index.astro` („Pierwszy ekran przy przewijaniu…”) | |
| Stała neonowa siatka z podłogą w perspektywie | `.site-grid` w `global.css` | oczko 38 px; w „Siatce” wróciła jako `.tlo` |
| Fioletowa łuna dryfująca przy scrollu | `.glow-drift` w `global.css` + skrypt w `index.astro` | |
| Wielkie obrysowane słowa „NEXT LEVEL” / „LEARNING” przesuwane w bok przy scrollu | `.ow` w `global.css` + skrypt w `index.astro` | font Orbitron, obrys `#b347ff` |
| Karty przedmiotów z poświatą ramki za kursorem („Magic Bento”) | `.card`, `.card-glow` w `global.css` + skrypt „Magic Bento” w `index.astro` | ulubiony efekt Maćka; w „Siatce” jako `.pw` + `.pw-blask` |
| Karta „Kolejne przedmioty” + trzy akapity „Po co to jest / Jak korzystać / Skąd się bierze” | `.next-zone`, `.about` | |
| Pas generatora z obracającą się fiszką i podświetlaną odpowiedzią quizu | `.gen-band`, `.gb-*` (style w `index.astro`) | animacja w pętli 7 s |
| Pas „Wiedza” | `.wiedza-band` (style w `index.astro`) | |
| FAQ z boczną szyną „// FAQ”, „Brakuje przedmiotu?” | `.faq-zone`, `.faq-rail`, FAQ budowane skryptem | |
| Pasek opinii (karuzela) | `.reviews`, `.marquee` w `global.css`, `buildReviews()` w `index.astro` | dane z Workera albo `reviews.json` |
| Stopka: neonowa podłoga, „unicorner_os · system online”, wielki napis UNICORNER z glitchem po najechaniu i skanem | `.site-foot`, `.foot-floor`, `.giant`, `.gw`, `@keyframes giantGl/giantScan` w `global.css` | w „Siatce” zachowana (`.stopka`, `.st-napis`) |
| Tekst „dekodowany” znakami (efekt terminala) | skrypt `[data-scramble]` w `index.astro` | na stronie live skrypt był, ale żaden element go nie używał; w „Siatce” ten efekt ma hasło hero |

## Wariant „Świt” (`4bf9314`)

Pliki: `src/pages/index.astro` (w tym commicie), `src/styles/start.css`, `src/scripts/start/silnik.js`, `src/scripts/start/chrom.js`.
Inspiracja: Daydrift Festival (biblioteka Futurepedii). Uwagi Maćka do tego wariantu: `ROADMAP.md`, sekcja „W toku”, U1.

| Element | Gdzie | Uwagi |
| --- | --- | --- |
| Napis UNICORNER z płynnego chromu odbijający niebo, horyzont i neonową podłogę; wybrzusza się do kursora, kręgi od kursora | `chrom.js` (shader `FRAGMENT`, funkcja `otoczenie()`), `.chrom-scena[data-chrom]` | WebGL2; tryb `swit` w stopce odbija wschód słońca |
| Hero przypięte na czas przejścia nocy w świt | `.hero-wrap`, `.hero` (`--hp`), `.niebo-swit`, `.zar` | |
| Blokowisko z zapalonymi oknami na horyzoncie (dwa plany) | funkcja `bloki()` we frontmatterze `index.astro`, `.bloki`, `.bl-dal`, `.bl-bli` | SVG liczone przy buildzie, stałe ziarno |
| Gwiazdy jako jedna ścieżka SVG | funkcja `gwiazdy()` we frontmatterze, `.gwiazdy` | |
| Neonowa podłoga w perspektywie, płynąca animacją CSS | `.podloga`, `@keyframes podloga` | |
| Dwie skośne taśmy (marquee), szybsze przy scrollu, kierunek za scrollem | `.tasmy`, `.tasma-a/-b`, `[data-tor]` w `silnik.js` | |
| Indeks przedmiotów (wiersze zamiast kart), podświetlenie wiersza na wysokości wzroku na telefonie | `.indeks`, `.lista`, `.wiersz` | |
| Zdanie rozświetlane słowo po słowie, słowa-akcenty w złocie | `.zdanie`, `.s`, `.ak` | |
| Droga „Jak korzystać”: krzywa SVG z kropką jadącą przy scrollu i węzłami kroków | `.droga`, `.droga-rys`, `.dr-kropka`, `.dr-wezel`, tabela punktów w `silnik.js` | |
| Scena generatora: kartka notatek pod skanerem → fiszka obraca się → quiz z poprawną odpowiedzią | `.gen`, `.demo`, `.d-*` (wszystko z `--g`) | |
| Czytelnia „Wiedza” w palecie artykułów (oliwka, złoto, Fraunces) z miękkim przejściem kolorów | `.czyt`, `.czyt::before/::after`, `.czyt-lista` | |
| FAQ na `<details>` z animacją wysokości | `.pyt-lista`, `::details-content` | |
| Wygładzone przewijanie (Lenis) tylko dla myszy, menu na `<dialog>` | `silnik.js` | zostało w „Siatce” |

## Wariant „Siatka” (aktualny)

Pliki: `src/pages/index.astro`, `src/styles/siatka.css`, `src/scripts/siatka/silnik.js`, `src/scripts/siatka/napis.js`.

| Element | Gdzie |
| --- | --- |
| Neonowy napis UNICORNER (WebGL2): wypukłe litery w fiolecie, refleks za kursorem, pasmo światła, zapalanie jak neon, rwanie przy szybkim scrollu | `napis.js`, `.napis-scena` |
| Ramka HUD wokół napisu (narożniki, „unicorner_os”, „system online”) | `.h-rama` |
| Napis wlatuje do nawigacji przy przewijaniu | `dok` w `silnik.js`, `.nav.zadokowany` |
| Tło: stała siatka 38 px + światło kursora rozjaśniające siatkę | `.tlo`, `.swiatlo`, `.sw-siatka` |
| Podłoga z siatki w hero i stopce (animacja CSS, tempo z WAAPI) | `.podloga`, `@keyframes podloga` |
| Karty przedmiotów z blaskiem ramki za kursorem | `.pw`, `.pw-blask`, `.karta` |
| Obrysowe tytuły sekcji wypełniane fioletem przy scrollu | `.tytul` (`--w`, `--tx`) |
| Zdanie dekodowane słowo po słowie z kursorem terminala | `.zdanie`, `.s.czolo` |
| Kroki z szyną, która się wypełnia | `.kroki-blok`, `.szyna` (`--p`) |
| Okno generatora: notatki → fiszka → quiz | `.okno`, `.o-*` (`--g`) |
| Stopka z napisem i glitchem w odcieniach fioletu | `.stopka`, `.st-napis` |
