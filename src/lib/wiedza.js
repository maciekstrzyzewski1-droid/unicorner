// Ładuje artykuły z src/teksty/*.html i przerabia je na fragmenty gotowe do osadzenia
// w szablonie Unicornera: wycina <body> i zawęża CSS artykułu do .art. Paleta i czcionki
// artykułu (ciemna zieleń, złoto, Fraunces + Work Sans) zostają takie, jak w pliku źródłowym.
// Wszystko dzieje się przy buildzie,
// więc gotowa strona to czysty, statyczny HTML — dobrze indeksowany przez Google.

import { ARTICLES, CATEGORIES, SERIES } from '../data/wiedza.js';

const RAW = import.meta.glob('../teksty/*.html', { query: '?raw', import: 'default', eager: true });

// Zawęża arkusz stylów do kontenera .art (proste parsowanie po klamrach).
function scopeSelector(sel) {
  sel = sel.trim();
  if (!sel) return sel;
  if (sel === ':root' || sel === 'html' || sel === 'body') return '.art';
  if (/^(html|body)\s+/.test(sel)) return '.art ' + sel.replace(/^(html|body)\s+/, '');
  if (/^(html|body)[.:#\[]/.test(sel)) return '.art' + sel.replace(/^(html|body)/, '');
  if (sel.startsWith('.art')) return sel;
  return '.art ' + sel;
}

function splitSelectors(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}

function scopeCss(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import[^;]+;/g, '');
  let out = '', i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) break;
    const head = css.slice(i, open).trim();
    // znajdź pasującą klamrę zamykającą
    let depth = 1, j = open + 1;
    while (j < css.length && depth) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
    const body = css.slice(open + 1, j - 1);
    if (/^@(media|supports|container)/.test(head)) out += `${head}{${scopeCss(body)}}`;
    else if (head.startsWith('@')) out += `${head}{${body}}`; // keyframes, font-face
    else out += `${splitSelectors(head).map(scopeSelector).join(',')}{${body}}`;
    i = j;
  }
  return out;
}

const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const pick = (html, re) => { const m = html.match(re); return m ? text(m[1]) : ''; };

// Artykuły to nasze pliki, ale gdyby trafił do nich cudzy HTML, na stronę nie przejdzie żaden skrypt.
// 1) Bloki <script>…</script> wycinamy (także `</script >` i niezamknięty znacznik). Szukamy zawsze od
//    początku, więc wycięcie jednego fragmentu nie może skleić nowego znacznika.
function stripScripts(html) {
  for (;;) {
    const lower = html.toLowerCase();
    const start = lower.indexOf('<script');
    if (start === -1) return html;
    const close = lower.indexOf('</script', start);
    const end = close === -1 ? -1 : lower.indexOf('>', close);
    html = html.slice(0, start) + (end === -1 ? '' : html.slice(end + 1));
  }
}

