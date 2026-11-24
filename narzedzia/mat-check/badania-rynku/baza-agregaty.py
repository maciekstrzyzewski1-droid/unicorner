# Agregaty z „Bazy danych – zajęcia 1/2” (ankieta o AI w aplikacji bankowej, 361 respondentów) dla modułu
# „Baza danych z ankiety” (src/pages/metody-badan-rynku/baza-danych.mdx).
# Do repo trafiają tylko zliczenia, sumy do średnich i kilka pierwszych wierszy pokazanych na stronie — nie cała baza.
# Pliki .xlsx z zajęć leżą w prywatnym repo scratchbook (materialy/mbr/).
#
# Użycie:  python3 -I baza-agregaty.py <baza-zajecia-1.xlsx> <baza-zajecia-2.xlsx> <wyjście.js>
import json
import sys
from collections import Counter

import openpyxl

P1, P2, WYJ = sys.argv[1], sys.argv[2], sys.argv[3]
ws = openpyxl.load_workbook(P1).worksheets[0]
ws2 = openpyxl.load_workbook(P2).worksheets[0]
L = openpyxl.utils.column_index_from_string
R = range(2, ws.max_row + 1)
NRESP = sum(1 for r in R if ws.cell(r, 1).value is not None)
assert NRESP == 361, NRESP


def kol(c, arkusz=ws):
    return [arkusz.cell(r, L(c)).value for r in R]


def txt(v):
    # liczby z bazy zostają liczbami w tekście („1”), żeby było widać, że w kolumnie tekstów stoi kod
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    return '' if v is None else str(v)


LIKERT = ['zdecydowanie się nie zgadzam', 'raczej się nie zgadzam', 'ani się nie zgadzam, ani się zgadzam',
          'raczej się zgadzam', 'zdecydowanie się zgadzam']
KOD = {t: i + 1 for i, t in enumerate(LIKERT)}

# zmienne kategorialne: id → (kolumna, krótka nazwa, kolejność kategorii jak w kafeterii)
KAT = {
    'P1': ('A', 'P1 Z aplikacji ilu banków korzysta', ['1', '2', '3 i więcej', 'nie korzystam']),
    'P2': ('B', 'P2 Ile razy w ostatnich 7 dniach korzystał z aplikacji', ['ani razu', '1-2', '3-5', '6-10', 'ponad 10']),
    'P4': ('C', 'P4 Jaka część czynności bankowych w aplikacji', ['<25%', '25-49%', '50-74%', '75%i>']),
    'P5': ('D', 'P5 Czy wiedział, że aplikacje mogą używać AI', ['tak', 'nie']),
    'PLEC': ('AE', 'PŁEĆ', ['kobieta', 'mężczyzna', 'odmowa odp.']),
    'GEN': ('AF', 'GENERACJA', ['X', 'Y', 'Z']),
    'WYK': ('AG', 'WYKSZTAŁCENIE', ['podst., zaw.', 'średnie', 'wyższe']),
    'SYT': ('AH', 'SYTUACJA ZAWODOWA', ['uczę się', 'uczę się i pracuję', 'pracuję', 'prowadzę dział. gosp.', '5']),
    'DOCH': ('AI', 'DOCHÓD NETTO W ZŁ', ['do 3000', '3001-5000', '5001-7000', '7001-10000', 'pow. 10000']),
    'ZMIANA': ('AJ', 'ZMIANA SYT. FINANSOWEJ', ['pogorszenie', 'bez zmian', 'niewielka poprawa', 'znaczna poprawa']),
    'STAB': ('AK', 'STABILNOŚĆ DOCHODÓW', ['Nie mam dochodu', 'niestabilne', 'raczej stabilne', 'bardzo stabilne']),
    'MIEJSCE': ('AL', 'MIEJSCE ZAMIESZKANIA', ['1', 'miasto do 50 tys.', 'miasto 51-500 tys.', 'miasto pow. 500 tys.']),
}
# P6: pytanie wielokrotnego wyboru, każda funkcja w osobnej kolumnie: 1 = zaznaczona, 2 = niezaznaczona
P6 = [('E', 'Automatyczna kategoryzacja lub analiza wydatków'), ('F', 'Funkcje wspierające oszczędzanie i planowanie finansowe'),
      ('G', 'Alerty o wzroście wydatków lub przekroczeniu budżetu'), ('H', 'Alerty o nietypowych lub podejrzanych transakcjach'),
      ('I', 'Ochrona (weryfikacja) behawioralna'), ('J', 'Chatbot lub voicebot bankowy'), ('K', 'Oferty dopasowane do historii transakcji'),
      ('L', 'Rekomendacje dotyczące zarządzania finansami'), ('M', 'Nie korzystałam/em z żadnego z tych rozwiązań')]
for i, (c, t) in enumerate(P6):
    KAT[f'P6_{i + 1}'] = (c, f'P6 ({i + 1}) {t}', ['1', '2'])
