# Jolt ’N Bolt — Independent Website Concept

![Jolt ’N Bolt independent concept design preview](design-preview.png)

*The image above is a design preview, not a screenshot from a tested browser.*

A premium, responsive, interactive café website concept inspired by the **clarity and editorial style** of Teas’n You and Mia Cane. The original existing Jolt ’N Bolt website, branding, customer data and checkout remain untouched.

> **Independent concept only** — not an official Jolt ’N Bolt website. The owner must authorize commercial use, launch, logo/brand usage and the use of any business-specific content before production.

## Open the demo

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8080
```

Visit http://localhost:8080.

No install, build, API key, developer account, payment credentials or environment variables are required. All frontend images are included locally.

## Implemented features

- Photo-led, mobile-first, premium visual identity.
- Interactive menu with 18 publicly listed Jolt ’N Bolt item names, search, category chips and more/fewer controls.
- Featured products and favorites saved to this browser (localStorage).
- Product quick-view dialog, including clearly marked **sample-only** drink size controls.
- Direct links to the existing DoorDash-powered storefront. **No native cart, payments, or fraudulent checkout claims.**
- Published café hours and ordering hours displayed as *reference information only*; actual availability is checked by DoorDash.
- Click-to-call, directions, location, SEO/OG metadata, mobile sticky ordering action.
- Interactive copy-editor demonstration at `/?studio=1` (saved on the same device only, **not** a connected merchant CMS).
- Semantic HTML, keyboard navigation, reduced-motion support, screen-reader labels.

## Ordering URL

`https://order.online/store/~40102287/?hideModal=true`

All customer order buttons open this official merchant ordering storefront in a separate browser tab. Product configuration happens on DoorDash. The sample choices in the product detail modal **do not carry over**.

## Publish to GitHub Pages (when ready)

1. Create a **new public GitHub repository** (e.g. `jolt-n-bolt-concept`). Do not use the café's official branding in the repository description as though you represent the business.
2. Upload **the contents of this folder to the repository root** (`index.html`, `styles.css`, `app.js`, `assets/`). Do not upload only the ZIP.
3. Go to **Settings → Pages** in that repository. Under **Build and deployment**, select **Deploy from a branch**, your main branch, and **/(root)**; save.
4. Once published, the URL will typically be `https://YOUR-USERNAME.github.io/jolt-n-bolt-concept/`.
5. Test the mobile and desktop appearance, image paths, product dialog, favorites, search and external checkout links.
6. Keep the site labeled as an independent concept, use `noindex`, and **do not** point `joltnboltcoffee.com` to it without authorization.

GitHub Pages URLs and settings can change; confirm with GitHub's current documentation if the menu differs.

## Updating demo content

- Edit product data in `app.js` (the `products` array). Each item has name, category, description, image, reference price, featured badge and modifier-preview flag.
- Edit front-page text in `index.html` or try the local preview editor with `?studio=1`.
- Change typography, colors and responsive layout in `styles.css`.
- Replace images in `assets/images/` with owner-approved high-resolution photographs before commercial deployment.
- Do not invent in-stock badges or claim inventory sync: this build has **no live inventory API**.

## Product and pricing accuracy

Product names were collected from publicly visible Jolt ’N Bolt storefront menu listings on Nov 12, 2026. Some reference prices vary between pages or provider checkout contexts. Treat ALL prices as **non-binding public reference prices** and verify before production. Products without a stable public price show “Check price”. Some images depict categories rather than the literal restaurant item.

Sources:
- https://www.joltnboltcoffee.com/
- https://www.joltnboltcoffee.com/menu/
- https://order.online/store/~40102287/?hideModal=true
- https://teasnyou.com/
- https://miacanedmv.com/

## Limits / future production work

