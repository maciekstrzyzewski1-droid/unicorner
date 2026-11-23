# Unicorner

Studencka platforma do nauki na egzaminy (UEP): fiszki, zadania krok po kroku, quizy
z natychmiastową informacją zwrotną, kursy matematyki, rachunkowości i metod badań rynku od zera, ścieżka nauki języków (hiszpański), sekcja artykułów (Wiedza)
i generator AI robiący fiszki oraz quiz z własnych notatek. Działa na telefonie.
Strony z materiałami nie wymagają logowania; logowanie (Google) potrzebne jest tylko w generatorze.

- **Live:** https://unicorner.pl
- **Frontend:** Astro 7, Tailwind 4, MDX + KaTeX. Build do statycznych plików, bez Reacta i bez wysp `client:`.
- **Hosting:** GitHub Pages, wdrażane przez GitHub Actions (`.github/workflows/deploy.yml`) z katalogu `dist/`.
- **Backend:** Cloudflare Worker (`worker.js`) + KV + baza D1. Generator AI, konta (Google), talie, kredyty, opinie, moderacja.
- **Efekty strony głównej:** własny WebGL2 (`src/scripts/siatka/napis.js`) + Lenis. Dawne efekty na React i three (szkielet 3D, `FaultyTerminal`, `BorderGlow`) zostały usunięte razem z zależnościami 2026-11-23 (`ROADMAP.md`, U1 (b)); jak je przywrócić z gita: `KATALOG-ELEMENTOW.md`.

> Stan na 2026-11-21. Wcześniejsza wersja projektu (czysty HTML, każda strona jako samodzielny plik w roocie)
> została usunięta z repo; jest w historii gita (przed commitem „usunięcie starej wersji z roota”).

---

## Uruchomienie lokalne

```bash
npm ci
npm run dev       # podgląd na żywo
npm run build     # build do dist/ (ok. 1 min, 87 stron HTML w `dist/`: 85 z Astro + 2 statyczne z `public/`)
npm run preview   # podgląd zbudowanej strony
```

Wymagany Node 24 (Astro 7 wymaga co najmniej 22.23.4; workflow używa 24). Testów jednostkowych nie ma. Przed pushem uruchom
`npm run build` i `node narzedzia/tresc-check/sprawdz.mjs dist`, a przy zmianach w kursach językowych także
`node narzedzia/jezyki-check/sprawdz.mjs`.

Na każdym pull requeście CI (`.github/workflows/build-pr.yml`) robi build, test treści (`narzedzia/tresc-check`),
kontrolę danych kursów językowych (`node narzedzia/jezyki-check/sprawdz.mjs`), test sieciowy (`narzedzia/siec-check`)
i test dymny strony kursu językowego w Chromium (`node narzedzia/jezyki-check/dymny.cjs dist`). GitHub uruchamia też
CodeQL (konfiguracja domyślna) i Dependabota (`.github/dependabot.yml`: akcje i npm co tydzień, zgrupowane).
`deploy.yml` po buildzie uruchamia test treści i dopiero potem publikuje.

---

## Struktura repo

