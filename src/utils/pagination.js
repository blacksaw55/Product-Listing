export const PAGE_SIZE = 12

export function paginate(items, requestedPage, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const page = Math.min(Math.max(1, requestedPage), totalPages)
  const start = (page - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)
  return {
    items: pageItems,
    page,
    totalPages,
    from: pageItems.length ? start + 1 : 0,
    to: start + pageItems.length,
  }
}

/**
 * Page numbers to show as buttons. Long ranges are shortened with "…":
 * current = 7 of 17  →  1 … 6 7 8 … 17
 */
export function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('…')
  for (let p = start; p <= end; p++) pages.push(p)
  if (end < total - 1) pages.push('…')
  pages.push(total)
  return pages
}
