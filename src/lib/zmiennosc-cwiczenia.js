// Funkcje do ćwiczeń „wypełnij tabelę” w module 9 (spoza listy zadań). Ten sam budowniczy badanie() co zadania z listy:
// sam sprawdza znaki czynników z pochodną liczoną numerycznie, a wartości w punktach przelicza skrypt mat-check/t9.
// Uczeń dostaje wzór funkcji, pochodną w postaci iloczynu i nagłówek tabeli — wypełnia znaki, strzałki i wnioski.
import { badanie, lin } from './zmiennosc.js';
const R = String.raw;
const PUSTE = { linie: [], wstep: { e: 4, typ: 'x', t: '', o: '' } };

const M = {
  // dwa punkty stacjonarne, maksimum i minimum
  a: {
    f: R`f(x) = x^3 - 12x`, fn: (x) => x ** 3 - 12 * x, pochodna: R`f'(x) = 3x^2 - 12 = 3(x - 2)(x + 2)`,
    dz: {}, czynniki: [{ t: '3', f: () => 3 }, lin('x - 2', 1, -2), lin('x + 2', 1, 2)],
    zera: [{ x: -2, t: '-2' }, { x: 2, t: '2' }], probne: [{ x: -3, t: '-3' }, { x: 0, t: '0' }, { x: 3, t: '3' }],
    punkty: { '-2': { w: [R`(-2)^3 - 12 \cdot (-2)`, R`-8 + 24`, '16'] }, 2: { w: [R`2^3 - 12 \cdot 2`, R`8 - 24`, '-16'] } },
    okno: { x0: -4, x1: 4, y0: -20, y1: 20 },
  },
  // trzy punkty stacjonarne: min, max, min
  b: {
    f: R`f(x) = x^4 - 2x^2`, fn: (x) => x ** 4 - 2 * x * x, pochodna: R`f'(x) = 4x^3 - 4x = 4x(x - 1)(x + 1)`,
    dz: {}, czynniki: [lin('4x', 4, 0), lin('x - 1', 1, -1), lin('x + 1', 1, 1)],
    zera: [{ x: -1, t: '-1' }, { x: 0, t: '0' }, { x: 1, t: '1' }],
    probne: [{ x: -2, t: '-2' }, { x: -0.5, t: '-0{,}5' }, { x: 0.5, t: '0{,}5' }, { x: 2, t: '2' }],
    punkty: { '-1': { w: [R`(-1)^4 - 2 \cdot (-1)^2`, R`1 - 2`, '-1'] }, 0: { w: [R`0^4 - 2 \cdot 0^2`, '0'] }, 1: { w: [R`1^4 - 2 \cdot 1^2`, R`1 - 2`, '-1'] } },
    okno: { x0: -2, x1: 2, y0: -2, y1: 3 },
  },
  // dziura w dziedzinie między punktami stacjonarnymi
  c: {
    f: R`f(x) = x + \frac1x`, fn: (x) => x + 1 / x, pochodna: R`f'(x) = 1 - \frac{1}{x^2} = \frac{(x - 1)(x + 1)}{x^2}`,
    dz: { wykl: [{ x: 0, t: '0' }] }, czynniki: [lin('x - 1', 1, -1), lin('x + 1', 1, 1)],
    zera: [{ x: -1, t: '-1' }, { x: 1, t: '1' }],
    probne: [{ x: -2, t: '-2' }, { x: -0.5, t: '-0{,}5' }, { x: 0.5, t: '0{,}5' }, { x: 2, t: '2' }],
    punkty: { '-1': { w: [R`-1 + \frac{1}{-1}`, R`-1 - 1`, '-2'] }, 1: { w: [R`1 + \frac11`, '2'] } },
    okno: { x0: -4, x1: 4, y0: -6, y1: 6 },
  },
  // punkt stacjonarny bez zmiany znaku
  d: {
    f: R`f(x) = x^3 - 3x^2 + 3x`, fn: (x) => x ** 3 - 3 * x * x + 3 * x, pochodna: R`f'(x) = 3x^2 - 6x + 3 = 3(x - 1)^2`,
    dz: {}, czynniki: [{ t: '3', f: () => 3 }, { t: '(x - 1)^2', f: (x) => (x - 1) ** 2 }],
    zera: [{ x: 1, t: '1' }], probne: [{ x: 0, t: '0' }, { x: 2, t: '2' }],
    punkty: {},
    okno: { x0: -1, x1: 3, y0: -3, y1: 5 },
  },
};

