// Moduł „Bilans”: lib/bilans.js na zadaniach z zajęć (oczekiwane kwoty przepisane z rozwiązań w parach, niezależnie od biblioteki)
// oraz odpowiedzi w ćwiczeniach i quizach (tablice `pytania={[…]}` wyciągnięte z MDX i porównane z rachunkiem).
// node narzedzia/mat-check/rachunkowosc/sprawdz-bilans.mjs
import fs from 'node:fs';
import { uzupelnij } from '../../../src/lib/bilans.js';
let bledy = 0;
const ok = (w, opis) => { console.log(w ? 'ok  ' : 'BŁĄD', opis); if (!w) bledy++; };
const src = fs.readFileSync(new URL('../../../src/pages/rachunkowosc/bilans.mdx', import.meta.url), 'utf8');
const wyciagnij = (nazwa) => { const m = src.match(new RegExp(`export const ${nazwa} = (\\[[\\s\\S]*?\\n\\]);`)); return eval(m[1]); };
const Z216 = wyciagnij('Z216'), Z217 = wyciagnij('Z217'), DOD = wyciagnij('DOD');
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
