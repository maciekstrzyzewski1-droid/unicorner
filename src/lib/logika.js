// Logika zdań: liczenie tabel zero-jedynkowych i opis „dlaczego” dla pojedynczej komórki.
// Kolumna tabeli to albo { id?, t, f } (f liczy wartość z wiersza),
// albo { id?, t, op, a, b? } — op: not|and|or|imp|eq, a/b: nazwa literki albo id wcześniejszej kolumny.
// Druga postać pozwala automatycznie napisać wyjaśnienie dla każdej komórki.
import { tex, texInline } from './tex.js';

export const OPS = {
  not: { sym: '\\neg', arity: 1, f: (a) => 1 - a, regula: 'negacja odwraca wartość: z 1 robi 0, a z 0 robi 1' },
  and: { sym: '\\land', arity: 2, f: (a, b) => a & b, regula: '$\\land$ daje 1 tylko wtedy, gdy obie strony są równe 1' },
  or: { sym: '\\lor', arity: 2, f: (a, b) => a | b, regula: '$\\lor$ daje 0 tylko wtedy, gdy obie strony są równe 0' },
  imp: { sym: '\\Rightarrow', arity: 2, f: (a, b) => (a === 1 && b === 0 ? 0 : 1), regula: '$\\Rightarrow$ daje 0 tylko w jednym przypadku: $1 \\Rightarrow 0$' },
  eq: { sym: '\\Leftrightarrow', arity: 2, f: (a, b) => (a === b ? 1 : 0), regula: '$\\Leftrightarrow$ daje 1, gdy obie strony mają tę samą wartość' },
};

// Wiersze w kolejności z zajęć: w pierwszej kolumnie połowa zer, potem połowa jedynek; w ostatniej 0 i 1 na zmianę.
export function wiersze(zmienne) {
  const n = zmienne.length;
  return Array.from({ length: 2 ** n }, (_, k) => Object.fromEntries(zmienne.map((z, i) => [z, (k >> (n - 1 - i)) & 1])));
}

const colId = (c, i) => c.id ?? `k${i}`;

export function licz(zmienne, kolumny) {
  const known = new Set(zmienne);
  kolumny.forEach((c, i) => {
    if (c.op) {
      const o = OPS[c.op];
      if (!o) throw new Error(`Tabela: nieznany spójnik „${c.op}” w kolumnie ${c.t}`);
      for (const r of o.arity === 2 ? [c.a, c.b] : [c.a]) if (!known.has(r)) throw new Error(`Tabela: kolumna ${c.t} odwołuje się do „${r}”, którego nie ma wcześniej`);
    } else if (typeof c.f !== 'function') throw new Error(`Tabela: kolumna ${c.t} nie ma ani „op”, ani „f”`);
    known.add(colId(c, i));
  });
  return wiersze(zmienne).map((v) => {
    const val = { ...v };
    const wyniki = kolumny.map((c, i) => {
      const w = c.op ? OPS[c.op].f(val[c.a], OPS[c.op].arity === 2 ? val[c.b] : undefined) : c.f(val) ? 1 : 0;
      val[colId(c, i)] = w;
      return w;
    });
    return { v, val, wyniki };
  });
}

// „Dlaczego w tej komórce jest 0/1” — HTML z gotowymi wzorami. Działa tylko dla kolumn z `op`.
export function dlaczego(zmienne, kolumny, wiersz, ci) {
  const c = kolumny[ci];
  if (!c.op) return '';
  const o = OPS[c.op];
  const nazwa = (r) => (zmienne.includes(r) ? r : kolumny[kolumny.findIndex((k, i) => colId(k, i) === r)].t);
  const gdzie = tex(zmienne.map((z) => `${z} = ${wiersz.v[z]}`).join(',\\ '));
  const w = wiersz.wyniki[ci];
  const va = wiersz.val[c.a];
  if (o.arity === 1) {
    return `Wiersz ${gdzie}: ${tex(nazwa(c.a))} ma wartość ${va}, więc ${tex(`\\neg ${va} = ${w}`)}. ${texInline(cap(o.regula))}.`;
  }
  const vb = wiersz.val[c.b];
  return `Wiersz ${gdzie}: ${tex(nazwa(c.a))} ma wartość ${va}, a ${tex(nazwa(c.b))} ma wartość ${vb}, więc ${tex(`${va} ${o.sym} ${vb} = ${w}`)}. ${texInline(cap(o.regula))}.`;
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
