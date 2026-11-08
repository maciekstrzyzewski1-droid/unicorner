# UNICORNER — mapa drogowa

> Kompas, nie spec. Wracaj tu, gdy poczujesz, że gubisz kierunek.
> Stan na 2026-11-03. Notatki robocze, decyzje i raporty: prywatne repo `scratchbook` (patrz `CLAUDE.md`).

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
- **Przedmioty live:** makroekonomia, marketing, MiTZ, zarządzanie jakością, ETiR, ORT, geografia atrakcji, hub Statystyka (8 stron).
- **Kurs Rachunkowość:** 2 z 10 modułów (2. Bilans, 3. Operacje i konta bilansowe). Rachunki z zajęć i ćwiczeń sprawdzone skryptem, tekst po niezależnym przeglądzie.
- **Kurs Matematyka:** 11 z 13 modułów (logika, zbiory, relacje, macierze, układy równań, matematyka finansowa, pochodne, badanie zmienności funkcji, funkcje wielu zmiennych, ekstrema warunkowe, całka nieoznaczona).
- **Sekcja WIEDZA:** `/wiedza` z jednym szablonem i metadanymi w `wiedza.js`, 31 artykułów w 4 kategoriach.
- **Generator AI + konta:** logowanie Google, zapisane talie, udostępnianie linkiem, powtórki fiszek, kredyty miesięczne (Worker v9).
- Opinie z moderacją, polityka prywatności i regulamin.
- **Test sieciowy w CI** (`narzedzia/siec-check`): każda strona z `dist/` w Chromium, błąd przy połączeniu z adresem spoza `allowlist.json` (PR #32).
- **Lżejszy model 3D** szkieletu na stronie głównej (glTF-Transform: simplify + meshopt, −19,7% transferu; PR #35, opis w `narzedzia/model-3d/`).
- **Moduł Całka nieoznaczona** poprawiony po przeglądzie zrozumiałości (skill `przeglad-ucznia`; PR #36).
- **Powiadomienia e-mail o nowych materiałach (U8)**: formularz na stronach kursów → Worker v12 `POST /newsletter` → EmailOctopus (Free, API v2) jako `pending`, double opt-in, mail potwierdzający i strona po polsku, tagi `zgoda-v1` i `kurs-<przedmiot>`. Test end-to-end własnym adresem OK (2026-11-03; PR #38, #39).
- **Odświeżony snapshot testu sieciowego** (PR #40) i **porządki** (PR #41): usunięte 7 nieużywanych zależności, `public/vendor` (Draco) i Draco w `HeroSkull.jsx`; animacja rogu nie jest częścią tej strony (żyje w osobnym projekcie `live-experienceunicorn`).

---

## 🔧 W toku
- **U4 (ton tekstów)** — plan zatwierdzony 2026-11-03, niski priorytet. Zasada: luz w opakowaniu (strona główna, huby, wstępy modułów, komunikaty, newsletter, stopka), precyzja w treści merytorycznej (definicje, kroki, zadania, odpowiedzi). Bez przekleństw i przeciąganych liter, maks. jeden luźny element na ekran, zwroty typu „po ludzku”, „bez dziur”, „final boss” zostają. Kroki: przewodnik tonu → mapa miejsc → pilot na jednej stronie (PR do przeglądu) → rozszerzenie. Nie obiecywać „na telefonie wszystko lata” przed pomiarem.
- **U7 (audyt strony)** — pierwszy przebieg zrobiony 2026-11-04, partia poprawek wdrożona: PR #43–#46 (README, martwe fonty, metatagi, dostępność, fonty latin-ext −90 KB, pauza tła i „ogranicz ruch” także dla czaszki), #49 (favicon), #50 (wspólne tokeny kolorów `src/styles/tokeny.css`), #51 (wspólny silnik quizu przedmiotów), #52 (kontrast `--muted2` 5,82:1). Główny ciężar strony to moduły matematyki (~42 MB surowo, 89% to HTML wzorów KaTeX; wycięcie MathML daje 9–17 KB gzip, nie jest priorytetem). Kolejne kroki:
  - Maciek: reguły cache w Cloudflare. `/_astro/*` na rok: 2026-11-07 nagłówki nadal `max-age=14400`, czyli reguła niewdrożona (sprawdzić Deploy). `*.woff2` 30 dni. CSS fontów bez długiego cache (bez hasha).
  - Do zweryfikowania na żywym komputerze: czaszka i tło przy „ogranicz ruch” (kod jest na `main`; testy w automatycznej przeglądarce wieszają się na WebGL programowym).
  - Propozycje: podział największych modułów matematyki na rozdziały (decyzja o nawigacji), automatyczne zrzuty ekranu jako test wyglądu.
- **U1 (inspiracje z innych stron)** — po U7; potrzebne 3–5 stron, które Maciek lubi.
- Do potwierdzenia przez Maćka: czy wysłane maile do wykładowców (zgoda na materiały, W-06); sprzątanie niepotwierdzonych zapisów w EmailOctopus (obiecuje to polityka prywatności); stopka z wypisem przy pierwszej kampanii.
- Terminy: 15.11 przegląd bezpieczeństwa (U6, zadanie cykliczne, pierwszy przebieg niezweryfikowany) i przypomnienie o `unicorner-old`; 19.11 R-26.
- Rejestr, dziennik i decyzje: `scratchbook/narzedzia/radar/` (`DO-WDROZENIA.md`, `ROADMAP.md`, `mapa-potrzeb.md`).

---

## Kolejność

### ① TERAZ — SHIP (higiena po migracji)  *tanie, domyka temat*
- [x] Usunięta stara wersja z roota (20 plików `.html`, `assets/`, `makroekonomia_files/`, `reviews.json`, `CNAME`). Nic ich nie przywoływało, na żywej stronie zwracały 404.
- [x] Sitemap: moduły kursów (`/matematyka/*.html`) i strona Statystyka (Navoica) są w sitemapie.
- [x] SEO: domyślne `canonical` i `og:` (tytuł, opis, adres) w `Base.astro`; 7 stron przedmiotów dostało brakujący `description`.
- [ ] Obraz do podglądu linku (`og:image`, 1200×630). Dziś podgląd na Messengerze/Discordzie jest bez obrazka. Wymaga grafiki, nie kodu.
- [x] Audyt zależności (2026-10-19): `npm audit fix` bez zmian w wyniku builda; zostało 8 (1 krytyczna, 1 wysoka, 6 niskich).
  Pozostałe dotyczą Astro (`astro`, `sharp`, `esbuild`) i KaTeX. Na stronie w pełni statycznej, z treścią pisaną przez nas, nie są realnie wykorzystywalne:
  XSS w Astro wymaga wstrzyknięcia obcych danych do szablonu, a SSRF/server islands/`base` dotyczą trybu serwerowego, którego nie używamy.
  Pełna naprawa = upgrade Astro 5 → 7 (zmiana łamiąca). Robić przy okazji, nie w trybie pilnym.
- [ ] `WDROZENIE.md` i README trzymać zgodne z `worker.js` przy każdej zmianie Workera.
- [x] CI: `npm run build` na każdym pull requeście (`.github/workflows/build-pr.yml`).

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
- **Stopka** = basic (wielki UNICORNER + eyebrow/tagline/CTA + legal).
- **Hero** = chromowany szkielet + tło FaultyTerminal.
- **Tło strony** = siatka 38px.
- Kolejne efekty 3D / tła / animacje: to szufladka POLISH, bez nowych pozycji, dopóki ① i ② nie ruszą.

## Zasada nadrzędna
**Skończ, potem rozgałęziaj.** Nie przełączaj kontekstu przed dokończeniem rzeczy.
Wygląd ma budżet; **ship i treść mają priorytet.**
