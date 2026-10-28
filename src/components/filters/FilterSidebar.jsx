import { useState } from 'react'
import { BrandFilter } from './BrandFilter'
import { CategoryFilter } from './CategoryFilter'
import { PriceFilter } from './PriceFilter'
import { SearchFilter } from './SearchFilter'

export function FilterSidebar(props) {
  const { filters } = props
  // Phones only: the filter panel is folded away so products are visible first. Desktop always shows it.
  const [open, setOpen] = useState(false)

  return (
    <aside
      aria-label="Product filters"
      className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {props.hasActiveFilters && (
          <button
            type="button"
            onClick={props.onClearAll}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <SearchFilter value={filters.search} onChange={props.onSearchChange} />

      <button
        type="button"
        aria-expanded={open}
        aria-controls="filter-panel"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium lg:hidden"
      >
        {open ? 'Hide filters' : 'Show filters'}
      </button>

      <div id="filter-panel" className={open ? 'block' : 'hidden lg:block'}>
        <CategoryFilter selected={filters.category} onChange={props.onCategoryChange} />
        <PriceFilter minPrice={filters.minPrice} maxPrice={filters.maxPrice} onChange={props.onPriceChange} />
        <BrandFilter
          options={props.brandOptions}
          selected={filters.brands}
          onToggle={props.onBrandToggle}
          loading={props.brandsLoading}
        />
      </div>
    </aside>
  )
}
