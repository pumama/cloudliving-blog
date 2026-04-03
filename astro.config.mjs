// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.cloudliving.com',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/404'),
      serialize: (item) => {
        // Homepage
        if (item.url === 'https://www.cloudliving.com/') {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        }
        // Blog listing & category pages
        else if (item.url.includes('/blog')) {
          item.changefreq = 'weekly';
          item.priority = 0.9;
        }
        // Guide pages
        else if (item.url.includes('/guides')) {
          item.changefreq = 'monthly';
          item.priority = 0.85;
        }
        // About & Contact
        else if (item.url.includes('/about') || item.url.includes('/contact')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        }
        // Individual posts
        else {
          item.changefreq = 'monthly';
          item.priority = 0.7;
        }
        return item;
      },
    }),
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin'],
        },
      ],
      sitemap: 'https://www.cloudliving.com/sitemap-index.xml',
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
