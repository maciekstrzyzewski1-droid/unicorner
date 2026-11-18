// Liczba z odstępem tysięcy („1 509 000”) nie może się łamać w środku: na telefonie „580” zostawało na końcu
// linii, a „000” spadało niżej i wyglądało jak druga liczba. Odstęp między grupami cyfr zamieniamy na
// twardą spację (U+00A0). Tylko zwykły tekst — bez wzorów KaTeX, kodu, skryptów i stylów.
const POMIN = new Set(['code', 'pre', 'script', 'style', 'annotation', 'math']);
const isKatex = (n) => [].concat(n.properties?.className ?? []).some((c) => String(c).startsWith('katex'));
// cyfra, zwykła spacja, trzy cyfry i koniec grupy (nie cyfra) — „9 000”, „1 116 820”, ale nie „2 15”
const GRUPA = /(\d) (?=\d{3}(?!\d))/g;
export default function rehypeLiczby() {
  const walk = (node) => {
    for (const ch of node.children ?? []) {
      if (ch.type === 'text') ch.value = ch.value.replace(GRUPA, '$1 ');
      else if (ch.type === 'element' && !POMIN.has(ch.tagName) && !isKatex(ch)) walk(ch);
      else if (ch.type !== 'element' && ch.children) walk(ch); // węzły MDX (mdxJsxFlowElement itp.)
    }
  };
  return (tree) => walk(tree);
}
