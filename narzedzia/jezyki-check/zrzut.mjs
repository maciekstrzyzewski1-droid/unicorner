// Czytelny zrzut całego kursu (wszystkie ćwiczenia, także generowane kodem) do przeglądu treści.
// Uruchom: node narzedzia/jezyki-check/zrzut.mjs [slug] > zrzut.txt
import { JEZYKI } from '../../src/data/jezyki/index.js';

const slug = process.argv[2] || 'hiszpanski';
const { KURS } = JEZYKI[slug];
const bt = (s) => String(s ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
const out = [];
const p = (s = '') => out.push(s);
const awTxt = (a) => a ? ` [POSTAĆ: ${a.imie}, ${a.plec === 'k' ? 'kobieta' : 'mężczyzna'}, ${a.wzrost}, ${a.wiek}, ${a.budowa}, pelo ${a.pelo}, ojos ${a.ojos}${a.gafas ? ', gafas' : ''}${a.barba ? ', barba' : ''}${a.bigote ? ', bigote' : ''}]` : '';

function cw(c, id) {
  const head = `${id} [${c.t}]${awTxt(c.aw)}${c.kol ? ` [KOLOR ${c.kol}]` : ''}`;
  p(head);
  if (c.q) p(`  Pytanie: ${bt(c.q)}`);
  switch (c.t) {
    case 'wybor': case 'sluchaj':
      if (c.mow) p(`  Czytane na głos: ${c.mow}`);
      p(`  DOBRA: ${c.o[0]}`); p(`  złe: ${c.o.slice(1).join(' | ')}`); break;
    case 'wiele': c.o.forEach((o, i) => p(`  ${c.d.includes(i) ? '[PRAWDA]' : '[fałsz] '} ${o}`)); break;
    case 'wpisz': p(`  Akceptowane: ${c.a.join(' | ')}`); break;
    case 'uloz': p(`  Zdanie: ${c.a}`); p(`  Kafelki-pułapki: ${(c.extra || []).join(', ')}`); break;
    case 'pary': c.p.forEach(([a, b]) => p(`  ${a}  ↔  ${b}`)); break;
    case 'kat': p(`  Kategorie: ${c.k.map((k, i) => `${i}=${k}`).join(' ; ')}`); c.e.forEach(([w, k]) => p(`  ${w} → ${[].concat(k).map((i) => c.k[i]).join(' / ')}`)); break;
    case 'odm': p(`  ${c.v}: ${c.f.join(', ')}`); break;
    case 'luki': p(`  Tekst: ${c.tekst}`); if (c.bank) p(`  Bank: ${c.bank.join(', ')}`); break;
    case 'pisz': p(`  Wzór: ${c.wzor}`); p(`  Punkty: ${(c.punkty || []).join(' / ')}`); break;
  }
  if (c.x) p(`  Wyjaśnienie: ${bt(c.x)}`);
}

p(`KURS: ${KURS.nazwa} — ${bt(KURS.opis)}`);
for (const s of KURS.sekcje) {
  p(); p(`=============== ${s.nazwa} (${s.pl}) ===============`);
  for (const u of s.jednostki) {
    p(); p(`######## ${u.id} ${u.tytul} — ${u.pl} (źródło: ${u.zrodlo})${u.kolokwium ? ' [KOLOKWIUM]' : ''}`);
    for (const l of u.lekcje) {
      p(); p(`---- ${l.id}: ${l.tytul} (losowane ${l.ile} z ${l.pula.length}) ----`);
      for (const n of l.nowe || []) p(`  KARTA „Nowe”: ${n.h}: ${bt(n.html.replace(/<\/(td|th)>/g, ' | ').replace(/<\/tr>|<br>|<\/li>/g, ' // '))}`);
      l.pula.forEach((c, i) => cw(c, `${l.id}#${i}`));
    }
  }
  if (s.boss) {
    p(); p(`######## BOSS ${s.boss.id}: ${s.boss.tytul} — hasło ${s.boss.haslo}`);
    s.boss.retos.forEach((r, ri) => { p(`  -- Reto ${ri + 1}: ${r.nazwa}`); r.pula.forEach((c, i) => cw(c, `${s.boss.id}#${ri}.${i}`)); });
  }
}
console.log(out.join('\n'));
