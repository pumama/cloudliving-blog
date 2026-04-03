import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { slugify } from "./posts";

const guidesDir = path.join(process.cwd(), "content/guides");

export type Chapter = {
  slug: string;
  guideSlug: string;
  title: string;
  description: string;
  content: string;
  readingTime: string;
  order: number;
};

export type GuideMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  chapterSlugs: string[];
};

export type Guide = GuideMeta & {
  chapters: Chapter[];
  totalReadingTime: string;
};

export type Heading = {
  id: string;
  text: string;
  level: number;
};

function parseChapter(
  guideSlug: string,
  chapterSlug: string,
  raw: string,
  order: number
): Chapter {
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug: chapterSlug,
    guideSlug,
    title: data.title || chapterSlug,
    description: data.description || "",
    content,
    readingTime: stats.text,
    order,
  };
}

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(guidesDir)) return [];

  const dirs = fs
    .readdirSync(guidesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const guides: Guide[] = [];

  for (const dir of dirs) {
    const metaPath = path.join(guidesDir, dir, "_meta.json");
    if (!fs.existsSync(metaPath)) continue;

    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const chapterSlugs: string[] = meta.chapters || [];

    const chapters: Chapter[] = [];
    let totalWords = 0;

    for (let i = 0; i < chapterSlugs.length; i++) {
      const chSlug = chapterSlugs[i];
      const filePath = path.join(guidesDir, dir, `${chSlug}.mdx`);
      if (!fs.existsSync(filePath)) continue;

      const raw = fs.readFileSync(filePath, "utf-8");
      const chapter = parseChapter(dir, chSlug, raw, i);
      chapters.push(chapter);
      totalWords += chapter.content.split(/\s+/).length;
    }

    const totalMinutes = Math.ceil(totalWords / 200);

    guides.push({
      slug: dir,
      title: meta.title || dir,
      description: meta.description || "",
      date: meta.date || "",
      chapterSlugs,
      chapters,
      totalReadingTime: `${totalMinutes} min read`,
    });
  }

  return guides.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getGuide(guideSlug: string): Guide | undefined {
  return getAllGuides().find((g) => g.slug === guideSlug);
}

export function getChapter(
  guideSlug: string,
  chapterSlug: string
): {
  guide: Guide;
  chapter: Chapter;
  prev: Chapter | null;
  next: Chapter | null;
} | undefined {
  const guide = getGuide(guideSlug);
  if (!guide) return undefined;

  const index = guide.chapters.findIndex((c) => c.slug === chapterSlug);
  if (index === -1) return undefined;

  return {
    guide,
    chapter: guide.chapters[index],
    prev: index > 0 ? guide.chapters[index - 1] : null,
    next: index < guide.chapters.length - 1 ? guide.chapters[index + 1] : null,
  };
}

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }
  }

  return headings;
}
