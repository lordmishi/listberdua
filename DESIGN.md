# Design direction

Source: the owner's reference (a monochrome curated-fashion app). Reading: a curated product directory for young Indonesian couples, opened on a phone. Dial: ENERGY 2 / RHYTHM 2 / MOTION 2.

| Decision | Reason |
|---|---|
| Page `#F2F3F5`, white tiles, ink `#292D32` | The three colors of the reference. Product photos sit on white tiles, so the photo is the only color on screen. |
| Logo colors (orange, navy, sage) appear only in the logo and the hero illustration | The interface stays monochrome so the logo is the one warm thing on the page. |
| Home hero is a white tile with the couple from the logo | It introduces who picks the products, which is the point of the brand. |
| Thin uppercase headline in the hero | The reference's "CURATED FASHION" voice. Used once, on the home page only. |
| SF Pro via the system stack, Inter elsewhere | SF Pro cannot be legally hosted on a website. Apple devices show it natively; Android and Windows get Inter, its closest match, bundled with the site. |
| Dark full-width buy button | Same as the reference's "Add to cart". It is the only dark button on a product page. |
| "Kata Istri" on white, "Catatan Suami" on ink | The two voices are the identity of ListBerdua, so the pair is the one place the page shows strong contrast. |
| Collections as dark cards | Separates "lists to open" from "products to buy" at a glance. |
| Text under the tile, not inside a bordered card | Matches the reference and keeps the grid light with two columns on a phone. |
| No hearts, no bottom tab bar, no profile | The reference has them, but this site has no favorites, accounts, or settings. Controls that do nothing are left out. |
| Light theme only | The reference is light, and product photos have white backgrounds. |
| Product photo travels from its card to the product page | Shows that the page you land on is the item you tapped. |
| Hero text and couple rise in on the first load only | One entrance moment; it does not replay when you come back to the home page. |
| Cards below the fold fade up as they scroll in | Gives the list a rhythm while scrolling; cards already on screen never animate. |
| All motion is switched off under the phone's reduce-motion setting | Motion is decoration here, never information. |
