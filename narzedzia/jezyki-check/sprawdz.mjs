// Kontrola danych kursów językowych (src/data/jezyki/*). Uruchom: node narzedzia/jezyki-check/sprawdz.mjs
// Sprawdza strukturę każdego ćwiczenia (indeksy, puste pola, duplikaty), odmianę czasowników regularnych
// liczoną z reguły, zgodność banku słów z lukami i parametry postaci do opisu. Kod wyjścia 1 = są błędy.
import { JEZYKI } from '../../src/data/jezyki/index.js';
import { V } from '../../src/data/jezyki/hiszpanski.js';

const bledy = [];
const uwagi = [];
const blad = (gdzie, co) => bledy.push(`${gdzie}: ${co}`);
const uwaga = (gdzie, co) => uwagi.push(`${gdzie}: ${co}`);
const norm = (s) => String(s).toLowerCase().normalize('NFC').trim();
const tagiOk = (s) => {
  for (const t of ['b', 'i', 'small', 'span', 'ol', 'li', 'table', 'tr', 'td', 'th', 'ul', 'em']) {
    const o = (String(s).match(new RegExp(`<${t}[\\s>]`, 'g')) || []).length;
    const z = (String(s).match(new RegExp(`</${t}>`, 'g')) || []).length;
    if (o !== z) return `<${t}> otwarte ${o}×, zamknięte ${z}×`;
  }
  return null;
};
const AW = { plec: ['m', 'k'], wzrost: ['alto', 'bajo'], wiek: ['joven', 'mayor'], budowa: ['delgado', 'gordo'], pelo: ['rubio', 'moreno', 'blanco'], ojos: ['azules', 'verdes', 'marrones', 'negros'] };

