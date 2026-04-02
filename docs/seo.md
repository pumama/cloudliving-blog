# SEO Setup

This site uses three integrations for SEO:

## 1. astro-seo

**Package:** [astro-seo](https://github.com/jonasmerlin/astro-seo)

Generates `<title>`, `<meta>`, Open Graph, and Twitter Card tags in the `<head>`.

### How it works

The `<SEO>` component is used in `src/layouts/Layout.astro`. Every page automatically gets:

- `<title>` — page title with "— Cloud Living" suffix
- `<meta name="description">` — page description
- `<link rel="canonical">` — canonical URL
- Open Graph tags — title, description, type, image, site name
- Twitter Card — summary card with @OfficialTung

### Props

The Layout accepts these props to customize SEO per page:

| Prop | Default | Description |
|------|---------|-------------|
| `title` | "Cloud Living — Tung Tran" | Page title |
| `description` | Site description | Meta description |
| `article` | `false` | Set to `true` for blog posts (changes og:type to "article") |
| `publishedTime` | — | ISO date string for article publish date |

### Usage

**Regular page:**
```astro
<Layout title="About" description="About Tung Tran.">
```

**Blog post:**
```astro
<Layout title={post.title} description={post.description} article publishedTime={post.date}>
```

### Default OG image

All pages use `/images/tung.jpg` as the default Open Graph image. To add per-post OG images:

1. Add an `ogImage` field to the post frontmatter
2. Pass it through the Layout props
3. Use it in the SEO component's `openGraph.basic.image`

---

## 2. @astrojs/sitemap

**Package:** [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

Auto-generates `sitemap-index.xml` and `sitemap-0.xml` at build time.

### Configuration

In `astro.config.mjs`:

- **Filtered out:** `/admin`, `/404`
- **Priority 1.0:** Homepage
- **Priority 0.9:** Blog listing and category pages
- **Priority 0.8:** About, Contact
- **Priority 0.7:** Individual blog posts

### Output

- `dist/sitemap-index.xml` — index file pointing to sitemap chunks
- `dist/sitemap-0.xml` — all URLs with changefreq and priority

Referenced in Layout via `<link rel="sitemap" href="/sitemap-index.xml" />`.

---

## 3. astro-robots-txt

**Package:** [astro-robots-txt](https://github.com/alextim/astro-lib/tree/main/packages/astro-robots-txt)

Auto-generates `robots.txt` at build time.

### Configuration

In `astro.config.mjs`:

```js
robotsTxt({
  policy: [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
  ],
  sitemap: 'https://www.cloudliving.com/sitemap-index.xml',
})
```

### Output

```
User-agent: *
Disallow: /admin
Allow: /
Sitemap: https://www.cloudliving.com/sitemap-index.xml
```

---

## 4. astro-seo-schema (JSON-LD)

**Packages:** [astro-seo-schema](https://github.com/codiume/orbit/tree/main/packages/astro-seo-schema) + [schema-dts](https://github.com/nicuveo/schema-dts) (TypeScript types)

Generates `<script type="application/ld+json">` structured data for Google rich results.

### Schemas used

**WebSite + Person** (every page, in `src/layouts/Layout.astro`):

```astro
<Schema
  item={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cloud Living",
    url: "https://www.cloudliving.com",
    author: {
      "@type": "Person",
      name: "Tung Tran",
      url: "https://www.cloudliving.com/about",
      image: "https://www.cloudliving.com/images/tung.jpg",
      sameAs: ["https://x.com/OfficialTung", "https://github.com/pumama", "https://t.me/tungtrantk"],
      jobTitle: "Internet Entrepreneur",
    },
  }}
/>
```

**Article** (blog posts only, in `src/pages/[slug].astro`):

```astro
<Schema
  item={{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://www.cloudliving.com/${post.slug}/`,
    author: { "@type": "Person", name: "Tung Tran" },
    publisher: { "@type": "Organization", name: "Cloud Living" },
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
  }}
  slot="head"
/>
```

### Adding schema to a new page

Use the `slot="head"` attribute to inject into the Layout's `<head>`:

```astro
<Layout title="My Page">
  <Schema
    item={{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [...]
    }}
    slot="head"
  />
  <!-- page content -->
</Layout>
```

### Supported schema types

Any [Schema.org type](https://schema.org/docs/full.html) works — the `schema-dts` package provides TypeScript autocompletion. Common ones:

- `Article` — blog posts
- `FAQPage` — FAQ sections
- `HowTo` — tutorials
- `Product` / `Review` — product pages
- `BreadcrumbList` — navigation breadcrumbs

### Testing

Validate your schema at [Google Rich Results Test](https://search.google.com/test/rich-results) or [Schema.org Validator](https://validator.schema.org/).

---

## Checklist for new pages

When creating a new page, make sure to:

1. Pass `title` and `description` to the Layout
2. For blog posts, add `article` and `publishedTime` props
3. For custom schema, use `<Schema>` with `slot="head"`
4. The sitemap and robots.txt update automatically on build
5. Test schema with Google Rich Results Test
