# ShopLite: Product Listing & Detail (Leegality Frontend Assessment)

An Amazon-style product listing and detail app built with **React 19 (JavaScript), React Router and Tailwind CSS**, using the public [DummyJSON products API](https://dummyjson.com/docs/products).

- **Live demo:** _add your Vercel link here_
- **Repository:** _add your GitHub link here_

## Features

**Product listing page (`/`)**
- Filters on the left, product grid on the right, pagination at the bottom.
- Product cards show the image, title, brand, price and star rating. Clicking a card opens its detail page.
- **Category** filter loaded from `GET /products/categories`. A category is selected with radio buttons, and "All categories" is the default.
- **Price range** filter with min and max inputs. The list updates 400 ms after you stop typing, and an impossible range (min greater than max) shows an error.
- **Brand** filter (multi-select). The brand list is built from the fetched products and shows a count for each brand.
- **Search** box (an extra) that matches product titles and brands.
- All filters work together. Changing any filter takes you back to page 1.
- Loading skeletons, an error message with a **Try again** button, an empty state with **Clear all filters**, and a "Showing 13–24 of 40 products" summary.

**Product detail page (`/product/:id`)**
- Image gallery with thumbnails, title, price with discount, rating, brand, category, availability, description and reviews.
- **Back to products** returns to the listing with every filter, the page number and the scroll position restored.
- An unknown id shows "Product not found". Other errors show a **Try again** button.

**Quality**
- Accessible markup: `fieldset`/`legend` filter groups, labelled inputs, `aria-current` on the current page, `aria-live` result counts, `role="alert"` errors, keyboard-friendly cards and visible focus styles.
- Responsive from 360 px phones (where filters fold behind a "Show filters" button) up to wide desktops.
- 16 automated tests (Vitest + React Testing Library) that cover the filter logic, pagination, combined filters, the page reset, error and retry, and the Back navigation.

## Setup

Requirements: Node.js 20 or newer, and npm.

```bash
npm install
npm run dev        # starts the dev server on http://localhost:5173
```

Other scripts:

| Command | What it does |
|---|---|
| `npm test` | Runs the test suite once |
| `npm run lint` | Runs oxlint |
| `npm run build` | Creates the production build in `dist/` |
| `npm run preview` | Serves the production build locally |

No environment variables are needed, because the API is public.

**Deploying to Vercel:** import the repository, keep the detected Vite settings (build `npm run build`, output `dist`), and deploy. `vercel.json` rewrites every path to `index.html`, so links like `/product/5` work on refresh.

## Assumptions

1. **Prices are in US dollars**, as DummyJSON returns them.
2. **One category at a time.** The API filters by a single category (`/products/category/{slug}`), so the category filter uses radio buttons. Brands support multi-select.
3. **Brand options come from the current category.** Changing the category clears the selected brands, because a brand from the old category may not exist in the new one. Price and search are kept.
4. **The listed brands do not narrow when price or search change.** They only depend on the category, so a user can always see and pick every brand of that category.
5. **Products without a brand** (for example most groceries) still appear when no brand is selected, and are hidden once a brand is chosen.
6. **"Update immediately" for price** means updating as the user types, with a short 400 ms debounce, so no Apply button is needed.
7. Header items in the mock-up (cart, account) are out of scope.

## Architectural decisions

### 1. Fetch the category once, then filter and paginate in the browser
DummyJSON can filter by category on the server but **not by price or brand**. If we paged on the server (`limit`/`skip`) and then filtered price and brand in the browser, page 1 might show 3 products and page 2 might show 11, and the total would be wrong.

So the app makes one request for the chosen category (or all products) with `limit=0` and asks only for the fields the cards need (`select=title,price,rating,thumbnail,brand,category`). The whole catalogue is about 200 rows, so this stays a small response. Brand, price and search filtering and the 12-per-page pagination then run in the browser. They are pure functions (`src/utils`), which keeps them simple and easy to test.

If the catalogue grew to thousands of items, this would move to a backend that supports all filters with server-side pagination (see Improvements).

### 2. The URL is the single source of truth for filters
Every filter is stored in the query string, for example `/?category=smartphones&brand=Apple&brand=Samsung&min=100&max=900&page=2`. `useFilters` reads it with React Router's `useSearchParams` and exposes small setters (`setCategory`, `toggleBrand`, `setPriceRange` and so on).

- Filters **survive Back, refresh and shared links** with no extra code. This is how the "filters remain applied when navigating back" requirement is met.
- Filter changes use `replace`, so they do not fill the browser history, and the browser Back button leaves the listing page instead of undoing filters one by one.
- Every filter setter removes `page`, so a filter change always returns to page 1.

No global store (Redux or Zustand) is needed, because the URL already holds the shared state and the fetched data is cached by URL.

### 3. A small `useFetch` hook instead of a data library
`useFetch(url)` returns `loading`, `error` (with a `notFound` flag) or `success`, plus a `retry()` function. It:
- cancels the old request when the URL changes (`AbortController`), so a slow response can never overwrite a newer one;
- caches responses by URL in memory, so returning from a detail page or re-selecting a category is instant (this also lets the browser restore the scroll position);
- tells a 404 apart from other errors, so the detail page can show "Product not found".

The brief prefers hooks such as `useState` and `useEffect`, so I kept this in about 60 lines rather than adding TanStack Query.

### 4. Back button behaviour
Product cards pass `state={{ fromListing: true }}` to the link. The detail page's Back button calls `navigate(-1)` when that flag is present, which restores the exact listing URL and scroll position. When the page was opened directly (a shared link or a new tab), it goes to `/` instead of leaving the site.

### 5. Folder structure

```
src/
  api/products.js          URL builders, fetchJson, ApiError
  hooks/                   useFetch, useProductsApi (useProducts/useCategories/useProduct),
                           useFilters (URL state), useDebouncedCallback
  utils/                   filterProducts, pagination, format (pure functions, unit-tested)
  components/              ProductCard, ProductGrid (+ skeleton), Pagination, StarRating,
                           ErrorMessage, Header
  components/filters/      FilterSidebar, CategoryFilter, PriceFilter, BrandFilter, SearchFilter
  pages/                   ProductListingPage, ProductDetailPage, NotFoundPage
  App.jsx                  layout + routes;  main.jsx: BrowserRouter + render
```

Components get data through props and report changes through callbacks. Only the pages know about the URL and the API.

## Improvements with more time

- **Server-side filtering for large catalogues:** a small backend (or BFF) that supports price and brand filters with server pagination, plus `@tanstack/react-query` for caching, background refresh and request deduplication.
- **TypeScript:** the brief asked for JavaScript, so the app is plain JS; on a larger codebase I would add TypeScript for typed props and API responses.
- **Sorting** (price, rating) and a **rating filter**, both stored in the URL like the other filters.
- **Price slider** with min and max limits taken from the loaded products.
- **Virtualised or infinite scroll** as an alternative to pagination on mobile.
- **More tests:** end-to-end tests with Playwright (including real Back and scroll behaviour), and automated accessibility checks with axe.
- **Image handling:** `srcset`/responsive images, blur placeholders, and a zoom view on the detail page.
- **Error monitoring** (for example Sentry) and an error boundary around each page.
- **Prefetching** product details when a card is hovered, so the detail page opens instantly.