# P7 i P8: stwierdzenia na skali Likerta (P8 ma też „N/D”)
P7 = ['Aplikacja bankowa jest łatwa w obsłudze.', 'Łatwo znajduję w aplikacji potrzebne funkcje.',
      'Poruszanie się po aplikacji jest dla mnie intuicyjne.', 'Informacje prezentowane w aplikacji są dla mnie zrozumiałe.',
      'Aplikacja pozwala mi szybko wykonać potrzebne operacje.', 'Układ wyświetlanych elementów aplikacji jest przejrzysty.',
      'Większość spraw bankowych mogę załatwić za pomocą aplikacji bankowej.', 'Korzystanie z aplikacji bankowej wymaga ode mnie niewielkiego wysiłku.']
P8 = ['AI ułatwia korzystanie z usług bankowych.', 'AI w aplikacji bankowej pomaga lepiej zarządzać finansami.',
      'Dzięki AI usługi i informacje otrzymywane w aplikacji są lepiej dopasowane do moich potrzeb.',
      'Jestem pozytywnie nastawiony/a do wykorzystywania AI w aplikacjach bankowych.',
      'Możliwość korzystania z rozwiązań opartych na AI budzi moje zainteresowanie.',
      'Możliwość korzystania z funkcji AI w aplikacji bankowej wywołuje u mnie pozytywne odczucia.',
      'Chętnie korzystam z funkcji wykorzystujących AI dostępnych w aplikacji bankowej.',
      'Jestem gotowy/a korzystać z informacji i rekomendacji generowanych przez AI, jeżeli uznam je za przydatne.',
      'Polecił(a)bym innym osobom korzystanie z przydatnych funkcji AI w aplikacjach bankowych.']
SKALE = {}
for i, (c, kodc) in enumerate(zip('NOPQRSTU', ['AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW'])):
    SKALE[f'P7_{i + 1}'] = (c, kodc, f'P7 ({i + 1}) {P7[i]}')
for i, c in enumerate(['V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD']):
    SKALE[f'P8_{i + 1}'] = (c, None, f'P8 ({i + 1}) {P8[i]}')
for k, (c, _, _) in SKALE.items():
    kat = LIKERT + (['N/D'] if k.startswith('P8') else [])
    KAT[k] = (c, SKALE[k][2], kat)

dane = {k: [txt(v) for v in kol(c)] for k, (c, _, _) in KAT.items()}
for k, (c, _, kat) in KAT.items():
    obce = set(dane[k]) - set(kat)
    assert not obce, (k, obce)

# kody liczbowe stwierdzeń (P7 z kolumn AP–AW bazy; P8 liczone tym samym kluczem, N/D → brak)
kody = {}
for k, (c, kodc, _) in SKALE.items():
    kody[k] = [KOD.get(t) for t in dane[k]]
    if kodc:
        assert kody[k] == [int(v) for v in kol(kodc)], k

# tabele krzyżowe: liczebności dla każdej pary zmiennych kategorialnych
# (kolumny tabeli = zmienne, którymi dzielimy respondentów na grupy; wiersze = dowolne pytanie)
GRUPUJACE = ['PLEC', 'GEN', 'WYK', 'SYT', 'DOCH', 'MIEJSCE', 'P5', 'P2', 'P1']
krzyz = {}
ids = list(KAT)
for a in ids:
    for b in GRUPUJACE:
        if a == b:
            continue
        c = Counter(zip(dane[a], dane[b]))
        krzyz[f'{a}|{b}'] = [[c[(x, y)] for y in KAT[b][2]] for x in KAT[a][2]]
rozklad = {k: [Counter(dane[k])[x] for x in KAT[k][2]] for k in ids}

# sumy kodów do średnich: dla stwierdzenia s i zmiennej grupującej g → [n, suma, liczba N/D] w każdej kategorii g
srednie = {}
for s in SKALE:
    srednie[s] = {'_': [sum(1 for v in kody[s] if v), sum(v for v in kody[s] if v), sum(1 for v in kody[s] if not v)]}
    for g in ['PLEC', 'GEN', 'WYK', 'DOCH', 'MIEJSCE', 'P5', 'P2']:
        srednie[s][g] = [[sum(1 for v, x in zip(kody[s], dane[g]) if v and x == kat),
                          sum(v for v, x in zip(kody[s], dane[g]) if v and x == kat),
                          sum(1 for v, x in zip(kody[s], dane[g]) if not v and x == kat)] for kat in KAT[g][2]]
# indeks P7 (średnia z 8 stwierdzeń jednej osoby) — suma średnich osób i liczba osób w grupach
idx = [sum(kody[f'P7_{i}'][r] for i in range(1, 9)) / 8 for r in range(NRESP)]
indeks = {'_': [NRESP, sum(idx)]}
for g in ['PLEC', 'GEN']:
    indeks[g] = [[sum(1 for x in dane[g] if x == kat), sum(v for v, x in zip(idx, dane[g]) if x == kat)] for kat in KAT[g][2]]

# kontrole spójności (numery wierszy Excela)
wiersz = lambda i: i + 2
p6_sprzeczne = [wiersz(i) for i in range(NRESP)
                if dane['P6_9'][i] == '1' and any(dane[f'P6_{j}'][i] == '1' for j in range(1, 9))]
