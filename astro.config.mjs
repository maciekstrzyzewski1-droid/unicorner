// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeTabele from './src/lib/rehype-tabele.mjs';
import rehypeInterpunkcja from './src/lib/rehype-interpunkcja.mjs';

// unicorner.pl (GitHub Pages, domena w public/CNAME)
// https://astro.build/config
export default defineConfig({
  site: 'https://unicorner.pl',
  // strony wychodza jako foo.html (nie foo/index.html) -> zachowuje istniejace linki .html
  build: { format: 'file' },
  integrations: [react(), mdx()],
  // wzory $...$ i $$...$$ w plikach .md/.mdx renderowane przy buildzie (KaTeX) — zero JS po stronie przegladarki
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false }], rehypeInterpunkcja, rehypeTabele],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
