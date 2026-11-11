// Kontrola modułu „Inwestycje krótkoterminowe” (src/pages/rachunkowosc/inwestycje-krotkoterminowe.mdx, dane: src/lib/inwestycje-zadania.js).
// Oczekiwane liczby są tu policzone ręcznie z treści pięciu przykładów z konspektu (niezależnie od biblioteki).
// Konspekt nie zawiera rozwiązań; księgowania według schematu z wykładu.
// node narzedzia/mat-check/rachunkowosc/sprawdz-inwestycje.mjs
import { ksieguj } from '../../../src/lib/konta.js';
import * as I from '../../../src/lib/inwestycje-zadania.js';
let bledy = 0;
const ok = (w, opis) => { if (!w) { bledy++; console.log('BŁĄD:', opis); } else console.log('ok  ', opis); };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const zapisy = (O) => O.map((o) => [String(o.nr), o.kwota, o.wn, o.ma]);

// ——— Przykład 1 ———
const r1 = ksieguj(I.K1, I.O1);
ok(120 * 10 + 120 === 1320 && I.P1_NABYCIE === 1320 && 1320 / 120 === 11 && I.P1_ZA_AKCJE === 11, 'P1: cena nabycia 1 200 + 120 = 1 320, czyli 11 zł za akcję');
ok(eq(zapisy(I.O1), [['1a', 1200, 'kaf', 'rb'], ['1b', 120, 'kaf', 'rb'], ['2a', 1300, 'rb', 'pf'], ['2b', 1100, 'kf', 'kaf'], ['2c', 130, 'kf', 'rb']]), 'P1: pięć zapisów jak w schemacie z wykładu (2a = 100 · 13, 2b = 100 · 11)');
ok(r1.zam.kaf.saldo === 20 * 11 && r1.zam.rb.saldo === 8000 - 1200 - 120 + 1300 - 130, 'P1: zostaje 20 akcji · 11 = 220; rachunek 7 850');
ok(r1.zam.pf.saldo - r1.zam.kf.saldo === 1300 - 1100 - 130, 'P1: wynik na sprzedaży 70');

// ——— Przykład 2 (ostrożna wycena) ———
const r2 = ksieguj(I.K2, I.O2);
ok(Math.min(100 * 70, 100 * 95) === 7000 && Math.min(200 * 50, 200 * 45) === 9000, 'P2: Q zostaje 7 000 (rynkowo 9 500), S spada do 9 000');
ok(eq(zapisy(I.O2), [['1', 1000, 'kf', 'kaf']]) && r2.zam.kaf.saldo === 16000 && r2.zam.kf.saldo === 1000, 'P2: jeden zapis 1 000 w koszty finansowe; wartość bilansowa 16 000');

// ——— Przykład 4 (ceny rynkowe) ———
const r4 = ksieguj(I.K4, I.O4);
ok(eq(zapisy(I.O4), [['1', 5000, 'kf', 'kaf'], ['2', 30000, 'kaf', 'pf']]), 'P4: M 40 000 → 35 000 (koszt 5 000), K 120 000 → 150 000 (przychód 30 000)');
ok(r4.zam.kaf.saldo === 500 * 70 + 1000 * 150 && r4.zam.pf.saldo - r4.zam.kf.saldo === 25000, 'P4: wartość bilansowa 185 000; wynik +25 000');

// ——— Przykłady 3 i 5 (akcje H) ———
ok(eq(I.W3.map((w) => [w.przed, w.rynkowa, w.bilansowa, w.konto, w.kwota]), [[5000, 7000, 5000, null, 0], [5000, 3000, 3000, 'kf', 2000], [3000, 6500, 5000, 'pf', 2000]]), 'P3: 5 000 (brak zapisu) → 3 000 (koszt 2 000) → 5 000 (przychód 2 000, nie więcej niż cena nabycia)');
ok(eq(I.W5.map((w) => [w.przed, w.rynkowa, w.bilansowa, w.konto, w.kwota]), [[5000, 7000, 7000, 'pf', 2000], [7000, 3000, 3000, 'kf', 4000], [3000, 6500, 6500, 'pf', 3500]]), 'P5: 7 000 (przychód 2 000) → 3 000 (koszt 4 000) → 6 500 (przychód 3 500)');
const r3 = ksieguj(I.K3, I.O3), r5 = ksieguj(I.K5, I.O5);
ok(r3.zam.kaf.saldo === 5000 && r5.zam.kaf.saldo === 6500 && r3.zam.rb.saldo === 5000 && r5.zam.rb.saldo === 5000, 'P3 i P5: salda konta akcji 5 000 i 6 500; wycena nie rusza rachunku');
ok(I.lacznie(I.W3) === 0 && I.lacznie(I.W5) === 1500 && 6500 - 5000 === 1500, 'porównanie: wyceny za rok 0 i +1 500; ze sprzedażą po 6 500 obie zasady dają 1 500');

