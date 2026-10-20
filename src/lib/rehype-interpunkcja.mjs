// Kropka albo przecinek tuż po wzorze $…$ nie może spaść sam do nowej linii:
// wzór (span.katex z rehype-katex) i następujący po nim znak interpunkcyjny owijamy w <span class="k-nw">.
// Tylko krótkie wzory: długiego wzoru nie wolno blokować przed łamaniem, bo na telefonie wyjdzie poza ekran.
const PUNKT = /^[.,;:!?)\]”…]+/;
export const KROTKI = 24; // maks. długość źródła LaTeX (bez spacji), przy której sklejamy wzór z kropką
const isKatex = (n) => n && n.type === 'element' && n.tagName === 'span' && [].concat(n.properties?.className ?? []).includes('katex');
const zrodlo = (n) => {
  if (!n) return '';
  if (n.type === 'element' && n.tagName === 'annotation') return (n.children ?? []).map((c) => c.value ?? '').join('');
  for (const c of n.children ?? []) { const s = zrodlo(c); if (s) return s; }
  return '';
};
const krotki = (n) => zrodlo(n).replace(/\s+/g, '').length <= KROTKI;
export default function rehypeInterpunkcja() {
  const walk = (node) => {
    if (!node.children) return;
    const out = [];
    for (let i = 0; i < node.children.length; i++) {
      const ch = node.children[i], nx = node.children[i + 1];
      if (isKatex(ch) && krotki(ch) && nx && nx.type === 'text' && PUNKT.test(nx.value)) {
        const m = nx.value.match(PUNKT)[0];
        out.push({ type: 'element', tagName: 'span', properties: { className: ['k-nw'] }, children: [ch, { type: 'text', value: m }] });
        nx.value = nx.value.slice(m.length);
        continue;
      }
      walk(ch);
      out.push(ch);
    }
    node.children = out;
  };
  return (tree) => walk(tree);
}
