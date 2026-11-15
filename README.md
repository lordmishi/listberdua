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

## Mengisi produk lewat halaman admin (paling mudah)

Buka `https://listberdua.com/admin/` di HP atau komputer. Isi formulir, pilih foto, lalu ketuk "Publikasikan ke situs".

### Pasang sekali per perangkat

1. Di GitHub: foto profil > Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token.
2. Repository access: Only select repositories, pilih repositori situs ini. Permissions > Repository permissions > Contents: Read and write. Buat token, lalu salin.
3. Di halaman admin, buka "Sambungan ke GitHub". Isi Repositori (contoh `lordmishi/listberdua`), Branch `main`, dan tempel token. Ketuk "Simpan sambungan".

Token tersimpan di browser perangkat itu saja. Jangan bagikan token ke siapa pun. Kalau HP hilang, hapus token itu di GitHub.

### Sehari-hari

- Tambah produk: "Tambah produk", isi formulir, "Simpan produk", lalu "Publikasikan ke situs".
- Ubah, hapus, atau atur urutan: tombol di tiap baris, lalu "Publikasikan ke situs".
- Foto dibuat persegi dan diperkecil otomatis, lalu diunggah bersama daftar produk.
- Sebelum mulai di perangkat lain, ketuk "Muat daftar terbaru dari GitHub" supaya tidak menimpa perubahan orang lain.
- Tanpa token: bagian "Tanpa GitHub" bisa membuka dan mengunduh `products.json` untuk diunggah sendiri.

Kalau `sheet-url.txt` berisi link, Google Sheet menimpa daftar setiap jam. Pakai salah satu saja: halaman admin atau sheet.

## Mengisi produk lewat Google Sheet

Produk diisi di Google Sheet. Setiap jam, GitHub membaca sheet itu, memperbarui `src/data/products.json`, dan Cloudflare membangun ulang situs.

### Pasang sekali saja

1. Buka sheets.new, lalu File > Import > Upload, pilih `template-sheet.csv`, pilih "Replace spreadsheet".
2. File > Share > Publish to web. Pilih sheet-nya, ganti "Web page" menjadi "Comma-separated values (.csv)", klik Publish, lalu salin link-nya.
3. Di GitHub, buka file `sheet-url.txt`, klik ikon pensil, tempel link itu, lalu Commit changes.
4. Di GitHub, buka tab Actions. Kalau diminta, klik tombol untuk mengaktifkan workflow.

### Kolom sheet

Satu baris adalah satu produk. Baris pertama (nama kolom) jangan diubah.

| Kolom | Isi |
|---|---|
| `nama` | Wajib. Nama produk. |
| `kategori` | Wajib. Salah satu: Dapur & Tata Rumah, Ibu & Bayi, Kamar & Penyimpanan, Kerja & Gadget Harian, Stok Bulanan. |
| `koleksi` | Nama koleksi, pisahkan dengan `;`. Boleh kosong. |
| `harga` | Angka saja, misalnya `149000`. |
| `terjual`, `badge` | Salin dari halaman Shopee, misalnya `10RB+ terjual` dan `Shopee Mall`. Boleh kosong. |
| `tag` | Satu kalimat pendek di bawah nama produk. |
| `foto` | Link foto yang diawali `https://`, atau `/images/products/nama.jpg` kalau fotonya diunggah ke folder `public/images/products/` di GitHub. |
| `link_shopee` | Link afiliasi dari dasbor Shopee Affiliate. |
| `keunggulan_1` sampai `keunggulan_3` | Poin "Kenapa Masuk ListBerdua". |
| `kata_istri`, `catatan_suami` | Catatan asli kalian berdua. |
| `cocok_untuk`, `perhatikan` | Cocok untuk siapa, dan satu hal yang perlu diperhatikan. |
| `tampil` | Tulis `tidak` untuk menyembunyikan produk tanpa menghapus barisnya. |
| `slug` | Boleh kosong. Alamat halaman dibuat dari nama. Isi kolom ini kalau ingin mengganti nama tanpa mengubah alamat halaman. |

### Sehari-hari

- Tambah produk: tambah baris baru. Ubah: ganti isi sel. Hapus: hapus baris, atau tulis `tidak` di kolom `tampil`.
- Perubahan muncul di situs paling lama sekitar satu jam. Supaya langsung: GitHub > Actions > "Ambil produk dari Google Sheet" > Run workflow.
- Baris yang salah (kategori tidak dikenal, nama kembar) dilewati dan disebut di log Actions. Produk lain tetap tampil.
- Kalau sheet kosong atau tidak bisa dibuka, situs tetap memakai daftar terakhir.
- Jangan mengedit `src/data/products.json` dengan tangan. Isinya ditimpa oleh sheet.

Kategori ada di `src/data/categories.json`, koleksi di `src/data/site.ts`.

## Mengisi produk lewat JSON (tanpa sheet)

Kalau `sheet-url.txt` dibiarkan kosong, sheet tidak dipakai dan situs membaca `src/data/products.json` apa adanya.

1. Di GitHub, buka `src/data/products.json` dan klik ikon pensil.
2. Ganti isinya (misalnya tempel JSON baru), lalu klik Commit changes.
3. Cloudflare membangun ulang situs dalam satu sampai dua menit.

Pilih satu cara saja. Kalau `sheet-url.txt` berisi link, isi `products.json` ditimpa oleh sheet setiap jam.

## Sebelum situs dipublikasikan

1. Ganti empat produk contoh di sheet dengan produk asli. Catatan istri dan suami yang sekarang adalah teks contoh, bukan pengalaman kalian.
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
src/data/products.json   daftar produk (ditulis otomatis dari Google Sheet)
scripts/sync-sheet.mjs   pembaca sheet
sheet-url.txt            link CSV sheet
template-sheet.csv       contoh isi sheet
src/data/site.ts         nama situs, kategori, koleksi, sampleMode
src/lib/catalog.ts       fungsi bantu (cek foto, cek link, pencarian)
src/pages/               halaman: beranda, kategori, koleksi, produk, favorit, admin, tentang, afiliasi, privasi
src/components/          kartu produk, pil kategori, kartu koleksi
src/styles/global.css    warna dan gaya dasar
public/                  foto, favicon, robots.txt, _headers
```
