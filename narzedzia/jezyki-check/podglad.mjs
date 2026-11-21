// Samodzielny podgląd strony kursu językowego z dist/ (jeden plik HTML: CSS, skrypt i fonty w środku).
// Do pokazania Maćkowi przed publikacją (np. jako prywatny artifact). Uruchom po `npm run build`:
//   node narzedzia/jezyki-check/podglad.mjs hiszpanski.html <plik-wyjściowy.html>
// Usuwa: analitykę Cloudflare (nie działa poza domeną) i meta CSP (hashe nie pasują do wklejonego skryptu).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [strona = 'hiszpanski.html', wyjscie = 'podglad.html'] = process.argv.slice(2);
const DIST = join(process.cwd(), 'dist');
let html = readFileSync(join(DIST, strona), 'utf8');

const plik = (url) => join(DIST, url.replace(/^\//, ''));
const mime = { woff2: 'font/woff2', woff: 'font/woff', svg: 'image/svg+xml', png: 'image/png' };
const dataUri = (url) => `data:${mime[url.split('.').pop()] || 'application/octet-stream'};base64,${readFileSync(plik(url)).toString('base64')}`;

function replaceUntilStable(input, pattern, replacement) {
  let poprzedni;
  let wynik = input;
  do {
    poprzedni = wynik;
    wynik = wynik.replace(pattern, replacement);
  } while (wynik !== poprzedni);
  return wynik;
}

// fonty: tylko rodziny używane na stronach kursu (Inter, Chakra Petch, Space Grotesk)
function fontyCss(css) {
  return css.replace(/@font-face\s*{[^}]*}/g, (blok) => {
    if (!/Inter|Chakra Petch|Space Grotesk/i.test(blok)) return '';
    return blok.replace(/url\((['"]?)(\/fonts\/[^)'"]+)\1\)/g, (_, q, u) => (existsSync(plik(u)) ? `url(${dataUri(u)})` : `url(${u})`));
  });
}

html = replaceUntilStable(html, /<meta http-equiv="Content-Security-Policy"[^>]*>/i, '')
  .replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) => {
    let css = readFileSync(plik(href), 'utf8');
    if (href.startsWith('/fonts/')) css = fontyCss(css);
    return `<style>${css}</style>`;
  })
  .replace(/<script type="module" src="([^"]+)"><\/script>/g, (_, src) => `<script type="module">${readFileSync(plik(src), 'utf8')}</script>`);

html = replaceUntilStable(html, /<script[^>]*cloudflareinsights[^>]*><\/script>/i, '');
html = replaceUntilStable(html, /<link rel="icon"[^>]*>/g, '');
html = replaceUntilStable(html, /<link rel="apple-touch-icon"[^>]*>/g, '');

writeFileSync(wyjscie, html);
console.log(`${wyjscie}: ${(html.length / 1024).toFixed(0)} KB`);
