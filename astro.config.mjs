// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// unicorner.pl (GitHub Pages, domena w public/CNAME)
// https://astro.build/config
export default defineConfig({
  site: 'https://unicorner.pl',
  // strony wychodza jako foo.html (nie foo/index.html) -> zachowuje istniejace linki .html
  build: { format: 'file' },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
