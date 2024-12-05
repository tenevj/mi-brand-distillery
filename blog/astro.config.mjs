import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tenevj.github.io',
  base: '/mi-brand-distillery/blog',
  outDir: './dist',
  build: {
    assets: 'assets'
  }
});
