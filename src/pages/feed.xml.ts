import type { APIRoute } from "astro";
import { getAllPosts } from "../lib/posts";

export const GET: APIRoute = () => {
  const posts = getAllPosts();
  const siteUrl = "https://www.cloudliving.com";

  const items = posts
    .slice(0, 20)
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      <category>${post.category}</category>
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cloud Living — Tung Tran</title>
    <link>${siteUrl}</link>
    <description>Personal blog by Tung Tran. Lessons from building internet businesses, investing, and living life on my own terms.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/xml" },
  });
};
