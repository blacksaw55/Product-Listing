import { useState } from 'react'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'
import { FilterSection } from './FilterSection'

const toNumber = (text) => (text.trim() === '' ? null : Number(text))
const toText = (value) => (value === null ? '' : String(value))

/**
 * The inputs keep what the user is typing in local state, and the list updates
 * 400 ms after they stop typing (debounce), so it feels immediate without a re-filter per keystroke.
 */
export function PriceFilter({ minPrice, maxPrice, onChange }) {
  const [minText, setMinText] = useState(toText(minPrice))
  const [maxText, setMaxText] = useState(toText(maxPrice))

  // If the URL changes from outside (for example "Clear all filters"), show the new values.
  // Comparing as numbers keeps "150." from being rewritten to "150" while typing.
  const [synced, setSynced] = useState({ minPrice, maxPrice })
  if (synced.minPrice !== minPrice || synced.maxPrice !== maxPrice) {
    setSynced({ minPrice, maxPrice })
    if (toNumber(minText) !== minPrice) setMinText(toText(minPrice))
    if (toNumber(maxText) !== maxPrice) setMaxText(toText(maxPrice))
  }

  const min = toNumber(minText)
  const max = toNumber(maxText)
  const invalid = min !== null && max !== null && min > max

  const commit = useDebouncedCallback(onChange, 400)

  function handleChange(nextMinText, nextMaxText) {
    setMinText(nextMinText)
    setMaxText(nextMaxText)
    const nextMin = toNumber(nextMinText)
    const nextMax = toNumber(nextMaxText)
    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      commit.cancel() // do not apply an impossible range
      return
    }
    commit(nextMin, nextMax)
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-2 focus:outline-blue-600/30 aria-invalid:border-red-500'

  return (
    <FilterSection title="Price range ($)">
      <div className="flex items-center gap-2">
        <label className="flex-1">
          <span className="sr-only">Minimum price</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Min"
            value={minText}
            aria-invalid={invalid}
            aria-describedby={invalid ? 'price-error' : undefined}
            onChange={(e) => handleChange(e.target.value, maxText)}
            className={inputClass}
          />
        </label>
        <span aria-hidden="true" className="text-slate-400">
          –
        </span>
        <label className="flex-1">
          <span className="sr-only">Maximum price</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Max"
            value={maxText}
            aria-invalid={invalid}
            aria-describedby={invalid ? 'price-error' : undefined}
            onChange={(e) => handleChange(minText, e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      {invalid && (
        <p id="price-error" role="alert" className="mt-2 text-sm text-red-700">
          Min price cannot be more than max price.
        </p>
      )}
    </FilterSection>
  )
}
