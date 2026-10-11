// Wspólne opcje KaTeX: wzory w MDX ($…$, $$…$$ — rehype-katex) i w komponentach (lib/tex.js).
// Kolorowe kawałki wzoru (moduł „Pochodne” i dalej):
//   \cF{…} turkus, \cG{…} złoto, \cH{…} fiolet, \cK{…} zieleń, \cR{…} róż — sam kolor,
//   \mF{id}{…}, \mG{id}{…}, \mH{id}{…}, \mK{id}{…}, \mN{id}{…} — kolor + znacznik data-p="id",
//   po którym animacja „krok po kroku” wie, skąd dokąd przelatuje kawałek (komponent pochodne/Rachunek).
// Kolory klas k-cf / k-cg / k-ch / k-ck / k-cr są w styles/kurs.css.
// trust tylko dla \htmlData i \htmlClass — wzory piszemy sami, nic nie przychodzi od użytkownika.
export const KATEX_MAKRA = {
  '\\cF': '\\htmlClass{k-cf}{#1}',
  '\\cG': '\\htmlClass{k-cg}{#1}',
  '\\cH': '\\htmlClass{k-ch}{#1}',
  '\\cK': '\\htmlClass{k-ck}{#1}',
  '\\cR': '\\htmlClass{k-cr}{#1}',
  '\\mF': '\\htmlData{p=#1}{\\htmlClass{k-cf}{#2}}',
  '\\mG': '\\htmlData{p=#1}{\\htmlClass{k-cg}{#2}}',
  '\\mH': '\\htmlData{p=#1}{\\htmlClass{k-ch}{#2}}',
  '\\mK': '\\htmlData{p=#1}{\\htmlClass{k-ck}{#2}}',
  '\\mN': '\\htmlData{p=#1}{#2}',
};

export const KATEX_OPCJE = {
  strict: false,
  trust: (ctx) => ctx.command === '\\htmlData' || ctx.command === '\\htmlClass',
  macros: KATEX_MAKRA,
};
