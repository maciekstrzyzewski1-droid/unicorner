# UNICORNER — mapa drogowa

> Kompas, nie spec. Wracaj tu, gdy poczujesz, że gubisz kierunek.
> Stan na 2026-10-19.

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
- **Kurs Rachunkowość:** 1 z 10 modułów (3. Operacje i konta bilansowe — pilot). Rachunki z zajęć i ćwiczeń sprawdzone skryptem, tekst po niezależnym przeglądzie.
- **Kurs Matematyka:** 11 z 13 modułów (logika, zbiory, relacje, macierze, układy równań, matematyka finansowa, pochodne, badanie zmienności funkcji, funkcje wielu zmiennych, ekstrema warunkowe, całka nieoznaczona).
- **Sekcja WIEDZA:** `/wiedza` z jednym szablonem i metadanymi w `wiedza.js`, 28 artykułów w 4 kategoriach.
- **Generator AI + konta:** logowanie Google, zapisane talie, udostępnianie linkiem, powtórki fiszek, kredyty miesięczne (Worker v9).
- Opinie z moderacją, polityka prywatności i regulamin.

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
