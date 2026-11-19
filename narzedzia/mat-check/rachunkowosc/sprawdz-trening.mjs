// Moduł 5, sekcja „Trening: trzy zadania z pułapkami”: księgowanie trzech zadań (lib/konta-zadania.js: KT1–KT3, OT1–OT3),
// typy operacji, salda (oczekiwane liczby z treści zadań, policzone ręcznie) i te same liczby w tabelach w wynik-finansowy.mdx.
// Do tego odpowiedzi ćwiczeń „Pułapki na kontach”.
// Uruchom: node narzedzia/mat-check/rachunkowosc/sprawdz-trening.mjs
import fs from 'node:fs';
import { ksieguj, typOperacji, opisOperacji } from '../../../src/lib/konta.js';
import { KT1, OT1, KT2, OT2, KT3, OT3 } from '../../../src/lib/konta-zadania.js';
let bledy = 0;
const ok = (w, opis) => { console.log(w ? 'ok  ' : 'BŁĄD', opis); if (!w) bledy++; };

const ZAD = [
  { K: KT1, O: OT1, typy: ['AP+', 'AP-', 'AP-', 'W', 'AP-'], suma: 24800,
    salda: { rb: ['wn', 31100, 40000, 8900], tow: ['wn', 25500, 27000, 1500], dost: ['ma', 14000, 10400, 24400], uo: ['wn', 2400, 2400, 0] } },
  { K: KT2, O: OT2, typy: ['W', 'AP-', 'A', 'W', 'AP-'], suma: 25800,
    salda: { rb: ['wn', 40000, 60000, 20000], tow: ['wn', 31000, 31000, 0], kred: ['ma', 20000, 5000, 25000], dost: ['ma', 1800, 8000, 9800], ppo: ['ma', 4000, 0, 4000], zme: ['wn', 1800, 1800, 0] } },
  { K: KT3, O: OT3, typy: ['AP+', 'AP-', 'AP-', 'W', 'W', 'AP-'], suma: 29700,
    salda: { rb: ['wn', 37000, 50000, 13000], tow: ['wn', 40800, 42000, 1200], dost: ['ma', 17300, 10200, 27500], kred: ['ma', 16000, 4000, 20000], uo: ['wn', 3500, 3500, 0], ppo: ['ma', 2000, 0, 2000] } },
];
ZAD.forEach(({ K, O, typy, suma, salda }, i) => {
  const r = ksieguj(K, O);
  ok(O.map((o) => typOperacji(o, K)).join(' ') === typy.join(' '), `zadanie ${i + 1}: typy ${typy.join(' ')}`);
  ok(O.reduce((a, o) => a + o.kwota, 0) === suma, `zadanie ${i + 1}: suma operacji ${suma}`);
  for (const [id, [s, saldo, wn, ma]] of Object.entries(salda)) {
    const z = r.zam[id];
    ok(z.saldoStrona === s && z.saldo === saldo && z.obrWn === wn && z.obrMa === ma, `zadanie ${i + 1}: ${id} Wn ${wn}, Ma ${ma}, saldo ${s} ${saldo}`);
  }
  // podpisy: każda operacja ma powód „co się stało” po obu stronach i słowo o stronie stanu albo o kapitale
  for (const o of O) {
    const h = opisOperacji(o, K);
    ok(h.includes(o.co.wn) && h.includes(o.co.ma), `zadanie ${i + 1}, op. ${o.nr}: podpis zawiera powody z danych`);
  }
});
// liczby w tabelach modułu
const src = fs.readFileSync(new URL('../../../src/pages/rachunkowosc/wynik-finansowy.mdx', import.meta.url), 'utf8').replace(/ /g, ' ');
const wiersze = [
  '| Rachunek bankowy | 40 000 | 8 900 | Wn 31 100 |', '| Towary | 27 000 | 1 500 | Wn 25 500 |', '| Rozrachunki z dostawcami | 10 400 | 24 400 | Ma 14 000 |', '| Usługi obce | 2 400 | 0 | Wn 2 400 |',
  '| Rachunek bankowy | 60 000 | 20 000 | Wn 40 000 |', '| Towary | 31 000 | 0 | Wn 31 000 |', '| Kredyty bankowe | 5 000 | 25 000 | Ma 20 000 |', '| Rozrachunki z dostawcami | 8 000 | 9 800 | Ma 1 800 |', '| Pozostałe przychody operacyjne | 0 | 4 000 | Ma 4 000 |', '| Zużycie materiałów i energii | 1 800 | 0 | Wn 1 800 |',
  '| Rachunek bankowy | 50 000 | 13 000 | Wn 37 000 |', '| Towary | 42 000 | 1 200 | Wn 40 800 |', '| Rozrachunki z dostawcami | 10 200 | 27 500 | Ma 17 300 |', '| Kredyty bankowe | 4 000 | 20 000 | Ma 16 000 |', '| Usługi obce | 3 500 | 0 | Wn 3 500 |', '| Pozostałe przychody operacyjne | 0 | 2 000 | Ma 2 000 |',
  '6 500 + 2 400 = 8 900', '40 000 − 8 900 = 31 100', '27 000 − 1 500 = 25 500', '10 000 + 12 000 + 2 400 = 24 400', '6 500 + 1 500 + 2 400 = 10 400', '24 400 − 10 400 = 14 000',
  '12 000 + 6 500 + 1 500 + 2 400 + 2 400 = 24 800', '5 000 + 7 000 + 8 000 = 20 000', '20 000 + 4 000 + 7 000 = 31 000', '9 800 − 8 000 = 1 800', '4 000 + 5 000 + 7 000 + 1 800 + 8 000 = 25 800',
  '10 000 + 1 200 + 9 000 + 3 500 + 2 000 + 4 000 = 29 700', '50 000 + 30 000 = 80 000', '14 000 + 20 000 = 34 000', '80 000 − 34 000 = 46 000',
];
for (const w of wiersze) ok(src.includes(w), `tekst: „${w}”`);
// ćwiczenia „Pułapki na kontach”: poprawna opcja (fragment) i niezależny rachunek
const cw = [
  ['4 200 zł zaległej faktury', 'Rachunek to konto aktywne', true],
  ['za darmo towar wart 2 500', 'Nikt nie zapłacił', true],
  ['towar za 10 000 zł z zapłatą później', 'Towary Wn 10 000 i dług Ma 10 000', true],
  ['obniżył cenę o 1 800', 'Dług Wn 1 800, towary Ma 1 800', true],
  ['usługę księgową 1 500', 'Wn „Usługi obce” 1 500, Ma „Rozrachunki z dostawcami” 1 500', true],
  ['towary 15 000, rozrachunki z dostawcami 6 400', 'Towary Sp. Wn 15 000, dostawcy Sp. Ma 6 400', true],
  ['Sp. 9 000 po Ma, nowa faktura 3 000', '7 000 — saldo Ma', 9000 + 3000 - 5000 === 7000],
  ['próbki towarów warte 1 200', 'Towary Wn 1 200, pozostałe przychody operacyjne Ma 1 200', true],
  ['ratę kredytu 2 000', 'Kredyty Wn 2 000, rachunek Ma 2 000', true],
  ['błędu technicznego', 'Czy suma wszystkich zapisów po Wn', true],
];
const blok = [...src.matchAll(/\{ q: '([^']*)', opcje: \[([^\]]*)\], dobra: (\d)/g)];
const dobre = [];
for (const [frag, odp, rach] of cw) {
  const b = blok.find((x) => x[1].includes(frag));
  if (!b) { ok(false, `nie ma pytania „${frag}”`); continue; }
  const opcje = [...b[2].matchAll(/'([^']*)'/g)].map((m) => m[1]);
  dobre.push(Number(b[3]));
  ok(rach && opcje[Number(b[3])].startsWith(odp), `ćwiczenie „${frag}” → ${odp}`);
}
console.log('rozkład dobrych odpowiedzi w ćwiczeniu:', [0, 1, 2, 3].map((k) => `${k}:${dobre.filter((d) => d === k).length}`).join(' '));
console.log(bledy ? `\n${bledy} błędów` : '\nWszystko się zgadza.');
process.exit(bledy ? 1 : 0);
