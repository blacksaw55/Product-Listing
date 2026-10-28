import { ProductCard } from './ProductCard'

const gridClass = 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4'

export function ProductGrid({ products }) {
  return (
    <ul className={gridClass}>
      {products.map((product) => (
        // `key` lets React match each card to its product between renders.
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  )
}

/** Grey placeholder cards shown while products load, so the layout does not jump. */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div role="status" aria-label="Loading products">
      <ul className={gridClass} aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 aspect-square rounded-lg bg-slate-200" />
            <div className="mb-2 h-3 w-1/3 rounded bg-slate-200" />
            <div className="mb-4 h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-5 w-1/2 rounded bg-slate-200" />
          </li>
        ))}
      </ul>
    </div>
  )
}
