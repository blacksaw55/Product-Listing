import { useCategories } from '../../hooks/useProductsApi'
import { FilterSection } from './FilterSection'

/** One category at a time (radio buttons), because the API filters by a single category. */
export function CategoryFilter({ selected, onChange }) {
  const categories = useCategories()

  return (
    <FilterSection title="Category">
      {categories.status === 'loading' && <p className="text-sm text-slate-500">Loading categories…</p>}

      {categories.status === 'error' && (
        <p className="text-sm text-red-700">
          Could not load categories.{' '}
          <button type="button" onClick={categories.retry} className="font-medium underline">
            Retry
          </button>
        </p>
      )}

      {categories.status === 'success' && (
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          <RadioOption label="All categories" checked={selected === null} onSelect={() => onChange(null)} />
          {categories.data.map((category) => (
            <RadioOption
              key={category.slug}
              label={category.name}
              checked={selected === category.slug}
              onSelect={() => onChange(category.slug)}
            />
          ))}
        </div>
      )}
    </FilterSection>
  )
}

function RadioOption({ label, checked, onSelect }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-slate-50">
      <input type="radio" name="category" checked={checked} onChange={onSelect} className="size-4 accent-blue-600" />
      {label}
    </label>
  )
}
