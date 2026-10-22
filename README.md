# Unicorner

Studencka platforma do nauki na egzaminy (UEP): fiszki, zadania krok po kroku, quizy
z natychmiastową informacją zwrotną, kursy matematyki i rachunkowości od zera, sekcja artykułów (Wiedza)
i generator AI robiący fiszki oraz quiz z własnych notatek. Działa na telefonie.
Strony z materiałami nie wymagają logowania; logowanie (Google) potrzebne jest tylko w generatorze.

- **Live:** https://unicorner.pl
- **Frontend:** Astro 7 + React 18 (wyspy), Tailwind 4, MDX + KaTeX. Build do statycznych plików.
- **Hosting:** GitHub Pages, wdrażane przez GitHub Actions (`.github/workflows/deploy.yml`) z katalogu `dist/`.
- **Backend:** Cloudflare Worker (`worker.js`) + KV + baza D1. Generator AI, konta (Google), talie, kredyty, opinie, moderacja.
- **Efekty 3D / animacje:** three + React Three Fiber, ogl, GSAP, framer-motion (komponenty w `src/components/*.jsx`).

> Stan na 2026-10-19. Wcześniejsza wersja projektu (czysty HTML, każda strona jako samodzielny plik w roocie)
> została usunięta z repo; jest w historii gita (przed commitem „usunięcie starej wersji z roota”).

---

## Uruchomienie lokalne

```bash
npm ci
npm run dev       # podgląd na żywo
npm run build     # build do dist/ (~35 s, 62 strony)
npm run preview   # podgląd zbudowanej strony
```

Wymagany Node 24 (Astro 7 wymaga co najmniej 22.23.4; workflow używa 24). Testów automatycznych nie ma. Jedyną kontrolą jest
przechodzący `npm run build`, więc przed pushem zawsze go uruchom. Na pull requestach robi to też CI
(`.github/workflows/build-pr.yml`).

---

## Struktura repo

| Ścieżka | Co to jest |
| --- | --- |
| `src/pages/*.astro` | Strony serwisu. Każda wychodzi jako `nazwa.html` (`build.format: 'file'`, żeby zachować stare linki `.html`). |
| `src/pages/matematyka/*.mdx` | Moduły kursu matematyki (`logika`, `zbiory`, `relacje`, `macierze`, `uklady-rownan`, `matematyka-finansowa`, `pochodne`, `badanie-funkcji`, `funkcje-wielu-zmiennych`, `ekstrema-warunkowe`). |
| `src/pages/wiedza/[slug].astro` | Jeden szablon wszystkich artykułów. |
| `src/layouts/Base.astro` | Wspólny `<head>`: fonty, meta description, Cloudflare Web Analytics (bez ciasteczek). |
| `src/pages/rachunkowosc/*.mdx` | Moduły kursu rachunkowości (`bilans`, `konta`) + słowniczek pojęć (`pojecia.astro`). |
| `src/layouts/Kurs.astro` | Szablon modułu kursu: nagłówek, spis treści, poprzedni/następny. |
| `src/components/` | Komponenty React/Astro: efekty wizualne (`*.jsx`), ramki i ćwiczenia kursów (`kurs/`), karty artykułów (`wiedza/`). |
| `src/lib/` | Logika w czystym JS (tabele prawdy, macierze, relacje, układy równań, matematyka finansowa, pochodne, wykresy, KaTeX) i wtyczki rehype (`rehype-interpunkcja`, `rehype-tabele`). |
| `src/data/kursy/` | Opisy kursów, lista modułów (`status: 'live'` / `'soon'`), słowniczek. Rejestr w `index.js`. |
| `src/data/wiedza.js` | Metadane artykułów: kategoria, seria, kolejność, tytuł SEO, opis. |
| `src/teksty/*.html` | Treść artykułów (gotowy HTML, 28 plików). |
| `src/styles/` | `tailwind.css`, `global.css`, `kurs.css`, `wiedza.css`, `generator.css`. |
| `public/` | Pliki kopiowane 1:1 do `dist/`: `CNAME`, `robots.txt`, `assets/` (szkielet 3D, wideo, skrypty generatora i talii), `recenzje.html`, `moderacja.html`, `reviews.json`. |
| `worker.js` | Źródło Cloudflare Workera (nie jest częścią builda Astro). Opis endpointów na górze pliku. |
| `WDROZENIE.md` | Konfiguracja i wdrożenie Workera. |
| `ROADMAP.md` | Kierunek i priorytety. |

