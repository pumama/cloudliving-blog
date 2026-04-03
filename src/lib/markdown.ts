import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import { slugify } from "./posts";

function addHeadingIds(html: string): string {
  return html.replace(
    /<(h[23])>(.*?)<\/h[23]>/g,
    (_match, tag, text) => {
      const plainText = text.replace(/<[^>]+>/g, "").trim();
      const id = slugify(plainText);
      return `<${tag} id="${id}">${text}</${tag}>`;
    }
  );
}

export async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return addHeadingIds(result.toString());
}
