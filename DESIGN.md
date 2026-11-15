# Design direction

Source: the owner's second reference (a furniture shopping app). Reading: a curated product directory for young Indonesian couples, opened on a phone. Dial: ENERGY 2 / RHYTHM 2 / MOTION 2.

| Decision | Reason |
|---|---|
| White page, grey `#F3F3F3` tiles and pills, ink `#292D32` | The reference palette. Product photos are the only color in the list. |
| Dark brown panel `#3A2D2C` for collection banners, the product photo backdrop, and "Catatan Suami" | The reference's one dark surface, used where the page needs weight. White text on it measures 13:1. |
| Bold, tight headings | The reference's Helvetica voice. |
| Inter on every device | Helvetica Neue cannot be legally hosted on a website, and relying on a locally installed copy broke on a PC that had only its italic style. Inter is bundled with the site, so every visitor sees the same thing. |
| Header with round avatar, name, and a round search button | Matches the reference; the search field opens on tap so the header stays one row on phones. |
| Collection banners with a white pill button | The reference's "New Collection" banner. Each shows a product photo from its collection, or the couple illustration until one exists. |
| Staggered two-column cards on phones | The reference's pinboard rhythm. Desktop uses an aligned grid. |
| Heart on every photo, with a Favorit tab | The reference has hearts. Here they work: saved on the visitor's device, no account. |
| Four-tab bar below desktop width: Beranda, Koleksi, Panduan, Favorit | The reference has four tabs. Tentang moved to the footer and the desktop header. |
| Desktop header menu | Desktop has no bottom bar, so the same places sit in the header. |
| Product photo 4:3 on phones, square on wider screens | On a phone the name and price must be visible above the fixed buy button on the first screen. |
| Share row (WhatsApp, Threads, copy, native share sheet) at the end of product, collection and guide pages | Shown after the reader has the information, so it never competes with the buy button. |
| Owner dashboard without the public frame | The owner page is a work tool; public search and tabs would only be noise there. |
| Product page: photo on the brown panel, round back and heart buttons, dark pill buy button fixed at the bottom | The reference's product screen. The tab bar is hidden there so the buy button is the only fixed control. |
| Price under the product name on cards, not beside it | Product names here are long; side by side they were cut to one word. |
| A wife or husband quote on every card | Not in the reference. It is the one thing a Shopee search cannot offer. |
| No bell, no profile, no photo dots | The site has no notifications, accounts, or photo galleries. Controls that do nothing are left out. |
| Logo colors only in the logo and the illustration | The interface stays neutral so the logo is the warm element. |
| Photo travels from card to product page; intro rises in once; cards fade up on scroll | Three motion moments, all off under the reduce-motion setting. |
| Round icon buttons with a small dark tooltip (heart, back, search, share) | From the owner's interaction reference. Tooltips show on mouse hover and keyboard focus; every icon button also has a spoken name. |
| Active tab, menu item and category pill slide to their new place on page change | The reference's sliding segmented control, done with view transitions, so it costs no extra script. |
| Sort menu opens out of its button (clipped corner, blur, slight overshoot) | The reference's morphing picker, applied to the one choice shoppers need on a list: order by price. |
| Light theme only | The reference is light, and product photos have white backgrounds. |
