// Ładuje artykuły z src/teksty/*.html i przerabia je na fragmenty gotowe do osadzenia
// w szablonie Unicornera: wycina <body>, zawęża CSS artykułu do .art i podmienia paletę
// (złoto/brąz ze skilla -> neonowe akcenty Unicornera). Wszystko dzieje się przy buildzie,
// więc gotowa strona to czysty, statyczny HTML — dobrze indeksowany przez Google.

import { ARTICLES, CATEGORIES, SERIES } from '../data/wiedza.js';

const RAW = import.meta.glob('../teksty/*.html', { query: '?raw', import: 'default', eager: true });

// Paleta skilla -> paleta Unicornera (tekst spokojny, akcenty neonowe).
const COLOR_MAP = [
  ['#14150f', '#07060f'], // tło
  ['#ece5d1', '#e6e3f2'], // tekst
  ['#a9a292', '#a39cc9'], // muted
  ['#d1a13f', '#a78bfa'], // akcent (złoty -> fiolet)
  ['#2b2c23', '#26223a'], // linie
  ['#1b1c15', '#100e1a'], // karty
  ['#c96a4e', '#ff5c93'], // czerwony -> magenta
  ['#7fa06a', '#5ad1a0'], // zielony
  ['#6f8fa8', '#4fc3dc'], // niebieski -> cyjan
];
const RGB_MAP = [
  [/rgba\(\s*209\s*,\s*161\s*,\s*63\s*,/g, 'rgba(167,139,250,'],
  [/rgba\(\s*201\s*,\s*106\s*,\s*78\s*,/g, 'rgba(255,92,147,'],
  [/rgba\(\s*127\s*,\s*160\s*,\s*106\s*,/g, 'rgba(90,209,160,'],
];

function recolor(s) {
  for (const [from, to] of COLOR_MAP) s = s.replace(new RegExp(from, 'gi'), to);
  for (const [re, to] of RGB_MAP) s = s.replace(re, to);
  return s
    .replace(/'Fraunces'/g, "'Chakra Petch'")
    .replace(/"Fraunces"/g, '"Chakra Petch"')
    .replace(/'Work Sans'/g, "'Inter'")
    .replace(/"Work Sans"/g, '"Inter"');
}

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

function parse(raw) {
  const styles = [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  let body = (raw.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, raw])[1];
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  const title = pick(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || pick(raw, /<title>([\s\S]*?)<\/title>/i);
  const lede = pick(body, /<p[^>]*class="[^"]*\blede\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    || pick(body, /<p[^>]*class="[^"]*\b(?:dek|subtitle|lead)\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)
    || pick(body, /<p[^>]*>([\s\S]*?)<\/p>/i);
  const words = text(body).split(' ').length;
  const metaTxt = pick(body, /class="[^"]*\bmeta\b[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/i);
  const m = metaTxt.match(/ok\.\s*(\d+)\s*min/);
  const minutes = m ? +m[1] : Math.max(5, Math.round(words / 200));
  return { css: recolor(scopeCss(styles)), html: recolor(body), title, lede, minutes, words };
}

let cache;
export function getArticles() {
  if (cache) return cache;
  cache = ARTICLES.map((meta, idx) => {
    const raw = RAW[`../teksty/${meta.slug}.html`];
    if (!raw) throw new Error(`Brak pliku src/teksty/${meta.slug}.html`);
    const p = parse(raw);
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
  return cache;
}

export function seriesNeighbours(article) {
  if (!article.series) return {};
  const list = getArticles().filter((a) => a.series === article.series).sort((a, b) => a.part - b.part);
  const i = list.findIndex((a) => a.slug === article.slug);
  return { prev: list[i - 1], next: list[i + 1], total: list.length };
}

export { CATEGORIES, SERIES };