// 2) Atrybutów on…= ani adresów javascript: nie czyścimy po cichu: build się zatrzymuje i wskazuje plik.
const ON_ATTR = /\son[a-z]+\s*=/i;
const JS_URL = /\s(?:href|src|action|formaction|xlink:href)\s*=\s*["']?\s*javascript:/i;
function assertNoActiveHtml(html, file) {
  if (html.toLowerCase().includes('<script')) throw new Error(`${file}: został znacznik <script>`);
  for (const [tag] of html.matchAll(/<[^>]*>/g)) {
    if (ON_ATTR.test(tag) || JS_URL.test(tag))
      throw new Error(`${file}: niedozwolony atrybut on…= albo adres javascript: w ${tag.slice(0, 120)}`);
  }
}

function parse(raw, file) {
  const styles = [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  let body = (raw.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, raw])[1];
  body = stripScripts(body);
  assertNoActiveHtml(body, file);
  const title = pick(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || pick(raw, /<title>([\s\S]*?)<\/title>/i);
  const lede = pick(body, /<p[^>]*class="[^"]*\blede\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    || pick(body, /<p[^>]*class="[^"]*\b(?:dek|subtitle|lead)\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    || pick(body, /<p[^>]*>([\s\S]*?)<\/p>/i);
  const words = text(body).split(' ').length;
  const metaTxt = pick(body, /class="[^"]*\bmeta\b[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/i);
  const m = metaTxt.match(/ok\.\s*(\d+)\s*min/);
  const minutes = m ? +m[1] : Math.max(5, Math.round(words / 200));
  return { css: scopeCss(styles), html: addToc(body, minutes), title, lede, minutes, words };
}


// Spis treści z czasem czytania każdej części. Liczony przy buildzie z nagłówków <h2> artykułu,
// więc działa we wszystkich tekstach bez zmian w plikach. Nagłówki bez id dostają id="sekcja-N".
// Czas części: słowa do następnego <h2> (bez SVG i ukrytych odpowiedzi w <details>) / 200 słów na minutę.
function addToc(body, totalMinutes) {
  const heads = [...body.matchAll(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi)];
  if (heads.length < 3) return body;
  const words = (html) => text(html.replace(/<svg[\s\S]*?<\/svg>|<details[\s\S]*?<\/details>/gi, ' ')).split(' ').filter(Boolean).length;
  const items = heads.map((m, i) => {
    const idMatch = m[1].match(/\sid="([^"]+)"/);
    const id = idMatch ? idMatch[1] : `sekcja-${i + 1}`;
    const num = pick(m[2], /<span[^>]*class="[^"]*\bnum\b[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
    const title = text(m[2].replace(/<span[^>]*class="[^"]*\bnum\b[^"]*"[^>]*>[\s\S]*?<\/span>/i, ''));
    const end = i + 1 < heads.length ? heads[i + 1].index : body.length;
    const min = Math.max(1, Math.round(words(body.slice(m.index, end)) / 200));
    return { m, id, num, title, min, hasId: !!idMatch, sources: /^źródła$/i.test(num) };
  });
  let out = '', last = 0;
  for (const it of items) {
    out += body.slice(last, it.m.index);
    out += it.hasId ? it.m[0] : `<h2${it.m[1]} id="${it.id}">${it.m[2]}</h2>`;
    last = it.m.index + it.m[0].length;
  }
  out += body.slice(last);
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const parts = items.filter((it) => !it.sources).length;
  const li = items.map((it) => `<li data-sec="${it.id}"><a href="#${it.id}">${it.num ? `<span class="n">${esc(it.num)}</span>` : ''}<span class="t">${esc(it.title)}</span>${it.sources ? '' : `<span class="min">${it.min} min</span>`}</a></li>`).join('');
  const nav = `<nav class="wz-toc" aria-label="Spis treści"><details><summary><span class="k">Spis treści</span><span class="m">${parts} części · ok. ${totalMinutes} min</span></summary><ol>${li}</ol></details></nav>`;
  return /<\/header>/i.test(out) ? out.replace(/<\/header>/i, (h) => h + nav) : nav + out;
}

let cache;
export function getArticles() {
  if (cache) return cache;
  cache = ARTICLES.map((meta, idx) => {
    const raw = RAW[`../teksty/${meta.slug}.html`];
    if (!raw) throw new Error(`Brak pliku src/teksty/${meta.slug}.html`);
    const p = parse(raw, `src/teksty/${meta.slug}.html`);
    const cat = CATEGORIES.find((c) => c.id === meta.category);
    return {
      ...p,
      ...meta,
      title: meta.title || p.title,
      lede: meta.lede || p.lede,
      seoTitle: meta.seoTitle || p.title,
      categoryName: cat ? cat.name : meta.category,
      seriesName: meta.series ? SERIES[meta.series].name : null,
      order: idx,
      url: `/wiedza/${meta.slug}.html`,
    };
  });
  for (const a of cache) if (a.series) a.seriesTotal = cache.filter((x) => x.series === a.series).length;
  return cache;
}

export function seriesNeighbours(article) {
  if (!article.series) return {};
  const list = getArticles().filter((a) => a.series === article.series).sort((a, b) => a.part - b.part);
  const i = list.findIndex((a) => a.slug === article.slug);
  return { prev: list[i - 1], next: list[i + 1], total: list.length };
}

export { CATEGORIES, SERIES };
