import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDir = path.join(process.cwd(), "content/blog");

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  seoTitle: string;
  description: string;
  readingTime: string;
  content: string;
};

export type CategoryInfo = {
  name: string;
  count: number;
};

function parsePost(slug: string, raw: string): Post {
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    category: data.category || "Uncategorized",
    tags: data.tags || [],
    seoTitle: data.seoTitle || "",
    description: data.description || "",
    readingTime: stats.text,
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const filePath = path.join(contentDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return parsePost(slug, raw);
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  let filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(contentDir, `${slug}.md`);
    if (!fs.existsSync(filePath)) return undefined;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return parsePost(slug, raw);
}

export function getTagsForCategory(category: string): CategoryInfo[] {
  const posts = getAllPosts().filter((p) => p.category === category);
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const tag of p.tags) {
      map.set(tag, (map.get(tag) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): CategoryInfo[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  for (const p of posts) {
    map.set(p.category, (map.get(p.category) || 0) + 1);
  }
  const order = [
    "Personal",
    "Business",
    "Making Money Online",
    "WordPress",
    "Tools & Reviews",
    "Vibe Code",
  ];
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const ai = order.indexOf(a.name);
      const bi = order.indexOf(b.name);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
