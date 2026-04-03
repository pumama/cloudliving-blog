# Creating Guides

## How Guides Work

Guides are multi-chapter handbooks stored in `content/guides/`. Each guide is a folder with a `_meta.json` config and `.mdx` chapter files.

```
content/guides/
└── your-guide-slug/
    ├── _meta.json
    ├── intro.mdx
    ├── chapter-two.mdx
    ├── chapter-three.mdx
    └── ...
```

## Creating a New Guide

### Step 1: Create the folder and _meta.json

```json
{
  "title": "Your Guide Title",
  "description": "One or two sentences describing the guide.",
  "date": "2026-04-03",
  "chapters": [
    "intro",
    "chapter-two",
    "chapter-three"
  ]
}
```

- `chapters` array controls the order. Each string matches a `.mdx` filename (without extension).
- First chapter renders at `/guides/your-guide-slug/`
- Remaining chapters render at `/guides/your-guide-slug/chapter-slug/`

### Step 2: Write chapter files

Each `.mdx` file needs this frontmatter:

```yaml
---
title: "Chapter Title"
description: "Short description for SEO and the hero section."
heroImage: "/images/guides/your-image.svg"
---
```

- `title` — shown in the hero, chapter tabs, and prev/next navigation
- `description` — shown in the hero section below the title
- `heroImage` — featured image displayed in the hero section of every chapter

### Step 3: Create hero images

Save images to `public/images/guides/`. SVG format is preferred (clean, scalable, fast).

Each chapter should have its own hero image that visually represents the topic.

**SVG guidelines:**
- Viewbox: `0 0 800 320` (standard size)
- Background: `#F0F9FF` (light sky blue)
- Accent color: `#0284C7` (brand blue)
- Text color: `#1E293B` (dark) and `#94A3B8` (gray)
- Always escape `&` as `&amp;` in SVG text elements
- Keep it simple — diagrams, not illustrations

### Step 4: Build and verify

```bash
pnpm build   # All guide pages generate automatically
pnpm dev     # Preview at localhost:4321/guides/
```

No page files need to be created. The routes are generated automatically from the folder structure.

## Content Guidelines

### Writing style

- **First person** — "I", "my experience", personal stories
- **Conversational** — write like you're talking to a friend, not lecturing
- **Opinionated** — share what actually works, not every possible option
- **Specific** — real numbers, real tools, real examples
- **Honest** — include limitations and when NOT to do something

### Structure per chapter

1. **Opening hook** — one or two sentences that set up the chapter
2. **Core content** — organized with `##` headings for major sections
3. **Visual breaks** — use callouts, highlights, images, and horizontal rules every 3-4 paragraphs
4. **Closing thought** — wrap up with a key takeaway or transition to next chapter

### Visual elements (break up walls of text)

Use these HTML elements inside markdown:

**Blockquote** — for key quotes or important statements:
```markdown
> This is an important point that deserves emphasis.
```

**Tip callout** (green) — recommended approaches:
```html
<div class="callout callout-tip">

Your tip content here.

</div>
```

**Warning callout** (yellow) — common mistakes:
```html
<div class="callout callout-warning">

Warning content here.

</div>
```

**Important callout** (red) — critical warnings:
```html
<div class="callout callout-important">

Critical warning here.

</div>
```

**Info callout** (blue) — additional context:
```html
<div class="callout callout-info">

Additional info here.

</div>
```

**Highlight box** — key takeaways and summaries:
```html
<div class="highlight">

**Key takeaway**

Your summary content here.

</div>
```

**Stat block** — eye-catching numbers:
```html
<div class="stat">
<div class="number">40-62%</div>
<div class="label">of AI-generated code contains vulnerabilities</div>
</div>
```

**Tool card** — for featuring a tool with logo:
```html
<div class="tool-card">
<img src="/images/guides/tools/logo.png" alt="Tool Name" />
<div class="tool-info">

**Best for:** One line description

Tool description here.

</div>
</div>
```

**Horizontal rule** — section breaks:
```markdown
---
```

### Rule of thumb

Every screen-height of scrolling should have at least one visual break: a callout, highlight box, image, blockquote, or horizontal rule. No wall of text should go longer than 4 paragraphs without a visual element.

## URL Structure

```
/guides                              → Guide listing page
/guides/[guide-slug]                 → First chapter (intro)
/guides/[guide-slug]/[chapter-slug]  → Individual chapter
```

## SEO

Each guide page automatically gets:
- `<title>` with guide and chapter name
- Meta description from chapter frontmatter
- Open Graph and Twitter card tags
- Sitemap entry at priority 0.85
- Schema.org structured data:
  - `CreativeWork` on guide overview (with `hasPart` listing chapters)
  - `Article` with `isPartOf` on individual chapters

## Components

These are used automatically by the guide page templates:

| Component | What it does |
|---|---|
| `GuideHero.astro` | Hero section with title, description, stats, image |
| `GuideChapterNav.astro` | Horizontal chapter tabs |
| `GuideProgress.astro` | Progress bar (chapter X of Y) |
| `GuideTableOfContents.astro` | Sticky right sidebar with heading links |
| `GuidePrevNext.astro` | Previous/Next navigation at bottom |
| `GuideCard.astro` | Card for the guides listing page |

## Key Files

- `src/lib/guides.ts` — data layer (loads guides, chapters, headings)
- `src/lib/markdown.ts` — markdown to HTML with heading IDs
- `src/pages/guides/index.astro` — listing page
- `src/pages/guides/[guide]/index.astro` — guide overview (first chapter)
- `src/pages/guides/[guide]/[chapter].astro` — individual chapter page
- `src/styles/global.css` — callout, highlight, stat, tool-card styles
