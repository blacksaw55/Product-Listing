import { describe, expect, it } from 'vitest'
import { filterProducts, getBrandOptions } from './filterProducts'

const product = (id, title, price, brand) => ({
  id,
  title,
  price,
  brand,
  rating: 4,
  thumbnail: '',
  category: 'smartphones',
})

const products = [
  product(1, 'iPhone X', 899, 'Apple'),
  product(2, 'iPhone 6', 299, 'Apple'),
  product(3, 'Galaxy S8', 499, 'Samsung'),
  product(4, 'Oppo A57', 249, 'Oppo'),
  product(5, 'Plain Phone', 99),
]

const noFilters = { brands: [], minPrice: null, maxPrice: null, search: '' }

describe('getBrandOptions', () => {
  it('returns unique brands A-Z with counts and skips products without a brand', () => {
    expect(getBrandOptions(products)).toEqual([
      { name: 'Apple', count: 2 },
      { name: 'Oppo', count: 1 },
      { name: 'Samsung', count: 1 },
    ])
  })
})

describe('filterProducts', () => {
  it('returns everything when no filter is set', () => {
    expect(filterProducts(products, noFilters)).toHaveLength(5)
  })

  it('keeps products of any selected brand', () => {
    const ids = filterProducts(products, { ...noFilters, brands: ['Apple', 'Oppo'] }).map((p) => p.id)
    expect(ids).toEqual([1, 2, 4])
  })

  it('applies min and max price inclusively', () => {
    const ids = filterProducts(products, { ...noFilters, minPrice: 249, maxPrice: 499 }).map((p) => p.id)
    expect(ids).toEqual([2, 3, 4])
  })

  it('combines brand, price and search (all must match)', () => {
    const ids = filterProducts(products, { brands: ['Apple'], minPrice: 500, maxPrice: null, search: 'iphone' }).map(
      (p) => p.id,
    )
    expect(ids).toEqual([1])
  })

  it('searches title and brand, ignoring case and surrounding spaces', () => {
    expect(filterProducts(products, { ...noFilters, search: '  GALAXY ' }).map((p) => p.id)).toEqual([3])
    expect(filterProducts(products, { ...noFilters, search: 'samsung' }).map((p) => p.id)).toEqual([3])
  })
})