const W = {
  // jeden punkt przegięcia
  a: {
    f: R`f(x) = x^3 - 6x^2`, fn: (x) => x ** 3 - 6 * x * x, pochodna: R`f''(x) = 6x - 12 = 6(x - 2)`,
    dz: {}, czynniki: [{ t: '6', f: () => 6 }, lin('x - 2', 1, -2)],
    zera: [{ x: 2, t: '2' }], probne: [{ x: 0, t: '0' }, { x: 3, t: '3' }],
    punkty: { 2: { w: [R`2^3 - 6 \cdot 2^2`, R`8 - 24`, '-16'] } },
    okno: { x0: -2, x1: 6, y0: -35, y1: 10 },
  },
  // dwa punkty przegięcia, wklęsła w środku
  b: {
    f: R`f(x) = x^4 - 6x^2`, fn: (x) => x ** 4 - 6 * x * x, pochodna: R`f''(x) = 12x^2 - 12 = 12(x - 1)(x + 1)`,
    dz: {}, czynniki: [{ t: '12', f: () => 12 }, lin('x - 1', 1, -1), lin('x + 1', 1, 1)],
    zera: [{ x: -1, t: '-1' }, { x: 1, t: '1' }], probne: [{ x: -2, t: '-2' }, { x: 0, t: '0' }, { x: 2, t: '2' }],
    punkty: { '-1': { w: [R`(-1)^4 - 6 \cdot (-1)^2`, R`1 - 6`, '-5'] }, 1: { w: [R`1^4 - 6 \cdot 1^2`, R`1 - 6`, '-5'] } },
    okno: { x0: -3, x1: 3, y0: -10, y1: 6 },
  },
  // dwa zera f'': w jednym zmiana znaku (punkt przegięcia), w drugim nie
  c: {
    f: R`f(x) = 3x^5 - 5x^4`, fn: (x) => 3 * x ** 5 - 5 * x ** 4, pochodna: R`f''(x) = 60x^3 - 60x^2 = 60x^2(x - 1)`,
    dz: {}, czynniki: [{ t: '60', f: () => 60 }, { t: 'x^2', f: (x) => x * x }, lin('x - 1', 1, -1)],
    zera: [{ x: 0, t: '0' }, { x: 1, t: '1' }], probne: [{ x: -1, t: '-1' }, { x: 0.5, t: '0{,}5' }, { x: 2, t: '2' }],
    punkty: { 1: { w: [R`3 \cdot 1^5 - 5 \cdot 1^4`, R`3 - 5`, '-2'] } },
    okno: { x0: -1, x1: 2, y0: -3, y1: 2 },
  },
  // zmiana kształtu w dziurze dziedziny — to nie punkt przegięcia
  d: {
    f: R`f(x) = \frac1x`, fn: (x) => 1 / x, pochodna: R`f''(x) = \frac{2}{x^3}`,
    dz: { wykl: [{ x: 0, t: '0' }] }, czynniki: [{ t: '2', f: () => 2 }, { t: 'x^3', f: (x) => x ** 3 }],
    zera: [], probne: [{ x: -1, t: '-1' }, { x: 1, t: '1' }],
    punkty: {},
    okno: { x0: -4, x1: 4, y0: -4, y1: 4 },
  },
};

const zbuduj = (zb, rzad, pref) => Object.fromEntries(Object.entries(zb).map(([id, d]) => [id, { ...badanie({ ...PUSTE, ...d, id: `${pref}${id}`, rzad }), pochodna: d.pochodna }]));
export const CW_M = zbuduj(M, 1, 'cwM');
export const CW_W = zbuduj(W, 2, 'cwW');
export const DANE_CW = { M, W };

// Przykład do sekcji „Znak wyrażenia”: pochodna jakiejś funkcji w postaci iloczynu, f'(x) = (x − 1)(x + 2).
// Znak sprawdzany wprost z wyrażenia (znakFn), bo tu badamy samo wyrażenie, nie funkcję.
export const ZNAK_PRZYKLAD = badanie({
  ...PUSTE, id: 'znak', rzad: 1, f: R`f'(x) = (x - 1)(x + 2)`, fn: (x) => x, znakFn: (x) => (x - 1) * (x + 2), fx: R`f'(x)`,
  dz: {}, czynniki: [lin('x - 1', 1, -1), lin('x + 2', 1, 2)],
  zera: [{ x: -2, t: '-2' }, { x: 1, t: '1' }], probne: [{ x: -3, t: '-3' }, { x: 0, t: '0' }, { x: 2, t: '2' }],
  punkty: {}, okno: { x0: -4, x1: 3, y0: -3, y1: 5 },
});
