import categoryList from './categories.json';

export const site = {
  name: 'ListBerdua',
  url: 'https://listberdua.com',
  tagline: 'Pilihan Suami & Istri, Siap Masuk Keranjang.',
  description:
    'Daftar barang rumah tangga dan keluarga muda yang sudah dipilih suami dan istri, lengkap dengan catatan dari keduanya. Tombol beli langsung ke Shopee.',

  // While true: a warning bar shows on every page and search engines are told not to index.
  // Set to false only after products.json holds real products, real notes, and real affiliate links.
  sampleMode: false,

  // Shown on the legal pages. Leave empty to show a visible "not filled in yet" marker.
  contactEmail: 'halo@listberdua.com',

  policyUpdated: '15 November 2026',
};

// Shared with scripts/sync-sheet.mjs, which matches the sheet's "kategori" column against these names.
export const categories = categoryList;

// "name" must match the text in each product's "collection" array.
export const collections = [
  {
    slug: 'checklist-isi-dapur-pertama',
    name: 'Checklist Isi Dapur Pertama',
    blurb: 'Untuk pasangan yang baru pindah dan dapurnya masih kosong.',
  },
  {
    slug: 'persiapan-lahiran-tas-rs',
    name: 'Persiapan Lahiran & Tas RS',
    blurb: 'Yang perlu dibeli sebelum HPL, dari isi tas RS sampai kebutuhan menyusui.',
  },
];
