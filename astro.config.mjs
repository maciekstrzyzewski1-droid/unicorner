// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeTabele from './src/lib/rehype-tabele.mjs';
import rehypeInterpunkcja from './src/lib/rehype-interpunkcja.mjs';
import { KATEX_OPCJE } from './src/lib/katex-opcje.js';
import { cp, mkdir, readFile } from 'node:fs/promises';

// pdf.js dekoduje skany (JBIG2/CCITT z ksero, JPEG 2000) modułami WebAssembly, które ładuje z katalogu wasmUrl.
// Kopiujemy je po buildzie do /pdfjs/<wersja>/wasm/ — wersja w ścieżce, bo moduły muszą pasować do workera pdf.js.
// (W `astro dev` ich nie ma: skany JBIG2/JPEG 2000 czytają się tylko w buildzie).
const pdfjsWasm = {
  name: 'pdfjs-wasm',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const pkg = new URL('./node_modules/pdfjs-dist/', import.meta.url);
      const { version } = JSON.parse(await readFile(new URL('package.json', pkg), 'utf8'));
      const out = new URL(`pdfjs/${version}/wasm/`, dir);
      await mkdir(out, { recursive: true });
      for (const f of ['jbig2.wasm', 'jbig2_nowasm_fallback.js', 'openjpeg.wasm', 'openjpeg_nowasm_fallback.js', 'qcms_bg.wasm']) {
        await cp(new URL(`wasm/${f}`, pkg), new URL(f, out));
      }
    },
  },
};

// unicorner.pl (GitHub Pages, domena w public/CNAME)
// https://astro.build/config
export default defineConfig({
  site: 'https://unicorner.pl',
  // strony wychodza jako foo.html (nie foo/index.html) -> zachowuje istniejace linki .html
  build: { format: 'file' },
  integrations: [react(), mdx(), pdfjsWasm],
  // wzory $...$ i $$...$$ w plikach .md/.mdx renderowane przy buildzie (KaTeX) — zero JS po stronie przegladarki
  // Astro 7: domyślny procesor Markdown to Sätteri, który nie uruchamia wtyczek remark/rehype.
  // Zostajemy przy unified (jak w Astro 5) — MDX dziedziczy go razem z wtyczkami.
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, KATEX_OPCJE], rehypeInterpunkcja, rehypeTabele],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
