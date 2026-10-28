import { useMemo } from 'react'
import { ErrorMessage } from '../components/ErrorMessage'
import { FilterSidebar } from '../components/filters/FilterSidebar'
import { Pagination } from '../components/Pagination'
import { ProductGrid, ProductGridSkeleton } from '../components/ProductGrid'
import { useFilters } from '../hooks/useFilters'
import { useCategories, useProducts } from '../hooks/useProductsApi'
import { filterProducts, getBrandOptions } from '../utils/filterProducts'
import { formatCategory } from '../utils/format'
import { paginate } from '../utils/pagination'

const NO_PRODUCTS = []

export function ProductListingPage() {
  const { filters, setCategory, toggleBrand, setPriceRange, setSearch, setPage, clearAll } = useFilters()

  // Step 1 (API): every product of the chosen category, or of all categories.
  const products = useProducts(filters.category)
  const categories = useCategories()
  const loaded = products.status === 'success' ? products.data.products : NO_PRODUCTS

  // Step 2 (browser): brand, price and search on top of the category, then one page of the result.
  // These are derived values, recalculated from the URL and the loaded data; nothing is copied into state.
  const brandOptions = useMemo(() => getBrandOptions(loaded), [loaded])
  const filtered = useMemo(() => filterProducts(loaded, filters), [loaded, filters])
  const page = paginate(filtered, filters.page)

  const hasActiveFilters =
    filters.category !== null ||
    filters.brands.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.search.trim() !== ''

  const categoryName =
    filters.category === null
      ? 'All products'
      : (categories.status === 'success' && categories.data.find((c) => c.slug === filters.category)?.name) ||
        formatCategory(filters.category)

  function goToPage(next) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[17rem_1fr]">
      <title>{`${categoryName} | ShopLite`}</title>

      <FilterSidebar
        filters={filters}
        brandOptions={brandOptions}
        brandsLoading={products.status === 'loading'}
        hasActiveFilters={hasActiveFilters}
        onCategoryChange={setCategory}
        onPriceChange={setPriceRange}
        onBrandToggle={toggleBrand}
        onSearchChange={setSearch}
        onClearAll={clearAll}
      />

      <section aria-labelledby="results-heading" className="min-w-0">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h1 id="results-heading" className="text-2xl font-bold">
            {categoryName}
          </h1>
          {/* aria-live: screen readers announce the new count after each filter change. */}
          <p aria-live="polite" className="text-sm text-slate-600">
            {products.status === 'success' &&
              (filtered.length === 0
                ? 'No products found'
                : `Showing ${page.from}–${page.to} of ${filtered.length} products`)}
          </p>
        </div>

        {products.status === 'loading' && <ProductGridSkeleton />}

        {products.status === 'error' && (
          <ErrorMessage title="Could not load products" message={products.message} onRetry={products.retry} />
        )}

        {products.status === 'success' &&
          (filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-medium">No products match these filters.</p>
              <p className="mt-1 text-sm text-slate-500">Try a wider price range or fewer brands.</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <ProductGrid products={page.items} />
              <Pagination page={page.page} totalPages={page.totalPages} onPageChange={goToPage} />
            </>
          ))}
      </section>
    </div>
  )
}
