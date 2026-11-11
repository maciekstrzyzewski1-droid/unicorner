// Kontrola rachunków modułu „Dobór kwotowy” (src/pages/metody-badan-rynku/dobor-proby.mdx).
// Liczby z materiałów z zajęć są tu przepisane ręcznie (niezależnie od src/lib/kwoty.js) i porównywane z tym, co liczy lib.
// Użycie: node narzedzia/mat-check/badania-rynku/kwoty-check.mjs   (z katalogu repo; exit 1 przy pierwszej niezgodności)
import * as K from '../../../src/lib/kwoty.js';
import { alokuj } from '../../../src/lib/proba.js';

let bledy = 0;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const test = (nazwa, ok, info = '') => { if (!ok) bledy++; console.log(`${ok ? 'OK  ' : 'BŁĄD'} ${nazwa}${ok ? '' : ' → ' + info}`); };
const blisko = (a, b) => a.flat().every((x, i) => Math.abs(x - b.flat()[i]) < 1e-9);

// ——— 1. Arkusz „Metody doboru próby – przykład” (wartości przepisane z arkusza) ———
const A = K.ARKUSZ;
const ark = {
  pop: [[2345, 1693], [6986, 4298], [5935, 3368], [3212, 1949]],
  sumyK: [18478, 11308], N: 29786,
  pct: [[8, 6], [23, 14], [20, 11], [11, 7]], pctW: [14, 38, 31, 17], pctK: [62, 38],
  proba: [[80, 60], [230, 140], [200, 110], [110, 70]], probaW: [140, 370, 310, 180], probaK: [620, 380],
  wyj: [[0.8, 0.6], [2.3, 1.4], [2.0, 1.1], [1.1, 0.7]],
  // schemat razy liczba ankieterów — tabele „struktura próby dla schematu i liczby ankieterów” z arkusza
  razy: { A: [[50, 50], [100, 50], [100, 50], [50, 50]], B: [[0, 0], [60, 40], [40, 20], [20, 20]], C: [[20, 0], [40, 40], [40, 20], [40, 0]], D: [[10, 10], [30, 10], [20, 20], [0, 0]] },
  poA: [[30, 10], [130, 90], [100, 60], [60, 20]],
};
const N = K.suma(A.pop);
const pct = K.procentyPelne(A.pop);
const proba = K.probaZProcentow(pct, A.n);
const ank = K.ilu(A.n, A.naAnk);
test('arkusz: dane populacji', eq(A.pop, ark.pop));
test('arkusz: N i sumy kolumn', N === ark.N && eq(K.sumyK(A.pop), ark.sumyK), `${N} ${K.sumyK(A.pop)}`);
test('arkusz: suma wiersza 65+ z kratek = 5161 (w arkuszu wpisano 5162)', K.sumyW(A.pop)[3] === 5161 && A.sumyWArkuszu[3] === 5162);
test('arkusz: procenty kratek', eq(pct, ark.pct), JSON.stringify(pct));
test('arkusz: procenty Ogółem (wiersze, kolumny)', eq(K.sumyW(A.pop).map((x) => Math.round((100 * x) / N)), ark.pctW) && eq(K.sumyK(A.pop).map((x) => Math.round((100 * x) / N)), ark.pctK));
test('arkusz: procenty kratek dają 100', K.suma(pct) === 100);
test('arkusz: struktura próby', eq(proba, ark.proba) && eq(K.sumyW(proba), ark.probaW) && eq(K.sumyK(proba), ark.probaK) && K.suma(proba) === 1000, JSON.stringify(proba));
test('arkusz: 100 ankieterów', ank === 100);
test('arkusz: schemat wyjściowy', blisko(K.wyjsciowy(proba, ank), ark.wyj));
for (const s of A.schematy) test(`arkusz: schemat ${s.nazwa} razy ${s.ilu} ankieterów`, eq(K.mapuj(s.m, (x) => x * s.ilu), ark.razy[s.nazwa]));
const tA = K.sprawdz(proba, A.schematy, A.naAnk, ank);
test('arkusz: komplet A–D przechodzi trzy testy', tA.ok && tA.okSumy && tA.okAnk && tA.okProba);
test('arkusz: reszta po schemacie A', eq(K.reszta(proba, A.schematy[0]), ark.poA));
test('arkusz: jedna kartka z przepisu = schemat A', eq(K.przykladowy(proba, ank, A.naAnk), A.schematy[0].m));
const dA = K.dodatki(proba, ank, A.naAnk);
test('arkusz: części pewne 7, brakuje 3, potrzeby 80/60/30/40/0/10/10/70', K.suma(dA.pewna) === 7 && dA.brak === 3 && eq(dA.potrzeba, [[80, 60], [30, 40], [0, 10], [10, 70]]));
test('arkusz: liczby wpisane w tekście (23,45% + 14,43% = 37,88%; 78,73 → 79)', (100 * 6986 / N).toFixed(2) === '23.45' && (100 * 4298 / N).toFixed(2) === '14.43' && (100 * 11284 / N).toFixed(2) === '37.88' && K.probaDokladna(A.pop, A.n).wynik[0][0] === 79);
test('arkusz: jedna kartka dla wszystkich nie odtwarza próby', !K.sprawdz(proba, [{ ilu: 100, m: A.schematy[0].m }], 10, 100).okProba);

