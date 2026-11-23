# UNICORNER — mapa drogowa

> Kompas, nie spec. Wracaj tu, gdy poczujesz, że gubisz kierunek.
> Stan na 2026-11-21. Notatki robocze, decyzje i raporty: prywatne repo `scratchbook` (patrz `CLAUDE.md`).

## ⭐ Gwiazda polarna
**UNICORNER ma sprawić, że student szybciej i mniej boleśnie zda egzamin.**
Każde zadanie mierz tym jednym zdaniem.

## 🧭 Filtr — przed każdym zadaniem zadaj: do której szufladki należy?
1. **SHIP** — czy strona na żywo działa, jest bezpieczna i da się ją utrzymać?
2. **CONTENT** — daje studentom więcej / lepsze materiały?
3. **USAGE** — pokaże, czy ludzie tego używają i wracają?
4. **POLISH** — wygląd, efekty, mikro-usprawnienia.

Priorytet: **1 → 2** na pierwszym planie, **3** lekko w tle, **4 z twardym budżetem czasu**.
Łapiesz się na kolejnym tle/efekcie? To sygnał, że uciekasz od 1/2 do 4.

---

## ✅ Zrobione (nie wracać)
- **Cutover na Astro + GitHub Actions.** Strona na żywo to build z `dist/` (potwierdzone: sitemap generowany przez `sitemap.xml.js`).
- Cookieless analytics (Cloudflare Web Analytics w `Base.astro`).
- Pliki TEMP (`morph-moment.html` itd.) usunięte.
- **Przedmioty live:** makroekonomia, marketing, MiTZ, zarządzanie jakością, ETiR, ORT, geografia atrakcji, Statystyka (hub `statystyka-kurs` + 8 działów).
- **Kurs Rachunkowość:** 7 z 12 modułów (1. Istota i zasady i 4. Zestawienie obrotów i sald — PR #61; 2. Bilans — PR #12; 3. Operacje i konta bilansowe — PR #11; 5. Konta wynikowe i wynik finansowy — Zad. 4.6, PR #62; 6. Środki pieniężne — PR #66; 7. Inwestycje krótkoterminowe — PR #67). Rachunki z zajęć i ćwiczeń sprawdzone skryptem, tekst po niezależnym przeglądzie.
- **Kurs Matematyka:** 11 z 13 modułów (logika, zbiory, relacje, macierze, układy równań, matematyka finansowa, pochodne, badanie zmienności funkcji, funkcje wielu zmiennych, ekstrema warunkowe, całka nieoznaczona).
- **Sekcja WIEDZA:** `/wiedza` z jednym szablonem i metadanymi w `wiedza.js`, 33 artykuły w 4 kategoriach.
- **Generator AI + konta:** logowanie Google, zapisane talie, udostępnianie linkiem, powtórki fiszek, kredyty miesięczne (Worker v9).
- Opinie z moderacją, polityka prywatności i regulamin.
- **Test sieciowy w CI** (`narzedzia/siec-check`): każda strona z `dist/` w Chromium, błąd przy połączeniu z adresem spoza `allowlist.json` (PR #32).
- **Lżejszy model 3D** szkieletu, który był na stronie głównej (glTF-Transform: simplify + meshopt, −19,7% transferu; PR #35, opis był w `narzedzia/model-3d/`), i statyczna poza przy „ogranicz ruch” (PR #59). Od #70 szkielet był nieużywany, 2026-11-23 usunięty (decyzja U1 (b)).
- **Moduł Całka nieoznaczona** poprawiony po przeglądzie zrozumiałości (skill `przeglad-ucznia`; PR #36).
- **Powiadomienia e-mail o nowych materiałach (U8)**: formularz na stronach kursów → Worker `POST /newsletter` (wersja 15 w `/health`) → EmailOctopus (Free, API v2) jako `pending`, double opt-in, mail potwierdzający i strona po polsku, tagi `zgoda-v1` i `kurs-<przedmiot>`. Test end-to-end własnym adresem OK (2026-11-03; PR #38, #39).
- **Odświeżony snapshot testu sieciowego** (PR #40) i **porządki** (PR #41): usunięte 7 nieużywanych zależności, `public/vendor` (Draco) i Draco w `HeroSkull.jsx`; animacja rogu nie jest częścią tej strony (żyje w osobnym projekcie `live-experienceunicorn`).
- **U1 (inspiracje z innych stron) → nowa strona główna „Siatka”.** 2026-11-15 Maciek wybrał „Siatkę”, 2026-11-17 zatwierdził ją jako oficjalny wygląd strony („od teraz strona będzie wyglądać w ten sposób”). Scalone w PR #70 (2026-11-17), poprawka pętli przy oknie o zerowej wysokości: PR #74. Były dwa warianty; wspólne: jedna pętla klatek, animacje sterowane scrollem przez zmienne CSS, Lenis tylko dla myszy, ok. 1,2 MB skryptów mniej niż przed #70 (szkielet 3D i tło ze znaków zeszły ze strony głównej).
  - **Wariant „Siatka” (aktualny `src/pages/index.astro`, 2026-11-14 wieczór)** — projekt od zera pod uwagi Maćka: cyberpunk w jednym kolorze (fiolet napisu ze stopki `#bd8bff` i jego odcienie, zieleń tylko dla stanu „gotowe”), zero tęczowych gradientów, stała neonowa siatka 38 px w tle, kursor jako światło (rozjaśnia siatkę, ramki paneli i napis), karty przedmiotów z poświatą sunącą za kursorem, wielkie obrysowane tytuły sekcji wypełniane fioletem przy scrollu, neonowy napis UNICORNER (WebGL2), który przy przewijaniu wlatuje do nawigacji, stopka jak dotąd (wielki neonowy napis nad podłogą z siatki). Pliki: `src/styles/siatka.css`, `src/scripts/siatka/{silnik,napis}.js`.
  - **Wariant „Świt” (zdjęty z drzewa 2026-11-15, w historii pod `4bf9314`; spis elementów do przywracania w `KATALOG-ELEMENTOW.md`)** — pierwsza wersja po inspiracji Daydrift (chromowy napis, noc przechodząca w świt nad blokowiskiem, taśmy, indeks przedmiotów). **Uwagi Maćka z 2026-11-14 (do poprawy, jeśli wrócimy do tego wariantu):** (1) płynność oceniona bardzo dobrze, zostaje; (2) za daleko od cyberpunku; (3) kolor główny ma być fioletem napisu ze stopki; (4) wyrzucić tęczowe przyciski i tęczową ramkę fiszki; (5) wraca neonowa siatka w tle; (6) wraca fioletowa poświata przy ruchu kursora między przedmiotami.
  - Decyzje Maćka z 2026-11-15: (a) tęcza znika z całego serwisu w tym samym PR-ze — zrobione: token `--iris` i 73 gradienty w 31 plikach są fioletowe (kolory danych na wykresach zostały); (b) szkielet 3D, `FaultyTerminal`, `BorderGlow` i ich zależności zostają w repo, decyzja po obejrzeniu nowej wersji (mogą wrócić). **2026-11-23: usunięte** razem z `public/assets/skeleton.glb`, `narzedzia/model-3d/`, podpisem modelu w stopce i zależnościami (`three`, `@react-three/fiber`, `@react-three/drei`, `ogl`, `react`, `react-dom`, `@astrojs/react`, `@types/react*`; w `package-lock.json` o 89 pakietów mniej). Rekomendacja z przeglądu Dependabota z 2026-11-22: majory React 19 / R3F 9 / drei 10 i tak nie instalowały się osobno (ERESOLVE). Przywracanie z gita: `KATALOG-ELEMENTOW.md`; (c) FAQ poprawione, żeby zgadzało się z polityką prywatności (logowanie i e-mail w generatorze, powiadomienia e-mail, talie na koncie). Otwarte: pojedyncze akcenty cyjan/magenta na stronach przedmiotów (to nie gradienty) — zostają, dopóki Maciek nie zdecyduje.

---

## 🔧 W toku
- **Języki obce: platforma „ścieżka jak w apce” + Hiszpański** — **na żywo od 2026-11-21** (PR #73; naprawa silnika po autopoprawkach CodeQL w PR #75). Strony `jezyki.html` (hub) i `hiszpanski.html`; silnik wspólny dla języków (`src/scripts/jezyki/silnik.js`, widok `src/components/jezyki/Sciezka.astro`, style `src/styles/jezyki.css`), dane kursu w `src/data/jezyki/hiszpanski.js`, kontrola danych `node narzedzia/jezyki-check/sprawdz.mjs`. Ścieżka w kolejności zajęć z folderu „Hiszpański nauka”: sekcja 1 (semestr letni, 5 jednostek) i sekcja 2 (zakres kolokwium 1: rodzina, wygląd i kolory, charakter i trzy grupy przymiotników z Reto 1, zaimki dzierżawcze, querer i cele) + escape room „APROBADO” jako próbne kolokwium. 36 lekcji, 424 ćwiczenia, 10 typów zadań, XP, seria dni, cel dzienny, kamienie milowe, gotowość na kolokwium, powtórka błędów; postęp w localStorage (bez logowania). Treść po niezależnym przeglądzie (hiszpański obu sekcji, polski i dydaktyka, zakres kolokwium; 130 potwierdzonych poprawek, każda sprawdzona przez osobnego weryfikatora) i po teście w przeglądarce (każda lekcja 3× na 100%, 390 px bez przewijania w bok). Podgląd jednym plikiem: `node narzedzia/jezyki-check/podglad.mjs hiszpanski.html <plik>`. Roadmapa sekcji (ocena przydatności, etapy 0–5): `scratchbook/narzedzia/radar/jezyki-roadmapa.md`. Decyzja 2026-11-21: zakres kursów (wszystkich, nie tylko języków) bierzemy z publicznych sylabusów UEP (e-sylabus), kolejność i akcenty z notatek, treść i zadania własne. Dalej: Maciek — test na iPhonie (klawiatura, głos ES), daty kolokwium 2 lub egzaminu, kierunek i cykl do e-sylabusa (albo PDF-y sylabusów); Claude — mapy zakresu z sylabusów i lista luk w kursach, potem sekcja 3 hiszpańskiego z notatek po kolokwium 1. Angielski dopiero z sylabusem w ręku.
- **Kurs „Metody badań rynku”** — 3 z 5 modułów: 1 „Minimalna liczebność próby” i 4 „Skale, kafeteria i błędy w pytaniach” (PR #60, 2026-11-09), 2 „Dobór kwotowy” (2026-11-11: przykład ze slajdów i z arkusza „Metody doboru próby – przykład”, schematy A–D, trzy testy kompletu, sprawdzarka schematów; rachunki w `src/lib/kwoty.js`, kontrola `narzedzia/mat-check/badania-rynku/kwoty-check.mjs`). Dalej: teoria pod 24 zagadnienia egzaminu (moduły 3 i 5 oraz część teoretyczna doboru próby: błędy doboru, operat losowania, metody nielosowe i internetowe). **Blokada:** na Dysku nie ma slajdów z wykładów ani rozdziałów podręcznika Kaczmarczyka, a egzamin to test z podziałów podanych na wykładzie — bez źródła teoria byłaby zgadywaniem klasyfikacji. Potrzebne od Maćka: slajdy lub notatki z wykładów (albo skany rozdziałów).
- **Kurs „Rachunkowość”** — 7 z 12 modułów live: 1 i 4 (PR #61, 2026-11-09), 2 (#12) i 3 (#11, 2026-10-22), 5 „Konta wynikowe i wynik finansowy” (PR #62), 6 „Środki pieniężne” (PR #66) i 7 „Inwestycje krótkoterminowe” (PR #67, 2026-11-11). Dalej moduły 8–12 z folderu „materiały z wykładów z rachunkowości”: 8 rozrachunki (storno, konta analityczne), 9 środki trwałe, 10 materiały, 11 koszty, 12 wyroby gotowe. Otwarte pytanie do prowadzącej: weksel oddany do dyskonta przez „Środki pieniężne w drodze” czy jednym zapisem (moduł 6 pokazuje oba). **2026-11-18 (przed kolokwium, PR #71):** dopisane zad. 2.15 (Snow) i pełne zadanie dodatkowe 4 (Spółka ABC, „bilans w grupach” v3) w module 2, zad. 5.4 (Hurtex) z nowym poleceniem „analiza zmian sumy bilansowej i struktury” w module 4, warianty do zad. 4.1; na stronie kursu sekcja „Przed kolokwium” (lista `KOLOKWIUM` w `src/data/kursy/rachunkowosc.js`, odhaczanie w localStorage) i spis „Znajdź zadanie z zajęć” (z `<Rozwiazanie zrodlo>` wszystkich gotowych modułów, każdy kurs). Poprawki dla wszystkich kursów: rozjechane linki „Szybka powtórka” na stronie kursu, liczby z odstępem tysięcy nie łamią się w środku (`src/lib/rehype-liczby.mjs`), mniej przezroczysty pasek u góry. **2026-11-19 (PR #72):** wyjaśnienia „dlaczego ta strona” w modułach 2–7 i trening z pułapkami (kontrola `narzedzia/mat-check/rachunkowosc/sprawdz-trening.mjs`). Po kolokwium: zdecydować, czy sekcja „Przed kolokwium” zostaje.
- **U4 (ton tekstów)** — plan zatwierdzony 2026-11-03, niski priorytet. Zasada: luz w opakowaniu (strona główna, huby, wstępy modułów, komunikaty, newsletter, stopka), precyzja w treści merytorycznej (definicje, kroki, zadania, odpowiedzi). Bez przekleństw i przeciąganych liter, maks. jeden luźny element na ekran, zwroty typu „po ludzku”, „bez dziur”, „final boss” zostają. Kroki: przewodnik tonu → mapa miejsc → pilot na jednej stronie (PR do przeglądu) → rozszerzenie. Nie obiecywać „na telefonie wszystko lata” przed pomiarem.
- **U7 (audyt strony)** — pierwszy przebieg zrobiony 2026-11-04, partia poprawek wdrożona: PR #43–#46 (README, martwe fonty, metatagi, dostępność, fonty latin-ext −90 KB, pauza tła i „ogranicz ruch” dla tła), #49 (favicon), #50 (wspólne tokeny kolorów `src/styles/tokeny.css`), #51 (wspólny silnik quizu przedmiotów), #52 (kontrast `--muted2` 5,82:1). Główny ciężar strony to moduły matematyki (~42 MB surowo, 89% to HTML wzorów KaTeX; wycięcie MathML daje 9–17 KB gzip, nie jest priorytetem). Kolejne kroki:
  - Maciek: reguły cache w Cloudflare. `/_astro/*` na rok: 2026-11-07 nagłówki nadal `max-age=14400`, czyli reguła niewdrożona (sprawdzić Deploy). `*.woff2` 30 dni. CSS fontów bez długiego cache (bez hasha).
  - Propozycje: podział największych modułów matematyki na rozdziały (decyzja o nawigacji), automatyczne zrzuty ekranu jako test wyglądu.
- **Po „Siatce” (U1) czeka na Maćka:** pojedyncze akcenty cyjan/magenta na stronach przedmiotów. Decyzja (b) zapadła 2026-11-23: nieużywane komponenty 3D i ich zależności są usunięte. Szczegóły: „Zrobione”, U1.
- Do potwierdzenia przez Maćka: czy wysłane maile do wykładowców (zgoda na materiały, W-06); sprzątanie niepotwierdzonych zapisów w EmailOctopus (obiecuje to polityka prywatności); stopka z wypisem przy pierwszej kampanii.
- Zadania cykliczne i terminy spoza strony (przegląd U6, `unicorner-old`, R-26): stan w `scratchbook`.
- Rejestr, dziennik i decyzje: `scratchbook/narzedzia/radar/` (`DO-WDROZENIA.md`, `ROADMAP.md`, `mapa-potrzeb.md`).

---

## Kolejność

### ① TERAZ — SHIP (higiena po migracji)  *tanie, domyka temat*
- [x] Usunięta stara wersja z roota (20 plików `.html`, `assets/`, `makroekonomia_files/`, `reviews.json`, `CNAME`). Nic ich nie przywoływało, na żywej stronie zwracały 404.
- [x] Sitemap: moduły kursów (`/matematyka/*.html`) i strona Statystyka (Navoica) są w sitemapie.
- [x] SEO: domyślne `canonical` i `og:` (tytuł, opis, adres) w `Base.astro`; 7 stron przedmiotów dostało brakujący `description`.
- [x] Obraz do podglądu linku (`og:image`, 1200×630): `public/og-image.jpg`, metatagi w `Base.astro`.
- [x] Zależności: aktualizacje i alerty obsługuje Dependabot, kod skanuje CodeQL. Przeglądy: `scratchbook`.
- [ ] `WDROZENIE.md` i README trzymać zgodne z `worker.js` przy każdej zmianie Workera. Numer wersji podbijać naraz w nagłówku `worker.js` i w `GET /health`.
- [x] CI na każdym pull requeście (`.github/workflows/build-pr.yml`): build, test treści, kontrola danych kursów językowych, test sieciowy i test dymny strony kursu językowego w Chromium. Deploy po buildzie uruchamia test treści.

### ② POTEM — CONTENT  *właściwy produkt*
- **Kurs Matematyka: moduły 6 i 13** (programowanie liniowe, całka oznaczona). Wzorzec jest i działa (moduły 7–12 powstały po nim). Ryzyko jest merytoryczne: każdy moduł wymaga sprawdzenia rozwiązań przed publikacją, bo błąd w zadaniu na stronie do egzaminów szkodzi bardziej niż brak modułu. Moduły 8–12 przeszły niezależny przegląd przed publikacją. Warto utrzymać tę praktykę i publikować po 1–2 moduły. Skrypty sprawdzające rachunki modułu 12 są w `narzedzia/mat-check/` — przy module 13 warto zacząć od nich.
- Więcej przedmiotów (model „kompendium + quiz" jest powtarzalny).
- Dopiąć fiszki / zadania / quizy tam, gdzie są luki. Z opinii wynika zapotrzebowanie na **zadania otwarte z rozwiązaniami**, nie tylko teorię.
- Formularz sugestii → realny backend (opcjonalnie `/suggest` w Workerze).

### ③ RÓWNOLEGLE, LEKKO — USAGE  *niech dane sterują, nie nastrój*
- Analytics: które przedmioty klikają, czy wracają, co wpisują w formularz.
- Generator: ile osób się loguje, ile talii powstaje, ile kredytów realnie schodzi (koszt API vs. limit 30 kredytów/mies.).
- Zbierać opinie (mechanizm działa; fallback w `public/reviews.json`).

### ④ FILAR — sekcja WIEDZA (tempo wolne, w tle)
Rzetelne artykuły oparte na źródłach, anty-clickbait. Filar, nie pivot: ma dowozić studentów do rdzenia.
- Zasady bez zmian: tani w utrzymaniu (plik w `src/teksty/` + wpis w `wiedza.js`), źródła cytowane, jedna wspólna wizualna ramka.
- Nie wyprzedza ② (treści dla studentów) w kolejce.

---

## 🧊 Zamrożone — nie otwierać ponownie bez sygnału z danych
- **Strona główna** = wariant „Siatka”, zatwierdzony przez Maćka 2026-11-17: hero z neonowym napisem UNICORNER w ramce HUD (napis wlatuje do nawigacji), tło = stała neonowa siatka 38 px ze światłem kursora, karty przedmiotów z fioletową poświatą ramek, stopka = wielki neonowy napis nad podłogą z siatki. Paleta: fiolet `#bd8bff` i odcienie, bez tęczy. Elementy dawnych wersji: `KATALOG-ELEMENTOW.md`.
- Kolejne efekty 3D / tła / animacje: to szufladka POLISH, bez nowych pozycji, dopóki ① i ② nie ruszą.

## Zasada nadrzędna
**Skończ, potem rozgałęziaj.** Nie przełączaj kontekstu przed dokończeniem rzeczy.
Wygląd ma budżet; **ship i treść mają priorytet.**
