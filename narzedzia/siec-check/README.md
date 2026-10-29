# siec-check: test sieciowy zbudowanego `dist/`

Po co: wykrywa, że strona zaczęła łączyć się z czymś, o czym nie wiemy (np. skrypt lub dekoder z cudzego CDN, stara koncepcja uruchamiana w tle). Ma wychwytywać takie rzeczy w pull requeście, zanim trafią na `main`.

## Co robi
Dla każdej strony HTML w `dist/` otwiera ją w Chromium (Playwright), przewija i zapisuje wszystkie żądania sieciowe.
- **Błąd (exit 1):** zewnętrzny origin spoza `allowlist.json`; strona nie ładuje się (błąd nawigacji lub status ≥ 400).
- **Ostrzeżenie (adnotacja w GitHub Actions, nie blokuje):** zbiór lokalnych skryptów i żądań `fetch`/`xhr` strony różni się od `snapshot.json` (nazwy bez hashy buildu).

Zewnętrzne żądania są tylko zapisywane i przerywane: test nic nie wysyła do internetu.

## Uruchomienie lokalnie
```
npm run build
npm i --no-save playwright@1.63.0   # albo w osobnym katalogu, patrz workflow
npx playwright install chromium
node narzedzia/siec-check/sprawdz.cjs dist
```

## Gdy zmiana jest zamierzona
- Nowy zewnętrzny origin: dopisz go w `allowlist.json` (globalnie albo dla jednej strony) i wyjaśnij w opisie PR, po co jest i czy polityka prywatności o nim mówi.
- Zmiana lokalnych skryptów (nowy wariant, usunięta scena): `node narzedzia/siec-check/sprawdz.cjs dist --update-snapshot` i dołącz zmieniony `snapshot.json` do PR.

## Ograniczenia
- Nie klika zakładek, quizów ani generatora po zalogowaniu; widzi tylko to, co strona robi po wejściu i przewinięciu.
- Nie testuje treści ani wyglądu.
- Wersja Playwright jest przypięta w `.github/workflows/build-pr.yml` i wymaga ręcznej aktualizacji (Dependabot jej nie widzi).
