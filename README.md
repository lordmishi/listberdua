# ListBerdua (listberdua.com)

Situs statis berisi daftar produk pilihan suami dan istri. Tombol beli membuka Shopee lewat link afiliasi. Dibuat dengan Astro dan Tailwind CSS, siap untuk Cloudflare Pages.

## Menjalankan di komputer

Butuh Node 22.23.4 atau lebih baru.

```bash
npm install
```

```bash
npm run dev
```

Buka `http://localhost:4321`.

## Mengisi produk

Semua produk ada di `src/data/products.json`. Satu blok `{ ... }` adalah satu produk.

| Kolom | Isi |
|---|---|
| `id`, `slug` | Nama pendek unik tanpa spasi. `slug` menjadi alamat halaman: `/produk/slug/`. |
| `name` | Nama produk. |
| `category`, `categorySlug` | Harus sama dengan salah satu kategori di `src/data/site.ts`. |
| `collection` | Daftar nama koleksi, harus sama persis dengan nama di `src/data/site.ts`. Boleh kosong: `[]`. |
| `priceEstimate` | Contoh: `Rp149.000`. |
| `soldLabel`, `storeBadge` | Salin dari halaman Shopee. Hapus kolomnya kalau tidak ada. |
| `quickTag` | Satu kalimat pendek di kartu produk. |
| `image` | Simpan foto di `public/images/products/`, lalu tulis `/images/products/nama.jpg` (harus diawali `/`). Foto persegi, minimal 800 px. |
| `affiliateUrl` | Link dari dasbor Shopee Affiliate. Harus `https://` dan beralamat shopee.co.id atau shope.ee. |
| `highlights` | Poin "Kenapa Masuk ListBerdua". |
| `wifeNote`, `husbandNote` | Catatan asli istri dan suami. |
| `bestFor`, `caveat` | Cocok untuk siapa, dan satu hal yang perlu diperhatikan. |

Kategori dan koleksi diatur di `src/data/site.ts`.

## Sebelum situs dipublikasikan

1. Ganti empat produk contoh dengan produk asli. Catatan istri dan suami yang sekarang adalah teks contoh, bukan pengalaman kalian.
2. Ganti semua `CONTOH_LINK_AFFILIATE` dengan link afiliasi asli. Selama link masih contoh, tombol beli tidak aktif.
3. Tambahkan foto produk.
4. Isi `contactEmail` di `src/data/site.ts`.
5. Baca halaman Tentang, Pengungkapan Afiliasi, dan Kebijakan Privasi, lalu sesuaikan dengan keadaan kalian.
6. Terakhir, ubah `sampleMode` menjadi `false` di `src/data/site.ts`. Ini menghapus pita "Mode contoh" dan mengizinkan Google mengindeks situs.

Kalau nanti memasang alat analitik atau iklan, perbarui dulu halaman Kebijakan Privasi.

## Deploy ke Cloudflare Pages

1. Unggah folder ini ke repositori GitHub.
2. Di Cloudflare: Workers & Pages > Create > Pages > Connect to Git, pilih repositorinya.
3. Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`.
4. Tambahkan environment variable `NODE_VERSION` = `22.23.4`.
5. Setelah deploy pertama berhasil, buka Custom domains dan sambungkan `listberdua.com`.

## Struktur

```
src/data/products.json   daftar produk
src/data/site.ts         nama situs, kategori, koleksi, sampleMode
src/lib/catalog.ts       fungsi bantu (cek foto, cek link, pencarian)
src/pages/               halaman: beranda, kategori, koleksi, produk, tentang, afiliasi, privasi
src/components/          kartu produk, pil kategori, kartu koleksi
src/styles/global.css    warna dan gaya dasar
public/                  foto, favicon, robots.txt, _headers
```
