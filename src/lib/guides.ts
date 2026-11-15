import raw from '../data/guides.json';
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
