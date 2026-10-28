/**
 * Five grey stars with a yellow copy on top, clipped to the rating's width
 * (4.5 → 90%), so half stars come for free.
 */
export function StarRating({ rating, size = 'sm' }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100))
  const textSize = size === 'sm' ? 'text-sm' : 'text-lg'

  return (
    <span className={`inline-flex items-center gap-1 ${textSize}`}>
      {/* Screen readers hear the label instead of five star characters. */}
      <span
        role="img"
        aria-label={`Rated ${rating.toFixed(1)} out of 5`}
        className="relative inline-block leading-none"
      >
        <span aria-hidden="true" className="text-slate-300">
          ★★★★★
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden text-amber-400"
          style={{ width: `${percent}%` }}
        >
          ★★★★★
        </span>
      </span>
      <span aria-hidden="true" className="text-slate-500">
        ({rating.toFixed(1)})
      </span>
    </span>
  )
}
