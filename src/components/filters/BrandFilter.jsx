import { FilterSection } from './FilterSection'

/** Multi-select: checking several brands shows products of any of them. */
export function BrandFilter({ options, selected, onToggle, loading }) {
  return (
    <FilterSection title="Brand">
      {loading ? (
        <p className="text-sm text-slate-500">Loading brands…</p>
      ) : options.length === 0 ? (
        <p className="text-sm text-slate-500">No brands listed for these products.</p>
      ) : (
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {options.map((brand) => (
            <label
              key={brand.name}
              className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(brand.name)}
                onChange={() => onToggle(brand.name)}
                className="size-4 accent-blue-600"
              />
              <span className="flex-1">{brand.name}</span>
              <span className="text-xs text-slate-400">{brand.count}</span>
            </label>
          ))}
        </div>
      )}
    </FilterSection>
  )
}