function cw(c, gdzie) {
  for (const pole of ['q', 'x']) if (c[pole]) { const t = tagiOk(c[pole]); if (t) blad(gdzie, `${pole}: ${t}`); }
  if (c.aw) {
    for (const [k, dozw] of Object.entries(AW)) if (!dozw.includes(c.aw[k])) blad(gdzie, `postać: ${k}=${c.aw[k]}`);
    if (c.aw.pelo === 'blanco' && c.aw.wiek !== 'mayor') blad(gdzie, 'siwe włosy tylko u osoby starszej');
    if (c.aw.plec === 'k' && (c.aw.barba || c.aw.bigote)) blad(gdzie, 'broda/wąsy u kobiety');
  }
  switch (c.t) {
    case 'wybor': case 'sluchaj': {
      if (!Array.isArray(c.o) || c.o.length < 2) blad(gdzie, 'za mało opcji');
      if (new Set(c.o.map(norm)).size !== c.o.length) blad(gdzie, `powtórzone opcje: ${c.o.join(' | ')}`);
      if (c.o.some((o) => !String(o).trim())) blad(gdzie, 'pusta opcja');
      if (c.t === 'sluchaj' && !c.mow) blad(gdzie, 'brak tekstu do odsłuchu');
      break;
    }
    case 'wiele': {
      if (new Set(c.o.map(norm)).size !== c.o.length) blad(gdzie, 'powtórzone opcje');
      if (!c.d.length || c.d.some((i) => i < 0 || i >= c.o.length)) blad(gdzie, `złe indeksy d=${c.d}`);
      if (new Set(c.d).size !== c.d.length) blad(gdzie, 'powtórzone indeksy d');
      break;
    }
    case 'wpisz': if (!c.a.length || c.a.some((a) => !String(a).trim())) blad(gdzie, 'brak odpowiedzi'); break;
    case 'uloz': {
      const slowa = (s) => s.replace(/[¿?¡!.,:;„”"]/g, ' ').split(/\s+/).filter(Boolean).map(norm);
      const cel = slowa(c.a);
      if (cel.length < 2) blad(gdzie, 'zdanie za krótkie');
      for (const e of c.extra || []) if (cel.includes(norm(e))) blad(gdzie, `kafelek-pułapka „${e}” jest też w zdaniu`);
      for (const z of c.alt || []) { const s = slowa(z); if ([...s].sort().join(' ') !== [...cel].sort().join(' ')) blad(gdzie, `alt „${z}” ma inne kafelki niż zdanie`); }
      break;
    }
    case 'pary': {
      if (c.p.length < 3) blad(gdzie, 'mniej niż 3 pary');
      if (new Set(c.p.map((p) => norm(p[0]))).size !== c.p.length) blad(gdzie, 'powtórzone lewe');
      if (new Set(c.p.map((p) => norm(p[1]))).size !== c.p.length) blad(gdzie, 'powtórzone prawe');
      break;
    }
    case 'kat': {
      if (c.k.length < 2) blad(gdzie, 'mniej niż 2 kategorie');
      if (new Set(c.e.map((e) => norm(e[0]))).size !== c.e.length) blad(gdzie, 'powtórzone elementy');
      for (const e of c.e) for (const i of [].concat(e[1])) if (!(i >= 0 && i < c.k.length)) blad(gdzie, `„${e[0]}”: zła kategoria ${i}`);
      break;
    }
    case 'odm': if (c.f.length !== 6 || c.f.some((f) => !f)) blad(gdzie, 'odmiana musi mieć 6 form'); break;
    case 'luki': {
      const luki = [...c.tekst.matchAll(/\[\[(.+?)\]\]/g)].map((m) => m[1].split('|'));
      if (!luki.length) blad(gdzie, 'brak luk');
      if (c.bank && c.bank.length) {
        const bank = c.bank.map(norm);
        for (const alt of luki) {
          const i = bank.findIndex((b) => alt.map(norm).includes(b));
          if (i < 0) blad(gdzie, `luka „${alt.join('|')}” nie ma słowa w banku`);
          else bank.splice(i, 1);
        }
        if (bank.length) uwaga(gdzie, `nadmiarowe słowa w banku: ${bank.join(', ')}`);
      }
      break;
    }
    case 'pisz': if (!c.wzor) blad(gdzie, 'brak wzoru'); break;
    default: blad(gdzie, `nieznany typ „${c.t}”`);
  }
}

for (const [slug, { KURS, ODZNAKI }] of Object.entries(JEZYKI)) {
  const id = new Set();
  const dodajId = (x) => { if (id.has(x)) blad(slug, `powtórzone id ${x}`); id.add(x); };
  let n = 0;
  for (const s of KURS.sekcje) {
    dodajId(s.id);
    for (const u of s.jednostki) {
      dodajId(u.id);
      if (!u.lekcje.length) blad(u.id, 'jednostka bez lekcji');
      for (const l of u.lekcje) {
        dodajId(l.id);
        if (!l.pula.length) blad(l.id, 'pusta pula');
        if (l.pula.length < (l.ile || 10)) uwaga(l.id, `pula ${l.pula.length} < ile ${l.ile} (silnik weźmie wszystkie)`);
        for (const k of l.nowe || []) { const t = tagiOk(k.html); if (t) blad(`${l.id} nowe „${k.h}”`, t); }
        l.pula.forEach((c, i) => { cw(c, `${l.id}#${i} (${c.t})`); n++; });
      }
    }
    if (s.powtorka) dodajId(s.powtorka.id);
    if (s.boss) {
      dodajId(s.boss.id);
      if ([...s.boss.haslo].length !== s.boss.retos.length) blad(s.boss.id, `hasło ${s.boss.haslo} ma inną długość niż liczba etapów (${s.boss.retos.length})`);
      s.boss.retos.forEach((r, ri) => r.pula.forEach((c, i) => { cw(c, `${s.boss.id}#${ri}.${i} (${c.t})`); n++; }));
    }
  }
  if (KURS.kolokwium) for (const j of KURS.kolokwium.jednostki) if (!id.has(j)) blad(slug, `kolokwium: brak jednostki ${j}`);
  if (new Set(ODZNAKI.map((o) => o.id)).size !== ODZNAKI.length) blad(slug, 'powtórzone odznaki');
  console.log(`${slug}: ${n} ćwiczeń sprawdzonych`);
}

// odmiana czasowników regularnych liczona z reguły (hiszpański)
const KONC = { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] };
for (const [klucz, v] of Object.entries(V)) {
  if (!v.reg) continue;
  const bez = v.bez || klucz;
  const rdzen = bez.slice(0, -2);
  const wzor = KONC[v.reg].map((k) => rdzen + k);
  v.f.forEach((f, i) => { if (f !== wzor[i]) blad(`odmiana ${bez}`, `osoba ${i + 1}: „${f}”, z reguły „${wzor[i]}”`); });
}

for (const u of uwagi) console.log('uwaga  ', u);
if (bledy.length) { for (const b of bledy) console.log('BŁĄD   ', b); console.log(`\n${bledy.length} błędów`); process.exit(1); }
console.log('\nOK — brak błędów w danych.');
