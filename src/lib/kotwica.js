// Kotwice zadań rozwiązanych krok po kroku (komponent Rozwiazanie) i spis zadań kursu.
// Ta sama funkcja liczy id w komponencie i w spisie na stronie kursu, więc linki zawsze trafiają.
//   „Zad. 2.15” → „zad-2-15”; „Zad. 5.5, str. 67, pkt 3” → „zad-5-5-str-67-pkt-3”; bez źródła — z tytułu.
// Gdy na jednej stronie dwa rozwiązania mają to samo źródło, nadaj jednemu własne id (prop `id`).

const PL = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };
export const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => PL[c])
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const kotwicaZadania = ({ id, tytul, zrodlo }) => id || (zrodlo ? slug(zrodlo) : `rozw-${slug(tytul)}`);

// Do spisu na stronie kursu trafiają tylko zadania z numerem (ze zbioru, z listy, z konspektu) — po numerze się ich szuka.
// „przykład własny”, „dane wymyślone do ćwiczenia” zostają tylko w module.
export const numerowane = (zrodlo) => /\b(zad\.|zadanie dodatkowe \d|przykład \d)/i.test(zrodlo ?? '');

// Atrybuty <Rozwiazanie …> z surowego MDX (tylko zwykłe napisy w cudzysłowie).
export function rozwiazaniaZMdx(mdx) {
  const out = [];
  for (const m of mdx.matchAll(/<Rozwiazanie\b([^>]*)>/g)) {
    const at = {};
    for (const a of m[1].matchAll(/(\w+)="([^"]*)"/g)) at[a[1]] = a[2];
    // tytuł bywa wyrażeniem (tytul={`…`}) — wtedy w spisie zostaje źródło, a kotwica musi przyjść ze źródła albo z id
    if (!at.tytul && !at.zrodlo && !at.id) continue;
    out.push({ tytul: at.tytul ?? at.zrodlo ?? '', zrodlo: at.zrodlo, id: kotwicaZadania({ ...at, tytul: at.tytul ?? at.zrodlo ?? at.id }) });
  }
  return out;
}
