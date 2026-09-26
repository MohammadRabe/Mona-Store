# Mona Store

A bilingual (English/Arabic) React storefront demo for a curated makeup and skincare shop.

## Run locally

```sh
npm install
npm run dev
```

## Demo features

- English and Arabic UI with RTL layout, remembered across visits
- Light and dark themes, remembered across visits
- Seeded product catalog with category filters, search, sorting, ratings, and reviews
- Egyptian pound demo pricing, product detail pages, and pointer-following image magnification
- Wishlist, cart quantities, subtotal, and a free-shipping progress indicator
- Responsive storefront and mobile navigation

## Backend integration

`src/services/productsApi.js` is the catalog boundary. It currently returns the seeded records in `src/data/demoProducts.js`; replace its `list()` implementation with a `fetch()` call to the products endpoint. Each product has a stable `id`, localized `name`, `category`, `price`, `rating`, `reviews`, and image URL identifier. Cart and wishlist state are currently client-side demo state; these can move behind customer/cart API methods when those endpoints are available.

Product imagery and the web fonts load from Unsplash and Google Fonts, so the demo requires an internet connection for those assets.
