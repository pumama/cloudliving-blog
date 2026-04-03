# Cloud Living Blog

Astro static blog for cloudliving.com.

## Docs

- [SEO Setup](docs/seo.md) — astro-seo, sitemap, robots.txt, and schema markup
- [Creating Guides](docs/guides.md) — how to create multi-chapter guides, content guidelines, visual elements

## Key files

- `astro.config.mjs` — site config, integrations (sitemap, robots.txt)
- `src/layouts/Layout.astro` — base layout with SEO component
- `src/lib/posts.ts` — post loading, categories, tags, slugify
- `src/lib/guides.ts` — guide loading, chapters, headings
- `src/lib/markdown.ts` — markdown to HTML rendering with heading IDs
- `content/blog/` — all blog posts as .mdx files
- `content/guides/` — multi-chapter guides (each guide is a folder)

## Commands

- `pnpm dev` — start dev server at localhost:4321
- `pnpm build` — build to `dist/`
- `pnpm preview` — preview production build locally
