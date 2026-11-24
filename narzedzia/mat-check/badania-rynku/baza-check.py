# Niezależna kontrola liczb modułu „Baza danych z ankiety”: liczy wszystko od nowa z plików .xlsx z zajęć
# (bez agregatów i bez lib/baza.js) i porównuje z wartościami, które pokazuje moduł (zrzut z node: baza-zrzut.mjs).
# Użycie: python3 -I baza-check.py <baza-zajecia-1.xlsx> <baza-zajecia-2.xlsx>   (uruchamiać z katalogu repo)
import json, subprocess, sys
from collections import Counter
import openpyxl

ws = openpyxl.load_workbook(sys.argv[1]).worksheets[0]
ws2 = openpyxl.load_workbook(sys.argv[2]).worksheets[0]
L = openpyxl.utils.column_index_from_string
col = lambda c, a=ws: [a.cell(r, L(c)).value for r in range(2, 363)]
KOD = {'zdecydowanie się nie zgadzam': 1, 'raczej się nie zgadzam': 2, 'ani się nie zgadzam, ani się zgadzam': 3, 'raczej się zgadzam': 4, 'zdecydowanie się zgadzam': 5}
oczek = {}
gen, plec, p5 = col('AF'), col('AE'), col('D')
oczek['t5g'] = [[sum(1 for a, g in zip(p5, gen) if a == o and g == G) for G in 'XYZ'] for o in ['tak', 'nie']]
oczek['t5p'] = [[sum(1 for a, g in zip(p5, plec) if a == o and g == G) for G in ['kobieta', 'mężczyzna']] for o in ['tak', 'nie']]
c2 = Counter(col('B')); oczek['r2'] = [c2[k] for k in ['ani razu', '1-2', '3-5', '6-10', 'ponad 10']]
c4 = Counter(col('C')); oczek['r4'] = [c4[k] for k in ['<25%', '25-49%', '50-74%', '75%i>']]
oczek['P6'] = [sum(1 for v in col(c) if v == 1) for c in 'EFGHIJKLM']
m9 = col('M'); oczek['t9g'] = [[sum(1 for a, g in zip(m9, gen) if a == o and g == G) for G in 'XYZ'] for o in [1, 2]]
def sr(c, grupy=None, zm=None, nd0=False):
    v = [KOD.get(x) for x in col(c)]
    if grupy is None:
        ok = [x for x in v if x]; return round(sum(ok) / (361 if nd0 else len(ok)), 6)
    return [round(sum(x for x, g in zip(v, zm) if x and g == G) / sum(1 for x, g in zip(v, zm) if x and g == G), 6) for G in grupy]
oczek['s81'] = sr('V'); oczek['s81z'] = sr('V', nd0=True); oczek['s84'] = sr('Y'); oczek['s84z'] = sr('Y', nd0=True)
oczek['s71p'] = sr('N', ['kobieta', 'mężczyzna'], plec); oczek['s71g'] = sr('N', list('XYZ'), gen)
oczek['nS5'] = sum(1 for v in col('AH') if v == 5); oczek['nM1'] = sum(1 for v in col('AL') if v == 1); oczek['nOdm'] = plec.count('odmowa odp.')
oczek['p6sprz'] = [r + 2 for r in range(361) if col('M')[r] == 1 and any(col(c)[r] == 1 for c in 'EFGHIJKL')]
am, ai = [int(v) for v in col('AM', ws2)], col('AI', ws2)
oczek['dochK'] = [am.count(k) for k in range(1, 11)]
grp = lambda k: 'do 3000' if k <= 4 else '3001-5000' if k <= 6 else '5001-7000' if k == 7 else '7001-10000' if k == 8 else 'pow. 10000'
zg = [grp(a) == b for a, b in zip(am, ai)]
oczek['pierwszyZly'] = zg.index(False) + 2; oczek['zgodneDoch'] = sum(zg)
oczek['dochAI'] = [ai.count(k) for k in ['do 3000', '3001-5000', '5001-7000', '7001-10000', 'pow. 10000']]

zrzut = json.loads(subprocess.check_output(['node', 'narzedzia/mat-check/badania-rynku/baza-zrzut.mjs']))
bledy = 0
for k, v in oczek.items():
    z = zrzut[k]
    rowne = (abs(z - v) < 1e-5) if isinstance(v, float) else ([round(x, 6) for x in z] == v if isinstance(v, list) and v and isinstance(v[0], float) else z == v)
    print(('OK ' if rowne else '✗  ') + k, v if rowne else f'xlsx {v} ≠ moduł {z}')
    bledy += not rowne
print('Błędów:', bledy)
sys.exit(1 if bledy else 0)
