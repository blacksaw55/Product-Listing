const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/** 9.99 → "$9.99" (DummyJSON prices are in US dollars). */
export function formatPrice(price) {
  return priceFormatter.format(price)
}

/** "home-decoration" → "Home Decoration" (the detail API returns the category slug). */
export function formatCategory(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
