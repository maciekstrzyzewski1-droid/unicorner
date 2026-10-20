# Niezależne sprawdzenie odpowiedzi w ćwiczeniach i quizie modułu 12: dobra odpowiedź ma pochodną = funkcja,
# złe odpowiedzi — nie (żeby „typowy błąd” naprawdę był błędem).
import sympy as sp
x = sp.symbols('x', positive=True)
L, E = sp.log, sp.exp
def ok(F, f): return sp.simplify(sp.diff(F, x) - f) == 0
T = [  # (opis, funkcja, dobra, [złe])
 ('pierwotna 3x^2', 3*x**2, x**3 + 7, [6*x, x**3/3]),
 ('x^5', x**5, x**6/6, [5*x**4, x**6]),
 ('x^7', x**7, x**8/8, [7*x**6, x**8]),
 ('1/x^3', x**-3, -1/(2*x**2), [L(x**3), -1/(4*x**4)]),
 ('sqrt x', sp.sqrt(x), sp.Rational(2,3)*x*sp.sqrt(x), [1/(2*sp.sqrt(x)), sp.Rational(3,2)*x**sp.Rational(3,2)]),
 ('6x^2-4x+3', 6*x**2-4*x+3, 2*x**3-2*x**2+3*x, [2*x**3-2*x**2+3, 12*x-4]),
 ('2^x', 2**x, 2**x/L(2), [2**x*L(2), x*2**(x-1)]),
 ('5/x', 5/x, 5*L(x), [-5/x**2, L(5*x)]),
 ('(3x-1)^5', (3*x-1)**5, (3*x-1)**6/18, [(3*x-1)**6/6, 15*(3*x-1)**4]),
 ('e^5x', E(5*x), E(5*x)/5, [5*E(5*x), E(5*x)]),
 ('2x/(x^2+1)', 2*x/(x**2+1), L(x**2+1), [2*L(x**2+1), x**2/(x**3/3+x)]),
 ('x e^x', x*E(x), x*E(x)-E(x), [x*E(x)+E(x), x**2/2*E(x)]),
 ('ln x', L(x), x*L(x)-x, [1/x, x*L(x)]),
 ('x e^{x^2}', x*E(x**2), E(x**2)/2, []),
 ('1/(2x+1)', 1/(2*x+1), L(2*x+1)/2, [L(2*x+1), 1/(2*x+1)**2]),
 ('3x^2(x^3+2)^4', 3*x**2*(x**3+2)**4, (x**3+2)**5/5, []),
 ('x (dwie osoby)', x, x**2/2 + 3, []),
 ('ln x / x (klasyfikator)', L(x)/x, L(x)**2/2, []),
 ('x(x^2+1)^5 (t)', x*(x**2+1)**5, (x**2+1)**6/12, []),
 ('(x^2+3)/x', (x**2+3)/x, x**2/2+3*L(x), []),
 ('x^2 e^x (2x części)', x**2*E(x), E(x)*(x**2-2*x+2), []),
 ('x ln x', x*L(x), x**2/2*L(x)-x**2/4, []),
 ('x^2 e^{x^3}', x**2*E(x**3), E(x**3)/3, []),
 ('e^{-3x} skrót', E(-3*x), -E(-3*x)/3, []),
 ('Rodzina x', x, x**2/2 - 2, []),
 ('koszt', 2*x+10, x**2+10*x+500, []),
 ('2d sprawdzenie', x/(x**2+1), L(x**2+1)/2, []),
 ('x^4 (intuicja)', x**4, x**5/5, []),
 ('x*e^x błędne (pułapka)', x*E(x), x**2/2*E(x), []),  # powinno NIE przejść
 ('zad 1f: (2x-1)^3', (2*x-1)**3, (2*x-1)**4/8, []),
 ('int x^-2', x**-2, -1/x, []),
]
zle = 0
for opis, f, F, bad in T:
    g = ok(F, f)
    if opis.startswith('x*e^x błędne'):
        print(('OK (błąd jest błędem)' if not g else 'ZŁE!'), opis); continue
    if not g: zle += 1; print('ZŁA DOBRA ODP:', opis)
    for b in bad:
        if ok(b, f): zle += 1; print('ZŁA OPCJA JEST DOBRA:', opis, b)
# różnica (2x-1)^4/8 i 2x^4-4x^3+3x^2-x = stała 1/8
print('stała 1f:', sp.simplify((2*x-1)**4/8 - (2*x**4-4*x**3+3*x**2-x)))
print('wzory: ∫x·x = x^3/3 vs (x^2/2)^2 =', sp.expand((x**2/2)**2))
# cwCalkiPotegi: a x^n -> a/(n+1) x^(n+1)
for a, n in [(1,6),(4,3),(1,-3),(6,-4),(1,sp.Rational(1,2)),(5,sp.Rational(2,3)),(1,sp.Rational(-1,2)),(2,sp.Rational(-1,3))]:
    F = sp.Rational(a)/(n+1) * x**(n+1); assert ok(F, a*x**n)
    print(f'∫{a}x^{n} = {sp.Rational(a)/(n+1)} x^{n+1}')
print('BŁĘDÓW:', zle)
