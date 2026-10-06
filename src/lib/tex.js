// KaTeX po stronie serwera: komponenty kursu dostają wzór jako tekst LaTeX i oddają gotowy HTML.
// Przeglądarka nie liczy niczego — dostaje statyczny HTML + CSS KaTeX.
import katex from 'katex';

export function tex(src, display = false) {
  if (src == null || src === '') return '';
  return katex.renderToString(String(src), { displayMode: display, throwOnError: true, strict: false, output: 'html' });
}

// Tekst z wstawkami $…$ (np. w treści pytań quizu podanych jako props) → HTML.
export function texInline(text) {
  if (text == null) return '';
  return String(text)
    .split(/(\$[^$]+\$)/g)
    .map((part) => (part.startsWith('$') && part.endsWith('$') && part.length > 2 ? tex(part.slice(1, -1)) : escapeKeepTags(part)))
    .join('');
}

// Przepuszcza proste znaczniki <b>, <i>, <br>, <code>; resztę traktuje jako tekst.
function escapeKeepTags(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/&lt;(\/?)(b|i|br|code|em|strong)(\s*\/?)>/g, '<$1$2$3>');
}
