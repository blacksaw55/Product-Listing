import { getPageNumbers } from '../utils/pagination'

const buttonClass =
  'min-w-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button type="button" className={buttonClass} disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <span aria-hidden="true">←</span> Previous
      </button>

      {getPageNumbers(page, totalPages).map((item, index) =>
        item === '…' ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={
              item === page ? `${buttonClass} border-blue-600 bg-blue-600 text-white hover:bg-blue-700` : buttonClass
            }
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={buttonClass}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next <span aria-hidden="true">→</span>
      </button>
    </nav>
  )
}