| Ścieżka | Co to jest |
| --- | --- |
| `src/pages/*.astro` | Strony serwisu. Każda wychodzi jako `nazwa.html` (`build.format: 'file'`, żeby zachować stare linki `.html`). |
| `src/pages/matematyka/*.mdx` | Moduły kursu matematyki (`logika`, `zbiory`, `relacje`, `macierze`, `uklady-rownan`, `matematyka-finansowa`, `pochodne`, `badanie-funkcji`, `funkcje-wielu-zmiennych`, `ekstrema-warunkowe`, `calka-nieoznaczona`) + słowniczek symboli (`symbole.astro`). |
| `src/pages/wiedza/[slug].astro` | Jeden szablon wszystkich artykułów. |
| `src/layouts/Base.astro` | Wspólny `<head>`: fonty, meta description, Cloudflare Web Analytics (bez ciasteczek). |
| `src/pages/rachunkowosc/*.mdx` | Moduły kursu rachunkowości (`istota`, `bilans`, `konta`, `zestawienie`, `wynik-finansowy`, `srodki-pieniezne`, `inwestycje-krotkoterminowe`) + słowniczek pojęć (`pojecia.astro`). |
| `src/pages/metody-badan-rynku/*.mdx` | Moduły kursu metod badań rynku (`wielkosc-proby`, `dobor-proby`, `skale`) + słowniczek pojęć (`pojecia.astro`). |
| `src/layouts/Kurs.astro` | Szablon modułu kursu: nagłówek, spis treści, poprzedni/następny. |
| `src/components/` | Komponenty Astro: ramki i ćwiczenia kursów (`kurs/`), widok ścieżki kursów językowych (`jezyki/`), karty artykułów (`wiedza/`). |
| `src/lib/` | Logika w czystym JS (tabele prawdy, macierze, relacje, układy równań, matematyka finansowa, pochodne, wykresy, KaTeX) i wtyczki rehype (`rehype-interpunkcja`, `rehype-liczby`, `rehype-tabele`). |
| `src/data/kursy/` | Opisy kursów, lista modułów (`status: 'live'` / `'soon'`), słowniczek. Rejestr w `index.js`. |
| `src/data/wiedza.js` | Metadane artykułów: kategoria, seria, kolejność, tytuł SEO, opis. |
| `src/teksty/*.html` | Treść artykułów (gotowy HTML, 33 pliki). |
| `src/styles/` | `tailwind.css`, `tokeny.css` (wspólne kolory, ładowany w `Base.astro`), `siatka.css` (strona główna), `global.css` (dawny landing, dziś tylko baza dla `kurs-szeroki.css`), `kurs.css`, `kurs-szeroki.css`, `wiedza.css`, `generator.css`, `jezyki.css` oraz wspólne style stron przedmiotów i statystyki (`przedmiot-motyw.css`, `stat-*.css`, `giga-napis.css`). |
| `src/scripts/` | `siatka/` (strona główna: `silnik.js` — jedna pętla klatek dla animacji sterowanych scrollem i kursorem, Lenis, menu; `napis.js` — neonowy napis UNICORNER w WebGL2), `jezyki/` (silnik kursów językowych), `przedmiot/quiz-silnik.js` (wspólny silnik quizu etir, geografia, marketing i ort), `makroekonomia/` (dane fiszek i quizu). |
| `public/` | Pliki kopiowane 1:1 do `dist/`: `CNAME`, `robots.txt`, `assets/` (szkielet 3D, dziś nieużywany; `generator.js`, `talia.js`), `fonts/`, favicony, `og-image.jpg`, `recenzje.html`, `moderacja.html`, `reviews.json`. |
| `worker.js` | Źródło Cloudflare Workera (nie jest częścią builda Astro). Opis endpointów na górze pliku. |
| `WDROZENIE.md` | Konfiguracja i wdrożenie Workera. |
| `ROADMAP.md` | Kierunek i priorytety. |
| `KATALOG-ELEMENTOW.md` | Spis elementów dawnych wersji strony głównej (live sprzed przebudowy, wariant „Świt”) z commitem i ścieżką, do szybkiego przywracania. |

### Strony serwisu

