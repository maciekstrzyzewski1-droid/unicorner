# Unicorner

Studencka platforma do nauki na egzaminy (UEP) — fiszki, zadania krok po kroku i quizy
z natychmiastową informacją zwrotną. Bez logowania, działa na telefonie.

- **Live:** https://unicorner.pl
- **Hosting:** GitHub Pages (statyczne pliki z brancha `main`) + domena z pliku `CNAME`
- **Backend:** Cloudflare Worker (`worker.js`) + KV — generator AI, opinie, moderacja
- **Stack:** czysty HTML/CSS/JS, bez frameworków. Każda strona to samodzielny plik.

---

## Struktura plików

### Strona główna i podstrony przedmiotów (linkowane z `index.html`)

| Plik | Co to jest |
| --- | --- |
| `index.html` | Strona główna — kafle przedmiotów, sekcja generatora, FAQ. Listę przedmiotów definiuje tablica `SUBJECTS` w skrypcie na dole pliku. |
| `makroekonomia.html` | Makroekonomia — fiszki, zadania z rozwiązaniami krok po kroku, „ściana", quiz. |
| `marketing.html` | Podstawy Marketingu — materiały + quiz (55 pytań). |
| `mitz.html` | Metody i Techniki Zarządzania — kompendium + quiz. |
| `statystyka.html` | Statystyka opisowa — miary średnie i zróżnicowania (hub „Statystyka"). |
| `dynamika.html` | Analiza dynamiki — indeksy (hub „Statystyka"). |
| `trend.html` | Tendencja rozwojowa — trend (hub „Statystyka"). |
| `generator.html` | Generator AI — z PDF/zdjęć notatek robi fiszki i quiz. Gada z Workerem. |
| `recenzje.html` | Formularz opinii (wysyła do moderacji przez Worker). |

### Backend / narzędzia

| Plik | Co to jest |
| --- | --- |
| `worker.js` | Źródło Cloudflare Workera. Endpointy: generator, opinie, moderacja. Sekrety (`ANTHROPIC_API_KEY`, `ACCESS_CODE`, `ADMIN_CODE`, `ALLOWED_ORIGIN`) i binding KV (`UC_KV`) ustawiane w panelu Cloudflare — **nie** w kodzie. |
| `moderacja.html` | Panel moderacji opinii. `noindex`, nielinkowany. Wymaga `ADMIN_CODE`. |
| `CNAME` | Domena dla GitHub Pages: `unicorner.pl`. Nie ruszać bez powodu. |
| `WDROZENIE.md` | Notatki wdrożeniowe (konfiguracja Workera, KV, sekretów). |

### Strony gotowe, ale NIElinkowane ze strony głównej (sieroty)

| Plik | Uwaga |
| --- | --- |
| `Zarządzanie jakością.html` | Gotowa strona przedmiotu, ale **nazwa ma spacje i polskie znaki** → brzydki, kruchy URL. Nie ma jej w `SUBJECTS`. Do ujednolicenia nazwy (np. `zarzadzanie-jakoscia.html`) i podlinkowania. |
| `korelacja.html` | Statystyka — korelacja. Nielinkowana. |
| `sezonowosc.html` | Statystyka — wahania sezonowe (trend.html o niej wspomina). Nielinkowana. |

### Pliki pomocnicze (zostają — są w użyciu)

| Ścieżka | Uwaga |
| --- | --- |
| `makroekonomia_files/css2` | Lokalny arkusz fontów — `makroekonomia.html` ładuje z niego czcionki. NIE usuwać bez przepięcia na CDN. |
| `reviews.json` | Pusty `[]`, ale `index.html` używa go jako fallback, gdy Worker leży. Zostawić. |

---

## Jak dodać nowy przedmiot

1. Dodaj plik `nazwa-przedmiotu.html` w roocie (małe litery, myślniki, bez spacji i polskich znaków).
2. Dopisz wpis do tablicy `SUBJECTS` w `index.html` (`status:"live"`, `file:"nazwa-przedmiotu.html"`).
3. Commit + push na `main`. GitHub Pages sam zbuduje i wdroży (~1 min).

---

## Wdrożenie i pułapki

- **Deploy:** każdy push na `main` odpala workflow `pages-build-deployment`. Nowy plik **musi** być zacommitowany (`git status` → nie zostawiaj „untracked"). `git add .` łapie wszystko nowe.
- **Cache 404:** jeśli linkujesz do pliku, którego jeszcze nie ma, CDN potrafi zapamiętać 404 dla tego adresu nawet po dodaniu pliku. Obejście: dopisz `?v=1` do linku. Tak jest zrobiony link do generatora w `index.html`.
- **Nazwy plików:** GitHub Pages jest wrażliwy na wielkość liter i ścieżki (Linux). Trzymaj się małych liter i myślników — bez spacji, wielkich liter i polskich znaków.
- Szczegóły backendu: `WDROZENIE.md`.

---

*Projekt studencki, niepowiązany z UEP ani żadną katedrą. Materiały to własne opracowania.*
