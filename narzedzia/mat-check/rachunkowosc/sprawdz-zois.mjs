// Zad. 5.5 (MIKS): konta → zestawienie obrotów i sald → bilans zamknięcia.
// Liczby oczekiwane przepisane ręcznie z arkusza „Zadanie 5.5_rozwiązanie.xlsx” (Dysk, 2026-11-09) — niezależnie od lib/konta.js.
// Uruchom: node narzedzia/mat-check/rachunkowosc/sprawdz-zois.mjs
import { zestawienie, typOperacji } from '../../../src/lib/konta.js';
import { K55, O55 } from '../../../src/lib/konta-zadania.js';

const OCZEK = { // [spWn, spMa, obWn, obMa, naWn, naMa, skWn, skMa] — kolejność kont jak w arkuszu
  st: [31000, 0, 19000, 0, 50000, 0, 50000, 0],
  mat: [18000, 0, 0, 6000, 18000, 6000, 12000, 0],
  odb: [16000, 0, 0, 16000, 16000, 16000, 0, 0],
  kasa: [4000, 0, 4000, 4000, 8000, 4000, 4000, 0],
  rb: [11000, 0, 19000, 23000, 30000, 23000, 7000, 0],
  kp: [0, 50000, 0, 19000, 0, 69000, 0, 69000],
  strata: [7000, 0, 0, 4000, 7000, 4000, 3000, 0],
  kred: [0, 20000, 5000, 0, 5000, 20000, 0, 15000],
  dost: [0, 12000, 12000, 0, 12000, 12000, 0, 0],
  wyn: [0, 5000, 2000, 0, 2000, 5000, 0, 3000],
  inw: [0, 0, 10000, 0, 10000, 0, 10000, 0],
  prac: [0, 0, 1000, 0, 1000, 0, 1000, 0],
};
const RAZEM = [87000, 87000, 72000, 72000, 159000, 159000, 87000, 87000];
const TYPY = { 1: 'A', 2: 'AP-', 3: 'AP-', 4: 'A', 5: 'A', 6: 'AP+', 7: 'A', 8: 'AP-', 9: 'AP-', 10: 'AP+' };

const r = zestawienie(K55, O55, { okres: 'styczeń' });
let bledy = 0;
const zle = (m) => { bledy++; console.log('BŁĄD:', m); };
for (const w of r.wiersze) {
  const o = OCZEK[w.konto.id];
  if (!o) { zle(`brak oczekiwanych dla ${w.konto.id}`); continue; }
  const got = ['sp', 'ob', 'na', 'sk'].flatMap((c) => [w.v[c].wn, w.v[c].ma]);
  if (got.join() !== o.join()) zle(`${w.konto.nazwa}: ${got.join()} ≠ ${o.join()}`);
}
const gotR = ['sp', 'ob', 'na', 'sk'].flatMap((c) => [r.razem[c].wn, r.razem[c].ma]);
if (gotR.join() !== RAZEM.join()) zle(`Razem: ${gotR.join()} ≠ ${RAZEM.join()}`);
for (const op of O55) { const t = typOperacji(op, K55); if (t !== TYPY[op.nr]) zle(`typ op. ${op.nr}: ${t} ≠ ${TYPY[op.nr]}`); }
// bilans: aktywa 84 000, pasywa 84 000 (kapitał własny 66 000 = 69 000 − 3 000, zobowiązania 18 000)
if (r.sumaA !== 84000 || r.sumaP !== 84000) zle(`bilans zamknięcia ${r.sumaA} / ${r.sumaP} ≠ 84 000`);
if (r.sumaA0 !== 80000 || r.sumaP0 !== 80000) zle(`bilans otwarcia ${r.sumaA0} / ${r.sumaP0} ≠ 80 000`);
// suma bilansowa przez typy: 80 000 + AP+ − AP−
let s = 80000; for (const op of O55) { const t = TYPY[op.nr]; if (t === 'AP+') s += op.kwota; if (t === 'AP-') s -= op.kwota; }
if (s !== 84000) zle(`suma przez typy ${s}`);
console.log(bledy ? `${bledy} błędów` : `OK: 12 kont × 8 kolumn, Razem, 10 typów operacji, bilans 80 000 → 84 000 (przez typy: ${s})`);
process.exit(bledy ? 1 : 0);
