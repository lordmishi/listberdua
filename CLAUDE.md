# Project: ListBerdua (`listberdua.com`)

## Overview
ListBerdua is a mobile-first curated product directory web application for Indonesian young couples and young families ("Pasangan Muda & Keluarga Muda").
Tagline: "Pilihan Suami & Istri, Siap Masuk Keranjang."
It is NOT an e-commerce store with a shopping cart. It acts as a clean, trustworthy product filter/curator that helps visitors avoid endless scrolling on Shopee, provides honest husband-and-wife mini-reviews, and redirects buyers directly to the Shopee app via affiliate links.

## Tech Stack & Hosting Target
- **Framework:** Astro (Static Site Generation / `output: 'static'`) or Next.js Static Export (`output: 'export'`). Use **Astro + Tailwind CSS** by default for ultra-fast mobile loading and zero unnecessary client JS.
- **Deployment Target:** Cloudflare Pages (100% static build output in `dist/` or `out/`). No paid backend or database server required.
- **Data Source:** Local JSON file at `src/data/products.json` (plus optional `src/data/collections.json`).

## Design & UX Requirements (Mobile-First)
1. **Color Palette & Tone:** Neutral shopping-app look taken from the owner's reference (see `DESIGN.md`): white page, grey `#F3F3F3` tiles and pills, ink `#292D32`, dark brown panel `#3A2D2C`. Bold headings. Inter (bundled) on every device; do not put locally installed fonts first in the stack. Prices (and only prices) use `--color-price` #B5452A; no other accent colors in the interface.
2. **One-Handed Mobile Ergonomics:**
   - Sticky top header with brand wordmark **ListBerdua** and instant client-side search input ("Cari produk atau kebutuhan...").
   - Horizontal scrollable category pills right below the header:
     - `Semua`
     - `Dapur & Tata Rumah`
     - `Ibu & Bayi`
     - `Kamar & Penyimpanan`
     - `Kerja & Gadget Harian`
     - `Stok Bulanan`
   - 2-column compact product grid on mobile (`grid-cols-2 gap-3`), expanding to 3–4 columns on desktop (`md:grid-cols-3 lg:grid-cols-4`).
3. **Product Card (`/` and `/kategori/[slug]`):**
   - Square product image (`aspect-square object-cover rounded-lg`) with subtle top badge (e.g., `Shopee Mall`, `Star+`, `Pilihan Favorit`).
   - Product title (max 2 lines `line-clamp-2`).
   - Estimated price in IDR (e.g., `Rp145.000`) + social proof tag (e.g., `10RB+ terjual`).
   - 1-line quick highlight badge (e.g., `"Anti lengket & awet"`).
4. **Product Detail Page (`/produk/[slug]`) — Crucial for SEO & Trust (Avoid Thin Affiliation):**
   - Clean product gallery / main image, title, category breadcrumb, store badge (`Shopee Mall` / `Star+`), sold count, and estimated price.
   - Prominent full-width sticky or high-contrast CTA button: **"Buka di Aplikasi Shopee"** with `target="_blank" rel="sponsored noopener noreferrer"`.
   - Honest price disclaimer directly under the button: *"Harga dan stok di Shopee dapat berubah sewaktu-waktu. Cek detail terbaru sebelum checkout."*
   - Structured original mini-review sections (to prevent Google thin-affiliation penalties):
     - **Kenapa Masuk ListBerdua** (bullet points of key strengths)
     - **Kata Istri** (practical daily usage perspective)
     - **Catatan Suami** (build quality, durability, value-for-money perspective)
     - **Cocok Untuk & Catatan** (who should buy it + honest caveat/size note)
5. **Curated Collections Section (Homepage):**
   - Featured horizontal cards for curated bundles/checklists, e.g., *"Checklist Isi Dapur Pertama"* and *"Persiapan Lahiran & Tas RS"*.
6. **Required Compliance Pages & Footer:**
   - Footer must include links to `/tentang` (Tentang ListBerdua), `/pengungkapan-afiliasi` (Affiliate Disclosure explaining Shopee Affiliate commission at no extra cost to buyers), and `/kebijakan-privasi` (Privacy Policy).
   - Never use Shopee's official logo or claim official affiliation/endorsement from Shopee.