### Strony serwisu

- **Przedmioty** (każdy z fiszkami/kompendium i quizem): `makroekonomia`, `marketing`, `mitz`, `zarzadzanie-jakoscia`, `etir`, `ort`, `geografia`.
- **Statystyka** (hub): `statystyka`, `dynamika`, `trend`, `sezonowosc`, `korelacja`, `korelacja-wieloraka`, `regresja`, `Statystyka_Navoica_Egzamin`.
- **Matematyka** (kurs krok po kroku): `matematyka.html` + 11 gotowych modułów z 13 zaplanowanych (1–5, 7–12; brakuje 6 i 13) + słowniczek symboli.
- **Rachunkowość** (kurs krok po kroku): `rachunkowosc.html` + 2 gotowe moduły z 10 zaplanowanych (2. Bilans, 3. Operacje i konta bilansowe) + słowniczek pojęć. Konta teowe: `src/components/kurs/konta/`, bilans: `src/components/kurs/bilans/`, rachunki: `src/lib/konta.js`, `src/lib/bilans.js`, sprawdzanie: `narzedzia/mat-check/rachunkowosc/`.
- **Wiedza**: `wiedza.html` + 28 artykułów w czterech kategoriach (krypto, polityka, zdrowie i umysł, świat i technika).
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
Plik danych w `src/data/kursy/<kurs>.js` + wpis w `index.js` + `src/pages/<kurs>.astro` z `<KursHub kurs="…" />` + kafelek w tablicy `SUBJECTS` w `src/pages/index.astro`.

### Nowy przedmiot w stylu „kompendium + quiz"
Nowa strona `src/pages/<nazwa>.astro` (opakowana w `Base.astro`, wzór: np. `etir.astro`) i wpis w `SUBJECTS` w `src/pages/index.astro` (`status:"live"`, `file:"<nazwa>.html"`).

---

## Backend (Cloudflare Worker)

Endpointy i zmienne opisane są w komentarzu na górze `worker.js`. Najważniejsze:
logowanie przez Google, talie użytkownika (zapis, edycja przez AI, udostępnianie linkiem, powtórki fiszek),
kredyty (darmowe miesięczne limity, koszt akcji zależy od rodzaju), opinie z moderacją, `GET /health`.
Model: Claude Haiku 4.5. Sekrety (`ANTHROPIC_API_KEY`, `ADMIN_CODE`, `ALLOWED_ORIGIN`, opcjonalnie `ADMIN_EMAILS`,
`FREE_MONTHLY_CREDITS`) i bindingi (`UC_KV`, `DB`) ustawia się w panelu Cloudflare, **nie** w kodzie.
Instrukcja wdrożenia: `WDROZENIE.md`. W repo nie ma konfiguracji `wrangler`, więc Worker jest wdrażany ręcznie z panelu.

---

## Wdrożenie i pułapki

- **Deploy:** każdy push na `main` uruchamia workflow „Deploy do GitHub Pages" (`npm ci` → `npm run build` → publikacja `dist/`).
  W ustawieniach repo: Settings → Pages → Source musi być ustawione na „GitHub Actions".
- **Nowe pliki muszą być zacommitowane** (`git status`, bez „untracked").
- **Nazwy plików:** GitHub Pages rozróżnia wielkość liter. Trzymaj się małych liter i myślników, bez spacji i polskich znaków.
  Wyjątek historyczny: `Statystyka_Navoica_Egzamin` (istniejący adres, zostaje, żeby nie zepsuć linków).
- **Cache 404:** jeśli linkujesz do pliku, którego jeszcze nie ma, CDN potrafi zapamiętać 404 dla tego adresu.
  Obejście: dopisz `?v=1` do linku.
- **Fonty:** ładowane z Google Fonts w `Base.astro`.
- **Analityka:** Cloudflare Web Analytics, bez ciasteczek i bez banera zgody (`Base.astro`). Nie dodawaj tagów Google Analytics: `prywatnosc.astro` i `regulamin.astro` opisują serwis jako bez śledzenia.

---

---

*Projekt studencki, niepowiązany z UEP ani żadną katedrą. Materiały to własne opracowania.*