- **Przedmioty** (każdy z fiszkami/kompendium i quizem): `makroekonomia`, `marketing`, `mitz`, `zarzadzanie-jakoscia`, `etir`, `ort`, `geografia`.
- **Statystyka**: hub `statystyka-kurs` + 8 działów: `statystyka` (statystyka opisowa), `dynamika`, `trend`, `sezonowosc`, `korelacja`, `korelacja-wieloraka`, `regresja`, `Statystyka_Navoica_Egzamin`.
- **Matematyka** (kurs krok po kroku): `matematyka.html` + 11 gotowych modułów z 13 zaplanowanych (1–5, 7–12; brakuje 6 i 13) + słowniczek symboli.
- **Rachunkowość** (kurs krok po kroku): `rachunkowosc.html` + 7 gotowych modułów z 12 zaplanowanych (1. Istota i zasady, 2. Bilans, 3. Operacje i konta bilansowe, 4. Zestawienie obrotów i sald, 5. Konta wynikowe i wynik finansowy, 6. Środki pieniężne, 7. Inwestycje krótkoterminowe) + słowniczek pojęć. Konta teowe: `src/components/kurs/konta/`, bilans: `src/components/kurs/bilans/`, rachunki: `src/lib/konta.js` (konta bilansowe i wynikowe, przeksięgowania na wynik), `src/lib/bilans.js`, dane zadań z zajęć: `src/lib/konta-zadania.js` (z kontrolą wyników przy buildzie), sprawdzanie: `narzedzia/mat-check/rachunkowosc/`.
- **Metody badań rynku** (kurs krok po kroku): `metody-badan-rynku.html` + 3 gotowe moduły z 5 zaplanowanych (1. Minimalna liczebność próby — z projektem w Excelu i kalkulatorem jak Biostat, 2. Dobór kwotowy — ze sprawdzarką schematów dla ankieterów, 4. Skale, kafeteria i błędy w pytaniach) + słowniczek pojęć. Komponenty: `src/components/kurs/badania/`, rachunki: `src/lib/proba.js` i `src/lib/kwoty.js`, sprawdzanie: `narzedzia/mat-check/badania-rynku/` (`kwoty-check.mjs` — rachunki doboru kwotowego, `kontrola.cjs` — strona w przeglądarce).
- **Języki obce** (ścieżka lekcji jak w aplikacji do nauki języków): `jezyki.html` (hub) + `hiszpanski.html`. Silnik wspólny dla języków: `src/scripts/jezyki/silnik.js` (lekcje, 10 typów zadań, XP, seria dni, odznaki, powtórka błędów, zapis w localStorage), `src/scripts/jezyki/awatar.js` (postacie do opisu), widok `src/components/jezyki/Sciezka.astro`, style `src/styles/jezyki.css`. Dane kursu: `src/data/jezyki/<język>.js` (rejestr `index.js`, pomocniki `narzedzia.js`). Nowy język = plik danych + wpis w rejestrze + strona z `<Sciezka kurs="…" />` + karta w `jezyki.astro`. Kontrola danych: `node narzedzia/jezyki-check/sprawdz.mjs`, test dymny strony kursu w Chromium: `node narzedzia/jezyki-check/dymny.cjs dist` (oba uruchamia CI), czytelny zrzut ćwiczeń do przeglądu: `node narzedzia/jezyki-check/zrzut.mjs`.
- **Wiedza**: `wiedza.html` + 33 artykuły w czterech kategoriach (krypto, polityka, zdrowie i umysł, świat i technika).
- **Generator AI**: `generator.html` (wymaga logowania Google), `talia.html` (podgląd udostępnionej talii, `noindex`).
- **Pozostałe**: `kontakt`, `prywatnosc`, `regulamin`, `recenzje.html` (formularz opinii), `moderacja.html` (panel, `noindex`, nielinkowany, wymaga `ADMIN_CODE`).
- **Sitemap:** `src/pages/sitemap.xml.js`. Zbiera `src/pages/*.astro`, strony kursów (`src/pages/<kurs>/*.mdx|.astro`) i artykuły Wiedzy.
- **SEO:** `Base.astro` dodaje domyślne `canonical` i `og:`. Strona, która podaje własny slot `head` (kursy, Wiedza, generator, talia), ustawia je sama.

---

## Jak dodać treść

### Nowy artykuł (Wiedza)
1. Wrzuć plik do `src/teksty/<slug>.html` (slug: małe litery, myślniki, bez polskich znaków).
2. Dopisz wpis w `src/data/wiedza.js` (kategoria, seria, `topic`, `seoTitle`).
3. `npm run build`, commit, push. Tytuł, lead i czas czytania są wyciągane z pliku automatycznie.

