# Asset Capture Guide

This guide maps the temporary preview-only demo mode to the exact screens needed for the short promo video.

## Preview Mode

Use the query string below on local development:

`?preview=video`

This injects demo collections, demo products, and demo reviews for recording only. Normal site behavior remains unchanged when the query string is absent.

## Capture URLs

### 1. Homepage Hero

`http://127.0.0.1:3000/?preview=video`

Capture:

- full hero
- hero with search bar visible
- optional slow scroll into featured products

### 2. Shop Landing / Collections

`http://127.0.0.1:3000/shop?preview=video`

Capture:

- full collection grid
- gentle focus on the `Radiance`, `Barrier Care`, and `Body Ritual` cards

### 3. All Products

`http://127.0.0.1:3000/shop/all-products?preview=video`

Capture:

- filters visible
- first product row
- category chips

### 4. Search View

`http://127.0.0.1:3000/shop/all-products?preview=video&q=essence`

Capture:

- search result state
- visible product match

### 5. Collection Detail

`http://127.0.0.1:3000/shop/barrier-care?preview=video`

Capture:

- collection hero
- product listing beneath

### 6. Product Detail

`http://127.0.0.1:3000/shop/radiance/glass-skin-essence?preview=video`

Capture:

- product hero image
- product info block
- description panel
- review area

### 7. Cart / Checkout

Recommended flow:

1. Open any preview-mode product page
2. Add item to cart
3. Open the cart drawer if it is not already open
4. Capture:
   - cart items
   - coupon field
   - total area
   - WhatsApp order button

## Screenshot Naming Convention

- `01-home-hero.png`
- `02-home-featured.png`
- `03-shop-collections.png`
- `04-all-products.png`
- `05-search-results.png`
- `06-product-detail.png`
- `07-product-reviews.png`
- `08-cart-checkout.png`
- `09-closing-frame.png`

## Recording Direction

- capture at 1600x1000 or larger for flexibility
- keep cursor movement minimal and intentional
- avoid rapid scrolling
- allow 1 to 2 seconds of stillness before and after each movement
- if recording screen video, scroll slowly enough that text remains readable

## Editing Suggestion

If you are cutting the final video outside the app:

1. Start with the homepage hero
2. Dissolve into collections
3. Cut to all-products browsing
4. Move into product detail
5. Finish with the cart and WhatsApp checkout
6. Close on a clean brand frame from the hero
