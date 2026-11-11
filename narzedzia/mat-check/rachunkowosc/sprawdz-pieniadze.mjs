// Kontrola modułu „Środki pieniężne” (src/pages/rachunkowosc/srodki-pieniezne.mdx, dane: src/lib/pieniadze-zadania.js).
// Oczekiwane liczby są tu wpisane ręcznie z treści przykładów z konspektu (niezależnie od biblioteki).
// node narzedzia/mat-check/rachunkowosc/sprawdz-pieniadze.mjs
import { ksieguj } from '../../../src/lib/konta.js';
import * as P from '../../../src/lib/pieniadze-zadania.js';
let bledy = 0;
const ok = (w, opis) => { if (!w) { bledy++; console.log('BŁĄD:', opis); } else console.log('ok  ', opis); };
const suma = (ops, strona, id) => ops.filter((o) => o[strona] === id).reduce((a, o) => a + o.kwota, 0);
const obroty = (ops, id) => [suma(ops, 'wn', id), suma(ops, 'ma', id)];
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ——— Przykład 3 (2.7, str. 40): kwoty z treści zadania ———
const r3 = ksieguj(P.K3, P.O3);
ok(eq(obroty(P.O3, 'odb'), [1230, 1230]), 'P3: faktura 1 000 + 230 = 1 230 na odbiorcę, spłacona wekslem w całości');
ok(suma(P.O3, 'wn', 'wo') === 1400 && suma(P.O3, 'ma', 'wo') === 5000 + 1400, 'P3: weksel przyjęty w sumie 1 400; zeszły weksle 5 000 (dyskonto) i 1 400 (indos)');
ok(suma(P.O3, 'ma', 'pf') === 170 && 1230 + 170 === 1400, 'P3: dyskonto pobrane przez przedsiębiorstwo 170 = 1 400 − 1 230');
ok(eq(obroty(P.O3, 'spd'), [14000, 14000]) && r3.zam.spd.saldo === 0, 'P3: środki pieniężne w drodze 14 000 / 14 000, saldo 0');
ok(4700 + 300 === 5000 && suma(P.O3, 'wn', 'kf') === 300 + 210, 'P3: bank 4 700 + 300 = 5 000; koszty finansowe 300 + 210');
ok(1190 + 210 === 1400 && r3.zam.dost.saldo === 11190 - 1190, 'P3: indos 1 190 + 210 = 1 400; dostawcy 11 190 − 1 190 = 10 000');
ok(suma(P.O3, 'ma', 'kasa') === 2000 + 615 && 500 + 115 === 615 && r3.zam.kasa.saldo === 4000 - 2615, 'P3: z kasy 2 000 + 615; saldo 1 385');
ok(r3.zam.rb.saldo === 20000 + 2000 + 7000 + 4700 - 10000, 'P3: rachunek bieżący 23 700');
ok(r3.zam.zw.saldo === 15000 - 10000 && r3.zam.co.saldo === 10000 - 7000 && r3.zam.wo.saldo === 6000 + 1400 - 5000 - 1400, 'P3: zobowiązania wekslowe 5 000, czeki obce 3 000, weksle obce 1 000');
ok(r3.zam.vat.saldo === 230 - 115 && r3.zam.vat.saldoStrona === 'ma', 'P3: VAT 230 należny − 115 naliczony = 115 po Ma');
ok(Math.round(1000 * 0.23) === 230 && Math.round(500 * 0.23) === 115, 'P3: VAT 23% od 1 000 i od 500');

// ——— Przykład 2 z konspektu ———
const r2 = ksieguj(P.K2, P.O2);
ok(eq(obroty(P.O2, 'spd'), [11000, 11000]), 'P2: w drodze 6 000 + 5 000 = 5 850 + 150 + 5 000');
ok(5850 + 150 === 6000 && 1800 + 200 === 2000, 'P2: dyskonto banku 150, dyskonto przy indosie 200');
ok(r2.zam.wo.saldo === 8000 - 6000 - 2000 && r2.zam.co.saldo === 0 && r2.zam.dost.saldo === 0, 'P2: weksle 0, czeki 0, dostawcy 0');
ok(r2.zam.rb.saldo === 9000 + 5850 + 5000 && r2.zam.kf.saldo === 350, 'P2: rachunek 19 850, koszty finansowe 350');

// ——— Przykład 1: akredytywa ———
const ra = ksieguj(P.KA, P.OA);
ok(1500 + 345 === 1845 && 2000 - 1845 === 155, 'akredytywa: faktura 1 500 + 345 = 1 845; reszta 155 (na slajdzie przy rachunku błędnie 500)');
ok(eq(obroty(P.OA, 'akr'), [2000, 2000]) && ra.zam.rb.saldo === 10000 - 2000 + 155, 'akredytywa: konto zamknięte 2 000 / 2 000; rachunek 8 155');

