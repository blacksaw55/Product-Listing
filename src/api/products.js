/*
 * DummyJSON product fields this app uses:
 *   list:   { id, title, price, rating, thumbnail, category, brand? }   (brand is missing for some products)
 *   detail: the list fields + { description, discountPercentage, stock, availabilityStatus, images[], reviews[] }
 */

export const API_BASE = 'https://dummyjson.com'

/** Only the fields the product cards and filters use, to keep the response small. */
const LIST_FIELDS = 'title,price,rating,thumbnail,brand,category'

/** Thrown when the server answers with a non-2xx status, so the UI can tell 404 from other errors. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function fetchJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`)
  }
  return await response.json()
}

export const categoriesUrl = () => `${API_BASE}/products/categories`

/**
 * `limit=0` asks DummyJSON for every matching product in one call.
 * The whole catalogue is about 200 small rows, so filtering and paging on the client
 * is fast and keeps the combined filters correct (see README, "Architectural decisions").
 */
export const productsUrl = (category) =>
  category
    ? `${API_BASE}/products/category/${encodeURIComponent(category)}?limit=0&select=${LIST_FIELDS}`
    : `${API_BASE}/products?limit=0&select=${LIST_FIELDS}`

export const productUrl = (id) => `${API_BASE}/products/${encodeURIComponent(id)}`
