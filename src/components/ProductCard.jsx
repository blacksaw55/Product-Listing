import { Link } from 'react-router'
import { formatPrice } from '../utils/format'
import { StarRating } from './StarRating'

export function ProductCard({ product }) {
  return (
    <li>
      {/* The whole card is one link, so it works with Tab + Enter as well as a mouse click.
          `state` tells the detail page we came from the listing, so its Back button can use history. */}
      <Link
        to={`/product/${product.id}`}
        state={{ fromListing: true }}
        className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <div className="mb-3 flex aspect-square items-center justify-center border-b border-slate-100 pb-3">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            width={200}
            height={200}
            className="h-full w-full object-contain transition group-hover:scale-105"
          />
        </div>
        {product.brand && <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{product.brand}</p>}
        <h2 className="mt-0.5 line-clamp-2 font-medium text-slate-900">{product.title}</h2>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-3">
          <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
          <StarRating rating={product.rating} />
        </div>
      </Link>
    </li>
  )
}
