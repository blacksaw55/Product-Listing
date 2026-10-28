/** Unique brands of the given products, A-Z, with how many products each has. Products without a brand are skipped. */
export function getBrandOptions(products) {
  const counts = new Map()
  for (const product of products) {
    if (!product.brand) continue
    counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1)
  }
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Applies brand, price and search together (AND). Category is already applied
 * by the API call, so it is not repeated here.
 */
export function filterProducts(products, filters) {
  const query = filters.search.trim().toLowerCase()

  return products.filter((product) => {
    if (filters.brands.length > 0 && !(product.brand && filters.brands.includes(product.brand))) return false
    if (filters.minPrice !== null && product.price < filters.minPrice) return false
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false
    if (query && !product.title.toLowerCase().includes(query) && !product.brand?.toLowerCase().includes(query)) {
      return false
    }
    return true
  })
}
