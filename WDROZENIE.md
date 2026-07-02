# Wdrożenie — kroki w TEJ kolejności

## KROK 0 — Cloudflare: KV **przed** wgraniem nowego workera ⚠️

Nowy worker używa KV (opinie + limity zapytań). Jeśli wgrasz go bez bindingu,
**generator przestanie działać** (błąd 500). Dlatego najpierw:

1. Panel Cloudflare → **Storage & Databases → KV** → *Create namespace* → nazwa np. `unicorner-kv`.
2. **Workers → red-queen-3002 → Settings → Bindings → Add → KV Namespace**:
   - Variable name: `UC_KV`  (dokładnie tak, wielkość liter ma znaczenie)
   - Namespace: ten utworzony przed chwilą.
3. Tam gdzie masz sekrety (Settings → Variables and Secrets) dodaj:
   - `ADMIN_CODE` — długi kod do moderacji opinii (to Twoje hasło admina — nie dawaj go nikomu).
4. Sprawdź `ALLOWED_ORIGIN` — ma być `https://unicorner.pl`
   (jeśli strona działa też z `www.`, wpisz oba po przecinku: `https://unicorner.pl,https://www.unicorner.pl`).

## KROK 1 — wgraj `worker.js`

Workers → red-queen-3002 → Edit code → podmień całość na nowy `worker.js` → **Deploy**.
Stara strona dalej będzie działać (endpoint `POST /` zachowany), więc kolejność commitów na GitHubie jest dowolna.

Warto też wrzucić `worker.js` do repo (np. folder `backend/`) — GitHub Pages go nie opublikuje jako strony,
a będziesz mieć kopię zapasową i historię zmian.

## KROK 2 — commit: system opinii

Wrzuć do repo: `recenzje.html`, `moderacja.html`, podmień `index.html`.

## KROK 3 — commit: generator ze zdjęciami

Podmień `generator.html`.

---

# Checklista do ręcznego sprawdzenia

**Opinie**
- [ ] `unicorner.pl/recenzje.html` — wyślij testową opinię (gwiazdki + tekst) → ekran „Opinia wysłana".
- [ ] `unicorner.pl/moderacja.html` — wpisz ADMIN_CODE → opinia widoczna → Zatwierdź.
- [ ] Strona główna → opinia jedzie w pasku (cache do 60 s, ewentualnie odśwież).
- [ ] Wyślij 6 opinii pod rząd → szósta ma dostać komunikat o limicie dziennym.
- [ ] Wyślij opinię < 10 znaków → błąd walidacji.

**Generator — zdjęcia**
- [ ] Wgraj 1–2 zdjęcia odręcznych notatek (telefonem, JPG) → fiszki i quiz z ich treści.
- [ ] Wgraj PDF jak dotychczas → działa bez zmian.
- [ ] Skan-PDF (bez warstwy tekstu) → komunikat podpowiada wgranie stron jako zdjęć.
- [ ] iPhone: zdjęcie prosto z aparatu (HEIC) — Safari zwykle samo konwertuje do JPG; jeśli poleci błąd odczytu, daj znać.

**Finale (jednorożec + neon)**
- [ ] Dół strony głównej: jednorożec z kropek składa się przy scrollu, reaguje na kursor / palec.
- [ ] Napis „unicorner" — sam kontur ze świeceniem, czytelny na mobile.
- [ ] Telefon średniej klasy: scroll przy stopce płynny (jak nie — zgłoś, zmniejszymy liczbę kropek).

# Ograniczenia — mówię wprost

- **Limit zdjęć: 4 na generowanie, kompresja do ~1400 px.** Powód: darmowy plan Workers ma limit czasu CPU;
  większe paczki mogą go przekroczyć. 4 zdjęcia notatek ≈ 1 solidna porcja materiału. Jak będzie mało — plan
  Workers Paid ($5/mies.) zdejmuje limit i podniesiemy do 8–10.
- **Koszt zdjęć w API:** ~1500–2000 tokenów wejścia na zdjęcie — przy Haiku to grosze, ale generowanie
  ze zdjęć jest ~2–3× droższe niż z tekstu. Limit 12 generowań/h/IP trzyma to w ryzach.
- **Odczyt pisma ręcznego nie jest nieomylny** — bardzo niechlujne notatki dadzą częściowe wyniki.
  Prompt każe pomijać nieczytelne fragmenty zamiast zgadywać, więc lepszy krótszy, pewny quiz niż zmyślony.
- **`moderacja.html` jest jawna w publicznym repo** — bezpieczeństwo trzyma ADMIN_CODE (sekret w Cloudflare),
  nie ukrycie strony. Bez kodu nikt nic nie zrobi, ale nie linkuj jej nigdzie.
- **Tally**: po potwierdzeniu, że nowy formularz działa, usuń formularz w panelu Tally, żeby nikt nie trafił
  na stary link z historii.
