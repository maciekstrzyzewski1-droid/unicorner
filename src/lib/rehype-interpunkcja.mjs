// Kropka albo przecinek tuż po wzorze $…$ nie może spaść sam do nowej linii:
// wzór (span.katex z rehype-katex) i następujący po nim znak interpunkcyjny owijamy w <span class="k-nw">.
const PUNKT = /^[.,;:!?)\]”…]+/;
const isKatex = (n) => n && n.type === 'element' && n.tagName === 'span' && [].concat(n.properties?.className ?? []).includes('katex');
export default function rehypeInterpunkcja() {
  const walk = (node) => {
    if (!node.children) return;
    const out = [];
    for (let i = 0; i < node.children.length; i++) {
      const ch = node.children[i], nx = node.children[i + 1];
      if (isKatex(ch) && nx && nx.type === 'text' && PUNKT.test(nx.value)) {
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
