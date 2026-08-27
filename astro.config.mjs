// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// unicorner.pl (GitHub Pages, domena w public/CNAME)
// https://astro.build/config
export default defineConfig({
  site: 'https://unicorner.pl',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
