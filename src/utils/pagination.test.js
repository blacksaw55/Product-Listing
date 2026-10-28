import { describe, expect, it } from 'vitest'
import { getPageNumbers, paginate } from './pagination'

const items = Array.from({ length: 30 }, (_, i) => i + 1)

describe('paginate', () => {
  it('returns the requested page and its range', () => {
    const page = paginate(items, 2, 12)
    expect(page.items[0]).toBe(13)
    expect(page).toMatchObject({ page: 2, totalPages: 3, from: 13, to: 24 })
  })

  it('clamps a page number that is too large or too small', () => {
    expect(paginate(items, 99, 12).page).toBe(3)
    expect(paginate(items, 0, 12).page).toBe(1)
  })

  it('handles an empty list', () => {
    expect(paginate([], 1, 12)).toMatchObject({ items: [], page: 1, totalPages: 1, from: 0, to: 0 })
  })
})

describe('getPageNumbers', () => {
  it('lists every page when there are 7 or fewer', () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('shortens long ranges with gaps', () => {
    expect(getPageNumbers(7, 17)).toEqual([1, '…', 6, 7, 8, '…', 17])
    expect(getPageNumbers(1, 17)).toEqual([1, 2, '…', 17])
    expect(getPageNumbers(17, 17)).toEqual([1, '…', 16, 17])
  })
})
