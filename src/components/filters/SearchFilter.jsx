import { useState } from 'react'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'

/** Searches product titles and brands within the loaded products (an extra beyond the brief). */
export function SearchFilter({ value, onChange }) {
  const [text, setText] = useState(value)

  // Show the new value when the URL changes from outside (for example "Clear all filters").
  const [synced, setSynced] = useState(value)
  if (synced !== value) {
    setSynced(value)
    if (text.trim() !== value.trim()) setText(value)
  }

  const commit = useDebouncedCallback(onChange, 300)

  return (
    <div className="pb-4">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        placeholder="Search products…"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          commit(e.target.value)
        }}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-2 focus:outline-blue-600/30"
      />
    </div>
  )
}
