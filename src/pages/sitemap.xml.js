// Mapa strony dla Google: wszystkie strony z src/pages + artykuły z sekcji Wiedza.
import { getArticles } from '../lib/wiedza.js';

const SKIP = ['404', 'sitemap.xml', 'talia']; // talia = podgląd udostępnionych talii (noindex)
export function GET() {
  const pages = Object.keys(import.meta.glob('./*.astro'))
    .map((p) => p.replace('./', '').replace('.astro', ''))
    .filter((p) => !SKIP.includes(p) && !p.startsWith('_') && !/^[A-Z]/.test(p))
    .map((p) => (p === 'index' ? 'https://unicorner.pl/' : `https://unicorner.pl/${p}.html`));
  const arts = getArticles().map((a) => `https://unicorner.pl${a.url}`);
  const urls = [...pages, ...arts].map((u) => `  <url><loc>${u}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