// ——— Każda operacja: istniejące konta, kwota po Wn = kwota po Ma (z konstrukcji), sumy obrotów Wn = Ma ———
for (const [n, K, O] of [['P1', P.KA, P.OA], ['P2', P.K2, P.O2], ['P3', P.K3, P.O3], ['Ćw. 1', P.KC1, P.OC1], ['Ćw. 2', P.KC2, P.OC2]]) {
  const ids = new Set(K.map((k) => k.id));
  ok(O.every((o) => ids.has(o.wn) && ids.has(o.ma) && o.wn !== o.ma && o.kwota > 0), `${n}: konta i kwoty operacji poprawne`);
  ok(new Set(O.map((o) => String(o.nr))).size === O.length, `${n}: numery operacji bez powtórzeń`);
}
// ćwiczenie 2: weksel obcy 9 910 + 90 = 10 000 schodzi w całości (9 800 + 200); weksel własny 4 900 + 100 = 5 000 wykupiony
ok(suma(P.OC2, 'wn', 'wo') === 10000 && suma(P.OC2, 'ma', 'wo') === 10000 && suma(P.OC2, 'ma', 'zw') === 5000 && suma(P.OC2, 'wn', 'zw') === 5000, 'Ćw. 2: weksle wchodzą i schodzą w sumie wekslowej');
ok(eq(obroty(P.OC2, 'co'), [3000, 3000]) && eq(obroty(P.OC2, 'spd'), [3000, 3000]) && eq(obroty(P.OC1, 'spd'), [1500, 1500]), 'Ćw. 1 i 2: czek i gotówka „w drodze” wychodzą na zero');

// ——— Schematy z konspektu: Kasa po Wn w 1, 4, 6, 9; Rachunek po Wn w 1, 4, 5 ———
ok(eq(P.SCHEMAT_KASA.filter((o) => o.wn === 'Kasa').map((o) => o.nr), [1, 4, 6, 9]) && P.SCHEMAT_KASA.every((o) => (o.wn === 'Kasa') !== (o.ma === 'Kasa')), 'schemat Kasa: 9 operacji, Kasa po Wn w 1, 4, 6, 9');
ok(eq(P.SCHEMAT_RB.filter((o) => o.wn === 'Rachunek bieżący').map((o) => o.nr), [1, 4, 5]) && P.SCHEMAT_RB.every((o) => (o.wn === 'Rachunek bieżący') !== (o.ma === 'Rachunek bieżący')), 'schemat Rachunek bieżący: 7 operacji, rachunek po Wn w 1, 4, 5');

// ——— Wzory ———
const blisko = (a, b) => Math.abs(a - b) < 1e-6;
ok(blisko(7.3 * 100 / 365, 2) && blisko(P.sumaWekslowa(4900, 7.3, 100), 5000) && blisko(P.odsetkiDyskontowe(5000, 7.3, 100), 100), 'wzory: 4 900 zł, 7,3%, 100 dni → Sw 5 000, Od 100');
ok(blisko(10.95 * 30 / 365, 0.9) && blisko(P.sumaWekslowa(9910, 10.95, 30), 10000) && blisko(P.odsetkiDyskontowe(10000, 10.95, 30), 90), 'wzory: 9 910 zł, 10,95%, 30 dni → Sw 10 000, Od 90');
ok((9910 * 10.95 * 30 / 36500).toFixed(2) === '89.19' && blisko(10000 * 10.95 * 30 / 3650, 900) && blisko(490000 / 98, 5000) && blisko(3650000 / 36500, 100) && blisko(991000 / 99.1, 10000) && blisko(3285000 / 36500, 90), 'wzory: liczby pośrednie i błędne odpowiedzi z ćwiczeń (89,19; 900)');
ok((9910 * 1.009).toFixed(2) === '9999.19', 'ćwiczenia: błędna odpowiedź 9 999,19 = 9 910 · 1,009');
// wariant „jak na slajdzie” (dyskonto jednym zapisem, bez konta w drodze) daje te same salda co wariant z modułu
{
  const o2 = [...P.O2.filter((o) => !['1.1', '2a.1', '2a.2'].includes(o.nr)), { nr: 'x1', kwota: 5850, wn: 'rb', ma: 'wo' }, { nr: 'x2', kwota: 150, wn: 'kf', ma: 'wo' }];
  const a = ksieguj(P.K2, P.O2).zam, b = ksieguj(P.K2, o2).zam;
  ok(P.K2.every((k) => a[k.id].saldo === b[k.id].saldo && a[k.id].saldoStrona === b[k.id].saldoStrona), 'P2: wariant jednozapisowy z wykładu daje te same salda końcowe');
}
for (const [nf, d, t] of [[1230, 12, 45], [50000, 9.5, 91], [777, 20, 10]]) { const sw = P.sumaWekslowa(nf, d, t); ok(blisko(sw - P.odsetkiDyskontowe(sw, d, t), nf), `wzory: Sw − Od = Nf dla ${nf}, ${d}%, ${t} dni`); }

console.log(bledy === 0 ? '\nWszystko się zgadza.' : `\nNiezgodności: ${bledy}`);
process.exit(bledy === 0 ? 0 : 1);