// ——— 2. Slajdy „Schemat doboru kwotowego” ———
const S = K.SLAJD;
const sPr = K.probaZProcentow(K.procentyPelne(S.pop), S.n);
test('slajdy: procenty', eq(K.procentyPelne(S.pop), [[20, 10, 20], [5, 25, 20]]));
test('slajdy: próba n = 100', eq(sPr, [[20, 10, 20], [5, 25, 20]]));
test('slajdy: kwoty na ankietera', blisko(K.wyjsciowy(sPr, 10), [[2, 1, 2], [0.5, 2.5, 2]]));
test('slajdy: schematy A i B (po 5 ankieterów) przechodzą trzy testy', K.sprawdz(sPr, S.schematy, 10, 10).ok);

// ——— 3. Dane wymyślone: każdy zestaw schematów z lib musi przejść trzy testy, a każda kratka ma część pewną albo +1 ———
for (const [nazwa, D] of Object.entries({ ARKUSZ: A, SLAJD: S, BIBLIOTEKA: K.BIBLIOTEKA, SKLEP: K.SKLEP })) {
  const p = K.procentyPelne(D.pop);
  const pr = K.probaZProcentow(p, D.n);
  const a = D.ankieterow ?? K.ilu(D.n, D.naAnk);
  const d = K.dodatki(pr, a, D.naAnk);
  const u = K.ulozSchematy(pr, a, D.naAnk);
  const t = K.sprawdz(pr, u, D.naAnk, a);
  const tylkoPlus1 = u.every((s) => s.m.flat().every((x, i) => x === d.pewna.flat()[i] || x === d.pewna.flat()[i] + 1));
  test(`${nazwa}: procenty dają 100, próba = n, n dzieli się na ankieterów`, K.suma(p) === 100 && K.suma(pr) === D.n && a * D.naAnk === D.n);
  test(`${nazwa}: ułożony komplet (${u.map((s) => s.nazwa + '×' + s.ilu).join(', ')}) przechodzi trzy testy`, t.ok && tylkoPlus1);
  test(`${nazwa}: suma potrzeb = ankieterzy · brak`, K.suma(d.potrzeba) === a * d.brak);
}
const B = K.BIBLIOTEKA;
test('biblioteka: N = 16 000, procenty 14/22/13/16/21/14, próba 56/88/52/64/84/56, 20 ankieterów', K.suma(B.pop) === 16000 && eq(K.procentyPelne(B.pop), [[14, 22, 13], [16, 21, 14]]) && eq(K.probaZProcentow(K.procentyPelne(B.pop), B.n), [[56, 88, 52], [64, 84, 56]]) && K.ilu(B.n, B.naAnk) === 20);
test('sklep: N = 5000, procenty 30/20/35/15, próba 60/40/70/30, wyjściowy 3/2/3,5/1,5', K.suma(K.SKLEP.pop) === 5000 && eq(K.procentyPelne(K.SKLEP.pop), [[30, 20], [35, 15]]) && blisko(K.wyjsciowy(K.probaZProcentow(K.procentyPelne(K.SKLEP.pop), 200), 20), [[3, 2], [3.5, 1.5]]));

// ——— 4. Liczby z ramek i ćwiczeń wpisane w tekście ———
const r3 = alokuj(200, [414, 334, 252]);
test('ramka: 414/334/252 → 41 + 33 + 25 = 99%; dokładnie 82,8; 66,8; 50,4 (bez remisu o miejsce); wynik 83 + 67 + 50', [414, 334, 252].map((x) => Math.round(x / 10)).reduce((a, b) => a + b) === 99 && eq(r3.dokladnie.map((x) => +x.toFixed(1)), [82.8, 66.8, 50.4]) && eq(r3.wynik, [83, 67, 50]), JSON.stringify(r3));
test('ćwiczenia: 1200 : 20 = 60; 572 : 10 → 58', K.ilu(1200, 20) === 60 && K.ilu(572, 10) === 58);
test('ćwiczenia: 5·2 + 5·3 = 25; 8·2 + 2·3 = 22; 2·2 + 8·3 = 28', 5 * 2 + 5 * 3 === 25 && 8 * 2 + 2 * 3 === 22 && 2 * 2 + 8 * 3 === 28);
test('sprawdź się: 2; 1,5; 2,5; 4 → kartki 2,2,2,4 i 2,1,3,4 mają 10, 2,2,3,4 ma 11, 2,1,2,4 ma 9', [2, 2, 2, 4].reduce((a, b) => a + b) === 10 && [2, 1, 3, 4].reduce((a, b) => a + b) === 10 && [2, 2, 3, 4].reduce((a, b) => a + b) === 11 && [2, 1, 2, 4].reduce((a, b) => a + b) === 9);

// ——— 5. Przepis z modułu (dwie liczby w punkcie 4) na losowych danych: zawsze dochodzi do kompletu, który przechodzi trzy testy ———
{
  let ziarno = 20261111;
  const los = (n) => { ziarno = (ziarno * 1103515245 + 12345) % 2147483648; return ziarno % n; };
  let zle = 0;
  const ILE = 5000;
  for (let t = 0; t < ILE; t++) {
    const ankieterow = 2 + los(39), naAnk = 5 + los(16), kratek = 2 + los(7);
    const proba = Array(kratek).fill(0);
    for (let i = 0; i < ankieterow * naAnk; i++) proba[los(kratek)]++;
    try {
      const u = K.ulozSchematy([proba], ankieterow, naAnk);
      if (!K.sprawdz([proba], u, naAnk, ankieterow).ok) zle++;
    } catch { zle++; }
  }
  test(`przepis na ${ILE} losowych próbach (2–40 ankieterów, 5–20 ankiet, 2–8 kratek)`, zle === 0, `nieudanych: ${zle}`);
}

console.log(bledy === 0 ? '\nWszystko się zgadza.' : `\nNiezgodności: ${bledy}`);
process.exit(bledy === 0 ? 0 : 1);
