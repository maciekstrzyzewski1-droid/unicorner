// Każdą tabelę z markdownu (w .md/.mdx) owija w <div class="k-tab">, żeby na telefonie przewijała się w bok
// zamiast rozpychać stronę. Tabele z komponentów (TabelaPrawdy itp.) nie przechodzą przez ten krok.
export default function rehypeTabele() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.map((ch) => {
      if (ch.type === 'element' && ch.tagName === 'table') {
        return { type: 'element', tagName: 'div', properties: { className: ['k-tab'] }, children: [ch] };
      }
      walk(ch);
      return ch;
    });
  };
  return (tree) => walk(tree);
}
