import { existsSync } from 'node:fs';
import { join } from 'node:path';
import raw from '../data/products.json';
import { categories, collections } from '../data/site';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  collection: string[];
  priceEstimate: string;
  soldLabel?: string;
  storeBadge?: string;
  quickTag?: string;
  image?: string;
  affiliateUrl?: string;
  highlights: string[];
  wifeNote?: string;
  husbandNote?: string;
  bestFor?: string;
  caveat?: string;
  // ISO date (YYYY-MM-DD) of the last time the owners checked the price on Shopee.
  priceCheckedAt?: string;
}

export const products = raw as Product[];

export function byCategory(slug: string) {
  return products.filter((p) => p.categorySlug === slug);
}

export function byCollection(name: string) {
  return products.filter((p) => p.collection?.includes(name));
}

export function categoryOf(p: Product) {
  return categories.find((c) => c.slug === p.categorySlug);
}

export function collectionsOf(p: Product) {
  return collections.filter((c) => p.collection?.includes(c.name));
}

// A missing photo renders a labelled placeholder instead of a broken image.
export function imageOf(p: Product): string | null {
  if (!p.image) return null;
  if (/^https:\/\//.test(p.image)) return p.image;
  // Local photos must be root-relative, or they break on nested routes.
  if (!p.image.startsWith('/') || p.image.includes('..')) return null;
  return existsSync(join(process.cwd(), 'public', p.image)) ? p.image : null;
}

const SHOPEE_HOSTS = /(^|\.)(shopee\.co\.id|shope\.ee)$/;

// Only real Shopee links become live buttons; CONTOH_LINK placeholders do not.
export function affiliateLinkOf(p: Product): string | null {
  const raw = p.affiliateUrl?.trim() ?? '';
  if (raw.includes('CONTOH_LINK')) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && SHOPEE_HOSTS.test(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

export function priceNumber(p: Product): number | null {
  // Ranges and "juta" style prices are shown as text but not sent to search engines.
  const match = /^Rp\s?(\d{1,3}(?:\.\d{3})*)$/.exec((p.priceEstimate ?? '').trim());
  return match ? parseInt(match[1].replace(/\./g, ''), 10) : null;
}

export function searchText(p: Product): string {
  return [p.name, p.category, p.quickTag, p.bestFor, ...(p.collection ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