### Nowy moduł kursu (np. Matematyka)
1. Dodaj `src/pages/matematyka/<slug>.mdx` według wzoru `logika.mdx` (wzory `$…$` liczone przy buildzie).
2. W `src/data/kursy/matematyka.js` ustaw `status: 'live'` dla modułu.
3. Komponenty interaktywne bierz z `src/components/kurs/` (ramki, rozbiór wzoru, rozwiązanie krok po kroku, tabele liczone kodem, pytania).

### Nowy kurs
Plik danych w `src/data/kursy/<kurs>.js` + wpis w `index.js` + `src/pages/<kurs>.astro` z `<KursHub kurs="…" />` + karta w tablicy `SUBJECTS` w `src/pages/index.astro` (`emoji`, `sub: "kurs od zera"`, `badge: "w budowie"` dopóki kurs rośnie).

### Nowy przedmiot w stylu „kompendium + quiz"
Nowa strona `src/pages/<nazwa>.astro` (opakowana w `Base.astro`, wzór: np. `etir.astro`) i wpis w `SUBJECTS` w `src/pages/index.astro` (`status:"live"`, `file:"<nazwa>.html"`).

---

## Backend (Cloudflare Worker)

Endpointy i zmienne opisane są w komentarzu na górze `worker.js`. Najważniejsze:
logowanie przez Google, talie użytkownika (zapis, edycja przez AI, udostępnianie linkiem, powtórki fiszek),
kredyty (darmowe miesięczne limity, koszt akcji zależy od rodzaju), opinie z moderacją, zapis na powiadomienia
(`POST /newsletter`, EmailOctopus), `GET /health`.
Model: Claude Haiku 4.5. Sekrety (`ANTHROPIC_API_KEY`, `ADMIN_CODE`, `ALLOWED_ORIGIN`, `EO_API_KEY`, `EO_LIST_ID`,
opcjonalnie `ADMIN_EMAILS`, `FREE_MONTHLY_CREDITS`, `IP_SALT`) i bindingi (`UC_KV`, `DB`) ustawia się w panelu Cloudflare, **nie** w kodzie.
Instrukcja wdrożenia: `WDROZENIE.md`. W repo nie ma konfiguracji `wrangler`, więc Worker jest wdrażany ręcznie z panelu.

---

## Wdrożenie i pułapki

- **Deploy:** każdy push na `main` uruchamia workflow „Deploy do GitHub Pages" (`npm ci` → `npm run build` → test treści → publikacja `dist/`).
  W ustawieniach repo: Settings → Pages → Source musi być ustawione na „GitHub Actions".
- **Nowe pliki muszą być zacommitowane** (`git status`, bez „untracked").
- **Nazwy plików:** GitHub Pages rozróżnia wielkość liter. Trzymaj się małych liter i myślników, bez spacji i polskich znaków.
  Wyjątek historyczny: `Statystyka_Navoica_Egzamin` (istniejący adres, zostaje, żeby nie zepsuć linków).
- **Cache 404:** jeśli linkujesz do pliku, którego jeszcze nie ma, CDN potrafi zapamiętać 404 dla tego adresu.
  Obejście: dopisz `?v=1` do linku.
- **Fonty:** hostowane lokalnie w `public/fonts` (`fonty.css` ładowany w `Base.astro`, `fonty-artykul.css` na stronie artykułu), nie z Google Fonts: IP odwiedzających nie trafia do Google. Nowa rodzina = pliki woff2 + licencja w `public/fonts` i blok `@font-face`.
- **Analityka:** Cloudflare Web Analytics, bez ciasteczek i bez banera zgody (`Base.astro`). Nie dodawaj tagów Google Analytics: `prywatnosc.astro` i `regulamin.astro` opisują serwis jako bez śledzenia.

---

*Projekt studencki, niepowiązany z UEP ani żadną katedrą. Materiały to własne opracowania.*
