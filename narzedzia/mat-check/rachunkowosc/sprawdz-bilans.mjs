// Moduł „Bilans”: lib/bilans.js na zadaniach z zajęć (oczekiwane kwoty przepisane z rozwiązań w parach, niezależnie od biblioteki)
// oraz odpowiedzi w ćwiczeniach i quizach (tablice `pytania={[…]}` wyciągnięte z MDX i porównane z rachunkiem).
// node narzedzia/mat-check/rachunkowosc/sprawdz-bilans.mjs
import fs from 'node:fs';
import { uzupelnij } from '../../../src/lib/bilans.js';
let bledy = 0;
const ok = (w, opis) => { console.log(w ? 'ok  ' : 'BŁĄD', opis); if (!w) bledy++; };
const src = fs.readFileSync(new URL('../../../src/pages/rachunkowosc/bilans.mdx', import.meta.url), 'utf8');
const wyciagnij = (nazwa) => { const m = src.match(new RegExp(`export const ${nazwa} = (\\[[\\s\\S]*?\\n\\]);`)); return eval(m[1]); };
const Z216 = wyciagnij('Z216'), Z217 = wyciagnij('Z217'), DOD = wyciagnij('DOD'), Z215 = wyciagnij('Z215'), DOD4 = wyciagnij('DOD4');
let r = uzupelnij(Z216, { reszta: 'PA6' });
ok(r.sekcje.AA === 1097000 && r.sekcje.AB === 316100 && r.sumaA === 1413100, '2.16 aktywa 1 097 000 + 316 100 = 1 413 100');
ok(r.poz.AA1.suma === 145000 && r.poz.AA2.suma === 886000 && r.poz.AA4.suma === 66000, '2.16 A.I 145 000, A.II 886 000, A.IV 66 000');
ok(r.poz.AB1.suma === 41700 && r.poz.AB2.suma === 230900 && r.poz.AB3.suma === 43500, '2.16 B.I 41 700, B.II 230 900, B.III 43 500');
ok(r.sekcje.PB === 259000 && r.KW === 1154100 && r.poz.PA6.suma === -457900, '2.16 B 259 000, KW 1 154 100, wynik −457 900');
r = uzupelnij(Z217, { procenty: [{ poz: 'PA1', procent: 31.39 }], reszta: 'PA6' });
ok(r.sumaA === 2650700 && r.sekcje.AA === 2521000 && r.sekcje.AB === 129700, '2.17 aktywa 2 521 000 + 129 700 = 2 650 700');
ok(r.poz.AA1.suma === 50000 && r.poz.AA2.suma === 2379000 && r.poz.AB1.suma === 11700 && r.poz.AB2.suma === 61000 && r.poz.AB3.suma === 57000, '2.17 pozycje');
ok(r.sekcje.PB === 90000 && r.KW === 2560700 && r.poz.PA1.suma === 803804 && r.poz.PA6.suma === 1006896, '2.17 KW 2 560 700, KP 803 804, zysk 1 006 896');
ok(r.poza.length === 1 && r.poza[0].kwota === 1500000, '2.17 leasing poza bilansem');
// zadanie dodatkowe: pełna lista z rozwiązania w parach (26 pozycji); w ćwiczeniu jest wybór 14 — każdy musi mieć tę samą pozycję co w rozwiązaniu
const pelna = { 'tkanina do szycia odzieży': 'AB1', 'budynek magazynowy': 'AA2', 'rakiety do tenisa ziemnego': 'AB1', 'pasmanteria w magazynie (nici, guziki, suwaki)': 'AB1', 'udziały w innej spółce kupione na dłużej niż rok': 'AA4', 'stoły do ping-ponga': 'AB1', 'grunt zabudowany (magazyn, szwalnia, administracja)': 'AA2', 'zaległe wynagrodzenia pracowników': 'PB3', 'rezerwy na odprawy emerytalne': 'PB1', 'lokata bankowa 3-miesięczna': 'AB3', 'stoły szwalnicze w trakcie montażu': 'AA2', 'obligacje Skarbu Państwa z wykupem za 8 miesięcy': 'AB3', 'licencje na oprogramowanie': 'AA1', 'faktury za energię elektryczną i gaz do zapłaty': 'PB3' };
ok(DOD.every((d) => pelna[d.nazwa] === d.poz), 'dodatkowe: 14 składników w ćwiczeniu zgodnie z rozwiązaniem z zajęć');
const abc = [[13500,'AB1'],[300000,'AA2'],[450000,'AA2'],[8000,'AB1'],[2700,'AB1'],[62000,'AA2'],[15200,'AA4'],[250000,'PA2'],[26300,'AB2'],[1000,'AB1'],[400000,'AA2'],[30000,'AB1'],[49000,'AB3'],[500000,'AA2'],[8400,'AB1'],[135000,'PB3'],[19000,'PB1'],[50000,'AB3'],[24000,'AA2'],[18000,'AB3'],[32000,'AA2'],[11000,'AA1'],[1800000,'PA1'],[10000,'PB3'],[90000,'AA2'],[15000,'PB3']].map(([kwota, poz], i) => ({ nr: i + 1, nazwa: '', kwota, poz }));
r = uzupelnij(abc, { reszta: 'PA6' });
ok(r.sekcje.AA === 1884200 && r.sekcje.AB === 206900 && r.sumaA === 2091100 && r.sekcje.PB === 179000 && r.KW === 1912100 && r.poz.PA6.suma === -137900, 'dodatkowe: 1 884 200, 206 900, 2 091 100, 179 000, 1 912 100, −137 900');
// Zad. 2.15 (Snow) — oczekiwane liczby policzone ręcznie z treści zadania ze zbioru (str. 26–28)
r = uzupelnij(Z215, { reszta: 'PA6' });
ok(Z215.length === 21 && Z215.reduce((a, z) => a + Math.abs(z.kwota), 0) === 580000 + 340000 + 180000 + 28000 + 32000 + 98000 + 16000 + 2000 + 109000 + 44000 + 54000 + 26000 + 100000 + 164820 + 330000 + 47000 + 78000 + 134000 + 21000 + 13000 + 99180, '2.15: 21 składników, kwoty jak w zbiorze');
ok(r.poz.AA1.suma === 60000 && r.poz.AA2.suma === 1100000 && r.poz.AA4.suma === 124000 && r.sekcje.AA === 1284000, '2.15 A.I 60 000, A.II 1 100 000, A.IV 124 000, A 1 284 000');
ok(r.poz.AB1.suma === 98000 && r.poz.AB2.suma === 18000 && r.poz.AB3.suma === 109000 && r.sekcje.AB === 225000 && r.sumaA === 1509000, '2.15 B.I 98 000, B.II 18 000, B.III 109 000, B 225 000, razem 1 509 000');
ok(r.poz.PB1.suma === 34000 && r.poz.PB2.suma === 134000 && r.poz.PB3.suma === 224180 && r.sekcje.PB === 392180, '2.15 rezerwy 34 000, B.II 134 000, B.III 224 180, B 392 180');
ok(r.KW === 1116820 && r.poz.PA6.suma === 522000, '2.15 KW 1 116 820, zysk netto 522 000');
ok(1509000 - 392180 === 1116820 && 1116820 - (100000 + 164820 + 330000) === 522000, '2.15 ręcznie: 1 509 000 − 392 180 = 1 116 820; − 594 820 = 522 000');
// zadanie dodatkowe 4 w całości — pozycje jak w rozwiązaniu prowadzącej (Bilans w parach v3)
ok(DOD4.length === 26 && DOD4.every((d, i) => d.kwota === abc[i].kwota && d.poz === abc[i].poz), 'dodatkowe 4: 26 składników, kwoty i pozycje jak w rozwiązaniu z zajęć');
r = uzupelnij(DOD4, { reszta: 'PA6' });
ok(r.sumaA === 2091100 && r.KW === 1912100 && r.poz.PA6.suma === -137900 && r.poz.AA2.suma === 1858000 && r.poz.AB1.suma === 63600 && r.poz.AB3.suma === 117000, 'dodatkowe 4 z DOD4: A.II 1 858 000, B.I 63 600, B.III 117 000, razem 2 091 100, strata −137 900');
// liczby wpisane w tekst rozwiązań
const txt = src.replace(/\u00a0/g, ' ');
for (const frag of ['580 000 + 340 000 + 180 000 = **1 100 000**', '60 000 + 1 100 000 + 124 000 = **1 284 000**', '98 000 + 18 000 + 109 000 = **225 000**', '1 284 000 + 225 000 = **1 509 000**', '47 000 + 78 000 + 99 180 = **224 180**', '34 000 + 134 000 + 224 180 = **392 180**', '1 509 000 − 392 180 = **1 116 820**', '100 000 + 164 820 + 330 000 = **594 820**', '1 116 820 − 594 820 = **522 000**', '1 116 820 + 392 180 = **1 509 000**', '300 000 + 450 000 + 62 000 + 400 000 + 500 000 + 24 000 + 32 000 + 90 000 = **1 858 000**', '13 500 + 8 000 + 2 700 + 1 000 + 30 000 + 8 400 = **63 600**', '1 212 000 + 646 000 = 1 858 000', '1 912 100 − 2 050 000 = **−137 900**']) ok(txt.includes(frag), `tekst: „${frag}”`);
// odpowiedzi w Pytaniach: liczba w poprawnej opcji = niezależny rachunek
const oczek = [
  ['Ile wynoszą razem aktywa?', '2 091 100'], ['Ile wynosi kapitał własny?', '1 912 100'], ['zapasowy 250', '−137 900'],
  ['zapasowy 40', '30 000'], ['Kapitał podstawowy 300', '−50 000'], ['40% kapitału', '200 000'], ['niepokryta strata z lat ubiegłych −30', '50 000'],
];
const blok = [...src.matchAll(/\{ q: '([^']*)', opcje: \[([^\]]*)\], dobra: (\d)/g)];
for (const [frag, wynik] of oczek) {
  const b = blok.find((x) => x[1].replace(/\u00a0/g, ' ').includes(frag));
  if (!b) { ok(false, `nie ma pytania „${frag}”`); continue; }
  const opcje = [...b[2].matchAll(/'([^']*)'/g)].map((m) => m[1].replace(/\u00a0/g, ' '));
  ok(opcje[Number(b[3])].includes(wynik), `pytanie „${frag}” → ${wynik}`);
}
const dobre = blok.map((b) => b[3]);
console.log('rozkład dobrych odpowiedzi:', ['0', '1', '2'].map((k) => `${k}:${dobre.filter((d) => d === k).length}`).join(' '));
console.log(bledy ? `\n${bledy} błędów` : '\nWszystko się zgadza.');
process.exit(bledy ? 1 : 0);
