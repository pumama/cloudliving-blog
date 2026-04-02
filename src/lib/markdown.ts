import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

export async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return result.toString();
}
