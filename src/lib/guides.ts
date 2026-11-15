// guides.json may not exist yet on a fresh copy; a missing file means no guides instead of a failed build.
const files = import.meta.glob('../data/guides.json', { eager: true, import: 'default' });
const raw = (Object.values(files)[0] ?? []) as unknown[];
import { products, imageOf } from './catalog';
import { productSlugsIn, type Guide } from './guide';

export const guides = (raw as Guide[]).slice().sort((a, b) => b.date.localeCompare(a.date));

// A guide's picture is the photo of the first product it shows.
export function coverOf(guide: Guide): string | null {
  for (const slug of productSlugsIn(guide.body)) {
    const product = products.find((p) => p.slug === slug);
    const photo = product ? imageOf(product) : null;
    if (photo) return photo;
  }
  return null;
}
