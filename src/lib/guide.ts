// Guide bodies are plain text written in the dashboard:
//   blank line        new paragraph
//   ## Heading        section heading
//   - item            bullet list
//   [produk: slug]    a product card (consecutive lines become one grid)
// Everything is treated as text, never as HTML.

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  date: string;
  body: string;
}

export type Block =
  | { type: 'h'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'products'; slugs: string[] };

const PRODUCT_LINE = /^\[produk:\s*([a-z0-9-]+)\s*\]$/i;

export function parseGuide(body: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: 'p', text: paragraph.join(' ') });
    paragraph = [];
  };
  for (const raw of body.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    const last = blocks[blocks.length - 1];
    if (!line) {
      flush();
      continue;
    }
    const product = PRODUCT_LINE.exec(line);
    if (product) {
      flush();
      if (last?.type === 'products' && !paragraph.length) last.slugs.push(product[1].toLowerCase());
      else blocks.push({ type: 'products', slugs: [product[1].toLowerCase()] });
      continue;
    }
    if (line.startsWith('## ')) {
      flush();
      blocks.push({ type: 'h', text: line.slice(3).trim() });
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flush();
      const item = line.replace(/^[-*]\s+/, '');
      if (last?.type === 'ul') last.items.push(item);
      else blocks.push({ type: 'ul', items: [item] });
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return blocks;
}

export function productSlugsIn(body: string): string[] {
  return parseGuide(body).flatMap((b) => (b.type === 'products' ? b.slugs : []));
}