## Technical & Deep-Link Considerations
- Outbound Shopee links must open cleanly (`target="_blank" rel="sponsored noopener noreferrer"`) so mobile browsers and social media in-app WebViews hand off smoothly to the installed Shopee app.
- Include proper SEO meta tags (`title`, `description`, Open Graph tags, canonical URLs using `https://listberdua.com`) and JSON-LD `Product` schema (with `offers` marked appropriately or descriptive review schema) on product pages.
- Build a responsive, clean, zero-clutter MVP first.
## Commands
- `npm run dev` starts the local site, `npm run build` writes the static site to `dist/`.
- Node 22.23.4 or newer (see `.nvmrc`).

## Project rules
- `src/data/site.ts` has `sampleMode`. While true, every page shows a warning bar and is marked noindex. Never set it to false while products.json still holds sample notes or CONTOH links.
- Notes in "Kata Istri" and "Catatan Suami" must be written by the owners from real use. Do not generate them.
- Buy buttons only go live for `https://` links on shopee.co.id or shope.ee (`affiliateLinkOf` in `src/lib/catalog.ts`).
- Products come from `src/data/products.json`. If `sheet-url.txt` holds a published Google Sheet CSV link, `scripts/sync-sheet.mjs` (run hourly by `.github/workflows/sync-products.yml`) overwrites that file; if it is empty, the JSON is edited by hand.
- Logo assets live in `public/brand/`. The UI stays monochrome except prices in `--color-price`.
- `/admin/` is the owner's product editor. It publishes through the GitHub contents API with a token kept in the owner's browser. `/favorit/` shows hearts saved in the visitor's localStorage. Both are noindex and left out of the sitemap.
- Phones and tablets (below `lg`) get a four-tab bottom bar (Beranda, Koleksi, Panduan, Favorit); product pages hide it and show the fixed buy button instead. Desktop shows the same places plus Tentang in the header.
- `/admin/` renders with `<Base owner>`: no public search, menus, or footer.
- Guides (`/panduan/`) live in `src/data/guides.json`, written from the dashboard. Body syntax is parsed by `src/lib/guide.ts` (paragraphs, `## ` headings, `- ` lists, `[produk: slug]` product cards); it is text only, never HTML.
- Products carry `priceCheckedAt` (YYYY-MM-DD). The product page shows it; the dashboard lists prices older than 30 days.
- Share buttons (`ShareButtons.astro`) add `?src=wa|threads|salin|bagikan` so the stats show the source.
- Collection banners: `public/images/koleksi/<collection-slug>.jpg` (uploaded from the dashboard) wins over the first product photo, then the couple illustration. Empty collections are hidden on the home page.
- Visit statistics: `worker/index.js` (configured in `wrangler.jsonc`) serves the static site and `/api/hit` + `/api/stats`, storing only per-day counters in D1 (binding `DB`). `/api/stats` needs the `STATS_KEY` secret. Pages send counts via `sendBeacon` from `Base.astro`; buy buttons carry `data-klik`. No IPs or cookies; GPC/DNT and the owner's opt-out flag skip counting. Deploy command must be `npx wrangler deploy`.
- Interaction patterns: `.tip` + `data-tip` gives icon buttons a hover/focus tooltip (`data-tip-align`, `data-tip-below`); active tab, header link and category pill carry `transition:name` so they slide between pages; `SortMenu.astro` sorts the `.kisi-produk` grid in its section by `data-harga`.
- Home: `HeroBanners.astro` (swipe row: intro + collections with products + newest guide; dots on phones, arrows on wider screens), "Baru kami tambahkan" (products with `addedAt`), then `ProductBrowser.astro` (price bands, show 12 at a time, sort). The grid's phone pinboard offset uses the `.geser` class set by `restagger()` in `Base.astro`.
- Products may carry `addedAt` (set by the dashboard; "Baru" for 21 days), `gallery` (extra photo paths, "Foto dari kami") and `videoUrl` (TikTok/Instagram/YouTube only).
- `src/data/pengaturan.json` (optional, written by the dashboard) holds `whatsapp` (62...) for the "Tanya kami" button. Collection pages are checklists stored in localStorage `lb-cek-<slug>`. `/bandingkan/?a=&b=` compares two products (noindex, not in sitemap).
