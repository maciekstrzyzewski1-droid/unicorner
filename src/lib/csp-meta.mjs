// CSP dla każdej strony, liczone po buildzie z gotowego HTML-a.
//
// Dlaczego nie wbudowane `security.csp` z Astro: ono hashuje tylko skrypty i style, które Astro samo
// przetwarza. Bloki `<script is:inline>`, `<style is:inline set:html>` i artykuły z `src/teksty/`
// (wstawiane przez set:html) zostają bez hasha, więc przeglądarka by je zablokowała (62 strony).
// Tu hashujemy każdy blok inline w finalnym pliku, także w plikach z `public/` (np. moderacja.html).
//
// Polityka idzie w <meta> na samym początku <head>. Nagłówki, których <meta> nie obsługuje
// (frame-ancestors, nosniff itd.), ustawia reguła w Cloudflare (Transform Rules).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Wyjątki per strona (ścieżka względem dist/).
const EXTRA = {
  // logowanie Google + dekodery skanów pdf.js (WebAssembly)
  'generator.html': {
    script: ['https://accounts.google.com', "'wasm-unsafe-eval'"],
    // blok <style>, który gsi/client wstawia sam (hash z komunikatu przeglądarki, 2026-10-26);
    // jeśli Google zmieni ten CSS, w konsoli wróci jedno naruszenie — logowanie działa i bez niego
    style: ['https://accounts.google.com', "'sha256-RU4sU0AaS8IBGZx8XrGt/pa9A5SLA3dQszGeqT5L3Kw='"],
  },
  // dekoder Draco (WebAssembly) dla szkieletu HeroSkull z public/vendor
  'index.html': {
    script: ["'wasm-unsafe-eval'"],
  },
};

const sha = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

// Strona ma handlery w atrybutach (onclick="…"), także tworzone w JS przez innerHTML.
// Takie strony dostają script-src-attr 'unsafe-inline'. Pozostałe (generator, talia) — nie.
const HANDLER = /\son[a-z]+\s*=\s*["'`\\]/i;

export function policyFor(html, rel) {
  const scripts = new Set();
  const styles = new Set();
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/gi)) {
    // bloki danych (JSON-LD itp.) się nie wykonują i CSP ich nie dotyczy
    if (/\btype\s*=\s*["']?application\/(ld\+)?json/i.test(m[1])) continue;
    scripts.add(sha(m[2]));
  }
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) styles.add(sha(m[1]));

  const extra = EXTRA[rel] || {};
  const script = ["'self'", 'https://static.cloudflareinsights.com', ...(extra.script || []), ...scripts];
  const style = ["'self'", ...(extra.style || []), ...styles];

  return [
    `script-src ${script.join(' ')}`,
    `script-src-attr ${HANDLER.test(html) ? "'unsafe-inline'" : "'none'"}`,
    `style-src ${style.join(' ')}`,
    // atrybuty style="…" (KaTeX generuje ich setki tysięcy); ryzyko znikome w porównaniu ze skryptami
    "style-src-attr 'unsafe-inline'",
    // pdf.js i dekoder Draco uruchamiają workery z blob:
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export const cspMeta = {
  name: 'csp-meta',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      let n = 0;
      for await (const file of htmlFiles(root)) {
        const rel = relative(root, file).split('\\').join('/');
        const html = await readFile(file, 'utf8');
        const head = html.match(/<head(\s[^>]*)?>/i);
        if (!head) { logger.warn(`brak <head>: ${rel}`); continue; }
        // HTML w atrybucie content: & i " muszą być zakodowane (hashe base64 mogą mieć +, / i =, to OK)
        const content = policyFor(html, rel).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        const at = head.index + head[0].length;
        await writeFile(file, html.slice(0, at) + `<meta http-equiv="Content-Security-Policy" content="${content}">` + html.slice(at));
        n++;
      }
      logger.info(`CSP: ${n} stron`);
    },
  },
};
