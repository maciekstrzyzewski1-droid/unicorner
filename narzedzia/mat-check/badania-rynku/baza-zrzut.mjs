// Zrzut liczb, które pokazuje moduł „Baza danych z ankiety” (te same wywołania co w baza-danych.mdx) — dla baza-check.py.
import { tabela, rozklad, srednie, sredniaOgolem, P6, K, G } from '../../../src/lib/baza.js';
const r = (x) => Math.round(x * 1e6) / 1e6;
const z = {
  t5g: tabela('P5', 'GEN').liczby,
  t5p: tabela('P5', 'PLEC', { bezK: ['odmowa odp.'] }).liczby,
  r2: rozklad('P2').liczby,
  r4: rozklad('P4').liczby,
  P6: P6.map((p) => p.tak),
  t9g: tabela('P6_9', 'GEN').liczby,
  s81: r(sredniaOgolem('P8_1').srednia), s81z: r(sredniaOgolem('P8_1', { nd0: true }).srednia),
  s84: r(sredniaOgolem('P8_4').srednia), s84z: r(sredniaOgolem('P8_4', { nd0: true }).srednia),
  s71p: srednie('P7_1', 'PLEC', { bez: ['odmowa odp.'] }).map((x) => r(x.srednia)),
  s71g: srednie('P7_1', 'GEN').map((x) => r(x.srednia)),
  nS5: rozklad('SYT').liczby[4], nM1: rozklad('MIEJSCE').liczby[0], nOdm: rozklad('PLEC').liczby[2],
  p6sprz: K.p6Sprzeczne,
  dochK: G.doch.kody, pierwszyZly: G.pierwszyZly, zgodneDoch: G.zgodneDoch,
  dochAI: rozklad('DOCH').liczby,
};
console.log(JSON.stringify(z));