- **Ordering:** The current release is a frontend-to-DoorDash handoff, not a POS or DoorDash integration SDK. It does not pass product variations to checkout.
- **Availability:** No real-time product inventory, store-open API or live pickup slots.
- **Admin:** `?studio=1` uses browser localStorage; it is not server-backed, collaborative or secure access control. For production, integrate a permission-controlled CMS (e.g., Sanity) after owner approval.
- **Analytics:** No conversion tracking; only outbound checkout links. Need merchant permission/analytics access for accurate order attribution.
- **Media:** Concept photos are AI-generated/derived from generated concept compositions and are not photos of the actual merchandise or Jolt ’N Bolt location. Do not market them as actual inventory.
- **Store info:** Physical café hours and online ordering hours may differ or change. Verify with the owner before launch.
- **Legal:** Obtain a written agreement on domain ownership, content rights, service scope, payment and support before official deployment.

## Project files

```
index.html             Main website and semantic sections
styles.css             Styling, layout, desktop/mobile breakpoints
app.js                 Menu reference data and interactive behavior
assets/images/         Optimized locally generated concept photographs
assets/favicon.svg     Original concept lightning icon
ASSET-NOTES.md         Image usage and source explanations
```

## V2 QA and menu corrections (Nov 12, 2026)

- **77 distinct menu products indexed**, including all menu categories visible on the public DoorDash pickup storefront at review time. This is a snapshot, not a live API. Owner approval and periodic re-audits are required before official use.
- **18 individual product photographs** now each have a unique image source. Breakfast cards use four newly generated menu-representative sandwich crops (not actual merchant photos); bowls, smoothies, lunch, and juice use distinct representative visuals, with clearly disclosed Unsplash stock photos where applicable.
- **Prices** use the public *pickup* ordering portal rather than the delivery marketplace. We verified Avocado Brioche $9.63; Bacon Ciabatta $9.85; Salmon Lox Bagel $10.95; Açaí $12.25; Matcha Bowl $11.25; Berry Blast $10.73; Chicken Pesto $13.15. Drinks that offer multiple sizes show “Price by size” instead of a made-up price.
- **Direct item links:** We could not verify public per-product DoorDash URLs. Do not fabricate them. The data model includes an optional `orderUrl` property to receive each validated deep link after obtaining links through the merchant account or copying a working URL from the live storefront. Until then, product detail buttons lead to the verified DoorDash store. On supported browsers, the product name is copied to help locate it.
- **Search:** covers names, descriptions, ingredients, categories, synonyms, accents, word prefixes, and modest misspellings. Typing automatically searches across all categories. A text-only index preserves searchable items without inventing photos.
- **Detail images** use `object-fit: contain` rather than stretching or cropping in the preview dialog; gallery cards retain tasteful `object-fit: cover` framing.
- **No merchant integration yet:** Owner consent is needed to connect authenticated inventory, pricing feeds, or true product deep links. The website never collects payment information.

### Third-party editorial photo license/source credits

Representative photo CDN assets in `menu-data.js` come from free-to-use Unsplash photos, not Jolt 'N Bolt's kitchen. Please retain attributions in project documentation and check current license terms before commercial handoff:

- Detox Green Smoothie: Paulina Chmolowska, https://unsplash.com/photos/qlWfxFXl15I
- Superfruit Max: Bakd&Raw / Karolin Baitinger, https://unsplash.com/photos/G-qUSofkSr4
- Chipotle Turkey Sub: Hybrid Storytellers, https://unsplash.com/photos/gX1Y5vEu1jE
- Orange Juice: David Foodphototasty, https://unsplash.com/photos/Ghvuie1Y8Cc
- Tropical Haven: Maja Vujic, https://unsplash.com/photos/7UGP-9j5L0E
- BLT with Avocado: Eiliv Aceron, https://unsplash.com/photos/PlLvvTs-kxU
- Matcha Bowl: Rohtopia, https://unsplash.com/photos/6Ugf0mlKkp4
- Morning Detox: Alexander Mils, https://unsplash.com/photos/nG4ZimMIO_k
- Teriyaki Chicken Power Bowl: joe boshra, https://unsplash.com/photos/GVJAkiE71Kg

The photographs are *representative* of the product category and may not show the precise recipe or presentation. Replace with owner-approved actual product photography for the final commercial launch.
