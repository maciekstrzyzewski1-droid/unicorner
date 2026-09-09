# UNICORNER — mapa drogowa

> Kompas, nie spec. Wracaj tu, gdy poczujesz, że gubisz kierunek.

## ⭐ Gwiazda polarna
**UNICORNER ma sprawić, że student szybciej i mniej boleśnie zda egzamin.**
Każde zadanie mierz tym jednym zdaniem.

## 🧭 Filtr — przed każdym zadaniem zadaj: do której szufladki należy?
1. **SHIP** — przybliża wejście strony na żywo?
2. **CONTENT** — daje studentom więcej / lepsze materiały?
3. **USAGE** — pokaże, czy ludzie tego używają i wracają?
4. **POLISH** — wygląd, efekty, mikro-usprawnienia.

Priorytet: **1 → 2** na pierwszym planie, **3** lekko w tle, **4 z twardym budżetem czasu**.
Łapiesz się na kolejnym tle/efekcie? To sygnał, że uciekasz od 1/2 do 4.

---

## Kolejność

### ① TERAZ — SHIP (cutover, Phase 5)  *najwyższa dźwignia*
Najładniejsza strona, której nie ma w sieci, pomaga zeru osób.
- [ ] Wypisać, co dokładnie blokuje wejście na żywo (checklista cutovera)
- [ ] GitHub Actions: build + deploy `dist/` na Pages (CNAME już w `public/`)
- [ ] Weryfikacja na realnej domenie unicorner.pl
- [ ] Usunąć stare root `.html` (fallback) + dedup `assets/` (root vs public/)
- [ ] Włączyć cookieless analytics (token Cloudflare w `Base.astro`, odkomentować)
- [ ] Sprzątnąć pliki TEMP (`public/morph-moment.html`, `morph-img.png`)

### ② POTEM — CONTENT  *właściwy produkt*
- Więcej przedmiotów (model „~5 min/przedmiot" = silnik, kręć nim)
- Dopiąć fiszki / zadania / quizy tam, gdzie są luki
- Formularz sugestii → realny backend (opcjonalnie: /suggest w Cloudflare Worker)

### ③ RÓWNOLEGLE, LEKKO — USAGE  *niech dane sterują, nie nastrój*
- Analytics: które przedmioty klikają, czy wracają, co wpisują w formularz
- Zbierać opinie (mechanizm już jest)

### ④ FILAR (po cutoverze lub powolny tor w tle) — sekcja WIEDZA
Rzetelne, oparte na źródłach artykuły — anty-clickbait. Pasuje do marki „nauka".
- `/wiedza` (lub `/czytelnia`): Astro **content collection**, markdown + **jeden** szablon, tagi, **cytowane źródła** (to wyróżnik), format „mit vs fakt"
- Pierwszy wpis: **mięso / bycie wege** (już napisany → dostaje dom)
- Zasady: **filar, nie pivot** (ma dowozić studentów do rdzenia) · **nie wyprzedza cutovera** · **tani w utrzymaniu** (zero ręcznego HTML na wpis)

---

## 🧊 Zamrożone — nie otwierać ponownie bez sygnału z danych
- **Stopka** = basic (wielki UNICORNER + eyebrow/tagline/CTA + legal). Dostrajanie: `/foot-lab`.
- **Hero** = chromowany szkielet + tło FaultyTerminal.
- **Tło strony** = siatka 38px.

## Zasada nadrzędna
**Skończ, potem rozgałęziaj.** Nie przełączaj kontekstu przed dokończeniem rzeczy.
Wygląd ma budżet; **ship i treść mają priorytet.**
