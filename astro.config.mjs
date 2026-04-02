// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import fs from 'fs';
import path from 'path';

// Generate redirects from old WordPress URLs
function getRedirects() {
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(contentDir)) return {};
  const slugs = fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    .map(f => f.replace(/\.mdx?$/, ''));

  const redirects = {};
  for (const slug of slugs) {
    redirects[`/${slug}`] = `/blog/${slug}`;
  }
  return redirects;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.cloudliving.com',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  redirects: getRedirects(),
  vite: {
    plugins: [tailwindcss()]
  }
});
