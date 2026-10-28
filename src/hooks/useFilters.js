import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

function toPrice(value) {
  if (value === null || value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : null
}

/**
 * Every filter lives in the URL query string, for example
 *   /?category=smartphones&brand=Apple&brand=Samsung&min=100&max=900&page=2
 * so filters survive the Back button and a page refresh, and can be shared as a link.
 *
 * Returns { category, brands, minPrice, maxPrice, search, page }.
 * Values a user typed into the URL by hand are checked: a bad price becomes null, a bad page becomes 1.
 */
export function parseFilters(params) {
  const page = Number(params.get('page'))
  return {
    category: params.get('category') || null,
    brands: params.getAll('brand'),
    minPrice: toPrice(params.get('min')),
    maxPrice: toPrice(params.get('max')),
    search: params.get('q') ?? '',
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function useFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(params), [params])

  /**
   * Changes the query string. A filter change also removes `page`,
   * which sends the user back to page 1 (a rule from the assessment).
   * `replace: true` stops every filter click from adding a browser-history entry,
   * so the browser's Back button leaves the listing page instead of undoing filters.
   */
  const update = useCallback(
    (change, resetPage = true) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          change(next)
          if (resetPage) next.delete('page')
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const setCategory = useCallback(
    (category) =>
      update((p) => {
        if (category) p.set('category', category)
        else p.delete('category')
        // Brands come from the chosen category's products, so earlier picks no longer apply.
        p.delete('brand')
      }),
    [update],
  )

  const toggleBrand = useCallback(
    (brand) =>
      update((p) => {
        const brands = p.getAll('brand')
        const next = brands.includes(brand) ? brands.filter((b) => b !== brand) : [...brands, brand]
        p.delete('brand')
        next.forEach((b) => p.append('brand', b))
      }),
    [update],
  )

  const setPriceRange = useCallback(
    (min, max) =>
      update((p) => {
        if (min === null) p.delete('min')
        else p.set('min', String(min))
        if (max === null) p.delete('max')
        else p.set('max', String(max))
      }),
    [update],
  )

  const setSearch = useCallback(
    (search) =>
      update((p) => {
        if (search.trim()) p.set('q', search)
        else p.delete('q')
      }),
    [update],
  )

  const setPage = useCallback(
    (page) =>
      update((p) => {
        if (page <= 1) p.delete('page')
        else p.set('page', String(page))
      }, false),
    [update],
  )

  const clearAll = useCallback(() => setParams({}, { replace: true }), [setParams])

  return { filters, setCategory, toggleBrand, setPriceRange, setSearch, setPage, clearAll }
}
