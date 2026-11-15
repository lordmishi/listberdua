export const site = {
  name: 'ListBerdua',
  url: 'https://listberdua.com',
  tagline: 'Pilihan Suami & Istri, Siap Masuk Keranjang.',
  description:
    'Daftar barang rumah tangga dan keluarga muda yang sudah dipilih suami dan istri, lengkap dengan catatan dari keduanya. Tombol beli langsung ke Shopee.',

  // While true: a warning bar shows on every page and search engines are told not to index.
  // Set to false only after products.json holds real products, real notes, and real affiliate links.
  sampleMode: true,

  // Shown on the legal pages. Leave empty to show a visible "not filled in yet" marker.
  contactEmail: '',

  policyUpdated: '15 November 2026',
};

export const categories = [
  { slug: 'dapur-tata-rumah', name: 'Dapur & Tata Rumah', blurb: 'Alat masak, rak, dan perlengkapan beres-beres.' },
  { slug: 'ibu-bayi', name: 'Ibu & Bayi', blurb: 'Kebutuhan hamil, lahiran, menyusui, dan bayi baru lahir.' },
  { slug: 'kamar-penyimpanan', name: 'Kamar & Penyimpanan', blurb: 'Kasur, lemari, boks, dan penata ruang.' },
  { slug: 'kerja-gadget-harian', name: 'Kerja & Gadget Harian', blurb: 'Perlengkapan kerja di rumah dan gadget sehari-hari.' },
  { slug: 'stok-bulanan', name: 'Stok Bulanan', blurb: 'Barang habis pakai yang dibeli ulang tiap bulan.' },
];

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
