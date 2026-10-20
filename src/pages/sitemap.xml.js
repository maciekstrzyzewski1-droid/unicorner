// Mapa strony dla Google: wszystkie strony z src/pages, moduły kursów (src/pages/<kurs>/*) + artykuły z sekcji Wiedza.
import { getArticles } from '../lib/wiedza.js';

const SKIP = ['404', 'sitemap.xml', 'talia']; // talia = podgląd udostępnionych talii (noindex)
export function GET() {
  const pages = Object.keys(import.meta.glob('./*.astro'))
    .map((p) => p.replace('./', '').replace('.astro', ''))
    .filter((p) => !SKIP.includes(p) && !p.startsWith('_'))
    .map((p) => (p === 'index' ? 'https://unicorner.pl/' : `https://unicorner.pl/${p}.html`));
  // moduły kursów (.mdx) i strony kursów typu słowniczek; pomija dynamiczne [slug] (Wiedza liczona niżej)
  const kursy = Object.keys(import.meta.glob(['./*/*.astro', './*/*.mdx']))
    .filter((p) => !p.includes('['))
    .map((p) => `https://unicorner.pl/${p.replace('./', '').replace(/\.(astro|mdx)$/, '')}.html`);
  const arts = getArticles().map((a) => `https://unicorner.pl${a.url}`);
  const urls = [...pages, ...kursy, ...arts].map((u) => `  <url><loc>${u}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
