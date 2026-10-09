// KaTeX po stronie serwera: komponenty kursu dostają wzór jako tekst LaTeX i oddają gotowy HTML.
// Przeglądarka nie liczy niczego — dostaje statyczny HTML + CSS KaTeX.
import katex from 'katex';

export function tex(src, display = false) {
  if (src == null || src === '') return '';
  return katex.renderToString(String(src), { displayMode: display, throwOnError: true, strict: false, output: 'html' });
}

// Tekst z wstawkami $…$ (np. w treści pytań quizu podanych jako props) → HTML.
// Znak interpunkcyjny tuż po wzorze (kropka, przecinek…) sklejamy ze wzorem, żeby nie spadał sam do nowej linii.
export function texInline(text) {
  if (text == null) return '';
  const parts = String(text).split(/(\$[^$]+\$)/g);
  let out = '';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const m = (parts[i + 1] ?? '').match(/^[.,;:!?)\]”…]+/);
      if (m && part.slice(1, -1).replace(/\s+/g, '').length <= 24) {
        out += `<span class="k-nw">${tex(part.slice(1, -1))}${escapeKeepTags(m[0])}</span>`;
        parts[i + 1] = parts[i + 1].slice(m[0].length);
      } else out += tex(part.slice(1, -1));
    } else out += escapeKeepTags(part);
  }
  return out;
}

// Przepuszcza proste znaczniki <b>, <i>, <br>, <code>; resztę traktuje jako tekst.
function escapeKeepTags(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/&lt;(\/?)(b|i|br|code|em|strong)(\s*\/?)>/g, '<$1$2$3>');
}
