# Cloud Living Blog

Astro static blog for cloudliving.com.

## Docs

- [SEO Setup](docs/seo.md) — astro-seo, sitemap, and robots.txt configuration

## Key files

- `astro.config.mjs` — site config, integrations (sitemap, robots.txt)
- `src/layouts/Layout.astro` — base layout with SEO component
- `src/lib/posts.ts` — post loading, categories, tags, slugify
- `src/lib/markdown.ts` — markdown to HTML rendering
- `content/blog/` — all blog posts as .mdx files

## Commands

- `pnpm dev` — start dev server at localhost:4321
- `pnpm build` — build to `dist/`
- `pnpm preview` — preview production build locally
