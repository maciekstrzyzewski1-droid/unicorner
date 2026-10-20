# Sprawdza dane modułu 12 (src/lib/calki-zadania.js, zrzut w dane.json):
#  - wynik: pochodna wyniku == funkcja podcałkowa (wpisana niezależnie, ręcznie),
#  - linie 'x': każda część łańcucha (rozdzielona '=') ma pochodną == funkcja podcałkowa,
#  - linie 'g': każda część == funkcja podcałkowa,
#  - linie 't': każda część po wstawieniu t = pod ma pochodną po x == funkcja podcałkowa,
#  - rachunki „na kartce” (k): lewa == prawa.
import json, re, sys
import sympy as sp
from sympy.parsing.latex import parse_latex

x, t = sp.symbols('x t', positive=True)
L, E = sp.log, sp.exp
F = {
 'Z1': {
  'a': x**4 + x**8, 'b': x**sp.Rational(-5, 4), 'c': sp.sqrt(x) / (3 * x * x**sp.Rational(2, 3)),
  'd': 2 / x**3 + 1 / x**2 - 1 / x, 'e': (x - 1)**2 * (x - 3), 'f': (2 * x - 1)**3,
  'g': (x**3 - x * sp.sqrt(x) + 1) / x, 'h': (x**sp.Rational(1, 4) + 3 * x**sp.Rational(2, 3) + 5 * sp.sqrt(x)) / x**sp.Rational(1, 3),
  'i': 4 * E(x) + 1 / x, 'j': 5**x },
 'Z2': {
  'a': (x**2 + 2)**3 * x, 'b': (x**2 + 3)**8 * x, 'c': sp.sqrt(2 * x + 9), 'd': x / (x**2 + 1), 'e': x / (x**2 + 5)**5,
  'f': x**2 / (x**3 + 3), 'g': x / sp.cbrt(2 * x**2 - 1), 'h': x * sp.sqrt(2 + x**2), 'i': x / sp.sqrt(3 - 5 * x**2),
  'j': (x - 2) / sp.sqrt(x + 2), 'k': (x - 3) / sp.cbrt(x + 3), 'l': 3 * x**2 / (x**3 + 5)**sp.Rational(1, 7), 'm': L(x)**2 / x,
  'n': x * E(-x**2), 'o': E(x) / (2 * E(x) + 1), 'p': 7**(1 - x), 'q': 5**(2 * x + 3), 'r': (x + 5)**999 },
 'Z3': {
  'a': L(x), 'b': L(x)**2, 'c': sp.sqrt(x) * L(x), 'd': x**2 * L(x), 'e': x * L(x)**2, 'f': L(x)**2 / x**5,
  'g': L(x)**2 / x**sp.Rational(3, 2), 'h': L(x**3), 'i': x**4 * (1 + x)**3, 'j': x**2 * L(2 * x), 'k': x * E(-3 * x),
  'l': (x + 3) * E(x), 'm': L(L(x)) / x, 'n': (x**2 + 1) * E(-2 * x), 'o': x * 4**x },
}

def prep(s):
    s = re.sub(r'\\[ms][FGHKN]\{[^{}]*\}', '', s)
    s = re.sub(r'\\c[FGHKR](?=\{)', '', s)
    s = s.replace(r'\left', '').replace(r'\right', '').replace(r'\tfrac', r'\frac').replace(r'\dfrac', r'\frac')
    s = s.replace(r'\,', ' ').replace(r'\ ', ' ').replace(r'\quad', ' ').replace(r'\qquad', ' ')
    s = re.sub(r'\\frac(\d)(\d)', r'\\frac{\1}{\2}', s)
    s = re.sub(r'\\frac(\d)\{', r'\\frac{\1}{', s)  # \frac1{x}
    s = re.sub(r'\\frac\{([^{}]*)\}(\d)', r'\\frac{\1}{\2}', s)
    s = re.sub(r'\\ln\^(\d) ?\(([^()]*)\)', r' \\cdot (\\ln(\2))^\1', s)
    s = re.sub(r'\\ln\^(\d) ?([0-9a-z]+)', r' \\cdot (\\ln(\2))^\1', s)
    s = re.sub(r'(^|[=({+\-]|\\int|\\frac\{) *\\cdot ', r'\1 ', s.strip())
    s = re.sub(r'\\ln ?(\d+x)', r'\\ln(\1)', s)
    s = re.sub(r'\\ln ?(\d+)', r'\\ln(\1)', s)
    s = re.sub(r'\\ln ?x', r'\\ln(x)', s)
    s = re.sub(r'\\ln ?t', r'\\ln(t)', s)
    s = s.replace(r'\ln|', r'\ln (|').replace('|', '|')
    s = re.sub(r'\\ln \(\|([^|]*)\|', r'\\ln(|\1|)', s)
    s = re.sub(r'(\d)\^', r'\1^', s)
    s = re.sub(r'x(\d)\^', r'x \\cdot \1^', s)   # x4^x
    s = s.replace(r'\cdot', ' * ')
    s = re.sub(r'\+ ?C\b', '', s)
    s = owin_calki(s)
    return s.strip()

