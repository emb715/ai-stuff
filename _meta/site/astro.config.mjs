import { defineConfig } from 'astro/config';

// Site lives at _meta/site/, vault content is two levels up.
// Base URL is relative so the site works when deployed under any subpath.
export default defineConfig({
  site: 'https://emb715.github.io',
  base: '/ai-stuff',
  trailingSlash: 'ignore',
});