p6_puste = [wiersz(i) for i in range(NRESP) if all(dane[f'P6_{j}'][i] == '2' for j in range(1, 10))]
p1_nie = [wiersz(i) for i in range(NRESP) if dane['P1'][i] == 'nie korzystam']
syt5 = [wiersz(i) for i in range(NRESP) if dane['SYT'][i] == '5']
odmowa = [wiersz(i) for i in range(NRESP) if dane['PLEC'][i] == 'odmowa odp.']
miejsce1 = [wiersz(i) for i in range(NRESP) if dane['MIEJSCE'][i] == '1']

# zajęcia 2: kolumny z kodami (AM dochód 1–10, AN miejsce 1–8) obok kolumn tekstowych AI i AL
for c in ['A', 'AF', 'AI', 'AL', 'N']:
    assert kol(c) == kol(c, ws2), c
am = [int(v) for v in kol('AM', ws2)]
an = [int(v) for v in kol('AN', ws2)]
GR_D = {1: 'do 3000', 2: 'do 3000', 3: 'do 3000', 4: 'do 3000', 5: '3001-5000', 6: '3001-5000', 7: '5001-7000', 8: '7001-10000', 9: 'pow. 10000', 10: 'pow. 10000'}
GR_M = {1: '1', 2: 'miasto do 50 tys.', 3: 'miasto do 50 tys.', 4: 'miasto do 50 tys.', 5: 'miasto 51-500 tys.', 6: 'miasto 51-500 tys.', 7: 'miasto 51-500 tys.', 8: 'miasto pow. 500 tys.'}
zg_d = [GR_D[a] == b for a, b in zip(am, dane['DOCH'])]
zg_m = [GR_M[a] == b for a, b in zip(an, dane['MIEJSCE'])]
pierwszy_zly = min(zg_d.index(False), zg_m.index(False))
assert all(zg_d[:pierwszy_zly]) and all(zg_m[:pierwszy_zly])
gora = range(pierwszy_zly)  # wiersze 2 … pierwszy_zly+1
grupy = {
    'pierwszyZly': wiersz(pierwszy_zly),
    'zgodneDoch': sum(zg_d), 'zgodneMiejsce': sum(zg_m),
    'doch': {'kody': [Counter(am)[k] for k in range(1, 11)], 'grupy': GR_D,
             'gora': [[sum(1 for i in gora if am[i] == k and dane['DOCH'][i] == g) for g in KAT['DOCH'][2]] for k in range(1, 11)]},
    'miejsce': {'kody': [Counter(an)[k] for k in range(1, 9)], 'grupy': GR_M,
                'gora': [[sum(1 for i in gora if an[i] == k and dane['MIEJSCE'][i] == g) for g in KAT['MIEJSCE'][2]] for k in range(1, 9)]},
    # pierwsze wiersze: kod obok tekstu (do rysunku) — i kilka wierszy tuż po przesunięciu
    'przyklad': [[wiersz(i), am[i], dane['DOCH'][i], an[i], dane['MIEJSCE'][i]] for i in list(range(8)) + list(range(pierwszy_zly - 2, pierwszy_zly + 4))],
}

# kilka pierwszych wierszy bazy (tekst jak w Excelu) do rysunków
PRZYKLAD_WIERSZE = 10
probka = {k: dane[k][:PRZYKLAD_WIERSZE] for k in ids}
# pojedyncze wiersze z błędami, pokazywane w części o sprawdzaniu bazy (numer wiersza Excela → odpowiedzi)
WYBRANE = sorted({miejsce1[0], syt5[0], p1_nie[0], *p6_sprzeczne, odmowa[0]})
wybrane = {str(r): {k: dane[k][r - 2] for k in ids} for r in WYBRANE}

wynik = {
    'n': NRESP,
    'zmienne': {k: {'kol': c, 'nazwa': n, 'kat': kat} for k, (c, n, kat) in KAT.items()},
    'skale': {k: {'kol': c, 'kolKod': kc, 'nazwa': n} for k, (c, kc, n) in SKALE.items()},
    'likert': LIKERT,
    'rozklad': rozklad,
    'krzyz': krzyz,
    'srednie': srednie,
    'indeksP7': indeks,
    'kontrole': {'p6Sprzeczne': p6_sprzeczne, 'p6Puste': p6_puste, 'p1Nie': p1_nie, 'syt5': syt5, 'odmowa': odmowa,
                 'miejsce1': len(miejsce1), 'miejsce1Pierwsze': miejsce1[:5]},
    'grupy': grupy,
    'probka': probka,
    'wybrane': wybrane,
}
# moduł JS (a nie .json): ten sam plik czyta Astro przy buildzie i Node w skryptach kontrolnych
with open(WYJ, 'w', encoding='utf-8') as f:
    f.write('// Wygenerowane przez narzedzia/mat-check/badania-rynku/baza-agregaty.py — nie edytuj ręcznie.\n')
    f.write('export default ')
    json.dump(wynik, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')
print('zapisano', WYJ, 'zmiennych', len(KAT), 'par', len(krzyz))