def owin_calki(s):
    out, i = '', 0
    while True:
        j = s.find('\\int', i)
        if j < 0:
            return out + s[i:]
        m = re.compile(r'\bd([xt])\b').search(s, j)
        out += s[i:j] + '\\left(' + s[j:m.end()] + '\\right)'
        i = m.end()

def P(s):
    s = prep(s)
    if not s:
        return None
    try:
        e = parse_latex(s)
    except Exception:
        e = parse_latex(s, backend='lark')
    if not isinstance(e, sp.Basic):
        raise ValueError('niejednoznaczne')
    sub = {sp.Symbol('x'): x, sp.Symbol('t'): t, sp.Symbol('e'): sp.E, sp.Symbol('C'): 0}
    return e.subs(sub)

def czesci(tex):
    # podział łańcucha po '=' na najwyższym poziomie (poza klamrami)
    out, d, cur = [], 0, ''
    for ch in tex:
        if ch == '{': d += 1
        if ch == '}': d -= 1
        if ch == '=' and d == 0:
            out.append(cur); cur = ''
        else:
            cur += ch
    out.append(cur)
    return [c for c in (c.strip() for c in out) if c]

def zero(e, ref=1):
    try:
        for v in [sp.Rational(13, 10), sp.Rational(27, 10), 4]:
            a = complex(sp.N(e.subs(x, v), 40)); b = complex(sp.N(sp.sympify(ref).subs(x, v), 40))
            if abs(a) > 1e-20 * (1 + abs(b)):
                return False
        return True
    except Exception:
        e = sp.simplify(e)
        return e == 0

def calkuj(e):
    return e

bledy, ile = [], 0
dane = json.load(open(sys.argv[1]))
for Z, przyk in dane.items():
    for k, D in przyk.items():
        f = F[Z][k]
        pod = P(D['pod']) if D.get('pod') else None
        try:
            w = P(D['wynik']); ile += 1
            if not zero(sp.diff(w, x) - f, f):
                bledy.append(f'{Z} {k}: WYNIK zły: {D["wynik"]} -> {w}')
        except Exception as ex:
            bledy.append(f'{Z} {k}: WYNIK błąd {type(ex).__name__}: {D["wynik"]}')
        for n, li in enumerate(D['linie']):
            typ = li.get('typ')
            for kk in li.get('k', []) or []:
                if '\\Rightarrow' in kk:
                    continue  # przekształcenie ramki — sprawdzone ręcznie
                cz = [c for c in czesci(kk) if not re.fullmatch(r"[uvt]'?\(x\)", c.strip())]
                try:
                    vals = []
                    for c in cz:
                        m = re.fullmatch(r"\((.*)\)'", c.strip())
                        vals.append(sp.diff(P(m.group(1)), x) if m else P(c))
                    ile += 1
                    def rowne(a, b):
                        if a.has(sp.Integral) or b.has(sp.Integral):
                            return zero(sp.diff(a, x) - sp.diff(b, x), sp.diff(b, x))
                        return zero(a - b, b)
                    if any(not rowne(vals[0], v) for v in vals[1:]):
                        bledy.append(f'{Z} {k} linia {n + 1}: KARTKA {kk}')
                except Exception as ex:
                    bledy.append(f'{Z} {k} linia {n + 1}: nie parsuje kartki {kk!r}: {ex}')
            if typ not in ('x', 'g', 't'):
                continue
            cel = f
            try:
                pierwsza = P(czesci(li['t'])[0])
                if isinstance(pierwsza, sp.Integral) and typ == 'x':
                    cel = pierwsza.function
            except Exception:
                pass
            for c in czesci(li['t']):
                try:
                    v = P(c)
                except Exception as ex:
                    bledy.append(f'{Z} {k} linia {n + 1}: nie parsuje {c!r}: {ex}'); continue
                ile += 1
                try:
                  if typ == 'g':
                    ok = zero(v - cel, cel)
                  elif typ == 'x':
                    ok = zero(sp.diff(calkuj(v), x) - cel, cel)
                  else:
                    if v.has(x):
                        ok = zero(sp.diff(calkuj(v), x) - f, f)
                    else:
                        ok = zero(sp.diff(v.doit().subs(t, pod), x) - f, f)
                except Exception as ex:
                    ok = False; c = f'[{type(ex).__name__}] ' + c
                if not ok:
                    bledy.append(f'{Z} {k} linia {n + 1} ({typ}): {c}  =>  {v}')
print(f'sprawdzonych wyrażeń: {ile}')
print('\n'.join(bledy) if bledy else 'BEZ BŁĘDÓW')
