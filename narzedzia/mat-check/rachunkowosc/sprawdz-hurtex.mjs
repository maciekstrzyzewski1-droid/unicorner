// Zad. 5.4, str. 66 (Hurtex): konta → zestawienie → bilans zamknięcia → analiza sumy i struktury.
// Oczekiwane liczby policzone ręcznie z treści zadania (niezależnie od lib/konta.js), potem porównane z biblioteką
// i z liczbami wpisanymi w tekst modułu (zestawienie.mdx) oraz z odpowiedziami ćwiczeń „Analiza zmian w bilansie”.
// Uruchom: node narzedzia/mat-check/rachunkowosc/sprawdz-hurtex.mjs
import fs from 'node:fs';
import { zestawienie, typOperacji } from '../../../src/lib/konta.js';
import { K54, O54 } from '../../../src/lib/konta-zadania.js';
let bledy = 0;
const ok = (w, opis) => { console.log(w ? 'ok  ' : 'BŁĄD', opis); if (!w) bledy++; };

// ręcznie: dług X = 9 000 − 1 000 = 8 000 (op. 4)
ok(O54.find((o) => o.nr === 4).kwota === 8000, 'operacja 4 = 9 000 − 1 000 = 8 000');
const OCZEK = { // [spWn, spMa, obWn, obMa, naWn, naMa, skWn, skMa]
  rb: [5000, 0, 0, 3000, 5000, 3000, 2000, 0],
  kasa: [0, 0, 2000, 0, 2000, 0, 2000, 0],
  tow: [0, 0, 9000, 0, 9000, 0, 9000, 0],
  kz: [0, 5000, 0, 0, 0, 5000, 0, 5000],
  dost: [0, 0, 9000, 9000, 9000, 9000, 0, 0],
  kred: [0, 0, 0, 8000, 0, 8000, 0, 8000],
};
const r = zestawienie(K54, O54, { okres: 'styczeń' });
for (const w of r.wiersze) {
  const got = ['sp', 'ob', 'na', 'sk'].flatMap((c) => [w.v[c].wn, w.v[c].ma]);
  ok(JSON.stringify(got) === JSON.stringify(OCZEK[w.konto.id]), `${w.konto.nazwa}: ${got.join(' ')}`);
}
const TYPY = { 1: 'AP+', 2: 'A', 3: 'AP-', 4: 'P' };
for (const o of O54) {
  const t = typOperacji(o, K54);
  ok(t === TYPY[o.nr], `typ operacji ${o.nr}: ${t}`);
}
// bilans zamknięcia i analiza (ręcznie)
const A = 9000 + 2000 + 2000, P = 5000 + 8000;
ok(A === 13000 && P === 13000, 'bilans zamknięcia 13 000 = 13 000');
ok(5000 + 9000 - 1000 === 13000, 'suma przez typy: 5 000 + 9 000 − 1 000');
ok(((13000 - 5000) / 5000) * 100 === 160, 'wzrost sumy 160%');
const pr = (x) => Math.round((x / 13000) * 1000) / 10;
ok(pr(9000) === 69.2 && pr(2000) === 15.4 && pr(5000) === 38.5 && pr(8000) === 61.5, 'struktura 69,2 / 15,4 / 15,4 / 38,5 / 61,5');
ok(Math.round((pr(9000) + 2 * pr(2000)) * 10) === 1000 && Math.round((pr(5000) + pr(8000)) * 10) === 1000, 'udziały sumują się do 100,0');
// liczby w tekście modułu
const src = fs.readFileSync(new URL('../../../src/pages/rachunkowosc/zestawienie.mdx', import.meta.url), 'utf8').replace(/ /g, ' ');
for (const frag of ['9 000 − 1 000 = **8 000**', '5 000 − 3 000 = **2 000**', '13 000 − 5 000 = **+8 000**', '8 000 ÷ 5 000 · 100% = **160%**', '5 000 + 9 000 (operacja 1, AP+) − 1 000 (operacja 3, AP−) = **13 000**', '| Towary | 0 | 0 | 9 000 | 69,2 |', '| Kredyt bankowy (obcy) | 0 | 0 | 8 000 | 61,5 |', '69,2 + 15,4 + 15,4 = 100,0', '38,5 + 61,5 = 100,0']) ok(src.includes(frag), `tekst: „${frag}”`);
// ćwiczenia „Analiza zmian w bilansie”: [fragment pytania, poprawna odpowiedź, niezależny rachunek]
const cw = [
  ['O ile procent wzrosła?', '25%', ((50000 - 40000) / 40000) * 100 === 25],
  ['udział towarów w sumie', '60%', (6000 / (6000 + 1500 + 2500)) * 100 === 60],
  ['P na 4 000. Ile wynosi suma bilansu zamknięcia?', '23 000', 20000 + 5000 - 2000 === 23000],
  ['udział kapitału obcego?', '80%', ((12000 + 4000) / (4000 + 12000 + 4000)) * 100 === 80],
  ['Co dzieje się z sumą bilansową?', 'Nie zmienia się', true],
  ['Który wniosek jest poprawny?', 'Większość majątku firma finansuje kapitałem obcym', 61.5 > 50],
];
const blok = [...src.matchAll(/\{ q: '([^']*)', opcje: \[([^\]]*)\], dobra: (\d)/g)];
for (const [frag, odp, rach] of cw) {
  const b = blok.find((x) => x[1].includes(frag));
  if (!b) { ok(false, `nie ma pytania „${frag}”`); continue; }
  const opcje = [...b[2].matchAll(/'([^']*)'/g)].map((m) => m[1]);
  ok(rach && opcje[Number(b[3])].startsWith(odp), `ćwiczenie „${frag}” → ${odp}`);
}
console.log(bledy ? `\n${bledy} błędów` : '\nWszystko się zgadza.');
process.exit(bledy ? 1 : 0);
