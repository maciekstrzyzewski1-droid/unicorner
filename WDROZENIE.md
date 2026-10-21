# Wdrożenie

Dwa niezależne tory: **strona** (automatyczny deploy z GitHuba) i **Worker** (ręcznie w panelu Cloudflare).
Stan na 2026-10-21, Worker w wersji 10 (konta, kredyty, udostępnianie, powtórki, PDF-y ze skanami).

---

## Strona (Astro → GitHub Pages)

Nic nie trzeba wgrywać ręcznie. Push na `main` uruchamia `.github/workflows/deploy.yml`:
`npm ci` → `npm run build` → publikacja `dist/`. Domena `unicorner.pl` pochodzi z `public/CNAME`.

Jednorazowo w ustawieniach repo: **Settings → Pages → Source = „GitHub Actions"**.
Przed pushem uruchom lokalnie `npm run build`. Testów automatycznych nie ma, więc to jedyna kontrola
(na pull requestach CI uruchamia ten sam build: `.github/workflows/build-pr.yml`).
Treść strony edytuje się w `src/` i `public/`.

---

## Worker (`worker.js`, Cloudflare)

W repo nie ma konfiguracji `wrangler`, więc kod wkleja się ręcznie:
**Workers → `red-queen-3002` → Edit code → podmień całość na `worker.js` → Deploy.**
Endpointy i pełna lista zmiennych są w komentarzu na górze `worker.js`.

### Wymagane przed wdrożeniem (inaczej Worker zwróci błąd 500)

Bindingi (Workers → `red-queen-3002` → Settings → Bindings):
- `UC_KV`: namespace KV (opinie; awaryjnie limity na IP).
- `DB`: baza D1 `unicorner-db` (konta, sesje, talie, kredyty). Tabele tworzą się same przy pierwszym uruchomieniu.

Zmienne i sekrety (Settings → Variables and Secrets):
- `ANTHROPIC_API_KEY`: klucz do AI.
- `ADMIN_CODE`: długi kod do panelu moderacji opinii (to hasło admina, nie dawaj go nikomu).
- `ALLOWED_ORIGIN`: `https://unicorner.pl` (kilka adresów po przecinku, np. dodatkowo `https://www.unicorner.pl`).
- opcjonalnie `ADMIN_EMAILS`: Twoje maile (po przecinku), konta bez limitu generowań.
- opcjonalnie `FREE_MONTHLY_CREDITS`: darmowe kredyty na konto na miesiąc (domyślnie 30).
- `ACCESS_CODE`: stary wspólny kod, od wersji 9 nieużywany. Można usunąć.

Logowanie używa Google Identity Services. Identyfikator klienta (`GOOGLE_CLIENT_ID`) jest wpisany w `worker.js` i jest publiczny z założenia.

### Po wdrożeniu Workera

- `GET https://red-queen-3002.unicorner.workers.dev/health` powinno zwrócić `{ok, db, kv, ai_key}`, wszystko na `true`.

---

# Checklista do ręcznego sprawdzenia po większej zmianie

**Opinie**
- [ ] `unicorner.pl/recenzje.html`: wyślij testową opinię (gwiazdki + tekst), ekran „Opinia wysłana".
- [ ] `unicorner.pl/moderacja.html`: wpisz `ADMIN_CODE`, opinia widoczna, Zatwierdź.
- [ ] Strona główna: zatwierdzona opinia pojawia się w pasku (cache do 60 s). Gdy Worker leży, pasek bierze `reviews.json`.
- [ ] Wyślij 6 opinii pod rząd: szósta dostaje komunikat o limicie dziennym (5/dobę/IP).
- [ ] Opinia < 10 znaków: błąd walidacji.

**Generator i konta**
- [ ] Logowanie przez Google działa, widać licznik kredytów.
- [ ] Generowanie z PDF (tekst) oraz z 1–2 zdjęć notatek (JPG z telefonu).
- [ ] Skan-PDF / zdjęcia kartek zapisane jako PDF: generator sam zamienia strony na obrazy (do 12 stron) i robi talię. Długi PDF: pod wynikiem informacja, z których stron powstała talia.
- [ ] `GET /health` zwraca `"version":10` (strona z nowym odczytem PDF wymaga Workera v10 — stary przyjmie najwyżej 4 obrazy).
- [ ] Zapisana talia widoczna w „Moje talie", udostępnienie linkiem (podgląd w `talia.html`) i zapis kopii na drugie konto.
- [ ] Konto bez kredytów dostaje czytelny komunikat, a nie błąd 500.
- [ ] iPhone: zdjęcie prosto z aparatu (HEIC). Safari zwykle konwertuje do JPG; jeśli poleci błąd odczytu, zgłosić.

**Strona główna**
- [ ] Jednorożec z kropek składa się przy scrollu i reaguje na kursor / palec.
- [ ] Telefon średniej klasy: scroll przy stopce płynny (jeśli nie, zmniejszyć liczbę kropek).

---

# Ograniczenia, mówię wprost

- **Limit zdjęć: 4 na generowanie, kompresja do ~1400 px.** Powód: limit czasu CPU na darmowym planie Workers. Plan Paid ($5/mies.) zdejmuje limit.
- **Koszt zdjęć w API:** ~1500–2000 tokenów wejścia na zdjęcie. Generowanie ze zdjęć jest ~2–3× droższe niż z tekstu. Trzymają to w ryzach: limit 12 generowań/h na użytkownika, limit na IP (4× limit użytkownika, bo akademik i sieć komórkowa dzielą IP) i miesięczne kredyty.
- **Odczyt pisma ręcznego nie jest nieomylny.** Prompt każe pomijać nieczytelne fragmenty zamiast zgadywać, więc lepszy krótszy, pewny quiz niż zmyślony.
- **`moderacja.html` jest jawna w publicznym repo.** Bezpieczeństwo trzyma `ADMIN_CODE` (sekret w Cloudflare), nie ukrycie strony. Nie linkuj jej nigdzie.
- **Repo jest publiczne.** Nie wpisuj do kodu żadnych sekretów. Klucz Anthropic i `ADMIN_CODE` mają zostać wyłącznie w panelu Cloudflare.
