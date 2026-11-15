// Reads the published Google Sheet (CSV) and rewrites src/data/products.json.
// Usage: node scripts/sync-sheet.mjs [csv-url-or-file]. Without an argument it reads sheet-url.txt.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const OUT = 'src/data/products.json';
const categories = JSON.parse(readFileSync('src/data/categories.json', 'utf8'));

function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function slugify(text) {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

// Accepts 149000, "149.000" or "Rp149.000" and returns "Rp149.000". Other text is kept as typed.
function formatPrice(raw) {
  const digits = raw.replace(/^rp\s*/i, '').replace(/\./g, '');
  return /^\d+$/.test(digits) ? 'Rp' + Number(digits).toLocaleString('id-ID') : raw;
}

async function readSource(source) {
  if (!/^https?:\/\//.test(source)) return readFileSync(source, 'utf8');
  const res = await fetch(source, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Sheet tidak bisa dibuka (HTTP ${res.status}).`);
  const text = await res.text();
  // An unpublished sheet answers with a login page instead of CSV.
  if (/^\s*<(!doctype|html)/i.test(text)) throw new Error('Link sheet belum dipublikasikan sebagai CSV.');
  return text;
}

const source = process.argv[2] || (existsSync('sheet-url.txt') ? readFileSync('sheet-url.txt', 'utf8').trim() : '');
if (!source) {
  console.log('sheet-url.txt masih kosong, tidak ada yang disinkronkan.');
  process.exit(0);
}

const rows = parseCsv(await readSource(source));
const header = (rows.shift() ?? []).map((h) => h.trim().toLowerCase());
const required = ['nama', 'kategori'];
const missing = required.filter((h) => !header.includes(h));
if (missing.length) {
  console.error(`Kolom wajib tidak ada di baris pertama sheet: ${missing.join(', ')}`);
  process.exit(1);
}

const products = [];
const skipped = [];
const usedSlugs = new Set();

rows.forEach((cells, index) => {
  const line = index + 2;
  const r = Object.fromEntries(header.map((h, i) => [h, (cells[i] ?? '').trim()]));
  if (!r.nama && !r.kategori) return;
  if (/^(tidak|no|0|false)$/i.test(r.tampil ?? '')) return;
  if (!r.nama) return skipped.push(`Baris ${line}: kolom "nama" kosong.`);

  const category = categories.find((c) => c.name.toLowerCase() === r.kategori.toLowerCase() || c.slug === r.kategori);
  if (!category) {
    return skipped.push(`Baris ${line} (${r.nama}): kategori "${r.kategori}" tidak dikenal. Pilihan: ${categories.map((c) => c.name).join(', ')}.`);
  }

  let slug = slugify(r.slug || r.nama);
  if (!slug) return skipped.push(`Baris ${line}: nama tidak bisa dijadikan alamat halaman.`);
  if (usedSlugs.has(slug)) return skipped.push(`Baris ${line} (${r.nama}): nama atau slug sama dengan baris lain.`);
  usedSlugs.add(slug);

  const product = {
    id: slug,
    slug,
    name: r.nama,
    category: category.name,
    categorySlug: category.slug,
    collection: (r.koleksi ?? '').split(';').map((c) => c.trim()).filter(Boolean),
    priceEstimate: formatPrice(r.harga ?? ''),
    soldLabel: r.terjual,
    storeBadge: r.badge,
    quickTag: r.tag,
    image: r.foto,
    affiliateUrl: r.link_shopee,
    highlights: [r.keunggulan_1, r.keunggulan_2, r.keunggulan_3].filter(Boolean),
    wifeNote: r.kata_istri,
    husbandNote: r.catatan_suami,
    bestFor: r.cocok_untuk,
    caveat: r.perhatikan,
  };
  // Empty cells are dropped so the pages hide those parts.
  for (const key of Object.keys(product)) if (product[key] === '' || product[key] === undefined) delete product[key];
  products.push(product);
});

skipped.forEach((message) => console.warn('DILEWATI. ' + message));

// An empty result almost always means a broken sheet, so the live list is kept.
if (products.length === 0) {
  console.error('Tidak ada produk yang valid di sheet. products.json tidak diubah.');
  process.exit(1);
}

writeFileSync(OUT, JSON.stringify(products, null, 2) + '\n');
console.log(`${products.length} produk ditulis ke ${OUT}. ${skipped.length} baris dilewati.`);