ok(eq(I.W3B.map((w) => [w.bilansowa, w.konto, w.kwota]), [[5000, null, 0], [3000, 'kf', 2000], [4000, 'pf', 1000]]) && I.CZ.kwota === 5700 - 5200, 'częściowe cofnięcie przeceny: wariant 40 zł → 4 000 (przychód 1 000); ćwiczenie 5 200 → 5 700 (przychód 500)');

// ——— Własność ogólna funkcji wycena(): 20 000 losowych ścieżek cen ———
let los = 12345; const rnd = () => (los = (los * 1103515245 + 12345) % 2147483648) / 2147483648;
let zle = 0;
for (let i = 0; i < 20000; i++) {
  const nab = 100 * (1 + Math.floor(rnd() * 90)), ceny = Array.from({ length: 1 + Math.floor(rnd() * 6) }, () => 100 * Math.floor(rnd() * 120));
  const o = I.wycena('ostrozna', nab, ceny), r = I.wycena('rynkowa', nab, ceny);
  let ko = nab, kr = nab;
  for (let j = 0; j < ceny.length; j++) {
    ko += o[j].roznica; kr += r[j].roznica;
    if (o[j].bilansowa !== Math.min(nab, ceny[j]) || ko !== o[j].bilansowa || o[j].bilansowa > nab) zle++;
    if (r[j].bilansowa !== ceny[j] || kr !== ceny[j]) zle++;
    for (const w of [o[j], r[j]]) if ((w.roznica > 0) !== (w.konto === 'pf') || (w.roznica < 0) !== (w.konto === 'kf') || w.kwota !== Math.abs(w.roznica)) zle++;
  }
}
ok(zle === 0, 'wycena(): saldo konta po każdym zapisie = kwota do bilansu; ostrożna nigdy ponad cenę nabycia (20 000 losowych ścieżek)');

// ——— Ćwiczenia ———
ok(200 * 25 + 100 === 5100 && I.C1_NABYCIE === 5100 && I.C1_ZA_AKCJE === 25.5 && eq(I.OC.map((o) => o.kwota), [5000, 100, 150 * 30, 150 * 25.5, 90, 200, 350]), 'ćwiczenie: 5 000, 100, 4 500, 3 825, 90, 200, 350');
ok(eq(I.CW_OSTR.map((w) => [w.bilansowa, w.konto, w.kwota]), [[6000, null, 0], [5200, 'kf', 800], [6000, 'pf', 800]]) && eq(I.CW_RYN.map((w) => [w.bilansowa, w.konto, w.kwota]), [[6800, 'pf', 800], [5200, 'kf', 1600], [6300, 'pf', 1100]]), 'ćwiczenia z wyceny: ostrożna 0 / −800 / +800; rynkowe +800 / −1 600 / +1 100');
for (const [n, K, O] of [['P1', I.K1, I.O1], ['P2', I.K2, I.O2], ['P3', I.K3, I.O3], ['P4', I.K4, I.O4], ['P5', I.K5, I.O5], ['Ćw.', I.KC, I.OC]]) {
  const ids = new Set(K.map((k) => k.id));
  ok(O.every((o) => ids.has(o.wn) && ids.has(o.ma) && o.wn !== o.ma && o.kwota > 0), `${n}: każda operacja ma dwa różne, istniejące konta i dodatnią kwotę`);
}
console.log(bledy ? `\n${bledy} błędów` : '\nWszystko się zgadza.');
process.exit(bledy ? 1 : 0);
